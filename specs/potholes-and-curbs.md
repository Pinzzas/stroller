# Spec: Pothole and curb obstacles (W2, task 2)

Status: draft, waiting for the owner's approval. Questions Q1–Q3 below need an
answer (the spec is written for the recommended option of each).
Plan item: PLAN.md W2, "Pothole and curb obstacles."
Builds on: specs/speed-lift-sleep-meter.md (accepted). Replaces its temporary
grey test bump (see TODO.md, 2026-11-09 note).
DESIGN.md rows used: Lift ("Tilts the front wheels over a curb or pothole. Bad
timing means a jolt."), Pothole (seen, lift over it, small jolt), Curb (seen,
slow down then lift, big jolt).

## Questions for the owner

**Q1. What counts as a good lift over a pothole?**
- **A. (Recommended) One check moment.** The game checks once, at the moment
  the front wheel reaches the near edge of the hole. Wheels up then = safe.
  Lift too late = jolt. Lift too early = your arms tire after 0.8 s and the
  wheel drops in = jolt. This is exactly how the test bump works today, so it
  is already tried and tested, and it is gentle (cozy).
- **B. Up for the whole crossing.** The wheel must stay up the entire time it
  is over the hole. Harder, and more to build and test (each hole has to be
  watched for a while instead of checked once).
- **C. Like A, but a shorter lift (0.5 s instead of 0.8 s).** Tighter timing
  with no new rules. Can also be done later just by changing one number.

**Q2. What does "slow down, then lift" mean for a curb?**
- **A. (Recommended) Speed must be "slow" and the wheels lifted** when the
  front wheel reaches the curb. Anything else is a big jolt (20). One clear
  right answer, as DESIGN.md asks.
- **B. "Normal or slow" counts as slowed down.** Easier; brisk is the only
  wrong speed. (Same rule, one number changed: `CURB_MAX_SAFE_SPEED` 120.)
- **C. Partial credit.** Lifted but too fast = small jolt (10); not lifted at
  all = big jolt (20). Kinder, but blurs the "one clear answer" rule.

**Q3. In what order do obstacles come?**
- **A. (Recommended) A fixed repeating order: pothole, pothole, curb**, evenly
  spaced. You always know what to expect, which makes playtesting easy.
- **B. Simply alternate: pothole, curb, pothole, curb.** More curbs, so more
  practice with slowing down.
- **C. Random mix.** More surprise, but it starts a level system that DESIGN.md
  and PLAN.md put in W5 ("introduce obstacles one at a time"). Not recommended
  now.

## Goal

As I push the stroller, potholes and curbs come along the pavement: I lift the
front wheels over potholes, and slow down and then lift for curbs, and each one
I get wrong jolts the baby and costs sleep.

## What the owner sees

Everything from the speed, Lift and sleep meter task stays (meter, speed label,
lift tilt, pink hit flash, refill, test buttons). Changes:

- **The grey test bump is gone.** It never appears again.
- **Pothole:** a dark brown-grey strip, 50 wide and 10 tall, set into the
  pavement right where the wheels roll (its top edge is the line the wheels
  stand on). It looks like a slot the wheel could drop into.
- **Curb:** a light stone-grey block, 36 wide and 24 tall, standing on the
  pavement where the wheels roll. It is taller than a wheel, so it clearly
  looks like the "big" one.
- Both slide in from the right with the street. With the starting values an
  obstacle reaches the front wheel about every 7.5 seconds at normal speed,
  in the order pothole, pothole, curb, pothole, pothole, curb, ...
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
- **Obstacle type:** each obstacle is either `pothole` or `curb`. Its type is
  fixed by its place in the line (see "How obstacles appear").
- Each obstacle is checked exactly once and then just slides away.

## Start, end and fail conditions

