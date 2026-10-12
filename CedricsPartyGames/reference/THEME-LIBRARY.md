# Theme library

Starting points for the Theme Brief (RULEBOOK §7.1). Copy the CSS variable block into `body[data-game="<id>"] { … }` in your `theme.css`, then add your own shapes, keyframes and copy. **A theme is a physical metaphor** (Jackbox: a desktop, brackets, a dating show…): UI, sound and wording all come from it. Existing themes in `games/`: *old-money*, *neon-jungle*. Always add your own `@keyframes` for `--anim-in`.

> **Sound names:** built-in names are `tap pop join honk boing toot aha ding buzz error whoosh tick drumroll fanfare win lose reveal cheer`. Names used below that are *not* built yet (`coin laser ghost typewriter dundun pageturn tada applause rimshot buzzer_wrong`, see SOUND-DICTIONARY §3) are **silent** until you synthesise them in `core/sfx.js` or drop a file with that name in `sounds/` — substitute a built-in meanwhile.

| key | name | vibe |
|---|---|---|
| `cartoon-party` | Cartoon Party (core default) | Bouncy, bright, friendly. |
| `old-money` | Old Money (gilded-takes) | Yachts, heirlooms, deadpan butler. |
| `neon-jungle` | Neon Jungle Terrarium (chameleon) | Camouflage, wildlife documentary narrator. |
| `hackers` | Hackers / Terminal | Black screen, phosphor text, scanlines, jargon. |
| `arcade-80s` | 80s Arcade | Neon on deep purple, grid horizon, chrome type. |
| `spooky-mansion` | Haunted Mansion | Candle-lit black/purple/orange, fog drifts, playful-spooky. |
| `space` | Space Station | Deep navy, starfield, cool teal + warm alert orange. |
| `medieval` | Medieval Tavern | Parchment, wood, torchlight, heraldry. |
| `tropical-ocean` | Tropical Ocean | Aqua gradients, bubbles, sun-yellow accents. |
| `noir-detective` | Noir Detective | Black & white with one red accent, venetian-blind light, typewriter. |
| `candy-pop` | Candy Pop Birthday | Pastel sweets, confetti, sticker borders. |
| `notebook-sketch` | Hand-drawn Notebook (Drawful-style) | Paper, pencil, doodled borders, owl-like mascot. |
| `game-show` | Late-night Game Show (Quiplash-style) | Studio lights, big buzzers, host banter. |

## Cartoon Party (core default)  (`cartoon-party`)

Bouncy, bright, friendly. The look of `core/base.css`; use when no other world fits.

- **Fonts:** Baloo 2 + Nunito (ko: Noto Sans KR) — always `@import` from Google Fonts *and* keep a Korean-capable fallback.
- **Shapes & motion:** round, overshoot easing, pop-in
- **Sound voice:** `cartoon` · lobby noises: `boing pop toot honk aha`
- **Copy tone:** "Everybody in! 🎉" / "다 같이 들어와요!"
- **Avatar pack:** `cartoon-default` (see [ICON-DICTIONARY](ICON-DICTIONARY.md))

```css
body[data-game="my-game"] {
  --bg:#1b1030;
  --bg2:#2d1b55;
  --fg:#fff;
  --accent:#ffd23f;
  --accent-fg:#1b1030;
  --accent2:#ff5d8f;
  --radius:18px;
  --ease:cubic-bezier(.34,1.56,.64,1);
  --dur:.4s;
  --anim-in:pop-in;
}
```

## Old Money (gilded-takes)  (`old-money`)

Yachts, heirlooms, deadpan butler. Metaphor: a members-only club.

- **Fonts:** Playfair Display + Cormorant Garamond (ko: Noto Serif KR) — always `@import` from Google Fonts *and* keep a Korean-capable fallback.
- **Shapes & motion:** square 4px corners, hairline gold frame, slow 0.8 s rise, no bounce
- **Sound voice:** `classy` · lobby noises: `ding pop aha ding`
- **Copy tone:** "Another round, darling?" / "한 판 더 하실래요?"
- **Avatar pack:** `old-money` (see [ICON-DICTIONARY](ICON-DICTIONARY.md))

```css
body[data-game="my-game"] {
  --bg:#0b1424;
  --bg2:#1a2b4a;
  --fg:#f4ecd6;
  --accent:#c9a24b;
  --accent-fg:#101a2c;
  --accent2:#8c2f3b;
  --radius:4px;
  --ease:cubic-bezier(.22,.61,.36,1);
  --dur:.8s;
  --anim-in:gilded-rise;
  --letter:.02;
}
```

