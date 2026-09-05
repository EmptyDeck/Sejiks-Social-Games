# Sejiks-Social-Games

> 이 파일은 인수인계 문서다. 이 프로젝트를 처음 보는 에이전트가 **이 파일만 읽고** 작업을
> 시작할 수 있어야 한다. 코드를 바꿨으면 관련 항목을 반드시 같이 고친다.
> 아래 `<!-- AUTO -->` 블록은 커밋할 때 자동으로 갱신되므로 손대지 않는다.

## 한 줄 요약
한 방에 모인 사람들이 각자 휴대폰으로 같은 4글자 코드를 넣으면 시작하는 오프라인 파티 게임
모음이다. **서버도 DB 도 없다** — 코드가 곧 난수 시드라 통신 없이 모두가 같은 게임을 본다.
이 저장소는 GitHub 공개 저장소(`EmptyDeck/Sejiks-Social-Games`)의 정본이다.

## 실행 방법
```
sudo systemctl start games          # 평소엔 부팅 때 자동으로 뜬다
svc status games                    # 상태
journalctl -u games -f              # 로그
```
브라우저: **http://127.0.0.1:8410** · 공개: **https://your-machine.example.net:8443/games/**

수동 실행(디버깅용):
```
cd /home/user/projects/Sejiks-Social-Games && python3 deploy/serve.py
GAMES_PORT=9999 python3 deploy/serve.py
```
- 필요한 것: **Python 3 표준 라이브러리만.** 외부 패키지 없음. GPU 불필요. 빌드 단계 없음.
- 포트: **8410**, 바인딩 **`0.0.0.0` (IPv4)**. 다른 프로젝트와 같은 이유로 `"::"` 로 바꾸지 마라.

## 파일 구조
| 경로 | 역할 |
|---|---|
| `index.html` | 게임 목록 페이지. 배포 루트이자 GitHub Pages 를 켜면 그대로 쓸 수 있다 |
| `03Signal/` | SIGNAL — 통계 맞히기. 화면 6개가 든 단일 React 페이지 `index.html` + 문항 `Questions.js`. 옛 인간 통계 보고서(v1)를 대체한다 |
| `05LiarHunt_ko/`, `05LiarHunt_en/` | 라이어 헌트 v2. 문항 `questions.js`, 역할 배정 `gameData.js` |
| `06Rating_ko/`, `06Rating_en/` | 너의 평점은 v2. **단일 HTML 파일**이고 QR 은 jsDelivr CDN 의 qrcode 를 쓴다 |
| `04GRE_AWA/`, `04GRE_Voca/`, `08Memorise/` | 공부 도구. 게임이 아니고 목록 페이지에도 없다 |
| `99archive/` | 구버전(`05LiarHunt_v1`, `06Rating_v1_en.html`)과 생성용 프롬프트 |
| `99tools/githack-url-converter.html` | GitHub 경로를 githack URL 로 바꿔 주는 잡도구 |
| `deploy/serve.py` | 정적 서버. 점파일 차단 + **상대 Location 리다이렉트**(아래 참고) |
| `deploy/games.service` | systemd 유닛 원본. `/etc/systemd/system/` 에 복사되어 있다 |
| `../_meta/services.d/games.conf` | `svc` 등록 파일 |

## 데이터가 있는 곳
| 무엇 | 경로 | 재생성 가능? |
|---|---|---|
| 게임 진행 상태 | 각 플레이어 브라우저의 `sessionStorage` | 해당 없음 — 탭을 닫으면 사라지는 것이 정상 |
| 문항 | 저장소 안 `Questions.js` / `questions.js` | 아니오. 손으로 쓴 것이다 (생성 프롬프트는 `99archive/prompts/`) |

서버는 아무것도 저장하지 않는다. 읽기 전용 정적 서빙뿐이라 유닛에 `ProtectSystem=strict` 가 걸려 있다.

## 설정과 비밀값
- 설정 파일 없음. 환경변수는 `GAMES_PORT` 하나뿐이다.
- **비밀값이 없다.** 인증도 없다 — 인터넷에 그대로 공개된 게임 페이지다.

## 하위 경로(`/games`) 마운트 — 반드시 지킬 것
Funnel 이 `/games` 접두사를 떼고 넘기므로 서버는 저장소 루트를 그대로 서빙한다. 그래서:

1. **모든 링크는 상대 경로여야 한다.** `/join.html` 처럼 `/` 로 시작하면 `/games` 를 잃고 404 난다.
   현재 코드는 전부 상대 경로다 (`location.href = 'host-game.html'` 식).
2. **디렉터리 리다이렉트의 `Location` 도 상대 경로여야 한다.** 파이썬 기본
   `SimpleHTTPRequestHandler` 는 `Location: /05LiarHunt_ko/` 를 보내는데 그러면 접두사가
   날아간다. `deploy/serve.py` 의 `send_header()` 가 이걸 `05LiarHunt_ko/` 로 낮춘다.
   **이 부분을 지우면 슬래시 없는 주소가 전부 깨진다.**

## 만지면 안 되는 것
- **`tailscale serve` 를 8443 에 쓰지 마라. 반드시 `tailscale funnel` 을 써라.**
  `serve` 를 쓰면 그 포트의 Funnel 이 꺼지면서 `/mail` `/life` `/usage` `/monitor` 까지
  전부 tailnet 전용으로 바뀐다. 2026-09-05 에 실제로 이렇게 끊었다가 되살렸다.
  ```
  tailscale funnel --bg --https 8443 --set-path /games http://127.0.0.1:8410
  ```
- **폴더 이름을 바꾸지 마라.** 폴더 이름이 곧 공개 URL 이고 README·`index.html`·각 게임
  `readme.md` 가 그 이름을 박아 두고 있다. 바꾸면 이미 뿌린 링크가 죽는다.
- `06Rating_*/index.html` 이 v2 다. `99archive/06Rating_v1_en.html` 은 옛 1.0 이니 되돌리지 마라.
- **옛 인간 통계 보고서(v1)를 되살리지 마라.** 4글자 코드를 글자 코드의 *합*으로 시드를 만들어서
  `ABCD` 와 `DCBA` 가 같은 게임이 되고, 가능한 시드가 101가지뿐이었다. SIGNAL 이 이걸 고쳤다.
  정말 필요하면 커밋 87cd454 에 남아 있다.

## 지금 아는 문제
- **Funnel 공개 포트는 3개(443·8443·10000)뿐이다.** 8443 에는 이미 6개 경로가 붙어 있다.
  더 붙이려면 경로를 쓰거나 다른 포트를 비워야 한다.
- 한국어판 코드에 `console.log` 디버그 출력이 많이 남아 있다 (영어판에는 없다). 동작에는
  지장이 없어 그대로 뒀다.
- **SIGNAL 은 한국어판이 없다.** 옛 v1 에는 한국어판이 있었지만 v1 을 버리면서 같이 사라졌다.
  번역하려면 `03Signal/Questions.js` 의 138문항과 `index.html` 안의 UI 문자열을 옮겨야 한다.
- SIGNAL 은 unpkg 에서 React **개발 빌드**와 Babel standalone 을 받아 브라우저에서 컴파일한다.
  첫 로딩이 눈에 띄게 느리다. 급하면 프로덕션 빌드로 바꾸고 JSX 를 미리 컴파일하면 된다.

## 최근 변경
<!-- AUTO:GIT -->
<!-- /AUTO:GIT -->
