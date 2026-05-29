# GATE DA — Study Site

An interactive, editorial study site for **GATE DA (Data Science & AI)**, starting with a
complete **Linear Algebra** guide. Concept-first explanations, worked examples, GATE exam
tips, quizzes, and **interactive canvas visualizations** for vectors, matrix transformations,
and eigenvectors.

- **Zero build step** — pure static HTML/CSS/JS. Edit a file, push, done.
- **Design:** warm editorial theme via [`getdesign add claude`](https://getdesign.app), with a light/dark toggle.
- **Math:** typeset with [KaTeX](https://katex.org).

## Run locally

Any static server works. For example:

```bash
python -m http.server 8000
# open http://localhost:8000
```

(Open via a server, not `file://`, so the shared header/sidebar load correctly.)

## Deploy on GitHub Pages

1. Push this repo to GitHub.
2. **Settings → Pages → Build and deployment → Source: Deploy from a branch.**
3. Branch: `main`, folder: `/ (root)`. Save.
4. Your site goes live at `https://<username>.github.io/<repo>/`.

The `.nojekyll` file ensures GitHub Pages serves all files as-is.

## Structure

```
index.html              Landing page (subject grid)
linear-algebra/         Linear Algebra subject — overview + 9 topic pages
assets/css/             Design tokens + styles
assets/js/              Shared chrome, theme, progress, quizzes
assets/js/viz/          Interactive canvas visualizations
```

## Adding a subject later

Copy the `linear-algebra/` folder pattern, add entries to `assets/js/topics.js`, and link
it from the landing page subject grid.
