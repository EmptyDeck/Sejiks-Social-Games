/* Guesspionage — visual faithful recreation of Jackbox Poll Position.
 * Audio is served from games/guesspionage/sounds/<id>.ogg via the room.sfx path.
 * Leader: host laptop or PIN-leader phone (data-host-send / data-send). */
Party.game({
  id: 'guesspionage',
  voice: 'digital',
  // PollPositionIcon00-15: vrman, scarflady, eyegadget, eagle2, businessman, boblady,
  // dolphin, vrwoman, goateeman, dog, hatguy, headphonesgirl, radiooperator, informant,
  // facemaskguy, robot
  avatars: ['🕵️','🧣','👁️','🦅','💼','💇','🐬','🕵️‍♀️',
            '🧔','🐕','🎩','🎧','📡','🕶️','😷','🤖'],
  // sounds/ stems played when a player taps each icon in the lobby (same order as avatars)
  characters: [
    'icon_vrman','icon_scarflady','icon_eyegadget','icon_eagle2',
    'icon_businessman','icon_boblady','icon_dolphin','icon_vrwoman',
    'icon_goateeman','icon_dog','icon_hatguy','icon_headphonesgirl',
    'icon_radiooperator','icon_informant','icon_facemaskguy','icon_robot',
  ],
  lobbySounds: ['tick','pop','aha','ding','whoosh'],
  screenSfx: {
    setup: 'pop', category: 'whoosh', guess: 'whoosh',
    call: 'tick', reveal: 'drumroll', bonus: 'whoosh',
    bonusreveal: 'drumroll', end: 'fanfare',
  },

  strings: {
    en: {
      setupTitle: 'Mission Briefing',
      setupWait: 'The handler is preparing the mission…',
      optTimers: 'Countdown timers',
      optTimersHelp: 'Guess 45 s · Call 20 s · Bonus 45 s',
      optFamily: 'Family-Friendly Filter',
      optFamilyHelp: 'Off = a few cheekier questions join in',
      on: 'ON', off: 'OFF',
      firstTitle: 'Who guesses first?',
      firstRandom: '🎲 Pick at random',
      firstHelp: 'or tap a name:',
      firstIs: '{name} guesses first',
      begin: 'Begin the Operation',
      soloNote: 'Alone? Virtual agents will make the calls.',
      roundN: 'Round {n}', turnOf: 'Turn {n} of {total}', bonusRound: 'BONUS ROUND',
      categoryTitle: 'Data Acquisition Mode',
      categoryPicking: '{name} is picking a category…',
      categoryYou: 'Pick a category',
      categorySearch: 'SEARCHING…',
      caseFile: 'CASE FILE',
      isGuessing: '{name} is guessing…',
      yourTurn: 'Your turn, Agent',
      guessHelp: 'What percentage of people surveyed? Set the slider, then lock it in.',
      lockGuess: 'Lock In My Estimate',
      readRoom: 'Will the guess be too high or too low?',
      waitGuess: 'Waiting for {name} to lock in…',
      guessSays: '{name} says',
      shrugNote: 'Out of time — shrug answer (50%), no points',
      skipNote: 'Skipped — shrug answer (50%), no points',
      lockingIn: '{name} is locking in an estimate…',
      callHelp: 'Is the real number higher or lower?',
      higher: 'HIGHER', lower: 'LOWER', muchHigher: 'MUCH HIGHER', muchLower: 'MUCH LOWER',
      muchHelp: 'MUCH = right direction AND more than 15 points off',
      locked: 'Locked in', lockedCount: '{n} of {total} locked in',
      youCalled: 'You called: {call}',
      yourEstimate: 'Your estimate',
      guesserWait: 'Your estimate is out there. Others are calling…',
      callWord: 'Calls', guessWord: 'Guess', realWord: 'Real',
      offBy: 'Off by {n}%', bullseye: 'EXACT MATCH!', offTarget: 'Off target',
      sharp: 'Sharp calls', missed: 'Missed calls', noCalls: 'Nobody made a call',
      virtual: 'virtual agent', you: 'You',
      youGuesser: 'Your estimate earned', youCaller: 'Your call earned',
      pts: '{n} pts',
      dirHi: 'Higher', dirLo: 'Lower', dirMhi: 'Much Higher', dirMlo: 'Much Lower',
      next: 'Next', skip: 'Skip', toBonus: 'To the Bonus Round', ranking: 'Standings',
      andMore: '…and {n} more', leaderOnly: 'The handler moves things along.',
      bonusTitle: 'BONUS QUESTION',
      bonusHelp: 'Pick the answer you think most people chose.',
      lockBonus: 'Lock In My Pick',
      bonusLocked: 'Locked in. Waiting for others…',
      bonusRevealTitle: 'Survey Results',
      bonusPay: 'Correct answer = {pts} pts',
      yourPick: 'Your pick', correctAnswer: 'Most popular answer',
      endTitle: 'Mission Complete', topAgent: 'Top Agent', topAgents: 'Top Agents (Tied!)',
      again: 'Play Again', toLobby: 'Back to Lobby',
      endGame: 'End Game', endAsk: 'End the game and show final standings?',
      endYes: 'Yes, End It', endNo: 'Keep Playing',
      disclaimer: 'Survey results based on real polling data.',
    },
    ko: {
      setupTitle: '작전 브리핑',
      setupWait: '담당관이 작전을 준비하는 중…',
      optTimers: '제한 시간',
      optTimersHelp: '추측 45초 · 판정 20초 · 보너스 45초',
      optFamily: '가족용 필터',
      optFamilyHelp: '끄면 살짝 짓궂은 질문도 섞여요',
      on: '켜짐', off: '꺼짐',
      firstTitle: '누가 먼저 맞힐까요?',
      firstRandom: '🎲 랜덤으로 뽑기',
      firstHelp: '또는 이름을 눌러서 지정:',
      firstIs: '{name} 님부터 시작',
      begin: '작전 개시',
      soloNote: '혼자인가요? 가상 요원이 판정을 해 줄 거예요.',
      roundN: '{n}라운드', turnOf: '{total}명 중 {n}번째', bonusRound: '보너스 라운드',
      categoryTitle: '데이터 수집 모드',
      categoryPicking: '{name} 님이 카테고리를 고르는 중…',
      categoryYou: '카테고리를 선택하세요',
      categorySearch: '탐색 중…',
      caseFile: '사건 파일',
      isGuessing: '{name} 님이 추측하는 중…',
      yourTurn: '당신 차례예요, 요원',
      guessHelp: '몇 퍼센트의 사람들이 그럴까요? 슬라이더를 맞추고 확정하세요.',
      lockGuess: '내 추측 확정',
      readRoom: '추측이 너무 높을까요, 낮을까요?',
      waitGuess: '{name} 님이 확정하길 기다리는 중…',
      guessSays: '{name} 님의 추측',
      shrugNote: '시간 초과 — 얼버무림 (50%), 점수 없음',
      skipNote: '건너뜀 — 얼버무림 (50%), 점수 없음',
      lockingIn: '{name} 님이 추측을 확정하는 중…',
      callHelp: '진짜 수치는 추측보다 높을까요, 낮을까요?',
      higher: '더 높음', lower: '더 낮음', muchHigher: '훨씬 높음', muchLower: '훨씬 낮음',
      muchHelp: '훨씬 = 방향이 맞고 차이가 15%p 초과',
      locked: '선택 완료', lockedCount: '{total}명 중 {n}명 완료',
      youCalled: '내 판정: {call}',
      yourEstimate: '내 추측',
      guesserWait: '추측을 던졌어요. 다른 사람들이 고르는 중…',
      callWord: '판정', guessWord: '추측', realWord: '실제',
      offBy: '{n}%p 차이', bullseye: '정확 일치!', offTarget: '빗나감',
      sharp: '정확한 판정', missed: '빗나간 판정', noCalls: '판정한 사람이 없어요',
      virtual: '가상 요원', you: '나',
      youGuesser: '내 추측 점수', youCaller: '내 판정 점수',
      pts: '{n}점',
      dirHi: '더 높음', dirLo: '더 낮음', dirMhi: '훨씬 높음', dirMlo: '훨씬 낮음',
      next: '다음', skip: '건너뛰기', toBonus: '보너스 라운드로', ranking: '순위',
      andMore: '…외 {n}명', leaderOnly: '담당관이 진행해요.',
      bonusTitle: '보너스 질문',
      bonusHelp: '가장 많은 사람이 골랐을 것 같은 답을 고르세요.',
      lockBonus: '내 선택 확정',
      bonusLocked: '선택 완료. 다른 사람들을 기다리는 중…',
      bonusRevealTitle: '설문 결과',
      bonusPay: '정답 = {pts}점',
      yourPick: '내 선택', correctAnswer: '가장 많이 선택된 답',
      endTitle: '작전 종료', topAgent: '최고 요원', topAgents: '최고 요원들 (공동 1위!)',
      again: '한 판 더', toLobby: '로비로 돌아가기',
      endGame: '게임 끝내기', endAsk: '지금 게임을 끝내고 최종 순위를 볼까요?',
      endYes: '네, 끝낼게요', endNo: '계속하기',
      disclaimer: '설문 결과는 실제 설문 데이터를 기반으로 합니다.',
    },
  },

  player(g, c) { return body(g, c); },
  host(g, c) { return body(g, c); },
});

