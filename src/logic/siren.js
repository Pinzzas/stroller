// The passing siren. Pure functions, no drawing.

// How loud the siren is, 0 (far) to 1 (at the peak). left = start of the peak.
export function sirenLoudness(position, left, ahead) {
  const share = (position - (left - ahead)) / ahead;
  return Math.min(1, Math.max(0, share));
}

// True while the wheel is in the peak: left < position <= left + peakWidth.
export function inSirenPeak(position, left, peakWidth) {
  return position > left && position <= left + peakWidth;
}

// A Shush calms the siren only in the peak, only if a charge was used, and only once.
export function calmSiren(index, inPeak, shushUsed, lastSettledIndex) {
  if (inPeak && shushUsed && index > lastSettledIndex) {
    return { calmed: true, lastSettledIndex: index };
  }
  return { calmed: false, lastSettledIndex };
}

// A siren that is not settled by the end of the peak hits once.
export function checkSirenMiss(index, lastSettledIndex, damage) {
  if (index > lastSettledIndex) return { damage, lastSettledIndex: index };
  return { damage: 0, lastSettledIndex };
}

// Which heard warning to show: null, 'dog' or 'siren' (the first pending one).
// kinds[i] is the kind of indexes[i].
export function heardWarningFor(indexes, kinds, lastBarkedIndex, lastSettledSiren) {
  for (let i = 0; i < indexes.length; i++) {
    if (kinds[i] === 'dog' && indexes[i] > lastBarkedIndex) return 'dog';
    if (kinds[i] === 'siren' && indexes[i] > lastSettledSiren) return 'siren';
  }
  return null;
}
