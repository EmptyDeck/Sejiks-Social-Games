/* Chameleon C (field-guide edition) — screens. Pure functions: view in, HTML out.
 * Sofa game: no timers, no rounds. Everyone sees the SAME word grid; the secret is hold-to-reveal for everyone,
 * so nobody gives themselves away by staring at their phone. Leader controls come from the PIN-leader phone
 * (data-send) or the laptop big screen (data-host-send). */
Party.game({
  id: 'chameleon',

  voice: 'cartoon',
  avatars: ['\u2766', '\u2767', '\u2619', '\u273F', '\u2740', '\u2741', '\u2743', '\u274B', '\u273E', '\u273A', '\u2742', '\u2726', '\u2756', '\u2722', '\u2748', '\u2749', '\u2618', '\u2698', '\u269C', '\u2724', '\u274A', '\u2731', '\u2732', '\u2042'].map(g => g + '\uFE0E'),
  lobbySounds: ['boing', 'pop', 'toot', 'honk', 'aha'],
  screenSfx: { setup: 'pop', play: 'whoosh', vote: 'drumroll', guess: 'drumroll', result: 'reveal' },

  strings: {
    en: {
      category: 'Habitat', wordN: 'Word #{n}',
      setupTitle: 'Set up the expedition', setupWait: 'The leader is setting things up…', begin: 'Deal the word',
      optVote: 'Voting on the phones', optVoteHelp: 'Off = just talk, the leader reveals', on: 'ON', off: 'OFF',
      optK: 'Chameleons', optKHelp: 'How many players do not know the word', optCats: 'Habitats', all: 'All',
      holdTitle: 'Hold to open your secret', holdHelp: 'Everyone holds it, so nobody looks suspicious.',
      youChameleon: 'You are the CHAMELEON', chameleonHelp: 'You do not know the word. Describe it vaguely and blend in.',
      theWordIs: 'The secret word is', insiderHelp: 'Describe it without making it too obvious.',
      seen: 'I have seen it', seenCount: '{n} of {total} have checked',
      first: '{name} goes first', firstAsk: 'Who describes first? Play rock-paper-scissors, or let the leader pick.',
      pickRandom: 'Pick who goes first', orChoose: 'or tap a name:',
      toVote: 'Start voting', revealNow: 'Reveal now', voteTitle: 'Who is the chameleon?', voteHelp: 'Tap your suspect. You can change your mind.',
      voted: 'Vote locked in.', votedCount: '{n} of {total} voted', showResult: 'Show the result',
      caught: 'Caught!', escaped: 'Escaped!', guessTitle: 'One last chance: what was the word?', guessHelp: 'Tap the word you think everyone had.',
      guessWait: 'Waiting for the caught chameleon to guess…', guessedCount: '{n} of {total} guessed', showAnswer: 'Show the answer',
      resultTitle: 'The truth', theChameleons: 'Chameleon(s)', noChameleon: 'Nobody — there was no chameleon this time!', theWord: 'The word',
      votesN: '{n} vote(s)', guessed: 'guessed', right: 'Right!', wrong: 'Wrong', noGuess: 'no guess',
      nextWord: 'Next round', resetGame: 'Reset game', backOptions: 'Change settings', toLobby: 'Back to the lobby',
      leaderOnly: 'The leader moves things along.',
      brand: 'Chameleon', plateNo: 'Plate I', plateCaption: 'The common bluffer', index: 'Index of specimens', chamTag: 'chameleon', members: 'Expedition members',
    },
    ko: {
      category: '서식지', wordN: '{n}번째 단어',
      setupTitle: '탐사 준비', setupWait: '리더가 설정하는 중…', begin: '단어 나눠주기',
      optVote: '폰으로 투표', optVoteHelp: '끄면 말로만 하고 리더가 정답을 공개해요', on: '켜짐', off: '꺼짐',
      optK: '카멜레온 수', optKHelp: '단어를 모르는 사람의 수', optCats: '카테고리', all: '전체',
      holdTitle: '꾹 눌러서 내 비밀 확인', holdHelp: '모두가 똑같이 눌러서 확인해요. 그래서 아무도 티가 안 나요.',
      youChameleon: '당신은 카멜레온입니다', chameleonHelp: '단어를 모릅니다. 애매하게 설명하며 섞여 드세요.',
      theWordIs: '비밀 단어는', insiderHelp: '너무 티 나지 않게 설명하세요.',
      seen: '확인했어요', seenCount: '{total}명 중 {n}명 확인',
      first: '{name} 님부터 시작', firstAsk: '누가 먼저 설명할까요? 가위바위보를 하거나 리더가 골라요.',
      pickRandom: '시작할 사람 뽑기', orChoose: '또는 이름을 눌러서 지정:',
      toVote: '투표 시작', revealNow: '바로 공개', voteTitle: '카멜레온은 누구일까요?', voteHelp: '의심 가는 사람을 누르세요. 바꿀 수 있어요.',
      voted: '투표 완료.', votedCount: '{total}명 중 {n}명 투표', showResult: '결과 보기',
      caught: '잡혔다!', escaped: '도망쳤다!', guessTitle: '마지막 기회: 단어가 뭐였을까요?', guessHelp: '모두가 가진 단어라고 생각하는 걸 누르세요.',
      guessWait: '잡힌 카멜레온이 맞히는 중…', guessedCount: '{total}명 중 {n}명 선택', showAnswer: '정답 보기',
      resultTitle: '진실은', theChameleons: '카멜레온', noChameleon: '없음 — 이번엔 카멜레온이 없었어요!', theWord: '정답 단어',
      votesN: '{n}표', guessed: '선택', right: '정답!', wrong: '오답', noGuess: '선택 안 함',
      nextWord: '다음 라운드', resetGame: '게임 초기화', backOptions: '설정 바꾸기', toLobby: '로비로 돌아가기',
      leaderOnly: '리더가 진행해요.',
      brand: '카멜레온', plateNo: '도판 I', plateCaption: '흔한 허풍쟁이', index: '표본 색인', chamTag: '카멜레온', members: '탐사대원',
    },
  },

  // art slots (core hooks): the specimen plate in the lobby, fern line-drawings + the open book behind everything
  art(slot, c) { return plate(c, slot === 'lobbyHost'); },
  decor() { return decor(); },

  player(g, c) { return body(g, c); },
  host(g, c) { return body(g, c); },
});

