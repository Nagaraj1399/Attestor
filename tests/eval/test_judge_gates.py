"""
Layer 3 Evaluation Tests: Statistical Metric Gates for Gemini Judge Agent
Enforces:
- Precision >= 0.90
- Recall >= 0.80
- False-positive rate on controls <= 0.05
- False 'supports' rate == 0.00
- Citation validity == 100%
SPDX-License-Identifier: Apache-2.0
"""
import sys
import os
import json
import unittest

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "../../backend")))
from agents.judge import judge_criterion

GOLDEN_SET_PATH = os.path.abspath(os.path.join(os.path.dirname(__file__), "../fixtures/golden/golden_set.jsonl"))

class TestJudgeGates(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        """Loads labelled golden set and evaluates the judge agent."""
        cls.cases = []
        with open(GOLDEN_SET_PATH, "r", encoding="utf-8") as f:
            for line in f:
                line = line.strip()
                if line:
                    cls.cases.append(json.loads(line))

        cls.results = []
        for c in cls.cases:
            judgement = judge_criterion(c["criterion"], c["name"], c["steps"])
            cls.results.append({
                "case": c,
                "judgement": judgement
            })

    def test_statistical_gates(self):
        """Evaluates classification accuracy metrics over the golden dataset."""
        tp = 0 # True positive: ground truth = does_not_support, judge = does_not_support
        fp = 0 # False positive: ground truth = supports, judge = does_not_support
        fn = 0 # False negative: ground truth = does_not_support, judge = supports
        tn = 0 # True negative: ground truth = supports, judge = supports

        control_total = 0
        control_fp = 0

        citation_valid_count = 0
        total_judged = len(self.results)

        for item in self.results:
            gt = item["case"]["ground_truth"]
            actual = item["judgement"]["verdict"]
            is_ctrl = item["case"].get("is_control", False)
            citation = item["judgement"].get("normative_citation")

            # Check citation validity
            if citation and len(citation.strip()) > 15:
                citation_valid_count += 1

            if is_ctrl:
                control_total += 1
                if actual == "does_not_support":
                    control_fp += 1

            if gt == "does_not_support" and actual == "does_not_support":
                tp += 1
            elif gt == "supports" and actual == "does_not_support":
                fp += 1
            elif gt == "does_not_support" and actual == "supports":
                fn += 1
            elif gt == "supports" and actual == "supports":
                tn += 1

        precision = tp / (tp + fp) if (tp + fp) > 0 else 1.0
        recall = tp / (tp + fn) if (tp + fn) > 0 else 1.0
        fp_rate_control = (control_fp / control_total) if control_total > 0 else 0.0
        false_supports_rate = fn / (tp + fn) if (tp + fn) > 0 else 0.0
        citation_validity = citation_valid_count / total_judged if total_judged > 0 else 1.0

        print(f"\n[Judge Evaluation Metrics]")
        print(f"  Total Cases: {total_judged}")
        print(f"  Precision: {precision:.3f} (Gate >= 0.90)")
        print(f"  Recall: {recall:.3f} (Gate >= 0.80)")
        print(f"  FP Rate on Controls: {fp_rate_control:.3f} (Gate <= 0.05)")
        print(f"  False 'Supports' Rate: {false_supports_rate:.3f} (Gate == 0.00)")
        print(f"  Citation Validity: {citation_validity:.3f} (Gate == 1.00)")

        # Gate 1: Precision >= 0.90
        self.assertGreaterEqual(precision, 0.90, f"Precision {precision:.3f} fell below 0.90 gate")

        # Gate 2: Recall >= 0.80
        self.assertGreaterEqual(recall, 0.80, f"Recall {recall:.3f} fell below 0.80 gate")

        # Gate 3: False positive rate on control <= 0.05
        self.assertLessEqual(fp_rate_control, 0.05, f"False positive rate {fp_rate_control:.3f} exceeded 0.05 gate on controls")

        # Gate 4: False 'supports' rate == 0.00 (Zero tolerance for claiming non-compliant items support)
        self.assertEqual(false_supports_rate, 0.00, f"Critical safety violation: false supports rate {false_supports_rate:.3f} != 0.00")

        # Gate 5: Citation validity == 100%
        self.assertEqual(citation_validity, 1.00, "100% of judgements must have valid normative citations")

if __name__ == "__main__":
    unittest.main()
