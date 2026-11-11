# Spec: Sleep stages, the deep-sleep arc, the siren and new obstacles one at a time (W5)

Status: Draft — awaiting owner approval.
Plan item: PLAN.md W5, "Siren, sleep stages and the deep-sleep arc. Introduce
obstacles one at a time." (Sleep minutes and the end screen are the second W5
task, a later session.)
Builds on: all accepted W1–W4 specs. Where numbers differ,
specs/tuning-pass-w3.md and specs/pigeons-dog-neighbour.md win over older specs.
DESIGN.md lines used:
- Sleep meter: "every 60 seconds the baby sinks one stage (Light → Deep →
  Dreamy). Each stage cuts damage by 20%, but obstacles come more often. This
  gives every run a natural arc."
- Sleep meter: "the baby's face and floating z's show the stage". Faces are
  art (W8) and z's are juice (W10), so this week a plain text label stands in.
- Obstacles: "Passing siren | Heard, getting louder | Shush right at the peak
  | Loud noise".
- Obstacles: "Introduce them one at a time in the first runs, so each one
  teaches a new rule."
- Sound: "a warning cue before every heard threat". Sound is W10, so the
  warning icon (from W4) is the cue, and a loudness bar stands in for
  "getting louder".

## Two parts (my call, tell me if you'd rather do it in one go)

This is four things, and the first one touches every obstacle. So I suggest
two sessions, each with its own build, review, tests and your playtest:

- **Part 1: sleep stages and the arc.** A `Light sleep` / `Deep sleep` /
  `Dreamy sleep` label, hits cost less in deeper stages, and obstacles come
  closer together. To space obstacles differently over time, the game must
  stop using one fixed gap. That changes how every obstacle is placed, so it
  should be built and checked on its own, with nothing else new.
- **Part 2: the siren and "one at a time".** The new siren, and the first
  walks after a page load bringing in one new kind of obstacle each. They
  belong together: the siren is the last lesson.

Acceptance criteria are marked [P1] or [P2].

## Questions for the owner

**Q1. What does "introduce them one at a time in the first runs" mean?**
There is no save until week 7, so the game can only remember walks until the
page is reloaded.
- **A. (Recommended) One new kind per walk.** Walk 1 has only potholes and
  crossings. Walk 2 adds pigeons, walk 3 the dog, walk 4 the neighbour,
  walk 5 the siren. From walk 5 on, everything can come. In the walk that
  adds a new kind, the second obstacle is always that new kind, so you meet it
  early. Reloading the page starts the lessons again (in week 7 the save will
  remember them for good). Good for your W6 cold playtest: new players get the
  lessons. Downside: to test the siren you first end four walks (about 2–3
  minutes if you press nothing).
- **B. New kinds join during every walk.** Each walk starts with potholes
  only and adds a new kind every 4 obstacles. Easy to test, but every walk
  repeats the lessons, even after an hour.
- **C. New kinds come with the stages.** Light sleep: potholes, crossings,
  pigeons. Deep adds the dog and neighbour, Dreamy adds the siren. A neat arc,
  but players who wake early never meet the later ones, and the siren only
  ever appears after 2 minutes.

**Q2. How does the siren work?**
You can't see it; you "hear" it come closer. Until sounds arrive in W10, you
see that as an icon with a loudness bar.
- **A. (Recommended) Tied to the street, like the dog.** A `nee-naw` icon
  appears at the top right (same place and timing as `woof?`). A bar under it
  fills up as you walk towards the siren. When the bar is full the icon turns
  coral: that is the peak. It lasts for 100 pixels of street (1.4 s at slow,
  0.8 s at normal, 0.6 s at brisk). Press S during the peak: no harm. Miss it:
  loud noise. Slowing down gives you more time, which fits "slow is safer".
  During a neighbour chat the siren waits too.
- **B. Tied to the clock.** Once the icon shows, the siren gets louder for
  4 s and peaks for 0.8 s, whatever your speed. More like a real passing car,
  but it ignores your speed and more often lands on top of the next obstacle.

