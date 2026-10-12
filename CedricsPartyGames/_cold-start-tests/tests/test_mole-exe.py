#!/usr/bin/env python3
"""MOLE.EXE tests: (1) deterministic rules with a fake room, (2) full 3-round game over real WebSockets.
    python3 tests/test_mole-exe.py
"""
import asyncio, importlib.util, json, os, random, socket, subprocess, sys, time
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(Path(__file__).parent))
from wsclient import WS


def check(cond, msg):
    print(("  ok  " if cond else " FAIL ") + msg)
    if not cond:
        raise SystemExit(1)


# ───────── part 1: rules with a fake room ─────────
class P:
    def __init__(s, i): s.id, s.name, s.connected = "p%d" % i, "N%d" % i, True


class FakeRoom:
    def __init__(s, n):
        s.players = {"p%d" % i: P(i) for i in range(n)}; s.t = 1000; s.sounds = []
    def active_players(s): return list(s.players.values())
    def connected_players(s): return [p for p in s.players.values() if p.connected]
    def now(s): return s.t
    def sfx(s, name, to=None): s.sounds.append((name, to.id if to else None))
    def to_lobby(s): s.lobby = True


def load():
    spec = importlib.util.spec_from_file_location("mole", ROOT / "games" / "mole-exe" / "game.py")
    m = importlib.util.module_from_spec(spec); spec.loader.exec_module(m); return m


