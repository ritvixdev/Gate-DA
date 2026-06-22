const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const concepts = require("../assets/js/gate-tiktok/gate-concepts.js");
const data = require("../assets/js/gate-tiktok/gate-tiktok-data.js");
const sourceData = require("../assets/js/gate-tiktok/gate-tiktok-source-data.js");
const core = require("../assets/js/gate-tiktok/gate-tiktok-core.js");
const graphCore = require("../assets/js/gate-tiktok/gate-concept-graph-core.js");

test("concept graph expands recursively without duplicate nodes or edges", () => {
  const first = graphCore.directGraph(concepts, "determinant");
  assert.equal(first.rootId, "determinant");
  assert.equal(new Set(first.nodeIds).size, first.nodeIds.length);
  assert.equal(new Set(first.edgeIds).size, first.edgeIds.length);

  const expanded = graphCore.expandGraph(concepts, first, "inverse");
  assert.ok(expanded.nodeIds.length >= first.nodeIds.length);
  assert.equal(new Set(expanded.nodeIds).size, expanded.nodeIds.length);
  assert.equal(new Set(expanded.edgeIds).size, expanded.edgeIds.length);
  assert.ok(expanded.expandedIds.includes("inverse"));
});

test("concept graph finds cross-topic reasoning paths", () => {
  const path = graphCore.shortestPath(concepts, "determinant", "kernel");
  assert.equal(path[0], "determinant");
  assert.equal(path[path.length - 1], "kernel");
  assert.ok(path.length >= 3);
});

test("ranked concept connections are relevant, unique and capped at five", () => {
  const ranked = graphCore.rankedConnections(concepts, "determinant", 5);
  assert.ok(ranked.length > 0);
  assert.ok(ranked.length <= 5);
  assert.equal(new Set(ranked.map((edge) => edge.targetId)).size, ranked.length);
  assert.equal(ranked[0].importance, "core");
});

test("every canonical concept supports beginner learning and typed connections", () => {
  const supportedTypes = new Set([
    "prerequisite", "implies", "equivalent", "contrasts",
    "used-by", "decomposes-into", "geometric", "gate-pattern",
  ]);
  Object.values(concepts).forEach((concept) => {
    [
      "beginnerMeaning", "formula", "example", "exampleExplanation",
      "counterexample", "counterexampleExplanation",
    ].forEach((field) => assert.ok(concept[field], `${concept.id} missing ${field}`));
    ["properties", "consequences", "gateSignals", "gateTraps", "edges", "questionIds"]
      .forEach((field) => assert.ok(Array.isArray(concept[field]), `${concept.id} missing ${field}`));
    concept.edges.forEach((edge) => {
      assert.ok(edge.id, `${concept.id} edge missing id`);
      assert.ok(concepts[edge.targetId], `${concept.id} invalid edge target ${edge.targetId}`);
      assert.ok(supportedTypes.has(edge.type), `${concept.id} invalid edge type ${edge.type}`);
      assert.ok(edge.explanation, `${edge.id} missing explanation`);
      assert.ok(["core", "useful", "advanced"].includes(edge.importance), `${edge.id} invalid importance`);
    });
  });
});

test("all basic definitions are enriched through one canonical concept", () => {
  const definitions = data.cards.filter((card) => card.type === "basic-definition");
  assert.equal(definitions.length, 66);
  definitions.forEach((card) => {
    assert.ok(concepts[card.primaryConceptId], `${card.id} missing primary concept`);
    ["beginnerMeaning", "formula", "example", "consequence", "gateSignal"]
      .forEach((field) => assert.ok(card[field], `${card.id} missing ${field}`));
  });
});

test("every real GATE question is indexed by concepts and reasoning", () => {
  const gateCards = data.cards.filter((card) => card.type === "gate-question");
  assert.equal(gateCards.length, 21);
  gateCards.forEach((card) => {
    const analysis = card.gateAnalysis;
    assert.ok(analysis, `${card.id} missing gateAnalysis`);
    ["conceptIds", "recognitionClues", "reasoningSteps", "formulasUsed", "relatedQuestionIds"]
      .forEach((field) => assert.ok(Array.isArray(analysis[field]), `${card.id} missing ${field}`));
    assert.ok(analysis.conceptIds.length, `${card.id} has no concepts`);
    assert.ok(analysis.recognitionClues.length, `${card.id} has no clues`);
    assert.ok(analysis.reasoningSteps.length, `${card.id} has no reasoning`);
    assert.ok(analysis.formulasUsed.length, `${card.id} has no formulas`);
    assert.ok(analysis.trap, `${card.id} missing trap`);
  });
  Object.values(concepts).forEach((concept) => {
    concept.questionIds.forEach((id) => {
      assert.ok(gateCards.some((card) => card.id === id), `${concept.id} invalid question ${id}`);
    });
  });
});

