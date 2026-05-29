# GATE DA — Linear Algebra Study Site Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** A zero-build static study site for GATE DA Linear Algebra — editorial Claude theme, light/dark, KaTeX math, and interactive canvas visualizations — deployable to GitHub Pages by pushing.

**Architecture:** Multi-page static HTML. Shared header/sidebar/footer injected at runtime by `app.js` (no duplication). Design tokens + styles in two CSS files. Dependency-free HTML5 canvas widgets for vector/matrix/eigen intuition. KaTeX + Google Fonts via CDN.

**Tech Stack:** HTML5, CSS custom properties, vanilla ES6 JS, HTML5 Canvas, KaTeX (CDN), Google Fonts (Cormorant Garamond / Inter / JetBrains Mono).

**Verification model:** No unit-test framework (would break the zero-build constraint). Each task is verified by opening the page in a browser via the project's local static server and confirming: no console errors, correct render, working interaction.

---

## File Structure

- `index.html` — landing page (hero + subject grid)
- `.nojekyll`, `README.md`
- `assets/css/tokens.css` — Claude tokens + light/dark vars
- `assets/css/styles.css` — layout + components
- `assets/js/app.js` — chrome injection, theme toggle, progress, quiz, KaTeX render, scroll reveal
- `assets/js/topics.js` — topic metadata (id, slug, name, icon, gate weight) shared by sidebar + landing
- `assets/js/viz/grid.js` — canvas coordinate/axes/interaction helper
- `assets/js/viz/vector-lab.js`, `matrix-transform.js`, `eigen-lab.js`
- `linear-algebra/index.html` — subject overview + topic grid
- `linear-algebra/01-vectors.html` … `09-svd-pca.html`

---

## Task 1: Project skeleton + local server

**Files:** Create `.nojekyll`, `README.md`, empty `assets/css/{tokens.css,styles.css}`, `assets/js/app.js`.

- [ ] **Step 1:** `git init` in repo root (if not already a repo).
- [ ] **Step 2:** Create `.nojekyll` (empty file) and a `README.md` with project name + GitHub Pages instructions (Settings → Pages → deploy from `main` / root).
- [ ] **Step 3:** Create placeholder `assets/css/tokens.css`, `assets/css/styles.css`, `assets/js/app.js` (one comment line each).
- [ ] **Step 4 (verify):** Run `python -m http.server 8000` in repo root; confirm it serves. Stop it.
- [ ] **Step 5 (commit):** `git add -A && git commit -m "chore: project skeleton for GitHub Pages"`

## Task 2: Design tokens (`tokens.css`)

- [ ] **Step 1:** Define `:root` light-theme custom properties from the Claude design system: `--canvas #faf9f5`, `--surface-card #efe9de`, `--ink #141413`, `--body #3d3d3a`, `--muted #6c6a64`, `--hairline #e6dfd8`, `--primary #cc785c`, `--primary-active #a9583e`, `--teal #5db8a6`, `--amber #e8a55a`, `--success #5db872`, `--warning #d4a017`, `--error #c64545`; radius scale (`--r-sm 6px`, `--r-md 8px`, `--r-lg 12px`, `--r-xl 16px`, `--r-pill 9999px`); spacing scale (4/8/12/16/24/32/48/96).
- [ ] **Step 2:** Add `[data-theme="dark"]` overrides mapping canvas→`#181715`, surface-card→`#1f1e1b`, elevated→`#252320`, ink→`#faf9f5`, body→`#d6d3cb`, muted→`#a09d96`, hairline→`#2a2825`; keep coral accent, brighten slightly if needed.
- [ ] **Step 3:** Import fonts via `@import` of Google Fonts (Cormorant Garamond 500/600, Inter 400/500/600, JetBrains Mono 400/500) and define `--font-display`, `--font-body`, `--font-mono`.
- [ ] **Step 4 (verify):** Temporarily set `<body style="background:var(--canvas)">` on a scratch page; confirm color applies light + dark.
- [ ] **Step 5 (commit):** `git commit -am "feat: Claude design tokens with light/dark themes"`

## Task 3: Base styles + chrome (`styles.css`)

- [ ] **Step 1:** Global reset, `body` (canvas bg, body font/color, ink headings in display font with negative letter-spacing).
- [ ] **Step 2:** App shell layout: fixed sidebar (topic list, progress bar) + scrollable main; top header (wordmark with coral asterisk, theme-toggle button). Responsive: sidebar collapses to a top drawer under 820px.
- [ ] **Step 3:** Content components — `.concept-card`, `.formula` (KaTeX container), `.example-box` (teal), `.gate-tip` (amber), `.memory` (coral-tinted), `.tbl` table, `.chip`/`.chip-*`, `.quiz-*`, `.nav-row` prev/next, `.viz-panel` (canvas frame + controls).
- [ ] **Step 4 (verify):** Open scratch page including styles.css with one of each component hard-coded; confirm visual hierarchy reads well in light + dark.
- [ ] **Step 5 (commit):** `git commit -am "feat: base layout and content component styles"`

