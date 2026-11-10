// The run: walking until sleep hits zero, then ended. Pure functions.

export function initialRun() {
  return { phase: 'walking', elapsedMs: 0, msSinceEnd: 0 };
}

// Walking: time counts up, and the run ends when sleep is 0 or less.
// Ended: only the time since the end counts up.
export function updateRun(state, sleep, deltaMs) {
  if (state.phase === 'ended') {
    return { phase: 'ended', elapsedMs: state.elapsedMs, msSinceEnd: state.msSinceEnd + deltaMs };
  }
  const elapsedMs = state.elapsedMs + deltaMs;
  if (sleep <= 0) return { phase: 'ended', elapsedMs, msSinceEnd: 0 };
  return { phase: 'walking', elapsedMs, msSinceEnd: 0 };
}

// True once the run has ended and the wait is over.
export function canRestart(state, delayMs) {
  return state.phase === 'ended' && state.msSinceEnd >= delayMs;
}

// Whole seconds (rounded down) as m:ss, e.g. 83500 -> '1:23'.
export function formatRunTime(ms) {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return minutes + ':' + String(seconds).padStart(2, '0');
}

export function endTimeText(ms) {
  return 'Asleep for ' + formatRunTime(ms);
}

// How many touch points still need adding to reach `wanted`.
export function pointersToAdd(current, wanted) {
  return Math.max(0, wanted - current);
}
