# Manual checklist: project setup (W1)

Game link: https://pinzzas.github.io/stroller/
Expected build label: `build <latest short commit id> (claude/gallant-sagan-w02tuh)`

## A. Computer browser

1. Open the GitHub repo, Actions tab. The newest "deploy" run has a green tick
   (within about 5 minutes of the push). Note the short commit id shown on it.
2. Open the game link. You see a game picture (not blank or white). The browser
   tab is titled "Shhh!". You see pale blue sky, a row of peach houses with one
   window each, a light grey pavement with thin darker slab lines, and a grey
   stroller (box, handle, two dark wheels) standing on the pavement about a
   quarter in from the left.
3. Check the tiny grey label in the bottom-right. It reads
   `build <short id> (claude/gallant-sagan-w02tuh)` and the id matches the
   commit on the Actions run from step 1.
4. Watch for 1 minute. Houses and pavement slide right to left at a steady walk
   (a slab passes about every two-thirds of a second). Look for gaps, jumps or
   flicker in the pavement lines. There should be none, and it never stops. The
   stroller does not move.
5. Try to break it: press arrow keys, Space and S, click and right-click all
   over the picture, then drag the window narrow, then wide, then tall. Nothing
   should change except the picture size. It shrinks and grows, never looks
   squashed, stays centred, and the street keeps scrolling. Also switch to
   another tab for 10 seconds and come back: the street carries on without a
   big jump.

## B. iPhone Safari (must pass)

6. Open the game link. The page loads and the picture fits the screen. In
   portrait you see sky-coloured space above and below the picture. Turn the
   phone to landscape: the picture fits again. The street scrolls smoothly and
   the pavement lines do not flicker.
7. In landscape, check the build label (bottom-right) is not hidden under the
   iPhone's rounded corner or home bar, and you can read it. It shows the same
   id and branch as step 3.
8. Switch to another app for 10 seconds, then come back. The street carries on
   scrolling without a big jump.
9. Try to break it: tap, double-tap and swipe on the picture. Nothing should
   happen, the page should not scroll or zoom, and the stroller stays put.
