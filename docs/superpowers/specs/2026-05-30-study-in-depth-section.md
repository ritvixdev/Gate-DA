# "Study in Depth" Collapsible Section (Design Spec)

**Date:** 2026-05-30
**Status:** Approved — implement shell on all topics, full content on Vectors only.

## Goal

Add an optional, collapsible **"Study in Depth"** deep-dive to every topic lesson page,
placed right after §5 (Symbols & their meaning). It lets a student expand a from-zero,
plain-language walkthrough without lengthening the default page. Vectors & Vector Spaces
gets the first full write-up (adapted from the user's detailed notes); every other topic
gets the same shell with a "coming soon" placeholder, ready to be filled later.

## Placement & numbering

- Inserted between §5 (Symbols) and §6 (Main formulas) on each topic lesson page.
- Uses a **📖 icon badge instead of a section number**, so the canonical 2→13 template
  numbering is untouched. It reads as a bonus deep-dive, not a 14th core section.

## Mechanism — native HTML, zero JavaScript

```html
<section class="concept-card study-section">
  <details class="study">                       <!-- collapsed by default -->
    <summary><span class="study-badge">📖</span> Study in Depth <span class="study-sub">— …</span></summary>
    <details class="study-item"><summary>1. …</summary> …KaTeX content… </details>
    <details class="study-item"><summary>2. …</summary> … </details>
  </details>
</section>
```

- Native `<details>/<summary>`: click to expand/collapse, keyboard-accessible, works on
  GitHub Pages, no `app.js` change.
- Content stays in the DOM while collapsed, so KaTeX auto-render still typesets the math;
  formulas are ready the moment a card opens.
- Outer card collapsed by default; each nested mini-card opens independently.

## Styling (CSS only — `assets/css/styles.css`)

- `details.study` summary styled like `.sec-head` (📖 badge mirrors `.sec-num`), with a
  chevron that rotates when `[open]`. Default disclosure triangle removed.
- `details.study-item` nested mini-cards on `--surface-soft`, smaller header, `+ / −` marker.
- `pre.ascii` monospace block for the text diagrams in the Vectors write-up.
- Reuse existing tokens; AA contrast; light + dark.

## Content

- **`linear-algebra/01-vectors.html`** — full deep-dive as ~10 curated nested mini-cards
  (vector & components, transpose/row-vs-column, ℝⁿ and ∈, addition + scalar multiply,
  vector space & closure, subspace + 3-point test, span & linear combination,
  independence vs dependence, the "more than n ⇒ dependent" rule, basis & dimension).
- **All other 27 topic lesson pages** — shell + `Detailed walkthrough coming soon.` placeholder.

## Scope

28 topic lesson pages: linear-algebra 01–09, probability-statistics 01–09,
optimization 01–04, machine-learning 01–06. (Practice/index/symbols pages unchanged.)

## Acceptance

- Section present after §5 on all 28 lesson pages; collapsed by default; toggles on click.
- Nested cards expand independently; KaTeX renders inside (Vectors).
- AA contrast in light + dark; no console errors; existing 13 sections unchanged.
