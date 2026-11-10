# TODO

Leftovers and bugs, newest first.

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