- Start: as before. Page load starts the walk: speed `normal`, lift `down`,
  sleep 100. The first obstacle (a pothole) reaches the front wheel about 7.4 s
  after load at normal speed.
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
- Its type is `OBSTACLE_PATTERN[k % OBSTACLE_PATTERN.length]`, so with the
  starting pattern: 0 pothole, 1 pothole, 2 curb, 3 pothole, 4 pothole,
  5 curb, ...
- Both are drawn with their left edge at that x. Pothole: top at
  `STROLLER_GROUND_Y`, going down `POTHOLE_DEPTH`. Curb: bottom at
  `STROLLER_GROUND_Y`, going up `CURB_HEIGHT`.
- Obstacles are drawn on the street layer (behind the stroller), like the
  test bump was.
- Timing with the starting values (obstacle k reaches the wheel when the
  scroll is `889 + 900 * k`): at normal speed about 7.4 s, 14.9 s, 22.4 s
  (the first curb), then every 7.5 s. At slow about every 12.9 s; at brisk
  about every 5 s.
- A curb first appears at the right edge about 3.6 s before it reaches the
  wheel even at brisk, which is enough time to press Down twice and then lift.

## What counts as right and wrong

The "check moment" for an obstacle is the frame in which its left edge reaches
the front wheel's centre x (311, worked out from config as before). Only the
front wheel matters. At that moment:

| Obstacle | Right answer (no damage) | Anything else |
| --- | --- | --- |
| Pothole | Lift is `lifted` (any speed) | Small jolt: sleep −`SLEEP_JOLT_SMALL` (10) |
| Curb | Lift is `lifted` **and** current street speed ≤ `CURB_MAX_SAFE_SPEED` (70, so only `slow`) | Big jolt: sleep −`SLEEP_JOLT_BIG` (20) |

- "Slow down" means the speed at the check moment, not before or after. You
  can speed up again right after the curb.
- "Bad timing" (DESIGN.md): lifting too late means the wheels are still down at
  the check moment; lifting too early means the 0.8 s lift has already ended
  ("arms get tired"). Both count as not lifted.
- On any jolt: the pink flash starts (same `HIT_FLASH_MS`), and the 3 s refill
  wait restarts, exactly as the test bump did.
- One obstacle never costs sleep twice.

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
| `OBSTACLE_FIRST_X` | 1200 | Street position of the first obstacle's left edge |
| `OBSTACLE_SPACING` | 900 | Street distance from one obstacle to the next |
| `OBSTACLE_PATTERN` | `['pothole', 'pothole', 'curb']` | Repeating order of obstacle types |
| `POTHOLE_WIDTH` | 50 | Pothole width (drawing only) |
| `POTHOLE_DEPTH` | 10 | Pothole height, downward from `STROLLER_GROUND_Y` (drawing only) |
| `COLOR_POTHOLE` | 0x6b625a | Pothole colour (dark brown-grey) |
| `CURB_WIDTH` | 36 | Curb width (drawing only) |
| `CURB_HEIGHT` | 24 | Curb height, upward from `STROLLER_GROUND_Y` (drawing only) |
| `COLOR_CURB` | 0xa69e92 | Curb colour (light stone grey) |
| `CURB_MAX_SAFE_SPEED` | 70 | Fastest street speed (pixels per second) that counts as "slowed down" for a curb |

## Logic (src/logic/)

`src/logic/bumps.js` is replaced by `src/logic/obstacles.js` (bumps.js is
deleted, and nothing imports it any more). No Phaser code, all functions pure,
tuning values passed in as inputs (not imported from config).

### `src/logic/obstacles.js`
1. `obstacleScreenX(index, scroll, firstX, spacing)` → number
   Returns `firstX + index * spacing - scroll`.
2. `obstacleType(index, pattern)` → string
   Returns `pattern[index % pattern.length]`.
