import { test } from 'node:test';
import assert from 'node:assert/strict';
import { clampDeltaMs, advanceScroll, wrapOffset, tileXPositions } from '../src/logic/scroll.js';

const range = (start, step, count) => Array.from({ length: count }, (_, i) => start + i * step);

test('AC2 clampDeltaMs limits to 0..max', () => {
  assert.equal(clampDeltaMs(16, 100), 16);
  assert.equal(clampDeltaMs(250, 100), 100);
  assert.equal(clampDeltaMs(-5, 100), 0);
});
test('edge: clampDeltaMs boundaries and NaN', () => {
  assert.equal(clampDeltaMs(0, 100), 0);
  assert.equal(clampDeltaMs(100, 100), 100);
  assert.equal(clampDeltaMs(NaN, 100), 0);
});
test('AC3 advanceScroll', () => {
  assert.equal(advanceScroll(0, 120, 1000), 120);
  assert.equal(advanceScroll(0, 120, 500), 60);
  assert.equal(advanceScroll(50, 120, 0), 50);
});
test('AC4 wrapOffset', () => {
  assert.equal(wrapOffset(0, 80), 0);
  assert.equal(wrapOffset(80, 80), 0);
  assert.equal(wrapOffset(200, 80), 40);
  assert.equal(wrapOffset(-10, 80), 70);
});
test('edge: wrapOffset stays in [0, tileWidth) for many values', () => {
  for (let o = -500; o <= 500; o += 7) {
    const w = wrapOffset(o, 80);
    assert.ok(w >= 0 && w < 80, `offset ${o} gave ${w}`);
  }
});
test('AC5 tileXPositions(0, 80, 960)', () => {
  // +0 turns -0 into 0 (the code returns -0 for offset 0; harmless, same value in JS maths)
  assert.deepEqual(tileXPositions(0, 80, 960).map((x) => x + 0), range(0, 80, 12));
});
test('AC6 tileXPositions(30, 80, 960)', () => {
  const r = tileXPositions(30, 80, 960);
  assert.equal(r.length, 13);
  assert.deepEqual(r, range(-30, 80, 13));
});
test('AC7 tileXPositions(1000, 240, 960)', () => {
  assert.deepEqual(tileXPositions(1000, 240, 960), [-40, 200, 440, 680, 920]);
});
test('edge: tileXPositions with tileWidth <= 0 returns []', () => {
  assert.deepEqual(tileXPositions(0, 0, 960), []);
  assert.deepEqual(tileXPositions(30, -80, 960), []);
});
