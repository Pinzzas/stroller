# Spec: Sleep stages, the deep-sleep arc, the siren and new obstacles one at a time (W5)

Status: Approved 2026-11-11. Q1 = B, Q2 = A, Q3 = B, Q4 = C. Two parts
(Part 1 first).
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

## Two parts

Each part gets its own build, review, tests and your playtest:

- **Part 1: sleep stages and the arc.** A `Light sleep` / `Deep sleep` /
  `Dreamy sleep` label, hits cost less in deeper stages, and obstacles come
  closer together. To space obstacles differently over time, the game must
  stop using one fixed gap. That changes how every obstacle is placed, so it
  is built and checked on its own, with nothing else new.
- **Part 2: the siren and "one at a time".** The new siren, and every walk
  starting with potholes only and adding one new kind every 4 obstacles.

Why "one at a time" stays in Part 2: with Q1-B it no longer needs a walk
counter. It is one small rule that picks each obstacle's kind from its number.
But the siren is the last kind to join. If it went in Part 1, Part 2 would
have to change it again. Part 1 is also already the riskier change, so it
stays as small as possible.

Acceptance criteria are marked [P1] or [P2].

## Questions for the owner (answered 2026-11-11)

**Q1. What does "introduce them one at a time in the first runs" mean?**
**Decision: B.**
- A. One new kind per walk (walk 1 potholes and crossings, then one more each
  `Walk again`; reloading the page starts again). Not chosen.
- **B. (Chosen) New kinds join during every walk.** Each walk starts with
  potholes only and adds a new kind every 4 obstacles. Easy to test, but every
  walk repeats the lessons, even after an hour.
- C. New kinds come with the stages. Not chosen.

**Q2. How does the siren work?**
**Decision: A.**
- **A. (Chosen) Tied to the street, like the dog.** A `nee-naw` icon appears
  at the top right (same place and timing as `woof?`). A bar under it fills up
  as you walk towards the siren. When the bar is full the icon turns coral:
  that is the peak. It lasts for 100 pixels of street (1.4 s at slow, 0.8 s at
  normal, 0.6 s at brisk). Press S during the peak: no harm. Miss it: loud
  noise. During a neighbour chat the siren waits too.
- B. Tied to the clock. Not chosen.

**Q3. What if you have no Shush left when a siren comes?**
**Decision: B.**
- A. At the peak, S always calms the siren, even with no charges. Not chosen.
- **B. (Chosen) Peak S is a normal Shush.** It uses a charge and adds 10, and
  it calms the siren. With no charges left you can't stop it, so you learn to
  save one. More planning, less forgiving.
- C. Like B, but a siren only comes when you have a charge. Not chosen.

**Q4. How much more often do obstacles come in deeper sleep?**
**Decision: C.**

| | Light | Deep | Dreamy | Sleep lost per minute, if you get the same share wrong (Light = 1) | Time after a fence before the next obstacle, at brisk (Dreamy) |
| --- | --- | --- | --- | --- | --- |
| A. Gentle | 700 | 620 | 540 | 1 / 0.9 / 0.78 | 1.7 s |
| B. Medium | 700 | 560 | 450 | 1 / 1.0 / 0.96 | 1.2 s |
| **C. Busy (chosen)** | 700 | 500 | 400 | 1 / 1.1 / 1.05 | 0.9 s |

- **C:** the clearest ending, but Dreamy can feel rushed (see Assumptions).

## Goal

As the baby sinks from light to deep to dreamy sleep, bumps hurt less but the
street gets much busier. Every walk starts gently and brings in one new
obstacle at a time, ending with a siren I calm by shushing right at its peak.

## What the owner sees

Everything from earlier tasks stays. New (rectangles and plain text only):

- [P1] **Stage label:** a new HUD line under the Shush label, top left:
  `Light sleep`, then `Deep sleep` after 1:00 asleep, then `Dreamy sleep`
  after 2:00. It stays `Dreamy sleep` after that.
- [P1] **Hits cost less:** a pothole costs 10 in Light, 8 in Deep, 6 in
  Dreamy. Every other hit and the neighbour drain are cut the same way.
