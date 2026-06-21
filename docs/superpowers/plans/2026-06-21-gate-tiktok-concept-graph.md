# Gate TikTok Concept Graph Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Enrich all 66 Linear Algebra definition cards and add a recursively explorable, explanation-first concept graph with GATE-question pathways.

**Architecture:** Keep authored learning knowledge separate from generated source cards. Extend canonical concept records with beginner content and typed edges, add a pure graph module for validation/expansion/path finding, and render the graph inside the existing concept dialog using accessible SVG plus a relationship list. The source generator maps every definition card to one canonical concept and merges its concise learning fields into the feed.

**Tech Stack:** Static HTML, CSS, vanilla JavaScript, SVG, KaTeX, GSAP progressive enhancement, Python standard-library content generator, Node built-in test runner.

---

## File structure

- Create `assets/js/gate-tiktok/gate-concept-graph-core.js`: pure edge validation, neighbour expansion, deduplication, and path finding.
- Modify `assets/js/gate-tiktok/gate-concepts.js`: complete canonical concept knowledge and typed graph edges.
- Modify `scripts/generate_gate_tiktok_content.py`: map all 66 definitions to canonical concepts and enrich generated card fields.
- Regenerate `assets/js/gate-tiktok/gate-tiktok-source-data.js`: source-backed cards with canonical learning metadata.
- Modify `assets/js/gate-tiktok/gate-tiktok-core.js`: validate enriched cards, concepts, edges, and question metadata.
- Modify `assets/js/gate-tiktok/gate-tiktok.js`: enriched definition rendering, concept sheet, recursive graph, path highlighting, and GATE pathways.
- Modify `assets/css/gate-tiktok.css`: definition-card hierarchy and responsive graph/detail layout.
- Modify `linear-algebra/gate-tiktok.html`: load graph core and add graph controls/status regions.
- Modify `tests/gate-tiktok.test.js`: data, graph, accessibility, and integration coverage.

### Task 1: Pure concept graph behavior

**Files:**
- Create: `assets/js/gate-tiktok/gate-concept-graph-core.js`
- Modify: `tests/gate-tiktok.test.js`

- [ ] Add failing tests proving that direct-neighbour expansion is deduplicated, recursive expansion preserves existing nodes, reset restores the first ring, and breadth-first path finding returns a valid route.
- [ ] Run `node --test tests/gate-tiktok.test.js` and confirm failures report the missing graph-core module.
- [ ] Implement a UMD module exposing:

```js
directGraph(concepts, rootId)
expandGraph(concepts, state, conceptId)
shortestPath(concepts, startId, targetId)
edgeBetween(concepts, sourceId, targetId)
```

`directGraph` returns `{ rootId, focusedId, expandedIds, nodeIds, edgeIds }`. `expandGraph` returns a new state, never mutates input, and never duplicates node or edge IDs. `shortestPath` traverses directed edges first and falls back to reverse edges so students can inspect conceptual routes in either direction.

- [ ] Run the targeted test and confirm it passes.
- [ ] Commit with `feat: add concept graph traversal core`.

### Task 2: Enriched canonical learning graph

**Files:**
- Modify: `assets/js/gate-tiktok/gate-concepts.js`
- Modify: `assets/js/gate-tiktok/gate-tiktok-core.js`
- Modify: `tests/gate-tiktok.test.js`

- [ ] Add failing validation tests requiring every definition concept to provide:

```js
beginnerMeaning
formula
example
exampleExplanation
counterexample
counterexampleExplanation
properties[]
consequences[]
gateSignals[]
gateTraps[]
edges[]
questionIds[]
```

- [ ] Add failing tests for supported edge types, valid targets, unique edge IDs, non-empty explanations, importance values `core|useful|advanced`, and explicit square-matrix assumptions for determinant/inverse/singularity edges.
- [ ] Add traversal tests for the determinant, orthogonal-matrix, symmetric-matrix, and SVD/PCA reasoning chains from the approved specification.
- [ ] Run tests and verify they fail because the existing concept records lack the new fields and typed edges.
- [ ] Expand the canonical graph to cover every basic definition, including minor, cofactor, adjugate, augmented matrix, homogeneous system, characteristic polynomial, multiplicities, spectrum, similar matrices, defective matrices, dot product, norm, angle, Gram–Schmidt, rank-k approximation, principal component, and dimensionality reduction.
- [ ] Author each edge with `id`, `targetId`, `type`, `label`, `explanation`, optional `formula`, assumptions, and importance. Preserve `prerequisites` and `relatedConcepts` as derived compatibility fields until the runtime is migrated.
- [ ] Extend `validateLearningGraph` to validate the enriched schema and typed edges.
- [ ] Run all tests and confirm the graph data passes.
- [ ] Commit with `feat: enrich Linear Algebra concept knowledge`.

### Task 3: Definition-card enrichment

**Files:**
- Modify: `scripts/generate_gate_tiktok_content.py`
- Regenerate: `assets/js/gate-tiktok/gate-tiktok-source-data.js`
- Modify: `assets/js/gate-tiktok/gate-tiktok-data.js`
- Modify: `tests/gate-tiktok.test.js`

