// Test bumps along the street. Pure functions.

// Where bump number `index` is on screen.
export function bumpScreenX(index, scroll, firstX, spacing) {
  return firstX + index * spacing - scroll;
}

// Indexes of all bumps at least partly on screen, in increasing order.
export function visibleBumpIndexes(scroll, firstX, spacing, bumpWidth, viewWidth) {
  const result = [];
  if (spacing <= 0) return result; // avoids an endless loop
  for (let k = 0; ; k++) {
    const x = bumpScreenX(k, scroll, firstX, spacing);
    if (x >= viewWidth) break;
    if (x + bumpWidth > 0) result.push(k);
  }
  return result;
}

// How many bumps (k >= 0) had their left edge reach the wheel during this frame:
// prevScroll + wheelX < firstX + k * spacing <= scroll + wheelX
export function bumpsReachingWheel(prevScroll, scroll, firstX, spacing, wheelX) {
  if (scroll <= prevScroll || spacing <= 0) return 0;
  return countBumpsUpTo(scroll + wheelX, firstX, spacing) - countBumpsUpTo(prevScroll + wheelX, firstX, spacing);
}

// How many bumps (k >= 0) have their left edge at or before `position`.
function countBumpsUpTo(position, firstX, spacing) {
  if (position < firstX) return 0;
  return Math.floor((position - firstX) / spacing) + 1;
}

// 0 if lifted, otherwise the jolt damage.
export function bumpDamage(isLifted, joltDamage) {
  return isLifted ? 0 : joltDamage;
}
