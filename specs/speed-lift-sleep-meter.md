# Spec: Speed control, Lift and the sleep meter (W2, task 1)

Status: approved by the owner (2026-11-09). Answers: Q1 = B (test buttons), Q2 = A (test bump), Q3 = yes (refill).
Plan item: PLAN.md W2, "Speed control and Lift. The sleep meter appears and
drops on hits."
Builds on: specs/project-setup.md (approved).

## Questions for the owner (answered 2026-11-09: Q1 B, Q2 A, Q3 yes)

**Q1. Touch buttons on iPhone: DESIGN.md says no.**
You play on iPhone as well as on a computer. But DESIGN.md lists "Mobile touch
controls" as out of scope for v1, with "touch controls" under "Maybe later".
Without touch, nothing in this feature can be tried on the iPhone.
- **A. Keyboard only.** You test controls on a computer browser. On iPhone we
  only check the page still loads and scrolls. Keeps DESIGN.md exactly as is.
- **B. (Recommended) Simple on-screen test buttons.** Three plain buttons
  (Slower, Faster, Lift) for playtesting on your phone. They are a testing aid
  like the build label, not a v1 feature: no polish, can be hidden before the
  Steam launch. DESIGN.md gets one line saying so, once you approve.
- **C. Real touch controls as a game feature.** Moves "touch controls" out of
  "Maybe later" into v1. Bigger promise (designing and polishing them for
  phones), and the game doesn't ship on phones. Not recommended.

This spec is written for **B**. If you pick A, the touch parts (marked
"[Q1-B]") are simply dropped.

**Q2. What does the stroller bump into?**
Potholes and curbs are the next spec, but the meter needs something to drop on.
- **A. (Recommended) One plain grey "test bump"** on the pavement, coming along
  every few seconds. Lift over it and nothing happens; roll into it and sleep
  drops by 10. This genuinely tests Lift timing and speed. The next spec
  replaces it with the real pothole and curb.
- **B. A secret "hit" key (H).** Press it and sleep drops by 10. Proves the
  meter works, but Lift then has nothing to do, so you can't judge it.
- **C. Both.** More to build and test for little gain.

This spec is written for **A**.

**Q3. Should sleep slowly refill in this task?**
DESIGN.md says the meter "refills slowly when nothing happens, faster at slow
speed". Without it, the meter only ever goes down, and since the run doesn't
end until W3, it would sit at 0. With it, "slow" already has a reason to exist.
Recommendation: **yes, include it** (written in below). If no, criteria 14–16,
27 and 28 are dropped.

## Goal

As I push the stroller, I can speed up or slow down and lift the front wheels
over a bump, and a sleep meter at the top shows how much each bump I miss
disturbs the baby.

## What the owner sees

Everything from W1 stays (sky, houses, pavement, stroller, build label). New:

- **Sleep meter:** a white "cloud" box at the top centre with a lavender bar
  inside. The bar starts full. Under the bar, inside the cloud, the text
  `Sleep 100`.
- **Speed label:** top-left text `Speed: normal`. It changes to `slow` or
  `brisk` when you change speed, and the street slides slower or faster.
- **Test bump:** a small dark-grey box lying on the pavement, sliding in from
  the right with the street, about every 9 seconds at normal speed.
- **Lift:** while you hold Lift, the stroller tilts back (front/right end up,
  pivoting on the back wheel). It drops back down when you let go, or by
  itself after 0.8 seconds.
- **Hit:** if the bump reaches the front wheel while the stroller is not
  lifted, the stroller body flashes pink for a moment and the meter drops by
  10 (`Sleep 90`). If you were lifting, nothing happens.
- **Refill:** 3 seconds after the last hit, the meter starts creeping back up:
  1 point a second at normal or brisk, 3 points a second at slow.
- **[Q1-B] Touch buttons:** three see-through white buttons along the bottom:
  `Slower` and `Faster` bottom-left, a wider `Lift (hold)` bottom-right.

