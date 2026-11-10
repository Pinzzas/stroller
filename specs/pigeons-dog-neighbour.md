# Spec: Pigeons, dog and neighbour, with a warning icon for heard threats (W4)

Status: approved by the owner (2026-11-10), as recommended: Q1 = B (two
parts; Part 1 this session, neighbour in Part 2), Q2 = A, Q3 = A, Q4 = A.
Assumptions accepted: small noise = 10; neighbour drain = 3 a second for 5 s.
Plan item: PLAN.md W4, "Pigeons, dog and neighbour, with warning icons for
heard threats."
Builds on: all accepted W1–W3 specs. Where numbers differ,
specs/tuning-pass-w3.md (medium, option B) wins over older specs.
DESIGN.md rows used:
- Obstacles: "Pigeons on the path | Seen | Slow down so they don't flap off |
  Small noise".
- "Barking dog behind a fence | Heard (a bark icon warns you first) | Go brisk
  to pass before it notices | Loud noise".
- "Chatty neighbour | Seen ahead | Go brisk past them | You stop; slow drain
  while they talk".
- "Mix ones you see with ones you hear, so the player watches and listens."
- Sleep meter: "a loud noise about 25"; "a frown flashes on every hit" (the
  pink flash stands in for the frown until W8).
- Sound: "a warning cue before every heard threat". Sound is W10, so this week
  the warning icon is the cue.

## The three obstacles in one line each

| Obstacle | Seen / heard | Right answer | If you get it wrong |
| --- | --- | --- | --- |
| Pigeons | Seen | Be at **slow** the whole time the front wheel passes the flock | They fly off: small noise, sleep −10 |
| Dog | **Heard** (a `woof?` icon warns you before the fence is on screen) | Be at **brisk** the whole time the front wheel passes the fence | The dog barks: loud noise, sleep −25 |
| Neighbour | Seen | Be at **brisk** when the front wheel reaches them | You stop for 5 s while they chat; sleep drains 3 a second (−15 in total) |

Lift does nothing for any of the three. Shush works as before and is a good
rescue after any of them (it also works during a chat).

## Questions for the owner

**Q1. Is this one session or two?**
This is three obstacles, a new obstacle mix, a warning icon and a new
"stopped and chatting" state. That is more than the earlier W2 and W3 tasks,
and likely more than one ~3 hour session including review, tests and your
playtest.
- **A. One session.** Everything at once. Fastest if it goes well, but a
  rejected build means re-checking all three obstacles.
- **B. (Recommended) Two parts.**
  - **Part 1:** the new obstacle mix, pigeons, dog and the warning icon. They
    work the same way as potholes (a stretch of street with one speed rule and
    one hit), so they are low risk.
  - **Part 2:** the neighbour. It is the only obstacle that stops the
    stroller, which touches scrolling, refill and the end screen.

  In Part 1 `NEIGHBOUR_CHANCE` is 0, so no neighbour appears yet. Part 2
  sets it to 0.15. Each part gets its own build, review, tests and your
  playtest. The acceptance criteria below are marked [P1] or [P2].
- **C. Three parts** (one obstacle each). The smallest steps, but three rounds
  of review and playtest for very similar work. Not recommended.

**Q2. What exactly makes the dog bark?**
DESIGN.md: "Go brisk to pass before it notices."
- **A. (Recommended) Brisk along the whole fence.** If the front wheel moves
  along the fence at any speed below brisk, even for a moment, the dog barks
  (once). It mirrors the pigeons ("slow all along the flock"), so there are
  only two rules to learn: slow for pigeons, brisk for the fence.
- **B. Brisk at one spot.** The dog only checks the moment the front wheel
  reaches the middle of the fence (like a curb check). Kinder, but the fence
  then looks longer than the part that matters.
- **C. A noticing timer.** The dog barks if you spend more than 1.6 s along
  the fence. It is the most literal reading of "before it notices", but you
  can't see the timer, so mistakes feel unfair. Not recommended.

**Q3. What do you see of the dog?**
The dog must be a "heard" threat, so the warning has to come before your eyes
can help.
- **A. (Recommended) A visible fence, a hidden dog, and an early icon.** A
  wooden garden fence shows where the danger is, but the `woof?` icon appears
  about 3 s (at normal) **before** the fence comes on screen. Fair and easy to
  read. The dog only pops up over the fence when it barks.
- **B. No fence, icon only.** The icon appears early and stays until you are
  past the danger: "brisk until the icon goes". The purest "listen, don't
  look", but going brisk early makes the obstacles just before it harder, and
  you can't see where the danger ends.

**Q4. How often does each obstacle come?**
Obstacles still come every 700 pixels (about every 5.8 s at normal). Each one
is now picked at random from five kinds.
- **A. (Recommended) Pothole 30%, crossing 25%, pigeons 15%, dog 15%,
  neighbour 15%.** Each new obstacle shows up about every 40 s at normal, so
  you meet each one a few times per walk. A wrong obstacle costs about the
  same on average as now (about 20), so difficulty stays close to the accepted
  medium tuning.
