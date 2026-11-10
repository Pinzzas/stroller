# Stroller Sleep Game — 12-Week Plan to Steam

Nov 9, 2026 · @Roxi Biribicchi

Ship on Steam in week 13 at about 6 hours a week, with a playable build every 3 weeks and the Coming Soon page live by week 9.

## Roadmap

**Launch in week 13, with the store page submitted in week 8 and live by week 9.**

| Phase | Weeks | Focus | Milestone at the end |
| --- | --- | --- | --- |
| Prototype | 1–3 | Grey-box fun | Fun check |
| Full run loop | 4–6 | All six obstacles | Playtest |
| Upgrades + page | 7–9 | Shop, save, art | — |
| Polish + launch | 10–13 | Sound, Electron build, trailer | Release W13 |

Steam track: Onboarding W1 → Fee + app W4 → Store page W8 → (Coming Soon page collects wishlists) → Build review W12 → **Release W13**.

Game work runs on top; Steam paperwork runs underneath so its fixed waiting times never block the launch.

## Weekly tasks

Each week is one or two Claude Code sessions. Tick a task only when you've played it and it works.

### Phase 1 · Weeks 1–3 · Prototype

- [x] W1: Set up the project (Phaser, published to GitHub Pages so you can play it in your browser). A grey box stroller walks on a scrolling street.
- [ ] W1: Start Steamworks onboarding (identity, tax, bank). It can take weeks, so start now.
- [x] W2: Speed control and Lift. The sleep meter appears and drops on hits.
- [x] W2: Pothole and curb obstacles.
- [ ] W3: Shush with cooldown. (spec approved, not built yet)
- [x] W3: The run ends at zero sleep; restart button.
- [ ] W3: **Gate:** play 10 runs. Is dodging fun with grey boxes? If not, fix it before moving on.

### Phase 2 · Weeks 4–6 · Full run loop

- [ ] W4: Pigeons, dog and neighbour, with warning icons for heard threats.
- [ ] W4: Pay the Steam fee and create the app. Brief a capsule artist.
- [ ] W5: Siren, sleep stages and the deep-sleep arc. Introduce obstacles one at a time.
- [ ] W5: Sleep minutes are earned and shown on the end screen.
- [ ] W6: **Gate:** 3–5 people play it cold while you watch silently. Write down where they get confused.

### Phase 3 · Weeks 7–9 · Upgrades and store page

- [ ] W7: Upgrade shop with all six upgrades and three levels each.
- [ ] W7: Local save (progress and high score).
- [ ] W8: Swap in the asset pack and the baby's three faces. Capture screenshots.
- [ ] W8: **Gate:** submit the store page; Coming Soon goes live once approved.
- [ ] W9: Balance the costs and sleep values from playtest notes. Line up 2–3 friends with Windows PCs to test in week 11.

### Phase 4 · Weeks 10–13 · Polish and launch

- [ ] W10: Sound: lullaby, snore, warning cues. Juice: wobble, z's, sighs.
- [ ] W10: Package with Electron. GitHub Actions builds a Windows zip (with an automatic launch check) and a Mac zip for your own testing. Add Steam integration.
- [ ] W11: Cut a 30–60 second gameplay trailer. Set the price.
- [ ] W11: Upload the Windows zip on the Steamworks website to a private test branch. Send free Steam keys to your Windows testers.
- [ ] W12: **Gate:** fix what the Windows testers found, then submit the build for review.
- [ ] W13: Release. Share the page in parent and cozy-game communities.

## Steam checklist

Steam's waiting times are fixed, so these start mid-project, not at the end.

| Item | When | Notes |
| --- | --- | --- |
| Steamworks onboarding | Week 1 | Identity, tax and bank checks. Use your legal name. |
| Steam Direct fee | Week 4 | $100 per game, recouped after $1,000 in revenue. Starts a 21–30 day wait before release (check your account). |
| Capsule art | Ordered week 4, done week 8 | Exact sizes required. Worth paying a pro: it decides clicks. |
| Store page review | Submit week 8 | Typically 3–5 business days; allow 7. Needs screenshots, description, content survey. |
| Coming Soon page | Live by week 9 | Must be public at least 2 weeks before release. Longer means more wishlists. |
| Trailer | Week 11 | Gameplay first, 30–60 seconds. |
| Build review | Submit week 12 | Allow 7 business days. |
| Release | Week 13 | Press "Release App" yourself; approval doesn't publish it. |

**No Windows PC needed.** GitHub builds the Windows and Mac zips in the cloud. You upload the Windows zip in your browser under Edit Steamworks Settings → SteamPipe → Web Uploads (works for zips under 2 GB). Windows testers with free Steam keys replace testing on your own PC. The Mac build is for your own testing only; a Mac version on Steam can come after launch.

Sources: [Steam Direct](https://partner.steamgames.com/steamdirect) · [Release process](https://partner.steamgames.com/doc/store/releasing) · [Release options](https://partner.steamgames.com/doc/store/types)

## Claude Code workflow

One feature per session, tested before the next one starts. This keeps the code from tangling.

**Setup (week 1, once)**

1. Create a project folder and put the design doc in it as `DESIGN.md`.
2. Ask Claude Code to write a `CLAUDE.md`: tech stack (Phaser, JavaScript), folder layout, and the rule "one feature at a time, keep it simple."
3. Use git from day one. Ask Claude to commit after every working feature, so you can always roll back.

**Every session**

1. Open with: "Read CLAUDE.md and DESIGN.md. Today we build: [one feature]."
2. Ask for a short plan first. Approve it, then let it build.
3. Play it yourself. Describe what feels wrong in plain words ("the lift feels too late").
4. When it works, commit. Note anything left over in a `TODO.md`.

**Using subagents**

- Use one for reviews: "Have a subagent review today's code for bugs and leftover clutter."
- Use one for research: "Have a subagent check how to package a Phaser game with Electron for Steam."
- Don't let several build features in parallel. With no coding background, one stream of changes is much easier to follow.

**Tuning values**

Ask Claude to put all numbers (damage, costs, timings) in one `config.js` file. Then you can balance the game yourself without touching code.

## Risks and fallbacks

If something slips, move the launch date. Don't cut the week 3 and week 6 gates.

| Risk | Early sign | Fallback |
| --- | --- | --- |
| Core dodging isn't fun | Week 3 gate fails | Spend weeks 4–5 on feel only; push everything else by 2 weeks |
| Missed weeks (travel, work, family) | Behind by more than 1 week | Launch in weeks 14–16 instead; the Coming Soon page just collects more wishlists |
| Steam onboarding or reviews are slow | No approval 7 days after submitting | Already buffered: submissions sit 1–2 weeks before they're needed |
| Electron packaging breaks | Test build fails in week 10 | Ask a subagent to debug in a fresh session; budget one spare weekend |
| Scope creep | New ideas mid-build | Add them to "Maybe later" in the design doc and keep building |
