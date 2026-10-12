#!/usr/bin/env python3
"""방 코드 동기화 테스트 서버. Python 표준 라이브러리만 사용.

실행: python3 server.py            (기본 포트 3000, GAMES_PORT 로 변경)
호스트 화면: http://localhost:3000/host
폰 화면:     http://<주소>/        (QR 의 ?room=ABCD 로 들어오면 코드 자동 입력)
"""
import asyncio, base64, hashlib, json, os, random, struct
from pathlib import Path

PORT = int(os.environ.get("GAMES_PORT", "3000"))
PUBLIC_URL = os.environ.get("PUBLIC_URL", "")  # 폰이 접속할 주소 (start.command 가 채워 줌)
HERE = Path(__file__).parent
GUID = "258EAFA5-E914-47DA-95CA-C5AB0DC85B11"
ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ"  # I, O 제외

rooms = {}  # code -> {"host": Conn|None, "players": {pid: {"name","count","conn"}}}


class Conn:
    def __init__(self, reader, writer):
        self.r, self.w = reader, writer
        self.room = None
        self.pid = None
        self.is_host = False

    async def send(self, obj):
        data = json.dumps(obj, ensure_ascii=False).encode()
        n = len(data)
        head = b"\x81" + (bytes([n]) if n < 126 else b"\x7e" + struct.pack(">H", n) if n < 65536 else b"\x7f" + struct.pack(">Q", n))
        try:
            self.w.write(head + data)
            await self.w.drain()
        except Exception:
            pass

    async def recv(self):
        """텍스트 메시지 하나를 반환. 연결이 닫히면 None."""
        while True:
            h = await self.r.readexactly(2)
            op, ln = h[0] & 0x0F, h[1] & 0x7F
            if ln == 126:
                ln = struct.unpack(">H", await self.r.readexactly(2))[0]
            elif ln == 127:
                ln = struct.unpack(">Q", await self.r.readexactly(8))[0]
            mask = await self.r.readexactly(4) if h[1] & 0x80 else b"\0\0\0\0"
            body = bytearray(await self.r.readexactly(ln))
            for i in range(ln):
                body[i] ^= mask[i % 4]
            if op == 8:
                return None
            if op == 9:  # ping -> pong
                self.w.write(b"\x8a" + bytes([len(body)]) + bytes(body))
                continue
            if op in (1, 0):
                return body.decode("utf-8", "replace")


def snapshot(room):
    return {"t": "state", "players": [
        {"id": pid, "name": p["name"], "count": p["count"], "online": p["conn"] is not None}
        for pid, p in room["players"].items()]}


async def push_host(room):
    if room["host"]:
        await room["host"].send(snapshot(room))


async def handle_ws(c):
    try:
        while True:
            raw = await c.recv()
            if raw is None:
                break
            try:
                m = json.loads(raw)
            except ValueError:
                continue
            t = m.get("t")
            if t == "host":
                code = "".join(random.choice(ALPHABET) for _ in range(4))
                while code in rooms:
                    code = "".join(random.choice(ALPHABET) for _ in range(4))
                rooms[code] = {"host": c, "players": {}}
                c.room, c.is_host = code, True
                await c.send({"t": "hosted", "code": code})
            elif t == "join":
                code = str(m.get("code", "")).upper().strip()
                room = rooms.get(code)
                if not room:
                    await c.send({"t": "error", "msg": "없는 방 코드예요"})
                    continue
                pid = str(m.get("pid") or "")[:32] or "p%06d" % random.randrange(10**6)
                p = room["players"].setdefault(pid, {"name": "", "count": 0, "conn": None})
                p["name"] = str(m.get("name", "")).strip()[:12] or "익명"
                p["conn"] = c
                c.room, c.pid = code, pid
                await c.send({"t": "joined", "code": code, "pid": pid, "count": p["count"]})
                await push_host(room)
            elif t == "press" and c.pid:
                room = rooms.get(c.room)
                if room and c.pid in room["players"]:
                    room["players"][c.pid]["count"] += 1
                    await c.send({"t": "count", "count": room["players"][c.pid]["count"]})
                    await push_host(room)
    except (asyncio.IncompleteReadError, ConnectionError):
        pass
    finally:
        room = rooms.get(c.room)
        if room:
            if c.is_host:
                for p in room["players"].values():
                    if p["conn"]:
                        await p["conn"].send({"t": "error", "msg": "호스트가 나갔어요"})
                del rooms[c.room]
            elif c.pid in room["players"]:
                room["players"][c.pid]["conn"] = None
                await push_host(room)


async def handle(reader, writer):
    try:
        head = await reader.readuntil(b"\r\n\r\n")
    except Exception:
        writer.close()
        return
    lines = head.decode("latin1").split("\r\n")
    try:
        method, target, _ = lines[0].split(" ", 2)
    except ValueError:
        writer.close()
        return
    hdr = {k.lower(): v.strip() for k, v in (l.split(":", 1) for l in lines[1:] if ":" in l)}
    path = target.split("?", 1)[0]
    if hdr.get("upgrade", "").lower() == "websocket" and path.endswith("/ws"):
        acc = base64.b64encode(hashlib.sha1((hdr["sec-websocket-key"] + GUID).encode()).digest()).decode()
        writer.write(("HTTP/1.1 101 Switching Protocols\r\nUpgrade: websocket\r\n"
                      "Connection: Upgrade\r\nSec-WebSocket-Accept: %s\r\n\r\n" % acc).encode())
        await writer.drain()
        await handle_ws(Conn(reader, writer))
    elif method == "GET" and path in ("/", "/host", "/index.html"):
        body = (HERE / "index.html").read_bytes()
        writer.write(b"HTTP/1.1 200 OK\r\nContent-Type: text/html; charset=utf-8\r\nCache-Control: no-store\r\n"
                     + b"Content-Length: %d\r\nConnection: close\r\n\r\n" % len(body) + body)
    elif method == "GET" and path == "/info":
        body = json.dumps({"url": PUBLIC_URL}).encode()
        writer.write(b"HTTP/1.1 200 OK\r\nContent-Type: application/json\r\nContent-Length: %d\r\nConnection: close\r\n\r\n" % len(body) + body)
    else:
        writer.write(b"HTTP/1.1 404 Not Found\r\nContent-Length: 0\r\nConnection: close\r\n\r\n")
    try:
        await writer.drain()
        writer.close()
    except Exception:
        pass


async def main():
    srv = await asyncio.start_server(handle, "0.0.0.0", PORT)
    print("서버 시작: http://localhost:%d/host" % PORT)
    async with srv:
        await srv.serve_forever()


if __name__ == "__main__":
    asyncio.run(main())
