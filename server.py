#!/usr/bin/env python3
"""Dev server with no-cache headers — media swaps show immediately.
Serves the built site from ./dist on http://127.0.0.1:4173"""
import http.server
import socketserver
import os

DIST = os.path.join(os.path.dirname(os.path.abspath(__file__)), "dist")

class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIST, **kwargs)

    def end_headers(self):
        self.send_header("Cache-Control", "no-cache, no-store, must-revalidate")
        self.send_header("Pragma", "no-cache")
        self.send_header("Expires", "0")
        super().end_headers()

with socketserver.TCPServer(("127.0.0.1", 4173), Handler) as httpd:
    print(f"serving {DIST} on :4173 (no-cache)")
    httpd.serve_forever()
