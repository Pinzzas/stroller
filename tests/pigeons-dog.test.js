import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import * as config from '../src/config.js';
import {
  obstacleRandom, obstacleKindFor, obstacleIndexesNear, obstacleIndexesOverWheel,
} from '../src/logic/obstacles.js';
import { checkPigeons, checkDog, warningShown } from '../src/logic/threats.js';
import { advanceScroll } from '../src/logic/scroll.js';

const P1 = { crossing: 0.25, pigeons: 0.15, dog: 0.15, neighbour: 0.15 };
const KINDS = ['crossing', 'pigeons', 'dog', 'neighbour', 'pothole'];

test('W4 AC3 obstacleKindFor boundaries', () => {
  const f = (r, c = P1) => obstacleKindFor(r, c);
  assert.equal(f(0), 'crossing');
  assert.equal(f(0.24), 'crossing');
  assert.equal(f(0.25), 'pigeons');
  assert.equal(f(0.39), 'pigeons');
  assert.equal(f(0.41), 'dog');
  assert.equal(f(0.54), 'dog');
  assert.equal(f(0.56), 'neighbour');
  assert.equal(f(0.69), 'neighbour');
  assert.equal(f(0.71), 'pothole');
  assert.equal(f(0.999), 'pothole');
  assert.equal(f(0, { crossing: 0, pigeons: 0, dog: 0, neighbour: 0 }), 'pothole');
  assert.equal(f(0.6, { crossing: 0.25, pigeons: 0.15, dog: 0.15, neighbour: 0 }), 'pothole');
});

test('W4 AC4 the mix over 1000 obstacles, and all kinds appear', () => {
  const count = (seed, n) => {
    const c = Object.fromEntries(KINDS.map((k) => [k, 0]));
    for (let k = 0; k < n; k++) c[obstacleKindFor(obstacleRandom(seed, k), P1)]++;
    return c;
  };
  const c = count(42, 1000);
  assert.ok(c.crossing >= 180 && c.crossing <= 320, `crossing ${c.crossing}`);
  assert.ok(c.pigeons >= 90 && c.pigeons <= 210, `pigeons ${c.pigeons}`);
  assert.ok(c.dog >= 90 && c.dog <= 210, `dog ${c.dog}`);
  assert.ok(c.neighbour >= 90 && c.neighbour <= 210, `neighbour ${c.neighbour}`);
  assert.ok(c.pothole >= 220 && c.pothole <= 380, `pothole ${c.pothole}`);
  for (const seed of [1, 42, 123456789]) {
    const s = count(seed, 100);
    for (const k of KINDS) assert.ok(s[k] > 0, `seed ${seed} has no ${k}`);
  }
});

test('W4 AC5 obstacleIndexesNear', () => {
  const f = (p, sp = 700) => obstacleIndexesNear(p, 1200, sp, 1000, 240);
  assert.deepEqual(f(0), []);
  assert.deepEqual(f(200), []);
  assert.deepEqual(f(201), [0]);
  assert.deepEqual(f(901), [0, 1]);
  assert.deepEqual(f(1440), [0, 1]);
  assert.deepEqual(f(1441), [1]);
  assert.deepEqual(f(2141), [2]);
  assert.deepEqual(f(901, 0), []);
});

test('W4 AC6 checkPigeons', () => {
  const r = { damage: 10, maxSafeSpeed: 70 };
  assert.deepEqual(checkPigeons(0, 70, -1, r), { damage: 0, lastFlappedIndex: -1 });
  assert.deepEqual(checkPigeons(0, 120, -1, r), { damage: 10, lastFlappedIndex: 0 });
  assert.deepEqual(checkPigeons(0, 180, 0, r), { damage: 0, lastFlappedIndex: 0 });
  assert.deepEqual(checkPigeons(1, 180, 0, r), { damage: 10, lastFlappedIndex: 1 });
});

