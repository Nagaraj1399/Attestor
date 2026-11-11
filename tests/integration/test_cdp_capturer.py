"""
Layer 2 Integration Tests: Real Capturer & CDP Traversal Verification
Tests against the Violation Zoo on port 8899.
SPDX-License-Identifier: Apache-2.0
"""
import sys
import os
import threading
import time
import unittest
import socketserver
import http.server

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "../../backend")))
from agents.capturer import capture_url_evidence
from evidence import verify_hash_chain

PORT = 8899
ZOO_PAGES_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "../fixtures/zoo/pages"))

class ZooHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=ZOO_PAGES_DIR, **kwargs)

    def end_headers(self):
        self.send_header("Cache-Control", "no-store, no-cache, must-revalidate")
        self.send_header("Access-Control-Allow-Origin", "*")
        super().end_headers()

    def log_message(self, format, *args):
        pass

class TestCDPCapturerIntegration(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        """Starts local Zoo server if not already running."""
        cls.httpd = None
        cls.server_thread = None
        try:
            socketserver.TCPServer.allow_reuse_address = True
            cls.httpd = socketserver.TCPServer(("127.0.0.1", PORT), ZooHandler)
            cls.server_thread = threading.Thread(target=cls.httpd.serve_forever, daemon=True)
            cls.server_thread.start()
            time.sleep(0.1)
        except OSError:
            # Port already bound / server already running externally
            pass

    @classmethod
    def tearDownClass(cls):
        if cls.httpd:
            try:
                cls.httpd.shutdown()
                cls.httpd.server_close()
            except Exception:
                pass

    def test_unnamed_button_synthesizes_bare_button(self):
        """
        Critical Milestone 1 & Layer 2 Integration test:
        Tabs through v-4.1.2-unnamed-button.html and asserts:
        1. synthesized_announcement == 'button'
        2. role == 'button'
        3. accessible_name == ''
        4. computed_styles.outline is captured
        5. Cryptographic hash chain of entire run is verified
        """
        target_url = f"http://127.0.0.1:{PORT}/v-4.1.2-unnamed-button.html"
        result = capture_url_evidence(target_url)

        self.assertIn("steps", result)
        self.assertGreater(len(result["steps"]), 0)

        # Locate the checkout button step
        button_steps = [s for s in result["steps"] if s.get("role") == "button" or s.get("focused_node", {}).get("selector") == "#checkout-btn"]
        self.assertGreater(len(button_steps), 0, "Must capture the #checkout-btn element stop")

        btn_step = button_steps[0]

        # 1. Assert synthesized announcement is strictly 'button'
        self.assertEqual(
            btn_step["synthesized_announcement"],
            "button",
            f"Expected bare 'button' announcement on icon-only button, got '{btn_step['synthesized_announcement']}'"
        )

        # 2. Assert role is button
        self.assertEqual(btn_step["role"], "button")
        self.assertEqual(btn_step["focused_node"]["role"], "button")

        # 3. Assert accessible name is empty string
        self.assertEqual(btn_step["accessible_name"], "")
        self.assertEqual(btn_step["focused_node"]["accessible_name"], "")

        # 4. Assert computed styles outline is present
        computed_styles = btn_step["computed_styles"]
        self.assertIn("outline", computed_styles)
        self.assertIn("outlineColor", computed_styles)

        # 5. Assert hash chain integrity across all steps
        self.assertTrue(verify_hash_chain(result["steps"]), "Cryptographic hash chain must be valid")

    def test_clean_baseline_traversal_integrity(self):
        """Verifies clean baseline page generates a verified hash chain and valid announcements."""
        target_url = f"http://127.0.0.1:{PORT}/clean-baseline.html"
        result = capture_url_evidence(target_url)

        self.assertGreater(len(result["steps"]), 0)
        self.assertTrue(verify_hash_chain(result["steps"]))

        # Check manifest
        manifest = result["manifest"]
        self.assertEqual(manifest["target_url"], target_url)
        self.assertIn("cryptographic_signature", manifest)
        self.assertIn("evidence_manifest_hash", manifest)

if __name__ == "__main__":
    unittest.main()
