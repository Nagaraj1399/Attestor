---
name: reflow
description: Use when validating that content reflows without loss of information or functionality and without requiring scrolling in two dimensions. Covers WCAG 2.2 criterion 1.4.10 Reflow.
criterion: "1.4.10"
level: "AA"
model: gemini-3-flash
---

# Reflow
## What you are judging
Content must be presentable without loss of information or functionality, and without requiring two-dimensional scrolling, at a width of 320 CSS pixels (equivalent to 400% zoom on a standard 1280px display).

## Procedure
1. Inspect page layout at 320px viewport width or simulate zoom to 400%.
2. Check if horizontal scrollbar appears on the main document body.
3. Verify no text is clipped, wrapped under adjacent cards, or overflowing containers.

## Fails
- Fixed container `width: 900px` causing horizontal scrolling on mobile or 400% zoom
- Modal dialog contents cut off without scrollability
- Floating CTA overlaps main content text and cannot be scrolled past

## Passes
- Responsive flex and grid containers wrapping fluidly (`flex-wrap`, `min-w-0`)
- Tables providing dedicated horizontal scrolling container while document reflows vertically
