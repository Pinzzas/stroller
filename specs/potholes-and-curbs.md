# Spec: Pothole and curb obstacles (W2, task 2)

Status: approved by the owner (2026-11-09). Answers: Q1 = B (wheels up for the
whole pothole crossing), Q2 = A (curb: slow and lifted), Q3 = C (random mix).
Plan item: PLAN.md W2, "Pothole and curb obstacles."
Builds on: specs/speed-lift-sleep-meter.md (accepted). Replaces its temporary
grey test bump (see TODO.md, 2026-11-09 note).
DESIGN.md rows used: Lift ("Tilts the front wheels over a curb or pothole. Bad
timing means a jolt."), Pothole (seen, lift over it, small jolt), Curb (seen,
slow down then lift, big jolt).

## Owner's answers (2026-11-09)

- **Q1 = B. Pothole: wheels up the whole time.** The front wheel must stay
  lifted for the entire time it is over the hole. Dropping in at any point is a
  jolt.
  - Check: with the first draft's 50-wide hole, crossing at slow speed takes
    0.71 s. The lift lasts only 0.8 s, so you would have to press within
    0.09 s of the hole arriving. That is possible, but far too tight for a cozy
    game. **Change: `POTHOLE_WIDTH` goes from 50 to 30.** The lift (0.8 s) is
    unchanged, so curbs feel the same. See "Is it possible at every speed?"
    below.
- **Q2 = A. Curb: slow and lifted.** Speed must be `slow` and the wheels up
  when the front wheel reaches the curb. Anything else costs 20.
- **Q3 = C. Random mix.** Each obstacle is a pothole or a curb at random
  (`CURB_CHANCE`), with the same even spacing. There is no difficulty ramp and
  no "one at a time" introduction (that is W5).

## Goal

As I push the stroller, potholes and curbs come along the pavement in a
surprise order: I keep the front wheels up all the way over potholes, and slow
down and then lift for curbs, and each one I get wrong jolts the baby and costs
sleep.

## What the owner sees

Everything from the speed, Lift and sleep meter task stays (meter, speed label,
lift tilt, pink hit flash, refill, test buttons). Changes:

- **The grey test bump is gone.** It never appears again.
- **Pothole:** a dark brown-grey strip, 30 wide and 10 tall, set into the
  pavement right where the wheels roll (its top edge is the line the wheels
  stand on). It looks like a slot the wheel could drop into.
- **Curb:** a light stone-grey block, 36 wide and 24 tall, standing on the
  pavement where the wheels roll. It is taller than a wheel, so it clearly
  looks like the "big" one.
- Both slide in from the right with the street. With the starting values an
  obstacle reaches the front wheel about every 7.5 seconds at normal speed.
  Each one is a pothole or a curb at random: about 1 in 3 is a curb. Reloading
  the page gives a different order.
- **Pothole hit:** stroller flashes pink, sleep drops by 10.
- **Curb hit:** stroller flashes pink, sleep drops by 20.
- **Done right:** nothing happens. No flash, the meter does not drop.

## Controls and states

### Controls
No new controls. Same as before:

| Action | Keyboard | Touch / mouse (test buttons) |
| --- | --- | --- |
| Speed up one step | Up arrow | Tap `Faster` |
| Slow down one step | Down arrow | Tap `Slower` |
| Lift | Hold Space | Hold `Lift (hold)` |

S (Shush) still does nothing (W3).

### States
- Speed, lift, sleep and hit flash: unchanged from the previous spec.
- **Street seed:** a whole number picked at random when the scene starts
  (`Math.floor(Math.random() * 2 ** 32)`). It fixes the type of every
  obstacle for this walk. Only the scene uses `Math.random`. The pure logic
  gets the seed as an input.
- **Obstacle type:** each obstacle is `pothole` or `curb`, worked out from its
  index and the seed. It never changes while it is on screen.
- **Last jolted pothole:** the index of the last pothole that already cost
  sleep. It starts at -1. It makes sure a pothole only ever costs sleep once.

