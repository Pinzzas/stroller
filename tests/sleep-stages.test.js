import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import * as config from '../src/config.js';
import {
  stageFor, stageLabel, damageFactorFor, stageDamage, gapFor,
} from '../src/logic/stages.js';
import {
  extendPlan, obstacleIndexesReachingWheel, obstacleIndexAt, visibleObstacleIndexes,
} from '../src/logic/obstacles.js';
import { advanceScroll } from '../src/logic/scroll.js';
import { startChat, isChatting, updateChat } from '../src/logic/chat.js';

const near = (a, b, eps = 0.000001) => assert.ok(Math.abs(a - b) <= eps, `${a} vs ${b}`);

test('W5P1 AC3 stageFor', () => {
  for (const [ms, s] of [[0, 0], [59999, 0], [60000, 1], [119999, 1], [120000, 2], [600000, 2]]) {
    assert.equal(stageFor(ms, 60000), s, `ms ${ms}`);
  }
});

test('W5P1 AC4 stageLabel', () => {
  const names = ['Light', 'Deep', 'Dreamy'];
  assert.equal(stageLabel(0, names), 'Light sleep');
  assert.equal(stageLabel(1, names), 'Deep sleep');
  assert.equal(stageLabel(2, names), 'Dreamy sleep');
});

test('W5P1 AC5 damageFactorFor', () => {
  near(damageFactorFor(0, 0.2), 1);
  near(damageFactorFor(1, 0.2), 0.8);
  near(damageFactorFor(2, 0.2), 0.6);
  near(damageFactorFor(2, 0.6), 0);
  assert.ok(damageFactorFor(2, 0.9) >= 0, 'never below 0');
});

test('W5P1 AC6 stageDamage', () => {
  const cases = [[10, 0, 10], [10, 1, 8], [10, 2, 6], [20, 1, 16], [20, 2, 12], [25, 1, 20], [25, 2, 15], [0, 2, 0]];
  for (const [d, s, want] of cases) near(stageDamage(d, s, 0.2), want);
});

test('W5P1 AC7 gapFor', () => {
  const gaps = { light: 700, deep: 500, dreamy: 400 };
  assert.equal(gapFor(0, gaps), 700);
  assert.equal(gapFor(1, gaps), 500);
  assert.equal(gapFor(2, gaps), 400);
});

test('W5P1 AC8 extendPlan', () => {
  assert.deepEqual(extendPlan([], 1000, 1200, 700), [1200]);
  assert.deepEqual(extendPlan([], 3300, 1200, 700), [1200, 1900, 2600, 3300]);
  assert.deepEqual(extendPlan([1200, 1900], 2500, 1200, 500), [1200, 1900, 2400, 2900]);
  assert.deepEqual(extendPlan([1200], 1200, 1200, 700), [1200]);
  assert.deepEqual(extendPlan([1200], 5000, 1200, 0), [1200]);
  assert.deepEqual(extendPlan([], 5000, 1200, -5), [1200]);
  const input = [1200, 1900];
  const out = extendPlan(input, 5000, 1200, 500);
  assert.deepEqual(input, [1200, 1900]);
  assert.notEqual(out, input);
  const same = extendPlan(input, 100, 1200, 500);
  assert.notEqual(same, input);
});

test('W5P1 AC9 uneven plan helpers', () => {
  const plan = [1200, 1900, 2400, 2800];
  assert.deepEqual(obstacleIndexesReachingWheel(plan, 2080, 2100, 311, 0), [2]);
  assert.equal(obstacleIndexAt(plan, 2500, 180), 2);
  assert.equal(obstacleIndexAt(plan, 2700, 180), -1);
  assert.deepEqual(visibleObstacleIndexes(plan, 2000, 240, 960), [1, 2, 3]);
});

test('W5P1 AC10 ramp simulation: 10 / 13 / 17 obstacles per minute', () => {
  const gaps = { light: 700, deep: 500, dreamy: 400 };
  let scroll = 0;
  let plan = [];
  let elapsed = 0;
  const counts = [0, 0, 0];
  for (let frame = 0; frame < 180000 / 16; frame++) {
    elapsed += 16;
    const stage = stageFor(elapsed, 60000);
    plan = extendPlan(plan, scroll + 311 + 1400, 1200, gapFor(stage, gaps));
    const prev = scroll;
    scroll = advanceScroll(scroll, 120, 16);
    const reached = obstacleIndexesReachingWheel(plan, prev, scroll, 311, 0);
    counts[Math.min(2, Math.floor((elapsed - 1) / 60000))] += reached.length;
  }
  assert.deepEqual(counts, [10, 13, 17]);
});

test('W5P1 AC11 chat drain in Deep is 12', () => {
  let state = startChat(config.NEIGHBOUR_CHAT_MS);
  let total = 0;
  let guard = 0;
  while (isChatting(state) && guard++ < 10000) {
    const r = updateChat(state, 16, config.NEIGHBOUR_DRAIN_PER_SEC);
    state = r.state;
    total += stageDamage(r.drain, 1, 0.2);
  }
  near(total, 12, 0.001);
});

test('W5P1 AC12 config sanity', () => {
  const c = config;
  assert.ok(c.OBSTACLE_GAP_LIGHT > c.OBSTACLE_GAP_DEEP);
  assert.ok(c.OBSTACLE_GAP_DEEP > c.OBSTACLE_GAP_DREAMY);
  assert.ok((c.OBSTACLE_GAP_LIGHT - c.DOG_FENCE_WIDTH) / c.SPEED_BRISK >= 2);
  assert.ok((c.OBSTACLE_GAP_DREAMY - c.DOG_FENCE_WIDTH) / c.SPEED_BRISK >= 0.85);
  assert.ok((c.OBSTACLE_GAP_DREAMY - c.CROSSING_WIDTH) / c.SPEED_BRISK >= 1.2);
  assert.ok(c.OBSTACLE_PLAN_AHEAD > c.HEARD_WARNING_DISTANCE);
  assert.ok(c.OBSTACLE_PLAN_AHEAD > c.GAME_WIDTH - 311);
  assert.ok(1 - 2 * c.SLEEP_STAGE_DAMAGE_CUT > 0);
});

function walk(dir) {
  const out = [];
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) out.push(...walk(p));
    else out.push(p);
  }
  return out;
}

test('W5P1 AC13 config values, no OBSTACLE_SPACING, logic stays pure', () => {
  const c = config;
  assert.equal(c.SLEEP_STAGE_MS, 60000);
  assert.deepEqual(c.SLEEP_STAGE_NAMES, ['Light', 'Deep', 'Dreamy']);
  assert.equal(c.SLEEP_STAGE_DAMAGE_CUT, 0.2);
  assert.equal(c.OBSTACLE_GAP_LIGHT, 700);
  assert.equal(c.OBSTACLE_GAP_DEEP, 500);
  assert.equal(c.OBSTACLE_GAP_DREAMY, 400);
  assert.equal(c.OBSTACLE_PLAN_AHEAD, 1400);
  assert.ok(!('OBSTACLE_SPACING' in c));
  const srcDir = new URL('../src/', import.meta.url).pathname;
  for (const f of walk(srcDir)) {
    assert.ok(!readFileSync(f, 'utf8').includes('OBSTACLE_SPACING'), `${f} mentions OBSTACLE_SPACING`);
  }
  for (const f of walk(join(srcDir, 'logic'))) {
    const text = readFileSync(f, 'utf8');
    assert.ok(!text.includes('Math.random'), `${f} uses Math.random`);
    assert.ok(!/phaser/i.test(text), `${f} mentions phaser`);
  }
});
