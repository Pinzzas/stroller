# Spec: Pothole and curb obstacles (W2, task 2)

Status: **approved (revision 2) on 2026-11-10, Q4 = A, Q5 = A.** The first
build was rejected on 2026-11-09. This revision follows the owner's notes.
Earlier answers still apply: Q1 = B (wheels up for the whole pothole
crossing), Q2 = A (curb: slow and lifted), Q3 = C (random mix).
New questions Q4–Q5 below need an answer. The spec is written for the
recommended option of each.
Plan item: PLAN.md W2, "Pothole and curb obstacles."
Builds on: specs/speed-lift-sleep-meter.md (accepted). Replaces its temporary
grey test bump.
DESIGN.md rows used: Lift ("Tilts the front wheels over a curb or pothole. Bad
timing means a jolt."), Pothole (seen, lift over it, small jolt), Curb (seen,
slow down then lift, big jolt).

## What changed after the owner's playtest (2026-11-09)

The owner's notes:
1. Potholes and curbs were hard to tell apart.
2. The curb looked like a block sitting on the pavement.
3. Both curbs (down and up) need slow speed and the wheels up.

What this revision does about them:
- **The curb is now a "crossing":**
  - the pavement stops, with a curb going **down** to the road;
  - then a lower road with white zebra stripes;
  - then a curb going **up** onto the next pavement.
- **Each of the two curbs is its own check:** slow and lifted, or a big jolt.
- **The crossing is one obstacle in the random mix.** `CURB_CHANCE` becomes
  `CROSSING_CHANCE`.
- **The pothole gets a darker colour.** The crossing now looks completely
  different: wide, dark road, white stripes, and no pavement.

The pothole rule from revision 1 is unchanged: wheels up for the whole time
over the hole, `POTHOLE_WIDTH` 30.

## Questions for the owner

**Q4. Does the stroller step down onto the road?**
- **A. (Recommended) Yes, a simple drop.** While the front wheel is between
  the two curbs, the whole stroller is drawn 12 pixels lower (road level). It
  pops back up after the up-curb. This is one small rule plus one drawing
  offset. It makes the crossing read clearly, and the stroller no longer
  floats over the road.
- **B. No.** The stroller stays at pavement height and seems to roll through
  the air over the road. This is the least work, but it looks wrong, which is
  the kind of thing you rejected the last build for.
- **C. Each wheel steps down separately, tilting the stroller.** It looks the
  nicest, but needs back-wheel tracking and tilt maths. Better suited to
  "juice" in W10. Not recommended now.

**Q5. How much does a fumbled crossing cost?**
Each curb is a big jolt. Getting both wrong costs the two jolts added together.
- **A. (Recommended) 20 per curb, so at most 40 per crossing.** One "big jolt"
  value, as DESIGN.md says. It's strict, but going slow and lifting twice is
  calm and clear. We can lower it at the week 3 fun check.
- **B. 15 per curb (at most 30).** Gentler. Also changes the big jolt value
  for anything else that uses it later.
- **C. 20 for the first wrong curb, 10 for the second.** Kinder, but a new
  rule to explain and test. Not recommended.

## Goal

As I push the stroller, potholes and street crossings come along the pavement
in a surprise order: I keep the front wheels up all the way over potholes, and
at a crossing I slow down and lift once going down the curb and again going up
the curb, and each one I get wrong jolts the baby and costs sleep.

## What the owner sees

Everything from the speed, Lift and sleep meter task stays (meter, speed label,
lift tilt, pink hit flash, refill, test buttons). Changes:

- **The grey test bump is gone.** The revision-1 curb block is gone too.
- **Pothole:** a small, very dark brown slot (30 wide, 10 tall) cut into the
  light pavement. Its top edge is the line the wheels roll on.
