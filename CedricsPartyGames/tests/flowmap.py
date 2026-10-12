#!/usr/bin/env python3
"""Builds a FULL MAP of every screen (laptop + admin phone + friend phone, EN + KO) as one image/PDF/HTML.
    python3 tests/flowmap.py <game-id> [--out design-proposals/flow-map]
One Chrome, tabs used one after another. Output: map.html (open it), map.png (whole map), map.pdf, shots/*.png"""
import argparse, asyncio, base64, html, json, os, subprocess, sys, tempfile, time, urllib.request
from pathlib import Path
sys.path.insert(0, str(Path(__file__).parent))
from shots import new_tab, free_port, CHROME
from wsclient import WS

ROOT = Path(__file__).resolve().parent.parent
PIN = "4321"


async def until(tab, expr, t=8):
    end = time.time() + t
    while time.time() < end:
        v = await tab.js(expr)
        if v:
            return v
        await asyncio.sleep(0.15)
    return None


async def click(tab, sel):
    return await tab.js("(()=>{const e=document.querySelector(%r);if(!e)return false;e.click();return true})()" % sel)


async def screen(tab):
    return json.loads(await tab.js("JSON.stringify(((Party.state.view||{}).game||{}).screen||'')") or '""')


async def wait_screen(tab, name, t=8):
    end = time.time() + t
    while time.time() < end:
        if await screen(tab) == name:
            return True
        await asyncio.sleep(0.15)
    return False


