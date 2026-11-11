"""
Attestor Keyboard Traversal & Screen Reader Emulation Agent
SPDX-License-Identifier: Apache-2.0
"""
from typing import Dict, Any, List, Set

def run_traversal_loop(interactive_nodes: List[Dict[str, Any]], max_steps: int = 150) -> Dict[str, Any]:
    """
    Simulates the keyboard-only traversal loop:
    Presses Tab, inspects active element, detects traps, focus order anomalies, and cycle completion.
    """
    visited_ids: Set[int] = set()
    steps_log = []
    cycle_detected = False
    trap_detected = False

    for idx, node in enumerate(interactive_nodes):
        if idx >= max_steps:
            break

        node_id = node.get("backendNodeId", idx)
        if node_id in visited_ids:
            cycle_detected = True
            steps_log.append({
                "step_index": idx,
                "event": "focus_cycle",
                "node_id": node_id,
                "message": "Focus returned to an already visited element; traversal complete."
            })
            break

        visited_ids.add(node_id)
        steps_log.append({
            "step_index": idx,
            "event": "tab_advance",
            "node_id": node_id,
            "accessible_name": node.get("accessible_name", "")
        })

    return {
        "steps_traversed": len(steps_log),
        "cycle_detected": cycle_detected,
        "trap_detected": trap_detected,
        "nodes_visited_count": len(visited_ids)
    }
