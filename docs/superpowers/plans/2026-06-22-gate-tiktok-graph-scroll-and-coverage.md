# Gate TikTok Graph Scrolling and Coverage Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make selected graph concepts immediately readable through a responsive split layout and prove exhaustive Linear Algebra card and graph coverage.

**Architecture:** Keep the existing static HTML/CSS/JavaScript runtime. Restructure only the graph view into a graph-stage plus selected-node detail panel: two columns on wide screens and one continuous hidden-scroll column on narrow screens. Extend the existing Node test suite with source-identity, graph-connectedness, and layout-contract assertions.

**Tech Stack:** Static HTML, CSS Grid, vanilla JavaScript, SVG, Node.js built-in test runner.

---

### Task 1: Lock the graph layout and scroll contract with failing tests

**Files:**
- Modify: `tests/gate-tiktok.test.js`
- Test: `tests/gate-tiktok.test.js`

- [ ] **Step 1: Add a failing graph-layout contract test**

Add assertions that require:

```js
test("graph selection uses one responsive scroll surface", () => {
  const html = fs.readFileSync(path.join(__dirname, "../linear-algebra/gate-tiktok.html"), "utf8");
  const css = fs.readFileSync(path.join(__dirname, "../assets/css/gate-tiktok.css"), "utf8");
  const runtime = fs.readFileSync(
    path.join(__dirname, "../assets/js/gate-tiktok/gate-tiktok.js"),
    "utf8"
  );

  ["graphScrollSurface", "graphStage", "graphNodePanel"]
    .forEach((id) => assert.match(html, new RegExp(`id="${id}"`)));
  assert.match(css, /\.gt-graph-scroll-surface[^}]*overflow-y:auto/s);
  assert.match(css, /\.gt-graph-layout[^}]*grid-template-columns/s);
  assert.doesNotMatch(css, /\.gt-graph-node-panel[^}]*position:absolute/s);
  assert.match(runtime, /revealSelectedGraphNode/);
});
```

- [ ] **Step 2: Run the test and confirm RED**

Run:

```powershell
node --test tests\gate-tiktok.test.js
```

Expected: FAIL because the graph-stage IDs, grid layout, and reveal helper do not exist.

- [ ] **Step 3: Commit the failing contract test**

```powershell
git add tests/gate-tiktok.test.js
git commit -m "test: define responsive graph scroll contract"
```

### Task 2: Implement the responsive graph/detail layout

**Files:**
- Modify: `linear-algebra/gate-tiktok.html`
- Modify: `assets/css/gate-tiktok.css`
- Modify: `assets/js/gate-tiktok/gate-tiktok.js`
- Test: `tests/gate-tiktok.test.js`

- [ ] **Step 1: Restructure the graph markup**

Inside `conceptGraphView`, create one scrolling owner and one responsive layout:

```html
<section class="gt-graph-scroll-surface" id="graphScrollSurface" aria-label="Explorable concept graph">
  <div class="gt-graph-toolbar">...</div>
  <p class="gt-graph-status" id="conceptGraphStatus" aria-live="polite"></p>
  <div class="gt-graph-layout">
    <div class="gt-graph-stage" id="graphStage">
      <svg id="conceptGraph" class="gt-concept-graph" ...></svg>
      <div class="gt-relationship-accessible">...</div>
    </div>
    <aside class="gt-graph-node-panel" id="graphNodePanel" hidden aria-live="polite">...</aside>
  </div>
</section>
```

- [ ] **Step 2: Give the graph view exactly one vertical scroll owner**

Add CSS equivalent to:

```css
.gt-concept-graph-view {
  min-height: 0;
  flex: 1;
  overflow: hidden;
}

.gt-graph-scroll-surface {
  height: 100%;
  overflow-y: auto;
  overscroll-behavior: contain;
  scrollbar-width: none;
}

.gt-graph-scroll-surface::-webkit-scrollbar {
  display: none;
  width: 0;
  height: 0;
}

.gt-graph-layout {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 14px;
}

.gt-graph-node-panel {
  position: static;
  max-height: none;
  overflow: visible;
}

@media (min-width: 850px) {
  .gt-graph-layout {
    grid-template-columns: minmax(520px, 1.45fr) minmax(300px, .75fr);
    align-items: start;
  }

  .gt-graph-node-panel {
    position: sticky;
    top: 0;
  }
}
```

Remove the old mobile nested graph-panel scrolling and desktop absolute selected-node positioning.

- [ ] **Step 3: Reveal the selected panel on narrow screens**

Add:

```js
function revealSelectedGraphNode() {
  if (!window.matchMedia("(max-width: 849px)").matches) return;
  var panel = document.getElementById("graphNodePanel");
  requestAnimationFrame(function () {
    panel.scrollIntoView({
      block: "nearest",
      behavior: reduceMotion ? "auto" : "smooth"
    });
  });
}
```

Call `revealSelectedGraphNode()` after rendering the selected node panel.

- [ ] **Step 4: Run the suite and confirm GREEN**

Run:

```powershell
node --test tests\gate-tiktok.test.js
node --check assets\js\gate-tiktok\gate-tiktok.js
git diff --check
```

Expected: all tests pass, JavaScript syntax is valid, and the diff has no whitespace errors.

- [ ] **Step 5: Commit the graph fix**

```powershell
git add linear-algebra/gate-tiktok.html assets/css/gate-tiktok.css assets/js/gate-tiktok/gate-tiktok.js tests/gate-tiktok.test.js
git commit -m "fix: make graph concepts continuously readable"
```

### Task 3: Prove one-to-one source coverage

**Files:**
- Modify: `tests/gate-tiktok.test.js`
- Read: `assets/js/gate-tiktok/gate-tiktok-source-data.js`
- Test: `tests/gate-tiktok.test.js`

