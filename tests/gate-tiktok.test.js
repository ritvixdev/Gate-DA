const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const concepts = require("../assets/js/gate-tiktok/gate-concepts.js");
const data = require("../assets/js/gate-tiktok/gate-tiktok-data.js");
const sourceData = require("../assets/js/gate-tiktok/gate-tiktok-source-data.js");
const core = require("../assets/js/gate-tiktok/gate-tiktok-core.js");

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

test("Gate TikTok page exposes feed, topic menu, detail sheet and concept dialog", () => {
  const html = fs.readFileSync(
    path.join(__dirname, "../linear-algebra/gate-tiktok.html"),
    "utf8"
  );
  ["gateFeed", "topicMenu", "detailDialog", "conceptDialog", "gate-tiktok.js"]
    .forEach((marker) => assert.match(html, new RegExp(marker)));
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
