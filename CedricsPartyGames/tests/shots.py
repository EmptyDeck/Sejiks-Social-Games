#!/usr/bin/env python3
"""Look at a game in a real (headless) Chrome: launcher, lobby, and the first game screens.

    python3 tests/shots.py <game-id> [--lang ko] [--times 2 8 20] [--out /tmp/party-shots]

Starts its own server, opens the big screen (1280x720) and one real phone (390x844) in Chrome, adds
fake phones so the game can start, presses Start, and saves PNGs.  Also prints every JavaScript
error/console.error the pages produced — an empty list is part of "done".
Needs Google Chrome installed (macOS path below, or set CHROME=/path/to/chrome).
"""
import argparse, asyncio, base64, json, os, subprocess, sys, tempfile, time, urllib.request
from pathlib import Path
sys.path.insert(0, str(Path(__file__).parent))
from wsclient import WS

ROOT = Path(__file__).resolve().parent.parent
import socket


def free_port():
    s = socket.socket(); s.bind(("127.0.0.1", 0)); p = s.getsockname()[1]; s.close(); return p


CHROME = os.environ.get("CHROME", "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome")


class Tab:
    def __init__(self, ws, name):
        self.ws, self.name, self.n, self.errors = ws, name, 0, []

    async def call(self, method, **params):
        self.n += 1
        mid = self.n
        self.ws.send({"id": mid, "method": method, "params": params})
        while True:
            m = await self.ws.recv(30)
            if m.get("method") == "Page.javascriptDialogOpening":      # a NATIVE browser pop-up opened: record it and dismiss it
                getattr(self, "dialogs", []).append(m["params"].get("message", ""))
                self.ws.send({"id": 9000 + self.n, "method": "Page.handleJavaScriptDialog", "params": {"accept": True}})
            if m.get("method") == "Runtime.exceptionThrown":
                self.errors.append("%s: %s" % (self.name, m["params"]["exceptionDetails"].get("exception", {}).get("description", "exception")[:300]))
            elif m.get("method") == "Runtime.consoleAPICalled" and m["params"]["type"] == "error":
                self.errors.append("%s console.error: %s" % (self.name, " ".join(str(a.get("value", a.get("description", ""))) for a in m["params"]["args"])[:300]))
            elif m.get("method") == "Log.entryAdded" and m["params"]["entry"]["level"] == "error" and "fonts.g" not in m["params"]["entry"].get("url", ""):
                self.errors.append("%s log: %s" % (self.name, m["params"]["entry"]["text"][:200]))
            if m.get("id") == mid:
                return m.get("result", {})

    async def js(self, expr):
        r = await self.call("Runtime.evaluate", expression=expr, returnByValue=True, awaitPromise=True)
        return r.get("result", {}).get("value")

    async def press(self, selector):
        """Press and HOLD an element with the mouse (so :active styles show). Call release() afterwards."""
        r = await self.js("(()=>{const r=document.querySelector(%r).getBoundingClientRect();return [r.x+r.width/2,r.y+r.height/2]})()" % selector)
        self._pos = r
        await self.call("Input.dispatchMouseEvent", type="mouseMoved", x=r[0], y=r[1])
        await self.call("Input.dispatchMouseEvent", type="mousePressed", x=r[0], y=r[1], button="left", clickCount=1)

    async def release(self):
        await self.call("Input.dispatchMouseEvent", type="mouseReleased", x=self._pos[0], y=self._pos[1], button="left", clickCount=1)

    OVERFLOW_JS = (
        "(()=>{const e=document.querySelector('#screen > .screen'), d=document.scrollingElement;"
        "const page = d.scrollHeight > innerHeight + 1 || d.scrollWidth > innerWidth + 1;"
        "const box = e && (e.scrollHeight > e.clientHeight + 1 || e.scrollWidth > e.clientWidth + 1);"
        "return (page || box) ? JSON.stringify({page, box, sh: e && e.scrollHeight, ch: e && e.clientHeight, font: e && e.style.fontSize}) : null})()"
    )

    async def overflow(self):
        """Does this page scroll? (The big screen must never.) Returns a description or None."""
        return await self.js(self.OVERFLOW_JS)

    async def shot(self, path):
        r = await self.call("Page.captureScreenshot", format="png")
        Path(path).write_bytes(base64.b64decode(r["data"]))
        print("  saved", path)
        if self.name == "host":
            o = await self.overflow()
            if o:
                self.errors.append("host SCROLLS in %s: %s" % (Path(path).name, o))


async def new_tab(port, name, w, h, mobile, lang):
    req = urllib.request.Request("http://127.0.0.1:%d/json/new?about:blank" % port, method="PUT")
    info = json.load(urllib.request.urlopen(req))
    ws = await WS.open(port, info["webSocketDebuggerUrl"].split("%d" % port, 1)[1])
    t = Tab(ws, name)
    for d in ("Page", "Runtime", "Log"):
        await t.call(d + ".enable")
    await t.call("Emulation.setDeviceMetricsOverride", width=w, height=h, deviceScaleFactor=2 if mobile else 1, mobile=mobile)
    await t.call("Page.addScriptToEvaluateOnNewDocument", source="localStorage.setItem('party.lang','%s');localStorage.setItem('party.mute','1')" % lang)
    return t


