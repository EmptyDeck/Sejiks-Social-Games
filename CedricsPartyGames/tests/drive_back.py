"""Backing out: host 'Change game' returns to the picker; phones return to the join screen."""
import asyncio


async def drive(ctx):
    host, phone = ctx.host, ctx.phone
    await ctx.snap("1-before")
    await host.js("document.querySelector('[data-core=close]').click()")
    await asyncio.sleep(0.6)
    await ctx.snap("1b-dialog")                               # our own dialog, not the browser's
    assert await host.js("!document.getElementById('modal').hidden")
    await host.js("document.getElementById('modal-yes').click()")
    await asyncio.sleep(1.2)
    await ctx.snap("2-after-close")
    h = await host.js("!!document.querySelector('[data-core=host]')")
    p = await phone.js("!!document.getElementById('code')")
    print("host back at picker:", h, "| phone back at join screen:", p)
    assert h and p
