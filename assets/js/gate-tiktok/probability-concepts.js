(function (root, factory) {
  var data = factory();
  if (typeof module === "object" && module.exports) module.exports = data;
  root.GateTikTokConcepts = data;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  var lesson = function (slug) { return slug + ".html"; };
  var gateFocusByLesson = {
    "01-intro-probability.html": "Use this to translate word problems into set operations and basic probability axioms.",
    "02-conditional-bayes.html": "Use this to update probabilities given new information and reverse condition direction.",
    "03-random-variables.html": "Use this to compute expected values, variance, and properties of linear transformations.",
    "04-pmf-pdf.html": "Use this to identify standard distributions from problem descriptions and apply their known properties.",
    "05-joint-covariance.html": "Use this to analyze relationships between multiple variables and compute covariance/correlation.",
    "06-descriptive-stats.html": "Use this to summarize data sets and understand the effect of outliers on different metrics.",
    "07-clt.html": "Use this to approximate the distribution of sample means for large samples regardless of the population.",
    "08-z-t-tests.html": "Use this to choose the correct test statistic based on sample size and known population variance.",
    "09-chi-f-tests.html": "Use this to test for independence, goodness of fit, and compare variances across groups."
  };
  
  var C = {};
  function add(id, label, definition, formula, example, lessonUrl, prerequisites, related) {
    C[id] = {
      id: id, label: label, aliases: [label.toLowerCase(), label.toLowerCase().replace("-", " ")], definition: definition,
      formula: formula, example: example, prerequisites: prerequisites || [],
      relatedConcepts: related || [], lessonUrl: lessonUrl,
      lessonAnchor: "study-in-depth",
      lessonSection: "Study in Depth",
      gateFocus: gateFocusByLesson[lessonUrl],
      questionIds: []
    };
  }

  // 01-intro-probability
  add("sample-space", "sample space", "The set of all possible outcomes of a random experiment.", "S = \\{O_1, O_2, \\dots\\}", "Rolling a die: S = {1,2,3,4,5,6}.", lesson("01-intro-probability"), [], ["event", "probability"]);
  add("event", "event", "A subset of the sample space.", "E \\subseteq S", "Rolling an even number: E = {2,4,6}.", lesson("01-intro-probability"), ["sample-space"], ["probability", "mutually-exclusive"]);
  add("probability", "probability", "A measure of the likelihood of an event occurring, between 0 and 1.", "P(E) = \\frac{|E|}{|S|}", "P(Rolling an even) = 3/6 = 0.5.", lesson("01-intro-probability"), ["event"], ["conditional-probability", "independent-events"]);
  add("mutually-exclusive", "mutually exclusive", "Events that cannot occur at the same time.", "P(A \\cap B) = 0", "Rolling a 2 and a 3 on a single die roll.", lesson("01-intro-probability"), ["event", "probability"], ["independent-events"]);
  add("independent-events", "independent events", "The occurrence of one event does not affect the probability of another.", "P(A \\cap B) = P(A)P(B)", "Rolling a 6 on two consecutive die rolls.", lesson("01-intro-probability"), ["probability"], ["conditional-probability"]);

  // 02-conditional-bayes
  add("conditional-probability", "conditional probability", "The probability of an event given that another event has occurred.", "P(A|B) = \\frac{P(A \\cap B)}{P(B)}", "P(Rolling a 6 given it is even) = 1/3.", lesson("02-conditional-bayes"), ["probability"], ["bayes-theorem", "multiplication-rule"]);
  add("multiplication-rule", "multiplication rule", "Used to find the probability of the intersection of two events.", "P(A \\cap B) = P(A|B)P(B)", "Drawing two red cards without replacement.", lesson("02-conditional-bayes"), ["conditional-probability"], ["law-of-total-probability"]);
  add("law-of-total-probability", "law of total probability", "Expresses the total probability of an outcome via conditional probabilities.", "P(A) = \\sum P(A|B_i)P(B_i)", "Finding overall defect rate from multiple machines.", lesson("02-conditional-bayes"), ["conditional-probability", "mutually-exclusive"], ["bayes-theorem"]);
  add("bayes-theorem", "Bayes' theorem", "Updates the probability for a hypothesis as more evidence or information becomes available.", "P(B|A) = \\frac{P(A|B)P(B)}{P(A)}", "Finding the probability of having a disease given a positive test.", lesson("02-conditional-bayes"), ["conditional-probability", "law-of-total-probability"], ["independence"]);

  // 03-random-variables
  add("random-variable", "random variable", "A function that maps outcomes of a random process to numerical values.", "X: S \\to \\mathbb{R}", "Number of heads in 3 coin tosses.", lesson("03-random-variables"), ["sample-space"], ["discrete-rv", "continuous-rv"]);
  add("discrete-rv", "discrete RV", "A random variable that takes on a countable number of distinct values.", "X \\in \\{x_1, x_2, \\dots\\}", "Number of defective items in a batch.", lesson("03-random-variables"), ["random-variable"], ["pmf", "expectation"]);
  add("continuous-rv", "continuous RV", "A random variable that takes an infinite number of possible values in an interval.", "X \\in [a, b]", "The height of students in a class.", lesson("03-random-variables"), ["random-variable"], ["pdf", "cdf"]);
  add("cdf", "CDF", "Cumulative Distribution Function: the probability that a random variable X is less than or equal to x.", "F_X(x) = P(X \\le x)", "P(Height ≤ 170cm).", lesson("03-random-variables"), ["random-variable"], ["pmf", "pdf"]);
  add("expectation", "expectation", "The long-run average value of repetitions of the experiment it represents.", "E[X] = \\sum x P(x)", "Expected value of a die roll is 3.5.", lesson("03-random-variables"), ["random-variable"], ["variance", "covariance"]);
  add("variance", "variance", "A measure of how spread out the values of a random variable are from its mean.", "\\operatorname{Var}(X) = E[X^2] - (E[X])^2", "Variance of a uniform die roll is 35/12.", lesson("03-random-variables"), ["expectation"], ["standard-deviation", "covariance"]);

  // 04-pmf-pdf
  add("pmf", "PMF", "Probability Mass Function: gives the probability that a discrete random variable is exactly equal to some value.", "p_X(x) = P(X=x)", "PMF of a fair coin: P(H)=0.5, P(T)=0.5.", lesson("04-pmf-pdf"), ["discrete-rv"], ["binomial", "poisson"]);
  add("pdf", "PDF", "Probability Density Function: used to specify the probability of the random variable falling within a particular range of values.", "f_X(x) \\ge 0, \\int f_X(x)dx = 1", "PDF of standard normal distribution.", lesson("04-pmf-pdf"), ["continuous-rv"], ["uniform", "exponential", "normal"]);
  add("binomial", "binomial", "Distribution of the number of successes in n independent Bernoulli trials.", "P(X=k) = \\binom{n}{k}p^k(1-p)^{n-k}", "Number of heads in 10 coin tosses.", lesson("04-pmf-pdf"), ["pmf", "independent-events"], ["poisson", "normal"]);
  add("poisson", "poisson", "Distribution expressing the probability of a given number of events occurring in a fixed interval of time/space.", "P(X=k) = \\frac{\\lambda^k e^{-\\lambda}}{k!}", "Number of emails received per hour.", lesson("04-pmf-pdf"), ["pmf"], ["exponential"]);
  add("uniform", "uniform", "Distribution where all intervals of the same length are equally probable.", "f(x) = \\frac{1}{b-a}", "Waiting time for a bus arriving exactly every 10 mins.", lesson("04-pmf-pdf"), ["pdf"], ["expectation", "variance"]);
  add("exponential", "exponential", "Distribution of the time between events in a Poisson point process.", "f(x) = \\lambda e^{-\\lambda x}", "Time until the next earthquake.", lesson("04-pmf-pdf"), ["pdf", "poisson"], ["variance"]);
  add("normal", "normal", "A continuous probability distribution that is symmetric around its mean (bell curve).", "f(x) = \\frac{1}{\\sigma\\sqrt{2\\pi}} e^{-\\frac{(x-\\mu)^2}{2\\sigma^2}}", "Heights of adult males.", lesson("04-pmf-pdf"), ["pdf", "expectation", "variance"], ["clt", "z-test"]);

  // 05-joint-covariance
  add("joint-distribution", "joint distribution", "A probability distribution for two or more random variables.", "P(X=x, Y=y)", "Probability of drawing a Red AND an Ace.", lesson("05-joint-covariance"), ["random-variable"], ["marginal-distribution", "covariance"]);
  add("marginal-distribution", "marginal distribution", "The probability distribution of the variables contained in a subset, obtained by summing/integrating out other variables.", "P(X=x) = \\sum_y P(X=x, Y=y)", "Probability of drawing an Ace, ignoring suit.", lesson("05-joint-covariance"), ["joint-distribution"], ["conditional-distribution"]);
  add("conditional-distribution", "conditional distribution", "The distribution of a random variable given that another random variable is known to take on a specific value.", "P(X|Y) = \\frac{P(X, Y)}{P(Y)}", "Distribution of weight given height=180cm.", lesson("05-joint-covariance"), ["joint-distribution", "conditional-probability"], ["independence"]);
  add("covariance", "covariance", "A measure of the joint variability of two random variables.", "\\operatorname{Cov}(X,Y) = E[XY] - E[X]E[Y]", "Covariance of height and weight is positive.", lesson("05-joint-covariance"), ["expectation", "joint-distribution"], ["correlation"]);
  add("correlation", "correlation", "A normalized version of covariance that shows the strength and direction of a linear relationship (-1 to 1).", "\\rho_{X,Y} = \\frac{\\operatorname{Cov}(X,Y)}{\\sigma_X \\sigma_Y}", "Correlation of 0.9 implies strong positive linear relationship.", lesson("05-joint-covariance"), ["covariance", "standard-deviation"], ["independence"]);
  add("independence", "independence (variables)", "Two random variables are independent if their joint distribution is the product of their marginals.", "P(X,Y) = P(X)P(Y)", "Outcomes of two separate dice rolls.", lesson("05-joint-covariance"), ["joint-distribution"], ["correlation"]);

  // 06-descriptive-stats
  add("mean", "mean", "The arithmetic average of a set of given numbers.", "\\bar{x} = \\frac{1}{n}\\sum x_i", "Mean of 2, 4, 6 is 4.", lesson("06-descriptive-stats"), [], ["median", "variance"]);
  add("median", "median", "The middle value separating the greater and lesser halves of a data sample.", "\\text{Middle value of sorted data}", "Median of 1, 100, 101 is 100.", lesson("06-descriptive-stats"), [], ["mean", "percentile"]);
  add("mode", "mode", "The value that appears most often in a set of data values.", "\\text{Most frequent value}", "Mode of 1, 2, 2, 3 is 2.", lesson("06-descriptive-stats"), [], ["mean", "median"]);
  add("standard-deviation", "standard deviation", "A measure of the amount of variation or dispersion of a set of values.", "\\sigma = \\sqrt{\\operatorname{Var}(X)}", "SD of test scores shows spread around the average.", lesson("06-descriptive-stats"), ["variance"], ["correlation", "standard-error"]);
  add("percentile", "percentile", "A score below which a given percentage of scores in its frequency distribution falls.", "P_{90} = \\text{value beating 90\\% of data}", "Scoring in the 99th percentile means top 1%.", lesson("06-descriptive-stats"), ["median"], ["cdf"]);

  // 07-clt
  add("sample-mean", "sample mean", "An estimator of the population mean computed from a random sample.", "\\bar{X} = \\frac{1}{n}\\sum_{i=1}^n X_i", "Average height of 50 randomly selected people.", lesson("07-clt"), ["mean", "random-variable"], ["central-limit-theorem", "standard-error"]);
  add("law-of-large-numbers", "law of large numbers", "As a sample size grows, its mean gets closer to the average of the whole population.", "\\bar{X}_n \\xrightarrow{P} \\mu", "Flipping a coin 10,000 times will give ~50% heads.", lesson("07-clt"), ["sample-mean", "expectation"], ["central-limit-theorem"]);
  add("central-limit-theorem", "central limit theorem", "The sampling distribution of the mean approaches a normal distribution as the sample size gets larger, regardless of the population distribution.", "\\frac{\\bar{X}-\\mu}{\\sigma/\\sqrt{n}} \\xrightarrow{d} N(0,1)", "Average die rolls across 100 dice is normally distributed.", lesson("07-clt"), ["sample-mean", "normal"], ["z-test"]);
  add("standard-error", "standard error", "The standard deviation of the sampling distribution of a statistic, most commonly of the mean.", "SE = \\frac{\\sigma}{\\sqrt{n}}", "Standard error of the mean height estimate.", lesson("07-clt"), ["standard-deviation", "sample-mean"], ["z-test", "t-test"]);

  // 08-z-t-tests
  add("hypothesis-testing", "hypothesis testing", "A statistical method to make decisions using data, whether from an experiment or an observational study.", "\\text{Accept/Reject } H_0", "Testing if a new drug is better than a placebo.", lesson("08-z-t-tests"), ["sample-mean"], ["null-hypothesis", "p-value"]);
  add("null-hypothesis", "null hypothesis", "The default or baseline assumption that there is no effect or no difference.", "H_0: \\mu = \\mu_0", "H0: The coin is fair (P(Heads) = 0.5).", lesson("08-z-t-tests"), ["hypothesis-testing"], ["p-value", "type-i-error"]);
  add("p-value", "p-value", "The probability of obtaining test results at least as extreme as the results actually observed, under the assumption that the null hypothesis is correct.", "P(T \\ge t | H_0 \\text{ true})", "A p-value of 0.01 indicates strong evidence against H0.", lesson("08-z-t-tests"), ["null-hypothesis"], ["hypothesis-testing"]);
  add("z-test", "z-test", "A statistical test used when the sample size is large or the population variance is known.", "Z = \\frac{\\bar{x} - \\mu_0}{\\sigma/\\sqrt{n}}", "Testing mean test scores of 1000 students.", lesson("08-z-t-tests"), ["central-limit-theorem", "standard-error", "normal"], ["t-test"]);
  add("t-test", "t-test", "A statistical test used when the sample size is small and the population variance is unknown.", "t = \\frac{\\bar{x} - \\mu_0}{s/\\sqrt{n}}", "Testing mean reaction time of 15 subjects.", lesson("08-z-t-tests"), ["standard-error", "hypothesis-testing"], ["z-test"]);
  add("type-i-error", "type I error", "False positive: rejecting a true null hypothesis.", "P(\\text{Reject } H_0 | H_0 \\text{ true}) = \\alpha", "Convicting an innocent person.", lesson("08-z-t-tests"), ["null-hypothesis"], ["type-ii-error"]);
  add("type-ii-error", "type II error", "False negative: failing to reject a false null hypothesis.", "P(\\text{Accept } H_0 | H_0 \\text{ false}) = \\beta", "Acquitting a guilty person.", lesson("08-z-t-tests"), ["null-hypothesis"], ["type-i-error"]);

  // 09-chi-f-tests
  add("chi-square-distribution", "chi-square distribution", "Distribution of a sum of the squares of k independent standard normal random variables.", "Q = \\sum_{i=1}^k Z_i^2", "Used in variance testing and goodness of fit.", lesson("09-chi-f-tests"), ["normal"], ["goodness-of-fit", "f-distribution"]);
  add("f-distribution", "F-distribution", "A continuous probability distribution arising frequently as the null distribution of a test statistic.", "F = \\frac{X_1/d_1}{X_2/d_2}", "Used in ANOVA to compare variances.", lesson("09-chi-f-tests"), ["chi-square-distribution"], ["anova"]);
  add("goodness-of-fit", "goodness of fit", "A test that establishes whether an observed frequency distribution differs from a theoretical distribution.", "\\chi^2 = \\sum \\frac{(O_i-E_i)^2}{E_i}", "Testing if a die is fair by rolling it 60 times.", lesson("09-chi-f-tests"), ["chi-square-distribution"], ["test-of-independence"]);
  add("test-of-independence", "test of independence", "Assesses whether observations consisting of measures on two variables, expressed in a contingency table, are independent of each other.", "\\chi^2 \\text{ on contingency table}", "Testing if gender and voting preference are independent.", lesson("09-chi-f-tests"), ["goodness-of-fit", "independence"], ["anova"]);
  add("anova", "ANOVA", "Analysis of Variance: a collection of statistical models to analyze the differences among group means in a sample.", "F = \\frac{\\text{Variance between groups}}{\\text{Variance within groups}}", "Comparing average crop yields for 3 different fertilizers.", lesson("09-chi-f-tests"), ["f-distribution", "hypothesis-testing"], ["t-test"]);

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

  return C;
});
