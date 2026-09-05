/* SIGNAL — 통계 맞히기 게임 (공용 로직)
 *
 * 이 파일은 언어에 무관하다. 화면에 나가는 모든 문자열과 문항은
 * 각 언어 폴더의 data.js 가 window.SIGNAL_DATA 에 넣어 준다.
 *   03Signal_en/data.js  → 영어
 *   03Signal_ko/data.js  → 한국어
 *
 * 원본은 src/signal.app.jsx 다. 이 파일(99shared/signal.app.js)은 빌드 결과물이니
 * 직접 고치지 마라. 고쳤으면 deploy/build.sh 를 돌려 다시 만든다.
 */

const DATA = window.SIGNAL_DATA;
const T = DATA.strings;
const QUESTIONS = DATA.questions;
// 언어마다 저장 슬롯을 따로 쓴다. 안 그러면 한국어로 하다 만 게임이 영어판에서 되살아난다.
const STORE_KEY = 'signal_v2_' + DATA.lang;

/* ─────────────────────────────────────────────────────────────
   GAME LOGIC
───────────────────────────────────────────────────────────── */
const ALPHA = 'ABCDEFGHJKMNOPQRSTUVWXYZ'; // 24 chars, no I/L

function codeToSeed(code) {
  let seed = 0;
  for (const c of code.toUpperCase()) {
    const i = ALPHA.indexOf(c);
    if (i >= 0) seed = seed * 24 + i;
  }
  return seed >>> 0;
}
function createRNG(seed) {
  let s = seed >>> 0;
  return () => {
    s = Math.imul(1664525, s) + 1013904223;
    s = s >>> 0;
    return s / 0x100000000;
  };
}
function selectQuestions(code, n = 10) {
  const rng = createRNG(codeToSeed(code));
  const pool = [...QUESTIONS];
  const out = [];
  while (out.length < n && pool.length > 0) {
    const i = Math.floor(rng() * pool.length);
    out.push(pool.splice(i, 1)[0]);
  }
  return out;
}
function calcScore(guess, answer) {
  const error = Math.abs(guess - answer);
  const denom = Math.max(answer, 5);
  const accuracy = Math.max(0, Math.min(100, 100 - error / denom * 100));
  return {
    accuracy: Math.round(accuracy * 10) / 10,
    roundScore: Math.round(accuracy * accuracy)
  };
}
function generateCode() {
  let c = '';
  for (let i = 0; i < 4; i++) c += ALPHA[Math.floor(Math.random() * ALPHA.length)];
  return c;
}