- **B. New ones rarer: pothole 40%, crossing 30%, pigeons 10%, dog 10%,
  neighbour 10%.** Closer to today's feel; the new ones are a surprise about
  once a minute.
- **C. All equal, 20% each.** Simple, but fewer potholes and crossings means
  less Lift, which was the core of the week 3 gate.

## Goal

As I push the stroller, I slow down so pigeons on the path stay put, I speed
up when I hear (see the icon for) a dog behind a fence, and I hurry past the
chatty neighbour, and each one I get wrong costs some of the baby's sleep.

## What the owner sees

Everything from earlier tasks stays. New (all placeholder rectangles plus a
few words of text):

- **Pigeons:** three small blue-grey rectangles standing at the back of the
  pavement, spread over 90 pixels.
  - Pass them at slow: they stay where they are. Nothing happens.
  - Pass at normal or brisk (even for a moment while the front wheel is along
    the flock): they rise up and fly off the top of the screen. Pink flash,
    sleep −10.
- **Dog:**
  - A `woof?` icon (a soft amber box with the word `woof?`) appears at the
    right edge of the screen, in the sky just above the roofs, before anything
    is visible on the street.
  - About 3 s later (at normal) a wooden fence, 240 pixels long and 40 tall,
    slides in at the back of the pavement, in front of the houses.
  - Pass the whole fence at brisk: nothing happens. The icon goes away when the
    front wheel passes the end of the fence.
  - Anything slower while the front wheel is along the fence: a brown dog box
    pops up over the fence with `WOOF!` above it for 1.5 s. Pink flash, sleep
    −25. The icon goes away at once.
- **Neighbour** [P2]: a tall soft-green rectangle standing at the back of the
  pavement.
  - Reach them at brisk: you walk past. Nothing happens.
  - Reach them at slow or normal: the street stops. A white speech bubble
    above them says `Ooh, is the baby asleep? So...`. For 5 s the meter
    drains about 3 a second (−15 in total) and does not refill. Then the
    bubble goes and the walk carries on at the speed shown on the speed label.
  - During the chat: Up/Down change the speed label (used when the walk
    carries on), S and the `Shush` button work as usual, and Space tilts the
    stroller but does nothing else.
- **The mix:** with Q4-A, about 3 in 10 obstacles are potholes, 1 in 4
  crossings and about 1 in 7 each pigeons, dog and neighbour, in a random
  order.

## Controls and states

### Controls
No new controls and no new test buttons.

| Action | Keyboard | Touch / mouse (test buttons) |
| --- | --- | --- |
| Speed up one step (dog, neighbour) | Up arrow | Tap `Faster` |
| Slow down one step (pigeons) | Down arrow | Tap `Slower` |
| Lift (not used by these three) | Hold Space | Hold `Lift (hold)` |
| Shush | S | Tap `Shush` |

### States (new)
- **Obstacle kind:** each obstacle is `pothole`, `crossing`, `pigeons`, `dog`
  or `neighbour`, worked out from its index and the street seed. It never
  changes.
- **Last flapped pigeons:** index of the last flock that already flew off
  (starts at -1), and the time since it flew off (for drawing only).
- **Last barked dog:** index of the last dog that already barked (starts at
  -1), and the time since it barked (for drawing only).
- **Chat** [P2]: `{ msLeft }`. 0 means not chatting.

## Start, end and fail conditions

- **Start:** as before. A walk starts at sleep 100, normal speed, 2 shushes, a
  new random street, no chat, and no flapped pigeons or barked dogs. The first
  obstacle can be any kind.
- **End/fail:** as before, the run ends when sleep reaches 0. This can happen
  during a chat [P2]. Then the chat stops, the bubble is hidden, and the end
  screen shows as usual.
- **Restart:** `Walk again` (or Enter) starts a fresh walk with all the new
  states reset. No icon, bubble, dog or flying pigeons are left over.

## How it works

The front wheel's street position is `scroll + 311`, as before. Obstacle k
starts at `L = OBSTACLE_FIRST_X + k * OBSTACLE_SPACING`. Its kind is
`obstacleKindFor(obstacleRandom(seed, k), chances)`.

### Pigeons (seen)
- Zone: `(L, L + PIGEON_WIDTH]`, found with the existing
  `obstacleIndexesOverWheel(..., PIGEON_WIDTH)`, keeping only `pigeons`.
- In any frame where the front wheel moves through the zone at a street speed
  above `PIGEON_MAX_SAFE_SPEED` (70, so normal or brisk), the flock flies off:
  sleep −`SLEEP_NOISE_SMALL` (10), at most once per flock.
- Drawing: `PIGEON_COUNT` (3) birds, each `PIGEON_BIRD_WIDTH` ×
  `PIGEON_BIRD_HEIGHT`, in `COLOR_PIGEON`. Their bottoms are at
  `PAVEMENT_BACK_Y`. Bird i's left edge is
  `L + i * (PIGEON_WIDTH - PIGEON_BIRD_WIDTH) / (PIGEON_COUNT - 1)` (offsets 0,
  37 and 74). After flying off, the flock moves up by `PIGEON_FLY_SPEED` pixels
  per second (and still scrolls with the street).
