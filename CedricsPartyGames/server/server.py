#!/usr/bin/env python3
"""Cedric's Party Games — room server. Python standard library only.

    python3 server/server.py            # http://localhost:3100/host
    PARTY_PORT=4000 python3 server/server.py

What it does (and nothing more):
  * serves the static client (core/, games/<id>/client.js|theme.css|assets|sounds, sounds/)
  * speaks WebSocket at /ws: rooms, players, lobby, reconnect
  * runs each room's Game (games/<id>/game.py) and pushes a fresh `view` to every
    screen after every change.  Clients are pure functions of the last view.

Games are loaded fresh from disk every time a room is created, so you can edit
game.py and just create a new room — no server restart needed.
"""
import asyncio, base64, hashlib, importlib.util, json, mimetypes, os, random
import re, struct, sys, time, traceback
from pathlib import Path
from urllib.parse import unquote

ROOT = Path(__file__).resolve().parent.parent
CORE = ROOT / "core"
GAMES = ROOT / "games"
SOUNDS = ROOT / "sounds"
PORT = int(os.environ.get("PARTY_PORT", "3100"))
PUBLIC_URL = os.environ.get("PUBLIC_URL", "")      # what phones should open (start.command sets it)
PUBLIC_URL_FILE = ROOT / ".public_url"             # start.command writes the *verified* address here (read on every request)


def current_public_url():
    try:
        return PUBLIC_URL_FILE.read_text().strip() or PUBLIC_URL
    except Exception:
        return PUBLIC_URL
GUID = "258EAFA5-E914-47DA-95CA-C5AB0DC85B11"
CODE_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ"           # no I / O
N_AVATARS = 24
N_COLORS = 12
MAX_NAME = 14
MAX_FRAME = 16 * 1024
AUDIO_EXT = {".mp3", ".ogg", ".wav", ".m4a"}
ROOM_IDLE_SECONDS = 30 * 60
CONFIG_FILE = ROOT / "config.local.json"          # gitignored; holds the leader PIN ("Are you Cedric?")


def load_pin():
    """PIN that turns a phone into the room's leader. Order: PARTY_PIN env, config.local.json, else generate one."""
    pin = os.environ.get("PARTY_PIN", "").strip()
    if pin:
        return pin
    try:
        pin = str(json.loads(CONFIG_FILE.read_text()).get("pin", "")).strip()
    except Exception:
        pin = ""
    if not pin:
        pin = "%04d" % random.randrange(10000)
        CONFIG_FILE.write_text(json.dumps({"pin": pin}, indent=1) + "\n")
    return pin


PIN = None           # filled in main()
PIN_FAILS = {}       # connection id -> (count, locked_until)
TICK_SECONDS = 0.25


def now_ms():
    return int(time.time() * 1000)


def log(*a):
    print(time.strftime("%H:%M:%S"), *a, flush=True)


# ───────────────────────────── WebSocket plumbing ─────────────────────────────

class Conn:
    """One WebSocket connection. send() is synchronous (buffered); never awaits."""

    def __init__(self, reader, writer):
        self.r, self.w = reader, writer
        self.room = None
        self.player = None      # Player, if this is a phone
        self.is_host = False
        self.closed = False

    def send(self, obj):
        if self.closed:
            return
        data = json.dumps(obj, ensure_ascii=False, separators=(",", ":")).encode()
        n = len(data)
        if n < 126:
            head = b"\x81" + bytes([n])
        elif n < 65536:
            head = b"\x81\x7e" + struct.pack(">H", n)
        else:
            head = b"\x81\x7f" + struct.pack(">Q", n)
        try:
            self.w.write(head + data)
            if self.w.transport.get_write_buffer_size() > 2_000_000:   # dead/slow client
                self.close()
        except Exception:
            self.close()

    def close(self):
        self.closed = True
        try:
            self.w.close()
        except Exception:
            pass

    async def recv(self):
        """Next text message, or None when the socket closes."""
        buf = b""
        while True:
            h = await self.r.readexactly(2)
            fin, op, ln = h[0] & 0x80, h[0] & 0x0F, h[1] & 0x7F
            if ln == 126:
                ln = struct.unpack(">H", await self.r.readexactly(2))[0]
            elif ln == 127:
                ln = struct.unpack(">Q", await self.r.readexactly(8))[0]
            if ln > MAX_FRAME:
                return None
            mask = await self.r.readexactly(4) if h[1] & 0x80 else b"\0\0\0\0"
            body = bytearray(await self.r.readexactly(ln))
            for i in range(ln):
                body[i] ^= mask[i & 3]
            if op == 8:
                return None
            if op == 9:                                   # ping -> pong
                self.w.write(b"\x8a" + bytes([min(len(body), 125)]) + bytes(body[:125]))
                continue
            if op == 10:
                continue
            buf += bytes(body)
            if len(buf) > MAX_FRAME:
                return None
            if fin:
                return buf.decode("utf-8", "replace")


