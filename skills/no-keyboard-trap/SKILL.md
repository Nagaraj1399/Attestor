---
name: no-keyboard-trap
description: Use when determining whether keyboard focus becomes locked inside any subcomponent or control without standard keyboard escape. Covers WCAG 2.2 criterion 2.1.2 No Keyboard Trap.
criterion: "2.1.2"
level: "A"
model: gemini-3-pro-preview
---

# No Keyboard Trap
## What you are judging
Judge whether a keyboard-only user can navigate into and out of all interface widgets (dialogs, datepickers, code editors, media players, nested lists) using standard keys (Tab, Shift+Tab, Esc, Arrow keys) without getting trapped.

## Procedure
1. Observe EvidenceSteps where consecutive Tab actions occur.
2. If `focused_node` does not change across 2 or more Tab keypresses, flag candidate trap.
3. Test if pressing Escape unlocks the focus or closes the overlay.
4. Verify if clear instructions exist if non-standard keys are required.

## Fails
- Focus enters an embedded iframe, modal dialog, or widget and Tab/Shift+Tab cycles indefinitely inside without an Esc dismissal mechanism
- Focus freezes on an input field or button and will not advance on Tab
- Autocomplete dropdown traps focus and suppresses Tab key navigation

## Passes
- Focus moves forward smoothly with Tab and backwards with Shift+Tab
- Modals constrain focus while open, but Escape key dismisses modal and restores focus to caller
- Custom rich-text controls allow Tab-out or document explicit key sequence