## Neon Jungle Terrarium (chameleon)  (`neon-jungle`)

Camouflage, wildlife documentary narrator. Signature: the accent hue drifts forever (`@property --skin`).

- **Fonts:** Bungee + Fredoka (ko: Black Han Sans / Jua) — always `@import` from Google Fonts *and* keep a Korean-capable fallback.
- **Shapes & motion:** very round 28px, leaf-sway entrance (rotate+rise), springy ease, glitch on the secret card
- **Sound voice:** `cartoon` · lobby noises: `boing pop toot honk aha`
- **Copy tone:** "Observe quietly…" / "조용히 관찰하세요…"
- **Avatar pack:** `jungle` (see [ICON-DICTIONARY](ICON-DICTIONARY.md))

```css
body[data-game="my-game"] {
  --bg:#04110a;
  --bg2:#0f3d2a;
  --fg:#eaffe9;
  --accent:hsl(var(--skin) 100% 58%);
  --accent-fg:#05180e;
  --accent2:#ff4fa3;
  --radius:28px;
  --ease:cubic-bezier(.3,1.5,.5,1);
  --dur:.6s;
  --anim-in:leaf-in;
}
```

## Hackers / Terminal  (`hackers`)

Black screen, phosphor text, scanlines, jargon. Metaphor: a shell session.

- **Fonts:** VT323 or IBM Plex Mono (ko: D2Coding / Noto Sans Mono KR fallback) — always `@import` from Google Fonts *and* keep a Korean-capable fallback.
- **Shapes & motion:** radius 0, scanline overlay (`body::before` repeating-linear-gradient), typing reveal (`steps()` width), glitch shake on errors
- **Sound voice:** `digital` · lobby noises: `tick buzz pop tap`
- **Copy tone:** "> ACCESS GRANTED" / "> 접근 허가"
- **Avatar pack:** `hackers` (see [ICON-DICTIONARY](ICON-DICTIONARY.md))

```css
body[data-game="my-game"] {
  --bg:#020a04;
  --bg2:#06200d;
  --fg:#9dffb0;
  --muted:rgba(157,255,176,.6);
  --accent:#39ff14;
  --accent-fg:#001a06;
  --accent2:#ffb000;
  --card:rgba(57,255,20,.07);
  --line:rgba(57,255,20,.4);
  --radius:0;
  --ease:steps(6,end);
  --dur:.35s;
  --anim-in:type-in;
}
```

## 80s Arcade  (`arcade-80s`)

Neon on deep purple, grid horizon, chrome type. Metaphor: a cabinet with a high-score table.

- **Fonts:** Press Start 2P or Orbitron (ko: DotGothic16-like fallback → Noto Sans KR) — always `@import` from Google Fonts *and* keep a Korean-capable fallback.
- **Shapes & motion:** hard 0.15 s steps, neon glow (`text-shadow`/`box-shadow`), sliding grid floor, blinking INSERT COIN
- **Sound voice:** `retro` · lobby noises: `coin laser pop tick`
- **Copy tone:** "INSERT COIN", "HI-SCORE" / "동전을 넣으세요"
- **Avatar pack:** `arcade-80s` (see [ICON-DICTIONARY](ICON-DICTIONARY.md))

```css
body[data-game="my-game"] {
  --bg:#12002b;
  --bg2:#3a0a6b;
  --fg:#fff;
  --accent:#00f0ff;
  --accent-fg:#12002b;
  --accent2:#ff2bd6;
  --radius:2px;
  --ease:steps(4,end);
  --dur:.2s;
  --anim-in:scan-in;
}
```

## Haunted Mansion  (`spooky-mansion`)

Candle-lit black/purple/orange, fog drifts, playful-spooky. Metaphor: a creaky house with rooms.

- **Fonts:** Creepster (display) + Nunito (ko: Jua) — always `@import` from Google Fonts *and* keep a Korean-capable fallback.
- **Shapes & motion:** tilted cards, drifting fog layers (`body::before/::after`, opacity ≥ .6 or it is invisible), flicker on timers
- **Sound voice:** `cartoon` · lobby noises: `ghost boing pop aha`
- **Copy tone:** "Boo! Who's in?" / "으스스! 누가 들어왔지?"
- **Avatar pack:** `spooky-mansion` (see [ICON-DICTIONARY](ICON-DICTIONARY.md))