# ───────────────────────────── rooms & players ─────────────────────────────

class Player:
    def __init__(self, pid, token, avatar, color):
        self.id = pid            # public (appears in views)
        self.token = token       # secret (stays on the phone)
        self.name = ""
        self.avatar = avatar
        self.color = color
        self.conn = None
        self.ready = False       # confirmed name + icon (unlocks the lobby chat)
        self.chat_times = []
        self.leader = False      # became leader by entering the PIN ("Are you Cedric?")
        self.joined_at = now_ms()
        self.honk_times = []

    @property
    def connected(self):
        return self.conn is not None and not self.conn.closed

    def public(self):
        return {"id": self.id, "name": self.name, "avatar": self.avatar, "color": self.color,
                "connected": self.connected, "leader": self.leader, "ready": self.ready}


class Room:
    """Everything a Game may touch is documented in RULEBOOK.md §5."""

    def __init__(self, code, game_id, mod):
        self.code = code
        self.game_id = game_id           # None until the admin picks a game on their phone
        self.mod = mod
        self.meta = mod.META if mod else {}
        self.phase = "lobby"             # "lobby" | "game"
        self.players = {}                # id -> Player, in join order
        self.hosts = set()               # big-screen connections (zero or more)
        self.host_token = "".join(random.choice("abcdefghijklmnopqrstuvwxyz0123456789") for _ in range(16))
        self.game = None
        self.chat = []                   # last lobby chat messages [{id, text}] (shown on the big screen)
        self.error = None                # last game exception (shown on the big screen)
        self.created = now_ms()
        self.last_active = time.time()
        self._seq = 0

    # ── helpers for games ──
    def now(self):
        return now_ms()

    def active_players(self):
        """All players in join order (connected or not)."""
        return list(self.players.values())

    def connected_players(self):
        return [p for p in self.players.values() if p.connected]

    def sfx(self, name, to=None):
        """Play a named sound on every screen, or only on player `to` (id or Player)."""
        msg = {"t": "sfx", "name": name}
        if to is None:
            for c in self.hosts:
                c.send(msg)
            for p in self.players.values():
                if p.conn:
                    p.conn.send(msg)
        else:
            p = to if isinstance(to, Player) else self.players.get(to)
            if p and p.conn:
                p.conn.send(msg)

    def to_lobby(self):
        self.game = None
        self.phase = "lobby"
        self.error = None

    # ── internals ──
    def is_leader(self, player):
        """True for a phone that entered the PIN. (The laptop's big screen has its own `on_host_action` controls.)"""
        p = player if isinstance(player, Player) else self.players.get(player)
        return bool(p and p.leader)

    def vip_id(self):
        """First leader's id (kept for old games); None if nobody entered the PIN."""
        return next((p.id for p in self.players.values() if p.leader), None)

    def view(self, viewer):
        v = {"t": "view", "code": self.code, "game_id": self.game_id, "phase": self.phase,
             "min": self.meta.get("min_players", 1),
             "players": [p.public() for p in self.players.values()],
             "me": viewer.id if viewer else None, "now": now_ms(), "game": None,
             "title": self.meta.get("title"), "chat": self.chat[-14:]}
        if self.phase == "game" and self.game:
            try:
                v["game"] = self.game.view(viewer)
            except Exception:
                self.fail()
        if self.error and viewer is None:
            v["error"] = self.error
        return v

    def push(self):
        for c in list(self.hosts):
            c.send(self.view(None))
        for p in self.players.values():
            if p.conn:
                p.conn.send(self.view(p))

    def fail(self):
        tb = traceback.format_exc()
        sys.stderr.write(tb)
        self.error = tb.strip().splitlines()[-1][:200]

    def call(self, fn, *args):
        """Run game code; a crash is logged and shown on the big screen, never fatal."""
        try:
            return fn(*args)
        except Exception:
            self.fail()
            return None

    def alive(self):
        return bool(self.hosts) or any(p.connected for p in self.players.values())


rooms = {}


def game_dirs():
    out = []
    for d in sorted(GAMES.iterdir()) if GAMES.exists() else []:
        if d.is_dir() and not d.name.startswith(("_", ".")) and (d / "game.py").is_file():
            out.append(d.name)
    return out