## Controls and states

### Controls

| Action | Keyboard | Touch / mouse [Q1-B] |
| --- | --- | --- |
| Speed up one step | Up arrow (one step per press) | Tap `Faster` |
| Slow down one step | Down arrow (one step per press) | Tap `Slower` |
| Lift | Hold Space | Hold a finger (or mouse button) on `Lift (hold)` |

- Holding Up or Down does not keep stepping; you press again for each step.
- Speed steps stop at the ends: Up at brisk stays brisk, Down at slow stays slow.
- Lift counts as "held" if Space **or** the Lift button is held.
- [Q1-B] Two fingers at once must work: hold Lift with one thumb and tap
  Faster or Slower with the other.
- [Q1-B] Sliding the finger off the Lift button counts as letting go.
- Arrow keys and Space must not scroll the web page.
- S (Shush) still does nothing (W3).

### States

- **Speed:** one of `slow`, `normal`, `brisk`. Starts at `normal`. Changes are
  instant (no easing).
- **Lift:** `down` or `lifted`.
  - Starts `down`. Pressing Lift makes it `lifted` at once.
  - It stays `lifted` while held, for at most `LIFT_MAX_HOLD_MS` (800 ms).
    Then it drops to `down` even if still held ("arms get tired"). To lift
    again you must let go and press again.
  - Letting go always makes it `down`.
  - Leaving the tab or app counts as letting go (no stuck lift on return).
- **Sleep:** a number from 0 to 100. Starts at 100.
- **Hit flash:** on for 300 ms after a hit, otherwise off.

## Start, end and fail conditions

- Start: as in W1, the walk starts when the page loads. Speed `normal`, lift
  `down`, sleep 100.
- End: none yet. The street scrolls until the page is closed.
- Fail: none yet. If sleep reaches 0, the meter shows `Sleep 0` and the walk
  just carries on; the meter can refill. Waking up, run end and restart are W3.
- Reloading the page starts fresh (sleep 100, normal speed).

## How a hit works (test bump)

- Bumps are part of the street: they are placed along it at a fixed distance
  apart, and slide left with the street. Faster speed means bumps arrive more
  often in seconds, but the gap in distance is the same.
- Bump number k (k = 0, 1, 2, ...) has its left edge at street position
  `TEST_BUMP_FIRST_X + k * TEST_BUMP_SPACING`. Its screen x is that minus the
  total scroll so far.
- The "check moment" for a bump is the frame where its left edge reaches the
  front wheel's centre x. The front wheel is the right-hand wheel; its centre x
  comes from existing W1 values:
  `STROLLER_X + STROLLER_WIDTH - STROLLER_WHEEL_INSET - STROLLER_WHEEL_SIZE / 2`
  = 311. (Worked out in the scene from config, not a new number.)
- At the check moment: if lift is `lifted`, no damage. If `down`, sleep drops
  by `SLEEP_JOLT_SMALL` (10), the hit flash starts, and the refill timer
  restarts.
- Each bump is checked exactly once. After its check the bump keeps sliding
  left and off screen; it never hits twice.
- Only the front wheel matters in this task. The back wheel rolls over bumps
  without effect.
- With the starting values, the first bump reaches the wheel about 7.4 s after
  load at normal speed. After that: about every 9 s at normal, 15.4 s at slow,
  6 s at brisk.

## Tuning values (src/config.js)

All new numbers are named exports in `src/config.js`. W1 values stay, except
`STREET_SCROLL_SPEED`, which is replaced by `SPEED_NORMAL` (same value, 120).

### Speed
| Name | Value | Meaning |
| --- | --- | --- |
| `SPEED_SLOW` | 70 | Street speed at slow, pixels per second |
| `SPEED_NORMAL` | 120 | Street speed at normal (replaces `STREET_SCROLL_SPEED`) |
| `SPEED_BRISK` | 180 | Street speed at brisk |
| `SPEED_START_LEVEL` | `'normal'` | Speed when the walk starts |

