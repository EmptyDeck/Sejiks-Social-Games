# Design-sync notes (Cedric's Party Games UI kit)

Project: https://claude.ai/design/p/3ceb309a-c004-4913-bf48-c675aed5906a  (pinned in config.json)

- This package (`design-system/`) is a **new React kit** that mirrors the look of the live games (`../core/base.css` + game `theme.css`). The games themselves are still vanilla JS template strings and do NOT import this kit yet → **two sources of truth for the look** (core/base.css vs src/styles.css). Re-sync after changing either, and port Claude Design output back into the games by hand.
- Build: `npm run build` (esbuild → dist/index.es.js, tsc → .d.ts, CSS concat order matters: fonts → styles → themes; themes must come AFTER base so they override defaults). Use `:where(.cpg-root)` for element resets or they beat component classes.
- Render check uses playwright with the system Chrome: `export DS_CHROMIUM_PATH="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"`; `.ds-sync/` has `playwright` + `playwright-core` installed (no browser download). One Chrome at a time — the owner's laptop lags with several.
- Fonts come from Google Fonts @imports (`[FONT_REMOTE]` is expected/informational).
- Config: `provider` = PartyTheme(cartoon-party); `overrides.WordGrid.cardMode = column` (6-column grid is wider than a grid cell).
- Previews are authored in `.design-sync/previews/*.tsx` for all 25 components (47 cells, all graded good on the absolute rubric). Preview themes: only PartyTheme shows all 6 sample themes.

## Re-sync risks
- Themes in `src/themes.css` were generated from `../reference/THEME-LIBRARY.md`; editing the library does not update the kit automatically.
- Stepper's larger −/+ glyph was tweaked after its sheet was read (styling-only; grades carry forward) — eyeball it on the next sync.
- `HoldCard` pressed state is pure CSS `:active`; previews force it with `revealed`.
- No dark/light split: every theme is a self-contained world.

## Known render warns
none (render check clean: 25/25, bad 0, thin 0).
