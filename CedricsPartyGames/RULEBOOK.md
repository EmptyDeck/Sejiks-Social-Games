# Cedric's Party Games — Rulebook

> **Read this whole file before you write a single line.** It is written for an agent with zero memory
> of this project. If you follow it, the game you build will feel like it belongs with the others.
> If something here is wrong or missing, fix this file as part of your task (see §13).

Owner's goal: *a growing collection of party games for friends, in the spirit of the Jackbox Party
Packs.* One person starts the server on a laptop; everyone else joins from their phone with a 4-letter
code. Games will be added one at a time over years, by different agents. **Consistency of quality is
the whole point of this book.**

---

## 0. TL;DR checklist (details in the sections that follow)

1. Write a **Theme Brief** (§7.1) before code. A game without a theme is not finished.
2. Create `games/<your-id>/` and copy only `game.py`, `client.js`, `theme.css` from `games/gilded-takes` (never `__pycache__`), then rewrite **everything** including content. Folder name == `META["id"]` (kebab-case).
3. Four files: `game.py` (rules), `client.js` (screens), `theme.css` (look), plus content inside `game.py` (or `content.py`).
4. **Phone-first.** Every phone shows everything needed to play. The big screen is a bonus, never a requirement.
5. **Never a dead moment.** Every player always has something to do, read, or watch. No silent waiting >10s.
6. **Every action has a sound; every screen change has a sound.** Funny > realistic.
7. **English is the base language, Korean is switchable at any time.** Every visible string exists in both.
8. The server sends **data, never prose**. User-visible text is a `{en, ko}` object or a string key.
9. Don't touch `core/` or `server/` for one game's needs. Need something general? Extend it generically, document it, add a test (§13).
10. Done = `python3 tests/test_protocol.py <id>` passes **and** `python3 tests/shots.py <id>` shows no errors **and** you looked at the screenshots **and** the checklist in §11 is ticked.

---

## 1. What makes a Jackbox-style game good (the benchmark) → our rules

| Jackbox does this | So we do this |
|---|---|
| Join with a short room code; one person leads and starts the game | 4-letter code + QR. The **leader** is the phone that answers "Are you Cedric?" with the PIN (§4.0, §10). Already built in `core/` — don't reinvent. |
| **Before the game starts you already have something to do** (type a name, pick/draw an icon) | The lobby has name, icon picker and a "tap for noise" button that plays sounds on the big screen. Games may add *more* lobby fun via theme (§7). |
| Every game has a strong, singular **theme** — fonts, colours, animation, words, sounds all agree | §7. One game = one theme. Never mix. |
| Constant sound: joins, taps, reveals, silly noises | §8. Use `room.sfx(...)` server side, `data-sfx` / `screenSfx` client side. |
| Everyone plays **at the same time**; the host doesn't read walls of text | **No timers and no fixed round counts (owner rule, §4.0)** — the leader paces the game. Prompts ≤ ~100 characters. No player waits for another player to finish a long turn. |
| Humour beats fairness. Reveals are theatrical | Pace the reveal: staggered appearance, drumroll → reveal sound, scores that tick up. A joke answer should score fine. |
| The big screen is a shared stage; phones are private controllers | Private info only in that player's `view()`. Big screen = public info + drama. |
| Phones survive sleep / bad Wi-Fi | State lives on the server; the client is a pure function of the last `view`. Reconnect is automatic. Never store game state in the browser. |
| It works for strangers and for family | No setup, no accounts, big tap targets, instructions in one short line per screen. |

Owner's note: *"A lot of times it will NOT be focused on a TV."* Players may be huddled around one
laptop or not looking at the big screen at all. Hence **phone-first** (rule 4). Test every game by
reading only the phone screens: can you play it?

---

**Reference library:** [`reference/`](reference/README.md) holds lookup material — Jackbox benchmark numbers (content scale, avatar rosters), the sound dictionary (which sound for which moment, wish-list, how to drop in recordings), 24-icon avatar packs per theme, and a theme library with paste-ready CSS variables. Consult it when filling the Theme Brief; add to it when you invent something reusable.

---

## 2. Project layout

```
CedricsPartyGames/
  RULEBOOK.md            ← this file
  README.md              ← how the owner runs it (don't put rules here)
  start.command          ← double-click: server + internet link (Tailscale Funnel) + opens the big screen
  server/server.py       ← rooms, players, lobby, WebSocket, static files.  SHARED. Python stdlib only.
  core/                  ← SHARED client: index.html, app.js (render loop, lobby, i18n), base.css, sfx.js, vendor/
  games/<id>/            ← ONE game. Everything you write goes here:
      game.py              META + class Game (server-side rules, content, scoring)   — PRIVATE, never sent to browsers
      client.js            Party.game({...}) screens for phone + big screen
      theme.css            the look. Every selector scoped to body[data-game="<id>"]
      assets/              optional images/fonts  (served)      sounds/  optional mp3 overrides (served)
  sounds/                ← optional mp3 overrides for ALL games (gitignored by default; see sounds/README.md)
  reference/             ← lookup library: Jackbox benchmark, sound/icon dictionaries, theme library (read-only for games)
  tests/                 ← test_protocol.py (logic), shots.py (looks, JS errors), wsclient.py
```

