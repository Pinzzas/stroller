# Spec: Project setup and scrolling street (W1)

Status: approved by the owner (2026-11-09)
Plan item: PLAN.md W1, "Set up the project (Phaser, published to GitHub Pages so
you can play it in your browser). A grey box stroller walks on a scrolling street."

## Goal

When I open the game's web page, I see a little grey-box stroller strolling
along a gently scrolling street.

## What the owner sees

Open https://pinzzas.github.io/stroller/ in a browser. A 16:9 game picture
fills as much of the window as it can without stretching. Inside it:

- a pale blue sky,
- a row of identical simple houses (peach rectangles, each with one window),
- a light grey pavement along the bottom, split into slabs by thin darker lines,
- a grey-box stroller (one body box, a handle, two dark wheels) standing on the
  pavement about a quarter of the way in from the left.

The houses and pavement slide steadily from right to left, forever, so the
stroller looks like it is walking to the right. The stroller itself stays in
the same spot. Nothing reacts to keys, clicks or taps yet.

A tiny grey label in the bottom-right corner says which build this is, e.g.
`build 1a2b3c4 (main)`, so the owner can tell the newest version is live.

## Controls and states

- Controls: none. No keys, clicks or taps do anything in this feature.
- States: one state only, "walking". The street scrolls at one fixed speed.
  No menus, no pause button, no end screen.

## Start, end and fail conditions

- Start: the walk begins as soon as the page has loaded. No title screen.
- End: none. The street scrolls until the page is closed.
- Fail: none (there is no sleep meter yet).
- Leaving and coming back (other tab, other app on iPhone): the street carries
  on smoothly from about where it was. It must not jump far ahead to "catch up".

## Tuning values (src/config.js)

Every number below is a named export in `src/config.js`. No other file may
contain these numbers directly.

