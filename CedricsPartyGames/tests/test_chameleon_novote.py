#!/usr/bin/env python3
"""Default mode (voting hidden): setup has no vote option, 20-word grid, reveal goes straight to the result, next round / reset work."""
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


async def main(srv):
    host, ph = await start_game(srv.port, "chameleon", 4)
    L = ph[0]
    g = await wait(L, "setup")
    check(g["votingEnabled"] is False and g["options"]["vote"] is False, "voting is hidden/off by default")
    act(L, type="toggle_vote")                                  # must be ignored
    act(L, type="begin")
    g = await wait(L, "play")
    check(len(g["grid"]) == 20, "grid has exactly 20 words")
    words = [w["en"] for w in g["grid"]]
    check(len(set(words)) == 20, "20 distinct words")
    act(L, type="to_vote")                                      # ignored while voting is off
    await asyncio.sleep(0.3)
    act(L, type="reveal")
    r = await wait(L, "result")
    check(r["tally"] is None and r["caught"] == [], "reveal goes straight to the result (no vote/guess)")
    check(r["grid"][r["secret"]]["en"] in words, "the secret is one of the 20 words")
    act(L, type="next_word")
    g2 = await wait(L, "play")
    check(g2["key"] == 2, "Next round deals a new word")
    act(L, type="reveal"); await wait(L, "result")
    act(L, type="reset")
    s = await wait(L, "setup")
    check(s["key"] == 0, "Reset game returns to setup and forgets played words")
    print("ALL PASSED")


Server.run(main)
