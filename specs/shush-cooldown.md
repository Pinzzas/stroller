# Spec: Shush with cooldown (W3, task 1)

Status: approved by the owner (2026-11-10). Answers: Q1 = A (use both
charges, then a 30 s wait), Q2 = B (S at full sleep still uses a charge).
Plan item: PLAN.md W3, "Shush with cooldown."
Builds on: specs/speed-lift-sleep-meter.md and specs/potholes-and-curbs.md
(both accepted).
DESIGN.md rows used:
- Controls: "Shush | S key | Instantly restores some sleep. Limited charges,
  then a cooldown."
- Upgrades: Pacifier pouch, "More Shush charges, shorter cooldown". This is
  W7; it only tells us the charges and cooldown must be tuning numbers.
- Obstacles: Passing siren, "Shush right at the peak". This is W5.

## Does Shush have a job yet?

Yes. DESIGN.md gives Shush two jobs:
1. **Restore some sleep.** This works today. After a pothole or a crossing
   jolt, Shush gives sleep back at once, instead of waiting 3 s and refilling
   slowly. That is the "rescue button" feeling DESIGN.md describes for the
   Pacifier pouch.
2. **Be the right answer to the siren** ("Shush right at the peak"). The siren
   arrives in W5, so this part waits.

So this spec builds the full Shush as DESIGN.md describes it: key, restore,
limited charges, cooldown, a label showing them, and a small visible effect.
Nothing is added for the siren yet.

## Questions for the owner (answered 2026-11-10: Q1 A, Q2 B)

**Q1. How do charges and the cooldown work?**
DESIGN.md says "Limited charges, then a cooldown."
- **A. (Recommended) Use them all, then wait.** You have 2 charges. When you
  use the last one, a 30 s cooldown starts, and after it both charges come
  back. This is the most literal reading of DESIGN.md, and it is easy to read
  on screen ("Shush: 2 left" or "Shush: back in 30s").
- **B. One charge at a time.** Each used charge comes back on its own after
  15 s. Smoother, but there is always a timer running, so it is harder to
  read and to tune.
- **C. No charges, just a 15 s wait after every Shush.** Simplest, but it drops
  "limited charges" from DESIGN.md and leaves the Pacifier pouch upgrade with
  less to change. Not recommended.

**Q2. What if you press Shush when sleep is already full?**
- **A. (Recommended) Nothing happens and you keep the charge.** It's gentle,
  and you can't waste a charge by accident.
- **B. The charge is used anyway.** Simpler to explain, but it punishes a
  mistake for no reason. That doesn't fit the cozy tone.

## Goal

When the baby has been jolted, I press S to shush them and some sleep comes
back at once, but I only have a couple of shushes before I have to wait for
them to come back.

## What the owner sees

Everything from earlier tasks stays. New:

- **Shush label:** top left, under `Speed: normal`, the text `Shush: 2 left`.
- **Press S** (or tap the new `Shush` test button) while you have a charge:
  - the meter jumps up by 15, but never above 100;
  - the label shows one charge less;
  - the word `Shhh!` appears above the stroller for 1 second.
- **[Q2-B] At full sleep (100)** a Shush still uses a charge and shows
  `Shhh!`, but the meter stays at 100.
- **Last charge used:** the label shows `Shush: back in 30s` and counts down
  each second. When it reaches zero it shows `Shush: 2 left` again.
- **Nothing happens** if you press S while it is counting down. No charge is
  used and `Shhh!` does not appear.
- **Test button:** a fourth see-through button, `Shush`, at the bottom right
  just left of `Lift (hold)`.

## Controls and states

### Controls
| Action | Keyboard | Touch / mouse (test buttons) |
| --- | --- | --- |
| Shush | S (one use per press; holding S does not repeat) | Tap `Shush` |

All other controls are unchanged. Shush works at any speed, and while lifting.

### States
- **Shush:** `{ charges, cooldownMsLeft }`. It starts at
  `{ charges: SHUSH_MAX_CHARGES, cooldownMsLeft: 0 }`.
  - Charges above 0 means you can shush.
  - Charges at 0 means the cooldown is running. When it ends, the charges go
    back to the maximum.
- **Shush text:** shown for `SHUSH_TEXT_MS` after a successful Shush,
  otherwise hidden.

## Start, end and fail conditions

- Start: a walk starts with full charges and no cooldown.
- End and fail: none in this spec.
  - If the run-end spec (specs/run-end-and-restart.md) is built first: S and
    the `Shush` button do nothing on the end screen, and restarting gives full
    charges again.
  - The S key's listener must be removed when the scene shuts down, the same
    way as the Up/Down listeners in that spec.