### Lift
| Name | Value | Meaning |
| --- | --- | --- |
| `LIFT_MAX_HOLD_MS` | 800 | Longest the front wheels stay up per press |
| `LIFT_TILT_DEGREES` | 12 | How far the stroller tilts back while lifted (drawing only) |

### Sleep
| Name | Value | Meaning |
| --- | --- | --- |
| `SLEEP_MAX` | 100 | Full meter |
| `SLEEP_START` | 100 | Sleep when the walk starts |
| `SLEEP_JOLT_SMALL` | 10 | Sleep lost on a small jolt (missing the test bump) |
| `SLEEP_RECOVERY_SLOW` | 3 | Refill per second at slow speed |
| `SLEEP_RECOVERY_NORMAL` | 1 | Refill per second at normal speed |
| `SLEEP_RECOVERY_BRISK` | 1 | Refill per second at brisk speed |
| `SLEEP_RECOVERY_DELAY_MS` | 3000 | Quiet time after a hit before refilling starts |

### Test bump
| Name | Value | Meaning |
| --- | --- | --- |
| `TEST_BUMP_FIRST_X` | 1200 | Street position of the first bump's left edge |
| `TEST_BUMP_SPACING` | 1080 | Street distance from one bump to the next |
| `TEST_BUMP_WIDTH` | 40 | Bump width |
| `TEST_BUMP_HEIGHT` | 12 | Bump height (bottom sits on `STROLLER_GROUND_Y`) |
| `COLOR_TEST_BUMP` | 0x8a8178 | Bump colour |

### Hit feedback
| Name | Value | Meaning |
| --- | --- | --- |
| `HIT_FLASH_MS` | 300 | How long the stroller body flashes after a hit |
| `COLOR_HIT_FLASH` | 0xf2a7a7 | Flash colour (soft pink) |

### Meter and labels (HUD = the on-screen info)
| Name | Value | Meaning |
| --- | --- | --- |
| `METER_TOP_Y` | 16 | Top edge of the cloud box |
| `METER_BAR_WIDTH` | 240 | Bar width when full (cloud is centred on `GAME_WIDTH / 2`) |
| `METER_BAR_HEIGHT` | 18 | Bar height |
| `METER_PADDING` | 10 | Gap between cloud edge and bar/label |
| `METER_LABEL_GAP` | 6 | Gap between bar and the `Sleep N` text |
| `COLOR_METER_CLOUD` | 0xffffff | Cloud box |
| `COLOR_METER_EMPTY` | 0xe6e1ee | Empty part of the bar |
| `COLOR_METER_FILL` | 0xb7a6e0 | Full part of the bar (lavender) |
| `HUD_FONT_SIZE` | 16 | Text size of `Sleep N` and `Speed: ...` |
| `HUD_MARGIN` | 16 | Speed label gap from the top and left edges |
| `COLOR_HUD_TEXT` | 0x5a5560 | Text colour for HUD labels |

### Touch buttons [Q1-B]
| Name | Value | Meaning |
| --- | --- | --- |
| `TOUCH_BUTTON_SIZE` | 80 | Width and height of Slower/Faster; height of Lift |
| `TOUCH_LIFT_WIDTH` | 160 | Width of the Lift button |
| `TOUCH_BUTTON_MARGIN` | 16 | Gap from the left/right edge and between Slower and Faster |
| `TOUCH_BUTTON_BOTTOM_MARGIN` | 24 | Gap from the bottom edge (keeps the build label visible) |
| `TOUCH_BUTTON_ALPHA` | 0.6 | Button see-through-ness (1 = solid) |
| `COLOR_TOUCH_BUTTON` | 0xffffff | Button colour |
| `TOUCH_FONT_SIZE` | 18 | Button text size |

Layout: Slower at x 16, Faster at x 112, Lift at x 784; all with top y 436.

## Logic (src/logic/)

