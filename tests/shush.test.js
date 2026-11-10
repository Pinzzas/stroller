import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import * as config from '../src/config.js';
import { initialShush, useShush, updateShush, shushLabel } from '../src/logic/shush.js';

const rules = { restore: 15, maxSleep: 100, cooldownMs: 30000 };

test('S AC2 initialShush', () => {
  assert.deepEqual(initialShush(2), { charges: 2, cooldownMsLeft: 0 });
});

test('S AC3 first shush uses one charge, restores 15', () => {
  const r = useShush({ charges: 2, cooldownMsLeft: 0 }, 50, rules);
  assert.deepEqual(r.state, { charges: 1, cooldownMsLeft: 0 });
  assert.equal(r.sleep, 65);
  assert.equal(r.used, true);
});

test('S AC4 last charge starts the cooldown', () => {
  const r = useShush({ charges: 1, cooldownMsLeft: 0 }, 50, rules);
  assert.deepEqual(r.state, { charges: 0, cooldownMsLeft: 30000 });
  assert.equal(r.sleep, 65);
  assert.equal(r.used, true);
});

test('S AC5 no shush during cooldown', () => {
  const r = useShush({ charges: 0, cooldownMsLeft: 12000 }, 50, rules);
  assert.deepEqual(r.state, { charges: 0, cooldownMsLeft: 12000 });
  assert.equal(r.sleep, 50);
  assert.equal(r.used, false);
});

test('S AC6 sleep is capped at the maximum', () => {
  const r = useShush({ charges: 2, cooldownMsLeft: 0 }, 95, rules);
  assert.equal(r.sleep, 100);
  assert.equal(r.state.charges, 1);
  assert.equal(r.used, true);
});

test('S AC7 shush at full sleep still uses a charge', () => {
  const a = useShush({ charges: 2, cooldownMsLeft: 0 }, 100, rules);
  assert.deepEqual(a.state, { charges: 1, cooldownMsLeft: 0 });
  assert.equal(a.sleep, 100);
  assert.equal(a.used, true);
  const b = useShush({ charges: 1, cooldownMsLeft: 0 }, 100, rules);
  assert.deepEqual(b.state, { charges: 0, cooldownMsLeft: 30000 });
  assert.equal(b.sleep, 100);
  assert.equal(b.used, true);
});

test('S AC8 functions never change the state passed in', () => {
  for (const s of [
    { charges: 2, cooldownMsLeft: 0 },
    { charges: 1, cooldownMsLeft: 0 },
    { charges: 0, cooldownMsLeft: 12000 },
  ]) {
    const copy = { ...s };
    Object.freeze(s);
    useShush(s, 50, rules);
    updateShush(s, 16, 2);
    assert.deepEqual(s, copy);
  }
});

test('S AC9 updateShush', () => {
  assert.deepEqual(updateShush({ charges: 0, cooldownMsLeft: 30000 }, 16, 2), { charges: 0, cooldownMsLeft: 29984 });
  assert.deepEqual(updateShush({ charges: 0, cooldownMsLeft: 16 }, 16, 2), { charges: 2, cooldownMsLeft: 0 });
  assert.deepEqual(updateShush({ charges: 0, cooldownMsLeft: 10 }, 16, 2), { charges: 2, cooldownMsLeft: 0 });
  assert.deepEqual(updateShush({ charges: 1, cooldownMsLeft: 0 }, 16, 2), { charges: 1, cooldownMsLeft: 0 });
});

test('S AC10 cooldown lasts exactly 1875 calls of 16 ms', () => {
  let s = { charges: 0, cooldownMsLeft: 30000 };
  let calls = 0;
  while (s.charges === 0) {
    s = updateShush(s, 16, 2);
    calls++;
    assert.ok(calls <= 1875, 'took too long');
    if (calls < 1875) assert.equal(s.charges, 0, `charges back early at call ${calls}`);
  }
  assert.equal(calls, 1875);
  assert.deepEqual(s, { charges: 2, cooldownMsLeft: 0 });
});

test('S AC11 shushLabel', () => {
  assert.equal(shushLabel({ charges: 2, cooldownMsLeft: 0 }), 'Shush: 2 left');
  assert.equal(shushLabel({ charges: 1, cooldownMsLeft: 0 }), 'Shush: 1 left');
  assert.equal(shushLabel({ charges: 0, cooldownMsLeft: 30000 }), 'Shush: back in 30s');
  assert.equal(shushLabel({ charges: 0, cooldownMsLeft: 29001 }), 'Shush: back in 30s');
  assert.equal(shushLabel({ charges: 0, cooldownMsLeft: 1 }), 'Shush: back in 1s');
});

test('S AC12 no file in src/logic mentions phaser', () => {
  const dir = new URL('../src/logic/', import.meta.url).pathname;
  const files = readdirSync(dir);
  assert.ok(files.includes('shush.js'));
  for (const f of files) {
    assert.ok(!/phaser/i.test(readFileSync(join(dir, f), 'utf8')), `${f} mentions phaser`);
  }
});

test('S AC13 config exports every Shush tuning value with the exact value', () => {
  const expected = {
    SHUSH_MAX_CHARGES: 2, SHUSH_RESTORE: 10, SHUSH_COOLDOWN_MS: 45000,
    SHUSH_TEXT_MS: 1000, SHUSH_TEXT_FONT_SIZE: 22, SHUSH_TEXT_GAP: 20, HUD_LINE_GAP: 8,
  };
  for (const [name, value] of Object.entries(expected)) {
    assert.ok(name in config, `missing export ${name}`);
    assert.equal(config[name], value, `${name} has wrong value`);
  }
});