- [P1] **Busier street:** at normal speed, about 10 obstacles a minute in
  Light, 14 in Deep and 18 in Dreamy.
- [P2] **Siren:** no picture on the street. An amber `nee-naw` icon at the
  top right, with a bar under it that fills up. At the peak the bar is full
  and the icon turns coral. Press S then, with a Shush left: `Shhh!` shows,
  the meter goes up 10, one charge is used, the icon goes, and the siren does
  no harm. Miss it (or press with no Shush left): `NEE-NAW!` shows where the
  icon was for 1.5 s, pink flash, loud noise.
- [P2] **One at a time, every walk:** obstacles 1–4 are potholes. The 5th
  is a crossing, and crossings can come from then on. The 9th is pigeons, the
  13th a dog, the 17th the neighbour, the 21st a siren. From the 21st on,
  anything can come. At normal speed, roughly: crossing at 0:30, pigeons at
  0:55, dog at 1:15, neighbour at 1:35, siren at 1:50.

## Controls and states

### Controls
No new keys and no new test buttons. S (or `Shush`) at a siren's peak is a
normal Shush that also calms the siren [P2].

### States (new)
- [P1] **Stage:** 0 (Light), 1 (Deep) or 2 (Dreamy), worked out from the
  run's time asleep (`Asleep for`, which also counts during chats).
- [P1] **Street plan:** the list of obstacle left edges (street positions),
  in order. It starts empty and grows as you walk. Obstacle k's kind is still
  worked out from its index k and the street seed.
- [P2] **Last settled siren:** index of the last siren that was calmed or
  missed (starts at -1), and the time since a miss (for drawing `NEE-NAW!`).

No walk counter is needed: the one-at-a-time rule only uses the obstacle's
index.

## Start, end and fail conditions

- **Start:** as before (sleep 100, normal speed, 2 shushes, new random
  street). Plus: stage Light, empty street plan [P1], no siren settled [P2].
  Every walk starts with potholes only [P2].
- **End/fail:** as before, the run ends when sleep reaches 0. On the end
  screen the stage label is hidden [P1], and the siren icon, bar and
  `NEE-NAW!` are hidden [P2]. The end screen itself does not change (sleep
  minutes are the next W5 session).
- **Restart:** a fresh walk starts in Light, with a quiet street and potholes
  only again.

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
  one plus the gap for the current stage: `OBSTACLE_GAP_LIGHT` (700),
  `OBSTACLE_GAP_DEEP` (500) or `OBSTACLE_GAP_DREAMY` (400).
- So an obstacle's gap is set about 1400 pixels before the wheel reaches it
  (11.7 s at normal). The street gets busier a little after the label
  changes. That is fine, and it means obstacles already on screen never move.
- Every place that used `OBSTACLE_FIRST_X + k * OBSTACLE_SPACING` now uses
  `plan[k]`: drawing, potholes, both curbs, pigeons, dog, neighbour, the
  warning icon and the crossing step-down. `OBSTACLE_SPACING` is removed.
- With the plan in Light only (gap 700 everywhere) the game must behave
  exactly as it does today.
- In Dreamy at brisk, after a dog fence the next obstacle can be only
  160 pixels away (0.9 s). It is always visible well before, so you can see
  what comes next while still along the fence.

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
- **Calming it [Q3-B]:** pressing S during the peak is a normal Shush. If a
  charge was used (the existing `useShush` says `used: true`), the siren is
  also calmed: it is settled, the icon and bar go. `Shhh!`, the +10 and the
  Shush label work exactly as for any Shush.
- **No charge left:** pressing S does nothing, as today, and the siren is not
  calmed. It will hit at the end of the peak.
- **Pressing S before or after the peak** is a normal Shush (uses a charge,
  +10). It does not calm the siren.
- **Missing it:** when the wheel passes `L + SIREN_PEAK_WIDTH` and the siren
  is not settled, it is settled and costs `SLEEP_NOISE_LOUD` (25) × the stage
  factor. Pink flash, refill wait restarts, the icon and bar go, and
  `SIREN_MISS_TEXT` shows for `SIREN_SHOW_MS` at the icon's place
  (`DOG_TEXT_FONT_SIZE`, `COLOR_HUD_TEXT`).