## Start, end and fail conditions

- Start: as before. Page load starts the walk: speed `normal`, lift `down`,
  sleep 100, and a new random seed. The first obstacle reaches the front wheel
  about 7.4 s after load at normal speed. It may be a pothole or a curb.
- End: none yet. The street and its obstacles go on until the page is closed.
- Fail: none yet. At 0 sleep the walk carries on and the meter can refill.
  Waking up, run end and restart are W3.

## How obstacles appear

- Obstacles are placed along the street at a fixed distance apart and slide
  left with it (same idea as the test bump). Going faster means they arrive
  more often in seconds, but the gap in distance is the same.
- Obstacle number k (k = 0, 1, 2, ...) has its left edge at street position
  `OBSTACLE_FIRST_X + k * OBSTACLE_SPACING`. Its screen x is that minus the
  total scroll so far.
- Its type is `obstacleTypeFor(obstacleRandom(seed, k), CURB_CHANCE)`. This
  gives `curb` about `CURB_CHANCE` of the time and `pothole` otherwise, and
  always the same answer for the same seed and k.
- Both are drawn with their left edge at that x. Pothole: top at
  `STROLLER_GROUND_Y`, going down `POTHOLE_DEPTH`. Curb: bottom at
  `STROLLER_GROUND_Y`, going up `CURB_HEIGHT`. They are drawn on the street
  layer (behind the stroller), as the test bump was.
- Timing with the starting values (obstacle k's left edge reaches the front
  wheel when the scroll is `889 + 900 * k`): first at about 7.4 s at normal
  speed, then every 7.5 s at normal, 12.9 s at slow and 5 s at brisk.

### Enough warning for a curb
- `OBSTACLE_FIRST_X` (1200) is past the right edge of the screen (960), so
  every obstacle, including the first, slides in from the right. None pops up
  near the stroller.
- From the right edge to the front wheel is 960 − 311 = 649 pixels. At brisk
  (180 px/s) that is 3.6 s from first sight to arrival, at normal 5.4 s and at
  slow 9.3 s. Slowing from brisk to slow takes two key presses, so a curb can
  always be handled.
- Two curbs in a row are fine: the gap between them is 900 pixels (5 s even at
  brisk).

## What counts as right and wrong

Only the front wheel matters. Its centre x is 311, worked out from config as
before. Its "street position" is `scroll + 311`. Each frame the scene first
updates the lift, then moves the scroll, then does the checks below using the
lift state from this frame.

### Pothole (whole crossing)
- A pothole is "under the wheel" while the wheel's street position is inside
  the hole: after its left edge and up to its right edge
  (`left < position <= left + POTHOLE_WIDTH`).
- In any frame in which the wheel is over the hole (or passes across it during
  the frame) and the lift is **not** `lifted`, it is a small jolt: sleep drops
  by `SLEEP_JOLT_SMALL` (10). It happens at most once per pothole.
- So the wheels must already be up when the wheel reaches the hole, and still
  up when it leaves it.
  - Lift too late: the wheel drops in at the start. Jolt.
  - Lift too early: the 0.8 s lift runs out while still over the hole. Jolt.
  - Let go halfway: jolt.
  - Speed does not matter for potholes.

### Curb (one check moment)
- Checked once, in the frame where the curb's left edge reaches the wheel (as
  the test bump was).
- Right answer: lift is `lifted` **and** the current street speed is at or
  below `CURB_MAX_SAFE_SPEED` (70, so only `slow`). Then nothing happens.
- Anything else is a big jolt: sleep drops by `SLEEP_JOLT_BIG` (20).
- "Slow down" means the speed at the check moment. You can speed up again
  right after.

### On any jolt
The pink flash starts (same `HIT_FLASH_MS`) and the 3 s refill wait restarts,
exactly as with the test bump.

### Is it possible at every speed?
With `POTHOLE_WIDTH` 30 and `LIFT_MAX_HOLD_MS` 800:

