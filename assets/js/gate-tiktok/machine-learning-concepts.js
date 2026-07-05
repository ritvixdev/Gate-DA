(function (root, factory) {
  var data = factory();
  if (typeof module === "object" && module.exports) module.exports = data;
  root.GateTikTokConcepts = data;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  var lesson = function (slug) { return slug + ".html"; };
  var gateFocusByLesson = {
    "01-linear-regression.html": "Use this to understand loss surfaces, gradient descent updates, and basic model fitting.",
    "02-least-squares.html": "Use this to solve closed-form optimal parameters and understand the geometry of residuals.",
    "03-knn.html": "Use this to classify without explicit training and understand the effect of distance metrics.",
    "04-logistic-regression.html": "Use this to map linear boundaries to probabilities using the sigmoid function.",
    "05-kmeans.html": "Use this to cluster unlabeled data by iteratively minimizing intra-cluster variance.",
    "06-cross-validation.html": "Use this to estimate out-of-sample performance and balance bias-variance tradeoffs."
  };

  var C = {};
  function add(id, label, definition, formula, example, lessonUrl, prerequisites, related) {
    C[id] = {
      id: id, label: label, aliases: [label.toLowerCase()], definition: definition,
      formula: formula, example: example, prerequisites: prerequisites || [],
      relatedConcepts: related || [], lessonUrl: lessonUrl,
      lessonAnchor: "study-in-depth",
      lessonSection: "Study in Depth",
      gateFocus: gateFocusByLesson[lessonUrl] || "Core machine learning concept."
    };
  }

  // 01-linear-regression
  add("linear-model", "linear model", "A model that predicts outputs as a weighted sum of input features.", "\\hat{y} = w^T x + b", "Predicting house price from area and rooms.", lesson("01-linear-regression"), [], ["gradient-descent", "mean-squared-error"]);
  add("gradient-descent", "gradient descent", "An optimization algorithm that iteratively moves opposite to the gradient to find a local minimum.", "w \\leftarrow w - \\eta \\nabla L(w)", "Updating weights by taking steps downhill on the loss surface.", lesson("01-linear-regression"), ["linear-model"], ["learning-rate"]);
  add("learning-rate", "learning rate", "A hyperparameter controlling the step size during gradient descent updates.", "\\eta > 0", "A learning rate of 0.01 makes small, stable updates.", lesson("01-linear-regression"), ["gradient-descent"], []);
  add("mean-squared-error", "mean squared error", "The average of the squares of the errors between predicted and actual values.", "MSE = \\frac{1}{n} \\sum (y_i - \\hat{y}_i)^2", "MSE penalizes larger errors more heavily than small ones.", lesson("01-linear-regression"), ["linear-model"], ["r-squared"]);
  add("r-squared", "R-squared", "A statistical measure representing the proportion of the variance for a dependent variable that's explained by the model.", "R^2 = 1 - \\frac{\\text{SS}_{res}}{\\text{SS}_{tot}}", "An R² of 0.8 means 80% of variance is explained by the model.", lesson("01-linear-regression"), ["mean-squared-error"], []);

  // 02-least-squares
  add("least-squares", "least squares", "A method for estimating parameters by minimizing the sum of the squares of the residuals.", "\\min_w \\sum (y_i - x_i^T w)^2", "Finding the line of best fit for a scatter plot.", lesson("02-least-squares"), ["mean-squared-error"], ["normal-equation"]);
  add("normal-equation", "normal equation", "The closed-form analytical solution to the linear least squares problem.", "w = (X^T X)^{-1} X^T y", "Directly computing weights without iterative gradient descent.", lesson("02-least-squares"), ["least-squares"], ["residual"]);
  add("residual", "residual", "The difference between the observed value and the estimated value.", "e_i = y_i - \\hat{y}_i", "A point 3 units above the regression line has a residual of +3.", lesson("02-least-squares"), ["least-squares"], ["ridge-regression"]);
  add("ridge-regression", "ridge regression", "Linear regression with L2 regularization to prevent overfitting and handle multicollinearity.", "L(w) = \\text{MSE} + \\lambda \\lVert w \\rVert_2^2", "Shrinking weights towards zero to reduce model variance.", lesson("02-least-squares"), ["least-squares"], ["lasso"]);
  add("lasso", "LASSO", "Linear regression with L1 regularization, which can force some coefficients to be exactly zero.", "L(w) = \\text{MSE} + \\lambda \\lVert w \\rVert_1", "Using L1 penalty to perform automatic feature selection.", lesson("02-least-squares"), ["ridge-regression"], []);

  // 03-knn
  add("k-nearest-neighbors", "k-nearest neighbors", "A non-parametric classification or regression method relying on the majority vote or average of the k closest training examples.", "y = \\text{mode}(\\{y_i\\}_{i \\in N_k(x)})", "Classifying a new fruit based on the 3 most similar fruits in the database.", lesson("03-knn"), [], ["euclidean-distance", "curse-of-dimensionality"]);
  add("euclidean-distance", "Euclidean distance", "The straight-line distance between two points in Euclidean space.", "d(p,q) = \\sqrt{\\sum (p_i - q_i)^2}", "The standard physical distance in 2D or 3D space.", lesson("03-knn"), ["k-nearest-neighbors"], ["manhattan-distance"]);
  add("manhattan-distance", "Manhattan distance", "The distance between two points measured along axes at right angles (L1 norm).", "d(p,q) = \\sum |p_i - q_i|", "The distance a taxi drives on a grid-like city layout.", lesson("03-knn"), ["euclidean-distance"], []);
  add("curse-of-dimensionality", "curse of dimensionality", "Phenomena that arise when analyzing data in high-dimensional spaces, such as distance metrics losing distinctiveness.", "\\lim_{d \\to \\infty} \\frac{d_{max} - d_{min}}{d_{min}} \\to 0", "In 1000 dimensions, all pairs of points appear roughly equidistant.", lesson("03-knn"), ["k-nearest-neighbors"], []);

  // 04-logistic-regression
  add("logistic-regression", "logistic regression", "A classification algorithm that models the probability of a discrete outcome using the logistic function.", "P(Y=1|X) = \\sigma(w^T x + b)", "Predicting whether an email is spam (1) or not (0).", lesson("04-logistic-regression"), ["linear-model"], ["sigmoid-function", "maximum-likelihood"]);
  add("sigmoid-function", "sigmoid function", "An S-shaped mathematical function that maps any real value into the range (0, 1).", "\\sigma(z) = \\frac{1}{1 + e^{-z}}", "Squashing the unbounded linear output $w^T x$ into a valid probability.", lesson("04-logistic-regression"), ["logistic-regression"], ["cross-entropy-loss"]);
  add("cross-entropy-loss", "cross-entropy loss", "A loss function used for classification that measures the performance of a classification model whose output is a probability.", "L = -\\frac{1}{N} \\sum [y_i \\log(\\hat{y}_i) + (1-y_i) \\log(1-\\hat{y}_i)]", "Heavily penalizing confident but wrong predictions.", lesson("04-logistic-regression"), ["sigmoid-function"], []);
  add("maximum-likelihood", "maximum likelihood", "A method of estimating parameters by maximizing the probability of observing the given data.", "\\max_w \\prod P(y_i | x_i; w)", "Finding the weights that make the training data most probable.", lesson("04-logistic-regression"), ["logistic-regression"], []);
  add("linear-separability", "linear separability", "The property of two classes of points that can be completely separated by a single linear hyperplane.", "\\exists w, b : \\forall i, y_i(w^T x_i + b) > 0", "A straight line separating all red points from all blue points.", lesson("04-logistic-regression"), ["logistic-regression"], []);

  // 05-kmeans
  add("k-means", "k-means clustering", "An unsupervised learning algorithm that partitions data into k distinct clusters based on feature similarity.", "\\min_{S} \\sum_{i=1}^k \\sum_{x \\in S_i} \\lVert x - \\mu_i \\rVert^2", "Grouping customers into 3 segments based on purchasing behavior.", lesson("05-kmeans"), [], ["centroid", "inertia", "lloyds-algorithm"]);
  add("centroid", "centroid", "The geometric center or mean position of all the points in a cluster.", "\\mu_i = \\frac{1}{|S_i|} \\sum_{x \\in S_i} x", "The average coordinates of all data points assigned to cluster $i$.", lesson("05-kmeans"), ["k-means"], []);
  add("inertia", "inertia", "The sum of squared distances of samples to their closest cluster center.", "\\sum \\min_{\\mu_j} \\lVert x_i - \\mu_j \\rVert^2", "A measure of how internally coherent the clusters are.", lesson("05-kmeans"), ["k-means", "centroid"], []);
  add("lloyds-algorithm", "Lloyd's algorithm", "The standard iterative algorithm for k-means: alternating between assigning points to the nearest centroid and recalculating centroids.", "\\text{Repeat: } S_i = \\{x : d(x, \\mu_i) \\le d(x, \\mu_j)\\}, \\mu_i = \\text{mean}(S_i)", "The common iterative method to locally minimize k-means inertia.", lesson("05-kmeans"), ["k-means", "centroid"], []);

  // 06-cross-validation
  add("cross-validation", "cross-validation", "A resampling procedure used to evaluate machine learning models on a limited data sample.", "\\text{Score} = \\frac{1}{K} \\sum_{k=1}^K \\text{Metric}_k", "Splitting data into 5 folds, training on 4 and testing on 1, then averaging the results.", lesson("06-cross-validation"), [], ["overfitting", "bias-variance-tradeoff", "confusion-matrix"]);
  add("overfitting", "overfitting", "When a model learns the detail and noise in the training data to the extent that it negatively impacts the performance on new data.", "E_{train} \\approx 0, E_{test} \\gg 0", "A degree-10 polynomial perfectly fitting 11 noisy points but wildly oscillating elsewhere.", lesson("06-cross-validation"), ["cross-validation"], ["underfitting"]);
  add("underfitting", "underfitting", "When a model can neither model the training data nor generalize to new data.", "E_{train} \\gg 0, E_{test} \\gg 0", "Using a straight line to fit data that clearly follows a parabolic curve.", lesson("06-cross-validation"), ["overfitting"], ["bias-variance-tradeoff"]);
  add("bias-variance-tradeoff", "bias-variance tradeoff", "The property of models whereby lower bias in parameter estimation leads to higher variance across samples, and vice versa.", "E = \\text{Bias}^2 + \\text{Variance} + \\text{Noise}", "Choosing intermediate model complexity to minimize total expected error.", lesson("06-cross-validation"), ["overfitting", "underfitting"], []);
  add("confusion-matrix", "confusion matrix", "A table that is often used to describe the performance of a classification model.", "\\begin{bmatrix} TP & FN \\\\ FP & TN \\end{bmatrix}", "A $2 \\times 2$ grid showing true positives, false positives, true negatives, and false negatives.", lesson("06-cross-validation"), [], ["precision", "recall", "accuracy"]);
  add("precision", "precision", "The proportion of positive identifications that were actually correct.", "\\frac{TP}{TP + FP}", "Out of all emails marked as spam, 90% were truly spam.", lesson("06-cross-validation"), ["confusion-matrix"], ["f1-score"]);
  add("recall", "recall", "The proportion of actual positives that were identified correctly.", "\\frac{TP}{TP + FN}", "Out of all truly spam emails, the model caught 80%.", lesson("06-cross-validation"), ["confusion-matrix"], ["f1-score"]);
  add("f1-score", "F1 score", "The harmonic mean of precision and recall.", "2 \\times \\frac{\\text{Precision} \\times \\text{Recall}}{\\text{Precision} + \\text{Recall}}", "A balanced single metric for uneven class distributions.", lesson("06-cross-validation"), ["precision", "recall"], []);
  add("accuracy", "accuracy", "The proportion of total predictions that were correct.", "\\frac{TP + TN}{Total}", "A model correctly classifying 95 out of 100 samples has 95% accuracy.", lesson("06-cross-validation"), ["confusion-matrix"], []);

  function consequence(statement, explanation, formula, conceptIds) {
    return { statement: statement, explanation: explanation, formula: formula || "", conceptIds: conceptIds || [] };
  }
  function edge(sourceId, targetId, type, label, explanation, importance, formula, assumptions) {
    return {
      id: sourceId + "--" + targetId + "--" + type,
      targetId: targetId,
      type: type,
      label: label,
      explanation: explanation,
      formula: formula || "",
      assumptions: assumptions || "",
      importance: importance || "useful"
    };
  }

  Object.keys(C).forEach(function (id) {
    var concept = C[id];
    concept.beginnerMeaning = concept.definition;
    concept.exampleExplanation = "This example satisfies the defining formula, so it is a concrete instance of " + concept.label + ".";
    concept.counterexample = "An object that fails the defining condition is not a " + concept.label + ".";
    concept.counterexampleExplanation = "Check the defining condition directly; one failed condition is enough to reject it.";
    concept.properties = [consequence("Recognition rule", concept.definition, concept.formula, [id])];
    concept.consequences = [consequence("Use the defining equation", "Translate the words into the formula before calculating.", concept.formula, concept.relatedConcepts.slice(0, 2))];
    concept.gateSignals = [consequence("Look for the defining condition", concept.gateFocus, concept.formula, concept.relatedConcepts.slice(0, 2))];
    concept.gateTraps = [consequence("Do not use the name alone", "Verify every assumption and defining condition before applying a shortcut.", "", [])];
    var seen = {};
    concept.edges = [];
    (concept.prerequisites || []).forEach(function (targetId) {
      if (!C[targetId] || seen[targetId]) return;
      seen[targetId] = true;
      concept.edges.push(edge(id, targetId, "prerequisite", "Builds on", "Understanding " + C[targetId].label + " makes " + concept.label + " easier to reason about.", "core"));
    });
    (concept.relatedConcepts || []).forEach(function (targetId) {
      if (!C[targetId] || seen[targetId]) return;
      seen[targetId] = true;
      concept.edges.push(edge(id, targetId, "used-by", "Connects to", concept.label + " is used when reasoning about " + C[targetId].label + ".", "useful"));
    });
  });

  // Cross-domain linkages to ensure full graph connectivity
  C["logistic-regression"].edges.push(edge("logistic-regression", "cross-validation", "used-by", "Evaluated by", "Logistic Regression models are typically evaluated using cross-validation to assess generalization.", "useful"));
  C["k-means"].edges.push(edge("k-means", "k-nearest-neighbors", "contrasts", "Unsupervised vs Supervised", "K-means finds clusters without labels, while KNN uses labeled neighbors for classification.", "useful"));
  C["linear-model"].edges.push(edge("linear-model", "k-nearest-neighbors", "contrasts", "Parametric vs Non-parametric", "Linear models learn global weights, while KNN remembers local instances.", "useful"));

  return C;
});
