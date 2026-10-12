/* Spy Poll - screens. Pure functions: view in, HTML out. One body for the big screen and the phones.
 * Reveals are staged with CSS delays (--d, in seconds) that only play when the screen is new (#screen[data-fresh]).
 * Leader controls: PIN-leader phone uses data-send, the laptop big screen data-host-send (both reach Game._leader). */
Party.game({
  id: 'spy-poll',
  voice: 'digital',
  avatars: ['🕵️', '🕶️', '🎩', '🧥', '🔍', '🗝️', '📡', '🔭', '🧭', '📠', '🎧', '💼',
            '🛰️', '🕰️', '🧪', '🦉', '🐈‍⬛', '🦊', '🐍', '🕸️', '🎭', '📼', '🗺️', '🔦'],
  lobbySounds: ['tick', 'pop', 'aha', 'ding', 'whoosh'],
  screenSfx: { setup: 'pop', guess: 'whoosh', call: 'tick', reveal: 'drumroll', final: 'whoosh', finalreveal: 'drumroll', end: 'fanfare' },

  strings: {
    en: {
      setupTitle: 'Mission briefing', setupWait: 'The handler is preparing the mission…',
      optTimers: 'Countdown timers', optTimersHelp: 'Guess 45 s · call 20 s · final 60 s', optFamily: 'Family-friendly questions',
      optFamilyHelp: 'Off = a few cheekier questions join in', on: 'ON', off: 'OFF',
      firstTitle: 'Who guesses first?', firstRandom: '🎲 Pick at random', firstHelp: 'or tap a name:', firstIs: '{name} guesses first',
      begin: 'Begin the operation', soloNote: 'Alone? Three virtual agents will make the calls so you can try everything.',
      roundN: 'Round {n}', turnOf: 'Turn {n} of {total}', finalRound: 'FINAL ROUND',
      caseFile: 'CASE FILE', isGuessing: '{name} is guessing…', yourTurn: 'Your turn, agent',
      guessHelp: 'What percent of people? Set the slider, then lock it in.', lockGuess: 'Lock in my estimate',
      readRoom: 'Read the room: will the guess be too high or too low?', waitGuess: 'Waiting for {name} to lock in…',
      guessSays: '{name} says', shrugNote: 'Out of time: a shrug (50%), no points', skipNote: 'Skipped: a shrug (50%), no points',
      lockingIn: '{name} is locking in an estimate…',
      callHelp: 'Is the real number higher or lower than the guess?', higher: 'HIGHER', lower: 'LOWER', muchHigher: 'MUCH HIGHER', muchLower: 'MUCH LOWER',
      muchHelp: 'MUCH = right direction AND more than 15 points away', locked: 'Locked in', lockedCount: '{n} of {total} locked in',
      youCalled: 'You called: {call}', yourEstimate: 'Your estimate', guesserWait: 'Your estimate is out there. The others are making their calls…',
      callWord: 'Calls', guessWord: 'Guess', realWord: 'Real', offBy: 'Off by {n}%', bullseye: 'BULLSEYE!', offTarget: 'Off target',
      sharp: 'Sharp calls', missed: 'Missed it', noCalls: 'Nobody made a call', virtual: 'virtual agent', you: 'You',
      youGuesser: 'Your estimate earned', youCaller: 'Your call earned', pts: '{n} pts',
      dirHi: 'Higher', dirLo: 'Lower', dirMhi: 'Much higher', dirMlo: 'Much lower',
      next: 'Next', skip: 'Skip ahead', toFinal: 'To the final round', ranking: 'Standings', andMore: '…and {n} more', leaderOnly: 'The handler moves things along.',
      finalTitle: 'FINAL DEBRIEF', finalHelp: 'Pick the 3 answers you think most people chose.', picked: '{n} of 3 picked',
      lockPicks: 'Lock in my 3', picksLocked: 'Picks locked in. Waiting for the others…', finalReveal: 'The real numbers',
      finalPay: '#1 = 4,000 · #2 = 2,000 · #3 = 1,000', yourPicks: 'Your picks', placeN: '#{n}',
      endTitle: 'Mission complete', topAgent: 'Top agent', topAgents: 'Top agents (a tie!)', again: 'Another game', toLobby: 'Back to the lobby',
      endGame: 'End the game', endAsk: 'End the game now and show the final standings?', endYes: 'Yes, end it', endNo: 'Keep playing',
    },
    ko: {
      setupTitle: '작전 브리핑', setupWait: '담당관이 작전을 준비하는 중…',
      optTimers: '제한 시간', optTimersHelp: '추측 45초 · 선택 20초 · 파이널 60초', optFamily: '가족용 질문만',
      optFamilyHelp: '끄면 살짝 짓궂은 질문도 섞여요', on: '켜짐', off: '꺼짐',
      firstTitle: '누가 먼저 맞힐까요?', firstRandom: '🎲 랜덤으로 뽑기', firstHelp: '또는 이름을 눌러서 지정:', firstIs: '{name} 님부터 시작',
      begin: '작전 개시', soloNote: '혼자인가요? 가상 요원 셋이 선택을 해 줘서 모든 걸 혼자 해 볼 수 있어요.',
      roundN: '{n}라운드', turnOf: '{total}명 중 {n}번째', finalRound: '파이널 라운드',
      caseFile: '사건 파일', isGuessing: '{name} 님이 추측하는 중…', yourTurn: '당신 차례예요, 요원',
      guessHelp: '몇 퍼센트일까요? 슬라이더를 맞추고 확정하세요.', lockGuess: '내 추측 확정',
      readRoom: '분위기를 읽으세요: 추측이 너무 높을까요, 낮을까요?', waitGuess: '{name} 님이 확정하길 기다리는 중…',
      guessSays: '{name} 님의 추측', shrugNote: '시간 초과: 얼버무림 (50%), 점수 없음', skipNote: '건너뜀: 얼버무림 (50%), 점수 없음',
      lockingIn: '{name} 님이 추측을 확정하는 중…',
      callHelp: '진짜 수치는 추측보다 높을까요, 낮을까요?', higher: '더 높음', lower: '더 낮음', muchHigher: '훨씬 높음', muchLower: '훨씬 낮음',
      muchHelp: '훨씬 = 방향이 맞고 차이가 15%p보다 클 때', locked: '선택 완료', lockedCount: '{total}명 중 {n}명 선택',
      youCalled: '내 판정: {call}', yourEstimate: '내 추측', guesserWait: '추측을 던졌어요. 다른 사람들이 고르는 중…',
      callWord: '판정', guessWord: '추측', realWord: '실제', offBy: '{n}%p 차이', bullseye: '정확히 적중!', offTarget: '빗나감',
      sharp: '적중한 선택', missed: '빗나간 선택', noCalls: '선택한 사람이 없어요', virtual: '가상 요원', you: '나',
      youGuesser: '내 추측 점수', youCaller: '내 판정 점수', pts: '{n}점',
      dirHi: '더 높음', dirLo: '더 낮음', dirMhi: '훨씬 높음', dirMlo: '훨씬 낮음',
      next: '다음', skip: '건너뛰기', toFinal: '파이널 라운드로', ranking: '순위', andMore: '…외 {n}명', leaderOnly: '담당관이 진행해요.',
      finalTitle: '파이널 브리핑', finalHelp: '가장 많은 사람이 골랐을 것 같은 답 3개를 고르세요.', picked: '3개 중 {n}개 선택',
      lockPicks: '이 3개로 확정', picksLocked: '선택 완료. 다른 사람들을 기다리는 중…', finalReveal: '진짜 수치',
      finalPay: '1위 4,000 · 2위 2,000 · 3위 1,000', yourPicks: '내 선택', placeN: '{n}위',
      endTitle: '작전 종료', topAgent: '최고 요원', topAgents: '최고 요원들 (공동 1위!)', again: '한 판 더', toLobby: '로비로 돌아가기',
      endGame: '게임 끝내기', endAsk: '지금 게임을 끝내고 최종 순위를 볼까요?', endYes: '네, 끝낼게요', endNo: '계속하기',
    },
  },

  player(g, c) { return body(g, c); },
  host(g, c) { return body(g, c); },
});

