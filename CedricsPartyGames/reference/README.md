# Reference library (the "dictionary")

Lookup material for building new games. **Nothing here is loaded by the game server** — it is for agents (and the owner) to read when choosing a theme, sounds, icons, content size, or features. The rules live in [`../RULEBOOK.md`](../RULEBOOK.md); this folder holds *options and evidence*.

| File | Use it when you need… |
|---|---|
| [JACKBOX-BENCHMARK.md](JACKBOX-BENCHMARK.md) | what Jackbox actually does (content scale, avatar rosters, sound architecture, feature ideas) distilled from the owner's installed copies |
| [SOUND-DICTIONARY.md](SOUND-DICTIONARY.md) | which sound to play for which moment; our 18 built-in names; wish-list of new sounds; how to drop in real recordings |
| [ICON-DICTIONARY.md](ICON-DICTIONARY.md) + [avatar-packs.json](avatar-packs.json) | the 24-icon avatar packs per theme and the emoji vocabulary for UI states |
| [THEME-LIBRARY.md](THEME-LIBRARY.md) | ready-to-paste theme starting points (palette, fonts, motion, sound voice, copy tone, avatar pack) |
| [asset-catalog.json](asset-catalog.json) | machine-readable map of where Jackbox's files are on the owner's Mac (source: `../../JACKBOX_ASSET_MAP.md`) |

Local-only audio copies: `../sounds/_reference/jackbox/` (gitignored, personal use; never auto-played by the server).

**Keep it alive:** when you build a game and invent something reusable (a new avatar pack, theme, sound idea, content-size lesson), add it here in the same change and note it in the RULEBOOK decision log.