// ── slider sync ──
(function () {
  function sync() {
    const s = document.getElementById('gslider'), o = document.getElementById('gval'), b = document.getElementById('gsubmit');
    if (s && o && o.textContent !== s.value + '%') o.textContent = s.value + '%';
    if (s && b && b.dataset.value !== s.value) b.dataset.value = s.value;
  }
  let lastTick = 0;
  document.addEventListener('input', e => {
    sync();
    if (e.target && e.target.id === 'gslider' && Date.now() - lastTick > 90 && window.Party) {
      lastTick = Date.now(); Party.sfx('tick');
    }
  });
  new MutationObserver(sync).observe(document.documentElement, { childList: true, subtree: true });
  window.Guesspio = {
    nudge(d) {
      const s = document.getElementById('gslider'); if (!s) return;
      s.value = Math.max(0, Math.min(100, +s.value + d)); sync(); if (window.Party) Party.sfx('tick');
    },
    playAudio(id) {
      if (!id || !window.Party) return;
      Party.sfx(id);
    },
  };

  // Play narrator VO when a new question/screen loads on the host
  // The view embeds audio IDs in data attributes on the dossier element
  new MutationObserver(() => {
    const el = document.querySelector('#screen[data-fresh="1"] .dossier[data-ia]');
    if (!el || el._gpAudioPlayed) return;
    el._gpAudioPlayed = true;
    const ia = el.dataset.ia, qa = el.dataset.qa;
    if (ia && window.Party) {
      Party.sfx(ia);
      if (qa) setTimeout(() => Party.sfx(qa), 1200);
    } else if (qa && window.Party) {
      Party.sfx(qa);
    }
  }).observe(document.documentElement, { childList: true, subtree: true, attributes: true, attributeFilter: ['data-fresh'] });

  // Play response audio when real marker appears (reveal screen)
  new MutationObserver(() => {
    const el = document.querySelector('#screen[data-fresh="1"] .mk-real');
    const ra = document.querySelector('#screen[data-fresh="1"] [data-ra]');
    if (!el || !ra || ra._gpRaPlayed) return;
    ra._gpRaPlayed = true;
    const id = ra.dataset.ra;
    if (id && window.Party) setTimeout(() => Party.sfx(id), 2200);
  }).observe(document.documentElement, { childList: true, subtree: true });
})();