3. `visibleObstacleIndexes(scroll, firstX, spacing, width, viewWidth)` → array
   Every index k >= 0 whose box is at least partly on screen
   (`x + width > 0` and `x < viewWidth`), in increasing order. The scene passes
   the wider of `POTHOLE_WIDTH` and `CURB_WIDTH` as `width`. Returns `[]` if
   `spacing <= 0`.
4. `obstacleIndexesReachingWheel(prevScroll, scroll, firstX, spacing, wheelX)`
   → array of indexes, in increasing order
   Every k >= 0 with `prevScroll + wheelX < firstX + k * spacing <= scroll + wheelX`.
   Returns `[]` if `scroll <= prevScroll` or `spacing <= 0`.
   (An array, not a count, because each index can be a different type.)
5. `obstacleDamage(type, isLifted, speed, rules)` → number
   `rules` is `{ potholeDamage, curbDamage, curbMaxSafeSpeed }`; `speed` is the
   current street speed in pixels per second.
   - `'pothole'`: 0 if `isLifted`, else `potholeDamage`.
   - `'curb'`: 0 if `isLifted` and `speed <= curbMaxSafeSpeed`, else
     `curbDamage`.
   - Any other type: 0.

`src/logic/sleep.js`, `speed.js`, `lift.js` and `scroll.js` are unchanged.

Each frame the scene does what it did before, except the bump step becomes:
for each index from `obstacleIndexesReachingWheel`, look up its
`obstacleType`, get `obstacleDamage` (with the current speed from
`speedForLevel`), and if it is above 0 apply it with `applySleepDamage`, start
the flash and reset the refill wait.

## Acceptance criteria

### Automated (tester, `npm test`)

1. `npm test` passes (exit code 0). Earlier tests still pass, except that the
   test bump tests (tests/bumps.test.js) are replaced by obstacle tests, and the
   config test no longer expects the `TEST_BUMP_*` / `COLOR_TEST_BUMP` values.
2. `obstacleScreenX(0, 0, 1200, 900)` is 1200; `obstacleScreenX(2, 1000, 1200, 900)`
   is 2000.
3. `obstacleType` with `['pothole', 'pothole', 'curb']`: index 0 → `'pothole'`,
   1 → `'pothole'`, 2 → `'curb'`, 3 → `'pothole'`, 5 → `'curb'`.
4. `visibleObstacleIndexes(scroll, 1200, 900, 50, 960)`:
   scroll 0 → `[]`; scroll 300 → `[0]`; scroll 1230 → `[0, 1]` (obstacle 0 at
   -30, still partly visible; obstacle 1 at 870); scroll 1260 → `[1]`;
   scroll 2200 → `[2]`. With spacing 0 → `[]`.
5. `obstacleIndexesReachingWheel` with firstX 1200, spacing 900, wheelX 311:
   (0, 100) → `[]`; (880, 889) → `[0]`; (889, 900) → `[]`;
   (1780, 1790) → `[1]`; (2680, 2690) → `[2]`; (0, 3000) → `[0, 1, 2]`;
   (500, 500) → `[]`; (500, 400) → `[]`.
6. Stepping the scroll from 0 to 9000 in steps of 3 and collecting all indexes
   from `obstacleIndexesReachingWheel` gives exactly `[0, 1, ..., 9]`, each
   once (no obstacle is checked twice or skipped).
7. `obstacleDamage` with rules `{ potholeDamage: 10, curbDamage: 20, curbMaxSafeSpeed: 70 }`:
   (`'pothole'`, true, 180) → 0; (`'pothole'`, false, 70) → 10;
   (`'curb'`, true, 70) → 0; (`'curb'`, true, 120) → 20;
   (`'curb'`, true, 180) → 20; (`'curb'`, false, 70) → 20;
   (`'banana'`, false, 120) → 0.
8. Big jolt on the meter: `applySleepDamage(100, 20, 100)` is 80;
   `applySleepDamage(15, 20, 100)` is 0.
9. `src/logic/bumps.js` does not exist, and no file in `src/` mentions
   `bumps.js` or `TEST_BUMP`.