- During a chat the street stands still, so the siren waits too.

### One at a time, in every walk [P2, Q1-B]
- `INTRO_ORDER` is `crossing`, `pigeons`, `dog`, `neighbour`, `siren`.
- Obstacle k can be potholes plus the first `floor(k / INTRO_EVERY)` kinds
  of `INTRO_ORDER` (`INTRO_EVERY` = 4). So obstacles 0–3 are potholes only,
  4–7 add crossings, 8–11 pigeons, 12–15 the dog, 16–19 the neighbour, and
  from 20 everything. Locked kinds get chance 0; potholes take what is left
  (that is how the mix already works).
- The first obstacle of each new block (k = 4, 8, 12, 16, 20) is always the
  kind that block adds, so you meet each new one straight away.
- From obstacle 21 on, nothing is forced: the full mix.

### The full mix [P2]
Stacked in this order: crossing 0.25, pigeons 0.15, dog 0.15, neighbour 0.15,
siren 0.10, pothole the rest (0.20). The siren's share comes out of the
potholes.

## Tuning values (src/config.js)

All are starting values to tune at playtests.

### Part 1
| Name | Value | Meaning |
| --- | --- | --- |
| `SLEEP_STAGE_MS` | 60000 | Time asleep per stage (Cozy blanket will shorten it in W7) |
| `SLEEP_STAGE_NAMES` | `['Light', 'Deep', 'Dreamy']` | Stage names (text) |
| `SLEEP_STAGE_DAMAGE_CUT` | 0.2 | Damage cut per stage (Deep ×0.8, Dreamy ×0.6) |
| `OBSTACLE_GAP_LIGHT` | 700 | Gap between obstacles in Light (same as today) |
| `OBSTACLE_GAP_DEEP` | 500 | Gap in Deep (Q4-C) |
| `OBSTACLE_GAP_DREAMY` | 400 | Gap in Dreamy (Q4-C) |
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
| `INTRO_ORDER` | `['crossing', 'pigeons', 'dog', 'neighbour', 'siren']` | Order new kinds join in every walk (text) |
| `INTRO_EVERY` | 4 | A new kind joins every this many obstacles |

Everything else is unchanged.

### Back-of-envelope check (Q4-C, full mix)
A wrong obstacle costs about 22 on average in Light. At normal there are
about 10 obstacles a minute in Light, 14 in Deep and 18 in Dreamy. With the
damage cut, sleep lost per minute for the same share of mistakes is a bit
higher in deeper sleep (1 / 1.1 / 1.05), while there is 75% more to handle by
Dreamy. Healing and Shush stay the same. The first minute is easier than
today (potholes first, then only potholes and crossings), and from minute 2
the walk gets clearly harder. So even careful walks should end in the 2–5
minute range. The W6 gate is the real test.

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
7. The helpers that took `(firstX, spacing)` now take the plan instead, with
   the same meaning, and the old versions are removed:
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
10. `calmSiren(index, inPeak, shushUsed, lastSettledIndex)` →
    `{ calmed, lastSettledIndex }`. Calmed (and `lastSettledIndex: index`)
    only if `inPeak`, `shushUsed` and `index > lastSettledIndex`. The scene
    passes `shushUsed` from `useShush(...).used`.
11. `checkSirenMiss(index, lastSettledIndex, damage)` → `{ damage, lastSettledIndex }`.
    Damage and `lastSettledIndex: index` if `index > lastSettledIndex`;
    otherwise `{ damage: 0, lastSettledIndex }`.
12. `heardWarningFor(indexes, kinds, lastBarkedIndex, lastSettledSiren)` →
    `null`, `'dog'` or `'siren'`: the first `indexes[i]` that is a dog above
    `lastBarkedIndex` or a siren above `lastSettledSiren`. Replaces
    `warningShown`.

### src/logic/intro.js (new) [P2]
13. `unlockedKinds(index, order, every)` →
    `order.slice(0, floor(index / every))`.
14. `introChances(chances, unlocked)` → copy of `chances` with every kind
    not in `unlocked` set to 0 (crossing included).
