#!/usr/bin/env python3
"""Spy Poll: deterministic rule tests (Game class driven directly with a fake room) + a protocol flow over WebSockets.

    python3 tests/test_spy-poll.py
"""
import asyncio, importlib.util, json, shutil, subprocess, sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).parent))
from harness import Server, start_game, wait, PIN
from wsclient import WS

GDIR = Path(__file__).resolve().parent.parent / "games" / "spy-poll"
_s = importlib.util.spec_from_file_location("spy_poll_game_under_test", GDIR / "game.py")
G = importlib.util.module_from_spec(_s)
_s.loader.exec_module(G)


def check(c, m):
    print(("  ok  " if c else " FAIL ") + m)
    if not c:
        raise SystemExit(1)


class FP:
    def __init__(self, i):
        self.id, self.name, self.connected = "p%d" % i, "P%d" % i, True


class FR:
    def __init__(self, n):
        self.players = {"p%d" % i: FP(i) for i in range(n)}
        self.t, self.sfxs, self.lobby = 1_000_000, [], False

    def active_players(self): return list(self.players.values())
    def connected_players(self): return [p for p in self.players.values() if p.connected]
    def is_leader(self, p): return getattr(p, "id", p) == "p0"
    def now(self): return self.t
    def sfx(self, name, to=None): self.sfxs.append((name, getattr(to, "id", to)))
    def to_lobby(self): self.lobby = True


def mk(n, timers=False, family=True):
    r = FR(n)
    g = G.Game(r)
    g.rng.seed(7)
    g.start()
    g.opt_timers = timers
    g.opt_family = family
    return r, g, list(r.players.values())


def begin(g, ps):
    g.on_action(ps[0], {"type": "begin"})


def fixq(g, real):
    g.turn["q"] = {"id": "qx", "text": {"en": "x", "ko": "x"}, "pct": real, "family": True}


def turn(g, ps, guess, real, calls):
    """Play one scored turn: the current guesser guesses, `calls` = {player index: dir}; returns deltas."""
    fixq(g, real)
    gp = next(p for p in ps if p.id == g.turn["guesser"])
    g.on_action(gp, {"type": "guess", "value": guess})
    for i, d in calls.items():
        g.on_action(ps[i], {"type": "call", "dir": d})
    if g.screen == "call":
        g.on_action(ps[0], {"type": "next", "step": g.step})
    assert g.screen == "reveal", g.screen
    return dict(g.deltas)


def walk_to_final(g, ps):
    while g.screen != "final":
        if g.screen in ("guess", "call", "reveal"):
            g.on_action(ps[0], {"type": "next", "step": g.step})
        else:
            raise AssertionError(g.screen)


def jv(x): return json.dumps(x, sort_keys=True)


