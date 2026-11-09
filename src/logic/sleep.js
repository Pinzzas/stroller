// Sleep meter maths. Pure functions.

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

export function applySleepDamage(sleep, damage, max) {
  return clamp(sleep - damage, 0, max);
}

export function recoverSleep(sleep, ratePerSec, deltaMs, max) {
  return clamp(sleep + (ratePerSec * deltaMs) / 1000, 0, max);
}

// rates is { slow, normal, brisk }.
export function recoveryRateFor(level, rates) {
  return rates[level];
}

export function canRecover(msSinceLastHit, delayMs) {
  return msSinceLastHit >= delayMs;
}

export function meterFillWidth(sleep, max, fullWidth) {
  return clamp((fullWidth * sleep) / max, 0, fullWidth);
}

// Rounded up, so it only shows 0 when truly empty.
export function meterLabel(sleep) {
  return 'Sleep ' + Math.ceil(sleep);
}