**Q3. What if you have no Shush left when a siren comes?**
Shush has 2 charges, then a 45 s wait. Without a rule, a siren could be
impossible to get right, which breaks "one clear right answer".
- **A. (Recommended) At the peak, S always calms the siren.** It works even
  with no charges. It does not use a charge and does not add sleep. One simple
  rule: "siren peak, press S". Outside the peak, S is the normal Shush.
- **B. Peak S is a normal Shush.** It uses a charge and adds 10, and it calms
  the siren. With no charges left you can't stop it, so you learn to save one.
  More planning, less forgiving.
- **C. Like B, but a siren only comes when you have a charge.** Always fair,
  but it's a hidden rule you can't see.

**Q4. How much more often do obstacles come in deeper sleep?**
Today the gap between obstacles is always 700 pixels (one every 5.8 s at
normal). Deeper stages also cut damage (20% in Deep, 40% in Dreamy), so the
street must get a lot busier just to stay as hard.

| | Light | Deep | Dreamy | Sleep lost per minute, if you get the same share wrong (Light = 1) | Time after a fence before the next obstacle, at brisk (Dreamy) |
| --- | --- | --- | --- | --- | --- |
| A. Gentle | 700 | 620 | 540 | 1 / 0.9 / 0.78 | 1.7 s |
| **B. Medium (recommended)** | 700 | 560 | 450 | 1 / 1.0 / 0.96 | 1.2 s |
| C. Busy | 700 | 500 | 400 | 1 / 1.1 / 1.05 | 0.9 s |

- **A:** later stages feel calmer. Careful players may still go past 5
  minutes.
- **B (recommended):** each minute costs about the same, but the street gets
  1.6 times as busy by Dreamy, so you make more mistakes and the walk ends
  naturally. Still time to react after every obstacle.
- **C:** the clearest ending, but Dreamy can feel rushed, which goes against
  "never stressful".

## Goal

As the baby sinks from light to deep to dreamy sleep, bumps hurt less but the
street gets busier; and walk by walk I meet one new obstacle at a time, ending
with a siren I calm by shushing right at its peak.

## What the owner sees

Everything from earlier tasks stays. New (rectangles and plain text only):

- [P1] **Stage label:** a new HUD line under the Shush label, top left:
  `Light sleep`, then `Deep sleep` after 1:00 asleep, then `Dreamy sleep`
  after 2:00. It stays `Dreamy sleep` after that.
- [P1] **Hits cost less:** a pothole costs 10 in Light, 8 in Deep, 6 in
  Dreamy. Every other hit and the neighbour drain are cut the same way.
- [P1] **Busier street:** obstacles come closer together in Deep and closer
  still in Dreamy.
- [P2] **Siren:** no picture on the street. An amber `nee-naw` icon at the
  top right, with a bar under it that fills up. At the peak the bar is full
  and the icon turns coral. Press S then: `Shhh!` shows, the icon goes, no
  drop. Miss it: `NEE-NAW!` shows where the icon was for 1.5 s, pink flash,
  loud noise.
- [P2] **One at a time:** see Q1. After a page load, walk 1 has only potholes
  and crossings; each `Walk again` adds one new kind.

## Controls and states

### Controls
No new keys and no new test buttons. S (or `Shush`) also calms the siren at
its peak [P2].

### States (new)
- [P1] **Stage:** 0 (Light), 1 (Deep) or 2 (Dreamy), worked out from the
  run's time asleep (`Asleep for`, which also counts during chats).
- [P1] **Street plan:** the list of obstacle left edges (street positions),
  in order. It starts empty and grows as you walk. Obstacle k's kind is still
  worked out from its index k and the street seed.
- [P2] **Walk number:** 1 after a page load, +1 on every `Walk again`. Kept in
  memory only; reloading the page sets it back to 1.
- [P2] **Last settled siren:** index of the last siren that was calmed or
  missed (starts at -1), and the time since a miss (for drawing `NEE-NAW!`).

## Start, end and fail conditions

- **Start:** as before (sleep 100, normal speed, 2 shushes, new random
  street). Plus: stage Light, empty street plan [P1], no siren settled [P2].
  The walk number goes up by 1 on `Walk again`, not on a page load [P2].
