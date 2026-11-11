# W3C ARIA Authoring Practices Guide (APG) Patterns

## Modal Dialog Pattern
- When a dialog opens, focus moves to an element inside the dialog (often the first focusable element or primary action).
- While open, keyboard focus is trapped inside the dialog container; Tab and Shift+Tab wrap within dialog controls.
- Pressing Escape closes the dialog.
- When the dialog closes, focus returns to the element that invoked it (the trigger button).

## Button Pattern
- An element with `role="button"` or `<button>` must have an accessible name computed from its inner text, `aria-label`, or `aria-labelledby`.
- If an icon is used inside the button without visible text, `aria-label` is required.
- Keyboard support: Enter and Space must trigger the action.

## Form Field & Error Announcements
- Inputs with errors must set `aria-invalid="true"`.
- The error description container must be referenced via `aria-describedby="[error-id]"`.
- When focus enters the input, assistive technology synthesizes: name, role, invalid status, followed by the description.
