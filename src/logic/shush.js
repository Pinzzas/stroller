// Shush rules: a few charges, then a wait. Pure functions, no drawing.

export function initialShush(maxCharges) {
  return { charges: maxCharges, cooldownMsLeft: 0 };
}

// rules = { restore, maxSleep, cooldownMs }. Returns { state, sleep, used }.
// A charge is used even when sleep is already full.
export function useShush(state, sleep, rules) {
  if (state.charges <= 0) {
    return { state: { ...state }, sleep, used: false };
  }
  const charges = state.charges - 1;
  return {
    state: { charges, cooldownMsLeft: charges === 0 ? rules.cooldownMs : state.cooldownMsLeft },
    sleep: Math.min(sleep + rules.restore, rules.maxSleep),
    used: true,
  };
}

// Counts the cooldown down; when it ends, all charges come back.
export function updateShush(state, deltaMs, maxCharges) {
  if (state.cooldownMsLeft > 0) {
    const left = state.cooldownMsLeft - deltaMs;
    if (left <= 0) return { charges: maxCharges, cooldownMsLeft: 0 };
    return { charges: state.charges, cooldownMsLeft: left };
  }
  return state;
}

export function shushLabel(state) {
  if (state.charges > 0) return 'Shush: ' + state.charges + ' left';
  return 'Shush: back in ' + Math.ceil(state.cooldownMsLeft / 1000) + 's';
}