const fmt = n => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
const canLead = c => c.isHost || c.isLeader;
const sendAttr = c => c.isHost ? 'data-host-send' : 'data-send';
let STEP = 0;
const lead = (c, type, label, cls, extra) =>
  canLead(c) ? `<button class="btn ${cls||''}" ${sendAttr(c)}="${type}" data-step="${STEP}" ${extra||''}>${label}</button>` : '';
const step = d => `style="--d:${d}"`;

function body(g, c) {
  STEP = g.round;
  switch (g.screen) {
    case 'setup':      return setup(g, c);
    case 'category':   return category(g, c);
    case 'guess':      return guess(g, c);
    case 'call':       return call(g, c);
    case 'reveal':     return reveal(g, c);
    case 'bonus':      return bonus(g, c);
    case 'bonusreveal': return bonusReveal(g, c);
    default:           return end(g, c);
  }
}

function head(g, c) {
  const T = c.T, st = g.stage || {};
  const label = st.round === 3
    ? `<b>${T('bonusRound')}</b>`
    : `<b>${T('roundN', {n: st.round})}</b> · ${T('turnOf', {n: st.turn, total: st.of})}`;
  const timer = g.timer ? `<div class="gp-timer">${c.timer(g.timer.deadline, g.timer.total)}</div>` : '';
  return `<div class="gp-head"><span class="gp-tag">🕵️ ${label}</span>${timer}</div>`;
}

