# Gate TikTok — Linear Algebra Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build an immersive, vertically scrollable Linear Algebra learning feed with linked concepts, detailed explanations, interactive questions, and local progress.

**Architecture:** Keep the feature isolated from the existing lesson shell. Static topic, card, and concept data feed a reusable vanilla-JavaScript renderer. CSS scroll snapping provides reliable paging; GSAP is progressive enhancement.

**Tech Stack:** Static HTML, CSS, vanilla JavaScript, KaTeX, GSAP CDN, Node's built-in test runner.

---

### Exhaustive content expansion

The production pilot now generates its cards from the existing Linear Algebra lesson pages instead of maintaining a small manually curated subset.

- [x] Extract all 66 basic definitions.
- [x] Extract all 287 Study in Depth items except entries marked GATE extra.
- [x] Extract all 54 GATE cheat-sheet points and 31 common traps.
- [x] Extract 37 written practice problems and 9 inline quizzes.
- [x] Extract all 21 GATE questions with their available answers and explanations.
- [x] Generate stable source anchors and verify that all 505 cards link to an existing source target.
- [x] Preserve canonical concept popovers inside generated detail content.

### Task 1: Data contracts and validation

**Files:**
- Create: `assets/js/gate-tiktok/gate-concepts.js`
- Create: `assets/js/gate-tiktok/gate-tiktok-data.js`
- Create: `assets/js/gate-tiktok/gate-tiktok-core.js`
- Test: `tests/gate-tiktok.test.js`

- [x] Write failing tests for unique IDs, valid topic/concept relations, exact source-content counts, question types, and deterministic topic ordering.
- [ ] Run `node --test tests/gate-tiktok.test.js` and confirm failures are caused by missing modules.
- [ ] Implement the data contracts, validator, card filtering, and navigation helpers.
- [ ] Run the tests and confirm all pass.

### Task 2: Page shell and feed rendering

**Files:**
- Create: `linear-algebra/gate-tiktok.html`
- Create: `assets/css/gate-tiktok.css`
- Create: `assets/js/gate-tiktok/gate-tiktok.js`

- [ ] Add the dark full-viewport shell, topic menu, feed, detail dialog, concept dialog, progress UI, and dependency scripts.
- [ ] Render cards from the validated static dataset.
- [ ] Add CSS scroll snapping, responsive layouts, focus styles, and reduced-motion behavior.
- [ ] Add GSAP progressive-enhancement animations.

### Task 3: Learning interactions

**Files:**
- Modify: `assets/js/gate-tiktok/gate-tiktok.js`

- [ ] Add one-card wheel/keyboard navigation and local resume state.
- [ ] Add MCQ, MSQ, and NAT grading with explanation feedback.
- [ ] Add the full-height detail sheet with focus trap and source links.
- [ ] Add linked concept popovers, concept history, related-concept traversal, and mobile positioning.
- [ ] Render newly inserted mathematics through KaTeX.

### Task 4: Existing navigation integration

**Files:**
- Modify: `assets/js/app.js`

- [ ] Add Gate TikTok under each subject's Reference group.
- [ ] Add the `tiktok` active-page state without changing existing page behavior.

### Task 5: Verification

- [ ] Run `node --test tests/gate-tiktok.test.js`.
- [ ] Run static checks for missing local assets and malformed card/source references.
- [ ] Start `python -m http.server 8000`.
- [ ] Verify mobile and desktop layouts, scroll snapping, topic navigation, all question types, dialogs, concept history, persistence, reduced motion, and GitHub Pages-relative URLs.
- [ ] Review `git diff --check` and the final worktree status.