/* ─────────────────────────────────────────────────────────────
   CIRCULAR SLIDER
───────────────────────────────────────────────────────────── */
function CircularSlider({
  value,
  onChange,
  size = 268
}) {
  const svgRef = React.useRef(null);
  const dragging = React.useRef(false);
  const cx = size / 2,
    cy = size / 2,
    R = size * 0.385;
  const sw = size * 0.052;
  const toXY = deg => {
    const r = (deg - 90) * Math.PI / 180;
    return {
      x: cx + R * Math.cos(r),
      y: cy + R * Math.sin(r)
    };
  };
  const pct = value / 100;
  const angle = pct * 360;
  const thumb = toXY(angle);
  const arcD = () => {
    if (value <= 0) return null;
    if (value >= 100) {
      const t = toXY(0),
        m = toXY(180);
      return `M${t.x},${t.y} A${R},${R} 0 0,1 ${m.x},${m.y} A${R},${R} 0 0,1 ${t.x},${t.y}`;
    }
    const s = toXY(0),
      e = toXY(angle);
    return `M${s.x},${s.y} A${R},${R} 0 ${value > 50 ? 1 : 0},1 ${e.x},${e.y}`;
  };
  const getVal = (clientX, clientY) => {
    const rect = svgRef.current.getBoundingClientRect();
    const dx = clientX - (rect.left + rect.width / 2);
    const dy = clientY - (rect.top + rect.height / 2);
    let deg = Math.atan2(dy, dx) * 180 / Math.PI + 90;
    if (deg < 0) deg += 360;
    return Math.min(100, Math.max(0, Math.round(deg / 360 * 100)));
  };
  const onStart = e => {
    e.preventDefault();
    dragging.current = true;
    const pt = e.touches ? e.touches[0] : e;
    onChange(getVal(pt.clientX, pt.clientY));
  };
  React.useEffect(() => {
    const onMove = e => {
      if (!dragging.current) return;
      e.preventDefault();
      const pt = e.touches ? e.touches[0] : e;
      onChange(getVal(pt.clientX, pt.clientY));
    };
    const onEnd = () => {
      dragging.current = false;
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onEnd);
    window.addEventListener('touchmove', onMove, {
      passive: false
    });
    window.addEventListener('touchend', onEnd);
    window.addEventListener('touchcancel', onEnd);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onEnd);
      window.removeEventListener('touchmove', onMove);
      window.removeEventListener('touchend', onEnd);
      window.removeEventListener('touchcancel', onEnd);
    };
  }, []);

  // Accent glow color
  const glowOpacity = 0.15 + value / 100 * 0.25;
  return /*#__PURE__*/React.createElement("svg", {
    ref: svgRef,
    width: size,
    height: size,
    onMouseDown: onStart,
    onTouchStart: onStart,
    style: {
      touchAction: 'none',
      cursor: 'pointer',
      display: 'block',
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("circle", {
    cx: thumb.x,
    cy: thumb.y,
    r: sw * 1.8,
    fill: `oklch(82% 0.28 128 / ${glowOpacity})`
  }), /*#__PURE__*/React.createElement("circle", {
    cx: cx,
    cy: cy,
    r: R,
    fill: "none",
    stroke: "var(--track)",
    strokeWidth: sw,
    strokeLinecap: "round"
  }), arcD() && /*#__PURE__*/React.createElement("path", {
    d: arcD(),
    fill: "none",
    stroke: "var(--accent)",
    strokeWidth: sw,
    strokeLinecap: "round"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: thumb.x,
    cy: thumb.y,
    r: sw * 0.88,
    fill: "var(--bg)",
    stroke: "var(--accent)",
    strokeWidth: 3
  }), /*#__PURE__*/React.createElement("circle", {
    cx: thumb.x,
    cy: thumb.y,
    r: sw * 0.42,
    fill: "var(--accent)"
  }), /*#__PURE__*/React.createElement("text", {
    x: cx,
    y: cy - sw * 0.6,
    textAnchor: "middle",
    dominantBaseline: "middle",
    fill: "var(--text)",
    fontFamily: "'Space Mono', 'Noto Sans KR', monospace",
    fontSize: size * 0.19,
    fontWeight: "700"
  }, value), /*#__PURE__*/React.createElement("text", {
    x: cx,
    y: cy + size * 0.115,
    textAnchor: "middle",
    fill: "var(--muted)",
    fontFamily: "'Space Grotesk', 'Noto Sans KR', sans-serif",
    fontSize: size * 0.065,
    fontWeight: "500",
    letterSpacing: "0.12em"
  }, T.percent));
}

/* ─────────────────────────────────────────────────────────────
   CODE INPUT (4 boxes)
───────────────────────────────────────────────────────────── */
function CodeInput({
  value,
  onChange
}) {
  const refs = [React.useRef(), React.useRef(), React.useRef(), React.useRef()];
  const chars = (value + '    ').slice(0, 4).split('');
  const setChar = (i, ch) => chars.map((c, idx) => idx === i ? ch : c).join('').trimEnd();

  // 한 칸에 글자를 넣는다. 폰에서는 keydown 이 아니라 이 onChange 로 들어온다.
  // (예전에는 readOnly + inputMode="none" 이라 가상 키보드가 아예 안 떴다.)
  const handleInput = (i, e) => {
    const typed = e.target.value.toUpperCase().replace(/[^A-Z]/g, '');
    if (!typed) return;
    // 붙여넣기나 자동완성으로 여러 글자가 한 번에 들어올 수 있다.
    let next = value;
    let last = i;
    for (const ch of typed) {
      if (last > 3) break;
      if (!ALPHA.includes(ch)) continue; // I, L 은 쓰지 않는다
      next = (next + '    ').slice(0, 4).split('').map((c, idx) => idx === last ? ch : c).join('').trimEnd();
      last += 1;
    }
    onChange(next);
    refs[Math.min(last, 3)].current?.focus();
  };
  const handleKey = (i, e) => {
    if (e.key === 'Backspace') {
      e.preventDefault();
      if (chars[i].trim()) {
        onChange(setChar(i, ' '));
      } else if (i > 0) {
        onChange(setChar(i - 1, ' '));
        refs[i - 1].current?.focus();
      }
    } else if (e.key === 'ArrowLeft' && i > 0) {
      e.preventDefault();
      refs[i - 1].current?.focus();
    } else if (e.key === 'ArrowRight' && i < 3) {
      e.preventDefault();
      refs[i + 1].current?.focus();
    }
    // Tab 은 그대로 흘려보낸다. 막으면 키보드로 다음 버튼에 갈 수 없다.
  };

  const handlePaste = (i, e) => {
    const text = (e.clipboardData || window.clipboardData)?.getData('text') || '';
    if (!text) return;
    e.preventDefault();
    handleInput(i, {
      target: {
        value: text
      }
    });
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 10
    }
  }, [0, 1, 2, 3].map(i => /*#__PURE__*/React.createElement("input", {
    key: i,
    ref: refs[i],
    className: "code-box",
    type: "text",
    value: chars[i].trim(),
    maxLength: 1,
    inputMode: "text",
    autoCapitalize: "characters",
    autoCorrect: "off",
    autoComplete: "off",
    spellCheck: "false",
    "aria-label": `${i + 1}`,
    onChange: e => handleInput(i, e),
    onKeyDown: e => handleKey(i, e),
    onPaste: e => handlePaste(i, e),
    onFocus: e => e.target.select()
  })));
}

