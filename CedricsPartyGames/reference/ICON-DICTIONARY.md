# Icon dictionary

Avatars are **emoji** (no art assets). Each game supplies exactly **24** in `client.js` → `avatars: [...]` (RULEBOOK §6). Players pick unique ones; beyond 24 players icons repeat. Machine-readable copy: [avatar-packs.json](avatar-packs.json).

## 1. Avatar packs (24 each)

**cartoon-default** — Core default (core/app.js)

😀 😎 🤠 🥳 🤓 😈 👻 🤖 👽 🐵 🐶 🐱 🦊 🐼 🐸 🐙 🦄 🐲 🍕 🌮 🍩 🚀 ⚡ 🔥

**old-money** — gilded-takes: yachts, champagne, heirlooms

🎩 🥂 🐎 ⛵ 🕰️ 💎 🦢 🍾 🎻 🏛️ 🗝️ 🪙 👑 🍷 🦚 📜 🪞 🕯️ 🎭 🏰 🛎️ 🧣 🖋️ 🥀

**jungle** — chameleon: rainforest critters & plants

🦎 🐍 🐸 🐊 🦜 🦋 🐛 🐢 🦥 🦧 🐒 🐆 🦚 🐜 🕷️ 🦂 🦗 🐝 🐞 🦩 🦔 🐙 🍃 🌴

**hackers** — terminals, circuits, cyber

💻 🖥️ ⌨️ 🖱️ 💾 📟 📡 🔌 🔋 🧬 🧠 👾 🤖 🛰️ 🔒 🔑 🕶️ 🎧 📀 🧲 💡 🧪 🛠️ ⚙️

**arcade-80s** — neon arcade, cassettes, roller discos

🕹️ 👾 🎮 📼 📻 🎸 🎹 🥁 🎤 🛼 🕺 💃 🌴 🌅 🚗 🏎️ 🍿 🥤 🎱 🎳 🪩 ⭐ 💿 📺

**spooky-mansion** — haunted house, Halloween

👻 🎃 🦇 🕷️ 🕸️ 💀 🧛 🧟 🧙 🧞 🐈‍⬛ 🦉 🕯️ 🔮 🗝️ ⚰️ 🪦 🌕 🧪 🍬 👁️ 🩸 🪄 🏚️

**space** — astronauts, planets, aliens

🚀 🛸 👽 👨‍🚀 🌍 🌕 🪐 ⭐ 🌟 ☄️ 🛰️ 🔭 🌌 🌠 🌞 🌙 🤖 🐙 🦑 🧑‍🚀 🛰 🔆 🧊 🌑

**medieval** — knights, dragons, taverns

🏰 ⚔️ 🛡️ 🏹 👑 🐉 🦄 🧙 🧝 🧚 🍺 🍖 🕯️ 📜 🗡️ 🐎 🦅 🔥 💍 🏴 🧪 🪓 🔔 🥖

**ocean** — beach & sea life

🐠 🐟 🐡 🦈 🐬 🐳 🐙 🦑 🦀 🦞 🦐 🐚 🐢 🦭 🪸 ⚓ 🏝️ 🌊 ⛵ 🏄 🤿 🧜 🦦 🪼

**candy-pop** — sweets, birthday party

🍬 🍭 🍫 🍩 🍪 🧁 🍰 🎂 🍦 🍧 🍡 🍿 🥤 🧃 🎈 🎉 🎁 🎀 🪅 🎠 🌈 🦄 🍓 🍒

**sports** — stadium, team sports

⚽ 🏀 🏈 ⚾ 🎾 🏐 🏉 🎱 🏓 🏸 🥊 🥋 ⛳ 🏒 🏆 🥇 🏅 🚴 🏊 🧗 🛹 🏂 🎯 🪁

**food-party** — a very hungry crowd

🍕 🍔 🌭 🍟 🌮 🌯 🍣 🍜 🍝 🥗 🍗 🥓 🥐 🥨 🧀 🍳 🥞 🍦 🍩 🍪 🍎 🍉 🍌 🥑

**noir-detective** — 1940s detective, mystery

🕵️ 🔍 🕶️ 🎩 🧥 🚬 🥃 📰 📞 🔫 💼 🗝️ 🚪 🕯️ 🌧️ 🌃 🚕 🐈‍⬛ 🦉 🧳 📸 🩸 ⏳ 🔦

**farm** — barnyard

🐄 🐖 🐔 🐑 🐐 🐴 🦆 🐓 🐇 🐝 🌽 🥕 🍎 🌻 🚜 🏡 🥚 🧺 🐕 🐈 🦃 🌾 🍯 🥛

## 2. Choosing / making a pack

- Match the *world* of the theme (see THEME-LIBRARY); mix creatures, objects and a few funny ones — people pick icons that say something about themselves.
- 24 unique emoji, no skin-tone modifiers, no flags, avoid Unicode ≥ 15 (older phones show □). ZWJ sequences (👨‍🚀, 🐈‍⬛) are fine but test them.
- Check contrast on your theme's tile colour: very dark emoji (🕶️ 🐈‍⬛ 👾 🔌) vanish on dark tiles (seen in review).
- Jackbox lesson: characters have *names* and *personalities* (Poll Position `vrman`, `scarflady`; Tee K.O. `Kappa`, `Fox`) and some games give each a voice. Future: avatar names + mood variants (idle / sad / winner).

## 3. UI state vocabulary (use consistently across games)

| Meaning | Emoji | Meaning | Emoji |
|---|---|---|---|
| VIP / host | 👑 | ready / done | ✅ |
| thinking / waiting | 🤔 ⏳ | submitted | 📨 |
| your turn | 👉 | locked in | 🔒 |
| winner | 🏆 🥇 | second / third | 🥈 🥉 |
| points gained | ➕ ✨ | streak | 🔥 |
| correct | ✔️ 🎯 | wrong | ❌ |
| disconnected | 📵 | reconnecting | 🔄 |
| time almost up | ⏰ | secret / hidden | 🙈 🤫 |
| vote | 🗳️ | suspect / accuse | 🕵️ 👆 |
| sound on/off | 🔊 🔇 | language | 🌐 | back / leave | ← 🚪 |
| settings / menu | ⋯ ⚙️ | idea / hint | 💡 | laugh | 😂 |

## 4. Brand
- Brand name: **Cedric's Party Games** (ko: 세드릭의 파티 게임즈). Favicon: 🎉 (inline SVG in `core/index.html`). No mascot yet — Jackbox packs each have one (Gene, the Drawful owl); candidate: a party-hat character named Cedric. Add it here when chosen.
