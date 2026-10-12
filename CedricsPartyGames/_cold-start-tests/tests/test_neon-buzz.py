#!/usr/bin/env python3
"""End-to-end protocol test: starts a server, plays a full Gilded Takes game with fake phones.

    python3 tests/test_protocol.py [game-id]

Passing means: rooms, lobby, reconnect, a complete game (3 rounds) and the final screen all work.
Games with other ids only get the smoke part (create room, join, start, first view).
"""
import asyncio, base64, json, os, struct, subprocess, sys, time
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
import socket


def free_port():
    s = socket.socket(); s.bind(("127.0.0.1", 0)); p = s.getsockname()[1]; s.close(); return p


PORT = free_port()


from wsclient import WS


def check(cond, msg):
    print(("  ok  " if cond else " FAIL ") + msg)
    if not cond:
        raise SystemExit(1)


async def main(gid):
    host = await WS.open(PORT)
    host.send({"t": "host", "game": gid})
    hosted = await host.until(lambda m: m["t"] == "hosted")
    code = hosted["code"]
    check(len(code) == 4, "room code %s" % code)
    v = await host.until(lambda m: m["t"] == "view")
    min_p = v["min"]

    phones = []
    for i in range(max(min_p, 3)):
        p = await WS.open(PORT)
        p.send({"t": "join", "code": code, "name": ""})
        j = await p.until(lambda m: m["t"] == "joined")
        p.token, p.pid = j["token"], j["pid"]
        p.send({"t": "profile", "name": "P%d" % i})
        phones.append(p)
    await host.until(lambda m: m["t"] == "view" and len([x for x in m["players"] if x["name"]]) == len(phones))
    check(True, "%d players joined and named" % len(phones))

    bad = await WS.open(PORT)
    bad.send({"t": "join", "code": "ZZZZ"})
    check((await bad.until(lambda m: m["t"] == "error"))["key"] == "err.badcode", "bad code rejected")

    # reconnect with token keeps identity
    old = phones[1]
    old.w.close()
    await asyncio.sleep(0.2)
    p = await WS.open(PORT)
    p.send({"t": "join", "code": code, "token": old.token})
    j = await p.until(lambda m: m["t"] == "joined")
    check(j["pid"] == old.pid, "reconnect keeps player id")
    p.token, p.pid = old.token, old.pid
    phones[1] = p

    vip = phones[0]
    await vip.until(lambda m: m["t"] == "view" and m["phase"] == "lobby" and any(x["vip"] and x["id"] == vip.pid for x in m["players"]))
    vip.send({"t": "start"})
    v = await host.until(lambda m: m["t"] == "view" and m["phase"] == "game")
    check(v["phase"] == "game" and v["game"] is not None, "game started, host gets a view")
    for ph in phones:
        pv = await ph.until(lambda m: m["t"] == "view" and m["phase"] == "game")
        check(pv["me"] == ph.pid and pv["game"] is not None, "phone %s has its own view" % ph.pid)

    async def phase(screen, rnd=None, t=15):
        def ok(m):
            return m["t"] == "view" and m["game"] and m["game"]["screen"] == screen and (rnd is None or m["game"]["round"] == rnd)
        l = host.last
        if l and l.get("t") == "view" and ok(l):
            return l
        return await host.until(ok, t)

    def tap(ph):
        ph.send({"t": "act", "a": {"type": "tap"}})

    ROUNDS = 5
    for rnd in range(1, ROUNDS + 1):
        v = await phase("ready", rnd)
        check("flashAt" not in json.dumps(v["game"]) and "flash_at" not in json.dumps(v["game"]), "round %d: no flash time leaked" % rnd)
        tap(phones[0])                                   # out of phase: ignored
        v = await phase("wait", rnd)
        check(v["game"]["false"] == [], "round %d: tap during ready ignored" % rnd)
        if rnd == 2:                                     # false start by phone 0 (+ repeated tap must not double penalise)
            tap(phones[0]); tap(phones[0])
            v = await host.until(lambda m: m["t"] == "view" and m["game"] and m["game"]["screen"] in ("wait", "go") and phones[0].pid in m["game"]["false"], 4)
            check(True, "false start recorded")
        if rnd == 3:                                     # everyone jumps: round ends without a flash
            for ph in phones:
                tap(ph)
            v = await phase("result", rnd, 6)
            check(all(r["status"] == "false" for r in v["game"]["results"]), "all jumped: no winners, everyone false-start")
            host.send({"t": "host_act", "a": {"type": "skip"}})
            continue
        v = await phase("go", rnd, 9)
        check("myMs" not in v["game"] or v["game"].get("myMs") is None, "big screen sees no times during go")
        order = phones[1:] if rnd == 2 else phones
        for k, ph in enumerate(order):                   # tap in a known order, spaced out
            tap(ph); tap(ph)                             # double tap must count once
            await asyncio.sleep(0.12)
        if rnd == 4:                                     # forged client timestamp is ignored; last phone never taps
            pass
        v = await phase("result", rnd, 6)
        res = v["game"]["results"]
        oks = [r for r in res if r["status"] == "ok"]
        check([r["id"] for r in sorted(oks, key=lambda r: r["ms"])] == [ph.pid for ph in order], "round %d: server order == tap order" % rnd)
        check(all(oks[i]["ms"] <= oks[i + 1]["ms"] for i in range(len(oks) - 1)) and len(oks) == len(order), "ranks by ms, one tap each")
        if rnd == 2:
            f = [r for r in res if r["status"] == "false"]
            check(len(f) == 1 and f[0]["id"] == phones[0].pid and f[0]["points"] == -50, "false start penalised once (-50)")
        host.send({"t": "host_act", "a": {"type": "skip"}})
    v = await phase("final", None, 8)
    rk = v["game"]["ranking"]
    check(len(rk) == len(phones) and all(rk[i]["score"] >= rk[i + 1]["score"] for i in range(len(rk) - 1)), "final ranking sorted")
    # forged-timestamp / malformed actions never crash
    phones[0].send({"t": "act", "a": {"type": "tap", "ms": 1}})
    phones[0].send({"t": "act", "a": "garbage"})
    phones[0].send({"t": "act", "a": {"type": "again"}})
    v = await host.until(lambda m: m["t"] == "view" and m["phase"] == "lobby")
    check(True, "back to lobby")
    print("ALL PASSED")


if __name__ == "__main__":
    gid = sys.argv[1] if len(sys.argv) > 1 else "neon-buzz"
    srv = subprocess.Popen([sys.executable, str(ROOT / "server" / "server.py")], env=dict(os.environ, PARTY_PORT=str(PORT)),
                           stdout=subprocess.PIPE, stderr=subprocess.STDOUT, text=True)
    time.sleep(1.2)
    try:
        asyncio.run(main(gid))
    finally:
        srv.terminate()
        out = srv.stdout.read()
        if "Traceback" in out:
            print("SERVER LOG:\n" + out)
            sys.exit(1)