/* ─────────────────────────────────────────────────────────────
   MODAL
───────────────────────────────────────────────────────────── */
function Modal({
  title,
  body,
  confirmLabel,
  onConfirm,
  onCancel,
  danger
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "modal-back",
    onClick: onCancel
  }, /*#__PURE__*/React.createElement("div", {
    className: "modal-sheet",
    onClick: e => e.stopPropagation()
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 18,
      fontWeight: 700,
      marginBottom: 8
    }
  }, title), body && /*#__PURE__*/React.createElement("p", {
    style: {
      color: 'var(--muted)',
      fontSize: 14,
      marginBottom: 24,
      lineHeight: 1.6
    }
  }, body), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn btn-primary",
    style: danger ? {
      background: 'oklch(65% 0.22 25)'
    } : {},
    onClick: onConfirm
  }, confirmLabel), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-secondary",
    onClick: onCancel
  }, T.cancel))));
}

/* ─────────────────────────────────────────────────────────────
   PROGRESS DOTS
───────────────────────────────────────────────────────────── */
function ProgressDots({
  total,
  current
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 6,
      alignItems: 'center'
    }
  }, Array.from({
    length: total
  }).map((_, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    className: "progress-dot",
    style: {
      background: i < current ? 'var(--accent)' : i === current ? 'var(--text)' : 'var(--border)',
      transform: i === current ? 'scale(1.4)' : 'scale(1)'
    }
  })));
}

/* ─────────────────────────────────────────────────────────────
   HOME SCREEN
───────────────────────────────────────────────────────────── */
function HomeScreen({
  go
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "screen-wrap fade-in",
    style: {
      justifyContent: 'center'
    }
  }, [0, 1, 2, 3].map(i => /*#__PURE__*/React.createElement("div", {
    key: i,
    className: "radar-ring",
    style: {
      width: 320,
      height: 320,
      animationDelay: `${i * 1}s`
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      zIndex: 1,
      textAlign: 'center',
      padding: '24px 32px',
      maxWidth: 440,
      width: '100%'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "pill",
    style: {
      marginBottom: 20
    }
  }, T.tagline), /*#__PURE__*/React.createElement("h1", {
    style: {
      fontFamily: "'Space Mono', 'Noto Sans KR', monospace",
      fontSize: 'clamp(48px, 16vw, 80px)',
      fontWeight: 700,
      letterSpacing: '-0.02em',
      lineHeight: 1,
      color: 'var(--text)',
      marginBottom: 8
    }
  }, "SIGNAL"), /*#__PURE__*/React.createElement("p", {
    style: {
      color: 'var(--muted)',
      fontSize: 14,
      fontWeight: 500,
      letterSpacing: '0.18em',
      textTransform: 'uppercase',
      marginBottom: 40
    }
  }, T.subtitle), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn btn-primary",
    style: {
      fontSize: 17,
      padding: '20px 40px',
      borderRadius: 16
    },
    onClick: () => go('host')
  }, T.hostGame), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-secondary",
    style: {
      fontSize: 17,
      padding: '20px 40px',
      borderRadius: 16
    },
    onClick: () => go('join')
  }, T.joinGame)), /*#__PURE__*/React.createElement("p", {
    style: {
      color: 'var(--muted)',
      fontSize: 12,
      marginTop: 28,
      letterSpacing: '0.08em'
    }
  }, T.homeFoot)));
}

