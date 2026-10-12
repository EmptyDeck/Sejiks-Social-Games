#!/bin/bash
# 더블클릭하면: 서버 시작 → 인터넷 공개(Tailscale Funnel) → 브라우저에 QR 화면 열기
cd "$(dirname "$0")"
PORT=3000
FPORT=8443   # 기존 Funnel(443)을 건드리지 않으려고 다른 포트 사용
TS=/Applications/Tailscale.localized/Tailscale.app/Contents/MacOS/Tailscale
[ -x "$TS" ] || TS=/Applications/Tailscale.app/Contents/MacOS/Tailscale
[ -x "$TS" ] || TS=""

lsof -ti :$PORT | xargs kill 2>/dev/null   # 이전 서버가 남아 있으면 정리
URL=""
if [ -n "$TS" ]; then
  HOST=$("$TS" status --json 2>/dev/null | python3 -c "import sys,json;print(json.load(sys.stdin)['Self']['DNSName'].rstrip('.'))" 2>/dev/null)
  if [ -n "$HOST" ] && "$TS" funnel --bg --https=$FPORT $PORT >/dev/null 2>&1; then
    URL="https://$HOST:$FPORT/"
    echo "인터넷 공개: $URL"
  fi
fi
if [ -z "$URL" ]; then
  IP=$(ipconfig getifaddr en0 || ipconfig getifaddr en1)
  URL="http://$IP:$PORT/"
  echo "Tailscale Funnel 을 못 켜서 같은 Wi-Fi 에서만 접속됩니다: $URL"
fi

cleanup() { [ -n "$TS" ] && "$TS" funnel --https=$FPORT off >/dev/null 2>&1; kill $SRV 2>/dev/null; }
trap cleanup EXIT INT TERM
PUBLIC_URL="$URL" python3 server.py &
SRV=$!
sleep 1
open "http://localhost:$PORT/host"
echo "끄려면 이 창을 닫거나 Ctrl+C"
wait $SRV