def unit():
    # ── pure scoring ──
    check(G.guess_points(40, 40) == 3000, "guesser: exact = 3000")
    check(G.guess_points(40, 55) == 1500 and G.guess_points(55, 40) == 1500, "guesser: 15 off = 1500 (linear, symmetric)")
    check(G.guess_points(40, 41) == 2900, "guesser: 1 off = 2900")
    check(G.guess_points(40, 70) == 0 and G.guess_points(70, 40) == 0, "guesser: exactly 30 off = 0")
    check(G.guess_points(40, 71) == 0 and G.guess_points(0, 100) == 0, "guesser: beyond 30 = 0")
    check(G.guess_points(40, 69) == 100, "guesser: 29 off = 100")
    c = G.call_points
    check(c("hi", 40, 41) == 1000 and c("hi", 40, 39) == 0 and c("lo", 40, 39) == 1000 and c("lo", 40, 41) == 0, "callers: higher/lower = 1000 when right")
    check(c("hi", 40, 40) == 0 and c("lo", 40, 40) == 0 and c("mhi", 40, 40) == 0, "callers: equal is wrong for both, exact guess pays nobody")
    check(c("mhi", 40, 55) == 0 and c("mhi", 40, 56) == 2000, "much higher: exactly 15 away = 0, 16 away = 2000")
    check(c("mlo", 40, 25) == 0 and c("mlo", 40, 24) == 2000 and c("mlo", 40, 60) == 0 and c("mhi", 40, 20) == 0, "much lower: edge at 15, wrong direction = 0")
    check(c("sideways", 40, 60) == 0, "unknown direction scores nothing")

    # ── 3 players: a scored turn ──
    r, g, ps = mk(3)
    check(g.screen == "setup" and g.view(None)["screen"] == "setup", "starts on the setup screen")
    g.on_action(ps[1], {"type": "begin"})
    check(g.screen == "setup", "begin is leader-only")
    g.on_action(ps[1], {"type": "toggle_timers"}); g.on_action(ps[1], {"type": "first_random"})
    check(g.opt_timers is False and g.first == "p0", "other leader actions refused (timers untouched, first unchanged)")
    g.on_host_action({"type": "toggle_timers"})
    check(g.opt_timers is True, "the laptop (host action) edits options")
    g.on_host_action({"type": "toggle_timers"})
    g.on_action(ps[0], {"type": "first_set", "id": "p2"}); g.on_action(ps[0], {"type": "first_set", "id": "zz"}); g.on_action(ps[0], {"type": "first_set", "id": 5})
    check(g.first == "p2", "tap-a-name sets the first guesser; bad ids ignored")
    begin(g, ps)
    check(g.screen == "guess" and g.turn["guesser"] == "p2" and g.order == ["p2", "p0", "p1"], "rotation starts at the chosen player, join order after")
    d = turn(g, ps, 40, 55, {0: "hi", 1: "lo"})
    check(d == {"p2": 1500, "p0": 1000, "p1": 0}, "turn scoring: guesser 1500, higher right 1000, lower wrong 0")
    check(g.scores == {"p0": 1000, "p1": 0, "p2": 1500}, "scores accumulate")
    v = g.view(None)
    check(v["real"] == 55 and v["gpts"] == 1500 and v["guess"] == 40 and {x["id"]: x["pts"] for x in v["calls"]} == {"p0": 1000, "p1": 0}, "reveal view carries real, guess, calls, points")
    check(v["ranking"][0] == {"id": "p2", "score": 1500, "rank": 1}, "ranking sorted, rank 1 first")
    g.on_action(ps[1], {"type": "next", "step": g.step})
    check(g.screen == "reveal", "next is leader-only")
    g.on_action(ps[0], {"type": "next", "step": g.step})
    check(g.screen == "guess" and g.turn["guesser"] == "p0", "leader Next -> next guesser in rotation")

    # exact hit pays all callers nothing
    d = turn(g, ps, 33, 33, {1: "hi", 2: "lo"})
    check(d == {"p0": 3000, "p1": 0, "p2": 0}, "exact guess: 3000 for guesser, 0 for every caller")
    g.on_action(ps[0], {"type": "next", "step": g.step})
    turn(g, ps, 10, 90, {0: "hi", 2: "hi"})        # third (last) turn of round 1 (guesser p1)
    g.on_action(ps[0], {"type": "next", "step": g.step})
    check(g.screen == "guess" and g._round_of(g.k) == 2 and g.view(None)["stage"] == {"round": 2, "turn": 1, "of": 3}, "round 2 starts after one turn each")
    check(g.view(None)["much"] is True, "round 2 with 3 players offers MUCH buttons")
    fixq(g, 56)
    g.on_action(ps[g.ids.index(g.turn["guesser"])], {"type": "guess", "value": 40})
    g.on_action(ps[0], {"type": "call", "dir": "mhi"}) if g.turn["guesser"] != "p0" else None
    # whoever is not the guesser: mhi / mlo
    others = [p for p in ps if p.id != g.turn["guesser"]]
    g.on_action(others[0], {"type": "call", "dir": "mhi"}); g.on_action(others[1], {"type": "call", "dir": "mlo"})
    check(g.screen == "reveal" and g.deltas[others[0].id] == 2000 and g.deltas[others[1].id] == 0, "MUCH HIGHER at 16 away = 2000, MUCH LOWER the wrong way = 0")
    g.on_action(ps[0], {"type": "next", "step": g.step})
    fixq(g, 55)
    gp = next(p for p in ps if p.id == g.turn["guesser"]); others = [p for p in ps if p is not gp]
    g.on_action(gp, {"type": "guess", "value": 40})
    g.on_action(others[0], {"type": "call", "dir": "mhi"}); g.on_action(others[1], {"type": "call", "dir": "hi"})
    check(g.deltas[others[0].id] == 0 and g.deltas[others[1].id] == 1000, "MUCH HIGHER at exactly 15 away = 0, plain HIGHER still 1000")

    # ── round 1 rejects MUCH ──
    r, g, ps = mk(3); begin(g, ps)
    fixq(g, 90); g.on_action(ps[0], {"type": "guess", "value": 10})
    g.on_action(ps[1], {"type": "call", "dir": "mhi"})
    check("p1" not in g.turn["calls"] and g.view(None)["much"] is False, "round 1: MUCH calls are rejected")
    r, g, ps = mk(6); begin(g, ps)
    while g._round_of(g.k) == 1:
        g.on_action(ps[0], {"type": "next", "step": g.step})
        if g.screen == "call": g.on_action(ps[0], {"type": "next", "step": g.step})
        if g.screen == "reveal": g.on_action(ps[0], {"type": "next", "step": g.step})
    check(g.screen == "guess" and g.view(None)["much"] is False, "round 2 with 6 players: no MUCH buttons (5 or fewer only)")

    # ── player counts: turns per round / rotation ──
    for n, per in ((1, 1), (2, 2), (6, 6), (7, 6), (12, 6), (30, 6)):
        r, g, ps = mk(n); begin(g, ps)
        seq = []
        while g.screen != "final":
            if g.screen == "guess":
                seq.append(g.turn["guesser"])
            g.on_action(ps[0], {"type": "next", "step": g.step})
        check(len(seq) == 2 * per, "%d players: %d turns (%d per round)" % (n, 2 * per, per))
        check(len(set(seq)) == min(n, 2 * per) and seq[:min(n, len(seq))] == [p.id for p in ps][:min(n, len(seq))], "%d players: nobody guesses twice before everyone has" % n)
        check(g.view(None)["stage"] == {"round": 3} and g.screen == "final", "%d players: ends on the final round" % n)

    # ── malformed and out-of-phase ──
    r, g, ps = mk(3); begin(g, ps)
    fixq(g, 60)
    for bad in ("50", True, None, -1, 101, 50.5, [50], {"v": 1}, float("nan")):
        g.on_action(ps[0], {"type": "guess", "value": bad})
    g.on_action(ps[1], {"type": "guess", "value": 50}); g.on_action(ps[0], {"type": "call", "dir": "hi"}); g.on_action(ps[0], {"type": "pick", "i": 1})
    g.on_action(ps[0], "guess"); g.on_action(ps[0], None); g.on_action(ps[0], {})
    check(g.screen == "guess" and g.turn["guess"] is None, "bad values / non-guesser / out-of-phase actions are ignored")
    g.on_action(ps[0], {"type": "guess", "value": 100.0})
    check(g.screen == "call" and g.turn["guess"] == 100, "integral float accepted")
    g.on_action(ps[0], {"type": "guess", "value": 3})
    check(g.turn["guess"] == 100, "double guess ignored")
    g.on_action(ps[0], {"type": "call", "dir": "hi"}); g.on_action(ps[1], {"type": "call", "dir": "up"}); g.on_action(ps[1], {"type": "call", "dir": None}); g.on_action(ps[1], {"type": "call", "dir": 1})
    check(g.turn["calls"] == {}, "guesser cannot call; bad directions ignored")
    g.on_action(ps[1], {"type": "call", "dir": "lo"}); g.on_action(ps[1], {"type": "call", "dir": "hi"})
    check(g.turn["calls"] == {"p1": "lo"} and g.screen == "call", "a call locks (second tap ignored); waiting for the others")
    g.on_action(FP(99), {"type": "call", "dir": "lo"})
    check(list(g.turn["calls"]) == ["p1"], "strangers' actions are ignored")
    g.on_action(ps[2], {"type": "call", "dir": "hi"})
    check(g.screen == "reveal" and g.deltas["p1"] == 1000 and g.deltas["p2"] == 0 and g.deltas["p0"] == 0, "auto-reveal when every connected caller has called (real 60 vs 100)")

    # ── hidden info ──
    r, g, ps = mk(3); begin(g, ps); fixq(g, 61)
    def noleak(tag, secret_in=()):
        for who in [None] + ps:
            s = jv(g.view(who))
            for k in ('"pct"', '"real"', '"picks"', '"calls"', '"gpts"'):
                check(k not in s, "%s: no %s in view(%s)" % (tag, k, getattr(who, "id", None)))
    noleak("guess")
    g.on_action(ps[0], {"type": "guess", "value": 20})
    g.on_action(ps[1], {"type": "call", "dir": "hi"})
    noleak("call")
    check(g.view(ps[1])["mine"] == "hi" and g.view(ps[2])["mine"] is None and g.view(None)["called"] == ["p1"] and '"hi"' not in jv(g.view(None)) and '"hi"' not in jv(g.view(ps[2])), "a call is visible only in its owner's view; others see just who locked in")
    g.on_action(ps[2], {"type": "call", "dir": "lo"})
    check(g.view(None)["real"] == 61, "the real percentage appears only on the reveal screen")
    # the question text view never carries the pct
    check(set(g.view(None)["q"]) == {"text"}, "question view has text only")
    g.on_action(ps[0], {"type": "next", "step": g.step}); noleak("guess 2")

    # ── final round: scoring, hiding, timers ──
    r, g, ps = mk(4); begin(g, ps); walk_to_final(g, ps)
    F = g.final
    F["f"] = {"id": "ft", "prompt": {"en": "p", "ko": "p"}, "family": True,
              "answers": [{"text": {"en": "a%d" % i, "ko": "a%d" % i}, "pct": 90 - i * 9} for i in range(9)]}
    F["disp"] = list(range(9))
    v = g.view(None)
    check(len(v["answers"]) == 9 and all(set(a) == {"text"} for a in v["answers"]) and "order" not in v and "picks" not in v, "final: 9 answers, no percentages or ranks before the reveal")
    g.on_action(ps[0], {"type": "pick", "i": 0}); g.on_action(ps[0], {"type": "pick", "i": 1}); g.on_action(ps[0], {"type": "pick", "i": 2})
    g.on_action(ps[0], {"type": "pick", "i": 3}); g.on_action(ps[0], {"type": "pick", "i": 9}); g.on_action(ps[0], {"type": "pick", "i": "1"}); g.on_action(ps[0], {"type": "pick", "i": True})
    check(g.view(ps[0])["mine"] == [0, 1, 2], "at most 3 picks; out-of-range / non-int ignored")
    check(g.view(ps[1])["mine"] == [] and g.view(None)["locked"] == [] and "mine" in g.view(None), "other players' picks are not in their view")
    g.on_action(ps[1], {"type": "lock"})
    check(g.view(None)["locked"] == [], "cannot lock with fewer than 3 picks")
    g.on_action(ps[0], {"type": "pick", "i": 1}); g.on_action(ps[0], {"type": "pick", "i": 1})
    check(g.view(ps[0])["mine"] == [0, 2, 1], "tapping a pick toggles it")
    g.on_action(ps[0], {"type": "lock"}); g.on_action(ps[0], {"type": "pick", "i": 5})
    check(g.view(ps[0])["myLocked"] and g.view(ps[0])["mine"] == [0, 2, 1] and g.view(None)["locked"] == ["p0"], "lock freezes the picks; the laptop sees only WHO locked")
    for p, picks in ((ps[1], [0, 4, 8]), (ps[2], [2, 1, 5]), (ps[3], [3, 4, 5])):
        for i in picks:
            g.on_action(p, {"type": "pick", "i": i})
        g.on_action(p, {"type": "lock"})
    check(g.screen == "finalreveal", "final reveals when every connected player locked")
    check(g.deltas == {"p0": 7000, "p1": 4000, "p2": 3000, "p3": 0}, "final: 4000/2000/1000 for ranks 1/2/3 (7000, 4000, 3000, 0)")
    v = g.view(None)
    check(v["order"] == list(range(8, -1, -1)) and [a["rank"] for a in v["answers"]] == list(range(1, 10)) and v["pay"] == [4000, 2000, 1000], "reveal order is 9th -> 1st with percentages and ranks")
    check(v["picks"]["p1"] == [0, 4, 8], "all picks visible after the reveal")
    g.on_action(ps[0], {"type": "next", "step": g.step})
    check(g.screen == "end" and g.view(None)["winners"] == ["p0"], "leader Next after the final shows the end")

    # leader skips final with partial picks: whatever is selected counts
    r, g, ps = mk(2); begin(g, ps); walk_to_final(g, ps)
    g.final["f"] = {"id": "ft", "prompt": {"en": "p", "ko": "p"}, "family": True, "answers": [{"text": {"en": "a", "ko": "a"}, "pct": 90 - i * 9} for i in range(9)]}
    g.final["disp"] = list(range(9))
    g.on_action(ps[1], {"type": "pick", "i": 1})
    g.on_action(ps[0], {"type": "next", "step": g.step})
    check(g.deltas == {"p0": 0, "p1": 2000}, "Next on the final counts the picks already made (1 pick = 2000)")

    # ── timers ──
    r, g, ps = mk(3, timers=True); begin(g, ps)
    t0 = r.t
    check(g.view(None)["timer"] == {"deadline": t0 + 45000, "total": 45000}, "guess timer: 45 s absolute deadline + total in the view")
    check(g.tick(t0 + 44000) is False and g.screen == "guess", "tick before the deadline changes nothing")
    r.t = t0 + 45000
    check(g.tick(t0 + 45000) is True and g.screen == "call" and g.turn["guess"] == 50 and g.turn["shrug"] is True, "guess timeout -> 50 and a shrug")
    check(g.view(ps[1])["shrug"] is True and g.view(None)["timer"]["total"] == 20000, "shrug is in the view; call timer 20 s")
    fixq(g, 70)
    g.on_action(ps[1], {"type": "call", "dir": "hi"})
    r.t += 20000
    check(g.tick(r.t) is True and g.screen == "reveal" and g.deltas == {"p0": 0, "p1": 1000}, "call timeout: callers who did not call score nothing (p2 absent); a shrug pays the guesser 0")
    check(g.view(None)["timer"] is None, "no timer on the reveal screen")
    r.t += 100000
    check(g.tick(r.t) is False, "no timer = no expiry on the reveal")
    g.on_action(ps[0], {"type": "next", "step": g.step}); r.t += 1
    g.on_action(ps[0], {"type": "next", "step": g.step})
    check(g.screen == "call", "leader Next works with timers on (skips the guess)")
    r.players["p0"].connected = r.players["p1"].connected = r.players["p2"].connected = False
    r.t += 10 ** 6
    check(g.tick(r.t) is False and g.screen == "call", "timers never fire while nobody is connected")
    for p in ps: p.connected = True
    check(g.tick(r.t) is False and g.screen == "call" and g.deadline > r.t, "...and the clock was paused: reconnecting players get their full window")
    r.t += 30000
    check(g.tick(r.t) is True and g.screen == "reveal", "...then it expires normally")
    r2, g2, ps2 = mk(2, timers=True); begin(g2, ps2); walk_to_final(g2, ps2)
    check(g2.view(None)["timer"]["total"] == 60000, "final timer is 60 s")
    g2.on_action(ps2[0], {"type": "pick", "i": 0}); g2.on_action(ps2[0], {"type": "pick", "i": 1})
    r2.t += 60000
    check(g2.tick(r2.t) and g2.screen == "finalreveal", "final timeout reveals with whatever is selected")
    r3, g3, ps3 = mk(3, timers=False); begin(g3, ps3)
    check(g3.view(None)["timer"] is None and g3.tick(r3.t + 10 ** 9) is False and g3.screen == "guess", "timers off: no deadline, never expires")
    g3.on_action(ps3[0], {"type": "next", "step": g3.step})
    check(g3.screen == "call", "timers off: the leader's Next still works")
    # per-player outcome sounds come from tick (staged to the reveal)
    r4, g4, ps4 = mk(3); begin(g4, ps4); turn(g4, ps4, 40, 41, {1: "hi", 2: "lo"})
    r4.sfxs.clear(); g4.tick(r4.t + 1000)
    check(r4.sfxs == [], "outcome sounds wait for the staged reveal")
    g4.tick(r4.t + G.REVEAL_SFX_MS)
    check(sorted(r4.sfxs) == sorted([("ding", "p0"), ("ding", "p1"), ("buzz", "p2")]), "ding for scorers, buzz for misses (per player)")

    # ── solo mode ──
    r, g, ps = mk(1); begin(g, ps)
    check(g.screen == "guess" and g.view(None)["solo"] is True, "solo: begin works with one player")
    fixq(g, 50)
    g.on_action(ps[0], {"type": "guess", "value": 50})
    check(g.screen == "reveal", "solo: no callers -> straight to the reveal (never a dead screen)")
    v = g.view(None)
    bots = [x for x in v["calls"] if x["bot"]]
    check(len(bots) == 3 and all({"en", "ko"} <= set(b["name"]) for b in bots), "solo: three labelled virtual agents call")
    check(list(g.scores) == ["p0"] and [x["id"] for x in v["ranking"]] == ["p0"] and v["ranking"][0]["score"] == 3000, "solo: bots are never in scores/ranking; exact = 3000, bots 0")
    check(all(b["pts"] == 0 for b in bots), "solo: exact guess pays the bots nothing")
    g.on_action(ps[0], {"type": "next", "step": g.step})
    walk_to_final(g, ps)
    check(g.view(ps[0])["screen"] == "final", "solo: reaches the final round")
    for i in (0, 1, 2): g.on_action(ps[0], {"type": "pick", "i": i})
    g.on_action(ps[0], {"type": "lock"})
    check(g.screen == "finalreveal" and "bot" not in jv(g.view(None)["picks"]), "solo final: no bots, the single player locks and reveals")
    g.on_action(ps[0], {"type": "next", "step": g.step})
    check(g.screen == "end" and g.view(None)["winners"] == ["p0"], "solo ends with a winner")

    # ── double taps, skip label, auto-advance on leave, solo caller turn ──
    r, g, ps = mk(3); begin(g, ps)
    st = g.step
    g.on_action(ps[0], {"type": "next", "step": st}); g.on_action(ps[0], {"type": "next", "step": st}); g.on_host_action({"type": "next", "step": st})
    check(g.screen == "call" and g.turn["why"] == "skip", "a repeated Next (same step) acts once; skip is labelled 'skip', not 'time'")
    check(g.view(ps[1])["why"] == "skip" and g.view(None)["shrug"] is True, "view carries the skip reason")
    g.on_action(ps[0], {"type": "next"})
    check(g.screen == "call", "Next without a step is ignored")
    g.on_action(ps[1], {"type": "call", "dir": "hi"})
    g.on_leave(ps[2]); ps[2].connected = False; g.on_leave(ps[2])
    check(g.screen == "reveal", "the last live caller leaving auto-reveals (on_leave)")
    r, g, ps = mk(3); begin(g, ps); fixq(g, 50)
    g.on_action(ps[0], {"type": "guess", "value": 50}); g.on_action(ps[1], {"type": "call", "dir": "hi"})
    ps[2].connected = False
    check(g.tick(r.t + 250) is True and g.screen == "reveal", "tick also auto-advances when the missing caller dropped")
    r, g, ps = mk(3); begin(g, ps); walk_to_final(g, ps)
    for i in (0, 1, 2): g.on_action(ps[0], {"type": "pick", "i": i}); g.on_action(ps[1], {"type": "pick", "i": i})
    g.on_action(ps[0], {"type": "lock"}); g.on_action(ps[1], {"type": "lock"})
    check(g.screen == "final", "final waits for the third player")
    ps[2].connected = False; g.on_leave(ps[2])
    check(g.screen == "finalreveal", "final: the last missing player leaving reveals")
    r, g, ps = mk(2); begin(g, ps); g.on_action(ps[1], {"type": "next", "step": g.step}); g.on_action(ps[0], {"type": "next", "step": g.step})
    r, g, ps = mk(3); begin(g, ps); fixq(g, 50); g._guess_timeout("skip")
    check(g.turn["shrug"] and g.deltas == {} and g.screen == "call", "shrug is only set, not scored yet")
    g.on_action(ps[1], {"type": "call", "dir": "hi"}); g.on_action(ps[2], {"type": "call", "dir": "lo"})
    check(g.view(None)["gpts"] == 0 and g.deltas[g.turn["guesser"]] == 0, "a shrug guess scores the guesser 0, even if real == 50")
    r, g, ps = mk(1); begin(g, ps); fixq(g, 40); g.on_action(ps[0], {"type": "guess", "value": 40}); g.on_action(ps[0], {"type": "next", "step": g.step})
    check(g.screen == "call" and g.turn["guesser"] in ("b0", "b1", "b2") and g.view(ps[0])["botGuesser"]["en"].startswith("Agent"), "solo: turn 2 a virtual agent guesses and YOU make the call")
    check(g.turn["guess"] is not None and "pct" not in jv(g.view(ps[0])) and "real" not in g.view(ps[0]), "solo: bot guess is public, real number still hidden")
    g.on_action(ps[0], {"type": "call", "dir": "hi"})
    v = g.view(None)
    check(g.screen == "reveal" and not any(x["bot"] for x in v["calls"]) and list(g.scores) == ["p0"] and v["ranking"][0]["id"] == "p0", "solo: bot-guesser reveal has only your call; bots never ranked")
    for _ in range(2):
        g.on_action(ps[0], {"type": "next", "step": g.step})
        if g.screen == "guess": g.on_action(ps[0], {"type": "guess", "value": 10})
        if g.screen == "call": g.on_action(ps[0], {"type": "call", "dir": "lo"})
        if g.screen == "reveal": g.on_action(ps[0], {"type": "next", "step": g.step})
    r, g, ps = mk(1); begin(g, ps)
    seen = set()
    while g.screen != "final" and len(seen) < 40:
        seen.add(g.k)
        if g.screen == "guess": g.on_action(ps[0], {"type": "guess", "value": 30})
        elif g.screen == "call":
            if g.view(ps[0])["much"]: g.on_action(ps[0], {"type": "call", "dir": "mhi"}); seen.add("much")
            else: g.on_action(ps[0], {"type": "call", "dir": "hi"})
        else: g.on_action(ps[0], {"type": "next", "step": g.step})
    check(g.screen == "final" and "much" in seen and len([k for k in seen if k != "much"]) == 4, "solo: 4 turns (2 per round), Much buttons reachable alone, then the final")

    # ── end, ties, again, lobby ──
    r, g, ps = mk(3); begin(g, ps)
    g.on_action(ps[2], {"type": "end_ask", "step": g.step}); check(g.ending is False, "end_ask is leader-only")
    g.on_action(ps[0], {"type": "end_ask", "step": g.step}); check(g.view(None)["ending"] is True, "end_ask raises the in-page confirm")
    g.on_action(ps[0], {"type": "end_cancel", "step": g.step}); check(g.ending is False, "end_cancel closes it")
    g.on_action(ps[0], {"type": "end_ask", "step": g.step}); g.on_action(ps[0], {"type": "next", "step": g.step})
    check(g.screen == "reveal" or g.screen == "call", "advancing clears the confirm")
    g.scores = {"p0": 500, "p1": 500, "p2": 100}
    g.on_host_action({"type": "end", "step": g.step})
    check(g.screen != "end", "end without a prior end_ask is ignored")
    g.on_host_action({"type": "end_ask", "step": g.step}); g.on_host_action({"type": "end", "step": g.step - 1})
    check(g.screen != "end", "end with a stale step is ignored")
    g.on_host_action({"type": "end", "step": g.step})
    v = g.view(None)
    check(g.screen == "end" and v["winners"] == ["p0", "p1"] and [x["rank"] for x in v["ranking"]] == [1, 1, 3], "co-winners on a tie; competition ranking")
    g.on_action(ps[1], {"type": "again"}); check(g.screen == "end", "again is leader-only")
    g.on_action(ps[0], {"type": "again"})
    check(g.screen == "setup" and set(g.scores.values()) == {0} and g.opt_family is True, "Another game -> new setup, scores reset, options kept")
    begin(g, ps); check(g.screen == "guess", "another game can begin")
    g.on_host_action({"type": "end_ask", "step": g.step}); g.on_host_action({"type": "end", "step": g.step}); g.on_action(ps[0], {"type": "lobby"})
    check(r.lobby is True, "Back to lobby calls room.to_lobby()")

    # ── family filter and content ──
    r, g, ps = mk(3, family=True); begin(g, ps)
    seen = {g._draw(G.QUESTIONS, set(), lambda x: x["family"])["family"] for _ in range(60)}
    check(seen == {True}, "family filter on: only family questions are drawn")
    r, g, ps = mk(3, family=False)
    check(any(not g._draw(G.QUESTIONS, set(), lambda x: True)["family"] for _ in range(200)), "family filter off: cheekier questions can appear")
    used = set(); picked = [g._draw(G.QUESTIONS, used, lambda x: x["family"])["id"] for _ in range(148)]
    check(len(set(picked)) == 148, "questions are drawn without replacement within a session")
    check(len(g._draw(G.QUESTIONS, used, lambda x: x["family"])["id"]) > 0, "an exhausted pool refills instead of failing")
    qs = G.QUESTIONS
    check(len(qs) >= 150 and len({q["id"] for q in qs}) == len(qs) and all(len(q["text"]["en"]) <= 100 and q["text"]["ko"] and 0 <= q["pct"] <= 100 for q in qs), "question bank: >=150, unique ids, <=100 chars, en+ko")
    check(all(5 <= a["pct"] <= 95 for f in G.FINALS for a in f["answers"]), "finals: every percentage within 5..95")
    check(len({f["id"] for f in G.FINALS}) == len(G.FINALS) and all(f["prompt"]["en"] and f["prompt"]["ko"] for f in G.FINALS), "finals: unique ids, bilingual prompts")
    check(all(5 <= q["pct"] <= 95 for q in qs) and all(q["text"]["ko"].strip() for q in qs), "questions: pct within 5..95, Korean present")
    norm = lambda t: "".join(ch for ch in t.lower() if ch.isalnum())
    check(len({norm(q["text"]["en"]) for q in qs}) == len(qs), "question bank: no exact duplicate sentences")
    check(all(len(f["answers"]) == 9 and len({a["pct"] for a in f["answers"]}) == 9 and all(a["text"]["en"] and a["text"]["ko"] for a in f["answers"]) for f in G.FINALS), "finals: 9 answers, distinct percentages, en+ko")
    check(sum(1 for f in G.FINALS if f["family"]) >= 20, "enough family-friendly finals")

    # ── reconnect = pure view; json-able everywhere ──
    r, g, ps = mk(4); begin(g, ps)
    for step_ in range(40):
        for who in [None] + ps:
            a, b = g.view(who), g.view(who)
            if jv(a) != jv(b):
                check(False, "view is a pure function")
            check("screen" in a, "view always has a screen") if step_ == 0 else None
        if g.screen == "guess": g.on_action(next(p for p in ps if p.id == g.turn["guesser"]), {"type": "guess", "value": 33})
        elif g.screen == "call": g.on_action(ps[0], {"type": "next", "step": g.step})
        elif g.screen in ("reveal", "finalreveal", "final"): g.on_action(ps[0], {"type": "next", "step": g.step})
        else: break
    check(g.screen == "end", "a full 4-player game runs through to the end")
    check(True, "views are pure and json-able on every screen")

    # ── strings: identical keys in en and ko ──
    if shutil.which("node"):
        js = ("global.window={};global.document={addEventListener(){},getElementById(){}};global.MutationObserver=class{observe(){}};"
              "let d;global.Party={game:x=>d=x};eval(require('fs').readFileSync(%r,'utf8'));"
              "const k=l=>Object.keys(d.strings[l]).sort().join();console.log(k('en')===k('ko')&&d.avatars.length===24?'same':'DIFF')" % str(GDIR / "client.js"))
        out = subprocess.run(["node", "-e", js], capture_output=True, text=True).stdout.strip()
        check(out == "same", "client strings: en and ko have identical keys; 24 avatars")


