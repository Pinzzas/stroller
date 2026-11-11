import { test } from 'node:test';
import assert from 'node:assert/strict';
import * as config from '../src/config.js';
import {
  sirenLoudness, inSirenPeak, calmSiren, checkSirenMiss, heardWarningFor,
} from '../src/logic/siren.js';
import {
  unlockedKinds, introChances, newKindAt, obstacleKindForIndex,
} from '../src/logic/intro.js';
import {
  obstacleKindFor, obstacleRandom, obstacleIndexesReachingWheel, extendPlan,
} from '../src/logic/obstacles.js';
import { advanceScroll } from '../src/logic/scroll.js';
import { initialShush, useShush } from '../src/logic/shush.js';
import { stageDamage } from '../src/logic/stages.js';

const FULL = { crossing: 0.25, pigeons: 0.15, dog: 0.15, neighbour: 0.15, siren: 0.1 };
const ORDER = ['crossing', 'pigeons', 'dog', 'neighbour', 'siren'];
const ALL6 = ['pothole', ...ORDER];
const SEEDS = [1, 42, 123456789];

test('W5P2 AC14 obstacleKindFor with siren range', () => {
  assert.equal(obstacleKindFor(0.69, FULL), 'neighbour');
  assert.equal(obstacleKindFor(0.7, FULL), 'siren');
  assert.equal(obstacleKindFor(0.79, FULL), 'siren');
  assert.equal(obstacleKindFor(0.8, FULL), 'pothole');
  const w4 = { crossing: 0.25, pigeons: 0.15, dog: 0.15, neighbour: 0.15, siren: 0 };
  assert.equal(obstacleKindFor(0.69, w4), 'neighbour');
  assert.equal(obstacleKindFor(0.7, w4), 'pothole');
  assert.equal(obstacleKindFor(0.25, w4), 'pigeons');
});

test('W5P2 AC15 the full mix over 1000 obstacles, all kinds appear', () => {
  const count = (seed, n) => {
    const c = Object.fromEntries(ALL6.map((k) => [k, 0]));
    for (let k = 0; k < n; k++) c[obstacleKindFor(obstacleRandom(seed, k), FULL)]++;
    return c;
  };
  const c = count(42, 1000);
  assert.ok(c.siren >= 50 && c.siren <= 150, `siren ${c.siren}`);
  assert.ok(c.pothole >= 120 && c.pothole <= 280, `pothole ${c.pothole}`);
  assert.ok(c.crossing >= 180 && c.crossing <= 320, `crossing ${c.crossing}`);
  assert.ok(c.pigeons >= 90 && c.pigeons <= 210, `pigeons ${c.pigeons}`);
  assert.ok(c.dog >= 90 && c.dog <= 210, `dog ${c.dog}`);
  assert.ok(c.neighbour >= 90 && c.neighbour <= 210, `neighbour ${c.neighbour}`);
  for (const seed of SEEDS) {
    const s = count(seed, 100);
    for (const k of ALL6) assert.ok(s[k] > 0, `seed ${seed} has no ${k}`);
  }
});

test('W5P2 AC16 sirenLoudness and inSirenPeak', () => {
  const l = (p) => sirenLoudness(p, 1200, 1000);
  assert.equal(l(100), 0);
  assert.equal(l(200), 0);
  assert.equal(l(700), 0.5);
  assert.equal(l(1200), 1);
  assert.equal(l(1250), 1);
  const peak = (p) => inSirenPeak(p, 1200, 100);
  assert.equal(peak(1200), false);
  assert.equal(peak(1201), true);
  assert.equal(peak(1300), true);
  assert.equal(peak(1301), false);
});

