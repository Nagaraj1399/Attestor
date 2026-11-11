"""
Layer 1 Unit Tests: Google Agent Skills Progressive Disclosure Loader
SPDX-License-Identifier: Apache-2.0
"""
import sys
import os
import unittest

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "../../backend")))
from skills_loader import (
    parse_frontmatter,
    list_skills_metadata,
    load_skill_body,
    validate_skills_registry,
    SkillMetadata
)

class TestSkillsLoader(unittest.TestCase):
    """Verifies progressive disclosure, frontmatter parsing, and registry integrity."""

    def test_parse_valid_frontmatter(self):
        """Standard YAML frontmatter is parsed into key-value pairs separated from body."""
        content = """---
name: "Keyboard Trap Detection"
criterion: "2.1.2"
level: "A"
model: "gemini-3-pro-preview"
description: "Audits keyboard focus entrapment in modals"
---
# Detailed Instructions
When evaluating focus loops, ensure the Escape key dismisses the modal.
"""
        fm, body = parse_frontmatter(content)
        self.assertEqual(fm.get("name"), "Keyboard Trap Detection")
        self.assertEqual(fm.get("criterion"), "2.1.2")
        self.assertEqual(fm.get("level"), "A")
        self.assertEqual(fm.get("model"), "gemini-3-pro-preview")
        self.assertIn("# Detailed Instructions", body)
        self.assertNotIn("---", body)

    def test_progressive_disclosure_separation(self):
        """list_skills_metadata must NOT load the full markdown body to preserve context budget."""
        skills = list_skills_metadata()
        self.assertGreater(len(skills), 0, "Should load active skills from skills/ directory")

        for skill in skills:
            # SkillMetadata object contains metadata, but not the long markdown body
            self.assertTrue(hasattr(skill, "criterion"))
            self.assertTrue(hasattr(skill, "model"))
            self.assertTrue(hasattr(skill, "file_path"))
            self.assertFalse(hasattr(skill, "body"))

            # Google-only model routing verification
            self.assertTrue(
                "gemini" in skill.model.lower(),
                f"Skill {skill.name} must route to Google Gemini, found {skill.model}"
            )

    def test_body_loaded_only_on_demand(self):
        """load_skill_body only retrieves body content when explicitly dispatched."""
        skills = list_skills_metadata()
        self.assertGreater(len(skills), 0)
        first_skill = skills[0]

        body = load_skill_body(first_skill.file_path)
        self.assertIsInstance(body, str)
        self.assertGreater(len(body), 20)

    def test_malformed_frontmatter_graceful_handling(self):
        """Malformed or absent frontmatter does not crash and returns empty metadata."""
        content_no_frontmatter = "Just plain markdown content with no YAML block."
        fm, body = parse_frontmatter(content_no_frontmatter)
        self.assertEqual(fm, {})
        self.assertEqual(body, content_no_frontmatter)

        content_unclosed_frontmatter = "---\nname: Broken\nNo closing delimiter"
        fm2, body2 = parse_frontmatter(content_unclosed_frontmatter)
        self.assertEqual(fm2, {})
        self.assertEqual(body2, content_unclosed_frontmatter)

    def test_duplicate_criterion_rejection(self):
        """validate_skills_registry detects and flags duplicate criteria."""
        mock_skills = [
            SkillMetadata("Skill A", "Desc A", "4.1.2", "A", "gemini-3-pro-preview", "/path/a"),
            SkillMetadata("Skill B", "Desc B", "4.1.2", "A", "gemini-3-pro-preview", "/path/b"), # Duplicate
            SkillMetadata("Skill C", "Desc C", "1.1.1", "A", "gemini-3-pro-preview", "/path/c"),
        ]
        result = validate_skills_registry(mock_skills)
        self.assertFalse(result["valid"])
        self.assertEqual(len(result["duplicates"]), 1)
        self.assertEqual(result["duplicates"][0][0], "4.1.2")

    def test_third_party_model_rejection(self):
        """validate_skills_registry flags any non-Google model to preserve Google-only constraint."""
        mock_skills = [
            SkillMetadata("Skill Pro", "Desc", "1.1.1", "A", "gemini-3-pro-preview", "/path/a"),
            SkillMetadata("Skill Rogue", "Desc", "2.1.2", "A", "claude-3-opus", "/path/b"), # Rogue 3P model
        ]
        result = validate_skills_registry(mock_skills)
        self.assertFalse(result["valid"])
        self.assertEqual(len(result["invalid_models"]), 1)
        self.assertEqual(result["invalid_models"][0][1], "claude-3-opus")

if __name__ == "__main__":
    unittest.main()