async def main(a):
    out = Path(a.out); shots = out / "shots"; shots.mkdir(parents=True, exist_ok=True)
    port, cport = free_port(), free_port()
    srv = subprocess.Popen([sys.executable, str(ROOT / "server" / "server.py")], env=dict(os.environ, PARTY_PORT=str(port), PARTY_PIN=PIN),
                           stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    chrome = subprocess.Popen([CHROME, "--headless=new", "--remote-debugging-port=%d" % cport, "--user-data-dir=" + tempfile.mkdtemp(), "--no-first-run",
                               "--disable-gpu", "--remote-allow-origins=*", "about:blank"], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    items = []   # (section, caption, device, file)
    n = [0]

    async def snap(tab, section, caption, device):
        n[0] += 1
        fn = "%02d-%s.png" % (n[0], device)
        await tab.shot(shots / fn)
        items.append((section, caption, device, fn))

    try:
        for _ in range(60):
            try:
                urllib.request.urlopen("http://127.0.0.1:%d/json/version" % cport); urllib.request.urlopen("http://127.0.0.1:%d/api/info" % port); break
            except Exception:
                await asyncio.sleep(0.2)
        base, fbase = "http://127.0.0.1:%d" % port, "http://localhost:%d" % port
        laptop = await new_tab(cport, "host", 1280, 720, False, "en")
        admin = await new_tab(cport, "phone", 390, 844, True, "en")
        friend = await new_tab(cport, "phone2", 390, 844, True, "en")

        await laptop.call("Page.navigate", url=base + "/host")
        code = await until(laptop, "(document.querySelector('.roomcode')||{}).textContent")
        await asyncio.sleep(0.8)
        await snap(laptop, "1 · Joining", "Laptop: opens by itself, shows the room code + QR. No buttons.", "laptop")
        await friend.call("Page.navigate", url=fbase + "/")
        await until(friend, "document.getElementById('code')")
        await snap(friend, "1 · Joining", "Phone: someone who typed the address (no QR) enters the 4-letter code", "phone")
        await admin.call("Page.navigate", url="%s/?room=%s" % (base, code))
        await friend.call("Page.navigate", url="%s/?room=%s" % (fbase, code))
        await until(admin, "document.querySelector('.lobby-player')"); await until(friend, "document.querySelector('.lobby-player')")
        await admin.js("(()=>{const i=document.getElementById('name');i.value='Cedric';i.dispatchEvent(new Event('input',{bubbles:true}))})()")
        await friend.js("(()=>{const i=document.getElementById('name');i.value='Mina';i.dispatchEvent(new Event('input',{bubbles:true}))})()")
        fakes = []
        for nm in ["Jun", "Sora", "Dae", "Hana"]:
            w = await WS.open(port); w.send({"t": "join", "code": code}); w.pid = (await w.until(lambda m: m.get("t") == "joined"))["pid"]
            w.send({"t": "profile", "name": nm}); fakes.append(w)
        await asyncio.sleep(1.0)
        await snap(friend, "1 · Joining", "Regular player's phone in the lobby: name, icon, 'Tap for noise', 'Are you Cedric?'", "phone")
        await snap(laptop, "1 · Joining", "Laptop lobby as friends join (they pop in)", "laptop")

        await click(admin, "[data-core=auth]")
        await until(admin, "!document.getElementById('modal').hidden"); await asyncio.sleep(0.4)
        await snap(admin, "2 · Becoming the admin", "Tap 'Yes' on 'Are you Cedric?' → our own PIN dialog (no browser pop-up)", "phone")
        await admin.js("document.getElementById('modal-input').value='%s'; document.getElementById('modal-yes').click()" % PIN)
        await until(admin, "document.querySelector('[data-core=pickgame]')"); await asyncio.sleep(0.8)
        await snap(admin, "2 · Becoming the admin", "Admin phone: pick the game (only the admin sees this)", "phone")
        await click(admin, "[data-core=pickgame][data-game=%s]" % a.game)
        await until(laptop, "document.body.dataset.game === %r" % a.game); await asyncio.sleep(0.8)
        await snap(laptop, "2 · Becoming the admin", "Laptop switches to the chosen game's look; admin gets an ADMIN badge", "laptop")
        await snap(admin, "2 · Becoming the admin", "Admin lobby after choosing: Start button + Close room", "phone")
        await click(admin, "[data-core=start]")
        await wait_screen(admin, "setup"); await asyncio.sleep(0.8)
        await snap(admin, "3 · Setup (before the word)", "ADMIN phone: voting on/off, number of chameleons, categories, Deal", "phone")
        await snap(friend, "3 · Setup (before the word)", "Regular player's phone: sees the settings, can't change them", "phone")
        await snap(laptop, "3 · Setup (before the word)", "Laptop during setup", "laptop")

        # deal until the two real phones have different roles so both views are captured
        await click(admin, "[data-send=begin]")
        for _ in range(12):
            await wait_screen(admin, "play"); await asyncio.sleep(0.5)
            ra = await admin.js("(Party.state.view.game||{}).role"); rf = await friend.js("(Party.state.view.game||{}).role")
            if ra != rf:
                break
            await click(admin, "[data-send=reveal]"); await wait_screen(admin, "result"); await click(admin, "[data-send=next_word]")
        cham, ins = (admin, friend) if ra == "chameleon" else (friend, admin)
        name = lambda t: "Admin phone" if t is admin else "Regular phone"
        await snap(laptop, "4 · Playing (people talk out loud)", "Laptop: the shared word grid. Never shows the secret.", "laptop")
        await snap(ins, "4 · Playing (people talk out loud)", "%s (knows the word) — before holding the secret card: looks identical for everyone" % name(ins), "phone")
        await ins.press(".peek"); await asyncio.sleep(0.5)
        await snap(ins, "4 · Playing (people talk out loud)", "%s while HOLDING: the secret word, lit up in the grid" % name(ins), "phone")
        await ins.release()
        await cham.press(".peek"); await asyncio.sleep(0.5)
        await snap(cham, "4 · Playing (people talk out loud)", "%s while HOLDING: 'You are the CHAMELEON' (card looks the same as the others')" % name(cham), "phone")
        await cham.release()
        await click(admin, "[data-send=first_random]"); await asyncio.sleep(0.8)
        await snap(laptop, "4 · Playing (people talk out loud)", "Admin taps 'Pick who goes first' → everyone sees it", "laptop")
        await snap(admin, "4 · Playing (people talk out loud)", "Admin phone while playing: first-speaker picker + Start voting / Reveal", "phone")

        await click(admin, "[data-send=to_vote]"); await wait_screen(friend, "vote"); await asyncio.sleep(0.8)
        await snap(friend, "5 · Voting (optional)", "Everyone taps who they think the chameleon is", "phone")
        await snap(laptop, "5 · Voting (optional)", "Laptop while people vote", "laptop")
        # everyone votes for the chameleon -> caught
        cham_id = await cham.js("Party.state.view.me")
        for f in fakes:
            f.send({"t": "act", "a": {"type": "vote", "id": cham_id if f.pid != cham_id else fakes[0].pid}})
        await ins.js("(()=>{const b=document.querySelector('[data-send=vote][data-id=%s]'); if(b) b.click()})()" % cham_id)
        await asyncio.sleep(0.5)
        await click(admin, "[data-send=reveal]")
        await wait_screen(cham, "guess"); await asyncio.sleep(0.9)
        await snap(cham, "6 · Caught → last guess", "Caught chameleon's phone: tap the word you think it was", "phone")
        await snap(ins if ins is not admin else friend, "6 · Caught → last guess", "Everyone else waits", "phone")
        await snap(laptop, "6 · Caught → last guess", "Laptop while the caught chameleon guesses", "laptop")
        await cham.js("(()=>{const c=document.querySelector('.wordgrid.pickable .cell'); if(c) c.click()})()"); await asyncio.sleep(0.4)
        await click(admin, "[data-send=show_answer]"); await wait_screen(admin, "result"); await asyncio.sleep(1.8)
        await snap(laptop, "7 · Result", "Laptop: stamp, the word, the guess, the vote tally", "laptop")
        await snap(admin, "7 · Result", "Admin phone: result + Next word / Change options / Back to lobby", "phone")
        await snap(friend, "7 · Result", "Regular phone: result", "phone")

        await click(admin, "[data-send=lobby]"); await until(admin, "document.querySelector('[data-core=close]')"); await asyncio.sleep(0.5)
        await click(admin, "[data-core=close]"); await until(admin, "!document.getElementById('modal').hidden"); await asyncio.sleep(0.4)
        await snap(admin, "8 · Closing the room", "Admin taps 'Close room' → themed confirm dialog", "phone")

        # Korean
        for t in (laptop, admin, friend):
            await t.js("document.getElementById('lang').click()")
        await asyncio.sleep(0.8)
        await admin.js("document.getElementById('modal-no').click()")
        await snap(admin, "9 · Korean (one tap on the language button, any time)", "Admin phone in Korean", "phone")
        await snap(laptop, "9 · Korean (one tap on the language button, any time)", "Laptop in Korean", "laptop")
    finally:
        chrome.terminate(); srv.terminate()

    # ---- assemble ----
    sections = []
    for sec, cap, dev, fn in items:
        if not sections or sections[-1][0] != sec:
            sections.append((sec, []))
        sections[-1][1].append((cap, dev, fn))
    body = []
    for sec, its in sections:
        cells = "".join('<figure class="%s"><img src="shots/%s"><figcaption>%s</figcaption></figure>' % (dev, fn, html.escape(cap)) for cap, dev, fn in its)
        body.append('<section><h2>%s</h2><div class="row">%s</div></section>' % (html.escape(sec), cells))
    page = """<!doctype html><meta charset=utf-8><title>%s — full screen map</title><style>
body{font-family:-apple-system,Segoe UI,system-ui,sans-serif;background:#f4f1ea;color:#1a2a22;margin:0;padding:32px 40px 80px;width:1900px}
h1{font-size:34px;margin:0 0 4px}.sub{color:#5a6b62;margin:0 0 26px;font-size:16px}
section{margin:0 0 34px;padding:18px 22px 22px;background:#fff;border:1px solid #d9d2c1;border-radius:10px}
h2{font-size:21px;margin:0 0 14px;color:#a8421a}.row{display:flex;gap:22px;flex-wrap:wrap;align-items:flex-start}
figure{margin:0}.phone img{width:240px;border:1px solid #bbb;border-radius:18px;box-shadow:0 6px 18px rgba(0,0,0,.18);display:block}
.laptop img{width:560px;border:1px solid #bbb;border-radius:8px;box-shadow:0 6px 18px rgba(0,0,0,.18);display:block}
figcaption{font-size:13px;line-height:1.35;margin-top:8px;color:#34463d}.phone figcaption{width:240px}.laptop figcaption{width:560px}
.legend{font-size:14px;margin:0 0 22px;padding:10px 14px;background:#fff8e0;border:1px solid #e6d9a8;border-radius:8px}
</style><h1>%s — every screen</h1><p class=sub>Flow order, top to bottom. Phones are 390×844 (shown smaller), laptop is 1280×720. Generated by the real code, not mockups.</p>
<p class=legend>Who's who: <b>Laptop</b> = the shared screen (display only, no buttons). <b>Admin phone</b> = the phone that entered the PIN (picks the game, starts, runs everything). <b>Regular phone</b> = everyone else.</p>%s""" % (a.game, a.game, "".join(body))
    (out / "map.html").write_text(page)

    # render PNG + PDF with a fresh headless Chrome
    cport = free_port()
    chrome = subprocess.Popen([CHROME, "--headless=new", "--remote-debugging-port=%d" % cport, "--user-data-dir=" + tempfile.mkdtemp(), "--no-first-run", "--disable-gpu", "--remote-allow-origins=*", "about:blank"],
                              stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    try:
        for _ in range(60):
            try: urllib.request.urlopen("http://127.0.0.1:%d/json/version" % cport); break
            except Exception: await asyncio.sleep(0.2)
        t = await new_tab(cport, "map", 1980, 1200, False, "en")
        await t.call("Page.navigate", url="file://" + str((out / "map.html").resolve()))
        await asyncio.sleep(2.0)
        h = int(await t.js("document.documentElement.scrollHeight"))
        await t.call("Emulation.setDeviceMetricsOverride", width=1980, height=h, deviceScaleFactor=1, mobile=False)
        await asyncio.sleep(0.8)
        r = await t.call("Page.captureScreenshot", format="png", captureBeyondViewport=True)
        (out / "map.png").write_bytes(base64.b64decode(r["data"]))
        r = await t.call("Page.printToPDF", printBackground=True, paperWidth=20.6, paperHeight=h / 96 + 0.5, marginTop=0, marginBottom=0, marginLeft=0, marginRight=0)
        (out / "map.pdf").write_bytes(base64.b64decode(r["data"]))
    finally:
        chrome.terminate()
    print("DONE", out / "map.html", out / "map.png", out / "map.pdf", "(%d screens)" % len(items))


if __name__ == "__main__":
    ap = argparse.ArgumentParser(); ap.add_argument("game"); ap.add_argument("--out", default=str(ROOT / "design-proposals" / "flow-map"))
    asyncio.run(main(ap.parse_args()))
