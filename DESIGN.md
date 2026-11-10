# Stroller Sleep Game — One-Page Design

Nov 9, 2026 · @Roxi Biribicchi

## Pitch

A cozy 2D side-scroller: push a sleeping baby through the neighbourhood and keep them asleep as long as you can.

- **Fantasy:** the slow, hopeful walk every parent knows, where every pothole and barking dog is a tiny crisis.
- **Tone:** warm, gentle and funny. Soft pastels, a lullaby soundtrack, small slapstick moments. Never stressful or mean.
- **Platform:** Steam (Windows), built in Phaser with Claude Code and packaged with Electron.
- **Session:** runs of 2–5 minutes; about 1–2 hours to max out every upgrade.
- **Title:** open. Working name until then: "Shhh!"

## Core loop

**Every wake-up pays for a longer next walk.**

1. **Start a walk**
2. **Handle threats** — using speed, lift and shush
3. **Baby wakes up**
4. **Earn sleep minutes**
5. **Buy upgrades** — then walk again and sleep longer (back to step 1)

Each run ends when the baby wakes. Sleep minutes buy upgrades, so the next walk lasts longer.

## Controls

Three verbs only. Every obstacle is solved with one of them.

| Verb | Input | What it does |
| --- | --- | --- |
| Speed | Up / Down arrows | Switch between slow, normal and brisk. Slow is safer; brisk earns more and outruns some threats. |
| Lift | Hold Space | Tilts the front wheels over a curb or pothole. Bad timing means a jolt. |
| Shush | S key | Instantly restores some sleep. Limited charges, then a cooldown. |

All numbers in this doc are starting values to tune in playtests.

## Sleep meter

The run ends when the meter hits zero. Each run builds from fragile to deep sleep.

- **Range:** 0–100, starting full. A soft cloud at the top of the screen shows it.
- **Damage:** a small jolt costs about 10, a small noise about 10, a loud noise about 25.
- **Recovery:** refills slowly when nothing happens, faster at slow speed.
- **Sleep stages:** every 60 seconds the baby sinks one stage (Light → Deep → Dreamy). Each stage cuts damage by 20%, but obstacles come more often. This gives every run a natural arc.
- **Feedback:** the baby's face and floating z's show the stage; a frown flashes on every hit.
- **Reward:** time asleep becomes "sleep minutes", the only currency. Distance doesn't count.

## Obstacles

Six obstacles, each with one clear right answer. Mix ones you see with ones you hear, so the player watches and listens.

| Obstacle | Seen or heard | Right answer | If you get it wrong |
| --- | --- | --- | --- |
| Pothole | Seen | Lift over it | Small jolt |
| Curb (street crossing) | Seen | The pavement ends at a curb, then a striped crossing, then a curb up. Slow down and lift at each curb | Big jolt at each curb you get wrong |
| Pigeons on the path | Seen | Slow down so they don't flap off | Small noise |
| Barking dog behind a fence | Heard (a bark icon warns you first) | Go brisk to pass before it notices | Loud noise |
| Chatty neighbour | Seen ahead | Go brisk past them | You stop; slow drain while they talk |
| Passing siren | Heard, getting louder | Shush right at the peak | Loud noise |

Introduce them one at a time in the first runs, so each one teaches a new rule.

## Upgrades

Six stroller upgrades, 3 levels each. Each one should change how you play, not just raise a number.

| Upgrade | What changes in play | Unlocks the feeling of… |
| --- | --- | --- |
| Suspension | Jolts cost less sleep | "I can risk brisk speed now" |
| Big wheels | Wider timing window for Lift | "Curbs don't scare me" |
| Canopy | Heard noises cost less | "Dogs and sirens are fine" |
| Pacifier pouch | More Shush charges, shorter cooldown | "I have a rescue button" |
| White-noise speaker | Faster sleep recovery | "I can bounce back from mistakes" |
| Cozy blanket | Reach Deep sleep sooner | "My runs get going faster" |

Cost curve to start with: 5 / 15 / 40 sleep minutes per level. A typical early run earns 2–4.

## Art and sound

Grey boxes until the game is fun, then a free asset pack. Sound carries the cozy feel more than art does.

- **Phase 1:** coloured rectangles only. If dodging isn't fun like this, art won't fix it.
- **Phase 2:** a free CC0 pack (e.g. Kenney) for the street, stroller and props. Soft pastel palette, 2–3 parallax layers.
- **The baby:** the one thing worth custom drawing. Three faces: asleep, stirring, awake.
- **Sound:** a lullaby loop, a gentle snore, and a warning cue before every heard threat. Use free CC0 sounds.
- **Juice:** a stroller wobble on jolts, z's that float faster in deep sleep, a tiny sigh after each Shush.

## Out of scope for v1

If it's not in this doc, it waits until after launch.

- More than one neighbourhood or level
- Story, cutscenes or dialogue
- Jumping, pits or any platforming
- Choosing parents, babies or strollers (cosmetics included)
- Online leaderboards, accounts or cloud saves (local high score and local save only)
- Mobile touch controls and app stores (plain on-screen test buttons exist for playtesting on a phone only; they are not a v1 feature and get hidden before launch)
- Custom art beyond the baby's faces

**Maybe later:** a second neighbourhood, touch controls, stroller colours, a Mac version on Steam (a Mac build exists from week 10 for testing only).
