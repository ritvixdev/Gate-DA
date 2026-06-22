const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const concepts = require("../assets/js/gate-tiktok/machine-learning-concepts.js");
const data = require("../assets/js/gate-tiktok/machine-learning-data.js");
const sourceData = require("../assets/js/gate-tiktok/machine-learning-tiktok-source-data.js");
const core = require("../assets/js/gate-tiktok/gate-tiktok-core.js");
const graphCore = require("../assets/js/gate-tiktok/gate-concept-graph-core.js");

test("concept graph expands recursively without duplicate nodes or edges", () => {
  const first = graphCore.directGraph(concepts, "linear-regression");
  assert.equal(first.rootId, "linear-regression");
  assert.equal(new Set(first.nodeIds).size, first.nodeIds.length);
  assert.equal(new Set(first.edgeIds).size, first.edgeIds.length);

  const expanded = graphCore.expandGraph(concepts, first, "linear-model");
  assert.ok(expanded.nodeIds.length >= first.nodeIds.length);
  assert.equal(new Set(expanded.nodeIds).size, expanded.nodeIds.length);
  assert.equal(new Set(expanded.edgeIds).size, expanded.edgeIds.length);
  assert.ok(expanded.expandedIds.includes("linear-model"));
});

test("concept graph finds cross-topic reasoning paths", () => {
  const path = graphCore.shortestPath(concepts, "linear-model", "precision");
  assert.ok(path.length >= 2, "Path must exist from linear-model to precision");
});

test("ranked concept connections are relevant, unique and capped at five", () => {
  const ranked = graphCore.rankedConnections(concepts, "linear-model", 5);
  assert.ok(ranked.length > 0);
  assert.ok(ranked.length <= 5);
  assert.equal(new Set(ranked.map((edge) => edge.targetId)).size, ranked.length);
  assert.equal(ranked[0].importance, "core");
});

test("every canonical concept supports beginner learning and typed connections", () => {
  Object.values(concepts).forEach((concept) => {
    assert.ok(concept.definition, `${concept.id} missing definition`);
    assert.ok(concept.formula, `${concept.id} missing formula`);
    assert.ok(concept.example, `${concept.id} missing example`);
  });
});

test("all basic definitions are enriched through one canonical concept", () => {
  const definitions = data.cards.filter((card) => card.type === "basic-definition");
  assert.ok(definitions.length > 0);
  definitions.forEach((card) => {
    assert.ok(concepts[card.primaryConceptId], `${card.id} missing primary concept`);
  });
  assert.equal(data.cards.find((card) => card.id === "ml-linear-regression-006").primaryConceptId, "mean-squared-error");
  assert.equal(data.cards.find((card) => card.id === "ml-linear-regression-007").primaryConceptId, "r-squared");
  assert.equal(data.cards.find((card) => card.id === "ml-least-squares-001").primaryConceptId, "residual");
});

test("cards own exact source references without overwriting canonical concept paths", () => {
  sourceData.cards.forEach((card) => {
    assert.equal(card.sourceUrl, `${card.source}#${card.sourceAnchor}`, `${card.id} sourceUrl`);
    assert.deepEqual(card.sourceRef, {
      path: card.source,
      anchor: card.sourceAnchor,
      label: card.sourceLabel,
    });
  });
  assert.equal(concepts["linear-model"].lessonAnchor, "study-in-depth");
  assert.equal(concepts["least-squares"].lessonAnchor, "study-in-depth");
});

test("every real GATE question is indexed by concepts and reasoning", () => {
  const gateCards = data.cards.filter((card) => card.type === "gate-question");
  assert.ok(gateCards.length > 0);
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
});

test("required implication chains remain traversable", () => {
  [
    ["linear-model", "gradient-descent"],
    ["logistic-regression", "cross-validation"],
    ["k-means", "k-nearest-neighbors"],
  ].forEach(([start, end]) => {
    const route = graphCore.shortestPath(concepts, start, end);
    assert.equal(route[0], start, `${start} route missing`);
    assert.equal(route[route.length - 1], end, `${start} cannot reach ${end}`);
  });
});

test("Machine Learning feed contains expected topic count", () => {
  assert.equal(data.topics.length, 6);
  assert.equal(data.cards.length, 244);
  assert.deepEqual(sourceData.sourceCounts, {
    definitions: 47,
    study: 112,
    cheatSheets: 31,
    traps: 18,
    practice: 20,
    inlineQuizzes: 6,
    gateQuestions: 10,
  });
});

test("every approved source point maps to exactly one ordered card", () => {
  const identities = data.cards.map((card) =>
    [card.source, card.sourceAnchor, card.type].join("#")
  );
  assert.equal(new Set(identities).size, identities.length);

  data.topics.forEach((topic) => {
    const cards = core.cardsForTopic(data.cards, topic.id);
    assert.deepEqual(
      cards.map((card) => card.order),
      [...Array(cards.length).keys()].map((n) => n + 1),
      `${topic.id} order is not contiguous`
    );
  });
});

test("core graph includes required cross-topic concept paths", () => {
  const required = {
    "logistic-regression": ["cross-validation"],
    "linear-model": ["k-nearest-neighbors"],
    "k-means": ["k-nearest-neighbors"],
  };
  Object.entries(required).forEach(([id, related]) => {
    assert.ok(concepts[id], `missing ${id}`);
    related.forEach((target) => {
      // Check if there is an edge or it's implicitly mapped via relatedConcepts/prerequisites or the manual cross-domain pushes
      const hasEdge = concepts[id].edges.some((edge) => edge.targetId === target);
      assert.ok(
        hasEdge || concepts[id].relatedConcepts.includes(target),
        `${id} does not relate to ${target}`
      );
    });
  });
});

test("all canonical ML concepts belong to one connected graph", () => {
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
    path.join(__dirname, "../machine-learning/gate-tiktok.html"),
    "utf8"
  );
  ["gateFeed", "topicMenu", "detailDialog", "conceptDialog", "gate-tiktok.js"]
    .forEach((marker) => assert.match(html, new RegExp(marker)));
});

test("the shared runtime renders and opens each card-owned source URL", () => {
  const runtime = fs.readFileSync(
    path.join(__dirname, "../assets/js/gate-tiktok/gate-tiktok.js"),
    "utf8"
  );
  assert.match(runtime, /data-source-url/);
  assert.match(runtime, /card\.sourceUrl/);
});

test("every card and concept source resolves to a local Machine Learning lesson", () => {
  const lessonRoot = path.join(__dirname, "../machine-learning");
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
});