10. No file in `src/logic/` contains the word "phaser" (any capitalisation).
11. `src/config.js` exports every name in the "Sleep (changed / new)" and
    "Obstacles (new)" tables with the exact values listed (`OBSTACLE_PATTERN`
    deep-equals `['pothole', 'pothole', 'curb']`), and does not export any of
    the five removed names.

### Manual (owner, on https://pinzzas.github.io/stroller/)

On a computer browser. Reload the page before starting, and leave the speed at
normal unless a step says otherwise.

12. No grey test bump appears anywhere, at any time.
13. About 7 seconds after loading, a dark slot (pothole) slides in along the
    wheel line. Do nothing: when it reaches the front (right) wheel the
    stroller flashes pink and the meter shows `Sleep 90`.
14. About 7 seconds later a second pothole comes. Hold Space just before it
    reaches the front wheel: no flash, the meter does not drop.
15. Wait for the third obstacle (about 22 seconds after loading): a taller,
    light-grey block (curb). By now the meter has refilled to `Sleep 100`.
    Stay at normal speed and lift over it: the stroller flashes and the meter
    shows `Sleep 80` (a bigger drop than a pothole).
16. Next curb (the 6th obstacle; two potholes come first): press Down to go
    slow, but don't lift. It flashes and drops by 20.
17. Next curb (the 9th obstacle): go slow and hold Space just before it reaches
    the wheel. No flash, no drop. Press Up again afterwards: the speed goes
    back up as normal.
18. Hold Space much too early (more than a second before a pothole arrives):
    the stroller drops back down before the pothole and you get the jolt
    (drop of 10).
19. Switch to brisk and watch several obstacles: each one only ever costs 10
    (pothole) or 20 (curb) once, never double. At `Sleep 0` nothing breaks and
    the walk continues.

On iPhone Safari (landscape), with the test buttons:

20. Potholes and curbs appear as above. Hold `Lift (hold)` over a pothole: no
    drop. Tap `Slower` until `Speed: slow`, then hold `Lift (hold)` over a
    curb: no drop.

## Assumptions (owner, please correct if wrong)

- Q1 = A, Q2 = A, Q3 = A (the recommended options).
- Small jolt stays 10 (DESIGN.md "about 10"). Big jolt is 20: clearly bigger
  than a pothole, but still below a loud noise (DESIGN.md "about 25").
- Only the front wheel is checked, as with the test bump. The back wheel rolls
  over everything without effect.
- The curb is drawn as a raised block that the stroller passes "through"; the
  stroller does not actually climb up onto a higher pavement. There is no real
  physics; the tilt is only drawing.
- Widths of the pothole and curb are for drawing only; with the one check
  moment (Q1 = A) they don't change the timing.
- Spacing goes from 1080 (test bump) to 900, so there is a bit more to do
  (about every 7.5 s at normal) now that there are two kinds of obstacle.
- Both kinds use the same pink flash. A stronger "big jolt" effect (wobble)
  comes with juice in W10.
- The first obstacle is always a pothole, so the easier rule comes first. Real
  "introduce one at a time" teaching is W5.
- Tests live in `tests/`; the tester picks file names and replaces
  tests/bumps.test.js.

## Out of scope / maybe later

- Random or growing obstacle mixes, obstacles coming more often in deeper
  sleep, introducing obstacles one at a time (W5)
- Pigeons, dog, neighbour, siren (W4–W5)
- Shush, run end at 0 sleep, wake-up, restart (W3)
- Sleep stages and damage reduction (W5)
- Big wheels (wider lift window) and Suspension (smaller jolts) upgrades (W7)
- Real art for potholes and curbs (W8); wobble, jolt sounds (W10)
- Stroller actually climbing a curb, different pavement heights, back-wheel
  checks: not in DESIGN.md. If wanted, add to "Maybe later" first.
