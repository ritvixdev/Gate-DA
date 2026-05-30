/* Shared subject + topic metadata. Used by the sidebar, subject overview grids,
   prev/next nav, and the Reference group. Multi-subject. */
window.SUBJECTS = {
  "linear-algebra": {
    dir: "linear-algebra",
    name: "Linear Algebra",
    brandHtml: 'Linear<span>Algebra</span>',
    topics: [
      { slug: "01-vectors",          name: "Vectors & Spaces",       icon: "🔵", weight: "High" },
      { slug: "02-matrices",         name: "Matrices",               icon: "🔢", weight: "Very High" },
      { slug: "03-determinants",     name: "Determinants",           icon: "⬛", weight: "High" },
      { slug: "04-rank-nullity",     name: "Rank & Nullity",         icon: "📐", weight: "High" },
      { slug: "05-linear-equations", name: "Linear Equations",       icon: "⚖️", weight: "Very High" },
      { slug: "06-eigenvalues",      name: "Eigenvalues & Vectors",  icon: "🌀", weight: "Very High" },
      { slug: "07-diagonalization",  name: "Diagonalization",        icon: "📊", weight: "Medium" },
      { slug: "08-orthogonality",    name: "Orthogonality",          icon: "📏", weight: "Medium" },
      { slug: "09-svd-pca",          name: "SVD & PCA",              icon: "💡", weight: "High" },
    ],
  },
  "probability-statistics": {
    dir: "probability-statistics",
    name: "Probability & Statistics",
    brandHtml: 'Prob<span>&amp;Stats</span>',
    topics: [
      { slug: "01-intro-probability",   name: "Intro to Probability",    icon: "🎲", weight: "Very High" },
      { slug: "02-conditional-bayes",   name: "Conditional & Bayes",     icon: "🔀", weight: "Very High" },
      { slug: "03-random-variables",    name: "Random Variables",        icon: "🎰", weight: "High" },
      { slug: "04-pmf-pdf",             name: "PMF, PDF & Distributions",icon: "📈", weight: "Very High" },
      { slug: "05-joint-covariance",    name: "Joint & Covariance",      icon: "🔗", weight: "High" },
      { slug: "06-descriptive-stats",   name: "Descriptive Statistics",  icon: "📊", weight: "High" },
      { slug: "07-clt",                 name: "Central Limit Theorem",   icon: "🔔", weight: "High" },
      { slug: "08-z-t-tests",           name: "z-test & t-test",         icon: "⚖️", weight: "Very High" },
      { slug: "09-chi-f-tests",         name: "Chi-square & F-test",     icon: "🧪", weight: "High" },
    ],
  },
};

/* Back-compat alias (older code / any direct references). */
window.LA_TOPICS = window.SUBJECTS["linear-algebra"].topics;
