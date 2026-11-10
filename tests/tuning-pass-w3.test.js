import { test } from 'node:test';
import assert from 'node:assert/strict';
import * as config from '../src/config.js';
import { initialLift, updateLift } from '../src/logic/lift.js';
import { advanceScroll } from '../src/logic/scroll.js';
import { obstacleIndexesOverWheel, checkPothole } from '../src/logic/obstacles.js';

test('T AC2 config has the option-B tuning values exactly', () => {
  const b = {
    OBSTACLE_SPACING: 700, CROSSING_CHANCE: 0.4, LIFT_MAX_HOLD_MS: 700,
    SLEEP_RECOVERY_SLOW: 0.75, SLEEP_RECOVERY_NORMAL: 0.25, SLEEP_RECOVERY_BRISK: 0.25,
    SLEEP_RECOVERY_DELAY_MS: 5000, SHUSH_RESTORE: 10, SHUSH_COOLDOWN_MS: 45000,
  };
  for (const [k, v] of Object.entries(b)) assert.strictEqual(config[k], v, k);
});

// Same method as P2 AC11, with lift max 700 (the new value, as a literal).
function crossPothole(speed, pressOffsetMs) {
  const arrival = ((1200 - 311) / speed) * 1000;
  const pressAt = arrival + pressOffsetMs;
  let lift = initialLift(), scroll = 0, last = -1, total = 0;
  for (let t = 0; t < arrival + 3000; t += 16) {
    const held = t >= pressAt;
    lift = updateLift(lift, held, 16, 700);
    const prev = scroll;
    scroll = advanceScroll(scroll, speed, 16);
    for (const k of obstacleIndexesOverWheel(prev, scroll, 1200, 700, 311, 30)) {
      if (k !== 0) continue;
      const r = checkPothole(k, lift.isLifted, last, 10);
      total += r.damage;
      last = r.lastJoltedIndex;
    }
  }
  return total;
}

test('T AC4 pothole simulation with lift max 700', () => {
  assert.equal(crossPothole(70, -200), 0);
  assert.equal(crossPothole(70, -350), 10);
  assert.equal(crossPothole(120, -350), 0);
  assert.equal(crossPothole(120, -550), 10);
  assert.equal(crossPothole(180, -450), 0);
  assert.equal(crossPothole(180, -650), 10);
});

test('T AC5 config sanity checks', () => {
  assert.ok(config.SLEEP_RECOVERY_SLOW > config.SLEEP_RECOVERY_NORMAL);
  assert.ok((config.OBSTACLE_SPACING - config.CROSSING_WIDTH) / config.SPEED_BRISK >= 2);
  assert.ok(config.LIFT_MAX_HOLD_MS - (1000 * config.POTHOLE_WIDTH) / config.SPEED_SLOW >= 150);
});
