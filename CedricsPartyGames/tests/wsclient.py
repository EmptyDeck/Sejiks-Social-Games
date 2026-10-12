"""Tiny WebSocket client (stdlib) shared by the tests."""
import asyncio, base64, json, os, struct, time


class WS:
    def __init__(self, r, w):
        self.r, self.w = r, w
        self.last = {}

    @classmethod
    async def open(cls, port, path="/ws"):
        r, w = await asyncio.open_connection("127.0.0.1", port)
        w.write(("GET %s HTTP/1.1\r\nHost: 127.0.0.1:%d\r\nUpgrade: websocket\r\nConnection: Upgrade\r\n"
                 "Sec-WebSocket-Key: %s\r\nSec-WebSocket-Version: 13\r\n\r\n" % (path, port, base64.b64encode(os.urandom(16)).decode())).encode())
        await r.readuntil(b"\r\n\r\n")
        return cls(r, w)

    def send(self, o):
        d = json.dumps(o).encode(); m = os.urandom(4)
        n = len(d)
        head = bytes([0x81, 0x80 | n]) if n < 126 else bytes([0x81, 0x80 | 126]) + struct.pack(">H", n)
        self.w.write(head + m + bytes(b ^ m[i % 4] for i, b in enumerate(d)))

    async def recv(self, timeout=5):
        h = await asyncio.wait_for(self.r.readexactly(2), timeout)
        n = h[1] & 127
        if n == 126:
            n = struct.unpack(">H", await self.r.readexactly(2))[0]
        elif n == 127:
            n = struct.unpack(">Q", await self.r.readexactly(8))[0]
        m = json.loads(await self.r.readexactly(n))
        if m.get("t") == "view":
            self.last = m
        return m

    async def until(self, pred, timeout=8):
        end = time.time() + timeout
        while time.time() < end:
            m = await self.recv(max(0.1, end - time.time()))
            if pred(m):
                return m
        raise TimeoutError("condition not met")
