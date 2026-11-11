"""
Attestor Backend API Server (FastAPI / Standard HTTP)
SPDX-License-Identifier: Apache-2.0
"""
import os
import sys
import json
from datetime import datetime, timezone
from typing import Dict, Any

sys.path.append(os.path.dirname(os.path.abspath(__file__)))
from orchestrator import run_attestation_pipeline

def handle_health():
    return {"status": "ok", "service": "attestor-backend", "engine": "gemini-3-pro-preview", "time": datetime.now(timezone.utc).isoformat()}

if __name__ == "__main__":
    print("[*] Attestor Python backend module loaded.")
    health = handle_health()
    print(f"[✓] Health Check: {json.dumps(health)}")
