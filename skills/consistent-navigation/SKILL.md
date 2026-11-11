---
name: consistent-navigation
description: Use when validating that navigational mechanisms that are repeated on multiple web pages within a set appear in the same relative order. Covers WCAG 2.2 criterion 3.2.3 Consistent Navigation.
criterion: "3.2.3"
level: "AA"
model: gemini-3-flash
---

# Consistent Navigation
## What you are judging
Navigation menus, search mechanisms, and footer links repeated across multiple screens must appear in the same relative order each time they are presented, unless initiated by the user.

## Procedure
1. Trace navigation menus and landmark items across multiple EvidenceSteps or sequential routes.
2. Verify order of primary nav links: Brand -> Capabilities -> Runs -> Reports -> Settings.
3. Ensure keyboard Tab index follows the same consistent trajectory across application views.

## Fails
- Nav bar items swap positions between landing and report screens
- Search input shifts before nav links on secondary pages

## Passes
- Consistent 3-zone header layout maintained across every view
- Standardized shortcut keys and skip navigation anchors across pages
