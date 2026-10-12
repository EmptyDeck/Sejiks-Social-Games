# Cedric's Party Games

Jackbox-style party games for friends. The laptop is the server; everyone else joins from a phone with a 4-letter code.

## Play
Double-click **`start.command`**. A browser opens with the game picker (the "big screen").
Pick a game → a room code and QR appear → friends scan the QR (or open the link and type the code).
One phone answers **"Are you Cedric?" → Yes → PIN** and becomes the **leader**; only the leader (or the laptop) starts and runs the game. The PIN is in `config.local.json` (created on first run, also printed in the terminal window); change it there.

* Works over the internet via Tailscale Funnel (phones need no app). If Funnel isn't available it falls back to the same Wi-Fi.
* Language button (top right) switches English ↔ 한국어 any time.

## Make a new game
Tell an agent: *"Read `CedricsPartyGames/RULEBOOK.md`, then build a game: <your idea>, theme: <your theme>."*
Everything an agent needs is in [RULEBOOK.md](RULEBOOK.md). Reference game: `games/gilded-takes/`.

## Reference library
`reference/` = the "dictionary": Jackbox benchmark, sounds, icons/avatar packs, theme library. Start at [reference/README.md](reference/README.md).

## Design (Claude Design)
`design-system/` is a React UI kit (25 components, 13 themes) synced to Claude Design: https://claude.ai/design/p/3ceb309a-c004-4913-bf48-c675aed5906a — ask the design agent for screens there, then port the result into a game's `client.js` / `theme.css`. Re-sync with `/design-sync` after changing the kit. See `design-system/.design-sync/NOTES.md`.

## Developer commands
```
python3 server/server.py                       # http://localhost:3100/host
python3 tests/test_protocol.py [game-id]       # logic test with fake phones
python3 tests/shots.py <game-id> --times 2 8   # real Chrome screenshots + JS error check → /tmp/party-shots/
```
Python standard library only; no build step.
