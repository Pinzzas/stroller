import Phaser from 'phaser';
import * as C from './config.js';
import { clampDeltaMs, advanceScroll, tileXPositions } from './logic/scroll.js';
import { changeSpeedLevel, speedForLevel } from './logic/speed.js';
import { initialLift, updateLift } from './logic/lift.js';
import {
  obstacleScreenX,
  obstacleIndexAt,
  extendPlan,
  obstacleRandom,
  visibleObstacleIndexes,
  obstacleIndexesReachingWheel,
  obstacleIndexesOverWheel,
  obstacleIndexesNear,
  checkPothole,
  curbDamage,
} from './logic/obstacles.js';
import { checkPigeons, checkDog } from './logic/threats.js';
import { sirenLoudness, inSirenPeak, calmSiren, checkSirenMiss, heardWarningFor } from './logic/siren.js';
import { obstacleKindForIndex } from './logic/intro.js';
import { initialChat, startChat, isChatting, updateChat, neighbourStops, streetSpeed } from './logic/chat.js';
import { stageFor, stageLabel, stageDamage, gapFor } from './logic/stages.js';
import { initialRun, updateRun, canRestart, endTimeText } from './logic/run.js';
import { applySleepDamage, recoverSleep, recoveryRateFor, canRecover } from './logic/sleep.js';
import { initialShush, useShush, updateShush, shushLabel } from './logic/shush.js';
import Hud from './Hud.js';
import TouchButtons from './TouchButtons.js';
import EndPanel from './EndPanel.js';
import ObstacleDrawing from './ObstacleDrawing.js';

const SPEEDS = { slow: C.SPEED_SLOW, normal: C.SPEED_NORMAL, brisk: C.SPEED_BRISK };
const OBSTACLE_CHANCES = {
  crossing: C.CROSSING_CHANCE,
  pigeons: C.PIGEON_CHANCE,
  dog: C.DOG_CHANCE,
  neighbour: C.NEIGHBOUR_CHANCE,
  siren: C.SIREN_CHANCE,
};
const RECOVERY_RATES = {
  slow: C.SLEEP_RECOVERY_SLOW,
  normal: C.SLEEP_RECOVERY_NORMAL,
  brisk: C.SLEEP_RECOVERY_BRISK,
};
// Front wheel centre x (worked out from the stroller values)
const FRONT_WHEEL_X = C.STROLLER_X + C.STROLLER_WIDTH - C.STROLLER_WHEEL_INSET - C.STROLLER_WHEEL_SIZE / 2;
// The stroller tilts around the back wheel
const PIVOT_X = C.STROLLER_X + C.STROLLER_WHEEL_INSET + C.STROLLER_WHEEL_SIZE / 2;
const PIVOT_Y = C.STROLLER_GROUND_Y - C.STROLLER_WHEEL_SIZE / 2;

// Set by Vite at build time (see vite.config.js).
const BUILD_LABEL = typeof __BUILD_LABEL__ === 'string' ? __BUILD_LABEL__ : 'build dev';

export default class StreetScene extends Phaser.Scene {
  constructor() {
    super('StreetScene');
  }