- Timing: the flock is seen 649 pixels before the wheel, which is 5.4 s at
  normal (one press of Down) and 3.6 s at brisk (two presses). At slow, the
  wheel takes 1.3 s to pass the flock.

### Dog (heard)
- Zone: the fence, `(L, L + DOG_FENCE_WIDTH]`, found with
  `obstacleIndexesOverWheel(..., DOG_FENCE_WIDTH)`, keeping only `dog`.
- [Q2-A] In any frame where the front wheel moves along the fence at a street
  speed below `DOG_MIN_SAFE_SPEED` (180, so slow or normal), the dog barks:
  sleep −`SLEEP_NOISE_LOUD` (25), at most once per dog.
- Fence drawing: a box in `COLOR_FENCE`, x L to `L + DOG_FENCE_WIDTH`,
  bottom at `PAVEMENT_TOP_Y` (420), `DOG_FENCE_HEIGHT` (40) tall, so y 380 to
  420. Drawn after the houses, behind the stroller.
- Bark drawing: for `DOG_SHOW_MS` (1500) after the bark, a `DOG_WIDTH` ×
  `DOG_HEIGHT` box in `COLOR_DOG`, centred on the fence, with its bottom on the
  fence top. `WOOF!` sits above it (`DOG_TEXT_FONT_SIZE`, `COLOR_HUD_TEXT`).
  Both scroll with the street.
- At brisk the front wheel takes 1.3 s to pass the fence. After a fence, the
  next obstacle is at least 460 pixels away: 2.6 s at brisk, so there is time
  to slow down for a crossing or pigeons.

### Warning icon (for heard threats; the dog is the only one this week)
- **When it appears:** as soon as a dog's fence start L is less than
  `HEARD_WARNING_DISTANCE` (1000) ahead of the front wheel, that is when
  `L - 1000 < wheel position`.
- **How long before the threat:** the fence comes on screen when L is 649
  ahead of the wheel. So the icon is the only warning for the first 351
  pixels, and the fence reaches the wheel this long after the icon appears:

  | Speed | Icon only (before the fence is on screen) | Icon to fence at the wheel |
  | --- | --- | --- |
  | slow | 5.0 s | 14.3 s |
  | normal | 2.9 s | 8.3 s |
  | brisk | 2.0 s | 5.6 s |

- **When it goes:** when the front wheel passes the fence end
  (`wheel position > L + DOG_FENCE_WIDTH`), or at once when that dog barks.
- **Where:** fixed on screen at the right edge, in the sky above the roofs:
  left edge `GAME_WIDTH - HUD_MARGIN - WARNING_ICON_WIDTH` (872), top
  `WARNING_ICON_Y` (200), `WARNING_ICON_WIDTH` × `WARNING_ICON_HEIGHT`
  (72 × 36), in `COLOR_WARNING_ICON`, with `woof?` centred in it
  (`HUD_FONT_SIZE`, `COLOR_HUD_TEXT`). It does not move or blink.
- It is hidden on the end screen.
- Built so the W5 siren can reuse it (same position and timing rule, its own
  word), but nothing for the siren is built now.

### Neighbour (seen) [P2]
- Check point: the moment the front wheel reaches L, found with the existing
  `obstacleIndexesReachingWheel(..., OBSTACLE_FIRST_X, ...)`, keeping only
  `neighbour`.
- At that moment, if the street speed is below `NEIGHBOUR_MIN_SAFE_SPEED`
  (180, so slow or normal), a chat starts: `msLeft = NEIGHBOUR_CHAT_MS`
  (5000).
- While chatting (`msLeft > 0`):
  - the street does not move (street speed 0), so nothing else can be hit;
  - sleep goes down by `NEIGHBOUR_DRAIN_PER_SEC` (3) per second of chat;
  - no refill, and the refill wait is held at 0, so refill starts 5 s
    (`SLEEP_RECOVERY_DELAY_MS`) after the chat ends;
  - there is no pink flash (stopping is the feedback);
  - the run time (`Asleep for`) keeps counting.
- Frame order while chatting: the street speed for this frame is worked out
  from the chat state at the start of the frame, then the chat is updated
  (drain), then the scroll moves. So a 5000 ms chat with 16 ms frames keeps
  the street still for 313 frames.
- Drawing: a `NEIGHBOUR_WIDTH` × `NEIGHBOUR_HEIGHT` box in `COLOR_NEIGHBOUR`,
  bottom at `PAVEMENT_BACK_Y`, left edge at L. While chatting: a white box
  (`COLOR_BUBBLE`) `NEIGHBOUR_BUBBLE_WIDTH` × `NEIGHBOUR_BUBBLE_HEIGHT`,
  centred over the neighbour, bottom `NEIGHBOUR_BUBBLE_GAP` above their head,
  with `NEIGHBOUR_CHAT_TEXT` centred in it (`HUD_FONT_SIZE`,
  `COLOR_HUD_TEXT`). With the starting values the bubble is y 282 to 322, just
  above the stroller handle (top 332).
