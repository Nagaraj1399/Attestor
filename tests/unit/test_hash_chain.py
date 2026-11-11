"""
Layer 1 Unit Tests: Cryptographic Hash Chain Integrity
SPDX-License-Identifier: Apache-2.0
"""
import sys
import os
import copy
import json
import unittest

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "../../backend")))
from evidence import canonical_json, compute_step_hash, verify_hash_chain, sign_manifest

def build_valid_step_chain(count: int = 5):
    """Helper to construct a valid cryptographic evidence chain."""
    steps = []
    prev_hash = "0" * 64
    for idx in range(count):
        payload = {
            "step_index": idx,
            "url": "https://example.com",
            "action": {"type": "key", "key": "Tab", "target": f"#elem-{idx}"},
            "accessible_name": f"Action Button {idx}",
            "role": "button",
            "state": "",
            "synthesized_announcement": f"Action Button {idx}, button",
            "prev_hash": prev_hash
        }
        step_hash = compute_step_hash(payload, prev_hash)
        payload["hash"] = step_hash
        steps.append(payload)
        prev_hash = step_hash
    return steps

class TestCryptographicHashChain(unittest.TestCase):
    """Verifies cryptographic properties, tamper detection, and canonical serialization."""

    def test_canonical_json_key_order_and_whitespace_invariance(self):
        """Canonical JSON must produce identical output regardless of key insertion order."""
        dict_a = {"b": 2, "a": 1, "nested": {"z": 9, "y": 8}}
        dict_b = {"a": 1, "nested": {"y": 8, "z": 9}, "b": 2}
        
        c_a = canonical_json(dict_a)
        c_b = canonical_json(dict_b)
        
        self.assertEqual(c_a, c_b)
        # Ensure no extraneous spaces around delimiters
        self.assertNotIn(": ", c_a)
        self.assertNotIn(", ", c_a)

    def test_valid_chain_verifies(self):
        """A properly chained sequence must pass verify_hash_chain."""
        steps = build_valid_step_chain(5)
        self.assertTrue(verify_hash_chain(steps))

    def test_single_byte_mutation_detected(self):
        """Changing even a single character in any step must fail hash chain verification."""
        steps = build_valid_step_chain(4)
        
        # Mutate accessible_name in step 2
        mutated = copy.deepcopy(steps)
        mutated[2]["accessible_name"] = "Malicious Tampered Button"
        
        self.assertFalse(verify_hash_chain(mutated))

    def test_step_reordering_detected(self):
        """Swapping two steps must break the chaining validation."""
        steps = build_valid_step_chain(4)
        
        reordered = copy.deepcopy(steps)
        reordered[1], reordered[2] = reordered[2], reordered[1]
        
        self.assertFalse(verify_hash_chain(reordered))

    def test_step_omission_detected(self):
        """Removing any intermediate step breaks the hash continuity."""
        steps = build_valid_step_chain(5)
        
        # Remove middle step (index 2)
        omitted = [steps[0], steps[1], steps[3], steps[4]]
        
        self.assertFalse(verify_hash_chain(omitted))

    def test_prev_hash_tampering_detected(self):
        """Tampering with prev_hash reference breaks validation."""
        steps = build_valid_step_chain(3)
        tampered = copy.deepcopy(steps)
        tampered[1]["prev_hash"] = "f" * 64
        
        self.assertFalse(verify_hash_chain(tampered))

    def test_first_step_prev_hash_must_be_zeros(self):
        """Initial step prev_hash must strictly be 64 zeros."""
        steps = build_valid_step_chain(3)
        tampered = copy.deepcopy(steps)
        tampered[0]["prev_hash"] = "1" + "0" * 63
        
        self.assertFalse(verify_hash_chain(tampered))

    def test_sign_manifest_deterministic(self):
        """Sign manifest produces identical HMAC for identical content, distinct for mutated."""
        manifest_a = {"run_id": "run_123", "total_steps": 5}
        manifest_b = {"total_steps": 5, "run_id": "run_123"}
        manifest_c = {"run_id": "run_123", "total_steps": 6}

        sig_a = sign_manifest(manifest_a)
        sig_b = sign_manifest(manifest_b)
        sig_c = sign_manifest(manifest_c)

        self.assertEqual(sig_a, sig_b)
        self.assertNotEqual(sig_a, sig_c)

if __name__ == "__main__":
    unittest.main()
