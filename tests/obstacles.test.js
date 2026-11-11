import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync, readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import * as config from '../src/config.js';
import {
  obstacleScreenX, obstacleRandom, visibleObstacleIndexes, extendPlan,
  obstacleIndexesReachingWheel, obstacleIndexesOverWheel, checkPothole, curbDamage, obstacleIndexAt,
} from '../src/logic/obstacles.js';
import { updateLift, initialLift } from '../src/logic/lift.js';
import { advanceScroll } from '../src/logic/scroll.js';
import { applySleepDamage } from '../src/logic/sleep.js';

const planOf = (gap) => extendPlan([], 1e5, 1200, gap);

test('P2 AC2 obstacleScreenX', () => {
  assert.equal(obstacleScreenX(planOf(900), 0, 0), 1200);
  assert.equal(obstacleScreenX(planOf(900), 2, 1000), 2000);
});

test('P2 AC3 obstacleRandom is in [0,1) and repeatable', () => {
  for (const seed of [1, 42, 123456789]) {
    for (let k = 0; k < 1000; k++) {
      const r = obstacleRandom(seed, k);
      assert.ok(r >= 0 && r < 1, `seed ${seed} k ${k} gave ${r}`);
      assert.equal(obstacleRandom(seed, k), r);
    }
  }
});

test('P2 AC6 visibleObstacleIndexes', () => {
  const f = (s, plan = planOf(900)) => visibleObstacleIndexes(plan, s, 180, 960);
  assert.deepEqual(f(0), []);
  assert.deepEqual(f(300), [0]);
  assert.deepEqual(f(1379), [0, 1]);
  assert.deepEqual(f(1380), [1]);
  assert.deepEqual(f(2300), [2]);
  assert.deepEqual(f(300, []), []);
});