function name(c, id) { return c.esc(c.name(id)); }

function whoChip(g, c, id) {
  if (id === g.guesser && g.botGuesser)
    return `<span class="who"><span class="avatar bot">🤖</span><b>${c.esc(c.L(g.botGuesser))}</b></span>`;
  return c.chip(id);
}

function leadBar(g, c, nextLabel, nextCls) {
  if (!canLead(c)) return `<p class="muted small gp-leaderonly">${c.T('leaderOnly')}</p>`;
  const T = c.T;
  if (g.ending) {
    return `<div class="gp-confirm"><span>${T('endAsk')}</span><div class="leadbar">${lead(c,'end',T('endYes'),'danger')}${lead(c,'end_cancel',T('endNo'),'secondary')}</div></div>`;
  }
  return `<div class="leadbar">${nextLabel ? lead(c,'next',nextLabel,nextCls) : ''}${lead(c,'end_ask',T('endGame'),'secondary ghost')}</div>`;
}

function dossier(g, c) {
  const q = g.q || {};
  const ia = q.ia || '', qa = q.qa || '', ra = q.ra || '';
  return `<div class="dossier enter" data-ia="${c.esc(ia)}" data-qa="${c.esc(qa)}" data-ra="${c.esc(ra)}">
    <span class="stamp">${c.T('caseFile')}</span>
    <div class="cat-label">${c.esc(q.cat || '')}</div>
    <p class="qtext">${c.esc(q.text ? c.L(q.text) : '')}</p></div>`;
}

function scale(g, c, o) {
  o = o || {};
  const ticks = [0, 25, 50, 75, 100].map(n => `<span class="tk" style="left:${n}%">${n}</span>`).join('');
  const gm = o.guess != null ? `<div class="mk mk-guess${o.shrug?' shrug':''}" style="--pos:${o.guess}%"><b>${o.guess}%</b><i></i></div>` : '';
  const rm = o.real  != null ? `<div class="mk mk-real"  style="--pos:${o.real}%"><i></i><b>${o.real}%</b></div>` : '';
  const sc = o.pending ? '<div class="scan"></div>' : '';
  return `<div class="scale${o.real!=null?' has-real':''}"><div class="track">${sc}${ticks}</div>${gm}${rm}</div>`;
}

