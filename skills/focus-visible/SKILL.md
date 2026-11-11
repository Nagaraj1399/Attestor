---
name: focus-visible
description: Use when determining whether keyboard focus indicators are clearly visible and meet contrast requirements. Covers WCAG 2.2 criterion 2.4.7 Focus Visible and 2.4.11 Focus Appearance.
criterion: "2.4.7"
level: "AA"
model: gemini-3-flash
---

# Focus Visible
## What you are judging
Any keyboard operable user interface must have a mode of operation where the keyboard focus indicator is clearly visible on every focused element.

## Procedure
1. Inspect `computed_styles` on `focused_node`: examine `outline`, `outlineStyle`, `outlineWidth`, `outlineColor`, and `boxShadow`.
2. Check if `outline: none` or `outline: 0` is applied without an alternative high-contrast box-shadow, background change, or border change.
3. Verify the focus indicator achieves at least 3:1 contrast against adjacent background colors and is at least 2px thick.

## Fails
- `*:focus { outline: none; }` with no compensatory focus styling
- Outline color has less than 3:1 contrast with background (e.g., light blue on white)
- Focus ring obscured by `overflow: hidden` parent clipping

## Passes
- 2px solid high-contrast ring (`ring-2 ring-blue-600 ring-offset-2`)
- High-contrast box-shadow or inverted colors on focus
