# Typography & Reading-Comfort Refinement (Design Spec)

**Date:** 2026-05-30
**Status:** Approved

## Goal

Make the site calmer and easier on the eyes by replacing the high-contrast Cormorant
Garamond serif headings with a single, consistent humanist sans, and tuning prose for
reading comfort. User feedback: title fonts are not soothing; wants soothing + consistent.

## Decisions

- **One family:** Inter for both headings and body. Hierarchy via weight + size only.
  Keep JetBrains Mono for code/formulas. (On-brand: getdesign Claude's sans is Inter.)
- **Headings:** h1 weight 700; h2–h4 weight 600; tracking −0.02em at large sizes.
- **Reading comfort:** body 16→17px, line-height 1.6→1.7, prose column ~66ch (820→720px).
- Keep warm ink `#141413` (not pure black) and cream canvas.

## Out of scope (not selected by user)

Accessibility (WCAG) pass, reading aids (scroll-progress, animation tuning), default-to-light.

## Files

- `assets/css/tokens.css` — font `@import` (drop Cormorant, add Inter 800 weight), `--font-display` → Inter stack.
- `assets/css/styles.css` — body size/line-height, heading weights/tracking, `.hero h1`, `.content` max-width.

No per-page HTML changes (headings already use the font variables).

## Acceptance

- No Cormorant anywhere; headings render in Inter, light + dark.
- Body 17px / 1.7; prose column ~720px.
- Every element type checked live: nav/sidebar, hero, cards, formulas (KaTeX), callouts,
  tables, chips, quizzes (click), all 3 visualizations (interact), prev/next, theme toggle.