/* ─────────────────────────────────────────────────────────────
   HOST SCREEN
───────────────────────────────────────────────────────────── */
function HostScreen({
  go,
  goBack,
  startGame,
  hostCode,
  setHostCode
}) {
  // 코드는 앱 state(=localStorage)에 둔다. 컴포넌트 안에만 두면 새로고침 때
  // 새 코드가 뽑혀 방장 혼자 다른 문항을 풀게 된다.
  const code = hostCode;
  const [copied, setCopied] = React.useState(false);
  React.useEffect(() => {
    if (!code) setHostCode(generateCode());
  }, [code]);
  // 훅은 전부 위에서 선언하고 나서 빠져나간다 (조건부 return 뒤에 훅을 두면 안 된다).
  if (!code) return null;
  const handleCopy = () => {
    // file:// 로 열면 secure context 가 아니라 clipboard API 자체가 없다.
    // 그때 "복사됨"을 띄우면 방장이 복사된 줄 알고 엉뚱한 걸 붙여넣는다.
    const ok = () => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    };
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(code).then(ok).catch(() => {});
    }
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "screen-wrap fade-in",
    style: {
      justifyContent: 'flex-start',
      padding: '0 24px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: '100%',
      maxWidth: 440,
      paddingTop: 64,
      paddingBottom: 24
    }
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn btn-ghost",
    style: {
      position: 'fixed',
      top: 16,
      left: 16,
      zIndex: 10
    },
    onClick: goBack
  }, T.back), /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "pill",
    style: {
      marginBottom: 28
    }
  }, T.yourCode), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 12,
      justifyContent: 'center',
      marginBottom: 12
    }
  }, code.split('').map((c, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      width: 68,
      height: 80,
      background: 'var(--surf)',
      border: '2px solid var(--border)',
      borderRadius: 14,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: "'Space Mono', 'Noto Sans KR', monospace",
      fontSize: 32,
      fontWeight: 700,
      color: 'var(--accent)'
    }
  }, c))), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-ghost",
    onClick: handleCopy,
    style: {
      marginBottom: 40,
      fontSize: 13
    }
  }, copied ? T.copied : T.copyCode), /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--surf)',
      border: '1.5px solid var(--border)',
      borderRadius: 16,
      padding: '20px 24px',
      marginBottom: 40,
      textAlign: 'left'
    }
  }, [['1', T.step1], ['2', T.step2], ['3', T.step3]].map(([n, txt]) => /*#__PURE__*/React.createElement("div", {
    key: n,
    style: {
      display: 'flex',
      gap: 14,
      alignItems: 'flex-start',
      marginBottom: n !== '3' ? 16 : 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 26,
      height: 26,
      borderRadius: '50%',
      background: 'var(--accent)',
      color: 'var(--bg)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: 12,
      fontWeight: 700,
      flexShrink: 0,
      marginTop: 1
    }
  }, n), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 14,
      color: 'var(--muted)',
      lineHeight: 1.5,
      paddingTop: 3
    }
  }, txt)))), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-primary",
    style: {
      width: '100%',
      fontSize: 17,
      padding: '20px'
    },
    onClick: () => startGame(code)
  }, T.startGame))));
}

/* ─────────────────────────────────────────────────────────────
   JOIN SCREEN
───────────────────────────────────────────────────────────── */
function JoinScreen({
  go,
  goBack,
  startGame
}) {
  const [code, setCode] = React.useState('');
  const valid = code.trim().length === 4 && code.trim().split('').every(c => ALPHA.includes(c.toUpperCase()));
  return /*#__PURE__*/React.createElement("div", {
    className: "screen-wrap fade-in",
    style: {
      justifyContent: 'center'
    }
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn btn-ghost",
    style: {
      position: 'fixed',
      top: 16,
      left: 16,
      zIndex: 10
    },
    onClick: goBack
  }, T.back), /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: 'center',
      width: '100%',
      maxWidth: 440,
      padding: '0 24px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "pill",
    style: {
      marginBottom: 28
    }
  }, T.enterCode), /*#__PURE__*/React.createElement("h2", {
    style: {
      fontSize: 28,
      fontWeight: 700,
      marginBottom: 8
    }
  }, T.joinTitle), /*#__PURE__*/React.createElement("p", {
    style: {
      color: 'var(--muted)',
      fontSize: 14,
      marginBottom: 40,
      lineHeight: 1.6
    }
  }, T.askHost), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'center',
      marginBottom: 12
    }
  }, /*#__PURE__*/React.createElement(CodeInput, {
    value: code,
    onChange: setCode
  })), /*#__PURE__*/React.createElement("p", {
    style: {
      color: 'var(--muted)',
      fontSize: 12,
      marginBottom: 48,
      letterSpacing: '0.1em'
    }
  }, T.lettersOnly), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-primary",
    style: {
      width: '100%',
      fontSize: 17,
      padding: '20px',
      opacity: valid ? 1 : 0.4
    },
    disabled: !valid,
    onClick: () => valid && startGame(code.toUpperCase())
  }, T.joinCta)));
}