- The neighbour is seen 649 pixels ahead: 5.4 s at normal for one press of Up,
  9.3 s at slow for two.

### On a pigeon flap or a dog bark
The pink flash starts (`HIT_FLASH_MS`) and the refill wait restarts, the same
as a jolt. (Not for the neighbour; see above.)

### The obstacle mix
- `obstacleKindFor(randomValue, chances)` with
  `chances = { crossing: CROSSING_CHANCE, pigeons: PIGEON_CHANCE, dog: DOG_CHANCE, neighbour: NEIGHBOUR_CHANCE }`.
- The ranges are stacked in this fixed order: crossing, pigeons, dog,
  neighbour, and the rest is pothole. With Q4-A: crossing below 0.25,
  pigeons below 0.40, dog below 0.55, neighbour below 0.70, pothole from 0.70.
- `obstacleTypeFor` is removed and the scene uses `obstacleKindFor`
  everywhere (drawing, potholes, curbs, step-down).
- The scene's `visibleObstacleIndexes` call passes the widest obstacle, which
  is now `DOG_FENCE_WIDTH` (240).

## Tuning values (src/config.js)

All numbers are starting values to tune at playtests. Speeds are in pixels
per second, like `CURB_MAX_SAFE_SPEED`.

### Changed
| Name | Old | New | Why |
| --- | --- | --- | --- |
| `CROSSING_CHANCE` | 0.4 | 0.25 | Makes room for the new kinds (Q4-A). Potholes become the rest (0.30). |

### New: mix
| Name | Value | Meaning |
| --- | --- | --- |
| `PIGEON_CHANCE` | 0.15 | Chance an obstacle is pigeons |
| `DOG_CHANCE` | 0.15 | Chance an obstacle is a dog |
| `NEIGHBOUR_CHANCE` | 0.15 | Chance an obstacle is a neighbour ([Q1-B] 0 in Part 1, 0.15 in Part 2) |

### New: noise damage
| Name | Value | Meaning |
| --- | --- | --- |
| `SLEEP_NOISE_SMALL` | 10 | Sleep lost on a small noise (pigeons fly off) |
| `SLEEP_NOISE_LOUD` | 25 | Sleep lost on a loud noise (dog barks); DESIGN.md "about 25" |

### New: pigeons
| Name | Value | Meaning |
| --- | --- | --- |
| `PIGEON_WIDTH` | 90 | Length of the flock; the wheel must stay slow along it |
| `PIGEON_MAX_SAFE_SPEED` | 70 | Fastest speed that keeps them calm (only slow) |
| `PIGEON_COUNT` | 3 | Birds in a flock (drawing only) |
| `PIGEON_BIRD_WIDTH` | 16 | One bird's width (drawing only) |
| `PIGEON_BIRD_HEIGHT` | 12 | One bird's height (drawing only) |
| `PIGEON_FLY_SPEED` | 150 | How fast a startled flock rises, pixels per second (drawing only) |
| `COLOR_PIGEON` | 0x9aa3b8 | Soft blue-grey |
| `PAVEMENT_BACK_Y` | 432 | Where pigeons and the neighbour stand (back of the pavement, behind the stroller) |

### New: dog and warning icon
| Name | Value | Meaning |
| --- | --- | --- |
| `DOG_FENCE_WIDTH` | 240 | Fence length; the wheel must stay brisk along it |
| `DOG_FENCE_HEIGHT` | 40 | Fence height, standing on the pavement top (drawing only) |
| `DOG_MIN_SAFE_SPEED` | 180 | Slowest speed that passes before the dog notices (only brisk) |
| `DOG_WIDTH` | 40 | Dog box width when it pops up (drawing only) |
| `DOG_HEIGHT` | 30 | Dog box height (drawing only) |
| `DOG_SHOW_MS` | 1500 | How long the dog and `WOOF!` show after a bark |
| `DOG_TEXT_FONT_SIZE` | 22 | Size of `WOOF!` |
| `COLOR_FENCE` | 0xd8b48a | Wooden fence (warm tan) |
| `COLOR_DOG` | 0xa47551 | Dog (soft brown) |
| `HEARD_WARNING_DISTANCE` | 1000 | Street distance ahead of the front wheel at which the icon appears |
| `WARNING_ICON_WIDTH` | 72 | Icon box width |
| `WARNING_ICON_HEIGHT` | 36 | Icon box height |
| `WARNING_ICON_Y` | 200 | Icon box top (sky, above the roofs at 260) |
| `COLOR_WARNING_ICON` | 0xffd98a | Soft amber |
| `DOG_WARNING_TEXT` | `'woof?'` | Word in the icon (text, not a number) |

