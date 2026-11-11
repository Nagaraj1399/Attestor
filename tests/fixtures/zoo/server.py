"""
Violation Zoo Static HTTP Server
Serves planted test pages deterministically on port 8899
SPDX-License-Identifier: Apache-2.0
"""
import http.server
import socketserver
import os
import sys

PORT = 8899
ZOO_PAGES_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "pages")

class ZooHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=ZOO_PAGES_DIR, **kwargs)

    def end_headers(self):
        # Force deterministic rendering: disable cache, force reduced motion headers
        self.send_header("Cache-Control", "no-store, no-cache, must-revalidate")
        self.send_header("Access-Control-Allow-Origin", "*")
        super().end_headers()

    def log_message(self, format, *args):
        # Quiet logger for clean test suites
        if "404" in str(args):
            sys.stderr.write(f"[Zoo 404] {args}\n")

def start_zoo_server():
    socketserver.TCPServer.allow_reuse_address = True
    with socketserver.TCPServer(("", PORT), ZooHTTPRequestHandler) as httpd:
        print(f"[✓] Violation Zoo Server running on http://127.0.0.1:{PORT}")
        print(f"    Serving directory: {ZOO_PAGES_DIR}")
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\n[!] Zoo server stopped.")

if __name__ == "__main__":
    start_zoo_server()