/* ─────────────────────────────────────────────────────────────
   PLAY SCREEN
───────────────────────────────────────────────────────────── */
function PlayScreen({
  state,
  setGuess,
  onSubmit
}) {
  const {
    questions,
    round,
    pendingGuess
  } = state;
  const q = questions[round];
  const [modal, setModal] = React.useState(null); // 'submit' | 'back'

  const handleSubmit = () => setModal('submit');
  return /*#__PURE__*/React.createElement("div", {
    className: "screen-wrap fade-in",
    style: {
      justifyContent: 'center',
      padding: '0'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: '100%',
      maxWidth: 480,
      padding: '0 20px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      minHeight: '100%',
      justifyContent: 'center',
      paddingTop: 72,
      paddingBottom: 24
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      padding: '16px 20px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      background: 'var(--bg)',
      zIndex: 10
    }
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn btn-ghost",
    style: {
      padding: '8px 12px',
      fontSize: 13
    },
    onClick: () => setModal('back')
  }, "\u2715"), /*#__PURE__*/React.createElement(ProgressDots, {
    total: 10,
    current: round
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      width: 60,
      textAlign: 'right'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "'Space Mono', 'Noto Sans KR', monospace",
      fontSize: 13,
      color: 'var(--muted)'
    }
  }, round + 1, "/10"))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 24,
      textAlign: 'center',
      padding: '0 8px'
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 'clamp(16px,4.5vw,20px)',
      fontWeight: 600,
      lineHeight: 1.5,
      color: 'var(--text)',
      textWrap: 'pretty'
    }
  }, q.text), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 11,
      color: 'var(--muted)',
      marginTop: 8,
      letterSpacing: '0.1em',
      textTransform: 'uppercase'
    }
  }, q.source)), /*#__PURE__*/React.createElement(CircularSlider, {
    value: pendingGuess,
    onChange: setGuess,
    size: Math.min(268, window.innerWidth - 48)
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 24,
      width: '100%',
      maxWidth: 280
    }
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn btn-primary",
    style: {
      width: '100%',
      fontSize: 16,
      padding: '18px'
    },
    onClick: handleSubmit
  }, T.lockIn)), modal === 'submit' && /*#__PURE__*/React.createElement(Modal, {
    title: T.lockTitle,
    body: T.lockBody(pendingGuess),
    confirmLabel: T.lockConfirm(pendingGuess),
    onConfirm: () => {
      setModal(null);
      onSubmit(pendingGuess);
    },
    onCancel: () => setModal(null)
  }), modal === 'back' && /*#__PURE__*/React.createElement(Modal, {
    title: T.quitTitle,
    body: T.quitBody,
    confirmLabel: T.quitConfirm,
    danger: true,
    onConfirm: () => {
      setModal(null);
      window.dispatchEvent(new Event('signal-quit'));
    },
    onCancel: () => setModal(null)
  })));
}