15. `newKindAt(index, order, every)` → `order[index / every - 1]` when
    `index > 0`, `index % every === 0` and `index / every <= order.length`;
    otherwise `null`.
16. `obstacleKindForIndex(index, randomValue, chances, order, every)` →
    `newKindAt(...)` if it is not null; otherwise
    `obstacleKindFor(randomValue, introChances(chances, unlockedKinds(...)))`.

`obstacleKindFor` gets a fifth range, `siren`, after `neighbour` [P2].

## Acceptance criteria

### Automated (tester, `npm test`)

1. [P1] `npm test` passes (exit code 0).
2. [P1] Old tests that change, and only these: tests of the plan helpers are
   rewritten to use `extendPlan([], big number, 1200, 700)` in place of
   `firstX 1200, spacing 700`, with the same inputs and the same expected
   answers (including the pigeon, dog, neighbour, pothole and crossing
   simulations). Config checks that used `OBSTACLE_SPACING` use
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
7. [P1] `gapFor` with `{ light: 700, deep: 500, dreamy: 400 }`: 0 → 700,
   1 → 500, 2 → 400.
8. [P1] `extendPlan`: (`[]`, 1000, 1200, 700) → `[1200]`;
   (`[]`, 3300, 1200, 700) → `[1200, 1900, 2600, 3300]`;
   (`[1200, 1900]`, 2500, 1200, 500) → `[1200, 1900, 2400, 2900]`;
   (`[1200]`, 1200, 1200, 700) → `[1200]`; (`[1200]`, 5000, 1200, 0) →
   `[1200]`. The array passed in is never changed.
9. [P1] Uneven plan: with plan `[1200, 1900, 2400, 2800]`:
   `obstacleIndexesReachingWheel(plan, 2080, 2100, 311, 0)` → `[2]`;
   `obstacleIndexAt(plan, 2500, 180)` → 2; `obstacleIndexAt(plan, 2700, 180)`
   → -1; `visibleObstacleIndexes(plan, 2000, 240, 960)` → `[1, 2, 3]`.
10. [P1] Ramp simulation: normal speed (120), 16 ms frames, 180 s, wheel 311,
    no chats. Each frame: elapsed += 16; stage from `stageFor`; plan extended
    to `scroll + 311 + 1400` with that stage's gap (700 / 500 / 400); then
    `advanceScroll`; then count obstacles whose left edge the wheel reaches.
    Obstacles reached: first minute exactly 10, second minute exactly 13,
    third minute exactly 17.
11. [P1] Chat in Deep: summing `stageDamage(drain, 1, 0.2)` over a full
    `NEIGHBOUR_CHAT_MS` chat (`updateChat(state, 16, 3)` until it ends) gives
    12 (within 0.001).
12. [P1] Config sanity, using src/config.js:
    - `OBSTACLE_GAP_LIGHT > OBSTACLE_GAP_DEEP > OBSTACLE_GAP_DREAMY`;
    - `(OBSTACLE_GAP_LIGHT - DOG_FENCE_WIDTH) / SPEED_BRISK >= 2` (Light
      feels as today);
    - `(OBSTACLE_GAP_DREAMY - DOG_FENCE_WIDTH) / SPEED_BRISK >= 0.85` and
      `(OBSTACLE_GAP_DREAMY - CROSSING_WIDTH) / SPEED_BRISK >= 1.2` (time to
      react, even in Dreamy at brisk);
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
15. [P2] Mix for seed 42, k = 0–999, with the AC 14 chances and plain
    `obstacleKindFor`: siren 50–150, pothole 120–280, and the W4 ranges for
    the others. For seeds 1, 42 and 123456789, all six kinds appear in
    k = 0–99.
16. [P2] `sirenLoudness(p, 1200, 1000)`: 100 → 0; 200 → 0; 700 → 0.5;
    1200 → 1; 1250 → 1. `inSirenPeak(p, 1200, 100)`: 1200 → false;
    1201 → true; 1300 → true; 1301 → false.
