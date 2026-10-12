# Jackbox asset map (for benchmarking)

Root: `/Users/owo/Library/Application Support/Steam/steamapps/common`

Installed Jackbox products: Party Pack 3, Party Pack 4, Drawful 2, Survey Scramble (demo), Megapicker (launcher).
Other folders there (Crab Game, Civ V/VI, etc.) are not Jackbox.

Abbreviations used below:
- `PP3` = `The Jackbox Party Pack 3/The Jackbox Party Pack 3.app/Contents/Resources/macos`
- `PP4` = `The Jackbox Party Pack 4/The Jackbox Party Pack 4.app/Contents/Resources/macos`
- `D2`  = `Drawful 2/Drawful 2.app/Contents/Resources/macos`
- `SS`  = `The Jackbox Survey Scramble Demo/The Jackbox Survey Scramble.app/Contents/Resources/macos/games/BigSurvey`
- `MP`  = `The Jackbox Megapicker/The Jackbox Megapicker.app/Contents/Resources`

## 1. File formats

| Ext | What it is |
|---|---|
| `.jet` | Plain JSON (despite the name). Questions / prompts / config. Shape: `{"content":[{id, ...}]}` |
| `.ogg` | Voice-over / narration audio, one per prompt (inside numbered folders) |
| `.wav` + `.ogg` | Launcher music and SFX (PP3/PP4 `music/`, `sfx/`) |
| `.bank` | FMOD sound banks (Drawful 2, Survey Scramble); not directly playable, needs FMOD tools |
| `.swf` | Flash UI + embedded art, characters/avatars, animations (not extracted yet) |
| `.usm` | CRI video (intro/menu/lobby backgrounds) |
| `.png` / `.jpg` | Question images |
| `.icns` / `.ico` / `Assets.car` | App icons |

## 2. Questions / prompts (text)

Each game: `<games>/<Game>/content/*.jet`. Entry counts are the number of items in `content[]`.

### Party Pack 3: `PP3/games/`
| Game | File | Count | Notes |
|---|---|---|---|
| Quiplash 2 | `Quiplash2/content/QuiplashQuestion.jet` | 746 | main prompts (`prompt`, `safetyQuips`) |
| | `AudienceQuestion.jet` | 749 | audience prompts |
| | `SafetyQuips.jet` | 98 | fallback answers |
| | `AcroLash.jet` / `ComicLash.jet` / `WordLash.jet` / `WordLashWord.jet` | 50 / 22 / 17 / 47 | final-round modes |
| | `QuiplashQuestion.json`, `manifest.json` | | JSON duplicate + manifest |
| Trivia Murder Party | `triviadeath/content/TDQuestion.jet` | 1156 | `text`, `choices`, optional `pic` |
| | `TDFinalRound.jet` | 157 | |
| | `TDWorstDrawing.jet` / `TDWorstResponse.jet` | 67 / 126 | |
| | `wordlist.txt` | | word list |
| Fakin' It | `FakinIt/content/FakinItTasks.jet` | 453 | |
| | `FakinItInput.jet` / `FakinItCategories.jet` | 46 / 5 | |
| Poll Position (Guesspionage) | `PollPosition/content/PollPositionQuestions.jet` | 528 | |
| | `PollPositionBonusQuestions.jet` | 137 | |
| Awshirt (Tee K.O.) | `AwShirt/content/AwShirtDrawingSuggestions.jet` | 385 | |
| | `AwShirtSloganSuggestions.jet` | 253 | |
| | `AwShirtDrawings.jet` / `AwShirtSlogans.jet` | 361 / 249 | |

### Party Pack 4: `PP4/games/`
| Game | File | Count |
|---|---|---|
| Fibbage 3 | `Fibbage3/content/fibbageshortie.jet` | 503 |
| | `fibbagespecial.jet` / `finalfibbage.jet` / `tmishortie.jet` | 104 / 99 / 151 |
| Survive the Internet | `SurviveTheInternet/content/STIPrompt.jet` | 188 |
| | `STIPhotoPrompt.jet` / `STIStorePrompt.jet` / `STIJobPrompt.jet` | 195 / 58 / 38 |
| | `STITwist.jet`, `STIThemeIntro.jet`, `STITheme.jet` | 101 / 37 / 9 |
| | Gags: `STIMessengerGag`, `STIPopupAdGag`, `STIStickyNoteGag`, `STIWarningGag`, `STIAddressBarGag`, `STIBookmarkGag`, `STIDesktopFolderName`, `STIDesktopIcon`, `STIName` | 35 / 47 / 42 / 43 / 46 / 40 / 56 / 13 / 14 |
| Bracketeering | `Bracketeering/content/BRKPrompt.jet` | 325 |
| | `BRKBracket.jet` | 2 |
| Monster Seeks Monster | `MonsterMingle/content/MMMonster.jet` | 15 (monster definitions) |
| | `MMMonsterAudienceQuestion.jet` / `MMMonsterAudienceAnswer.jet` | 39 / 127 |
| | `MMMonsterNpcAnswer.jet` / `MMSecretWords.jet` / `MMSponsors.jet` | 62 / 99 / 34 |
| Civic Doodle | `Overdrawn/content/CivicDoodleFinal.jet` | 207 |
| | `CivicDoodleStartingArt.jet` / `CivicDoodleMapJokes.jet` | 50 / 37 |

