/* Gilded Takes — screens. Pure functions: view in, HTML string out. Reference game for RULEBOOK.md. */
Party.game({
  id: 'gilded-takes',

  // ── theme behaviour (the look itself is in theme.css) ──
  voice: 'classy',                                           // sound character: softer, lower, longer decay
  avatars: ['🎩', '🥂', '🐎', '⛵', '🕰️', '💎', '🦢', '🍾', '🎻', '🏛️', '🗝️', '🪙',
            '👑', '🍷', '🦚', '📜', '🪞', '🕯️', '🎭', '🏰', '🛎️', '🧣', '🖋️', '🥀'],
  lobbySounds: ['ding', 'pop', 'aha', 'ding'],               // what the "tap for noise" button plays
  screenSfx: { write: 'whoosh', vote: 'drumroll', reveal: 'reveal', final: 'fanfare' },

  strings: {
    en: {
      round: 'Prompt #{n}', write: 'Write your answer', submit: 'Submit', resubmit: 'Update answer',
      placeholder: 'Be witty…', sent: 'Answer received — you may still change it.',
      waitOthers: 'Waiting for the others…', vote: 'Vote for the wittiest', yours: 'Yours', voted: 'Vote cast.',
      votedCount: '{n} of {total} have voted', writtenCount: '{n} of {total} have answered',
      reveal: 'The results', final: 'The Final Standings', points: '+{n}', votes: '{n} vote(s)',
      again: 'Back to the lobby, darling?', next: 'Start the voting', showResults: 'Reveal the results', nextPrompt: 'Another prompt', finishBtn: 'Final standings', leaderOnly: 'The leader moves things along.', skip: 'Skip', winner: 'Victor', ownNote: 'You cannot vote for yourself.',
    },
    ko: {
      round: '{n}번째 질문', write: '답을 적어 주세요', submit: '제출', resubmit: '답 수정',
      placeholder: '재치 있게…', sent: '답을 받았어요 — 아직 바꿀 수 있어요.',
      waitOthers: '다른 사람들을 기다리는 중…', vote: '가장 재치 있는 답에 투표하세요', yours: '내 답', voted: '투표 완료.',
      votedCount: '{total}명 중 {n}명 투표', writtenCount: '{total}명 중 {n}명 작성',
      reveal: '결과 발표', final: '최종 순위', points: '+{n}', votes: '{n}표',
      again: '로비로 돌아갈까요?', next: '투표 시작', showResults: '결과 보기', nextPrompt: '다음 질문', finishBtn: '최종 순위', leaderOnly: '리더가 진행해요.', skip: '건너뛰기', winner: '우승자', ownNote: '자기 답에는 투표할 수 없어요.',
    },
  },

  // ───────────────────────── phones ─────────────────────────
  player(g, c) {
    const T = c.T, head = `<div class="muted small">${T('round', { n: g.round })}</div>`;
    const prompt = `<h2 class="prompt">${c.esc(c.L(g.prompt))}</h2>`;
    if (g.screen === 'write') {
      return `<div class="screen">${head}${prompt}
        <textarea id="ans" class="input" maxlength="80" placeholder="${T('placeholder')}">${c.esc(g.mine || '')}</textarea>
        <button class="btn" data-send="answer" data-from="ans" data-sfx="pop">${g.mine ? T('resubmit') : T('submit')}</button>
        <p class="muted small">${g.mine ? T('sent') : ''}</p>${lead(c, 'next', T('next'), 'secondary')}</div>`;
    }
    if (g.screen === 'vote') {
      const opts = g.options.map(o => `<button class="btn option ${g.myVote === o.i ? 'picked' : ''}" ${o.own ? 'disabled' : ''}
          data-send="vote" data-i="${o.i}">${c.esc(o.text)}${o.own ? ` <em class="small">(${T('yours')})</em>` : ''}</button>`).join('');
      return `<div class="screen">${head}<h3>${T('vote')}</h3>${prompt}
        <div class="stack stagger">${opts}</div><p class="muted small">${g.myVote != null ? T('voted') : T('ownNote')}</p>${lead(c, 'next', T('showResults'))}</div>`;
    }
    if (g.screen === 'reveal') {
      return `<div class="screen">${head}<h3>${T('reveal')}</h3>${prompt}<div class="stack stagger">${resultCards(g, c)}</div>${board(g, c)}
        <div class="leadbar">${lead(c, 'next', T('nextPrompt'))}${lead(c, 'finish', T('finishBtn'), 'secondary')}</div></div>`;
    }
    return `<div class="screen center"><h2>${T('final')}</h2>${board(g, c, true)}${lead(c, 'lobby', T('again'))}</div>`;
  },

  // ───────────────────────── big screen ─────────────────────────
  host(g, c) {
    const T = c.T, head = `<div class="muted">${T('round', { n: g.round })}</div>`;
    const prompt = `<h1 class="prompt">${c.esc(c.L(g.prompt))}</h1>`;
    if (g.screen === 'write') {
      const who = c.players.map(p => `<div class="who-sub ${g.submitted.includes(p.id) ? 'done' : ''}">${c.avatar(p.id, 'xl')}<b>${c.esc(p.name)}</b></div>`).join('');
      return `<div class="screen center">${head}<h3>${T('write')}</h3>${prompt}
        <div class="row stagger" style="justify-content:center;gap:28px">${who}</div>
        <p class="muted">${T('writtenCount', { n: g.submitted.length, total: c.players.length })}</p>${lead(c, 'next', T('next'), 'secondary')}</div>`;
    }
    if (g.screen === 'vote') {
      const opts = g.options.map(o => `<div class="card option big">${c.esc(o.text)}</div>`).join('');
      return `<div class="screen center">${head}<h3>${T('vote')}</h3>${prompt}
        <div class="optgrid stagger">${opts}</div><p class="muted">${T('votedCount', { n: g.voted.length, total: c.players.length })}</p>${lead(c, 'next', T('showResults'))}</div>`;
    }
    if (g.screen === 'reveal') {
      return `<div class="screen">${head}<h3>${T('reveal')}</h3>${prompt}<div class="stack stagger">${resultCards(g, c)}</div>${board(g, c)}
        <div class="leadbar">${lead(c, 'next', T('nextPrompt'))}${lead(c, 'finish', T('finishBtn'), 'secondary')}</div></div>`;
    }
    return `<div class="screen center"><h1>${T('final')}</h1>${board(g, c, true)}${lead(c, 'lobby', T('again'))}</div>`;
  },
});

function resultCards(g, c) {
  return g.results.map(r => `<div class="card result ${r.votes ? 'hit' : ''}">
      <div class="r-text">${c.esc(r.text)}</div>
      <div class="row">${c.chip(r.by)}<span class="grow"></span>
        <span class="muted">${c.T('votes', { n: r.votes })}</span>${r.points ? `<b class="pts">${c.T('points', { n: r.points })}</b>` : ''}</div></div>`).join('');
}

function board(g, c, big) {
  return `<div class="stack stagger board ${big ? 'bigboard' : ''}">${g.ranking.map((r, i) => `<div class="card rank">
      <b class="pos">${i + 1}</b>${c.chip(r.id)}<span class="grow"></span><b class="score">${r.score}</b></div>`).join('')}</div>`;
}

// leader button: the PIN-leader's phone sends data-send, the laptop's big screen data-host-send (both reach Game._leader)
function lead(c, type, label, cls) {
  if (!(c.isLeader)) return '';
  return `<button class="btn ${cls || ''}" ${'data-send'}="${type}">${label}</button>`;
}