- **End/fail:** as before, the run ends when sleep reaches 0. On the end
  screen the stage label is hidden [P1], and the siren icon, bar and
  `NEE-NAW!` are hidden [P2]. The end screen itself does not change (sleep
  minutes are the next W5 session).
- **Restart:** a fresh walk starts in Light with a quiet street again.

## How it works

The front wheel's street position is `scroll + 311`, as before.

### Sleep stages [P1]
- `stage = min(2, floor(elapsedMs / SLEEP_STAGE_MS))`. Hits do not change the
  stage; only time does.
- Every sleep loss (pothole, curb, pigeons, dog, neighbour drain, and the
  siren in Part 2) is multiplied by `1 - SLEEP_STAGE_DAMAGE_CUT * stage`, using
  the stage at that moment: ×1 in Light, ×0.8 in Deep, ×0.6 in Dreamy.
- Shush, refill and the refill wait do not change.
- The label text is `SLEEP_STAGE_NAMES[stage] + ' sleep'`, drawn like the
  Shush label (`HUD_FONT_SIZE`, `COLOR_HUD_TEXT`), `HUD_LINE_GAP` below it.

### The street plan (obstacles closer together) [P1]
- Each frame, before any obstacle checks, the plan is extended until its last
  left edge is at or beyond `wheel position + OBSTACLE_PLAN_AHEAD` (1400).
  The first entry is `OBSTACLE_FIRST_X` (1200). Each new entry is the last
  one plus the gap for the current stage: `OBSTACLE_GAP_LIGHT`,
  `OBSTACLE_GAP_DEEP` or `OBSTACLE_GAP_DREAMY`.
- So an obstacle's gap is set about 1400 pixels before the wheel reaches it
  (11.7 s at normal). The street gets busier a little after the label
  changes. That is fine and keeps already-visible obstacles from moving.
- Every place that used `OBSTACLE_FIRST_X + k * OBSTACLE_SPACING` now uses
  `plan[k]`: drawing, potholes, both curbs, pigeons, dog, neighbour, the
  warning icon and the crossing step-down. `OBSTACLE_SPACING` is removed.
- With the plan in Light only (gap 700 everywhere) the game must behave
  exactly as it does today.

### Siren [P2]
- New kind `'siren'`, picked in the mix like the others. Its left edge `L` is
  the start of the peak. Nothing is drawn on the street for it.
- **Icon:** the W4 warning icon, same place, same rule
  (`L - HEARD_WARNING_DISTANCE < wheel position`), with the word
  `SIREN_WARNING_TEXT`. If a dog and a siren are both near, the icon shows the
  one with the lower index that is still pending.
- **Loudness bar:** under the icon, `SIREN_BAR_GAP` below it, as wide as the
  icon, `SIREN_BAR_HEIGHT` tall. The empty part is `COLOR_METER_EMPTY`, the
  filled part `COLOR_SIREN_BAR`. Filled share =
  `(wheel position - (L - HEARD_WARNING_DISTANCE)) / HEARD_WARNING_DISTANCE`,
  kept between 0 and 1. It is full from L on.
- **Peak:** while `L < wheel position <= L + SIREN_PEAK_WIDTH`, the icon box
  is `COLOR_SIREN_PEAK` instead of amber.
- **Calming it [Q3-A]:** pressing S while the siren is in its peak and not yet
  settled calms it: the siren is settled, the icon and bar go, `Shhh!` shows
  for `SHUSH_TEXT_MS`. No charge is used, no sleep is added, and the Shush
  label does not change. This works with 0 charges.
- **Pressing S before or after the peak** is a normal Shush (uses a charge,
  +10 if there is one). It does not calm the siren.
- **Missing it:** when the wheel passes `L + SIREN_PEAK_WIDTH` and the siren
  is not settled, it is settled and costs `SLEEP_NOISE_LOUD` (25) × the stage
  factor. Pink flash, refill wait restarts, the icon and bar go, and
  `SIREN_MISS_TEXT` shows for `SIREN_SHOW_MS` at the icon's place
  (`DOG_TEXT_FONT_SIZE`, `COLOR_HUD_TEXT`).