test('W4 AC7 checkDog', () => {
  const r = { damage: 25, minSafeSpeed: 180 };
  assert.deepEqual(checkDog(0, 180, -1, r), { damage: 0, lastBarkedIndex: -1 });
  assert.deepEqual(checkDog(0, 120, -1, r), { damage: 25, lastBarkedIndex: 0 });
  assert.deepEqual(checkDog(0, 70, -1, r), { damage: 25, lastBarkedIndex: 0 });
  assert.deepEqual(checkDog(0, 120, 0, r), { damage: 0, lastBarkedIndex: 0 });
  assert.deepEqual(checkDog(2, 70, 0, r), { damage: 25, lastBarkedIndex: 2 });
});

test('W4 AC8 warningShown', () => {
  assert.equal(warningShown([], [], -1), false);
  assert.equal(warningShown([3], ['dog'], -1), true);
  assert.equal(warningShown([3], ['dog'], 3), false);
  assert.equal(warningShown([3, 4], ['dog', 'pothole'], 3), false);
  assert.equal(warningShown([3, 4], ['pothole', 'dog'], 3), true);
  assert.equal(warningShown([5], ['pigeons'], -1), false);
});

// Simulate obstacle 0 with a speed plan. speedAt(position, msUntilArrival) -> speed.
// Total damage from one threat. width and check depend on the threat.
function simulate(width, check, rules, speedAt) {
  const arrivalMs = (speed) => ((1200 - 311) / speed) * 1000;
  let scroll = 0, last = -1, total = 0, t = 0;
  while (scroll + 311 < 1200 + width + 200) {
    const pos = scroll + 311;
    const speed = speedAt(pos, t);
    const prev = scroll;
    scroll = advanceScroll(scroll, speed, 16);
    t += 16;
    for (const k of obstacleIndexesOverWheel(prev, scroll, 1200, 700, 311, width)) {
      if (k !== 0) continue;
      const r = check(k, speed, last, rules);
      total += r.damage;
      last = Object.values(r)[1];
    }
  }
  return total;
}
const S = config.SPEED_SLOW, N = config.SPEED_NORMAL, B = config.SPEED_BRISK;
// Position where speed changes 300 ms before the zone start (at the old speed).
const before300 = (oldSpeed) => 1200 - (oldSpeed * 300) / 1000;

test('W4 AC9 pigeon simulation', () => {
  const rules = { damage: 10, maxSafeSpeed: 70 };
  const run = (speedAt) => simulate(90, checkPigeons, rules, speedAt);
  assert.equal(run(() => S), 0);
  assert.equal(run(() => N), 10);
  assert.equal(run(() => B), 10);
  assert.equal(run((p) => (p < 1245 ? S : N)), 10);
  assert.equal(run((p) => (p < before300(N) ? N : S)), 0);
});

test('W4 AC10 dog simulation', () => {
  const rules = { damage: 25, minSafeSpeed: 180 };
  const run = (speedAt) => simulate(240, checkDog, rules, speedAt);
  assert.equal(run(() => B), 0);
  assert.equal(run(() => N), 25);
  assert.equal(run(() => S), 25);
  assert.equal(run((p) => (p < 1320 ? B : N)), 25);
  assert.equal(run((p) => (p < before300(N) ? N : B)), 0);
});

test('W4 AC11 warning timing', () => {
  const shown = (p) => warningShown(
    obstacleIndexesNear(p, config.OBSTACLE_FIRST_X, config.OBSTACLE_SPACING, config.HEARD_WARNING_DISTANCE, config.DOG_FENCE_WIDTH).filter((k) => k === 0),
    ['dog'], -1);
  assert.equal(shown(200), false);
  assert.equal(shown(201), true);
  assert.equal(shown(1440), true);
  assert.equal(shown(1441), false);
  assert.ok(config.HEARD_WARNING_DISTANCE > config.GAME_WIDTH - 311);
});