async def start3(srv):
    # like harness.start_game, but keeps each phone's token and the room code (for the reconnect check)
    host = await WS.open(srv.port)
    host.send({"t": "host"})                     # the admin picks the game on the phone (see harness.start_game)
    code = (await host.until(lambda m: m["t"] == "hosted"))["code"]
    ph = []
    for i in range(3):
        p = await WS.open(srv.port)
        p.send({"t": "join", "code": code})
        j = await p.until(lambda m: m["t"] == "joined")
        p.pid, p.token = j["pid"], j["token"]
        p.send({"t": "profile", "name": "P%d" % i})
        ph.append(p)
    ph[0].send({"t": "auth", "pin": PIN})
    await ph[0].until(lambda m: m["t"] == "authed")
    ph[0].send({"t": "pick_game", "game": "spy-poll"})
    await asyncio.sleep(0.3)
    ph[0].send({"t": "start"})
    return host, ph, code


async def flow(srv):
    host, ph, code = await start3(srv)
    L = ph[0]
    act = lambda p, **a: p.send({"t": "act", "a": a})
    g = await wait(L, "setup")
    check(g["opts"] == {"timers": True, "family": True} and g["ids"] == [p.pid for p in ph], "ws: setup screen, timers and family filter default ON")
    act(ph[1], type="begin"); await asyncio.sleep(0.3)
    host.send({"t": "host_act", "a": {"type": "toggle_timers"}}); act(L, type="first_set", id=ph[1].pid)
    await asyncio.sleep(0.3)
    act(L, type="begin")
    gh = await wait(host, "guess"); gp = await wait(ph[1], "guess"); go = await wait(ph[2], "guess")
    check(gh["guesser"] == ph[1].pid and gh["timer"] is None and gh["opts"]["timers"] is False, "ws: chosen first guesser; laptop turned timers off")
    check(all("pct" not in json.dumps(x) for x in (gh, gp, go)), "ws: no percentage in any pre-reveal view")
    act(ph[2], type="guess", value=10)                      # not the guesser
    act(ph[1], type="guess", value=44)
    gc = await wait(ph[2], "call")
    check(gc["guess"] == 44 and gc["mine"] is None, "ws: call screen shows the guess to callers")
    act(ph[2], type="call", dir="hi"); act(ph[0], type="call", dir="lo")
    r = await wait(host, "reveal")
    check(r["guess"] == 44 and {c["id"]: c["dir"] for c in r["calls"]} == {ph[2].pid: "hi", ph[0].pid: "lo"}, "ws: reveal lists both calls")
    # reconnect a phone mid-game with its token: same player, same view
    before = await wait(ph[2], "reveal")
    ph[2].w.close(); await asyncio.sleep(0.3)
    n = await WS.open(srv.port)
    n.send({"t": "join", "code": code, "token": ph[2].token})
    j = await n.until(lambda m: m["t"] == "joined")
    check(j["pid"] == ph[2].pid, "ws: reconnect keeps the player id")
    after = (await n.until(lambda m: m.get("t") == "view" and m.get("game") and m["game"]["screen"] == "reveal"))["game"]
    check(jv(before) == jv(after), "ws: reconnected phone gets exactly the same view")
    act(L, type="next", step=r["round"])
    await wait(host, "guess")
    check(True, "ws: leader Next -> next turn")
    g2 = await wait(host, "guess")
    act(L, type="end", step=g2["round"]); await asyncio.sleep(0.3)
    act(L, type="end_ask", step=g2["round"]); await asyncio.sleep(0.3)
    act(L, type="end", step=g2["round"])
    e = await wait(host, "end")
    check(len(e["ranking"]) == 3, "ws: leader ends the game -> ranking")
    act(L, type="lobby")
    await host.until(lambda m: m["t"] == "view" and m["phase"] == "lobby")
    check(True, "ws: back to the lobby")


if __name__ == "__main__":
    unit()
    Server.run(flow)
    print("ALL PASSED")