- During a chat the street stands still, so the siren waits too.

### One at a time [P2, Q1-A]
- The kinds that can appear in walk n: potholes and crossings always, plus the
  first `n - 1` kinds of `INTRO_ORDER` (`pigeons`, `dog`, `neighbour`,
  `siren`). Locked kinds get chance 0; potholes take what is left (that is
  how the mix already works).
- In walks 2 to 5, obstacle number `INTRO_FIRST_INDEX` (1, the second
  obstacle) is always the kind that walk adds. From walk 6 on, nothing is
  forced.
- Walk 5 and later use the full mix.

### The full mix (from walk 5) [P2]
Stacked in this order: crossing 0.25, pigeons 0.15, dog 0.15, neighbour 0.15,
siren 0.10, pothole the rest (0.20). The siren's share comes out of the
potholes.

## Tuning values (src/config.js)

All are starting values to tune at playtests. Q4-B shown.

### Part 1
| Name | Value | Meaning |
| --- | --- | --- |
| `SLEEP_STAGE_MS` | 60000 | Time asleep per stage (Cozy blanket will shorten it in W7) |
| `SLEEP_STAGE_NAMES` | `['Light', 'Deep', 'Dreamy']` | Stage names (text) |
| `SLEEP_STAGE_DAMAGE_CUT` | 0.2 | Damage cut per stage (Deep ×0.8, Dreamy ×0.6) |
| `OBSTACLE_GAP_LIGHT` | 700 | Gap between obstacles in Light (same as today) |
| `OBSTACLE_GAP_DEEP` | 560 | Gap in Deep (Q4) |
| `OBSTACLE_GAP_DREAMY` | 450 | Gap in Dreamy (Q4) |
| `OBSTACLE_PLAN_AHEAD` | 1400 | How far ahead of the wheel the street is planned |

Removed: `OBSTACLE_SPACING` (replaced by `OBSTACLE_GAP_LIGHT`).

### Part 2
| Name | Value | Meaning |
| --- | --- | --- |
| `SIREN_CHANCE` | 0.10 | Chance an obstacle is a siren (potholes drop to 0.20) |
| `SIREN_PEAK_WIDTH` | 100 | Street length of the peak (1.4 / 0.8 / 0.6 s at slow / normal / brisk) |
| `SIREN_WARNING_TEXT` | `'nee-naw'` | Word in the icon (text) |
| `SIREN_MISS_TEXT` | `'NEE-NAW!'` | Text shown on a miss (text) |
| `SIREN_SHOW_MS` | 1500 | How long `NEE-NAW!` shows |
| `SIREN_BAR_HEIGHT` | 8 | Loudness bar height |
| `SIREN_BAR_GAP` | 4 | Gap between the icon and the bar |
| `COLOR_SIREN_BAR` | 0xf5b0a0 | Filled bar (soft coral) |
| `COLOR_SIREN_PEAK` | 0xf5b0a0 | Icon colour at the peak (soft coral) |
| `INTRO_ORDER` | `['pigeons', 'dog', 'neighbour', 'siren']` | Order new kinds join, one per walk (text) |
| `INTRO_FIRST_INDEX` | 1 | Which obstacle is always the new kind (1 = the second) |

Everything else is unchanged.

### Back-of-envelope check (Q4-B, full mix)
A wrong obstacle costs about 22 on average in Light. At normal there are
about 10 obstacles a minute in Light, 13 in Deep and 16 in Dreamy. With the
damage cut, sleep lost per minute for the same share of mistakes is about the
same in every stage (1 / 1.0 / 0.96), while there is 60% more to handle by
Dreamy. Healing and Shush stay the same. So a careful walk should get harder
from minute 2 and end in the 2–5 minute range. The W6 gate is the real test.

## Logic (src/logic/)

No Phaser code, no `Math.random`, and no function changes its inputs.
Tuning values are passed in.

