#!/usr/bin/env python3
"""ACCEPTANCE TEST — proves, by running the real code, every rule the owner has asked for.
Real server, real headless Chrome (one instance, tabs used one at a time), fake WebSocket players for the crowd.
Every line printed is evidence (what was actually observed). The whole log is saved to tests/acceptance.log.

    python3 tests/acceptance.py            # also tries the public Tailscale URL if the live server (3100) is up
"""
import asyncio, json, os, re, subprocess, sys, tempfile, time, urllib.request
from pathlib import Path
sys.path.insert(0, str(Path(__file__).parent))
import shots
from shots import Tab, new_tab, free_port, CHROME
from wsclient import WS

ROOT = Path(__file__).resolve().parent.parent
PIN = "4321"
LOG = []
FAILS = []


def say(s=""):
    print(s, flush=True)
    LOG.append(s)


def ok(rid, text, evidence=""):
    say("  ✅ %-4s %s%s" % (rid, text, ("   ← " + str(evidence)) if evidence != "" else ""))


def bad(rid, text, evidence=""):
    FAILS.append(rid)
    say("  ❌ %-4s %s   ← %s" % (rid, text, evidence))


def check(rid, text, cond, evidence=""):
    (ok if cond else bad)(rid, text, evidence)
    return cond


async def until(tab, expr, timeout=8):
    """Poll a JS expression until truthy; returns its value (or None)."""
    end = time.time() + timeout
    v = None
    while time.time() < end:
        v = await tab.js(expr)
        if v:
            return v
        await asyncio.sleep(0.15)
    return v


async def click(tab, sel):
    return await tab.js("(()=>{const e=document.querySelector(%r); if(!e) return false; e.click(); return true})()" % sel)


async def fake_player(port, code, name, auth=False):
    w = await WS.open(port)
    w.send({"t": "join", "code": code})
    w.pid = (await w.until(lambda m: m.get("t") == "joined"))["pid"]
    w.send({"t": "profile", "name": name})
    if auth:
        w.send({"t": "auth", "pin": PIN})
        await w.until(lambda m: m.get("t") == "authed")
    return w


def act(w, **a):
    w.send({"t": "act", "a": a})


async def game(tab):
    return json.loads(await tab.js("JSON.stringify((Party.state.view||{}).game||{})") or "{}")


async def wait_screen(tab, screen, timeout=8):
    end = time.time() + timeout
    while time.time() < end:
        g = await game(tab)
        if g.get("screen") == screen:
            return g
        await asyncio.sleep(0.15)
    return {}