```css
body[data-game="my-game"] {
  --bg:#0c0614;
  --bg2:#2a0f3d;
  --fg:#f2e9ff;
  --accent:#ff8a1f;
  --accent-fg:#1a0a00;
  --accent2:#9b5cff;
  --radius:14px;
  --ease:cubic-bezier(.3,1.4,.5,1);
  --dur:.5s;
  --anim-in:drift-in;
}
```

## Space Station  (`space`)

Deep navy, starfield, cool teal + warm alert orange. Metaphor: mission control.

- **Fonts:** Orbitron + Exo 2 (ko: Noto Sans KR) — always `@import` from Google Fonts *and* keep a Korean-capable fallback.
- **Shapes & motion:** slow parallax stars, rounded-rect panels with thin glow lines, countdown beeps, 'telemetry' readouts
- **Sound voice:** `digital` · lobby noises: `laser pop tick ding`
- **Copy tone:** "Mission control: all crew aboard" / "관제센터: 모든 승무원 탑승"
- **Avatar pack:** `space` (see [ICON-DICTIONARY](ICON-DICTIONARY.md))

```css
body[data-game="my-game"] {
  --bg:#030616;
  --bg2:#0b1f45;
  --fg:#e8f4ff;
  --accent:#4ee0d0;
  --accent-fg:#02201c;
  --accent2:#ff8a3d;
  --radius:10px;
  --ease:cubic-bezier(.2,.8,.2,1);
  --dur:.5s;
  --anim-in:dock-in;
}
```

## Medieval Tavern  (`medieval`)

Parchment, wood, torchlight, heraldry. Metaphor: a tavern notice board.

- **Fonts:** MedievalSharp or Cinzel (ko: Gowun Batang / Noto Serif KR) — always `@import` from Google Fonts *and* keep a Korean-capable fallback.
- **Shapes & motion:** parchment texture via CSS gradients, wax-seal accents, banner-unroll entrance
- **Sound voice:** `classy` · lobby noises: `ding pageturn pop honk`
- **Copy tone:** "Hear ye, hear ye!" / "들으라, 들으라!"
- **Avatar pack:** `medieval` (see [ICON-DICTIONARY](ICON-DICTIONARY.md))

```css
body[data-game="my-game"] {
  --bg:#1b120a;
  --bg2:#3b2713;
  --fg:#f6e7c8;
  --accent:#d9a441;
  --accent-fg:#2a1a05;
  --accent2:#a62b2b;
  --radius:6px;
  --ease:cubic-bezier(.25,.8,.3,1);
  --dur:.7s;
  --anim-in:unroll;
}
```

## Tropical Ocean  (`tropical-ocean`)

Aqua gradients, bubbles, sun-yellow accents. Metaphor: a coral reef aquarium.

- **Fonts:** Fredoka One + Quicksand (ko: Jua) — always `@import` from Google Fonts *and* keep a Korean-capable fallback.
- **Shapes & motion:** rising bubbles, wave-sway cards, soft glassy panels
- **Sound voice:** `cartoon` · lobby noises: `pop boing ding whoosh`
- **Copy tone:** "Dive in!" / "풍덩!"
- **Avatar pack:** `ocean` (see [ICON-DICTIONARY](ICON-DICTIONARY.md))

```css
body[data-game="my-game"] {
  --bg:#021a2e;
  --bg2:#06607a;
  --fg:#eafcff;
  --accent:#ffd84d;
  --accent-fg:#052434;
  --accent2:#ff6f91;
  --radius:24px;
  --ease:cubic-bezier(.3,1.3,.5,1);
  --dur:.6s;
  --anim-in:bubble-in;
}
```

## Noir Detective  (`noir-detective`)

Black & white with one red accent, venetian-blind light, typewriter. Metaphor: a case file.

- **Fonts:** Special Elite (typewriter) + Libre Baskerville (ko: Nanum Myeongjo) — always `@import` from Google Fonts *and* keep a Korean-capable fallback.
- **Shapes & motion:** paper cards with tape, stamp slam on reveal (scale 1.6→1 + shake), rain overlay
- **Sound voice:** `classy` · lobby noises: `typewriter dundun ding pageturn`
- **Copy tone:** "The case of the missing word…" / "사라진 단어 사건…"
- **Avatar pack:** `noir-detective` (see [ICON-DICTIONARY](ICON-DICTIONARY.md))