// ───────────────────────── one body for phone and big screen ─────────────────────────
function body(g, c) {
  switch (g.screen) {
    case 'setup': return setup(g, c);
    case 'play': return play(g, c);
    case 'vote': return vote(g, c);
    case 'guess': return guess(g, c);
    default: return result(g, c);
  }
}

// a leader button: the PIN-leader phone sends data-send (both reach Game._leader)
function lead(c, type, label, cls, extra) {
  if (!(c.isLeader)) return '';
  const attr = 'data-send';
  return `<button class="btn ${cls || ''}" ${attr}="${type}" ${extra || ''}>${label}</button>`;
}
const canLead = c => c.isLeader;

// two "pages" (the big screen shows them as the left / right page of an open book; on phones they simply stack)
const foot = c => c.isHost ? `<div class="pagefoot">${plate(c, true)}</div>` : '';
const pages = (l, r) => `<div class="pg pg-l">${l}</div><div class="pg pg-r">${r}</div>`;

// masthead: wordmark + Latin name; optionally the habitat / word number on the right
function mast(c, g) {
  const T = c.T;
  const meta = g && g.category ? `<span class="mast-meta"><span class="sc">${T('category')}</span> ${c.esc(c.L(g.category))}<i>·</i><span class="num">${String(g.key).padStart(2, '0')}</span></span>` : '';
  return `<header class="mast"><span class="mast-brand">${sprig()}<b>${T('brand')}</b><i>Chamaeleo ludens</i></span>${meta}</header>`;
}
const head = (g, c) => mast(c, g);
const indexLabel = c => `<div class="idx-label"><span class="sc">${c.T('index')}</span></div>`;

// the word grid = a printed index of specimens; `pick` makes cells tappable (guess), `secret` highlights the answer
function grid(g, c, o) {
  o = o || {};
  const cells = g.grid.map((w, i) => {
    const isSecret = g.secret === i;
    const cls = ['cell', isSecret ? 'secret' : '', o.mark && o.mark[i] ? 'marked' : '', o.chosen === i ? 'chosen' : ''].join(' ');
    const pickAttr = o.pick ? `data-send="guess" data-i="${i}"` : '';
    const n = `<span class="cn">${String(i + 1).padStart(2, '0')}</span>`;
    return `<${o.pick ? 'button' : 'div'} class="${cls}" ${pickAttr}>${n}<span class="cw">${c.esc(c.L(w))}</span></${o.pick ? 'button' : 'div'}>`;
  }).join('');
  return `<div class="wordgrid ${o.pick ? 'pickable' : ''}">${cells}</div>`;
}