17. [P2] `calmSiren`: (3, true, true, -1) →
    `{ calmed: true, lastSettledIndex: 3 }`; (3, true, false, -1) →
    `{ calmed: false, lastSettledIndex: -1 }` (no charge); (3, false, true,
    -1) → `{ calmed: false, lastSettledIndex: -1 }`; (3, true, true, 3) →
    `{ calmed: false, lastSettledIndex: 3 }`. `checkSirenMiss`: (3, -1, 25) →
    `{ damage: 25, lastSettledIndex: 3 }`; (3, 3, 25) →
    `{ damage: 0, lastSettledIndex: 3 }`.
18. [P2] `heardWarningFor`: (`[]`, `[]`, -1, -1) → null;
    (`[3]`, `['siren']`, -1, -1) → `'siren'`; (`[3]`, `['siren']`, -1, 3) →
    null; (`[3, 4]`, `['dog', 'siren']`, -1, -1) → `'dog'`;
    (`[3, 4]`, `['dog', 'siren']`, 3, -1) → `'siren'`; (`[5]`, `['pigeons']`,
    -1, -1) → null.
19. [P2] Siren simulation: obstacle 0 is a siren at 1200, normal speed, 16 ms
    frames, wheel 311, sleep 50, no refill. Each frame: `advanceScroll`; if S
    is pressed this frame, `useShush` (restore 10, max 100, cooldown 45000),
    then `calmSiren(0, inSirenPeak(...), used, last)`; then for index 0
    reaching the wheel with offset 100,
    `checkSirenMiss(0, last, stageDamage(25, stage, 0.2))`. Results:
    - no S → siren damage 25 (once), sleep ends at 25;
    - S once at about 1250 with 2 charges → siren damage 0, sleep 60, 1
      charge left;
    - S once at about 1250 with 0 charges → siren damage 25, sleep 25;
    - S once at about 1150 with 2 charges → siren damage 25, sleep 35;
    - S once at about 1350 with 2 charges → siren damage 25, sleep 35;
    - no S, stage 2 → siren damage 15, sleep 35.
20. [P2] With `order` = `['crossing', 'pigeons', 'dog', 'neighbour', 'siren']`
    and every = 4: `unlockedKinds`: 0 → `[]`; 3 → `[]`; 4 → `['crossing']`;
    7 → `['crossing']`; 8 → `['crossing', 'pigeons']`; 20 and 99 → all five.
    `newKindAt`: 0 → null; 4 → `'crossing'`; 5 → null; 8 → `'pigeons'`;
    12 → `'dog'`; 16 → `'neighbour'`; 20 → `'siren'`; 24 → null.
    `introChances(full, ['crossing'])` →
    `{ crossing: 0.25, pigeons: 0, dog: 0, neighbour: 0, siren: 0 }`;
    `introChances(full, [])` → all 0. Neither changes `full`.
21. [P2] `obstacleKindForIndex(index, r, AC 14 chances, order, 4)`:
    (0, 0.1) → `'pothole'`; (3, 0) → `'pothole'`; (4, 0.99) → `'crossing'`;
    (5, 0.1) → `'crossing'`; (5, 0.3) → `'pothole'`; (8, 0.99) →
    `'pigeons'`; (9, 0.3) → `'pigeons'`; (9, 0.45) → `'pothole'`;
    (20, 0) → `'siren'`; (21, 0.75) → `'siren'`. For seeds 1, 42 and
    123456789: k = 0–3 are all potholes; k = 5–7 are only potholes or
    crossings; no siren before k = 20; all six kinds appear in k = 20–1019.
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
    start (about 5) and again after 2:30 (about 9). The second count is
    clearly higher. Tell us if it feels rushed (see Assumptions).
27. [P1] **Nothing else changed.** Potholes, crossings, pigeons, dog,
    `woof?` and the neighbour work as before in Light sleep.
28. [P1] **Restart.** After waking, `Walk again` shows `Light sleep` and a
    quiet street. The label is hidden on the end screen.

Part 2, on a computer browser:

29. [P2] **Potholes first.** A new walk: the first 4 obstacles are potholes.
    The 5th (about 0:30 at normal) is a crossing.
30. [P2] **One new kind at a time.** Keep walking at normal: pigeons first
    show up as the 9th obstacle (about 0:55), the dog as the 13th (about
    1:15, `woof?` first), the neighbour as the 17th (about 1:35). No kind
    appears before its turn.
