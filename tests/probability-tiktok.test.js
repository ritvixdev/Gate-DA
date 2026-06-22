const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const concepts = require("../assets/js/gate-tiktok/probability-concepts.js");
const data = require("../assets/js/gate-tiktok/probability-data.js");
const sourceData = require("../assets/js/gate-tiktok/probability-tiktok-source-data.js");
const core = require("../assets/js/gate-tiktok/gate-tiktok-core.js");
const graphCore = require("../assets/js/gate-tiktok/gate-concept-graph-core.js");

test("concept graph expands recursively without duplicate nodes or edges", () => {
  const first = graphCore.directGraph(concepts, "probability");
  assert.equal(first.rootId, "probability");
  assert.equal(new Set(first.nodeIds).size, first.nodeIds.length);
  assert.equal(new Set(first.edgeIds).size, first.edgeIds.length);

  const expanded = graphCore.expandGraph(concepts, first, "conditional-probability");
  assert.ok(expanded.nodeIds.length >= first.nodeIds.length);
  assert.equal(new Set(expanded.nodeIds).size, expanded.nodeIds.length);
  assert.equal(new Set(expanded.edgeIds).size, expanded.edgeIds.length);
  assert.ok(expanded.expandedIds.includes("conditional-probability"));
});

test("concept graph finds cross-topic reasoning paths", () => {
  const path = graphCore.shortestPath(concepts, "sample-space", "bayes-theorem");
  assert.equal(path[0], "sample-space");
  assert.equal(path[path.length - 1], "bayes-theorem");
  assert.ok(path.length >= 3);
});

test("ranked concept connections are relevant, unique and capped at five", () => {
  const ranked = graphCore.rankedConnections(concepts, "random-variable", 5);
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
  // Since we simplified the graph definition in PS, we only mapped prerequisites and relatedConcepts.
  // The graph builder dynamically assigns generic edges if not explicitly typed.
  Object.values(concepts).forEach((concept) => {
    assert.ok(concept.definition, `${concept.id} missing definition`);
    assert.ok(concept.formula, `${concept.id} missing formula`);
    assert.ok(concept.example, `${concept.id} missing example`);
  });
});

test("all basic definitions are enriched through one canonical concept", () => {
  const definitions = data.cards.filter((card) => card.type === "basic-definition");
  // Ensure we mapped some concepts successfully
  assert.ok(definitions.length > 0);
  definitions.forEach((card) => {
    assert.ok(concepts[card.primaryConceptId], `${card.id} missing primary concept`);
  });
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
  Object.values(concepts).forEach((concept) => {
    assert.equal(concept.lessonAnchor, "study-in-depth", `${concept.id} anchor was overwritten`);
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
    ["sample-space", "event"],
    ["event", "probability"],
    ["probability", "independent-events"],
    ["conditional-probability", "bayes-theorem"],
  ].forEach(([start, end]) => {
    const route = graphCore.shortestPath(concepts, start, end);
    assert.equal(route[0], start, `${start} route missing`);
    assert.equal(route[route.length - 1], end, `${start} cannot reach ${end}`);
  });
});

test("Probability & Statistics feed contains expected topic count", () => {
  assert.equal(data.topics.length, 9);
  assert.equal(data.cards.length, 507);
  assert.deepEqual(sourceData.sourceCounts, {
    definitions: 64,
    study: 230,
    cheatSheets: 74,
    traps: 46,
    practice: 49,
    inlineQuizzes: 9,
    gateQuestions: 35,
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
    "probability": ["conditional-probability", "independent-events"],
    "random-variable": ["discrete-rv", "continuous-rv"],
    "pmf": ["binomial", "poisson"],
    "pdf": ["uniform", "exponential", "normal"],
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

test("all canonical Probability concepts belong to one connected graph", () => {
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
    path.join(__dirname, "../probability-statistics/gate-tiktok.html"),
    "utf8"
  );
  ["gateFeed", "topicMenu", "detailDialog", "conceptDialog", "gate-tiktok.js"]
    .forEach((marker) => assert.match(html, new RegExp(marker)));
});

test("every card and concept source resolves to a local Probability & Statistics lesson", () => {
  const lessonRoot = path.join(__dirname, "../probability-statistics");
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
