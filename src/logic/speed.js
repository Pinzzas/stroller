// Speed levels. Pure functions.

const LEVELS = ['slow', 'normal', 'brisk'];

// step is +1 (faster) or -1 (slower). Stops at the ends. Unknown level counts as normal.
export function changeSpeedLevel(level, step) {
  let index = LEVELS.indexOf(level);
  if (index === -1) index = 1;
  const next = Math.min(Math.max(index + step, 0), LEVELS.length - 1);
  return LEVELS[next];
}

// speeds is { slow, normal, brisk }.
export function speedForLevel(level, speeds) {
  return speeds[level];
}