async def main(a):
    sport, cport = free_port(), free_port()
    out = Path(a.out); out.mkdir(parents=True, exist_ok=True)
    srv = subprocess.Popen([sys.executable, str(ROOT / "server" / "server.py")], env=dict(os.environ, PARTY_PORT=str(sport), PARTY_PIN="4321"),
                           stdout=subprocess.PIPE, stderr=subprocess.STDOUT, text=True)
    prof = tempfile.mkdtemp()
    chrome = subprocess.Popen([CHROME, "--headless=new", "--remote-debugging-port=%d" % cport, "--user-data-dir=" + prof,
                               "--no-first-run", "--disable-gpu", "--remote-allow-origins=*", "about:blank"],
                              stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    errors = []
    try:
        for _ in range(50):
            try:
                urllib.request.urlopen("http://127.0.0.1:%d/json/version" % cport); break
            except Exception:
                await asyncio.sleep(0.2)
        base = "http://127.0.0.1:%d" % sport
        W, H = [int(x) for x in a.size.split("x")]
        host = await new_tab(cport, "host", W, H, False, a.lang)
        await host.call("Page.navigate", url=base + "/host")
        await asyncio.sleep(1.5)
        code = await host.js("document.querySelector('.roomcode').textContent")      # the laptop auto-created a room
        print("room", code)
        await host.shot(out / "1-host-no-game.png")

        phone = await new_tab(cport, "phone", 390, 844, True, a.lang)
        await phone.call("Page.navigate", url="%s/?room=%s" % (base, code))
        await asyncio.sleep(1.5)
        await phone.js("(()=>{const i=document.getElementById('name');i.value='Cedric';i.dispatchEvent(new Event('input',{bubbles:true}))})()")
        await phone.js("Party.state.ws.send(JSON.stringify({t:'auth',pin:'4321'}))")   # the real phone becomes the admin
        await asyncio.sleep(0.8)
        await phone.shot(out / "2b-admin-picker-phone.png")
        await phone.js("document.querySelector('[data-core=pickgame][data-game=\"%s\"]').click()" % a.game)    # the admin picks the game ON THE PHONE
        fakes = []
        for i in range(max(3, a.players) - 1):
            f = await WS.open(sport)
            f.send({"t": "join", "code": code})
            f.pid = (await f.until(lambda m: m.get("t") == "joined"))["pid"]
            f.send({"t": "profile", "name": "Friend %d" % (i + 1)})
            fakes.append(f)
        await asyncio.sleep(1.2)
        await host.shot(out / "2-lobby-host.png")
        await phone.shot(out / "3-lobby-phone.png")

        if not a.no_start:
            await phone.js("document.querySelector('[data-core=start]').click()")        # the admin starts it on the phone too
        t0 = time.time()
        if a.drive:
            import runpy
            mod = runpy.run_path(a.drive)
            class Ctx: pass
            ctx = Ctx(); ctx.host, ctx.phone, ctx.fakes, ctx.out = host, phone, fakes, out
            async def snap(name):
                await host.shot(out / (name + "-host.png")); await phone.shot(out / (name + "-phone.png"))
            ctx.snap = snap
            await mod["drive"](ctx)
        for k, sec in enumerate([] if a.drive else a.times):
            await asyncio.sleep(max(0, sec - (time.time() - t0)))
            await host.shot(out / ("4-game-host-%ss.png" % sec))
            await phone.shot(out / ("5-game-phone-%ss.png" % sec))
        errors = host.errors + phone.errors
    finally:
        chrome.terminate(); srv.terminate()
        log = srv.stdout.read()
        if "Traceback" in log:
            print("SERVER LOG:\n" + log); errors.append("server traceback")
    print("JS/page errors:", errors if errors else "none")
    sys.exit(1 if errors else 0)


if __name__ == "__main__":
    ap = argparse.ArgumentParser()
    ap.add_argument("game")
    ap.add_argument("--lang", default="en")
    ap.add_argument("--times", type=float, nargs="+", default=[2.0])
    ap.add_argument("--out", default="/tmp/party-shots")
    ap.add_argument("--size", default="1280x720", help="big-screen window size, e.g. 1366x768 or 1920x1080")
    ap.add_argument("--players", type=int, default=0, help="total players incl. the real phone (default: the game minimum)")
    ap.add_argument("--no-start", action="store_true", help="stay in the lobby (for --drive scripts that test the lobby)")
    ap.add_argument("--drive", help="python file with  async def drive(ctx)  that plays the game while taking screenshots")
    asyncio.run(main(ap.parse_args()))
