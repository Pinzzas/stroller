// One new kind of obstacle at a time, in every walk. Pure functions.
import { obstacleKindFor } from './obstacles.js';

// The kinds that can appear at obstacle number `index`.
export function unlockedKinds(index, order, every) {
  return order.slice(0, Math.floor(index / every));
}

// A copy of chances with every kind that is not unlocked set to 0.
export function introChances(chances, unlocked) {
  const result = {};
  for (const kind of Object.keys(chances)) {
    result[kind] = unlocked.includes(kind) ? chances[kind] : 0;
  }
  return result;
}

// The kind that joins at this obstacle (first of each block), or null.
export function newKindAt(index, order, every) {
  if (index > 0 && index % every === 0 && index / every <= order.length) {
    return order[index / every - 1];
  }
  return null;
}

// The kind of obstacle number `index`, given a random value from 0 to 1.
export function obstacleKindForIndex(index, randomValue, chances, order, every) {
  const forced = newKindAt(index, order, every);
  if (forced !== null) return forced;
  return obstacleKindFor(randomValue, introChances(chances, unlockedKinds(index, order, every)));
}
