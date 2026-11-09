import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  applySleepDamage, recoverSleep, recoveryRateFor, canRecover, meterFillWidth, meterLabel,
} from '../src/logic/sleep.js';

test('W2 AC13 applySleepDamage', () => {
  assert.equal(applySleepDamage(100, 10, 100), 90);
  assert.equal(applySleepDamage(5, 10, 100), 0);
  assert.equal(applySleepDamage(0, 10, 100), 0);
});

test('W2 AC14 recoverSleep', () => {
  assert.equal(recoverSleep(50, 1, 1000, 100), 51);
  assert.equal(recoverSleep(99.5, 3, 1000, 100), 100);
  assert.equal(recoverSleep(0, 3, 500, 100), 1.5);
  assert.equal(recoverSleep(100, 3, 1000, 100), 100);
});

test('W2 AC15 recoveryRateFor', () => {
  const rates = { slow: 3, normal: 1, brisk: 1 };
  assert.equal(recoveryRateFor('slow', rates), 3);
  assert.equal(recoveryRateFor('normal', rates), 1);
  assert.equal(recoveryRateFor('brisk', rates), 1);
});

test('W2 AC16 canRecover', () => {
  assert.equal(canRecover(2999, 3000), false);
  assert.equal(canRecover(3000, 3000), true);
});

test('W2 AC17 meterFillWidth', () => {
  assert.equal(meterFillWidth(100, 100, 240), 240);
  assert.equal(meterFillWidth(50, 100, 240), 120);
  assert.equal(meterFillWidth(0, 100, 240), 0);
  assert.equal(meterFillWidth(-5, 100, 240), 0);
  assert.equal(meterFillWidth(150, 100, 240), 240);
});

test('W2 AC18 meterLabel rounds up', () => {
  assert.equal(meterLabel(100), 'Sleep 100');
  assert.equal(meterLabel(90), 'Sleep 90');
  assert.equal(meterLabel(89.2), 'Sleep 90');
  assert.equal(meterLabel(0.3), 'Sleep 1');
  assert.equal(meterLabel(0), 'Sleep 0');
});
