# Lesson Navigation + §5–§13 Consistency Pass — Design Spec

**Date:** 2026-06-01
**Status:** Approved — implement.

## Goal

After the large Study in Depth additions, lessons are long and hard to navigate, and the
short sections (§5–§13) have drifted (some thin/stale). Add in-page navigation and bring the
short "quick-revision" layer back into sync — without moving Study in Depth.

**Decision:** Study in Depth stays where it is (between §4 Definitions and §5 Symbols).

## Part A — Navigation (centralized in `assets/js/app.js` + CSS; applies to all 28 pages)

Page anatomy stays: hero → §2 Why → §3 Visual → §4 Definitions → 🔬 Study in Depth →
§5 Symbols → §6 Formulas → §7 Method → §8 Worked example → §9 Cheat sheet → §10 Traps →
§11 Connections → §12 Practice → §13 Memory box. Each section is a `<section class="concept-card">`
with a `<div class="sec-head">`.

1. **Sticky "On this page" section nav.**
   - `app.js` scans every `.concept-card .sec-head`, derives a label, and assigns each card a
     stable `id` (e.g. `sec-4`, `sec-study`, `sec-6`).
   - Builds a compact sticky nav: a right-side rail on desktop (fixed/sticky as you scroll),
     collapsing to a top toggle bar on mobile/narrow widths.
   - **Scroll-spy:** highlight the entry for the section currently in view (IntersectionObserver).
   - Study in Depth is included as its own entry between §4 and §5.
   - Clicking an entry smooth-scrolls to that section.

2. **Deep-dive index** (inside the Study in Depth block).
   - `app.js` generates a numbered, clickable contents list at the top of `<details class="study">`,
     one link per `<details class="study-item"> > summary`.
   - Clicking a link opens that `study-item` (`open` attribute) and scrolls to it.

CSS lives in the existing stylesheet; cache-bust `?v=` bumped on app.js/CSS as needed.
No per-page HTML edits are required for navigation (fully derived from existing markup).

## Part B — §5–§13 consistency & gap audit (content; per-subject batches LA → PS → ML → Opt)

Principle (approved): **keep §5–§13 concise**, update them to reflect the new deep content,
fill genuine gaps, trim only true word-for-word duplication.

Per topic, review:
- **§9 GATE cheat sheet** — the thin ones (e.g. logistic-regression, gradient-descent ≈750 chars)
  brought up to a real one-glance summary using the new §6 formulas; verify all are current.
- **§13 Final memory box** — recap/mnemonics reflect the new content.
- **§8 Worked example** — present, correct, not a verbatim copy of a deep-dive item.
- **Gap scan** — flag any section missing important GATE/IITM material; add succinctly.
- Fix inline; commit per subject batch.

## Verification

- Live preview (localhost:3000): nav builds and scroll-spy highlights; deep-dive index links
  open the right `study-item` and scroll; Study in Depth still renders in place; KaTeX intact.
- Check on a long page (logistic-regression, 65 items) and a short one (gradient-descent).
- Scripted checks across all 28: tag balance (`div`/`section`/`ul`/`details`), `$$` parity,
  no raw `<`/`>` inside `.formula`, no `�`.
- Responsive: nav collapses correctly on narrow width (preview_resize).

## Acceptance

- Every lesson page has a working sticky section nav with scroll-spy and a deep-dive index.
- §5–§13 on all 28 topics are current, concise, and gap-free; no content lost; KaTeX renders.
- Study in Depth unchanged in position; §4/§6 (prior pass) unchanged.
