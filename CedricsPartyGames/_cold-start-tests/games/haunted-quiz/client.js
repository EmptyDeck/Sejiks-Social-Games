/* Haunted Quiz — screens. Pure functions: view in, HTML string out. */
Party.game({
  id: 'haunted-quiz',
  voice: 'cartoon',                                   // goofy-creepy: boings, toots, honks
  avatars: ['👻', '🎃', '🦇', '🕷️', '💀', '🧛', '🧟', '🧙', '🕸️', '🕯️', '🪦', '🦉',
            '🐈‍⬛', '🧪', '🔮', '⚰️', '🍬', '🌕', '🗝️', '🏚️', '👁️', '🪄', '🥀', '😈'],
  lobbySounds: ['boing', 'toot', 'aha', 'honk', 'pop'],
  screenSfx: { intro: 'whoosh', question: 'boing', reveal: 'reveal', standings: 'ding', final: 'fanfare' },

  strings: {
    en: {
      round: 'Question {n} of {total}', introTitle: 'Question {n}', introLine: 'The candles flicker…',
      lastOne: 'The last question. Make it count!',
      pick: 'Tap your answer — quick!', locked: 'Locked in. The ghosts are watching…',
      noPick: 'No answer', answeredCount: '{n} of {total} answered', tooSlow: 'Too slow — the ghosts got you.',
      right: 'Correct!', wrong: 'Wrong!', timeUp: "Time's up!", pts: '+{n}', streak: '{n} in a row',
      correctIs: 'The answer', reveal: 'The truth', standings: 'The haunted standings', final: 'The Final Haunting',
      again: 'Haunt again?', skip: 'Skip', winner: 'Rules the mansion', nobody: 'Nobody picked this',
      watching: 'Watching from the bench', fast: 'Faster = more points',
    },
    ko: {
      round: '{total}문제 중 {n}번', introTitle: '{n}번 문제', introLine: '촛불이 깜빡거린다…',
      lastOne: '마지막 문제예요. 아껴 둔 힘을 쓰세요!',
      pick: '답을 눌러요. 빨리!', locked: '선택 완료. 유령들이 지켜보는 중…',
      noPick: '답 없음', answeredCount: '{total}명 중 {n}명 답함', tooSlow: '너무 느려요. 유령에게 잡혔어요.',
      right: '정답!', wrong: '땡!', timeUp: '시간 끝!', pts: '+{n}', streak: '{n}연속',
      correctIs: '정답', reveal: '진실의 순간', standings: '저택 순위', final: '최종 순위',
      again: '한 번 더 홀릴까요?', skip: '건너뛰기', winner: '저택의 주인', nobody: '고른 사람 없음',
      watching: '구경 중', fast: '빠를수록 점수가 높아요',
    },
  },

  // ───────────────────────── phones ─────────────────────────
  player(g, c) {
    const T = c.T;
    if (g.screen === 'intro') return intro(g, c);
    if (g.screen === 'question') {
      const head = `<div class="muted small">${T('round', { n: g.round, total: g.rounds })} · ${T('fast')}</div>`;
      const locked = g.mine != null;
      const opts = g.options.map((o, i) => `<button class="btn ans ${g.mine === i ? 'picked' : ''}" ${locked ? 'disabled' : ''}
          data-send="answer" data-i="${i}" data-once data-sfx="pop"><span class="lt">${g.letters[i]}</span><span>${c.esc(c.L(o))}</span></button>`).join('');
      return `<div class="screen">${head}${c.timer(g.deadline, g.total)}<h2 class="qtext">${c.esc(c.L(g.q))}</h2>
        <div class="stack stagger">${opts}</div>
        <p class="muted small center-t">${locked ? T('locked') : T('pick')} · ${T('answeredCount', { n: g.answered.length, total: c.players.length })}</p></div>`;
    }
    if (g.screen === 'reveal') {
      const r = g.results[c.me && c.me.id] || null;
      let banner = '';
      if (r) {
        const ok = r.ok;
        banner = `<div class="banner ${ok ? 'good' : 'bad'}"><b>${ok ? T('right') : (r.pick == null ? T('timeUp') : T('wrong'))}</b>
          ${ok ? `<span class="pts">${T('pts', { n: r.pts })}</span>${r.streak > 1 ? `<span class="chipx">🔥 ${T('streak', { n: r.streak })}</span>` : ''}` : ''}</div>`;
      }
      return `<div class="screen"><div class="muted small">${T('round', { n: g.round, total: g.rounds })}</div>${banner}
        <h3 class="qtext sm">${c.esc(c.L(g.q))}</h3><div class="stack stagger">${revealOpts(g, c, false)}</div></div>`;
    }
    if (g.screen === 'standings') {
      return `<div class="screen"><h2>${T('standings')}</h2><div class="muted small">${T('round', { n: g.round, total: g.rounds })}</div>${board(g, c, false)}</div>`;
    }
    return `<div class="screen center"><div class="ghost-big">👻</div><h2>${T('final')}</h2>${board(g, c, true)}
      <button class="btn" data-send="again" data-sfx="pop">${T('again')}</button></div>`;
  },

  // ───────────────────────── big screen ─────────────────────────
  host(g, c) {
    const T = c.T;
    if (g.screen === 'intro') return intro(g, c);
    if (g.screen === 'question') {
      const opts = g.options.map((o, i) => `<div class="card ans big"><span class="lt">${g.letters[i]}</span><span>${c.esc(c.L(o))}</span></div>`).join('');
      const who = c.players.map(p => `<div class="who-sub ${g.answered.includes(p.id) ? 'done' : ''}">${c.avatar(p.id)}<b>${c.esc(p.name)}</b></div>`).join('');
      return `<div class="screen center"><div class="muted">${T('round', { n: g.round, total: g.rounds })}</div>${c.timer(g.deadline, g.total)}
        <h1 class="qtext">${c.esc(c.L(g.q))}</h1><div class="optgrid stagger">${opts}</div>
        <div class="row whorow">${who}</div></div>`;
    }
    if (g.screen === 'reveal') {
      return `<div class="screen center"><div class="muted">${T('round', { n: g.round, total: g.rounds })}</div>
        <h1 class="qtext">${c.esc(c.L(g.q))}</h1><div class="optgrid stagger">${revealOpts(g, c, true)}</div></div>`;
    }
    if (g.screen === 'standings') {
      return `<div class="screen center"><h1>${T('standings')}</h1>${board(g, c, true)}</div>`;
    }
    return `<div class="screen center"><div class="ghost-big">👻</div><h1>${T('final')}</h1>${board(g, c, true)}</div>`;
  },
});