function ranking(g, c, delayBase, withDelta, limit) {
  const T = c.T;
  const shown = limit && g.ranking.length > limit ? g.ranking.slice(0, limit) : g.ranking;
  const rest = g.ranking.length - shown.length;
  const rows = shown.map(r => {
    const d = withDelta && g.deltas && g.deltas[r.id];
    return `<div class="rk ${c.me && c.me.id === r.id ? 'me' : ''} ${r.rank===1&&r.score>0?'top':''}">
      <span class="pos">${r.rank}</span>${c.chip(r.id)}<b class="sc">${fmt(r.score)}</b>
      ${withDelta ? `<em class="dl">${d ? '+'+fmt(d) : ''}</em>` : ''}</div>`;
  }).join('');
  return `<div class="ranking"><div class="rk-title">${T('ranking')}</div><div class="rk-list">${rows}</div>
    ${rest > 0 ? `<div class="muted small rk-more">${T('andMore',{n:rest})}</div>` : ''}</div>`;
}

// ── setup ──
function setup(g, c) {
  const T = c.T, lc = canLead(c), send = sendAttr(c);
  const tog = (val, tkey, hkey, type) =>
    `<div class="opt"><div><b>${T(tkey)}</b><div class="muted small">${T(hkey)}</div></div>
     ${lc ? `<button class="btn secondary tog${val?' on':''}" ${send}="${type}">${val?T('on'):T('off')}</button>`
           : `<span class="togview${val?' on':''}">${val?T('on'):T('off')}</span>`}</div>`;
  const pills = g.ids.map(id => lc
    ? `<button class="pill${g.first===id?' sel':''}" ${send}="first_set" data-id="${id}">${c.chip(id)}</button>`
    : `<span class="pill${g.first===id?' sel':''}">${c.chip(id)}</span>`).join('');
  return `<div class="screen${c.isHost?' hostplay':''}">
    <h1 class="enter">🕵️ ${T('setupTitle')}</h1>
    ${lc ? '' : `<p class="muted">${T('setupWait')}</p>`}
    <div class="opts">
      ${tog(g.opts.timers,'optTimers','optTimersHelp','toggle_timers')}
      ${tog(g.opts.family,'optFamily','optFamilyHelp','toggle_family')}
    </div>
    <div class="firstbox">
      <div class="row between"><b>${T('firstTitle')}</b>
        ${lc ? `<button class="btn secondary tiny" ${send}="first_random">${T('firstRandom')}</button>` : ''}
      </div>
      ${g.first ? `<div class="firstbanner">👉 ${T('firstIs',{name:name(c,g.first)})}</div>` : ''}
      ${lc ? `<div class="muted small">${T('firstHelp')}</div>` : ''}
      <div class="pills">${pills}</div>
    </div>
    ${g.solo ? `<p class="muted small solonote">🤖 ${T('soloNote')}</p>` : ''}
    ${lead(c,'begin',T('begin'),'','data-sfx="whoosh"')}
  </div>`;
}

// ── category ──
function category(g, c) {
  const T = c.T, me = c.me && c.me.id, isPicker = me && me === g.picker;
  const send = sendAttr(c);
  const cats = g.cats || [];
  let mid;
  if (c.isHost) {
    mid = `<div class="cat-picking">${c.chip(g.picker)}<span>${T('categoryPicking',{name:''}).trim()}</span></div>
      <div class="cat-search"><span class="search-blink">${T('categorySearch')}</span></div>`;
  } else if (isPicker) {
    const btns = cats.map(cat =>
      `<button class="cat-btn" ${send}="pick_cat" data-cat="${c.esc(cat)}" data-sfx="pop">${c.esc(cat)}</button>`
    ).join('');
    mid = `<h2 class="gp-yourturn">${T('categoryYou')}</h2>
      <div class="cat-grid">${btns}</div>`;
  } else {
    mid = `<div class="cat-picking">${c.chip(g.picker)}<span>${T('categoryPicking',{name:''}).trim()}</span></div>
      <div class="cat-search"><span class="search-blink">${T('categorySearch')}</span></div>`;
  }
  return `<div class="screen${c.isHost?' hostplay':''}">
    ${head(g, c)}
    <div class="cat-header"><b>${T('categoryTitle')}</b></div>
    ${mid}
    ${leadBar(g, c, T('skip'), 'secondary ghost')}
  </div>`;
}