// ───────────────────────── helpers ─────────────────────────
// the slider readout must follow the slider even after a re-render; this is a DOM listener, not render code
(function () {
  function sync() {
    const s = document.getElementById('gslider'), o = document.getElementById('gval'), b = document.getElementById('gsubmit');
    if (s && o && o.textContent !== s.value + '%') o.textContent = s.value + '%';
    if (s && b && b.dataset.value !== s.value) b.dataset.value = s.value;      // the core turns numeric data-* into numbers
  }
  let lastTick = 0;
  document.addEventListener('input', e => {
    sync();
    if (e.target && e.target.id === 'gslider' && Date.now() - lastTick > 90 && window.Party && Party.sfx) { lastTick = Date.now(); Party.sfx('tick'); }
  });
  new MutationObserver(sync).observe(document.documentElement, { childList: true, subtree: true });
  window.SpyPoll = { nudge(d) {
    const s = document.getElementById('gslider'); if (!s) return;
    s.value = Math.max(0, Math.min(100, +s.value + d)); sync(); if (window.Party) Party.sfx('tick');
  } };
})();

const fmt = n => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
const canLead = c => c.isHost || c.isLeader;
const sendAttr = c => (c.isHost ? 'data-host-send' : 'data-send');
let STEP = 0;      // the screen key of the view being drawn; leader buttons carry it so a late double tap is ignored by the server
const lead = (c, type, label, cls, extra) => canLead(c) ? `<button class="btn ${cls || ''}" ${sendAttr(c)}="${type}" data-step="${STEP}" ${extra || ''}>${label}</button>` : '';
const step = d => `style="--d:${d}"`;