| Speed | Time over the hole | Spare time = how early you may press and still be safe |
| --- | --- | --- |
| slow (70) | 0.43 s | 0.37 s |
| normal (120) | 0.25 s | 0.55 s |
| brisk (180) | 0.17 s | 0.63 s |

The rule is: press Space at most the spare time before the hole reaches the
wheel, and no later than the moment it arrives. Slow is the tightest. That is a
gentle irony (slow is still the safe choice for curbs), not a problem. The
window is about 0.37 s, which a person can do comfortably. If playtests find
it too tight, lower `POTHOLE_WIDTH` or raise `LIFT_MAX_HOLD_MS`. (The Big
wheels upgrade in W7 will widen it too.)

## Tuning values (src/config.js)

Named exports in `src/config.js`. Everything from earlier specs stays, except
the test bump values, which are removed.

### Removed
`TEST_BUMP_FIRST_X`, `TEST_BUMP_SPACING`, `TEST_BUMP_WIDTH`,
`TEST_BUMP_HEIGHT`, `COLOR_TEST_BUMP`.

### Sleep (changed / new)
| Name | Value | Meaning |
| --- | --- | --- |
| `SLEEP_JOLT_SMALL` | 10 | Sleep lost on a small jolt (pothole). Value unchanged; comment updated |
| `SLEEP_JOLT_BIG` | 20 | Sleep lost on a big jolt (curb) |

### Obstacles (new)
| Name | Value | Meaning |
| --- | --- | --- |
| `OBSTACLE_FIRST_X` | 1200 | Street position of the first obstacle's left edge (must be past the screen's right edge) |
| `OBSTACLE_SPACING` | 900 | Street distance from one obstacle to the next |
| `CURB_CHANCE` | 0.35 | Chance (0 to 1) that an obstacle is a curb; otherwise it is a pothole |
| `POTHOLE_WIDTH` | 30 | Pothole width. Also how far the wheel must stay lifted |
| `POTHOLE_DEPTH` | 10 | Pothole height, downward from `STROLLER_GROUND_Y` (drawing only) |
| `COLOR_POTHOLE` | 0x6b625a | Pothole colour (dark brown-grey) |
| `CURB_WIDTH` | 36 | Curb width (drawing only) |
| `CURB_HEIGHT` | 24 | Curb height, upward from `STROLLER_GROUND_Y` (drawing only) |
| `COLOR_CURB` | 0xa69e92 | Curb colour (light stone grey) |
| `CURB_MAX_SAFE_SPEED` | 70 | Fastest street speed (pixels per second) that counts as "slowed down" for a curb |

`LIFT_MAX_HOLD_MS` stays 800.

## Logic (src/logic/)

`src/logic/bumps.js` is replaced by `src/logic/obstacles.js`. bumps.js is
deleted, and nothing imports it any more. There is no Phaser code, and all the
functions are pure (same input gives same output, nothing else changes). Tuning
values and the seed are passed in as inputs, not imported from config, and
nothing in `src/logic/` uses `Math.random`.

### `src/logic/obstacles.js`
1. `obstacleScreenX(index, scroll, firstX, spacing)` → number
   Returns `firstX + index * spacing - scroll`.
2. `obstacleRandom(seed, index)` → number from 0 (included) to 1 (not included)
   - The same `seed` and `index` always give the same number.
   - Neighbouring indexes give unrelated-looking numbers.
   - Suggested: one mixing step of the well-known "mulberry32" generator,
     applied to `(seed + (index + 1) * 0x6D2B79F5) >>> 0` and divided by
     2^32. Any small integer hash that passes criteria 3–4 is fine. No
     libraries.
3. `obstacleTypeFor(randomValue, curbChance)` → `'curb'` if
   `randomValue < curbChance`, otherwise `'pothole'`.
4. `visibleObstacleIndexes(scroll, firstX, spacing, width, viewWidth)` → array
   Every index k >= 0 whose box is at least partly on screen
   (`x + width > 0` and `x < viewWidth`), in increasing order. The scene passes
   the wider of `POTHOLE_WIDTH` and `CURB_WIDTH` as `width`. Returns `[]` if
   `spacing <= 0`.
