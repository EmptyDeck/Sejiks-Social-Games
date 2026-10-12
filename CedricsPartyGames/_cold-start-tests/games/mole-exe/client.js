/* MOLE.EXE — screens. Pure functions: view in, HTML string out. Theme: Hackers (see theme.css). */
Party.game({
  id: 'mole-exe',
  voice: 'digital',
  avatars: ['💻', '🖥️', '⌨️', '🖱️', '💾', '📟', '👾', '🤖', '🕶️', '🧑‍💻', '🔒', '🔑',
            '📡', '🛰️', '🧬', '🔌', '🔋', '💣', '🧠', '👁️', '🕷️', '🐛', '🦠', '☠️'],
  lobbySounds: ['tap', 'pop', 'aha', 'buzz', 'tick'],
  screenSfx: { briefing: 'reveal', clue: 'whoosh', vote: 'drumroll', reveal: 'reveal', guess: 'drumroll', result: 'ding', final: 'fanfare' },

  strings: {
    en: {
      round: 'ROUND {n}/{total}', category: 'CATEGORY', secret: 'SECRET WORD', agent: 'AGENT', mole: 'MOLE',
      briefAgent: 'ACCESS GRANTED. You know the password.', briefMole: 'INTRUDER DETECTED: it is you. You only know the category. Blend in.',
      briefHost: 'INCOMING TRANSMISSION… check your phone. One of you is the mole.',
      clueHead: 'TYPE ONE WORD', clueHintAgent: 'Hint at the word without giving it away.', clueHintMole: 'Bluff. Sound like you know it.',
      placeholder: 'one_word', send: 'TRANSMIT', resend: 'RE-TRANSMIT', sent: 'Sent. You can still overwrite it.',
      warnWord: 'ERROR: you typed the password itself. Try again.',
      clueCount: '{n}/{total} clues transmitted', noClue: '[ NO SIGNAL ]',
      voteHead: 'WHO IS THE MOLE?', voteHint: 'Tap a suspect. No self-votes.', voted: 'Vote locked.', you: 'YOU',
      voteCount: '{n}/{total} votes in',
      revealHead: 'TRACING INTRUDER…', moleIs: 'THE MOLE IS', caught: 'MOLE CAUGHT', escaped: 'WRONG TARGET',
      caughtSub: 'The mole gets one shot at the password.', escapedSub: 'The mole walks free.', votesN: '{n} vote(s)',
      guessHead: 'LAST CHANCE', guessMole: 'You are busted. Guess the secret word. One shot.', guessPlaceholder: 'password?',
      guessSend: 'EXECUTE', guessSent: 'Guess sent. Fingers crossed.',
      guessAgent: '{name} is typing a guess…', betHead: 'Will the mole crack it?', betYes: 'CRACKED', betNo: 'FAILED', betDone: 'Bet placed.',
      resultHead: 'ROUND REPORT', passwordWas: 'THE PASSWORD WAS', theirGuess: '{name} guessed', noGuess: 'no guess',
      escapedOut: 'MOLE ESCAPED — the mole scores big.', stolenOut: 'PASSWORD STOLEN — the mole guessed it.', bustedOut: 'MOLE BUSTED — agents hold the line.',
      points: '+{n}', final: 'FINAL SCORES', winner: 'TOP HACKER', again: 'REBOOT (play again)', skip: 'SKIP',
      spectator: 'You are watching this one.', waiting: 'Awaiting input…', youMole: 'YOU ARE THE MOLE', youAgent: 'YOU ARE AN AGENT',
      suspect: 'SUSPECT',
    },
    ko: {
      round: '{total}라운드 중 {n}', category: '카테고리', secret: '비밀 단어', agent: '요원', mole: '두더지',
      briefAgent: '접근 승인. 당신은 암호를 알고 있습니다.', briefMole: '침입자 감지: 바로 당신입니다. 카테고리만 알아요. 자연스럽게 섞이세요.',
      briefHost: '암호문 수신 중… 폰을 확인하세요. 이 중 한 명이 두더지입니다.',
      clueHead: '한 단어만 입력', clueHintAgent: '답을 들키지 않게 살짝 힌트를 주세요.', clueHintMole: '아는 척하세요. 티 내지 말고!',
      placeholder: '한_단어', send: '전송', resend: '다시 전송', sent: '전송 완료. 아직 덮어쓸 수 있어요.',
      warnWord: '오류: 암호를 그대로 쳤어요. 다시 입력하세요.',
      clueCount: '{total}명 중 {n}명 전송', noClue: '[ 신호 없음 ]',
      voteHead: '두더지는 누구?', voteHint: '의심되는 사람을 누르세요. 자기 자신은 안 돼요.', voted: '투표 완료.', you: '나',
      voteCount: '{total}명 중 {n}명 투표',
      revealHead: '침입자 추적 중…', moleIs: '두더지는', caught: '두더지 검거', escaped: '엉뚱한 사람 지목',
      caughtSub: '두더지에게 암호를 맞힐 마지막 기회가 주어집니다.', escapedSub: '두더지는 유유히 사라집니다.', votesN: '{n}표',
      guessHead: '마지막 기회', guessMole: '들켰어요. 비밀 단어를 맞혀 보세요. 딱 한 번!', guessPlaceholder: '암호는?',
      guessSend: '실행', guessSent: '전송 완료. 행운을 빌어요.',
      guessAgent: '{name}님이 정답을 입력하는 중…', betHead: '두더지가 맞힐까요?', betYes: '맞힌다', betNo: '못 맞힌다', betDone: '베팅 완료.',
      resultHead: '라운드 결과', passwordWas: '암호는', theirGuess: '{name}의 추측', noGuess: '입력 없음',
      escapedOut: '두더지 도주 성공! 큰 점수 획득', stolenOut: '암호 탈취! 두더지가 맞혔어요', bustedOut: '두더지 검거! 요원들의 승리',
      points: '+{n}', final: '최종 점수', winner: '최고의 해커', again: '재부팅 (다시 하기)', skip: '건너뛰기',
      spectator: '이번 판은 관전 중이에요.', waiting: '입력 대기 중…', youMole: '당신은 두더지', youAgent: '당신은 요원',
      suspect: '용의자',
    },
  },

  player(g, c) {
    const T = c.T, head = roundHead(g, c);
    const cat = `<div class="kv"><span class="k">${T('category')}</span><span class="v">${c.esc(c.L(g.category))}</span></div>`;
    const card = roleCard(g, c, cat);
    if (g.screen === 'briefing') {
      const mole = g.role === 'mole';
      return `<div class="screen center ${mole ? 'is-mole' : 'is-agent'}">${head}
        <h1 class="glitch role-title" data-t="${mole ? T('mole') : T('agent')}">${mole ? T('mole') : T('agent')}</h1>
        ${type(mole ? T('briefMole') : T('briefAgent'), 'lead')}${cat}
        ${mole ? '' : `<div class="kv big"><span class="k">${T('secret')}</span><span class="v pw">${c.esc(c.L(g.word))}</span></div>`}
        ${c.timer(g.deadline, g.total)}</div>`;
    }
    if (g.screen === 'clue') {
      const mole = g.role === 'mole';
      return `<div class="screen">${head}${card}<h3 class="prompt">&gt; ${T('clueHead')}<span class="cursor"></span></h3>
        <p class="muted small">${mole ? T('clueHintMole') : T('clueHintAgent')}</p>${c.timer(g.deadline, g.total)}
        <input id="clue" class="input" maxlength="16" autocomplete="off" autocapitalize="none" spellcheck="false" placeholder="${T('placeholder')}" value="${c.esc(g.mine || '')}">
        <button class="btn" data-send="clue" data-from="clue" data-sfx="pop">${g.mine ? T('resend') : T('send')}</button>
        <p class="small ${g.warn ? 'warn' : 'muted'}">${g.warn ? T('warnWord') : g.mine ? T('sent') : ''}</p>
        <p class="muted small">${T('clueCount', { n: g.submitted.length, total: c.players.length })}</p></div>`;
    }
    if (g.screen === 'vote') {
      const rows = g.clues.map(r => {
        const me = r.id === c.me.id;
        return `<button class="btn suspect ${g.myVote === r.id ? 'picked' : ''}" ${me || g.myVote ? 'disabled' : ''} data-send="vote" data-p="${r.id}">
          ${c.avatar(r.id)}<span class="nm">${c.esc(c.name(r.id))}${me ? ` <em>(${T('you')})</em>` : ''}</span>
          <span class="cl">${r.clue ? c.esc(r.clue) : T('noClue')}</span></button>`;
      }).join('');
      return `<div class="screen">${head}${card}<h3 class="prompt">&gt; ${T('voteHead')}</h3>${c.timer(g.deadline, g.total)}
        <div class="stack stagger">${rows}</div>
        <p class="muted small">${g.myVote ? T('voted') : T('voteHint')} ${T('voteCount', { n: g.voted.length, total: c.players.length })}</p></div>`;
    }
    if (g.screen === 'reveal') return `<div class="screen center">${head}${split(revealBlock(g, c), tallyBlock(g, c))}</div>`;
    if (g.screen === 'guess') {
      const iAmMole = g.role === 'mole' && !g.spectator;
      let body;
      if (iAmMole) {
        body = `<p class="lead">${T('guessMole')}</p>
          <input id="guess" class="input" maxlength="30" autocomplete="off" spellcheck="false" placeholder="${T('guessPlaceholder')}" ${g.guessed ? 'disabled' : ''}>
          <button class="btn" data-send="guess" data-from="guess" data-sfx="pop" ${g.guessed ? 'disabled' : ''}>${T('guessSend')}</button>
          <p class="muted small">${g.guessed ? T('guessSent') : ''}</p>`;
      } else {
        body = `<p class="lead">${T('guessAgent', { name: c.esc(c.name(g.mole)) })}</p><h3>&gt; ${T('betHead')}</h3>
          ${g.spectator ? '' : `<div class="row two"><button class="btn ${g.myBet === 1 ? 'picked' : ''}" ${g.myBet != null ? 'disabled' : ''} data-send="bet" data-v="1">${T('betYes')}</button>
          <button class="btn secondary ${g.myBet === 0 ? 'picked' : ''}" ${g.myBet != null ? 'disabled' : ''} data-send="bet" data-v="0">${T('betNo')}</button></div>
          <p class="muted small">${g.myBet != null ? T('betDone') : ''}</p>`}`;
      }
      return `<div class="screen">${head}<h2 class="glitch" data-t="${T('guessHead')}">${T('guessHead')}</h2>${c.timer(g.deadline, g.total)}${body}</div>`;
    }
    if (g.screen === 'result') {
      return `<div class="screen">${head}${split(resultBlock(g, c), board(g, c))}</div>`;
    }
    return `<div class="screen center"><h2 class="glitch" data-t="${T('final')}">${T('final')}</h2>${board(g, c, true)}
      <button class="btn" data-send="again" data-sfx="pop">${T('again')}</button></div>`;
  },

  host(g, c) {
    const T = c.T, head = roundHead(g, c);
    const cat = `<div class="kv big"><span class="k">${T('category')}</span><span class="v">${c.esc(c.L(g.category))}</span></div>`;
    if (g.screen === 'briefing') {
      return `<div class="screen center">${head}<h1 class="glitch" data-t="MOLE.EXE">MOLE.EXE</h1>${type(T('briefHost'), 'lead')}${cat}${c.timer(g.deadline, g.total)}</div>`;
    }
    if (g.screen === 'clue') {
      const who = c.players.map(p => `<div class="who-sub ${g.submitted.includes(p.id) ? 'done' : ''}">${c.avatar(p.id, 'xl')}<b>${c.esc(p.name)}</b><span class="st">${g.submitted.includes(p.id) ? 'OK' : '...'}</span></div>`).join('');
      return `<div class="screen center">${head}${cat}<h2 class="prompt">&gt; ${T('clueHead')}<span class="cursor"></span></h2>${c.timer(g.deadline, g.total)}
        <div class="row stagger" style="justify-content:center;gap:28px">${who}</div>
        <p class="muted">${T('clueCount', { n: g.submitted.length, total: c.players.length })}</p></div>`;
    }
    if (g.screen === 'vote') {
      const rows = g.clues.map(r => `<div class="card termrow">${c.chip(r.id)}<span class="grow"></span><span class="clue">${r.clue ? c.esc(r.clue) : T('noClue')}</span></div>`).join('');
      return `<div class="screen center">${head}${cat}<h2 class="prompt">&gt; ${T('voteHead')}</h2>${c.timer(g.deadline, g.total)}
        <div class="optgrid stagger">${rows}</div><p class="muted">${T('voteCount', { n: g.voted.length, total: c.players.length })}</p></div>`;
    }
    if (g.screen === 'reveal') return `<div class="screen center">${head}${split(revealBlock(g, c), tallyBlock(g, c))}</div>`;
    if (g.screen === 'guess') {
      return `<div class="screen center">${head}<h1 class="glitch" data-t="${T('guessHead')}">${T('guessHead')}</h1>${type(T('guessAgent', { name: c.esc(c.name(g.mole)) }), 'lead')}
        ${c.avatar(g.mole, 'xl')}${c.timer(g.deadline, g.total)}</div>`;
    }
    if (g.screen === 'result') return `<div class="screen center">${head}${split(resultBlock(g, c), board(g, c))}</div>`;
    return `<div class="screen center"><h1 class="glitch" data-t="${T('final')}">${T('final')}</h1>${board(g, c, true)}</div>`;
  },
});