function body(g, c) {
  STEP = g.round;
  switch (g.screen) {
    case 'setup': return setup(g, c);
    case 'guess': return guess(g, c);
    case 'call': return call(g, c);
    case 'reveal': return reveal(g, c);
    case 'final': return final(g, c);
    case 'finalreveal': return finalReveal(g, c);
    default: return end(g, c);
  }
}

function head(g, c) {
  const T = c.T, st = g.stage || {};
  const label = st.round === 3 ? `<b>${T('finalRound')}</b>` : `<b>${T('roundN', { n: st.round })}</b> · ${T('turnOf', { n: st.turn, total: st.of })}`;
  const timer = g.timer ? `<div class="spy-timer">${c.timer(g.timer.deadline, g.timer.total)}</div>` : '';
  return `<div class="spy-head"><span class="spy-tag">🕵️ ${label}</span>${timer}</div>`;
}

function name(c, id) { return c.esc(c.name(id)); }
// a guesser can be a virtual agent in solo mode: draw it like the reveal rows do
function whoChip(g, c, id, size) {
  if (id === g.guesser && g.botGuesser) return `<span class="who"><span class="avatar bot">🤖</span><b>${c.esc(c.L(g.botGuesser))}</b></span>`;
  return c.chip(id, size);
}
const shrugText = (g, c) => g.shrug ? c.T(g.why === 'skip' ? 'skipNote' : 'shrugNote') : '';

// A leader bar at the bottom: primary "next" plus a two-step "end the game" (in-page confirm, never a native popup)
function leadBar(g, c, nextLabel, nextCls) {
  if (!canLead(c)) return `<p class="muted small spy-leaderonly">${c.T('leaderOnly')}</p>`;
  const T = c.T;
  if (g.ending) {
    return `<div class="spy-confirm"><span>${T('endAsk')}</span><div class="leadbar">${lead(c, 'end', T('endYes'), 'danger')}${lead(c, 'end_cancel', T('endNo'), 'secondary')}</div></div>`;
  }
  return `<div class="leadbar">${nextLabel ? lead(c, 'next', nextLabel, nextCls) : ''}${lead(c, 'end_ask', T('endGame'), 'secondary ghost')}</div>`;
}

function dossier(g, c) {
  return `<div class="dossier enter"><span class="stamp">${c.T('caseFile')}</span><p class="qtext">${c.esc(c.L(g.q.text))}</p></div>`;
}

