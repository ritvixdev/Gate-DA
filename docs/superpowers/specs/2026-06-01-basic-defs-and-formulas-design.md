# Upgrade §4 Basic Definitions & §6 Main Formulas — Design Spec

**Date:** 2026-06-01
**Status:** Approved — implement across all 28 topics.

## Goal

The §4 (Basic Definitions) and §6 (Main Formulas) sections are inconsistent — some topics
are rich, many are thin or have bare formulas with no explanation. Make these the
*consistent, student-friendly quick-reference layer*. Deep teaching stays in Study in Depth.

## §4 Basic Definitions — "every key term, one simple line"

- Keep the existing `<ul class="styled deflist">` markup.
- Cover **all the core vocabulary** a beginner meets in the topic (typically 6–10 terms).
- Each term: `<li><strong>Term:</strong> one plain-language line, with a tiny example where it helps.</li>`
- Simple language; no derivations (those live in Study in Depth).
- Preserve any existing correct definitions (merge, don't delete).

## §6 Main Formulas — "labeled, grouped, complete"

- Replace the §6 body (keep the existing sec-head) with a **labeled formula list**:
  - Each formula preceded by a short **bold plain-language name** (and a brief "what / when" note).
  - Group related formulas under mini sub-headings (`<p class="lead">…</p>`) when there are several.
  - Keep KaTeX (`$$…$$` for display, `$…$` inline) — math still renders.
- **Comprehensive:** pull every key formula already in the topic's Study in Depth.
- **Stay on the topic's core/named formulas.** For a topic that also teaches GATE-extra
  algorithms (e.g., Logistic Regression's deep layer has Naive Bayes / CNN / RNN), §6 lists the
  topic's primary formulas (logistic: sigmoid, z, log-loss, threshold) plus, at most, a short
  labeled line for a closely-related extra (e.g., Naive Bayes posterior); it does NOT dump
  unrelated deep-learning formulas.

## Implementation

- Per subject batch (LA, PS, ML, Opt): read each topic's current §4/§6, author the new
  content incorporating existing good material, replace via script (§4 = swap the deflist `<ul>`;
  §6 = swap the body between the sec-head and `</section>`), verify, commit.
- Reuse existing CSS (`deflist`, `.formula`, `.lead`, `<strong>`); no new components expected.
- Bump asset cache `?v=` only if CSS changes (likely not needed; HTML content change only).

## Acceptance

- All 28 topics: §4 covers the topic's key terms in simple language; §6 is a labeled,
  grouped, complete formula sheet for that topic.
- KaTeX renders (no unescaped `$`/brace errors); every page tag-balanced; no content lost.
- §5 (Symbols) and Study in Depth unchanged.