def rules():
    m = load()
    check(sum(len(c["words"]) for c in m.CATEGORIES) >= 40 and all(w["en"] and w["ko"] for c in m.CATEGORIES for w in c["words"]), ">=40 bilingual words")
    check(m.guess_matches("pengwin", {"en": "Penguin", "ko": "펭귄"}) and m.guess_matches(" 펭귄 ", {"en": "Penguin", "ko": "펭귄"})
          and not m.guess_matches("fish", {"en": "Penguin", "ko": "펭귄"}), "guess matching (typo, Korean, wrong)")
    for n in (4, 8):
        room = FakeRoom(n); g = m.Game(room); g.start()
        mole = g.mole
        check(len(set(g.moles)) == 3, "moles differ per round")
        views = {pid: g.view(room.players[pid]) for pid in room.players}
        check(all(("word" in v) == (pid != mole) for pid, v in views.items()), "word only in agents' views (briefing)")
        check("word" not in g.view(None) and "mole" not in g.view(None) and "role" not in g.view(None), "big-screen briefing leaks nothing")
        room.t = g.deadline; g.tick(room.t); check(g.screen == "clue", "briefing -> clue")
        agent = next(p for p in room.players.values() if p.id != mole)
        g.on_action(agent, {"type": "clue", "value": g.word["en"].upper()})
        check(agent.id not in g.clues, "agent cannot type the password")
        g.on_action(agent, {"type": "clue", "value": "  "}); g.on_action(agent, {"type": "clue"}); g.on_action(agent, "junk")
        check(agent.id not in g.clues, "empty/malformed clue ignored")
        g.on_action(agent, {"type": "vote", "p": mole}); check(not g.votes, "out-of-phase vote ignored")
        for p in room.players.values(): g.on_action(p, {"type": "clue", "value": "hello world <b>"})
        check(all(c == "hello" for c in g.clues.values()), "clue truncated to one word")
        g.on_action(room.players[mole], {"type": "clue", "value": "second"}); check(g.clues[mole] == "hello", "no double clue")
        g.tick(room.t); check(g.screen == "vote", "all clued -> vote early")
        check("word" not in g.view(None) and "word" not in g.view(room.players[mole]), "no word in vote view for mole/host")
        g.on_action(room.players[mole], {"type": "vote", "p": mole}); check(mole not in g.votes, "no self vote")
        g.on_action(room.players[mole], {"type": "vote", "p": "zzz"}); check(mole not in g.votes, "bad target ignored")
        for p in room.players.values():
            g.on_action(p, {"type": "vote", "p": mole if p.id != mole else agent.id})
        g.on_action(agent, {"type": "vote", "p": mole}); 
        g.tick(room.t); check(g.screen == "reveal" and g.caught, "unanimous -> caught")
        room.t = g.deadline; g.tick(room.t); check(g.screen == "guess", "caught -> guess")
        check("word" not in g.view(room.players[mole]), "mole never sees word while guessing")
        for p in room.players.values():
            if p.id != mole: g.on_action(p, {"type": "bet", "v": 1})
        g.on_action(room.players[mole], {"type": "guess", "value": g.word["ko"]})
        g.on_action(room.players[mole], {"type": "guess", "value": "other"})
        check(g.guess == g.word["ko"], "one guess only")
        g.tick(room.t); check(g.screen == "result" and g.outcome == "stolen", "correct guess -> stolen")
        check(g.delta[mole] == m.PTS_MOLE_STEALS and g.delta[agent.id] == m.PTS_CORRECT_VOTE + m.PTS_BET, "scoring stolen + bet")
        room.t = g.deadline; g.tick(room.t); check(g.screen == "briefing" and g.round == 2, "result -> next round")
    # mole escapes on tie, disconnect, missing input
    room = FakeRoom(5); g = m.Game(room); g.start(); mole = g.mole
    room.t = g.deadline; g.tick(room.t)
    room.players["p4" if mole != "p4" else "p3"].connected = False
    room.t = g.deadline; g.tick(room.t); check(g.screen == "vote", "clue deadline with nobody answering -> vote")
    others = [p for p in room.players.values() if p.id != mole]
    g.on_action(others[0], {"type": "vote", "p": mole}); g.on_action(others[1], {"type": "vote", "p": others[2].id})
    room.t = g.deadline; g.tick(room.t)
    check(g.screen == "reveal" and not g.caught, "tie -> mole not caught")
    room.t = g.deadline; g.tick(room.t); check(g.screen == "result" and g.outcome == "escaped" and g.delta[mole] == m.PTS_MOLE_ESCAPES, "escaped scoring, no guess phase")
    # busted
    room = FakeRoom(4); g = m.Game(room); g.start(); mole = g.mole
    for scr in ("briefing", "clue"):
        room.t = g.deadline; g.tick(room.t)
    for p in room.players.values():
        g.on_action(p, {"type": "vote", "p": mole if p.id != mole else "p%d" % ((int(mole[1]) + 1) % 4)})
    g.tick(room.t); room.t = g.deadline; g.tick(room.t)
    g.on_action(room.players[mole], {"type": "guess", "value": "nope"}); room.t += 5000; g.tick(room.t)
    check(g.outcome == "busted" and all(g.delta[p] == 200 for p in room.players if p != mole), "busted: agents get vote+hold")
    # mole leaves during guess -> no hang
    room = FakeRoom(4); g = m.Game(room); g.start(); mole = g.mole
    for scr in ("briefing", "clue"):
        room.t = g.deadline; g.tick(room.t)
    for p in room.players.values():
        g.on_action(p, {"type": "vote", "p": mole if p.id != mole else "p%d" % ((int(mole[1]) + 1) % 4)})
    g.tick(room.t); room.t = g.deadline; g.tick(room.t); room.players[mole].connected = False; g.tick(room.t)
    check(g.screen == "result", "mole disconnect in guess ends the phase")
    # full 3 rounds reach final
    for _ in range(40):
        room.t = g.deadline; g.tick(room.t)
        if g.screen == "final": break
    check(g.screen == "final" and len(g.view(None)["ranking"]) == 4, "reaches final")
    g.on_action(room.players["p0"], {"type": "again"}); check(getattr(room, "lobby", False), "again -> lobby")


# ───────── part 2: real sockets ─────────
def free_port():
    s = socket.socket(); s.bind(("127.0.0.1", 0)); p = s.getsockname()[1]; s.close(); return p