test("required implication chains remain traversable", () => {
  [
    ["determinant", "singular-matrix"],
    ["singular-matrix", "inverse"],
    ["orthogonal-matrix", "singular-value"],
    ["symmetric-matrix", "pca"],
    ["svd", "rank-k-approximation"],
  ].forEach(([start, end]) => {
    const route = graphCore.shortestPath(concepts, start, end);
    assert.equal(route[0], start, `${start} route missing`);
    assert.equal(route[route.length - 1], end, `${start} cannot reach ${end}`);
  });
});

test("Linear Algebra feed contains every approved source point", () => {
  assert.equal(data.topics.length, 9);
  assert.equal(data.cards.length, 505);
  assert.deepEqual(sourceData.sourceCounts, {
    definitions: 66,
    study: 287,
    cheatSheets: 54,
    traps: 31,
    practice: 37,
    inlineQuizzes: 9,
    gateQuestions: 21,
  });
  assert.equal(data.cards.some((card) => /GATE extra/i.test(card.hook)), false);
});

test("every approved source point maps to exactly one ordered card", () => {
  const identities = data.cards.map((card) =>
    [card.source, card.sourceAnchor, card.type].join("#")
  );
  assert.equal(new Set(identities).size, identities.length);

  data.topics.forEach((topic) => {
    const cards = core.cardsForTopic(data.cards, topic.id);
    [
      "basic-definition",
      "deep-dive",
      "cheat-sheet",
      "trap",
      "practice",
      "gate-question",
    ].forEach((type) => {
      assert.ok(cards.some((card) => card.type === type), `${topic.id} missing ${type}`);
    });
    assert.deepEqual(
      cards.map((card) => card.order),
      [...Array(cards.length).keys()].map((n) => n + 1),
      `${topic.id} order is not contiguous`
    );
  });
});

test("all cards and concepts pass schema and relationship validation", () => {
  assert.deepEqual(core.validateLearningGraph(data, concepts), []);
});

test("the feed contains every approved card type and all question formats", () => {
  const types = new Set(data.cards.map((card) => card.type));
  ["deep-dive", "cheat-sheet", "trap", "worked-example", "practice", "gate-question"]
    .forEach((type) => assert.ok(types.has(type), `missing ${type}`));

  const questionTypes = new Set(
    data.cards.filter((card) => card.question).map((card) => card.question.type)
  );
  ["MCQ", "MSQ", "NAT"].forEach((type) => assert.ok(questionTypes.has(type)));
});

test("topic filtering preserves guided order", () => {
  const firstTopic = data.topics[0];
  const cards = core.cardsForTopic(data.cards, firstTopic.id);
  assert.ok(cards.length > 40);
  assert.ok(cards.every((card) => card.topicId === firstTopic.id));
  assert.deepEqual(cards.map((card) => card.order), [...Array(cards.length).keys()].map((n) => n + 1));
});

test("next card index clamps and wraps only when requested", () => {
  assert.equal(core.nextIndex(0, 1, 5, false), 1);
  assert.equal(core.nextIndex(4, 1, 5, false), 4);
  assert.equal(core.nextIndex(4, 1, 5, true), 0);
  assert.equal(core.nextIndex(0, -1, 5, true), 4);
});

test("question grading supports MCQ, MSQ and NAT ranges", () => {
  assert.equal(core.gradeQuestion({ type: "MCQ", answer: "B" }, ["B"]), true);
  assert.equal(core.gradeQuestion({ type: "MSQ", answer: ["A", "C"] }, ["C", "A"]), true);
  assert.equal(core.gradeQuestion({ type: "NAT", answer: [0.49, 0.51] }, "0.5"), true);
  assert.equal(core.gradeQuestion({ type: "NAT", answer: [0.49, 0.51] }, "0.7"), false);
  assert.equal(core.gradeQuestion({ type: "REVEAL", answer: true }, null), true);
});

