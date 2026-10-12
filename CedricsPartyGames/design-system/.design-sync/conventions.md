# Cedric's Party Games UI kit — how to build with it

Phone-first party-game screens (Jackbox style): players on phones, one shared big screen. Everything is React + plain CSS variables; there are NO utility classes to invent.

## Setup (required)
Wrap every screen in `PartyTheme`. It sets the colors, fonts, radius and motion from `--cpg-*` variables; without it nothing is styled.
```jsx
<PartyTheme theme="neon-jungle">
  <Screen variant="phone">…</Screen>
</PartyTheme>
```
`theme` is one of: cartoon-party (default), old-money, neon-jungle, hackers, arcade-80s, spooky-mansion, space, medieval, tropical-ocean, noir-detective, candy-pop, notebook-sketch, game-show. One theme per game; never mix themes inside a screen.

## Styling idiom
Components carry their own look. Style your own layout glue only with the `--cpg-*` variables (`var(--cpg-accent)`, `--cpg-bg`, `--cpg-fg`, `--cpg-muted`, `--cpg-card`, `--cpg-line`, `--cpg-radius`, `--cpg-font-display`, `--cpg-pc0…11` for the 12 player colors) and the few layout helpers `cpg-row`, `cpg-stack`, `cpg-chips`, `cpg-muted`, `cpg-small`. Do not hard-code colors or fonts: they must follow the theme.

## Rules the kit is built around (follow them when composing screens)
- Phone screens use `<Screen variant="phone">`: one column, thumb-sized controls, ONE primary `Button` per screen (`block`).
- The shared laptop/TV screen uses `<Screen variant="host">`: it must fit the window without scrolling and has NO buttons — it only displays. All controls live on phones.
- No timers or countdowns. Never use browser `alert/confirm/prompt`: use `Dialog`.
- Hidden roles: every player's phone shows the same thing until they press-and-hold `HoldCard`/`HoldBoard`; never show a secret on the shared screen.
- Text must work in English and Korean (labels are props; don't bake text into components).

## Where to look
`_ds/…/styles.css` (tokens + component styles + the 13 theme blocks), `components/<group>/<Name>/<Name>.prompt.md` for each component's usage.

## One idiomatic snippet (Chameleon play screen)
```jsx
<PartyTheme theme="neon-jungle">
  <Screen variant="phone">
    <Banner icon="👉">Ann goes first</Banner>
    <HoldBoard role="insider" words={words} secretIndex={7} />
    <Button block variant="secondary">I have seen it</Button>
  </Screen>
</PartyTheme>
```
