# Render ASCII Matrices as Stacked KaTeX — Design Spec

**Date:** 2026-06-04
**Status:** Approved & implemented.

## Goal

Cramped inline matrices written as ASCII (e.g. `[1 0; 0 1]`, `[1 2 3; 0 1 4; 0 0 5]`, `[1;0]`)
are hard to read. Show every matrix as a proper stacked 2D matrix (KaTeX `\begin{bmatrix}`),
matching the rest of the app.

## Approach

- A bracketed token containing a `;` row separator is a matrix/vector. Convert each to inline
  KaTeX `$\begin{bmatrix}…\end{bmatrix}$` (rows split by `;`, entries by whitespace/comma).
  Normalize `−`→`-`, `·`→`\cdot`, unicode superscripts (e.g. `2¹⁰`) → `^{10}`.
- KaTeX's auto-render ignores `<pre>` and `<code>` by default, so:
  - `<pre>` blocks containing matrices are converted to `<div class="math-steps">` (one
    `<div class="ms-line">` per original line) so KaTeX renders; surrounding step text and `→`
    arrows are preserved.
  - inline `<code>` matrices are unwrapped to inline KaTeX.
  - bare inline tokens in `<p>`/`<li>` are converted in place.
- Pure ASCII diagrams (vector-arrow art, code) have no `;`-matrix, so they are skipped.
- Matrices hand-stacked across multiple `<pre>` lines can't be regex-matched; those blocks were
  rewritten manually into `math-steps` KaTeX.
- New `.math-steps` / `.ms-line` CSS mirrors the `.study-item pre` recessed-panel look but allows
  rendered math (no `white-space: pre`, generous line-height for tall matrices).

## Scope

10 content files: linear-algebra 02–09, machine-learning/04-logistic-regression,
optimization/03-multivariate. ~88 `<pre>` blocks + inline tokens; 172 matrix tokens total.
8 across-line blocks rewritten by hand.

## Verification

All 10 pages: KaTeX renders, **0 KaTeX errors**, no leftover `[…;…]` ASCII matrices, tag-balanced,
`$` parity, no mojibake, 0 console errors. Visually confirmed the rank-nullity example renders as
stacked bracketed matrices. Asset cache bumped.