test("every exhaustive card has full source detail and an exact anchor", () => {
  data.cards.forEach((card) => {
    assert.ok(card.detailHtml || card.detail, `${card.id} missing detail`);
    assert.ok(card.sourceAnchor, `${card.id} missing sourceAnchor`);
    assert.ok(card.sourceLabel, `${card.id} missing sourceLabel`);
  });
});

test("exhaustive cards keep swipe-screen hooks and previews concise", () => {
  data.cards.forEach((card) => {
    assert.ok(card.hook.length <= 140, `${card.id} hook too long`);
    assert.ok(card.body.length <= 260, `${card.id} body too long`);
  });
});

test("core graph includes required cross-topic concept paths", () => {
  const required = {
    eigenvalue: ["eigenvector", "diagonalization"],
    "symmetric-matrix": ["orthogonality", "spectral-theorem"],
    rank: ["nullity", "linear-equations"],
    svd: ["pca"],
    pca: ["covariance"],
  };
  Object.entries(required).forEach(([id, related]) => {
    assert.ok(concepts[id], `missing ${id}`);
    related.forEach((target) => {
      assert.ok(
        concepts[id].relatedConcepts.includes(target),
        `${id} does not relate to ${target}`
      );
    });
  });
});

test("all canonical Linear Algebra concepts belong to one connected graph", () => {
  const ids = Object.keys(concepts);
  const seen = new Set([ids[0]]);
  const queue = [ids[0]];

  while (queue.length) {
    const current = queue.shift();
    graphCore.neighbourIds(concepts, current).forEach((neighbor) => {
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

test("Gate TikTok page exposes feed, topic menu, detail sheet and concept dialog", () => {
  const html = fs.readFileSync(
    path.join(__dirname, "../linear-algebra/gate-tiktok.html"),
    "utf8"
  );
  ["gateFeed", "topicMenu", "detailDialog", "conceptDialog", "gate-tiktok.js"]
    .forEach((marker) => assert.match(html, new RegExp(marker)));
});

test("definition cards and concept dialog expose connected learning controls", () => {
  const html = fs.readFileSync(
    path.join(__dirname, "../linear-algebra/gate-tiktok.html"),
    "utf8"
  );
  const runtime = fs.readFileSync(
    path.join(__dirname, "../assets/js/gate-tiktok/gate-tiktok.js"),
    "utf8"
  );
  [
    "conceptGraph", "conceptGraphStatus", "graphReset", "graphPath", "graphZoomIn", "graphZoomOut",
    "conceptSheetView", "conceptGraphView", "backToConcept",
    "graphNodePanel", "graphNodeMeaning", "graphNodeFormula", "readGraphConcept", "openGraphLesson",
    "conceptRelationshipList", "gate-concept-graph-core.js",
  ].forEach((marker) => assert.match(html, new RegExp(marker)));
  ["Meaning", "Example", "Therefore", "GATE connection", "expandGraph", "shortestPath"]
    .forEach((marker) => assert.match(runtime, new RegExp(marker)));
  assert.match(runtime, /<tspan/);
  assert.match(runtime, /conceptGraphTitle/);
  assert.match(runtime, /Connect the dots/);
  assert.match(runtime, /rankedConnections/);
  assert.match(runtime, /exploreGraph/);
  assert.match(runtime, /scrollTop/);
  ["graphEntryConceptId", "graphEntryScroll", "restoreGraphEntry", "showGraphNode"]
    .forEach((marker) => assert.match(runtime, new RegExp(marker)));
  ["Recognition clues", "Reasoning chain", "Common trap", "Relevant GATE questions"]
    .forEach((marker) => assert.match(runtime, new RegExp(marker)));
});

test("runtime includes persistence, focus handling, math rendering and GSAP fallback", () => {
  const runtime = fs.readFileSync(
    path.join(__dirname, "../assets/js/gate-tiktok/gate-tiktok.js"),
    "utf8"
  );
  ["localStorage", "trapFocus", "renderMathInElement", "window.gsap", "IntersectionObserver"]
    .forEach((marker) => assert.match(runtime, new RegExp(marker)));
});

test("shared reference navigation exposes the pilot only for Linear Algebra", () => {
  const app = fs.readFileSync(path.join(__dirname, "../assets/js/app.js"), "utf8");
  assert.match(app, /subject === "linear-algebra"/);
  assert.match(app, /gate-tiktok\.html/);
});

test("every card and concept source resolves to a local Linear Algebra lesson", () => {
  const lessonRoot = path.join(__dirname, "../linear-algebra");
  data.cards.forEach((card) => {
    assert.ok(fs.existsSync(path.join(lessonRoot, card.source)), card.source);
  });
  Object.values(concepts).forEach((concept) => {
    assert.ok(fs.existsSync(path.join(lessonRoot, concept.lessonUrl)), concept.lessonUrl);
  });
});

test("concepts expose direct lesson-section anchors and richer learning context", () => {
  Object.values(concepts).forEach((concept) => {
    assert.ok(concept.lessonAnchor, `${concept.id} missing lessonAnchor`);
    assert.ok(concept.lessonSection, `${concept.id} missing lessonSection`);
    assert.ok(concept.gateFocus, `${concept.id} missing gateFocus`);
  });
  assert.equal(concepts.covariance.lessonAnchor, "study-item-22");
});

test("lesson shell creates stable section anchors and restores hash navigation", () => {
  const app = fs.readFileSync(path.join(__dirname, "../assets/js/app.js"), "utf8");
  assert.match(app, /study-in-depth/);
  assert.match(app, /section-/);
  assert.match(app, /window\.location\.hash/);
});

test("feed styling keeps background fixed and gives mobile cards near-full width", () => {
  const css = fs.readFileSync(path.join(__dirname, "../assets/css/gate-tiktok.css"), "utf8");
  assert.match(css, /position:fixed/);
  assert.match(css, /\.gt-card\{[^}]*padding:[^;]*8px/s);
  assert.doesNotMatch(css, /\.gt-card::before/);
  assert.doesNotMatch(css, /\.gt-card::after/);
});

test("Gate TikTok keeps content scrollable without visible scrollbars or pagination", () => {
  const css = fs.readFileSync(path.join(__dirname, "../assets/css/gate-tiktok.css"), "utf8");
  const runtime = fs.readFileSync(
    path.join(__dirname, "../assets/js/gate-tiktok/gate-tiktok.js"),
    "utf8"
  );
  assert.match(css, /\.gt-card-inner[^}]*max-height:[^;}]+[^}]*overflow-y:auto/s);
  assert.match(css, /\.gt-concept-content[^}]*overflow-y:auto/s);
  assert.match(css, /\.gt-detail-content[^}]*overflow-y:auto/s);
  assert.doesNotMatch(css, /scrollbar-width:thin/);
  assert.match(css, /\.gt-card-inner[^}]*scrollbar-width:none/s);
  assert.match(css, /\.gt-concept-content[^}]*scrollbar-width:none/s);
  assert.match(css, /\.gt-detail-content[^}]*scrollbar-width:none/s);
  [
    ".gt-card-inner::-webkit-scrollbar",
    ".gt-concept-content::-webkit-scrollbar",
    ".gt-detail-content::-webkit-scrollbar",
  ].forEach((selector) => assert.ok(css.includes(selector)));
  [
    "gt-page-controls", "data-card-page", "data-concept-page",
    "cardPageState", "conceptPageState", "function pageControls",
  ].forEach((marker) => assert.doesNotMatch(runtime, new RegExp(marker)));
});

test("graph selection uses one responsive scroll surface", () => {
  const html = fs.readFileSync(path.join(__dirname, "../linear-algebra/gate-tiktok.html"), "utf8");
  const css = fs.readFileSync(path.join(__dirname, "../assets/css/gate-tiktok.css"), "utf8");
  const runtime = fs.readFileSync(
    path.join(__dirname, "../assets/js/gate-tiktok/gate-tiktok.js"),
    "utf8"
  );

  ["graphScrollSurface", "graphStage", "graphNodePanel"]
    .forEach((id) => assert.match(html, new RegExp(`id="${id}"`)));
  assert.ok(
    html.indexOf('id="graphNodePanel"') < html.indexOf('id="conceptRelationshipList"'),
    "selected concept details must precede the relationship list on mobile"
  );
  assert.match(css, /\.gt-graph-scroll-surface[^}]*overflow-y:auto/s);
  assert.match(css, /\.gt-graph-layout[^}]*grid-template-columns/s);
  assert.doesNotMatch(css, /\.gt-graph-node-panel[^}]*position:absolute/s);
  assert.match(runtime, /revealSelectedGraphNode/);
});