5. `obstacleIndexesReachingWheel(prevScroll, scroll, firstX, spacing, wheelX)`
   → array of indexes, in increasing order. Used for curbs.
   Every k >= 0 with `prevScroll + wheelX < firstX + k * spacing <= scroll + wheelX`.
   Returns `[]` if `scroll <= prevScroll` or `spacing <= 0`.
6. `obstacleIndexesOverWheel(prevScroll, scroll, firstX, spacing, wheelX, width)`
   → array of indexes, in increasing order. Used for potholes.
   Every k >= 0 whose span `(L, L + width]`, with `L = firstX + k * spacing`,
   overlaps the wheel's movement this frame `(prevScroll + wheelX, scroll + wheelX]`.
   That is, `prevScroll + wheelX < L + width` and `scroll + wheelX > L`.
   Returns `[]` if `scroll <= prevScroll` or `spacing <= 0`.
7. `checkPothole(index, isLifted, lastJoltedIndex, damage)` →
   `{ damage, lastJoltedIndex }`
   - Not lifted and `index > lastJoltedIndex`: `{ damage, lastJoltedIndex: index }`.
   - Otherwise: `{ damage: 0, lastJoltedIndex }` (unchanged).
8. `curbDamage(isLifted, speed, rules)` → number
   `rules` is `{ damage, maxSafeSpeed }`; `speed` is the current street speed
   in pixels per second. Returns 0 if `isLifted` and `speed <= maxSafeSpeed`,
   otherwise `damage`.

`src/logic/sleep.js`, `speed.js`, `lift.js` and `scroll.js` are unchanged.

Each frame the scene does what it did before (lift, then scroll, then checks,
then refill, then draw). The bump step becomes:
- For each k from `obstacleIndexesOverWheel(... POTHOLE_WIDTH)` whose type is
  `pothole`: `checkPothole(k, lift.isLifted, lastJoltedPothole, SLEEP_JOLT_SMALL)`.
  Store the new `lastJoltedIndex`.
- For each k from `obstacleIndexesReachingWheel(...)` whose type is `curb`:
  `curbDamage(lift.isLifted, currentSpeed, { damage: SLEEP_JOLT_BIG, maxSafeSpeed: CURB_MAX_SAFE_SPEED })`.
- Any damage above 0: `applySleepDamage`, start the flash, reset the refill
  wait.

## Acceptance criteria

### Automated (tester, `npm test`)

1. `npm test` passes (exit code 0). Earlier tests still pass, except that the
   test bump tests (tests/bumps.test.js) are replaced by obstacle tests, and the
   config test no longer expects the `TEST_BUMP_*` / `COLOR_TEST_BUMP` values.
2. `obstacleScreenX(0, 0, 1200, 900)` is 1200; `obstacleScreenX(2, 1000, 1200, 900)`
   is 2000.
3. `obstacleRandom`: for seeds 1, 42 and 123456789 and every index 0–999, the
   result is `>= 0` and `< 1`. Calling it twice with the same seed and index
   gives the same result.
4. `obstacleRandom` gives a mix:
   - For seed 42, `obstacleTypeFor(obstacleRandom(42, k), 0.35)` over k = 0–999
     gives between 250 and 450 curbs.
   - Seeds 1 and 2 give different type lists for k = 0–19.
   - Each seed has both types somewhere in k = 0–19.
5. `obstacleTypeFor`: (0.1, 0.35) → `'curb'`; (0.35, 0.35) → `'pothole'`;
   (0.9, 0.35) → `'pothole'`; (0, 0) → `'pothole'`; (0.999, 1) → `'curb'`.
6. `visibleObstacleIndexes(scroll, 1200, 900, 36, 960)`: scroll 0 → `[]`;
   scroll 300 → `[0]`; scroll 1230 → `[0, 1]` (obstacle 0 at -30, still partly
   visible); scroll 1240 → `[1]`; scroll 2200 → `[2]`. With spacing 0 → `[]`.
