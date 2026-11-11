---
name: heading-structure
description: Use when validating that headings communicate page hierarchy and content relationships correctly without skipping levels. Covers WCAG 2.2 criterion 1.3.1 Info and Relationships and 2.4.6 Headings and Labels.
criterion: "1.3.1"
level: "A"
model: gemini-3-flash
---

# Heading Structure
## What you are judging
Headings (`<h1>` through `<h6>`) allow screen-reader users to skim and navigate page sections. Heading levels must reflect nesting hierarchy and must not skip levels (e.g., `<h1>` directly followed by `<h3>`).

## Procedure
1. Extract all heading elements from the DOM snapshot and AX tree in document order.
2. Verify there is a single primary `<h1>` describing page purpose.
3. Check for skipped levels (e.g. `<h2>` jumping to `<h4>`).
4. Ensure text styled visually as a heading uses semantic heading markup rather than `<p class="font-bold text-xl">`.

## Fails
- Skipping from `<h1>` directly to `<h3>`
- Multiple conflicting `<h1>` headings on an application dashboard
- Styled `<div>` or `<p>` used as section title without `role="heading"` and `aria-level`

## Passes
- Strict sequential hierarchy: `<h1>` -> `<h2>` -> `<h3>`
- Clear, descriptive heading text matching section content