// hold-to-reveal: a sealed envelope. Everybody gets the same envelope; only the content differs (never on the big screen).
function hold(g, c) {
  if (c.isHost || !g.role) return '';
  const T = c.T, cham = g.role === 'chameleon';
  const inner = cham
    ? `<span class="peek-big">${T('youChameleon')}</span><span class="peek-help">${T('chameleonHelp')}</span>`
    : `<span class="peek-small">${T('theWordIs')}</span><span class="peek-big">${c.esc(c.L(g.grid[g.secret]))}</span><span class="peek-help">${T('insiderHelp')}</span>`;
  return `<button type="button" class="peek ${cham ? 'is-chameleon' : ''}" aria-label="secret">
    <svg class="env" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true"><path class="env-flap" d="M0 0 L50 38 L100 0Z"/></svg>
    <span class="seal" aria-hidden="true">${sprig()}</span>
    <span class="peek-hint"><b>${T('holdTitle')}</b><small>${T('holdHelp')}</small></span><span class="peek-body">${inner}</span></button>`;
}

// wrap hold + grid so CSS can highlight the secret cell while the envelope is held (insiders only: chameleons have no g.secret)
function holdGrid(g, c, o) {
  return `<div class="holdwrap ${g.role ? 'holding-enabled' : ''}">${hold(g, c)}${grid(g, c, o)}</div>`;
}

function firstBlock(g, c) {
  const T = c.T, name = g.first ? c.esc(c.name(g.first)) : '';
  const banner = g.first
    ? `<div class="firstbanner"><span class="fb-text">${T('first', { name: `<em>${name}</em>` })}</span></div>`
    : `<div class="muted firstask">${T('firstAsk')}</div>`;
  const controls = canLead(c)
    ? `<div class="row leadrow">${lead(c, 'first_random', T('pickRandom'), 'secondary')}</div>
       <div class="muted small">${T('orChoose')}</div>
       <div class="row pickrow">${g.ids.map(id => `<button class="pill" ${'data-send'}="first_set" data-id="${id}">${c.chip(id)}</button>`).join('')}</div>`
    : '';
  return banner + controls;
}

function setup(g, c) {
  const T = c.T, on = g.options.vote;
  const chips = g.categories.map(k => {
    const sel = g.enabled.includes(k.id);
    return `<button class="chip ${sel ? 'on' : ''}" ${canLead(c) ? `${'data-send'}="toggle_cat" data-id="${k.id}"` : 'disabled'}>${sel ? '✓ ' : ''}${c.esc(c.L(k.name))}</button>`;
  }).join('');
  const send = 'data-send';
  const ctl = canLead(c) ? `
${g.votingEnabled ? `    <div class="opt"><div><b>${T('optVote')}</b><div class="muted small">${T('optVoteHelp')}</div></div>
      <button class="btn secondary tog ${on ? 'on' : ''}" ${send}="toggle_vote">${on ? T('on') : T('off')}</button></div>`: ''}
    <div class="opt"><div><b>${T('optK')}</b><div class="muted small">${T('optKHelp')}</div></div>
      <div class="stepper"><button class="btn secondary" ${send}="chameleons" data-n="${g.options.k - 1}">−</button><b class="knum">${g.options.k}</b>
      <button class="btn secondary" ${send}="chameleons" data-n="${g.options.k + 1}">+</button></div></div>` : `
    ${g.votingEnabled ? `<div class="opt"><b>${T('optVote')}</b><span class="optval">${on ? T('on') : T('off')}</span></div>` : ''}
    <div class="opt"><b>${T('optK')}</b><span class="knum">${g.options.k}</span></div>`;
  const left = `${mast(c)}<h1>${T('setupTitle')}</h1>${canLead(c) ? '' : `<p class="muted">${T('setupWait')}</p>`}<div class="opts">${ctl}</div>`;
  const right = `<div class="row between catbar"><span class="sc">${T('optCats')}</span>${lead(c, 'all_cats', T('all'), 'secondary tiny')}</div>
    <div class="chips stagger">${chips}</div>
    ${lead(c, 'begin', T('begin'), 'bigbtn', 'data-sfx="whoosh"')}${foot(c)}`;
  return `<div class="screen setup ${c.isHost ? 'hostplay' : ''}">${pages(left, right)}</div>`;
}