test('W5P2 AC17 calmSiren and checkSirenMiss', () => {
  assert.deepEqual(calmSiren(3, true, true, -1), { calmed: true, lastSettledIndex: 3 });
  assert.deepEqual(calmSiren(3, true, false, -1), { calmed: false, lastSettledIndex: -1 });
  assert.deepEqual(calmSiren(3, false, true, -1), { calmed: false, lastSettledIndex: -1 });
  assert.deepEqual(calmSiren(3, true, true, 3), { calmed: false, lastSettledIndex: 3 });
  assert.deepEqual(checkSirenMiss(3, -1, 25), { damage: 25, lastSettledIndex: 3 });
  assert.deepEqual(checkSirenMiss(3, 3, 25), { damage: 0, lastSettledIndex: 3 });
});

test('W5P2 AC18 heardWarningFor', () => {
  assert.equal(heardWarningFor([], [], -1, -1), null);
  assert.equal(heardWarningFor([3], ['siren'], -1, -1), 'siren');
  assert.equal(heardWarningFor([3], ['siren'], -1, 3), null);
  assert.equal(heardWarningFor([3, 4], ['dog', 'siren'], -1, -1), 'dog');
  assert.equal(heardWarningFor([3, 4], ['dog', 'siren'], 3, -1), 'siren');
  assert.equal(heardWarningFor([5], ['pigeons'], -1, -1), null);
});

// Siren at 1200, normal speed, 16 ms frames, wheel 311.
function simulate({ pressAt, charges, stage }) {
  const plan = [1200];
  let scroll = 0;
  let sleep = 50;
  let shush = initialShush(2);
  shush = { ...shush, charges };
  let last = -1;
  let pressed = false;
  let sirenDamage = 0;
  let sirenHits = 0;
  const rules = { restore: 10, maxSleep: 100, cooldownMs: 45000 };
  for (let i = 0; i < 1500; i++) {
    const prev = scroll;
    scroll = advanceScroll(scroll, 120, 16);
    const pos = scroll + 311;
    if (pressAt !== null && !pressed && pos >= pressAt) {
      pressed = true;
      const r = useShush(shush, sleep, rules);
      shush = r.state;
      sleep = r.sleep;
      const c = calmSiren(0, inSirenPeak(pos, 1200, 100), r.used, last);
      last = c.lastSettledIndex;
    }
    if (obstacleIndexesReachingWheel(plan, prev, scroll, 311, 100).includes(0)) {
      const m = checkSirenMiss(0, last, stageDamage(25, stage, 0.2));
      last = m.lastSettledIndex;
      sirenDamage += m.damage;
      if (m.damage > 0) sirenHits++;
      sleep -= m.damage;
    }
  }
  return { sirenDamage, sirenHits, sleep, charges: shush.charges };
}

test('W5P2 AC19 siren simulation', () => {
  let r = simulate({ pressAt: null, charges: 2, stage: 0 });
  assert.equal(r.sirenDamage, 25);
  assert.equal(r.sirenHits, 1);
  assert.equal(r.sleep, 25);

  r = simulate({ pressAt: 1250, charges: 2, stage: 0 });
  assert.equal(r.sirenDamage, 0);
  assert.equal(r.sleep, 60);
  assert.equal(r.charges, 1);

  r = simulate({ pressAt: 1250, charges: 0, stage: 0 });
  assert.equal(r.sirenDamage, 25);
  assert.equal(r.sleep, 25);

  r = simulate({ pressAt: 1150, charges: 2, stage: 0 });
  assert.equal(r.sirenDamage, 25);
  assert.equal(r.sleep, 35);

  r = simulate({ pressAt: 1350, charges: 2, stage: 0 });
  assert.equal(r.sirenDamage, 25);
  assert.equal(r.sleep, 35);

  r = simulate({ pressAt: null, charges: 2, stage: 2 });
  assert.equal(r.sirenDamage, 15);
  assert.equal(r.sleep, 35);
});

