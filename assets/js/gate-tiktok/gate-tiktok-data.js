(function (root, factory) {
  var source = typeof module === "object" && module.exports
    ? require("./gate-tiktok-source-data.js")
    : root.GateTikTokSourceData;
  var data = factory(source);
  if (typeof module === "object" && module.exports) module.exports = data;
  root.GateTikTokData = data;
})(typeof globalThis !== "undefined" ? globalThis : this, function (source) {
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

  return {
    subject: "linear-algebra",
    topics: topics,
    cards: source ? source.cards : [],
    sourceCounts: source ? source.sourceCounts : {}
  };
});
