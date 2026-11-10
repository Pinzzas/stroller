import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import * as config from '../src/config.js';
import { initialRun, updateRun, canRestart, formatRunTime, endTimeText, pointersToAdd } from '../src/logic/run.js';

test('R3 AC2 initialRun', () => {
  assert.deepEqual(initialRun(), { phase: 'walking', elapsedMs: 0, msSinceEnd: 0 });
});

test('R3 AC3 walking with sleep left keeps walking', () => {
  assert.deepEqual(updateRun({ phase: 'walking', elapsedMs: 1000, msSinceEnd: 0 }, 50, 16),
    { phase: 'walking', elapsedMs: 1016, msSinceEnd: 0 });
});

test('R3 AC4 sleep 0 or below ends the run in that frame', () => {
  const s = { phase: 'walking', elapsedMs: 1000, msSinceEnd: 0 };
  const want = { phase: 'ended', elapsedMs: 1016, msSinceEnd: 0 };
  assert.deepEqual(updateRun(s, 0, 16), want);
  assert.deepEqual(updateRun(s, -5, 16), want);
});

test('R3 AC5 ended stays ended and only msSinceEnd grows', () => {
  const s = { phase: 'ended', elapsedMs: 1016, msSinceEnd: 500 };
  const want = { phase: 'ended', elapsedMs: 1016, msSinceEnd: 516 };
  assert.deepEqual(updateRun(s, 0, 16), want);
  assert.deepEqual(updateRun(s, 100, 16), want);
});

test('R3 AC6 updateRun does not change its input', () => {
  for (const [s, sleep] of [
    [{ phase: 'walking', elapsedMs: 1000, msSinceEnd: 0 }, 50],
    [{ phase: 'walking', elapsedMs: 1000, msSinceEnd: 0 }, 0],
    [{ phase: 'ended', elapsedMs: 1016, msSinceEnd: 500 }, 0],
  ]) {
    const copy = { ...s };
    Object.freeze(s);
    const out = updateRun(s, sleep, 16);
    assert.notEqual(out, s);
    assert.deepEqual(s, copy);
  }
});

test('R3 AC7 canRestart', () => {
  assert.equal(canRestart({ phase: 'walking', elapsedMs: 0, msSinceEnd: 5000 }, 1000), false);
  assert.equal(canRestart({ phase: 'walking', elapsedMs: 0, msSinceEnd: 0 }, 0), false);
  assert.equal(canRestart({ phase: 'ended', msSinceEnd: 999 }, 1000), false);
  assert.equal(canRestart({ phase: 'ended', msSinceEnd: 1000 }, 1000), true);
});

test('R3 AC8 formatRunTime', () => {
  const cases = [[0, '0:00'], [999, '0:00'], [59999, '0:59'], [60000, '1:00'], [83500, '1:23'], [600000, '10:00']];
  for (const [ms, text] of cases) assert.equal(formatRunTime(ms), text, String(ms));
});

test('R3 AC9 endTimeText', () => {
  assert.equal(endTimeText(83500), 'Asleep for 1:23');
});

test('R3 AC10 pointersToAdd', () => {
  assert.equal(pointersToAdd(1, 2), 1);
  assert.equal(pointersToAdd(2, 2), 0);
  assert.equal(pointersToAdd(3, 2), 0);
});

test('R3 AC11 touch points are set once, not added on each restart', () => {
  const read = (f) => readFileSync(new URL('../src/' + f, import.meta.url), 'utf8');
  const touch = read('TouchButtons.js');
  const main = read('main.js');
  const asksEachTime = /addPointer\s*\(/.test(touch);
  const guarded = /TOUCH_POINTERS/.test(touch) && /pointersTotal|pointersToAdd|input\.manager/.test(touch);
  const setOnce = /activePointers\s*:\s*TOUCH_POINTERS/.test(main);
  assert.ok(!asksEachTime || guarded, 'TouchButtons.js calls addPointer without a guard');
  assert.ok(asksEachTime ? guarded : setOnce, 'main.js must set activePointers: TOUCH_POINTERS');
});

test('R3 AC12 no file in src/logic mentions phaser', () => {
  const dir = new URL('../src/logic/', import.meta.url).pathname;
  for (const f of readdirSync(dir)) {
    assert.ok(!/phaser/i.test(readFileSync(join(dir, f), 'utf8')), `${f} mentions phaser`);
  }
});

test('R3 AC13 config exports the new values exactly', () => {
  const expected = {
    RUN_RESTART_DELAY_MS: 1000, TOUCH_POINTERS: 2, END_PANEL_WIDTH: 360, END_PANEL_HEIGHT: 200,
    COLOR_END_PANEL: 0xffffff, END_TITLE_FONT_SIZE: 28, END_TITLE_OFFSET_Y: 40,
    END_TEXT_FONT_SIZE: 18, END_TIME_OFFSET_Y: 80, END_BUTTON_WIDTH: 220, END_BUTTON_HEIGHT: 56,
    END_BUTTON_OFFSET_Y: 120, END_BUTTON_FONT_SIZE: 20, COLOR_END_BUTTON: 0xb7a6e0,
  };
  for (const [n, v] of Object.entries(expected)) assert.equal(config[n], v, n);
});