// ── guess ──
function guess(g, c) {
  const T = c.T, me = c.me && c.me.id, mine = me && me === g.guesser;
  let mid;
  if (mine) {
    mid = `<div class="sliderbox">
        <div class="gval" id="gval">50%</div>
        <div class="sliderrow">
          <button class="nudge" type="button" onclick="Guesspio.nudge(-1)">−</button>
          <input class="slider" id="gslider" type="range" min="0" max="100" step="1" value="50">
          <button class="nudge" type="button" onclick="Guesspio.nudge(1)">+</button>
        </div>
        <div class="sliderends"><span>0%</span><span>100%</span></div>
      </div>
      <p class="muted small">${T('guessHelp')}</p>
      <button class="btn big" id="gsubmit" data-send="guess" data-value="50" data-sfx="ding">${T('lockGuess')}</button>`;
  } else {
    mid = `${scale(g, c, {pending: true})}
      <div class="guesser">${c.chip(g.guesser, 'big')}</div>
      <p class="status">🔎 ${T('lockingIn',{name:name(c,g.guesser)})}</p>
      ${c.isHost ? '' : `<p class="muted pulse">${T('readRoom')}</p>`}`;
  }
  return `<div class="screen${c.isHost?' hostplay':''}">
    ${head(g, c)}${dossier(g, c)}
    ${mine ? `<h2 class="gp-yourturn">${T('yourTurn')}</h2>` : ''}
    ${mid}
    ${leadBar(g, c, T('skip'), 'secondary ghost')}
  </div>`;
}

// ── call ──
const DIRNAME = {hi:'dirHi', lo:'dirLo', mhi:'dirMhi', mlo:'dirMlo'};

function lockedRow(g, c) {
  const callers = g.ids.filter(id => id !== g.guesser);
  const chips = callers.map(id =>
    `<span class="lk${g.called.includes(id)?' done':''}">
      ${c.avatar(id)}${c.isHost && callers.length<=12 ? `<small>${name(c,id)}</small>` : ''}
    </span>`
  ).join('');
  return `<div class="lockrow"><div class="lks">${chips}</div>
    <div class="muted small">${c.T('lockedCount',{n:g.called.length,total:callers.length})}</div></div>`;
}

function call(g, c) {
  const T = c.T, me = c.me && c.me.id, isGuesser = me && me === g.guesser;
  const sc = scale(g, c, {guess: g.guess, shrug: g.shrug});
  const says = `<div class="says">${whoChip(g,c,g.guesser)} <span>${T('guessSays',{name:''}).trim()}</span> <b class="big">${g.guess}%</b>${g.shrug?`<small class="muted"> · ${g.why==='skip'?T('skipNote'):T('shrugNote')}</small>`:''}</div>`;
  let mid;
  if (c.isHost || isGuesser) {
    mid = `${isGuesser ? `<p class="muted">${T('guesserWait')}</p>` : ''}${lockedRow(g, c)}`;
  } else if (g.mine) {
    mid = `<div class="lockedcall pop-in"><b>🔒 ${T('locked')}</b><span>${T('youCalled',{call:T(DIRNAME[g.mine])})}</span></div>${lockedRow(g, c)}`;
  } else {
    const b = (d, label, arrow, cls) =>
      `<button class="btn call ${cls}" data-send="call" data-dir="${d}" data-sfx="pop"><span class="ar">${arrow}</span>${label}</button>`;
    mid = `<p class="muted">${T('callHelp')}</p>
      <div class="callgrid${g.much?' much':''}">
        ${g.much ? b('mhi',T('muchHigher'),'▲▲','up') : ''}
        ${b('hi',T('higher'),'▲','up')}
        ${b('lo',T('lower'),'▼','down')}
        ${g.much ? b('mlo',T('muchLower'),'▼▼','down') : ''}
      </div>
      ${g.much ? `<p class="muted small">${T('muchHelp')}</p>` : ''}
      ${lockedRow(g, c)}`;
  }
  return `<div class="screen${c.isHost?' hostplay':''}">
    ${head(g,c)}${dossier(g,c)}${sc}${says}${mid}
    ${leadBar(g,c,T('skip'),'secondary ghost')}
  </div>`;
}

