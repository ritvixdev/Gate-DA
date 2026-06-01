# 3D Labs + Square Matrix Display in Labs — Design Spec

**Date:** 2026-06-01
**Status:** Approved — implement.

## Goal

Two lab improvements for student understanding:
1. Some topics teach 3D concepts but only have 2D labs — add dedicated 3D labs.
2. Labs that print a matrix as a flat array `[[a,b],[c,d]]` should ALSO show the familiar
   square bracket-grid form so students can relate (keep the array, ADD the grid).

## Part 1 — Square matrix display (ADD, do not replace)

- New CSS class `.viz-matrix`: an inline grid of numbers wrapped in square brackets (drawn with
  `::before`/`::after` bracket shapes), monospace, theme-aware. Supports `--cols` for width.
- A tiny inline formatter in each affected lab builds the grid HTML from the numbers.
- Affected labs (the three that currently print a flat matrix in their readout):
  `matrix-transform.js`, `eigen-lab.js`, `diag-lab.js`.
- Behaviour: keep the existing `[[a,b],[c,d]]` text; append the bracket grid after it. The grid
  re-renders live on slider drag (cheap innerHTML swap). Numbers stay bold to track changes.

## Part 2 — Three dedicated 3D labs (hand-rolled canvas 3D)

New shared helper **`assets/js/viz/scene3d.js`** (`window.Scene3D`), same vanilla-canvas style as
`chart.js`/`grid.js`:
- Keeps yaw/pitch rotation; `project([x,y,z])` → screen `{X,Y,depth}` (rotation + mild perspective).
- Drag-to-rotate (mouse + touch); re-invokes the lab's `draw` on rotate and on resize.
- Theme-aware colors via a `css(name, fallback)` helper; painter's-order helpers for surfaces.

Three labs, each a **separate panel** added alongside the existing 2D lab on its page, wired with
the established `GATE_VIZ_INIT` / `__onThemeChange` chaining so both labs coexist:

1. **`surface3d-lab.js`** → `optimization/03-multivariate.html`: rotatable surface `f(x,y)` with
   preset buttons **Bowl (min) / Dome (max) / Saddle**; critical point marked; readout names the
   Hessian sign pattern (positive-definite → min, etc.).
2. **`vectors3d-lab.js`** → `linear-algebra/01-vectors.html`: two 3D vectors (a few component
   sliders) with drag-to-rotate; their span drawn as a translucent plane; readout reports
   independent (plane) vs dependent (line), via the cross product.
3. **`pca3d-lab.js`** → `linear-algebra/09-svd-pca.html`: a fixed seeded correlated 3D point cloud
   with the principal axes drawn through it (lengths ∝ √eigenvalue of the 3×3 covariance, found by
   a small Jacobi eigen-solver); readout shows variance explained per component.

Panels reuse existing `.viz-panel` / `.viz-canvas-wrap` markup and controls styles. Bump the asset
cache `?v=` on changed HTML/CSS/JS.

## Verification

- Preview each 3D lab: drag rotates smoothly; surface presets switch; theme toggle recolors;
  no console errors; responsive (resize); both labs on a shared page render (chaining works).
- Matrix grid: renders next to the flat array and updates live as sliders move; brackets look
  right in light and dark themes.
- Scripted checks unaffected (tag balance / `$$` parity) on the touched HTML pages.

## Acceptance

- `optimization/03-multivariate`, `linear-algebra/01-vectors`, `linear-algebra/09-svd-pca` each have
  a working, rotatable 3D lab in addition to their 2D lab.
- `matrix-transform`, `eigen-lab`, `diag-lab` show the square bracket-grid alongside the flat array.
- Zero new external dependencies; existing labs and content unchanged.
