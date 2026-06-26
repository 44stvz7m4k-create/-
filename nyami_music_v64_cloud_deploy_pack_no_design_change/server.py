#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Nyami Music v48 — public site + owner-only admin.

Запуск:
  python server.py

Открыть:
  http://127.0.0.1:5000

Что внутри:
- общий сайт для пользователей;
- owner-only админка;
- загрузка треков и обложек на наш сервер;
- /api/tracks для основного сайта;
- SQLite база;
- старый auth v47 сохранён для обычных пользователей;
- админ проверяется отдельно на сервере.
"""

from __future__ import annotations

import hashlib
import json
import mimetypes
import os
import re
import secrets
import shutil
import threading
import webbrowser
import sqlite3
import urllib.request
import urllib.parse

def load_dotenv_file(path: str = ".env") -> None:
    """Tiny .env loader. Does not overwrite real environment variables."""
    try:
        if not os.path.exists(path):
            return
        with open(path, "r", encoding="utf-8") as env_file:
            lines = env_file.read().splitlines()
    except Exception:
        return

    for line in lines:
        line = line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue

        key, value = line.split("=", 1)
        key = key.strip()
        value = value.strip().strip('"').strip("'")

        if key and key not in os.environ:
            os.environ[key] = value


load_dotenv_file()

APP_BUILD = "v64-cloud-deploy-pack"
APP_STARTED_AT = "booting"


from datetime import datetime, timedelta, timezone
from http import cookies
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from typing import Any
from urllib.parse import unquote, urlparse


ROOT = Path(__file__).resolve().parent


def resolve_env_path(env_name: str, default_path: Path) -> Path:
    raw = os.environ.get(env_name, "").strip()
    path = Path(raw).expanduser() if raw else Path(default_path)
    if not path.is_absolute():
        path = ROOT / path
    return path.resolve()


STORAGE_DIR = resolve_env_path("NYAMI_STORAGE_DIR", ROOT)
DATA_DIR = resolve_env_path("NYAMI_DATA_DIR", STORAGE_DIR / "data")
UPLOAD_DIR = resolve_env_path("NYAMI_UPLOADS_DIR", STORAGE_DIR / "uploads")
MUSIC_DIR = resolve_env_path("NYAMI_MUSIC_DIR", UPLOAD_DIR / "music")
COVERS_DIR = resolve_env_path("NYAMI_COVERS_DIR", UPLOAD_DIR / "covers")
DB_PATH = resolve_env_path("NYAMI_DB_PATH", DATA_DIR / "nyami.sqlite3")

# Backward-compatible aliases used by newer diagnostic layers.
UPLOAD_MUSIC_DIR = MUSIC_DIR
UPLOAD_COVERS_DIR = COVERS_DIR

HOST = os.environ.get("NYAMI_HOST", "127.0.0.1")
PORT = int(os.environ.get("PORT") or os.environ.get("NYAMI_PORT") or "5000")

USER_COOKIE = "nyami_session_v47"
ADMIN_COOKIE = "nyami_admin_session_v48"
AI_COOKIE = "nyami_ai_consent_v54"
SOCIAL_COOKIE = "nyami_social_oauth_v57"

OWNER_LOGIN = os.environ.get("NYAMI_OWNER_LOGIN", "admin")
OWNER_PASSWORD = os.environ.get("NYAMI_OWNER_PASSWORD", "admin123")

# Optional official API keys. iTunes works without a key.
YOUTUBE_API_KEY = os.environ.get("YOUTUBE_API_KEY", "")
SPOTIFY_CLIENT_ID = os.environ.get("SPOTIFY_CLIENT_ID", "")
SPOTIFY_CLIENT_SECRET = os.environ.get("SPOTIFY_CLIENT_SECRET", "")
SOUNDCLOUD_CLIENT_ID = os.environ.get("SOUNDCLOUD_CLIENT_ID", "")
INTERNET_ARCHIVE_ENABLED = os.environ.get("INTERNET_ARCHIVE_ENABLED", "1") != "0"
JAMENDO_CLIENT_ID = os.environ.get("JAMENDO_CLIENT_ID", "")

# Social auth / OAuth. Configure in environment before starting server.
GOOGLE_CLIENT_ID = os.environ.get("GOOGLE_CLIENT_ID", "")
GOOGLE_CLIENT_SECRET = os.environ.get("GOOGLE_CLIENT_SECRET", "")
APPLE_CLIENT_ID = os.environ.get("APPLE_CLIENT_ID", "")
# For Apple: provide a pre-generated Sign in with Apple client_secret JWT.
APPLE_CLIENT_SECRET = os.environ.get("APPLE_CLIENT_SECRET", "")

SESSION_DAYS = 30
PBKDF2_ITERATIONS = 260_000

ALLOWED_MUSIC = {".mp3", ".wav", ".ogg", ".m4a"}
ALLOWED_IMAGES = {".jpg", ".jpeg", ".png", ".webp"}


def utcnow() -> datetime:
    return datetime.now(timezone.utc)


def now_iso() -> str:
    return utcnow().isoformat()


def expires_iso() -> str:
    return (utcnow() + timedelta(days=SESSION_DAYS)).isoformat()


def normalize_email(value: str) -> str:
    return str(value or "").strip().lower()


def normalize_nick(value: str) -> str:
    value = str(value or "").strip().lower().replace(" ", "")
    if value.startswith("@"):
        value = value[1:]
    return value


def normalize_phone(value: str) -> str:
    value = str(value or "").strip()
    plus = "+" if value.startswith("+") else ""
    digits = "".join(ch for ch in value if ch.isdigit())
    return plus + digits


def valid_email(value: str) -> bool:
    value = normalize_email(value)
    return bool(re.fullmatch(r"[^@\s]+@[^@\s]+\.[^@\s]+", value))


def valid_nick(value: str) -> bool:
    value = normalize_nick(value)
    return bool(re.fullmatch(r"[a-z0-9._-]{3,24}", value))


def valid_phone(value: str) -> bool:
    digits = "".join(ch for ch in normalize_phone(value) if ch.isdigit())
    return 7 <= len(digits) <= 15


def hash_password(password: str, salt_hex: str | None = None, iterations: int = PBKDF2_ITERATIONS) -> tuple[str, str, int]:
    salt = bytes.fromhex(salt_hex) if salt_hex else os.urandom(18)
    digest = hashlib.pbkdf2_hmac("sha256", password.encode("utf-8"), salt, iterations)
    return salt.hex(), digest.hex(), iterations


def verify_password(password: str, salt_hex: str, expected_hash: str, iterations: int) -> bool:
    _, actual_hash, _ = hash_password(password, salt_hex, iterations)
    return secrets.compare_digest(actual_hash, expected_hash)


def new_token() -> tuple[str, str]:
    raw = secrets.token_urlsafe(32)
    token_hash = hashlib.sha256(raw.encode("utf-8")).hexdigest()
    return raw, token_hash


def hash_token(raw: str) -> str:
    return hashlib.sha256(raw.encode("utf-8")).hexdigest()


def default_profile(name: str, handle: str) -> dict[str, Any]:
    return {
        "name": name,
        "handle": handle,
        "status": "soft music mode",
        "bio": "Мій мʼякий музичний простір.",
        "avatar": "猫",
        "avatarImage": "",
        "banner": "lavender",
        "bannerImage": "",
        "accent": "lavender",
    }


def init_dirs() -> None:
    DATA_DIR.mkdir(exist_ok=True)
    MUSIC_DIR.mkdir(parents=True, exist_ok=True)
    COVERS_DIR.mkdir(parents=True, exist_ok=True)


def init_db() -> None:
    init_dirs()
    with sqlite3.connect(DB_PATH) as con:
        con.row_factory = sqlite3.Row
        con.execute("PRAGMA foreign_keys = ON")
        con.execute("""
            CREATE TABLE IF NOT EXISTS users (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              name TEXT NOT NULL,
              email TEXT UNIQUE,
              nick TEXT UNIQUE,
              phone TEXT UNIQUE,
              password_salt TEXT NOT NULL,
              password_hash TEXT NOT NULL,
              password_iters INTEGER NOT NULL,
              profile_json TEXT NOT NULL,
              created_at TEXT NOT NULL,
              updated_at TEXT NOT NULL
            )
        """)
        con.execute("""
            CREATE TABLE IF NOT EXISTS sessions (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              user_id INTEGER,
              role TEXT NOT NULL CHECK(role IN ('user', 'guest')),
              token_hash TEXT NOT NULL UNIQUE,
              created_at TEXT NOT NULL,
              expires_at TEXT NOT NULL,
              last_seen_at TEXT NOT NULL,
              FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
            )
        """)
        con.execute("""
            CREATE TABLE IF NOT EXISTS login_attempts (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              identifier TEXT NOT NULL,
              created_at TEXT NOT NULL,
              success INTEGER NOT NULL CHECK(success IN (0, 1))
            )
        """)
        con.execute("""
            CREATE TABLE IF NOT EXISTS admin_sessions (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              token_hash TEXT NOT NULL UNIQUE,
              created_at TEXT NOT NULL,
              expires_at TEXT NOT NULL,
              last_seen_at TEXT NOT NULL
            )
        """)
        con.execute("""
            CREATE TABLE IF NOT EXISTS tracks (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              title TEXT NOT NULL,
              artist TEXT NOT NULL,
              audio_file TEXT NOT NULL DEFAULT '',
              cover_file TEXT,
              source_type TEXT NOT NULL DEFAULT 'upload',
              external_url TEXT,
              page_url TEXT,
              cover_url TEXT,
              source_label TEXT,
              created_at TEXT NOT NULL,
              updated_at TEXT NOT NULL
            )
        """)

        # Source columns for v53 external music sources.
        existing_columns = {row["name"] for row in con.execute("PRAGMA table_info(tracks)").fetchall()}
        source_columns = {
            "source_type": "TEXT NOT NULL DEFAULT 'upload'",
            "external_url": "TEXT",
            "page_url": "TEXT",
            "cover_url": "TEXT",
            "source_label": "TEXT",
        }
        for column_name, column_sql in source_columns.items():
            if column_name not in existing_columns:
                con.execute(f"ALTER TABLE tracks ADD COLUMN {column_name} {column_sql}")

        con.execute("CREATE INDEX IF NOT EXISTS idx_tracks_created ON tracks(created_at)")

        con.execute("""
            CREATE TABLE IF NOT EXISTS user_events (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              identity TEXT NOT NULL,
              event_type TEXT NOT NULL,
              query TEXT,
              source TEXT,
              title TEXT,
              artist TEXT,
              mood TEXT,
              created_at TEXT NOT NULL
            )
        """)
        con.execute("""
            CREATE TABLE IF NOT EXISTS user_preferences (
              identity TEXT NOT NULL,
              pref_key TEXT NOT NULL,
              pref_value TEXT NOT NULL,
              weight REAL NOT NULL DEFAULT 1,
              updated_at TEXT NOT NULL,
              PRIMARY KEY(identity, pref_key, pref_value)
            )
        """)
        con.execute("""
            CREATE TABLE IF NOT EXISTS external_likes (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              identity TEXT NOT NULL,
              source TEXT NOT NULL,
              title TEXT NOT NULL,
              artist TEXT,
              play_url TEXT,
              embed_url TEXT,
              player_type TEXT,
              thumbnail TEXT,
              created_at TEXT NOT NULL,
              UNIQUE(identity, source, title, artist, play_url)
            )
        """)
        con.execute("""
            CREATE TABLE IF NOT EXISTS cookie_consent (
              identity TEXT PRIMARY KEY,
              mode TEXT NOT NULL,
              created_at TEXT NOT NULL,
              updated_at TEXT NOT NULL
            )
        """)
        con.execute("CREATE INDEX IF NOT EXISTS idx_user_events_identity ON user_events(identity, created_at)")
        con.execute("CREATE INDEX IF NOT EXISTS idx_user_preferences_identity ON user_preferences(identity)")

        con.execute("""
            CREATE TABLE IF NOT EXISTS playlist_shares (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              playlist_id INTEGER NOT NULL,
              user_id INTEGER NOT NULL,
              share_id TEXT NOT NULL UNIQUE,
              is_public INTEGER NOT NULL DEFAULT 1,
              created_at TEXT NOT NULL,
              updated_at TEXT NOT NULL,
              FOREIGN KEY(playlist_id) REFERENCES playlists(id) ON DELETE CASCADE,
              FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
            )
        """)
        con.execute("CREATE INDEX IF NOT EXISTS idx_playlist_shares_playlist ON playlist_shares(playlist_id)")
        con.execute("""
            CREATE TABLE IF NOT EXISTS track_lyrics (
              track_key TEXT PRIMARY KEY,
              title TEXT,
              artist TEXT,
              lyrics TEXT NOT NULL,
              updated_at TEXT NOT NULL
            )
        """)
        con.execute("CREATE INDEX IF NOT EXISTS idx_track_lyrics_artist ON track_lyrics(artist)")


        con.execute("""
            CREATE TABLE IF NOT EXISTS listening_history (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              identity TEXT NOT NULL,
              track_key TEXT NOT NULL,
              track_json TEXT NOT NULL,
              event_type TEXT NOT NULL DEFAULT 'play',
              created_at TEXT NOT NULL
            )
        """)
        con.execute("CREATE INDEX IF NOT EXISTS idx_listening_history_identity ON listening_history(identity, created_at)")


        con.execute("""
            CREATE TABLE IF NOT EXISTS playlists (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              user_id INTEGER NOT NULL,
              name TEXT NOT NULL,
              description TEXT,
              mood_filter TEXT NOT NULL DEFAULT 'all',
              cover TEXT,
              created_at TEXT NOT NULL,
              updated_at TEXT NOT NULL,
              FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
            )
        """)
        con.execute("CREATE INDEX IF NOT EXISTS idx_playlists_user ON playlists(user_id, updated_at)")
        con.execute("""
            CREATE TABLE IF NOT EXISTS playlist_tracks (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              playlist_id INTEGER NOT NULL,
              track_key TEXT NOT NULL,
              track_json TEXT NOT NULL,
              position INTEGER NOT NULL DEFAULT 0,
              created_at TEXT NOT NULL,
              UNIQUE(playlist_id, track_key),
              FOREIGN KEY(playlist_id) REFERENCES playlists(id) ON DELETE CASCADE
            )
        """)
        con.execute("CREATE INDEX IF NOT EXISTS idx_playlist_tracks_playlist ON playlist_tracks(playlist_id, position)")


        con.execute("""
            CREATE TABLE IF NOT EXISTS social_accounts (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              user_id INTEGER NOT NULL,
              provider TEXT NOT NULL,
              provider_user_id TEXT NOT NULL,
              email TEXT,
              name TEXT,
              picture TEXT,
              created_at TEXT NOT NULL,
              updated_at TEXT NOT NULL,
              UNIQUE(provider, provider_user_id),
              FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
            )
        """)
        con.execute("CREATE INDEX IF NOT EXISTS idx_social_accounts_user ON social_accounts(user_id)")
        con.execute("""
            CREATE TABLE IF NOT EXISTS recent_searches (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              identity TEXT NOT NULL,
              query TEXT NOT NULL,
              result_count INTEGER NOT NULL DEFAULT 0,
              created_at TEXT NOT NULL
            )
        """)
        con.execute("CREATE INDEX IF NOT EXISTS idx_recent_searches_identity ON recent_searches(identity, created_at)")


        con.execute("""
            CREATE TABLE IF NOT EXISTS ai_learning_stats (
              identity TEXT NOT NULL,
              source TEXT NOT NULL,
              artist TEXT NOT NULL DEFAULT '',
              mood TEXT NOT NULL DEFAULT '',
              plays INTEGER NOT NULL DEFAULT 0,
              likes INTEGER NOT NULL DEFAULT 0,
              skips INTEGER NOT NULL DEFAULT 0,
              searches INTEGER NOT NULL DEFAULT 0,
              updated_at TEXT NOT NULL,
              PRIMARY KEY(identity, source, artist, mood)
            )
        """)
        con.execute("CREATE INDEX IF NOT EXISTS idx_ai_learning_identity ON ai_learning_stats(identity)")


        con.execute("CREATE INDEX IF NOT EXISTS idx_login_attempts_identifier ON login_attempts(identifier, created_at)")
        con.commit()


def db() -> sqlite3.Connection:
    con = sqlite3.connect(DB_PATH)
    con.row_factory = sqlite3.Row
    con.execute("PRAGMA foreign_keys = ON")
    return con


def parse_cookie(header: str | None) -> dict[str, str]:
    if not header:
        return {}
    jar = cookies.SimpleCookie()
    try:
        jar.load(header)
        return {k: v.value for k, v in jar.items()}
    except Exception:
        return {}


def make_cookie_header(name: str, raw_token: str) -> dict[str, str]:
    cookie = cookies.SimpleCookie()
    cookie[name] = raw_token
    cookie[name]["path"] = "/"
    cookie[name]["httponly"] = True
    cookie[name]["samesite"] = "Lax"
    cookie[name]["max-age"] = str(SESSION_DAYS * 24 * 60 * 60)
    return {"Set-Cookie": cookie.output(header="").strip()}


def clear_cookie_header(name: str) -> dict[str, str]:
    return {"Set-Cookie": f"{name}=; Path=/; Max-Age=0; HttpOnly; SameSite=Lax"}


def user_public(row: sqlite3.Row | None) -> dict[str, Any] | None:
    if not row:
        return None
    try:
        profile = json.loads(row["profile_json"] or "{}")
    except Exception:
        profile = {}

    fallback_handle = f"@{row['nick']}" if row["nick"] else (f"@{row['email'].split('@')[0]}" if row["email"] else "@nyami")
    profile = {**default_profile(row["name"], fallback_handle), **profile}

    return {
        "id": row["id"],
        "name": row["name"],
        "email": row["email"],
        "nick": row["nick"],
        "phone": row["phone"],
        "handle": profile.get("handle") or fallback_handle,
        "profile": profile,
    }


def safe_filename(filename: str, fallback_ext: str) -> str:
    ext = Path(filename or "").suffix.lower() or fallback_ext
    ext = re.sub(r"[^a-z0-9.]", "", ext)
    return f"{secrets.token_hex(16)}{ext}"


def row_value(row: sqlite3.Row, key: str, default: Any = None) -> Any:
    try:
        value = row[key]
    except Exception:
        return default
    return default if value is None else value


def is_http_url(value: str) -> bool:
    value = str(value or "").strip()
    return value.startswith("http://") or value.startswith("https://")


def row_to_track(row: sqlite3.Row) -> dict[str, Any]:
    source_type = str(row_value(row, "source_type", "upload") or "upload").strip().lower()
    audio_file = str(row_value(row, "audio_file", "") or "")
    external_url = str(row_value(row, "external_url", "") or "")
    page_url = str(row_value(row, "page_url", "") or "")
    cover_file = str(row_value(row, "cover_file", "") or "")
    cover_url_value = str(row_value(row, "cover_url", "") or "")
    source_label = str(row_value(row, "source_label", "") or "")

    if source_type == "upload":
        audio_url = f"/uploads/music/{audio_file}" if audio_file else ""
        cover_url = f"/uploads/covers/{cover_file}" if cover_file else ""
        is_playable = bool(audio_url)
        source_label = source_label or "Server"
    elif source_type == "direct":
        audio_url = external_url or audio_file
        cover_url = cover_url_value or (f"/uploads/covers/{cover_file}" if cover_file else "")
        is_playable = bool(audio_url)
        source_label = source_label or "Direct URL"
    else:
        audio_url = ""
        cover_url = cover_url_value or (f"/uploads/covers/{cover_file}" if cover_file else "")
        is_playable = False
        source_label = source_label or source_type.capitalize()

    return {
        "id": row["id"],
        "title": row["title"],
        "artist": row["artist"],
        "audioUrl": audio_url,
        "musicUrl": audio_url,
        "coverUrl": cover_url,
        "cover": cover_url,
        "sourceType": source_type,
        "sourceLabel": source_label,
        "externalUrl": external_url,
        "pageUrl": page_url or external_url,
        "provider": source_type,
        "isPlayable": is_playable,
        "createdAt": row["created_at"],
        "updatedAt": row["updated_at"],
    }



class UploadedPart:
    def __init__(self, filename: str, data: bytes):
        self.filename = filename
        self.data = data


def parse_multipart_form(content_type: str, body: bytes) -> tuple[dict[str, str], dict[str, UploadedPart]]:
    """Small multipart/form-data parser for local admin uploads."""
    if "boundary=" not in content_type:
        raise ValueError("Missing multipart boundary")

    boundary = content_type.split("boundary=", 1)[1].strip()
    if boundary.startswith('"') and boundary.endswith('"'):
        boundary = boundary[1:-1]

    boundary_bytes = ("--" + boundary).encode("utf-8")
    fields: dict[str, str] = {}
    files: dict[str, UploadedPart] = {}

    parts = body.split(boundary_bytes)
    for raw_part in parts[1:]:
        if raw_part.startswith(b"--"):
            break

        if raw_part.startswith(b"\r\n"):
            raw_part = raw_part[2:]

        if raw_part.endswith(b"\r\n"):
            raw_part = raw_part[:-2]

        if not raw_part or b"\r\n\r\n" not in raw_part:
            continue

        raw_headers, content = raw_part.split(b"\r\n\r\n", 1)
        headers: dict[str, str] = {}

        for line in raw_headers.decode("utf-8", "replace").split("\r\n"):
            if ":" in line:
                key, value = line.split(":", 1)
                headers[key.strip().lower()] = value.strip()

        disposition = headers.get("content-disposition", "")
        if "form-data" not in disposition:
            continue

        attrs: dict[str, str] = {}
        for item in disposition.split(";"):
            item = item.strip()
            if "=" in item:
                key, value = item.split("=", 1)
                attrs[key.strip().lower()] = value.strip().strip('"')

        name = attrs.get("name")
        filename = attrs.get("filename")

        if not name:
            continue

        if filename:
            files[name] = UploadedPart(filename=filename, data=content)
        else:
            fields[name] = content.decode("utf-8", "replace").strip()

    return fields, files




def safe_urlopen_json(url: str, headers: dict[str, str] | None = None, timeout: float = 5.0) -> dict[str, Any] | None:
    try:
        request = urllib.request.Request(url, headers=headers or {"User-Agent": "NyamiMusic/1.0"})
        with urllib.request.urlopen(request, timeout=timeout) as response:
            raw = response.read(1_000_000).decode("utf-8", "ignore")
            return json.loads(raw)
    except Exception:
        return None


def parse_ai_cookie(raw_cookie: str | None) -> tuple[str, str | None]:
    value = parse_cookie(raw_cookie).get(AI_COOKIE, "")
    if value.startswith("ai|"):
        return "ai", value.split("|", 1)[1] or None
    if value.startswith("necessary|"):
        return "necessary", value.split("|", 1)[1] or None
    return "unset", None


def make_ai_cookie(mode: str, identity: str) -> dict[str, str]:
    safe_mode = "ai" if mode == "ai" else "necessary"
    cookie = cookies.SimpleCookie()
    cookie[AI_COOKIE] = f"{safe_mode}|{identity}"
    cookie[AI_COOKIE]["path"] = "/"
    cookie[AI_COOKIE]["samesite"] = "Lax"
    cookie[AI_COOKIE]["max-age"] = str(365 * 24 * 60 * 60)
    return {"Set-Cookie": cookie.output(header="").strip()}


def normalize_pref(value: str) -> str:
    return re.sub(r"\s+", " ", str(value or "").strip().lower())[:100]


def detect_mood(query: str) -> str:
    q = normalize_pref(query)
    mood_map = {
        "focus": ["coding", "code", "focus", "study", "work", "робота", "код", "фокус"],
        "sleep": ["sleep", "сон", "chill", "calm", "тихо", "спокій"],
        "night": ["night", "ніч", "ночь", "dark", "moon"],
        "sad": ["sad", "сум", "грусть", "melancholy"],
        "energy": ["energy", "energetic", "gym", "drive", "speed"],
        "lofi": ["lofi", "lo-fi", "лофі", "лофи"],
    }
    for mood, words in mood_map.items():
        if any(word in q for word in words):
            return mood
    return ""


def youtube_video_id(url: str) -> str:
    parsed = urllib.parse.urlparse(url)
    if parsed.netloc.endswith("youtu.be"):
        return parsed.path.strip("/")
    if "youtube.com" in parsed.netloc:
        qs = urllib.parse.parse_qs(parsed.query)
        if qs.get("v"):
            return qs["v"][0]
        if parsed.path.startswith("/shorts/") or parsed.path.startswith("/embed/"):
            return parsed.path.split("/")[2] if len(parsed.path.split("/")) > 2 else ""
    return ""


def spotify_track_id(url: str) -> str:
    parsed = urllib.parse.urlparse(url)
    parts = [part for part in parsed.path.split("/") if part]
    if "open.spotify.com" in parsed.netloc and len(parts) >= 2 and parts[0] == "track":
        return parts[1]
    if url.startswith("spotify:track:"):
        return url.split(":")[-1]
    return ""


def soundcloud_embed_url(url: str) -> str:
    return "https://w.soundcloud.com/player/?url=" + urllib.parse.quote(url, safe="")


def score_results_for_identity(results: list[dict[str, Any]], identity: str | None, allow_ai: bool) -> list[dict[str, Any]]:
    if not identity or not allow_ai or not results:
        return results

    weights: dict[tuple[str, str], float] = {}
    try:
        with db() as con:
            rows = con.execute(
                "SELECT pref_key, pref_value, weight FROM user_preferences WHERE identity = ?",
                (identity,),
            ).fetchall()
        for row in rows:
            weights[(row["pref_key"], row["pref_value"])] = float(row["weight"])
    except Exception:
        return results

    scored: list[dict[str, Any]] = []
    for index, item in enumerate(results):
        score = float(item.get("score", 0)) + max(0, 50 - index)
        source = normalize_pref(item.get("source"))
        artist = normalize_pref(item.get("artist"))
        mood = normalize_pref(item.get("mood"))

        score += weights.get(("source", source), 0) * 4
        score += weights.get(("artist", artist), 0) * 3
        if mood:
            score += weights.get(("mood", mood), 0) * 2

        item = {**item, "score": round(score, 3)}
        scored.append(item)

    return sorted(scored, key=lambda item: item.get("score", 0), reverse=True)


def upsert_preference(identity: str, pref_key: str, pref_value: str, delta: float = 1.0) -> None:
    pref_key = normalize_pref(pref_key)
    pref_value = normalize_pref(pref_value)
    if not identity or not pref_key or not pref_value:
        return

    with db() as con:
        con.execute("""
            INSERT INTO user_preferences (identity, pref_key, pref_value, weight, updated_at)
            VALUES (?, ?, ?, ?, ?)
            ON CONFLICT(identity, pref_key, pref_value)
            DO UPDATE SET weight = weight + excluded.weight, updated_at = excluded.updated_at
        """, (identity, pref_key, pref_value, delta, now_iso()))
        con.commit()


def search_itunes(query: str, limit: int) -> list[dict[str, Any]]:
    params = urllib.parse.urlencode({
        "term": query,
        "media": "music",
        "entity": "song",
        "limit": str(limit),
    })
    data = safe_urlopen_json(f"https://itunes.apple.com/search?{params}")
    results: list[dict[str, Any]] = []
    for item in (data or {}).get("results", [])[:limit]:
        preview = item.get("previewUrl") or ""
        if not preview:
            continue
        title = item.get("trackName") or ""
        artist = item.get("artistName") or ""
        thumbnail = (item.get("artworkUrl100") or "").replace("100x100bb", "300x300bb")
        results.append({
            "source": "itunes",
            "title": title,
            "artist": artist,
            "thumbnail": thumbnail,
            "play_url": preview,
            "embed_url": "",
            "player_type": "itunes_preview",
            "mood": detect_mood(query),
            "page_url": item.get("trackViewUrl") or "",
        })
    return results


def search_jamendo(query: str, limit: int) -> list[dict[str, Any]]:
    if not JAMENDO_CLIENT_ID:
        return []
    params = urllib.parse.urlencode({
        "client_id": JAMENDO_CLIENT_ID,
        "format": "json",
        "limit": str(limit),
        "namesearch": query,
        "include": "musicinfo",
        "audioformat": "mp31",
        "imagesize": "300",
    })
    data = safe_urlopen_json(f"https://api.jamendo.com/v3.0/tracks/?{params}")
    results: list[dict[str, Any]] = []
    for item in (data or {}).get("results", [])[:limit]:
        audio_url = item.get("audio") or ""
        if not audio_url:
            continue
        results.append({
            "source": "jamendo",
            "title": item.get("name") or "",
            "artist": item.get("artist_name") or "",
            "thumbnail": item.get("album_image") or item.get("image") or "",
            "play_url": audio_url,
            "embed_url": "",
            "player_type": "jamendo_audio",
            "mood": detect_mood(query),
            "page_url": item.get("shareurl") or item.get("shorturl") or "",
        })
    return results


def search_youtube(query: str, limit: int) -> list[dict[str, Any]]:
    if not YOUTUBE_API_KEY:
        return []

    params = urllib.parse.urlencode({
        "part": "snippet",
        "q": query,
        "type": "video",
        "videoEmbeddable": "true",
        "maxResults": str(limit),
        "key": YOUTUBE_API_KEY,
    })
    data = safe_urlopen_json(f"https://www.googleapis.com/youtube/v3/search?{params}")
    results: list[dict[str, Any]] = []
    for item in (data or {}).get("items", [])[:limit]:
        video_id = (item.get("id") or {}).get("videoId") or ""
        snippet = item.get("snippet") or {}
        if not video_id:
            continue
        title = snippet.get("title") or ""
        artist = snippet.get("channelTitle") or "YouTube"
        thumbs = snippet.get("thumbnails") or {}
        thumb = (thumbs.get("high") or thumbs.get("medium") or thumbs.get("default") or {}).get("url") or ""
        results.append({
            "source": "youtube",
            "title": title,
            "artist": artist,
            "thumbnail": thumb,
            "play_url": f"https://www.youtube.com/watch?v={video_id}",
            "embed_url": f"https://www.youtube.com/embed/{video_id}",
            "player_type": "youtube_embed",
            "mood": detect_mood(query),
        })
    return results


_SPOTIFY_TOKEN_CACHE: dict[str, Any] = {"token": "", "expires": 0}


def spotify_token() -> str:
    if not SPOTIFY_CLIENT_ID or not SPOTIFY_CLIENT_SECRET:
        return ""

    if _SPOTIFY_TOKEN_CACHE["token"] and _SPOTIFY_TOKEN_CACHE["expires"] > time.time() + 60:
        return _SPOTIFY_TOKEN_CACHE["token"]

    import base64
    basic = base64.b64encode(f"{SPOTIFY_CLIENT_ID}:{SPOTIFY_CLIENT_SECRET}".encode("utf-8")).decode("ascii")
    data = urllib.parse.urlencode({"grant_type": "client_credentials"}).encode("utf-8")
    req = urllib.request.Request(
        "https://accounts.spotify.com/api/token",
        data=data,
        headers={
            "Authorization": f"Basic {basic}",
            "Content-Type": "application/x-www-form-urlencoded",
            "User-Agent": "NyamiMusic/1.0",
        },
        method="POST",
    )
    try:
        with urllib.request.urlopen(req, timeout=5) as response:
            payload = json.loads(response.read().decode("utf-8", "ignore"))
        token = payload.get("access_token") or ""
        if token:
            _SPOTIFY_TOKEN_CACHE["token"] = token
            _SPOTIFY_TOKEN_CACHE["expires"] = time.time() + int(payload.get("expires_in") or 3600)
        return token
    except Exception:
        return ""


def search_spotify(query: str, limit: int) -> list[dict[str, Any]]:
    token = spotify_token()
    if not token:
        return []

    params = urllib.parse.urlencode({
        "q": query,
        "type": "track",
        "limit": str(limit),
        "market": "US",
    })
    data = safe_urlopen_json(
        f"https://api.spotify.com/v1/search?{params}",
        headers={"Authorization": f"Bearer {token}", "User-Agent": "NyamiMusic/1.0"},
    )
    results: list[dict[str, Any]] = []
    items = ((data or {}).get("tracks") or {}).get("items") or []
    for item in items[:limit]:
        track_id = item.get("id") or ""
        if not track_id:
            continue
        artists = item.get("artists") or []
        album = item.get("album") or {}
        images = album.get("images") or []
        thumbnail = images[0]["url"] if images else ""
        results.append({
            "source": "spotify",
            "title": item.get("name") or "",
            "artist": ", ".join(a.get("name", "") for a in artists if a.get("name")) or "Spotify",
            "thumbnail": thumbnail,
            "play_url": (item.get("external_urls") or {}).get("spotify") or f"https://open.spotify.com/track/{track_id}",
            "embed_url": f"https://open.spotify.com/embed/track/{track_id}",
            "player_type": "spotify_embed",
            "mood": detect_mood(query),
        })
    return results


def search_soundcloud(query: str, limit: int) -> list[dict[str, Any]]:
    # Query search requires a SoundCloud API key in modern apps.
    # Without a key, support direct SoundCloud URLs through the official widget.
    q = query.strip()
    if is_http_url(q) and "soundcloud.com" in urllib.parse.urlparse(q).netloc:
        oembed = safe_urlopen_json("https://soundcloud.com/oembed?format=json&url=" + urllib.parse.quote(q, safe=""))
        title = (oembed or {}).get("title") or "SoundCloud"
        author = (oembed or {}).get("author_name") or "SoundCloud"
        thumb = (oembed or {}).get("thumbnail_url") or ""
        return [{
            "source": "soundcloud",
            "title": title,
            "artist": author,
            "thumbnail": thumb,
            "play_url": q,
            "embed_url": soundcloud_embed_url(q),
            "player_type": "soundcloud_embed",
            "mood": detect_mood(query),
        }]

    if not SOUNDCLOUD_CLIENT_ID:
        return []

    params = urllib.parse.urlencode({
        "q": query,
        "limit": str(limit),
        "client_id": SOUNDCLOUD_CLIENT_ID,
    })
    data = safe_urlopen_json(f"https://api.soundcloud.com/tracks?{params}")
    results: list[dict[str, Any]] = []
    for item in (data or [])[:limit]:
        permalink = item.get("permalink_url") or ""
        if not permalink:
            continue
        user = item.get("user") or {}
        results.append({
            "source": "soundcloud",
            "title": item.get("title") or "",
            "artist": user.get("username") or "SoundCloud",
            "thumbnail": item.get("artwork_url") or user.get("avatar_url") or "",
            "play_url": permalink,
            "embed_url": soundcloud_embed_url(permalink),
            "player_type": "soundcloud_embed",
            "mood": detect_mood(query),
        })
    return results


def search_spotify_url(query: str) -> list[dict[str, Any]]:
    track_id = spotify_track_id(query)
    if not track_id:
        return []
    return [{
        "source": "spotify",
        "title": "Spotify track",
        "artist": "Spotify",
        "thumbnail": "",
        "play_url": f"https://open.spotify.com/track/{track_id}",
        "embed_url": f"https://open.spotify.com/embed/track/{track_id}",
        "player_type": "spotify_embed",
        "mood": detect_mood(query),
    }]


def search_youtube_url(query: str) -> list[dict[str, Any]]:
    video_id = youtube_video_id(query)
    if not video_id:
        return []
    return [{
        "source": "youtube",
        "title": "YouTube video",
        "artist": "YouTube",
        "thumbnail": f"https://img.youtube.com/vi/{video_id}/hqdefault.jpg",
        "play_url": f"https://www.youtube.com/watch?v={video_id}",
        "embed_url": f"https://www.youtube.com/embed/{video_id}",
        "player_type": "youtube_embed",
        "mood": detect_mood(query),
    }]


def build_universal_results(query: str, identity: str | None, allow_ai: bool, limit: int = 6) -> list[dict[str, Any]]:
    q = query.strip()
    if not q:
        return []

    per_source = max(2, min(limit, 6))
    results: list[dict[str, Any]] = []

    # URL shortcuts first.
    results.extend(search_soundcloud(q, 1))
    results.extend(search_spotify_url(q))
    results.extend(search_youtube_url(q))

    # Search APIs.
    results.extend(search_itunes(q, per_source))
    results.extend(search_jamendo(q, per_source))
    results.extend(search_youtube(q, per_source))
    results.extend(search_spotify(q, per_source))

    # Deduplicate by source + play/embed URL.
    seen: set[str] = set()
    deduped: list[dict[str, Any]] = []
    for item in results:
        key = f"{item.get('source')}|{item.get('play_url')}|{item.get('embed_url')}|{item.get('title')}"
        if key in seen:
            continue
        seen.add(key)
        item["mood"] = item.get("mood") or detect_mood(q)
        deduped.append(item)

    return score_results_for_identity(deduped, identity, allow_ai)[:limit * 4]



def search_local_full_tracks(query: str, limit: int) -> list[dict[str, Any]]:
    q = normalize_pref(query)
    if not q:
        return []

    results: list[dict[str, Any]] = []
    try:
        with db() as con:
            rows = con.execute("""
                SELECT * FROM tracks
                WHERE source_type IN ('upload', 'direct')
                  AND (LOWER(title) LIKE ? OR LOWER(artist) LIKE ?)
                ORDER BY created_at DESC
                LIMIT ?
            """, (f"%{q}%", f"%{q}%", limit)).fetchall()
        for row in rows:
            track = row_to_track(row)
            if track.get("audioUrl"):
                results.append({
                    "source": "local_full",
                    "title": track.get("title") or "",
                    "artist": track.get("artist") or "",
                    "thumbnail": track.get("coverUrl") or "",
                    "play_url": track.get("audioUrl") or "",
                    "embed_url": "",
                    "player_type": "local_audio",
                    "mood": detect_mood(query),
                    "page_url": track.get("pageUrl") or "",
                    "is_full_track": True,
                    "legal_note": "local_or_direct",
                })
    except Exception:
        return []

    return results


def search_internet_archive(query: str, limit: int) -> list[dict[str, Any]]:
    if not INTERNET_ARCHIVE_ENABLED:
        return []

    # Search only public media metadata. Playback uses direct files exposed by archive.org metadata.
    params = urllib.parse.urlencode({
        "q": f'({query}) AND mediatype:audio',
        "fl[]": ["identifier", "title", "creator"],
        "rows": str(max(1, min(limit, 10))),
        "page": "1",
        "output": "json",
    }, doseq=True)
    data = safe_urlopen_json(f"https://archive.org/advancedsearch.php?{params}", timeout=6)
    docs = (((data or {}).get("response") or {}).get("docs") or [])[:limit]

    results: list[dict[str, Any]] = []
    for doc in docs:
        identifier = doc.get("identifier") or ""
        if not identifier:
            continue

        meta = safe_urlopen_json(f"https://archive.org/metadata/{urllib.parse.quote(identifier)}", timeout=6)
        files = (meta or {}).get("files") or []
        audio_file = ""
        for file in files:
            name = file.get("name") or ""
            fmt = (file.get("format") or "").lower()
            lower_name = name.lower()
            if lower_name.endswith((".mp3", ".ogg", ".m4a")) or "mp3" in fmt or "ogg" in fmt:
                audio_file = name
                break

        if not audio_file:
            continue

        title = doc.get("title") or ((meta or {}).get("metadata") or {}).get("title") or identifier
        creator = doc.get("creator") or ((meta or {}).get("metadata") or {}).get("creator") or "Internet Archive"

        if isinstance(creator, list):
            creator = ", ".join(str(item) for item in creator[:2])

        play_url = f"https://archive.org/download/{urllib.parse.quote(identifier)}/{urllib.parse.quote(audio_file)}"
        page_url = f"https://archive.org/details/{urllib.parse.quote(identifier)}"

        results.append({
            "source": "internet_archive",
            "title": str(title),
            "artist": str(creator),
            "thumbnail": f"https://archive.org/services/img/{urllib.parse.quote(identifier)}",
            "play_url": play_url,
            "embed_url": "",
            "player_type": "archive_audio",
            "mood": detect_mood(query),
            "page_url": page_url,
            "is_full_track": True,
            "legal_note": "public_archive",
        })

    return results


def build_full_legal_results(query: str, identity: str | None, allow_ai: bool, limit: int = 6) -> list[dict[str, Any]]:
    q = query.strip()
    if not q:
        return []

    results: list[dict[str, Any]] = []
    per_source = max(3, min(limit, 8))

    # Full playable legal sources only.
    results.extend(search_local_full_tracks(q, per_source))
    results.extend(search_jamendo(q, per_source))
    for item in results:
        if item.get("source") == "jamendo":
            item["is_full_track"] = True
            item["legal_note"] = "jamendo_api"

    results.extend(search_internet_archive(q, per_source))

    seen: set[str] = set()
    deduped: list[dict[str, Any]] = []
    for item in results:
        play_url = item.get("play_url") or ""
        key = f"{item.get('source')}|{play_url}|{item.get('title')}|{item.get('artist')}"
        if not play_url or key in seen:
            continue
        seen.add(key)
        item["mood"] = item.get("mood") or detect_mood(q)
        deduped.append(item)

    return score_results_for_identity(deduped, identity, allow_ai)[:limit * 4]


def update_learning_stats(identity: str, event_type: str, source: str, artist: str, mood: str) -> None:
    if not identity:
        return

    source = normalize_pref(source) or "unknown"
    artist = normalize_pref(artist)
    mood = normalize_pref(mood)

    play_delta = 1 if event_type == "play" else 0
    like_delta = 1 if event_type == "like" else 0
    skip_delta = 1 if event_type == "skip" else 0
    search_delta = 1 if event_type == "search" else 0

    with db() as con:
        con.execute("""
            INSERT INTO ai_learning_stats
              (identity, source, artist, mood, plays, likes, skips, searches, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            ON CONFLICT(identity, source, artist, mood)
            DO UPDATE SET
              plays = plays + excluded.plays,
              likes = likes + excluded.likes,
              skips = skips + excluded.skips,
              searches = searches + excluded.searches,
              updated_at = excluded.updated_at
        """, (identity, source, artist, mood, play_delta, like_delta, skip_delta, search_delta, now_iso()))
        con.commit()




def base64url_decode_json(value: str) -> dict[str, Any]:
    import base64
    try:
        part = value.split(".")[1] if "." in value else value
        part += "=" * (-len(part) % 4)
        raw = base64.urlsafe_b64decode(part.encode("utf-8"))
        return json.loads(raw.decode("utf-8", "ignore"))
    except Exception:
        return {}


def absolute_url(handler: BaseHTTPRequestHandler, path: str) -> str:
    proto = "https" if handler.headers.get("X-Forwarded-Proto") == "https" else "http"
    host = handler.headers.get("Host") or f"{HOST}:{PORT}"
    return f"{proto}://{host}{path}"


def social_state_cookie(provider: str, state: str) -> dict[str, str]:
    cookie = cookies.SimpleCookie()
    cookie[SOCIAL_COOKIE] = f"{provider}|{state}"
    cookie[SOCIAL_COOKIE]["path"] = "/"
    cookie[SOCIAL_COOKIE]["samesite"] = "Lax"
    cookie[SOCIAL_COOKIE]["max-age"] = "900"
    return {"Set-Cookie": cookie.output(header="").strip()}


def clear_social_state_cookie() -> dict[str, str]:
    cookie = cookies.SimpleCookie()
    cookie[SOCIAL_COOKIE] = ""
    cookie[SOCIAL_COOKIE]["path"] = "/"
    cookie[SOCIAL_COOKIE]["max-age"] = "0"
    cookie[SOCIAL_COOKIE]["samesite"] = "Lax"
    return {"Set-Cookie": cookie.output(header="").strip()}


def social_email_fallback(provider: str, provider_user_id: str) -> str:
    safe = re.sub(r"[^a-z0-9]+", "", str(provider_user_id).lower())[:32] or secrets.token_hex(6)
    return f"{provider}_{safe}@social.local"


def make_unique_social_nick(con: sqlite3.Connection, provider: str, name: str, email: str, provider_user_id: str) -> str:
    base = normalize_nick((email.split("@")[0] if email else "") or name or provider)
    base = re.sub(r"[^a-z0-9._-]", "", base)[:18] or provider
    suffix = re.sub(r"[^a-z0-9]", "", provider_user_id.lower())[:6] or secrets.token_hex(3)

    candidate = base
    if not valid_nick(candidate):
        candidate = f"{provider}_{suffix}"

    candidate = candidate[:24]
    if not con.execute("SELECT 1 FROM users WHERE nick = ?", (candidate,)).fetchone():
        return candidate

    for index in range(1, 100):
        next_candidate = f"{base[:18]}_{suffix}{index}"[:24]
        if valid_nick(next_candidate) and not con.execute("SELECT 1 FROM users WHERE nick = ?", (next_candidate,)).fetchone():
            return next_candidate

    return f"{provider}_{secrets.token_hex(5)}"[:24]


def provider_enabled(provider: str) -> bool:
    if provider == "google":
        return bool(GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET)
    if provider == "apple":
        return bool(APPLE_CLIENT_ID and APPLE_CLIENT_SECRET)
    return False




def playlist_track_key(track: dict[str, Any]) -> str:
    source = str(track.get("source") or track.get("sourceType") or track.get("sourceLabel") or "local")
    parts = [
        source,
        str(track.get("serverId") or ""),
        str(track.get("playerType") or ""),
        str(track.get("file") or track.get("playUrl") or track.get("play_url") or track.get("audioUrl") or ""),
        str(track.get("embedUrl") or track.get("embed_url") or ""),
        str(track.get("title") or ""),
        str(track.get("artist") or ""),
    ]
    raw = "|".join(parts).strip()
    return hashlib.sha256(raw.encode("utf-8", "ignore")).hexdigest()[:32]


def clean_track_for_playlist(track: dict[str, Any]) -> dict[str, Any]:
    allowed = {
        "title", "artist", "vibe", "category", "duration", "cover", "file",
        "source", "sourceType", "sourceLabel", "serverId", "uploadedAt",
        "isServerTrack", "isExternalDirect", "playerType", "playUrl",
        "embedUrl", "pageUrl", "isExternalSearch"
    }
    cleaned = {key: track.get(key) for key in allowed if key in track}
    cleaned["title"] = str(cleaned.get("title") or "Untitled")[:200]
    cleaned["artist"] = str(cleaned.get("artist") or "Unknown")[:200]
    cleaned["cover"] = str(cleaned.get("cover") or "assets/covers/nowplaying.jpg")[:500]
    cleaned["vibe"] = str(cleaned.get("vibe") or "new")[:40]
    cleaned["category"] = str(cleaned.get("category") or "new")[:40]
    cleaned["duration"] = str(cleaned.get("duration") or "")[:40]
    return cleaned




def queue_track_key(track: dict[str, Any]) -> str:
    parts = [
        str(track.get("source") or track.get("sourceType") or track.get("sourceLabel") or "local"),
        str(track.get("serverId") or ""),
        str(track.get("playerType") or ""),
        str(track.get("file") or track.get("playUrl") or track.get("play_url") or track.get("audioUrl") or ""),
        str(track.get("embedUrl") or track.get("embed_url") or ""),
        str(track.get("title") or ""),
        str(track.get("artist") or ""),
    ]
    return hashlib.sha256("|".join(parts).encode("utf-8", "ignore")).hexdigest()[:32]


def clean_queue_track(track: dict[str, Any]) -> dict[str, Any]:
    allowed = {
        "title", "artist", "vibe", "category", "duration", "cover", "file",
        "source", "sourceType", "sourceLabel", "serverId", "uploadedAt",
        "isServerTrack", "isExternalDirect", "playerType", "playUrl",
        "embedUrl", "pageUrl", "isExternalSearch"
    }
    cleaned = {key: track.get(key) for key in allowed if key in track}
    cleaned["title"] = str(cleaned.get("title") or "Untitled")[:200]
    cleaned["artist"] = str(cleaned.get("artist") or "Unknown")[:200]
    cleaned["cover"] = str(cleaned.get("cover") or "assets/covers/nowplaying.jpg")[:500]
    cleaned["vibe"] = str(cleaned.get("vibe") or "new")[:40]
    cleaned["category"] = str(cleaned.get("category") or "new")[:40]
    cleaned["duration"] = str(cleaned.get("duration") or "")[:60]
    return cleaned


def similarity_score(seed: dict[str, Any], candidate: dict[str, Any]) -> float:
    score = 0.0
    seed_artist = normalize_pref(seed.get("artist"))
    cand_artist = normalize_pref(candidate.get("artist"))
    seed_vibe = normalize_pref(seed.get("vibe") or seed.get("category"))
    cand_vibe = normalize_pref(candidate.get("vibe") or candidate.get("category"))
    seed_source = normalize_pref(seed.get("sourceType") or seed.get("sourceLabel") or seed.get("source"))
    cand_source = normalize_pref(candidate.get("sourceType") or candidate.get("sourceLabel") or candidate.get("source"))

    if seed_artist and cand_artist and seed_artist == cand_artist:
        score += 8.0
    elif seed_artist and cand_artist and (seed_artist in cand_artist or cand_artist in seed_artist):
        score += 4.0

    if seed_vibe and cand_vibe and seed_vibe == cand_vibe:
        score += 4.0

    if seed_source and cand_source and seed_source == cand_source:
        score += 2.0

    title_words = set(re.findall(r"[a-zA-Zа-яА-ЯіІїЇєЄ0-9]{3,}", normalize_pref(seed.get("title"))))
    cand_words = set(re.findall(r"[a-zA-Zа-яА-ЯіІїЇєЄ0-9]{3,}", normalize_pref(candidate.get("title"))))
    if title_words and cand_words:
        score += min(3.0, len(title_words & cand_words) * 1.0)

    return score




def release_track_key(track: dict[str, Any]) -> str:
    parts = [
        str(track.get("source") or track.get("sourceType") or track.get("sourceLabel") or "local"),
        str(track.get("serverId") or ""),
        str(track.get("playerType") or ""),
        str(track.get("file") or track.get("playUrl") or track.get("play_url") or track.get("audioUrl") or ""),
        str(track.get("embedUrl") or track.get("embed_url") or ""),
        str(track.get("title") or ""),
        str(track.get("artist") or ""),
    ]
    return hashlib.sha256("|".join(parts).encode("utf-8", "ignore")).hexdigest()[:32]


def public_playlist_payload(con: sqlite3.Connection, share: sqlite3.Row) -> dict[str, Any]:
    playlist = con.execute("SELECT * FROM playlists WHERE id = ?", (share["playlist_id"],)).fetchone()
    if not playlist:
        return {}

    rows = con.execute("""
        SELECT track_key, track_json, position, created_at
        FROM playlist_tracks
        WHERE playlist_id = ?
        ORDER BY position ASC, id ASC
    """, (playlist["id"],)).fetchall()

    tracks_payload = []
    for row in rows:
        try:
            track_data = json.loads(row["track_json"])
        except Exception:
            track_data = {}
        tracks_payload.append({
            "trackKey": row["track_key"],
            "track": track_data,
            "position": row["position"],
            "createdAt": row["created_at"],
        })

    owner = con.execute("SELECT name, nick FROM users WHERE id = ?", (playlist["user_id"],)).fetchone()
    return {
        "shareId": share["share_id"],
        "name": playlist["name"],
        "description": playlist["description"] or "",
        "filter": playlist["mood_filter"] or "all",
        "cover": playlist["cover"] or "",
        "owner": {
            "name": owner["name"] if owner else "Nyami user",
            "nick": owner["nick"] if owner else "",
        },
        "tracks": tracks_payload,
        "trackCount": len(tracks_payload),
        "updatedAt": playlist["updated_at"],
    }



class AppHandler(BaseHTTPRequestHandler):
    server_version = "NyamiMusicV48Admin/1.0"

    def log_message(self, fmt: str, *args: Any) -> None:
        print("%s - - [%s] %s" % (self.address_string(), self.log_date_time_string(), fmt % args))

    def send_json(self, payload: dict[str, Any], status: int = 200, extra_headers: dict[str, str] | None = None) -> None:
        body = json.dumps(payload, ensure_ascii=False).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Cache-Control", "no-store")
        if extra_headers:
            for key, value in extra_headers.items():
                self.send_header(key, value)
        self.end_headers()
        self.wfile.write(body)

    def send_error_json(self, status: int, code: str, message: str, fields: dict[str, str] | None = None) -> None:
        error: dict[str, Any] = {"code": code, "message": message}
        if fields:
            error["fields"] = fields
        self.send_json({"ok": False, "error": error}, status)

    def read_json(self) -> tuple[dict[str, Any] | None, str | None]:
        length = int(self.headers.get("Content-Length") or "0")
        if length <= 0:
            return {}, None
        raw = self.rfile.read(length).decode("utf-8")
        try:
            data = json.loads(raw)
            return (data if isinstance(data, dict) else None), None
        except json.JSONDecodeError:
            return None, "invalid_json"

    def get_user_session(self) -> tuple[sqlite3.Row | None, sqlite3.Row | None]:
        raw = parse_cookie(self.headers.get("Cookie")).get(USER_COOKIE)
        if not raw:
            return None, None

        token_hash = hash_token(raw)
        with db() as con:
            session = con.execute("SELECT * FROM sessions WHERE token_hash = ?", (token_hash,)).fetchone()
            if not session:
                return None, None
            if session["expires_at"] <= now_iso():
                con.execute("DELETE FROM sessions WHERE id = ?", (session["id"],))
                con.commit()
                return None, None
            con.execute("UPDATE sessions SET last_seen_at = ? WHERE id = ?", (now_iso(), session["id"]))
            con.commit()

            if session["role"] == "guest":
                return session, None

            user = con.execute("SELECT * FROM users WHERE id = ?", (session["user_id"],)).fetchone()
            if not user:
                con.execute("DELETE FROM sessions WHERE id = ?", (session["id"],))
                con.commit()
                return None, None
            return session, user

    def get_admin_session(self) -> bool:
        raw = parse_cookie(self.headers.get("Cookie")).get(ADMIN_COOKIE)
        if not raw:
            return False

        token_hash = hash_token(raw)
        with db() as con:
            session = con.execute("SELECT * FROM admin_sessions WHERE token_hash = ?", (token_hash,)).fetchone()
            if not session:
                return False
            if session["expires_at"] <= now_iso():
                con.execute("DELETE FROM admin_sessions WHERE id = ?", (session["id"],))
                con.commit()
                return False
            con.execute("UPDATE admin_sessions SET last_seen_at = ? WHERE id = ?", (now_iso(), session["id"]))
            con.commit()
        return True

    def require_admin(self) -> bool:
        if self.get_admin_session():
            return True
        self.send_error_json(401, "admin_required", "Admin login required")
        return False

    def session_payload(self) -> dict[str, Any]:
        session, user = self.get_user_session()
        admin = self.get_admin_session()

        if not session:
            # Public site auth is separate from admin auth.
            # Even if owner is logged into /#admin, the public site stays in guest mode.
            return {
                "ok": True,
                "authenticated": False,
                "guest": True,
                "admin": False,
                "role": "guest",
                "user": None,
                "permissions": {
                    "canListen": True,
                    "canLike": False,
                    "canCreatePlaylist": False,
                    "canEditProfile": False,
                    "canAdmin": False,
                },
            }

        if session["role"] == "guest":
            return {
                "ok": True,
                "authenticated": False,
                "guest": True,
                "admin": False,
                "role": "guest",
                "user": None,
                "permissions": {
                    "canListen": True,
                    "canLike": False,
                    "canCreatePlaylist": False,
                    "canEditProfile": False,
                    "canAdmin": False,
                },
            }

        return {
            "ok": True,
            "authenticated": True,
            "guest": False,
            "admin": False,
            "role": "user",
            "user": user_public(user),
            "permissions": {
                "canListen": True,
                "canLike": True,
                "canCreatePlaylist": True,
                "canEditProfile": True,
                "canAdmin": False,
            },
        }

    def redirect(self, location: str, extra_headers: dict[str, str] | None = None) -> None:
        self.send_response(302)
        self.send_header("Location", location)
        for key, value in (extra_headers or {}).items():
            self.send_header(key, value)
        self.end_headers()

    def validate_social_state(self, provider: str, state: str) -> bool:
        raw = parse_cookie(self.headers.get("Cookie")).get(SOCIAL_COOKIE, "")
        expected_provider, _, expected_state = raw.partition("|")
        return bool(expected_provider == provider and expected_state and secrets.compare_digest(expected_state, state or ""))

    def api_social_config(self) -> None:
        self.send_json({
            "ok": True,
            "providers": {
                "google": provider_enabled("google"),
                "apple": provider_enabled("apple"),
            },
            "redirects": {
                "google": "/api/auth/google/callback",
                "apple": "/api/auth/apple/callback",
            },
        })

    def social_login_finish(self, provider: str, provider_user_id: str, email: str, name: str, picture: str = "") -> None:
        provider = normalize_nick(provider)
        provider_user_id = str(provider_user_id or "").strip()
        email = normalize_email(email or "")
        name = str(name or "").strip() or provider.capitalize()

        if not provider_user_id:
            self.send_error_json(400, "social_missing_id", "Provider did not return user id")
            return

        if not email:
            email = social_email_fallback(provider, provider_user_id)

        with db() as con:
            account = con.execute(
                "SELECT * FROM social_accounts WHERE provider = ? AND provider_user_id = ?",
                (provider, provider_user_id),
            ).fetchone()

            if account:
                user_id = int(account["user_id"])
                con.execute("""
                    UPDATE social_accounts
                    SET email = ?, name = ?, picture = ?, updated_at = ?
                    WHERE id = ?
                """, (email, name, picture, now_iso(), account["id"]))
                user = con.execute("SELECT * FROM users WHERE id = ?", (user_id,)).fetchone()
            else:
                user = con.execute("SELECT * FROM users WHERE lower(email) = lower(?)", (email,)).fetchone()

                if user:
                    user_id = int(user["id"])
                else:
                    nick = make_unique_social_nick(con, provider, name, email, provider_user_id)
                    handle = f"@{nick}"
                    profile = default_profile(name, handle)
                    if picture:
                        profile["avatarImage"] = picture
                        profile["avatar"] = ""
                    salt, password_hash, iterations = hash_password(secrets.token_urlsafe(32))

                    cur = con.execute("""
                        INSERT INTO users (name, email, nick, phone, password_salt, password_hash, password_iters, profile_json, created_at, updated_at)
                        VALUES (?, ?, ?, NULL, ?, ?, ?, ?, ?, ?)
                    """, (
                        name,
                        email,
                        nick,
                        salt,
                        password_hash,
                        iterations,
                        json.dumps(profile, ensure_ascii=False),
                        now_iso(),
                        now_iso(),
                    ))
                    user_id = int(cur.lastrowid)
                    user = con.execute("SELECT * FROM users WHERE id = ?", (user_id,)).fetchone()

                con.execute("""
                    INSERT OR IGNORE INTO social_accounts
                    (user_id, provider, provider_user_id, email, name, picture, created_at, updated_at)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                """, (user_id, provider, provider_user_id, email, name, picture, now_iso(), now_iso()))

            raw, token_hash = new_token()
            con.execute("""
                INSERT INTO sessions (user_id, role, token_hash, created_at, expires_at, last_seen_at)
                VALUES (?, 'user', ?, ?, ?, ?)
            """, (user_id, token_hash, now_iso(), expires_iso(), now_iso()))
            con.commit()

        headers = {}
        headers.update(make_cookie_header(USER_COOKIE, raw))
        headers.update(clear_social_state_cookie())
        self.redirect("/?auth=social-ok", headers)

    def api_google_start(self) -> None:
        if not provider_enabled("google"):
            self.redirect("/?auth=social-provider-disabled")
            return

        state = secrets.token_urlsafe(24)
        redirect_uri = absolute_url(self, "/api/auth/google/callback")
        params = urllib.parse.urlencode({
            "client_id": GOOGLE_CLIENT_ID,
            "redirect_uri": redirect_uri,
            "response_type": "code",
            "scope": "openid email profile",
            "state": state,
            "access_type": "online",
            "include_granted_scopes": "true",
            "prompt": "select_account",
        })
        self.redirect(
            "https://accounts.google.com/o/oauth2/v2/auth?" + params,
            social_state_cookie("google", state),
        )

    def api_google_callback(self) -> None:
        params = urllib.parse.parse_qs(urlparse(self.path).query)
        code = (params.get("code") or [""])[0]
        state = (params.get("state") or [""])[0]

        if not code or not self.validate_social_state("google", state):
            self.redirect("/?auth=social-state-error", clear_social_state_cookie())
            return

        redirect_uri = absolute_url(self, "/api/auth/google/callback")
        body = urllib.parse.urlencode({
            "code": code,
            "client_id": GOOGLE_CLIENT_ID,
            "client_secret": GOOGLE_CLIENT_SECRET,
            "redirect_uri": redirect_uri,
            "grant_type": "authorization_code",
        }).encode("utf-8")

        try:
            req = urllib.request.Request(
                "https://oauth2.googleapis.com/token",
                data=body,
                headers={"Content-Type": "application/x-www-form-urlencoded", "Accept": "application/json"},
                method="POST",
            )
            with urllib.request.urlopen(req, timeout=8) as response:
                token_data = json.loads(response.read().decode("utf-8", "ignore"))

            access_token = token_data.get("access_token") or ""
            if not access_token:
                self.redirect("/?auth=social-token-error", clear_social_state_cookie())
                return

            req = urllib.request.Request(
                "https://openidconnect.googleapis.com/v1/userinfo",
                headers={"Authorization": f"Bearer {access_token}", "Accept": "application/json"},
            )
            with urllib.request.urlopen(req, timeout=8) as response:
                profile = json.loads(response.read().decode("utf-8", "ignore"))

            self.social_login_finish(
                "google",
                str(profile.get("sub") or ""),
                str(profile.get("email") or ""),
                str(profile.get("name") or profile.get("given_name") or "Google User"),
                str(profile.get("picture") or ""),
            )
        except Exception:
            self.redirect("/?auth=social-google-error", clear_social_state_cookie())

    def api_apple_start(self) -> None:
        if not provider_enabled("apple"):
            self.redirect("/?auth=social-provider-disabled")
            return

        state = secrets.token_urlsafe(24)
        redirect_uri = absolute_url(self, "/api/auth/apple/callback")
        params = urllib.parse.urlencode({
            "client_id": APPLE_CLIENT_ID,
            "redirect_uri": redirect_uri,
            "response_type": "code id_token",
            "response_mode": "form_post",
            "scope": "name email",
            "state": state,
        })
        self.redirect(
            "https://appleid.apple.com/auth/authorize?" + params,
            social_state_cookie("apple", state),
        )

    def api_apple_callback(self, form_data: dict[str, str] | None = None) -> None:
        if form_data is None:
            params = urllib.parse.parse_qs(urlparse(self.path).query)
            form_data = {key: (value[0] if value else "") for key, value in params.items()}

        code = form_data.get("code", "")
        state = form_data.get("state", "")
        id_token_from_form = form_data.get("id_token", "")

        if not code or not self.validate_social_state("apple", state):
            self.redirect("/?auth=social-state-error", clear_social_state_cookie())
            return

        redirect_uri = absolute_url(self, "/api/auth/apple/callback")
        body = urllib.parse.urlencode({
            "client_id": APPLE_CLIENT_ID,
            "client_secret": APPLE_CLIENT_SECRET,
            "code": code,
            "grant_type": "authorization_code",
            "redirect_uri": redirect_uri,
        }).encode("utf-8")

        try:
            req = urllib.request.Request(
                "https://appleid.apple.com/auth/token",
                data=body,
                headers={"Content-Type": "application/x-www-form-urlencoded", "Accept": "application/json"},
                method="POST",
            )
            with urllib.request.urlopen(req, timeout=8) as response:
                token_data = json.loads(response.read().decode("utf-8", "ignore"))

            id_token = token_data.get("id_token") or id_token_from_form
            claims = base64url_decode_json(id_token)
            provider_user_id = str(claims.get("sub") or "")
            email = str(claims.get("email") or "")

            name = "Apple User"
            raw_user = form_data.get("user", "")
            if raw_user:
                try:
                    user_json = json.loads(raw_user)
                    first = ((user_json.get("name") or {}).get("firstName") or "").strip()
                    last = ((user_json.get("name") or {}).get("lastName") or "").strip()
                    full = f"{first} {last}".strip()
                    if full:
                        name = full
                except Exception:
                    pass

            self.social_login_finish("apple", provider_user_id, email, name, "")
        except Exception:
            self.redirect("/?auth=social-apple-error", clear_social_state_cookie())

    def api_apple_callback_post(self) -> None:
        try:
            length = int(self.headers.get("Content-Length") or "0")
            raw = self.rfile.read(length).decode("utf-8", "ignore")
            parsed = urllib.parse.parse_qs(raw)
            data = {key: (value[0] if value else "") for key, value in parsed.items()}
        except Exception:
            data = {}
        self.api_apple_callback(data)


    def require_real_user(self) -> sqlite3.Row | None:
        session, user = self.get_user_session()
        if not session or not user:
            self.send_error_json(401, "login_required", "Login required")
            return None
        if session["role"] == "guest":
            self.send_error_json(403, "guest_forbidden", "Guest cannot use server playlists")
            return None
        return user

    def playlist_payload(self, con: sqlite3.Connection, playlist: sqlite3.Row) -> dict[str, Any]:
        rows = con.execute("""
            SELECT track_key, track_json, position, created_at
            FROM playlist_tracks
            WHERE playlist_id = ?
            ORDER BY position ASC, id ASC
        """, (playlist["id"],)).fetchall()

        tracks_payload = []
        for row in rows:
            try:
                track_data = json.loads(row["track_json"])
            except Exception:
                track_data = {}
            tracks_payload.append({
                "trackKey": row["track_key"],
                "track": track_data,
                "position": row["position"],
                "createdAt": row["created_at"],
            })

        return {
            "id": playlist["id"],
            "name": playlist["name"],
            "description": playlist["description"] or "",
            "filter": playlist["mood_filter"] or "all",
            "cover": playlist["cover"] or "",
            "createdAt": playlist["created_at"],
            "updatedAt": playlist["updated_at"],
            "tracks": tracks_payload,
            "trackCount": len(tracks_payload),
        }

    def api_get_playlists(self) -> None:
        user = self.require_real_user()
        if not user:
            return

        with db() as con:
            rows = con.execute("""
                SELECT * FROM playlists
                WHERE user_id = ?
                ORDER BY updated_at DESC, id DESC
            """, (user["id"],)).fetchall()
            playlists = [self.playlist_payload(con, row) for row in rows]

        self.send_json({"ok": True, "playlists": playlists})

    def api_get_playlist(self, playlist_id: int) -> None:
        user = self.require_real_user()
        if not user:
            return

        with db() as con:
            row = con.execute(
                "SELECT * FROM playlists WHERE id = ? AND user_id = ?",
                (playlist_id, user["id"]),
            ).fetchone()
            if not row:
                self.send_error_json(404, "playlist_not_found", "Playlist not found")
                return
            payload = self.playlist_payload(con, row)

        self.send_json({"ok": True, "playlist": payload})

    def api_create_playlist(self, data: dict[str, Any]) -> None:
        user = self.require_real_user()
        if not user:
            return

        name = str(data.get("name") or "").strip()[:80]
        description = str(data.get("description") or "").strip()[:240]
        mood_filter = str(data.get("filter") or data.get("mood") or "all").strip()[:40] or "all"
        cover = str(data.get("cover") or "").strip()[:500]
        tracks_data = data.get("tracks") if isinstance(data.get("tracks"), list) else []

        if not name:
            self.send_error_json(400, "missing_name", "Playlist name required")
            return

        with db() as con:
            cur = con.execute("""
                INSERT INTO playlists (user_id, name, description, mood_filter, cover, created_at, updated_at)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            """, (user["id"], name, description, mood_filter, cover, now_iso(), now_iso()))
            playlist_id = int(cur.lastrowid)

            position = 0
            for raw_track in tracks_data[:500]:
                if not isinstance(raw_track, dict):
                    continue
                cleaned = clean_track_for_playlist(raw_track)
                key = str(raw_track.get("trackKey") or raw_track.get("key") or playlist_track_key(cleaned))
                con.execute("""
                    INSERT OR IGNORE INTO playlist_tracks (playlist_id, track_key, track_json, position, created_at)
                    VALUES (?, ?, ?, ?, ?)
                """, (playlist_id, key, json.dumps(cleaned, ensure_ascii=False), position, now_iso()))
                position += 1

            con.execute("UPDATE playlists SET updated_at = ? WHERE id = ?", (now_iso(), playlist_id))
            con.commit()

            row = con.execute("SELECT * FROM playlists WHERE id = ?", (playlist_id,)).fetchone()
            payload = self.playlist_payload(con, row)

        self.send_json({"ok": True, "playlist": payload}, status=201)

    def api_add_playlist_track(self, playlist_id: int, data: dict[str, Any]) -> None:
        user = self.require_real_user()
        if not user:
            return

        raw_track = data.get("track")
        if not isinstance(raw_track, dict):
            self.send_error_json(400, "missing_track", "Track object required")
            return

        cleaned = clean_track_for_playlist(raw_track)
        key = str(data.get("trackKey") or raw_track.get("trackKey") or playlist_track_key(cleaned))

        with db() as con:
            playlist = con.execute(
                "SELECT * FROM playlists WHERE id = ? AND user_id = ?",
                (playlist_id, user["id"]),
            ).fetchone()
            if not playlist:
                self.send_error_json(404, "playlist_not_found", "Playlist not found")
                return

            row = con.execute(
                "SELECT COALESCE(MAX(position), -1) AS max_position FROM playlist_tracks WHERE playlist_id = ?",
                (playlist_id,),
            ).fetchone()
            position = int(row["max_position"] or -1) + 1

            con.execute("""
                INSERT OR IGNORE INTO playlist_tracks (playlist_id, track_key, track_json, position, created_at)
                VALUES (?, ?, ?, ?, ?)
            """, (playlist_id, key, json.dumps(cleaned, ensure_ascii=False), position, now_iso()))
            con.execute("UPDATE playlists SET updated_at = ? WHERE id = ?", (now_iso(), playlist_id))
            con.commit()

            updated = con.execute("SELECT * FROM playlists WHERE id = ?", (playlist_id,)).fetchone()
            payload = self.playlist_payload(con, updated)

        self.send_json({"ok": True, "playlist": payload, "trackKey": key})

    def api_remove_playlist_track(self, playlist_id: int, key: str) -> None:
        user = self.require_real_user()
        if not user:
            return

        key = str(key or "").strip()
        if not key:
            self.send_error_json(400, "missing_track_key", "Track key required")
            return

        with db() as con:
            playlist = con.execute(
                "SELECT * FROM playlists WHERE id = ? AND user_id = ?",
                (playlist_id, user["id"]),
            ).fetchone()
            if not playlist:
                self.send_error_json(404, "playlist_not_found", "Playlist not found")
                return

            con.execute(
                "DELETE FROM playlist_tracks WHERE playlist_id = ? AND track_key = ?",
                (playlist_id, key),
            )
            con.execute("UPDATE playlists SET updated_at = ? WHERE id = ?", (now_iso(), playlist_id))
            con.commit()

        self.send_json({"ok": True})

    def api_delete_playlist(self, playlist_id: int) -> None:
        user = self.require_real_user()
        if not user:
            return

        with db() as con:
            row = con.execute(
                "SELECT * FROM playlists WHERE id = ? AND user_id = ?",
                (playlist_id, user["id"]),
            ).fetchone()
            if not row:
                self.send_error_json(404, "playlist_not_found", "Playlist not found")
                return
            con.execute("DELETE FROM playlists WHERE id = ?", (playlist_id,))
            con.commit()

        self.send_json({"ok": True})


    def track_row_by_id(self, track_id: int) -> sqlite3.Row | None:
        with db() as con:
            return con.execute("SELECT * FROM tracks WHERE id = ?", (track_id,)).fetchone()

    def api_admin_update_track(self, track_id: int, data: dict[str, Any]) -> None:
        if not self.require_admin():
            return

        title = str(data.get("title") or "").strip()
        artist = str(data.get("artist") or "").strip()
        source_type = str(data.get("sourceType") or data.get("source_type") or "").strip().lower()
        external_url = str(data.get("externalUrl") or data.get("url") or "").strip()
        page_url = str(data.get("pageUrl") or data.get("page_url") or external_url or "").strip()
        cover_url = str(data.get("coverUrl") or data.get("cover_url") or "").strip()
        source_label = str(data.get("sourceLabel") or data.get("source_label") or "").strip()

        allowed_sources = {"upload", "direct", "youtube", "spotify", "soundcloud", "jamendo", "internet_archive"}
        if source_type and source_type not in allowed_sources:
            self.send_error_json(400, "bad_source", "Unsupported source")
            return

        with db() as con:
            row = con.execute("SELECT * FROM tracks WHERE id = ?", (track_id,)).fetchone()
            if not row:
                self.send_error_json(404, "track_not_found", "Track not found")
                return

            current_source = row_value(row, "source_type", "upload")
            next_source = source_type or current_source

            if not title:
                title = row["title"]
            if not artist:
                artist = row["artist"]

            if next_source == "upload":
                # Local uploads keep their stored audio file. Only metadata and optional remote cover URL are edited here.
                external_url = row_value(row, "external_url", "") or ""
                page_url = row_value(row, "page_url", "") or ""
                source_label = source_label or row_value(row, "source_label", "Server") or "Server"
            elif next_source == "direct":
                if not is_http_url(external_url):
                    self.send_error_json(400, "bad_url", "Direct URL must start with http:// or https://")
                    return
                source_label = source_label or "Direct URL"
            else:
                if not is_http_url(external_url):
                    self.send_error_json(400, "bad_url", "External URL must start with http:// or https://")
                    return
                source_label = source_label or next_source.capitalize()

            if cover_url and not is_http_url(cover_url):
                self.send_error_json(400, "bad_cover_url", "Cover URL must start with http:// or https://")
                return

            con.execute("""
                UPDATE tracks
                SET title = ?, artist = ?, source_type = ?, external_url = ?, page_url = ?, cover_url = ?, source_label = ?, updated_at = ?
                WHERE id = ?
            """, (
                title,
                artist,
                next_source,
                external_url or None,
                page_url or external_url or None,
                cover_url or None,
                source_label or None,
                now_iso(),
                track_id,
            ))
            con.commit()
            updated = con.execute("SELECT * FROM tracks WHERE id = ?", (track_id,)).fetchone()

        self.send_json({"ok": True, "track": row_to_track(updated)})

    def api_admin_export_content(self) -> None:
        if not self.require_admin():
            return

        export_tables = [
            "tracks",
            "playlists",
            "playlist_tracks",
            "external_likes",
            "user_preferences",
            "ai_learning_stats",
            "recent_searches",
            "social_accounts",
        ]

        payload: dict[str, Any] = {
            "ok": True,
            "type": "nyami_content_backup",
            "version": "v59",
            "createdAt": now_iso(),
            "tables": {},
            "notes": [
                "No password hashes, no user sessions, no admin sessions are exported.",
                "This is a content backup for tracks, playlists, preferences and social links."
            ],
        }

        with db() as con:
            for table in export_tables:
                try:
                    rows = con.execute(f"SELECT * FROM {table}").fetchall()
                    table_rows = []
                    for row in rows:
                        item = {key: row[key] for key in row.keys()}
                        if table == "social_accounts":
                            # Keep enough for admin reference, avoid exporting provider_user_id by default.
                            item.pop("provider_user_id", None)
                        table_rows.append(item)
                    payload["tables"][table] = table_rows
                except Exception:
                    payload["tables"][table] = []

            try:
                users = con.execute("SELECT id, name, email, nick, phone, profile_json, created_at, updated_at FROM users").fetchall()
                payload["tables"]["users_public"] = [{key: row[key] for key in row.keys()} for row in users]
            except Exception:
                payload["tables"]["users_public"] = []

        filename = f"nyami_content_backup_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
        self.send_json(
            payload,
            extra_headers={"Content-Disposition": f'attachment; filename="{filename}"'}
        )

    def api_admin_import_content(self, data: dict[str, Any]) -> None:
        if not self.require_admin():
            return

        backup = data.get("backup") if isinstance(data.get("backup"), dict) else data
        tables = backup.get("tables") if isinstance(backup.get("tables"), dict) else {}
        mode = str(data.get("mode") or backup.get("mode") or "merge").lower()
        imported = {"tracks": 0, "playlists": 0, "playlist_tracks": 0}

        if mode not in {"merge", "replace"}:
            mode = "merge"

        with db() as con:
            if mode == "replace":
                for table in ["playlist_tracks", "playlists", "tracks"]:
                    try:
                        con.execute(f"DELETE FROM {table}")
                    except Exception:
                        pass

            for row in tables.get("tracks", []):
                if not isinstance(row, dict):
                    continue

                title = str(row.get("title") or "").strip()
                artist = str(row.get("artist") or "").strip()
                if not title or not artist:
                    continue

                audio_file = str(row.get("audio_file") or "").strip()
                cover_file = str(row.get("cover_file") or "").strip() or None
                source_type = str(row.get("source_type") or "upload").strip().lower()
                external_url = str(row.get("external_url") or "").strip() or None
                page_url = str(row.get("page_url") or "").strip() or external_url
                cover_url = str(row.get("cover_url") or "").strip() or None
                source_label = str(row.get("source_label") or "").strip() or None

                con.execute("""
                    INSERT INTO tracks
                      (title, artist, audio_file, cover_file, source_type, external_url, page_url, cover_url, source_label, created_at, updated_at)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                """, (
                    title,
                    artist,
                    audio_file,
                    cover_file,
                    source_type,
                    external_url,
                    page_url,
                    cover_url,
                    source_label,
                    row.get("created_at") or now_iso(),
                    now_iso(),
                ))
                imported["tracks"] += 1

            # Playlists are imported only when the referenced user_id exists.
            user_ids = {r["id"] for r in con.execute("SELECT id FROM users").fetchall()}
            old_to_new_playlist: dict[int, int] = {}

            for row in tables.get("playlists", []):
                if not isinstance(row, dict):
                    continue
                user_id = int(row.get("user_id") or 0)
                if user_id not in user_ids:
                    continue

                cur = con.execute("""
                    INSERT INTO playlists (user_id, name, description, mood_filter, cover, created_at, updated_at)
                    VALUES (?, ?, ?, ?, ?, ?, ?)
                """, (
                    user_id,
                    str(row.get("name") or "Imported playlist")[:100],
                    str(row.get("description") or "")[:240],
                    str(row.get("mood_filter") or "all")[:40],
                    str(row.get("cover") or "")[:500],
                    row.get("created_at") or now_iso(),
                    now_iso(),
                ))
                old_id = int(row.get("id") or 0)
                old_to_new_playlist[old_id] = int(cur.lastrowid)
                imported["playlists"] += 1

            for row in tables.get("playlist_tracks", []):
                if not isinstance(row, dict):
                    continue
                old_playlist_id = int(row.get("playlist_id") or 0)
                new_playlist_id = old_to_new_playlist.get(old_playlist_id)
                if not new_playlist_id:
                    continue

                con.execute("""
                    INSERT OR IGNORE INTO playlist_tracks (playlist_id, track_key, track_json, position, created_at)
                    VALUES (?, ?, ?, ?, ?)
                """, (
                    new_playlist_id,
                    str(row.get("track_key") or secrets.token_hex(8)),
                    str(row.get("track_json") or "{}"),
                    int(row.get("position") or 0),
                    row.get("created_at") or now_iso(),
                ))
                imported["playlist_tracks"] += 1

            con.commit()

        self.send_json({"ok": True, "mode": mode, "imported": imported})

    def api_user_stats(self) -> None:
        session, user = self.get_user_session()
        if not session or not user or session["role"] == "guest":
            self.send_json({"ok": True, "authenticated": False, "stats": {}})
            return

        identity = f"user:{user['id']}"
        with db() as con:
            playlists = con.execute("SELECT COUNT(*) AS c FROM playlists WHERE user_id = ?", (user["id"],)).fetchone()["c"]
            playlist_tracks = con.execute("""
                SELECT COUNT(*) AS c
                FROM playlist_tracks pt
                JOIN playlists p ON p.id = pt.playlist_id
                WHERE p.user_id = ?
            """, (user["id"],)).fetchone()["c"]
            external_likes = con.execute("SELECT COUNT(*) AS c FROM external_likes WHERE identity = ?", (identity,)).fetchone()["c"]
            events = con.execute("SELECT COUNT(*) AS c FROM user_events WHERE identity = ?", (identity,)).fetchone()["c"]

            top_sources = con.execute("""
                SELECT pref_value, weight FROM user_preferences
                WHERE identity = ? AND pref_key = 'source'
                ORDER BY weight DESC LIMIT 5
            """, (identity,)).fetchall()
            top_artists = con.execute("""
                SELECT pref_value, weight FROM user_preferences
                WHERE identity = ? AND pref_key = 'artist'
                ORDER BY weight DESC LIMIT 5
            """, (identity,)).fetchall()
            top_moods = con.execute("""
                SELECT pref_value, weight FROM user_preferences
                WHERE identity = ? AND pref_key = 'mood'
                ORDER BY weight DESC LIMIT 5
            """, (identity,)).fetchall()

        self.send_json({
            "ok": True,
            "authenticated": True,
            "stats": {
                "playlists": playlists,
                "playlistTracks": playlist_tracks,
                "externalLikes": external_likes,
                "events": events,
                "topSources": [{"value": row["pref_value"], "weight": row["weight"]} for row in top_sources],
                "topArtists": [{"value": row["pref_value"], "weight": row["weight"]} for row in top_artists],
                "topMoods": [{"value": row["pref_value"], "weight": row["weight"]} for row in top_moods],
            },
        })

    def api_recommendations(self) -> None:
        identity, allow_ai, _ = self.ai_identity()

        with db() as con:
            track_rows = con.execute("SELECT * FROM tracks ORDER BY id DESC LIMIT 80").fetchall()
            candidates: list[dict[str, Any]] = []
            for row in track_rows:
                item = row_to_track(row)
                candidates.append({
                    "kind": "track",
                    "score": 1.0,
                    "track": {
                        "title": item.get("title"),
                        "artist": item.get("artist"),
                        "vibe": "new",
                        "category": "new",
                        "duration": "server",
                        "cover": item.get("coverUrl") or "assets/covers/nowplaying.jpg",
                        "file": item.get("audioUrl") or "",
                        "source": "server-v48",
                        "sourceType": item.get("sourceType"),
                        "sourceLabel": item.get("sourceLabel"),
                        "serverId": item.get("id"),
                        "playerType": "local_audio" if item.get("isPlayable") else "",
                        "playUrl": item.get("audioUrl") or item.get("externalUrl") or "",
                        "embedUrl": item.get("embedUrl") or "",
                        "pageUrl": item.get("pageUrl") or "",
                        "isServerTrack": True,
                    },
                })

            if identity:
                liked_rows = con.execute("""
                    SELECT source, title, artist, play_url, embed_url, player_type, thumbnail, created_at
                    FROM external_likes
                    WHERE identity = ?
                    ORDER BY created_at DESC
                    LIMIT 60
                """, (identity,)).fetchall()
                for row in liked_rows:
                    candidates.append({
                        "kind": "external_like",
                        "score": 5.0,
                        "track": {
                            "title": row["title"],
                            "artist": row["artist"] or row["source"],
                            "vibe": "liked",
                            "category": "liked",
                            "duration": "external",
                            "cover": row["thumbnail"] or "assets/covers/nowplaying.jpg",
                            "file": row["play_url"] or "",
                            "source": "universal-v54",
                            "sourceType": row["source"],
                            "sourceLabel": row["source"],
                            "playerType": row["player_type"],
                            "playUrl": row["play_url"],
                            "embedUrl": row["embed_url"],
                            "pageUrl": row["play_url"],
                            "isExternalSearch": True,
                        },
                    })

                prefs = con.execute("""
                    SELECT pref_key, pref_value, weight
                    FROM user_preferences
                    WHERE identity = ?
                """, (identity,)).fetchall()
                pref_weights = {(row["pref_key"], row["pref_value"]): float(row["weight"]) for row in prefs}
            else:
                pref_weights = {}

        if identity and allow_ai:
            for item in candidates:
                track = item["track"]
                source = normalize_pref(track.get("sourceType") or track.get("sourceLabel") or track.get("source"))
                artist = normalize_pref(track.get("artist"))
                mood = normalize_pref(track.get("vibe"))
                item["score"] += pref_weights.get(("source", source), 0) * 2.0
                item["score"] += pref_weights.get(("artist", artist), 0) * 1.8
                item["score"] += pref_weights.get(("mood", mood), 0) * 1.2

        candidates.sort(key=lambda item: item.get("score", 0), reverse=True)
        self.send_json({
            "ok": True,
            "personalized": bool(identity and allow_ai),
            "recommendations": candidates[:12],
        })


    def api_history_add(self, data: dict[str, Any]) -> None:
        identity, allow_ai, _ = self.ai_identity()
        if not identity:
            session, user = self.get_user_session()
            if user:
                identity = f"user:{user['id']}"
            else:
                self.send_json({"ok": True, "saved": False, "reason": "no_identity"})
                return

        raw_track = data.get("track")
        if not isinstance(raw_track, dict):
            self.send_error_json(400, "missing_track", "Track object required")
            return

        cleaned = clean_queue_track(raw_track)
        key = str(data.get("trackKey") or raw_track.get("trackKey") or queue_track_key(cleaned))
        event_type = str(data.get("eventType") or data.get("event_type") or "play").strip()[:40] or "play"

        with db() as con:
            con.execute("""
                INSERT INTO listening_history (identity, track_key, track_json, event_type, created_at)
                VALUES (?, ?, ?, ?, ?)
            """, (identity, key, json.dumps(cleaned, ensure_ascii=False), event_type, now_iso()))

            # Keep history from growing forever per identity.
            con.execute("""
                DELETE FROM listening_history
                WHERE identity = ?
                  AND id NOT IN (
                    SELECT id FROM listening_history
                    WHERE identity = ?
                    ORDER BY created_at DESC
                    LIMIT 300
                  )
            """, (identity, identity))
            con.commit()

        if allow_ai:
            self.save_user_event({
                "event_type": event_type,
                "source": cleaned.get("sourceType") or cleaned.get("sourceLabel") or cleaned.get("source") or "local",
                "title": cleaned.get("title") or "",
                "artist": cleaned.get("artist") or "",
                "mood": cleaned.get("vibe") or cleaned.get("category") or "",
            })

        self.send_json({"ok": True, "saved": True, "trackKey": key})

    def api_history_get(self) -> None:
        identity, _, _ = self.ai_identity()
        if not identity:
            session, user = self.get_user_session()
            if user:
                identity = f"user:{user['id']}"

        if not identity:
            self.send_json({"ok": True, "history": []})
            return

        with db() as con:
            rows = con.execute("""
                SELECT track_key, track_json, event_type, created_at
                FROM listening_history
                WHERE identity = ?
                ORDER BY created_at DESC
                LIMIT 60
            """, (identity,)).fetchall()

        history = []
        seen = set()
        for row in rows:
            key = row["track_key"]
            if key in seen:
                continue
            seen.add(key)
            try:
                track = json.loads(row["track_json"])
            except Exception:
                track = {}
            history.append({
                "trackKey": key,
                "track": track,
                "eventType": row["event_type"],
                "createdAt": row["created_at"],
            })

        self.send_json({"ok": True, "history": history[:30]})

    def api_history_clear(self) -> None:
        identity, _, _ = self.ai_identity()
        if not identity:
            session, user = self.get_user_session()
            if user:
                identity = f"user:{user['id']}"

        if identity:
            with db() as con:
                con.execute("DELETE FROM listening_history WHERE identity = ?", (identity,))
                con.commit()

        self.send_json({"ok": True})

    def api_smart_mix(self, data: dict[str, Any]) -> None:
        identity, allow_ai, _ = self.ai_identity()
        seed = data.get("seed") if isinstance(data.get("seed"), dict) else {}
        seed = clean_queue_track(seed) if seed else {}
        limit = int(data.get("limit") or 20)
        limit = max(5, min(limit, 40))

        candidates: list[dict[str, Any]] = []

        with db() as con:
            # Server/admin tracks.
            try:
                track_rows = con.execute("SELECT * FROM tracks ORDER BY id DESC LIMIT 150").fetchall()
                for row in track_rows:
                    item = row_to_track(row)
                    player_type = "local_audio" if item.get("isPlayable") else ""
                    if item.get("sourceType") == "youtube":
                        player_type = "youtube_embed"
                    elif item.get("sourceType") == "spotify":
                        player_type = "spotify_embed"
                    elif item.get("sourceType") == "soundcloud":
                        player_type = "soundcloud_embed"
                    candidates.append({
                        "title": item.get("title") or "Untitled",
                        "artist": item.get("artist") or "Unknown",
                        "vibe": "new",
                        "category": "new",
                        "duration": "mix",
                        "cover": item.get("coverUrl") or "assets/covers/nowplaying.jpg",
                        "file": item.get("audioUrl") or item.get("externalUrl") or "",
                        "source": "server-v48",
                        "sourceType": item.get("sourceType") or "",
                        "sourceLabel": item.get("sourceLabel") or "",
                        "serverId": item.get("id"),
                        "playerType": player_type,
                        "playUrl": item.get("audioUrl") or item.get("externalUrl") or "",
                        "embedUrl": item.get("embedUrl") or "",
                        "pageUrl": item.get("pageUrl") or "",
                        "isServerTrack": True,
                    })
            except Exception:
                pass

            # User liked external tracks and recent history are very useful for mix.
            if identity:
                try:
                    rows = con.execute("""
                        SELECT track_json FROM listening_history
                        WHERE identity = ?
                        ORDER BY created_at DESC
                        LIMIT 120
                    """, (identity,)).fetchall()
                    for row in rows:
                        try:
                            candidates.append(json.loads(row["track_json"]))
                        except Exception:
                            pass
                except Exception:
                    pass

                try:
                    liked = con.execute("""
                        SELECT source, title, artist, play_url, embed_url, player_type, thumbnail
                        FROM external_likes
                        WHERE identity = ?
                        ORDER BY created_at DESC
                        LIMIT 100
                    """, (identity,)).fetchall()
                    for row in liked:
                        candidates.append({
                            "title": row["title"] or "Untitled",
                            "artist": row["artist"] or row["source"] or "Unknown",
                            "vibe": "liked",
                            "category": "liked",
                            "duration": "mix",
                            "cover": row["thumbnail"] or "assets/covers/nowplaying.jpg",
                            "file": row["play_url"] or "",
                            "source": "universal-v54",
                            "sourceType": row["source"] or "",
                            "sourceLabel": row["source"] or "",
                            "playerType": row["player_type"] or "",
                            "playUrl": row["play_url"] or "",
                            "embedUrl": row["embed_url"] or "",
                            "pageUrl": row["play_url"] or "",
                            "isExternalSearch": True,
                        })
                except Exception:
                    pass

                try:
                    prefs = con.execute("""
                        SELECT pref_key, pref_value, weight
                        FROM user_preferences
                        WHERE identity = ?
                    """, (identity,)).fetchall()
                    pref_weights = {(row["pref_key"], row["pref_value"]): float(row["weight"]) for row in prefs}
                except Exception:
                    pref_weights = {}
            else:
                pref_weights = {}

        seed_key = queue_track_key(seed) if seed else ""
        scored = []
        seen = set()

        for raw in candidates:
            if not isinstance(raw, dict):
                continue
            cleaned = clean_queue_track(raw)
            key = queue_track_key(cleaned)
            if key in seen or (seed_key and key == seed_key):
                continue
            seen.add(key)

            score = 1.0
            if seed:
                score += similarity_score(seed, cleaned)

            if identity and allow_ai:
                source = normalize_pref(cleaned.get("sourceType") or cleaned.get("sourceLabel") or cleaned.get("source"))
                artist = normalize_pref(cleaned.get("artist"))
                mood = normalize_pref(cleaned.get("vibe") or cleaned.get("category"))
                score += pref_weights.get(("source", source), 0) * 1.8
                score += pref_weights.get(("artist", artist), 0) * 2.2
                score += pref_weights.get(("mood", mood), 0) * 1.4

            scored.append({"score": round(score, 3), "trackKey": key, "track": cleaned})

        scored.sort(key=lambda item: item["score"], reverse=True)
        self.send_json({
            "ok": True,
            "personalized": bool(identity and allow_ai),
            "seed": seed,
            "mix": scored[:limit],
        })


    def api_playlist_share_create(self, playlist_id: int) -> None:
        user = self.require_real_user()
        if not user:
            return

        with db() as con:
            playlist = con.execute(
                "SELECT * FROM playlists WHERE id = ? AND user_id = ?",
                (playlist_id, user["id"]),
            ).fetchone()
            if not playlist:
                self.send_error_json(404, "playlist_not_found", "Playlist not found")
                return

            share = con.execute(
                "SELECT * FROM playlist_shares WHERE playlist_id = ? AND user_id = ?",
                (playlist_id, user["id"]),
            ).fetchone()

            if not share:
                share_id = secrets.token_urlsafe(9).replace("-", "").replace("_", "")[:12]
                while con.execute("SELECT 1 FROM playlist_shares WHERE share_id = ?", (share_id,)).fetchone():
                    share_id = secrets.token_urlsafe(9).replace("-", "").replace("_", "")[:12]

                con.execute("""
                    INSERT INTO playlist_shares (playlist_id, user_id, share_id, is_public, created_at, updated_at)
                    VALUES (?, ?, ?, 1, ?, ?)
                """, (playlist_id, user["id"], share_id, now_iso(), now_iso()))
            else:
                share_id = share["share_id"]
                con.execute("""
                    UPDATE playlist_shares
                    SET is_public = 1, updated_at = ?
                    WHERE id = ?
                """, (now_iso(), share["id"]))

            con.commit()

        self.send_json({
            "ok": True,
            "shareId": share_id,
            "url": f"/?playlist={share_id}",
        })

    def api_playlist_share_disable(self, playlist_id: int) -> None:
        user = self.require_real_user()
        if not user:
            return

        with db() as con:
            con.execute("""
                UPDATE playlist_shares
                SET is_public = 0, updated_at = ?
                WHERE playlist_id = ? AND user_id = ?
            """, (now_iso(), playlist_id, user["id"]))
            con.commit()

        self.send_json({"ok": True})

    def api_public_playlist(self, share_id: str) -> None:
        share_id = re.sub(r"[^a-zA-Z0-9]", "", str(share_id or ""))[:40]
        if not share_id:
            self.send_error_json(400, "missing_share_id", "Missing share id")
            return

        with db() as con:
            share = con.execute(
                "SELECT * FROM playlist_shares WHERE share_id = ? AND is_public = 1",
                (share_id,),
            ).fetchone()
            if not share:
                self.send_error_json(404, "public_playlist_not_found", "Public playlist not found")
                return

            payload = public_playlist_payload(con, share)
            if not payload:
                self.send_error_json(404, "public_playlist_not_found", "Public playlist not found")
                return

        self.send_json({"ok": True, "playlist": payload})

    def api_lyrics_get(self, key: str) -> None:
        key = str(key or "").strip()[:80]
        if not key:
            self.send_json({"ok": True, "lyrics": ""})
            return

        with db() as con:
            row = con.execute("SELECT * FROM track_lyrics WHERE track_key = ?", (key,)).fetchone()

        if not row:
            self.send_json({"ok": True, "lyrics": ""})
            return

        self.send_json({
            "ok": True,
            "trackKey": row["track_key"],
            "title": row["title"] or "",
            "artist": row["artist"] or "",
            "lyrics": row["lyrics"] or "",
            "updatedAt": row["updated_at"],
        })

    def api_lyrics_save(self, data: dict[str, Any]) -> None:
        if not self.require_admin():
            return

        track = data.get("track") if isinstance(data.get("track"), dict) else {}
        key = str(data.get("trackKey") or data.get("key") or "").strip()
        if not key and track:
            key = release_track_key(track)

        title = str(data.get("title") or track.get("title") or "").strip()[:200]
        artist = str(data.get("artist") or track.get("artist") or "").strip()[:200]
        lyrics = str(data.get("lyrics") or "").strip()

        if not key:
            self.send_error_json(400, "missing_track_key", "Missing track key")
            return

        with db() as con:
            con.execute("""
                INSERT INTO track_lyrics (track_key, title, artist, lyrics, updated_at)
                VALUES (?, ?, ?, ?, ?)
                ON CONFLICT(track_key)
                DO UPDATE SET title = excluded.title, artist = excluded.artist, lyrics = excluded.lyrics, updated_at = excluded.updated_at
            """, (key, title, artist, lyrics, now_iso()))
            con.commit()

        self.send_json({"ok": True, "trackKey": key})

    def api_artists(self) -> None:
        artists: dict[str, dict[str, Any]] = {}

        def add_artist(name: str, source: str = "track") -> None:
            name = str(name or "").strip()
            if not name:
                return
            key = normalize_pref(name)
            if not key:
                return
            item = artists.setdefault(key, {"name": name, "count": 0, "sources": set()})
            item["count"] += 1
            item["sources"].add(source)

        with db() as con:
            try:
                for row in con.execute("SELECT artist FROM tracks WHERE artist IS NOT NULL AND artist != ''").fetchall():
                    add_artist(row["artist"], "server")
            except Exception:
                pass

            try:
                for row in con.execute("SELECT artist FROM external_likes WHERE artist IS NOT NULL AND artist != ''").fetchall():
                    add_artist(row["artist"], "liked")
            except Exception:
                pass

            try:
                for row in con.execute("SELECT artist FROM track_lyrics WHERE artist IS NOT NULL AND artist != ''").fetchall():
                    add_artist(row["artist"], "lyrics")
            except Exception:
                pass

        payload = []
        for item in artists.values():
            payload.append({
                "name": item["name"],
                "count": item["count"],
                "sources": sorted(item["sources"]),
            })
        payload.sort(key=lambda x: (-x["count"], x["name"].lower()))

        self.send_json({"ok": True, "artists": payload[:150]})

    def api_artist_detail(self, artist_query: str) -> None:
        artist_query = str(artist_query or "").strip()
        artist_norm = normalize_pref(artist_query)
        if not artist_norm:
            self.send_error_json(400, "missing_artist", "Missing artist")
            return

        tracks_payload: list[dict[str, Any]] = []
        lyrics_payload: list[dict[str, Any]] = []

        with db() as con:
            try:
                rows = con.execute("""
                    SELECT * FROM tracks
                    WHERE LOWER(artist) LIKE ?
                    ORDER BY id DESC
                    LIMIT 80
                """, (f"%{artist_norm}%",)).fetchall()
                for row in rows:
                    item = row_to_track(row)
                    player_type = "local_audio" if item.get("isPlayable") else ""
                    if item.get("sourceType") == "youtube":
                        player_type = "youtube_embed"
                    elif item.get("sourceType") == "spotify":
                        player_type = "spotify_embed"
                    elif item.get("sourceType") == "soundcloud":
                        player_type = "soundcloud_embed"
                    tracks_payload.append({
                        "title": item.get("title") or "Untitled",
                        "artist": item.get("artist") or artist_query,
                        "vibe": "artist",
                        "category": "artist",
                        "duration": "artist",
                        "cover": item.get("coverUrl") or "assets/covers/nowplaying.jpg",
                        "file": item.get("audioUrl") or item.get("externalUrl") or "",
                        "source": "server-v48",
                        "sourceType": item.get("sourceType") or "",
                        "sourceLabel": item.get("sourceLabel") or "",
                        "serverId": item.get("id"),
                        "playerType": player_type,
                        "playUrl": item.get("audioUrl") or item.get("externalUrl") or "",
                        "embedUrl": item.get("embedUrl") or "",
                        "pageUrl": item.get("pageUrl") or "",
                        "isServerTrack": True,
                    })
            except Exception:
                pass

            try:
                rows = con.execute("""
                    SELECT source, title, artist, play_url, embed_url, player_type, thumbnail
                    FROM external_likes
                    WHERE LOWER(artist) LIKE ?
                    ORDER BY created_at DESC
                    LIMIT 80
                """, (f"%{artist_norm}%",)).fetchall()
                for row in rows:
                    tracks_payload.append({
                        "title": row["title"] or "Untitled",
                        "artist": row["artist"] or artist_query,
                        "vibe": "liked",
                        "category": "liked",
                        "duration": "external",
                        "cover": row["thumbnail"] or "assets/covers/nowplaying.jpg",
                        "file": row["play_url"] or "",
                        "source": "universal-v54",
                        "sourceType": row["source"] or "",
                        "sourceLabel": row["source"] or "",
                        "playerType": row["player_type"] or "",
                        "playUrl": row["play_url"] or "",
                        "embedUrl": row["embed_url"] or "",
                        "pageUrl": row["play_url"] or "",
                        "isExternalSearch": True,
                    })
            except Exception:
                pass

            try:
                rows = con.execute("""
                    SELECT track_key, title, artist, lyrics, updated_at
                    FROM track_lyrics
                    WHERE LOWER(artist) LIKE ?
                    ORDER BY updated_at DESC
                    LIMIT 50
                """, (f"%{artist_norm}%",)).fetchall()
                lyrics_payload = [
                    {
                        "trackKey": row["track_key"],
                        "title": row["title"] or "",
                        "artist": row["artist"] or "",
                        "lyricsPreview": (row["lyrics"] or "")[:260],
                        "updatedAt": row["updated_at"],
                    }
                    for row in rows
                ]
            except Exception:
                pass

        seen = set()
        deduped = []
        for item in tracks_payload:
            key = release_track_key(item)
            if key in seen:
                continue
            seen.add(key)
            deduped.append(item)

        self.send_json({
            "ok": True,
            "artist": artist_query,
            "tracks": deduped[:100],
            "lyrics": lyrics_payload,
            "trackCount": len(deduped),
        })


    def api_health(self) -> None:
        checks: dict[str, Any] = {
            "ok": True,
            "build": APP_BUILD,
            "startedAt": APP_STARTED_AT if APP_STARTED_AT != "booting" else now_iso(),
            "time": now_iso(),
            "storage": {"storageRoot": str(STORAGE_DIR)},
            "database": {},
            "features": {
                "admin": True,
                "universalSearch": True,
                "fullLegalSearch": True,
                "socialAuth": True,
                "serverPlaylists": True,
                "queueHistorySmartMix": True,
                "mobileLogo": True,
                "releasePack": True,
                "pwa": True,
            }
        }

        try:
            DATA_DIR.mkdir(parents=True, exist_ok=True)
            UPLOAD_MUSIC_DIR.mkdir(parents=True, exist_ok=True)
            UPLOAD_COVERS_DIR.mkdir(parents=True, exist_ok=True)

            checks["storage"] = {
                "dataDir": str(DATA_DIR),
                "uploadsMusicDir": str(UPLOAD_MUSIC_DIR),
                "uploadsCoversDir": str(UPLOAD_COVERS_DIR),
                "dataWritable": os.access(DATA_DIR, os.W_OK),
                "musicWritable": os.access(UPLOAD_MUSIC_DIR, os.W_OK),
                "coversWritable": os.access(UPLOAD_COVERS_DIR, os.W_OK),
            }
        except Exception as exc:
            checks["ok"] = False
            checks["storageError"] = str(exc)

        try:
            with db() as con:
                table_rows = con.execute("""
                    SELECT name FROM sqlite_master
                    WHERE type = 'table'
                    ORDER BY name
                """).fetchall()
                tables = [row["name"] for row in table_rows]
                checks["database"] = {
                    "connected": True,
                    "tables": tables,
                    "tableCount": len(tables),
                }
        except Exception as exc:
            checks["ok"] = False
            checks["database"] = {
                "connected": False,
                "error": str(exc),
            }

        self.send_json(checks, status=200 if checks["ok"] else 500)

    def api_admin_runtime_report(self) -> None:
        if not self.require_admin():
            return

        report: dict[str, Any] = {
            "ok": True,
            "build": APP_BUILD,
            "startedAt": APP_STARTED_AT if APP_STARTED_AT != "booting" else now_iso(),
            "time": now_iso(),
            "env": {
                "storageDir": str(STORAGE_DIR),
                "dataDir": str(DATA_DIR),
                "uploadsDir": str(UPLOAD_DIR),
                "dbPath": str(DB_PATH),
                "host": os.environ.get("NYAMI_HOST") or os.environ.get("HOST") or "",
                "port": os.environ.get("NYAMI_PORT") or os.environ.get("PORT") or "",
                "googleConfigured": bool(os.environ.get("GOOGLE_CLIENT_ID") and os.environ.get("GOOGLE_CLIENT_SECRET")),
                "appleConfigured": bool(os.environ.get("APPLE_CLIENT_ID") and os.environ.get("APPLE_CLIENT_SECRET")),
                "jamendoConfigured": bool(os.environ.get("JAMENDO_CLIENT_ID")),
                "youtubeConfigured": bool(os.environ.get("YOUTUBE_API_KEY")),
                "spotifyConfigured": bool(os.environ.get("SPOTIFY_CLIENT_ID") and os.environ.get("SPOTIFY_CLIENT_SECRET")),
                "soundcloudConfigured": bool(os.environ.get("SOUNDCLOUD_CLIENT_ID")),
            },
            "counts": {},
            "storage": {},
        }

        try:
            with db() as con:
                for table in [
                    "users", "tracks", "playlists", "playlist_tracks", "playlist_shares",
                    "external_likes", "user_preferences", "user_events",
                    "listening_history", "track_lyrics", "social_accounts"
                ]:
                    try:
                        value = con.execute(f"SELECT COUNT(*) AS c FROM {table}").fetchone()["c"]
                    except Exception:
                        value = None
                    report["counts"][table] = value
        except Exception as exc:
            report["ok"] = False
            report["databaseError"] = str(exc)

        try:
            report["storage"] = {
                "dbExists": DB_PATH.exists(),
                "dbSizeBytes": DB_PATH.stat().st_size if DB_PATH.exists() else 0,
                "musicFiles": len([p for p in UPLOAD_MUSIC_DIR.glob("*") if p.is_file() and p.name != ".gitkeep"]),
                "coverFiles": len([p for p in UPLOAD_COVERS_DIR.glob("*") if p.is_file() and p.name != ".gitkeep"]),
            }
        except Exception as exc:
            report["storageError"] = str(exc)

        self.send_json(report)

    def end_headers(self) -> None:
        self.send_header("X-Content-Type-Options", "nosniff")
        self.send_header("Referrer-Policy", "strict-origin-when-cross-origin")
        self.send_header("X-Frame-Options", "SAMEORIGIN")
        super().end_headers()

    def do_HEAD(self) -> None:
        path = urlparse(self.path).path
        clean = unquote(path).lstrip("/")
        if not clean:
            clean = "index.html"

        target = (ROOT / clean).resolve()
        if not str(target).startswith(str(ROOT)) or not target.exists() or not target.is_file():
            target = ROOT / "index.html"

        content_type, _ = mimetypes.guess_type(str(target))
        content_type = content_type or "application/octet-stream"
        if target.suffix.lower() in {".html", ".css", ".js", ".json", ".svg", ".txt"} and "charset=" not in content_type.lower():
            content_type += "; charset=utf-8"

        self.send_response(200)
        self.send_header("Content-Type", content_type)
        self.send_header("Content-Length", str(target.stat().st_size))
        self.end_headers()

    def ai_identity(self) -> tuple[str | None, bool, str]:
        mode, cookie_identity = parse_ai_cookie(self.headers.get("Cookie"))
        session, user = self.get_user_session()

        if user:
            return f"user:{user['id']}", mode == "ai", mode

        if mode == "ai" and cookie_identity:
            return f"guest:{cookie_identity}", True, mode

        if mode == "necessary" and cookie_identity:
            return f"guest:{cookie_identity}", False, mode

        return None, False, mode

    def api_universal_search(self, query: str) -> None:
        identity, allow_ai, _ = self.ai_identity()
        query = str(query or "").strip()

        if not query:
            self.send_json({"ok": True, "query": "", "results": []})
            return

        results = build_universal_results(query, identity, allow_ai, limit=6)

        if identity and allow_ai:
            self.save_user_event({
                "event_type": "search",
                "query": query,
                "source": "universal",
                "title": "",
                "artist": "",
                "mood": detect_mood(query),
            })

        self.send_json({
            "ok": True,
            "query": query,
            "personalized": bool(identity and allow_ai),
            "results": results,
            "enabledSources": {
                "itunes": True,
                "jamendo": bool(JAMENDO_CLIENT_ID),
                "youtube": bool(YOUTUBE_API_KEY),
                "spotify": bool(SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET),
                "soundcloud": bool(SOUNDCLOUD_CLIENT_ID),
            },
        })

    def save_user_event(self, data: dict[str, Any]) -> None:
        identity, allow_ai, _ = self.ai_identity()
        if not identity or not allow_ai:
            return

        event_type = str(data.get("event_type") or data.get("eventType") or "play").strip()[:40]
        query = str(data.get("query") or "").strip()[:200]
        source = str(data.get("source") or "").strip()[:60]
        title = str(data.get("title") or "").strip()[:200]
        artist = str(data.get("artist") or "").strip()[:200]
        mood = str(data.get("mood") or detect_mood(query) or "").strip()[:60]

        with db() as con:
            con.execute("""
                INSERT INTO user_events (identity, event_type, query, source, title, artist, mood, created_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            """, (identity, event_type, query, source, title, artist, mood, now_iso()))
            con.commit()

        if source:
            upsert_preference(identity, "source", source, 1.0)
        if artist:
            upsert_preference(identity, "artist", artist, 1.0)
        if mood:
            upsert_preference(identity, "mood", mood, 1.0)

        update_learning_stats(identity, event_type, source, artist, mood)

        if event_type == "play":
            if source:
                upsert_preference(identity, "source", source, 1.6)
            if artist:
                upsert_preference(identity, "artist", artist, 1.4)
        elif event_type == "like":
            if source:
                upsert_preference(identity, "source", source, 3.0)
            if artist:
                upsert_preference(identity, "artist", artist, 2.8)
            if mood:
                upsert_preference(identity, "mood", mood, 2.0)
        elif event_type == "skip":
            if source:
                upsert_preference(identity, "source", source, -0.8)
            if artist:
                upsert_preference(identity, "artist", artist, -0.6)

        for word in re.findall(r"[a-zA-Zа-яА-ЯіІїЇєЄ0-9_-]{3,}", query.lower())[:8]:
            upsert_preference(identity, "query_word", word, 0.25)

    def api_play_event(self, data: dict[str, Any]) -> None:
        self.save_user_event({"event_type": "play", **data})
        self.send_json({"ok": True})

    def api_like_external_track(self, data: dict[str, Any]) -> None:
        identity, allow_ai, _ = self.ai_identity()
        if not identity or not allow_ai:
            self.send_json({"ok": True, "saved": False, "reason": "ai_consent_required"})
            return

        source = str(data.get("source") or "").strip()[:60]
        title = str(data.get("title") or "").strip()[:200]
        artist = str(data.get("artist") or "").strip()[:200]
        play_url = str(data.get("play_url") or data.get("playUrl") or "").strip()
        embed_url = str(data.get("embed_url") or data.get("embedUrl") or "").strip()
        player_type = str(data.get("player_type") or data.get("playerType") or "").strip()[:80]
        thumbnail = str(data.get("thumbnail") or "").strip()

        if not source or not title:
            self.send_error_json(400, "missing_track", "Source and title required")
            return

        with db() as con:
            con.execute("""
                INSERT OR IGNORE INTO external_likes
                (identity, source, title, artist, play_url, embed_url, player_type, thumbnail, created_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (identity, source, title, artist, play_url, embed_url, player_type, thumbnail, now_iso()))
            con.commit()

        self.save_user_event({
            "event_type": "like",
            "query": str(data.get("query") or ""),
            "source": source,
            "title": title,
            "artist": artist,
            "mood": str(data.get("mood") or ""),
        })

        self.send_json({"ok": True, "saved": True})

    def api_cookie_consent(self, data: dict[str, Any]) -> None:
        mode = str(data.get("mode") or "").strip().lower()
        if mode not in {"necessary", "ai"}:
            mode = "necessary"

        _, existing_identity = parse_ai_cookie(self.headers.get("Cookie"))
        identity = existing_identity or secrets.token_urlsafe(18)

        if mode == "ai":
            with db() as con:
                con.execute("""
                    INSERT INTO cookie_consent (identity, mode, created_at, updated_at)
                    VALUES (?, ?, ?, ?)
                    ON CONFLICT(identity)
                    DO UPDATE SET mode = excluded.mode, updated_at = excluded.updated_at
                """, (f"guest:{identity}", mode, now_iso(), now_iso()))
                con.commit()

        self.send_json(
            {"ok": True, "mode": mode, "aiEnabled": mode == "ai"},
            extra_headers=make_ai_cookie(mode, identity),
        )

    def api_reset_ai_profile(self) -> None:
        identity, _, _ = self.ai_identity()
        if identity:
            with db() as con:
                con.execute("DELETE FROM user_events WHERE identity = ?", (identity,))
                con.execute("DELETE FROM user_preferences WHERE identity = ?", (identity,))
                con.execute("DELETE FROM external_likes WHERE identity = ?", (identity,))
                con.commit()
        self.send_json({"ok": True, "reset": bool(identity)})


    def do_GET(self) -> None:
        path = urlparse(self.path).path

        if path == "/api/health":
            self.api_health()
            return

        if path == "/api/admin/runtime-report":
            self.api_admin_runtime_report()
            return

        if path == "/api/artists":
            self.api_artists()
            return

        artist_match = re.fullmatch(r"/api/artists/(.+)", path)
        if artist_match:
            self.api_artist_detail(urllib.parse.unquote(artist_match.group(1)))
            return

        public_playlist_match = re.fullmatch(r"/api/public-playlists/([a-zA-Z0-9]+)", path)
        if public_playlist_match:
            self.api_public_playlist(public_playlist_match.group(1))
            return

        lyrics_match = re.fullmatch(r"/api/lyrics/([a-zA-Z0-9]+)", path)
        if lyrics_match:
            self.api_lyrics_get(lyrics_match.group(1))
            return

        if path == "/api/history":
            self.api_history_get()
            return

        if path == "/api/recommendations":
            self.api_recommendations()
            return

        if path == "/api/user-stats":
            self.api_user_stats()
            return

        if path == "/api/admin/export-content":
            self.api_admin_export_content()
            return

        if path == "/api/playlists":
            self.api_get_playlists()
            return

        playlist_match = re.fullmatch(r"/api/playlists/(\d+)", path)
        if playlist_match:
            self.api_get_playlist(int(playlist_match.group(1)))
            return

        if path == "/api/auth/social/config":
            self.api_social_config()
            return

        if path == "/api/auth/google/start":
            self.api_google_start()
            return

        if path == "/api/auth/google/callback":
            self.api_google_callback()
            return

        if path == "/api/auth/apple/start":
            self.api_apple_start()
            return

        if path == "/api/auth/apple/callback":
            self.api_apple_callback()
            return

        if path == "/api/universal-search":
            params = urllib.parse.parse_qs(urlparse(self.path).query)
            self.api_universal_search((params.get("q") or [""])[0])
            return

        if path == "/api/full-track-search":
            params = urllib.parse.parse_qs(urlparse(self.path).query)
            self.api_full_track_search((params.get("q") or [""])[0])
            return

        if path == "/api/ai-profile":
            self.api_ai_profile()
            return

        if path in {"/api/session", "/api/auth/me"}:
            self.send_json(self.session_payload())
            return

        if path == "/api/admin/session":
            self.send_json({"ok": True, "admin": self.get_admin_session()})
            return

        admin_track_put_match = re.fullmatch(r"/api/admin/tracks/(\d+)", path)
        if admin_track_put_match:
            self.api_admin_update_track(int(admin_track_put_match.group(1)), data)
            return

        if path == "/api/profile":
            session, user = self.get_user_session()
            if not session:
                self.send_error_json(401, "unauthorized", "Not authenticated")
                return
            if session["role"] == "guest":
                self.send_error_json(403, "guest_forbidden", "Guest cannot edit profile")
                return
            self.send_json({"ok": True, "profile": user_public(user)["profile"], "user": user_public(user)})
            return

        if path == "/api/tracks":
            with db() as con:
                rows = con.execute("SELECT * FROM tracks ORDER BY id DESC").fetchall()
            self.send_json({"ok": True, "tracks": [row_to_track(row) for row in rows]})
            return

        if path == "/api/admin/tracks":
            if not self.require_admin():
                return
            with db() as con:
                rows = con.execute("SELECT * FROM tracks ORDER BY id DESC").fetchall()
            self.send_json({"ok": True, "tracks": [row_to_track(row) for row in rows]})
            return

        if path == "/api/admin/stats":
            if not self.require_admin():
                return
            with db() as con:
                users = con.execute("SELECT COUNT(*) AS c FROM users").fetchone()["c"]
                tracks = con.execute("SELECT COUNT(*) AS c FROM tracks").fetchone()["c"]
                sessions = con.execute("SELECT COUNT(*) AS c FROM sessions").fetchone()["c"]
            self.send_json({"ok": True, "stats": {"users": users, "tracks": tracks, "sessions": sessions}})
            return

        self.serve_static(path)

    def do_POST(self) -> None:
        path = urlparse(self.path).path

        if path == "/api/auth/apple/callback":
            self.api_apple_callback_post()
            return

        if path == "/api/admin/upload-track":
            self.api_admin_upload_track()
            return

        data, error = self.read_json()
        if error:
            self.send_error_json(400, "invalid_json", "Invalid JSON")
            return
        data = data or {}

        playlist_share_match = re.fullmatch(r"/api/playlists/(\d+)/share", path)
        if playlist_share_match:
            self.api_playlist_share_create(int(playlist_share_match.group(1)))
            return

        if path == "/api/lyrics":
            self.api_lyrics_save(data)
            return

        if path == "/api/history":
            self.api_history_add(data)
            return

        if path == "/api/smart-mix":
            self.api_smart_mix(data)
            return

        if path == "/api/admin/import-content":
            self.api_admin_import_content(data)
            return

        if path == "/api/playlists":
            self.api_create_playlist(data)
            return

        playlist_track_match = re.fullmatch(r"/api/playlists/(\d+)/tracks", path)
        if playlist_track_match:
            self.api_add_playlist_track(int(playlist_track_match.group(1)), data)
            return

        if path == "/api/play-event":
            self.api_play_event(data)
            return

        if path == "/api/like-external-track":
            self.api_like_external_track(data)
            return

        if path == "/api/cookie-consent":
            self.api_cookie_consent(data)
            return

        if path == "/api/reset-ai-profile":
            self.api_reset_ai_profile()
            return

        if path in {"/api/register", "/api/auth/register"}:
            self.api_register(data)
            return

        if path in {"/api/login", "/api/auth/login"}:
            self.api_login(data)
            return

        if path == "/api/auth/guest":
            self.api_login({"mode": "guest"})
            return

        if path in {"/api/logout", "/api/auth/logout"}:
            raw = parse_cookie(self.headers.get("Cookie")).get(USER_COOKIE)
            if raw:
                with db() as con:
                    con.execute("DELETE FROM sessions WHERE token_hash = ?", (hash_token(raw),))
                    con.commit()
            self.send_json({"ok": True}, extra_headers=clear_cookie_header(USER_COOKIE))
            return

        if path == "/api/admin/login":
            self.api_admin_login(data)
            return

        if path == "/api/admin/add-source-track":
            self.api_admin_add_source_track(data)
            return

        if path == "/api/admin/logout":
            raw = parse_cookie(self.headers.get("Cookie")).get(ADMIN_COOKIE)
            if raw:
                with db() as con:
                    con.execute("DELETE FROM admin_sessions WHERE token_hash = ?", (hash_token(raw),))
                    con.commit()
            self.send_json({"ok": True}, extra_headers=clear_cookie_header(ADMIN_COOKIE))
            return

        self.send_error_json(404, "not_found", "API endpoint not found")

    def do_DELETE(self) -> None:
        parsed = urlparse(self.path)
        path = parsed.path

        playlist_delete_match = re.fullmatch(r"/api/playlists/(\d+)", path)
        if playlist_delete_match:
            self.api_delete_playlist(int(playlist_delete_match.group(1)))
            return

        playlist_track_delete_match = re.fullmatch(r"/api/playlists/(\d+)/tracks", path)
        if playlist_track_delete_match:
            params = urllib.parse.parse_qs(parsed.query)
            self.api_remove_playlist_track(int(playlist_track_delete_match.group(1)), (params.get("key") or [""])[0])
            return

        playlist_share_disable_match = re.fullmatch(r"/api/playlists/(\d+)/share", path)
        if playlist_share_disable_match:
            self.api_playlist_share_disable(int(playlist_share_disable_match.group(1)))
            return

        if path == "/api/history":
            self.api_history_clear()
            return

        match = re.fullmatch(r"/api/admin/tracks/(\d+)", path)
        if match:
            if not self.require_admin():
                return
            track_id = int(match.group(1))
            with db() as con:
                row = con.execute("SELECT * FROM tracks WHERE id = ?", (track_id,)).fetchone()
                if not row:
                    self.send_error_json(404, "track_not_found", "Track not found")
                    return
                con.execute("DELETE FROM tracks WHERE id = ?", (track_id,))
                con.commit()

            source_type = row_value(row, "source_type", "upload")
            if source_type == "upload":
                for folder, name in [(MUSIC_DIR, row["audio_file"]), (COVERS_DIR, row["cover_file"])]:
                    if name:
                        try:
                            (folder / name).unlink(missing_ok=True)
                        except Exception:
                            pass
            else:
                cover_name = row["cover_file"]
                if cover_name:
                    try:
                        (COVERS_DIR / cover_name).unlink(missing_ok=True)
                    except Exception:
                        pass

            self.send_json({"ok": True})
            return

        self.send_error_json(404, "not_found", "API endpoint not found")

    def do_PUT(self) -> None:
        path = urlparse(self.path).path
        data, error = self.read_json()
        if error:
            self.send_error_json(400, "invalid_json", "Invalid JSON")
            return
        data = data or {}

        if path == "/api/profile":
            session, user = self.get_user_session()
            if not session:
                self.send_error_json(401, "unauthorized", "Not authenticated")
                return
            if session["role"] == "guest":
                self.send_error_json(403, "guest_forbidden", "Guest cannot edit profile")
                return

            profile = data.get("profile")
            if not isinstance(profile, dict):
                self.send_error_json(400, "bad_profile", "Profile must be an object")
                return

            current = user_public(user)
            profile = {**current["profile"], **profile}
            profile["name"] = str(profile.get("name") or current["name"]).strip() or current["name"]
            profile["handle"] = str(profile.get("handle") or current["handle"]).strip() or current["handle"]
            if not profile["handle"].startswith("@"):
                profile["handle"] = "@" + profile["handle"]

            with db() as con:
                con.execute(
                    "UPDATE users SET name = ?, profile_json = ?, updated_at = ? WHERE id = ?",
                    (profile["name"], json.dumps(profile, ensure_ascii=False), now_iso(), current["id"]),
                )
                con.commit()
                row = con.execute("SELECT * FROM users WHERE id = ?", (current["id"],)).fetchone()

            self.send_json({"ok": True, "user": user_public(row), "profile": user_public(row)["profile"]})
            return

        self.send_error_json(404, "not_found", "API endpoint not found")

    def api_register(self, data: dict[str, Any]) -> None:
        name = str(data.get("name") or "").strip()
        login_type = str(data.get("loginType") or data.get("method") or "email").strip().lower()
        password = str(data.get("password") or "")
        password_repeat = str(data.get("passwordRepeat") or data.get("confirmPassword") or "")

        fields: dict[str, str] = {}
        if not (2 <= len(name) <= 50):
            fields["name"] = "Імʼя має бути від 2 символів"

        email = nick = phone = None
        if login_type == "email":
            email = normalize_email(data.get("email") or data.get("login") or "")
            if not valid_email(email):
                fields["email"] = "Некоректний email"
        elif login_type in {"nick", "username", "handle"}:
            nick = normalize_nick(data.get("nick") or data.get("login") or "")
            login_type = "nick"
            if not valid_nick(nick):
                fields["nick"] = "Нік: 3–24 символи, латиниця/цифри/._-"
        elif login_type == "phone":
            phone = normalize_phone(data.get("phone") or data.get("login") or "")
            if not valid_phone(phone):
                fields["phone"] = "Телефон має містити 7–15 цифр"
        else:
            fields["loginType"] = "Обери email, нік або телефон"

        if len(password) < 6:
            fields["password"] = "Пароль мінімум 6 символів"
        if password != password_repeat:
            fields["passwordRepeat"] = "Паролі не збігаються"

        if fields:
            self.send_error_json(400, "validation_error", "Check form fields", fields)
            return

        handle = f"@{nick}" if nick else ("@" + (email.split("@")[0] if email else "nyami"))
        profile = data.get("profile") if isinstance(data.get("profile"), dict) else {}
        profile = {**default_profile(name, handle), **profile, "name": name, "handle": handle}
        salt, password_hash, iterations = hash_password(password)

        with db() as con:
            if email and con.execute("SELECT 1 FROM users WHERE email = ?", (email,)).fetchone():
                self.send_error_json(409, "identifier_taken", "Email already registered", {"email": "Email уже зареєстрований"})
                return
            if nick and con.execute("SELECT 1 FROM users WHERE nick = ?", (nick,)).fetchone():
                self.send_error_json(409, "identifier_taken", "Nick already taken", {"nick": "Нік уже зайнятий"})
                return
            if phone and con.execute("SELECT 1 FROM users WHERE phone = ?", (phone,)).fetchone():
                self.send_error_json(409, "identifier_taken", "Phone already registered", {"phone": "Телефон уже зареєстрований"})
                return

            cur = con.execute("""
                INSERT INTO users (name, email, nick, phone, password_salt, password_hash, password_iters, profile_json, created_at, updated_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                name, email, nick, phone,
                salt, password_hash, iterations,
                json.dumps(profile, ensure_ascii=False),
                now_iso(), now_iso()
            ))
            user_id = cur.lastrowid
            con.commit()
            user = con.execute("SELECT * FROM users WHERE id = ?", (user_id,)).fetchone()

        raw, token_hash = new_token()
        with db() as con:
            con.execute("""
                INSERT INTO sessions (user_id, role, token_hash, created_at, expires_at, last_seen_at)
                VALUES (?, 'user', ?, ?, ?, ?)
            """, (user_id, token_hash, now_iso(), expires_iso(), now_iso()))
            con.commit()

        self.send_json(
            {"ok": True, "session": {"authenticated": True, "guest": False, "role": "user"}, "user": user_public(user), "token": "cookie-session", "isGuest": False},
            status=201,
            extra_headers=make_cookie_header(USER_COOKIE, raw),
        )

    def api_login(self, data: dict[str, Any]) -> None:
        if data.get("mode") == "guest":
            raw, token_hash = new_token()
            with db() as con:
                con.execute("""
                    INSERT INTO sessions (user_id, role, token_hash, created_at, expires_at, last_seen_at)
                    VALUES (NULL, 'guest', ?, ?, ?, ?)
                """, (token_hash, now_iso(), expires_iso(), now_iso()))
                con.commit()
            self.send_json({"ok": True, "session": {"authenticated": False, "guest": True, "role": "guest"}, "user": None, "token": "cookie-session", "isGuest": True}, extra_headers=make_cookie_header(USER_COOKIE, raw))
            return

        identifier = str(data.get("identifier") or data.get("login") or "").strip()
        method = str(data.get("method") or "").lower()
        password = str(data.get("password") or "")

        if method == "email":
            normalized = normalize_email(identifier)
        elif method in {"nick", "username", "handle"}:
            normalized = normalize_nick(identifier)
        elif method == "phone":
            normalized = normalize_phone(identifier)
        else:
            normalized = identifier.strip().lower()

        if not normalized or not password:
            self.send_error_json(400, "validation_error", "Enter login and password")
            return

        with db() as con:
            if method == "email":
                user = con.execute("SELECT * FROM users WHERE email = ?", (normalized,)).fetchone()
            elif method in {"nick", "username", "handle"}:
                user = con.execute("SELECT * FROM users WHERE nick = ?", (normalized,)).fetchone()
            elif method == "phone":
                user = con.execute("SELECT * FROM users WHERE phone = ?", (normalized,)).fetchone()
            else:
                user = con.execute("SELECT * FROM users WHERE lower(email) = lower(?) OR nick = ? OR phone = ? LIMIT 1", (normalized, normalized.lstrip("@"), normalized)).fetchone()

        if not user or not verify_password(password, user["password_salt"], user["password_hash"], int(user["password_iters"])):
            self.send_error_json(401, "invalid_credentials", "Wrong login or password")
            return

        raw, token_hash = new_token()
        with db() as con:
            con.execute("""
                INSERT INTO sessions (user_id, role, token_hash, created_at, expires_at, last_seen_at)
                VALUES (?, 'user', ?, ?, ?, ?)
            """, (int(user["id"]), token_hash, now_iso(), expires_iso(), now_iso()))
            con.commit()

        self.send_json({"ok": True, "session": {"authenticated": True, "guest": False, "role": "user"}, "user": user_public(user), "token": "cookie-session", "isGuest": False}, extra_headers=make_cookie_header(USER_COOKIE, raw))

    def api_admin_login(self, data: dict[str, Any]) -> None:
        login = normalize_nick(data.get("login") or "")
        password = str(data.get("password") or "")

        if login != normalize_nick(OWNER_LOGIN) or password != OWNER_PASSWORD:
            self.send_error_json(401, "invalid_admin", "Invalid admin login or password")
            return

        raw, token_hash = new_token()
        with db() as con:
            con.execute("""
                INSERT INTO admin_sessions (token_hash, created_at, expires_at, last_seen_at)
                VALUES (?, ?, ?, ?)
            """, (token_hash, now_iso(), expires_iso(), now_iso()))
            con.commit()

        self.send_json({"ok": True, "admin": True}, extra_headers=make_cookie_header(ADMIN_COOKIE, raw))

    def api_admin_add_source_track(self, data: dict[str, Any]) -> None:
        if not self.require_admin():
            return

        title = str(data.get("title") or "").strip()
        artist = str(data.get("artist") or "").strip()
        source_type = str(data.get("sourceType") or data.get("source_type") or "").strip().lower()
        url = str(data.get("url") or data.get("externalUrl") or "").strip()
        cover_url = str(data.get("coverUrl") or "").strip()

        allowed_sources = {"direct", "youtube", "spotify"}
        if source_type not in allowed_sources:
            self.send_error_json(400, "bad_source", "Unsupported source")
            return
        if not title:
            self.send_error_json(400, "missing_title", "Title required")
            return
        if not artist:
            self.send_error_json(400, "missing_artist", "Artist required")
            return
        if not is_http_url(url):
            self.send_error_json(400, "bad_url", "Use http:// or https:// URL")
            return
        if cover_url and not is_http_url(cover_url):
            self.send_error_json(400, "bad_cover_url", "Cover URL must start with http:// or https://")
            return

        if source_type == "direct":
            source_label = "Direct URL"
            audio_file = url
            page_url = url
        elif source_type == "youtube":
            source_label = "YouTube"
            audio_file = ""
            page_url = url
        else:
            source_label = "Spotify"
            audio_file = ""
            page_url = url

        with db() as con:
            cur = con.execute("""
                INSERT INTO tracks (title, artist, audio_file, cover_file, source_type, external_url, page_url, cover_url, source_label, created_at, updated_at)
                VALUES (?, ?, ?, NULL, ?, ?, ?, ?, ?, ?, ?)
            """, (
                title,
                artist,
                audio_file,
                source_type,
                url,
                page_url,
                cover_url or None,
                source_label,
                now_iso(),
                now_iso(),
            ))
            track_id = cur.lastrowid
            con.commit()
            row = con.execute("SELECT * FROM tracks WHERE id = ?", (track_id,)).fetchone()

        self.send_json({"ok": True, "track": row_to_track(row)}, status=201)


    def api_admin_upload_track(self) -> None:
        if not self.require_admin():
            return

        ctype = self.headers.get("Content-Type", "")
        if "multipart/form-data" not in ctype:
            self.send_error_json(400, "bad_content_type", "Use multipart/form-data")
            return

        try:
            length = int(self.headers.get("Content-Length") or "0")
            body = self.rfile.read(length)
            fields, files = parse_multipart_form(ctype, body)
        except Exception as exc:
            self.send_error_json(400, "bad_form", f"Cannot read form: {exc}")
            return

        title = str(fields.get("title") or "").strip()
        artist = str(fields.get("artist") or "").strip()
        audio_item = files.get("audio")
        cover_item = files.get("cover")

        if not title:
            self.send_error_json(400, "missing_title", "Title required")
            return
        if not artist:
            self.send_error_json(400, "missing_artist", "Artist required")
            return
        if audio_item is None or not audio_item.filename:
            self.send_error_json(400, "missing_audio", "Audio file required")
            return

        audio_ext = Path(audio_item.filename).suffix.lower()
        if audio_ext not in ALLOWED_MUSIC:
            self.send_error_json(400, "bad_audio", "Unsupported audio format")
            return

        audio_name = safe_filename(audio_item.filename, ".mp3")
        audio_path = MUSIC_DIR / audio_name
        audio_path.write_bytes(audio_item.data)

        cover_name = None
        if cover_item is not None and cover_item.filename:
            cover_ext = Path(cover_item.filename).suffix.lower()
            if cover_ext not in ALLOWED_IMAGES:
                try:
                    audio_path.unlink(missing_ok=True)
                except Exception:
                    pass
                self.send_error_json(400, "bad_cover", "Unsupported image format")
                return

            cover_name = safe_filename(cover_item.filename, ".jpg")
            (COVERS_DIR / cover_name).write_bytes(cover_item.data)

        with db() as con:
            cur = con.execute("""
                INSERT INTO tracks (title, artist, audio_file, cover_file, source_type, source_label, created_at, updated_at)
                VALUES (?, ?, ?, ?, 'upload', 'Server', ?, ?)
            """, (title, artist, audio_name, cover_name, now_iso(), now_iso()))
            track_id = cur.lastrowid
            con.commit()
            row = con.execute("SELECT * FROM tracks WHERE id = ?", (track_id,)).fetchone()

        self.send_json({"ok": True, "track": row_to_track(row)}, status=201)


    def serve_static(self, request_path: str) -> None:
        clean = unquote(request_path).lstrip("/")
        if not clean:
            clean = "index.html"

        target = (ROOT / clean).resolve()
        if not str(target).startswith(str(ROOT)) or not target.exists() or not target.is_file():
            target = ROOT / "index.html"

        data = target.read_bytes()
        content_type, _ = mimetypes.guess_type(str(target))
        content_type = content_type or "application/octet-stream"
        if target.suffix.lower() in {".html", ".css", ".js", ".json", ".svg", ".txt"} and "charset=" not in content_type.lower():
            content_type += "; charset=utf-8"

        self.send_response(200)
        self.send_header("Content-Type", content_type)
        self.send_header("Content-Length", str(len(data)))

        if target.name == "index.html" or target.suffix in {".js", ".css"}:
            self.send_header("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0")
            self.send_header("Pragma", "no-cache")
            self.send_header("Expires", "0")
        else:
            self.send_header("Cache-Control", "public, max-age=3600")

        self.end_headers()
        self.wfile.write(data)


class ReusableThreadingHTTPServer(ThreadingHTTPServer):
    allow_reuse_address = True


def create_server() -> tuple[ThreadingHTTPServer, int]:
    ports = [PORT] + list(range(5001, 5011))
    last_error = None

    for port in ports:
        try:
            return ReusableThreadingHTTPServer((HOST, port), AppHandler), port
        except OSError as exc:
            last_error = exc

    raise RuntimeError(f"Cannot start server on ports 5000-5010: {last_error}")


def main() -> None:
    init_db()
    server, actual_port = create_server()
    url = f"http://{HOST}:{actual_port}"

    try:
        (DATA_DIR / "last_port.txt").write_text(str(actual_port), encoding="utf-8")
    except Exception:
        pass

    print()
    print("========================================")
    print(" Nyami Music v47 запущено")
    print("========================================")
    print(f"Сайт: {url}")
    print(f"Скрытая админка: {url}/#admin")
    if actual_port != PORT:
        print(f"Порт {PORT} был занят. Сервер запущен на {actual_port}.")
    print("Зупинити сервер: Ctrl + C")
    print()

    try:
        threading.Timer(1.0, lambda: webbrowser.open(url)).start() if os.environ.get("NYAMI_NO_OPEN", "0") != "1" and HOST in {"127.0.0.1", "localhost"} else None
    except Exception:
        pass

    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print()
        print("Сервер зупинено.")
    finally:
        server.server_close()


if __name__ == "__main__":
    main()