  create() {
    this.scroll = 0;
    this.speedLevel = C.SPEED_START_LEVEL;
    this.lift = initialLift();
    this.sleep = C.SLEEP_START;
    this.msSinceHit = C.SLEEP_RECOVERY_DELAY_MS; // no hit yet: refilling allowed
    this.flashMsLeft = 0;
    this.streetSeed = Math.floor(Math.random() * 2 ** 32); // fixes the order of potholes and curbs
    this.lastJoltedPothole = -1; // last pothole that already cost sleep
    this.lastFlappedPigeons = -1; // last flock that already flew off
    this.msSinceFlap = 0; // time since it flew off (drawing only)
    this.lastBarkedDog = -1; // last dog that already barked
    this.msSinceBark = 0; // time since it barked (drawing only)
    this.lastSettledSiren = -1; // last siren that was calmed or missed
    this.sirenMissMsLeft = 0; // time left to show NEE-NAW!
    this.chat = initialChat(); // the neighbour's chat (msLeft 0 = not chatting)
    this.chatIndex = -1; // which neighbour we are chatting with (drawing only)
    this.run = initialRun();
    this.plan = []; // obstacle left edges along the street, grows as you walk
    this.isRestarting = false;
    this.shush = initialShush(C.SHUSH_MAX_CHARGES);
    this.shushQueued = false; // a Shush press waiting for the next frame
    this.shushTextMsLeft = 0;

    this.street = this.add.graphics(); // houses, pavement and obstacles, redrawn every frame
    this.warningIcon = this.add.graphics(); // the woof? box, fixed on screen
    this.stroller = this.add.graphics().setPosition(PIVOT_X, PIVOT_Y);
    this.hud = new Hud(this);
    this.obstacleArt = new ObstacleDrawing(this);
    this.touch = new TouchButtons(
      this,
      () => this.changeSpeed(-1),
      () => this.changeSpeed(1),
      () => this.queueShush()
    );

    // "Shhh!" above the stroller body: centred on it, bottom edge a gap above its top.
    const bodyTopY = C.STROLLER_GROUND_Y - C.STROLLER_WHEEL_SIZE - C.STROLLER_HEIGHT;
    this.shushWord = this.add
      .text(C.STROLLER_X + C.STROLLER_WIDTH / 2, bodyTopY - C.SHUSH_TEXT_GAP, 'Shhh!', {
        fontFamily: 'sans-serif',
        fontSize: `${C.SHUSH_TEXT_FONT_SIZE}px`,
        color: '#' + C.COLOR_HUD_TEXT.toString(16).padStart(6, '0'),
      })
      .setOrigin(0.5, 1)
      .setVisible(false);

    const hudTextColor = '#' + C.COLOR_HUD_TEXT.toString(16).padStart(6, '0');
    this.warningText = this.add
      .text(C.GAME_WIDTH - C.HUD_MARGIN - C.WARNING_ICON_WIDTH / 2, C.WARNING_ICON_Y + C.WARNING_ICON_HEIGHT / 2, C.DOG_WARNING_TEXT, {
        fontFamily: 'sans-serif',
        fontSize: `${C.HUD_FONT_SIZE}px`,
        color: hudTextColor,
      })
      .setOrigin(0.5)
      .setVisible(false);

    this.sirenMissWord = this.add
      .text(C.GAME_WIDTH - C.HUD_MARGIN - C.WARNING_ICON_WIDTH / 2, C.WARNING_ICON_Y + C.WARNING_ICON_HEIGHT / 2, C.SIREN_MISS_TEXT, {
        fontFamily: 'sans-serif',
        fontSize: `${C.DOG_TEXT_FONT_SIZE}px`,
        color: hudTextColor,
      })
      .setOrigin(0.5)
      .setVisible(false);

    this.endPanel = new EndPanel(this, () => this.restart());

    const keys = this.input.keyboard.addKeys('UP,DOWN,SPACE,ENTER,S');
    this.input.keyboard.addCapture('UP,DOWN,SPACE'); // keys must not scroll the page
    this.keys = keys;
    // One step per press (no key repeat). Named so they can be removed on shutdown.
    const onUp = () => this.changeSpeed(1);
    const onDown = () => this.changeSpeed(-1);
    const onEnter = () => this.restart();
    keys.UP.on('down', onUp);
    keys.DOWN.on('down', onDown);
    keys.ENTER.on('down', onEnter);
    const onShush = () => this.queueShush();
    keys.S.on('down', onShush);

    // Leaving the tab or app counts as letting go.
    this.game.events.on('blur', this.letGo, this);
    this.game.events.on('hidden', this.letGo, this);

    // Remove everything added above, so restarts don't pile up listeners.
    this.events.once('shutdown', () => {
      this.game.events.off('blur', this.letGo, this);
      this.game.events.off('hidden', this.letGo, this);
      keys.UP.off('down', onUp);
      keys.DOWN.off('down', onDown);
      keys.ENTER.off('down', onEnter);
      keys.S.off('down', onShush);
      this.touch.destroy();
    });

    this.add
      .text(C.GAME_WIDTH - C.BUILD_LABEL_MARGIN_X, C.GAME_HEIGHT - C.BUILD_LABEL_MARGIN_Y, BUILD_LABEL, {
        fontFamily: 'sans-serif',
        fontSize: `${C.BUILD_LABEL_FONT_SIZE}px`,
        color: '#' + C.COLOR_BUILD_LABEL.toString(16).padStart(6, '0'),
      })
      .setOrigin(1, 1);
  }