// ── reveal ──
function reveal(g, c) {
  const T = c.T, me = c.me && c.me.id, diff = Math.abs(g.guess - g.real);
  const verdict = diff === 0 ? T('bullseye') : T('offBy',{n:diff});
  const callName = r => r.bot
    ? `<span class="who"><span class="avatar bot">🤖</span><b>${c.esc(c.L(r.name))}</b><small class="muted">${T('virtual')}</small></span>`
    : c.chip(r.id);
  const row = r => `<div class="cl${r.pts>0?' right':' wrong'}">${callName(r)}<span class="dir">${T(DIRNAME[r.dir])}</span><b>${r.pts>0?'+'+fmt(r.pts):'0'}</b></div>`;
  const right = g.calls.filter(r => r.pts > 0), wrong = g.calls.filter(r => r.pts === 0);
  const groups = g.calls.length
    ? `<div class="callcols">
        <div class="cg r-step" ${step(3.0)}><div class="cg-title good">✔ ${T('sharp')}</div><div class="cg-list">${right.map(row).join('')||'<span class="muted small">—</span>'}</div></div>
        <div class="cg r-step" ${step(3.6)}><div class="cg-title bad">✘ ${T('missed')}</div><div class="cg-list">${wrong.map(row).join('')||'<span class="muted small">—</span>'}</div></div>
      </div>`
    : `<p class="muted r-step" ${step(3.0)}>${T('noCalls')}</p>`;
  let mineBanner = '';
  if (me && g.deltas && me in g.deltas) {
    const isG = me === g.guesser;
    mineBanner = `<div class="mine r-step${g.deltas[me]>0?' good':' bad'}" ${step(3.0)}>${T(isG?'youGuesser':'youCaller')} <b>+${fmt(g.deltas[me])}</b></div>`;
  }
  const isLast = g.stage.round === 2 && g.stage.turn === g.stage.of;
  return `<div class="screen${c.isHost?' hostplay':''}">
    ${head(g,c)}${dossier(g,c)}
    <div class="revealgrid">
      <div class="rv-left">
        ${scale(g, c, {guess:g.guess, real:g.real, shrug:g.shrug})}
        <div class="verdict r-step" ${step(2.4)}>
          <div class="vl">${whoChip(g,c,g.guesser)} <span class="vd${diff===0?' good':''}">· ${verdict}</span></div>
          <b class="gpts${g.gpts>0?' good':' bad'}">${g.gpts>0?'+'+fmt(g.gpts):(g.shrug?c.T(g.why==='skip'?'skipNote':'shrugNote'):T('offTarget'))}</b>
        </div>
        ${mineBanner}${groups}
      </div>
      <div class="rv-right r-step" ${step(4.4)}>${ranking(g,c,4.4,true,c.isHost?10:0)}</div>
    </div>
    ${leadBar(g, c, T(isLast?'toBonus':'next'))}
  </div>`;
}

