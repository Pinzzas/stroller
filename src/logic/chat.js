// The chatty neighbour: stopped while they talk. Pure functions.

export function initialChat() {
  return { msLeft: 0 };
}

export function startChat(durationMs) {
  return { msLeft: durationMs };
}

export function isChatting(state) {
  return state.msLeft > 0;
}

// Counts the chat down. Returns the new state and the sleep to drain this frame.
export function updateChat(state, deltaMs, drainPerSec) {
  if (!isChatting(state)) return { state: { msLeft: 0 }, drain: 0 };
  const used = Math.min(deltaMs, state.msLeft);
  return {
    state: { msLeft: Math.max(0, state.msLeft - deltaMs) },
    drain: (drainPerSec * used) / 1000,
  };
}

// The neighbour stops you if you reach them slower than minSafeSpeed.
export function neighbourStops(speed, minSafeSpeed) {
  return speed < minSafeSpeed;
}

// The street stands still while chatting.
export function streetSpeed(speed, chatState) {
  return isChatting(chatState) ? 0 : speed;
}