New files, no Phaser code, all functions pure (same input gives same output,
nothing else changes). Functions take tuning values as inputs rather than
importing config, so tests can pass any numbers.

### `src/logic/speed.js`
1. `changeSpeedLevel(level, step)` → `'slow' | 'normal' | 'brisk'`
   `step` is +1 (faster) or -1 (slower). Stops at the ends. An unknown `level`
   is treated as `'normal'`.
2. `speedForLevel(level, speeds)` → number
   `speeds` is `{ slow, normal, brisk }`. Returns the matching value.

### `src/logic/lift.js`
3. `initialLift()` → `{ isLifted: false, heldMs: 0, mustRelease: false }`
4. `updateLift(state, isHeld, deltaMs, maxHoldMs)` → new state object
   - Not held: returns `{ isLifted: false, heldMs: 0, mustRelease: false }`.
   - Held and `mustRelease` is true: returns `isLifted: false`,
     `mustRelease: true`, `heldMs` unchanged.
   - Held otherwise: `heldMs` becomes `heldMs + deltaMs`. If that is
     `>= maxHoldMs`: `isLifted: false, mustRelease: true`. Else
     `isLifted: true, mustRelease: false`.
   - Never changes the `state` object passed in.

### `src/logic/bumps.js`
5. `bumpScreenX(index, scroll, firstX, spacing)` → number
   Returns `firstX + index * spacing - scroll`.
6. `visibleBumpIndexes(scroll, firstX, spacing, bumpWidth, viewWidth)` → array
   Every index k >= 0 whose bump box is at least partly on screen
   (`x + bumpWidth > 0` and `x < viewWidth`, with x from `bumpScreenX`), in
   increasing order.
7. `bumpsReachingWheel(prevScroll, scroll, firstX, spacing, wheelX)` → number
   How many bumps (k >= 0) had their left edge reach the wheel during this
   frame, i.e. how many k satisfy
   `prevScroll + wheelX < firstX + k * spacing <= scroll + wheelX`.
   Returns 0 if `scroll <= prevScroll`.
8. `bumpDamage(isLifted, joltDamage)` → number
   0 if lifted, otherwise `joltDamage`.

### `src/logic/sleep.js`
9. `applySleepDamage(sleep, damage, max)` → number, kept within 0..max.
10. `recoverSleep(sleep, ratePerSec, deltaMs, max)` → number
    `sleep + ratePerSec * deltaMs / 1000`, kept within 0..max.
11. `recoveryRateFor(level, rates)` → number
    `rates` is `{ slow, normal, brisk }`.
12. `canRecover(msSinceLastHit, delayMs)` → true if
    `msSinceLastHit >= delayMs`. (The scene starts with no hit yet, so it
    starts `msSinceLastHit` at `delayMs`: refilling is allowed from the start,
    though at 100 there is nothing to refill.)
13. `meterFillWidth(sleep, max, fullWidth)` → number
    `fullWidth * sleep / max`, kept within 0..fullWidth.
14. `meterLabel(sleep)` → string, `'Sleep '` followed by sleep rounded **up**
    to a whole number (so it only shows 0 when truly empty).

Each frame the scene: clamps frame time; updates speed from presses; updates
lift; advances the scroll at the current speed; counts bumps reaching the wheel
and applies `bumpDamage` for each; refills sleep if `canRecover`; then draws.

## Acceptance criteria

### Automated (tester, `npm test`)

1. `npm test` passes (exit code 0), including the W1 tests (the W1 config test
   is updated: `STREET_SCROLL_SPEED` is gone, `SPEED_NORMAL` is 120).
2. `changeSpeedLevel`: (`'normal'`, +1) → `'brisk'`; (`'brisk'`, +1) →
   `'brisk'`; (`'normal'`, -1) → `'slow'`; (`'slow'`, -1) → `'slow'`;
   (`'slow'`, +1) → `'normal'`; (`'banana'`, +1) → `'brisk'`.
