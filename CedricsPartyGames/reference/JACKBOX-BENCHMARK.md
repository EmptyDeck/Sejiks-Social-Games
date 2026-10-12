# Jackbox benchmark (distilled)

Source: the owner's Steam install (Party Pack 3, Party Pack 4, Drawful 2, Survey Scramble demo, Megapicker). Full raw inventory: `../../JACKBOX_ASSET_MAP.md`. Everything below is a **design reference**, not assets to copy.

## 1. Content scale (how much material a "complete" game has)
| Game | Main prompts | Extras |
|---|---:|---|
| Quiplash 2 | 746 | 749 audience prompts, 98 safety quips (fallback answers), final-round modes 17–50 each |
| Trivia Murder Party | 1156 | 157 final-round, 67+126 "worst drawing/response" |
| Fakin' It | 453 | 46 inputs, 5 categories |
| Poll Position | 528 | 137 bonus |
| Tee K.O. | 385 drawing + 253 slogan suggestions | |
| Fibbage 3 | 503 shortie | 104 special, 99 final, 151 TMI |
| Survive the Internet | 188 | photo 195, store 58, job 38, twists 101 + ~9 gag types of 13–56 each |
| Bracketeering | 325 | |
| Monster Seeks Monster | 15 monsters | 99 secret words, 127 audience answers, 62 NPC answers |
| Civic Doodle | 207 | 50 starting art |
| Drawful 2 | 1461 (en) | 112 decoys; 5 languages (en fr it de es) |

**Lesson:** a Jackbox game ships 150–1500 items per mode. **Our target:** ≥ 40 items for a first version, 150+ before calling a game "done"; draw without replacement.

## 2. Content structure worth copying
- **Adult flag per item** (`x: true`, Drawful 2 en: 184 of 1461) → add `adult: True` to content items and a *family mode* toggle on a setup screen.
- **Safety quips**: fallback answers used when a player fails to submit in time → never leave a player with an empty slot; auto-fill with a funny default.
- **Alternate spellings** (`AlternateSpellings`) for typed-answer matching → accept synonyms (and Korean/English variants) when scoring typed guesses.
- **Audience** prompts/answers: spectators who are not players can still vote/react (Quiplash, Monster). *Not built yet* (see RULEBOOK known limitations).
- Each prompt may have a **recorded host voice line**. We use text + sound effects; a narrator voice is a possible theme layer (e.g. the Chameleon "nature documentary" tone) delivered as copy, optionally mp3 later.

## 3. Avatar / character rosters
| Game | Roster | Notes |
|---|---|---|
| Quiplash 2 | 12 named characters (Blue, Coffin, Green, Kitten, Orange, Pink, Purple, Red, Star, Teal, Triclops, Yellow) | colour-named mascots |
| Trivia Murder Party | 8–9 colours + Ghost icon, polaroid avatar, player photos | dead players become ghosts |
| Fakin' It | abstract player *shapes*, category icons | no characters at all |
| Poll Position | 24 icons `PollPositionIcon00..23` (vrman, scarflady, businessman, eyegadget, boblady, goateeman, vrwoman, dog, dolphin, hatguy, eagle2, informant, robot, headphonesgirl, facemaskguy, radiooperator …) | each has an audio index (a voice per icon) |
| Tee K.O. | 16 (Baku, BlueDemon, Bun, Cat, Catfish, Crow, Dog, Fire, Fox, Hair, Kappa, Monkey, Raccoon, RedDemon, Snake, Umbrella) | Japanese-folklore flavoured |
| Drawful 2 | **players draw their own avatar** in the lobby ("draw a picture of yourself"), two colours per player | the strongest "something to do while waiting" |
| Fibbage 3 | 8 avatars (+2 "new") | |
| Survive the Internet | 9 colours + mascot Gene; **avatar states**: normal, Sad, Best-burn, Win, Write | avatars react to what happens |
| Monster Seeks Monster | 20 monster frames (15 used): Blob, InvisibleMan, Leprechaun, MonsterHunter, Mother, Mummy, PodPerson, SerialKiller, TwoFacedCreep, Vampire, VengefulGhost, VentriloquistPuppet, Werewolf, Witch, Zombie (+Robot NPC) | each monster has a *role* |
| Bracketeering | player art slots, VIP widget | |
| Civic Doodle | nametags, VIP badge, no avatars | |