  changeSpeed(step) {
    if (this.run.phase === 'ended') return; // controls do nothing on the end screen
    this.speedLevel = changeSpeedLevel(this.speedLevel, step);
  }

  // Remember a Shush press; it is used at the start of the next frame.
  queueShush() {
    if (this.run.phase === 'ended') return; // does nothing on the end screen
    this.shushQueued = true;
  }

  // Start a fresh walk (only on the end screen, after the wait).
  restart() {
    if (this.isRestarting || !canRestart(this.run, C.RUN_RESTART_DELAY_MS)) return;
    this.isRestarting = true;
    this.scene.restart();
  }

  typeOf(index) {
    return obstacleKindForIndex(index, obstacleRandom(this.streetSeed, index), OBSTACLE_CHANCES, C.INTRO_ORDER, C.INTRO_EVERY);
  }

  letGo() {
    this.input.keyboard.resetKeys();
    this.touch.release();
  }

  update(time, deltaMs) {
    const step = clampDeltaMs(deltaMs, C.MAX_FRAME_DELTA_MS);

    if (this.run.phase === 'ended') {
      this.run = updateRun(this.run, this.sleep, step);
      if (canRestart(this.run, C.RUN_RESTART_DELAY_MS)) this.endPanel.showButton();
      return;
    }

    if (this.shushQueued) {
      this.shushQueued = false;
      const rules = { restore: C.SHUSH_RESTORE, maxSleep: C.SLEEP_MAX, cooldownMs: C.SHUSH_COOLDOWN_MS };
      const result = useShush(this.shush, this.sleep, rules);
      this.shush = result.state;
      this.sleep = result.sleep;
      if (result.used) this.shushTextMsLeft = C.SHUSH_TEXT_MS;
      this.calmSirenIfInPeak(result.used);
    }
    this.shush = updateShush(this.shush, step, C.SHUSH_MAX_CHARGES);
    this.shushTextMsLeft = Math.max(0, this.shushTextMsLeft - step);
    this.shushWord.setVisible(this.shushTextMsLeft > 0);

    const isHeld = this.keys.SPACE.isDown || this.touch.isLiftHeld();
    this.lift = updateLift(this.lift, isHeld, step, C.LIFT_MAX_HOLD_MS);

    // The stage comes from the time asleep; it sets the gap for obstacles planned from now on.
    const stage = stageFor(this.run.elapsedMs, C.SLEEP_STAGE_MS);
    const gaps = { light: C.OBSTACLE_GAP_LIGHT, deep: C.OBSTACLE_GAP_DEEP, dreamy: C.OBSTACLE_GAP_DREAMY };
    const planUpTo = this.scroll + FRONT_WHEEL_X + C.OBSTACLE_PLAN_AHEAD;
    this.plan = extendPlan(this.plan, planUpTo, C.OBSTACLE_FIRST_X, gapFor(stage, gaps));

    // Street speed comes from the chat state at the start of the frame; then the chat drains sleep.
    const levelSpeed = speedForLevel(this.speedLevel, SPEEDS);
    const wasChatting = isChatting(this.chat);
    const moveSpeed = streetSpeed(levelSpeed, this.chat);
    const chatResult = updateChat(this.chat, step, C.NEIGHBOUR_DRAIN_PER_SEC);
    this.chat = chatResult.state;
    this.sleep = applySleepDamage(this.sleep, stageDamage(chatResult.drain, stage, C.SLEEP_STAGE_DAMAGE_CUT), C.SLEEP_MAX);

    const prevScroll = this.scroll;
    this.scroll = advanceScroll(this.scroll, moveSpeed, step);

    this.msSinceHit += step;
    if (wasChatting) this.msSinceHit = 0; // no refill during a chat; the wait starts when it ends
    this.msSinceFlap += step;
    this.msSinceBark += step;
    this.flashMsLeft = Math.max(0, this.flashMsLeft - step);
    let damage = 0;
    const potholes = obstacleIndexesOverWheel(this.plan, prevScroll, this.scroll, FRONT_WHEEL_X, C.POTHOLE_WIDTH);
    for (const k of potholes) {
      if (this.typeOf(k) !== 'pothole') continue;
      const result = checkPothole(k, this.lift.isLifted, this.lastJoltedPothole, C.SLEEP_JOLT_SMALL);
      this.lastJoltedPothole = result.lastJoltedIndex;
      damage += result.damage;
    }
    const curbRules = { damage: C.SLEEP_JOLT_BIG, maxSafeSpeed: C.CURB_MAX_SAFE_SPEED };
    const currentSpeed = levelSpeed;
    // Down-curbs sit at the crossing's start, up-curbs one crossing-width later.
    const curbOffsets = [0, C.CROSSING_WIDTH];
    for (const offset of curbOffsets) {
      const reached = obstacleIndexesReachingWheel(this.plan, prevScroll, this.scroll, FRONT_WHEEL_X, offset);
      for (const k of reached) {
        if (this.typeOf(k) !== 'crossing') continue;
        damage += curbDamage(this.lift.isLifted, currentSpeed, curbRules);
      }
    }
    // Pigeons fly off if the front wheel passes them faster than slow.
    const pigeonRules = { damage: C.SLEEP_NOISE_SMALL, maxSafeSpeed: C.PIGEON_MAX_SAFE_SPEED };
    const flocks = obstacleIndexesOverWheel(this.plan, prevScroll, this.scroll, FRONT_WHEEL_X, C.PIGEON_WIDTH);
    for (const k of flocks) {
      if (this.typeOf(k) !== 'pigeons') continue;
      const result = checkPigeons(k, currentSpeed, this.lastFlappedPigeons, pigeonRules);
      if (result.damage > 0) this.msSinceFlap = 0;
      this.lastFlappedPigeons = result.lastFlappedIndex;
      damage += result.damage;
    }
    // The dog barks if the front wheel passes the fence slower than brisk.
    const dogRules = { damage: C.SLEEP_NOISE_LOUD, minSafeSpeed: C.DOG_MIN_SAFE_SPEED };
    const fences = obstacleIndexesOverWheel(this.plan, prevScroll, this.scroll, FRONT_WHEEL_X, C.DOG_FENCE_WIDTH);
    for (const k of fences) {
      if (this.typeOf(k) !== 'dog') continue;
      const result = checkDog(k, currentSpeed, this.lastBarkedDog, dogRules);
      if (result.damage > 0) this.msSinceBark = 0;
      this.lastBarkedDog = result.lastBarkedIndex;
      damage += result.damage;
    }
    // The neighbour stops you if you reach them slower than brisk.
    const met = obstacleIndexesReachingWheel(this.plan, prevScroll, this.scroll, FRONT_WHEEL_X, 0);
    for (const k of met) {
      if (this.typeOf(k) !== 'neighbour') continue;
      if (neighbourStops(currentSpeed, C.NEIGHBOUR_MIN_SAFE_SPEED)) {
        this.chat = startChat(C.NEIGHBOUR_CHAT_MS);
        this.chatIndex = k;
      }
    }
    // A siren that is not calmed by the end of its peak is loud.
    const sirenHit = stageDamage(C.SLEEP_NOISE_LOUD, stage, C.SLEEP_STAGE_DAMAGE_CUT);
    const sirenEnds = obstacleIndexesReachingWheel(this.plan, prevScroll, this.scroll, FRONT_WHEEL_X, C.SIREN_PEAK_WIDTH);
    let sirenDamage = 0;
    for (const k of sirenEnds) {
      if (this.typeOf(k) !== 'siren') continue;
      const result = checkSirenMiss(k, this.lastSettledSiren, sirenHit);
      this.lastSettledSiren = result.lastSettledIndex;
      if (result.damage > 0) this.sirenMissMsLeft = C.SIREN_SHOW_MS;
      sirenDamage += result.damage;
    }
    this.sirenMissMsLeft = Math.max(0, this.sirenMissMsLeft - step);
    if (damage > 0 || sirenDamage > 0) {
      damage = stageDamage(damage, stage, C.SLEEP_STAGE_DAMAGE_CUT) + sirenDamage;
      this.sleep = applySleepDamage(this.sleep, damage, C.SLEEP_MAX);
      this.flashMsLeft = C.HIT_FLASH_MS;
      this.msSinceHit = 0;
    }

    this.run = updateRun(this.run, this.sleep, step);
    if (this.run.phase === 'ended') {
      this.lift = initialLift(); // wheels down on the end screen
      this.chat = initialChat(); // no chat on the end screen
      this.shushWord.setVisible(false);
      this.hideWarning();
      this.hud.hideStage();
      this.endPanel.show(endTimeText(this.run.elapsedMs));
    } else if (canRecover(this.msSinceHit, C.SLEEP_RECOVERY_DELAY_MS)) {
      const rate = recoveryRateFor(this.speedLevel, RECOVERY_RATES);
      this.sleep = recoverSleep(this.sleep, rate, step, C.SLEEP_MAX);
    }

    this.drawStreet();
    this.drawStroller();
    if (this.run.phase !== 'ended') this.drawWarning();
    this.hud.draw(this.sleep, this.speedLevel, shushLabel(this.shush));
    if (this.run.phase !== 'ended') this.hud.drawStage(stageLabel(stage, C.SLEEP_STAGE_NAMES));
  }