3. `speedForLevel` with `{ slow: 70, normal: 120, brisk: 180 }`: `'slow'` → 70,
   `'normal'` → 120, `'brisk'` → 180.
4. `updateLift(initialLift(), true, 16, 800)` → `{ isLifted: true, heldMs: 16,
   mustRelease: false }`.
5. `updateLift({ isLifted: true, heldMs: 790, mustRelease: false }, true, 16,
   800)` → `isLifted: false, mustRelease: true`.
6. Holding on after that: `updateLift({ isLifted: false, heldMs: 806,
   mustRelease: true }, true, 16, 800)` → `isLifted: false`,
   `mustRelease: true`.
7. Letting go: `updateLift(<any state>, false, 16, 800)` →
   `{ isLifted: false, heldMs: 0, mustRelease: false }`; pressing again from
   there with (true, 16, 800) → `isLifted: true`.
8. `updateLift` does not change the state object passed in.
9. `bumpScreenX(0, 0, 1200, 1080)` is 1200; `bumpScreenX(1, 1000, 1200, 1080)`
   is 1280.
10. `visibleBumpIndexes(scroll, 1200, 1080, 40, 960)`:
    scroll 0 → `[]` (bump 0 at 1200, not yet on screen);
    scroll 300 → `[0]` (bump 0 at 900);
    scroll 1230 → `[0]` (bump 0 at -30, still partly visible; bump 1 at 1050);
    scroll 1350 → `[1]` (bump 0 at -150, gone; bump 1 at 930).
11. `bumpsReachingWheel` with firstX 1200, spacing 1080, wheelX 311:
    (0, 100) → 0; (880, 889) → 1; (889, 900) → 0; (1968, 1970) → 1;
    (0, 5000) → 4; (500, 500) → 0; (500, 400) → 0.
12. `bumpDamage(true, 10)` is 0; `bumpDamage(false, 10)` is 10.
13. `applySleepDamage(100, 10, 100)` is 90; `applySleepDamage(5, 10, 100)` is 0.
14. `recoverSleep(50, 1, 1000, 100)` is 51; `recoverSleep(99.5, 3, 1000, 100)`
    is 100; `recoverSleep(0, 3, 500, 100)` is 1.5.
15. `recoveryRateFor` with `{ slow: 3, normal: 1, brisk: 1 }`: `'slow'` → 3,
    `'normal'` → 1, `'brisk'` → 1.
16. `canRecover(2999, 3000)` is false; `canRecover(3000, 3000)` is true.
17. `meterFillWidth`: (100, 100, 240) → 240; (50, 100, 240) → 120;
    (0, 100, 240) → 0; (-5, 100, 240) → 0; (150, 100, 240) → 240.
18. `meterLabel`: 100 → `'Sleep 100'`; 90 → `'Sleep 90'`; 89.2 →
    `'Sleep 90'`; 0.3 → `'Sleep 1'`; 0 → `'Sleep 0'`.
19. No file in `src/logic/` contains the word "phaser" (any capitalisation).
20. `src/config.js` exports every name in the Tuning values tables with the
    exact values listed, and no longer exports `STREET_SCROLL_SPEED`.

### Manual (owner, on https://pinzzas.github.io/stroller/)

On a computer browser:

21. The page loads as in W1. At the top centre is a white cloud box with a full
    lavender bar and the text `Sleep 100`. Top-left says `Speed: normal`.
22. Press Down once: the label says `Speed: slow` and the street visibly slows
    (a slab about every 1.1 seconds). Press Down again: nothing changes.
23. Press Up twice: the label says `Speed: brisk` and the street is clearly
    faster (a slab about every half second). Press Up again: nothing changes.
    Holding Up down does not skip steps.
24. Arrow keys and Space never scroll the page or move the picture.
25. Hold Space: the stroller tilts back at once (front end up). Keep holding:
    after under a second it drops back down by itself. Let go and press again:
    it tilts again.
