// Potholes and curbs along the street. Pure functions.

// Where obstacle number `index` has its left edge on screen.
export function obstacleScreenX(index, scroll, firstX, spacing) {
  return firstX + index * spacing - scroll;
}

// A number from 0 (included) to 1 (not included). Same seed and index, same number.
// One mixing step of the "mulberry32" generator.
export function obstacleRandom(seed, index) {
  let t = (seed + (index + 1) * 0x6d2b79f5) >>> 0;
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
}

// 'curb' for small random values, otherwise 'pothole'.
export function obstacleTypeFor(randomValue, curbChance) {
  return randomValue < curbChance ? 'curb' : 'pothole';
}

// Indexes of all obstacles at least partly on screen, in increasing order.
export function visibleObstacleIndexes(scroll, firstX, spacing, width, viewWidth) {
  const result = [];
  if (spacing <= 0) return result; // avoids an endless loop
  for (let k = 0; ; k++) {
    const x = obstacleScreenX(k, scroll, firstX, spacing);
    if (x >= viewWidth) break;
    if (x + width > 0) result.push(k);
  }
  return result;
}

// Indexes (k >= 0) whose left edge reached the wheel during this frame:
// prevScroll + wheelX < firstX + k * spacing <= scroll + wheelX
export function obstacleIndexesReachingWheel(prevScroll, scroll, firstX, spacing, wheelX) {
  const result = [];
  if (scroll <= prevScroll || spacing <= 0) return result;
  const from = prevScroll + wheelX;
  const to = scroll + wheelX;
  for (let k = Math.max(0, Math.floor((from - firstX) / spacing)); ; k++) {
    const left = firstX + k * spacing;
    if (left > to) break;
    if (left > from) result.push(k);
  }
  return result;
}

// Indexes (k >= 0) whose hole (left, left + width] overlaps the wheel's movement
// this frame (prevScroll + wheelX, scroll + wheelX].
export function obstacleIndexesOverWheel(prevScroll, scroll, firstX, spacing, wheelX, width) {
  const result = [];
  if (scroll <= prevScroll || spacing <= 0) return result;
  const from = prevScroll + wheelX;
  const to = scroll + wheelX;
  for (let k = Math.max(0, Math.floor((from - width - firstX) / spacing)); ; k++) {
    const left = firstX + k * spacing;
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

// Curb: safe only when lifted and slowed down. rules = { damage, maxSafeSpeed }.
export function curbDamage(isLifted, speed, rules) {
  if (isLifted && speed <= rules.maxSafeSpeed) return 0;
  return rules.damage;
}
