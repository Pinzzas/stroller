# Spec: Run ends at zero sleep; restart button (W3, task 2)

Status: draft, waiting for the owner's approval. Questions Q1–Q2 need an
answer. The spec is written for the recommended option of each.
Plan item: PLAN.md W3, "The run ends at zero sleep; restart button."
Builds on: specs/speed-lift-sleep-meter.md and specs/potholes-and-curbs.md
(accepted). Works with or without specs/shush-cooldown.md (draft).
Includes the TODO.md leftover from 2026-11-09 (Medium): key listeners and
touch pointers piling up when the scene restarts.
DESIGN.md rows used:
- "Each run ends when the baby wakes."
- "The run ends when the meter hits zero."
- "Time asleep becomes 'sleep minutes' ... Distance doesn't count." Sleep
  minutes themselves are W5.

## Questions for the owner

**Q1. What does the end screen show?**
- **A. (Recommended) Title, time and button.** It shows "The baby woke up!",
  "Asleep for 1:23" and a `Walk again` button. The time is how long this walk
  lasted. It is the number sleep minutes will be built on in W5, and it lets
  you compare runs at the week 3 fun check ("play 10 runs").
- **B. Title and button only.** Simplest, but you can't tell a good run from a
  bad one.
- **C. Like A, plus "Best this visit".** It is close to the local high score,
  which PLAN.md puts in W7. Not now; it goes under "maybe later" for W7.

**Q2. Which key restarts on a keyboard?**
- **A. (Recommended) Enter, plus clicking or tapping `Walk again`.** Space is
  Lift, and you are often holding it when the baby wakes. Enter avoids
  skipping the end screen by accident.
- **B. Space too.** One hand stays on the same keys, but a held Space could
  start a new walk before you've read the screen. (The 1 s wait below helps,
  but not fully.)
- **C. Any key.** Easiest to find, but the most accidental restarts. Not
  recommended.

## Goal

When the baby's sleep runs out, the walk stops and I see that the baby woke up
and how long they slept, and one button starts a fresh walk.

## What the owner sees

- **During the walk:** as before.
- **The moment sleep reaches 0:**
  - the street stops moving;
  - the stroller stays where it is, wheels down;
  - the meter shows `Sleep 0`.
- **The end screen:** a white box in the middle of the screen, showing:
  - `The baby woke up!` (large text);
  - `Asleep for 1:23` (minutes and seconds this walk lasted).
- **After 1 second** a lavender `Walk again` button appears inside the box.
- **Restart:** click or tap `Walk again`, or press Enter. A fresh walk starts:
  - sleep 100 and speed normal;
  - stroller at the start;
  - a new random street;
  - full Shush charges, if Shush is built.
- **While the end screen is up,** Up, Down, Space, S and the test buttons do
  nothing. The test buttons stay visible.

## Controls and states

### Controls
| Action | Keyboard | Touch / mouse |
| --- | --- | --- |
| Walk again (only on the end screen, after the 1 s wait) | Enter | Click or tap `Walk again` |

All other controls work only while walking.

### States
- **Run:** `{ phase, elapsedMs, msSinceEnd }`.
  - `phase` is `'walking'` or `'ended'`.
  - It starts as `{ phase: 'walking', elapsedMs: 0, msSinceEnd: 0 }`.
- **While walking:**
  - `elapsedMs` grows by each frame's (clamped) time.
  - In the frame where sleep is at or below 0 after damage, the phase becomes
    `'ended'`.
- **While ended:**
  - `elapsedMs` is frozen and `msSinceEnd` grows.
  - Nothing else updates: no scroll, lift, checks, refill, cooldown or flash
    timer.
  - The lift is shown down.
- **Restart** is allowed once `msSinceEnd >= RUN_RESTART_DELAY_MS`. It restarts
  the Phaser scene, so `create()` sets everything fresh.

## Start, end and fail conditions

- Start: page load or `Walk again` starts a walk.
- End / fail: sleep reaches 0 (only damage can do this). The run ends in that
  same frame. Refill does not get a chance to lift it back above 0.
- There is no other way to end a run. There is no pause or quit.

## Restart without pile-ups (TODO.md leftover)

Phaser keeps some things alive across a scene restart. Without care, every
restart adds another copy of a listener, so one press would count twice. So:

