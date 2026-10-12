# Sound dictionary

Every moment should have a sound (RULEBOOK §8). This is the lookup for *which* sound, what exists, what is missing, and how to replace synth sounds with real recordings.

## 1. Built-in names (synthesised in `core/sfx.js`; any can be replaced by an mp3 of the same name)
| Name | Character | Use for |
|---|---|---|
| `tap` | tiny soft click | any button press (default for `data-send`) |
| `pop` | quick bubble pop, pitch drops | submit, select, avatar pick, a clue appearing |
| `join` | two rising notes | a player joins (host plays it automatically) |
| `honk` | goose/clown honk | lobby noise button, silly moments |
| `boing` | spring | lobby noise, bounce, "wrong but funny" |
| `toot` | the fart | lobby noise, embarrassing reveal |
| `aha` | "ah-HA!" two voiced notes | discovery, accusation, discussion starts |
| `ding` | bell, 1318 Hz | correct, point scored, ready |
| `buzz` | low square buzz | wrong, time's up, rejected |
| `error` | two falling blips | invalid input |
| `whoosh` | filtered noise sweep up | screen/round transition |
| `tick` | dry clock tick | timers, turn indicator (use only in the last seconds — never every second) |
| `drumroll` | building snare roll (1 s) | before a vote result / reveal |
| `fanfare` | 4-note brass arpeggio + long note | final results, game start |
| `win` | rising 5-note sparkle | personal victory |
| `lose` | falling "wah-wah-wah" | personal loss |
| `reveal` | noise rise then a ding | showing a result |
| `cheer` | crowd-noise swell | group success |

Voices (`voice:` in `client.js`) re-colour all of them: `cartoon` (default), `classy` (sine, lower, longer), `retro` (square chip), `digital` (saw, high, short).

## 2. Moment → sound (default mapping; override per theme)
| Moment | Default | Notes |
|---|---|---|
| Player joins (big screen) | `join` | automatic |
| Button tap | `tap` | `data-sfx` overrides |
| Submit an answer / clue | `pop` | once only — see RULEBOOK §8 "one source per moment" |
| Choose/lock a vote | `tap` → `pop` | |
| Screen/round starts | `whoosh` | via `screenSfx` |
| Timer last 5 s | `tick` | start late; never constant |
| Time's up | `buzz` | |
| Invalid action | `error` | per-player |
| Build-up to a reveal | `drumroll` | ≤ 1.5 s |
| Reveal | `reveal` | |
| Point(s) gained | `ding` | pitch up for bigger gains (future: pass a pitch) |
| Round win / loss (personal) | `win` / `lose` | `room.sfx(name, to=player)` |
| Group success | `cheer` | |
| Final results | `fanfare` | |
| Lobby noise button | cycle `honk boing toot pop aha` | themeable via `lobbySounds` |
| Open/close dialog | `pop` | automatic in `Party.ask` |
| Sound toggled / volume | `pop` | automatic |

## 3. Wish-list (not built — synthesise in `sfx.js` or record; mark ✅ when done)
| Sound | Descriptor | Moment | Status |
|---|---|---|---|
| `tongue` | wet "thwip" snap | chameleon clue reveal, catching someone | todo |
| `slidewhistle` | rising/falling slide whistle | silly transitions | todo |
| `rimshot` | ba-dum-tss | after a joke answer is revealed | todo |
| `gasp` | crowd gasp | shocking reveal | todo |
| `applause` | clap crowd, 2 s | great answer | todo |
| `airhorn` | MLG air horn | over-the-top win | todo |
| `scratch` | record scratch | "wait, what?" twist | todo |
| `dundun` | dun-dun-DUN | accusation / caught | todo |
| `kaching` | cash register | points / money themes | todo |
| `countdown` | 3-2-1 beeps | reaction games | todo |
| `typewriter` | key clacks | hacker / detective themes | todo |
| `sparkle` | glittery chime | bonus | todo |
| `pageturn` | paper flip | old-money / story themes | todo |
| `cork` | champagne cork + fizz | old-money win | todo |
| `buzzer_wrong` | game-show wrong buzzer | wrong answers (louder than `buzz`) | todo |
| `ghost` | spooky "ooOOoo" | spooky themes | todo |
| `laser` | pew | arcade / space themes | todo |
| `coin` | 8-bit coin pickup | arcade scoring | todo |
| `tada` | short orchestral "ta-da!" | success | todo |
| `sadtrombone` | wah-wah-waaah | failure (a real recording sounds best) | todo |

## 4. Replacing synth sounds with real files
1. Put `name.mp3|ogg|wav|m4a` in `sounds/` (all games) or `games/<id>/sounds/` (one game; wins over global). Same name as a built-in = replacement; a new name is playable with `room.sfx('myname')` / `data-sfx="myname"`.
2. Reload the page. The synth plays the first time while the file loads.
3. Keep clips < 3 s, volume-normalised, no leading silence. **Safari cannot decode `.ogg`** → prefer `.mp3`/`.m4a`/`.wav` for phones.
4. Audio files are gitignored (`sounds/*.mp3` etc.); games must stay fully playable with the synth.

## 5. Local reference recordings (Jackbox menu sounds, personal use)
Copied to `sounds/_reference/jackbox/pp3|pp4/` (ogg + wav; **not** auto-played). Suggested mapping — *by name only, not yet auditioned; listen and adjust*:
| File | Suggested use | Candidate for |
|---|---|---|
| `BSFXStartButtonOn` | element appears / hover | `tap` (soft) |
| `BSFXStartButtonPress` | button press | `tap` / `pop` |
| `BSFXStartOn`, `BSFXLogoOn` | logo / game-start sting | `fanfare` (start) |
| `BSFXBoxShuffle` | shuffling items | `whoosh` / lobby shuffle |
| `BSFXSelectGame` | confirm a choice | `join` / `pop` |
| `BSFXHelpOff` | close/dismiss | dialog close |
| `SettingsHighlight` | focus/hover | `tick` |
| `SettingsToggleOnOff` | switch | mute toggle |
| `SettingsVolumeUpDown` | volume | volume feedback |
| `SettingsWindowOnOff` | open/close panel | dialog open |
| `BSFXBackgroundMainLoop` | looping menu music | lobby music (future) |
To try one: copy e.g. `pp3/BSFXSelectGame.wav` to `sounds/join.wav`, reload. Delete it to go back to the synth.