### Drawful 2: `D2/content/`
- `D2/content/en/Drawful2Prompt.jet`: 1461 prompts. Other languages: `de/ es/ fr/ it/`.
- `D2/content/Drawful2Decoy.jet`, `Drawful2DecoyDrawings.jet`.

### Survey Scramble (demo): `SS/content/`
- `SS/content/en/BigSurveyQuestion.jet`: only 5 questions (demo).
- Other languages: `de es es-XL fr it pt-BR`.
- UI strings: `SS/Localization.json`, `SS/LocalizationManager.json`.

### UI/localization text
- `PP3/Localization.json`, `PP4/Localization.json`, `D2/Localization.json`, plus per-game `Localization.json` in PP4 games and Picker.

## 3. Audio

### 3a. Voice-over (one clip per prompt)
Stored next to the prompt, in a folder named by the prompt `id`:
`<Game>/content/<TypeFolder>/<id>/*.ogg` (+ a `data.jet` per folder)

Examples:
- `PP3/games/Quiplash2/content/QuiplashQuestion/19054/prompt.ogg` (+ `data.jet`)
- `PP3/games/triviadeath/content/TDQuestion/40527/546202_0f.ogg`
- `D2/content/en/Drawful2Prompt/<id>/`

Approximate `.ogg` totals: Quiplash2 1635, Trivia Murder 1997, Poll Position 1210, Fakin' It 632, Bracketeering 1362, Fibbage 3 1539, Drawful 2 1508.

### 3b. Music and SFX
- PP3/PP4 launcher: `PP3/music/BSFXBackgroundMainLoop.ogg|wav`, `PP3/sfx/BSFX*.ogg|wav` (PP4 `sfx/` has more, e.g. `BSFXLogoOn`). Both mirrored in `PP4/music`, `PP4/sfx`.
- Picker (menu) SFX: `PP3/games/Picker/sfx/`, `PP4/games/Picker/sfx/`.
- Drawful 2 (FMOD): `D2/Drawful2SFX.bank`, `Drawful2MUSIC.bank`, `Drawful2MUSIC.strings.bank`, `Drawful2HOST.bank`.
- Survey Scramble (FMOD): `SS/../../SFX.bank` etc.; actual files at `SS/SFX.bank`, `SS/Music.bank`, `SS/Host.strings.bank`, `SS/Pause.bank`; also top-level `Master Bank.bank`, `Loader_SFX.bank`, `Loader_Music.bank`, `PAUSE.bank`.
  - Event-name map: `SS/audiokeys.json` (e.g. `"mcMenuButton/Press": "SFX/StartMenu/ButtonPress"`).
- Hidden SFX inside the `.swf` files are not extracted yet.

## 4. Images

| Where | What |
|---|---|
| `PP3/games/triviadeath/content/TDQuestion/<id>/*.png` | 22 trivia pictures |
| `PP4/games/Fibbage3/content/<type>/<id>/*_1.png` | 43 portrait/answer images (`portrait` field) |
| `PP4/games/SurviveTheInternet/content/STIPhoto/*.jpg` | 264 photo-prompt images (`Airplane.jpg`, `ApplePicking.jpg`, ...) |
| `MP/app.asar` → `/.vite/renderer/main_window/assets/` | Megapicker UI: logos (`logo-side-*.png`), `tile-background-*.jpg`, `default-hero`, ratings (`esrb_m`, `pegi_16`), `0-7.png` |
| Everything else (backgrounds, UI, animations) | embedded inside `.swf` |

Extract the Megapicker assets with: `npx @electron/asar extract "<MP>/app.asar" /tmp/megapicker`

## 5. Character / avatar / icon selection

