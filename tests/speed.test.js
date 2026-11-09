import { test } from 'node:test';
import assert from 'node:assert/strict';
import { changeSpeedLevel, speedForLevel } from '../src/logic/speed.js';

test('W2 AC2 changeSpeedLevel steps and stops at the ends', () => {
  assert.equal(changeSpeedLevel('normal', 1), 'brisk');
  assert.equal(changeSpeedLevel('brisk', 1), 'brisk');
  assert.equal(changeSpeedLevel('normal', -1), 'slow');
  assert.equal(changeSpeedLevel('slow', -1), 'slow');
  assert.equal(changeSpeedLevel('slow', 1), 'normal');
  assert.equal(changeSpeedLevel('banana', 1), 'brisk');
});

test('W2 AC3 speedForLevel returns the matching speed', () => {
  const speeds = { slow: 70, normal: 120, brisk: 180 };
  assert.equal(speedForLevel('slow', speeds), 70);
  assert.equal(speedForLevel('normal', speeds), 120);
  assert.equal(speedForLevel('brisk', speeds), 180);
});