function intro(g, c) {
  const last = g.round === g.rounds;
  return `<div class="screen center"><div class="muted">${c.T('round', { n: g.round, total: g.rounds })}</div>
    <div class="ghost-big enter">${last ? '💀' : '🕯️'}</div><h1 class="enter">${c.T('introTitle', { n: g.round })}</h1>
    <p class="muted enter">${last ? c.T('lastOne') : c.T('introLine')}</p></div>`;
}

function revealOpts(g, c, big) {
  return g.options.map((o, i) => {
    const who = (g.picks[i] || []).map(id => big ? c.chip(id) : c.avatar(id)).join('');
    const right = i === g.correct;
    const mineHere = c.me && g.mine === i;
    return `<div class="card ans rev ${right ? 'right' : 'wrongopt'} ${mineHere ? 'mine' : ''} ${big ? 'big' : ''}">
      <div class="row"><span class="lt">${right ? '✅' : g.letters[i]}</span><span class="grow">${c.esc(c.L(o))}</span></div>
      <div class="row pickers">${who || (right ? `<span class="muted small">${c.T('nobody')}</span>` : '')}</div></div>`;
  }).join('');
}

function board(g, c, big) {
  return `<div class="stack stagger board ${big ? 'bigboard' : ''}">${g.ranking.map((r, i) => `<div class="card rank ${c.me && c.me.id === r.id ? 'me' : ''}">
      <b class="pos">${i === 0 ? '👑' : i + 1}</b>${c.chip(r.id)}<span class="grow"></span>
      ${r.streak > 1 ? `<span class="chipx">🔥${r.streak}</span>` : ''}<b class="score">${r.score}</b></div>`).join('')}</div>`;
}