async def e2e(port):
    host = await WS.open(port); host.send({"t": "host", "game": "mole-exe"})
    code = (await host.until(lambda m: m["t"] == "hosted"))["code"]
    phones = []
    for i in range(5):
        p = await WS.open(port); p.send({"t": "join", "code": code})
        j = await p.until(lambda m: m["t"] == "joined"); p.token, p.pid = j["token"], j["pid"]
        p.send({"t": "profile", "name": "P%d" % i}); phones.append(p)
    await host.until(lambda m: m["t"] == "view" and len([x for x in m["players"] if x["name"]]) == 5)
    phones[0].send({"t": "start"})
    await host.until(lambda m: m["t"] == "view" and m["phase"] == "game")

    async def hv(screen, rnd):
        l = host.last
        if l.get("game") and l["game"]["screen"] == screen and l["game"]["round"] == rnd: return l
        return await host.until(lambda m: m["t"] == "view" and m["game"] and m["game"]["screen"] == screen and m["game"]["round"] == rnd, 20)

    async def pv(ph, screen, rnd):
        l = ph.last
        if l.get("game") and l["game"]["screen"] == screen and l["game"]["round"] == rnd: return l
        return await ph.until(lambda m: m["t"] == "view" and m["game"] and m["game"]["screen"] == screen and m["game"]["round"] == rnd, 20)

    for rnd in range(1, 4):
        v = await hv("briefing", rnd)
        txt = json.dumps(v["game"])
        views = [(await pv(ph, "briefing", rnd))["game"] for ph in phones]
        moles = [i for i, g in enumerate(views) if g["role"] == "mole"]
        check(len(moles) == 1 and all(("word" in g) == (g["role"] == "agent") for g in views), "round %d: exactly one mole, only agents see the word" % rnd)
        word = next(g["word"] for g in views if "word" in g)
        check(word["en"] not in txt and "role" not in v["game"], "host view hides the word and role")
        await hv("clue", rnd)
        for i, ph in enumerate(phones):
            ph.send({"t": "act", "a": {"type": "clue", "value": "clue%d" % i}})
        v = await hv("vote", rnd)
        mole = phones[moles[0]].pid
        check(all(c["clue"] for c in v["game"]["clues"]), "clues listed for the vote")
        for ph in phones:
            await pv(ph, "vote", rnd)
            ph.send({"t": "act", "a": {"type": "vote", "p": ph.pid}})                # self vote: refused
            ph.send({"t": "act", "a": {"type": "vote", "p": mole if ph.pid != mole else phones[(moles[0] + 1) % 5].pid}})
        v = await hv("reveal", rnd)
        check(v["game"]["mole"] == mole and v["game"]["caught"] and len(v["game"]["votes"]) == 5, "reveal names the mole")
        v = await hv("guess", rnd)
        for ph in phones:
            if ph.pid != mole: ph.send({"t": "act", "a": {"type": "bet", "v": 0}})
        phones[moles[0]].send({"t": "act", "a": {"type": "guess", "value": "definitely wrong" if rnd % 2 else word["en"]}})
        v = await hv("result", rnd)
        check(v["game"]["outcome"] == ("busted" if rnd % 2 else "stolen") and v["game"]["word"] == word, "round %d result %s" % (rnd, v["game"]["outcome"]))
        host.send({"t": "host_act", "a": {"type": "skip"}})
    v = await host.until(lambda m: m["t"] == "view" and m["game"] and m["game"]["screen"] == "final", 15)
    check(len(v["game"]["ranking"]) == 5, "final ranking")
    phones[0].send({"t": "act", "a": {"type": "again"}})
    await host.until(lambda m: m["t"] == "view" and m["phase"] == "lobby")
    check(True, "back to lobby")


if __name__ == "__main__":
    rules()
    port = free_port()
    srv = subprocess.Popen([sys.executable, str(ROOT / "server" / "server.py")], env=dict(os.environ, PARTY_PORT=str(port)),
                           stdout=subprocess.PIPE, stderr=subprocess.STDOUT, text=True)
    time.sleep(1.2)
    try:
        asyncio.run(e2e(port))
    finally:
        srv.terminate()
        out = srv.stdout.read()
        if "Traceback" in out:
            print("SERVER LOG:\n" + out); sys.exit(1)
    print("ALL PASSED")
