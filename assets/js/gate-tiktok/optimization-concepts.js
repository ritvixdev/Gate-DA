(function (root, factory) {
  var data = factory();
  if (typeof module === "object" && module.exports) module.exports = data;
  root.GateTikTokConcepts = data;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  var lesson = function (slug) { return slug + ".html"; };
  var gateFocusByLesson = {
    "01-types-of-optimization.html": "Use this to classify optimization problems and understand when a local minimum is guaranteed to be a global minimum.",
    "02-univariate.html": "Use this to find critical points and classify extrema for single-variable functions.",
    "03-multivariate.html": "Use this to compute gradients, Hessians, and classify stationary points in higher dimensions.",
    "04-gradient-descent.html": "Use this to iteratively find local minima and tune step sizes for machine learning models."
  };

  var C = {};
  function add(id, label, definition, formula, example, lessonUrl, prerequisites, related) {
    C[id] = {
      id: id,
      label: label,
      definition: definition,
      formula: formula,
      example: example,
      lessonUrl: lessonUrl,
      lessonAnchor: id,
      lessonSection: "Concepts",
      gateFocus: gateFocusByLesson[lessonUrl] || "",
      prerequisites: prerequisites || [],
      relatedConcepts: related || [],
      edges: []
    };
  }

  function edge(source, target, type, label, explanation, importance) {
    return { sourceId: source, targetId: target, type: type, label: label, explanation: explanation, importance: importance || "useful" };
  }

  // 01-types-of-optimization
  add("optimization", "Optimization", "The process of finding the best solution (minimum or maximum) from a set of possible choices.", "\\min_{x \\in S} f(x)", "Finding the parameters of a model that minimize the error.", lesson("01-types-of-optimization"), [], ["objective-function"]);
  add("objective-function", "Objective Function", "The mathematical function $f(x)$ being minimized or maximized.", "f: \\mathbb{R}^n \\to \\mathbb{R}", "The mean squared error $f(w) = \\frac{1}{N} \\sum (y_i - w x_i)^2$.", lesson("01-types-of-optimization"), ["optimization"], ["global-minimum", "local-minimum"]);
  add("global-minimum", "Global Minimum", "A point where the objective function is less than or equal to its value at all other points in the domain.", "f(x^*) \\le f(x) \\quad \\forall x \\in S", "The bottom of a perfect bowl-shaped parabola.", lesson("01-types-of-optimization"), ["objective-function"], ["local-minimum", "convexity"]);
  add("local-minimum", "Local Minimum", "A point where the objective function is less than or equal to its value at all nearby points.", "f(x^*) \\le f(x) \\quad \\forall x \\in N(x^*)", "A dip in a wavy landscape that isn't necessarily the absolute lowest point.", lesson("01-types-of-optimization"), ["objective-function"], ["critical-point"]);
  add("convexity", "Convexity", "A property of a function where the line segment between any two points on the graph lies entirely above or on the graph.", "f(tx + (1-t)y) \\le tf(x) + (1-t)f(y)", "The function $f(x) = x^2$. For convex functions, any local minimum is a global minimum.", lesson("01-types-of-optimization"), ["global-minimum"], ["strictly-convex"]);
  add("strictly-convex", "Strictly Convex", "A function where the line segment between any two points lies strictly above the graph.", "f(tx + (1-t)y) < tf(x) + (1-t)f(y)", "The function $f(x) = e^x$. A strictly convex function has at most one global minimum.", lesson("01-types-of-optimization"), ["convexity"], []);

  // 02-univariate
  add("univariate", "Univariate Optimization", "Optimization of functions with exactly one variable.", "\\min f(x) \\text{ for } x \\in \\mathbb{R}", "Finding the minimum of $f(x) = x^2 - 4x$.", lesson("02-univariate"), ["optimization"], ["critical-point", "limits", "continuity", "differentiability"]);
  add("limits", "Limits", "The value that a function approaches as the input approaches some value.", "\\lim_{x \\to a} f(x) = L", "As $x$ grows large, $1/x$ approaches 0.", lesson("02-univariate"), [], ["continuity"]);
  add("continuity", "Continuity", "A function is continuous if it has no abrupt changes in value.", "\\lim_{x \\to a} f(x) = f(a)", "A polynomial curve without any breaks or jumps.", lesson("02-univariate"), ["limits"], ["differentiability"]);
  add("differentiability", "Differentiability", "A function is differentiable if it has a derivative at each point in its domain, implying it is smooth.", "f'(x) \\text{ exists}", "The function $f(x) = |x|$ is continuous but not differentiable at $x=0$.", lesson("02-univariate"), ["continuity"], ["critical-point"]);
  add("critical-point", "Critical Point", "A point where the derivative is zero or undefined.", "f'(c) = 0 \\text{ or undefined}", "For $f(x) = x^2$, the point $x=0$ where $f'(0) = 0$.", lesson("02-univariate"), ["differentiability", "univariate"], ["local-minimum", "local-maximum"]);
  add("local-maximum", "Local Maximum", "A point where the objective function is greater than or equal to its value at all nearby points.", "f(x^*) \\ge f(x) \\quad \\forall x \\in N(x^*)", "The peak of a hill.", lesson("02-univariate"), ["critical-point"], ["saddle-point"]);

  // 03-multivariate
  add("multivariate", "Multivariate Optimization", "Optimization of functions with multiple variables.", "\\min f(\\mathbf{x}) \\text{ for } \\mathbf{x} \\in \\mathbb{R}^n", "Minimizing $f(x,y) = x^2 + y^2$.", lesson("03-multivariate"), ["univariate"], ["gradient", "directional-derivative"]);
  add("gradient", "Gradient", "The vector of first-order partial derivatives of a multivariate function.", "\\nabla f = \\left[ \\frac{\\partial f}{\\partial x_1}, \\dots, \\frac{\\partial f}{\\partial x_n} \\right]^T", "For $f(x,y) = x^2 + 2y$, $\\nabla f = [2x, 2]^T$.", lesson("03-multivariate"), ["multivariate"], ["hessian", "gradient-descent", "critical-point"]);
  add("directional-derivative", "Directional Derivative", "The rate at which a function changes at a point in a specific direction.", "D_{\\mathbf{u}}f = \\nabla f \\cdot \\mathbf{u}", "The slope of a hill when walking exactly North-East.", lesson("03-multivariate"), ["gradient"], []);
  add("hessian", "Hessian Matrix", "The square matrix of second-order partial derivatives of a scalar-valued function.", "H_{ij} = \\frac{\\partial^2 f}{\\partial x_i \\partial x_j}", "Used in the second-derivative test to classify a critical point as a minimum, maximum, or saddle point.", lesson("03-multivariate"), ["gradient"], ["saddle-point", "convexity"]);
  add("saddle-point", "Saddle Point", "A critical point that is a local minimum in one direction and a local maximum in another.", "\\nabla f = 0, \\text{ Hessian is indefinite}", "The point $(0,0)$ for $f(x,y) = x^2 - y^2$, resembling a horse saddle.", lesson("03-multivariate"), ["hessian", "critical-point"], []);

  // 04-gradient-descent
  add("gradient-descent", "Gradient Descent", "An iterative optimization algorithm that moves in the direction of steepest descent (negative gradient).", "\\mathbf{x}_{k+1} = \\mathbf{x}_k - \\eta \\nabla f(\\mathbf{x}_k)", "Rolling a ball down a hill to find the valley floor.", lesson("04-gradient-descent"), ["gradient", "optimization"], ["learning-rate", "convergence"]);
  add("learning-rate", "Learning Rate", "A hyperparameter $\\eta$ controlling the step size at each iteration of gradient descent.", "\\eta > 0", "If $\\eta$ is too large, the algorithm might bounce back and forth without converging.", lesson("04-gradient-descent"), ["gradient-descent"], ["step-size"]);
  add("step-size", "Step Size", "The actual distance moved in the parameter space during one iteration.", "\\| \\mathbf{x}_{k+1} - \\mathbf{x}_k \\| = \\eta \\| \\nabla f \\|", "Even with a constant learning rate, the step size decreases as the gradient approaches zero.", lesson("04-gradient-descent"), ["learning-rate"], []);
  add("stochastic-gradient-descent", "Stochastic Gradient Descent (SGD)", "A variant of gradient descent that updates parameters using a single training example or a small batch at a time.", "\\mathbf{x}_{k+1} = \\mathbf{x}_k - \\eta \\nabla f_i(\\mathbf{x}_k)", "Using just one data point to estimate the gradient, which adds noise but speeds up iterations.", lesson("04-gradient-descent"), ["gradient-descent"], []);
  add("convergence", "Convergence", "The state where an iterative algorithm produces sequence of values that settle towards a final minimum.", "\\lim_{k \\to \\infty} \\mathbf{x}_k = \\mathbf{x}^*", "Gradient descent stopping when $\\| \\nabla f \\|$ is close to 0.", lesson("04-gradient-descent"), ["gradient-descent"], ["global-minimum"]);

  Object.keys(C).forEach(function (id) {
    var concept = C[id];
    concept.edges = [];
    (concept.prerequisites || []).forEach(function (targetId) {
      if (!C[targetId]) return;
      concept.edges.push(edge(id, targetId, "prerequisite", "Builds on", "Understanding " + C[targetId].label + " makes " + concept.label + " easier to reason about.", "core"));
    });
    (concept.relatedConcepts || []).forEach(function (targetId) {
      if (!C[targetId]) return;
      concept.edges.push(edge(id, targetId, "used-by", "Connects to", concept.label + " is used when reasoning about " + C[targetId].label + ".", "useful"));
    });
  });

  // Explicitly authored educational relationships (GATE context)
  C["local-minimum"].edges.push(edge("local-minimum", "global-minimum", "implies", "Under Convexity", "If a function is convex, any local minimum is guaranteed to be a global minimum.", "core"));
  C["global-minimum"].edges.push(edge("global-minimum", "convexity", "prerequisite", "Guaranteed by", "Convexity ensures that a global minimum is the only minimum.", "core"));
  C["critical-point"].edges.push(edge("critical-point", "local-minimum", "implies", "Candidate", "Critical points are candidates for local minima (verified via second derivative).", "core"));
  C["gradient"].edges.push(edge("gradient", "critical-point", "equivalent", "Zero vector", "In multivariate calculus, a point is a critical point if the gradient is the zero vector.", "core"));
  C["hessian"].edges.push(edge("hessian", "saddle-point", "implies", "Indefinite", "An indefinite Hessian at a critical point means it's a saddle point, not an extremum.", "core"));
  C["convexity"].edges.push(edge("convexity", "hessian", "equivalent", "Positive Semi-definite", "A twice-differentiable multivariate function is convex if and only if its Hessian is positive semi-definite everywhere.", "core"));
  C["gradient-descent"].edges.push(edge("gradient-descent", "learning-rate", "used-by", "Tuning", "Gradient descent relies heavily on an appropriate learning rate to ensure convergence.", "core"));
  C["learning-rate"].edges.push(edge("learning-rate", "convergence", "implies", "Controls", "The learning rate dictates whether the algorithm will converge to a minimum or diverge.", "core"));

  return C;
});
