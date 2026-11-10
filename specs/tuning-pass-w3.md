# Spec: Tuning pass after the week 3 fun check (W3)

Status: **draft, awaiting owner approval.** Q1–Q2 below need an answer. The
spec is written for the recommended option, **B (medium)**.
Plan item: PLAN.md W3, "Gate: play 10 runs. Is dodging fun with grey boxes? If
not, fix it before moving on."
Builds on: all accepted W2–W3 specs. Nothing new is built.

## Why the gate failed (in plain numbers)

Your notes: "Not fun, no real challenge. Baby never woke up. Too easy because
I almost never got hit, and when I did it didn't matter."

- **Healing beat any damage.** At normal speed sleep refills 60 a minute; at
  slow, 180 a minute. Shush adds up to about 50 a minute more. A pothole (10)
  was healed in 13 s at normal, 6 s at slow, before the next obstacle came.
- **Hits were rare.** One obstacle every 7.5 s, and the lift is up for 0.8 s,
  so the timing was very forgiving.
- **Even never slowing down for crossings** (40 lost every ~21 s) was mostly
  healed. The baby lasted about 4–5 minutes that way.

## The fix: change numbers only

No new features, mechanics or difficulty ramp. Only values in src/config.js
change. Nothing is hard-coded elsewhere (checked: the game code reads every
one of these from src/config.js).

## Q1. How hard? (owner picks one)

| | A. Gentle | **B. Medium (recommended)** | C. Harsh |
| --- | --- | --- | --- |
| Do nothing at all | wakes in ~40 s (at most ~1.5 min) | wakes in ~30 s (at most ~70 s) | wakes in ~20 s |
| Careless run | ~3 min | ~1:15–1:30 | ~45 s |
| Baby slowly wakes once you get wrong about… | 1 lift in 4 | 1 lift in 6 | 1 lift in 10 |
| Risk | May still feel like hits "don't matter" | Careful players may still go long (see Q2) | Feels stressful; potholes at slow need very sharp timing |

"Careless run" here means: you lift for everything but forget to slow down for
about half the crossings, and miss about 1 lift in 4.

**Recommendation: B.** It is the smallest change that makes every hit
noticeable and wakes a sloppy player in about a minute and a half. It keeps
the timing fair (no window under a quarter of a second). It also leaves room
for early upgrades to matter: Suspension, Big wheels, Pacifier pouch and
White-noise speaker each fix something you will now feel.

## Q2. What if careful runs still go past 5 minutes?

There is no difficulty ramp yet. A near-perfect player can keep the baby asleep
a long time. DESIGN.md's planned answer is the W5 sleep stages ("obstacles come
more often" as sleep deepens), which will give every run its natural ending.
- **A. (Recommended) Accept it for now.** Judge the gate on whether hits
  matter and whether dodging is fun. W5 adds the ending.