- **Crossing (180 wide):** the pavement stops and starts again 180 pixels
  later. In between, from top to bottom:
  - a mid-grey stone band (the curb sides), from the pavement top down to 12
    pixels below the wheel line;
  - then dark blue-grey road down to the bottom of the screen;
  - five white zebra stripes standing on the road.

  You can't mistake it for a pothole.
- **[Q4-A] On the road** the stroller sits 12 pixels lower. It is back up on
  the pavement after the up-curb.
- Obstacles slide in from the right with the street. One reaches the front
  wheel about every 7.5 s at normal speed. About 1 in 3 is a crossing, at
  random, and reloading gives a different order.
- **Pothole hit:** pink flash, sleep −10.
- **Curb hit (down or up):** pink flash, sleep −20. Each curb counts
  separately, so a crossing can cost 0, 20 or 40.
- **Done right:** nothing happens.

## Controls and states

### Controls
No new controls. Same as before:

| Action | Keyboard | Touch / mouse (test buttons) |
| --- | --- | --- |
| Speed up one step | Up arrow | Tap `Faster` |
| Slow down one step | Down arrow | Tap `Slower` |
| Lift | Hold Space | Hold `Lift (hold)` |

S (Shush) still does nothing (W3). Lift still lasts at most 0.8 s per press.
For the second curb you let go and press again.

### States
- Speed, lift, sleep and hit flash: unchanged from the previous spec.
- **Street seed:** a whole number picked at random when the scene starts
  (`Math.floor(Math.random() * 2 ** 32)`). Only the scene uses `Math.random`.
  The pure logic gets the seed as an input.
- **Obstacle type:** each obstacle is `pothole` or `crossing`, worked out from
  its index and the seed. It never changes.
- **Last jolted pothole:** index of the last pothole that already cost sleep.
  It starts at -1, so a pothole only ever costs sleep once.
- **[Q4-A] On the road:** yes if the front wheel is between the two curbs of a
  crossing, otherwise no. This is only used for drawing.

## Start, end and fail conditions

- Start: as before. Page load starts the walk: speed `normal`, lift `down`,
  sleep 100, a new random seed. The first obstacle reaches the front wheel
  about 7.4 s after load at normal speed. It may be either kind.
- End: none yet. The street goes on until the page is closed.
- Fail: none yet. At 0 sleep the walk carries on and the meter can refill.
  Waking up, run end and restart are W3.

## How obstacles appear

- Obstacle number k (k = 0, 1, 2, ...) starts at street position
  `L = OBSTACLE_FIRST_X + k * OBSTACLE_SPACING`. Its screen x is that minus the
  total scroll so far.
- Its type is `obstacleTypeFor(obstacleRandom(seed, k), CROSSING_CHANCE)`.
- **Pothole:** a box with its left edge at L, `POTHOLE_WIDTH` wide. The top is
  at `STROLLER_GROUND_Y` and it goes down `POTHOLE_DEPTH`, in `COLOR_POTHOLE`.
- **Crossing:** spans from L to `L + CROSSING_WIDTH`. The down-curb is at L
  and the up-curb at `L + CROSSING_WIDTH`. Drawn after the pavement and its
  seams, so it covers them:
  - Curb-side band: x L to `L + CROSSING_WIDTH`, y `PAVEMENT_TOP_Y` to
    `ROAD_TOP_Y`, in `COLOR_CURB_FACE`.
    `ROAD_TOP_Y = STROLLER_GROUND_Y + CROSSING_STEP_HEIGHT` = 462. It is
    worked out in the scene, not a new number.
  - Road: same x, y `ROAD_TOP_Y` to `GAME_HEIGHT`, in `COLOR_ROAD`.
  - Stripes: in `COLOR_CROSSING_STRIPE`, y `ROAD_TOP_Y` to `GAME_HEIGHT`,
    each `CROSSING_STRIPE_WIDTH` wide. Their left edges are at
    `L + CROSSING_STRIPE_FIRST_OFFSET + i * CROSSING_STRIPE_SPACING` for
    i = 0, 1, 2, ..., as long as the stripe ends at or before
    `L + CROSSING_WIDTH`. With the starting values that is 5 stripes, at
    offsets 12, 48, 84, 120 and 156.
