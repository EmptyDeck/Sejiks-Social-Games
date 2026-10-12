# Spy Poll - design notes

Re-creation of the *mechanics* of a "guess the percentage, others bet higher/lower" party game with an original
spy-agency / pollster theme (field dossiers, rubber stamps), original wording and original questions (EN + KO).
Nothing from any commercial game's files, art, audio or questions is used.

## Rules implemented
* **Setup** (leader phone or laptop edits; others read-only): timers on/off (default on), family-friendly filter on/off
  (default on), who guesses first (random button or tap a name), Begin.
* **Round 1 and Round 2**: one turn per player in join order starting at the chosen first guesser. Groups bigger than 6:
  a round has only 6 turns and the rotation simply continues (`guesser = order[k % n]`), so nobody guesses twice before
  everybody has guessed once. Then the **Final round**, then the end ranking.
* **Turn**: GUESS (guesser sets a 0-100 slider; everybody else sees the question, who is guessing, a scanning scale) ->
  CALL (everyone else secretly taps HIGHER / LOWER; in round 2 with **5 or fewer players** also MUCH HIGHER / MUCH LOWER; a
  call locks on the first tap; a live "n of m locked in" row shows who has called, never what) -> REVEAL (staged by CSS delays:
  real marker slides in, verdict + guesser points, sharp calls, missed calls, standings). The leader/laptop taps Next; nothing
  auto-advances from the reveal.
* **Scoring**: guesser `3000 * (1 - diff/30)` (rounded to 10; 0 if diff > 30; exact = 3000). Callers: right direction = 1000.
  MUCH: right direction and |real - guess| > 15 = 2000 (exactly 15 = 0). Exact guess = every caller gets 0. real == guess makes
  Higher and Lower both wrong. No multipliers.
* **Final**: one question, 9 answers in a *shuffled* order (the data is sorted by percentage, so the order is never sent as is).
  Everyone toggles exactly 3 picks and locks them. Reveal runs 9th -> 1st; the true top 3 pay 4000 / 2000 / 1000 to whoever
  picked them. When everyone connected has locked, the reveal starts by itself; the leader's Next works any time and counts
  whatever is selected.
* **End**: ranking with competition ranks (co-winners on ties). Leader: "Another game" (back to setup, scores reset, options
  kept) or "Back to the lobby" (`room.to_lobby()`). "End the game" is available on every game screen behind an in-page two-step
  confirm (no native popups).

## Decisions marked [D] (unknown or chosen by us)
* [D] Timers (only if enabled): guess 45 s, call 20 s, final 60 s. Absolute deadline + total are in the view
  (`ctx.timer`); expiry is handled in `tick(now)` and never fires while nobody is connected.
  Guess timeout -> 50% flagged as a shrug (still scored); call timeout -> non-callers score 0; final timeout -> picks as selected.
* [D] Guesser points are linear (not stepped) down to 0 at 30 points off.
* [D] 6 turns per round for big groups; first guesser defaults to the first joined player.
* [D] MUCH buttons only in round 2 and only with <= 5 players.
* [D] Solo test mode (exactly one player): three labelled virtual agents (Agent Fennel / Moth / Quill) make random calls at
  the reveal. They are extra callers in the reveal only: never in `scores`, never in the ranking, no final-round bots (the solo
  player just picks). With one player there are no callers, so the call screen is skipped (never a dead screen).
* [D] Per-player ding/buzz after the staged reveal is sent from `tick` (`REVEAL_SFX_MS`), the screen change sound is `screenSfx`.
* [D] On the 30-player big screen the reveal shows the top 10 standings + "and N more"; the end screen shows everyone.
* The rulebook's "no timers" rule is waived for this game by the owner (Chameleon stays untimed).

## Hidden information
`view(None)` and other players' views never contain: the real percentage before the reveal screen, anyone's call
(only `called` = who locked in, and your own `mine`), anyone's final picks (only `locked` ids; your own `mine`), final
percentages/ranks before the final reveal. Guarded by tests.

## Files
* `game.py` - META, scoring helpers (`guess_points`, `call_points`), `Game` state machine
  (`setup, guess, call, reveal, final, finalreveal, end`).
* `questions.py` - loads `questions_1.py`, `questions_2.py`, `finals.py` by file path; exposes `QUESTIONS`, `FINALS`.
* `client.js`, `theme.css` - screens and look (Theme Brief at the top of the CSS).
* Tests: `tests/test_spy-poll.py` (rules with a fake room + a WebSocket flow), plus `tests/test_protocol.py spy-poll`.

## How to add questions
Append rows to `questions_1.py` / `questions_2.py` (or add `questions_3.py` and one line in `questions.py`):
`{"id": "q201", "text": {"en": "...", "ko": "..."}, "pct": 37, "family": True}` - the text describes a percentage of people,
<= 100 characters, `pct` a plausible whole number 5..95, `family: False` only for mildly cheeky items (never hateful, sexual
or mean about real groups). Finals go in `finals.py`: a prompt, exactly 9 answers with distinct percentages (the test checks
this), `family` flag. The tests check ids, length, both languages and distinct final percentages. Questions are drawn without
replacement per session and refill when exhausted.
