import { test } from 'node:test';
import assert from 'node:assert/strict';
import { bumpScreenX, visibleBumpIndexes, bumpsReachingWheel, bumpDamage } from '../src/logic/bumps.js';

test('W2 AC9 bumpScreenX', () => {
  assert.equal(bumpScreenX(0, 0, 1200, 1080), 1200);
  assert.equal(bumpScreenX(1, 1000, 1200, 1080), 1280);
});

test('W2 AC10 visibleBumpIndexes', () => {
  assert.deepEqual(visibleBumpIndexes(0, 1200, 1080, 40, 960), []);
  assert.deepEqual(visibleBumpIndexes(300, 1200, 1080, 40, 960), [0]);
  assert.deepEqual(visibleBumpIndexes(1230, 1200, 1080, 40, 960), [0]);
  assert.deepEqual(visibleBumpIndexes(1350, 1200, 1080, 40, 960), [1]);
});

test('W2 AC11 bumpsReachingWheel', () => {
  const f = (a, b) => bumpsReachingWheel(a, b, 1200, 1080, 311);
  assert.equal(f(0, 100), 0);
  assert.equal(f(880, 889), 1);
  assert.equal(f(889, 900), 0);
  assert.equal(f(1968, 1970), 1);
  assert.equal(f(0, 5000), 4);
  assert.equal(f(500, 500), 0);
  assert.equal(f(500, 400), 0);
});

test('W2 AC11 edge: bump landing exactly on the wheel counts once across frames', () => {
  // left edge reaches wheel at scroll 889
  assert.equal(bumpsReachingWheel(888, 889, 1200, 1080, 311), 1);
  assert.equal(bumpsReachingWheel(889, 890, 1200, 1080, 311), 0);
  // two bumps in one frame
  assert.equal(bumpsReachingWheel(800, 2000, 1200, 1080, 311), 2);
});

test('W2 AC11 edge: walking frame by frame hits each bump exactly once', () => {
  let scroll = 0, total = 0;
  for (let i = 0; i < 3000; i++) {
    const next = scroll + 2;
    total += bumpsReachingWheel(scroll, next, 1200, 1080, 311);
    scroll = next;
  }
  assert.equal(total, 6000 + 311 >= 1200 ? Math.floor((6000 + 311 - 1200) / 1080) + 1 : 0);
});

test('W2 AC12 bumpDamage', () => {
  assert.equal(bumpDamage(true, 10), 0);
  assert.equal(bumpDamage(false, 10), 10);
});
