"""
Attestor Cryptographic Evidence Store & Hash Chain
SPDX-License-Identifier: Apache-2.0
"""
import json
import hashlib
import os
import hmac
from typing import Dict, Any, List

ATTESTOR_SECRET = os.getenv("ATTESTOR_SIGNING_KEY", "attestor_google_antigravity_hackathon_2026_sec_key")

def canonical_json(data: Any) -> str:
    """Serializes data into deterministic canonical JSON (sorted keys, compact)."""
    return json.dumps(data, sort_keys=True, separators=(',', ':'), ensure_ascii=True)

def compute_step_hash(step_payload: Dict[str, Any], prev_hash: str) -> str:
    """
    Computes cryptographic SHA-256 hash chaining:
    hash(step_n) = sha256(canonical_json(step_n) + hash(step_n-1))
    """
    c_json = canonical_json(step_payload)
    hasher = hashlib.sha256()
    hasher.update((c_json + prev_hash).encode('utf-8'))
    return hasher.hexdigest()

def sign_manifest(manifest_payload: Dict[str, Any]) -> str:
    """Produces HMAC-SHA256 signature for the final evidence manifest."""
    c_json = canonical_json(manifest_payload)
    return hmac.new(ATTESTOR_SECRET.encode('utf-8'), c_json.encode('utf-8'), hashlib.sha256).hexdigest()

def verify_hash_chain(steps: List[Dict[str, Any]]) -> bool:
    """Validates the integrity of the full evidence chain."""
    expected_prev = "0" * 64
    for step in steps:
        if step.get("prev_hash") != expected_prev:
            return False
        # create payload copy without current hash
        payload = {k: v for k, v in step.items() if k != "hash"}
        calculated = compute_step_hash(payload, expected_prev)
        if calculated != step.get("hash"):
            return False
        expected_prev = calculated
    return True

def save_run_to_disk(run_id: str, manifest: Dict[str, Any], steps: List[Dict[str, Any]], base_dir: str = "./runs") -> str:
    """Persists run artifacts in content-addressed structure."""
    target_dir = os.path.join(base_dir, run_id)
    os.makedirs(target_dir, exist_ok=True)
    steps_dir = os.path.join(target_dir, "steps")
    os.makedirs(steps_dir, exist_ok=True)

    for step in steps:
        step_file = os.path.join(steps_dir, f"step_{step['step_index']:04d}.json")
        with open(step_file, "w", encoding="utf-8") as f:
            f.write(json.dumps(step, indent=2))

    manifest_file = os.path.join(target_dir, "manifest.json")
    with open(manifest_file, "w", encoding="utf-8") as f:
        f.write(json.dumps(manifest, indent=2))

    return target_dir