// the 0-100 scale. o.guess / o.real are numbers or undefined; o.pending shows a scanning "?" marker
function scale(g, c, o) {
  o = o || {};
  const ticks = [0, 25, 50, 75, 100].map(n => `<span class="tk" style="left:${n}%">${n}</span>`).join('');
  const gm = o.guess != null ? `<div class="mk mk-guess ${o.shrug ? 'shrug' : ''}" style="--pos:${o.guess}%"><b>${o.guess}%</b><i></i></div>` : '';
  const rm = o.real != null ? `<div class="mk mk-real" style="--pos:${o.real}%"><i></i><b>${o.real}%</b></div>` : '';
  const sc = o.pending ? '<div class="scan"></div>' : '';
  return `<div class="scale ${o.real != null ? 'has-real' : ''}"><div class="track">${sc}${ticks}</div>${gm}${rm}</div>`;
}

function ranking(g, c, delayBase, withDelta, limit) {
  const T = c.T, many = g.ranking.length > 14 && !limit;
  const shown = limit && g.ranking.length > limit ? g.ranking.slice(0, limit) : g.ranking;
  const rest = g.ranking.length - shown.length;
  const rows = shown.map((r, i) => {
    const d = withDelta && g.deltas && g.deltas[r.id];
    return `<div class="rk ${c.me && c.me.id === r.id ? 'me' : ''} ${r.rank === 1 && r.score > 0 ? 'top' : ''}"><span class="pos">${r.rank}</span>${c.chip(r.id)}<b class="sc">${fmt(r.score)}</b>${withDelta ? `<em class="dl">${d ? '+' + fmt(d) : ''}</em>` : ''}</div>`;
  }).join('');
  return `<div class="ranking ${many ? 'cols' : ''}"><div class="rk-title">${T('ranking')}</div><div class="rk-list">${rows}</div>${rest > 0 ? `<div class="muted small rk-more">${T('andMore', { n: rest })}</div>` : ''}</div>`;
}

// ───────────────────────── setup ─────────────────────────
function setup(g, c) {
  const T = c.T, lc = canLead(c), send = sendAttr(c);
  const tog = (key, val, tkey, hkey, type) => `<div class="opt"><div><b>${T(tkey)}</b><div class="muted small">${T(hkey)}</div></div>
    ${lc ? `<button class="btn secondary tog ${val ? 'on' : ''}" ${send}="${type}">${val ? T('on') : T('off')}</button>` : `<span class="togview ${val ? 'on' : ''}">${val ? T('on') : T('off')}</span>`}</div>`;
  const pills = g.ids.map(id => lc
    ? `<button class="pill ${g.first === id ? 'sel' : ''}" ${send}="first_set" data-id="${id}">${c.chip(id)}</button>`
    : `<span class="pill ${g.first === id ? 'sel' : ''}">${c.chip(id)}</span>`).join('');
  return `<div class="screen ${c.isHost ? 'hostplay' : ''}"><h1 class="enter">🕵️ ${T('setupTitle')}</h1>
    ${lc ? '' : `<p class="muted">${T('setupWait')}</p>`}
    <div class="opts">${tog('timers', g.opts.timers, 'optTimers', 'optTimersHelp', 'toggle_timers')}${tog('family', g.opts.family, 'optFamily', 'optFamilyHelp', 'toggle_family')}</div>
    <div class="firstbox"><div class="row between"><b>${T('firstTitle')}</b>${lc ? `<button class="btn secondary tiny" ${send}="first_random">${T('firstRandom')}</button>` : ''}</div>
      ${g.first ? `<div class="firstbanner">👉 ${T('firstIs', { name: name(c, g.first) })}</div>` : ''}
      ${lc ? `<div class="muted small">${T('firstHelp')}</div>` : ''}<div class="pills">${pills}</div></div>
    ${g.solo ? `<p class="muted small solonote">🤖 ${T('soloNote')}</p>` : ''}
    ${lead(c, 'begin', T('begin'), '', 'data-sfx="whoosh"')}</div>`;
}

