---
name: page-title
description: Use when validating that web pages have titles that describe topic or purpose. Covers WCAG 2.2 criterion 2.4.2 Page Titled.
criterion: "2.4.2"
level: "A"
model: gemini-3-flash
---

# Page Titled
## What you are judging
Web pages must have descriptive `<title>` tags that identify the specific page purpose and application context so users can distinguish browser tabs and bookmarks.

## Procedure
1. Read `document.title` from the page snapshot.
2. Check if title is generic (e.g. "Home", "Untitled Document", "React App", "index.html").
3. Verify title includes specific context followed by brand/product name.

## Fails
- Default framework placeholder: "Vite + React", "My Google AI Studio App"
- Identical title across all internal subroutes and reporting pages
- Empty or whitespace `<title></title>`

## Passes
- "Attestor — Proof your product behaves | Conformance Report #8491"
- "Audit Run #1042 — Checkout Flow | Attestor Console"