31. [P2] **Siren, done right.** The 21st obstacle (about 1:50 at normal) is a
    siren: `nee-naw` appears top right and the bar under it fills. Keep a
    Shush. When the bar is full and the icon turns coral, press S. `Shhh!`
    shows, the meter goes up by 10, the Shush label drops by one, and the
    icon goes. No hit.
32. [P2] **Siren, done wrong.** Next siren: don't press S. `NEE-NAW!` shows
    top right for about 1.5 s, pink flash, drop of 15 (it is Dreamy by now;
    25 in Light).
33. [P2] **Siren, too early.** Next siren: press S when the bar is half
    full. It's a normal Shush (+10, uses a charge), and the siren still hits
    after the peak.
34. [P2] **No charges left.** Use both shushes, then press S at a siren's
    peak. Nothing happens, and the siren hits after the peak.
35. [P2] **Every walk.** Let the baby wake and press `Walk again`: the new
    walk again starts with 4 potholes.

On iPhone Safari (landscape), with the test buttons:

36. [P2] Tap `Shush` at a siren's peak with a charge left: it calms it, as on
    the keyboard.

## Assumptions (owner, please correct if wrong)

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
- Q1-B: the first obstacle of each block of 4 is always the new kind, so each
  lesson is met at once. The new kinds always come in the same order:
  crossing, pigeons, dog, neighbour, siren.
- **Awkward, Q1-B:** the lessons are in every walk, so later kinds come late.
  At normal speed the dog first shows at about 1:15, the neighbour at 1:35 and
  the siren at 1:50. Walks that end sooner never meet them. That includes
  many early walks: the W3 tuning put a careless walk at about 1:15–1:30. At
  your W6 cold playtest, some players may never see the siren. Going brisk
  brings them sooner. If this bothers you, lower `INTRO_EVERY` (e.g. 3: siren
  at about 1:25) or lower the gap. Both are numbers only.
- **Awkward, Q3-B:** with no Shush left, a siren can't be stopped. That goes
  against "every obstacle has one clear right answer". What softens it: the
  label shows `Shush: back in Ns`, and `nee-naw` warns you about 8 s ahead at
  normal. But the only "answer" is to have kept a charge earlier. Also, a
  calmed siren adds 10, so a well-timed siren is a small bonus. Watch whether
  a siren with no charges feels unfair at the W6 gate. If it does, Q3-A or C
  is a small rule change.
- **Awkward, Q4-C:** Dreamy is busy. At brisk, the next obstacle can be only
  0.9 s after a dog fence, and at normal about 3.3 s apart. Together with
  sirens that need a saved Shush, minute 3 may feel stressful rather than
  cozy. The three gaps are plain numbers in src/config.js, so B
  (700 / 560 / 450) is an easy retune after playtests.
- With Q1-B no walk counter is needed, so nothing has to be remembered
  between walks. Week 7's save doesn't need to know about lessons.
- TODO.md suggests moving the obstacle drawing out of src/StreetScene.js
  (now about 460 lines) before the siren. Part 1 touches every obstacle
  anyway, so gameplay-dev could do that tidy-up at the start of Part 1. It
  changes nothing you can see.
- DESIGN.md: with your approval I'll add "(Deep ×0.8, Dreamy ×0.6)" to the
  sleep stages line, and note that new obstacles join "one every 4
  obstacles in each walk". I won't change it until you say so.

## Out of scope

- Sleep minutes, brisk earning more, and changes to the end screen (second W5
  task).
- Showing the stage on the end screen.
- Baby faces, z's, a siren sound, an ambulance on screen (W8 art, W10 sound
  and juice).
- Cozy blanket and other upgrades (W7). `SLEEP_STAGE_MS` is ready for it.
- Skipping the lessons for experienced players, or remembering them between
  walks or page loads. Not in DESIGN.md.
- A tutorial, hint text or "new!" labels when a kind first appears. Not in
  DESIGN.md; if wanted, add to "Maybe later" first.
- A fourth stage, waking to a lighter stage on big hits, or obstacles that
  only appear in some stages. Not in DESIGN.md.
- A fixed test street or a "skip lessons" test switch (not needed now).