- [ ] Add failing tests requiring all 66 `basic-definition` cards to contain:

```js
primaryConceptId
beginnerMeaning
formula
example
consequence
gateSignal
```

- [ ] Add an exact definition-card-to-concept map keyed by stable generated card ID, and test that all 66 IDs are mapped exactly once.
- [ ] Run tests and verify they fail on missing enriched fields.
- [ ] Update the generator to write `primaryConceptId` for each definition card. Keep source text and anchors unchanged.
- [ ] Update `gate-tiktok-data.js` to merge canonical beginner fields into generated definition cards at runtime, allowing regenerated source data to remain source-backed while authored knowledge remains centralized.
- [ ] Regenerate the source dataset with `python scripts/generate_gate_tiktok_content.py`.
- [ ] Run tests and verify all 66 cards satisfy the learning contract.
- [ ] Commit with `feat: enrich beginner definition cards`.

### Task 4: GATE-question concept indexing

**Files:**
- Modify: `assets/js/gate-tiktok/gate-tiktok-data.js`
- Modify: `assets/js/gate-tiktok/gate-concepts.js`
- Modify: `tests/gate-tiktok.test.js`

- [ ] Add failing tests requiring each of the 21 GATE cards to expose `gateAnalysis` containing `conceptIds`, `recognitionClues`, `reasoningSteps`, `formulasUsed`, `trap`, and `relatedQuestionIds`.
- [ ] Add failing tests that every concept `questionIds` entry resolves to a GATE card and every GATE card is reachable from at least one concept.
- [ ] Run tests and verify missing analysis metadata causes the expected failure.
- [ ] Author a stable analysis map keyed by GATE card ID and merge it into the cards. Use actual reasoning from the existing answer explanations; do not infer question links from word matching.
- [ ] Populate concept `questionIds` from the authored analysis map and validate references.
- [ ] Run tests and confirm the question index is complete.
- [ ] Commit with `feat: index GATE questions by concept reasoning`.

### Task 5: Enriched definition feed cards

**Files:**
- Modify: `assets/js/gate-tiktok/gate-tiktok.js`
- Modify: `assets/css/gate-tiktok.css`
- Modify: `tests/gate-tiktok.test.js`

- [ ] Add failing runtime/static tests for definition-card labels: “Meaning”, “Example”, “Therefore”, and “GATE connection”.
- [ ] Run tests and confirm the current generic card renderer fails the new expectations.
- [ ] Add a dedicated definition-card renderer that shows the beginner meaning, formatted mathematical example, one immediate consequence, and GATE signal without making the viewport card excessively dense.
- [ ] Ensure tapping linked concepts or controls does not open the full detail sheet accidentally.
- [ ] Add responsive styling with a clear reading hierarchy, internal overflow only when necessary, and reduced-motion support.
- [ ] Run tests and inspect representative vector, identity-matrix, determinant, orthogonal-matrix, eigenvalue, and PCA cards.
- [ ] Commit with `feat: improve beginner definition card teaching`.

### Task 6: Detailed learning sheet and recursive graph

**Files:**
- Modify: `linear-algebra/gate-tiktok.html`
- Modify: `assets/js/gate-tiktok/gate-tiktok.js`
- Modify: `assets/css/gate-tiktok.css`
- Modify: `tests/gate-tiktok.test.js`

- [ ] Add failing tests for graph controls, accessible graph status, reset, back, path highlighting, node expansion, edge detail, and the non-visual relationship list.
- [ ] Run tests and verify the expected graph markers are absent.
- [ ] Load `gate-concept-graph-core.js` before the runtime.
- [ ] Replace the flat concept popup body with:
  - beginner explanation and formula;
  - example and counterexample;
  - properties, consequences, traps, and GATE signals;
  - SVG graph viewport;
  - zoom, reset, back, and “show path” controls;
  - accessible relationship list;
  - relevant GATE questions.
- [ ] Render deterministic rings around the focused node. Expanding a node adds its neighbours to the existing SVG and preserves coordinates for existing nodes.
- [ ] Make node and edge elements keyboard operable. Selecting an edge shows its explanation, assumptions, formula, and GATE importance.
- [ ] On desktop, show graph and explanation side by side. On mobile, keep the graph visible and open selected node/edge content in a bottom detail area within the concept dialog.
- [ ] Prevent graph pan, wheel, touch, and keyboard controls from moving the underlying feed.
- [ ] Run tests and browser-check repeated expansion from determinant through inverse, rank, eigenvalue, and null space.
- [ ] Commit with `feat: add recursive Linear Algebra concept graph`.

### Task 7: GATE pathways in concept and question views

**Files:**
- Modify: `assets/js/gate-tiktok/gate-tiktok.js`
- Modify: `assets/css/gate-tiktok.css`
- Modify: `tests/gate-tiktok.test.js`

