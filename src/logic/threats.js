// Pigeons and the barking dog. Pure functions.

// Pigeons fly off (once per flock) if the street moves faster than rules.maxSafeSpeed.
// rules = { damage, maxSafeSpeed }.
export function checkPigeons(index, speed, lastFlappedIndex, rules) {
  if (speed > rules.maxSafeSpeed && index > lastFlappedIndex) {
    return { damage: rules.damage, lastFlappedIndex: index };
  }
  return { damage: 0, lastFlappedIndex };
}

// The dog barks (once per dog) if the street moves slower than rules.minSafeSpeed.
// rules = { damage, minSafeSpeed }.
export function checkDog(index, speed, lastBarkedIndex, rules) {
  if (speed < rules.minSafeSpeed && index > lastBarkedIndex) {
    return { damage: rules.damage, lastBarkedIndex: index };
  }
  return { damage: 0, lastBarkedIndex };
}

// True if one of the nearby obstacles is a dog that has not barked yet.
// kinds[i] is the kind of indexes[i].
export function warningShown(indexes, kinds, lastBarkedIndex) {
  for (let i = 0; i < indexes.length; i++) {
    if (kinds[i] === 'dog' && indexes[i] > lastBarkedIndex) return true;
  }
  return false;
}
