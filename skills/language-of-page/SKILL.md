---
name: language-of-page
description: Use when validating that the default human language of each web page can be programmatically determined. Covers WCAG 2.2 criterion 3.1.1 Language of Page.
criterion: "3.1.1"
level: "A"
model: gemini-3-flash
---

# Language of Page
## What you are judging
The root `<html>` element must declare a valid IETF BCP 47 language code (`lang="en"`, `lang="en-US"`, `lang="hi"`, etc.) so screen readers switch to the correct pronunciation voice and dictionary.

## Procedure
1. Check `document.documentElement.lang` in the DOM snapshot.
2. Verify the language code is non-empty and matches a recognized standard code.
3. Compare declared language against actual page text content.

## Fails
- Missing `lang` attribute on `<html>` (`<html>` without `lang`)
- Invalid language code: `lang="true"`, `lang="unknown"`
- English content marked as `lang="fr"` causing distorted speech synthesis

## Passes
- `<html lang="en">`
- `<html lang="en-IN">` with proper dialect support