What I verified:
- `PP3/games/PollPosition/characters.json` is the only plain-text character list. It maps `id` (`PollPositionIcon00`...) to `name` (`vrman`, `scarflady`, `eyegadget`, `eagle2`, `businessman`, `boblady`, `dolphin`, ...) and an `audio` index. The artwork for these is in `PollPosition.swf`.
- `PP4/games/MonsterMingle/content/MMMonster.jet` has `frame`, `name`, `role` per monster. The frame is a frame number in `MonsterMingle.swf`.
- `SurviveTheInternet/content/STIDesktopIcon.jet` has `frame` indices into `SurviveTheInternet.swf`.
- Per-game avatars: only referenced by id. The images live in each game's main `.swf` (listed below); I did not open them.

Main swf per game (decompile with JPEXS FFDec to get the art):
- PP3: `Quiplash2/Quiplash2.swf`, `triviadeath/triviadeath.swf`, `FakinIt/FakinIt.swf`, `PollPosition/PollPosition.swf`, `AwShirt/AwShirt.swf`, `Picker/GamePicker.swf` (12 MB, the pack-menu art, biggest file)
- PP4: `Fibbage3/Fibbage3.swf`, `SurviveTheInternet/SurviveTheInternet.swf`, `Bracketeering/Bracketeering.swf`, `MonsterMingle/MonsterMingle.swf`, `Overdrawn/Overdrawn.swf`, `Picker/Picker.swf`, `Picker/PickerContent.swf`
- D2: `D2/swf/drawful2_*.swf` (background, gameplay, global, lobbyv2, menu, postgame, shortie, usergeneratedcontent) and `D2/Drawful2.swf`
- SS: `SS/swf/bigsurvey_*.swf` (postgame, scroll_search, scoreboard, group_vote, list, menu, background)
- Shared: `platform.swf`, `PauseDialog.swf`, `Loader.swf`, `TJPPLoader.swf` at each pack root

Not found locally: the phone/controller side (the player picks a name and avatar on jackbox.tv in a browser). That client is served from Jackbox's servers, so its icons are not in these folders.

## 6. App icons and videos
- `AppIcon.icns` + `Assets.car` in each `.app/Contents/Resources`; Windows `.ico` at `PP3/icons/win/app.ico`.
- Videos: `PP3/videos/developerintro.usm`; per-game `games/<Game>/videos/*.usm`; `SS/videos/{menuBg,lobbyBg,postgameBg}.usm`.

## 7. Other config
- `gameManifest.json` (pack game list), `jbg.config.jet` and `settings.jet` per game, `menu.jet`, `leaderboards.jet`, `TalkshowExport/` (project data), `Credits.html`.

## Gaps / next steps
- Megapicker's own game data (what it launches) is not in the asar listing I read; I only saw the first 60 lines of the listing.
- `.swf` contents (characters, avatars, in-game art, embedded SFX) need FFDec to enumerate.
- `.bank` files need FMOD Bank Tools for event names.
- All counts above are from the `.jet` `content[]` length; folders can hold extra, unused items.

---

# Part 2: findings from the deep-dive agents

These supersede the "Gaps / next steps" above where they overlap. Pack 4 `.swf` details are added in a later update.
Paths: `PP3`, `D2`, `SS`, `MP` as defined at the top. `<G>` = `<root>/games/<Game>`.

## A. Where the real art lives (Pack 3)
- No loose avatar/icon image files exist. The only PNGs are the 22 trivia pictures.
- `<G>/<Game>.swf` is a code stub. Character and UI art is in `<G>/TalkshowExport/project/actions/*.swf` (numeric names are Talkshow action ids).
- Host voice lines (plain ogg, no extraction needed): `<G>/TalkshowExport/project/media/*.ogg`
  - Quiplash2 532, triviadeath 2597, AwShirt 538, FakinIt 284, PollPosition 757.
- Prompt-specific ogg under `<G>/content/<Type>/<id>/` (the earlier section 3a): Quiplash2 2167, triviadeath 4594 (including TalkshowExport), AwShirt 538, FakinIt 916, PollPosition 1967.
- Videos (`.usm`): 51 in Pack 3 (`PP3/videos`, `PP3/games/*/videos`, `Picker/videos`).

## B. Character / avatar roster

