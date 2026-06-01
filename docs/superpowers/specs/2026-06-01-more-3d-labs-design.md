# More 3D Labs (Determinant / Rank / Planes / Projection) — Design Spec

**Date:** 2026-06-01
**Status:** Approved — implement.

## Goal

Add 3D interactive labs to the Linear-Algebra topics whose concepts are inherently 3D and that
do not yet have one, so students can *see* the idea. Scope chosen from a 3D-relevance scan; only
topics where 3D genuinely aids understanding.

All four reuse the existing `assets/js/viz/scene3d.js` helper (yaw/pitch projection,
drag-to-rotate, theme-aware). Each is a **separate panel** added beside the topic's current 2D
lab, wired through the `grid.js` `__vizInit` / `__vizRedraw` registry. No new dependencies.

## Labs

1. **`det3d-lab.js` → `linear-algebra/03-determinants.html`**
   Three column vectors form a parallelepiped (shaded faces + edges). A **flatten slider** pulls
   the third vector toward the plane of the other two; volume → 0 as it flattens. Readout:
   `volume = |det|`, the determinant value, sign (orientation), and "det = 0 → singular".

2. **`rank3d-lab.js` → `linear-algebra/04-rank-nullity.html`**
   Three 3D column vectors with **preset buttons Rank 3 / Rank 2 / Rank 1**. Span shown as a faint
   volume (rank 3), a shaded plane (rank 2), or a line (rank 1). Readout: rank, the span's
   dimension name, and nullity = 3 − rank. Rank computed by tolerance row-reduction.

3. **`planes3d-lab.js` → `linear-algebra/05-linear-equations.html`**
   Three translucent planes (one per equation) with **presets Unique / Infinite / No solution**.
   They meet at a marked point, along a line, or not at all. Readout names the case (rank test).

4. **`projection3d-lab.js` → `linear-algebra/08-orthogonality.html`**
   A vector **b** and a tilted plane (subspace). Shows the projection **p** in the plane, the
   dashed perpendicular **b − p**, and the shadow. **Sliders for b** + rotate. Readout: p and the
   perpendicular length.

## Implementation

- One JS file per lab using `Scene3D.attach(canvas, draw, opts)`; push `init` to `window.__vizInit`
  and a `sc.render` to `window.__vizRedraw`.
- Insert each panel after the first `.viz-panel` on its page (reuse `.viz-panel` / `viz-canvas-wrap chart`
  / `.viz-presets` / `.viz-control` markup); add the lab's `<script>` before `app.js` (scene3d.js is
  already included only where needed — add it on pages that lack it).
- Bump the asset cache `?v=`.

## Verification

- Preview each: drag rotates; presets/sliders change the figure and readout; theme toggle recolors;
  both labs on the page render (chaining); zero console errors; responsive.
- Tag balance / script-order check on the four edited pages.

## Acceptance

- `03-determinants`, `04-rank-nullity`, `05-linear-equations`, `08-orthogonality` each gain a working
  rotatable 3D lab beside their 2D lab. No new external dependencies; existing labs/content unchanged.
