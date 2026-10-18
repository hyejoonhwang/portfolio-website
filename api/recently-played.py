"""Most recent track from Summer's YouTube Music history (includes plays from the iPhone app).

Reads the history through ytmusicapi (unofficial) with browser-session headers stored in the
YTMUSIC_HEADERS environment variable (the contents of ytmusicapi's browser.json). Only the
track's public details are returned; the headers never leave the server.
"""
import json
import os
import sys
from http.server import BaseHTTPRequestHandler

from ytmusicapi import YTMusic


def latest_track():
    headers = os.environ.get("YTMUSIC_HEADERS")
    if not headers:
        return 500, {"track": None, "error": "not configured"}
    try:
        history = YTMusic(auth=headers).get_history()
    except Exception as e:
        # Expired cookies or a change on YouTube's side; the page falls back quietly.
        # Log the error type and message (never the headers) so the cause shows in Vercel's logs.
        print(f"recently-played failed: {type(e).__name__}: {str(e)[:300]}", file=sys.stderr)
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
