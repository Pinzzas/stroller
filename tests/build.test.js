import { test } from 'node:test';
import assert from 'node:assert/strict';
import { execSync } from 'node:child_process';
import { readFileSync, existsSync } from 'node:fs';

test('AC10 npm run build makes dist/index.html loading script from /stroller/', { timeout: 180000 }, () => {
  const root = new URL('..', import.meta.url).pathname;
  execSync('npm run build', { cwd: root, stdio: 'pipe' });
  const file = root + 'dist/index.html';
  assert.ok(existsSync(file), 'dist/index.html missing');
  const html = readFileSync(file, 'utf8');
  const m = html.match(/<script[^>]+src="([^"]+)"/);
  assert.ok(m, 'no script tag with src');
  assert.ok(m[1].startsWith('/stroller/'), `script src is ${m[1]}`);
});
