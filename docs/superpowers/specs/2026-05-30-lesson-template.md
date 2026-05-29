# Comprehensive Lesson Template (Design Spec)

**Date:** 2026-05-30
**Status:** Approved (Topic 1 gold-standard first, then roll out)

## Goal

Turn each Linear Algebra topic into a complete, beginner-proof lesson a student can learn
from zero — simple language, basics → tricky GATE — following a fixed 13-section pattern so
the structure is predictable. Source/style reference: user's "Gate DA GPT.txt".

## The 13 sections (same order, every topic)

1. Topic Name (hero) 2. Why This Topic Exists 3. Game / Visual Imagination
4. Basic Definitions 5. Symbols & Meaning (table) 6. Main Formula
7. Step-by-Step Method 8. Worked Example 9. GATE Shortcuts 10. Common Traps
11. Connections With Other Topics 12. Practice Problems 13. Final Memory Box
Plus the interactive lab (Vector/Matrix/Eigen) where one exists.

Mandatory-emphasis sections (per user): Game/Visual, Symbols, Step-by-Step, Shortcuts,
Traps, Memory Box.

## New UI components (assets/css/styles.css)

- `.sec-head` + `.sec-num` — numbered section header (coral number chip, AA via primary-active/on-primary).
- `.imagine` — "🎮 Imagine it" block (neutral soft surface, coral-text label).
- `ol.steps` — numbered step list with badges.
- `.trap` callout variant — wrong-vs-right (error tint); add `--error-text` AA token.
- `.memory-box` — coral-tinted summary box with list.
- Practice: `.practice` + `.show-ans` button + `.ans` (hidden until toggled).
- Reuse existing: `.formula`, `.callout.example`, `.callout.tip`, `.tbl-wrap`, chips, MCQ `.quiz-card`.

## Interaction (assets/js/app.js)

- Show-answer toggle: click `.show-ans` → reveal the following `.ans`, swap button label.
- Existing MCQ quiz + KaTeX + reveal still apply.

## Sequencing

1. Build `01-vectors.html` fully as the gold standard; user reviews look + depth.
2. On approval, roll the identical structure across `02`–`09`, using the .txt where it
   covers the topic and authoring the rest to the same standard with full GATE coverage.

## Acceptance

- Topic 1 shows all 13 sections, simple language, KaTeX math, show-answer practice works,
  memory box present; AA contrast on new components; light + dark; no console errors.
- After roll-out: all 9 topics follow the identical template.