- **B. Tune again.** If most careful runs go past 5 minutes, I write a second
  numbers-only pass (for example option C's healing values).

## The numbers (old → new)

| Name | Now | A. Gentle | **B. Medium** | C. Harsh | Why (for B) |
| --- | --- | --- | --- | --- | --- |
| `OBSTACLE_SPACING` | 900 | 800 | **700** | 600 | More to handle: one every 5.8 s at normal instead of 7.5 s |
| `CROSSING_CHANCE` | 0.35 | 0.35 | **0.4** | 0.5 | Crossings are the obstacle that needs both speed and lift, so more of them |
| `LIFT_MAX_HOLD_MS` | 800 | 800 | **700** | 600 | Lift a bit later and more precisely; a mistimed lift now really misses |
| `SLEEP_RECOVERY_NORMAL` | 1 | 0.5 | **0.25** | 0.2 | A pothole now takes about 45 s to heal at normal (was 13 s), so hits stick |
| `SLEEP_RECOVERY_BRISK` | 1 | 0.5 | **0.25** | 0.2 | Same as normal, as before |
| `SLEEP_RECOVERY_SLOW` | 3 | 1.5 | **0.75** | 0.6 | Still 3 times faster than normal ("slow is safer"), but no longer a free full heal |
| `SLEEP_RECOVERY_DELAY_MS` | 3000 | 4000 | **5000** | 6000 | Healing waits 5 s after a hit, so back-to-back hits add up |
| `SHUSH_RESTORE` | 15 | 15 | **10** | 10 | One Shush undoes one pothole or half a curb: a rescue, not a reset |
| `SHUSH_COOLDOWN_MS` | 30000 | 45000 | **45000** | 60000 | Both shushes come back after 45 s, so you choose when to use them |
| `SLEEP_JOLT_BIG` | 20 | 20 | **20** | 25 | No change in B |

Unchanged in every option: `SLEEP_JOLT_SMALL` 10, `SHUSH_MAX_CHARGES` 2,
`CURB_MAX_SAFE_SPEED` 70, speeds 70 / 120 / 180, `OBSTACLE_FIRST_X` 1200,
`CROSSING_WIDTH` 180. Pothole 10 and curb 20 stay within DESIGN.md ("a small
jolt about 10"), so DESIGN.md needs no change.

### What B feels like

- Obstacles: every 5.8 s at normal, 10 s at slow, 3.9 s at brisk. After a
  crossing, the next obstacle is still at least 2.9 s away, even at brisk.
- Pothole timing (how early you may press Space and still clear it): 0.27 s at
  slow, 0.45 s at normal, 0.53 s at brisk. It was 0.37, 0.55 and 0.63 s.
- Lift at slow over a crossing: 2.6 s between the curbs, as before. That is
  plenty of time to let go and press again.
- Healing: at most 15 a minute at normal and 45 a minute at slow, plus Shush at
  most about 25 a minute. Before, it was 60 or 180, plus about 50.

### Back-of-envelope check (B)

An average obstacle done wrong costs 22: 60% potholes (10) and 40% crossings
(40 if both curbs are wrong). At normal there are about 10 obstacles a minute.

| Player | Sleep lost / min | Sleep healed / min | Result |
| --- | --- | --- | --- |
| Does nothing at all | ~225 | ~0 (5 s wait is never reached) | Wakes at about the 5th obstacle, ~30 s |
| Careless (see Q1) | ~110 | ~30 | Loses ~80 a minute: wakes after ~1:15–1:30 |
| Careful (slows for every crossing, ~1 lift in 8 wrong) | ~25 | up to ~35 | Mostly holds; a bad patch ends it. Clearly longer, often 3+ min |

Break-even: healing is at most ~35 a minute and a mistake costs ~15 on
average, so the baby slowly wakes once you make more than about 2 mistakes a
minute (about 1 lift in 6).

## Goal

When I walk the baby, every pothole and curb I get wrong really costs sleep,
so a sloppy walk wakes the baby in about a minute and a careful walk lasts
clearly longer.

## Controls and states

No change. Speed (Up/Down), Lift (hold Space), Shush (S), Walk again (Enter or
the button), and the test buttons all work exactly as in the accepted specs.

## Start, end and fail conditions

No change. A walk starts at sleep 100, normal speed and 2 shushes. It ends
when sleep reaches 0.

## Tuning values (src/config.js)

Change only these values, to the column of the option the owner picks (B
shown). Also update each line's comment if it mentions an old number.

| Name | Value (B) |
| --- | --- |
| `OBSTACLE_SPACING` | 700 |
| `CROSSING_CHANCE` | 0.4 |
| `LIFT_MAX_HOLD_MS` | 700 |
| `SLEEP_RECOVERY_SLOW` | 0.75 |
| `SLEEP_RECOVERY_NORMAL` | 0.25 |
| `SLEEP_RECOVERY_BRISK` | 0.25 |
| `SLEEP_RECOVERY_DELAY_MS` | 5000 |
| `SHUSH_RESTORE` | 10 |
| `SHUSH_COOLDOWN_MS` | 45000 |

No names are added or removed.

## Logic (src/logic/)

No change. No new functions. All existing logic functions take these values
as inputs already.

## Acceptance criteria

### Automated (tester, `npm test`)

1. `npm test` passes (exit code 0).
2. `src/config.js` exports every name in the Tuning values table with exactly
   the value listed. Every other export keeps its current value.
3. Only these old tests change, and only as follows:
   - tests/config-speed-lift-sleep.test.js: `LIFT_MAX_HOLD_MS`,
     `SLEEP_RECOVERY_SLOW`, `SLEEP_RECOVERY_NORMAL`, `SLEEP_RECOVERY_BRISK`
     and `SLEEP_RECOVERY_DELAY_MS` expect the new values.
   - tests/obstacles.test.js, P2 AC18: `OBSTACLE_SPACING`, `CROSSING_CHANCE`
     and `LIFT_MAX_HOLD_MS` expect the new values.
   - tests/shush.test.js, S AC13: `SHUSH_RESTORE` and `SHUSH_COOLDOWN_MS`
     expect the new values.
   - tests/obstacles.test.js, the pothole and crossing simulations (P2 AC11,
     AC12): use the number 800 instead of `config.LIFT_MAX_HOLD_MS`. Those
     tests check the rules with the old reference numbers, as their spec says
     ("lift max 800"). Their expected results stay the same.

   The P2 AC15 config sanity test stays as it is and must still pass.
4. New pothole simulation with the new lift (same method as P2 AC11, but lift
   max 700). Total damage:
   - slow: press 200 ms before → 0; 350 ms before → 10;
   - normal: 350 ms before → 0; 550 ms before → 10;
   - brisk: 450 ms before → 0; 650 ms before → 10.
5. New config checks, using src/config.js:
   - `SLEEP_RECOVERY_SLOW > SLEEP_RECOVERY_NORMAL` (DESIGN.md: refills faster
     at slow).
   - `(OBSTACLE_SPACING - CROSSING_WIDTH) / SPEED_BRISK >= 2` (at least 2 s
     after a crossing before the next obstacle, even at brisk).
   - `LIFT_MAX_HOLD_MS - 1000 * POTHOLE_WIDTH / SPEED_SLOW >= 150` (a pothole
     at slow always leaves at least 0.15 s to press).
6. Only src/config.js changes in `src/` (the reviewer checks this in the diff).

### Manual (owner, on https://pinzzas.github.io/stroller/)

On a computer browser. Check that the build label at the bottom right shows
the new build first.

7. **Do nothing.** Load the page and press nothing (no arrows, no Space, no
   S). The baby wakes within about 70 s, usually around 30 s. The end box shows
   an `Asleep for` time under `1:10`.
8. **More to handle.** At normal speed, obstacles arrive about every 6 seconds
   (count a few), and about 2 in 5 are crossings.
9. **Hits stick.** Let one pothole hit (`Sleep 90`) and then lift cleanly for
   a while. For about 5 seconds the meter does not move. Then it creeps up
   very slowly, about 1 point every 4 seconds. Press Down to slow: about 3
   points every 4 seconds.
10. **Lift.** Hold Space: the stroller drops back down by itself a little
    sooner than before (0.7 s). Lifting just before a pothole still clears it
    at every speed.
11. **Shush.** After a hit, press S: the meter goes up by 10 (not 15). Use
    both: the label shows `Shush: back in 45s` and counts down to
    `Shush: 2 left`.
12. **Never slow down.** Stay at normal and lift for everything, but never
    slow for crossings. The baby wakes in about a minute.
13. **Careful run.** Slow down for every crossing and lift every time. The
    walk clearly lasts longer than step 12, usually 3 minutes or more.
14. **Gate: 10 runs.** Play 10 walks the way you naturally would. After each,
    write down the `Asleep for` time. Then answer:
    - How many ended under 1 min, 1–3 min, 3–5 min, over 5 min?
    - Did each wake-up feel like your own fault (fair), not bad luck?
    - Was it fun? Did you want "one more walk"?

    You decide pass or fail. A good sign: most runs end between 1 and 5
    minutes, and the wake-ups feel fair.

## Assumptions (owner, please correct if wrong)

- You lean towards a numbers-only pass, so nothing new is built.
- Option B is used unless you pick another. Only the numbers in the
  Tuning values table change.
- The time estimates above are rough. Obstacles come in a random order, so
  runs will vary. The 10 replays are the real test.
- Until sleep minutes arrive in W5, nothing rewards going fast. Staying slow
  the whole walk is safe but dull, so for the gate please play at normal and
  slow down for crossings, as the game intends.
- The older accepted specs still describe the old numbers (for example "every
  7.5 s"). For these values, this spec replaces them. The old spec files are
  left as they were, as a record.
- DESIGN.md needs no change. All its numbers are "starting values to tune",
  and B keeps pothole 10 and "faster recovery at slow".
- TODO.md gets a note only after you accept the result.

## Out of scope

- Difficulty ramp, sleep stages, obstacles coming more often over time (W5)
- Sleep minutes and brisk earning more (W5)
- New obstacles (W4), upgrades (W7)
- Changing how lift, curbs or Shush work (only their numbers change)
- A fixed "test street" for repeatable runs (TODO.md note; not needed now)
- Wobble, sounds or other feedback to make hits feel bigger (W10)