## How Shush works

- A Shush is used whenever **charges > 0**, also at full sleep [Q2-B]. Then:
  - sleep goes up by `SHUSH_RESTORE` (15), kept at or below `SLEEP_MAX`;
  - charges go down by 1;
  - if charges are now 0, `cooldownMsLeft` becomes `SHUSH_COOLDOWN_MS`
    (30000);
  - the `Shhh!` text starts.
- Otherwise nothing changes.
- Every frame, if `cooldownMsLeft > 0`, it goes down by the frame time. When
  it reaches 0 or below, charges become `SHUSH_MAX_CHARGES` and
  `cooldownMsLeft` becomes 0.
- Shush does not change the refill rules. The 3 s refill wait after a hit
  carries on as before, and Shush is not a "hit".
- The cooldown counts frame time (clamped as before), so it pauses while the
  tab is hidden.

## Tuning values (src/config.js)

| Name | Value | Meaning |
| --- | --- | --- |
| `SHUSH_MAX_CHARGES` | 2 | Shushes available before the cooldown |
| `SHUSH_RESTORE` | 15 | Sleep restored by one Shush |
| `SHUSH_COOLDOWN_MS` | 30000 | Wait after the last charge, before all charges come back |
| `SHUSH_TEXT_MS` | 1000 | How long `Shhh!` shows above the stroller |
| `SHUSH_TEXT_FONT_SIZE` | 22 | Size of the `Shhh!` text |
| `SHUSH_TEXT_GAP` | 20 | Gap between the top of the stroller body and the bottom of `Shhh!` |
| `HUD_LINE_GAP` | 8 | Gap between the speed label and the Shush label |

Layout:
- The Shush label is at x `HUD_MARGIN`, y `HUD_MARGIN + HUD_FONT_SIZE + HUD_LINE_GAP`
  (40), in the HUD text colour and size.
- `Shhh!` is centred on the stroller body (x 285). Its bottom edge is
  `SHUSH_TEXT_GAP` above the body top (body top 372, so text bottom 352), in
  `COLOR_HUD_TEXT`.
- The `Shush` test button is `TOUCH_BUTTON_SIZE` square. Its left edge is at
  `GAME_WIDTH - TOUCH_BUTTON_MARGIN - TOUCH_LIFT_WIDTH - TOUCH_BUTTON_MARGIN - TOUCH_BUTTON_SIZE`
  (688), with the same top (436) and style as the other buttons. There are no
  new numbers for it.

## Logic (src/logic/)

New file `src/logic/shush.js`. There is no Phaser code, and all the functions
are pure and never change their inputs. Tuning values are passed in.

1. `initialShush(maxCharges)` → `{ charges: maxCharges, cooldownMsLeft: 0 }`
2. `useShush(state, sleep, rules)` → `{ state, sleep, used }`
   - `rules` is `{ restore, maxSleep, cooldownMs }`.
   - If `state.charges > 0` (whatever the sleep, also at `maxSleep` [Q2-B]):
     - sleep becomes `min(sleep + restore, maxSleep)`;
     - charges go down by 1;
     - `cooldownMsLeft` becomes `cooldownMs` if charges are now 0;
     - `used` is true.
   - Otherwise it returns the same values with `used: false`.
3. `updateShush(state, deltaMs, maxCharges)` → new state
   - If `cooldownMsLeft > 0`: subtract `deltaMs`. If the result is `<= 0`,
     return `{ charges: maxCharges, cooldownMsLeft: 0 }`.
   - Otherwise return the state unchanged.
4. `shushLabel(state)` → string
   - `'Shush: N left'` when charges > 0.
   - Otherwise `'Shush: back in Ss'`, with S = `cooldownMsLeft / 1000` rounded
     **up**.

Each frame the scene:
1. handles any S press or `Shush` tap with `useShush`;
2. updates the cooldown with `updateShush`;
3. runs the existing steps;
4. draws the label with `shushLabel`.

## Acceptance criteria

### Automated (tester, `npm test`)

Rules used below: `{ restore: 15, maxSleep: 100, cooldownMs: 30000 }`, max
charges 2.

1. `npm test` passes (exit code 0), including all earlier tests.
2. `initialShush(2)` → `{ charges: 2, cooldownMsLeft: 0 }`.
3. `useShush({ charges: 2, cooldownMsLeft: 0 }, 50, rules)` → state
   `{ charges: 1, cooldownMsLeft: 0 }`, sleep 65, used true.
4. `useShush({ charges: 1, cooldownMsLeft: 0 }, 50, rules)` → state
   `{ charges: 0, cooldownMsLeft: 30000 }`, sleep 65, used true.