* The server only serves `client.js`, `theme.css`, `assets/`, `sounds/` from a game folder. Anything else
  (`game.py`, `data/`, `*.json`) is private — put answer keys, secrets, hidden roles there.
* Folders starting with `_` or `.` inside `games/` are ignored by the launcher (use `_wip-name` while drafting).
* **Other projects in the parent repo (SIGNAL, LiarHunt, Rating, …) are unrelated.** You may read them for ideas; never import from them or edit them.
* Python: standard library only (no pip). JS: vanilla, no build step, no frameworks, no CDN scripts (fonts from Google Fonts are OK).

---

## 3. How to build a new game (the procedure)

1. **Concept** — one sentence: *"Players X, to get Y, while Z."* Decide min/max players (no minimum, no maximum; it must work alone), round
   length, scoring. If the owner gave you a concept, restate it with these decisions before building.
2. **Theme Brief** (§7.1) — fill in the whole template. Keep it at the top of your `theme.css` as a comment.
3. Create `games/<id>/` from the three reference files (no `__pycache__`); edit `META` (id, bilingual title/tagline, emoji, min/max players, launcher colours).
4. **`game.py`** — phases, options, content (§5). Keep rules in one small state machine: a `screen` name; the leader (and the laptop) advance it with `on_action`/`on_host_action`. **No deadlines, no timers.**
5. **`client.js`** — one `host()` and one `player()` function that switch on `g.screen` (§6).
6. **`theme.css`** — start from the brief (§7).
7. **Strings** — `strings.en` and `strings.ko`, both complete (§9). Content (prompts/questions) as `{en, ko}` objects.
8. **Sounds** — pick a `voice`, `lobbySounds`, `screenSfx`, plus `room.sfx()` for server-side moments (§8).
9. **Test** — `python3 tests/test_protocol.py <id>` (extend the test for your game's flow if it is not the Gilded Takes flow — copy the file to `tests/test_<id>.py`), then `python3 tests/shots.py <id> --times 2 8 20` and **open the PNGs** in `/tmp/party-shots/`. Also run once with `--lang ko`.
10. **Polish pass** against §11. Then write the final report (§12).

You can iterate without restarting the server: `game.py` is re-read every time a room is created / a game is started; `client.js` and `theme.css` on every page load. Run the server with `python3 server/server.py` (port 3100) and open `http://localhost:3100/host`.

---

**Tests:** `tests/harness.py` gives you `Server.run(main)`, `start_game(port, id, n)` and `wait(ws, screen, rnd)` so a flow test is ~40 lines (copy `tests/test_chameleon.py`; run it as `python3 tests/test_<id>.py`). A flow test must exercise **scoring deterministically** (don't rely on lucky picks), out-of-phase/malformed actions, and that secrets never reach `view(None)`. If several agents work at once, always pass `--out /tmp/shots-<id>` to `shots.py`. Mid-round reconnect: close a phone's socket, `join` again with its `token`, check it gets the same view (the view is a pure function of server state).

**Testing a whole game flow with screenshots:** `python3 tests/shots.py <id> --drive tests/drive_<id>.py --out /tmp/<id>` runs `async def drive(ctx)` after Start: `ctx.host` / `ctx.phone` are real Chrome tabs (`await tab.js("…")`, `await tab.press(sel)` / `release()` to hold, `await ctx.snap("name")`), `--no-start` keeps the lobby (see `tests/drive_back.py`), `ctx.fakes` are scripted WebSocket players with `.pid` (they `send({"t":"act","a":{…}})`; read their private views with `await f.until(...)`). The real phone (first player) is automatically made the PIN leader. See `tests/drive_chameleon.py` and `tests/test_chameleon.py` (pure protocol test of the whole flow incl. leak checks).

---

## 4. Game-design rules (what to put on screen and when)

### 4.0 Think about the real room (owner feedback on the first Chameleon — the most important rules in this book)
The owner's friends sit together on a sofa, talk out loud, and take as long as they like. An agent that only reads the rules will build something that is technically right and wrong in a real living room. So:
> **Waiver, `spy-poll` only (owner decision, see §13):** this one game HAS timers (on/off in its setup, default on) and fixed rounds, and its laptop big screen carries the same leader controls (`data-host-send`) as the leader's phone. Everything else in this book (leader PIN, setup screen, no scroll on the big screen, no native popups, EN+KO) still applies to it. Every other game keeps the rules below.

1. **No timers, no rounds** (except `spy-poll`). Never add countdowns or "round X of Y" unless the owner explicitly asks. The leader decides when to move on and whether to play another one.
2. **Design out social tells.** Ask: *"What will the other players physically SEE each person doing?"* In a hidden-role game, if only the traitor needs the phone, the traitor is the one who keeps staring at it. So: every player's phone shows the **same content** (e.g. the whole word grid for everyone), reveals secrets the **same way** (hold-to-reveal for everyone), and gives everyone a **reason to look at it**. Check every screen for any behaviour that differs by role (time spent, taps needed, what's shown/dimmed). Hidden info must live only in the player's own `view()`.
3. **Respect what's said out loud.** If the game is played by talking (describing, bluffing, accusing), keep it that way: phones carry the *information and the controls*, not the conversation. Don't replace speech with typing unless the concept is a typing game.
4. **Everything is done on the phones — the laptop is only a display (owner rule, he was furious when this was wrong).** The only thing anyone does with the laptop is scan its QR code: it opens `/host`, **auto-creates a room** and shows code + QR + players + (later) the game's big-screen view. **No buttons on the laptop** (except `spy-poll`, §13): not "pick a game", not "start", not options, not next/reveal. The **admin** (= leader) is the phone that answered "Are you Cedric?" with the PIN (§10); the admin **picks the game**, **starts** it, sets the **options**, runs **next/reveal/end/back to lobby** — all on their phone. Everyone else just plays. Never build admin controls into `host()` screens (`data-host-send` / `on_host_action` are deprecated and unused).
5. **Options before play.** The admin chooses options on a `setup` screen: usually number of hidden roles (default 1), voting on/off ("play with phone voting" or "just talk and reveal"), content categories, and — when someone must speak first — a **"pick who goes first at random"** button plus tap-a-name to set it manually (rock-paper-scissors in person is also fine).
6. **Voting is an option, not a given.** When a game has an accusation/vote, let the leader switch it off.

### 4.1 General

**Flow of a session:** the laptop opens `/host` and shows a QR → friends scan it → lobby (join, name, icon, noise; one phone proves it is Cedric with the PIN and becomes the admin) → **the admin picks the game on their phone** → admin starts → your `setup` screen → game → "next" as often as they like → back to the lobby. You only build the *game* part; everything before it exists.

**Rules of thumb**
* **Simultaneous play.** At every moment ideally *all* players have an input or a decision. Turn-based (one active player) is allowed only for ≤ 15 s turns and the others must have a role (guess, react, vote, heckle).
* **No timers, no fixed rounds (owner rule; `spy-poll` is the one waived game).** Nothing counts down; nothing ends because time ran out. A phase ends when everyone has acted *or* when the leader presses the next button (always offer that button, so a sleeping phone can't stall the game). "Another one?" is the leader's call, not a round counter. Only add a timer if the owner explicitly asks for one for that game. (`ctx.timer`/`deadline` still exist in core but are off by default.)
* **Minimal reading.** One short instruction per screen, in the player's language, at the top. Prefer icons/emoji + a few words.
* **Voting is anonymous until the reveal;** you can't vote for yourself (enforce on the server).
* **Reveal with drama:** stagger entries (`.stagger`), play a build-up sound, then the result sound, show points as `+N`, then the updated ranking.
* **Scoring:** optional. Many sofa games don't need points (Chameleon has none). If you do score, keep it simple and let the leader end the game when they feel like it. Reward fun, not only correctness. Add a gentle comeback mechanic if a leader can run away.
* **Content volume:** a game needs enough content to not repeat for several sessions (≥ 2× what a long session uses; ≥ 40 items is a good target for prompt/question games). Content is bilingual. Draw without replacement within a session (`random.sample`).
* **Tone:** teasing, silly, never mean about real people or sensitive topics. Friends playing together.
* **Edge cases you must handle:** a player disconnects mid-game (game continues; they can rejoin and get the same player id); fewer players than expected submit; empty/whitespace input; double taps; a player sending an action out of phase (ignore it silently).
* **Length:** open-ended (see 4.0). Offer an instant "next one" and an easy way to stop; don't pad.
* **Content is translated by meaning** and must not overlap across categories (a "Karaoke night" → "회식" mistranslation slipped through once). Accept synonyms when answers are matched as text.
* **Player count — owner rule: NO minimum and NO maximum.** The owner often tests alone, so the Start button works with **one** named player and the server accepts any number. Don't set `min_players`/`max_players` in `META`. A game must therefore degrade gracefully when alone or with 2 players: skip phases that need other people (e.g. nothing to vote on → go straight to the result), or add a clearly-labelled solo test mode (see `chameleon`: round 1 you are the chameleon and are auto-caught so you can try the guess screen; round 2 you are an insider). Never show an error like "not enough players". Design for crowds: 3 players and 30 players must both work (lists scroll on phones, the big screen auto-shrinks to fit, avatars repeat after 24, scoring/rounds must not assume ≤ 8, e.g. cap *rounds* not *players*).
* **Late joiners:** by default the server rejects joins once the game started (`late_join: False`). Only set `META["late_join"] = True` if you also implement `Game.on_join(player)`.

---

## 5. Server API — `game.py`

```python
META = {
  "id": "my-game",                                  # == folder name, kebab-case
  "title":   {"en": "My Game", "ko": "내 게임"},
  "tagline": {"en": "One short line.", "ko": "한 줄 소개."},
  "emoji": "🎲",                              # no min/max players (owner rule, §4)
  "theme": {"bg": "#101820", "accent": "#ffcc00"},  # colours of the launcher card
  # optional: "late_join": True
}

class Game:
    def __init__(self, room): ...          # room is the Room below. Do NOT send messages here.
    def start(self): ...                   # called once, right after the leader (or the laptop) presses Start
    def on_action(self, player, a): ...    # a = dict from the phone (§6): always validate!
    def view(self, player): ...            # → JSON-able dict. player is None for the big screen. PURE: no side effects.
    # optional
    def tick(self, now): ...               # ~4×/s. Return True if the view changed (then everyone gets a fresh view)
    def on_host_action(self, a): ...       # big-screen buttons: <button data-host-send="skip">
    def on_join(self, player): ...         # only with META["late_join"]
    def on_leave(self, player): ...        # a phone disconnected (it may come back)
```

**`room`** (what you may use): `room.players` (dict id→Player, join order) · `room.is_leader(player_or_id)` (True for a phone that entered the PIN — **use it for every leader-only action**) · `room.active_players()` (list) · `room.connected_players()` · `room.now()` (ms epoch) · `room.sfx(name, to=None)` (play a sound on all screens, or only for one player) · `room.to_lobby()` (end the game, back to lobby) · `room.code`.
`room.connected_players()` · `room.now()` (ms epoch) · `room.sfx(name, to=None)` (play a sound on all screens, or
only for one player) · `room.to_lobby()` (end the game, back to lobby) · `room.code`.
**`player`**: `.id` (public, e.g. `"p3"`), `.name`, `.avatar` (int 0–23), `.color` (int 0–11), `.connected`.

**Hard rules**
1. **State machine, not scripts.** Keep `self.screen` (string). Phases change in `on_action`/`on_host_action` (leader moves things on); `tick(now)` exists but you normally don't need it — **no timers**. No `sleep`, no threads, no asyncio in game code.
2. **`view()` is the only thing browsers see.** Never put hidden info in a view that the viewer must not see (other players' answers before reveal, roles, answer keys). `view(None)` is the big screen — everyone in the room can read it, so *hidden info goes only into a player's own view*.
3. **No prose in views.** Send ids/numbers/keys. Content that is text for humans is a `{"en": ..., "ko": ...}` dict (client renders with `ctx.L()`), except what players typed themselves (send as typed).
4. **No time pressure.** Don't put deadlines in views. (If the owner ever asks for a timed game: put the absolute deadline and total in the view and use `ctx.timer(deadline, total)`; never send per-second ticks.)
5. **Return `True` from `tick()` only when something changed**, otherwise you spam every phone.
6. **Never trust the client.** Validate `a["type"]`, types, ranges, lengths, "is it this player's turn / phase / allowed?". Truncate text (names ≤ 14, answers ≤ ~80–140).
7. `view()` must always include `"screen"`. Include `"round"` if the same screen type repeats (it changes the screen key; see §6.4).
8. A crash in your code never kills the server: the traceback is printed to the server console and shown as a red banner on the big screen. Read it, fix it, create a new room.
9. Per-player secrets live in Python dicts keyed by `player.id`, not on the player objects.
10. **Timing facts:** `tick()` runs every 250 ms, so phase changes made there reach phones up to ~250 ms late plus network. `room.now()` inside `on_action` is the server arrival time; never trust client timestamps. For fairness in timing games measure from the moment you *broadcast* the change (set your `go_at` in `tick`), and use `data-on="down"` (§6.2) so taps register on touch-down.
11. **Validate types, don't coerce:** a text field must be `isinstance(v, str)`; never `str(v)` client input (`null` becomes `"None"`). Check `isinstance` before using a value as an index/dict key. Ids are strings like `"p3"`; JSON turns int dict keys into strings, so key by `str(i)`.
12. **Auto-advance** counts only *connected* players and never fires when nobody is connected. A phone that sleeps must not stall the game: the admin always has a "next" button on their phone that moves on regardless. Disconnected players keep their place and can rejoin. Snapshot `room.active_players()` ids in `start()`; ignore unnamed players.
13. **Admin-only actions** (start/next/reveal/end/again/options) must check `room.is_leader(player)` and are rendered **only on the admin's phone** (`ctx.isLeader`) — never on the big screen. See `chameleon` (`lead()` helper). The big-screen `host()` view is read-only.
14. **Multi-file games:** `game.py` is loaded by file path, so a relative import (`from .words import X`) fails. Load siblings like this (see `games/chameleon/game.py`): `spec = importlib.util.spec_from_file_location("x", Path(__file__).with_name("words.py"))`. Big content (word banks, question lists) belongs in such a private sibling file.
15. **Game options:** there is no core "lobby settings" API. First game screen = a `setup` screen where only the admin (on their phone) edits the options (e.g. categories, number of chameleons, vote on/off) and presses Begin; everyone else sees them read-only (see `chameleon`). Typical options to offer: how many hidden roles, voting on/off, content categories, who starts first (random picker).

---

## 6. Client API — `client.js`

```js
Party.game({
  id: 'my-game',
  voice: 'classy',                          // cartoon | classy | retro | digital  (§8)
  avatars: ['🎩', ... 24 emoji ...],        // optional; exactly 24 themed icons for the lobby picker
  lobbySounds: ['ding', 'pop'],             // what "tap for noise" cycles through
  screenSfx: { write: 'whoosh', vote: 'drumroll', reveal: 'reveal', final: 'fanfare' },   // played when g.screen changes
  strings: { en: { ... }, ko: { ... } },    // §9
  player(g, ctx) { return '<div class="screen">…</div>'; },   // g = the Game.view(player) dict
  host(g, ctx)   { return '<div class="screen center">…</div>'; },
});
```
Both functions are **pure**: return an HTML string. The core re-renders on every new view. No state, no timers, no `fetch`, no `setInterval` in your code.

### 6.1 `ctx` helpers
`ctx.T(key, params)` string in current language · `ctx.L(obj)` pick language from `{en,ko}` · `ctx.esc(text)` **escape every player-typed string** · `ctx.players` (list of `{id,name,avatar,color,connected,leader}`) · `ctx.me` · `ctx.name(id)` · `ctx.avatar(id, 'xl')` avatar bubble · `ctx.chip(id)` avatar + name · `ctx.timer(deadline, total)` countdown number + bar · `ctx.isHost` (`ctx.me` is `null` on the big screen; `ctx.isLeader` / `ctx.leader` tell who may lead) · `ctx.now()` (`ctx.timer` shows 0 after its deadline) · `ctx.sfx(name)` (don't call from render; use for event handlers only).

### 6.2 Making things clickable (no JS needed)
```html
<button class="btn" data-send="vote" data-i="2">…</button>             → game.on_action(player, {"type":"vote","i":2})
<button class="btn" data-send="answer" data-from="ans">Submit</button>  → {"type":"answer","value": <value of #ans>}
<button class="btn" data-host-send="skip">Skip</button>                 → game.on_host_action({"type":"skip"})
```
Extra `data-*` attributes become action fields (numeric-looking strings become numbers, so never use numeric ids). `data-send` fires on **click** (finger release); add `data-on="down"` to fire on pointer-down (reaction games). `data-sfx` plays instantly on the device even if the server ignores the action. `data-once` only disables the button locally — enforce on the server too. `data-sfx="pop"` overrides the tap sound. `data-once` disables the button after the first click.

### 6.3 Inputs
* Give every `<input>/<textarea>` an **`id`**. The core preserves its value, focus and caret across re-renders *within the same screen* — without an id, typing is wiped whenever any player acts. Use `maxlength`.
* Text you render from a view must be escaped (`ctx.esc`) — players can type `<script>`.

### 6.4 Screen keys and re-renders
The core compares HTML and only touches the DOM when it changed. Entrance animations (`.enter`, `.stagger`) play **only when the screen key changes** (`g.screen` + `g.round` + optional `g.key`), never on a live update. If the same screen reappears with new content (round 2 of "write"), make sure `round` or `key` changes so inputs reset and animations replay.

### 6.4b Hold-to-reveal secrets (phones next to each other)
Players often sit shoulder to shoulder, so never leave a secret (role, word) permanently on screen. Pattern from `chameleon`: a `<button class="peek">` whose secret content is `display:none` and becomes visible with CSS `.peek:active .peek-body { display:flex }` (hold to see). The core registers a no-op `touchstart` listener so iOS honours `:active`. A view refresh during a hold re-renders and ends the hold — acceptable. The secret must exist **only** in that player's `view()`, never in `view(None)`.

### 6.4c Full-screen layers
For a full-bleed colour state or a full-screen tap target: put `<div class="fullbleed" style="background:…">` as a sibling **before** `.screen` (never inside an `.enter` element — transforms break `position:fixed`) and `<button class="tapzone" data-send="tap" data-on="down">` for the tap area (z-index 3; the corner buttons are z-index 20). `#screen` is `position:relative; z-index:2`, so `body::before/::after` are free for your decoration.

### 6.5 Layout rules
* **The big screen NEVER scrolls — owner rule (he doesn't want to touch the laptop).** `body.host` is locked to the window (`overflow:hidden`, `100dvh`) and the core's `fitHost()` shrinks the whole screen's font until the content fits, at any window size and any number of players. So: size things in `em`/`%`/`vw`/`vh` (not fixed px heights), use wrapping flex/grid (see `.terrarium`, `.cluelist`), keep screens compact (two columns for result + ranking), and never add your own scroll containers or `overflow:auto` on the host. `shots.py` fails with "host SCROLLS in …" if any big-screen frame still overflows — test with `--players 12` (or 30) and `--size 1366x768`. Phones may scroll. Phones may scroll, but keep the primary action visible.
* Phones: portrait, one column, tap targets ≥ 48 px (use `.btn`), no horizontal scroll. Use `.screen` as the root (it handles padding below the corner buttons). The top-right/left corner has the language, sound, menu buttons and room code — don't draw there.
* Big screen: readable from 3 m. Large type, ≤ 7 lines of text, never a wall of text. `body.host` already scales fonts with `clamp()`.
* **NEVER use the browser's `alert()`, `confirm()`, `prompt()` or any native popup — owner rule, he finds them ugly.** Use the themed dialog `Party.ask(message, okLabel) → Promise<boolean>` (it lives in the core and picks up your theme variables) or an in-page panel built from your own HTML. Don't use pointer-lock; don't rely on hover.

---

## 7. Theme rules (the soul of the project)

Each game has **one** theme and commits to it everywhere: colours, fonts, shapes, motion, copywriting, avatar icons, sound character. Mixing = failure. Examples of what "committed" looks like:

| Theme | Palette | Type | Shapes & motion | Voice (sound) | Copy tone |
|---|---|---|---|---|---|
| **Old Money** (`gilded-takes`) | navy + gold + burgundy | Playfair Display / Cormorant, uppercase buttons with wide tracking | square corners (4px), hairline gold frame, slow 0.8 s "rise" fades, no bounce | `classy` (soft sines, longer decay), chimes | "Another round, darling?" |
| **Hackers** | black + phosphor green + amber | monospace (VT323 / IBM Plex Mono) | no radius, scanlines, terminal typing reveal, glitch shake | `digital` (bit-crushed squares) | `> ACCESS GRANTED`, jargon |
| **80s Arcade** | deep purple, hot pink, cyan | Press Start 2P / Orbitron | neon glows, grid horizon, hard snappy 0.15 s steps | `retro` (square chips) | "INSERT COIN", "HI-SCORE" |
| **Cartoon Party** (default look of `core/base.css`) | bright purple + yellow | Baloo 2 / Nunito | very round, bouncy overshoot easing | `cartoon` (honks, boings, toots) | exclamation marks! |

### 7.1 Theme Brief (fill in; keep as a comment at the top of `theme.css`)
```
Theme name:           Era/vibe in 6 words:
Palette (6 colours):  bg, bg2, fg, accent, accent2, + the 12 player colours --pc0..--pc11
Fonts:                display + body (Google Fonts, with a Korean-capable fallback: 'Noto Sans KR' / 'Noto Serif KR')
Shapes:               --radius, borders, shadows, background texture (CSS gradients/SVG, no stock photos)
Motion:               --ease, --dur, --anim-in (your own @keyframes), what *moves* on reveal
Sound voice:          cartoon | classy | retro | digital   + lobbySounds + screenSfx map
Avatars:              24 emoji that fit the world
Copy tone:            3 sample lines (en + ko)
```

### 7.2 How to implement
* Override **CSS variables** from `core/base.css` inside `body[data-game="<id>"] { … }` (see `gilded-takes/theme.css`): `--bg --bg2 --fg --muted --accent --accent-fg --accent2 --card --line --radius --font-display --font-body --ease --dur --anim-in --letter --pc0…--pc11`. Then add game-specific rules.
* **Scope every selector** with `body[data-game="<id>"]`. Never global rules.
* Define your own `@keyframes` and point `--anim-in` at them: that is how your game gets its own *way of moving*.
* Contrast: text vs background ≥ 4.5:1; the big-screen accent must be visible from across a room.
* **Illustration is expected, not optional** (owner: "design is shit" without it): every game gets a hand-built **inline-SVG mascot/character and background art** (leaves, stars, coins, circuit lines… whatever the theme's world is), made with theme-hue gradients and a few looping CSS animations (float, eye-roam, sway). No raster images from the internet; emoji alone is not enough. Core hooks in `Party.game({...})`: `art(slot, ctx)` returns HTML for the lobby (`'lobbyHost'` / `'lobbyPlayer'`), `decor()` returns HTML for a fixed full-screen background layer behind everything (`#decor`). See `games/chameleon/client.js` (`mascot`, `leaf`, `decor`). Use "chunky 3D" tiles/buttons (hard bottom edge + soft shadow), sticker-style headings, and glass panels for depth. **Design process:** screenshot every screen (phone + laptop) and critique it before calling it done; run a read-only design critique panel when in doubt. Fonts: `@import` from Google Fonts at the top of `theme.css` **and** keep a system fallback stack.
* Text contrast ≥ 4.5:1 (dim-on-black instructions fail this). Full-screen flashing must stay ≤ 3 flashes/second or be a single flash. Avoid `filter: blur` in entrance keyframes (screenshots catch frames mid-blur and it looks broken). Per-glyph fallback to Noto Sans KR for pixel/display fonts is acceptable — check `--lang ko`.
* Respect `prefers-reduced-motion` (base.css already shortens animations).

---

## 8. Sound rules

* **Rule:** every tap, join, submit, phase change, reveal and result has a sound. Silence feels broken. Funny sounds (`honk boing toot aha pop`) for lobby play and light moments; `ding fanfare win lose` for outcomes.
* Built-in synthesised names: `tap pop join honk boing toot aha ding buzz error whoosh tick drumroll fanfare win lose reveal cheer`.
* **Client:** `screenSfx: {screenName: soundName}` plays automatically when `g.screen` changes; `data-sfx` on buttons; `lobbySounds` for the lobby noise button.
* **Server:** `room.sfx('ding')` for everyone, `room.sfx('buzz', to=player)` for one phone. Use it for results ("you were right/wrong"), not for taps.
* **Voice:** `voice: 'cartoon'|'classy'|'retro'|'digital'` changes the synth's character for the whole game. Pick the one matching your theme.
* **Real recordings:** drop `name.mp3` (or `.ogg/.wav/.m4a`) into `games/<id>/sounds/` (that game only) or `sounds/` (all games). The file with the same name as a built-in replaces it automatically; any new name can be played with `room.sfx('myname')`. The owner is fine using clips from anywhere for private fun, but audio files are **gitignored** by default so the public repo stays clean (see `sounds/README.md`). Never *depend* on a custom file: the synth fallback must still be acceptable.
* **One source per moment:** `screenSfx` already plays on every screen change on every device — don't also call `room.sfx` for the same transition (it doubles). Use `room.sfx(…, to=player)` for per-player outcomes and non-transition moments; use either `data-sfx` or a server sfx for a tap, not both.
* Browsers only play audio after a tap — the core handles unlock; don't try to autoplay on load.

---

## 9. Languages (English base, Korean switchable at any time)

* Every phone and the big screen have a language button (top right). The choice is per device and stored locally; players in the same room can use different languages.
* `strings: {en: {...}, ko: {...}}` — **same keys in both.** English is the fallback.
* Content (prompts, questions, roles, words) is `{"en": "...", "ko": "..."}` in `game.py`, rendered with `ctx.L()`. Write Korean as a native speaker would joke/phrase it — not a literal translation. Keep length similar so layouts hold.
* What players type is shown as typed, to everyone.
* Use `{param}` placeholders instead of string concatenation: `T('winner', {name})` — word order differs between languages.
* Fonts must contain Hangul (fallback to `'Noto Sans KR'`, `'Apple SD Gothic Neo'`). Verify with `shots.py <id> --lang ko`.

---

## 10. Networking facts you can rely on (don't re-implement)

* One WebSocket per screen; the server pushes a **complete** `view` message after every change: `{t:'view', code, game_id, phase:'lobby'|'game', players:[…], me, now, game:<your view>, error?}`.
* Reconnect is automatic; the phone keeps a token in `localStorage` and gets the same player back. 
* **Leader & PIN:** on every phone's lobby, a line at the top asks **"Are you Cedric?"** with a *Yes* button → a themed PIN dialog → the server marks that player `leader` (they keep it on reconnect). Only the admin's phone can pick the game, Start and advance (the laptop has no controls). The PIN comes from env `PARTY_PIN`, else `config.local.json` (gitignored; auto-created with a random 4-digit PIN on first run and printed in the server window). 5 wrong tries lock that player for 30 s. Games just call `room.is_leader(player)`.
* **Backing out is built in (all on phones):** the admin's lobby lists the games (tap another to switch) and has "Close room" (everyone returns to the join screen; the laptop opens a fresh room by itself); other phones have "Leave room". In a game, the ⋯ menu (leader/host) returns to the lobby. Games don't implement any of this.
* Rooms live in server memory. Server restart = rooms gone (fine).
* Public access: `start.command` uses Tailscale Funnel (HTTPS, no app needed on phones), falls back to LAN. Phones can be on mobile data.

---

## 11. Definition of done (tick every box)

**PROOF, not claims (owner rule — he lost trust after "it works" without evidence).** Run `python3 tests/acceptance.py` and paste its log: it starts a real server + real Chrome and prints ✅/❌ with the observed evidence for every owner rule (laptop has no controls, phone-only admin, PIN, no timers/rounds, same screen for every role, secret only on hold, vote on/off, 2 chameleons, EN↔KO, close room, solo, 30 players, no scrolling, no native pop-ups, public link, two tabs). When you add a game or a rule, **extend `tests/acceptance.py` with checks for it** and keep it green; never report "done" without the log. (Log is saved to `tests/acceptance.log`.) Game `client.js` files run inside their own function scope (core wraps them), so top-level `const` names can't clash between games.

**Works**
- [ ] `python3 tests/test_protocol.py <id>` passes (game-specific flow test if your flow differs; it also runs the generic smoke part).
- [ ] `python3 tests/shots.py <id> --times 2 8 20` and `--lang ko` → "JS/page errors: none"; **you opened the PNGs and they look right** (phone *and* big screen, lobby *and* game).
- [ ] Disconnect/reconnect mid-round does not break the game. Out-of-phase and malformed actions are ignored. Nobody can vote/answer twice to cheat.
- [ ] Nothing is timed. Every phase can be advanced by the leader (and the laptop) even if someone's phone is asleep.
- [ ] **Social tells:** compared the phone screens of different roles — same content, same interactions, same reasons to look at the phone.
- [ ] Leader-only actions refuse non-leaders (test it); options are chosen on a `setup` screen; works alone (1 player).
- [ ] `view(player)` leaks nothing the viewer must not see (check `view(None)` too).

**Feels like Cedric's Party Games**
- [ ] The Theme Brief is complete and the theme is consistent: colours, type, motion, avatars, copy, sound voice.
- [ ] Lobby has the themed avatars and noise sounds. Every screen has a sound; reveals are staged.
- [ ] No dead moment: during every phase every player has something to do or watch, on their phone.
- [ ] Phone screens are playable without looking at the big screen.
- [ ] English and Korean are complete and natural; switching language mid-game works.
- [ ] One short instruction per screen; tap targets ≥ 48 px; no horizontal scroll; inputs keep text when others act.

**Hygiene**
- [ ] Only files inside `games/<id>/` (and `tests/test_<id>.py`) were added. `core/`/`server/` untouched, or changed generically + documented in §13 + tests pass for **all** games.
- [ ] No external scripts, no network calls from `client.js`, no secrets in served files.

---

## 12. Final report format (what you tell the owner when done)

Three short parts, in plain language (owner reads Korean and English): **(1)** what you built and how a game plays, **(2)** how to try it (`start.command`, game name in the launcher), **(3)** anything you could not do or want a decision on. Include the list of files you added. Do not commit unless asked.

---

## 13. Changing the shared parts & keeping this book true

* Need a feature that several games would want (a canvas for drawing, a vote helper, a new core sound)? Add it **generically** to `core/` or `server/`, never behind `if game_id == …`. Keep every existing game working: run `test_protocol.py` for each game in `games/` and `shots.py` for at least one. Document the new API in §5/§6 right here.
* If you discovered that this book was unclear or wrong, **fix it** in the same change. Add one line to the log below.
* Do not rename public message types (`view`, `act`, `host_act`, `profile`, `honk`, `join`, `start`, `to_lobby`, `host`, `host_resume`) or `data-*` attributes without migrating every game.

### Known limitations (extend generically if a game needs them)
* No drawing canvas / image upload yet. No built-in "hold to record" audio. No spectator mode. No persistent scores across server restarts.
* Text-only inputs (plus buttons).

### Decision log
* 2026-10-03 — **Owner waiver for `spy-poll` only:** timers (45 s guess / 20 s call / 60 s final, on/off in setup) and fixed rounds are allowed, and its big screen has the same leader buttons as the leader's phone (`data-host-send` / `on_host_action`, not deprecated for this game). Because those buttons can be double-tapped from two devices, every leader action in that game carries the screen key (`data-step`) and the server ignores stale ones; `end` needs a prior `end_ask`. `tests/acceptance.py` section [7b] (R51-R64) proves it, incl. 30 players without scrolling and solo mode with virtual agents.
* 2026-10-03 — Owner requests: "Are you Cedric?" is a small chip in the top bar next to the sound icon; Chameleon grid = 20 words; Chameleon voting/guess is built but HIDDEN behind `VOTING_ENABLED` (env `CHAMELEON_VOTING=1` to test) until the owner decides after playing; result screen has Next round / Change settings / Reset game / Back to lobby; lobby chat (confirm name+icon → type messages → shown on the laptop; core feature `ready` + `chat`, ≤80 chars, rate-limited).\n* 2026-10-03 — **Design process that worked**: tweaking one design didn't satisfy the owner ("doesn't look professional"). What worked: (1) write an honest diagnosis (one display font everywhere, effect overload, stacked-block layouts, emoji icons, no brand lockup); (2) have 3 designers each build a full *different art direction* on a copy of the game (flat poster / premium dark app / nature field-guide editorial), sequentially (one Chrome at a time), each writing a spec first and iterating ≥3 rounds on screenshots; (3) a read-only judge panel compares the PNGs; (4) the owner picks. Chameleon now uses direction C (field-guide book spread, Fraunces + Inter, rubber stamps, botanical ornament avatars). Proposals are kept in `design-proposals/`. Do this for every new game's visual identity instead of one-pass CSS.
* 2026-10-03 — **Design**: owner said the visuals are weak; built `design-system/` (React kit mirroring our UI, 25 components, 13 themes) and synced it to Claude Design (project 3ceb309a…). Games still use vanilla `core/base.css`; port Claude Design output by hand (§7). New theme/component ideas belong in the kit too.
* 2026-10-03 — **Owner demanded proof by running code.** Added `tests/acceptance.py` (50 checks, real Chrome). It found and fixed real bugs: game scripts clashing when the admin switches games (`const canLead already declared` → game never registers → endless "Loading…"), same phone opening the link twice (reconnect ping-pong → now "open in another tab"), admin who is the caught chameleon had no "Show the answer" button, 30-player result screen scrolled.
* 2026-10-03 — **Owner: "everything except scanning the QR must be doable on the phone"**: removed the laptop launcher and all laptop buttons; `/host` auto-creates a room (no game); the admin picks the game, starts, sets options and advances from their phone (`pick_game`, `close` by admin). Rooms may exist without a game (`game_id: null`). `data-host-send`/`on_host_action` deprecated.
* 2026-10-03 — **Chameleon v2 after owner feedback** (the zero-shot v1 was built with timers, rounds, typed clues, scores, first-joiner VIP — all wrong for a sofa game): added §4.0 (no timers/rounds, social tells, speech stays speech, leader+PIN, options before play), `Party` leader system (`room.is_leader`, "Are you Cedric?" PIN, `config.local.json`), `askText` dialog, gilded-takes reworked without timers/rounds. See `PROMPT-TEMPLATE.md` for the gap analysis.
* 2026-10-03 — Added `reference/` (Jackbox benchmark, sound & icon dictionaries, avatar packs, theme library, asset catalog) from `JACKBOX_ASSET_MAP.md`; local Jackbox menu-sound copies in `sounds/_reference/` (gitignored).
* 2026-10-03 — Owner rule: no minimum players either (solo testing); `min_players` optional, default 1.
* 2026-10-03 — Owner rule: no native browser popups ever; core has its own dialog `Party.ask`.
* 2026-10-03 — Owner rules added: big screen never scrolls (`fitHost`), no maximum player count (server accepts any number; `max_players` removed).
* 2026-10-03 — Cold-start test (3 agents built `neon-buzz`, `mole-exe`, `haunted-quiz` from this book; kept in `_cold-start-tests/`) → added §5 items 10–13, `data-on="down"`, `.fullbleed/.tapzone`, harness, one-sound-per-moment, contrast/flash rules. Added host "Change game" / phone "Leave room" (`close`, `leave` messages).
* 2026-10-03 — `chameleon` added (first game built after the rulebook): added `room.vip_id()` docs, multi-file loading note, hold-to-reveal pattern, `shots.py --drive`, `touchstart` listener in core, lobby room-code layout fix.
* 2026-10-03 — Created. Server-authoritative Python games + dumb pure-render JS clients chosen so state survives phone sleep/reconnect and so each game is "rules in Python, looks in JS/CSS".