| Name | Value | Meaning |
| --- | --- | --- |
| `GAME_WIDTH` | 960 | Game picture width in game pixels |
| `GAME_HEIGHT` | 540 | Game picture height in game pixels |
| `STREET_SCROLL_SPEED` | 120 | How fast the street slides left, pixels per second |
| `MAX_FRAME_DELTA_MS` | 100 | Longest time step allowed in one frame (stops big jumps after tab switches) |
| `PAVEMENT_TOP_Y` | 420 | Where the pavement starts (top edge) |
| `PAVEMENT_SLAB_WIDTH` | 80 | Width of one pavement slab (seam to seam) |
| `PAVEMENT_SEAM_WIDTH` | 2 | Width of the darker line between slabs |
| `HOUSE_SPACING` | 240 | Distance from one house's left edge to the next |
| `HOUSE_WIDTH` | 180 | Width of one house |
| `HOUSE_HEIGHT` | 160 | Height of one house (stands on the pavement top) |
| `WINDOW_SIZE` | 40 | Width and height of each house's window |
| `STROLLER_X` | 240 | Left edge of the stroller body |
| `STROLLER_GROUND_Y` | 450 | Where the bottom of the wheels touches the pavement |
| `STROLLER_WIDTH` | 90 | Stroller body width |
| `STROLLER_HEIGHT` | 60 | Stroller body height |
| `STROLLER_WHEEL_SIZE` | 18 | Wheel width and height (square grey-box wheels) |
| `STROLLER_HANDLE_WIDTH` | 8 | Handle width (sticks up from the body's left edge) |
| `STROLLER_HANDLE_HEIGHT` | 40 | Handle height above the body |
| `COLOR_SKY` | 0xcfe8f5 | Sky, also the page background around the game |
| `COLOR_HOUSE` | 0xf4d6c6 | House walls |
| `COLOR_WINDOW` | 0xfff6d8 | House windows |
| `COLOR_PAVEMENT` | 0xdcd6cc | Pavement slabs |
| `COLOR_PAVEMENT_SEAM` | 0xbcb5aa | Lines between slabs |
| `COLOR_STROLLER` | 0x8e99a6 | Stroller body and handle |
| `COLOR_WHEEL` | 0x5b6672 | Wheels |
| `COLOR_BUILD_LABEL` | 0x7a7a7a | Build label text |
| `BUILD_LABEL_FONT_SIZE` | 12 | Build label text size in game pixels |

Houses and pavement both scroll at `STREET_SCROLL_SPEED` (no parallax yet).

## Logic (src/logic/)

One file, `src/logic/scroll.js`, with no Phaser code and no imports from
Phaser. All functions are pure (same input, same output, change nothing else).

1. `clampDeltaMs(deltaMs, maxMs)` → number
   Returns `deltaMs` limited to the range 0 to `maxMs`.
2. `advanceScroll(offset, speedPxPerSec, deltaMs)` → number
   Returns `offset + speedPxPerSec * deltaMs / 1000`.
3. `wrapOffset(offset, tileWidth)` → number
   Returns the offset folded into the range 0 (included) to `tileWidth`
   (excluded). Works for negative offsets too.
4. `tileXPositions(offset, tileWidth, viewWidth)` → array of numbers
   Returns the left x of every tile needed to cover the screen: starts at
   `-wrapOffset(offset, tileWidth)`, steps by `tileWidth`, and stops before
   the first x that is `>= viewWidth`.

The scene each frame does: clamp the frame time, advance the total scroll,
then place the pavement slabs with `tileXPositions(scroll, PAVEMENT_SLAB_WIDTH,
GAME_WIDTH)` and the houses with `tileXPositions(scroll, HOUSE_SPACING,
GAME_WIDTH)`.

## Project and deploy

- Phaser 3 (latest 3.x) and Vite from npm. No other libraries.
- `npm run dev` runs Vite locally, `npm run build` builds into `dist/`,
  `npm test` runs `node --test`.
- `vite.config.js` sets `base: '/stroller/'` so the page works at
  https://pinzzas.github.io/stroller/ (repo pinzzas/stroller).
- Phaser scale mode: fit the window, keep the 16:9 shape, centre the picture.
  `index.html` has a mobile viewport tag, page title "Shhh!", no page scroll
  bars, and the page background is `COLOR_SKY`.
- Build label: the build step writes the short commit id and branch name into
  the game (from GitHub Actions' built-in values). Running locally shows
  `build dev`.
- GitHub Actions workflow `.github/workflows/deploy.yml`:
  on push to the deploy branch(es) (see Open questions) and on manual
  "Run workflow": install with `npm ci`, run `npm test`, run `npm run build`,
  then publish `dist/` to GitHub Pages using GitHub's official Pages actions.
  If tests fail, nothing is published.
- One-time owner step (only if not already done): on GitHub, open the repo →
  Settings → Pages → "Build and deployment" → Source: **GitHub Actions**.
- `.gitignore` covers `node_modules/` and `dist/`.

## Acceptance criteria

### Automated (tester, `npm test`)

1. `npm test` runs Node's built-in test runner and all tests pass (exit code 0).
2. `clampDeltaMs(16, 100)` is 16; `clampDeltaMs(250, 100)` is 100;
   `clampDeltaMs(-5, 100)` is 0.
3. `advanceScroll(0, 120, 1000)` is 120; `advanceScroll(0, 120, 500)` is 60;
   `advanceScroll(50, 120, 0)` is 50.
4. `wrapOffset(0, 80)` is 0; `wrapOffset(80, 80)` is 0; `wrapOffset(200, 80)`
   is 40; `wrapOffset(-10, 80)` is 70.
5. `tileXPositions(0, 80, 960)` returns 12 values: 0, 80, ... 880.
6. `tileXPositions(30, 80, 960)` returns 13 values: -30, 50, ... 930.
7. `tileXPositions(1000, 240, 960)` returns 5 values: -40, 200, 440, 680, 920.
8. No file in `src/logic/` contains the word "phaser" (any capitalisation).
9. `src/config.js` exports every name in the Tuning values table, each with
   the exact value listed.
10. After `npm run build`, `dist/index.html` exists and loads its script from a
    path starting with `/stroller/`.

### Manual (owner, in a browser on https://pinzzas.github.io/stroller/)

11. After the change is pushed, the repo's Actions tab shows the deploy run
    with a green tick within about 5 minutes.
12. On a computer browser, the page loads to the game picture (not a blank or
    white page); the browser tab is titled "Shhh!".
13. You see sky, a row of houses, a pavement with slab lines, and a grey
    stroller standing on the pavement in the left part of the picture.
14. The houses and pavement slide right-to-left at a steady walking pace (a
    slab passes about every two-thirds of a second). Watch for 1 minute: no
    gaps, flicker or jumps, and it never stops.
15. The stroller stays still in its spot. Pressing arrow keys, Space or S, or
    clicking, changes nothing.
16. Make the browser window narrow, then wide: the picture shrinks and grows,
    keeps its shape (never squashed), and stays centred.
17. The build label in the bottom-right matches the latest commit shown on the
    Actions run.
18. On iPhone Safari: the page loads, the picture fits the screen in both
    portrait (with sky-coloured space above and below) and landscape, and the
    street scrolls smoothly.
19. On iPhone: switch to another app for 10 seconds, then back. The street
    carries on scrolling without a big jump.

## Assumptions (owner, please correct if wrong)

- The stroller stays put and the street moves. That is how most side-scrollers
  "walk", and it keeps the stroller where obstacles will meet it later.
- Fixed speed of 120 pixels per second stands in for "normal" speed. W2 adds
  slow and brisk.
- One house colour only, so houses don't change colour as they loop round.
- No stroller bobbing or wheel spin: that is "juice", planned for W10.
- The build label is a testing aid, not a feature; it can be removed before
  launch.
- No sound at all in this feature.
- Tests live in a `tests/` folder (the tester picks the file names).
- Node 22 (current long-term-support version) in GitHub Actions.

## Owner decisions

- **Q1 → B.** Deploy on push to `main` and to `claude/*` branches. The owner
  adds the `claude/*` branch rule to the github-pages environment once.
- **Q2 → yes.** iPhone Safari criteria 18 and 19 are must-pass.

## Out of scope

- Any player input: speed control, Lift, Shush (W2, W3)
- Sleep meter, baby, faces, z's (W2+)
- Obstacles of any kind (W2+)
- Title screen, pause, restart, end screen (W3+)
- Parallax layers, real art, sound, music (W8, W10)
- Stroller wobble, bobbing, wheel spin (W10)
- Touch controls (DESIGN.md "Maybe later")
- Electron and Windows/Mac builds (W10)
- Steamworks onboarding (separate W1 task, done by the owner on Steam's website)