- Everything is drawn on the street layer, behind the stroller.
- Timing (obstacle k starts reaching the front wheel at scroll `889 + 900 * k`):
  first at about 7.4 s at normal speed, then every 7.5 s at normal, 12.9 s at
  slow and 5 s at brisk.

### Enough warning, and a calm crossing
- `OBSTACLE_FIRST_X` (1200) is past the right edge of the screen (960), so
  everything slides in from off-screen.
- A crossing's down-curb is seen 649 pixels (960 − 311) before it reaches the
  wheel. That is 3.6 s at brisk, 5.4 s at normal and 9.3 s at slow, so there
  is plenty of time to press Down twice.
- **Between the two curbs** (180 pixels):

  | Speed | Time between the curbs |
  | --- | --- |
  | slow | 2.6 s |
  | normal | 1.5 s |
  | brisk | 1.0 s |

  At slow, a 0.8 s lift over the down-curb ends at least 1.8 s before the
  up-curb. That leaves a calm moment to let go and get ready to press again.
- After a crossing, the next obstacle starts 720 pixels later (900 − 180):
  10 s away at slow and 4 s at brisk.

## What counts as right and wrong

Only the front wheel matters. Its centre x is 311, as before, and its "street
position" is `scroll + 311`. Each frame the scene:
1. updates the lift;
2. moves the scroll;
3. does the checks below using this frame's lift state.

### Pothole (whole crossing of the hole)
Unchanged from revision 1:
- In any frame in which the wheel is over the hole (`L < position <= L +
  POTHOLE_WIDTH`), or passes across it, and the lift is not `lifted`, it is a
  small jolt: sleep −`SLEEP_JOLT_SMALL` (10).
- At most once per pothole.
- Speed does not matter.

Timing window (how early you may press and still clear the hole): about 0.37 s
at slow, 0.55 s at normal and 0.63 s at brisk.

### Crossing (two curb checks)
- **Down-curb:** checked once, in the frame where the wheel's position reaches
  L.
- **Up-curb:** checked once, in the frame where it reaches
  `L + CROSSING_WIDTH`.
- At each check:
  - Right: lift is `lifted` **and** the street speed is at or below
    `CURB_MAX_SAFE_SPEED` (70, so only `slow`). Nothing happens.
  - Anything else: big jolt, sleep −`SLEEP_JOLT_BIG` (20).
- The two checks are separate. Getting one right and one wrong costs 20.
- Between the curbs, on the road, nothing is checked. You may speed up there,
  but you must be slow again at the up-curb.

### On any jolt
The pink flash starts (same `HIT_FLASH_MS`) and the 3 s refill wait restarts.

### [Q4-A] Stepping down
While the front wheel's position is inside a crossing
(`L < position <= L + CROSSING_WIDTH`), the whole stroller (body, handle,
wheels, tilt pivot) is drawn `CROSSING_STEP_HEIGHT` (12) pixels lower. This is
drawing only. It does not affect any check.

## Tuning values (src/config.js)

Named exports in `src/config.js`.

### Removed
- Test bump: `TEST_BUMP_FIRST_X`, `TEST_BUMP_SPACING`, `TEST_BUMP_WIDTH`,
  `TEST_BUMP_HEIGHT`, `COLOR_TEST_BUMP`.
- Revision-1 curb block: `CURB_CHANCE`, `CURB_WIDTH`, `CURB_HEIGHT`,
  `COLOR_CURB`.

### Sleep
| Name | Value | Meaning |
| --- | --- | --- |
| `SLEEP_JOLT_SMALL` | 10 | Sleep lost on a small jolt (pothole) |
| `SLEEP_JOLT_BIG` | 20 | Sleep lost on a big jolt (each curb of a crossing) [Q5-A] |

