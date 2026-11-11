---
name: status-messages
description: Use when validating that dynamic content updates, notifications, and alerts are presented to users via assistive technologies without receiving focus. Covers WCAG 2.2 criterion 4.1.3 Status Messages.
criterion: "4.1.3"
level: "AA"
model: gemini-3-pro-preview
---

# Status Messages
## What you are judging
When content updates asynchronously (e.g. search results count, "Saving changes...", "Item added to cart"), the information must be communicated to assistive technology via `aria-live` or `role="status"`/`role="alert"` without interrupting user focus.

## Procedure
1. Check `announcements` buffer in EvidenceStep when asynchronous actions trigger.
2. Verify mutation observer detected live region insertion or text change.
3. Check `aria-live` polarity: polite for progress/status, assertive for critical errors.

## Fails
- Background save completes or fails without any screen-reader announcement
- Shopping cart counter increments visually but screen reader is uninformed
- Live region constantly repeats every keystroke causing auditory overload

## Passes
- `<div role="status" aria-live="polite">24 audit findings updated</div>`
- `<div role="alert">Connection to test runner timed out</div>`
