# Card & Section UI Refresh (Design Spec)

**Date:** 2026-05-30
**Status:** Approved

## Goal

Make cards and sections feel cohesive and soothing within the warm Claude theme. User
feedback: card theme doesn't match / isn't soothing; content (especially formulas) isn't
nicely presented. Dark formula slabs are the main offender.

## Decisions (approved)

- **Formulas:** dark slab → soft light "math card" (light surface, hairline border, slim
  coral left accent, generous padding, centered typeset math in warm ink). Dark theme uses
  soft elevated charcoal, not pure black.
- **Card title marker:** hide mixed emojis (CSS, no HTML edits); add one consistent coral
  ✦ marker before each concept-card title. Title 20px/600.
- **Concept cards:** soft shadow + gentle hover lift; keep hairline border on surface-card;
  even internal rhythm.
- **Callouts:** soft tint + 3px colored left border (teal/amber/coral) instead of full
  outline; refined label; more padding.
- **Tables/chips:** light polish only.

## Files

- `assets/css/tokens.css` — add `--formula-bg` (light + dark).
- `assets/css/styles.css` — `.formula`, `.card-title`/`.card-ico`, `.concept-card` hover,
  `.callout` family.

No HTML changes (emoji hidden + marker added via CSS).

## Acceptance

- No dark formula slabs; formulas are light math cards (light + dark), math in ink, centered.
- Concept titles show a single coral ✦, no emojis; cards have soft shadow + hover lift.
- Callouts use left-border accent style.
- accessibility-review pass: text/border contrast acceptable, focus states intact, no regressions.
- Verified live in browser, light + dark, no console errors.