function play(g, c) {
  const T = c.T, seen = g.seen.length, total = g.ids.length;
  const seenLine = `<div class="seenrow muted small">${T('seenCount', { n: seen, total })}</div>`;
  const seenBtn = c.isHost ? '' : `<button class="btn secondary" data-send="seen" data-once>${T('seen')}</button>`;
  const lc = canLead(c) ? `<div class="leadbar">${g.options.vote ? lead(c, 'to_vote', T('toVote')) : ''}${lead(c, 'reveal', T('revealNow'), 'secondary')}</div>` : (c.isHost ? '' : `<p class="muted small">${T('leaderOnly')}</p>`);
  return c.isHost
    ? `<div class="screen hostplay">${pages(head(g, c) + firstBlock(g, c) + seenLine + foot(c), indexLabel(c) + holdGrid(g, c))}</div>`
    : `<div class="screen">${head(g, c)}${firstBlock(g, c)}${indexLabel(c)}${holdGrid(g, c)}
    ${seenLine}${seenBtn}${lc}</div>`;
}

function vote(g, c) {
  const T = c.T, me = c.me && c.me.id;
  const count = `<div class="seenrow muted">${T('votedCount', { n: g.voted.length, total: g.ids.length })}</div>`;
  const list = c.isHost
    ? count
    : `<div class="stack stagger ${g.ids.length > 9 ? 'many' : ''}">${g.ids.filter(id => id !== me).map(id => `<button class="btn suspect ${g.myVote === id ? 'picked' : ''}" data-send="vote" data-id="${id}">${c.avatar(id)}<span class="sname">${c.esc(c.name(id))}</span></button>`).join('')}</div>
       <p class="muted small">${g.myVote ? T('voted') : T('voteHelp')} · ${T('votedCount', { n: g.voted.length, total: g.ids.length })}</p>`;
  if (c.isHost) return `<div class="screen hostplay">${pages(head(g, c) + `<h2>${T('voteTitle')}</h2>` + list + lead(c, 'reveal', T('showResult')) + foot(c), indexLabel(c) + holdGrid(g, c))}</div>`;
  return `<div class="screen">${head(g, c)}<h2>${T('voteTitle')}</h2>${list}${lead(c, 'reveal', T('showResult'))}${indexLabel(c)}${holdGrid(g, c)}</div>`;
}

function guess(g, c) {
  const T = c.T, me = c.me && c.me.id, mine = g.caught.includes(me);
  const caught = g.caught.map(id => c.chip(id)).join(' ');
  const intro = `<h2><span class="stamp-mini">${T('caught')}</span> ${caught}</h2>`;
  if (mine) {
    return `<div class="screen">${head(g, c)}${intro}<h3>${T('guessTitle')}</h3><p class="muted small">${T('guessHelp')}</p>${grid(g, c, { pick: true })}${lead(c, 'show_answer', T('showAnswer'))}</div>`;
  }
  const wait = `<p class="muted">${T('guessWait')} (${T('guessedCount', { n: g.guessed.length, total: g.caught.length })})</p>`;
  if (c.isHost) return `<div class="screen hostplay">${pages(head(g, c) + intro + wait + foot(c), indexLabel(c) + holdGrid(g, c))}</div>`;
  return `<div class="screen">${head(g, c)}${intro}${wait}${lead(c, 'show_answer', T('showAnswer'))}${indexLabel(c)}${holdGrid(g, c)}</div>`;
}