26. Within about 8 seconds of loading (at normal speed) a small dark-grey bump
    slides in from the right. Do nothing as it reaches the front (right) wheel:
    the stroller flashes pink and the meter drops to `Sleep 90`.
27. Wait without hitting anything: after about 3 seconds the meter starts
    rising, about 1 point a second, until it reaches 100 and stops.
28. Hit another bump, then press Down to slow: once refilling starts it rises
    about 3 points a second.
29. Hold Space just before the next bump reaches the front wheel: it passes
    under the lifted wheel with no flash and the meter does not drop.
30. Let several bumps hit until the meter reaches `Sleep 0` (switch to brisk to
    speed this up): the bar is empty, nothing breaks, the walk continues, and
    the meter later refills. Each bump only ever costs 10, never 20.
31. [Q1-B] With the mouse: click `Faster` and `Slower` to change speed; press
    and hold on `Lift (hold)` to tilt the stroller. They behave exactly like
    the keys.
32. Hold Space, switch to another tab for a few seconds, release Space there,
    come back: the stroller is not stuck tilted.

On iPhone Safari (landscape):

33. The page loads and scrolls as in W1, with the meter and speed label
    readable.
34. [Q1-B] Tap `Faster` and `Slower`: the speed label and street speed change.
    Tapping quickly several times never zooms the page or selects text.
35. [Q1-B] Hold `Lift (hold)`: the stroller tilts; lifting over a bump avoids
    the hit, missing it drops the meter by 10.
36. [Q1-B] Hold `Lift (hold)` with one thumb and tap `Faster` with the other:
    both work at the same time.
37. [Q1-B] Long-pressing a button never pops up a copy/select menu or
    magnifier.
38. Switch to another app for 10 seconds and back: the walk carries on, no big
    jump, and the stroller is not stuck tilted.

## Assumptions (owner, please correct if wrong)

- Speed values: slow 70, normal 120 (W1's speed), brisk 180 pixels a second.
- Speed changes instantly. Easing in and out can come with "juice" in W10.
- Lift tops out at 0.8 seconds per press so you can't just hold Space forever.
  This is the "bad timing" from DESIGN.md: lift too early and the wheels are
  down again when the bump arrives.
- Lift is a yes/no state; the tilt angle is only drawing. The stroller doesn't
  actually collide with anything physical.
- Only the front wheel is checked. The back wheel matters later if playtests
  say so.
- Bumps are spaced by distance along the street, so going brisk means more
  bumps per minute. That fits DESIGN.md ("slow is safer").
- Brisk refills at the same rate as normal. DESIGN.md only says slow is faster;
  brisk's reward (more sleep minutes) comes in W5.
- The "frown on every hit" from DESIGN.md needs the baby's face, which doesn't
  exist yet. A pink flash on the stroller stands in for it.
- The test bump is temporary. It is not one of the six DESIGN.md obstacles and
  will be removed or turned into the pothole in the next spec.
- The meter "cloud" is a plain white box for now (grey-box rule); the soft
  cloud look comes with the art in W8.
- [Q1-B] Touch buttons are visible on every device (also on computers) so the
  same page works everywhere and can be tested with a mouse. They need the
  page to block double-tap zoom, text selection and the iPhone long-press
  menu on the game area.
- Tests live in `tests/`; the tester picks file names.

## Out of scope

- Real potholes and curbs, "slow down, then lift" for curbs, big jolts (next
  spec, W2 task 2)
- Shush, run end at 0 sleep, wake-up, restart button (W3)
- Sleep stages, damage reduction, obstacles getting more frequent (W5)
- Sleep minutes and brisk earning more (W5)
- Baby, faces, frown, floating z's (W8)
- Stroller wobble, speed easing, sounds (W10)
- Upgrades (Big wheels' wider lift window, Suspension, etc.) (W7)
- Pause, menus, settings, key remapping
- Polished touch controls for phones as a v1 feature (DESIGN.md "Maybe later")
