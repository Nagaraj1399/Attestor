"""
Attestor Report Renderer (HTML / PDF)
SPDX-License-Identifier: Apache-2.0
"""
import os
import json
from typing import Dict, Any

def render_html_report(report_data: Dict[str, Any]) -> str:
    """Renders the self-contained printable and downloadable HTML conformance report."""
    template_path = os.path.join(os.path.dirname(__file__), "acr_template.html")
    with open(template_path, "r", encoding="utf-8") as f:
        html = f.read()

    # Simple substitution
    html = html.replace("{{ title }}", report_data.get("title", "Accessibility Conformance Report"))
    html = html.replace("{{ standard_applied }}", report_data.get("standard_applied", "WCAG 2.2 AA / EN 301 549"))
    html = html.replace("{{ product_name }}", report_data.get("product_name", "Target Application"))
    html = html.replace("{{ target_url }}", report_data.get("target_url", ""))
    html = html.replace("{{ evaluation_date }}", report_data.get("evaluation_date", ""))
    html = html.replace("{{ commit_sha }}", report_data.get("commit_sha", ""))
    html = html.replace("{{ attestor_version }}", report_data.get("attestor_version", ""))
    html = html.replace("{{ evidence_manifest_hash }}", report_data.get("evidence_manifest_hash", ""))
    html = html.replace("{{ cryptographic_signature }}", report_data.get("cryptographic_signature", ""))

    summary = report_data.get("summary", {})
    html = html.replace("{{ summary.supports }}", str(summary.get("supports", 0)))
    html = html.replace("{{ summary.does_not_support }}", str(summary.get("does_not_support", 0)))
    html = html.replace("{{ summary.partially_supports }}", str(summary.get("partially_supports", 0)))
    html = html.replace("{{ summary.requires_human_review }}", str(summary.get("requires_human_review", 0)))

    # Render criteria table rows
    rows_html = []
    for row in report_data.get("criteria_table", []):
        verdict = row.get("verdict", "supports")
        badge_class = "badge-supports" if verdict == "supports" else ("badge-fails" if verdict == "does_not_support" else "badge-partial")
        citation_div = ""
        if row.get("normative_citation"):
            citation_div = f'<div style="font-style: italic; color: #475569; font-size: 12px; margin-bottom: 6px;">"{row["normative_citation"]}"</div>'

        rows_html.append(f"""
        <tr>
          <td><strong>{row.get('criterion', '')}</strong></td>
          <td><span class="badge {badge_class}">{row.get('conformance_level', '')}</span></td>
          <td>
            <p style="margin: 0 0 6px 0;">{row.get('remarks', '')}</p>
            {citation_div}
            <div style="font-family: monospace; font-size: 11px; color: #2563eb;">
              Evidence Steps: {', '.join(str(x) for x in row.get('evidence_step_ids', []))}
            </div>
          </td>
        </tr>
        """)

    # Replace loop section
    import re
    html = re.sub(r'\{%\s*for row in criteria_table\s*%\}.*?\{%\s*endfor\s*%\}', "".join(rows_html), html, flags=re.DOTALL)

    methodology = report_data.get("methodology_statement", {})
    html = html.replace("{{ methodology_statement.statement }}", methodology.get("statement", ""))
    html = html.replace("{{ methodology_statement.threshold }}", str(methodology.get("threshold", 0.85)))
    html = html.replace("{{ methodology_statement.auditor }}", methodology.get("auditor", "Attestor"))

    return html
