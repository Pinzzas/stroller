import Phaser from 'phaser';
import * as C from './config.js';
import { clampDeltaMs, advanceScroll, tileXPositions } from './logic/scroll.js';
import { changeSpeedLevel, speedForLevel } from './logic/speed.js';
import { initialLift, updateLift } from './logic/lift.js';
import {
  obstacleScreenX,
  obstacleRandom,
  obstacleTypeFor,
  visibleObstacleIndexes,
  obstacleIndexesReachingWheel,
  obstacleIndexesOverWheel,
  checkPothole,
  curbDamage,
} from './logic/obstacles.js';
import { applySleepDamage, recoverSleep, recoveryRateFor, canRecover } from './logic/sleep.js';
import Hud from './Hud.js';
import TouchButtons from './TouchButtons.js';

const SPEEDS = { slow: C.SPEED_SLOW, normal: C.SPEED_NORMAL, brisk: C.SPEED_BRISK };
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

    this.street = this.add.graphics(); // houses, pavement and obstacles, redrawn every frame
    this.stroller = this.add.graphics().setPosition(PIVOT_X, PIVOT_Y);
    this.hud = new Hud(this);
    this.touch = new TouchButtons(
      this,
      () => this.changeSpeed(-1),
      () => this.changeSpeed(1)
    );

    const keys = this.input.keyboard.addKeys('UP,DOWN,SPACE');
    this.input.keyboard.addCapture('UP,DOWN,SPACE'); // keys must not scroll the page
    this.keys = keys;
    keys.UP.on('down', () => this.changeSpeed(1)); // one step per press (no key repeat)
    keys.DOWN.on('down', () => this.changeSpeed(-1));

    // Leaving the tab or app counts as letting go.
    this.game.events.on('blur', this.letGo, this);
    this.game.events.on('hidden', this.letGo, this);
    this.events.once('shutdown', () => {
      this.game.events.off('blur', this.letGo, this);
      this.game.events.off('hidden', this.letGo, this);
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
    this.speedLevel = changeSpeedLevel(this.speedLevel, step);
  }

  typeOf(index) {
    return obstacleTypeFor(obstacleRandom(this.streetSeed, index), C.CURB_CHANCE);
  }

  letGo() {
    this.input.keyboard.resetKeys();
    this.touch.release();
  }

  update(time, deltaMs) {
    const step = clampDeltaMs(deltaMs, C.MAX_FRAME_DELTA_MS);

    const isHeld = this.keys.SPACE.isDown || this.touch.isLiftHeld();
    this.lift = updateLift(this.lift, isHeld, step, C.LIFT_MAX_HOLD_MS);

    const prevScroll = this.scroll;
    this.scroll = advanceScroll(this.scroll, speedForLevel(this.speedLevel, SPEEDS), step);

    this.msSinceHit += step;
    this.flashMsLeft = Math.max(0, this.flashMsLeft - step);
    let damage = 0;
    const potholes = obstacleIndexesOverWheel(prevScroll, this.scroll, C.OBSTACLE_FIRST_X, C.OBSTACLE_SPACING, FRONT_WHEEL_X, C.POTHOLE_WIDTH);
    for (const k of potholes) {
      if (this.typeOf(k) !== 'pothole') continue;
      const result = checkPothole(k, this.lift.isLifted, this.lastJoltedPothole, C.SLEEP_JOLT_SMALL);
      this.lastJoltedPothole = result.lastJoltedIndex;
      damage += result.damage;
    }
    const curbRules = { damage: C.SLEEP_JOLT_BIG, maxSafeSpeed: C.CURB_MAX_SAFE_SPEED };
    const currentSpeed = speedForLevel(this.speedLevel, SPEEDS);
    const curbs = obstacleIndexesReachingWheel(prevScroll, this.scroll, C.OBSTACLE_FIRST_X, C.OBSTACLE_SPACING, FRONT_WHEEL_X);
    for (const k of curbs) {
      if (this.typeOf(k) !== 'curb') continue;
      damage += curbDamage(this.lift.isLifted, currentSpeed, curbRules);
    }
    if (damage > 0) {
      this.sleep = applySleepDamage(this.sleep, damage, C.SLEEP_MAX);
      this.flashMsLeft = C.HIT_FLASH_MS;
      this.msSinceHit = 0;
    }

    if (canRecover(this.msSinceHit, C.SLEEP_RECOVERY_DELAY_MS)) {
      const rate = recoveryRateFor(this.speedLevel, RECOVERY_RATES);
      this.sleep = recoverSleep(this.sleep, rate, step, C.SLEEP_MAX);
    }

    this.drawStreet();
    this.drawStroller();
    this.hud.draw(this.sleep, this.speedLevel);
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

    // Potholes and curbs
    const widest = Math.max(C.POTHOLE_WIDTH, C.CURB_WIDTH);
    for (const k of visibleObstacleIndexes(this.scroll, C.OBSTACLE_FIRST_X, C.OBSTACLE_SPACING, widest, C.GAME_WIDTH)) {
      const x = Math.round(obstacleScreenX(k, this.scroll, C.OBSTACLE_FIRST_X, C.OBSTACLE_SPACING));
      if (this.typeOf(k) === 'curb') {
        g.fillStyle(C.COLOR_CURB);
        g.fillRect(x, C.STROLLER_GROUND_Y - C.CURB_HEIGHT, C.CURB_WIDTH, C.CURB_HEIGHT);
      } else {
        g.fillStyle(C.COLOR_POTHOLE);
        g.fillRect(x, C.STROLLER_GROUND_Y, C.POTHOLE_WIDTH, C.POTHOLE_DEPTH);
      }
    }
  }

  // Drawn relative to the back wheel's centre, so rotating tilts it around that wheel.
  drawStroller() {
    const g = this.stroller;
    g.clear();
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
