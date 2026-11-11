"""
Layer 1 Unit Tests: Strict Confidence Threshold Gate (< 0.85 Downgrade)
SPDX-License-Identifier: Apache-2.0
"""
import sys
import os
import unittest

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "../../backend")))
from agents.judge import apply_confidence_threshold, judge_criterion

class TestConfidenceGate(unittest.TestCase):
    """
    Verifies the non-negotiable hackathon rule:
    Any 'supports' verdict with confidence < 0.85 must automatically downgrade to requires_human_review: True.
    """

    def test_supports_high_confidence_passes_without_review(self):
        """Confidence >= 0.85 on supports does not require human review."""
        self.assertFalse(apply_confidence_threshold("supports", 0.95))
        self.assertFalse(apply_confidence_threshold("supports", 0.85))
        self.assertFalse(apply_confidence_threshold("supports", 1.0))

    def test_supports_sub_threshold_triggers_review(self):
        """Confidence < 0.85 on supports MUST trigger requires_human_review: True."""
        self.assertTrue(apply_confidence_threshold("supports", 0.849))
        self.assertTrue(apply_confidence_threshold("supports", 0.84))
        self.assertTrue(apply_confidence_threshold("supports", 0.75))
        self.assertTrue(apply_confidence_threshold("supports", 0.50))
        self.assertTrue(apply_confidence_threshold("supports", 0.10))

    def test_does_not_support_threshold_behavior(self):
        """does_not_support is a defect finding and is governed separately."""
        self.assertFalse(apply_confidence_threshold("does_not_support", 0.80))

    def test_judge_criterion_end_to_end_downgrade(self):
        """Verifies judge_criterion integration with confidence override."""
        clean_steps = [
            {
                "step_index": 0,
                "role": "button",
                "accessible_name": "Save Changes",
                "computed_styles": {"outline": "2px solid blue", "boxShadow": "none"},
                "is_trap_candidate": False
            }
        ]

        # Case A: High confidence supports verdict -> requires_human_review is False
        res_high = judge_criterion("2.4.1", "Bypass Blocks", clean_steps, override_confidence=0.92)
        self.assertEqual(res_high["verdict"], "supports")
        self.assertFalse(res_high["requires_human_review"])

        # Case B: Marginal confidence (0.81 < 0.85) -> requires_human_review MUST be True
        res_low = judge_criterion("2.4.1", "Bypass Blocks", clean_steps, override_confidence=0.81)
        self.assertEqual(res_low["verdict"], "supports")
        self.assertTrue(res_low["requires_human_review"])
        self.assertEqual(res_low["confidence"], 0.81)

if __name__ == "__main__":
    unittest.main()
