// Scrolling maths. Pure functions: no drawing, no timers.

// Limit a frame time to 0..maxMs.
export function clampDeltaMs(deltaMs, maxMs) {
  if (Number.isNaN(deltaMs)) return 0; // bad input counts as no time
  return Math.min(Math.max(deltaMs, 0), maxMs);
}

// Move the scroll position forward by speed * time.
export function advanceScroll(offset, speedPxPerSec, deltaMs) {
  return offset + (speedPxPerSec * deltaMs) / 1000;
}

// Fold an offset into 0 (included) .. tileWidth (excluded), also for negatives.
export function wrapOffset(offset, tileWidth) {
  return ((offset % tileWidth) + tileWidth) % tileWidth;
}

// Left x of every tile needed to cover the screen.
export function tileXPositions(offset, tileWidth, viewWidth) {
  const positions = [];
  if (tileWidth <= 0) return positions; // avoids an endless loop
  for (let x = -wrapOffset(offset, tileWidth); x < viewWidth; x += tileWidth) {
    positions.push(x);
  }
  return positions;
}