// ───────────────────────── guess ─────────────────────────
function guess(g, c) {
  const T = c.T, me = c.me && c.me.id, mine = me && me === g.guesser;
  const who = `<div class="guesser">${c.chip(g.guesser, 'big')}</div>`;
  let mid;
  if (mine) {
    mid = `<div class="sliderbox"><div class="gval" id="gval">50%</div>
      <div class="sliderrow"><button class="nudge" type="button" onclick="SpyPoll.nudge(-1)">−</button>
      <input class="slider" id="gslider" type="range" min="0" max="100" step="1" value="50" aria-label="percent">
      <button class="nudge" type="button" onclick="SpyPoll.nudge(1)">+</button></div>
      <div class="sliderends"><span>0%</span><span>100%</span></div></div>
      <p class="muted small">${T('guessHelp')}</p>
      <button class="btn big" id="gsubmit" data-send="guess" data-value="50" data-sfx="ding">${T('lockGuess')}</button>`;
  } else {
    mid = `${scale(g, c, { pending: true })}${who}<p class="status">🔎 ${T('lockingIn', { name: name(c, g.guesser) })}</p>
      ${c.isHost ? '' : `<p class="muted pulse">${T('readRoom')}</p>`}`;
  }
  return `<div class="screen ${c.isHost ? 'hostplay' : ''}">${head(g, c)}${dossier(g, c)}${mine ? `<h2 class="yourturn">${T('yourTurn')}</h2>` : ''}${mid}${leadBar(g, c, T('skip'), 'secondary ghost skipbtn')}</div>`;
}

// ───────────────────────── call ─────────────────────────
const DIRNAME = { hi: 'dirHi', lo: 'dirLo', mhi: 'dirMhi', mlo: 'dirMlo' };

function lockedRow(g, c) {
  const callers = g.ids.filter(id => id !== g.guesser);
  const chips = callers.map(id => `<span class="lk ${g.called.includes(id) ? 'done' : ''}">${c.avatar(id)}${c.isHost && callers.length <= 12 ? `<small>${name(c, id)}</small>` : ''}</span>`).join('');
  return `<div class="lockrow"><div class="lks">${chips}</div><div class="muted small">${c.T('lockedCount', { n: g.called.length, total: callers.length })}</div></div>`;
}

function call(g, c) {
  const T = c.T, me = c.me && c.me.id, isGuesser = me && me === g.guesser;
  const sc = scale(g, c, { guess: g.guess, shrug: g.shrug });
  const says = `<div class="says">${whoChip(g, c, g.guesser)} <span>${T('guessSays', { name: '' }).trim()}</span> <b class="big">${g.guess}%</b>${g.shrug ? `<small class="muted"> · ${shrugText(g, c)}</small>` : ''}</div>`;
  let mid;
  if (c.isHost || isGuesser) {
    mid = `${isGuesser ? `<p class="muted">${T('guesserWait')}</p>` : ''}${lockedRow(g, c)}`;
  } else if (g.mine) {
    mid = `<div class="lockedcall pop-in"><b>🔒 ${T('locked')}</b><span>${T('youCalled', { call: T(DIRNAME[g.mine]) })}</span></div>${lockedRow(g, c)}`;
  } else {
    const b = (d, label, arrow, cls) => `<button class="btn call ${cls}" data-send="call" data-dir="${d}" data-sfx="pop"><span class="ar">${arrow}</span>${label}</button>`;
    mid = `<p class="muted">${T('callHelp')}</p><div class="callgrid ${g.much ? 'much' : ''}">
      ${g.much ? b('mhi', T('muchHigher'), '▲▲', 'up') : ''}${b('hi', T('higher'), '▲', 'up')}${b('lo', T('lower'), '▼', 'down')}${g.much ? b('mlo', T('muchLower'), '▼▼', 'down') : ''}</div>
      ${g.much ? `<p class="muted small">${T('muchHelp')}</p>` : ''}${lockedRow(g, c)}`;
  }
  return `<div class="screen ${c.isHost ? 'hostplay' : ''}">${head(g, c)}${dossier(g, c)}${sc}${says}${mid}${leadBar(g, c, T('skip'), 'secondary ghost skipbtn')}</div>`;
}

