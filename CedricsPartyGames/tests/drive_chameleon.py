"""Drives Chameleon v2 for tests/shots.py --drive. The real phone in Chrome is 'Cedric', the PIN leader; fakes are scripted."""
import asyncio, json


async def g(ctx):
    return json.loads(await ctx.host.js("JSON.stringify((Party.state.view||{}).game||{})") or "{}")


async def until(ctx, screen, t=10):
    for _ in range(int(t * 5)):
        x = await g(ctx)
        if x.get("screen") == screen:
            return x
        await asyncio.sleep(0.2)
    raise TimeoutError(screen)


async def drive(ctx):
    host, phone = ctx.host, ctx.phone
    await until(ctx, "setup"); await asyncio.sleep(0.8); await ctx.snap("a-setup")
    await phone.js("document.querySelector('[data-send=begin]').click()")
    await until(ctx, "play"); await asyncio.sleep(1.0); await ctx.snap("b-play")
    roles = {}
    for f in ctx.fakes:
        v = await f.until(lambda m: m.get("t") == "view" and m["game"] and m["game"]["screen"] == "play")
        roles[f.pid] = v["game"]["role"]
    me = await phone.js("Party.state.view.me")
    cham = next((pid for pid, r in roles.items() if r == "chameleon"), me)
    await phone.press(".peek"); await asyncio.sleep(0.4)
    await phone.shot(ctx.out / "b-play-held-phone.png"); await phone.release()
    await phone.js("document.querySelector('[data-send=first_random]').click()")
    await phone.js("document.querySelector('[data-send=seen]').click()")
    await asyncio.sleep(0.6); await ctx.snap("c-play-first")
    await phone.js("document.querySelector('[data-send=to_vote]').click()")
    await until(ctx, "vote"); await asyncio.sleep(0.8); await ctx.snap("d-vote")
    other = next(f.pid for f in ctx.fakes if f.pid != cham)
    for f in ctx.fakes:
        f.send({"t": "act", "a": {"type": "vote", "id": other if f.pid == cham else cham}})
    target = other if cham == me else cham
    await phone.js("document.querySelector('[data-send=vote][data-id=%s]').click()" % target)
    await asyncio.sleep(0.5)
    await phone.js("document.querySelector('[data-send=reveal]').click()")
    await until(ctx, "guess"); await asyncio.sleep(0.8); await ctx.snap("e-guess")
    if cham == me:
        await phone.js("document.querySelector('.cell').click()")
    else:
        next(f for f in ctx.fakes if f.pid == cham).send({"t": "act", "a": {"type": "guess", "i": 0}})
    await asyncio.sleep(0.5)
    await phone.js("document.querySelector('[data-send=show_answer]').click()")       # the admin drives from the phone
    await until(ctx, "result"); await asyncio.sleep(1.6); await ctx.snap("f-result")
