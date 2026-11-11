"""
Layer 1 Unit Tests: Screen-Reader Announcement Synthesizer
Table-driven testing across 40+ combinations per Section 5 of Attestor Master Test Specification.
SPDX-License-Identifier: Apache-2.0
"""
import sys
import os
import unittest

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "../../backend")))
from agents.capturer import synthesize_announcement

class TestAnnouncementSynthesizer(unittest.TestCase):
    """Rigorous table-driven test cases for synthesize_announcement."""

    CASES = [
        # (accessible_name, role, state, expected_output, description)
        # 1. Critical bare element cases (M1 demo moments)
        ("", "button", "", "button", "Bare button with no accessible name"),
        (None, "button", "", "button", "None accessible name on button"),
        ("   ", "button", "", "button", "Whitespace-only accessible name on button"),
        ("", "link", "", "link", "Bare link with no accessible name"),
        ("", "textbox", "", "textbox", "Bare textbox"),
        ("", "checkbox", "", "checkbox", "Bare checkbox"),
        ("", "dialog", "", "dialog", "Bare dialog"),

        # 2. Bare elements with states
        ("", "button", "disabled", "button, disabled", "Bare button with disabled state"),
        ("", "textbox", "required", "textbox, required", "Bare textbox with required state"),
        ("", "checkbox", "checked", "checkbox, checked", "Bare checkbox checked"),
        ("", "combobox", "expanded", "combobox, expanded", "Bare combobox expanded"),

        # 3. Decorative / presentation role suppression (must yield empty string)
        ("", "presentation", "", "", "Presentation role with empty name yields empty string"),
        ("", "none", "", "", "None role with empty name yields empty string"),
        (None, "presentation", "", "", "None name on presentation yields empty string"),
        (None, "none", "", "", "None name on none role yields empty string"),
        ("   ", "presentation", "", "", "Whitespace on presentation yields empty string"),

        # 4. Standard fully named components
        ("Pay now", "button", "", "Pay now, button", "Standard button"),
        ("Submit order", "button", "", "Submit order, button", "Submit action button"),
        ("Documentation & Conformance", "link", "", "Documentation & Conformance, link", "Standard link"),
        ("Home", "link", "", "Home, link", "Navigation link"),
        ("First Name", "textbox", "", "First Name, textbox", "Text input"),
        ("I agree to terms", "checkbox", "", "I agree to terms, checkbox", "Checkbox label"),
        ("Dark mode", "switch", "", "Dark mode, switch", "Switch component"),
        ("Search documentation", "searchbox", "", "Search documentation, searchbox", "Search input"),
        ("Account settings", "menuitem", "", "Account settings, menuitem", "Menu item"),
        ("Billing and Invoicing", "heading", "", "Billing and Invoicing, heading", "Section heading"),
        ("Two-Factor Authentication", "dialog", "", "Two-Factor Authentication, dialog", "Modal dialog"),

        # 5. Compound states (validation, form errors, interaction states)
        ("Email", "edit", "required, invalid entry", "Email, edit, required, invalid entry", "Form input with validation failure"),
        ("Work Email", "textbox", "invalid", "Work Email, textbox, invalid", "Invalid field"),
        ("Remember me", "checkbox", "checked", "Remember me, checkbox, checked", "Checked box"),
        ("Terms", "checkbox", "not checked, required", "Terms, checkbox, not checked, required", "Required unchecked box"),
        ("Volume", "slider", "value 80%", "Volume, slider, value 80%", "Slider with value"),
        ("Notifications", "tab", "selected", "Notifications, tab, selected", "Active tab"),
        ("Profile", "tab", "not selected", "Profile, tab, not selected", "Inactive tab"),
        ("Countries", "combobox", "collapsed", "Countries, combobox, collapsed", "Collapsed combobox"),
        ("Countries", "combobox", "expanded", "Countries, combobox, expanded", "Expanded combobox"),
        ("Refresh feed", "button", "busy", "Refresh feed, button, busy", "Busy action button"),
        ("Delete account", "button", "disabled", "Delete account, button, disabled", "Disabled destructive button"),

        # 6. Edge cases: casing, whitespace trimming, missing role
        ("  Close modal  ", "BUTTON", "", "Close modal, button", "Casing and surrounding whitespace normalized"),
        ("Search", "  SEARCHBOX  ", "", "Search, searchbox", "Role whitespace and casing trimmed"),
        ("Log in", "", "", "Log in, unknown", "Empty role falls back to unknown"),
        ("Log in", None, "", "Log in, unknown", "None role falls back to unknown"),
        ("Security Code", "edit text", "required", "Security Code, edit text, required", "Multi-word role with required state"),
        ("IMG_4471_hero_banner.jpg", "graphic", "", "IMG_4471_hero_banner.jpg, graphic", "Raw filename graphic"),
        ("image", "graphic", "", "image, graphic", "Generic alt graphic"),
        ("More information...", "link", "visited", "More information..., link, visited", "Link with visited state")
    ]

    def test_all_synthesizer_cases(self):
        """Executes all 45+ table cases and reports exact mismatches."""
        self.assertGreaterEqual(len(self.CASES), 40, "Must have at least 40 test cases per spec")
        for name, role, state, expected, desc in self.CASES:
            with self.subTest(desc=desc, name=name, role=role, state=state):
                actual = synthesize_announcement(name, role, state)
                self.assertEqual(
                    actual,
                    expected,
                    f"Failed case '{desc}': synthesized '{actual}', expected '{expected}'"
                )

if __name__ == "__main__":
    unittest.main()
