// Lift state. Pure functions: they return a new state and never change the old one.

export function initialLift() {
  return { isLifted: false, heldMs: 0, mustRelease: false };
}

export function updateLift(state, isHeld, deltaMs, maxHoldMs) {
  if (!isHeld) return initialLift();
  if (state.mustRelease) {
    return { isLifted: false, heldMs: state.heldMs, mustRelease: true };
  }
  const heldMs = state.heldMs + deltaMs;
  if (heldMs >= maxHoldMs) {
    return { isLifted: false, heldMs, mustRelease: true }; // arms got tired
  }
  return { isLifted: true, heldMs, mustRelease: false };
}