// ───────────────────────── reveal ─────────────────────────
function reveal(g, c) {
  const T = c.T, me = c.me && c.me.id, diff = Math.abs(g.guess - g.real);
  const verdict = diff === 0 ? T('bullseye') : T('offBy', { n: diff });
  const callName = r => (r.bot ? `<span class="who"><span class="avatar bot">🤖</span><b>${c.esc(c.L(r.name))}</b><small class="muted">${T('virtual')}</small></span>` : c.chip(r.id));
  const row = r => `<div class="cl ${r.pts > 0 ? 'right' : 'wrong'}">${callName(r)}<span class="dir">${T(DIRNAME[r.dir])}</span><b>${r.pts > 0 ? '+' + fmt(r.pts) : '0'}</b></div>`;
  const right = g.calls.filter(r => r.pts > 0), wrong = g.calls.filter(r => r.pts === 0);
  const groups = g.calls.length
    ? `<div class="callcols"><div class="cg r-step" ${step(3.0)}><div class="cg-title good">✔ ${T('sharp')}</div><div class="cg-list">${right.map(row).join('') || `<span class="muted small">—</span>`}</div></div>
        <div class="cg r-step" ${step(3.6)}><div class="cg-title bad">✘ ${T('missed')}</div><div class="cg-list">${wrong.map(row).join('') || `<span class="muted small">—</span>`}</div></div></div>`
    : `<p class="muted r-step" ${step(3.0)}>${T('noCalls')}</p>`;
  let mineBanner = '';
  if (me && g.deltas && me in g.deltas) {
    const isG = me === g.guesser;
    mineBanner = `<div class="mine r-step ${g.deltas[me] > 0 ? 'good' : 'bad'}" ${step(3.0)}>${T(isG ? 'youGuesser' : 'youCaller')} <b>+${fmt(g.deltas[me])}</b></div>`;
  }
  return `<div class="screen ${c.isHost ? 'hostplay' : ''}">${head(g, c)}${dossier(g, c)}
    <div class="revealgrid"><div class="rv-left">
      ${scale(g, c, { guess: g.guess, real: g.real, shrug: g.shrug })}
      <div class="verdict r-step" ${step(2.4)}><div class="vl">${whoChip(g, c, g.guesser)} <span class="vd ${diff === 0 ? 'good' : ''}">· ${verdict}</span></div>
        <b class="gpts ${g.gpts > 0 ? 'good' : 'bad'}">${g.gpts > 0 ? '+' + fmt(g.gpts) : (g.shrug ? shrugText(g, c) : T('offTarget'))}</b></div>
      ${mineBanner}${groups}</div>
      <div class="rv-right r-step" ${step(4.4)}>${ranking(g, c, 4.4, true, c.isHost ? 10 : 0)}</div></div>
    ${leadBar(g, c, T(g.stage.round === 2 && g.stage.turn === g.stage.of ? 'toFinal' : 'next'))}</div>`;
}

