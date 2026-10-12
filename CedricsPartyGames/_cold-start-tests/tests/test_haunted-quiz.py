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
        l = host.last
        ok = lambda m: m["t"] == "view" and m["game"] and m["game"]["screen"] == screen and (rnd is None or m["game"]["round"] == rnd)
        if l.get("game") and ok(l):
            return l
        return await host.until(ok, t)

    total_pts = 0
    for rnd in range(1, 9):
        await phase("intro", rnd)
        host.send({"t": "host_act", "a": {"type": "skip"}})
        v = await phase("question", rnd)
        g = v["game"]
        check("correct" not in g and "c" not in g and g["answered"] == [], "round %d: question hides the answer key" % rnd)
        for ph in phones:
            pv = await ph.until(lambda m: m["t"] == "view" and m["game"] and m["game"]["screen"] == "question" and m["game"]["round"] == rnd)
            check("correct" not in pv["game"], "phone view has no answer key")
        # out-of-phase / malformed / double answers are ignored
        phones[0].send({"t": "act", "a": {"type": "answer", "i": 99}})
        phones[0].send({"t": "act", "a": {"type": "answer", "i": "1"}})
        phones[0].send({"t": "act", "a": {"type": "answer", "i": True}})
        phones[0].send({"t": "act", "a": {"type": "again"}})
        await asyncio.sleep(0.3)
        check(host.last["game"]["answered"] == [], "malformed answers ignored")
        if rnd == 1:
            for ph in phones:                          # round 1: nobody answers -> ends at the deadline
                pass
            v = await phase("reveal", 1, 30)
            check(all(not r["ok"] and r["pts"] == 0 for r in v["game"]["results"].values()), "deadline ends round, unanswered = 0")
        else:
            # phone 0 answers correctly only after the reveal tells us; so peek via a wrong/right guess split:
            # everyone picks 0; double taps must not change the first pick
            for ph in phones:
                ph.send({"t": "act", "a": {"type": "answer", "i": 0}})
                ph.send({"t": "act", "a": {"type": "answer", "i": 1}})
            v = await phase("reveal", rnd)           # ends early: everyone answered
            g = v["game"]
            check(all(r["pick"] == 0 for r in g["results"].values()), "first answer kept, second ignored")
            check(len(g["picks"]["0"]) == len(phones), "reveal shows who picked what")
        g = v["game"]
        winners = [r for r in g["results"].values() if r["ok"]]
        check(all(500 <= r["pts"] <= 1200 for r in winners), "points in range")
        total_pts += sum(r["pts"] for r in g["results"].values())
        check(sum(x["score"] for x in g["ranking"]) == total_pts, "round %d: ranking == sum of awarded points" % rnd)
        host.send({"t": "host_act", "a": {"type": "skip"}})     # skip the reveal
        await phase("standings", rnd, 20)
        host.send({"t": "host_act", "a": {"type": "skip"}})
    v = await phase("final", None, 20)
    check(len(v["game"]["ranking"]) == len(phones), "final ranking")
    phones[0].send({"t": "act", "a": {"type": "again"}})
    v = await host.until(lambda m: m["t"] == "view" and m["phase"] == "lobby")
    check(True, "back to lobby")
    print("ALL PASSED")


if __name__ == "__main__":
    gid = "haunted-quiz"
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