/* ─────────────────────────────────────────────────────────────
   STANDBY / REVEAL SCREEN
───────────────────────────────────────────────────────────── */
function StandbyScreen({
  state,
  onReveal,
  onNext
}) {
  const {
    questions,
    round,
    guess,
    revealed
  } = state;
  const q = questions[round];
  const {
    accuracy,
    roundScore
  } = calcScore(guess, q.answer);
  const [showScore, setShowScore] = React.useState(revealed);
  // 이미 공개된 상태로 복원됐다면 카운트업 없이 바로 실제 점수를 보여 준다.
  const [displayScore, setDisplayScore] = React.useState(revealed ? roundScore : 0);
  const [overlayLeaving, setOverlayLeaving] = React.useState(false);
  const handleReveal = () => {
    if (revealed) return;
    setOverlayLeaving(true);
    setTimeout(() => {
      onReveal();
      setShowScore(true);
      // count up
      let current = 0;
      const steps = 40;
      const inc = roundScore / steps;
      const iv = setInterval(() => {
        current += inc;
        if (current >= roundScore) {
          setDisplayScore(roundScore);
          clearInterval(iv);
        } else setDisplayScore(Math.round(current));
      }, 800 / steps);
    }, 380);
  };
  const accuracyColor = accuracy >= 90 ? 'var(--accent)' : accuracy >= 70 ? 'oklch(80% 0.22 85)' : accuracy >= 50 ? 'oklch(75% 0.20 55)' : 'var(--accent2)';
  return /*#__PURE__*/React.createElement("div", {
    className: "screen-wrap fade-in",
    style: {
      justifyContent: 'flex-start',
      padding: '0'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: '100%',
      maxWidth: 480,
      padding: '24px 24px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: 'center',
      marginBottom: 32
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "pill",
    style: {
      marginBottom: 12
    }
  }, T.roundOf(round + 1)), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 13,
      color: 'var(--muted)',
      lineHeight: 1.5,
      textWrap: 'pretty'
    }
  }, q.text)), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      background: 'var(--surf)',
      border: '1.5px solid var(--border)',
      borderRadius: 24,
      padding: '32px 24px',
      marginBottom: 24,
      overflow: 'hidden',
      cursor: revealed ? 'default' : 'pointer',
      textAlign: 'center'
    },
    onClick: !revealed ? handleReveal : undefined
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 12,
      color: 'var(--muted)',
      letterSpacing: '0.12em',
      textTransform: 'uppercase',
      marginBottom: 8
    }
  }, T.theAnswer), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: "'Space Mono', 'Noto Sans KR', monospace",
      fontSize: 68,
      fontWeight: 700,
      lineHeight: 1,
      color: 'var(--accent)',
      marginBottom: 4
    }
  }, q.answer, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 36
    }
  }, "%")), /*#__PURE__*/React.createElement("div", {
    className: "divider",
    style: {
      margin: '20px 0'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-around'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 11,
      color: 'var(--muted)',
      letterSpacing: '0.1em',
      textTransform: 'uppercase',
      marginBottom: 4
    }
  }, T.yourGuess), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: "'Space Mono', 'Noto Sans KR', monospace",
      fontSize: 28,
      fontWeight: 700
    }
  }, guess, "%")), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 11,
      color: 'var(--muted)',
      letterSpacing: '0.1em',
      textTransform: 'uppercase',
      marginBottom: 4
    }
  }, T.accuracy), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: "'Space Mono', 'Noto Sans KR', monospace",
      fontSize: 28,
      fontWeight: 700,
      color: accuracyColor
    }
  }, accuracy, "%")))), !revealed && !overlayLeaving && /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      background: 'var(--surf)',
      borderRadius: 24,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 32
    }
  }, "\uD83D\uDD12"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: "'Space Grotesk', 'Noto Sans KR', sans-serif",
      fontSize: 16,
      fontWeight: 700,
      letterSpacing: '0.12em',
      textTransform: 'uppercase',
      color: 'var(--muted)'
    }
  }, T.lockedIn), /*#__PURE__*/React.createElement("div", {
    className: "tap-pulse",
    style: {
      marginTop: 8
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--surf2)',
      border: '1.5px solid var(--border)',
      borderRadius: 999,
      padding: '12px 24px',
      fontSize: 14,
      fontWeight: 600,
      letterSpacing: '0.08em',
      color: 'var(--text)'
    }
  }, T.tapReveal)), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 12,
      color: 'var(--muted)',
      marginTop: 4
    }
  }, T.waitAll)), overlayLeaving && /*#__PURE__*/React.createElement("div", {
    className: "overlay-out",
    style: {
      position: 'absolute',
      inset: 0,
      background: 'var(--surf)',
      borderRadius: 24,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 32
    }
  }, "\uD83D\uDD12"))), revealed && /*#__PURE__*/React.createElement("div", {
    className: "score-pop",
    style: {
      background: 'oklch(82% 0.28 128 / 0.08)',
      border: '1.5px solid oklch(82% 0.28 128 / 0.3)',
      borderRadius: 16,
      padding: '20px 24px',
      textAlign: 'center',
      marginBottom: 24
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 11,
      color: 'oklch(82% 0.28 128)',
      letterSpacing: '0.15em',
      textTransform: 'uppercase',
      marginBottom: 4
    }
  }, T.roundScore), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: "'Space Mono', 'Noto Sans KR', monospace",
      fontSize: 42,
      fontWeight: 700,
      color: 'var(--accent)'
    }
  }, "+", displayScore.toLocaleString())), revealed && /*#__PURE__*/React.createElement("button", {
    className: "btn btn-primary",
    style: {
      width: '100%',
      fontSize: 16,
      padding: '18px'
    },
    onClick: onNext
  }, round < 9 ? T.nextRound(round + 2) : T.seeFinal)));
}

