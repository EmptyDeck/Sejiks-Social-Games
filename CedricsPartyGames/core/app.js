/* Cedric's Party Games — client core.
 *
 * One page (index.html) is both the big screen (/host) and the phone (/).
 * The server pushes a complete `view` after every change; this file renders it.
 * A game only provides  Party.game({ id, strings, host(v,ctx), player(v,ctx), ... })  — see RULEBOOK.md §6.
 */
(function () {
  'use strict';
  const P = (window.Party = { games: {} });
  const $ = s => document.querySelector(s);
  const isHost = location.pathname.replace(/\/+$/, '').endsWith('/host');
  const AVATARS = ['😀', '😎', '🤠', '🥳', '🤓', '😈', '👻', '🤖', '👽', '🐵', '🐶', '🐱', '🦊', '🐼', '🐸', '🐙', '🦄', '🐲', '🍕', '🌮', '🍩', '🚀', '⚡', '🔥'];
  const DEFAULT_HONKS = ['honk', 'boing', 'toot', 'pop', 'aha'];

  // ───────────── i18n ─────────────
  const CORE_STRINGS = {
    en: {
      'brand': "Cedric's Party Games",
      'err.badcode': 'No room with that code.', 'err.started': 'That game has already started.',
      'err.full': 'That room is full.', 'err.needplayers': 'Not enough players with names yet.',
      'err.nogame': 'Unknown game.', 'err.badgame': 'That game failed to load — check the server log.',
      'net.offline': 'Connection lost — reconnecting…', 'net.replaced': 'This room is open in another tab or app. Use that one — or tap below to use this one.', 'net.useHere': 'Use this tab', 'loading': 'Loading…',
      'join.title': 'Enter the room code', 'join.btn': 'Join',
      'join.hint': 'The 4 letters on the big screen',
      'lobby.name': 'Your name', 'lobby.icon': 'Pick your icon', 'lobby.honk': 'Tap for noise!',
      'lobby.start': 'Start game', 'lobby.need': 'Need {n} more player(s) with names',
      'lobby.nameFirst': 'Type your name to get ready',
      'lobby.waiting': 'Waiting for the admin to start…', 'lobby.chooseGame': 'Choose a game', 'lobby.pickWait': 'Waiting for the admin to choose a game…', 'lobby.gameIs': 'Game: {title}', 'err.nogamepicked': 'Choose a game first.', 'lobby.closeRoom': 'Close room', 'lobby.leaderYou': 'You are the admin', 'lobby.startAsk': "Everyone's in — start the game",
      'lobby.areYou': 'Are you Cedric?', 'lobby.yes': 'Yes', 'lobby.pinTitle': 'Enter your PIN', 'lobby.noLeader': 'Waiting for Cedric to take charge…',
      'err.pin': 'Wrong PIN.', 'err.pinlock': 'Too many tries — wait 30 seconds.', 'leader': 'ADMIN', 'modal.ok': 'OK',
      'lobby.goTo': 'On your phone, go to', 'lobby.enter': 'and enter', 'lobby.orScan': 'or scan',
      'lobby.count': '{n} players', 'chat.done': 'Done — I\'m ready', 'chat.edit': 'Edit name / icon', 'chat.title': 'Say something to the room', 'chat.ph': 'Type a message…', 'chat.send': 'Send', 'chat.room': 'Room chat', 'chat.empty': 'Nobody has said anything yet…', 'lobby.empty': 'Waiting for players…',
      'lobby.noname': 'Typing…', 'lobby.hostStart': 'Start now',
      'host.pick': 'Pick a game', 'host.range': '{min}+ players', 'host.noGames': 'No games found in games/',
      'lobby.back': '← Change game', 'lobby.leave': 'Leave room', 'err.closed': 'The host closed the room.',
      'menu.closeConfirm': 'Close this room? Everyone goes back to the start.', 'menu.end': 'End game', 'menu.close': 'Close room', 'modal.cancel': 'Cancel', 'menu.confirm': 'End the game and go back to the lobby?',
      'menu.mute': 'Sound', 'menu.skip': 'Skip',
    },
    ko: {
      'brand': '세드릭의 파티 게임즈',
      'err.badcode': '그 코드의 방이 없어요.', 'err.started': '이미 시작된 게임이에요.',
      'err.full': '방이 가득 찼어요.', 'err.needplayers': '이름을 입력한 플레이어가 아직 부족해요.',
      'err.nogame': '알 수 없는 게임이에요.', 'err.badgame': '게임을 불러오지 못했어요. 서버 로그를 확인하세요.',
      'net.offline': '연결이 끊겼어요 — 다시 연결 중…', 'net.replaced': '이 방이 다른 탭이나 앱에서 열려 있어요. 그쪽을 쓰거나, 아래를 눌러 여기서 계속하세요.', 'net.useHere': '여기서 계속하기', 'loading': '불러오는 중…',
      'join.title': '방 코드를 입력하세요', 'join.btn': '입장',
      'join.hint': '큰 화면에 보이는 4글자',
      'lobby.name': '이름', 'lobby.icon': '아이콘 고르기', 'lobby.honk': '눌러서 소리내기!',
      'lobby.start': '게임 시작', 'lobby.need': '이름을 입력한 플레이어가 {n}명 더 필요해요',
      'lobby.nameFirst': '이름을 입력하면 준비 완료',
      'lobby.waiting': '관리자가 시작하기를 기다리는 중…', 'lobby.chooseGame': '게임 고르기', 'lobby.pickWait': '관리자가 게임을 고르는 중…', 'lobby.gameIs': '게임: {title}', 'err.nogamepicked': '먼저 게임을 고르세요.', 'lobby.closeRoom': '방 닫기', 'lobby.leaderYou': '당신이 관리자예요', 'lobby.startAsk': '다 들어왔나요? 게임 시작',
      'lobby.areYou': '세드릭이세요?', 'lobby.yes': '네', 'lobby.pinTitle': 'PIN 번호를 입력하세요', 'lobby.noLeader': '세드릭이 오기를 기다리는 중…',
      'err.pin': 'PIN이 틀렸어요.', 'err.pinlock': '너무 많이 틀렸어요 — 30초 뒤에 다시 시도하세요.', 'leader': '관리자', 'modal.ok': '확인',
      'lobby.goTo': '폰으로 접속하세요:', 'lobby.enter': '그리고 코드 입력', 'lobby.orScan': '또는 QR 스캔',
      'lobby.count': '{n}명', 'chat.done': '완료 — 준비됐어요', 'chat.edit': '이름/아이콘 수정', 'chat.title': '방에 한마디 하기', 'chat.ph': '메시지를 입력하세요…', 'chat.send': '보내기', 'chat.room': '방 채팅', 'chat.empty': '아직 아무도 말이 없어요…', 'lobby.empty': '플레이어를 기다리는 중…',
      'lobby.noname': '입력 중…', 'lobby.hostStart': '지금 시작',
      'host.pick': '게임을 고르세요', 'host.range': '{min}명 이상', 'host.noGames': 'games/ 폴더에 게임이 없어요',
      'lobby.back': '← 게임 다시 고르기', 'lobby.leave': '방 나가기', 'err.closed': '방장이 방을 닫았어요.',
      'menu.closeConfirm': '방을 닫을까요? 모두 처음 화면으로 돌아갑니다.', 'menu.end': '게임 종료', 'menu.close': '방 닫기', 'modal.cancel': '취소', 'menu.confirm': '게임을 끝내고 로비로 돌아갈까요?',
      'menu.mute': '소리', 'menu.skip': '건너뛰기',
    },
  };
  let lang = localStorage.getItem('party.lang') || 'en';
  let gameStrings = { en: {}, ko: {} };
  const fill = (s, p) => s.replace(/\{(\w+)\}/g, (_, k) => (p && p[k] !== undefined ? p[k] : '{' + k + '}'));
  function T(key, params) {
    const s = (gameStrings[lang] && gameStrings[lang][key]) || gameStrings.en[key] ||
              (CORE_STRINGS[lang] && CORE_STRINGS[lang][key]) || CORE_STRINGS.en[key] || key;
    return fill(s, params);
  }
  // L(): pick the current language out of a {en, ko} content object (or pass plain strings through)
  const L = o => (o && typeof o === 'object') ? (o[lang] || o.en || Object.values(o)[0] || '') : (o == null ? '' : String(o));
  const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  // ───────────── state ─────────────
  const S = { ws: null, view: null, def: null, gameId: null, loading: null, offset: 0, online: false,
              token: null, code: null, hostToken: null, lastHtml: null, lastKey: null, lastScreen: null,
              prevCount: 0, honkIdx: 0, launcher: null, joinError: '', backoff: 500 };
  P.state = S;
  P.T = T; P.L = L; P.esc = esc;
  P.sfx = n => PartySfx.play(n);
  P.game = def => { P.games[def.id] = def; };
  const serverNow = () => Date.now() + S.offset;

  // ───────────── networking ─────────────
  const wsUrl = new URL('ws', location.href);
  wsUrl.protocol = location.protocol === 'https:' ? 'wss:' : 'ws:';
  const send = o => { if (S.ws && S.ws.readyState === 1) S.ws.send(JSON.stringify(o)); };
  P.send = a => send({ t: 'act', a });

  function connect() {
    const ws = (S.ws = new WebSocket(wsUrl));
    ws.onopen = () => {
      S.online = true; S.backoff = 500; chrome();
      if (isHost) {
        const h = sessionStorage.getItem('party.host');
        if (h) { const o = JSON.parse(h); send({ t: 'host_resume', code: o.code, hostToken: o.hostToken }); }
        else send({ t: 'host' });                         // the laptop just displays: a fresh room is created automatically
      } else {
        const code = (S.code || new URLSearchParams(location.search).get('room') || '').toUpperCase();
        if (code.length === 4) tryJoin(code);
      }
      render();
    };
    ws.onclose = () => {
      S.online = false; chrome();
      if (S.replaced) return;                             // another tab took over: don't fight it by reconnecting
      setTimeout(connect, S.backoff); S.backoff = Math.min(S.backoff * 1.6, 5000);
    };
    ws.onmessage = e => onMsg(JSON.parse(e.data));
  }
  function tryJoin(code) {
    S.code = code;
    send({ t: 'join', code, token: localStorage.getItem('party.tok.' + code) || '', name: localStorage.getItem('party.name') || '' });
  }

  function onMsg(m) {
    if (m.t === 'view') {
      S.offset = m.now - Date.now();
      const prevView = S.view;
      S.view = m;
      if (isHost && prevView && prevView.phase === 'lobby' && m.phase === 'lobby' && m.players.length > S.prevCount) P.sfx('join');
      S.prevCount = m.players.length;
      S.knownIds = new Set(prevView ? prevView.players.map(p => p.id) : []);   // who was already on screen: only newcomers animate
      if ((S.gameId || null) === (m.game_id || null) && (S.def || !m.game_id)) { onViewChanged(prevView); render(); }
      else { render(); ensureGame(m.game_id).then(() => { onViewChanged(prevView); render(); }); }
    } else if (m.t === 'joined') {
      localStorage.setItem('party.tok.' + m.code, m.token);
      S.joinError = '';
    } else if (m.t === 'hosted') {
      S.code = m.code; S.hostToken = m.hostToken;
      sessionStorage.setItem('party.host', JSON.stringify({ code: m.code, hostToken: m.hostToken }));
    } else if (m.t === 'closed' || m.t === 'left') {
      if (isHost) { sessionStorage.removeItem('party.host'); }
      else {
        if (S.code) localStorage.removeItem('party.tok.' + S.code);
        history.replaceState(null, '', location.pathname);       // forget ?room= so we don't auto-rejoin
        S.joinError = m.t === 'closed' ? T('err.closed') : '';
      }
      S.view = null; S.code = null; S.hostToken = null; S.lastHtml = null; S.lastKey = null;
      document.body.removeAttribute('data-game'); S.gameId = null; S.def = null;
      if (isHost) send({ t: 'host' });
      render();
    } else if (m.t === 'replaced') {
      S.replaced = true;
      setScreen('<div class="screen center"><p>' + T('net.replaced') + '</p><button class="btn" data-core="reload">' + T('net.useHere') + '</button></div>', 'replaced');
    } else if (m.t === 'authed') {
      P.sfx('win');
    } else if (m.t === 'sfx') {
      P.sfx(m.name);
    } else if (m.t === 'honk') {
      P.sfx(m.sound);
      const el = document.querySelector('[data-pid="' + m.pid + '"] .avatar');
      if (el) { el.classList.remove('honk'); void el.offsetWidth; el.classList.add('honk'); }
    } else if (m.t === 'error') {
      if (m.key === 'err.badcode') {
        if (isHost) sessionStorage.removeItem('party.host');
        else { S.view = null; S.code = null; }
      }
      S.joinError = T(m.key);
      toast(T(m.key));
      P.sfx('error');
      render();
    }
  }

  function ensureGame(id) {
    if (!id) {                                           // no game chosen yet: plain brand look
      S.gameId = null; S.def = null; gameStrings = { en: {}, ko: {} };
      document.body.removeAttribute('data-game'); PartySfx.setVoice('cartoon'); $('#decor').innerHTML = '';
      return Promise.resolve();
    }
    if (S.gameId === id && S.def) return Promise.resolve();
    if (S.loading && S.loading.id === id) return S.loading.p;
    const p = new Promise(res => {
      if (!document.querySelector('link[data-game-css="' + id + '"]')) {
        const css = document.createElement('link');
        css.rel = 'stylesheet'; css.href = 'games/' + id + '/theme.css'; css.dataset.gameCss = id;
        document.head.appendChild(css);
      }
      // Every game's client.js runs inside its own function scope, so two games (or the same game picked twice)
      // can both declare top-level `const lead = …` without a "has already been declared" SyntaxError.
      const finish = err => {
        S.loadError = err ? String(err.message || err) : null;
        if (err) console.error('game failed to load:', id, err);
        S.def = P.games[id] || null; S.gameId = id; S.loading = null;
        gameStrings = (S.def && S.def.strings) || { en: {}, ko: {} };
        gameStrings.en = gameStrings.en || {};
        PartySfx.setVoice(S.def && S.def.voice);
        PartySfx.loadCustom(id);
        document.body.dataset.game = id;
        $('#decor').innerHTML = (S.def && S.def.decor) ? S.def.decor() : '';
        res();
      };
      fetch('games/' + id + '/client.js', { cache: 'no-cache' }).then(r => r.text()).then(src => {
        const js = document.createElement('script');
        js.textContent = '(function(){\n' + src + '\n})();\n//# sourceURL=games/' + id + '/client.js';
        document.head.appendChild(js);
        finish(null);
      }).catch(finish);
    });
    S.loading = { id, p };
    return p;
  }

  function onViewChanged(prev) {
    const v = S.view;
    if (!v || v.phase !== 'game' || !v.game) { S.lastScreen = null; return; }
    const key = v.game.screen + '|' + (v.game.round == null ? '' : v.game.round);
    if (key !== S.lastScreen) {
      S.lastScreen = key;
      const m = S.def && S.def.screenSfx;
      if (m && m[v.game.screen]) P.sfx(m[v.game.screen]);
    }
  }

  // ───────────── rendering ─────────────
  const avatarList = () => (S.def && S.def.avatars) || AVATARS;
  const glyph = a => avatarList()[a % avatarList().length];
  const avatarSfx = a => { const ch = S.def && S.def.characters; return ch ? (ch[a % ch.length] || 'pop') : 'pop'; };
  function playerById(id) { return S.view && S.view.players.find(p => p.id === id); }
  function avatarHtml(p, cls) {
    return '<span class="avatar pc' + p.color + ' ' + (cls || '') + '">' + esc(glyph(p.avatar)) + '</span>';
  }
  function ctxFor(v) {
    return {
      T, L, esc, lang, isHost,
      players: v.players, me: v.me ? playerById(v.me) : null, leader: (v.players.find(p => p.leader) || {}).id, isLeader: !!(v.me && (playerById(v.me) || {}).leader),
      player: playerById, name: id => { const p = playerById(id); return p ? p.name : '?'; },
      avatar: (id, cls) => { const p = playerById(id); return p ? avatarHtml(p, cls) : ''; },
      chip: (id, cls) => { const p = playerById(id); return p ? '<span class="who ' + (cls || '') + '">' + avatarHtml(p) + '<b>' + esc(p.name) + '</b></span>' : ''; },
      now: serverNow, send: P.send, hostSend: a => send({ t: 'host_act', a }), sfx: P.sfx,
      timer: (deadline, total) => '<div class="timer"><span class="timer-num" data-deadline="' + deadline + '"></span>' +
        '<div class="timer-bar"><i data-bar data-deadline="' + deadline + '" data-total="' + total + '"></i></div></div>',
    };
  }

  function setScreen(html, key) {
    const el = $('#screen');
    if (html === S.lastHtml) return;
    const act = document.activeElement, keep = {};
    el.dataset.fresh = key !== S.lastKey ? '1' : '';       // entrance animations only when the SCREEN changes, never on a refresh
    if (key === S.lastKey) {
      el.querySelectorAll('input[id],textarea[id]').forEach(i => {
        keep[i.id] = { v: i.value, f: i === act, s: i.selectionStart, e: i.selectionEnd };
      });
    }
    el.innerHTML = html;
    Object.keys(keep).forEach(id => {
      const n = document.getElementById(id);
      if (!n || n.hasAttribute('data-reset')) return;
      n.value = keep[id].v;
      if (keep[id].f) { n.focus(); try { n.setSelectionRange(keep[id].s, keep[id].e); } catch (e) { /* not text */ } }
    });
    S.lastHtml = html; S.lastKey = key;
    tickTimers();
    fitHost(true);
  }

  // ── big screen never scrolls: shrink the font of the whole screen until everything fits the window ──
  function fitHost(force) {
    if (!isHost) return;
    const el = document.querySelector('#screen > .screen');
    if (!el) return;
    const over = () => el.scrollHeight > el.clientHeight + 1 || el.scrollWidth > el.clientWidth + 1;
    if (!force && !over()) return;
    document.body.classList.add('measuring');           // measure without entrance animations (transforms inflate scroll size)
    el.style.fontSize = '';
    let fs = parseFloat(getComputedStyle(el).fontSize), n = 0;
    while (over() && fs > 9 && n++ < 40) { fs *= 0.94; el.style.fontSize = fs.toFixed(1) + 'px'; }
    document.body.classList.remove('measuring');
  }
  P.fitHost = fitHost;
  window.addEventListener('resize', () => fitHost(true));
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => fitHost(true));
  setInterval(fitHost, 700);                             // cheap: only does work when something overflows (late fonts, long text)

  function render() {
    chrome();
    const v = S.view;
    document.body.classList.toggle('host', isHost);
    document.body.classList.toggle('player', !isHost);
    if (!v) {
      if (isHost) return setScreen('<div class="screen center"><p class="muted">' + T('loading') + '</p></div>', 'hostwait');
      return setScreen(joinHtml(), 'join');
    }
    if (v.game_id && S.gameId === v.game_id && !S.def) return setScreen('<div class="screen center"><p>⚠️ ' + esc(T('err.badgame')) + '</p><p class="muted small">' + esc(S.loadError || '') + '</p></div>', 'loaderror');
    if ((S.gameId || null) !== (v.game_id || null) || (v.game_id && !S.def)) return setScreen('<div class="screen center"><p class="muted">' + T('loading') + '</p></div>', 'loading');
    const ctx = ctxFor(v);
    if (v.phase === 'lobby') return setScreen(isHost ? lobbyHost(v, ctx) : lobbyPlayer(v, ctx), 'lobby');
    const g = v.game || {};
    let html = '';
    try {
      html = (isHost ? S.def.host : S.def.player)(g, ctx) || '';
    } catch (e) {
      console.error(e);
      html = '<div class="screen center"><p>⚠️ ' + esc(e.message) + '</p></div>';
    }
    const errBanner = v.error ? '<div class="errbanner">⚠️ ' + esc(v.error) + '</div>' : '';
    setScreen(errBanner + html, 'game|' + g.screen + '|' + (g.round == null ? '' : g.round) + '|' + (g.key == null ? '' : g.key));
  }

  function joinHtml() {
    return '<div class="screen center enter">' +
      '<h1 class="brand">' + T('brand') + '</h1>' +
      '<p class="muted">' + T('join.title') + '</p>' +
      '<input id="code" class="input code-input" maxlength="4" autocapitalize="characters" autocomplete="off" autocorrect="off" spellcheck="false" placeholder="ABCD" data-enter="joinBtn">' +
      '<p class="err">' + esc(S.joinError) + '</p>' +
      '<button id="joinBtn" class="btn" data-core="join">' + T('join.btn') + '</button>' +
      '<p class="muted small">' + T('join.hint') + '</p></div>';
  }

  function joinUrl(code) {
    const base = S.publicUrl || location.origin + '/';
    return base + (base.indexOf('?') < 0 ? '?room=' + code : '&room=' + code);
  }

  // optional game art: def.art(slot, ctx) returns HTML for 'lobbyHost' / 'lobbyPlayer'; def.decor() fills the background layer
  const art = (slot, ctx) => (S.def && S.def.art && S.def.art(slot, ctx)) || '';

  function chatLog(v, host) {
    const msgs = (v.chat || []).slice(host ? -6 : -8).map(m => { const p = playerById(m.id); return p ? '<div class="cmsg"><span class="cwho">' + avatarHtml(p) + '<b>' + esc(p.name) + '</b></span><span class="ctext">' + esc(m.text) + '</span></div>' : ''; }).join('');
    return '<div class="chatlog' + (host ? ' host' : '') + '"><div class="chead">' + T('chat.room') + '</div>' + (msgs || '<p class="muted small">' + T('chat.empty') + '</p>') + '</div>';
  }

  function lobbyHost(v, ctx) {
    const url = joinUrl(v.code), show = url.replace(/^https?:\/\//, '').replace(/\?.*$/, '').replace(/\/$/, '');
    const bubbles = v.players.map(p => '<div class="bubble ' + (p.connected ? '' : 'off') + ((S.knownIds && !S.knownIds.has(p.id)) ? ' new' : '') + '" data-pid="' + p.id + '">' + avatarHtml(p, 'xl') +
      '<b>' + (p.name ? esc(p.name) : '<i class="muted">' + T('lobby.noname') + '</i>') + (p.ready ? ' <span class="rdy">✓</span>' : '') + '</b>' + (p.leader ? '<span class="vip">' + T('leader') + '</span>' : '') + '</div>').join('');
    return '<div class="screen lobby-host enter"><div class="lh-left">' + art('lobbyHost', ctx) + '<h2 class="gtitle">' + (v.game_id ? esc(L(v.title)) : '<span class="muted">' + T('lobby.pickWait') + '</span>') + '</h2>' +
      '<div class="muted">' + T('lobby.goTo') + '</div><div class="url">' + esc(show) + '</div>' +
      '<div class="muted">' + T('lobby.enter') + '</div><div class="roomcode">' + esc(v.code) + '</div>' +
      '<div class="qrbox"><div id="qr" data-url="' + esc(url) + '"></div></div></div>' +
      '<div class="lh-right"><div class="muted">' + T('lobby.count', { n: v.players.length }) + '</div>' +
      '<div class="bubbles">' + (bubbles || '<p class="muted">' + T('lobby.empty') + '</p>') + '</div>' + chatLog(v, true) + '</div></div>';
  }

  function lobbyPlayer(v, ctx) {
    const me = ctx.me;
    if (!me) return '<div class="screen center"><p class="muted">' + T('loading') + '</p></div>';
    const taken = new Set(v.players.filter(p => p.id !== me.id).map(p => p.avatar));
    const nAv = Math.max(avatarList().length, 24);
    const grid = [...Array(nAv).keys()].map(i => '<button class="av ' + (i === me.avatar ? 'sel' : '') + '" data-core="avatar" data-i="' + i + '" data-av-sfx="' + esc(avatarSfx(i)) + '"' + (taken.has(i) ? ' disabled' : '') + '>' + esc(glyph(i)) + '</button>').join('');
    const ready = v.players.filter(p => p.connected && p.name).length;
    let foot;
    if (me.leader) {
      foot = '<p class="muted">' + T('lobby.leaderYou') + '</p>' + (!me.name ? '<p class="muted">' + T('lobby.nameFirst') + '</p>' : '') +
        '<button class="btn" data-core="start"' + (ready < v.min || !me.name || !v.game_id ? ' disabled' : '') + '>' + T('lobby.startAsk') + '</button>' +
        '<button class="btn secondary leavebtn" data-core="close">' + T('lobby.closeRoom') + '</button>';
    } else {
      foot = '<p class="muted">' + (v.game_id ? T('lobby.gameIs', { title: esc(L(v.title)) }) + ' · ' : '') +
        (v.players.some(p => p.leader) ? (v.game_id ? T('lobby.waiting') : T('lobby.pickWait')) : T('lobby.noLeader')) + '</p>';
    }
    let picker = '';
    if (me.leader) {
      if (!S.launcher) fetch('api/games').then(r => r.json()).then(g => { S.launcher = g; S.lastHtml = null; render(); });
      picker = '<label class="muted">' + T('lobby.chooseGame') + '</label><div class="gamepick">' + (S.launcher || []).filter(g => !g.error).map(g =>
        '<button class="gp ' + (v.game_id === g.id ? 'sel' : '') + '" data-core="pickgame" data-game="' + esc(g.id) + '" style="--cbg:' + esc((g.theme || {}).bg || '#222') + ';--cac:' + esc((g.theme || {}).accent || '#fc0') + '">' +
        '<span class="gp-e">' + esc(g.emoji || '🎉') + '</span><span class="gp-t"><b>' + esc(L(g.title)) + '</b><small>' + esc(L(g.tagline)) + '</small></span></button>').join('') + '</div>';
    }
    const areYou = '';
    if (me.ready) {            // name + icon confirmed → chat with the room (messages show up on the big screen)
      return '<div class="screen lobby-player enter">' + art('lobbyPlayer', ctx) + picker + '<div class="me">' + avatarHtml(me, 'xl') + '<h3>' + esc(me.name) + '</h3></div>' +
        '<label class="muted" for="chat">' + T('chat.title') + '</label>' +
        '<div class="chatrow"><input id="chat" class="input" maxlength="80" autocomplete="off" placeholder="' + T('chat.ph') + '" data-enter="chatSend">' +
        '<button id="chatSend" class="btn" data-core="chat">' + T('chat.send') + '</button></div>' + chatLog(v, false) + foot +
        '<button class="btn secondary leavebtn" data-core="unready">' + T('chat.edit') + '</button></div>';
    }
    return '<div class="screen lobby-player enter">' + areYou + art('lobbyPlayer', ctx) + picker +
      '<div class="me">' + avatarHtml(me, 'xl') + '</div>' +
      '<label class="muted" for="name">' + T('lobby.name') + '</label>' +
      '<input id="name" class="input" maxlength="14" autocomplete="off" value="' + esc(me.name) + '" data-core="name">' +
      '<button class="btn honk" data-core="honk">' + T('lobby.honk') + '</button>' +
      '<label class="muted">' + T('lobby.icon') + '</label><div class="avgrid">' + grid + '</div>' +
      '<button class="btn" data-core="ready"' + (me.name ? '' : ' disabled') + '>' + T('chat.done') + '</button>' + foot +
      (me.leader ? '' : '<button class="btn secondary leavebtn" data-core="leave">' + T('lobby.leave') + '</button>') + '</div>';
  }

  // ───────────── chrome (language, mute, room chip, menu) ─────────────
  function chrome() {
    const v = S.view;
    $('#lang').textContent = lang === 'en' ? '한국어' : 'EN';
    $('#mute').textContent = PartySfx.isMuted() ? '🔇' : '🔊';
    $('#chip').textContent = v && v.phase === 'game' ? v.code : '';
    const me = v && v.players.find(p => p.id === v.me);
    const canEnd = v && v.phase === 'game' && (isHost || (me && me.leader));
    $('#menu').hidden = !canEnd;
    const showAreYou = !isHost && v && v.phase === 'lobby' && me && !me.leader;
    $('#areyou').hidden = !showAreYou; $('#areyou').textContent = T('lobby.areYou');
    $('#offline').hidden = S.online;
    $('#offline').textContent = T('net.offline');
  }

  // Our own dialog. NEVER use the browser's alert/confirm/prompt (owner rule): they are ugly and unthemed.
  function ask(message, okLabel) {
    return new Promise(resolve => {
      const m = $('#modal');
      $('#modal-msg').textContent = message;
      $('#modal-yes').textContent = okLabel || 'OK';
      $('#modal-no').textContent = T('modal.cancel');
      m.hidden = false;
      P.sfx('pop');
      const done = ok => { m.hidden = true; m.onclick = null; document.removeEventListener('keydown', onKey, true); resolve(ok); };
      const onKey = e => { if (e.key === 'Escape') { e.stopPropagation(); done(false); } else if (e.key === 'Enter') { e.stopPropagation(); done(true); } };
      $('#modal-yes').onclick = () => done(true);
      $('#modal-no').onclick = () => done(false);
      m.onclick = e => { if (e.target === m) done(false); };
      document.addEventListener('keydown', onKey, true);
      $('#modal-yes').focus();
    });
  }
  // text-entry version of the dialog (PIN etc.) — resolves with the string, or null if cancelled
  function askText(message, okLabel, opts) {
    return new Promise(resolve => {
      const m = $('#modal'), inp = $('#modal-input');
      $('#modal-msg').textContent = message;
      $('#modal-yes').textContent = okLabel || 'OK';
      $('#modal-no').textContent = T('modal.cancel');
      inp.hidden = false; inp.value = ''; inp.type = (opts && opts.type) || 'text';
      inp.setAttribute('inputmode', (opts && opts.inputmode) || 'text');
      inp.maxLength = (opts && opts.maxlength) || 40; inp.placeholder = (opts && opts.placeholder) || '';
      m.hidden = false; P.sfx('pop');
      const done = ok => { m.hidden = true; inp.hidden = true; m.onclick = null; document.removeEventListener('keydown', onKey, true); resolve(ok ? inp.value : null); };
      const onKey = e => { if (e.key === 'Escape') { e.stopPropagation(); done(false); } else if (e.key === 'Enter') { e.stopPropagation(); done(true); } };
      $('#modal-yes').onclick = () => done(true);
      $('#modal-no').onclick = () => done(false);
      m.onclick = e => { if (e.target === m) done(false); };
      document.addEventListener('keydown', onKey, true);
      inp.focus();
    });
  }
  P.ask = ask; P.askText = askText;

  function toast(msg) {
    const t = $('#toast');
    t.textContent = msg; t.classList.add('show');
    clearTimeout(toast.h); toast.h = setTimeout(() => t.classList.remove('show'), 2600);
  }

  // ───────────── timers ─────────────
  function tickTimers() {
    const now = serverNow();
    document.querySelectorAll('.timer-num[data-deadline]').forEach(el => {
      const s = Math.max(0, Math.ceil((+el.dataset.deadline - now) / 1000));
      if (el.textContent !== String(s)) el.textContent = s;
    });
    document.querySelectorAll('[data-bar]').forEach(el => {
      el.style.width = Math.max(0, Math.min(100, (+el.dataset.deadline - now) / +el.dataset.total * 100)) + '%';
    });
    const qr = document.getElementById('qr');
    if (qr && !qr.firstChild && window.QRCode) {
      new QRCode(qr, { text: qr.dataset.url, width: 220, height: 220, correctLevel: QRCode.CorrectLevel.M });
    }
  }
  setInterval(tickTimers, 200);

  // ───────────── input ─────────────
  document.addEventListener('pointerdown', () => PartySfx.unlock(), { capture: true });
  document.addEventListener('touchstart', () => {}, { passive: true });     // iOS only applies :active (hold-to-reveal cards) when a touch listener exists
  document.addEventListener('keydown', e => {
    if (e.key === 'Enter' && e.target.dataset && e.target.dataset.enter) { e.preventDefault(); document.getElementById(e.target.dataset.enter).click(); }
  });
  document.addEventListener('input', e => {
    const el = e.target;
    if (el.id === 'code') el.value = el.value.toUpperCase().replace(/[^A-Z]/g, '');
    if (el.dataset && el.dataset.core === 'name') {
      clearTimeout(onInput.h);
      onInput.h = setTimeout(() => { localStorage.setItem('party.name', el.value.trim()); send({ t: 'profile', name: el.value }); }, 250);
    }
  });
  function onInput() {}

  // Buttons fire on click (finger release). Add data-on="down" to fire on pointerdown instead (reaction games).
  const tap = e => {
    const el = e.target.closest('[data-core],[data-send],[data-host-send]');
    if (!el || el.disabled || el.dataset.core === 'name') return;
    if ((el.dataset.on === 'down') !== (e.type === 'pointerdown')) return;
    if (navigator.vibrate && navigator.userActivation && navigator.userActivation.hasBeenActive) navigator.vibrate(12);
    const d = el.dataset;
    if (d.core) {
      PartySfx.unlock();
      if (d.core === 'host') { P.sfx('whoosh'); send({ t: 'host', game: d.game }); }
      else if (d.core === 'join') {
        const code = document.getElementById('code').value.toUpperCase();
        if (code.length !== 4) { S.joinError = T('err.badcode'); P.sfx('error'); return render(); }
        P.sfx('tap'); tryJoin(code);
      }
      else if (d.core === 'start') { P.sfx('tap'); send({ t: 'start' }); }
      else if (d.core === 'close') {
        const n = S.view ? S.view.players.length : 0;
        if (n === 0) send({ t: 'close' });
        else ask(T('menu.closeConfirm'), T('menu.close')).then(ok => { if (ok) send({ t: 'close' }); });
      }
      else if (d.core === 'reload') { location.reload(); }
      else if (d.core === 'pickgame') { P.sfx('pop'); send({ t: 'pick_game', game: d.game }); }
      else if (d.core === 'ready') { P.sfx('win'); send({ t: 'ready', v: true }); }
      else if (d.core === 'unready') { P.sfx('tap'); send({ t: 'ready', v: false }); }
      else if (d.core === 'chat') { const i = document.getElementById('chat'); if (i && i.value.trim()) { send({ t: 'chat', text: i.value }); P.sfx('pop'); i.value = ''; i.focus(); } }
      else if (d.core === 'leave') { P.sfx('tap'); send({ t: 'leave' }); }
      else if (d.core === 'auth') {
        askText(T('lobby.pinTitle'), T('modal.ok'), { type: 'password', inputmode: 'numeric', maxlength: 12, placeholder: 'PIN' })
          .then(pin => { if (pin) send({ t: 'auth', pin }); });
      }
      else if (d.core === 'avatar') { P.sfx(d.avSfx || 'pop'); send({ t: 'profile', avatar: +d.i }); }
      else if (d.core === 'honk') {
        const list = (S.def && S.def.lobbySounds) || DEFAULT_HONKS;
        const sound = list[S.honkIdx++ % list.length];
        P.sfx(sound); send({ t: 'honk', sound });
        el.classList.remove('honk-anim'); void el.offsetWidth; el.classList.add('honk-anim');
      }
      return;
    }
    // game actions: <button data-send="vote" data-i="2" data-from="inputId">
    const kind = d.send || d.hostSend, a = { type: kind };
    Object.keys(d).forEach(k => {
      if (['send', 'hostSend', 'from', 'sfx', 'once', 'on'].includes(k)) return;
      a[k] = /^-?\d+(\.\d+)?$/.test(d[k]) ? +d[k] : d[k];
    });
    if (d.from) { const i = document.getElementById(d.from); a.value = i ? i.value : ''; }
    P.sfx(d.sfx || 'tap');
    if (d.hostSend) send({ t: 'host_act', a }); else send({ t: 'act', a });
    if (d.once !== undefined) { el.disabled = true; el.classList.add('sent'); }
  };
  document.addEventListener('click', tap);
  document.addEventListener('pointerdown', tap);

  $('#lang').onclick = () => {
    lang = lang === 'en' ? 'ko' : 'en';
    localStorage.setItem('party.lang', lang);
    document.documentElement.lang = lang;
    S.lastHtml = null; render();
  };
  $('#mute').onclick = () => { PartySfx.unlock(); PartySfx.setMuted(!PartySfx.isMuted()); chrome(); P.sfx('pop'); };
  $('#menu').onclick = () => ask(T('menu.confirm'), T('menu.end')).then(ok => { if (ok) send({ t: 'to_lobby' }); });

  // ───────────── boot ─────────────
  document.documentElement.lang = lang;
  fetch('api/info').then(r => r.json()).then(j => { S.publicUrl = j.url; }).catch(() => {});
  connect();
  render();
})();