### Obstacles
| Name | Value | Meaning |
| --- | --- | --- |
| `OBSTACLE_FIRST_X` | 1200 | Street position where the first obstacle starts (past the screen's right edge) |
| `OBSTACLE_SPACING` | 900 | Street distance from one obstacle's start to the next |
| `CROSSING_CHANCE` | 0.35 | Chance (0 to 1) that an obstacle is a crossing; otherwise a pothole |
| `POTHOLE_WIDTH` | 30 | Pothole width; also how far the wheel must stay lifted |
| `POTHOLE_DEPTH` | 10 | Pothole height, down from `STROLLER_GROUND_Y` (drawing only) |
| `COLOR_POTHOLE` | 0x4a3b33 | Pothole colour (very dark brown; was 0x6b625a) |
| `CROSSING_WIDTH` | 180 | Distance from the down-curb to the up-curb |
| `CROSSING_STEP_HEIGHT` | 12 | How far the road is below the wheel line (drawing; [Q4-A] stroller drop) |
| `CROSSING_STRIPE_WIDTH` | 20 | Width of one zebra stripe |
| `CROSSING_STRIPE_SPACING` | 36 | Left edge to left edge of neighbouring stripes |
| `CROSSING_STRIPE_FIRST_OFFSET` | 12 | Gap from the down-curb to the first stripe |
| `COLOR_ROAD` | 0x5c6370 | Road (dark blue-grey) |
| `COLOR_CROSSING_STRIPE` | 0xffffff | Zebra stripes (white) |
| `COLOR_CURB_FACE` | 0x9a948a | Curb-side band above the road (mid stone grey) |
| `CURB_MAX_SAFE_SPEED` | 70 | Fastest street speed (pixels per second) that counts as "slowed down" at a curb |

`LIFT_MAX_HOLD_MS` stays 800. Pavement colour stays 0xdcd6cc.

## Logic (src/logic/)

`src/logic/obstacles.js` is the only rules file for obstacles (bumps.js is
gone). There is no Phaser code, and all the functions are pure. Tuning values
and the seed are passed in as inputs, and there is no `Math.random`.

1. `obstacleScreenX(index, scroll, firstX, spacing)` → number
   Returns `firstX + index * spacing - scroll`.
2. `obstacleRandom(seed, index)` → number from 0 (included) to 1 (not included)
   - The same inputs always give the same number.
   - Suggested: one mixing step of "mulberry32" on
     `(seed + (index + 1) * 0x6D2B79F5) >>> 0`, divided by 2^32. No libraries.
3. `obstacleTypeFor(randomValue, crossingChance)` → `'crossing'` if
   `randomValue < crossingChance`, otherwise `'pothole'`.
4. `visibleObstacleIndexes(scroll, firstX, spacing, width, viewWidth)` → array
   Every k >= 0 with `x + width > 0` and `x < viewWidth`, in increasing order.
   The scene passes the wider of `POTHOLE_WIDTH` and `CROSSING_WIDTH`.
   Returns `[]` if `spacing <= 0`.
5. `obstacleIndexesReachingWheel(prevScroll, scroll, firstX, spacing, wheelX)`
   → array. Every k >= 0 with
   `prevScroll + wheelX < firstX + k * spacing <= scroll + wheelX`.
   Returns `[]` if `scroll <= prevScroll` or `spacing <= 0`.
   The scene calls it twice:
   - with `firstX = OBSTACLE_FIRST_X` for down-curbs;
   - with `firstX = OBSTACLE_FIRST_X + CROSSING_WIDTH` for up-curbs.

   Each time it keeps only the indexes whose type is `crossing`.
6. `obstacleIndexesOverWheel(prevScroll, scroll, firstX, spacing, wheelX, width)`
   → array. Every k whose span `(L, L + width]` overlaps
   `(prevScroll + wheelX, scroll + wheelX]`. Returns `[]` if
   `scroll <= prevScroll` or `spacing <= 0`. Used for potholes.
7. `checkPothole(index, isLifted, lastJoltedIndex, damage)` →
   `{ damage, lastJoltedIndex }`
   - Not lifted and `index > lastJoltedIndex`: `{ damage, lastJoltedIndex: index }`.
   - Otherwise: `{ damage: 0, lastJoltedIndex }`.
8. `curbDamage(isLifted, speed, rules)` → number
   `rules` is `{ damage, maxSafeSpeed }`. Returns 0 if `isLifted` and
   `speed <= maxSafeSpeed`, otherwise `damage`. Used for both curbs.
9. [Q4-A] `obstacleIndexAt(position, firstX, spacing, width)` → index or -1
   - The k >= 0 with `L < position <= L + width`, where
     `L = firstX + k * spacing`.
   - -1 if there is none, or if `spacing <= 0`.
   - The scene calls it with the front wheel's street position and
     `CROSSING_WIDTH`. If the result is a `crossing`, it draws the stroller
     `CROSSING_STEP_HEIGHT` lower.

`src/logic/sleep.js`, `speed.js`, `lift.js` and `scroll.js` are unchanged.

## Acceptance criteria

### Automated (tester, `npm test`)

1. `npm test` passes (exit code 0). The config tests no longer expect any
   removed name.
2. `obstacleScreenX(0, 0, 1200, 900)` is 1200; `obstacleScreenX(2, 1000, 1200, 900)`
   is 2000.
3. `obstacleRandom`: for seeds 1, 42 and 123456789 and index 0–999, every
   result is `>= 0` and `< 1`. The same seed and index twice give the same
   result.
4. `obstacleRandom` gives a mix:
   - For seed 42, `obstacleTypeFor(obstacleRandom(42, k), 0.35)` over
     k = 0–999 gives between 250 and 450 crossings.
   - Seeds 1 and 2 give different type lists for k = 0–19.
   - Each seed has both types somewhere in k = 0–19.
5. `obstacleTypeFor`: (0.1, 0.35) → `'crossing'`; (0.35, 0.35) → `'pothole'`;
   (0.9, 0.35) → `'pothole'`; (0, 0) → `'pothole'`; (0.999, 1) → `'crossing'`.
6. `visibleObstacleIndexes(scroll, 1200, 900, 180, 960)`: scroll 0 → `[]`;
   300 → `[0]`; 1379 → `[0, 1]`; 1380 → `[1]`; 2300 → `[2]`. With spacing 0 →
   `[]`.
7. `obstacleIndexesReachingWheel`, spacing 900, wheelX 311:
   - With firstX 1200 (down-curbs): (0, 100) → `[]`; (880, 889) → `[0]`;
     (889, 900) → `[]`; (1780, 1790) → `[1]`; (0, 3000) → `[0, 1, 2]`;
     (500, 500) → `[]`; (500, 400) → `[]`.
   - With firstX 1380 (up-curbs): (1060, 1069) → `[0]`; (1069, 1080) → `[]`.
   - Stepping the scroll 0 → 9000 in steps of 3 with firstX 1200 collects
     exactly `[0, 1, ..., 9]`, each once.
8. `obstacleIndexesOverWheel` (firstX 1200, spacing 900, wheelX 311, width 30):
   - (880, 889) → `[]`; (889, 890) → `[0]`; (900, 910) → `[0]`
   - (918, 925) → `[0]`; (919, 925) → `[]`; (880, 1000) → `[0]`
   - (0, 3000) → `[0, 1, 2]`; (500, 500) → `[]`; (910, 900) → `[]`
9. `checkPothole`:
   - (0, true, -1, 10) → `{ damage: 0, lastJoltedIndex: -1 }`
   - (0, false, -1, 10) → `{ damage: 10, lastJoltedIndex: 0 }`
   - (0, false, 0, 10) → `{ damage: 0, lastJoltedIndex: 0 }`
   - (1, false, 0, 10) → `{ damage: 10, lastJoltedIndex: 1 }`
10. `curbDamage` with `{ damage: 20, maxSafeSpeed: 70 }`: (true, 70) → 0;
    (true, 120) → 20; (true, 180) → 20; (false, 70) → 20; (false, 180) → 20.
11. Pothole simulation (unchanged from revision 1). Index 0, firstX 1200,
    spacing 900, wheelX 311, width 30, lift max 800, 16 ms frames. Each frame:
    `updateLift`, then `advanceScroll`, then `obstacleIndexesOverWheel` +
    `checkPothole`. Space is pressed at the given time relative to the hole
    reaching the wheel and held unless stated. Total damage:
    - slow: 300 ms before → 0; 450 ms before → 10; 50 ms after → 10.
    - normal: 400 ms before → 0; 600 ms before → 10.
    - brisk: 500 ms before → 0; 700 ms before → 10.
    - slow, 300 ms before but let go 100 ms after arrival → 10.
    - Never pressed → 10, never more.
12. Crossing simulation. Obstacle 0 is a crossing; firstX 1200, spacing 900,
    wheelX 311, crossing width 180, lift max 800, 16 ms frames. Each frame:
    `updateLift`, then `advanceScroll`, then both `obstacleIndexesReachingWheel`
    calls + `curbDamage` with `{ damage: 20, maxSafeSpeed: 70 }`. "Lift" means
    press Space 300 ms before that curb reaches the wheel and let go 500 ms
    after it. Total damage:
    - slow the whole time, lift at both curbs → 0.
    - slow, lift only at the down-curb → 20.
    - slow, lift only at the up-curb → 20.
    - slow, no lifts → 40.
    - normal the whole time, lift at both → 40.
    - slow at the down-curb, normal at the up-curb, lift at both → 20.
    - slow, Space pressed 300 ms before the down-curb and held without letting
      go until after the up-curb → 20 (the lift tires out on the road).
13. [Q4-A] `obstacleIndexAt(position, 1200, 900, 180)`: 1200 → -1; 1201 → 0;
    1380 → 0; 1381 → -1; 1500 → -1; 2101 → 1; 100 → -1. With spacing 0 → -1.
14. Big jolt on the meter: `applySleepDamage(100, 20, 100)` is 80;
    `applySleepDamage(100, 40, 100)` is 60; `applySleepDamage(15, 20, 100)` is 0.
15. Config sanity, using the values in `src/config.js` (frontWheelX = 311,
    worked out from config):
    - `1000 * POTHOLE_WIDTH / speed < LIFT_MAX_HOLD_MS` for each of the three
      speeds (a pothole can be cleared at every speed).
    - `OBSTACLE_FIRST_X >= GAME_WIDTH` (nothing pops up on screen).
    - `(GAME_WIDTH - frontWheelX) / SPEED_BRISK >= 2` seconds (at least 2 s
      of warning for a down-curb, even at brisk).
    - `1000 * CROSSING_WIDTH / SPEED_SLOW >= 2 * LIFT_MAX_HOLD_MS` (a calm gap
      between the two lifts at slow).
    - `OBSTACLE_SPACING > CROSSING_WIDTH` (a crossing never runs into the
      next obstacle).
    - The stripe rule gives exactly 5 stripes, at offsets 12, 48, 84, 120 and
      156.
16. No file in `src/` mentions `bumps.js`, `TEST_BUMP`, `CURB_CHANCE`,
    `CURB_WIDTH`, `CURB_HEIGHT` or `COLOR_CURB` (whole names). No file in
    `src/logic/` contains `Math.random`.
17. No file in `src/logic/` contains the word "phaser" (any capitalisation).
18. `src/config.js` exports every name in the Sleep and Obstacles tables with
    the exact values listed, `LIFT_MAX_HOLD_MS` is 800, and none of the
    removed names is exported.

### Manual (owner, on https://pinzzas.github.io/stroller/)

The order is random: "next pothole" or "next crossing" means let any other
obstacles pass first. Before each step, wait until the meter shows
`Sleep 100`. Leave the speed at normal unless a step says otherwise.

On a computer browser:

19. No grey bump and no grey block on top of the pavement appear, ever.
20. Within a minute you see both kinds, and they are easy to tell apart at a
    glance:
    - pothole: a small dark-brown slot in the light pavement;
    - crossing: the pavement stops, with a grey band, dark road and five
      white stripes, then the pavement starts again.

    Reloading twice usually gives a different order.
21. [Q4-A] Go slow and watch a crossing: the stroller sinks a little as its
    front wheel goes onto the road, and comes back up after the far curb.
22. Next pothole: do nothing. Flash, drop by 10.
23. Next pothole: hold Space just before it reaches the front wheel and keep
    holding. No flash, no drop.
24. Next pothole, at slow: tap Space very briefly just as it arrives. Flash,
    drop by 10.
25. Next crossing: go slow. Hold Space just before the first curb, let go on
    the road, then hold Space again just before the far curb. No flash, no
    drop at either curb.
26. Next crossing: go slow and lift only at the first curb. No flash at the
    first curb, then a flash and a drop of 20 at the far curb.
27. Next crossing: stay at normal speed and lift at both curbs. Two flashes, a
    drop of 20 each (`Sleep 80`, then `Sleep 60`).
28. Next crossing: go slow, then press Up once while on the road and lift at
    the far curb. Flash and drop of 20 at the far curb only.
29. At brisk, when a crossing appears at the right edge, press Down twice and
    lift at both curbs. There is time to do it calmly.
30. At brisk, let several obstacles pass. A pothole costs 10 once, each curb
    20 once, never double. At `Sleep 0` nothing breaks and the walk continues.

On iPhone Safari (landscape), with the test buttons:

31. Hold `Lift (hold)` over a pothole: no drop. Tap `Slower` until
    `Speed: slow`, then hold `Lift (hold)` at the first curb, release on the
    road, hold again at the far curb: no drop.

## Assumptions (owner, please correct if wrong)

- Q4 = A and Q5 = A (the recommended options).
- The road is a lower level only in looks. The game still checks just two
  moments (down-curb, up-curb). There is no physics.
- The crossing is 180 pixels wide. That gives 2.6 s between the curbs at slow,
  so there is a calm moment between the two lifts.
- About 1 in 3 obstacles is a crossing (`CROSSING_CHANCE` 0.35). The first
  obstacle can be either kind, and there is no limit on several in a row.
- Only the front wheel is checked, and only the front wheel decides when the
  stroller steps down and back up.
- Between the curbs nothing is checked. Speeding up on the road is allowed if
  you are slow again at the far curb.
- Each page load gets a new random order. There is no fixed "test street"
  setting.
- Both kinds of jolt use the same pink flash. A stronger effect (wobble) comes
  in W10.
- DESIGN.md's obstacle table says "Curb". If you approve this spec, I will
  change that row to "Curb (a street crossing: curb down, then curb up)", with
  "Slow down, then lift at each curb" as the right answer and "Big jolt at
  each curb" as the result of getting it wrong.

## Out of scope / maybe later

- Cars or traffic on the road, waiting to cross, crossing lights: not in
  DESIGN.md. If wanted, add to "Maybe later" first.
- Each wheel stepping down separately with a tilt (Q4-C). Could be "juice" in
  W10.
- Difficulty ramp, obstacles coming more often in deeper sleep, introducing
  obstacles one at a time (W5)
- Pigeons, dog, neighbour, siren (W4–W5)
- Shush, run end at 0 sleep, wake-up, restart (W3)
- Big wheels and Suspension upgrades (W7)
- Real art for potholes and crossings (W8); wobble and jolt sounds (W10)
- A fixed or shareable street seed
