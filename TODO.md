# TODO

Leftovers and bugs, newest first.

## 2026-11-09 — W1 project setup (accepted)
- Low: sky colour is typed twice (src/config.js COLOR_SKY and index.html CSS). Could set the page background from config in main.js.
- Low: tileXPositions(0, ...) returns -0 as first value instead of 0. Harmless on screen; the test normalises it.
- Low: Vite warns the bundle is over 500 kB (it's Phaser). Harmless; could raise chunkSizeWarningLimit.
- Low: workflow uses actions v4 / upload-pages-artifact v3. Bump if GitHub warns about deprecated versions.
- Note: the claude/* working branch is live on Pages; merge to main when ready so main matches.
- Owner: start Steamworks onboarding (identity, tax, bank) — second W1 task.