```css
body[data-game="my-game"] {
  --bg:#0d0d0f;
  --bg2:#26262c;
  --fg:#ecebe6;
  --accent:#d62828;
  --accent-fg:#fff;
  --accent2:#c9b27c;
  --radius:2px;
  --ease:cubic-bezier(.7,0,.3,1);
  --dur:.45s;
  --anim-in:stamp-in;
}
```

## Candy Pop Birthday  (`candy-pop`)

Pastel sweets, confetti, sticker borders. Metaphor: a party table.

- **Fonts:** Chewy or Fredoka One + Nunito (ko: Jua / Gaegu) — always `@import` from Google Fonts *and* keep a Korean-capable fallback.
- **Shapes & motion:** wobbly sticker cards (rotate ±2°), confetti burst on wins, squishy button press
- **Sound voice:** `cartoon` · lobby noises: `pop boing honk tada`
- **Copy tone:** "Cake time!" / "케이크 타임!"
- **Avatar pack:** `candy-pop` (see [ICON-DICTIONARY](ICON-DICTIONARY.md))

```css
body[data-game="my-game"] {
  --bg:#ffe6f2;
  --bg2:#ffd0e8;
  --fg:#4a1f3d;
  --muted:rgba(74,31,61,.65);
  --accent:#ff4f9a;
  --accent-fg:#fff;
  --accent2:#3fc1ff;
  --card:rgba(255,255,255,.7);
  --line:rgba(74,31,61,.25);
  --radius:26px;
  --ease:cubic-bezier(.34,1.7,.5,1);
  --dur:.45s;
  --anim-in:pop-in;
}
```

## Hand-drawn Notebook (Drawful-style)  (`notebook-sketch`)

Paper, pencil, doodled borders, owl-like mascot. Metaphor: a school notebook.

- **Fonts:** Patrick Hand / Gaegu (ko: Gaegu / Nanum Pen Script) — always `@import` from Google Fonts *and* keep a Korean-capable fallback.
- **Shapes & motion:** rotated paper cards with shadow, wobbling SVG underlines, ink-scribble transitions
- **Sound voice:** `cartoon` · lobby noises: `pop tap boing aha`
- **Copy tone:** "Draw it like you mean it" / "진심으로 그려 보세요"
- **Avatar pack:** `cartoon-default` (see [ICON-DICTIONARY](ICON-DICTIONARY.md))

```css
body[data-game="my-game"] {
  --bg:#f4efe1;
  --bg2:#e9e2cc;
  --fg:#2b2a33;
  --muted:rgba(43,42,51,.6);
  --accent:#2b6cff;
  --accent-fg:#fff;
  --accent2:#ff5a3d;
  --card:rgba(255,255,255,.7);
  --line:rgba(43,42,51,.3);
  --radius:10px;
  --ease:cubic-bezier(.4,1.4,.5,1);
  --dur:.4s;
  --anim-in:pop-in;
}
```

## Late-night Game Show (Quiplash-style)  (`game-show`)

Studio lights, big buzzers, host banter. Metaphor: a TV set with a host and applause.

- **Fonts:** Bebas Neue / Anton + Poppins (ko: Black Han Sans / Noto Sans KR) — always `@import` from Google Fonts *and* keep a Korean-capable fallback.
- **Shapes & motion:** spotlight sweeps, buzzer shake, marquee bulbs border, applause on reveal
- **Sound voice:** `cartoon` · lobby noises: `applause rimshot buzzer_wrong tada`
- **Copy tone:** "Welcome back to the show!" / "쇼에 오신 걸 환영합니다!"
- **Avatar pack:** `cartoon-default` (see [ICON-DICTIONARY](ICON-DICTIONARY.md))

```css
body[data-game="my-game"] {
  --bg:#12081f;
  --bg2:#35106a;
  --fg:#fff6e0;
  --accent:#ffcf1f;
  --accent-fg:#1a0b00;
  --accent2:#ff3d5e;
  --radius:12px;
  --ease:cubic-bezier(.3,1.5,.5,1);
  --dur:.4s;
  --anim-in:pop-in;
}
```

## Checklist when you add a new theme here
- Contrast ≥ 4.5:1 for text; ≤ 3 flashes/second; no blur in entrance keyframes; verify in Korean (`shots.py --lang ko`).
- Add its 24-icon pack to `avatar-packs.json`/ICON-DICTIONARY and any new sound ideas to SOUND-DICTIONARY.
- Fonts listed as 'fallback → Noto Sans KR' have no Hangul glyphs: per-glyph fallback is acceptable, but look at it.
