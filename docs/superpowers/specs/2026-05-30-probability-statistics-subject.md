# Probability & Statistics Subject (Design Spec)

**Date:** 2026-05-30
**Status:** Approved (gold-standard Topic 1 first, then roll out)

## Goal

Add a second GATE DA subject — **Probability & Statistics** — mirroring the Linear Algebra
subject exactly: 9 topics in the 13-section lesson template, per-topic practice pages,
a symbols glossary, and 2–3 interactive labs. Covers the IIT-M / GATE DA syllabus:
probability incl. conditional & joint, random variables, PMF/PDF, joint distributions,
sample & descriptive statistics, CLT, hypothesis testing (z, t, chi-square, F).

## Topics (9)

1. Introduction to Probability
2. Conditional & Joint Probability (+ Bayes)
3. Random Variables
4. PMF, PDF & CDF (+ key distributions)
5. Joint Distributions, Covariance & Correlation
6. Sample & Descriptive Statistics (graphical)
7. Central Limit Theorem
8. Hypothesis Testing I — z-test & t-test
9. Hypothesis Testing II — chi-square & F-test

Each topic: 13-section template (same as LA). Mandatory-emphasis sections: Game/Visual,
Symbols, Step-by-step, Shortcuts, Traps, Memory box.

## Architecture (multi-subject generalization)

- `assets/js/topics.js`: introduce `window.SUBJECTS = { 'linear-algebra': {...},
  'probability-statistics': {...} }`. Each entry: `{ dir, brandHtml, name, topics:[{slug,name,icon,weight}] }`.
  Keep `window.LA_TOPICS` aliased for back-compat.
- `assets/js/app.js`: read `body[data-subject]` (default `"linear-algebra"`), pick config,
  derive `subjectRoot = root + "/" + cfg.dir`, brand, sidebar topics, Reference links
  (symbols/practice), practice CTA, prev/next — all per subject. Progress key becomes
  `gateda:<subject>:visited` (per-subject progress). LA pages need no edits (default subject).
- `probability-statistics/` folder: `index.html` (subject overview), `01..09-*.html` topics,
  `<slug>-practice.html` ×9, `symbols.html`, `practice.html`.
- `index.html` (landing): make the Probability & Statistics card **live**.
- Every page gets the inline anti-FOUC theme script and escapes literal `<`/`>` in math.

## Interactive labs (dependency-free canvas)

- `assets/js/viz/chart.js` — small bar/line chart helper (axes, bars, curve).
- `prob-sim.js` (Topic 1): flip coins / roll a die many times; empirical probability
  converges to theoretical.
- `dist-explorer.js` (Topic 4): Normal PDF (μ, σ sliders) and Binomial PMF (n, p) plots.
- `clt-lab.js` (Topic 7): repeatedly sample (uniform/dice), histogram of sample means
  approaches a bell curve.

## Acceptance

- Multi-subject chrome works for both subjects; LA unaffected (regression-check a LA page).
- All 9 P&S topics render (13 sections, KaTeX, no raw `$`, no `<`-in-math breakage), light+dark.
- 9 practice pages (8 MCQs, every option explained, dual feedback), symbols glossary, subject index.
- 3 labs interactive (mouse + touch). Landing card live. No console errors.
- Verified in a real browser (Claude-in-Chrome) on a local server.

## Sequencing

1. Multi-subject chrome refactor (+ regression-check LA).
2. P&S subject index + Topic 1 (Intro to Probability) with the coin/dice lab — gold standard, user reviews.
3. Roll out Topics 2–9 (+ dist-explorer on 4, clt-lab on 7).
4. Practice pages ×9 + symbols glossary.
5. Make landing card live; full QA; commit.
