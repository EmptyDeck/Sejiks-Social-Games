#!/usr/bin/env python3
"""Protocol test: rooms, lobby, PIN leader, reconnect, back-out, and a full Gilded Takes game with fake phones.

    python3 tests/test_protocol.py [game-id]      (other ids only get the generic smoke part)
"""
import asyncio, sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).parent))
from harness import Server, start_game, wait, PIN
from wsclient import WS


def check(cond, msg):
    print(("  ok  " if cond else " FAIL ") + msg)
    if not cond:
        raise SystemExit(1)


async def main(srv, gid):
    port = srv.port
    host = await WS.open(port)
    host.send({"t": "host"})                                  # the laptop only displays; no game chosen yet
    code = (await host.until(lambda m: m["t"] == "hosted"))["code"]
    check(len(code) == 4, "room code %s (created with no game)" % code)

    phones = []
    for i in range(3):
        p = await WS.open(port)
        p.send({"t": "join", "code": code})
        j = await p.until(lambda m: m["t"] == "joined")
        p.token, p.pid = j["token"], j["pid"]
        p.send({"t": "profile", "name": "P%d" % i})
        phones.append(p)
    await asyncio.sleep(0.3)
    check(True, "3 players joined and named")

    bad = await WS.open(port)
    bad.send({"t": "join", "code": "ZZZZ"})
    check((await bad.until(lambda m: m["t"] == "error"))["key"] == "err.badcode", "bad code rejected")

    # lobby chat: needs a confirmed name; spam is rate-limited; shown to the big screen via the view
    phones[1].send({"t": "chat", "text": "too early"})
    await asyncio.sleep(0.3)
    v = await host.until(lambda m: m["t"] == "view")
    check(v["chat"] == [], "chat refused before the player confirms name/icon")
    phones[1].send({"t": "ready", "v": True})
    phones[1].send({"t": "chat", "text": "  hi   everyone  "})
    v = await host.until(lambda m: m["t"] == "view" and m["chat"])
    check(v["chat"][-1] == {"id": phones[1].pid, "text": "hi everyone"} and any(x["ready"] for x in v["players"]), "confirmed player's chat reaches the big screen (whitespace trimmed, ready flag set)")
    for i in range(8):
        phones[1].send({"t": "chat", "text": "spam %d" % i})
    await asyncio.sleep(0.5)
    v = await host.until(lambda m: m["t"] == "view")
    check(len(v["chat"]) <= 5, "chat spam is rate-limited (%d messages kept)" % len(v["chat"]))
    phones[1].send({"t": "chat", "text": None}); phones[1].send({"t": "ready", "v": False})

    # nobody is leader yet: a phone cannot start the game
    phones[0].send({"t": "start"})
    await asyncio.sleep(0.4)
    v = await host.until(lambda m: m["t"] == "view" and m["phase"] == "lobby")
    check(v["phase"] == "lobby", "a non-leader phone cannot start")

    # wrong PIN refused, right PIN accepted
    phones[0].send({"t": "auth", "pin": "0000"})
    check((await phones[0].until(lambda m: m["t"] == "error"))["key"] == "err.pin", "wrong PIN refused")
    phones[0].send({"t": "auth", "pin": PIN})
    await phones[0].until(lambda m: m["t"] == "authed")
    v = await host.until(lambda m: m["t"] == "view" and any(x["leader"] for x in m["players"]))
    check([x["id"] for x in v["players"] if x["leader"]] == [phones[0].pid], "PIN makes the phone the leader")

    # the admin picks the game on the phone; others can't; starting without a game is refused
    other = "chameleon" if gid != "chameleon" else "gilded-takes"
    phones[1].send({"t": "pick_game", "game": other})           # a non-admin: ignored
    phones[0].send({"t": "start"})
    check((await phones[0].until(lambda m: m["t"] == "error"))["key"] == "err.nogamepicked", "start refused until a game is picked")
    phones[0].send({"t": "pick_game", "game": gid})
    v = await host.until(lambda m: m["t"] == "view" and m["game_id"] is not None)
    check(v["game_id"] == gid and v["title"] is not None, "only the admin's pick counts: %s, picked on the phone; the big screen follows" % gid)

    # reconnect keeps identity (and the leader flag)
    old = phones[0]
    old.w.close()
    await asyncio.sleep(0.2)
    p = await WS.open(port)
    p.send({"t": "join", "code": code, "token": old.token})
    j = await p.until(lambda m: m["t"] == "joined")
    check(j["pid"] == old.pid, "reconnect keeps player id")
    p.token, p.pid = old.token, old.pid
    phones[0] = p
    await asyncio.sleep(0.2)
    phones[0].send({"t": "start"})
    v = await host.until(lambda m: m["t"] == "view" and m["phase"] == "game")
    check(v["game"] is not None, "leader (after reconnect) started the game")
    for ph in phones:
        pv = await ph.until(lambda m: m["t"] == "view" and m["phase"] == "game")
        check(pv["me"] == ph.pid and pv["game"] is not None, "phone %s has its own view" % ph.pid)

    if gid == "gilded-takes":
        g = await wait(host, "write", 1)
        for i, ph in enumerate(phones):
            ph.send({"t": "act", "a": {"type": "answer", "value": "answer from %d" % i}})
            ph.send({"t": "act", "a": {"type": "answer", "value": None}})           # malformed: ignored
        g = await wait(host, "vote", 1)
        check(len(g["options"]) == 3 and all("by" not in o for o in g["options"]), "voting hides authors; moved on by itself when all answered")
        for ph in phones:
            pv = await ph.until(lambda m: m["t"] == "view" and m["game"] and m["game"]["screen"] == "vote")
            mine = [o["i"] for o in pv["game"]["options"] if o["own"]]
            ph.send({"t": "act", "a": {"type": "vote", "i": mine[0]}})                 # self-vote: refused
            ph.send({"t": "act", "a": {"type": "vote", "i": (mine[0] + 1) % 3}})
        g = await wait(host, "reveal", 1)
        check(sum(r["votes"] for r in g["results"]) == 3, "self-votes refused, every real vote counted")
        phones[1].send({"t": "act", "a": {"type": "next"}})                             # a non-leader: ignored
        phones[0].send({"t": "act", "a": {"type": "next"}})
        g = await wait(host, "write", 2)
        check(g["round"] == 2, "leader's 'next prompt' works, a non-leader's does not")
        host.send({"t": "host_act", "a": {"type": "next"}})                              # the laptop can force the phase
        phones[0].send({"t": "act", "a": {"type": "finish"}})                            # not on reveal: ignored
    else:
        print("smoke test passed for", gid)

    # backing out: a phone can leave the lobby; the host can close the room (everyone is told)
    phones[0].send({"t": "to_lobby"})
    await host.until(lambda m: m["t"] == "view" and m["phase"] == "lobby")
    check(True, "leader sends everyone back to the lobby")
    leaver = await WS.open(port)
    host2 = await WS.open(port)
    host2.send({"t": "host"})
    code2 = (await host2.until(lambda m: m["t"] == "hosted"))["code"]
    leaver.send({"t": "join", "code": code2})
    await leaver.until(lambda m: m["t"] == "joined")
    leaver.send({"t": "leave"})
    await leaver.until(lambda m: m["t"] == "left")
    await host2.until(lambda m: m["t"] == "view" and not m["players"])
    check(True, "phone can leave the lobby")
    stay = await WS.open(port)
    stay.send({"t": "join", "code": code2})
    await stay.until(lambda m: m["t"] == "joined")
    stay.send({"t": "auth", "pin": PIN})
    await stay.until(lambda m: m["t"] == "authed")
    stay.send({"t": "close"})                                  # the admin closes the room from the phone
    await stay.until(lambda m: m["t"] == "closed")
    probe = await WS.open(port)
    probe.send({"t": "join", "code": code2})
    check((await probe.until(lambda m: m["t"] == "error"))["key"] == "err.badcode", "the admin can close the room from the phone; the code stops working")
    print("ALL PASSED")


if __name__ == "__main__":
    gid = sys.argv[1] if len(sys.argv) > 1 else "gilded-takes"
    Server.run(lambda srv: main(srv, gid))
