// Potholes and curbs along the street. Pure functions.

// Where obstacle number `index` has its left edge on screen. plan = obstacle left edges.
export function obstacleScreenX(plan, index, scroll) {
  return plan[index] - scroll;
}

// A number from 0 (included) to 1 (not included). Same seed and index, same number.
// One mixing step of the "mulberry32" generator.
export function obstacleRandom(seed, index) {
  let t = (seed + (index + 1) * 0x6d2b79f5) >>> 0;
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
}

// Which kind of obstacle a random value (0 to 1) gives. The ranges are stacked in this
// order: crossing, pigeons, dog, neighbour, siren; the rest is pothole.
// chances is { crossing, pigeons, dog, neighbour, siren }.
// Rounds the running total so ranges like 0.25 + 0.15 + 0.15 + 0.15 add up exactly.
function roundLimit(limit) {
  return Math.round(limit * 1000000) / 1000000;
}

export function obstacleKindFor(randomValue, chances) {
  let limit = chances.crossing;
  if (randomValue < roundLimit(limit)) return 'crossing';
  limit += chances.pigeons;
  if (randomValue < roundLimit(limit)) return 'pigeons';
  limit += chances.dog;
  if (randomValue < roundLimit(limit)) return 'dog';
  limit += chances.neighbour;
  if (randomValue < roundLimit(limit)) return 'neighbour';
  limit += chances.siren || 0;
  if (randomValue < roundLimit(limit)) return 'siren';
  return 'pothole';
}

// Makes the street plan longer (the plan is the list of obstacle left edges, in order).
// An empty plan starts with firstX. Then it adds `gap` to the last edge until the last edge
// reaches upTo. A gap of 0 or less adds nothing. Returns a new array.
export function extendPlan(plan, upTo, firstX, gap) {
  const result = plan.slice();
  if (result.length === 0) result.push(firstX);
  if (gap <= 0) return result; // avoids an endless loop
  while (result[result.length - 1] < upTo) {
    result.push(result[result.length - 1] + gap);
  }
  return result;
}

// Indexes of all obstacles at least partly on screen, in increasing order.
export function visibleObstacleIndexes(plan, scroll, width, viewWidth) {
  const result = [];
  for (let k = 0; k < plan.length; k++) {
    const x = obstacleScreenX(plan, k, scroll);
    if (x >= viewWidth) break;
    if (x + width > 0) result.push(k);
  }
  return result;
}

// Indexes whose left edge (plus offset) reached the wheel during this frame:
// prevScroll + wheelX < plan[k] + offset <= scroll + wheelX
export function obstacleIndexesReachingWheel(plan, prevScroll, scroll, wheelX, offset) {
  const result = [];
  if (scroll <= prevScroll) return result;
  const from = prevScroll + wheelX;
  const to = scroll + wheelX;
  for (let k = 0; k < plan.length; k++) {
    const left = plan[k] + offset;
    if (left > to) break;
    if (left > from) result.push(k);
  }
  return result;
}

// Indexes whose hole (left, left + width] overlaps the wheel's movement
// this frame (prevScroll + wheelX, scroll + wheelX].
export function obstacleIndexesOverWheel(plan, prevScroll, scroll, wheelX, width) {
  const result = [];
  if (scroll <= prevScroll) return result;
  const from = prevScroll + wheelX;
  const to = scroll + wheelX;
  for (let k = 0; k < plan.length; k++) {
    const left = plan[k];
    if (left >= to) break;
    if (left + width > from) result.push(k);
  }
  return result;
}

// A pothole costs sleep once, and only if the wheels are not lifted.
export function checkPothole(index, isLifted, lastJoltedIndex, damage) {
  if (!isLifted && index > lastJoltedIndex) {
    return { damage, lastJoltedIndex: index };
  }
  return { damage: 0, lastJoltedIndex };
}

// Each curb of a crossing: safe only when lifted and slowed down. rules = { damage, maxSafeSpeed }.
export function curbDamage(isLifted, speed, rules) {
  if (isLifted && speed <= rules.maxSafeSpeed) return 0;
  return rules.damage;
}

// Index of the obstacle with L < position <= L + width, or -1 if none.
export function obstacleIndexAt(plan, position, width) {
  for (let k = 0; k < plan.length; k++) {
    if (plan[k] >= position) break;
    if (position <= plan[k] + width) return k;
  }
  return -1;
}

// Indexes with L - ahead < position <= L + width, in increasing order.
export function obstacleIndexesNear(plan, position, ahead, width) {
  const result = [];
  for (let k = 0; k < plan.length; k++) {
    if (plan[k] - ahead >= position) break;
    if (position <= plan[k] + width) result.push(k);
  }
  return result;
}