7. `obstacleIndexesReachingWheel` with firstX 1200, spacing 900, wheelX 311:
   - (0, 100) → `[]`; (880, 889) → `[0]`; (889, 900) → `[]`
   - (1780, 1790) → `[1]`; (2680, 2690) → `[2]`; (0, 3000) → `[0, 1, 2]`
   - (500, 500) → `[]`; (500, 400) → `[]`
   - Stepping the scroll from 0 to 9000 in steps of 3 and collecting all the
     results gives exactly `[0, 1, ..., 9]`, each once.
8. `obstacleIndexesOverWheel` with firstX 1200, spacing 900, wheelX 311,
   width 30 (hole 0 is under the wheel for scroll 889 to 919):
   - (880, 889) → `[]`; (889, 890) → `[0]`; (900, 910) → `[0]`
   - (918, 925) → `[0]`; (919, 925) → `[]`
   - (880, 1000) → `[0]` (jumped right across it in one frame)
   - (0, 3000) → `[0, 1, 2]`; (500, 500) → `[]`; (910, 900) → `[]`
9. `checkPothole`:
   - (0, true, -1, 10) → `{ damage: 0, lastJoltedIndex: -1 }`
   - (0, false, -1, 10) → `{ damage: 10, lastJoltedIndex: 0 }`
   - (0, false, 0, 10) → `{ damage: 0, lastJoltedIndex: 0 }`
   - (1, false, 0, 10) → `{ damage: 10, lastJoltedIndex: 1 }`
10. `curbDamage` with `{ damage: 20, maxSafeSpeed: 70 }`: (true, 70) → 0;
    (true, 120) → 20; (true, 180) → 20; (false, 70) → 20; (false, 180) → 20.
11. Whole-crossing simulation for one pothole (index 0, firstX 1200, spacing
    900, wheelX 311, width 30, lift max 800). The test uses only the pure
    functions: 16 ms frames, `updateLift` then `advanceScroll` then
    `obstacleIndexesOverWheel` + `checkPothole`, with Space pressed at a set
    time relative to the moment the hole's left edge reaches the wheel, and
    held from then on. Total damage:
    - slow (70): pressed 300 ms before → 0; 450 ms before → 10; 50 ms after → 10.
    - normal (120): 400 ms before → 0; 600 ms before → 10.
    - brisk (180): 500 ms before → 0; 700 ms before → 10.
    - slow, pressed 300 ms before but let go 100 ms after arrival → 10.
    - Not pressed at all → 10, and never more than 10.
12. Big jolt on the meter: `applySleepDamage(100, 20, 100)` is 80;
    `applySleepDamage(15, 20, 100)` is 0.
13. Config sanity, using the values in `src/config.js`:
    - `1000 * POTHOLE_WIDTH / speed < LIFT_MAX_HOLD_MS` for each of
      `SPEED_SLOW`, `SPEED_NORMAL` and `SPEED_BRISK`. (A pothole can be cleared
      at every speed.)
    - `OBSTACLE_FIRST_X >= GAME_WIDTH`. (Nothing pops up on screen.)
    - `(GAME_WIDTH - frontWheelX) / SPEED_BRISK >= 2` seconds, with
      frontWheelX worked out from config (311). (A curb gives at least 2 s of
      warning even at brisk.)
14. `src/logic/bumps.js` does not exist, and no file in `src/` mentions
    `bumps.js` or `TEST_BUMP`. No file in `src/logic/` contains `Math.random`.
15. No file in `src/logic/` contains the word "phaser" (any capitalisation).
16. `src/config.js` exports every name in the "Sleep (changed / new)" and
    "Obstacles (new)" tables with the exact values listed, still exports
    `LIFT_MAX_HOLD_MS` = 800, and does not export any of the five removed
    names.

### Manual (owner, on https://pinzzas.github.io/stroller/)