- When the scene shuts down, everything the scene and its helpers added gets
  removed:
  - the Up/Down/Enter key listeners (and S, if Shush is built);
  - the `pointerup` and `gameout` listeners in src/TouchButtons.js;
  - the blur/hidden listeners, which are already removed today.
- Two touch points (for holding Lift and tapping another button at once) must
  exist exactly once. They must not grow by one with each restart.
  - Preferred: ask for two touch points once in the game settings
    (src/main.js), and remove `addPointer(1)` from src/TouchButtons.js.
  - Also fine: keep `addPointer`, but only call it when fewer than two touch
    points exist.

## Tuning values (src/config.js)

| Name | Value | Meaning |
| --- | --- | --- |
| `RUN_RESTART_DELAY_MS` | 1000 | Wait after waking before `Walk again` appears and works |
| `TOUCH_POINTERS` | 2 | Touch points the game needs (one per thumb) |
| `END_PANEL_WIDTH` | 360 | End box width (centred on screen) |
| `END_PANEL_HEIGHT` | 200 | End box height (centred on screen) |
| `COLOR_END_PANEL` | 0xffffff | End box colour |
| `END_TITLE_FONT_SIZE` | 28 | Size of `The baby woke up!` |
| `END_TITLE_OFFSET_Y` | 40 | Box top to the centre of the title |
| `END_TEXT_FONT_SIZE` | 18 | Size of `Asleep for m:ss` |
| `END_TIME_OFFSET_Y` | 80 | Box top to the centre of the time line |
| `END_BUTTON_WIDTH` | 220 | `Walk again` button width (centred in the box) |
| `END_BUTTON_HEIGHT` | 56 | `Walk again` button height |
| `END_BUTTON_OFFSET_Y` | 120 | Box top to the top of the button |
| `END_BUTTON_FONT_SIZE` | 20 | `Walk again` text size |
| `COLOR_END_BUTTON` | 0xb7a6e0 | Button colour (same lavender as the meter fill) |

Layout:
- The box spans x 300–660, y 170–370.
- The button spans x 370–590, y 290–346.
- All text is in `COLOR_HUD_TEXT`.

## Logic (src/logic/)

New file `src/logic/run.js`. There is no Phaser code, and all the functions
are pure and never change their inputs.

1. `initialRun()` → `{ phase: 'walking', elapsedMs: 0, msSinceEnd: 0 }`
2. `updateRun(state, sleep, deltaMs)` → new state
   - Walking: `elapsedMs + deltaMs`. If `sleep <= 0`, the phase becomes
     `'ended'` with `msSinceEnd: 0`.
   - Ended: only `msSinceEnd + deltaMs`.
3. `canRestart(state, delayMs)` → true if `phase` is `'ended'` and
   `msSinceEnd >= delayMs`.
4. `formatRunTime(ms)` → `'m:ss'`, using whole seconds rounded **down**.
   Minutes have no leading zero; seconds always have two digits.
5. `endTimeText(ms)` → `'Asleep for '` + `formatRunTime(ms)`.
6. `pointersToAdd(current, wanted)` → `max(0, wanted - current)`. This is
   only used if the "also fine" pointer fix is chosen.

Each frame the scene:
- **While walking:** runs the existing steps (input, lift, scroll, checks,
  damage), then `updateRun`. It only refills sleep if still walking, then
  draws.
- **While ended:** runs only `updateRun`. It shows the button once
  `canRestart` is true, and restarts on Enter or a button press if
  `canRestart`.

## Acceptance criteria

### Automated (tester, `npm test`)

1. `npm test` passes (exit code 0), including all earlier tests.
2. `initialRun()` → `{ phase: 'walking', elapsedMs: 0, msSinceEnd: 0 }`.
3. `updateRun({ phase: 'walking', elapsedMs: 1000, msSinceEnd: 0 }, 50, 16)` →
   `{ phase: 'walking', elapsedMs: 1016, msSinceEnd: 0 }`.
4. `updateRun({ phase: 'walking', elapsedMs: 1000, msSinceEnd: 0 }, 0, 16)` →
   `{ phase: 'ended', elapsedMs: 1016, msSinceEnd: 0 }`. A sleep of -5 gives
   the same.