| Game | Roster | Where |
|---|---|---|
| Quiplash 2 | 12: Blue, Coffin, Green, Kitten, Orange, Pink, Purple, Red, Star, Teal, Triclops, Yellow (`mcPlayerChar<Name>`) | `Quiplash2/TalkshowExport/project/actions/{4351,4352,4353,4355,4356,4927}.swf`; 4353.swf has 251 JPEG2 + 57 Lossless2 bitmaps |
| Trivia Murder Party | 9 colors: Blue, Gray, Green, Orange, Pink, Purple, Red, Yellow (`Player<Color>`, container `PlayerCharsAll`), plus `GhostIcon`, `AvatarPolaroidImage`, `PlayerPhotos` | `triviadeath/.../actions/{4093,4135,4162,4537,4685,5166,5246,5256}.swf`; `4116.swf` 362 JPEG3 |
| Fakin' It | abstract "player shapes", not characters (`playershapes`, `mcPlayerShapeAnim`), category icons (`mcCategoryIcons`), `LogoChars` | `FakinIt/.../actions/{5537,5539,5541}.swf` |
| Poll Position | 24 icons `PollPositionIcon00..23` (`characters.json` lists only 16: vrman, scarflady, businessman, eyegadget, boblady, goateeman, vrwoman, dog, dolphin, hatguy, eagle2, informant, robot, headphonesgirl, facemaskguy, radiooperator; ids 02, 08, 17, 19-23 are in the swf only) | `PollPosition/.../actions/4388.swf` (gameplay), `4389.swf` (20 Lossless bitmaps) |
| Tee K.O. (AwShirt) | 16: Baku, BlueDemon, Bun, Cat, Catfish, Crow, Dog, Fire, Fox, Hair, Kappa, Monkey, Raccoon, RedDemon, Snake, Umbrella (`contentPlayer<Name>`), plus `characterBlob` | `AwShirt/.../actions/6220.swf` (81 Lossless2), `6734.swf`, `5696.swf` |
| Drawful 2 | none pre-made. Players draw their own avatar in the lobby ("please draw: a picture of yourself"); the placeholder is `mcQuestionMark*`; two colors per player (`color0`, `color1`) | `D2/swf/drawful2_lobbyv2.swf`, `drawful2_shortie.swf` (`playerIcon`, `mcPlayerEntryPicture`) |
| Survey Scramble | no loose assets; all inside swf | `SS/swf/*.swf` |
| Megapicker | no avatars; mascots `sad-roomie` (800x800) and `gene` (1920x1080) | `MP` asar `assets/` |

Pack 3 shell art (controller/button glyphs): `PP3/Loader.swf`, `PauseContent*.swf`, `platform.swf`. Picker menu art: `Picker/GamePicker.swf` (7 Lossless2).

## C. Sound effects
- Pack 3 menu: `PP3/music/BSFXBackgroundMainLoop.*`, `PP3/sfx/BSFXStartButton{On,Press}.*`.
- Picker: `PP3/games/Picker/sfx/*.wav` (7: `BSFXSelectGame`, `BSFXBoxShuffle`, `BSFXHelpOff`, `Settings*`) plus 7 ogg.
- Embedded in swf (`DefineSound`): Quiplash2 `actions/{4351,4352,4353,4356}.swf` (60 each), AwShirt `actions/5690.swf` (16), FakinIt `actions/5539.swf` (5), `PauseContent*.swf` (5 each).
- Drawful 2: the `.bank` files are tiny shells (SFX 8 KB, HOST 1.4 KB, MUSIC 2.9 KB). The only embedded sample found is `D2CensorScribble1`. Event names are hashed; `MUSIC.strings.bank` only gives bus names (`HOST`, `MUSIC`, `DuckedByMusic`, `Reverb`). Other sounds are in swf (`Bloop` in `drawful2_shortie.swf`, 5 in `PauseContent.swf`).
- Survey Scramble: real FMOD audio: `SS/Music.bank` 43 MB, `SFX.bank` 13 MB, `Host.bank` 2.9 MB, `Pause.bank`, `Host.strings.bank`; 177 event keys in `SS/audiokeys.json`.

