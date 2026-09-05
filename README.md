# Party Games

파티 게임 모음집

한 방에 모여, 각자 휴대폰으로, 같은 4글자 코드를 넣으면 시작하는 오프라인 파티 게임 모음.
서버도 계정도 설치도 없습니다. 전부 브라우저 안에서만 돕니다.

*Offline party games for a room full of phones. Everyone types the same 4-letter code — no server,
no account, no install. Everything runs in the browser.*

## ▶ 바로 하기 · Play now

### **https://your-machine.example.net:8443/games/**

위 주소가 모든 게임의 목록 페이지입니다. 아래는 각 게임 직통 링크입니다.

| 게임 · Game | 한국어 | English |
|---|---|---|
| 📡 **SIGNAL** · 인간 통계 맞히기 | [플레이](https://your-machine.example.net:8443/games/03Signal_ko/) | [Play](https://your-machine.example.net:8443/games/03Signal_en/) |
| 🎭 **라이어 헌트** · Liar Hunt | [플레이](https://your-machine.example.net:8443/games/05LiarHunt_ko/) | [Play](https://your-machine.example.net:8443/games/05LiarHunt_en/) |
| 🌟 **너의 평점은** · What's Your Rating | [플레이](https://your-machine.example.net:8443/games/06Rating_ko/) | [Play](https://your-machine.example.net:8443/games/06Rating_en/) |

> 이 주소는 집 PC 에서 Tailscale Funnel 로 직접 서빙합니다. PC 가 꺼져 있으면 열리지 않습니다.
> *Served straight from a home PC over Tailscale Funnel — if the PC is off, the link is down.*

## 게임 소개 · The games

### 📡 SIGNAL · 인간 통계 맞히기

실제 설문 통계를 보고 "몇 퍼센트일까?" 를 맞히는 게임. 문항 138개이고 **문항마다 출처가
붙어 있습니다** (YouGov, Gallup 등). 한국어·영어 둘 다 있고, 같은 코드를 넣으면 언어가
달라도 같은 문항이 나옵니다.

*Guess the real survey percentage. 138 questions, each citing its source (YouGov, Gallup, …).
Korean and English both available — the same code gives the same questions in either language.*

> 옛 "인간 통계 보고서"(v1)를 대체한 v2 입니다. v1 은 4글자 코드를 글자 코드의 **합**으로
> 시드를 만들어서, 순서가 다른 같은 글자(`ABCD` 와 `DCBA`)가 같은 게임이 되고 실제로는
> 101가지 게임밖에 없었습니다. SIGNAL 은 24진수 자리값을 써서 331,776가지가 전부 다릅니다.

### 🎭 라이어 헌트 · Liar Hunt

모두가 같은 질문을 받지만, 라이어만 **비슷하지만 다른 질문**을 받습니다.
답을 들어보고 누가 다른 질문에 답하고 있는지 찾아내세요.
3–17명, 라이어 1–15명, 질문 80개. 입력형·그림형·선택형·이모티콘형 네 가지 모드.

*Everyone gets the same question — except the liar, who gets a **similar but different** one.
Listen to the answers and work out who is answering something else.
3–17 players, 1–15 liars, 80 questions, four answer modes (text, drawing, choice, emoji).*

### 🌟 너의 평점은 · What's Your Rating

1~10 중 비밀 점수를 하나 받습니다. 호스트가 카테고리(예: 영화)를 부르면,
자신의 점수에 어울리는 답을 말합니다. 그리고 서로의 숫자를 맞힙니다.

- 남의 숫자를 맞히면 +1점
- 누군가 내 숫자를 맞히면 +1점
- **모두가** 내 숫자를 맞히면 0점 — 너무 뻔하면 안 됩니다

호스트 + 최대 50명.

*You get a secret number from 1 to 10. The host calls a category (say, Movies), and you name
something you'd rate at your number. Then everyone guesses everyone else's.
Correct guess +1; someone guessing yours +1; **everyone** guessing yours 0 — don't be obvious.
Host + up to 50 players.*

## 저장소 구조 · Repository layout

숫자 접두사로 묶고, 같은 게임의 한국어판·영어판은 `_ko` / `_en` 으로 짝을 맞춥니다.
폴더 이름은 그대로 URL 이 되므로 공백과 한글을 쓰지 않습니다.

*Numbered prefixes; Korean and English builds of one game share a number and differ by `_ko` / `_en`.
Folder names become URLs, so no spaces and no non-ASCII.*

| 경로 | 내용 |
|---|---|
| `index.html` | 게임 목록 페이지 (배포 루트) |
| `03Signal_ko/`, `03Signal_en/` | SIGNAL — 언어별 껍데기와 데이터(`data.js`), 그리고 단일 파일판 `standalone.html` |
| `src/signal.app.jsx` | SIGNAL 의 공용 로직 **원본**. 고칠 곳은 여기다 |
| `99shared/` | 두 언어가 같이 쓰는 것 — React 프로덕션 빌드, `signal.css`, 빌드된 `signal.app.js` |
| `04GRE_AWA/`, `04GRE_Voca/` | GRE 공부 도구 (게임 아님, 미배포) |
| `05LiarHunt_ko/`, `05LiarHunt_en/` | 라이어 헌트 v2 |
| `06Rating_ko/`, `06Rating_en/` | 너의 평점은 v2 |
| `08Memorise/` | 영단어 암기 도구 (게임 아님, 미배포) |
| `99archive/` | 구버전과 작성용 프롬프트 보관 |
| `99tools/` | githack URL 변환기 등 잡도구 |
| `deploy/` | 배포용 정적 서버와 systemd 유닛 |

## 서버 없이 그냥 파일로 하기 · No server, just open the file

**위 주소가 죽어 있어도 게임은 됩니다.** 어떤 게임도 서버·빌드·인터넷을 필요로 하지
않습니다. `fetch` 도 `XMLHttpRequest` 도 안 씁니다.

*The links above can be down and the games still work. None of them need a server, a build
step, or an internet connection.*

**방법 1 — 파일 하나만 (SIGNAL)**

`03Signal_ko/standalone.html` (또는 `03Signal_en/standalone.html`) 을 내려받아 더블클릭하면
끝입니다. 약 200 KB 짜리 한 파일에 게임 전체가 들어 있어서, 친구에게 이 파일만 보내 줘도
됩니다. 카톡으로 보내도 되고 USB 에 담아도 됩니다.

*Download that one file and double-click it. ~200 KB, the whole game inside, nothing else needed —
you can just send the file to a friend.*

**방법 2 — 저장소를 통째로 (모든 게임)**

```bash
git clone https://github.com/EmptyDeck/Sejiks-Social-Games.git
```
(또는 GitHub 의 **Code → Download ZIP**)

받은 폴더에서 게임 폴더의 `index.html` 을 브라우저로 열면 그대로 돌아갑니다.
예: `05LiarHunt_ko/index.html`.

| 게임 | 인터넷이 아예 없을 때 |
|---|---|
| 🎭 라이어 헌트 | **완전히 됩니다.** 외부에서 받아오는 것이 하나도 없습니다 |
| 📡 SIGNAL | 됩니다. 웹폰트만 못 받아서 글꼴이 기본체로 보입니다 |
| 🌟 너의 평점은 | 게임은 되고, QR 코드 버튼만 동작하지 않습니다 (QR 라이브러리를 CDN 에서 받음) |

**방법 3 — 정적 서버 (여럿이 같은 와이파이에서 할 때 편함)**

```bash
cd Sejiks-Social-Games
python3 -m http.server 8410
# http://localhost:8410/ 열기
```

집 서버에 상시 띄우려면 (Tailscale Funnel 의 `/games` 경로 뒤에 붙는 구성):

```bash
sudo cp deploy/games.service /etc/systemd/system/games.service
sudo systemctl daemon-reload && sudo systemctl enable --now games
tailscale funnel --bg --https 8443 --set-path /games http://127.0.0.1:8410
```

> ⚠️ 같은 포트에 다른 경로가 이미 있다면 반드시 `tailscale funnel` 을 쓰세요.
> `tailscale serve` 를 쓰면 그 포트의 Funnel 이 꺼지면서 기존 경로까지 전부 비공개로 바뀝니다.

## SIGNAL 고치기 · Editing SIGNAL

SIGNAL 만 빌드 단계가 있습니다 (JSX 를 미리 컴파일해 두려고). 나머지 게임은 그냥 고치면 됩니다.

| 고치고 싶은 것 | 고칠 파일 |
|---|---|
| 문항, 화면에 나오는 문장 | `03Signal_ko/data.js` · `03Signal_en/data.js` |
| 게임 로직, 화면 구성 | `src/signal.app.jsx` |
| 색·글꼴·여백 | `99shared/signal.css` |

`src/` 나 `99shared/signal.css` 를 고쳤으면 다시 빌드합니다. `data.js` 만 고쳤어도
`standalone.html` 을 새로 만들려면 돌려야 합니다.

```bash
deploy/build.sh
```

`99shared/signal.app.js` 와 두 `standalone.html` 은 **빌드 결과물**이니 직접 고치지 마세요.

## 어떻게 서버 없이 여럿이 같이 하나 · How multiplayer works without a server

**4글자 코드가 곧 시드(seed)** 입니다. 코드를 시드로 쓰는 결정적 난수 생성기(LCG)가
질문 순서와 역할 배정을 만들어 내므로, 같은 코드를 넣은 사람은 통신 없이도 같은 게임을 봅니다.
상태는 브라우저 안에만 있고 밖으로 나가지 않습니다.

*The **4-letter code is the seed**. A deterministic LCG turns it into the question order and role
assignment, so everyone typing the same code sees the same game with no communication at all.
State lives in `sessionStorage` and never leaves the device.*

## 라이선스 · License

개인 프로젝트입니다. 마음껏 가져다 쓰고 고치세요.
*A personal project — take it and change it however you like.*
