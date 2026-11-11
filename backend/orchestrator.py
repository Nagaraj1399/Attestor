"""
Attestor Run Orchestrator
Coordinates Explorer, Capturer, Judge, Remediator, and Attestor
SPDX-License-Identifier: Apache-2.0
"""
import os
import sys
import json
from datetime import datetime, timezone
from typing import Dict, Any, List, Optional

sys.path.append(os.path.dirname(os.path.abspath(__file__)))
from agents.capturer import capture_url_evidence
from agents.judge import judge_criterion, generate_cost_table
from agents.attestor import compile_acr_report
from agents.remediator import generate_remediation_patch
from skills_loader import list_skills_metadata

def run_attestation_pipeline(target_url: str, run_id: Optional[str] = None) -> Dict[str, Any]:
    """Executes the complete end-to-end attestation pipeline."""
    # 1. Capture evidence
    capture_result = capture_url_evidence(target_url, run_id=run_id)
    steps = capture_result["steps"]
    manifest = capture_result["manifest"]

    # 2. Judge against 15 Google Agent Skills
    skills = list_skills_metadata()
    findings = []
    for skill in skills:
        crit_id = skill.criterion or "2.4.3"
        finding = judge_criterion(crit_id, skill.name, steps)
        findings.append(finding)

    # 3. Compile VPAT 2.5 ACR
    report = compile_acr_report(manifest, findings)

    # 4. Generate Gemini Pro vs Flash cost-per-report table
    cost_table = generate_cost_table(findings)

    # 5. Check if any defects were found to prepare remediation PR
    failing_criteria = [f for f in findings if f["verdict"] == "does_not_support"]
    remediation = None
    if failing_criteria:
        remediation = generate_remediation_patch(failing_criteria[0]["criterion"], selector="button.btn-primary")

    return {
        "run_id": manifest["run_id"],
        "target_url": target_url,
        "manifest": manifest,
        "steps": steps,
        "findings": findings,
        "report": report,
        "cost_table": cost_table,
        "remediation": remediation
    }
