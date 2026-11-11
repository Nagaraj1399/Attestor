---
name: form-labels
description: Use when evaluating whether form inputs have explicit, programmatically linked text labels. Covers WCAG 2.2 criterion 3.3.2 Labels or Instructions and 1.3.1 Info and Relationships.
criterion: "3.3.2"
level: "A"
model: gemini-3-flash
---

# Form Labels and Instructions
## What you are judging
Every user input (text field, select, checkbox, radio, slider) must have a visible label that is programmatically linked via `for`/`id` or `aria-labelledby`. Placeholder text alone does not satisfy this criterion.

## Procedure
1. Inspect input elements in the AX tree and DOM snapshot.
2. Verify an explicit `<label for="...">` or enclosing `<label>` exists.
3. Verify placeholder attribute is not the sole label source.
4. Verify required fields are indicated programmatically (`required` or `aria-required="true"`).

## Fails
- `<input placeholder="Enter your email" />` with no `<label>` or `aria-label`
- Disconnected label where `for` attribute does not match `input` `id`
- Required asterisk (*) rendered without `aria-required="true"` or screen-reader indication

## Passes
- `<label for="org_id">Organization ID</label><input id="org_id" name="org_id" required />`
- Floating label that remains persistent and readable when field is populated
