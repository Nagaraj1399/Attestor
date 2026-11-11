---
name: meaningful-alt-text
description: Use when evaluating whether an image's accessible name conveys the information the image carries. Covers WCAG 2.2 criterion 1.1.1 Non-text Content.
criterion: "1.1.1"
level: "A"
model: gemini-3-pro-preview
---

# Meaningful alternative text
## What you are judging
Not whether alt text EXISTS — a scanner already checked that. Judge whether the accessible name conveys the same information a sighted user gets from the image.

## Procedure
1. Look at the screenshot region for this image.
2. Read the accessible name from the AX node.
3. Ask: if the image vanished and only this text remained, would the user lose information?
4. Decorative images correctly have an empty name — that is a PASS, not a failure.

## Fails
- Filename as alt text: "IMG_4471.png", "hero-banner-final-v2.jpg"
- Generic: "image", "photo", "icon", "graphic"
- Redundant: alt repeats adjacent visible text verbatim
- A chart whose alt is "chart" rather than its trend or value
- A product photo whose alt omits the colour/variant the page is selling

## Passes
- Decorative flourish with alt=""
- "Line chart: monthly revenue rising from ₹2L in January to ₹9L in June"
- Icon button whose accessible name is its action, e.g. "Delete item"

## Edge cases
- Image inside a link: the name must describe the DESTINATION, not the picture.
- CAPTCHA images: must describe purpose, not content.
- Text rendered as an image: alt must contain that exact text.