### New: neighbour [P2]
| Name | Value | Meaning |
| --- | --- | --- |
| `NEIGHBOUR_MIN_SAFE_SPEED` | 180 | Slowest speed that gets you past with a wave (only brisk) |
| `NEIGHBOUR_CHAT_MS` | 5000 | How long you are stopped |
| `NEIGHBOUR_DRAIN_PER_SEC` | 3 | Sleep lost per second of chat (15 in total) |
| `NEIGHBOUR_WIDTH` | 30 | Neighbour box width |
| `NEIGHBOUR_HEIGHT` | 100 | Neighbour box height |
| `COLOR_NEIGHBOUR` | 0x9fcfa6 | Soft green |
| `NEIGHBOUR_BUBBLE_WIDTH` | 260 | Speech bubble width |
| `NEIGHBOUR_BUBBLE_HEIGHT` | 40 | Speech bubble height |
| `NEIGHBOUR_BUBBLE_GAP` | 10 | Gap between the neighbour's head and the bubble |
| `COLOR_BUBBLE` | 0xffffff | Speech bubble (white) |
| `NEIGHBOUR_CHAT_TEXT` | `'Ooh, is the baby asleep? So...'` | Bubble text (text, not a number) |

Everything else is unchanged, including `OBSTACLE_SPACING` 700,
`SLEEP_JOLT_SMALL` 10, `SLEEP_JOLT_BIG` 20, the speeds 70 / 120 / 180 and all
Shush and refill values from the medium tuning pass.

### Back-of-envelope check (Q4-A)
A wrong obstacle now costs on average 0.30 × 10 + 0.25 × 40 + 0.15 × 10 +
0.15 × 25 + 0.15 × 15 ≈ 20.5 (it was about 22). So "do nothing" still wakes
the baby in about 30–40 s, and careless and careful runs should feel close to
the accepted medium pass. The chats add a few seconds of standing still. The
10-run gate in W6 is the real test.

## Logic (src/logic/)

No Phaser code, no `Math.random`, and no function changes its inputs. Tuning
values are passed in.

### src/logic/obstacles.js (changed)
1. `obstacleKindFor(randomValue, chances)` → `'crossing' | 'pigeons' | 'dog' | 'neighbour' | 'pothole'`
   - `chances` is `{ crossing, pigeons, dog, neighbour }`.
   - Stacked in that order: `'crossing'` if `randomValue < crossing`;
     `'pigeons'` if `< crossing + pigeons`; `'dog'` if `< ... + dog`;
     `'neighbour'` if `< ... + neighbour`; otherwise `'pothole'`.
2. `obstacleTypeFor` is **removed**.
3. `obstacleIndexesNear(position, firstX, spacing, ahead, width)` → array
   - Every k >= 0 with `L - ahead < position <= L + width`, where
     `L = firstX + k * spacing`, in increasing order.
   - `[]` if `spacing <= 0`. Used for the warning icon (`ahead` =
     `HEARD_WARNING_DISTANCE`, `width` = `DOG_FENCE_WIDTH`).

All other functions in obstacles.js are unchanged.

### src/logic/threats.js (new)
4. `checkPigeons(index, speed, lastFlappedIndex, rules)` →
   `{ damage, lastFlappedIndex }`. `rules` is `{ damage, maxSafeSpeed }`.
   - `speed > maxSafeSpeed` and `index > lastFlappedIndex`:
     `{ damage, lastFlappedIndex: index }`.
   - Otherwise `{ damage: 0, lastFlappedIndex }`.
5. `checkDog(index, speed, lastBarkedIndex, rules)` →
   `{ damage, lastBarkedIndex }`. `rules` is `{ damage, minSafeSpeed }`.
   - `speed < minSafeSpeed` and `index > lastBarkedIndex`:
     `{ damage, lastBarkedIndex: index }`.
   - Otherwise `{ damage: 0, lastBarkedIndex }`.
6. `warningShown(indexes, kinds, lastBarkedIndex)` → boolean
   - `indexes` comes from `obstacleIndexesNear`; `kinds[i]` is the kind of
     `indexes[i]`.
   - True if some `indexes[i]` has `kinds[i] === 'dog'` and
     `indexes[i] > lastBarkedIndex`. Otherwise false (also for empty arrays).

### src/logic/chat.js (new) [P2]
7. `initialChat()` → `{ msLeft: 0 }`
8. `startChat(durationMs)` → `{ msLeft: durationMs }`
9. `isChatting(state)` → `state.msLeft > 0`
10. `updateChat(state, deltaMs, drainPerSec)` → `{ state, drain }`
    - Not chatting: `{ state: { msLeft: 0 }, drain: 0 }`.
    - Chatting: `used = min(deltaMs, msLeft)`;
      `state = { msLeft: max(0, msLeft - deltaMs) }`;
      `drain = drainPerSec * used / 1000`.
11. `neighbourStops(speed, minSafeSpeed)` → `speed < minSafeSpeed`
12. `streetSpeed(speed, chatState)` → 0 if `isChatting(chatState)`,
    otherwise `speed`.

The scene applies `drain` with the existing `applySleepDamage`.

