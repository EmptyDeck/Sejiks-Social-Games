/* Cedric's Party Games — sound effects.
 * Every sound is synthesised with WebAudio (no files needed), AND any file dropped into
 *   sounds/<name>.mp3                      (all games)
 *   games/<id>/sounds/<name>.mp3           (one game, wins over the global one)
 * replaces the synth version of <name> automatically. See sounds/README.md.
 *
 * A game picks a "voice" (overall character of the synth) with  theme.voice:
 *   cartoon (default) · classy · retro · digital
 */
(function () {
  const S = (window.PartySfx = {});
  let ctx = null, master = null, muted = localStorage.getItem('party.mute') === '1';
  let voice = 'cartoon', custom = {}, buffers = {};

  const VOICES = {
    cartoon: { wave: null, pitch: 1.0, gain: 1.0, decay: 1.0 },
    classy:  { wave: 'sine', pitch: 0.85, gain: 0.8, decay: 1.5 },
    retro:   { wave: 'square', pitch: 1.0, gain: 0.55, decay: 0.7 },
    digital: { wave: 'sawtooth', pitch: 1.5, gain: 0.5, decay: 0.6 },
  };

  S.names = ['tap', 'pop', 'join', 'honk', 'boing', 'toot', 'aha', 'ding', 'buzz', 'error', 'whoosh',
             'tick', 'drumroll', 'fanfare', 'win', 'lose', 'reveal', 'cheer'];

  S.unlock = function () {
    if (!ctx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return;
      ctx = new AC();
      master = ctx.createGain();
      master.gain.value = muted ? 0 : 0.6;
      master.connect(ctx.destination);
    }
    if (ctx.state === 'suspended') ctx.resume();
  };
  S.isMuted = () => muted;
  S.setMuted = function (m) {
    muted = m;
    localStorage.setItem('party.mute', m ? '1' : '0');
    if (master) master.gain.value = m ? 0 : 0.6;
  };
  S.setVoice = function (v) { voice = VOICES[v] ? v : 'cartoon'; };

  // Load the list of custom files once; decode lazily on first play.
  S.loadCustom = function (gameId) {
    return fetch('sounds/index.json').then(r => r.json()).then(idx => {
      custom = Object.assign({}, idx.global, (idx.games && idx.games[gameId]) || {});
      Object.keys(custom).forEach(k => { custom[k] = custom[k].replace(/^\//, ''); });
      buffers = {};
    }).catch(() => {});
  };

  function playFile(name) {
    if (!custom[name] || !ctx) return false;
    if (buffers[name]) {
      const src = ctx.createBufferSource();
      src.buffer = buffers[name];
      src.connect(master);
      src.start();
      return true;
    }
    if (buffers[name] === undefined) {
      buffers[name] = null;
      fetch(custom[name]).then(r => r.arrayBuffer()).then(b => ctx.decodeAudioData(b))
        .then(buf => { buffers[name] = buf; }).catch(() => { delete custom[name]; });
    }
    return false;   // first call falls back to the synth while the file loads
  }

  // ── synth building blocks ──
  const V = () => VOICES[voice];
  function env(g, t, a, d, peak) {
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(Math.max(peak, 0.0002), t + a);
    g.gain.exponentialRampToValueAtTime(0.0001, t + a + d);
  }
  function tone(freq, dur, o) {
    o = o || {};
    const v = V(), t = ctx.currentTime + (o.at || 0);
    const osc = ctx.createOscillator(), g = ctx.createGain();
    osc.type = o.fixed ? o.type : (v.wave || o.type || 'sine');
    const f = freq * v.pitch;
    osc.frequency.setValueAtTime(f, t);
    if (o.to) osc.frequency.exponentialRampToValueAtTime(o.to * v.pitch, t + dur);
    let node = osc;
    if (o.lp) { const lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = o.lp; osc.connect(lp); node = lp; }
    if (o.vib) {
      const l = ctx.createOscillator(), lg = ctx.createGain();
      l.frequency.value = o.vib[0]; lg.gain.value = o.vib[1];
      l.connect(lg); lg.connect(osc.frequency); l.start(t); l.stop(t + dur + 0.1);
    }
    node.connect(g); g.connect(master);
    env(g, t, o.attack || 0.01, dur * v.decay, (o.gain || 0.3) * v.gain);
    osc.start(t); osc.stop(t + dur * v.decay + 0.2);
  }
  function noise(dur, o) {
    o = o || {};
    const t = ctx.currentTime + (o.at || 0), v = V();
    const len = Math.max(1, Math.floor(ctx.sampleRate * dur));
    const buf = ctx.createBuffer(1, len, ctx.sampleRate), d = buf.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
    const src = ctx.createBufferSource(); src.buffer = buf;
    const bp = ctx.createBiquadFilter(); bp.type = o.type || 'bandpass';
    bp.frequency.setValueAtTime(o.from || 1000, t);
    if (o.to) bp.frequency.exponentialRampToValueAtTime(o.to, t + dur);
    bp.Q.value = o.q || 1;
    const g = ctx.createGain();
    src.connect(bp); bp.connect(g); g.connect(master);
    env(g, t, o.attack || 0.02, dur, (o.gain || 0.3) * v.gain);
    src.start(t);
  }

  const SOUNDS = {
    tap()   { tone(900, 0.04, { type: 'triangle', gain: 0.12 }); },
    pop()   { tone(700, 0.09, { to: 140, gain: 0.35 }); },
    join()  { tone(523, 0.12, { type: 'triangle' }); tone(784, 0.2, { type: 'triangle', at: 0.09 }); },
    honk()  { tone(230, 0.28, { type: 'sawtooth', to: 200, lp: 1400, vib: [14, 6], gain: 0.35 }); },
    boing() { tone(180, 0.45, { to: 520, vib: [18, 40], gain: 0.35 }); },
    toot()  { tone(75, 0.4, { type: 'sawtooth', to: 48, lp: 500, vib: [31, 14], gain: 0.5, fixed: true });
              noise(0.3, { type: 'lowpass', from: 300, gain: 0.12 }); },
    aha()   { tone(330, 0.14, { type: 'sawtooth', lp: 1100, gain: 0.3 }); tone(494, 0.3, { type: 'sawtooth', lp: 1600, at: 0.16, gain: 0.3 }); },
    ding()  { tone(1318, 0.7, { gain: 0.3 }); tone(2637, 0.4, { gain: 0.1 }); },
    buzz()  { tone(110, 0.3, { type: 'square', lp: 900, gain: 0.3, fixed: true }); },
    error() { tone(300, 0.14, { type: 'square', gain: 0.2 }); tone(200, 0.24, { type: 'square', at: 0.14, gain: 0.2 }); },
    whoosh(){ noise(0.45, { from: 300, to: 3200, q: 0.8, gain: 0.35 }); },
    tick()  { tone(1000, 0.03, { type: 'square', gain: 0.1, fixed: true }); },
    drumroll() { for (let i = 0; i < 18; i++) noise(0.06, { from: 180, q: 0.7, gain: 0.1 + i * 0.012, at: i * 0.055 }); },
    fanfare()  { [523, 659, 784, 1047].forEach((f, i) => tone(f, 0.28, { type: 'sawtooth', lp: 2400, at: i * 0.12, gain: 0.22 }));
                 tone(1047, 0.7, { type: 'sawtooth', lp: 2400, at: 0.5, gain: 0.25 }); },
    win()   { [523, 659, 784, 1047, 1319].forEach((f, i) => tone(f, 0.22, { type: 'triangle', at: i * 0.09, gain: 0.28 })); },
    lose()  { [392, 370, 349, 311].forEach((f, i) => tone(f, 0.32, { type: 'sawtooth', lp: 900, at: i * 0.28, gain: 0.25, to: f * 0.96 })); },
    reveal(){ noise(0.35, { from: 400, to: 4000, q: 1.2, gain: 0.2 }); tone(880, 0.5, { at: 0.3, gain: 0.25 }); },
    cheer() { noise(0.8, { from: 1800, q: 0.5, attack: 0.25, gain: 0.3 }); noise(0.8, { from: 900, q: 0.5, attack: 0.25, gain: 0.2 }); },
  };

  S.play = function (name) {
    if (muted || !ctx) return;
    try {
      if (playFile(name)) return;
      const fn = SOUNDS[name];
      if (fn) fn();
    } catch (e) { /* audio must never break the game */ }
  };
})();