## D. Drawful 2 details
- Languages: en, fr, it, de, es (no Korean). 443 UI strings in `D2/Localization.json`.
- Prompts: `D2/content/<loc>/Drawful2Prompt.jet` → en 1461, fr 1461, it 1508, de 1480, es 1483. Field `x:true` = adult (en 184).
- Per-prompt data: `D2/content/<loc>/Drawful2Prompt/<id>/data.jet` (`QuestionText`, `AlternateSpellings`, `HasJokeAudio`, `JokeAudio`). Index ids and folder ids line up for en only; other locales may miss.
- Joke audio: `<id>/<audioId>_1f.ogg` (en 265, fr 305, it 286, de 343, es 309 = 1508).
- Decoys: `D2/content/Drawful2Decoy.jet` (112), stock drawings `Drawful2DecoyDrawings.jet` (8, line/point format).
- Host lines: `D2/TalkshowExport/project/media/*.ogg` (1674 files, 81 MB, 156424.ogg to 416078.ogg). The cue-to-text mapping was not decoded; use whisper or `Localization.json`.
- swf: `D2/swf/drawful2_{background,gameplay,global,lobbyv2,menu,postgame,shortie,usergeneratedcontent}.swf`. Notable symbols: owl mascot `owlbody`/`owleyes` (menu), thumbs `thumb0..7` and confetti (gameplay), `mcAudienceIcon` (global), `vipicon` (lobby), timers/scoreboard (shortie).
- `D2/videos/DeveloperIntro.usm` (43 MB). Credits in `D2/Credits.html`.

## E. Survey Scramble details (`SS`)
- 1668 files: 1588 ogg, 55 swf, 11 jet, 5 json, 5 bank, 3 usm, 1 html.
- Host voice: `SS/TalkshowExport/project/media/*.ogg` (1588, 49 MB, ids 43235 to 44956).
- swf: `SS/swf/` has 13 files: background, bounce, global, group_vote, horse_race, list, lobby, menu, pegs, postgame, scoreboard, scroll_search, tic_tac_toe. Talkshow `data/` has 37 swf (`start.swf`, `F_<id>.swf`).
- Questions: `SS/content/<lang>/BigSurveyQuestion.jet`, 5 per language (en, de, es, es-XL, fr, it, pt-BR). The demo only.
- Videos: `SS/videos/{lobbyBg,menuBg,postgameBg}.usm` (~20 MB each).

## F. Megapicker details (`MP`)
- app.asar (19.4 MB, Electron/Vue) has 451 files: 360 png, 69 jpg, 3 js, 1 css, 1 html, 1 json, 1 woff2. No audio, no questions, no avatars.
- Art: `assets/tile-background-*.jpg` 67, `tile-foil-*` 68, `tile-logo-*` 69, `tile-logo-gray-*` 69, `tile-logo-side-*` 67, `tile-logo-sticker-*` 41, `logo-side-*` 22, `0-7-*.png` (1920x1080), badges `esrb_m`, `pegi_16`.
- Game list: 38-entry array in `.vite/build/main.js`: Party Packs 1-12, Starter, Naughty Pack, 8 standalone games, 7 bundles, 9 soundtracks.
- Remote only: `https://cdn.jackboxgames.com/megapicker/images/` and `.../megapicker/v2/{production,qa}`.

## G. Extraction how-to (untested)
- Installed: Java, ffmpeg. Not installed: JPEXS FFDec, swftools.
- swf art: JPEXS FFDec, `java -jar ffdec.jar -export image,shape,sprite,sound,binaryData /tmp/out "<swf>"`. Characters are vector sprites; export as `sprite`/`shape`, not `image`. A scratch parser exists at `/tmp/swfscan.py` (symbol list; `ALL=1` for everything).
- `.usm` video: `ffmpeg -i x.usm out.mp4`, or vgmstream if ffmpeg fails.
- FMOD banks: python-fsb5 / vgmstream (Drawful 2); FMOD Bank Tools (Survey Scramble).
- Megapicker: `npx @electron/asar extract <MP>/app.asar /tmp/mp`.

---

# Part 3: Party Pack 4 deep dive

