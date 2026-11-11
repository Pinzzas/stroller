# TODO

Leftovers and bugs, newest first.

## 2026-11-11 — W5 part 1: sleep stages and busier street (accepted)
- Fixed: obstacle drawing moved out of src/StreetScene.js into src/ObstacleDrawing.js (Low item from W4 part 2).
- Next: Part 2, the siren and new kinds joining one at a time. Owner to decide first: new kind every 3 obstacles instead of 4? (With 4, the siren arrives at about 1:50, and many early walks end before that.)
- Watch at W6: a siren with no Shush left can't be stopped (Q3-B); Dreamy may feel rushed (Q4-C). Medium gaps 700 / 560 / 450 are a numbers-only retune.
- Low: the street plan grows all walk and is scanned from the start each frame. Fine for 30+ minute walks.
- Low: the stage is read one frame (16 ms) before the clock updates. Not visible.
- Low: src/logic/obstacles.js header comment still says "Potholes and curbs". Comment only.
- Note: one test failure appeared once during the build and never came back (15+ reruns). Likely the build test running slowly. If it returns, save the test name and output.

## 2026-11-11 — W4 part 2: the chatty neighbour (accepted)
- Fixed: StreetScene no longer draws a neighbour as a pothole (Low item from W4 part 1).
- ~~Low: src/StreetScene.js is now about 460 lines. Move the obstacle drawing into its own file before the W5 siren.~~ Done in W5 part 1.
- Low: when a chat starts, the meter can refill for one frame (at most about 0.01 sleep). Can't be seen in play.
- Low: src/config.js comment for PAVEMENT_BACK_Y says only pigeons stand there; the neighbour does too. Comment only.

## 2026-11-10 — W4 part 1: pigeons, dog and woof? icon (accepted)
- ~~Next: Part 2, the neighbour.~~ Done 2026-11-11.
- ~~Low: src/StreetScene.js draws any kind it doesn't know as a pothole. Handle 'neighbour' in Part 2.~~ Fixed in Part 2.
- Low: `WOOF!` text is drawn in front of the stroller and can overlap the handle or `Shhh!`. Cosmetic.
- Low: old comments still say "potholes and curbs" (src/logic/obstacles.js:1, src/StreetScene.js:61 and :300). Comment only.
- Low: the "pigeons flown off" check keeps drawing them 12 px longer than needed. Harmless.
- Note: two dogs in a row keep `woof?` on between fences. That's what the spec says, not a bug.
- Note: a "small noise" is now 10 in DESIGN.md.

## 2026-11-10 — W3 tuning pass, medium (accepted)
- Note: the Sleep label rounds up, so after a hit it ticks up 1 point right when the 5 s wait ends, then about 1 every 4 s. Not a bug.
- Note: careful players can still go long; there is no difficulty ramp yet. W5 sleep stages are the planned fix (spec Q2-A).
- Note: older specs still say the old numbers (e.g. "every 7.5 s"); specs/tuning-pass-w3.md replaces them.

## 2026-11-10 — W3 Shush with cooldown (accepted)
- Low: src/TouchButtons.js header comment still says "Three" buttons and doesn't mention onShush(). Comment only.
- Low: src/Hud.js class comment doesn't mention the Shush label. Comment only.
- Note: dev choice not in the spec: `Shhh!` is hidden when the run ends so it doesn't linger on the end screen.
- Note: Shush numbers (2 charges, +15, 30 s) are tuning values for the week 3 fun check.

## 2026-11-10 — W3 run end and restart (accepted)
- Fixed: the key-listener pile-up and the extra touch pointer per restart (the Medium item from 2026-11-09 below).
- Low: if a jolt wakes the baby, the stroller stays pink behind the end box (flash timer freezes). Fix is one line: clear the flash when the run ends. Owner has not decided.
- Note: the end screen shows only time asleep; sleep minutes come in week 5.
- Note: the two Low items from 2026-11-09 (pointerupoutside, HUD text height) are still open.

## 2026-11-10 — W2 potholes and street crossings (accepted)
- Low: with Q4-A the whole stroller drops 12 px as one piece on the road, so the back wheel briefly dips into or floats over the pavement edge. Wheels stepping down one at a time is a polish job (week 10).
- Note: obstacles are random each page load (CROSSING_CHANCE 0.35). If testing gets awkward, add a fixed test street.
- Note: crossing costs and spacing are tuning numbers in src/config.js; revisit at the week 3 fun check.

## 2026-11-09 — W2 speed control, Lift and sleep meter (accepted)
- ~~Medium (fixed in W3 run end and restart): Phaser keeps keys across a scene restart, so the Up/Down listeners in src/StreetScene.js would pile up (one press = two steps) and src/TouchButtons.js `addPointer(1)` would add a pointer each restart. Remove listeners on 'shutdown'; only add the pointer if fewer than 2 exist.~~
- Low: src/TouchButtons.js could also listen for 'pointerupoutside' to release Lift when the finger/mouse is released outside the game area (pointerout/gameout usually cover it).
- Low: src/Hud.js cloud height assumes text is 16 px tall (really ~19 px), so the gap under "Sleep N" is a little tight. Use the text's real height.
- Low: src/StreetScene.js `addCapture` duplicates what `addKeys` already does. Harmless.
- Note: on-screen test buttons are a playtest aid only (see DESIGN.md); hide them before launch.

## 2026-11-09 — W1 project setup (accepted)
- Low: sky colour is typed twice (src/config.js COLOR_SKY and index.html CSS). Could set the page background from config in main.js.
- Low: tileXPositions(0, ...) returns -0 as first value instead of 0. Harmless on screen; the test normalises it.
- Low: Vite warns the bundle is over 500 kB (it's Phaser). Harmless; could raise chunkSizeWarningLimit.
- Low: workflow uses actions v4 / upload-pages-artifact v3. Bump if GitHub warns about deprecated versions.
- Note: the claude/* working branch is live on Pages; merge to main when ready so main matches.
- Owner: start Steamworks onboarding (identity, tax, bank) — second W1 task.