## Task 4: Topic metadata + chrome injection (`topics.js`, `app.js`)

- [ ] **Step 1:** `topics.js` exports `const TOPICS = [{id,slug,name,icon,weight}...]` for the 9 topics + overview.
- [ ] **Step 2:** `app.js`: on `DOMContentLoaded`, read `data-topic` attribute on `<body>`, inject header + sidebar (highlight active topic, mark visited from `localStorage` key `gateda:la:visited`), and footer. Use relative paths computed from a `data-root` attribute so it works in subfolders + on GitHub Pages.
- [ ] **Step 3:** Theme toggle: read `localStorage gateda:theme` or `prefers-color-scheme`, set `<html data-theme>`, wire toggle button.
- [ ] **Step 4:** Progress: mark current topic visited, update sidebar checks + progress bar; KaTeX auto-render call; IntersectionObserver scroll-reveal for `.concept-card`.
- [ ] **Step 5 (verify):** Build a minimal `linear-algebra/01-vectors.html` stub with the body attributes + script/style includes; open in server; confirm sidebar/header/footer inject, theme toggles + persists, progress records.
- [ ] **Step 6 (commit):** `git commit -am "feat: shared chrome, theme toggle, progress tracking"`

## Task 5: Quiz interaction (in `app.js`)

- [ ] **Step 1:** Delegate clicks on `.quiz-opt`; compare `data-val` to `data-correct`; mark correct/wrong classes, reveal matching `.quiz-feedback`, lock the question.
- [ ] **Step 2 (verify):** Add a quiz card to the stub page; confirm correct/wrong feedback shows and locks.
- [ ] **Step 3 (commit):** `git commit -am "feat: quiz interaction"`

## Task 6: Canvas grid helper (`viz/grid.js`)

- [ ] **Step 1:** `Grid` class: constructor(canvas, {range}) sets up DPR-scaled canvas; methods `toPx({x,y})`, `toData(px,py)`, `clear()`, `drawAxes()`, `drawGridlines()`, `drawVector(vec,{color,label})`, `drawPolygon(points,{fill})`. Reads CSS vars for theme colors.
- [ ] **Step 2:** Pointer helper: `onDragPoint(getPoints, onMove)` mapping mouse + touch to nearest draggable data point.
- [ ] **Step 3 (verify):** Scratch canvas drawing axes + one draggable vector; confirm dragging works on mouse and touch and redraws on theme change.
- [ ] **Step 4 (commit):** `git commit -am "feat: canvas grid/vector helper"`

## Task 7: Vector Lab (`viz/vector-lab.js`)

- [ ] **Step 1:** Init on `#vector-lab` canvas: two draggable vectors u, v; toggles for "show sum (tip-to-tail)", "show span". Render arrows, sum arrow, and span (line if parallel, shaded plane if independent). Live numeric readout of u, v, u+v.
- [ ] **Step 2 (verify):** Open vectors page; drag u and v; confirm sum + span update and readouts match.
- [ ] **Step 3 (commit):** `git commit -am "feat: interactive Vector Lab"`

## Task 8: Matrix Transformer (`viz/matrix-transform.js`)

- [ ] **Step 1:** Init on `#matrix-transform`: four sliders for 2×2 matrix [[a,b],[c,d]]; draw original faint grid + transformed grid, transformed basis vectors î, ĵ, and shaded unit-square image. Show `det = ad−bc` with sign-driven fill color (coral if negative/flipped).
- [ ] **Step 2:** Preset buttons: identity, rotation, shear, scale, singular (det 0).
- [ ] **Step 3 (verify):** Open matrices page; move sliders; confirm grid deforms and det value/color update; singular preset collapses to a line.
- [ ] **Step 4 (commit):** `git commit -am "feat: interactive Matrix Transformer"`

## Task 9: Eigen Lab (`viz/eigen-lab.js`)

- [ ] **Step 1:** Init on `#eigen-lab`: fixed 2×2 (editable via 4 inputs); a draggable/sweepable test vector x drawn with its image Ax; highlight when x and Ax are colinear (eigenvector) and display λ = |Ax|/|x| with sign. Auto-mark computed eigen-directions when real.
- [ ] **Step 2 (verify):** Open eigenvalues page; sweep x; confirm eigen-directions light up and λ matches `det(A−λI)=0` roots for the default matrix.
- [ ] **Step 3 (commit):** `git commit -am "feat: interactive Eigen Lab"`