test('W5P2 AC20 unlockedKinds, newKindAt, introChances', () => {
  const u = (k) => unlockedKinds(k, ORDER, 3);
  assert.deepEqual(u(0), []);
  assert.deepEqual(u(2), []);
  assert.deepEqual(u(3), ['crossing']);
  assert.deepEqual(u(5), ['crossing']);
  assert.deepEqual(u(6), ['crossing', 'pigeons']);
  assert.deepEqual(u(15), ORDER);
  assert.deepEqual(u(99), ORDER);
  const n = (k) => newKindAt(k, ORDER, 3);
  assert.equal(n(0), null);
  assert.equal(n(3), 'crossing');
  assert.equal(n(4), null);
  assert.equal(n(6), 'pigeons');
  assert.equal(n(9), 'dog');
  assert.equal(n(12), 'neighbour');
  assert.equal(n(15), 'siren');
  assert.equal(n(18), null);
  const full = { ...FULL };
  assert.deepEqual(introChances(full, ['crossing']),
    { crossing: 0.25, pigeons: 0, dog: 0, neighbour: 0, siren: 0 });
  assert.deepEqual(introChances(full, []),
    { crossing: 0, pigeons: 0, dog: 0, neighbour: 0, siren: 0 });
  assert.deepEqual(full, FULL);
});

test('W5P2 AC21 obstacleKindForIndex', () => {
  const f = (k, r) => obstacleKindForIndex(k, r, FULL, ORDER, 3);
  assert.equal(f(0, 0.1), 'pothole');
  assert.equal(f(2, 0), 'pothole');
  assert.equal(f(3, 0.99), 'crossing');
  assert.equal(f(4, 0.1), 'crossing');
  assert.equal(f(4, 0.3), 'pothole');
  assert.equal(f(6, 0.99), 'pigeons');
  assert.equal(f(7, 0.3), 'pigeons');
  assert.equal(f(7, 0.45), 'pothole');
  assert.equal(f(15, 0), 'siren');
  assert.equal(f(16, 0.75), 'siren');
  for (const seed of SEEDS) {
    const kind = (k) => obstacleKindForIndex(k, obstacleRandom(seed, k), FULL, ORDER, 3);
    for (let k = 0; k <= 2; k++) assert.equal(kind(k), 'pothole', `seed ${seed} k ${k}`);
    for (let k = 4; k <= 5; k++) assert.ok(['pothole', 'crossing'].includes(kind(k)), `seed ${seed} k ${k}`);
    for (let k = 0; k < 15; k++) assert.notEqual(kind(k), 'siren', `seed ${seed} k ${k}`);
    const seen = new Set();
    for (let k = 15; k <= 1014; k++) seen.add(kind(k));
    for (const name of ALL6) assert.ok(seen.has(name), `seed ${seed} missing ${name}`);
  }
});

test('W5P2 AC22 config has every Part 2 name with the listed value', () => {
  assert.equal(config.SIREN_CHANCE, 0.1);
  assert.equal(config.SIREN_PEAK_WIDTH, 100);
  assert.equal(config.SIREN_WARNING_TEXT, 'nee-naw');
  assert.equal(config.SIREN_MISS_TEXT, 'NEE-NAW!');
  assert.equal(config.SIREN_SHOW_MS, 1500);
  assert.equal(config.SIREN_BAR_HEIGHT, 8);
  assert.equal(config.SIREN_BAR_GAP, 4);
  assert.equal(config.COLOR_SIREN_BAR, 0xf5b0a0);
  assert.equal(config.COLOR_SIREN_PEAK, 0xf5b0a0);
  assert.deepEqual(config.INTRO_ORDER, ORDER);
  assert.equal(config.INTRO_EVERY, 3);
});

test('W5P2 edge: intro timing with plan helper, siren is first at index 15', () => {
  const plan = extendPlan([], 12000, 1200, 700);
  assert.ok(plan.length > 15);
  assert.equal(obstacleKindForIndex(15, 0.5, FULL, ORDER, 3), 'siren');
  assert.equal(obstacleKindForIndex(14, 0.75, FULL, ORDER, 3), 'pothole');
});