// ───────────────────────── final round ─────────────────────────
function final(g, c) {
  const T = c.T, me = c.me && c.me.id;
  const mine = g.mine || [];
  let answers;
  if (c.isHost) {
    answers = `<div class="ans-grid">${g.answers.map(a => `<div class="ans">${c.esc(c.L(a.text))}</div>`).join('')}</div>`;
  } else {
    answers = `<div class="ans-grid pick">${g.answers.map((a, i) => {
      const on = mine.includes(i);
      return `<button class="ans ${on ? 'on' : ''}" ${g.myLocked ? 'disabled' : `data-send="pick" data-i="${i}" data-sfx="pop"`}>${on ? `<span class="n">${mine.indexOf(i) + 1}</span>` : ''}${c.esc(c.L(a.text))}</button>`;
    }).join('')}</div>`;
  }
  const lk = g.ids.map(id => `<span class="lk ${g.locked.includes(id) ? 'done' : ''}">${c.avatar(id)}</span>`).join('');
  const act = c.isHost ? '' : (g.myLocked
    ? `<div class="lockedcall pop-in"><b>🔒 ${T('locked')}</b><span>${T('picksLocked')}</span></div>`
    : `<button class="btn big" data-send="lock" data-sfx="ding" ${mine.length === 3 ? '' : 'disabled'}>${T('lockPicks')} (${mine.length}/3)</button>`);
  return `<div class="screen ${c.isHost ? 'hostplay' : ''}">${head(g, c)}
    <div class="dossier enter"><span class="stamp">${T('finalTitle')}</span><p class="qtext">${c.esc(c.L(g.prompt))}</p></div>
    <p class="muted small">${T('finalHelp')} ${T('finalPay')}</p>${answers}
    <div class="lockrow"><div class="lks">${lk}</div><div class="muted small">${T('lockedCount', { n: g.locked.length, total: g.ids.length })}</div></div>
    ${act ? `<div class="stickyact">${act}</div>` : ''}
    ${leadBar(g, c, T('next'), 'secondary')}</div>`;
}

function finalReveal(g, c) {
  const T = c.T, me = c.me && c.me.id, myPicks = (me && g.picks[me]) || [];
  const rows = g.order.map((d, n) => {
    const a = g.answers[d], mineOn = myPicks.includes(d), pay = a.rank <= 3 ? g.pay[a.rank - 1] : 0;
    const pickers = g.ids.filter(id => g.picks[id].includes(d));
    return `<div class="fr r-step ${c.isHost && g.ids.length <= 12 ? 'hp' : ''} ${a.rank <= 3 ? 'podium p' + a.rank : ''} ${mineOn ? 'mineon' : ''}" ${step((0.4 + n * 0.55).toFixed(2))}>
      <span class="rankno">${T('placeN', { n: a.rank })}</span><span class="frtext">${c.esc(c.L(a.text))}${mineOn ? ' ★' : ''}</span>
      <span class="frbar"><i style="width:${a.pct}%"></i></span><b class="frpct">${a.pct}%</b>${pay ? `<em class="frpay">${fmt(pay)}</em>` : '<em class="frpay"></em>'}
      ${c.isHost && g.ids.length <= 12 ? `<span class="pickers">${pickers.map(id => c.avatar(id)).join('')}</span>` : ''}</div>`;
  }).join('');
  const mineBanner = me && g.deltas ? `<div class="mine r-step ${g.deltas[me] > 0 ? 'good' : 'bad'}" ${step(6.0)}>${T('yourPicks')}: <b>+${fmt(g.deltas[me] || 0)}</b></div>` : '';
  return `<div class="screen ${c.isHost ? 'hostplay' : ''}">${head(g, c)}
    <div class="dossier compact enter"><span class="stamp">${T('finalReveal')}</span><p class="qtext">${c.esc(c.L(g.prompt))}</p></div>
    <div class="revealgrid"><div class="rv-left"><div class="frlist">${rows}</div>${mineBanner}</div>
      <div class="rv-right r-step" ${step(6.0)}>${ranking(g, c, 6, true, c.isHost ? 10 : 0)}</div></div>
    ${leadBar(g, c, T('next'))}</div>`;
}

// ───────────────────────── end ─────────────────────────
function end(g, c) {
  const T = c.T, tie = g.winners.length > 1;
  const win = g.winners.map(id => `<span class="winner">${c.chip(id, 'big')}</span>`).join('');
  const ctl = canLead(c)
    ? `<div class="leadbar">${lead(c, 'again', T('again'))}${lead(c, 'lobby', T('toLobby'), 'secondary')}</div>` : `<p class="muted small">${T('leaderOnly')}</p>`;
  return `<div class="screen ${c.isHost ? 'hostplay' : ''}"><h1 class="enter">🏁 ${T('endTitle')}</h1>
    <div class="podium-box enter"><div class="muted">${tie ? T('topAgents') : T('topAgent')}</div><div class="winners">${win}</div><b class="topscore">${fmt(g.topScore)}</b></div>
    ${ranking(g, c, 0, false)}${ctl}</div>`;
}
