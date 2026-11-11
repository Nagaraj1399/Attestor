---
name: focus-order
description: Use when evaluating whether keyboard navigation sequence preserves meaning and operability. Covers WCAG 2.2 criterion 2.4.3 Focus Order.
criterion: "2.4.3"
level: "A"
model: gemini-3-pro-preview
---

# Focus Order
## What you are judging
Judge whether the keyboard focus sequence follows the logical reading order and workflow of the page. Tab sequence must not jump unexpectedly, skip interactive controls, or disrupt the user's mental model.

## Procedure
1. Trace the sequence of focused elements through the EvidenceSteps.
2. Compare the DOM reading order, visual layout coordinates (top-to-bottom, left-to-right or RTL), and the recorded Tab sequence.
3. Check whether opening a dialog or drawer sends focus directly inside it, and whether closing returns focus to the trigger.
4. Detect if focus jumps across unrelated containers or behind backdrop scrims.

## Fails
- Tab skips past modal dialog into obscured background elements
- Visual reading order is left column then right column, but Tab interleaves them row by row across columns
- Dismissing a modal or popup drops focus to document body instead of trigger
- Injected dynamic content receives focus before preceding content

## Passes
- Logical top-to-bottom, visual-order navigation
- Modal dialog traps keyboard focus while active and restores focus on escape
- Off-canvas drawer receives focus immediately when opened
- Skip links bypass header directly into main landmark
