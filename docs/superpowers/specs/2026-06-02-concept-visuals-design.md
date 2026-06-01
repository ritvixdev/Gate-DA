# Four Concept Visuals (matmul / power / logistic boundary / prob tree) — Design Spec

**Date:** 2026-06-02
**Status:** Approved — implement.

## Goal

Add visuals for four concepts that currently have no visualization, where seeing it clears a
common confusion. Each is a separate panel beside the topic's existing lab, on the existing
vanilla framework. No new dependencies.

## Labs

1. **`matmul-lab.js` → `linear-algebra/02-matrices.html`** (grid.js page → register via `__vizInit`).
   DOM-based. Fixed friendly matrices A (2×3) and B (3×2) → C (2×2). **Step** walks cell-by-cell:
   highlight row *i* of A and column *j* of B, show the dot-product sum, fill C[i][j]. **Auto** plays
   through; **Reset** clears. Readout shows the current cell's arithmetic. New CSS for the grids +
   highlight states.

2. **`power-lab.js` → `probability-statistics/08-z-t-tests.html`** (chart.js page → chain
   `GATE_VIZ_INIT`). Canvas: H₀ ~ N(0,1) and H₁ ~ N(d,1); critical line from **α** preset
   (0.10/0.05/0.01, one-tailed); shade **α** (red right tail of H₀), **β** (blue, H₁ left of crit),
   **power = 1−β** (green). Effect-size **slider** for d. Readout: α, β, power. Uses a small normal
   CDF approximation.

3. **`logitboundary-lab.js` → `machine-learning/04-logistic-regression.html`** (chart.js page →
   chain). Canvas: two fixed seeded classes of points; plane tinted by predicted probability σ(w·x+b);
   the **decision boundary** line; a **threshold slider** shifts it (boundary where σ = t). Readout:
   threshold + accuracy. Complements the 1-D sigmoid lab.

4. **`prob-tree-lab.js` → `probability-statistics/02-conditional-bayes.html`** (chart.js page →
   chain). Canvas tree: root → A / Aᶜ (P(A), 1−P(A)) → B / Bᶜ (conditionals); leaves = path products.
   **Sliders** for P(A), P(B|A), P(B|Aᶜ). Readout: P(B) (law of total probability) and the posterior
   P(A|B) (Bayes). A second model beside the area diagram.

## Implementation

- One JS file per lab. matmul registers `init` on `window.__vizInit`; the three chart-style labs
  chain `GATE_VIZ_INIT` and `__onThemeChange` (the established second-lab pattern).
- Insert each panel after the page's first `.viz-panel` (reuse `.viz-panel` markup; matmul uses a
  DOM stage div instead of a canvas). Add the lab `<script>` before `app.js`.
- New CSS only for matmul grids and the prob-tree is canvas-drawn. Bump asset cache `?v=`.

## Verification

- Preview each: interactions work (step/auto, sliders, presets, threshold), readouts correct,
  theme toggle recolors, both/all labs on a shared page still render, zero console errors, responsive.
- Tag-balance / script-order check on the four edited pages.

## Acceptance

- 02-matrices, 08-z-t-tests, 04-logistic-regression, 02-conditional-bayes each gain a working
  concept visual. No new external dependencies; existing labs/content unchanged.