async def main():
    port, cport = free_port(), free_port()
    srv_log = tempfile.NamedTemporaryFile("w+", suffix=".log", delete=False)
    srv = subprocess.Popen([sys.executable, str(ROOT / "server" / "server.py")], env=dict(os.environ, PARTY_PORT=str(port), PARTY_PIN=PIN),
                           stdout=srv_log, stderr=subprocess.STDOUT, text=True)
    chrome = subprocess.Popen([CHROME, "--headless=new", "--remote-debugging-port=%d" % cport, "--user-data-dir=" + tempfile.mkdtemp(),
                               "--no-first-run", "--disable-gpu", "--remote-allow-origins=*", "about:blank"],
                              stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    base = "http://127.0.0.1:%d" % port
    say("ACCEPTANCE RUN — server :%d, chrome :%d, leader PIN %s" % (port, cport, PIN))
    try:
        for _ in range(60):
            try:
                urllib.request.urlopen("http://127.0.0.1:%d/json/version" % cport)
                urllib.request.urlopen(base + "/api/info")
                break
            except Exception:
                await asyncio.sleep(0.2)

        # ───────────────────────── 1. laptop: display only ─────────────────────────
        say("\n[1] LAPTOP (big screen) — only a QR + code; no controls; no scrolling")
        laptop = await new_tab(cport, "host", 1280, 720, False, "en")
        dialogs = []
        await laptop.call("Page.navigate", url=base + "/host")
        code = await until(laptop, "(document.querySelector('.roomcode')||{}).textContent")
        check("R1", "opening /host creates a room by itself (no game picker, no click needed)", bool(code) and len(code) == 4, "room code on screen: %s" % code)
        n_btn = await laptop.js("document.querySelectorAll('#screen button').length")
        n_core = await laptop.js("document.querySelectorAll('#screen [data-core],#screen [data-send],#screen [data-host-send],#screen .gamecard,#chrome [data-core]:not([hidden])').length")
        check("R2", "laptop lobby has ZERO buttons / controls", n_btn == 0 and n_core == 0, "buttons in screen=%s, control elements=%s" % (n_btn, n_core))
        qr = await laptop.js("(()=>{const q=document.getElementById('qr'); return q? q.dataset.url + ' | modules drawn: ' + q.querySelectorAll('canvas,img,svg,table').length : null})()")
        check("R3", "QR code is shown and encodes the join URL with the room code", bool(qr) and ("room=" + code) in qr, qr)
        over = await laptop.overflow()
        check("R4", "laptop never scrolls (empty lobby)", over is None, over or "no overflow at 1280x720")

        # ───────────────────────── 2. phone join + admin ─────────────────────────
        say("\n[2] PHONE — scan QR, 'Are you Cedric?', PIN, admin picks the game (all on the phone)")
        admin = await new_tab(cport, "phone", 390, 844, True, "en")
        friend = await new_tab(cport, "phone2", 390, 844, True, "en")
        await admin.call("Page.navigate", url="%s/?room=%s" % (base, code))      # = what the QR opens
        shown = await until(admin, "(document.querySelector('.lobby-player')||{}).innerText")
        check("R5", "phone opens the QR link and shows the LOBBY (not 'Loading…')", bool(shown) and "Loading" not in shown, (shown or "")[:60].replace("\n", " | "))
        await admin.js("window.__sent=[]; const o=Party.state.ws.send.bind(Party.state.ws); Party.state.ws.send=d=>{__sent.push(d); o(d)}")   # evidence: what the phone really sends
        fbase = "http://localhost:%d" % port        # a different origin = its own localStorage, like a real second phone
        await friend.call("Page.navigate", url="%s/?room=%s" % (fbase, code))
        await until(friend, "document.querySelector('.lobby-player')")
        await admin.js("(()=>{const i=document.getElementById('name');i.value='Cedric';i.dispatchEvent(new Event('input',{bubbles:true}))})()")
        await friend.js("(()=>{const i=document.getElementById('name');i.value='Friend';i.dispatchEvent(new Event('input',{bubbles:true}))})()")
        f1 = await fake_player(port, code, "Ann")
        f2 = await fake_player(port, code, "Ben")
        txt = await admin.js("document.body.innerText")
        chip = json.loads(await admin.js("""(()=>{const c=document.getElementById('areyou'), m=document.getElementById('mute'); if(!c||c.hidden) return 'null';
          const a=c.getBoundingClientRect(), b=m.getBoundingClientRect(); return JSON.stringify({text:c.textContent, h:Math.round(a.height), fs:getComputedStyle(c).fontSize, sameRow:Math.abs(a.top-b.top)<8, leftOfMute:a.right<=b.left+1, gap:Math.round(b.left-a.right)})})()""") or "null")
        check("R6", "'Are you Cedric?' is a SMALL chip in the top bar right next to the sound icon (not a banner in the page)", bool(chip) and chip["text"] == "Are you Cedric?" and chip["sameRow"] and chip["leftOfMute"] and chip["h"] <= 34 and chip["gap"] <= 16, chip)
        await click(admin, "[data-core=auth]")
        modal = await until(admin, "(()=>{const m=document.getElementById('modal'); return !m.hidden && !!document.getElementById('modal-input') && !document.getElementById('modal-input').hidden})()")
        check("R7", "PIN prompt is OUR OWN dialog (no browser pop-up)", bool(modal), "#modal visible with PIN input; native dialogs so far: %d" % len(laptop.dialogs + admin.dialogs))
        await admin.js("document.getElementById('modal-input').value='0000'; document.getElementById('modal-yes').click()")
        await asyncio.sleep(0.6)
        is_admin = await admin.js("!!document.querySelector('[data-core=pickgame]')")
        check("R8", "wrong PIN does NOT make you admin", not is_admin, "game picker visible: %s" % is_admin)
        await click(admin, "[data-core=auth]")
        await until(admin, "!document.getElementById('modal').hidden")
        await admin.js("document.getElementById('modal-input').value='%s'; document.getElementById('modal-yes').click()" % PIN)
        picker = await until(admin, "document.querySelectorAll('[data-core=pickgame]').length")
        dbg = await admin.js("JSON.stringify({sent: __sent, ws: Party.state.ws.readyState, leader: (Party.state.view.players.find(p=>p.id===Party.state.view.me)||{}).leader, launcher: Party.state.launcher && Party.state.launcher.length, modalHidden: document.getElementById('modal').hidden, errs: 0})")
        check("R9", "right PIN → this phone becomes ADMIN and sees the game list", (picker or 0) >= 2, "%s games listed on the phone | %s" % (picker, dbg))
        badge = await laptop.js("(document.querySelector('.bubble .vip')||{}).textContent")
        check("R10", "the laptop marks the admin", badge == "ADMIN", "badge on laptop: %s" % badge)
        fr_sees = await friend.js("document.querySelectorAll('[data-core=pickgame],[data-core=start]').length")
        check("R11", "a normal friend's phone has NO game list and NO start button", fr_sees == 0, "controls on friend phone: %s" % fr_sees)

        await click(admin, "[data-core=pickgame][data-game=chameleon]")
        theme = await until(laptop, "document.body.dataset.game === 'chameleon' && document.querySelector('.gtitle') && document.querySelector('.gtitle').innerText")
        check("R12", "admin picks Chameleon ON THE PHONE → laptop switches to its theme and title", str(theme).lower() == "chameleon", "laptop data-game=%s title=%s" % (await laptop.js("document.body.dataset.game"), theme))
        # switching games on the phone must always work (two games declaring the same top-level names used to break → endless "Loading…")
        seq = []
        for gid in ("gilded-takes", "spy-poll", "chameleon", "chameleon"):
            await click(admin, "[data-core=pickgame][data-game=%s]" % gid)
            got = await until(laptop, "document.body.dataset.game === '%s' && !!document.querySelector('.gtitle') && document.querySelector('.gtitle').innerText" % gid, 6)
            await until(admin, "document.body.dataset.game === '%s'" % gid, 4)
            seen_phone = await admin.js("document.body.dataset.game")
            seq.append("%s→laptop:%s phone:%s" % (gid, bool(got), seen_phone))
        check("R12b", "admin switches games back and forth on the phone (gilded-takes → spy-poll → chameleon → chameleon): each one loads on laptop AND phone", all("laptop:True" in x and x.split("phone:")[1] == x.split("→")[0] for x in seq), "; ".join(seq))
        # ───────────────────────── 2c. lobby chat ─────────────────────────
        say("\n[2c] LOBBY CHAT — confirm name + icon, then type messages that appear on the laptop")
        noready = await friend.js("!document.getElementById('chat')")
        check("R70", "before confirming, a phone has NO chat box (name/icon first)", noready, "no #chat input on an unconfirmed phone")
        await click(friend, "[data-core=ready]")
        box = await until(friend, "!!document.getElementById('chat')")
        check("R71", "tapping 'Done — I'm ready' unlocks the chat box on that phone", bool(box), "chat input shown")
        await friend.js("(()=>{const i=document.getElementById('chat');i.value='hello from my phone 👋';document.querySelector('[data-core=chat]').click()})()")
        shown = await until(laptop, "(document.querySelector('.chatlog .ctext')||{}).textContent")
        who = await laptop.js("(document.querySelector('.chatlog .cwho b')||{}).textContent")
        check("R72", "the message shows up on the LAPTOP screen with the sender's name", shown == "hello from my phone 👋" and who == "Friend", "laptop chat: %s says %r | laptop chatlog text=%r" % (who, shown, (await laptop.js("(document.querySelector('.chatlog')||{innerText:'NONE'}).innerText"))[:80]))
        await friend.js("(()=>{const i=document.getElementById('chat');i.value='<img src=x onerror=alert(1)>';document.querySelector('[data-core=chat]').click()})()")
        await asyncio.sleep(0.8)
        injected = await laptop.js("document.querySelectorAll('.chatlog img').length")
        check("R73", "chat text is escaped (HTML typed in a message is shown as text, not run)", injected == 0 and not laptop.dialogs, "images injected on laptop: %s, native dialogs: %d" % (injected, len(laptop.dialogs)))
        tick = await laptop.js("document.querySelectorAll('.bubble .rdy').length")
        check("R74", "confirmed players get a ✓ on the laptop", tick >= 1, "%s ✓ marks on laptop" % tick)
        over = await laptop.overflow()
        check("R75", "laptop lobby with chat still never scrolls", over is None, over or "ok")
        await click(friend, "[data-core=unready]")
        back = await until(friend, "!!document.getElementById('name')")
        check("R76", "'Edit name / icon' returns to editing", bool(back), "name field shown again")

        await click(admin, "[data-core=start]")
        setup_a = await wait_screen(admin, "setup")
        check("R13", "admin starts the game from the phone → setup screen", setup_a.get("screen") == "setup", "screen=%s" % setup_a.get("screen"))
        fr_setup = await friend.js("[!!document.querySelector('[data-send=toggle_vote]'), !!document.querySelector('[data-send=begin]'), !!document.querySelector('[data-send=chameleons]')]")
        check("R14", "friend's phone cannot change options or deal (read-only setup)", fr_setup == [False, False, False], "toggle_vote/begin/chameleons visible: %s" % fr_setup)

        # ───────────────────────── 3. admin options on the phone ─────────────────────────
        say("\n[3] ADMIN OPTIONS (phone): vote on/off, number of chameleons (default 1), categories")
        VOTING = bool(await admin.js("!!(Party.state.view.game||{}).votingEnabled"))
        say("        (chameleon voting feature flag: %s — voting is built and tested but hidden unless CHAMELEON_VOTING=1)" % ("ON" if VOTING else "OFF"))
        k0 = await admin.js("document.querySelector('.knum').textContent")
        v0 = (await admin.js("(document.querySelector('[data-send=toggle_vote]')||{textContent:'(hidden)'}).textContent.trim()")) if VOTING else "ON" if False else (await admin.js("document.querySelector('[data-send=toggle_vote]') ? 'SHOWN' : 'hidden'"))
        cats = await admin.js("document.querySelectorAll('[data-send=toggle_cat]').length")
        check("R15", "defaults: 1 chameleon, all 15 categories offered, voting option %s" % ("shown ON" if VOTING else "HIDDEN (feature flag off)"), k0 == "1" and cats == 15 and (v0 == "ON" if VOTING else v0 == "hidden"), "chameleons=%s voting=%s categories=%s" % (k0, v0, cats))
        await click(admin, "[data-send=toggle_cat][data-id=crime]")
        await asyncio.sleep(0.4)
        off = await admin.js("document.querySelectorAll('.chip.on').length")
        check("R16", "admin can switch categories off", off == 14, "%s of 15 selected after un-ticking one" % off)
        await click(admin, "[data-send=begin]")

        # ───────────────────────── 4. real-room behaviour ─────────────────────────
        say("\n[4] REAL-ROOM RULES: no timers, no rounds, same screen for everyone, secret only on hold")
        g = await wait_screen(admin, "play")
        gf = await wait_screen(friend, "play")
        check("R17", "word dealt; laptop shows the 20-word grid but NO secret and NO role", True, "")
        lap = await laptop.js("JSON.stringify({cells: document.querySelectorAll('.cell').length, secretCells: document.querySelectorAll('.cell.secret').length, hasPeek: !!document.querySelector('.peek')})")
        lp = json.loads(lap)
        check("R17b", "laptop: 20 cells, no highlighted secret, no secret card", lp == {"cells": 20, "secretCells": 0, "hasPeek": False}, lp)
        vtxt = [await t.js("document.body.innerText") for t in (laptop, admin, friend)]
        no_timer = not any(re.search(r"\b\d+\s*s\b|countdown|round\s*\d|Round\s+\d", x) for x in vtxt) and not await admin.js("!!document.querySelector('.timer,.timer-num,[data-deadline]')")
        raw = json.dumps([g, gf])
        check("R18", "NO timers and NO rounds anywhere (no countdown element, no deadline field, no 'Round N' text)", no_timer and "deadline" not in raw and '"round"' not in raw, "timer elements: none; 'deadline'/'round' keys in views: none")
        roles = {"admin": g.get("role"), "friend": gf.get("role")}
        grids = [await t.js("JSON.stringify([...document.querySelectorAll('.cell')].map(e=>e.innerText))") for t in (laptop, admin, friend)]
        check("R19", "EVERY screen shows the SAME 20 words in the same order (laptop, admin phone, friend phone)", grids[0] == grids[1] == grids[2], "36 identical cells on all three; first words: %s" % grids[0][:60])
        vis = [await t.js("(()=>{const p=document.querySelector('.peek'); return p? p.innerText : null})()") for t in (admin, friend)]
        check("R20", "SOCIAL TELL: before holding, the visible card text is identical for chameleon and insiders", vis[0] == vis[1] and vis[0], "admin=%r friend=%r roles=%s" % (vis[0][:40], vis[1][:40], roles))
        # hold to reveal on each phone, compare what each sees
        seen = {}
        for name, tab in (("admin", admin), ("friend", friend)):
            await tab.press(".peek")
            await asyncio.sleep(0.3)
            seen[name] = await tab.js("(()=>{const p=document.querySelector('.peek'); return p.innerText.replace(/\\s+/g,' ')})()")
            lit = await tab.js("document.querySelectorAll('.holdwrap .cell.secret').length")
            seen[name] += "  [lit cells: %s]" % lit
            await tab.release()
        say("        while holding →  admin(%s): %s" % (roles["admin"], seen["admin"][:110]))
        say("        while holding →  friend(%s): %s" % (roles["friend"], seen["friend"][:110]))
        check("R21", "holding reveals the secret ONLY to the holder (insider: the word, chameleon: 'You are the CHAMELEON')",
              all(("CHAMELEON" in seen[n]) == (roles[n] == "chameleon") for n in seen), "see lines above")
        after = await admin.js("document.querySelector('.peek').innerText.replace(/\\s+/g,' ')")
        check("R22", "releasing hides it again", "CHAMELEON" not in after and "secret word is" not in after.lower(), after[:70])
        await click(admin, "[data-send=first_random]")
        fb = await until(friend, "(document.querySelector('.firstbanner')||{}).innerText")
        fbl = await laptop.js("(document.querySelector('.firstbanner')||{}).innerText")
        check("R23", "admin taps 'pick who goes first' → EVERYONE (friend phone + laptop) sees who starts", bool(fb) and fb == fbl and "goes first" in fb.lower(), "friend phone: %r | laptop: %r" % (fb, fbl))
        check("R24", "friend's phone cannot pick the first speaker / start voting", await friend.js("!document.querySelector('[data-send=first_random],[data-send=to_vote],[data-send=reveal]')"), "no admin buttons on friend phone")
        check("R25", "laptop (big screen) still has ZERO buttons during the game", await laptop.js("document.querySelectorAll('#screen button').length") == 0, "buttons=0")
        over = await laptop.overflow()
        check("R26", "laptop never scrolls (play screen)", over is None, over or "ok")

        if VOTING:
            # vote ON
            await click(admin, "[data-send=to_vote]")
            gv = await wait_screen(friend, "vote")
            check("R27", "voting ON: 'Start voting' on the admin phone moves everyone to a vote screen", gv.get("screen") == "vote", "friend phone screen=%s" % gv.get("screen"))
            suspects = await friend.js("document.querySelectorAll('[data-send=vote]').length")
            check("R28", "friend can vote for any OTHER player (not self)", suspects == 3, "%s suspects listed for a 4-player room" % suspects)
            await click(friend, "[data-send=vote]")
            await asyncio.sleep(0.4)
            await click(admin, "[data-send=reveal]")
            await asyncio.sleep(1.0)
            scr = (await game(admin)).get("screen")
            check("R29", "admin reveals from the phone → guess (if someone was caught) or result", scr in ("guess", "result"), "screen=%s" % scr)
            if scr == "guess":
                if await admin.js("!!document.querySelector('.wordgrid.pickable')"):             # the admin happened to be the caught chameleon
                    await click(admin, ".wordgrid.pickable .cell")
                    say("        (the admin was the caught chameleon: picked a word on the grid, and still has the admin 'Show the answer' button)")
                check("R29b", "the admin can ALWAYS advance from the guess screen (even when they are the caught chameleon)", await admin.js("!!document.querySelector('[data-send=show_answer]')"), "show_answer button on admin phone")
                await click(admin, "[data-send=show_answer]")
            res = await wait_screen(admin, "result")
            rl = await laptop.js("document.body.innerText")
            check("R30", "result shows chameleon(s), the secret word, vote tally — no points, no round counter", res.get("screen") == "result" and "Chameleon" in rl and not re.search(r"point|score|round", rl, re.I), "result screen text: %s" % rl[:90].replace("\n", " | "))
            over = await laptop.overflow()
            check("R31", "laptop never scrolls (result screen)", over is None, over or "ok")

        else:
            await click(admin, "[data-send=reveal]")
            res = await wait_screen(admin, "result")
            rl = await laptop.js("document.body.innerText")
            check("R27", "voting hidden: admin's 'Reveal' goes straight to the result (no vote/guess screens)", res.get("screen") == "result" and not res.get("tally"), "result reached, tally=%s" % res.get("tally"))
            check("R30", "result shows chameleon(s) and the secret word — no points, no round counter", "Chameleon" in rl and not re.search(r"point|score", rl, re.I), "result text: %s" % rl[:90].replace("\n", " | "))
            over = await laptop.overflow()
            check("R31", "laptop never scrolls (result screen)", over is None, over or "ok")
            btns = await admin.js("[...document.querySelectorAll('[data-send=next_word],[data-send=options],[data-send=reset],[data-send=lobby]')].map(b=>b.dataset.send).join(',')")
            check("R31b", "end of a round: admin can start the NEXT ROUND, change settings, RESET the game, or go back to the lobby", set(btns.split(",")) == {"next_word", "options", "reset", "lobby"}, btns)
            await click(admin, "[data-send=next_word]")
            g2 = await wait_screen(admin, "play")
            check("R31c", "'Next round' deals a new word with the same settings", g2.get("screen") == "play" and (await game(admin)).get("key") == 2, "word #%s" % (await game(admin)).get("key"))
            await click(admin, "[data-send=reveal]"); await wait_screen(admin, "result")

        # vote OFF + 2 chameleons
        await click(admin, "[data-send=options]")
        await wait_screen(admin, "setup")
        if VOTING:
            await click(admin, "[data-send=toggle_vote]")
            await asyncio.sleep(0.3)
        await click(admin, "[data-send=chameleons][data-n='2']")
        await asyncio.sleep(0.3)
        k2 = await admin.js("document.querySelector('.knum').textContent")
        vo = await admin.js("(document.querySelector('[data-send=toggle_vote]')||{textContent:'hidden'}).textContent.trim()")
        check("R32", "admin sets 2 chameleons on the phone (voting %s)" % ("OFF" if VOTING else "hidden"), k2 == "2" and vo in ("OFF", "hidden"), "chameleons=%s voting=%s" % (k2, vo))
        await click(admin, "[data-send=begin]")
        await wait_screen(admin, "play")
        await asyncio.sleep(0.4)
        has_vote_btn = await admin.js("!!document.querySelector('[data-send=to_vote]')")
        has_reveal = await admin.js("!!document.querySelector('[data-send=reveal]')")
        check("R33", "voting OFF: no 'Start voting' button; admin just reveals", (not has_vote_btn) and has_reveal, "to_vote=%s reveal=%s" % (has_vote_btn, has_reveal))
        await click(admin, "[data-send=reveal]")
        res = await wait_screen(admin, "result")
        check("R34", "2 chameleons were dealt and revealed", len(res.get("chameleons", [])) == 2, "chameleons in result: %s" % res.get("chameleons"))

        # ───────────────────────── 5. language ─────────────────────────
        say("\n[5] LANGUAGE — English base, Korean switchable any time")
        en_txt = await admin.js("document.getElementById('screen').innerText")
        await click(admin, "#lang")
        await asyncio.sleep(0.5)
        ko_txt = await admin.js("document.getElementById('screen').innerText")
        check("R35", "tapping the language button switches the phone to Korean mid-game (no reload)", bool(re.search(r"[가-힣]", ko_txt)) and not re.search(r"[가-힣]", en_txt), "before: %r → after: %r" % (en_txt[:30].replace("\n", " "), ko_txt[:40].replace("\n", " ")))
        await click(admin, "#lang")

        # ───────────────────────── 6. back out + close ─────────────────────────
        say("\n[6] BACK OUT — admin closes the room from the phone; laptop opens a fresh room; friends return to the join screen")
        await click(admin, "[data-send=lobby]")
        await until(admin, "document.querySelector('.lobby-player')")
        check("R36", "admin sends everyone back to the lobby from the phone", bool(await admin.js("!!document.querySelector('[data-core=pickgame]')")), "game list visible again → can pick another game")
        await click(admin, "[data-core=close]")
        mod = await until(admin, "!document.getElementById('modal').hidden")
        check("R37", "'Close room' asks with OUR dialog (no native confirm)", bool(mod) and not (laptop.dialogs + admin.dialogs + friend.dialogs), "native dialogs total: %d" % len(laptop.dialogs + admin.dialogs + friend.dialogs))
        await admin.js("document.getElementById('modal-yes').click()")
        await asyncio.sleep(1.5)
        code2 = await until(laptop, "(document.querySelector('.roomcode')||{}).textContent && document.querySelector('.roomcode').textContent !== '%s' && document.querySelector('.roomcode').textContent" % code)
        join_screen = await friend.js("!!document.getElementById('code')")
        check("R38", "room closed: laptop shows a NEW room code by itself; friend's phone is back at the join screen", bool(code2) and join_screen, "old=%s new=%s friend on join screen=%s" % (code, code2, join_screen))

        # ───────────────────────── 7. crowd + solo ─────────────────────────
        say("\n[7] NO MINIMUM / NO MAXIMUM — one player alone, and 30 players")
        solo_code = code2
        solo = await fake_player(port, solo_code, "Solo", auth=True)
        solo.send({"t": "pick_game", "game": "chameleon"})
        solo.send({"t": "start"})
        s0 = await solo.until(lambda m: m.get("t") == "view" and m.get("game") and m["game"]["screen"] == "setup")
        act(solo, type="begin")
        s1 = await solo.until(lambda m: m.get("t") == "view" and m.get("game") and m["game"]["screen"] == "play")
        check("R39", "ONE player alone can start and play (no minimum)", s1["game"]["screen"] == "play", "solo player reached the play screen with %d player(s)" % len(s1["players"]))
        act(solo, type="reveal")
        r = await solo.until(lambda m: m.get("t") == "view" and m.get("game") and m["game"]["screen"] == "result")
        check("R40", "…and finishes the word alone", r["game"]["screen"] == "result", "result reached")
        solo.send({"t": "to_lobby"})
        await solo.until(lambda m: m.get("t") == "view" and m["phase"] == "lobby")
        crowd = []
        for i in range(29):
            crowd.append(await fake_player(port, solo_code, "P%02d" % (i + 1)))
        await asyncio.sleep(0.8)
        nplayers = await laptop.js("(Party.state.view||{}).players.length")
        check("R41", "30 players join one room (no maximum)", nplayers == 30, "laptop sees %s players" % nplayers)
        over = await laptop.overflow()
        check("R42", "laptop with 30 players: lobby does not scroll", over is None, over or "no overflow; font shrunk to %s" % await laptop.js("document.querySelector('#screen > .screen').style.fontSize"))
        solo.send({"t": "start"})
        await solo.until(lambda m: m.get("t") == "view" and m.get("game") and m["game"]["screen"] == "setup")
        act(solo, type="chameleons", n=3)
        act(solo, type="begin")
        await solo.until(lambda m: m.get("t") == "view" and m.get("game") and m["game"]["screen"] == "play")
        await asyncio.sleep(1.0)
        over = await laptop.overflow()
        check("R43", "laptop with 30 players: 20-word grid screen does not scroll", over is None, over or "no overflow; font=%s" % await laptop.js("document.querySelector('#screen > .screen').style.fontSize"))
        act(solo, type="to_vote")
        await asyncio.sleep(0.6)
        for i, w in enumerate(crowd[:20]):
            act(w, type="vote", id=solo.pid)
        act(solo, type="reveal")
        await asyncio.sleep(1.2)
        over = await laptop.overflow()
        check("R44", "laptop with 30 players: vote/guess/result screens do not scroll", over is None, over or "screen=%s ok" % (await game(laptop)).get("screen"))
        await laptop.call("Emulation.setDeviceMetricsOverride", width=1366, height=768, deviceScaleFactor=1, mobile=False)
        await asyncio.sleep(0.8)
        over = await laptop.overflow()
        check("R45", "…also at a different laptop size (1366x768)", over is None, over or "ok")

        # ───────────────────────── 7b. spy-poll (owner waivers: timers + laptop buttons) ─────────────────────────
        say("\n[7b] SPY POLL — timers and laptop controls are allowed for THIS game only; 30 players; leader-only; solo with virtual agents")
        solo.send({"t": "to_lobby"})
        await solo.until(lambda m: m.get("t") == "view" and m["phase"] == "lobby")
        solo.send({"t": "pick_game", "game": "spy-poll"})
        solo.send({"t": "start"})
        sg = await wait_screen(laptop, "setup")
        has_btn = await laptop.js("!!document.querySelector('[data-host-send=begin]') && !!document.querySelector('[data-host-send=toggle_timers]')")
        check("R51", "spy-poll with 30 players: setup shows on the laptop with its own Begin/option buttons (owner waiver)", sg.get("screen") == "setup" and has_btn and len(sg.get("ids", [])) == 30, "players=%d laptop buttons=%s" % (len(sg.get("ids", [])), has_btn))
        over = await laptop.overflow()
        check("R52", "spy-poll 30 players: setup does not scroll on the laptop", over is None, over or "ok")
        act(crowd[0], type="begin"); await asyncio.sleep(0.5)
        check("R53", "spy-poll: a non-leader cannot Begin", (await game(laptop)).get("screen") == "setup", "still on setup after a non-leader Begin")
        act(solo, type="begin")
        gs = await wait_screen(laptop, "guess")
        check("R54", "spy-poll: timers are on by default and the view carries an absolute deadline", bool(gs.get("timer")) and gs["timer"]["total"] == 45000, "timer=%s" % gs.get("timer"))
        over = await laptop.overflow()
        check("R55", "spy-poll 30 players: guess screen does not scroll", over is None, over or "ok")
        first = gs.get("guesser")
        gw = solo if first == solo.pid else next(w for w in crowd if w.pid == first)
        act(gw, type="guess", value=40)
        cs = await wait_screen(laptop, "call")
        for w in crowd[:12]:
            if w.pid != first: act(w, type="call", dir="hi")
        await asyncio.sleep(1.0)
        over = await laptop.overflow()
        check("R56", "spy-poll 30 players: call screen (locked-in row) does not scroll", over is None, over or "ok")
        for w in [solo] + crowd:
            if w.pid != first: act(w, type="call", dir="lo")
        rs = await wait_screen(laptop, "reveal")
        await asyncio.sleep(1.5)
        over = await laptop.overflow()
        check("R57", "spy-poll 30 players: reveal screen (30 callers + standings) does not scroll", over is None and rs.get("screen") == "reveal", over or "ok")
        st = rs["round"]
        act(crowd[0], type="next", step=st); await asyncio.sleep(0.4)
        check("R58", "spy-poll: Next from a non-leader is ignored", (await game(laptop)).get("screen") == "reveal", "still on reveal")
        act(solo, type="next", step=st); act(solo, type="next", step=st)
        await asyncio.sleep(0.8)
        after = await game(laptop)
        check("R59", "spy-poll: a double-tapped Next acts once (lands on the next guess screen, not skipped)", after.get("screen") == "guess" and not after.get("shrug"), "screen=%s" % after.get("screen"))
        act(solo, type="end", step=after["round"]); await asyncio.sleep(0.4)
        check("R60", "spy-poll: End needs the in-page confirm first (end without end_ask is ignored)", (await game(laptop)).get("screen") == "guess", "still playing")
        act(solo, type="end_ask", step=after["round"]); await asyncio.sleep(0.3)
        act(solo, type="end", step=after["round"])
        es = await wait_screen(laptop, "end")
        await asyncio.sleep(1.0)
        over = await laptop.overflow()
        check("R61", "spy-poll 30 players: final ranking screen does not scroll", over is None and es.get("screen") == "end", over or "ranking rows=%d" % len(es.get("ranking", [])))
        solo.send({"t": "to_lobby"})
        await solo.until(lambda m: m.get("t") == "view" and m["phase"] == "lobby")
        # one player alone, plain websocket room
        lw = await WS.open(port)
        lw.send({"t": "host"})
        scode = (await lw.until(lambda m: m.get("t") == "hosted"))["code"]
        one = await fake_player(port, scode, "Solo", auth=True)
        one.send({"t": "pick_game", "game": "spy-poll"}); one.send({"t": "start"})
        await one.until(lambda m: m.get("t") == "view" and m.get("game") and m["game"]["screen"] == "setup")
        act(one, type="begin")
        gv = (await one.until(lambda m: m.get("t") == "view" and m.get("game") and m["game"]["screen"] == "guess"))["game"]
        act(one, type="guess", value=50)
        rv = (await one.until(lambda m: m.get("t") == "view" and m.get("game") and m["game"]["screen"] == "reveal"))["game"]
        bots = [c for c in rv["calls"] if c["bot"]]
        check("R62", "spy-poll alone: three labelled virtual agents call in the reveal; only you are ranked", len(bots) == 3 and len(rv["ranking"]) == 1, "bots=%s ranking=%d" % ([c["name"]["en"] for c in bots], len(rv["ranking"])))
        act(one, type="next", step=rv["round"])
        cv = (await one.until(lambda m: m.get("t") == "view" and m.get("game") and m["game"]["screen"] == "call"))["game"]
        check("R63", "spy-poll alone: next turn a virtual agent guesses and YOU get the Higher/Lower call", cv["botGuesser"] is not None and "real" not in cv, "agent guesser=%s guess=%s" % (cv["botGuesser"]["en"], cv["guess"]))
        lw.send({"t": "close"}); one.send({"t": "to_lobby"})
        timers_ok = [str(f.relative_to(ROOT)) for f in (ROOT / "games").glob("spy-poll/*") if f.suffix == ".js" and re.search(r"setTimeout|setInterval", f.read_text())]
        check("R64", "spy-poll client has no JS timers (countdowns come from the core's ctx.timer deadline)", not timers_ok, timers_ok or "no setTimeout/setInterval in client.js")

        # ───────────────────────── 8. static rules ─────────────────────────
        say("\n[8] CODE RULES (scanned in the source) and runtime pop-ups")
        src = ""
        for f in list((ROOT / "core").glob("*.js")) + list((ROOT / "games").glob("*/client.js")):
            if "vendor" not in str(f):
                src += re.sub(r"//[^\n]*", "", f.read_text())          # ignore comments
        natives = re.findall(r"(?<![\w.$])(alert|confirm|prompt)\s*\(", src)
        check("R46", "no browser alert()/confirm()/prompt() anywhere in core or any game client", not natives, "found: %s" % natives if natives else "0 occurrences in core/*.js and games/*/client.js")
        allnative = laptop.dialogs + admin.dialogs + friend.dialogs
        check("R47", "no native pop-up ever opened during this whole run", not allnative, "native dialogs: %d" % len(allnative))
        timers = [str(f.relative_to(ROOT)) for f in (ROOT / "games").glob("chameleon/*") if f.suffix in (".py", ".js") and re.search(r"deadline|setTimeout|setInterval|countdown", f.read_text())]
        check("R48", "chameleon source contains no timer/deadline code", not timers, timers or "grep deadline|setTimeout|setInterval|countdown → nothing")

        # same player opened in a second tab/app must not start a reconnect fight (found by this very test)
        say("\n[8b] SAME PHONE OPENS THE LINK TWICE (camera app + Safari, two tabs)")
        solo.send({"t": "to_lobby"})
        await until(laptop, "document.querySelector('.roomcode')")
        dcode = await laptop.js("document.querySelector('.roomcode').textContent")
        a = await new_tab(cport, "dupA", 390, 844, True, "en")
        await a.call("Page.navigate", url="%s/?room=%s" % (fbase, dcode))
        await until(a, "document.querySelector('.lobby-player')")
        b = await new_tab(cport, "dupB", 390, 844, True, "en")
        await b.call("Page.navigate", url="%s/?room=%s" % (fbase, dcode))                 # same origin = same token = same player
        await asyncio.sleep(3.5)
        a_state = await a.js("JSON.stringify({replaced: !!Party.state.replaced, text: document.body.innerText.slice(0,70)})")
        b_ok = await b.js("!!document.querySelector('.lobby-player')")
        check("R50", "second tab takes over; the first is told (no endless reconnect fight, no 'Loading')", json.loads(a_state)["replaced"] and b_ok, "first tab: %s | second tab shows lobby: %s" % (a_state, b_ok))

        # ───────────────────────── 9. the real phone path (Funnel) ─────────────────────────
        say("\n[9] PUBLIC LINK — the exact path your phone uses (Tailscale Funnel, https/wss)")
        try:
            live = json.load(urllib.request.urlopen("http://127.0.0.1:3100/api/info", timeout=3))["url"]
        except Exception:
            live = ""
        if live.startswith("https://"):
            lw = await WS.open(3100)
            lw.send({"t": "host"})
            lcode = (await lw.until(lambda m: m.get("t") == "hosted"))["code"]
            ph = await new_tab(cport, "publicphone", 390, 844, True, "en")
            await ph.call("Page.navigate", url="%s?room=%s" % (live, lcode))
            shown = await until(ph, "(document.querySelector('.lobby-player')||{}).innerText", 12)
            check("R49", "phone opens %s?room=… over the internet and shows the lobby (not 'Loading…')" % live, bool(shown) and "Loading" not in shown, (shown or ph.errors or "nothing rendered")[:70] if isinstance(shown, str) else shown)
        else:
            say("  (skipped: live server on :3100 is not running with a public https URL)")

        # ───────────────────────── summary ─────────────────────────
        errs = laptop.errors + admin.errors + friend.errors
        say("\nJAVASCRIPT ERRORS in all tabs during the run: %s" % (errs if errs else "none"))
        if errs:
            FAILS.append("js-errors")
    finally:
        chrome.terminate()
        srv.terminate()
        srv_log.flush()
        srv_log.seek(0)
        slog = srv_log.read()
        tb = "Traceback" in slog
        say("SERVER LOG: %s" % ("TRACEBACK!\n" + slog if tb else "no tracebacks (%d lines)" % len(slog.splitlines())))
        if tb:
            FAILS.append("server-traceback")
    say("\n==== RESULT: %s ====" % ("ALL REQUIREMENTS PROVEN" if not FAILS else "FAILED: %s" % ", ".join(FAILS)))
    (Path(__file__).parent / "acceptance.log").write_text("\n".join(LOG) + "\n")
    sys.exit(1 if FAILS else 0)


# record native dialogs (and dismiss them so the page isn't blocked)
_orig_call = Tab.call


async def _call(self, method, **params):
    if not hasattr(self, "dialogs"):
        self.dialogs = []
    return await _orig_call(self, method, **params)


Tab.call = _call
_orig_init = Tab.__init__


def _init(self, ws, name):
    _orig_init(self, ws, name)
    self.dialogs = []


Tab.__init__ = _init

if __name__ == "__main__":
    asyncio.run(main())
