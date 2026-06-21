(function (root, factory) {
  var source = typeof module === "object" && module.exports
    ? require("./gate-tiktok-source-data.js")
    : root.GateTikTokSourceData;
  var concepts = typeof module === "object" && module.exports
    ? require("./gate-concepts.js")
    : root.GateTikTokConcepts;
  var data = factory(source, concepts);
  if (typeof module === "object" && module.exports) module.exports = data;
  root.GateTikTokData = data;
})(typeof globalThis !== "undefined" ? globalThis : this, function (source, concepts) {
  "use strict";

  var topics = [
    { id: "vectors", order: 1, slug: "01-vectors", name: "Vectors & Spaces", icon: "↗" },
    { id: "matrices", order: 2, slug: "02-matrices", name: "Matrices", icon: "▦" },
    { id: "determinants", order: 3, slug: "03-determinants", name: "Determinants", icon: "◇" },
    { id: "rank-nullity", order: 4, slug: "04-rank-nullity", name: "Rank & Nullity", icon: "≋" },
    { id: "linear-equations", order: 5, slug: "05-linear-equations", name: "Linear Equations", icon: "⚖" },
    { id: "eigenvalues", order: 6, slug: "06-eigenvalues", name: "Eigenvalues", icon: "λ" },
    { id: "diagonalization", order: 7, slug: "07-diagonalization", name: "Diagonalization", icon: "D" },
    { id: "orthogonality", order: 8, slug: "08-orthogonality", name: "Orthogonality", icon: "⊥" },
    { id: "svd-pca", order: 9, slug: "09-svd-pca", name: "SVD & PCA", icon: "Σ" }
  ];

  var definitionConcepts = {
    "la-vectors-001": "vector", "la-vectors-002": "real-coordinate-space", "la-vectors-003": "zero-vector",
    "la-vectors-004": "vector-space", "la-vectors-005": "subspace", "la-vectors-006": "span",
    "la-vectors-007": "linear-combination", "la-vectors-008": "linear-independence", "la-vectors-009": "basis",
    "la-vectors-010": "dimension",
    "la-matrices-001": "matrix", "la-matrices-002": "square-matrix", "la-matrices-003": "diagonal-matrix",
    "la-matrices-004": "identity-matrix", "la-matrices-005": "transpose", "la-matrices-006": "symmetric-matrix",
    "la-matrices-007": "inverse", "la-matrices-008": "trace",
    "la-determinants-001": "determinant", "la-determinants-002": "singular-matrix", "la-determinants-003": "minor",
    "la-determinants-004": "cofactor", "la-determinants-005": "cofactor-expansion", "la-determinants-006": "adjugate",
    "la-rank-nullity-001": "rank", "la-rank-nullity-002": "kernel", "la-rank-nullity-003": "column-space",
    "la-rank-nullity-004": "pivot", "la-rank-nullity-005": "row-echelon-form", "la-rank-nullity-006": "full-rank",
    "la-rank-nullity-007": "free-variable",
    "la-linear-equations-001": "linear-equations", "la-linear-equations-002": "augmented-matrix",
    "la-linear-equations-003": "gaussian-elimination", "la-linear-equations-004": "consistent-system",
    "la-linear-equations-005": "solution-count", "la-linear-equations-006": "homogeneous-system",
    "la-linear-equations-007": "free-variable",
    "la-eigenvalues-001": "eigenvector", "la-eigenvalues-002": "eigenvalue",
    "la-eigenvalues-003": "characteristic-equation", "la-eigenvalues-004": "characteristic-polynomial",
    "la-eigenvalues-005": "eigenspace", "la-eigenvalues-006": "multiplicity", "la-eigenvalues-007": "spectrum",
    "la-diagonalization-001": "diagonalizable", "la-diagonalization-002": "diagonalization",
    "la-diagonalization-003": "eigenbasis", "la-diagonalization-004": "similar-matrices",
    "la-diagonalization-005": "defective-matrix", "la-diagonalization-006": "multiplicity",
    "la-diagonalization-007": "orthogonal-diagonalization",
    "la-orthogonality-001": "dot-product", "la-orthogonality-002": "norm", "la-orthogonality-003": "angle",
    "la-orthogonality-004": "orthogonal-set", "la-orthogonality-005": "projection",
    "la-orthogonality-006": "orthogonal-matrix", "la-orthogonality-007": "gram-schmidt",
    "la-svd-pca-001": "svd", "la-svd-pca-002": "svd-factors", "la-svd-pca-003": "singular-value",
    "la-svd-pca-004": "rank-k-approximation", "la-svd-pca-005": "pca",
    "la-svd-pca-006": "principal-component", "la-svd-pca-007": "dimensionality-reduction"
  };

  var cards = source ? source.cards.map(function (card) {
    if (card.type !== "basic-definition") return card;
    var primaryConceptId = definitionConcepts[card.id];
    var concept = concepts && concepts[primaryConceptId];
    if (!concept) return card;
    return Object.assign({}, card, {
      primaryConceptId: primaryConceptId,
      concepts: Array.from(new Set([primaryConceptId].concat(card.concepts || []))),
      beginnerMeaning: concept.beginnerMeaning,
      formula: concept.formula,
      example: concept.example,
      consequence: concept.consequences[0].statement + ": " + concept.consequences[0].explanation,
      gateSignal: concept.gateSignals[0].statement + ": " + concept.gateSignals[0].explanation
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
        "Question type: " + card.question.type + ". Identify what must be proved before calculating.",
        "Key concepts: " + conceptIds.slice(0, 4).map(function (id) { return concepts[id].label; }).join(", ") + "."
      ],
      reasoningSteps: reasoningSteps.length ? reasoningSteps : ["Translate the question into the defining formulas.", "Eliminate choices that violate the concept properties."],
      formulasUsed: formulasUsed.length ? formulasUsed : ["Use the defining equation for the tested concept."],
      trap: "Do not stop after matching one keyword; verify every option against the full reasoning chain.",
      relatedQuestionIds: []
    };
    conceptIds.forEach(function (id) {
      if (concepts[id].questionIds.indexOf(card.id) === -1) concepts[id].questionIds.push(card.id);
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
    subject: "linear-algebra",
    topics: topics,
    cards: cards,
    sourceCounts: source ? source.sourceCounts : {}
  };
});
