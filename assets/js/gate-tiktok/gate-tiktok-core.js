(function (root, factory) {
  var api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  root.GateTikTokCore = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  var CARD_TYPES = ["basic-definition", "deep-dive", "cheat-sheet", "trap", "worked-example", "practice", "gate-question"];
  var QUESTION_TYPES = ["MCQ", "MSQ", "NAT", "REVEAL"];

  function cardsForTopic(cards, topicId) {
    return cards
      .filter(function (card) { return card.topicId === topicId; })
      .slice()
      .sort(function (a, b) { return a.order - b.order; });
  }

  function nextIndex(index, delta, length, wrap) {
    if (!length) return 0;
    var next = index + delta;
    if (wrap) return (next + length) % length;
    return Math.max(0, Math.min(length - 1, next));
  }

  function gradeQuestion(question, response) {
    if (!question) return false;
    if (question.type === "REVEAL") return true;
    if (question.type === "NAT") {
      var value = parseFloat(response);
      return !Number.isNaN(value) && value >= question.answer[0] && value <= question.answer[1];
    }
    var expected = Array.isArray(question.answer) ? question.answer.slice().sort() : [question.answer];
    var received = Array.isArray(response) ? response.slice().sort() : [response];
    return expected.length === received.length && expected.every(function (item, i) {
      return item === received[i];
    });
  }

  function validateLearningGraph(data, concepts) {
    var errors = [];
    var topicIds = new Set();
    var cardIds = new Set();
    var conceptIds = new Set(Object.keys(concepts || {}));

    (data.topics || []).forEach(function (topic, index) {
      if (!topic.id || topicIds.has(topic.id)) errors.push("Invalid or duplicate topic id: " + topic.id);
      topicIds.add(topic.id);
      if (topic.order !== index + 1) errors.push("Topic order mismatch: " + topic.id);
    });

    Object.keys(concepts || {}).forEach(function (id) {
      var concept = concepts[id];
      if (concept.id !== id) errors.push("Concept key/id mismatch: " + id);
      ["label", "definition", "formula", "example", "lessonUrl"].forEach(function (field) {
        if (!concept[field]) errors.push("Concept " + id + " missing " + field);
      });
      (concept.prerequisites || []).concat(concept.relatedConcepts || []).forEach(function (target) {
        if (!conceptIds.has(target)) errors.push("Concept " + id + " links missing concept " + target);
      });
    });

    (data.cards || []).forEach(function (card) {
      if (!card.id || cardIds.has(card.id)) errors.push("Invalid or duplicate card id: " + card.id);
      cardIds.add(card.id);
      if (!topicIds.has(card.topicId)) errors.push("Card " + card.id + " has invalid topic");
      if (CARD_TYPES.indexOf(card.type) === -1) errors.push("Card " + card.id + " has invalid type");
      ["hook", "body", "difficulty", "source"].forEach(function (field) {
        if (!card[field]) errors.push("Card " + card.id + " missing " + field);
      });
      if (!card.detail && !card.detailHtml) errors.push("Card " + card.id + " missing detail");
      (card.concepts || []).forEach(function (id) {
        if (!conceptIds.has(id)) errors.push("Card " + card.id + " links missing concept " + id);
      });
      if ((card.type === "practice" || card.type === "gate-question") && !card.question) {
        errors.push("Question card " + card.id + " missing question");
      }
      if (card.question) {
        if (QUESTION_TYPES.indexOf(card.question.type) === -1) errors.push("Card " + card.id + " invalid question type");
        if (!card.question.prompt || !card.question.explanation) errors.push("Card " + card.id + " incomplete question");
        if (card.question.type !== "NAT" && card.question.type !== "REVEAL" &&
            (!card.question.options || card.question.options.length < 2)) {
          errors.push("Card " + card.id + " missing options");
        }
      }
    });
    return errors;
  }

  return {
    CARD_TYPES: CARD_TYPES,
    QUESTION_TYPES: QUESTION_TYPES,
    cardsForTopic: cardsForTopic,
    nextIndex: nextIndex,
    gradeQuestion: gradeQuestion,
    validateLearningGraph: validateLearningGraph
  };
});