  drawStreet() {
    const g = this.street;
    g.clear();

    // Houses
    const houseTop = C.PAVEMENT_TOP_Y - C.HOUSE_HEIGHT;
    for (const houseX of tileXPositions(this.scroll, C.HOUSE_SPACING, C.GAME_WIDTH)) {
      const x = Math.round(houseX); // whole pixels so edges don't shimmer
      g.fillStyle(C.COLOR_HOUSE);
      g.fillRect(x, houseTop, C.HOUSE_WIDTH, C.HOUSE_HEIGHT);
      g.fillStyle(C.COLOR_WINDOW);
      g.fillRect(
        x + (C.HOUSE_WIDTH - C.WINDOW_SIZE) / 2,
        houseTop + C.WINDOW_TOP_OFFSET,
        C.WINDOW_SIZE,
        C.WINDOW_SIZE
      );
    }

    // Pavement: one big strip, then a seam at the start of each slab
    g.fillStyle(C.COLOR_PAVEMENT);
    g.fillRect(0, C.PAVEMENT_TOP_Y, C.GAME_WIDTH, C.GAME_HEIGHT - C.PAVEMENT_TOP_Y);
    g.fillStyle(C.COLOR_PAVEMENT_SEAM);
    for (const slabX of tileXPositions(this.scroll, C.PAVEMENT_SLAB_WIDTH, C.GAME_WIDTH)) {
      const x = Math.round(slabX);
      g.fillRect(x, C.PAVEMENT_TOP_Y, C.PAVEMENT_SEAM_WIDTH, C.GAME_HEIGHT - C.PAVEMENT_TOP_Y);
    }

    // Potholes (cut into the pavement) and crossings (cover the pavement)
    const widest = Math.max(C.POTHOLE_WIDTH, C.CROSSING_WIDTH, C.PIGEON_WIDTH, C.DOG_FENCE_WIDTH);
    this.obstacleArt.startFrame();
    for (const k of visibleObstacleIndexes(this.plan, this.scroll, widest, C.GAME_WIDTH)) {
      const x = Math.round(obstacleScreenX(this.plan, k, this.scroll));
      this.obstacleArt.draw(g, this.typeOf(k), k, x);
    }
  }

