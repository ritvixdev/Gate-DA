# Symbols Glossary + Per-Topic Practice (Design Spec)

**Date:** 2026-05-30
**Status:** Approved

## Goal

Two student-facing additions to the Linear Algebra subject:
1. A **Symbols glossary** page (sidebar) explaining every math symbol used.
2. **Per-topic Practice / Q&A** subpages — ~8 MCQs each, every option explained so the
   concept clears whether the answer is right or wrong. Reached from a sidebar Practice hub
   and from a button at the end of each topic page.

## Decisions

- ~8 MCQs per topic (~72 total), MCQ-with-full-explanations (reuse existing `.quiz-card`,
  which highlights the correct option and reveals the chosen option's explanation).
- Flat file layout in `linear-algebra/` (consistent paths, `data-root=".."`).

## Files

- `linear-algebra/symbols.html` — grouped symbol tables (vectors, matrices, operations, Greek/sets). `data-page="symbols"`.
- `linear-algebra/practice.html` — hub: a card per topic linking to its practice page. `data-page="practice"`.
- `linear-algebra/<slug>-practice.html` ×9 — ~8 MCQs each + back links. `data-page="practice"`.
- `assets/js/app.js` — sidebar gets a **Reference** group (Symbols, Practice) with active
  state from `body[data-page]`; topic pages auto-get a "Practice … questions →" CTA before nav.

## Sidebar

Topics (9) · **Reference:** 🔣 Symbols · 🎯 Practice. Active highlight via `data-page`.
Reference/practice pages do NOT set `data-topic` (so they don't pollute topic progress).

## Practice page structure

Hero → intro line → ~8 `.quiz-card` MCQs (4 options, every option has a `data-fb` explanation,
one marked `data-correct`) → "← Back to {topic}" + "All practice →" buttons.

## Acceptance

- Symbols page lists all symbols with read-as + meaning + example.
- 9 practice pages, ~8 MCQs each; clicking any option locks the card, highlights the correct
  answer, and shows the explanation; works light/dark; KaTeX renders; no console errors.
- Sidebar shows Reference group; Symbols/Practice highlight when active; topic pages show the
  practice CTA; all relative paths work for GitHub Pages.
