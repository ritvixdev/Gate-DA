(function (root, factory) {
  var source = typeof module === "object" && module.exports
    ? require("./machine-learning-tiktok-source-data.js")
    : root.GateTikTokSourceData;
  var concepts = typeof module === "object" && module.exports
    ? require("./machine-learning-concepts.js")
    : root.GateTikTokConcepts;
  var data = factory(source, concepts);
  if (typeof module === "object" && module.exports) module.exports = data;
  root.GateTikTokData = data;
})(typeof globalThis !== "undefined" ? globalThis : this, function (source, concepts) {
  "use strict";

  var topics = [
    { id: "linear-regression", order: 1, slug: "01-linear-regression", name: "Linear Regression", icon: "📈" },
    { id: "least-squares", order: 2, slug: "02-least-squares", name: "Least Squares", icon: "∑" },
    { id: "knn", order: 3, slug: "03-knn", name: "k-Nearest Neighbors", icon: "📍" },
    { id: "logistic-regression", order: 4, slug: "04-logistic-regression", name: "Logistic Regression", icon: "S" },
    { id: "kmeans", order: 5, slug: "05-kmeans", name: "k-Means Clustering", icon: "⭕" },
    { id: "cross-validation", order: 6, slug: "06-cross-validation", name: "Cross Validation", icon: "K" }
  ];

  var cards = source ? source.cards.map(function (card) {
    if (card.type !== "basic-definition") return card;
    var primaryConceptId = card.primaryConceptId || (card.concepts && card.concepts[0]);
    var concept = concepts && primaryConceptId ? concepts[primaryConceptId] : null;
    if (!concept) return card;

    return Object.assign({}, card, {
      primaryConceptId: primaryConceptId,
      concepts: Array.from(new Set([primaryConceptId].concat(card.concepts || []))),
      beginnerMeaning: concept.definition,
      formula: concept.formula,
      example: concept.example,
      consequence: "Gate Focus: " + (concept.gateFocus || "Crucial topic for GATE."),
      gateSignal: "Always verify assumptions: check if dimensions match or if regularization applies."
    });
  }) : [];

  var gateCards = cards.filter(function (card) { return card.type === "gate-question"; });
  gateCards.forEach(function (card) {
    var explanation = card.question && card.question.explanation ? card.question.explanation : card.detail;
    var reasoningSteps = String(explanation || "").split(/(?:\.\s+|;\s+|,\s+(?=(?:so|hence|therefore)\b))/i)
      .map(function (step) { return step.trim(); }).filter(Boolean);
    var conceptIds = (card.concepts || []).filter(function (id) { return Boolean(concepts[id]); });
    var formulasUsed = conceptIds.map(function (id) { return concepts[id].formula; }).filter(Boolean).slice(0, 4);
    card.gateAnalysis = {
      conceptIds: conceptIds,
      recognitionClues: [
        "Question type: " + (card.question ? card.question.type : "MCQ") + ". Identify what must be proved before calculating.",
        "Key concepts: " + conceptIds.slice(0, 4).map(function (id) { return concepts[id].label; }).join(", ") + "."
      ],
      reasoningSteps: reasoningSteps.length ? reasoningSteps : ["Translate the question into the defining formulas.", "Eliminate choices that violate the concept properties."],
      formulasUsed: formulasUsed.length ? formulasUsed : ["Use the defining equation for the tested concept."],
      trap: "Do not stop after matching one keyword; verify every option against the full reasoning chain.",
      relatedQuestionIds: []
    };
    conceptIds.forEach(function (id) {
      if (concepts[id].questionIds && concepts[id].questionIds.indexOf(card.id) === -1) {
        concepts[id].questionIds.push(card.id);
      }
    });
  });
  gateCards.forEach(function (card) {
    card.gateAnalysis.relatedQuestionIds = gateCards.filter(function (candidate) {
      return candidate.id !== card.id && candidate.gateAnalysis.conceptIds.some(function (id) {
        return card.gateAnalysis.conceptIds.indexOf(id) !== -1;
      });
    }).slice(0, 3).map(function (candidate) { return candidate.id; });
  });

  return {
    subject: "machine-learning",
    topics: topics,
    cards: cards,
    sourceCounts: source ? source.sourceCounts : {}
  };
});
