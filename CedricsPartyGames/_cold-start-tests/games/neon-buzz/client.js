/* NEON BUZZ — screens. Pure functions: view in, HTML string out. */
Party.game({
  id: 'neon-buzz',
  voice: 'retro',
  avatars: ['👾', '🕹️', '🎮', '👻', '🍒', '⭐', '💎', '🔥', '🚀', '🛸', '👽', '🤖',
            '💥', '⚡', '🎯', '🏆', '🪙', '🍄', '🐸', '🦖', '🧨', '🎲', '🔮', '🌈'],
  lobbySounds: ['pop', 'ding', 'aha', 'tick', 'toot'],
  screenSfx: { ready: 'whoosh', wait: 'tick', go: 'ding', result: 'reveal', final: 'fanfare' },

  strings: {
    en: {
      round: 'ROUND {n}/{total}', ready: 'GET READY', readyHint: 'Thumb on the screen. Wait for the flash.',
      wait: 'WAIT FOR IT...', waitHint: 'Tap now and you lose points!', now: 'NOW!', tapHint: 'TAP!',
      early: 'TOO EARLY!', earlyHint: '{n} points off. Sit this round out.', locked: 'LOCKED IN', waitOthers: 'Waiting for the others...',
      tappedCount: '{n}/{total} tapped', ms: '{n} ms', resultTitle: 'RESULTS', falseStart: 'FALSE START', slow: 'TOO SLOW',
      you: 'YOU', youRank: 'You are #{n}!', youEarly: 'False start!', youSlow: 'Too slow!', points: '{n}',
      final: 'HI-SCORES', best: 'best {n} ms', again: 'INSERT COIN: PLAY AGAIN', skip: 'SKIP', total: 'TOTAL', winner: 'CHAMPION',
      gameTitle: 'NEON BUZZ',
    },
    ko: {
      round: '{n}/{total} 라운드', ready: '준비!', readyHint: '화면에 엄지를 올리고 번쩍일 때까지 기다리세요.',
      wait: '기다려...', waitHint: '지금 누르면 감점이에요!', now: '지금!', tapHint: '눌러!',
      early: '너무 일렀어요!', earlyHint: '{n}점 감점. 이번 판은 쉬어요.', locked: '입력 완료', waitOthers: '다른 사람들을 기다리는 중...',
      tappedCount: '{total}명 중 {n}명 눌렀어요', ms: '{n} ms', resultTitle: '결과', falseStart: '부정 출발', slow: '너무 느림',
      you: '나', youRank: '{n}등이에요!', youEarly: '부정 출발!', youSlow: '너무 느렸어요!', points: '{n}',
      final: '최종 순위', best: '최고 {n} ms', again: '코인 투입: 한 판 더', skip: '건너뛰기', total: '합계', winner: '챔피언',
      gameTitle: '네온 버저',
    },
  },

  // ───────────────────────── phones ─────────────────────────
  player(g, c) {
    const T = c.T, head = `<div class="nb-round">${T('round', { n: g.round, total: g.rounds })}</div>`;
    if (g.screen === 'ready') {
      return `<div class="screen center nb-ready">${head}<h1 class="nb-big enter">${T('ready')}</h1>
        <div class="nb-thumb enter">👆</div><p class="enter">${T('readyHint')}</p>${c.timer(g.deadline, g.total)}</div>`;
    }
    if (g.screen === 'wait') {
      if (g.mine === 'false') return early(g, c, head);
      return `<div class="nb-layer nb-dark"></div><div class="screen center nb-wait">${head}
        <h1 class="nb-big nb-blink">${T('wait')}</h1><p>${T('waitHint')}</p></div>
        <button class="nb-zone" data-send="tap" data-sfx="buzz" aria-label="tap"></button>`;
    }
    if (g.screen === 'go') {
      if (g.mine === 'false') return early(g, c, head);
      if (g.mine === 'tap') {
        return `<div class="nb-layer nb-locked"></div><div class="screen center">${head}
          <h2 class="nb-big">${T('locked')}</h2><div class="nb-ms">${T('ms', { n: g.myMs })}</div>
          <p>${T('waitOthers')}</p><p class="muted small">${T('tappedCount', { n: g.tapped.length, total: c.players.length })}</p></div>`;
      }
      return `<div class="nb-layer nb-go"></div><div class="screen center nb-nowwrap">
        <h1 class="nb-now">${T('now')}</h1></div>
        <button class="nb-zone nb-zone-go" data-send="tap" data-sfx="pop" aria-label="tap"><span>${T('tapHint')}</span></button>`;
    }
    if (g.screen === 'result') {
      const mine = g.results.find(r => r.id === c.me.id);
      let line = '';
      if (mine) {
        if (mine.status === 'ok') line = `<div class="nb-mine ok"><b>${T('youRank', { n: mine.rank })}</b><span>${T('ms', { n: mine.ms })}</span><em>+${mine.points}</em></div>`;
        else if (mine.status === 'false') line = `<div class="nb-mine bad"><b>${T('youEarly')}</b><em>${mine.points}</em></div>`;
        else line = `<div class="nb-mine bad"><b>${T('youSlow')}</b><em>0</em></div>`;
      }
      return `<div class="screen">${head}<h2 class="nb-title">${T('resultTitle')}</h2>${line}
        <div class="stack">${resultRows(g, c, false)}</div>${board(g, c)}</div>`;
    }
    return `<div class="screen center"><h2 class="nb-title">${T('final')}</h2>${champion(g, c)}${board(g, c, true)}
      <button class="btn" data-send="again" data-sfx="pop">${T('again')}</button></div>`;
  },

  // ───────────────────────── big screen ─────────────────────────
  host(g, c) {
    const T = c.T, head = `<div class="nb-round">${T('round', { n: g.round, total: g.rounds })}</div>`;
    if (g.screen === 'ready') {
      return `<div class="screen center nb-ready">${head}<h1 class="nb-big enter">${T('ready')}</h1><p class="enter">${T('readyHint')}</p>
        ${c.timer(g.deadline, g.total)}${board(g, c)}</div>`;
    }
    if (g.screen === 'wait') {
      return `<div class="nb-layer nb-dark"></div><div class="screen center nb-wait">${head}<h1 class="nb-big nb-blink">${T('wait')}</h1>
        <p>${T('waitHint')}</p>${chips(g, c)}</div>`;
    }
    if (g.screen === 'go') {
      return `<div class="nb-layer nb-go"></div><div class="screen center nb-nowwrap"><h1 class="nb-now">${T('now')}</h1>${chips(g, c)}</div>`;
    }
    if (g.screen === 'result') {
      return `<div class="screen center">${head}<h1 class="nb-title">${T('resultTitle')}</h1>
        <div class="nb-cols"><div class="stack">${resultRows(g, c, true)}</div>${board(g, c)}</div>
        ${c.timer(g.deadline, g.total)}<button class="btn secondary nb-skip" data-host-send="skip">${T('skip')}</button></div>`;
    }
    return `<div class="screen center"><h1 class="nb-title">${T('final')}</h1>${champion(g, c)}${board(g, c, true)}</div>`;
  },
});