**Takeaways to adopt:** (1) 8–24 distinct *named* characters, unique per player, each with a colour; (2) a VIP badge; (3) **avatar moods** (idle / sad / winner) — future feature: let `view` carry a mood and let packs supply 3 emoji per avatar; (4) players drawing their own icon needs a canvas (not built); (5) a **mascot per pack** (Gene, the Drawful owl, "sad-roomie") — idea: give Cedric's Party Games a brand mascot.

## 4. Sound architecture
- Three layers: **host voice-over**, **SFX**, **music**; audio buses `HOST`, `MUSIC`, `DuckedByMusic`, `Reverb` → music *ducks* under voice. (Our core has one master gain; ducking is a possible upgrade.)
- Event-name convention (Survey Scramble `audiokeys.json`, 177 keys): `"<widget>/<action>": "SFX/<Screen>/<Name>"`, e.g. `mcMenuButton/Press → SFX/StartMenu/ButtonPress`. **Our equivalent:** sound *names* (`tap`, `pop`, `ding`…) mapped per moment (see SOUND-DICTIONARY).
- Launcher/menu vocabulary (PP3/PP4 `sfx/`): `BSFXLogoOn`, `BSFXStartOn`, `BSFXStartButtonOn` (hover/appear), `BSFXStartButtonPress`, Picker: `BSFXBoxShuffle`, `BSFXSelectGame`, `BSFXHelpOff`, `SettingsHighlight`, `SettingsToggleOnOff`, `SettingsVolumeUpDown`, `SettingsWindowOnOff`; looping menu music `BSFXBackgroundMainLoop`. **Moments they cover:** logo reveal, hover, press, shuffle, select, help closing, toggle, volume change, window open/close, a background loop.
- Embedded sounds exist inside the games' `.swf` files (Quiplash2: 60 per action file; Tee K.O.: 16; Fakin' It: 5) — not extracted.

## 5. Per-game theme (the "one game = one world" evidence)
Quiplash (talk-show), Trivia Murder Party (horror game show), Fakin' It (abstract shapes / bluffing), Poll Position (news/poll), Tee K.O. (t-shirt shop, Japanese motifs), Fibbage 3 (bluffing/TMI), Survive the Internet (a fake desktop OS, popups, sticky notes, messenger gags), Bracketeering (tournament brackets), Monster Seeks Monster (dating-show monsters), Civic Doodle (city map graffiti), Drawful 2 (owl mascot, sketchy hand-drawn UI), Survey Scramble (mini-game variety: pegs, horse race, tic-tac-toe, scroll search, group vote). **Pattern:** a *physical metaphor* (desktop, brackets, map, dating show) drives UI, sound and copy together. See THEME-LIBRARY.

## 6. Localisation
Drawful 2: en fr it de es (443 UI strings); Survey Scramble also pt-BR, es-XL; **no Korean anywhere** — Korean support is a differentiator for this project.

## 7. Feature ideas harvested (not built; add generically if wanted)
VIP icon ✔ built · audience mode · thumbs/likes on answers (`thumb0..7`) · confetti on win · timers & scoreboards ✔ built · post-game screen with stats · pause dialog · player-drawn avatars · avatar moods · music ducking · in-game "help" overlay · family/adult content toggle · per-mode round variety (final round that differs from normal rounds).

## 8. Extraction how-to (only if the owner ever wants raw art)
swf art: JPEXS FFDec (`java -jar ffdec.jar -export image,shape,sprite,sound,binaryData out file.swf`); `.usm` video: `ffmpeg -i x.usm out.mp4`; FMOD banks: vgmstream / python-fsb5; asar: `npx @electron/asar extract app.asar out`. Not installed: FFDec. Loose ogg/jpg/png can be copied directly. **Remember:** keep copies local and gitignored.