def load_game_module(gid):
    path = GAMES / gid / "game.py"
    spec = importlib.util.spec_from_file_location("party_game_" + re.sub(r"\W", "_", gid), path)
    mod = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(mod)
    if not hasattr(mod, "META") or not hasattr(mod, "Game"):
        raise ValueError("game.py must define META and class Game")
    if mod.META.get("id") != gid:
        raise ValueError("META['id'] must equal the folder name %r" % gid)
    return mod


def games_listing():
    out = []
    for gid in game_dirs():
        try:
            out.append(load_game_module(gid).META)
        except Exception as e:
            out.append({"id": gid, "error": "%s: %s" % (type(e).__name__, e)})
    return out


def new_code():
    while True:
        code = "".join(random.choice(CODE_ALPHABET) for _ in range(4))
        if code not in rooms:
            return code


def clean_name(s):
    return re.sub(r"\s+", " ", str(s or "")).strip()[:MAX_NAME]


# ───────────────────────────── message handling ─────────────────────────────

def err(conn, key):
    conn.send({"t": "error", "key": key})


def on_message(c, m):
    t = m.get("t")
    if t == "host":
        gid = m.get("game")
        mod = None
        if gid:                                              # optional: old clients/tests may pre-pick a game
            if gid not in game_dirs():
                return err(c, "err.nogame")
            try:
                mod = load_game_module(gid)
            except Exception:
                traceback.print_exc()
                return err(c, "err.badgame")
        room = Room(new_code(), gid or None, mod)
        rooms[room.code] = room
        room.hosts.add(c)
        c.room, c.is_host = room, True
        log("room", room.code, "created for", gid)
        c.send({"t": "hosted", "code": room.code, "hostToken": room.host_token})
        room.push()
        return
    if t == "host_resume":
        room = rooms.get(str(m.get("code", "")).upper())
        if not room or room.host_token != m.get("hostToken"):
            return err(c, "err.badcode")
        room.hosts.add(c)
        c.room, c.is_host = room, True
        c.send({"t": "hosted", "code": room.code, "hostToken": room.host_token})
        room.push()
        return
    if t == "join":
        room = rooms.get(str(m.get("code", "")).upper().strip())
        if not room:
            return err(c, "err.badcode")
        token = str(m.get("token") or "")
        player = next((p for p in room.players.values() if token and p.token == token), None)
        if player:                                           # reconnect
            if player.conn and player.conn is not c:      # same player opened in a 2nd tab/app: the new one wins
                player.conn.send({"t": "replaced"})
                player.conn.close()
        else:
            if room.phase != "lobby" and not room.meta.get("late_join", False):
                return err(c, "err.started")
            room._seq += 1
            taken = {p.avatar for p in room.players.values()}
            free = [a for a in range(N_AVATARS) if a not in taken] or list(range(N_AVATARS))   # >24 players: icons repeat
            token = "".join(random.choice("abcdefghijklmnopqrstuvwxyz0123456789") for _ in range(16))
            player = Player("p%d" % room._seq, token, random.choice(free), (room._seq - 1) % N_COLORS)
            player.name = clean_name(m.get("name"))
            room.players[player.id] = player
            if room.phase == "game" and room.game and hasattr(room.game, "on_join"):
                room.call(room.game.on_join, player)
        player.conn = c
        c.room, c.player = room, player
        c.send({"t": "joined", "code": room.code, "token": player.token, "pid": player.id})
        room.push()
        return

    room = c.room
    if not room:
        return
    room.last_active = time.time()
    p = c.player

    if t == "profile" and p and room.phase == "lobby":
        if "name" in m:
            p.name = clean_name(m["name"])
        a = m.get("avatar")
        if isinstance(a, int) and 0 <= a < N_AVATARS and not any(q.avatar == a and q is not p for q in room.players.values()):
            p.avatar = a
        room.push()
    elif t == "auth" and p:                                     # "Are you Cedric?" → PIN
        n, until = PIN_FAILS.get(p.id, (0, 0))
        if time.time() < until:
            return err(c, "err.pinlock")
        if str(m.get("pin", "")).strip() == PIN:
            p.leader = True
            PIN_FAILS.pop(p.id, None)
            c.send({"t": "authed"})
            log("room", room.code, "leader:", p.name or p.id)
            room.push()
        else:
            n += 1
            PIN_FAILS[p.id] = (n, time.time() + 30 if n >= 5 else 0)
            err(c, "err.pin")
    elif t == "ready" and p and room.phase == "lobby":          # confirm name + icon (or go back to editing)
        p.ready = bool(m.get("v")) and bool(p.name)
        room.push()
    elif t == "chat" and p and p.ready and room.phase == "lobby":
        text = m.get("text")
        now = time.time()
        p.chat_times = [x for x in p.chat_times if now - x < 5.0]
        if isinstance(text, str) and text.strip() and len(p.chat_times) < 4:
            p.chat_times.append(now)
            room.chat.append({"id": p.id, "text": re.sub(r"\s+", " ", text).strip()[:80]})
            del room.chat[:-40]
            room.push()
    elif t == "honk" and p and room.phase == "lobby":
        now = time.time()
        p.honk_times = [x for x in p.honk_times if now - x < 1.0]
        if len(p.honk_times) < 5:
            p.honk_times.append(now)
            for h in room.hosts:
                h.send({"t": "honk", "pid": p.id, "sound": str(m.get("sound", ""))[:20]})
    elif t == "pick_game" and room.phase == "lobby":          # the admin chooses the game on their phone
        if not (c.is_host or room.is_leader(p)):
            return
        gid = m.get("game")
        if gid not in game_dirs():
            return err(c, "err.nogame")
        try:
            room.mod = load_game_module(gid)
        except Exception:
            traceback.print_exc()
            return err(c, "err.badgame")
        room.game_id, room.meta = gid, room.mod.META
        log("room", room.code, "game:", gid)
        room.push()
    elif t == "start" and room.phase == "lobby":
        if not (c.is_host or room.is_leader(p)):
            return
        if not room.game_id:
            return err(c, "err.nogamepicked")
        ready = [q for q in room.players.values() if q.connected and q.name]
        if len(ready) < room.meta.get("min_players", 1):
            return err(c, "err.needplayers")
        for q in list(room.players.values()):                # drop nameless/ghost players
            if not q.name:
                q.name = "Player %s" % q.id[1:]
        try:
            room.mod = load_game_module(room.game_id)         # pick up edits made since room creation
            room.meta = room.mod.META
            room.game = room.mod.Game(room)
        except Exception:
            room.fail()
            room.push()
            return
        room.phase = "game"
        room.error = None
        room.call(room.game.start)
        room.push()
    elif t == "act" and p and room.phase == "game" and room.game:
        a = m.get("a")
        if isinstance(a, dict):
            room.call(room.game.on_action, p, a)
            room.push()
    elif t == "host_act" and c.is_host and room.phase == "game" and room.game:
        a = m.get("a")
        if isinstance(a, dict) and hasattr(room.game, "on_host_action"):
            room.call(room.game.on_host_action, a)
            room.push()
    elif t == "close" and (c.is_host or room.is_leader(p)):                          # host backs out: close the room, everyone returns to the start
        for q in room.players.values():
            if q.conn:
                q.conn.send({"t": "closed"})
                q.conn.room = q.conn.player = None
        for h in list(room.hosts):
            h.send({"t": "closed"})
            h.room = None
            h.is_host = False
        rooms.pop(room.code, None)
        log("room", room.code, "closed by host")
    elif t == "leave" and p and room.phase == "lobby":        # a phone leaves the lobby
        room.players.pop(p.id, None)
        c.send({"t": "left"})
        c.room = c.player = None
        room.push()
    elif t == "to_lobby" and room.phase == "game":
        if c.is_host or room.is_leader(p):
            room.to_lobby()
            room.push()


