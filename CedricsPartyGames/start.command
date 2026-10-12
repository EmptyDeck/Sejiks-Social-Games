#!/bin/bash
# 더블클릭: 서버 시작 → 인터넷 공개(Tailscale Funnel) → 실제로 접속되는지 확인 → 큰 화면(게임 선택) 열기
# Double-click: start the server, publish it with Tailscale Funnel, VERIFY it is reachable, open the big screen.
cd "$(dirname "$0")"
PORT=3100
FPORT=10000   # Funnel 허용 포트(443/8443/10000) 중 기존 것과 안 겹치는 포트
TS=/Applications/Tailscale.localized/Tailscale.app/Contents/MacOS/Tailscale
[ -x "$TS" ] || TS=/Applications/Tailscale.app/Contents/MacOS/Tailscale
[ -x "$TS" ] || TS=""

lsof -ti :$PORT | xargs kill 2>/dev/null
IP=$(ipconfig getifaddr en0 || ipconfig getifaddr en1)
LAN="http://$IP:$PORT/"
echo "$LAN" > .public_url          # 시작은 같은 Wi-Fi 주소; Funnel 이 확인되면 아래에서 교체
cleanup() { [ -n "$TS" ] && "$TS" funnel --https=$FPORT off >/dev/null 2>&1; kill $SRV 2>/dev/null; rm -f .public_url; }
trap cleanup EXIT INT TERM
PUBLIC_URL="$LAN" PARTY_PORT=$PORT python3 server/server.py &
SRV=$!
sleep 1

URL=""
if [ -n "$TS" ]; then
  HOST=$("$TS" status --json 2>/dev/null | python3 -c "import sys,json;print(json.load(sys.stdin)['Self']['DNSName'].rstrip('.'))" 2>/dev/null)
  if [ -n "$HOST" ]; then
    for try in 1 2 3 4; do
      "$TS" funnel --bg --https=$FPORT $PORT >/dev/null 2>&1
      sleep 2
      if curl -s -m 6 -o /dev/null -w "%{http_code}" "https://$HOST:$FPORT/api/info" | grep -q 200; then URL="https://$HOST:$FPORT/"; break; fi
      echo "Funnel 확인 중… ($try/4)"
    done
  fi
fi
if [ -n "$URL" ]; then
  echo "$URL" > .public_url
  echo "✅ 인터넷 공개 확인됨 / public & verified: $URL"
else
  echo "⚠️  Funnel 에 접속되지 않아요. 같은 Wi-Fi 의 폰만 접속됩니다 / Funnel unreachable, LAN only: $LAN"
fi
echo "리더 PIN: $(python3 -c "import json;print(json.load(open('config.local.json'))['pin'])" 2>/dev/null)"
open "http://localhost:$PORT/host"
echo "끄려면 이 창을 닫거나 Ctrl+C / Close this window to stop."
wait $SRV