The order is random, so each step says "the next pothole" or "the next curb".
Let any other obstacles pass. Before each step, wait until the meter shows
`Sleep 100`, so drops are easy to read. Leave the speed at normal unless a step
says otherwise.

On a computer browser:

17. No grey test bump appears anywhere, at any time. Within about 8 seconds of
    loading, the first obstacle slides in from the right edge.
18. Over the first minute you see both kinds: a dark slot in the wheel line
    (pothole) and a taller light-grey block (curb). Reload the page twice: the
    order of potholes and curbs is usually different each time.
19. Next pothole: do nothing. When it reaches the front (right) wheel, the
    stroller flashes pink and the meter drops by 10 (`Sleep 90`).
20. Next pothole: hold Space just before it reaches the front wheel, and keep
    holding. No flash, no drop.
21. Next pothole, at slow speed: tap Space very briefly, just as the hole
    reaches the wheel. The wheel drops back into the hole. Flash, drop by 10.
22. Next pothole: hold Space far too early (more than a second before). The
    stroller drops back down before the hole. Flash, drop by 10.
23. Next curb, at normal speed: lift over it. Flash, drop by 20 (`Sleep 80`).
24. Next curb: press Down to go slow, but don't lift. Flash, drop by 20.
25. Next curb: go slow, then hold Space just before it reaches the wheel. No
    flash, no drop. Press Up afterwards: the speed goes back up as normal.
26. At brisk, when a curb appears at the right edge, press Down twice and lift.
    There is enough time to do it calmly.
27. At brisk, watch several obstacles. Each one only ever costs 10 (pothole) or
    20 (curb) once, never double. At `Sleep 0` nothing breaks and the walk
    continues.

On iPhone Safari (landscape), with the test buttons:

28. Potholes and curbs appear as above. Hold `Lift (hold)` over a pothole: no
    drop. Tap `Slower` until `Speed: slow`, then hold `Lift (hold)` over a
    curb: no drop.

## Assumptions (owner, please correct if wrong)

- To make the whole-crossing rule fair at slow speed, the pothole was narrowed
  (50 → 30) rather than making the lift longer. A longer lift would also make
  curbs and "lifting too early" more forgiving.
- About 1 in 3 obstacles is a curb (`CURB_CHANCE` 0.35). The first obstacle can
  be either kind. There is no limit on curbs or potholes in a row (spacing
  keeps them fair).
- Each page load gets a new random order. A fixed "test street" setting is not
  included. It can be added if testing on the page gets awkward.
- Small jolt stays 10 (DESIGN.md "about 10"). Big jolt is 20: clearly bigger
  than a pothole, but still below a loud noise (DESIGN.md "about 25").
- Only the front wheel is checked, as with the test bump. The back wheel rolls
  over everything without effect.
- The curb is drawn as a raised block that the stroller passes "through". The
  stroller does not actually climb onto a higher pavement. There is no real
  physics; the tilt is only drawing.
- The curb keeps the one-check-moment rule (Q2 = A). Only potholes need the
  whole crossing.
- Spacing goes from 1080 (test bump) to 900, so there is a bit more to do
  (about every 7.5 s at normal).
- Both kinds use the same pink flash. A stronger "big jolt" effect (wobble)
  comes with juice in W10.
- Tests live in `tests/`. The tester picks file names and replaces
  tests/bumps.test.js.

## Out of scope / maybe later

- Difficulty ramp, obstacles coming more often in deeper sleep, introducing
  obstacles one at a time (W5)
- Pigeons, dog, neighbour, siren (W4–W5)
- Shush, run end at 0 sleep, wake-up, restart (W3)
- Sleep stages and damage reduction (W5)
- Big wheels (wider lift window) and Suspension (smaller jolts) upgrades (W7)
- Real art for potholes and curbs (W8); wobble, jolt sounds (W10)
- A fixed or shareable street seed
- Stroller actually climbing a curb, different pavement heights, back-wheel
  checks: not in DESIGN.md. If wanted, add to "Maybe later" first.