/* ─────────────────────────────────────────────────────────────
   GAME OVER SCREEN
───────────────────────────────────────────────────────────── */
function GameOverScreen({
  state,
  onReplay,
  onHome
}) {
  const {
    guesses,
    questions
  } = state;
  const scoreData = guesses.map((g, i) => calcScore(g, questions[i].answer));
  const total = scoreData.reduce((s, r) => s + r.roundScore, 0);
  const maxPossible = 100000;
  const pct = total / maxPossible;
  const rankLabel = pct >= 0.90 ? [T.rankOracle, 'var(--accent)'] : pct >= 0.75 ? [T.rankSignal, 'oklch(75% 0.25 200)'] : pct >= 0.55 ? [T.rankAnalyst, 'oklch(80% 0.22 85)'] : pct >= 0.35 ? [T.rankObserver, 'oklch(75% 0.20 55)'] : [T.rankStatic, 'var(--accent2)'];
  return /*#__PURE__*/React.createElement("div", {
    className: "screen-wrap fade-in",
    style: {
      justifyContent: 'flex-start',
      padding: '0'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: '100%',
      maxWidth: 480,
      padding: '24px 24px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: 'center',
      marginBottom: 32,
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "pill",
    style: {
      marginBottom: 16
    }
  }, T.gameComplete), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "'Space Mono', 'Noto Sans KR', monospace",
      fontSize: 11,
      letterSpacing: '0.2em',
      textTransform: 'uppercase',
      color: rankLabel[1],
      marginBottom: 8
    }
  }, rankLabel[0]), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: "'Space Mono', 'Noto Sans KR', monospace",
      fontSize: 'clamp(48px,14vw,72px)',
      fontWeight: 700,
      color: 'var(--text)',
      lineHeight: 1,
      marginBottom: 4
    }
  }, total.toLocaleString()), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 13,
      color: 'var(--muted)'
    }
  }, T.outOf(maxPossible.toLocaleString()))), /*#__PURE__*/React.createElement("div", {
    style: {
      width: '100%',
      marginBottom: 20
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 11,
      color: 'var(--muted)',
      letterSpacing: '0.12em',
      textTransform: 'uppercase',
      marginBottom: 12
    }
  }, T.breakdown), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 8,
      width: '100%'
    }
  }, scoreData.map((s, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      background: 'var(--surf)',
      border: '1.5px solid var(--border)',
      borderRadius: 12,
      padding: '12px 16px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 6
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12,
      color: 'var(--muted)'
    }
  }, T.roundN(i + 1)), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "'Space Mono', 'Noto Sans KR', monospace",
      fontSize: 13,
      fontWeight: 700,
      color: s.accuracy >= 80 ? 'var(--accent)' : 'var(--text)'
    }
  }, "+", s.roundScore.toLocaleString())), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      fontSize: 11,
      color: 'var(--muted)',
      marginBottom: 8
    }
  }, /*#__PURE__*/React.createElement("span", null, T.guessShort, " ", /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--text)',
      fontFamily: "'Space Mono', 'Noto Sans KR', monospace"
    }
  }, guesses[i], "%")), /*#__PURE__*/React.createElement("span", null, T.answerShort, " ", /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--accent)',
      fontFamily: "'Space Mono', 'Noto Sans KR', monospace"
    }
  }, questions[i].answer, "%")), /*#__PURE__*/React.createElement("span", null, T.accShort, " ", /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--text)',
      fontFamily: "'Space Mono', 'Noto Sans KR', monospace"
    }
  }, s.accuracy, "%"))), /*#__PURE__*/React.createElement("div", {
    style: {
      height: 3,
      background: 'var(--border)',
      borderRadius: 99,
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "score-bar-fill",
    style: {
      height: '100%',
      borderRadius: 99,
      background: 'var(--accent)',
      width: `${s.roundScore / 10000 * 100}%`
    }
  })))))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 10,
      width: '100%',
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn btn-primary",
    style: {
      width: '100%',
      fontSize: 16,
      padding: '18px'
    },
    onClick: onReplay
  }, T.playAgain), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-secondary",
    style: {
      width: '100%',
      fontSize: 16,
      padding: '18px'
    },
    onClick: onHome
  }, T.mainMenu))));
}

