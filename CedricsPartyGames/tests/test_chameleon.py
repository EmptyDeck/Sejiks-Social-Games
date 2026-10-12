#!/usr/bin/env python3
"""Chameleon v2 flow: leader PIN, setup options, deal, first speaker, vote, guess, result, next word, no-vote mode,
2 chameleons, solo test — plus leak checks (nothing secret on the big screen; identical grid for everyone)."""
import asyncio, sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).parent))
from harness import Server, start_game, wait


def check(c, m):
    print(("  ok  " if c else " FAIL ") + m)
    if not c:
        raise SystemExit(1)


def act(ph, **a):
    ph.send({"t": "act", "a": a})


async def fresh(ws, screen, key):
    """Like wait(), but only a view of word number `key` (avoids matching a stale earlier view)."""
    ok = lambda m: m.get("t") == "view" and m.get("game") and m["game"]["screen"] == screen and m["game"].get("key") == key
    return (ws.last if ok(ws.last) else await ws.until(ok, 10))["game"]


async def views(host, phones, screen, key=None):
    if key is None:
        return await wait(host, screen), [await wait(p, screen) for p in phones]
    return await fresh(host, screen, key), [await fresh(p, screen, key) for p in phones]


async def main(srv):
    host, ph = await start_game(srv.port, "chameleon", 4)
    L = ph[0]
    g = await wait(L, "setup")
    check(len(g["categories"]) == 15 and len(g["enabled"]) == 15 and g["options"] == {"vote": True, "k": 1, "kMax": 3}, "setup: 15 categories, vote on, 1 chameleon")
    act(ph[1], type="toggle_cat", id="race")                       # not the leader: ignored
    act(L, type="toggle_cat", id="crime")
    act(L, type="chameleons", n=9)                                  # clamped to kMax
    act(L, type="chameleons", n=1)
    act(L, type="begin")
    hv, pv = await views(host, ph, "play")
    check(len(hv["grid"]) == 20 and hv["category"]["en"] != "Crime", "deal: 20-word grid, 'crime' was switched off")
    check(all(v["grid"] == hv["grid"] for v in pv), "every phone shows the SAME grid as the big screen")
    roles = [v["role"] for v in pv]
    check(roles.count("chameleon") == 1 and roles.count("insider") == 3, "exactly one chameleon")
    cham = roles.index("chameleon")
    check("secret" not in pv[cham] and len({v["secret"] for i, v in enumerate(pv) if i != cham}) == 1, "chameleon has no secret; insiders share one")
    check("secret" not in hv and "role" not in hv and "chameleons" not in hv, "big screen sees no secret / role / chameleons")
    secret = next(v["secret"] for i, v in enumerate(pv) if i != cham)
    act(ph[2], type="first_random")                                 # not leader: ignored
    act(L, type="first_random")
    hv = await wait(host, "play")
    await asyncio.sleep(0.3)
    act(ph[2], type="seen")
    act(L, type="first_set", id=ph[3].pid)
    await asyncio.sleep(0.3)
    act(L, type="to_vote")
    await views(host, ph, "vote")
    for i, p in enumerate(ph):
        act(p, type="vote", id=p.pid)                               # self vote ignored
        act(p, type="vote", id=ph[cham].pid if i != cham else ph[(cham + 1) % 4].pid)
    await asyncio.sleep(0.3)
    act(ph[1], type="reveal")                                       # not leader: ignored
    act(L, type="reveal")
    gh = await wait(host, "guess")
    check(gh["caught"] == [ph[cham].pid], "most-voted chameleon is caught")
    gv = await wait(ph[cham], "guess")
    act(ph[cham], type="guess", i=secret)
    await asyncio.sleep(0.2)
    host.send({"t": "host_act", "a": {"type": "show_answer"}})      # the laptop can drive too
    rh = await wait(host, "result")
    check(rh["secret"] == secret and rh["chameleons"] == [ph[cham].pid] and rh["guesses"] == {ph[cham].pid: secret}, "result reveals word, chameleon, guess")
    check(rh["tally"][ph[cham].pid] == 3, "tally shows 3 votes on the chameleon")
    act(L, type="next_word")
    hv2, _ = await views(host, ph, "play", 2)
    check(hv2["key"] == 2, "next word dealt (no rounds, no timers, no scores)")

    # vote OFF: leader reveals straight to the result
    act(L, type="reveal"); await fresh(host, "result", 2); act(L, type="options"); await asyncio.sleep(0.3)
    act(L, type="toggle_vote"); act(L, type="chameleons", n=2); await asyncio.sleep(0.3); act(L, type="begin")
    hv, pv = await views(host, ph, "play", 3)
    check(hv["options"]["vote"] is False and [v["role"] for v in pv].count("chameleon") == 2, "2 chameleons, voting off")
    act(L, type="reveal")
    r = await fresh(host, "result", 3)
    check(len(r["chameleons"]) == 2 and r["tally"] is None, "no-vote result lists both chameleons")
    act(L, type="lobby")
    await host.until(lambda m: m["t"] == "view" and m["phase"] == "lobby")
    check(True, "leader returns everyone to the lobby")

    # solo test (one player, leader): works without anyone else
    h2, solo = await start_game(srv.port, "chameleon", 1)
    s = solo[0]
    await wait(s, "setup"); act(s, type="chameleons", n=1); act(s, type="begin")
    g = await wait(s, "play")
    check(g["options"]["k"] == 1, "solo: can deal and play alone")
    act(s, type="to_vote"); await wait(s, "vote"); act(s, type="reveal")
    r = await wait(s, "result")
    check(r["chameleons"] == [solo[0].pid], "solo: result works with no votes")
    print("ALL PASSED")


if __name__ == "__main__":
    Server.run(main)
