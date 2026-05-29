# GATE DA — Linear Algebra Study Site (Design Spec)

**Date:** 2026-05-29
**Status:** Approved

## Goal

A static, GitHub Pages–hosted study site for GATE DA Linear Algebra that is easy on
the eyes, editorial and interesting to read, and gives students **interactive visual
intuition** for vectors and matrices. Built so additional GATE DA subjects can be
added later without restructuring. Zero build step — deploy by pushing to GitHub.

## Decisions (locked)

- **Scope:** Full Linear Algebra subject now; landing page + folder structure ready for future subjects.
- **Theme:** Light + dark toggle. Default to warm Claude cream/coral editorial look; dark mode uses Claude dark-navy surfaces. Persisted in `localStorage`, respects system preference on first load.
- **Structure:** Multi-page static (landing index + one HTML page per topic + shared CSS/JS).
- **Design system:** `getdesign add claude` — warm cream canvas `#faf9f5`, coral accent `#cc785c`, ink `#141413`, dark surfaces `#181715`/`#1f1e1b`, semantic teal/amber/green.
- **Type:** Cormorant Garamond (display) · Inter (body) · JetBrains Mono (code), via Google Fonts.
- **Math:** KaTeX (CDN) for typeset math — approved as the key readability win.

## Folder structure

```
Gate-DA/
├── index.html                  # Landing: hero + subject grid (LA live, others "coming soon")
├── README.md                   # Intro + GitHub Pages setup notes
├── .nojekyll                   # Serve files as-is on GitHub Pages
├── assets/
│   ├── css/{tokens.css, styles.css}
│   └── js/
│       ├── app.js              # nav include, sidebar, theme toggle, progress, quiz
│       └── viz/{vector-lab.js, matrix-transform.js, eigen-lab.js, grid.js}
└── linear-algebra/
    ├── index.html              # Subject overview + topic grid
    ├── 01-vectors.html ... 09-svd-pca.html
```

## Components

- **Shared chrome** (header w/ logo + theme toggle, sidebar topic list w/ progress, footer)
  injected by `app.js` so the 10 topic pages don't duplicate markup.
- **Content blocks** (reused, styled in Claude editorial theme): concept card, KaTeX formula
  block, worked-example box, GATE tip, memory aid, comparison table, chips, quiz card.
- **Progress:** visited topics tracked in `localStorage`; sidebar shows done/active; progress bar.
- **Theme toggle:** light/dark via `data-theme` on `<html>`, CSS custom properties.

## Interactive visualizations (dependency-free HTML5 canvas)

Shared `grid.js` helper (coordinate transforms, axes, mouse/touch, light/dark aware).

1. **Vector Lab** (01-vectors): drag vectors u, v; show addition tip-to-tail, scaling, span fill.
2. **Matrix Transformer** (02-matrices, 03-determinants): 2×2 matrix via sliders deforms unit
   grid + basis vectors; shaded unit square area = determinant (sign flips color).
3. **Eigen Lab** (06-eigenvalues): sweep a vector; eigen-directions light up, λ displayed.

## Content

Port + polish all existing LA material into editorial style with KaTeX. Author the
stubbed topics 7–9 (Diagonalization, Orthogonality, SVD & PCA). Each topic page:
hero → concept cards → (visualization where relevant) → worked examples → GATE tips →
quiz → prev/next nav.

## Non-goals (YAGNI)

- No build tooling, frameworks, or bundlers.
- No backend / accounts — progress is local only.
- Other subjects are placeholders, not authored content.

## Testing / acceptance

- Opens via `file://` and via a static server with no console errors.
- All 9 topic pages render, math typesets, visualizations interact (mouse + touch).
- Theme toggle persists; progress persists; responsive sidebar collapses on mobile.
- Paths are relative so it works at `https://<user>.github.io/Gate-DA/`.
- Verified live in a browser before claiming done.
