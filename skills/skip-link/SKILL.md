---
name: skip-link
description: Use when validating that users can bypass repetitive navigation blocks directly to main content. Covers WCAG 2.2 criterion 2.4.1 Bypass Blocks.
criterion: "2.4.1"
level: "A"
model: gemini-3-flash
---

# Bypass Blocks (Skip to Content)
## What you are judging
Pages with repetitive navigation headers must provide a mechanism (such as a skip link as the very first focusable element) to jump straight to the primary `<main>` content container.

## Procedure
1. Inspect the very first Tab stop (`step_index: 0` or `1`).
2. Verify if a skip link (`href="#main"` or `href="#content"`) receives focus.
3. Test that pressing Enter or Space moves focus directly into the `<main>` content area.
4. Ensure the skip link is visually revealed when focused (`focus:not-sr-only`).

## Fails
- No skip link provided on pages with 10+ navigation items
- Skip link href target ID does not exist in the DOM or target does not accept focus
- Hidden via `display: none` even when focused

## Passes
- First Tab stop reveals `<a href="#main" class="sr-only focus:not-sr-only">Skip to main content</a>`
- Activating the skip link immediately shifts focus to `<main id="main">`