function early(g, c, head) {
  const T = c.T;
  return `<div class="nb-layer nb-early"></div><div class="screen center">${head}<h1 class="nb-big shake">${T('early')}</h1>
    <p>${T('earlyHint', { n: 50 })}</p><p class="muted">${T('waitOthers')}</p></div>`;
}

function chips(g, c) {
  return `<div class="nb-chips">${c.players.map(p => {
    const st = (g.false || []).includes(p.id) ? 'false' : (g.tapped || []).includes(p.id) ? 'in' : '';
    return `<div class="nb-chip ${st}">${c.avatar(p.id, 'xl')}<b>${c.esc(p.name)}</b></div>`;
  }).join('')}</div>`;
}

function resultRows(g, c, big) {
  const ok = g.results.filter(r => r.status === 'ok');
  const max = Math.max(1, ...ok.map(r => r.ms));
  const order = ok.concat(g.results.filter(r => r.status !== 'ok'));
  const n = order.length;
  // staggered: slowest appears first, champion last (drumroll order); inline delay because order is DOM order
  return order.map((r, i) => {
    const delay = ((n - 1 - i) * 0.35).toFixed(2);
    let right;
    if (r.status === 'ok') right = `<b class="nb-time">${c.T('ms', { n: r.ms })}</b><em class="nb-pts">+${r.points}</em>`;
    else if (r.status === 'false') right = `<b class="nb-time bad">${c.T('falseStart')}</b><em class="nb-pts bad">${r.points}</em>`;
    else right = `<b class="nb-time dim">${c.T('slow')}</b><em class="nb-pts dim">0</em>`;
    const bar = r.status === 'ok' ? `<i class="nb-bar" style="width:${Math.max(8, Math.round(r.ms / max * 100))}%"></i>` : '';
    return `<div class="card nb-row enter ${r.rank === 1 ? 'first' : ''} ${r.status}" style="animation-delay:${delay}s">
      <div class="row">${r.rank ? `<span class="nb-rank">${r.rank}</span>` : '<span class="nb-rank">-</span>'}${c.chip(r.id)}<span class="grow"></span>${right}</div>${bar}</div>`;
  }).join('');
}

function board(g, c, big) {
  return `<div class="stack stagger nb-board ${big ? 'big' : ''}">${g.ranking.map((r, i) => `<div class="card nb-score">
    <b class="nb-pos">${i + 1}</b>${c.chip(r.id)}<span class="grow"></span>
    ${big && r.best != null ? `<span class="muted small">${c.T('best', { n: r.best })}</span>` : ''}<b class="nb-total">${r.score}</b></div>`).join('')}</div>`;
}

function champion(g, c) {
  const w = g.ranking[0];
  return w ? `<div class="nb-champ enter"><div class="muted">${c.T('winner')}</div>${c.avatar(w.id, 'xl')}<h2>${c.esc(c.name(w.id))}</h2></div>` : '';
}