### src/logic/stages.js (new) [P1]
1. `stageFor(elapsedMs, stageMs)` → 0, 1 or 2: `min(2, floor(elapsedMs / stageMs))`.
2. `stageLabel(stage, names)` → `names[stage] + ' sleep'`.
3. `damageFactorFor(stage, cut)` → `1 - cut * stage`, never below 0.
4. `stageDamage(damage, stage, cut)` → `damage * damageFactorFor(stage, cut)`.
5. `gapFor(stage, gaps)` → `gaps.light`, `gaps.deep` or `gaps.dreamy`.

### src/logic/obstacles.js (changed) [P1]
6. `extendPlan(plan, upTo, firstX, gap)` → new array. Empty plan: starts with
   `[firstX]`. Then adds `last + gap` while the last entry is below `upTo`. If
   `gap <= 0`, returns a copy without adding gaps (no endless loop).
7. The five helpers that took `(firstX, spacing)` now take the plan instead,
   with the same meaning, and the old versions are removed:
   - `visibleObstacleIndexes(plan, scroll, width, viewWidth)`
   - `obstacleIndexesReachingWheel(plan, prevScroll, scroll, wheelX, offset)`
     (offset: 0 for the left edge; `CROSSING_WIDTH` for the up-curb;
     `SIREN_PEAK_WIDTH` for the siren's end in P2)
   - `obstacleIndexesOverWheel(plan, prevScroll, scroll, wheelX, width)`
   - `obstacleIndexAt(plan, position, width)`
   - `obstacleIndexesNear(plan, position, ahead, width)`
   - screen x of obstacle k is `plan[k] - scroll` (`obstacleScreenX(plan, k, scroll)`).
   They only look at indexes that are in the plan.

### src/logic/siren.js (new) [P2]
8. `sirenLoudness(position, left, ahead)` → 0 to 1 (see "Loudness bar").
9. `inSirenPeak(position, left, peakWidth)` → `left < position <= left + peakWidth`.
10. `calmSiren(index, inPeak, lastSettledIndex)` → `{ calmed, lastSettledIndex }`.
    Calmed (and `lastSettledIndex: index`) only if `inPeak` and
    `index > lastSettledIndex`.
11. `checkSirenMiss(index, lastSettledIndex, damage)` → `{ damage, lastSettledIndex }`.
    Damage and `lastSettledIndex: index` if `index > lastSettledIndex`;
    otherwise `{ damage: 0, lastSettledIndex }`.
12. `heardWarningFor(indexes, kinds, lastBarkedIndex, lastSettledSiren)` →
    `null`, `'dog'` or `'siren'`: the first `indexes[i]` that is a dog above
    `lastBarkedIndex` or a siren above `lastSettledSiren`. Replaces
    `warningShown`.

### src/logic/intro.js (new) [P2]
13. `unlockedKinds(walkNumber, order)` → `order.slice(0, walkNumber - 1)`
    (all of them from walk 5).
14. `introChances(chances, unlocked)` → copy of `chances` with every kind in
    `order` that is not unlocked set to 0. Crossing is never changed.
15. `newKindFor(walkNumber, order)` → `order[walkNumber - 2]` for walks 2 to
    `order.length + 1`, otherwise `null`.
16. `obstacleKindForWalk(index, randomValue, walkNumber, chances, order, introIndex)`
    → `newKindFor(...)` if `index === introIndex` and it is not null;
    otherwise `obstacleKindFor(randomValue, introChances(chances, unlockedKinds(...)))`.

`obstacleKindFor` gets a fifth range, `siren`, after `neighbour` [P2].

## Acceptance criteria

### Automated (tester, `npm test`)

1. [P1] `npm test` passes (exit code 0).
2. [P1] Old tests that change, and only these: tests of the five plan
   helpers are rewritten to use `extendPlan([], big number, 1200, 700)` in
   place of `firstX 1200, spacing 700`, with the same inputs and the same
   expected answers (including the pigeon, dog, neighbour, pothole and
   crossing simulations). Config checks that used `OBSTACLE_SPACING` use
   `OBSTACLE_GAP_LIGHT`. Old "spacing 0 gives []" cases become "empty plan
   gives []".
3. [P1] `stageFor(x, 60000)`: 0 → 0; 59999 → 0; 60000 → 1; 119999 → 1;
   120000 → 2; 600000 → 2.
4. [P1] `stageLabel` with `['Light', 'Deep', 'Dreamy']`: 0 → `'Light sleep'`,
   1 → `'Deep sleep'`, 2 → `'Dreamy sleep'`.
5. [P1] `damageFactorFor(stage, 0.2)`: 0 → 1, 1 → 0.8, 2 → 0.6. With cut 0.6,
   stage 2 → 0. (Within 0.000001.)
6. [P1] `stageDamage(d, stage, 0.2)`, within 0.000001: (10, 0) → 10;
   (10, 1) → 8; (10, 2) → 6; (20, 1) → 16; (20, 2) → 12; (25, 1) → 20;
   (25, 2) → 15; (0, 2) → 0.
7. [P1] `gapFor` with `{ light: 700, deep: 560, dreamy: 450 }`: 0 → 700,
   1 → 560, 2 → 450.
8. [P1] `extendPlan`: (`[]`, 1000, 1200, 700) → `[1200]`;
   (`[]`, 3300, 1200, 700) → `[1200, 1900, 2600, 3300]`;
   (`[1200, 1900]`, 2500, 1200, 560) → `[1200, 1900, 2460, 3020]`;
   (`[1200]`, 1200, 1200, 700) → `[1200]`; (`[1200]`, 5000, 1200, 0) →
   `[1200]`. The array passed in is never changed.
9. [P1] Uneven plan: with plan `[1200, 1900, 2460, 2910]`:
   `obstacleIndexesReachingWheel(plan, 2140, 2160, 311, 0)` → `[2]`;
   `obstacleIndexAt(plan, 2500, 180)` → 2; `obstacleIndexAt(plan, 2700, 180)`
   → -1; `visibleObstacleIndexes(plan, 2000, 240, 960)` → `[1, 2, 3]`.
10. [P1] Ramp simulation: normal speed (120), 16 ms frames, 180 s, wheel 311,
    no chats. Each frame: elapsed += 16; stage from `stageFor`; plan extended
    to `scroll + 311 + 1400` with that stage's gap (700 / 560 / 450); then
    `advanceScroll`; then count obstacles whose left edge the wheel reaches.
    Obstacles reached: first minute exactly 10, second minute exactly 12,
    third minute exactly 15.
11. [P1] Chat in Deep: summing `stageDamage(drain, 1, 0.2)` over a full
    `NEIGHBOUR_CHAT_MS` chat (`updateChat(state, 16, 3)` until it ends) gives
    12 (within 0.001).
12. [P1] Config sanity, using src/config.js:
    - `OBSTACLE_GAP_LIGHT > OBSTACLE_GAP_DEEP > OBSTACLE_GAP_DREAMY`;
    - `(OBSTACLE_GAP_LIGHT - DOG_FENCE_WIDTH) / SPEED_BRISK >= 2` (Light
      feels as today);
    - `(OBSTACLE_GAP_DREAMY - DOG_FENCE_WIDTH) / SPEED_BRISK >= 1` and
      `(OBSTACLE_GAP_DREAMY - CROSSING_WIDTH) / SPEED_BRISK >= 1` (at least
      1 s to react, even in Dreamy at brisk);
    - `OBSTACLE_PLAN_AHEAD > HEARD_WARNING_DISTANCE` and
      `OBSTACLE_PLAN_AHEAD > GAME_WIDTH - 311` (obstacles are planned before
      they or their icon can show);
    - `1 - 2 * SLEEP_STAGE_DAMAGE_CUT > 0`.
13. [P1] `src/config.js` exports every Part 1 name with exactly the value
    listed, and no longer exports `OBSTACLE_SPACING`. No file in `src/`
    mentions `OBSTACLE_SPACING`. No file in `src/logic/` contains
    `Math.random` or the word "phaser" (any capitalisation).
14. [P2] `obstacleKindFor` with `{ crossing: 0.25, pigeons: 0.15, dog: 0.15, neighbour: 0.15, siren: 0.10 }`:
    0.69 → `'neighbour'`; 0.70 → `'siren'`; 0.79 → `'siren'`; 0.80 →
    `'pothole'`. The W4 cases still give the same answers with `siren: 0`.
15. [P2] Mix for seed 42, k = 0–999, with the AC 14 chances: siren 50–150,
    pothole 120–280, and the W4 ranges for the others. For seeds 1, 42 and
    123456789, all six kinds appear in k = 0–99.
16. [P2] `sirenLoudness(p, 1200, 1000)`: 100 → 0; 200 → 0; 700 → 0.5;
    1200 → 1; 1250 → 1. `inSirenPeak(p, 1200, 100)`: 1200 → false;
    1201 → true; 1300 → true; 1301 → false.
17. [P2] `calmSiren`: (3, true, -1) → `{ calmed: true, lastSettledIndex: 3 }`;
    (3, false, -1) → `{ calmed: false, lastSettledIndex: -1 }`;
    (3, true, 3) → `{ calmed: false, lastSettledIndex: 3 }`.
    `checkSirenMiss`: (3, -1, 25) → `{ damage: 25, lastSettledIndex: 3 }`;
    (3, 3, 25) → `{ damage: 0, lastSettledIndex: 3 }`.
18. [P2] `heardWarningFor`: (`[]`, `[]`, -1, -1) → null;
    (`[3]`, `['siren']`, -1, -1) → `'siren'`; (`[3]`, `['siren']`, -1, 3) →
    null; (`[3, 4]`, `['dog', 'siren']`, -1, -1) → `'dog'`;
    (`[3, 4]`, `['dog', 'siren']`, 3, -1) → `'siren'`; (`[5]`, `['pigeons']`,
    -1, -1) → null.
19. [P2] Siren simulation: obstacle 0 is a siren at 1200, normal speed, 16 ms
    frames, wheel 311. Each frame: `advanceScroll`; if S is pressed this
    frame, `calmSiren(0, inSirenPeak(...), last)`; then for index 0 reaching
    the wheel with offset 100, `checkSirenMiss(0, last, stageDamage(25, stage, 0.2))`.
    Total damage: no S → 25 (once); S once when the wheel is at about 1250 →
    0; S once at about 1150 → 25; S once at about 1350 → 25; same as "no S"
    but stage 2 → 15.
20. [P2] `unlockedKinds(n, order)`: 1 → `[]`; 2 → `['pigeons']`;
    3 → `['pigeons', 'dog']`; 5 and 9 → all four. `newKindFor`: 1 → null;
    2 → `'pigeons'`; 5 → `'siren'`; 6 → null. `introChances(full, ['pigeons'])`
    → `{ crossing: 0.25, pigeons: 0.15, dog: 0, neighbour: 0, siren: 0 }`,
    and does not change `full`.
21. [P2] `obstacleKindForWalk` with the AC 14 chances: walk 2, index 1, any
    random value → `'pigeons'`; walk 5, index 1 → `'siren'`; walk 1,
    index 0, 0.1 → `'crossing'`; walk 1, index 0, 0.3 → `'pothole'`; walk 2,
    index 0, 0.5 → `'pothole'`; walk 6, index 1, 0.75 → `'siren'`. For walk 1
    and seed 42, k = 0–999, only `'pothole'` and `'crossing'` appear.
22. [P2] `src/config.js` exports every Part 2 name with exactly the value
    listed.

### Manual (owner, on https://pinzzas.github.io/stroller/)

First check the build label (bottom right) shows the new build. A phone
stopwatch helps for the stage steps. To survive 2 minutes, play carefully and
use Shush.

Part 1, on a computer browser:

23. [P1] **Label.** A new walk shows `Light sleep` under the Shush label.
24. [P1] **Stages change.** After about 1 minute it says `Deep sleep`, after
    about 2 minutes `Dreamy sleep`, and it stays that way.
25. [P1] **Hits cost less.** Miss a pothole in each stage (Shush or wait first
    so you can read the drop): Light −10, Deep −8, Dreamy −6. A dog bark in
    Dreamy: −15.
26. [P1] **Busier street.** At normal speed, count obstacles over 30 s at the
    start (about 5) and again after 2:30 (about 8). The second count is
    clearly higher, and you still have time to react after each one.
27. [P1] **Nothing else changed.** Potholes, crossings, pigeons, dog,
    `woof?` and the neighbour work as before in Light sleep.
28. [P1] **Restart.** After waking, `Walk again` shows `Light sleep` and a
    quiet street. The label is hidden on the end screen.

Part 2, on a computer browser. Reload the page before step 29.

29. [P2] **Walk 1.** Only potholes and crossings appear. Press nothing and
    let the baby wake (about 30 s).
30. [P2] **Walks 2–4.** Press `Walk again`. Walk 2: the second obstacle is
    pigeons. Walk 3: the second is a dog (`woof?` first). Walk 4: the second
    is the neighbour. No kind appears before its walk.
31. [P2] **Walk 5, the siren, done right.** The second obstacle is a siren:
    `nee-naw` appears top right and the bar under it fills. When it is full
    and the icon turns coral, press S. `Shhh!` shows, the icon goes, no
    drop, and the Shush label does not change.
32. [P2] **Siren, done wrong.** Next siren: don't press S. `NEE-NAW!` shows
    top right for about 1.5 s, pink flash, drop of 25 (less in deeper sleep).
33. [P2] **Siren, too early.** Next siren: press S when the bar is half
    full. It's a normal Shush (+10, uses a charge), and the siren still hits
    after the peak.
34. [P2] **No charges left.** Use both shushes, then calm a siren at the
    peak. It still works; the label still says `Shush: back in ...`.
35. [P2] **Reload.** Reload the page: you are back at walk 1 (only potholes
    and crossings).

On iPhone Safari (landscape), with the test buttons:

36. [P2] Tap `Shush` at a siren's peak: it calms it, as on the keyboard.

## Assumptions (owner, please correct if wrong)

- Q1 = A, Q2 = A, Q3 = A, Q4 = B (the recommended options).
- "Cuts damage by 20%" means 20% of the full amount per stage: Deep ×0.8,
  Dreamy ×0.6 (not 0.8 × 0.8). It applies to every sleep loss, including the
  neighbour drain, but not to Shush or refill.
- The stage only depends on time asleep. A hit never wakes the baby to a
  lighter stage (DESIGN.md doesn't say it does).
- There are only three stages. After 2:00 the street stays at the Dreamy gap.
- The stage label is a plain-text stand-in. The baby's faces (W8) and z's
  (W10) replace it later.
- The siren's peak shows as a full bar and a coral icon, so you can see it.
  In W10 a real sound that gets louder takes over that job.
- The siren's share (10%) comes out of potholes, so potholes go from 30% to
  20% of the full mix. Crossings, pigeons, dog and neighbour stay the same.
- In the walk a kind is introduced, the rest of the walk uses the normal mix
  of what's unlocked. Walk 1 is 75% potholes, 25% crossings.
- Lessons are remembered only until the page is reloaded. Week 7's save will
  remember them for good (and will need its own small decision then).
- TODO.md suggests moving the obstacle drawing out of src/StreetScene.js
  (now about 460 lines) before the siren. Part 1 touches every obstacle
  anyway, so gameplay-dev could do that tidy-up at the start of Part 1. It
  changes nothing you can see.
- DESIGN.md needs no change. If you approve, I'll add "(Deep ×0.8, Dreamy
  ×0.6)" to the sleep stages line so the numbers are written down.

## Out of scope

- Sleep minutes, brisk earning more, and changes to the end screen (second W5
  task).
- Showing the stage on the end screen.
- Baby faces, z's, a siren sound, an ambulance on screen (W8 art, W10 sound
  and juice).
- Cozy blanket and other upgrades (W7). `SLEEP_STAGE_MS` is ready for it.
- Saving lessons or walk number between page loads (W7 local save).
- A tutorial, hint text or "new!" labels when a kind first appears. Not in
  DESIGN.md; if wanted, add to "Maybe later" first.
- A fourth stage, waking to a lighter stage on big hits, or obstacles that
  only appear in some stages. Not in DESIGN.md.
- A fixed test street or a "skip lessons" test switch (not needed now).
