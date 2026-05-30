# Optimization Subject (Design Spec)

**Date:** 2026-05-30
**Status:** Approved

## Goal

Add the **Optimization** subject, mirroring Linear Algebra / Probability & Statistics.
Covers the IIT-M / GATE DA syllabus: types of optimization, unconstrained univariate &
multivariate optimization, gradient descent. 4 topics on the 13-section template, each with
a practice page; a symbols glossary; and one interactive Gradient Descent lab.

## Topics (4)

1. Types of Optimization (objective, minima/maxima, local vs global, convex vs non-convex, constrained vs unconstrained)
2. Univariate Unconstrained Optimization ($f'(x)=0$, second-derivative test)
3. Multivariate Unconstrained Optimization (gradient, Hessian, definiteness, critical points)
4. Gradient Descent (iterative update, learning rate, convergence) — with the lab

## Architecture

- Add `optimization` entry to `window.SUBJECTS` in `topics.js` (`{dir, name, brandHtml, topics[]}`).
- New `optimization/` folder: `index.html`, `01..04` topics, `<slug>-practice.html` ×4,
  `symbols.html`, `practice.html`. Every page: `data-subject="optimization"`, `data-root=".."`,
  inline anti-FOUC theme script, KaTeX, escape literal `<`/`>` in math.
- Landing `index.html`: make the Calculus & Optimization card live (rename to "Optimization").
- Reuse the existing chrome (sidebar, Reference group, practice CTA) — no app.js changes needed.

## Gradient Descent lab (`assets/js/viz/gd-lab.js`, reuses chart.js setup)

- Plot a 1-D function; a point steps downhill via $x \leftarrow x-\eta f'(x)$.
- Presets: convex Bowl (one min) and Double-well (two minima → local-minimum trap).
- Controls: learning-rate slider $\eta$, Step, Run, Reset.
- Shows overshoot/divergence when $\eta$ too large; getting stuck in a local min on the double-well.

## Acceptance

- 4 topics render (13 sections, KaTeX, no raw `$`, no `<`-in-math), light + dark.
- 4 practice pages (8 MCQs, every option explained, dual feedback); symbols + hub.
- GD lab interactive (step/run/reset, learning-rate, presets); LA & P&S unaffected.
- Landing card live. Verified in a real browser on a local server.

## Sequencing

1. SUBJECTS entry + GD lab + subject index + Topic 1 (gold standard) → verify.
2. Topics 2–4. 3. Practice ×4 + symbols + hub. 4. Landing live; QA; commit.
