"""Shared helpers for game flow tests (see tests/test_chameleon.py for a complete example).

    from harness import Server, start_game, wait

    async def main(srv):
        host, phones = await start_game(srv.port, "my-game", 4)      # joined, named, VIP pressed Start
        g = await wait(phones[0], "secret", rnd=1)                    # next view whose game.screen == "secret"
        phones[1].send({"t": "act", "a": {"type": "ready"}})
    Server.run(main)                                                  # starts/stops a private server on a free port

Notes: every WS object only keeps what you read from it, so views queue up unread — match with round/screen
(wait(..., rnd=n)) to skip stale views.  `host_act {"type":"skip"}` is the way to hurry a phase if your game supports it.
"""
import asyncio, os, socket, subprocess, sys, time
from pathlib import Path
sys.path.insert(0, str(Path(__file__).parent))
from wsclient import WS

ROOT = Path(__file__).resolve().parent.parent
PIN = "4321"          # the test server's leader PIN


def free_port():
    s = socket.socket(); s.bind(("127.0.0.1", 0)); p = s.getsockname()[1]; s.close()
    return p


class Server:
    def __init__(self):
        self.port = free_port()

    @classmethod
    def run(cls, main):
        self = cls()
        proc = subprocess.Popen([sys.executable, str(ROOT / "server" / "server.py")], env=dict(os.environ, PARTY_PORT=str(self.port), PARTY_PIN=PIN),
                                stdout=subprocess.PIPE, stderr=subprocess.STDOUT, text=True)
        time.sleep(1.2)
        try:
            asyncio.run(main(self))
        finally:
            proc.terminate()
            out = proc.stdout.read()
            if "Traceback" in out:
                print("SERVER LOG:\n" + out)
                sys.exit(1)


async def start_game(port, game_id, n, names=None, leader=True):
    """Create a room, join n named phones, VIP (phones[0]) starts. Returns (host, phones); phones have .pid. phones[0] is the leader."""
    host = await WS.open(port)
    host.send({"t": "host"})                     # the laptop just creates a room; the admin picks the game on their phone
    code = (await host.until(lambda m: m["t"] == "hosted"))["code"]
    phones = []
    for i in range(n):
        p = await WS.open(port)
        p.send({"t": "join", "code": code})
        p.pid = (await p.until(lambda m: m["t"] == "joined"))["pid"]
        p.send({"t": "profile", "name": (names or ["P%d" % k for k in range(n)])[i]})
        phones.append(p)
    if leader:                                   # "Are you Cedric?" → PIN → phones[0] is the leader and starts the game
        phones[0].send({"t": "auth", "pin": PIN})
        await phones[0].until(lambda m: m["t"] == "authed")
        phones[0].send({"t": "pick_game", "game": game_id})
    await asyncio.sleep(0.3)
    phones[0].send({"t": "start"})
    return host, phones


async def wait(ws, screen, rnd=None, timeout=10):
    """A game view on this socket with game.screen == screen (and game.round == rnd): the last one already read if it
    matches, else the next one to arrive. Returns the game dict."""
    ok = lambda m: (m.get("t") == "view" and m.get("phase") == "game" and m.get("game")
                    and m["game"]["screen"] == screen and (rnd is None or m["game"].get("round") == rnd))
    if ok(ws.last):
        return ws.last["game"]
    return (await ws.until(ok, timeout))["game"]
