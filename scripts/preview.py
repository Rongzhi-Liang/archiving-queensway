#!/usr/bin/env python3
"""Serve the editable site locally, reading saved files on every refresh."""

from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
import os
from pathlib import Path
import plistlib
import re
import subprocess
import sys


LABEL = "local.liang.queensway-preview"
PROJECT = Path(__file__).resolve().parents[1]
URL = "http://127.0.0.1:5178/"


def start_background():
    """Keep the local preview available after its terminal or editor closes."""
    logs = PROJECT / "work" / "local-preview"
    logs.mkdir(parents=True, exist_ok=True)
    agent = Path.home() / "Library" / "LaunchAgents" / f"{LABEL}.plist"
    agent.parent.mkdir(parents=True, exist_ok=True)
    config = {
        "Label": LABEL,
        "ProgramArguments": [sys.executable, "-u", str(Path(__file__).resolve())],
        "WorkingDirectory": str(PROJECT),
        "RunAtLoad": True,
        "KeepAlive": True,
        "ThrottleInterval": 5,
        "StandardOutPath": str(logs / "stdout.log"),
        "StandardErrorPath": str(logs / "stderr.log"),
    }
    encoded = plistlib.dumps(config)
    domain = f"gui/{os.getuid()}"
    service = f"{domain}/{LABEL}"
    changed = not agent.exists() or agent.read_bytes() != encoded
    loaded = subprocess.run(
        ["/bin/launchctl", "print", service], capture_output=True
    ).returncode == 0
    if changed:
        if loaded:
            subprocess.run(["/bin/launchctl", "bootout", service], check=True)
            loaded = False
        agent.write_bytes(encoded)
    if not loaded:
        subprocess.run(["/bin/launchctl", "bootstrap", domain, str(agent)], check=True)
    subprocess.run(["/bin/launchctl", "kickstart", service], check=True)
    print(f"Local preview is managed in the background: {URL}")
    print("Save your changes, then refresh Safari with Command + R.")


class PreviewHTTPServer(ThreadingHTTPServer):
    # A page can request many image assets at once after a refresh.
    request_queue_size = 128
    daemon_threads = True


class PreviewHandler(SimpleHTTPRequestHandler):
    extensions_map = {**SimpleHTTPRequestHandler.extensions_map, ".m4a": "audio/mp4"}

    def send_head(self):
        # Avoid a 304 response when two quick saves share a modification timestamp.
        for header in ("If-Modified-Since", "If-None-Match"):
            if header in self.headers:
                del self.headers[header]
        self._media_range = None
        path = Path(self.translate_path(self.path))
        requested = self.headers.get("Range")
        if requested and path.is_file() and path.suffix.lower() in {".m4a", ".mp3", ".ogg", ".wav", ".mp4"}:
            # Safari seeks through audio with byte requests, including bytes=0-1.
            match = re.fullmatch(r"bytes=(\d*)-(\d*)", requested.strip())
            if match and any(match.groups()):
                media = path.open("rb")
                size = os.fstat(media.fileno()).st_size
                first, last = match.groups()
                start = int(first) if first else max(0, size - int(last))
                end = min(int(last), size - 1) if first and last else size - 1
                if start >= size or start > end or (not first and int(last) == 0):
                    media.close()
                    self.send_response(416)
                    self.send_header("Content-Range", f"bytes */{size}")
                    self.send_header("Content-Length", "0")
                    self.end_headers()
                    return None
                self.send_response(206)
                self.send_header("Content-Type", self.guess_type(str(path)))
                self.send_header("Accept-Ranges", "bytes")
                self.send_header("Content-Range", f"bytes {start}-{end}/{size}")
                self.send_header("Content-Length", str(end - start + 1))
                self.end_headers()
                media.seek(start)
                self._media_range = end - start + 1
                return media
        return super().send_head()

    def copyfile(self, source, outputfile):
        if self._media_range is None:
            return super().copyfile(source, outputfile)
        remaining = self._media_range
        while remaining:
            block = source.read(min(64 * 1024, remaining))
            if not block:
                break
            outputfile.write(block)
            remaining -= len(block)

    def end_headers(self):
        self.send_header("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0")
        self.send_header("Pragma", "no-cache")
        self.send_header("Expires", "0")
        super().end_headers()


def main():
    if sys.argv[1:] == ["--start"]:
        start_background()
        return
    if sys.argv[1:]:
        raise SystemExit("Usage: preview.py [--start]")
    root = PROJECT / "dist"
    if not root.is_dir():
        raise SystemExit(f"Preview site directory is missing: {root}")
    handler = partial(PreviewHandler, directory=str(root))
    try:
        server = PreviewHTTPServer(("127.0.0.1", 5178), handler)
    except OSError as error:
        raise SystemExit(f"Could not start local preview on port 5178: {error}") from error
    with server:
        print(f"Local preview: {URL}", flush=True)
        print(f"Serving saved files from: {root}", flush=True)
        print("Save in VS Code, then refresh Safari with Command + R.", flush=True)
        try:
            server.serve_forever()
        except KeyboardInterrupt:
            pass


if __name__ == "__main__":
    main()