// ── bonus ──
function bonus(g, c) {
  const T = c.T, me = c.me && c.me.id;
  const mine = g.mine || [];
  const send = sendAttr(c);
  let answers;
  if (c.isHost) {
    answers = `<div class="bon-grid">${(g.answers||[]).map(a => `<div class="bon-ans">${c.esc(a)}</div>`).join('')}</div>`;
  } else {
    answers = `<div class="bon-grid pick">${(g.answers||[]).map((a, i) => {
      const on = mine.includes(i);
      return `<button class="bon-ans${on?' on':''}" ${g.myLocked ? 'disabled' : `${send}="pick_bonus" data-i="${i}" data-sfx="pop"`}>${on?'★ ':''}${c.esc(a)}</button>`;
    }).join('')}</div>`;
  }
  const lk = g.ids.map(id => `<span class="lk${g.locked&&g.locked.includes(id)?' done':''}">${c.avatar(id)}</span>`).join('');
  const act = c.isHost ? '' : (g.myLocked
    ? `<div class="lockedcall pop-in"><b>🔒 ${T('locked')}</b><span>${T('bonusLocked')}</span></div>`
    : `<button class="btn big" ${send}="lock_bonus" data-sfx="ding"${mine.length===1?'':' disabled'}>${T('lockBonus')}</button>`);
  return `<div class="screen${c.isHost?' hostplay':''}">
    ${head(g, c)}
    <div class="dossier enter"><span class="stamp">${T('bonusTitle')}</span>
      <div class="cat-label">${c.esc(g.cat||'')}</div>
      <p class="qtext">${c.esc(g.prompt)}</p>
    </div>
    <p class="muted small">${T('bonusHelp')} <b>${T('bonusPay',{pts:fmt(2000)})}</b></p>
    ${answers}
    <div class="lockrow"><div class="lks">${lk}</div>
      <div class="muted small">${T('lockedCount',{n:(g.locked||[]).length,total:g.ids.length})}</div>
    </div>
    ${act ? `<div class="stickyact">${act}</div>` : ''}
    ${leadBar(g, c, T('next'), 'secondary')}
  </div>`;
}

function bonusReveal(g, c) {
  const T = c.T, me = c.me && c.me.id;
  const myPicks = me && g.picks ? (g.picks[me] || []) : [];
  const rows = (g.answers||[]).map((a, n) => {
    const mineOn = myPicks.includes(a.disp_idx);
    return `<div class="br r-step${a.winner?' winner-row':''}" ${step((0.3 + n * 0.4).toFixed(2))}>
      <span class="brbar"><i style="width:${a.pct}%"></i></span>
      <span class="brtext${a.winner?' gold':''}">${a.winner?'★ ':''}${c.esc(a.text)}${mineOn?' ✓':''}</span>
      <b class="brpct">${a.pct}%</b>
    </div>`;
  }).join('');
  const mineBanner = me && g.deltas
    ? `<div class="mine r-step${g.deltas[me]>0?' good':' bad'}" ${step(6.0)}>${T('yourPick')}: <b>+${fmt(g.deltas[me]||0)}</b></div>`
    : '';
  return `<div class="screen${c.isHost?' hostplay':''}">
    ${head(g, c)}
    <div class="dossier compact enter"><span class="stamp">${T('bonusRevealTitle')}</span>
      <div class="cat-label">${c.esc(g.cat||'')}</div>
      <p class="qtext">${c.esc(g.prompt)}</p>
    </div>
    <div class="revealgrid">
      <div class="rv-left"><div class="brlist">${rows}</div>${mineBanner}</div>
      <div class="rv-right r-step" ${step(5.0)}>${ranking(g,c,5,true,c.isHost?10:0)}</div>
    </div>
    ${leadBar(g, c, T('next'))}
  </div>`;
}

// ── end ──
function end(g, c) {
  const T = c.T, tie = g.winners && g.winners.length > 1;
  const win = (g.winners||[]).map(id => `<span class="winner">${c.chip(id,'big')}</span>`).join('');
  const ctl = canLead(c)
    ? `<div class="leadbar">${lead(c,'again',T('again'))}${lead(c,'lobby',T('toLobby'),'secondary')}</div>`
    : `<p class="muted small">${T('leaderOnly')}</p>`;
  return `<div class="screen${c.isHost?' hostplay':''}">
    <h1 class="enter">🏁 ${T('endTitle')}</h1>
    <div class="podium-box enter">
      <div class="muted">${tie?T('topAgents'):T('topAgent')}</div>
      <div class="winners">${win}</div>
      <b class="topscore">${fmt(g.topScore||0)}</b>
    </div>
    ${ranking(g, c, 0, false)}${ctl}
  </div>`;
}