async def handle_ws(c):
    try:
        while True:
            raw = await c.recv()
            if raw is None:
                break
            try:
                m = json.loads(raw)
            except ValueError:
                continue
            if isinstance(m, dict):
                try:
                    on_message(c, m)
                except Exception:
                    traceback.print_exc()
    except (asyncio.IncompleteReadError, ConnectionError, OSError):
        pass
    finally:
        c.close()
        room = c.room
        if room:
            if c.is_host:
                room.hosts.discard(c)
            elif c.player and c.player.conn is c:
                c.player.conn = None
                if room.phase == "game" and room.game and hasattr(room.game, "on_leave"):
                    room.call(room.game.on_leave, c.player)
                room.push()


async def ticker():
    while True:
        await asyncio.sleep(TICK_SECONDS)
        now = now_ms()
        for code, room in list(rooms.items()):
            if room.alive():
                room.last_active = time.time()
            elif time.time() - room.last_active > ROOM_IDLE_SECONDS:
                del rooms[code]
                log("room", code, "closed (idle)")
                continue
            if room.phase == "game" and room.game and hasattr(room.game, "tick"):
                if room.call(room.game.tick, now):
                    room.push()


# ───────────────────────────── HTTP ─────────────────────────────

def static_file(path):
    parts = [x for x in unquote(path.split("?", 1)[0]).split("/") if x]
    if not parts or parts == ["host"]:
        return CORE / "index.html"
    if any(x.startswith(".") or x == ".." for x in parts):
        return None
    head = parts[0]
    if head == "core" and len(parts) > 1:
        base, rest = CORE, parts[1:]
    elif head == "sounds" and len(parts) > 1:
        base, rest = SOUNDS, parts[1:]
    elif head == "games" and len(parts) >= 3:
        base, rest = GAMES / parts[1], parts[2:]
        # only the public client files of a game; game.py, data/, *.json etc. stay private
        if rest[0] not in ("client.js", "theme.css", "assets", "sounds"):
            return None
    else:
        return None
    f = base.joinpath(*rest).resolve()
    try:
        f.relative_to(base.resolve())
    except ValueError:
        return None
    return f if f.is_file() and f.suffix not in (".py", ".pyc") else None