- [ ] **Step 1: Add source identity and category assertions**

Add a test that validates every card has a unique source identity and all required categories occur in every topic where the source supplies them:

```js
test("every approved source point maps to exactly one ordered card", () => {
  const identities = data.cards.map((card) =>
    [card.source, card.sourceAnchor, card.type].join("#")
  );
  assert.equal(new Set(identities).size, identities.length);

  data.topics.forEach((topic) => {
    const cards = core.cardsForTopic(data.cards, topic.id);
    assert.ok(cards.some((card) => card.type === "basic-definition"), `${topic.id} missing definitions`);
    assert.ok(cards.some((card) => card.type === "deep-dive"), `${topic.id} missing Study in Depth`);
    assert.ok(cards.some((card) => card.type === "cheat-sheet"), `${topic.id} missing cheat sheets`);
    assert.ok(cards.some((card) => card.type === "trap"), `${topic.id} missing traps`);
    assert.ok(cards.some((card) => card.type === "practice"), `${topic.id} missing practice`);
    assert.ok(cards.some((card) => card.type === "gate-question"), `${topic.id} missing GATE questions`);
  });
});
```

If a topic intentionally lacks a source category, derive the expected topic/category pairs from `sourceData.cards` rather than weakening the assertion.

- [ ] **Step 2: Run the test and diagnose any duplicate or missing mapping**

Run:

```powershell
node --test tests\gate-tiktok.test.js
```

Expected: either PASS, proving the generated 505-card inventory is exhaustive, or a precise duplicate/missing identity failure to fix in source generation data.

- [ ] **Step 3: Fix only confirmed source mapping defects**

If failures exist, update the affected card records in `assets/js/gate-tiktok/gate-tiktok-source-data.js` so each approved source point has one exact `source + sourceAnchor + type` identity and retains its guided topic order.

- [ ] **Step 4: Re-run and commit**

```powershell
node --test tests\gate-tiktok.test.js
git add tests/gate-tiktok.test.js assets/js/gate-tiktok/gate-tiktok-source-data.js
git commit -m "test: enforce exhaustive Linear Algebra card coverage"
```

Do not stage `gate-tiktok-source-data.js` if no data correction was required.

### Task 4: Prove the entire canonical graph is connected

**Files:**
- Modify: `tests/gate-tiktok.test.js`
- Read: `assets/js/gate-tiktok/gate-concepts.js`
- Read: `assets/js/gate-tiktok/gate-concept-graph-core.js`
- Test: `tests/gate-tiktok.test.js`

- [ ] **Step 1: Add an undirected connected-component test**

Add:

```js
test("all canonical Linear Algebra concepts belong to one connected graph", () => {
  const ids = Object.keys(concepts);
  const seen = new Set([ids[0]]);
  const queue = [ids[0]];

  while (queue.length) {
    const current = queue.shift();
    graphCore.neighborIds(concepts, current).forEach((neighbor) => {
      if (!seen.has(neighbor)) {
        seen.add(neighbor);
        queue.push(neighbor);
      }
    });
  }

  assert.deepEqual(
    ids.filter((id) => !seen.has(id)),
    [],
    "disconnected canonical concepts"
  );
});
```

- [ ] **Step 2: Run the test and confirm graph status**

Run:

```powershell
node --test tests\gate-tiktok.test.js
```

Expected: PASS if all concepts are connected. If it fails, the output lists disconnected canonical concept IDs.

- [ ] **Step 3: Add only pedagogically valid missing relationships**

For each disconnected concept, add an explicitly authored relationship in `assets/js/gate-tiktok/gate-concepts.js` with:

```js
{
  targetId: "existing-concept-id",
  type: "builds-on",
  label: "Builds on",
  explanation: "A student-facing explanation of why these concepts connect.",
  gateImportance: "How this connection appears in GATE reasoning."
}
```

Do not add arbitrary edges solely to satisfy connectivity.

- [ ] **Step 4: Re-run and commit**

```powershell
node --test tests\gate-tiktok.test.js
git add tests/gate-tiktok.test.js assets/js/gate-tiktok/gate-concepts.js
git commit -m "test: verify complete Linear Algebra concept connectivity"
```

Do not stage `gate-concepts.js` if the graph was already connected.

### Task 5: Browser QA and final verification

**Files:**
- Verify: `linear-algebra/gate-tiktok.html`
- Verify: `assets/css/gate-tiktok.css`
- Verify: `assets/js/gate-tiktok/gate-tiktok.js`

- [ ] **Step 1: Reload the local preview**

Use:

```text
http://localhost:8010/linear-algebra/gate-tiktok.html
```

- [ ] **Step 2: Validate phone behavior**

At 360×640 and 390×844:

- open a concept graph;
- select Basis, Gram-Schmidt, and another expanded node;
- verify the graph view scrolls as one surface;
- verify the selected detail panel becomes visible;
- verify no scrollbar track is visible;
- verify `Read this concept` and the exact lesson link are reachable.

- [ ] **Step 3: Validate tablet and laptop behavior**

At 768×1024 and 1440×900:

- verify tablet uses the continuous stacked layout;
- verify laptop uses graph + sticky detail side panel;
- verify the panel never covers graph nodes;
- verify zoom, reset, path, repeated expansion, close, Escape, and graph return behavior.

- [ ] **Step 4: Run fresh final verification**

```powershell
node --test tests\gate-tiktok.test.js
node --check assets\js\gate-tiktok\gate-tiktok.js
git diff --check
$r = Invoke-WebRequest -UseBasicParsing 'http://localhost:8010/linear-algebra/gate-tiktok.html'
"HTTP $($r.StatusCode)"
git status --short
```

Expected: all tests pass, syntax and diff checks exit zero, HTTP is 200, and the worktree is clean after commits.
