---
name: error-identification
description: Use when validating that input errors are clearly identified, described to assistive technologies in text, and connected to the invalid field. Covers WCAG 2.2 criterion 3.3.1 Error Identification.
criterion: "3.3.1"
level: "A"
model: gemini-3-pro-preview
---

# Error Identification
## What you are judging
Judge whether an input error is detected and described to the user in text, rather than relying solely on color (like a red border), and that screen readers announce the error when the field receives focus.

## Procedure
1. Check form submit or field blur states where validation fails.
2. Verify `aria-invalid="true"` is set on the offending input element.
3. Check `aria-describedby` links the input to the element containing the human-readable error text.
4. Verify the synthesized announcement includes the state "invalid entry" and reads the error message.

## Fails
- Field border turns red on invalid submission without any text explanation
- Error message appears visually under the field, but lacks programmatic association (`aria-describedby` omitted)
- Error toast appears elsewhere on screen without `aria-live` or focus shift

## Passes
- `<input aria-invalid="true" aria-describedby="email-err" .../>`
- Synthesized announcement: "Work email, edit, required, invalid entry. Please enter a valid corporate email address."
- Error text clearly states which requirement was not met and how to fix it
