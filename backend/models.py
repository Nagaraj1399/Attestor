"""
Attestor Data Models & Schemas
SPDX-License-Identifier: Apache-2.0
"""
from typing import List, Dict, Any, Optional, Literal
from dataclasses import dataclass, field, asdict

@dataclass
class BoundingBox:
    x: float
    y: float
    width: float
    height: float

@dataclass
class ComputedStyles:
    outline: str = "none"
    outline_color: str = "transparent"
    outline_width: str = "0px"
    outline_style: str = "none"
    outline_offset: str = "0px"
    box_shadow: str = "none"
    border: str = "none"
    contrast_ratio: float = 21.0

@dataclass
class FocusedNode:
    backend_node_id: int
    node_id: int
    node_name: str
    role: str
    accessible_name: str
    value: str = ""
    description: str = ""
    selector: str = ""
    bounding_box: Optional[BoundingBox] = None
    is_interactive: bool = True

@dataclass
class Action:
    type: str  # "navigate" | "key" | "click"
    key: Optional[str] = None
    target: Optional[str] = None
    x: Optional[float] = None
    y: Optional[float] = None

@dataclass
class EvidenceStep:
    step_index: int
    timestamp: str
    url: str
    action: Dict[str, Any]
    focused_node: Dict[str, Any]
    accessible_name: str
    role: str
    state: str
    synthesized_announcement: str
    computed_styles: Dict[str, Any]
    ax_tree: List[Dict[str, Any]]
    dom_snapshot: str
    announcements: List[str]
    screenshot: str  # path or data url
    network: List[Dict[str, Any]]
    prev_hash: str
    hash: str
    is_trap_candidate: bool = False
    is_focus_order_candidate: bool = False

@dataclass
class CriterionFinding:
    criterion: str
    verdict: Literal["supports", "partially_supports", "does_not_support", "not_applicable"]
    confidence: float
    reasoning: str
    normative_citation: str
    evidence_step_ids: List[int]
    user_impact: str
    suggested_fix: str
    requires_human_review: bool
    model_used: str = "gemini-3-pro-preview"
    latency_ms: int = 420
    input_tokens: int = 1250
    output_tokens: int = 210

@dataclass
class RunManifest:
    run_id: str
    target_url: str
    timestamp: str
    commit_sha: str
    attestor_version: str
    total_steps: int
    evidence_manifest_hash: str
    cryptographic_signature: str
    findings: List[Dict[str, Any]]
    step_hashes: List[str]
    confidence_threshold: float = 0.85