## Task 10: Landing + subject overview pages

- [ ] **Step 1:** `index.html`: hero (editorial headline, sub-text), subject grid — Linear Algebra (live, links to `linear-algebra/`), other GATE DA subjects as "Coming soon" cards. Includes shared CSS/JS, `data-root="."`.
- [ ] **Step 2:** `linear-algebra/index.html`: subject hero + "why it matters for GATE" card + topic grid (cards from `TOPICS`, link to each topic page), `data-root=".."`.
- [ ] **Step 3 (verify):** Open `/`; click into Linear Algebra; click a topic card; confirm navigation + relative paths work.
- [ ] **Step 4 (commit):** `git commit -am "feat: landing page and subject overview"`

## Task 11: Topic pages 01–06 (content + viz wiring)

- [ ] **Step 1:** `01-vectors.html` — port vectors content (vector, vector space, subspace, span/independence, basis/dimension), KaTeX formulas, examples, tips, memory aids, **Vector Lab** canvas, 2 quizzes, prev/next.
- [ ] **Step 2:** `02-matrices.html` — matrix basics, multiplication, special types table, transpose/inverse, trace, **Matrix Transformer** canvas, quiz.
- [ ] **Step 3:** `03-determinants.html` — definition, 2×2/3×3 computation, properties, Cramer's rule, reuse Matrix Transformer for det-as-area, quiz.
- [ ] **Step 4:** `04-rank-nullity.html` — rank, null space/nullity, rank-nullity theorem, four fundamental subspaces table, quiz.
- [ ] **Step 5:** `05-linear-equations.html` — solution types, Gaussian elimination, homogeneous systems, solution structure, quiz.
- [ ] **Step 6:** `06-eigenvalues.html` — core idea, finding eigenvalues, properties, symmetric/orthogonal cases, **Eigen Lab** canvas, quiz.
- [ ] **Step 7 (verify):** Open each page; confirm math typesets, viz works, quizzes work, no console errors; prev/next chain correct.
- [ ] **Step 8 (commit):** `git commit -am "feat: linear algebra topics 1-6"`

## Task 12: Topic pages 07–09 (new content)

- [ ] **Step 1:** `07-diagonalization.html` — A = PDP⁻¹, when diagonalizable (n independent eigenvectors), powers via diagonalization, worked example, quiz.
- [ ] **Step 2:** `08-orthogonality.html` — orthogonal/orthonormal sets, projections, Gram–Schmidt, orthogonal matrices, quiz.
- [ ] **Step 3:** `09-svd-pca.html` — SVD A = UΣVᵀ, singular values, low-rank idea, PCA link (covariance eigen-decomposition), GATE relevance, quiz.
- [ ] **Step 4 (verify):** Open each; math + quiz + nav correct; topic 9 next button disabled.
- [ ] **Step 5 (commit):** `git commit -am "feat: linear algebra topics 7-9 (diagonalization, orthogonality, SVD/PCA)"`

## Task 13: Full-site QA pass + GitHub Pages readiness

- [ ] **Step 1 (verify):** Walk all pages via local server: no console errors, fonts + KaTeX load, all 3 visualizations interactive (mouse + touch via devtools), theme toggle + progress persist across pages, responsive sidebar collapses under 820px.
- [ ] **Step 2:** Confirm every asset path is relative (no leading `/`) so it works under `/<repo>/` on GitHub Pages; `.nojekyll` present.
- [ ] **Step 3:** Finalize `README.md` with live structure + Pages enablement steps.
- [ ] **Step 4 (commit):** `git commit -am "docs: finalize README and QA fixes"`

## Task 14: Push to GitHub

- [ ] **Step 1:** `git branch -M main`; `git remote add origin https://github.com/ritvixdev/Gate-DA.git` (skip if exists).
- [ ] **Step 2:** `git push -u origin main` (requires user's GitHub auth — confirm before pushing).
- [ ] **Step 3:** Tell user to enable GitHub Pages (Settings → Pages → main / root) and share the resulting URL.

---

## Self-Review Notes

- **Spec coverage:** scope (T10–T12), theme toggle (T2/T4), multi-page structure (T1/T10–T12), design tokens (T2), KaTeX (T4), 3 visualizations (T6–T9), content incl. new 7–9 (T11–T12), testing (T13), Pages deploy (T1/T13/T14). All covered.
- **Type consistency:** `Grid` API (T6) consumed identically in T7–T9; `TOPICS` shape (T4) consumed in T4/T10; localStorage keys fixed: `gateda:theme`, `gateda:la:visited`.
- **No placeholders:** content tasks name exact sections to port from the reference HTML.
