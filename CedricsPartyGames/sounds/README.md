# Custom sounds

Drop audio files here to replace the built-in synthesised sounds in **every** game, or into
`games/<game-id>/sounds/` for one game. The file name (without extension) is the sound name:

    sounds/honk.mp3      replaces the built-in "honk"
    sounds/toot.mp3      replaces the "fart" sound
    sounds/aha.mp3  ding.mp3  boing.mp3  pop.mp3  tap.mp3  join.mp3  buzz.mp3  error.mp3
    sounds/whoosh.mp3  tick.mp3  drumroll.mp3  fanfare.mp3  win.mp3  lose.mp3  reveal.mp3  cheer.mp3

Any other name can be triggered from a game with `room.sfx('myname')`.
Formats: mp3, ogg, wav, m4a. Keep clips short (< 3 s) and normalised in volume. Reload the page to pick up changes.

Audio files are **gitignored** so the public repository doesn't carry copyrighted clips
(`git add -f` if you really want to commit one). Games must still work with the built-in sounds.
