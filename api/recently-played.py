"""Most recent track from Summer's YouTube Music history (includes plays from the iPhone app).

Reads the history through ytmusicapi (unofficial) with browser-session headers stored in the
YTMUSIC_HEADERS environment variable. The value can be either ytmusicapi's browser.json, or the
raw "Copy as cURL" of a music.youtube.com request (converted here). Only the track's public
details are returned; the headers never leave the server and are never logged.
"""
import json
import os
import re
import sys
from http.server import BaseHTTPRequestHandler

from ytmusicapi import YTMusic, setup
from ytmusicapi.exceptions import YTMusicServerError


def auth_from_env(value):
    """browser.json text as-is, or a Chrome "Copy as cURL" turned into browser.json text."""
    value = value.strip()
    if not value.startswith("curl"):
        return value
    curl = value.replace("'\\''", "\u0000")  # undo Chrome's quoting of single quotes
    headers = {k.strip().lower(): v.replace("\u0000", "'") for k, v in re.findall(r"-H '([^:']+):\s?([^']*)'", curl)}
    cookie = re.search(r"(?:-b|--cookie) '([^']*)'", curl)
    if cookie:
        headers["cookie"] = cookie.group(1).replace("\u0000", "'")
    return setup(headers_raw="\n".join(f"{k}: {v}" for k, v in headers.items()))


def latest_track():
    value = os.environ.get("YTMUSIC_HEADERS")
    if not value:
        return 500, {"track": None, "error": "not configured"}
    try:
        history = YTMusic(auth=auth_from_env(value)).get_history()
    except YTMusicServerError as e:
        # YouTube refused (usually expired cookies). Its message is safe to log; the headers aren't in it.
        print(f"recently-played failed: YouTube refused: {str(e)[:200]}", file=sys.stderr)
        return 502, {"track": None, "error": "history unavailable"}
    except Exception as e:
        # Log only the error type: other messages can quote the configured value.
        print(f"recently-played failed: {type(e).__name__}", file=sys.stderr)
        return 502, {"track": None, "error": "history unavailable"}
    if not history:
        return 200, {"track": None}

    item = history[0]
    artists = ", ".join(a.get("name", "") for a in (item.get("artists") or []) if a.get("name"))
    thumbs = item.get("thumbnails") or []
    video_id = item.get("videoId")
    return 200, {
        "track": {
            "name": item.get("title", ""),
            "artist": artists,
            "album": (item.get("album") or {}).get("name", ""),
            "image": thumbs[0]["url"] if thumbs else "",
            "url": f"https://music.youtube.com/watch?v={video_id}" if video_id else "",
            "played": item.get("played", ""),
        }
    }


class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        status, body = latest_track()
        payload = json.dumps(body).encode()
        self.send_response(status)
        self.send_header("Content-Type", "application/json")
        # History is polled at most every 2 minutes, however many people have the page open.
        if status == 200:
            self.send_header("Cache-Control", "s-maxage=120, stale-while-revalidate=600")
        self.end_headers()
        self.wfile.write(payload)