## Acceptance criteria

[P1] = Part 1 (pigeons, dog, icon, mix). [P2] = Part 2 (neighbour). With Q1-A
everything is one build.

### Automated (tester, `npm test`)

1. [P1] `npm test` passes (exit code 0), including all earlier tests except
   those replaced in AC 2.
2. [P1] Old tests that change, and only these:
   - The `obstacleTypeFor` tests (potholes-and-curbs AC 4 and AC 5) are
     replaced by AC 3 and AC 4 below.
   - `CROSSING_CHANCE` is expected to be 0.25 (potholes-and-curbs AC 18,
     tuning-pass-w3 AC 2).
   - Every other old test is untouched and still passes, including the
     tuning-pass AC 5 spacing checks.
3. [P1] `obstacleKindFor` with `{ crossing: 0.25, pigeons: 0.15, dog: 0.15, neighbour: 0.15 }`:
   0 → `'crossing'`; 0.24 → `'crossing'`; 0.25 → `'pigeons'`;
   0.39 → `'pigeons'`; 0.41 → `'dog'`; 0.54 → `'dog'`; 0.56 → `'neighbour'`;
   0.69 → `'neighbour'`; 0.71 → `'pothole'`; 0.999 → `'pothole'`.
   With all four at 0: 0 → `'pothole'`. With `{ crossing: 0.25, pigeons: 0.15, dog: 0.15, neighbour: 0 }`:
   0.6 → `'pothole'` (Part 1 mix: no neighbours).
4. [P1] The mix, for seed 42 over k = 0–999, using
   `obstacleKindFor(obstacleRandom(42, k), chances)` with the AC 3 chances:
   crossing 180–320, pigeons 90–210, dog 90–210, neighbour 90–210, pothole
   220–380. For seeds 1, 42 and 123456789, all five kinds appear somewhere in
   k = 0–99.
5. [P1] `obstacleIndexesNear(position, 1200, 700, 1000, 240)`: 0 → `[]`;
   200 → `[]`; 201 → `[0]`; 901 → `[0, 1]`; 1440 → `[0, 1]`; 1441 → `[1]`;
   2141 → `[2]`. With spacing 0 → `[]`.
6. [P1] `checkPigeons` with `{ damage: 10, maxSafeSpeed: 70 }`:
   (0, 70, -1) → `{ damage: 0, lastFlappedIndex: -1 }`;
   (0, 120, -1) → `{ damage: 10, lastFlappedIndex: 0 }`;
   (0, 180, 0) → `{ damage: 0, lastFlappedIndex: 0 }`;
   (1, 180, 0) → `{ damage: 10, lastFlappedIndex: 1 }`.
7. [P1] `checkDog` with `{ damage: 25, minSafeSpeed: 180 }`:
   (0, 180, -1) → `{ damage: 0, lastBarkedIndex: -1 }`;
   (0, 120, -1) → `{ damage: 25, lastBarkedIndex: 0 }`;
   (0, 70, -1) → `{ damage: 25, lastBarkedIndex: 0 }`;
   (0, 120, 0) → `{ damage: 0, lastBarkedIndex: 0 }`;
   (2, 70, 0) → `{ damage: 25, lastBarkedIndex: 2 }`.
8. [P1] `warningShown`: (`[]`, `[]`, -1) → false; (`[3]`, `['dog']`, -1) →
   true; (`[3]`, `['dog']`, 3) → false; (`[3, 4]`, `['dog', 'pothole']`, 3) →
   false; (`[3, 4]`, `['pothole', 'dog']`, 3) → true; (`[5]`, `['pigeons']`,
   -1) → false.
9. [P1] Pigeon simulation. Obstacle 0 is pigeons; firstX 1200, spacing 700,
   wheelX 311, width 90, 16 ms frames. Each frame: `advanceScroll`, then
   `obstacleIndexesOverWheel` + `checkPigeons` with
   `{ damage: 10, maxSafeSpeed: 70 }`, using this frame's speed. Total damage:
   - slow the whole time → 0;
   - normal the whole time → 10 (once, never more);
   - brisk the whole time → 10;
   - slow until the wheel is 45 pixels into the flock, then normal → 10;
   - normal until 300 ms before the flock reaches the wheel, then slow → 0.
10. [P1] Dog simulation. Obstacle 0 is a dog; same setup with width 240 and
    `checkDog` with `{ damage: 25, minSafeSpeed: 180 }`. Total damage:
    - brisk the whole time → 0;
    - normal the whole time → 25 (once, never more);
    - slow the whole time → 25;
    - brisk until the wheel is 120 pixels along the fence, then normal → 25;
    - normal until 300 ms before the fence reaches the wheel, then brisk → 0.
11. [P1] Warning timing, using src/config.js: the icon rule shows a dog at
    k = 0 (firstX 1200) from wheel position 201 to 1440, and
    `HEARD_WARNING_DISTANCE > GAME_WIDTH - 311` (the icon comes before the
    fence is on screen).