function result(g, c) {
  const T = c.T;
  const cham = g.chameleons.length ? g.chameleons.map(id => c.chip(id, 'big')).join(' ') : `<b>${T('noChameleon')}</b>`;
  const mark = {}; Object.values(g.guesses).forEach(i => { mark[i] = true; });
  const guessRows = Object.keys(g.guesses).map(id => {
    const i = g.guesses[id], ok = i === g.secret;
    return `<div class="kv">${c.chip(id)}<span>${T('guessed')}: <b>${c.esc(c.L(g.grid[i]))}</b></span><b class="${ok ? 'gain' : 'bad'}">${ok ? T('right') : T('wrong')}</b></div>`;
  }).join('');
  const tally = g.tally ? `<div class="tallygrid ${g.ids.length > 8 ? 'many' : ''}">${g.ids.map(id => `<div class="tally ${g.chameleons.includes(id) ? 'cham' : ''}">${c.chip(id)}${g.chameleons.includes(id) ? `<span class="cham-mark sc">${T('chamTag')}</span>` : ''}<b>${g.tally[id] || 0}</b></div>`).join('')}</div>` : '';
  const ctl = canLead(c) ? `<div class="leadbar">${lead(c, 'next_word', T('nextWord'))}${lead(c, 'options', T('backOptions'), 'secondary')}${lead(c, 'reset', T('resetGame'), 'secondary')}${lead(c, 'lobby', T('toLobby'), 'secondary')}</div>` : (c.isHost ? '' : `<p class="muted small">${T('leaderOnly')}</p>`);
  const stamp = g.tally && g.chameleons.length ? `<div class="stamp ${g.caught.length ? 'caught' : 'escaped'}"><span>${g.caught.length ? T('caught') : T('escaped')}</span></div>` : '';
  const left = `${head(g, c)}<div class="resulthead">${mascot('small', g.caught.length ? 'caught' : '')}<h2>${T('resultTitle')}</h2></div>${stamp}
      <div class="resultleft">
      <div class="kv"><span class="muted sc">${T('theChameleons')}</span><span class="row">${cham}</span></div>
      <div class="kv"><span class="muted sc">${T('theWord')}</span><b class="theword">${c.esc(c.L(g.grid[g.secret]))}</b></div>${guessRows}${tally}
    </div>`;
  return `<div class="screen ${c.isHost ? 'hostplay' : ''}">${pages(left, indexLabel(c) + grid(g, c, { mark }))}${ctl}</div>`;
}

