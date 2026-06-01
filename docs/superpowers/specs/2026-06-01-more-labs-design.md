# More Interactive Labs — Design Spec

**Date:** 2026-06-01
**Status:** Approved — implement all 9.

## Goal

Extend the interactive-visualization coverage so every IITM-core topic has at least one
lab, and the most multi-concept topics get a second lab that teaches a *genuinely
different* idea. Scope (user-chosen): **gaps + curated IITM-core second labs**; GATE-extra
concepts (SVM, decision trees, ridge, hierarchical clustering) are intentionally left out.

## Conventions (reuse existing framework — no new code paths)

- **Chart labs** use `VizChart.setup(canvas)` + `VizChart.css()`, set `window.GATE_VIZ_INIT = init`,
  `window.__onThemeChange = draw`, and a debounced resize redraw. Load `viz/chart.js` + lab JS.
  Panel uses `viz-canvas-wrap chart`.
- **2D / grid labs** use the `Grid` class (`new window.Grid(canvas,{range})`), register via
  `window.__vizInit.push(...)` and `window.__vizRedraw.push(draw)`. Load `viz/grid.js` + lab JS.
  Panel uses `viz-canvas-wrap` (square).
- Panel HTML is inserted right after the §3 (Game / visual imagination) section.
- Two `<script>` tags (dependency + lab) inserted before the `app.js` tag; cache version `v=20260602`.
- Every lab: theme-aware, responsive, a `viz-readout` line that updates live.

## Part A — Gap-topic labs (3, all IITM-core)

1. **LA Rank-Nullity — "Collapse Lab"** (Grid). Drag a 2×2 matrix's two columns; transform the
   unit grid. Rank 2 → plane fills (area ×|det|). Rank 1 → plane collapses onto a line (= column
   space); the null-space direction maps to 0. Readout: rank, nullity, column/null space.
   Canvas `rank-lab`.
2. **LA Diagonalization — "Eigenbasis & Powers"** (Grid). Show the two eigenvector axes of a fixed
   2×2 A; apply A repeatedly to a draggable vector (power iteration) → it aligns with the dominant
   eigenvector. Readout ties to A=PDP⁻¹ (scale by λ along each eigenaxis). Canvas `diag-lab`.
3. **ML Linear-Regression — "Fit from Data"** (chart). Click to add / remove points; best-fit line,
   residual segments and R² update live. Canvas `linfit-lab`.

## Part B — Curated second labs (6, IITM-core, distinct from existing)

4. **PS PMF/PDF — "CDF Builder"** (chart). PMF/PDF on top, its CDF below — discrete staircase vs
   continuous S-curve; a slider/marker reads F(x)=P(X≤x). Canvas `cdf-lab`.
5. **PS CLT — "Confidence Interval"** (chart). Draw many sample means with x̄ ± z·σ/√n intervals;
   colour those that miss μ; report coverage ≈ confidence level. Canvas `ci-lab`.
6. **PS z/t-tests — "t vs Normal"** (chart). df slider; t-curve heavier tails, → normal as df grows.
   Canvas `tdist-lab`.
7. **ML k-Means — "Elbow Method"** (chart). WCSS vs K curve with the elbow marked; K slider. Canvas
   `elbow-lab`.
8. **ML kNN — "Decision Boundary vs k"** (chart). Colour the whole plane by predicted class for the
   two-class dataset; k slider shows jagged (small k) → smooth (large k). Canvas `knnboundary-lab`.
9. **ML Least-Squares — "Loss Surface"** (chart). SSE over (slope, intercept) as a heat-map/contour;
   gradient descent rolls to the minimum; step/run controls. Canvas `losssurface-lab`.

## Acceptance

- Each lab: JS passes `node --check`; every `getElementById` has a matching panel id;
  renders in-browser (canvas drawn, readout populated) with no console errors.
- Existing 26 labs unaffected; all touched pages remain tag-balanced.
- After this, all 4 subjects' IITM-core topics have ≥1 lab; PMF/PDF, CLT, z/t, k-Means, kNN,
  Least-Squares have two.