12. [P1] Config sanity, using src/config.js:
    - `(OBSTACLE_SPACING - DOG_FENCE_WIDTH) / SPEED_BRISK >= 2` (at least 2 s
      after a fence before the next obstacle);
    - `OBSTACLE_SPACING > DOG_FENCE_WIDTH` and
      `OBSTACLE_SPACING > PIGEON_WIDTH`;
    - `(GAME_WIDTH - 311) / SPEED_BRISK >= 2` (pigeons and neighbour seen at
      least 2 s ahead, even at brisk);
    - `CROSSING_CHANCE + PIGEON_CHANCE + DOG_CHANCE + NEIGHBOUR_CHANCE <= 1`
      (potholes never below 0);
    - `PIGEON_MAX_SAFE_SPEED >= SPEED_SLOW` and
      `PIGEON_MAX_SAFE_SPEED < SPEED_NORMAL` (only slow is safe);
    - `DOG_MIN_SAFE_SPEED <= SPEED_BRISK` and
      `DOG_MIN_SAFE_SPEED > SPEED_NORMAL` (only brisk is safe).
13. [P1] `src/config.js` exports every name in the Changed, mix, noise damage,
    pigeons and dog tables with exactly the values listed (in Part 1,
    `NEIGHBOUR_CHANCE` is 0). All other earlier names and values are
    unchanged.
14. [P1] No file in `src/` mentions `obstacleTypeFor`. No file in
    `src/logic/` contains `Math.random` or the word "phaser" (any
    capitalisation).
15. [P2] Chat functions: `initialChat()` → `{ msLeft: 0 }`;
    `startChat(5000)` → `{ msLeft: 5000 }`; `isChatting({ msLeft: 1 })` →
    true; `isChatting({ msLeft: 0 })` → false;
    `updateChat({ msLeft: 5000 }, 16, 3)` → state `{ msLeft: 4984 }`, drain
    0.048 (within 0.000001); `updateChat({ msLeft: 10 }, 16, 3)` → state
    `{ msLeft: 0 }`, drain 0.03 (within 0.000001);
    `updateChat({ msLeft: 0 }, 16, 3)` → state `{ msLeft: 0 }`, drain 0.
    `updateChat` never changes the object passed in.
16. [P2] Chat length: from `startChat(5000)`, calling `updateChat(state, 16, 3)`
    until not chatting takes exactly 313 calls, and the drains add up to 15
    (within 0.001).
17. [P2] `neighbourStops(70, 180)` → true; `(120, 180)` → true;
    `(180, 180)` → false. `streetSpeed(120, { msLeft: 100 })` → 0;
    `streetSpeed(120, { msLeft: 0 })` → 120.
18. [P2] Neighbour simulation. Only obstacle 0 is a neighbour (any other
    index reached is ignored); firstX 1200, spacing 700, wheelX 311, sleep
    100, no refill, 16 ms frames. Each frame:
    speed = `streetSpeed(levelSpeed, chat)`; then `updateChat` and
    `applySleepDamage` with the drain; then `advanceScroll` with that speed;
    then `obstacleIndexesReachingWheel` and, if index 0 is reached and
    `neighbourStops(levelSpeed, 180)`, `startChat(5000)`. Run 1500 frames:
    - brisk: no chat ever starts, sleep stays 100, the scroll never stands
      still;
    - normal: exactly one chat; the scroll stands still for exactly 313
      frames in a row; sleep ends at 85 (within 0.01);
    - slow: the same as normal (one chat, 313 still frames, sleep 85).
19. [P2] `src/config.js` exports every name in the neighbour table with
    exactly the values listed, and `NEIGHBOUR_CHANCE` is 0.15.

### Manual (owner, on https://pinzzas.github.io/stroller/)

First check that the build label at the bottom right shows the new build. The
order of obstacles is random, so "next pigeons" means let other obstacles pass
(handle them as usual) until pigeons come. Before each step, Shush or wait
until the meter is at or near `Sleep 100`, so you can read the drop. A
pothole or crossing in between is fine.

On a computer browser:

20. [P1] **All kinds show up.** Within about 2 minutes you see potholes,
    crossings, pigeons (three small blue-grey boxes at the back of the
    pavement) and a wooden fence. In Part 2 you also see the green neighbour.
    They are easy to tell apart.
21. [P1] **Pigeons, done right.** Next pigeons: press Down to `Speed: slow`
    before they reach the stroller and stay slow. The pigeons stay put. No
    flash, no drop.
22. [P1] **Pigeons, done wrong.** Next pigeons: stay at normal. As the front
    wheel reaches them they rise up and fly off the top of the screen. Pink
    flash, the meter drops by 10.
23. [P1] **Pigeons, sped up halfway.** Next pigeons: go slow, then press Up
    while the front wheel is among them. They fly off: flash, drop by 10, once.
24. [P1] **Dog warning.** At normal speed, watch the top right. A soft amber
    box with `woof?` appears above the roofs at the right edge **before** any
    fence is visible. A few seconds later a wooden fence slides in.