// ───────────────────────── illustration: engraved plates (inline SVG, fixed naturalist palette) ─────────────────────────
function sprig() {
  return `<svg class="sprig" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 22 C12 14 12 8 12 2 M12 8 C8 8 5 6 4 3 C8 3 11 5 12 8 M12 12 C16 12 19 10 20 7 C16 7 13 9 12 12 M12 17 C8.5 17 6 15.5 5 13 C8.5 13 11 14.5 12 17" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
}

function mascot(kind, mood) {
  const x = mood === 'caught';
  const dots = [[96,70],[110,84],[126,66],[140,92],[118,104],[154,76],[100,100],[132,114],[84,92],[160,100],[146,60],[110,60],[168,90],[90,112],[122,90]].map(p => `<circle cx="${p[0]}" cy="${p[1]}" r="${1.6 + (p[0] % 3) * .5}"/>`).join('');
  const ridge = 'M86 74 l3 -8 l4 7 l4 -9 l4 8 l4 -9 l4 8 l4 -9 l4 8 l4 -8 l4 7 l4 -7 l3 6';
  return `<svg class="mascot mascot--${kind}${x ? ' mascot--caught' : ''}" viewBox="0 0 300 190" role="img" aria-label="chameleon">
    <g class="m-branch"><path d="M6 158 C80 146 190 156 296 132" fill="none" stroke="#12392b" stroke-width="13" stroke-linecap="round"/><path d="M6 158 C80 146 190 156 296 132" fill="none" stroke="#a98c5c" stroke-width="9" stroke-linecap="round"/>
      <path d="M30 152 C60 150 90 148 120 148 M170 152 C210 154 250 144 280 134" fill="none" stroke="#12392b" stroke-opacity=".45" stroke-width="1.2"/>
      <g class="m-leaf" fill="#cfd9a0" stroke="#12392b" stroke-width="1.6" stroke-linejoin="round"><path d="M250 138 C258 112 280 104 296 106 C294 124 278 140 250 138Z"/><path d="M250 138 C266 126 280 116 292 108" fill="none"/><path d="M22 152 C14 130 -2 124 -8 124 C-4 140 6 152 22 152Z"/></g></g>
    <g class="m-tail"><path d="M76 100 C44 100 22 120 28 142 C34 160 64 160 68 142 C71 128 52 124 50 138" fill="none" stroke="#12392b" stroke-width="15" stroke-linecap="round"/><path d="M76 100 C44 100 22 120 28 142 C34 160 64 160 68 142 C71 128 52 124 50 138" fill="none" stroke="#9db966" stroke-width="11" stroke-linecap="round"/><path d="M46 112 l4 8 M36 126 l7 4 M34 142 l8 0 M44 154 l5 -5" stroke="#12392b" stroke-width="1.4" stroke-linecap="round" fill="none"/></g>
    <g stroke="#12392b" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
      <path d="M92 116 C96 132 100 140 98 150 M92 150 C98 156 108 154 110 148" fill="none" stroke-width="9"/><path d="M92 116 C96 132 100 140 98 150" fill="none" stroke="#8aa85a" stroke-width="6"/>
      <path d="M72 96 C78 54 140 44 178 58 C200 66 208 88 202 108 C192 130 124 138 92 124 C76 118 70 108 72 96Z" fill="#9db966"/>
      <path d="M88 118 C120 134 176 128 196 112 C190 124 150 138 112 132 C100 130 92 124 88 118Z" fill="#e2e4a8" stroke-width="1.2"/>
      <path d="M112 62 C106 84 108 108 116 128 M138 58 C134 82 136 108 144 128 M162 62 C160 82 164 100 170 112" fill="none" stroke-opacity=".38" stroke-width="3.2"/>
      <path d="${ridge}" fill="none" stroke-width="1.6"/>
      <path d="M150 124 C154 138 158 142 156 150 M150 150 C156 156 168 154 170 148" fill="none" stroke-width="9"/><path d="M150 124 C154 138 158 142 156 150" fill="none" stroke="#8aa85a" stroke-width="6"/>
      <path d="M182 68 C196 52 232 54 246 72 C256 84 252 98 240 104 C226 112 204 108 192 100 C182 92 178 80 182 68Z" fill="#a9c473"/>
      <path d="M184 64 C188 40 210 30 228 40 C222 44 216 48 214 58" fill="#8aa85a"/><path d="M194 58 C198 48 208 42 218 42" fill="none" stroke-width="1.2"/>
      <path d="M212 100 C228 102 242 98 252 90" fill="none" stroke-width="1.8"/>
    </g>
    <g fill="#12392b" fill-opacity=".5" stroke="none">${dots}</g>
    <g class="m-eye"><circle cx="218" cy="76" r="15" fill="#b9c97a" stroke="#12392b" stroke-width="1.8"/><circle cx="218" cy="76" r="10" fill="#f6efd9" stroke="#12392b" stroke-width="1.2"/>
      ${x ? '<path d="M212 70 l12 12 M224 70 l-12 12" stroke="#12392b" stroke-width="3" stroke-linecap="round"/>' : '<circle class="m-pupil" cx="221" cy="76" r="4.6" fill="#12392b"/><circle cx="222.5" cy="74.2" r="1.3" fill="#f6efd9"/>'}
      <path d="M204 70 C208 60 228 58 232 70 M206 84 C212 92 226 92 231 84" fill="none" stroke="#12392b" stroke-width="1.2" stroke-opacity=".6"/></g>
    <circle cx="246" cy="78" r="1.8" fill="#12392b"/>
    <path class="m-tongue" d="M251 91 C268 88 282 92 290 86 L292 96 C282 102 266 98 251 94Z" fill="#cf4a17" stroke="#12392b" stroke-width="1.2"/>
  </svg>`;
}

// the framed specimen plate with its Latin caption (lobby)
function plate(c, host) {
  const T = c.T;
  return `<figure class="plate ${host ? 'plate--host' : ''}"><div class="plate-art">${mascot('hero')}</div>
    <figcaption><span class="sc">${T('plateNo')}</span><i>Chamaeleo ludens</i><span class="cap">${T('plateCaption')}</span></figcaption></figure>`;
}

// botanical line drawings: a fern frond made of leaflet pairs
function frond(cls, n) {
  let p = '';
  for (let i = 0; i < n; i++) {
    const y = 196 - i * (178 / n), L = 6 + 46 * Math.sin(Math.PI * Math.min(1, (i + 1.5) / (n + 1.2)) * 0.96) * (1 - i / (n * 1.6));
    p += `<path d="M100 ${y} Q${100 - L * .5} ${y - 14} ${100 - L} ${y - 9} Q${100 - L * .5} ${y + 1} 100 ${y}Z M100 ${y} Q${100 + L * .5} ${y - 14} ${100 + L} ${y - 9} Q${100 + L * .5} ${y + 1} 100 ${y}Z"/>`;
  }
  return `<svg class="frond ${cls}" viewBox="0 0 200 200" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="1.3" stroke-linejoin="round"><path d="M100 200 C98 140 104 70 100 8"/>${p}</g></svg>`;
}

function decor() {
  return `<div class="decor-bg"></div>${frond('f-a', 15)}${frond('f-b', 12)}${frond('f-c', 13)}<div class="decor-book"><i class="spine"></i></div>`;
}
