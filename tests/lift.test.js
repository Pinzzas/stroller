import { test } from 'node:test';
import assert from 'node:assert/strict';
import { initialLift, updateLift } from '../src/logic/lift.js';

test('W2 AC4 pressing lift from rest lifts at once', () => {
  assert.deepEqual(updateLift(initialLift(), true, 16, 800), { isLifted: true, heldMs: 16, mustRelease: false });
});

test('W2 AC5 reaching the max hold drops the lift and needs a release', () => {
  const s = updateLift({ isLifted: true, heldMs: 790, mustRelease: false }, true, 16, 800);
  assert.equal(s.isLifted, false);
  assert.equal(s.mustRelease, true);
  // exactly at the limit also drops
  const e = updateLift({ isLifted: true, heldMs: 784, mustRelease: false }, true, 16, 800);
  assert.equal(e.isLifted, false);
});

test('W2 AC6 holding on after the drop stays down', () => {
  const s = updateLift({ isLifted: false, heldMs: 806, mustRelease: true }, true, 16, 800);
  assert.equal(s.isLifted, false);
  assert.equal(s.mustRelease, true);
  assert.equal(s.heldMs, 806);
});

test('W2 AC7 letting go resets, and pressing again lifts', () => {
  const rest = { isLifted: false, heldMs: 0, mustRelease: false };
  for (const st of [
    { isLifted: true, heldMs: 100, mustRelease: false },
    { isLifted: false, heldMs: 806, mustRelease: true },
    rest,
  ]) {
    const released = updateLift(st, false, 16, 800);
    assert.deepEqual(released, rest);
    assert.equal(updateLift(released, true, 16, 800).isLifted, true);
  }
});

test('W2 AC8 updateLift does not change the state passed in', () => {
  const st = Object.freeze({ isLifted: true, heldMs: 790, mustRelease: false });
  updateLift(st, true, 16, 800);
  updateLift(st, false, 16, 800);
  assert.deepEqual(st, { isLifted: true, heldMs: 790, mustRelease: false });
});

test('W2 lift: a full press lasts about 800 ms of frames, then drops', () => {
  let s = initialLift();
  let liftedMs = 0;
  for (let i = 0; i < 100; i++) {
    s = updateLift(s, true, 16, 800);
    if (s.isLifted) liftedMs += 16;
  }
  assert.ok(liftedMs < 800 && liftedMs >= 784, `lifted ${liftedMs} ms`);
  assert.equal(s.isLifted, false);
});
