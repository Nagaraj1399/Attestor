---
name: name-role-value
description: Use when verifying that all UI components have an accessible name, a programmatically determinable role, and states that can be set by assistive technologies. Covers WCAG 2.2 criterion 4.1.2 Name, Role, Value.
criterion: "4.1.2"
level: "A"
model: gemini-3-pro-preview
---

# Name, Role, Value
## What you are judging
Every interactive element must have an accessible name that conveys its purpose, an accurate ARIA or semantic HTML role, and correct states (expanded, pressed, disabled, checked, selected).

## Procedure
1. Inspect the AX node for each interactive stop (`button`, `link`, `textbox`, `combobox`, `checkbox`, `tab`).
2. Evaluate `accessible_name`: is it populated and non-empty?
3. Check `synthesized_announcement`: if the announcement is just "button" or "link" with no name, this is a direct violation.
4. Verify states (`aria-expanded`, `aria-checked`, `aria-disabled`) reflect current visual state.

## Fails
- Icon-only button with no `aria-label`, `aria-labelledby`, or inner text (announces as bare "button")
- Div or span with click listener but no `role="button"` or keyboard tabindex
- Custom toggle switch lacking `role="switch"` and `aria-checked`
- Collapsible accordion button lacking `aria-expanded`

## Passes
- `<button aria-label="Close modal"><svg .../></button>` announces as "Close modal, button"
- `<input type="checkbox" id="tos" checked />` announces as "I agree to Terms, checkbox, checked"
- Semantic `<a href="/pricing">Pricing</a>` announces as "Pricing, link"