def sounds_index():
    def scan(d, prefix):
        out = {}
        if d.is_dir():
            for f in sorted(d.iterdir()):
                if f.is_file() and f.suffix.lower() in AUDIO_EXT and not f.name.startswith("."):
                    out[f.stem] = "%s/%s" % (prefix, f.name)
        return out
    games = {gid: scan(GAMES / gid / "sounds", "/games/%s/sounds" % gid) for gid in game_dirs()}
    return {"global": scan(SOUNDS, "/sounds"), "games": games}


def respond(writer, status, body, ctype="text/plain; charset=utf-8", extra=""):
    writer.write(("HTTP/1.1 %s\r\nContent-Type: %s\r\nContent-Length: %d\r\n%s\r\n"
                  % (status, ctype, len(body), extra)).encode() + body)


async def handle(reader, writer):
    try:
        while True:
            try:
                head = await asyncio.wait_for(reader.readuntil(b"\r\n\r\n"), 60)
            except Exception:
                break
            lines = head.decode("latin1").split("\r\n")
            try:
                method, target, _ = lines[0].split(" ", 2)
            except ValueError:
                break
            hdr = {k.lower(): v.strip() for k, v in (l.split(":", 1) for l in lines[1:] if ":" in l)}
            path = target.split("?", 1)[0]
            if hdr.get("upgrade", "").lower() == "websocket" and path.endswith("/ws"):
                acc = base64.b64encode(hashlib.sha1((hdr.get("sec-websocket-key", "") + GUID).encode()).digest()).decode()
                writer.write(("HTTP/1.1 101 Switching Protocols\r\nUpgrade: websocket\r\n"
                              "Connection: Upgrade\r\nSec-WebSocket-Accept: %s\r\n\r\n" % acc).encode())
                await writer.drain()
                await handle_ws(Conn(reader, writer))
                return
            if method not in ("GET", "HEAD"):
                respond(writer, "405 Method Not Allowed", b"")
            elif path == "/api/games":
                respond(writer, "200 OK", json.dumps(games_listing(), ensure_ascii=False).encode(),
                        "application/json; charset=utf-8", "Cache-Control: no-store\r\n")
            elif path == "/api/info":
                respond(writer, "200 OK", json.dumps({"url": current_public_url()}).encode(),
                        "application/json", "Cache-Control: no-store\r\n")
            elif path == "/sounds/index.json":
                respond(writer, "200 OK", json.dumps(sounds_index()).encode(),
                        "application/json", "Cache-Control: no-store\r\n")
            else:
                f = static_file(target)
                if not f:
                    respond(writer, "404 Not Found", b"not found")
                else:
                    st = f.stat()
                    etag = '"%x-%x"' % (st.st_mtime_ns, st.st_size)
                    if hdr.get("if-none-match") == etag:
                        respond(writer, "304 Not Modified", b"", extra="ETag: %s\r\n" % etag)
                    else:
                        ctype = mimetypes.guess_type(f.name)[0] or "application/octet-stream"
                        if ctype.startswith("text/") or ctype in ("application/javascript", "application/json"):
                            ctype += "; charset=utf-8"
                        body = f.read_bytes() if method == "GET" else b""
                        respond(writer, "200 OK", body, ctype,
                                "Cache-Control: no-cache\r\nETag: %s\r\n" % etag)
            await writer.drain()
            if hdr.get("connection", "").lower() == "close":
                break
    finally:
        try:
            writer.close()
        except Exception:
            pass


async def main():
    global PIN
    PIN = load_pin()
    log("leader PIN: %s   (change it in config.local.json or PARTY_PIN)" % PIN)
    srv = await asyncio.start_server(handle, "0.0.0.0", PORT)
    asyncio.create_task(ticker())
    log("Cedric's Party Games on http://localhost:%d/host" % PORT)
    async with srv:
        await srv.serve_forever()


if __name__ == "__main__":
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        pass
