"""
Google Agent Skills Progressive Disclosure Loader
SPDX-License-Identifier: Apache-2.0
"""
import os
import re
from typing import Dict, Any, List, Optional

SKILLS_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "skills")

class SkillMetadata:
    def __init__(self, name: str, description: str, criterion: str, level: str, model: str, file_path: str):
        self.name = name
        self.description = description
        self.criterion = criterion
        self.level = level
        self.model = model
        self.file_path = file_path

    def to_dict(self) -> Dict[str, Any]:
        return {
            "name": self.name,
            "description": self.description,
            "criterion": self.criterion,
            "level": self.level,
            "model": self.model,
            "file_path": self.file_path
        }

def parse_frontmatter(content: str) -> tuple[Dict[str, str], str]:
    """Extracts YAML frontmatter without external dependencies."""
    pattern = r"^---\s*\n(.*?)\n---\s*\n(.*)$"
    match = re.match(pattern, content, re.DOTALL)
    if not match:
        return {}, content

    fm_raw = match.group(1)
    body = match.group(2)
    meta = {}

    for line in fm_raw.splitlines():
        line = line.strip()
        if not line or line.startswith("#"):
            continue
        if ":" in line:
            k, v = line.split(":", 1)
            meta[k.strip()] = v.strip().strip('"').strip("'")

    return meta, body

def list_skills_metadata(skills_path: str = SKILLS_DIR) -> List[SkillMetadata]:
    """
    Phase 1 of Progressive Disclosure:
    Scans skill directories and parses ONLY the light frontmatter headers.
    Keeps model context ultra-lean until a specific skill is matched.
    """
    skills = []
    if not os.path.isdir(skills_path):
        return skills

    for folder_name in sorted(os.listdir(skills_path)):
        folder_full = os.path.join(skills_path, folder_name)
        if not os.path.isdir(folder_full):
            continue
        skill_file = os.path.join(folder_full, "SKILL.md")
        if not os.path.isfile(skill_file):
            continue

        try:
            with open(skill_file, "r", encoding="utf-8") as f:
                content = f.read()
            fm, _ = parse_frontmatter(content)
            skills.append(SkillMetadata(
                name=fm.get("name", folder_name),
                description=fm.get("description", ""),
                criterion=fm.get("criterion", ""),
                level=fm.get("level", "A"),
                model=fm.get("model", "gemini-3-pro-preview"),
                file_path=skill_file
            ))
        except Exception as e:
            print(f"Warning: could not load skill {skill_file}: {e}")

    return skills

def load_skill_body(skill_path: str) -> str:
    """
    Phase 2 of Progressive Disclosure:
    Loads full markdown body ONLY when the criterion is dispatched for judging.
    """
    with open(skill_path, "r", encoding="utf-8") as f:
        content = f.read()
    _, body = parse_frontmatter(content)
    return body.strip()

def validate_skills_registry(skills: List[SkillMetadata]) -> Dict[str, Any]:
    """
    Validates skills registry integrity:
    - Enforces uniqueness of criteria across active skills
    - Enforces presence of required frontmatter fields
    - Enforces Google-only model routing (gemini-3-pro-preview or gemini-3-flash)
    """
    seen_criteria = {}
    duplicates = []
    invalid_models = []
    missing_fields = []

    for skill in skills:
        crit = skill.criterion
        if crit:
            if crit in seen_criteria:
                duplicates.append((crit, seen_criteria[crit], skill.name))
            else:
                seen_criteria[crit] = skill.name

        if not skill.name or not skill.criterion:
            missing_fields.append(skill.file_path)

        if not (skill.model.startswith("gemini-") or "gemini" in skill.model.lower()):
            invalid_models.append((skill.name, skill.model))

    return {
        "valid": len(duplicates) == 0 and len(invalid_models) == 0 and len(missing_fields) == 0,
        "total_skills": len(skills),
        "duplicates": duplicates,
        "invalid_models": invalid_models,
        "missing_fields": missing_fields
    }

def get_skill_by_criterion(criterion_id: str, skills_path: str = SKILLS_DIR) -> Optional[tuple[SkillMetadata, str]]:
    """Returns (metadata, full_body) for a matched criterion."""
    all_meta = list_skills_metadata(skills_path)
    for meta in all_meta:
        if meta.criterion == criterion_id or meta.name == criterion_id:
            body = load_skill_body(meta.file_path)
            return meta, body
    return None