  // A Shush that used a charge also calms a siren whose peak the front wheel is in.
  calmSirenIfInPeak(shushUsed) {
    const position = this.scroll + FRONT_WHEEL_X;
    const k = obstacleIndexAt(this.plan, position, C.SIREN_PEAK_WIDTH);
    if (k < 0 || this.typeOf(k) !== 'siren') return;
    const inPeak = inSirenPeak(position, this.plan[k], C.SIREN_PEAK_WIDTH);
    this.lastSettledSiren = calmSiren(k, inPeak, shushUsed, this.lastSettledSiren).lastSettledIndex;
  }

  // The warning icon (woof? or nee-naw), and the siren's loudness bar and NEE-NAW! after a miss.
  drawWarning() {
    const wheelPosition = this.scroll + FRONT_WHEEL_X;
    const indexes = obstacleIndexesNear(this.plan, wheelPosition, C.HEARD_WARNING_DISTANCE, C.DOG_FENCE_WIDTH);
    const kinds = indexes.map((k) => this.typeOf(k));
    const which = heardWarningFor(indexes, kinds, this.lastBarkedDog, this.lastSettledSiren);
    const iconX = C.GAME_WIDTH - C.HUD_MARGIN - C.WARNING_ICON_WIDTH;
    this.warningIcon.clear();
    this.warningText.setVisible(which !== null);
    this.sirenMissWord.setVisible(this.sirenMissMsLeft > 0 && which === null);
    if (which === null) return;
    let color = C.COLOR_WARNING_ICON;
    if (which === 'siren') {
      const left = this.plan[indexes[kinds.findIndex((kind, i) => kind === 'siren' && indexes[i] > this.lastSettledSiren)]];
      if (inSirenPeak(wheelPosition, left, C.SIREN_PEAK_WIDTH)) color = C.COLOR_SIREN_PEAK;
      const barY = C.WARNING_ICON_Y + C.WARNING_ICON_HEIGHT + C.SIREN_BAR_GAP;
      const loud = sirenLoudness(wheelPosition, left, C.HEARD_WARNING_DISTANCE);
      this.warningIcon.fillStyle(C.COLOR_METER_EMPTY);
      this.warningIcon.fillRect(iconX, barY, C.WARNING_ICON_WIDTH, C.SIREN_BAR_HEIGHT);
      this.warningIcon.fillStyle(C.COLOR_SIREN_BAR);
      this.warningIcon.fillRect(iconX, barY, C.WARNING_ICON_WIDTH * loud, C.SIREN_BAR_HEIGHT);
    }
    this.warningText.setText(which === 'siren' ? C.SIREN_WARNING_TEXT : C.DOG_WARNING_TEXT);
    this.warningIcon.fillStyle(color);
    this.warningIcon.fillRect(iconX, C.WARNING_ICON_Y, C.WARNING_ICON_WIDTH, C.WARNING_ICON_HEIGHT);
  }

