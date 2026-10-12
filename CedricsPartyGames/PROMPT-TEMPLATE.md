# Prompt template + gap analysis (for the owner)

## 1. Why this file exists
The owner tests agents "zero-shot": give a concept, see what comes back, compare with what he actually wanted, and turn the gap into rules. This file records the gaps found so far and gives a **prompt to paste when asking for a new game**. The rules themselves live in [RULEBOOK.md](RULEBOOK.md) (§4.0 is the important part).

## 2. Gap analysis: Chameleon v1 (zero-shot) vs what the owner wanted
| # | What the agent built | What the owner wanted | Root cause (what an agent doesn't know) | Rule now |
|---|---|---|---|---|
| 1 | Rounds (min(players,5)) | **No rounds** — endless, "next word" whenever | Agents copy Jackbox's round structure | §4.0.1 |
| 2 | Timers on every phase | **No timers, ever** (sofa, take our time) | Agents assume pressure = fun | §4.0.1 |
| 3 | Typed one-word clues on phones | Players **talk out loud** in turn; phones are for info/controls | Agents turn every mechanic into a UI action | §4.0.3 |
| 4 | Secret shown only to insiders; chameleon's phone looks different | **Everyone sees the whole word grid** so the chameleon isn't the only one staring at the phone | Agents don't simulate the physical room / social tells | §4.0.2 |
| 5 | Points per round, rankings | No scoring needed | Agents add scoring by default | §4.1 |
| 6 | First joiner = VIP who starts | A **leader**: "Are you Cedric?" → PIN → leader controls | Agents invent their own admin model | §4.0.4, §10 |
| 7 | Leader had no pre-game options | Leader sets: **number of chameleons (default 1)**, **voting on/off**, **categories**, and a **random "who goes first"** button | Agents don't think of the host's preparation step | §4.0.5–6, §5.15 |
| 8 | Vote mandatory | Voting is optional ("vote or just play") | — | §4.0.6 |
| 9 | Max/min players, 3-8 | **No min or max**, solo testing must work | Agents add "sensible" limits | §4 Player count |
| 10 | Browser `confirm()`, scrolling big screen | Own dialogs, never scroll | Agents default to browser UI | §6.5 |
| 11 | Laptop launcher to pick the game; Start / options / next buttons on the big screen | **Everything except scanning the QR is done on the phone** (admin picks the game, voting on/off, options, start, next) — the laptop is only a display | Agents copy Jackbox's "host screen = control screen" | §4.0.4 |

**Meta-lesson:** the biggest misses were not coding errors but *missing reasoning about real people in a real room*. Before building, an agent must write a short **"Real-world walkthrough"**: 5 people on a sofa, one phone each, one laptop — what does each person see, say, tap, and what can the others observe? (See the prompt below.)

## 3. Prompt to paste for a new game
```
Read /Users/owo/HOUSE/Github Project/Sejiks-Social-Games/CedricsPartyGames/RULEBOOK.md completely (especially §4.0 "Think about the real room"),
then the reference library in CedricsPartyGames/reference/ when choosing theme/sounds/icons.

Build a new game for Cedric's Party Games.

GAME: <name>
HOW IT'S PLAYED IN REAL LIFE (paper/physical version, who talks, who holds what): <describe, attach PPT/PDF if any>
THEME / WORLD: <e.g. old money, hackers, 80s arcade — or "you choose, then tell me why">
SPECIAL WISHES: <anything the owner already knows, e.g. "everyone should see X", "host can pick Y">

Before writing code, reply with a SHORT plan in Korean containing:
 1. Real-world walkthrough (5 people on a sofa + laptop: what each person sees/says/taps; what others can observe; any social tells and how you remove them).
 2. Admin options screen — on the ADMIN'S PHONE (what the admin chooses before play; defaults). Confirm no control lives on the laptop.
 3. Which parts are spoken aloud vs on the phones.
 4. Assumptions you are making. Mark the 3 riskiest.
Then build it following the rulebook (no timers, no rounds, no min/max players, no browser popups, big screen never scrolls, EN base + KO switch, works alone for testing).
Run tests/test_protocol.py, your own flow test, and ONE screenshot run (tests/shots.py --drive …) — one Chrome at a time, don't run browsers in parallel.
Prove it: run `python3 tests/acceptance.py` (extend it with checks for YOUR game's rules first) and paste the log in your report — no log, not done.
Finish with the report in RULEBOOK §12 (Korean) and list your assumptions in games/<id>/DESIGN-NOTES.md.
```