`$R` = `PP4`. Games at `$R/games/<G>/`. Totals under `$R`: 5982 ogg, 1499 jet, 264 jpg, 169 swf, 43 png, 19 usm, 12 wav, 9 json.
- Top-level `<G>/<G>.swf` is code only (MonsterMingle's is the exception, see below). Art is in `<G>/TalkshowExport/project/{actions,data,templates,plugins}/*.swf`.
- Loose images are only the 43 Fibbage 3 PNGs and the 264 STI jpgs.
- Correction to section 4: the 264 STI jpgs are 131 photos in `content/STIPhoto/` plus 132 `*-thumb.jpg` in `content/STIPhoto/Thumbnails/`. The 43 Fibbage PNGs are 512x512 RGBA question images in `content/fibbagespecial/<id>/`, not avatars.

## Avatar / character roster

| Game | Roster | Where (under `<G>/TalkshowExport/project/actions/`) |
|---|---|---|
| Monster Seeks Monster | 20 monster frames `Monster0..19` + `Human_Monster`; `MMMonster.jet` references 15 (Monster 0,2,3,4,5,6,7,8,9,10,12,13,15,16,18): Blob/Glob, InvisibleMan, Leprechaun, MonsterHunter, Mother, Mummy, PodPerson, SerialKiller, TwoFacedCreep, Vampire, VengefulGhost, VentriloquistPuppet, Werewolf, Witch, Zombie. `MMMonsterNpc.jet` = Robot (Monster17). Monster1/11/14/19 are unused by the jets | `7477.swf` (lobby, 24 bitmaps), `7592.swf` (78), `7593.swf`, `7732.swf`, `7807.swf` (reveal: `MonsterReveal`, `MonsterFull`; 67 bitmaps). Also `MonsterMingle.swf` itself is 3.9 MB with 2628 lossless bitmaps (mostly emoji sprites named by Unicode codepoint) |
| Survive the Internet | 9 colors (Pink, Purple, Blue, Teal, Green, Yellow, Orange, Red, Gray) + mascot Gene; `AvatarStates<Color>`, `PlayerAvatarsSad`, `AvatarBestBurn`, `WinGene`, `WriteGene`, `LobbyAvatars`, `AudienceAvatar` | `7600.swf` (473 bitmaps), `7603.swf` (360), `7604.swf` (42), `7458.swf` (lobby, 37); desktop icons in `7674.swf` (`DesktopIcons`, `jokeIcons`) |
| Fibbage 3 | 8 avatars `Avatar1..8` (lobby also `NewAvatar1/2`) | `7380.swf` (intro), `7381.swf` (494 bitmaps), `7385.swf` (lobby), `7384.swf` (scoreboard) |
| Bracketeering | player-art slots: `mcPlayerAvatar`, `playerArt`, `SquarePlayerAvatarImage`, `smallplayericon`, `mcVipPlayerWidget` | `8042.swf` (131 bitmaps), `8043.swf`, `8433.swf` |
| Civic Doodle (Overdrawn) | no avatars; `Nametags`, `mcPlayerContainer`, `VIPbadge`, `DrawingCanvas`, `PostCard` | `8109.swf`; logo `mcLogoComplete` in `8114.swf`, `9118.swf` |
| Picker | no characters; UI only (`PickerContent.swf` 9.6 MB, 10 bitmaps) | `games/Picker/PickerContent.swf`, `content.json` (game list, player counts) |

Other Pack 4 content ids: `STIDesktopIcon.jet` (13 entries, frames `Joke0..N`, jokes 6-9 are holidays), `STIName.jet` (14 fake names).

## Pack 4 sound
- Menu: `$R/sfx/` (BSFXLogoOn, BSFXStartButtonOn, BSFXStartButtonPress, BSFXStartOn; each ogg + wav), `$R/music/BSFXBackgroundMainLoop.{ogg,wav}`.
- Picker: `games/Picker/sfx/` 7 sounds (BSFXBoxShuffle, BSFXHelpOff, BSFXSelectGame, SettingsHighlight, SettingsToggleOnOff, SettingsVolumeUpDown, SettingsWindowOnOff), ogg + wav.
- Per-game Talkshow audio `<G>/TalkshowExport/project/media/<id>.ogg` (numeric ids, a mix of host VO, SFX and music): Bracketeering 566, Fibbage3 628, MonsterMingle 790, Overdrawn 698, SurviveTheInternet 387.
- Content VO: Bracketeering 1362, Fibbage3 1539 (`<id>/<n>_0.ogg` or `_1.ogg`, matching the jet id).
- Videos (`.usm`, 19 total): Fibbage3 (LikesAward, Logo, Photo, Round0/1/2, Russian, SayWhat, TMILogo, TMIRound0/1), STI `Intro.usm`, Picker previews (6), `$R/videos/developerintro.usm`.

## Extraction priorities
1. FFDec on `MonsterMingle/.../7477.swf` and `7807.swf`, `SurviveTheInternet/.../7600.swf` and `7604.swf`, `Fibbage3/.../7385.swf` and `7381.swf`, `Bracketeering/.../8043.swf`. Use `-export sprite,image,shape`.
2. Loose files can be copied as-is: STI photos, Fibbage PNGs, all ogg.
3. Python alternative: Lossless = zlib pixel data; JPEG2/3 = embedded JPEG (+ zlib alpha). Vector shapes need a renderer, so FFDec is better for avatars.
- Mapping id → meaning for Talkshow media ogg is only in the actions swf bytecode, not in readable text (applies to all games).
