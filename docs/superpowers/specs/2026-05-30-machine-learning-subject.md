# Basic Machine Learning Subject (Design Spec)

**Date:** 2026-05-30
**Status:** Approved

## Goal

Add the **Basic Machine Learning** subject (the 4th subject), mirroring the others. Covers the
IIT-M / GATE DA syllabus: simple & multiple linear regression, least-squares, kNN, logistic
regression, k-means clustering, cross-validation. 6 topics on the 13-section template, each
with a practice page; a symbols glossary; and 3 interactive labs.

## Topics (6)

1. Linear Regression (simple & multiple)
2. Least-Squares (cost, normal equations, residuals) — with the Regression lab
3. k-Nearest Neighbors (kNN) — with the kNN lab
4. Logistic Regression (sigmoid, decision boundary, classification)
5. k-Means Clustering — with the k-Means lab
6. Cross-Validation (train/test, k-fold, overfitting)

## Architecture

- Add `machine-learning` to `window.SUBJECTS` in `topics.js`.
- New `machine-learning/` folder: `index.html`, `01..06` topics, `<slug>-practice.html` ×6,
  `symbols.html`, `practice.html`. Every page: `data-subject="machine-learning"`,
  `data-root=".."`, inline anti-FOUC theme script, KaTeX, escape literal `<`/`>` in math.
- Landing card "Machine Learning" → live.
- Reuse existing chrome (no app.js changes).

## Labs (dependency-free canvas, reuse chart.js setup)

- `assets/js/viz/regression-lab.js` (Topic 2): scatter + adjustable line (slope/intercept
  sliders) + residual segments + live SSE; "Best fit" snaps to least-squares; "New data".
- `assets/js/viz/knn-lab.js` (Topic 3): two-class 2-D points + draggable query; k slider;
  highlights k nearest neighbors and shows the majority-vote prediction.
- `assets/js/viz/kmeans-lab.js` (Topic 5): 2-D points; k slider; Step/Run/Reset; assignment +
  centroid update animation; points colored by cluster, centroids drawn as markers.

## Acceptance

- 6 topics render (13 sections, KaTeX, no raw `$`, no `<`-in-math), light + dark.
- 6 practice pages (8 MCQs, every option explained, dual feedback); symbols + hub.
- 3 labs interactive (mouse/touch); other 3 subjects unaffected.
- Landing card live. Verified in a real browser.

## Sequencing

1. SUBJECTS entry + 3 labs + subject index + Topic 1 (gold standard) → verify.
2. Topics 2–6 (labs on 2/3/5). 3. Practice ×6 + symbols + hub. 4. Landing live; QA; commit.
