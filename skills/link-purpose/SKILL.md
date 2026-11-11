---
name: link-purpose
description: Use when determining if the purpose of each link can be determined from the link text alone or from the link text together with programmatic context. Covers WCAG 2.2 criterion 2.4.4 Link Purpose (In Context).
criterion: "2.4.4"
level: "A"
model: gemini-3-pro-preview
---

# Link Purpose (In Context)
## What you are judging
Judge whether a screen-reader user jumping through the links list (`rotor`) can understand where each link leads without reading the surrounding page paragraphs.

## Procedure
1. Extract `accessible_name` of each `<a>` element.
2. Check if name is generic (e.g., "click here", "read more", "learn more", "more", "details").
3. If generic, check if `aria-label` or `aria-describedby` provides unambiguous destination context (e.g. "Read more about SOC2 Compliance").

## Fails
- Multiple repeated "Read more" links on a blog or feature page without distinguishing labels
- "Click here" or "Download" link pointing to ambiguous files

## Passes
- "Download Q4 2026 Audit Report (PDF, 2.4MB)"
- `<a href="/terms" aria-label="Attestor Terms of Service">Learn more</a>`