25. [P1] **Dog, done right.** When `woof?` appears, press Up to
    `Speed: brisk` and stay brisk past the whole fence. No dog, no flash, no
    drop. `woof?` disappears once the stroller's front is past the end of the
    fence.
26. [P1] **Dog, done wrong.** Next `woof?`: stay at normal. While you pass the
    fence, a brown box pops up over it with `WOOF!` for about 1.5 s. Pink
    flash, the meter drops by 25, and `woof?` disappears at once.
27. [P1] **Dog, slowed halfway.** Next `woof?`: go brisk, then press Down
    while the front wheel is still along the fence. The dog barks: drop by 25,
    once.
28. [P1] **Restart.** Let the baby wake (or play until it does), press Enter
    or `Walk again`. The fresh walk shows no `woof?`, no dog and no flying
    pigeons from the last walk.
29. [P2] **Neighbour, done right.** Next neighbour: press Up to brisk before
    you reach them. You walk straight past. No bubble, no drop.
30. [P2] **Neighbour, done wrong.** Next neighbour: stay at normal. When the
    front wheel reaches them the street stops, a white bubble says
    `Ooh, is the baby asleep? So...`, and the meter goes down slowly (about
    3 a second). After about 5 seconds the bubble goes, the walk carries on,
    and the meter is 15 lower than when the chat started.
31. [P2] **During a chat.** Next chat: press S. `Shhh!` shows and the meter
    goes up by 10. Press Up once: the speed label changes, but the street
    stays still until the chat ends, then moves at the new speed.
32. [P2] **After a chat.** After the chat ends, the meter does not refill for
    about 5 seconds, then creeps up as usual.
33. [P2] **Waking during a chat.** Let the meter get low (under 15), then get
    stopped by a neighbour. The baby wakes during the chat: the bubble goes
    away and the usual end box appears.

On iPhone Safari (landscape), with the test buttons:

34. [P1] Tap `Slower` until `Speed: slow` for pigeons: they stay put. When
    `woof?` appears, tap `Faster` until `Speed: brisk` and pass the fence: no
    bark.
35. [P2] Tap `Faster` until `Speed: brisk` for the neighbour: you walk past.
    Get stopped once and tap `Shush` during the chat: it works as on the
    keyboard.

## Assumptions (owner, please correct if wrong)

- Q1 = B, Q2 = A, Q3 = A, Q4 = A (the recommended options).
- DESIGN.md says "small noise" for pigeons but gives no number. I used 10,
  the same as a small jolt. Noises get their own names (`SLEEP_NOISE_SMALL`,
  `SLEEP_NOISE_LOUD`) so that in W7 Suspension can lower jolts and Canopy can
  lower noises separately. Which noises Canopy covers is a W7 decision.
- "Slow drain while they talk" is 3 a second for 5 s (15 in total, between a
  pothole and a curb). No refill during the chat.
- The neighbour rule is a single moment (when the front wheel reaches them).
  Pigeons and dog are stretches you must stay slow or brisk along. Each rule
  uses speed only; Lift is never the answer for these three.
- A chat can't be cut short. Speeding up during a chat only takes effect
  when it ends.
- Stopping doesn't change the run time. `Asleep for` keeps counting, because
  DESIGN.md pays for time asleep, not distance.
- Until sounds arrive in W10, the `woof?` icon is the "warning cue before
  every heard threat". The dog's bark later gets a real sound.
- Pigeons and the neighbour stand at the back of the pavement and are drawn
  behind the stroller, so the stroller rolls in front of them (side view).
  Pigeons that stay calm just stay put; no waddling.
- After a dog fence or a pigeon flock, the next obstacle is at least 460
  pixels away, so there is always time to switch speed again. Two obstacles
  can still need opposite speeds back to back (for example a dog, then a
  crossing). That is intended: it is the "watch and listen" mix.
- All new obstacles are random, like before. There is still no fixed test
  street, so some manual steps may take a minute or two of waiting.
- The "do nothing" check from the tuning pass (wakes in about 30 s) may move a
  little (about 30–40 s) because chats stand still for 5 s.
- DESIGN.md needs no change for this spec. If you approve, I will only add
  "a small noise about 10" next to the existing damage line, so the number is
  written down.

## Out of scope

- The siren and "Shush right at the peak" (W5). The warning icon is built so
  it can be reused, but nothing for the siren is added.
- Sleep stages, the deep-sleep arc and obstacles coming more often (W5).
- Introducing obstacles one at a time in the first runs (W5). This week every
  kind can appear from the first obstacle.
- Sleep minutes and brisk earning more (W5).
- Canopy, Suspension or any upgrade (W7).
- Sounds (bark, flapping, chatter, warning cue) and juice such as wobble or
  pigeons waddling aside (W10). Real art (W8).
- The dog chasing you, more than one neighbour line, a neighbour you can talk
  your way out of, or pigeons that come back. Not in DESIGN.md; if wanted,
  add to "Maybe later" first.
- A fixed test street for repeatable manual tests (TODO.md note; not needed
  now).
