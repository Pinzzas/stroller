// Sleep stages: Light, Deep, Dreamy. Pure functions.

// 0 (Light), 1 (Deep) or 2 (Dreamy), from the time asleep.
export function stageFor(elapsedMs, stageMs) {
  return Math.min(2, Math.floor(elapsedMs / stageMs));
}

// e.g. stage 1 -> 'Deep sleep'.
export function stageLabel(stage, names) {
  return names[stage] + ' sleep';
}

// How much of a hit's damage is left: 1 in Light, less in deeper sleep. Never below 0.
export function damageFactorFor(stage, cut) {
  return Math.max(0, 1 - cut * stage);
}

export function stageDamage(damage, stage, cut) {
  return damage * damageFactorFor(stage, cut);
}

// Gap between obstacles for a stage. gaps = { light, deep, dreamy }.
export function gapFor(stage, gaps) {
  if (stage === 0) return gaps.light;
  if (stage === 1) return gaps.deep;
  return gaps.dreamy;
}
