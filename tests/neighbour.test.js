import { test } from 'node:test';
import assert from 'node:assert/strict';
import * as config from '../src/config.js';
import {
  initialChat, startChat, isChatting, updateChat, neighbourStops, streetSpeed,
} from '../src/logic/chat.js';
import { obstacleIndexesReachingWheel } from '../src/logic/obstacles.js';
import { applySleepDamage } from '../src/logic/sleep.js';
import { advanceScroll } from '../src/logic/scroll.js';

const near = (a, b, eps = 0.000001) => assert.ok(Math.abs(a - b) <= eps, `${a} vs ${b}`);

test('W4 AC15 chat functions', () => {
  assert.deepEqual(initialChat(), { msLeft: 0 });
  assert.deepEqual(startChat(5000), { msLeft: 5000 });
  assert.equal(isChatting({ msLeft: 1 }), true);
  assert.equal(isChatting({ msLeft: 0 }), false);
  let r = updateChat({ msLeft: 5000 }, 16, 3);
  assert.deepEqual(r.state, { msLeft: 4984 });
  near(r.drain, 0.048);
  r = updateChat({ msLeft: 10 }, 16, 3);
  assert.deepEqual(r.state, { msLeft: 0 });
  near(r.drain, 0.03);
  r = updateChat({ msLeft: 0 }, 16, 3);
  assert.deepEqual(r.state, { msLeft: 0 });
  assert.equal(r.drain, 0);
  const input = { msLeft: 5000 };
  updateChat(input, 16, 3);
  assert.deepEqual(input, { msLeft: 5000 });
});

test('W4 AC16 chat length is 313 calls and drains 15', () => {
  let state = startChat(5000);
  let calls = 0;
  let total = 0;
  while (isChatting(state)) {
    const r = updateChat(state, 16, 3);
    state = r.state;
    total += r.drain;
    calls++;
  }
  assert.equal(calls, 313);
  near(total, 15, 0.001);
});

test('W4 AC17 neighbourStops and streetSpeed', () => {
  assert.equal(neighbourStops(70, 180), true);
  assert.equal(neighbourStops(120, 180), true);
  assert.equal(neighbourStops(180, 180), false);
  assert.equal(streetSpeed(120, { msLeft: 100 }), 0);
  assert.equal(streetSpeed(120, { msLeft: 0 }), 120);
});

function simulate(levelSpeed) {
  const firstX = 1200, spacing = 700, wheelX = 311;
  let scroll = 0, sleep = 100, chat = initialChat();
  let chatsStarted = 0, stillRun = 0, longestStill = 0, stillFrames = 0, neverStill = true;
  for (let i = 0; i < 1500; i++) {
    const speed = streetSpeed(levelSpeed, chat);
    const u = updateChat(chat, 16, config.NEIGHBOUR_DRAIN_PER_SEC);
    chat = u.state;
    sleep = applySleepDamage(sleep, u.drain, config.SLEEP_MAX);
    const prev = scroll;
    scroll = advanceScroll(scroll, speed, 16);
    if (scroll === prev) { stillRun++; stillFrames++; neverStill = false; longestStill = Math.max(longestStill, stillRun); } else stillRun = 0;
    const reached = obstacleIndexesReachingWheel(prev, scroll, firstX, spacing, wheelX);
    if (reached.includes(0) && neighbourStops(levelSpeed, 180)) {
      chat = startChat(5000);
      chatsStarted++;
    }
  }
  return { chatsStarted, longestStill, stillFrames, neverStill, sleep };
}

test('W4 AC18 neighbour simulation: brisk walks past', () => {
  const r = simulate(config.SPEED_BRISK);
  assert.equal(r.chatsStarted, 0);
  assert.equal(r.sleep, 100);
  assert.equal(r.neverStill, true);
});

test('W4 AC18 neighbour simulation: normal chats once for 313 frames', () => {
  const r = simulate(config.SPEED_NORMAL);
  assert.equal(r.chatsStarted, 1);
  assert.equal(r.longestStill, 313);
  assert.equal(r.stillFrames, 313);
  near(r.sleep, 85, 0.01);
});

test('W4 AC18 neighbour simulation: slow chats once for 313 frames', () => {
  const r = simulate(config.SPEED_SLOW);
  assert.equal(r.chatsStarted, 1);
  assert.equal(r.longestStill, 313);
  assert.equal(r.stillFrames, 313);
  near(r.sleep, 85, 0.01);
});

test('W4 AC19 neighbour config values', () => {
  const expected = {
    NEIGHBOUR_CHANCE: 0.15, NEIGHBOUR_MIN_SAFE_SPEED: 180, NEIGHBOUR_CHAT_MS: 5000,
    NEIGHBOUR_DRAIN_PER_SEC: 3, NEIGHBOUR_WIDTH: 30, NEIGHBOUR_HEIGHT: 100,
    COLOR_NEIGHBOUR: 0x9fcfa6, NEIGHBOUR_BUBBLE_WIDTH: 260, NEIGHBOUR_BUBBLE_HEIGHT: 40,
    NEIGHBOUR_BUBBLE_GAP: 10, COLOR_BUBBLE: 0xffffff,
    NEIGHBOUR_CHAT_TEXT: 'Ooh, is the baby asleep? So...',
  };
  for (const [n, v] of Object.entries(expected)) assert.equal(config[n], v, n);
});