- [ ] Add failing tests for concept-linked GATE question buttons and rendered recognition clues, reasoning steps, formula list, and trap.
- [ ] Run tests and verify the UI lacks the new pathway.
- [ ] Render concept questions grouped as definition checks, consequence tests, multi-concept questions, and traps.
- [ ] Selecting a question scrolls to its feed card or opens its explanation without discarding graph state.
- [ ] Extend question feedback with the authored recognition clue, numbered reasoning chain, related graph concepts, formula chips, and common trap.
- [ ] Run tests and verify MCQ, MSQ, NAT, and reveal behavior remains correct.
- [ ] Commit with `feat: connect concept graph to GATE reasoning`.

### Task 8: Verification and documentation

**Files:**
- Modify: `docs/superpowers/specs/2026-06-21-gate-tiktok-concept-graph-design.md` only if implementation details require an explicit clarification.

- [ ] Run `python scripts/generate_gate_tiktok_content.py` and verify it reports 505 cards and 66 definitions.
- [ ] Run `node --check` on all Gate TikTok JavaScript modules.
- [ ] Run `node --test tests/gate-tiktok.test.js` and require zero failures.
- [ ] Run `git diff --check`.
- [ ] Verify `http://localhost:8010/linear-algebra/gate-tiktok.html` returns HTTP 200.
- [ ] Browser-test mobile and laptop layouts, repeated node expansion, graph reset/history, edge explanations, path highlighting, keyboard operation, exact lesson links, and GATE-question pathways.
- [ ] Verify representative reasoning:
  - determinant zero to nontrivial null space;
  - orthogonal matrix to unit singular values;
  - symmetric matrix to PCA;
  - SVD to low-rank approximation and variance retention.
- [ ] Confirm the worktree is clean except for intended changes.
- [ ] Commit with `feat: add connected beginner learning graph`.

### Task 9: Opt-in graph and compact connections

**Files:**
- Modify: `linear-algebra/gate-tiktok.html`
- Modify: `assets/js/gate-tiktok/gate-concept-graph-core.js`
- Modify: `assets/js/gate-tiktok/gate-tiktok.js`
- Modify: `assets/css/gate-tiktok.css`
- Modify: `tests/gate-tiktok.test.js`

- [ ] Add failing tests proving the concept sheet is the default view, the graph panel is hidden until requested, and every concept renders no more than five ranked connection rows.
- [ ] Add failing tests for an `Explore graph` action beside the lesson action and a `Back to concept` action inside the graph workspace.
- [ ] Run `node --test tests/gate-tiktok.test.js` and confirm the current always-visible graph fails these expectations.
- [ ] Add `rankedConnections(concepts, conceptId, limit)` to the graph core. Sort equivalence and implication edges first, then prerequisites, same-lesson connections, GATE patterns, and remaining useful/advanced edges. Deduplicate target concepts and cap the result at five.
- [ ] Render one compact **Connect the dots** card after relevant GATE questions. Each row shows relationship label, target concept, and explanation; selecting it navigates within the concept sheet.
- [ ] Move graph markup into a dedicated hidden workspace within the concept dialog. `Explore graph` initializes and reveals it; `Back to concept` hides it and restores the concept sheet scroll position.
- [ ] Keep node expansion, edge details, reset, path, zoom, keyboard behavior, and graph state functional inside the dedicated workspace.
- [ ] Update responsive styling so the compact sheet uses the full dialog until graph mode is explicitly entered.
- [ ] Run the full Node test suite and browser-test mobile and desktop opening, returning, connection ranking, scroll restoration, and repeated graph expansion.
- [ ] Commit with `feat: make concept graph opt-in`.

### Task 10: Graph node learning and restoration

**Files:**
- Modify: `linear-algebra/gate-tiktok.html`
- Modify: `assets/js/gate-tiktok/gate-tiktok.js`
- Modify: `assets/css/gate-tiktok.css`
- Modify: `tests/gate-tiktok.test.js`

- [ ] Add failing tests for graph node meaning, formula, connection explanation, `Read this concept`, and `Open full lesson section` controls.
- [ ] Add failing tests proving graph close and Escape return to the graph-entry concept while the next close exits the overall dialog.
- [ ] Run `node --test tests/gate-tiktok.test.js` and verify the current graph behavior fails because node selection replaces hidden sheet state.
- [ ] Store `graphEntryConceptId`, `graphEntryScroll`, and the graph selection separately from `currentConceptId`.
- [ ] Render selected node or edge information inside a dedicated graph information panel without modifying the hidden concept sheet.
- [ ] Make `Read this concept` leave graph mode, intentionally navigate to the selected concept sheet from the top, and preserve normal concept history.
- [ ] Make `Open full lesson section` use the selected node's exact lesson URL and anchor.
- [ ] Route graph `Back to concept`, graph close, and Escape through one restoration function that returns to the graph-entry concept and saved scroll position.
- [ ] Keep concept-dialog close behavior unchanged when graph mode is not active.
- [ ] Run automated tests and browser-test covariance/PCA node selection, lesson linking, explicit concept reading, graph close, Escape, and scroll restoration.
- [ ] Commit with `fix: preserve concept context from graph`.
