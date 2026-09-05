#!/usr/bin/env python3
"""Sejik's Social Games — 정적 파일 서버.

Tailscale Funnel 의 /games 경로 뒤에 붙는다. Funnel 이 접두사를 떼고
넘겨주므로 이 서버는 저장소 루트를 그대로 서빙하면 된다.

두 가지만 기본 http.server 와 다르다:

1. 디렉터리 리다이렉트를 **상대 경로**로 보낸다. 기본 구현은
   `Location: /03Statistics_ko/` 처럼 절대 경로를 보내는데, 그러면
   브라우저가 /games 접두사를 잃고 404 가 난다.
2. 점으로 시작하는 것(.git, .claude, .DS_Store)은 404 로 막는다.
   저장소가 공개라 비밀이 새지는 않지만 굳이 내보낼 이유가 없다.

포트는 GAMES_PORT 로 바꾼다.
"""

import os
import posixpath
import sys
from functools import partial
from http.server import HTTPServer, SimpleHTTPRequestHandler

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PORT = int(os.environ.get("GAMES_PORT", "8410"))


class GamesHandler(SimpleHTTPRequestHandler):
    extensions_map = {
        **SimpleHTTPRequestHandler.extensions_map,
        ".js": "text/javascript; charset=utf-8",
        ".css": "text/css; charset=utf-8",
        ".html": "text/html; charset=utf-8",
        ".json": "application/json; charset=utf-8",
        ".md": "text/plain; charset=utf-8",
    }

    def send_head(self):
        # 점파일 차단 — 경로 어느 마디든 '.' 로 시작하면 없는 셈 친다.
        parts = self.path.split("?")[0].split("#")[0].split("/")
        if any(p.startswith(".") and p not in ("", ".", "..") for p in parts):
            self.send_error(404, "Not Found")
            return None
        return super().send_head()

    def send_response(self, code, message=None):
        # 301 디렉터리 리다이렉트의 Location 을 상대 경로로 낮춘다.
        # (헤더는 super().send_head() 안에서 이미 큐에 들어가므로
        #  여기서 코드만 보고 뒤의 send_header 를 가로챈다.)
        self._fixing_location = code in (301, 302, 307, 308)
        super().send_response(code, message)

    def send_header(self, keyword, value):
        if getattr(self, "_fixing_location", False) and keyword.lower() == "location":
            # '/03Statistics_ko/' -> '03Statistics_ko/'
            if value.startswith("/"):
                value = posixpath.basename(value.rstrip("/")) + "/"
        super().send_header(keyword, value)

    def end_headers(self):
        # 게임을 고치고 새로고침하면 바로 보이도록 HTML 은 캐시하지 않는다.
        # 정적 자산은 짧게만 캐시한다.
        path = self.path.split("?")[0]
        if path.endswith("/") or path.endswith(".html"):
            self.send_header("Cache-Control", "no-cache")
        else:
            self.send_header("Cache-Control", "public, max-age=300")
        self.send_header("X-Content-Type-Options", "nosniff")
        super().end_headers()

    def log_message(self, fmt, *args):
        sys.stderr.write("%s %s\n" % (self.address_string(), fmt % args))


def main():
    handler = partial(GamesHandler, directory=ROOT)
    srv = HTTPServer(("0.0.0.0", PORT), handler)
    sys.stderr.write(f"serving {ROOT} on 0.0.0.0:{PORT}\n")
    srv.serve_forever()


if __name__ == "__main__":
    main()