5. `useShush({ charges: 0, cooldownMsLeft: 12000 }, 50, rules)` → state
   unchanged, sleep 50, used false.
6. `useShush({ charges: 2, cooldownMsLeft: 0 }, 95, rules)` → sleep 100,
   charges 1, used true.
7. [Q2-B] Full sleep still uses a charge:
   - `useShush({ charges: 2, cooldownMsLeft: 0 }, 100, rules)` → state
     `{ charges: 1, cooldownMsLeft: 0 }`, sleep 100, used true.
   - `useShush({ charges: 1, cooldownMsLeft: 0 }, 100, rules)` → state
     `{ charges: 0, cooldownMsLeft: 30000 }`, sleep 100, used true.
8. `useShush` and `updateShush` never change the state object passed in.
9. `updateShush`:
   - (`{ charges: 0, cooldownMsLeft: 30000 }`, 16, 2) → `{ charges: 0, cooldownMsLeft: 29984 }`
   - (`{ charges: 0, cooldownMsLeft: 16 }`, 16, 2) → `{ charges: 2, cooldownMsLeft: 0 }`
   - (`{ charges: 0, cooldownMsLeft: 10 }`, 16, 2) → `{ charges: 2, cooldownMsLeft: 0 }`
   - (`{ charges: 1, cooldownMsLeft: 0 }`, 16, 2) → `{ charges: 1, cooldownMsLeft: 0 }`
10. Cooldown length: starting from `{ charges: 0, cooldownMsLeft: 30000 }`,
    calling `updateShush` with 16 ms steps gives charges back after exactly
    1875 calls, not before.
11. `shushLabel`:
    - `{ charges: 2, cooldownMsLeft: 0 }` → `'Shush: 2 left'`
    - `{ charges: 1, cooldownMsLeft: 0 }` → `'Shush: 1 left'`
    - `{ charges: 0, cooldownMsLeft: 30000 }` → `'Shush: back in 30s'`
    - `{ charges: 0, cooldownMsLeft: 29001 }` → `'Shush: back in 30s'`
    - `{ charges: 0, cooldownMsLeft: 1 }` → `'Shush: back in 1s'`
12. No file in `src/logic/` contains the word "phaser" (any capitalisation).
13. `src/config.js` exports every name in the Tuning values table with the
    exact values listed. All earlier names and values are unchanged.

### Manual (owner, on https://pinzzas.github.io/stroller/)

On a computer browser:

14. On load, top left shows `Speed: normal` and under it `Shush: 2 left`.
15. [Q2-B] With sleep at 100, press S: `Shhh!` shows, the meter stays at
    `Sleep 100` and the label says `Shush: 1 left`. Then reload the page to get
    both charges back for the next steps.
16. Let a pothole hit (`Sleep 90`), then press S at once: the meter jumps to
    100, `Shhh!` shows above the stroller for about a second, and the label
    says `Shush: 1 left`.
17. Wait for `Sleep 100`, then let a crossing hit at both curbs (`Sleep 60`)
    and press S: the meter shows `Sleep 75` and the label says
    `Shush: back in 30s`. It counts down about once a second.
18. Press S during the countdown: nothing happens.
19. After about 30 seconds the label says `Shush: 2 left` again and S works
    again.
20. Holding S down uses only one charge.

On iPhone Safari (landscape):

21. A `Shush` button sits just left of `Lift (hold)`. After a jolt, tapping it
    behaves exactly like S (meter up by 15, `Shhh!`, label changes). Holding
    `Lift (hold)` with one thumb while tapping `Shush` with the other works.

## Assumptions (owner, please correct if wrong)

- Q1 = A and Q2 = B (owner's picks). Q2 = B means a Shush at full sleep is
  "wasted" on purpose. You have to judge when it's worth it.
- Starting numbers: 2 charges, 15 sleep each, 30 s cooldown. One Shush roughly
  undoes a pothole and a half, or most of one bad curb. These are tuning
  numbers for the week 3 fun check.
- Shush restores sleep only. It does not stop or reduce the next jolt.
- The `Shush` test button is part of the existing testing aid (DESIGN.md: test
  buttons for phone playtests, hidden before launch). It is not a v1 feature.
- `Shhh!` is plain text, following the grey-box rule. The sigh sound comes in
  W10.

## Out of scope / maybe later

- Shush as the answer to the siren, and timing at its "peak" (W5)
- Pacifier pouch upgrade: more charges, shorter cooldown (W7)
- Sigh sound and other Shush juice (W10); the baby's face reacting (W8)
- Run end at 0 sleep and restart (specs/run-end-and-restart.md)