  hideWarning() {
    this.warningIcon.clear();
    this.warningText.setVisible(false);
    this.sirenMissWord.setVisible(false);
  }

  // Drawn relative to the back wheel's centre, so rotating tilts it around that wheel.
  drawStroller() {
    const g = this.stroller;
    g.clear();
    // Steps down while the front wheel is between the two curbs of a crossing.
    const wheelPosition = this.scroll + FRONT_WHEEL_X;
    const k = obstacleIndexAt(this.plan, wheelPosition, C.CROSSING_WIDTH);
    const onRoad = k >= 0 && this.typeOf(k) === 'crossing';
    g.setPosition(PIVOT_X, PIVOT_Y + (onRoad ? C.CROSSING_STEP_HEIGHT : 0));
    g.setAngle(this.lift.isLifted ? -C.LIFT_TILT_DEGREES : 0); // negative = front end up

    const left = C.STROLLER_X - PIVOT_X;
    const bodyBottom = C.STROLLER_GROUND_Y - C.STROLLER_WHEEL_SIZE - PIVOT_Y;
    const bodyTop = bodyBottom - C.STROLLER_HEIGHT;

    g.fillStyle(this.flashMsLeft > 0 ? C.COLOR_HIT_FLASH : C.COLOR_STROLLER);
    g.fillRect(left, bodyTop, C.STROLLER_WIDTH, C.STROLLER_HEIGHT); // body
    g.fillStyle(C.COLOR_STROLLER);
    g.fillRect(left, bodyTop - C.STROLLER_HANDLE_HEIGHT, C.STROLLER_HANDLE_WIDTH, C.STROLLER_HANDLE_HEIGHT); // handle

    g.fillStyle(C.COLOR_WHEEL);
    g.fillRect(left + C.STROLLER_WHEEL_INSET, bodyBottom, C.STROLLER_WHEEL_SIZE, C.STROLLER_WHEEL_SIZE);
    g.fillRect(
      left + C.STROLLER_WIDTH - C.STROLLER_WHEEL_INSET - C.STROLLER_WHEEL_SIZE,
      bodyBottom,
      C.STROLLER_WHEEL_SIZE,
      C.STROLLER_WHEEL_SIZE
    );
  }
}
