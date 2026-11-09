import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

test('AC8 no file in src/logic mentions phaser', () => {
  const dir = new URL('../src/logic/', import.meta.url).pathname;
  const files = readdirSync(dir);
  assert.ok(files.length > 0);
  for (const f of files) {
    const text = readFileSync(join(dir, f), 'utf8');
    assert.ok(!/phaser/i.test(text), `${f} mentions phaser`);
  }
});