/* ─────────────────────────────────────────────────────────────
   APP
───────────────────────────────────────────────────────────── */
const INIT = {
  screen: 'home',
  gameCode: '',
  hostCode: '',
  questions: [],
  round: 0,
  pendingGuess: 50,
  guess: 50,
  guesses: [],
  revealed: false
};
function App() {
  const [state, setState] = React.useState(() => {
    try {
      const s = JSON.parse(localStorage.getItem(STORE_KEY) || 'null');
      if (!s) return INIT;
      // 문항이 없는데 게임 화면이면 렌더가 죽는다. 그런 state 는 버린다.
      const needsQuestions = s.screen === 'play' || s.screen === 'standby' || s.screen === 'gameover';
      const ok = !needsQuestions || Array.isArray(s.questions) && s.questions.length > 0 && typeof s.round === 'number' && s.round >= 0 && s.round < s.questions.length;
      return ok ? s : INIT;
    } catch {
      return INIT;
    }
  });
  const [fading, setFading] = React.useState(false);
  const save = next => {
    setState(next);
    try {
      localStorage.setItem(STORE_KEY, JSON.stringify(next));
    } catch {}
  };
  const go = updates => {
    setFading(true);
    setTimeout(() => {
      save({
        ...state,
        ...updates
      });
      setFading(false);
    }, 250);
  };

  // Quit event from modal inside play screen
  React.useEffect(() => {
    const handler = () => go({
      screen: 'home',
      ...INIT
    });
    window.addEventListener('signal-quit', handler);
    return () => window.removeEventListener('signal-quit', handler);
  }, [state]);
  const startGame = code => {
    const questions = selectQuestions(code);
    go({
      screen: 'play',
      gameCode: code,
      questions,
      round: 0,
      pendingGuess: 50,
      guesses: [],
      revealed: false
    });
  };
  const submitGuess = guess => {
    go({
      screen: 'standby',
      guess,
      revealed: false
    });
  };
  const revealAnswer = () => {
    save({
      ...state,
      revealed: true
    });
  };
  const nextRound = () => {
    const newGuesses = [...state.guesses, state.guess];
    if (state.round >= 9) {
      go({
        screen: 'gameover',
        guesses: newGuesses
      });
    } else {
      go({
        screen: 'play',
        round: state.round + 1,
        pendingGuess: 50,
        guesses: newGuesses,
        revealed: false
      });
    }
  };
  const setGuess = v => {
    save({
      ...state,
      pendingGuess: v
    });
  };
  const {
    screen
  } = state;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      width: '100%',
      height: '100%',
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: `screen-wrap ${fading ? 'fade-out' : 'fade-in'}`
  }, screen === 'home' && /*#__PURE__*/React.createElement(HomeScreen, {
    go: s => go({
      screen: s
    })
  }), screen === 'host' && /*#__PURE__*/React.createElement(HostScreen, {
    goBack: () => go({
      screen: 'home',
      hostCode: ''
    }),
    startGame: startGame,
    hostCode: state.hostCode,
    setHostCode: c => save({
      ...state,
      hostCode: c
    })
  }), screen === 'join' && /*#__PURE__*/React.createElement(JoinScreen, {
    goBack: () => go({
      screen: 'home'
    }),
    startGame: startGame
  }), screen === 'play' && /*#__PURE__*/React.createElement(PlayScreen, {
    state: state,
    setGuess: setGuess,
    onSubmit: submitGuess
  }), screen === 'standby' && /*#__PURE__*/React.createElement(StandbyScreen, {
    state: state,
    onReveal: revealAnswer,
    onNext: nextRound
  }), screen === 'gameover' && /*#__PURE__*/React.createElement(GameOverScreen, {
    state: state,
    onReplay: () => startGame(state.gameCode),
    onHome: () => go({
      screen: 'home',
      ...INIT
    })
  })));
}
ReactDOM.createRoot(document.getElementById('root')).render( /*#__PURE__*/React.createElement(App, null));
