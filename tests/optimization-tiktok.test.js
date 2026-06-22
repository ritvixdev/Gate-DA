const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const concepts = require("../assets/js/gate-tiktok/optimization-concepts.js");
const data = require("../assets/js/gate-tiktok/optimization-data.js");
const sourceData = require("../assets/js/gate-tiktok/optimization-tiktok-source-data.js");
const core = require("../assets/js/gate-tiktok/gate-tiktok-core.js");
const graphCore = require("../assets/js/gate-tiktok/gate-concept-graph-core.js");

test("concept graph expands recursively without duplicate nodes or edges", () => {
  const first = graphCore.directGraph(concepts, "univariate");
  assert.equal(first.rootId, "univariate");
  assert.equal(new Set(first.nodeIds).size, first.nodeIds.length);
  assert.equal(new Set(first.edgeIds).size, first.edgeIds.length);

  const expanded = graphCore.expandGraph(concepts, first, "optimization");
  assert.ok(expanded.nodeIds.length >= first.nodeIds.length);
  assert.equal(new Set(expanded.nodeIds).size, expanded.nodeIds.length);
  assert.equal(new Set(expanded.edgeIds).size, expanded.edgeIds.length);
  assert.ok(expanded.expandedIds.includes("optimization"));
});

test("concept graph finds cross-topic reasoning paths", () => {
  const path = graphCore.shortestPath(concepts, "objective-function", "learning-rate");
  assert.ok(path.length >= 2, "Path must exist from objective-function to learning-rate");
});

test("ranked concept connections are relevant, unique and capped at five", () => {
  const ranked = graphCore.rankedConnections(concepts, "gradient-descent", 5);
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
    ["critical-point", "local-minimum"],
    ["multivariate", "gradient"],
    ["gradient", "gradient-descent"],
  ].forEach(([start, end]) => {
    const route = graphCore.shortestPath(concepts, start, end);
    assert.equal(route[0], start, `${start} route missing`);
    assert.equal(route[route.length - 1], end, `${start} cannot reach ${end}`);
  });
});

test("Optimization feed contains expected topic count", () => {
  assert.equal(data.topics.length, 4);
  assert.equal(data.cards.length, 161);
  assert.deepEqual(sourceData.sourceCounts, {
    definitions: 28,
    study: 73,
    cheatSheets: 21,
    traps: 12,
    practice: 14,
    inlineQuizzes: 4,
    gateQuestions: 9,
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
    "optimization": ["objective-function"],
    "univariate": ["critical-point"],
    "multivariate": ["gradient"],
  };
  Object.entries(required).forEach(([id, related]) => {
    assert.ok(concepts[id], `missing ${id}`);
    related.forEach((target) => {
      const hasEdge = concepts[id].edges.some((edge) => edge.targetId === target);
      assert.ok(
        hasEdge || concepts[id].relatedConcepts.includes(target),
        `${id} does not relate to ${target}`
      );
    });
  });
});

test("all canonical Optimization concepts belong to one connected graph", () => {
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
    path.join(__dirname, "../optimization/gate-tiktok.html"),
    "utf8"
  );
  ["gateFeed", "topicMenu", "detailDialog", "conceptDialog", "gate-tiktok.js"]
    .forEach((marker) => assert.match(html, new RegExp(marker)));
});

test("every card and concept source resolves to a local Optimization lesson", () => {
  const lessonRoot = path.join(__dirname, "../optimization");
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