5. `updateRun({ phase: 'ended', elapsedMs: 1016, msSinceEnd: 500 }, 0, 16)` →
   `{ phase: 'ended', elapsedMs: 1016, msSinceEnd: 516 }`. A sleep of 100
   gives the same (once ended, it stays ended).
6. `updateRun` never changes the state object passed in.
7. `canRestart`:
   - (walking, any) → false;
   - (`{ phase: 'ended', msSinceEnd: 999 }`, 1000) → false;
   - (`{ phase: 'ended', msSinceEnd: 1000 }`, 1000) → true.
8. `formatRunTime`: 0 → `'0:00'`; 999 → `'0:00'`; 59999 → `'0:59'`; 60000 →
   `'1:00'`; 83500 → `'1:23'`; 600000 → `'10:00'`.
9. `endTimeText(83500)` → `'Asleep for 1:23'`.
10. `pointersToAdd`: (1, 2) → 1; (2, 2) → 0; (3, 2) → 0.
11. src/TouchButtons.js only asks for an extra touch point when fewer than
    `TOUCH_POINTERS` exist, or doesn't ask at all and src/main.js sets the
    game's touch points to `TOUCH_POINTERS`. This is checked by reading the
    files as text, like the existing "no phaser in logic" test.
12. No file in `src/logic/` contains the word "phaser" (any capitalisation).
13. `src/config.js` exports every name in the Tuning values table with the
    exact values listed. All earlier names and values are unchanged.

Reviewer (code reading, not automated):

14. Every listener added in `create()` and in src/TouchButtons.js is removed
    on the scene's `shutdown`.

### Manual (owner, on https://pinzzas.github.io/stroller/)

Quick way to wake the baby: switch to brisk, never lift, don't use Shush. It
takes about half a minute.

On a computer browser:

15. When the meter reaches `Sleep 0`:
    - the street stops;
    - a white box says `The baby woke up!` and `Asleep for m:ss`;
    - the time roughly matches how long you walked.
16. During the first second, Enter does nothing. Then `Walk again` appears.
17. While the box is up, Up, Down, Space and S do nothing (the speed label
    doesn't change and the stroller doesn't tilt).
18. Press Enter: a fresh walk starts with `Sleep 100`, `Speed: normal` (and
    `Shush: 2 left`, if built). The street layout is usually different.
19. Wake the baby again and click `Walk again`: same fresh start.
20. **Pile-up check:** after at least 3 restarts, press Up once. The speed goes
    up exactly one step (normal to brisk, not straight past it). Press Down
    once: exactly one step. If Shush is built, one S press uses exactly one
    charge.
21. Hold Space while the baby wakes and keep holding it: the end screen stays
    up and nothing restarts.

On iPhone Safari (landscape):

22. Wake the baby using the test buttons (tap `Faster` twice, never lift). The
    end box appears and fits on screen. After a second, tap `Walk again`: a
    fresh walk starts.
23. After 3 restarts:
    - tapping `Faster` once moves exactly one step;
    - holding `Lift (hold)` with one thumb while tapping `Faster` with the
      other still works.
24. Tapping `Walk again` quickly several times never zooms the page or starts
    two walks.

## Assumptions (owner, please correct if wrong)

- Q1 = A and Q2 = A.
- The time is how long the walk lasted, counted in game time. It pauses while
  the tab is hidden. Distance is not shown (DESIGN.md: distance doesn't
  count).
- `The baby woke up!` is the warm, gentle wording. There is no fail sound and
  no "Game over". The awake face comes in W8.
- The street freezes behind the box. It is not hidden or dimmed.
- The test buttons stay on screen but do nothing while ended. `Walk again` is
  away from them, so it can't be tapped by mistake.
- Restarting the whole Phaser scene is the simple way to reset everything. It
  also tests the pile-up fix every time.
- The two Low TODO items (`pointerupoutside`, the HUD text height) are not
  part of this spec.

## Out of scope / maybe later

- Sleep minutes and earning them (W5); showing them on the end screen (W5)
- Best time or high score, and saving (W7)
- Upgrade shop between runs (W7)
- Baby's awake face, wake-up sound, end-screen music (W8, W10)
- Pause, quit and menus: not in DESIGN.md. If wanted, add to "Maybe later"
  first.