test('W4 AC12 config sanity', () => {
  assert.ok((config.OBSTACLE_SPACING - config.DOG_FENCE_WIDTH) / config.SPEED_BRISK >= 2);
  assert.ok(config.OBSTACLE_SPACING > config.DOG_FENCE_WIDTH);
  assert.ok(config.OBSTACLE_SPACING > config.PIGEON_WIDTH);
  assert.ok((config.GAME_WIDTH - 311) / config.SPEED_BRISK >= 2);
  assert.ok(config.CROSSING_CHANCE + config.PIGEON_CHANCE + config.DOG_CHANCE + config.NEIGHBOUR_CHANCE <= 1);
  assert.ok(config.PIGEON_MAX_SAFE_SPEED >= config.SPEED_SLOW);
  assert.ok(config.PIGEON_MAX_SAFE_SPEED < config.SPEED_NORMAL);
  assert.ok(config.DOG_MIN_SAFE_SPEED <= config.SPEED_BRISK);
  assert.ok(config.DOG_MIN_SAFE_SPEED > config.SPEED_NORMAL);
});

test('W4 AC13 config exports exact values (NEIGHBOUR_CHANCE 0.15 from Part 2)', () => {
  const expected = {
    CROSSING_CHANCE: 0.25, PIGEON_CHANCE: 0.15, DOG_CHANCE: 0.15, NEIGHBOUR_CHANCE: 0.15,
    SLEEP_NOISE_SMALL: 10, SLEEP_NOISE_LOUD: 25,
    PIGEON_WIDTH: 90, PIGEON_MAX_SAFE_SPEED: 70, PIGEON_COUNT: 3, PIGEON_BIRD_WIDTH: 16,
    PIGEON_BIRD_HEIGHT: 12, PIGEON_FLY_SPEED: 150, COLOR_PIGEON: 0x9aa3b8, PAVEMENT_BACK_Y: 432,
    DOG_FENCE_WIDTH: 240, DOG_FENCE_HEIGHT: 40, DOG_MIN_SAFE_SPEED: 180, DOG_WIDTH: 40,
    DOG_HEIGHT: 30, DOG_SHOW_MS: 1500, DOG_TEXT_FONT_SIZE: 22, COLOR_FENCE: 0xd8b48a,
    COLOR_DOG: 0xa47551, HEARD_WARNING_DISTANCE: 1000, WARNING_ICON_WIDTH: 72,
    WARNING_ICON_HEIGHT: 36, WARNING_ICON_Y: 200, COLOR_WARNING_ICON: 0xffd98a,
    DOG_WARNING_TEXT: 'woof?',
  };
  for (const [n, v] of Object.entries(expected)) assert.equal(config[n], v, n);
});

function walk(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((e) =>
    e.isDirectory() ? walk(join(dir, e.name)) : [join(dir, e.name)]);
}

test('W4 AC14 obstacleTypeFor gone, logic has no Math.random or phaser', () => {
  const src = new URL('../src/', import.meta.url).pathname;
  for (const f of walk(src)) {
    assert.ok(!readFileSync(f, 'utf8').includes('obstacleTypeFor'), `${f} mentions obstacleTypeFor`);
  }
  for (const f of walk(join(src, 'logic'))) {
    const text = readFileSync(f, 'utf8');
    assert.ok(!text.includes('Math.random'), `${f} uses Math.random`);
    assert.ok(!/phaser/i.test(text), `${f} mentions phaser`);
  }
});

test('W4 edge: back-to-back dogs, second dog still warns after first barked', () => {
  assert.equal(warningShown([0, 1], ['dog', 'dog'], 0), true);
});

test('W4 edge: two flocks in a row each flap once', () => {
  const r = { damage: 10, maxSafeSpeed: 70 };
  let s = checkPigeons(0, 120, -1, r);
  s = checkPigeons(0, 120, s.lastFlappedIndex, r);
  assert.equal(s.damage, 0);
  s = checkPigeons(1, 120, s.lastFlappedIndex, r);
  assert.equal(s.damage, 10);
});