function split(a, b) { return `<div class="split"><div class="col">${a}</div><div class="col">${b}</div></div>`; }
function roundHead(g, c) {
  return `<div class="muted small tag">[ MOLE.EXE ] ${c.T('round', { n: g.round, total: g.rounds })}</div>`;
}
function type(text, cls) {
  return `<p class="type ${cls || ''}" style="--n:${Math.max(8, [...text].length)}">${text}</p>`;
}
function roleCard(g, c, cat) {
  if (g.role === 'mole') return `<div class="rolecard mole"><b>${c.T('youMole')}</b>${cat}</div>`;
  return `<div class="rolecard agent"><b>${c.T('youAgent')}</b>${cat}<div class="kv"><span class="k">${c.T('secret')}</span><span class="v pw">${c.esc(c.L(g.word))}</span></div></div>`;
}
function revealBlock(g, c) {
  const T = c.T;
  return `<h3 class="prompt">&gt; ${T('revealHead')}</h3>
    <div class="moleis"><div class="muted">${T('moleIs')}</div>${c.avatar(g.mole, 'xl')}
      <h1 class="glitch bigname" data-t="${c.esc(c.name(g.mole))}">${c.esc(c.name(g.mole))}</h1></div>
    <h2 class="verdict ${g.caught ? 'ok' : 'bad'}">${g.caught ? T('caught') : T('escaped')}</h2>
    <p class="muted">${g.caught ? T('caughtSub') : T('escapedSub')}</p>`;
}
function tallyBlock(g, c) {
  const rows = c.players.map(p => ({ p, n: g.tally[p.id] || 0 })).sort((a, b) => b.n - a.n)
    .map(r => `<div class="card termrow ${r.p.id === g.mole ? 'is-mole-row' : ''}">${c.chip(r.p.id)}<span class="grow"></span>
      <b class="bar">${'█'.repeat(r.n) || '·'}</b><span class="muted">${c.T('votesN', { n: r.n })}</span></div>`).join('');
  return `<div class="stack stagger tally">${rows}</div>`;
}
function resultBlock(g, c) {
  const T = c.T, out = { escaped: T('escapedOut'), stolen: T('stolenOut'), busted: T('bustedOut') }[g.outcome];
  const guess = g.caught ? `<div class="kv"><span class="k">${T('theirGuess', { name: c.esc(c.name(g.mole)) })}</span><span class="v ${g.guessOk ? 'ok' : 'bad'}">${g.guess ? c.esc(g.guess) : T('noGuess')}</span></div>` : '';
  return `<h3 class="prompt">&gt; ${T('resultHead')}</h3>
    <div class="kv big"><span class="k">${T('passwordWas')}</span><span class="v pw">${c.esc(c.L(g.word))}</span></div>
    <div class="row" style="justify-content:center">${c.chip(g.mole)}<b class="tagmole">${T('mole')}</b></div>${guess}
    <h2 class="verdict ${g.outcome === 'busted' ? 'ok' : 'bad'}">${out}</h2>`;
}
function board(g, c, big) {
  return `<div class="stack stagger board ${big ? 'bigboard' : ''}">${g.ranking.map((r, i) => `<div class="card rank">
      <b class="pos">${i + 1}</b>${c.chip(r.id)}<span class="grow"></span>${g.delta && g.delta[r.id] ? `<b class="pts">${c.T('points', { n: g.delta[r.id] })}</b>` : ''}<b class="score">${r.score}</b></div>`).join('')}</div>`;
}
