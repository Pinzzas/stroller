import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync, readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import * as config from '../src/config.js';
import {
  obstacleScreenX, obstacleRandom, obstacleTypeFor, visibleObstacleIndexes,
  obstacleIndexesReachingWheel, obstacleIndexesOverWheel, checkPothole, curbDamage,
} from '../src/logic/obstacles.js';
import { updateLift, initialLift } from '../src/logic/lift.js';
import { advanceScroll } from '../src/logic/scroll.js';
import { applySleepDamage } from '../src/logic/sleep.js';

test('P2 AC2 obstacleScreenX', () => {
  assert.equal(obstacleScreenX(0, 0, 1200, 900), 1200);
  assert.equal(obstacleScreenX(2, 1000, 1200, 900), 2000);
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

test('P2 AC4 obstacleRandom gives a mix', () => {
  const types = (seed, n) => Array.from({ length: n }, (_, k) => obstacleTypeFor(obstacleRandom(seed, k), 0.35));
  const curbs = types(42, 1000).filter((t) => t === 'curb').length;
  assert.ok(curbs >= 250 && curbs <= 450, `curbs: ${curbs}`);
  assert.notDeepEqual(types(1, 20), types(2, 20));
  for (const seed of [1, 2]) {
    assert.ok(types(seed, 20).includes('curb'), `seed ${seed} no curb`);
    assert.ok(types(seed, 20).includes('pothole'), `seed ${seed} no pothole`);
  }
});

test('P2 AC5 obstacleTypeFor', () => {
  assert.equal(obstacleTypeFor(0.1, 0.35), 'curb');
  assert.equal(obstacleTypeFor(0.35, 0.35), 'pothole');
  assert.equal(obstacleTypeFor(0.9, 0.35), 'pothole');
  assert.equal(obstacleTypeFor(0, 0), 'pothole');
  assert.equal(obstacleTypeFor(0.999, 1), 'curb');
});

test('P2 AC6 visibleObstacleIndexes', () => {
  const f = (s, sp = 900) => visibleObstacleIndexes(s, 1200, sp, 36, 960);
  assert.deepEqual(f(0), []);
  assert.deepEqual(f(300), [0]);
  assert.deepEqual(f(1230), [0, 1]);
  assert.deepEqual(f(1240), [1]);
  assert.deepEqual(f(2200), [2]);
  assert.deepEqual(f(300, 0), []);
});

test('P2 AC7 obstacleIndexesReachingWheel', () => {
  const f = (a, b) => obstacleIndexesReachingWheel(a, b, 1200, 900, 311);
  assert.deepEqual(f(0, 100), []);
  assert.deepEqual(f(880, 889), [0]);
  assert.deepEqual(f(889, 900), []);
  assert.deepEqual(f(1780, 1790), [1]);
  assert.deepEqual(f(2680, 2690), [2]);
  assert.deepEqual(f(0, 3000), [0, 1, 2]);
  assert.deepEqual(f(500, 500), []);
  assert.deepEqual(f(500, 400), []);
  const all = [];
  for (let s = 0; s < 9000; s += 3) all.push(...f(s, s + 3));
  assert.deepEqual(all, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
});

test('P2 AC8 obstacleIndexesOverWheel', () => {
  const f = (a, b) => obstacleIndexesOverWheel(a, b, 1200, 900, 311, 30);
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
    lift = updateLift(lift, held, 16, config.LIFT_MAX_HOLD_MS);
    const prev = scroll;
    scroll = advanceScroll(scroll, speed, 16);
    for (const k of obstacleIndexesOverWheel(prev, scroll, 1200, 900, 311, 30)) {
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

test('P2 AC12 big jolt on the meter', () => {
  assert.equal(applySleepDamage(100, 20, 100), 80);
  assert.equal(applySleepDamage(15, 20, 100), 0);
});

test('P2 AC13 config sanity', () => {
  for (const s of [config.SPEED_SLOW, config.SPEED_NORMAL, config.SPEED_BRISK]) {
    assert.ok((1000 * config.POTHOLE_WIDTH) / s < config.LIFT_MAX_HOLD_MS, `speed ${s}`);
  }
  assert.ok(config.OBSTACLE_FIRST_X >= config.GAME_WIDTH);
  const wheelX = config.STROLLER_X + config.STROLLER_WIDTH - config.STROLLER_WHEEL_INSET - config.STROLLER_WHEEL_SIZE / 2;
  assert.equal(wheelX, 311);
  assert.ok((config.GAME_WIDTH - wheelX) / config.SPEED_BRISK >= 2);
});

function walk(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((e) =>
    e.isDirectory() ? walk(join(dir, e.name)) : [join(dir, e.name)]);
}

test('P2 AC14 bumps.js is gone, no leftovers, no Math.random in logic', () => {
  const src = new URL('../src/', import.meta.url).pathname;
  assert.ok(!existsSync(join(src, 'logic/bumps.js')));
  for (const f of walk(src)) {
    const text = readFileSync(f, 'utf8');
    assert.ok(!/bumps\.js|TEST_BUMP/.test(text), `${f} mentions bumps.js/TEST_BUMP`);
  }
  for (const f of walk(join(src, 'logic'))) {
    assert.ok(!readFileSync(f, 'utf8').includes('Math.random'), `${f} uses Math.random`);
  }
});

test('P2 AC15 no file in src/logic mentions phaser', () => {
  const dir = new URL('../src/logic/', import.meta.url).pathname;
  for (const f of readdirSync(dir)) {
    assert.ok(!/phaser/i.test(readFileSync(join(dir, f), 'utf8')), `${f} mentions phaser`);
  }
});

test('P2 AC16 config exports the new values exactly and not the old ones', () => {
  const expected = {
    SLEEP_JOLT_SMALL: 10, SLEEP_JOLT_BIG: 20, OBSTACLE_FIRST_X: 1200, OBSTACLE_SPACING: 900,
    CURB_CHANCE: 0.35, POTHOLE_WIDTH: 30, POTHOLE_DEPTH: 10, COLOR_POTHOLE: 0x6b625a,
    CURB_WIDTH: 36, CURB_HEIGHT: 24, COLOR_CURB: 0xa69e92, CURB_MAX_SAFE_SPEED: 70,
    LIFT_MAX_HOLD_MS: 800,
  };
  for (const [n, v] of Object.entries(expected)) assert.equal(config[n], v, n);
  for (const n of ['TEST_BUMP_FIRST_X', 'TEST_BUMP_SPACING', 'TEST_BUMP_WIDTH', 'TEST_BUMP_HEIGHT', 'COLOR_TEST_BUMP']) {
    assert.ok(!(n in config), n);
  }
});