test('P2 AC7 obstacleIndexesReachingWheel', () => {
  const f = (a, b) => obstacleIndexesReachingWheel(planOf(900), a, b, 311, 0);
  assert.deepEqual(f(0, 100), []);
  assert.deepEqual(f(880, 889), [0]);
  assert.deepEqual(f(889, 900), []);
  assert.deepEqual(f(1780, 1790), [1]);
  assert.deepEqual(f(2680, 2690), [2]);
  assert.deepEqual(f(0, 3000), [0, 1, 2]);
  assert.deepEqual(f(500, 500), []);
  assert.deepEqual(f(500, 400), []);
  const up = (a, b) => obstacleIndexesReachingWheel(planOf(900), a, b, 311, 180);
  assert.deepEqual(up(1060, 1069), [0]);
  assert.deepEqual(up(1069, 1080), []);
  const all = [];
  for (let s = 0; s < 9000; s += 3) all.push(...f(s, s + 3));
  assert.deepEqual(all, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
});

test('P2 AC8 obstacleIndexesOverWheel', () => {
  const f = (a, b) => obstacleIndexesOverWheel(planOf(900), a, b, 311, 30);
  assert.deepEqual(f(880, 889), []);
  assert.deepEqual(f(889, 890), [0]);
  assert.deepEqual(f(900, 910), [0]);
  assert.deepEqual(f(918, 925), [0]);
  assert.deepEqual(f(919, 925), []);
  assert.deepEqual(f(880, 1000), [0]);
  assert.deepEqual(f(0, 3000), [0, 1, 2]);
  assert.deepEqual(f(500, 500), []);
  assert.deepEqual(f(910, 900), []);
});

test('P2 AC9 checkPothole', () => {
  assert.deepEqual(checkPothole(0, true, -1, 10), { damage: 0, lastJoltedIndex: -1 });
  assert.deepEqual(checkPothole(0, false, -1, 10), { damage: 10, lastJoltedIndex: 0 });
  assert.deepEqual(checkPothole(0, false, 0, 10), { damage: 0, lastJoltedIndex: 0 });
  assert.deepEqual(checkPothole(1, false, 0, 10), { damage: 10, lastJoltedIndex: 1 });
});

test('P2 AC10 curbDamage', () => {
  const rules = { damage: 20, maxSafeSpeed: 70 };
  assert.equal(curbDamage(true, 70, rules), 0);
  assert.equal(curbDamage(true, 120, rules), 20);
  assert.equal(curbDamage(true, 180, rules), 20);
  assert.equal(curbDamage(false, 70, rules), 20);
  assert.equal(curbDamage(false, 180, rules), 20);
});

// Simulate crossing pothole 0. pressOffsetMs: press time relative to arrival
// (negative = before). releaseAfterMs: let go this long after arrival (optional).
function crossPothole(speed, pressOffsetMs, releaseAfterMs = Infinity) {
  const arrival = ((1200 - 311) / speed) * 1000;
  const pressAt = arrival + pressOffsetMs;
  const releaseAt = releaseAfterMs === Infinity ? Infinity : arrival + releaseAfterMs;
  let lift = initialLift(), scroll = 0, last = -1, total = 0;
  for (let t = 0; t < arrival + 3000; t += 16) {
    const held = pressOffsetMs !== null && t >= pressAt && t < releaseAt;
    lift = updateLift(lift, held, 16, 800);
    const prev = scroll;
    scroll = advanceScroll(scroll, speed, 16);
    for (const k of obstacleIndexesOverWheel(planOf(900), prev, scroll, 311, 30)) {
      if (k !== 0) continue;
      const r = checkPothole(k, lift.isLifted, last, 10);
      total += r.damage;
      last = r.lastJoltedIndex;
    }
  }
  return total;
}

test('P2 AC11 whole-crossing simulation', () => {
  assert.equal(crossPothole(70, -300), 0);
  assert.equal(crossPothole(70, -450), 10);
  assert.equal(crossPothole(70, 50), 10);
  assert.equal(crossPothole(120, -400), 0);
  assert.equal(crossPothole(120, -600), 10);
  assert.equal(crossPothole(180, -500), 0);
  assert.equal(crossPothole(180, -700), 10);
  assert.equal(crossPothole(70, -300, 100), 10);
  assert.equal(crossPothole(120, null), 10);
});

// Simulate a crossing at index 0. plan: { speedAt(position), lifts: [{ curb: 'down'|'up', releaseAfterMs }] }
// A lift presses 300 ms (at the speed then) before the curb and lets go releaseAfterMs after it.
function crossCrossing({ speedAt, lifts }) {
  const downPos = 1200, upPos = 1380;
  const curbPos = { down: downPos, up: upPos };
  let lift = initialLift(), scroll = 0, total = 0, t = 0;
  const arrived = {}; // curb -> time the wheel reached it
  const pressed = {}; // lift index -> true once pressed
  const rules = { damage: 20, maxSafeSpeed: 70 };
  for (; scroll + 311 < upPos + 600; t += 16) {
    const pos = scroll + 311;
    const speed = speedAt(pos);
    let held = false;
    lifts.forEach((l, i) => {
      const cp = curbPos[l.curb];
      if (!pressed[i] && pos >= cp - (speed * 300) / 1000) pressed[i] = t;
      if (pressed[i] === undefined) return;
      const releaseT = arrived[l.curb] === undefined ? Infinity : arrived[l.curb] + l.releaseAfterMs;
      if (t < releaseT) held = true;
    });
    lift = updateLift(lift, held, 16, 800);
    const prev = scroll;
    scroll = advanceScroll(scroll, speed, 16);
    const speedNow = speedAt(scroll + 311);
    const hits = obstacleIndexesReachingWheel(planOf(900), prev, scroll, 311, 0).filter((k) => k === 0).length
      + obstacleIndexesReachingWheel(planOf(900), prev, scroll, 311, 180).filter((k) => k === 0).length;
    if (prev + 311 < downPos && scroll + 311 >= downPos) arrived.down = t;
    if (prev + 311 < upPos && scroll + 311 >= upPos) arrived.up = t;
    for (let i = 0; i < hits; i++) total += curbDamage(lift.isLifted, speedNow, rules);
  }
  return total;
}

const both = [{ curb: 'down', releaseAfterMs: 500 }, { curb: 'up', releaseAfterMs: 500 }];

test('P2 AC12 crossing simulation', () => {
  const slow = () => 70, normal = () => 120;
  assert.equal(crossCrossing({ speedAt: slow, lifts: both }), 0);
  assert.equal(crossCrossing({ speedAt: slow, lifts: [both[0]] }), 20);
  assert.equal(crossCrossing({ speedAt: slow, lifts: [both[1]] }), 20);
  assert.equal(crossCrossing({ speedAt: slow, lifts: [] }), 40);
  assert.equal(crossCrossing({ speedAt: normal, lifts: both }), 40);
  assert.equal(crossCrossing({ speedAt: (p) => (p < 1300 ? 70 : 120), lifts: both }), 20);
  // held from before the down-curb until after the up-curb: the lift tires out on the road
  assert.equal(crossCrossing({ speedAt: slow, lifts: [{ curb: 'down', releaseAfterMs: 1e9 }, { curb: 'up', releaseAfterMs: 500 }] }), 20);
});

test('P2 AC13 obstacleIndexAt', () => {
  const f = (p, plan = planOf(900)) => obstacleIndexAt(plan, p, 180);
  assert.equal(f(1200), -1);
  assert.equal(f(1201), 0);
  assert.equal(f(1380), 0);
  assert.equal(f(1381), -1);
  assert.equal(f(1500), -1);
  assert.equal(f(2101), 1);
  assert.equal(f(100), -1);
  assert.equal(f(1300, []), -1);
});

test('P2 AC14 big jolt on the meter', () => {
  assert.equal(applySleepDamage(100, 20, 100), 80);
  assert.equal(applySleepDamage(100, 40, 100), 60);
  assert.equal(applySleepDamage(15, 20, 100), 0);
});

test('P2 AC15 config sanity', () => {
  for (const s of [config.SPEED_SLOW, config.SPEED_NORMAL, config.SPEED_BRISK]) {
    assert.ok((1000 * config.POTHOLE_WIDTH) / s < config.LIFT_MAX_HOLD_MS, `speed ${s}`);
  }
  assert.ok(config.OBSTACLE_FIRST_X >= config.GAME_WIDTH);
  const wheelX = config.STROLLER_X + config.STROLLER_WIDTH - config.STROLLER_WHEEL_INSET - config.STROLLER_WHEEL_SIZE / 2;
  assert.equal(wheelX, 311);
  assert.ok((config.GAME_WIDTH - wheelX) / config.SPEED_BRISK >= 2);
  assert.ok((1000 * config.CROSSING_WIDTH) / config.SPEED_SLOW >= 2 * config.LIFT_MAX_HOLD_MS);
  assert.ok(config.OBSTACLE_GAP_LIGHT > config.CROSSING_WIDTH);
  const offsets = [];
  for (let i = 0; ; i++) {
    const o = config.CROSSING_STRIPE_FIRST_OFFSET + i * config.CROSSING_STRIPE_SPACING;
    if (o + config.CROSSING_STRIPE_WIDTH > config.CROSSING_WIDTH) break;
    offsets.push(o);
  }
  assert.deepEqual(offsets, [12, 48, 84, 120, 156]);
});

function walk(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((e) =>
    e.isDirectory() ? walk(join(dir, e.name)) : [join(dir, e.name)]);
}

test('P2 AC16 no leftovers in src, no Math.random in logic', () => {
  const src = new URL('../src/', import.meta.url).pathname;
  assert.ok(!existsSync(join(src, 'logic/bumps.js')));
  const bad = /bumps\.js|TEST_BUMP|\bCURB_CHANCE\b|\bCURB_WIDTH\b|\bCURB_HEIGHT\b|\bCOLOR_CURB\b/;
  for (const f of walk(src)) {
    assert.ok(!bad.test(readFileSync(f, 'utf8')), `${f} mentions a removed name`);
  }
  for (const f of walk(join(src, 'logic'))) {
    assert.ok(!readFileSync(f, 'utf8').includes('Math.random'), `${f} uses Math.random`);
  }
});

test('P2 AC17 no file in src/logic mentions phaser', () => {
  const dir = new URL('../src/logic/', import.meta.url).pathname;
  for (const f of readdirSync(dir)) {
    assert.ok(!/phaser/i.test(readFileSync(join(dir, f), 'utf8')), `${f} mentions phaser`);
  }
});

test('P2 AC18 config exports the new values exactly and not the removed ones', () => {
  const expected = {
    SLEEP_JOLT_SMALL: 10, SLEEP_JOLT_BIG: 20, OBSTACLE_FIRST_X: 1200, OBSTACLE_GAP_LIGHT: 700,
    CROSSING_CHANCE: 0.25, POTHOLE_WIDTH: 30, POTHOLE_DEPTH: 10, COLOR_POTHOLE: 0x4a3b33,
    CROSSING_WIDTH: 180, CROSSING_STEP_HEIGHT: 12, CROSSING_STRIPE_WIDTH: 20,
    CROSSING_STRIPE_SPACING: 36, CROSSING_STRIPE_FIRST_OFFSET: 12, COLOR_ROAD: 0x5c6370,
    COLOR_CROSSING_STRIPE: 0xffffff, COLOR_CURB_FACE: 0x9a948a, CURB_MAX_SAFE_SPEED: 70,
    LIFT_MAX_HOLD_MS: 700,
  };
  for (const [n, v] of Object.entries(expected)) assert.equal(config[n], v, n);
  for (const n of ['TEST_BUMP_FIRST_X', 'TEST_BUMP_SPACING', 'TEST_BUMP_WIDTH', 'TEST_BUMP_HEIGHT',
    'COLOR_TEST_BUMP', 'CURB_CHANCE', 'CURB_WIDTH', 'CURB_HEIGHT', 'COLOR_CURB']) {
    assert.ok(!(n in config), n);
  }
});
