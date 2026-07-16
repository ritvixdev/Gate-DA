# Machine Learning — Practice Questions (P1–P54)

**P1.** True or False: The slope of the Receiver Operating Characteristic (ROC) curve represents the rate of change of the True Positive Rate (TPR) with respect to the False Positive Rate (FPR).

A. The statement is False.
B. The statement is True.

**Answer: B — True**

The ROC curve plots FPR on the x-axis and TPR on the y-axis as the decision threshold varies. For any curve $y=f(x)$, the slope is $dy/dx$ by definition, so the ROC slope is literally $d(\text{TPR})/d(\text{FPR})$.

---

**P2.** Select the correct option(s).

A. Filling in missing values in a dataset is referred to as data imputation.
B. Consider a dataset with $m$ instances and $n$ features. The size of the data matrix in which each column represents a feature will be $m\times n$.
C. In a function approximation problem, such as regression, the data labels are real numbers.
D. It is possible that two features are correlated.

**Answer: A, B, C, D — all correct**

All four are standard facts: imputation fills missing values; $m$ instances (rows) × $n$ features (columns) gives an $m\times n$ matrix; regression labels are real-valued; and features are frequently correlated with each other.

---

**P3.** Select the correct option.

A. The OLS slope and intercept estimates are not sensitive to outliers.
B. The OLS slope and intercept estimates are sensitive to outliers.

**Answer: B**

OLS minimizes squared error, so one far-away point contributes a hugely amplified squared residual, pulling the fitted line noticeably toward it.

---

**P4.** Which statements about the closed-form OLS solution $\hat\beta=(X^\top X)^{-1}X^\top y$ are TRUE?

A. The estimator can be interpreted as a weighted combination of the observed data.
B. The solution exists only when $X^\top X$ is invertible, which requires that the predictors are not perfectly collinear.
C. Computing $(X^\top X)^{-1}$ is always more efficient than using gradient descent, regardless of dataset size.
D. The closed-form expression provides the unique parameter vector $\hat\beta$ that minimizes the Residual Sum of Squares (RSS).

**Answer: A, B, D**

$\hat\beta$ is a linear (weighted) function of $y$ (A). $X^\top X$ is invertible exactly when the predictors are independent, i.e. not perfectly collinear (B). Matrix inversion is $O(p^3)$ and becomes slower than gradient descent for very large $p$ or $n$, so "always" in (C) is false. When it exists, the closed form is the unique RSS-minimizer (D).

---

**P5.** Suppose $SST=500$ and $SSR=380$. Find the coefficient of determination $R^2$.

**Answer: 0.76**

$R^2=SSR/SST=380/500=0.76$.

---

**P6.** A classifier has Sensitivity $=0.92$, Specificity $=0.84$. Find the False Positive Rate used on the ROC curve.

**Answer: 0.16**

$FPR=1-\text{Specificity}=1-0.84=0.16$. (Sensitivity is not needed — FPR depends only on specificity.)

---

**P7.** A perfectly balanced binary dataset (50% class 0, 50% class 1) is scored by a classifier that produces equal probability for all 4 confusion-matrix outcomes (TP, FP, TN, FN each $\tfrac14$). What is the accuracy?

**Answer: 0.5**

Accuracy $=\dfrac{TP+TN}{TP+FP+TN+FN}=\dfrac{0.25+0.25}{1}=0.5=\tfrac12$. (Equivalent to a classifier no better than a coin flip.)

---

**P8.** A logistic regression model is $\log\!\big(\tfrac{p}{1-p}\big)=-1.5+0.3x$. At $x=5$, compute $\dfrac{dp}{dx}$.

**Answer: 0.075**

$z=-1.5+0.3(5)=0\Rightarrow p=\sigma(0)=0.5$. Then $\dfrac{dp}{dx}=\beta_1\,p(1-p)=0.3(0.5)(0.5)=0.075$.

---

**P9.** A model's confusion matrix has TP $=45$, FP $=15$, TN $=130$, FN $=10$. Calculate the Precision.

**Answer: 0.75**

Precision $=\dfrac{TP}{TP+FP}=\dfrac{45}{45+15}=\dfrac{45}{60}=0.75$.

---

**P10.** Model A has $R^2=0.86$ and $SST=500$. Model B has $R^2=0.90$ on the same dataset (same $SST$). By how much has the SSE decreased from Model A to Model B?

**Answer: 20**

$SSE=SST(1-R^2)$. Model A: $500(0.14)=70$. Model B: $500(0.10)=50$. Decrease $=70-50=20$.

---

**P11.** A regression model is evaluated on 200 observations, with $R^2=0.84$ and $SST=2500$. Compute the RMSE.

**Answer: ≈1.414**

$SSE=SST(1-R^2)=2500(0.16)=400$. $MSE=SSE/n=400/200=2$. $RMSE=\sqrt{2}\approx1.414$.

---

**P12.** Four 2-D points: $(1,2),(2,1),(8,9),(9,8)$. Cluster 1 $=\{(1,2),(2,1)\}$, Cluster 2 $=\{(8,9),(9,8)\}$. Compute the inertia (sum of squared distances of each point from its cluster centroid).

**Answer: 2**

Centroid 1 $=(1.5,1.5)$, centroid 2 $=(8.5,8.5)$. Each of the 4 points is $(0.5,0.5)$ away from its centroid: squared distance $=0.5^2+0.5^2=0.5$ each. Total inertia $=4\times0.5=2$.

---

**P13.** A logistic model is $f(x)=\dfrac{1}{1+e^{-(\beta_0+\beta_1x)}}$ with $\beta_0=-4,\ \beta_1=0.5$. Find $x$ where the derivative of the logistic function is maximized.

**Answer: 8**

The derivative $\beta_1p(1-p)$ is maximized at $p=0.5$, i.e. where $z=\beta_0+\beta_1x=0$: $-4+0.5x=0\Rightarrow x=8$.

---

**P14.** A binary classifier is evaluated on 1000 instances (400 positive, 600 negative). It correctly classifies 90% of positives and 80% of negatives. Compute the accuracy.

**Answer: 0.84**

Correct positives $=0.90(400)=360$. Correct negatives $=0.80(600)=480$. Accuracy $=(360+480)/1000=0.84$.

---

**P15.** Logistic regression with L2 regularization uses gradient descent, $\eta=0.1$. Current coefficient $\beta=3$, gradient of the logistic loss $=2$, $\lambda=0.4$. Compute the updated coefficient after one step, using the update rule $\beta:=\beta-\eta(\nabla L+\lambda\beta)$.

**Answer: 2.68**

$\beta_{\text{new}}=\beta-\eta(\nabla L+\lambda\beta)=3-0.1(2+0.4\times3)=3-0.1(3.2)=3-0.32=2.68$.

---

**P16.** A dataset has 1200 observations. 5-fold cross-validation is used while tuning 12 hyperparameter combinations via grid search, training a separate model for every combination in every fold. How many models are trained in total?

**Answer: 60**

Total fits $=g\times k=12\times5=60$ (the 1200 observations don't change this count — it only depends on the grid size and fold count).

---

**P17.** Two features are correlated. Does this mean one causes the other (a causal relationship)?

A. Statement is True.
B. Statement is False.

**Answer: B**

Correlation never by itself establishes causation — a confounder, reverse causation, or coincidence could equally explain it.

---

**P18.** A binary classifier classifies all instances without any error (more instances than classes, every class has at least one instance). Which is/are True for the confusion matrix?

A. Diagonal entries are non-zero.
B. Diagonal entries can be zero or non-zero.
C. Off-diagonal entries are all zeros.
D. Off-diagonal entries can be zero or non-zero.

**Answer: A, C**

Zero classification error means every prediction matches the true class, so all off-diagonal entries are exactly $0$ (C). Since every class has at least one instance and none is misclassified, every diagonal entry is at least $1$, i.e. non-zero (A).

---

**P19.** The Receiver Operating Characteristic (ROC) curve plots which two variables against each other?

A. Recall on the X-axis.
B. True Positive Rate (Sensitivity) on the Y-axis.
C. False Positive Rate (1 − Specificity) on the X-axis.
D. Precision on the Y-axis.

**Answer: B, C**

The ROC curve is TPR (Sensitivity/Recall) on the Y-axis against FPR ($1-$Specificity) on the X-axis — Recall belongs on the Y-axis (not X), and the Y-axis metric is TPR, not Precision.

---

**P20.** Simple linear regression estimates a car's speed from distance vs. time data (car moves in a straight line at constant speed; time is measured exactly, distance is noisy). Select the correct option(s).

A. Intercept needs to be included if it is known that the initial distance (at time zero) is not zero.
B. Intercept needs to be included if it is known that the initial distance (at time zero) is zero.
C. Intercept should never be included in the model.
D. Intercept should always be included in the model.

**Answer: A**

The intercept represents the physical starting distance. If that's known to be non-zero, the model needs a free intercept to capture it (A). If it's known to be exactly zero, the line should be forced through the origin instead — no free intercept needed (B is false), so "never"/"always" absolutes (C, D) are also both wrong.

---

**P21.** A dataset has 120 observations. kNN uses Leave-One-Out Cross-Validation. How many times is the kNN classifier trained?

**Answer: 120**

LOOCV sets $k=n$: with $120$ points, there are $120$ leave-one-out splits, so the model is evaluated $120$ times (one held-out prediction per point).

---

**P22.** Suppose $y=[4,6,7,10]$ and $\hat y=[5,5,8,9]$. Compute the Mean Squared Error.

**Answer: 1**

Errors: $-1,1,-1,1$; squared: $1,1,1,1$; sum $=4$; MSE $=4/4=1$.

---

**P23.** The sample size doubles while the data distribution remains unchanged. What is the most likely effect on the variance of the OLS coefficient estimates?

A. Increases
B. Remains exactly unchanged
C. Decreases
D. Becomes zero

**Answer: C**

$\operatorname{Var}(\hat\beta)$ scales roughly as $\sigma^2/(n\operatorname{Var}(x))$ — more data (larger $n$) makes the estimate more precise, so the variance decreases (but never reaches exactly zero).

---

**P24.** One predictor is an exact linear combination of the remaining predictors. Which statement is correct?

A. Residuals become zero.
B. $R^2$ becomes negative.
C. OLS predictions remain unique, but coefficient estimates are not unique.
D. Predictions become impossible.

**Answer: C**

Perfect collinearity makes $X^\top X$ singular, so $\hat\beta$ is not unique — but the fitted values $\hat y=X\hat\beta$ are still the unique projection of $y$ onto the column space of $X$, so predictions stay unique.

---

**P25.** Which of the following statements are correct?

A. Cohen's Kappa adjusts for agreement expected by chance.
B. Precision increases when false positives decrease while TP remains fixed.
C. Detection prevalence equals prevalence for every classifier.
D. Balanced Accuracy equals Accuracy for every classifier.
E. Specificity increases when false positives decrease.

**Answer: A, B, E**

Kappa $=\kappa=(p_o-p_e)/(1-p_e)$ strips out chance agreement (A true). Precision $=TP/(TP+FP)$ rises as $FP\downarrow$ with $TP$ fixed (B true). Specificity $=TN/(TN+FP)$ rises as $FP\downarrow$ (E true). Detection prevalence ($=(TP+FP)/\text{total}$, a model property) need not equal prevalence ($=(TP+FN)/\text{total}$, a data property) — false in general (C false). Balanced accuracy $=$ accuracy only on perfectly balanced data with no class-dependent error rates — not for "every" classifier (D false).

---

**P26.** Logistic regression with L1 regularization is trained using gradient descent. Which statement is correct?

A. The L1 penalty has continuous second derivatives everywhere.
B. The optimization becomes non-convex.
C. Every update is differentiable.
D. Standard gradient descent cannot directly use the derivative exactly at $w=0$.

**Answer: D**

$|w|$ has a sharp corner at $w=0$ — no single tangent slope exists there (only subgradients between $-1$ and $+1$), so plain gradient descent needs a special rule (e.g. subgradient or proximal step) right at that point. The penalty is still convex overall (B false), it's not smooth everywhere (A, C false).

---

**P27.** Select the correct option(s).

A. Filling in missing values in a dataset is referred to as data imputation.
B. It is possible that two features are correlated.
C. In a function approximation problem, such as regression, the data labels are real numbers.
D. Consider a dataset with $m$ instances and $n$ features. The size of the data matrix in which each column represents a feature will be $m\times n$.

**Answer: A, B, C, D — all correct**

All four are true, same facts as P2 in different order.

---

**P28.** Pearson's correlation coefficient is $R_{xy}=\dfrac{\operatorname{Cov}(X,Y)}{\sigma_X\sigma_Y}$. If $R_{xy}=0.8$, what is $R_{yx}$?

A. $0.8$
B. $-0.8$
C. $0$
D. Cannot be determined from the information provided

**Answer: A — $0.8$**

$\operatorname{Cov}(X,Y)=\operatorname{Cov}(Y,X)$ and $\sigma_X\sigma_Y=\sigma_Y\sigma_X$, so Pearson's correlation is symmetric: $R_{yx}=R_{xy}=0.8$.

---

**P29.** $y=ax+b$ with $a>0$. What is the value of Pearson's correlation coefficient between $x$ and $y$?

A. $-1$
B. $0$
C. $1$
D. Cannot be determined from the information provided

**Answer: C — $1$**

A perfect, noise-free linear relationship always gives $|r|=1$; since the slope $a>0$ (positive relationship), $r=+1$.

---

**P30.** Which among the following is NOT permissible for Pearson's correlation coefficient?

A. $2$
B. $-1$
C. $-2$
D. $1$

**Answer: A, C**

Pearson's $r$ is only ever defined on $[-1,1]$, so $2$ and $-2$ are impossible values; $-1$ and $1$ are the (valid) boundary cases.

---

**P31.** Weighted kNN uses $w=1/d$. Five neighbours of a query point: distance 1 (class A), distance 2 (class B), distance 3 (class A), distance 4 (class B), distance 5 (class B). Predict the class label.

**Answer: Class A (0)**

Weights: $1/1=1$(A), $1/2=0.5$(B), $1/3\approx0.333$(A), $1/4=0.25$(B), $1/5=0.2$(B). Class A total $\approx1.333$; Class B total $=0.95$. A wins.

---

**P32.** Select the correct option(s).

A. Employing an overtly simplistic model is referred to as under-fitting.
B. How efficient a particular model is can be gauged from training data.
C. How efficient a particular model is can be gauged from test data.
D. In over-fitting, a model fits the training data very well but fails to generalize properly to unseen data.

**Answer: A, C, D**

Under-fitting = too-simple model (A true). Efficiency/generalization must be judged on unseen test data, not training data — a model can look perfect on training data yet generalize poorly (B false, C true). That mismatch is exactly the definition of over-fitting (D true).

---

**P33.** True or False: $k$-fold cross-validation is especially useful when there is a paucity of data, and generally provides a more reliable estimate of model performance than a single train-test split, since the model is evaluated multiple times on different subsets of data.

A. Statement is True.
B. Statement is False.

**Answer: A**

Averaging scores over $k$ rotating folds reduces the luck-of-the-split noise inherent in one single train/test split, and it makes efficient use of scarce data since every point gets both a training and a validation turn.

---

**P34.** Select the correct option(s).

A. For time-series forecasting data, $k$-fold cross-validation is not recommended, since the temporal order of data need not be preserved while splitting the data.
B. For a sufficiently large dataset, a single train-test split usually provides a reliable estimate of model performance.
C. In $k$-fold cross-validation, results are averaged across folds.
D. The computational cost for $k$-fold cross-validation increases with the size of the data.

**Answer: B, C, D**

Plain $k$-fold CV is unsuitable for time series precisely because the temporal order *must* be preserved (train on past, validate on future) — the reasoning given in (A) is backwards, so A is false. With enough data, a single split is often reliable (B true). Averaging across folds (C) and rising compute cost with data size (D) are both standard, true facts.

---

**P35.** In a residual plot, standardized residuals are plotted against predicted values, and the data points are randomly scattered. Then,

A. The assumption of heteroscedasticity is met.
B. The assumption of homoscedasticity is met.

**Answer: B**

Random scatter with no funnel/cone shape means the residual variance stays roughly constant across predicted values — that's homoscedasticity, not its opposite.

---

**P36.** In Logistic Regression, a linear relationship is assumed between the independent variables and the

A. Sigmoid of the dependent variable
B. Log of the dependent variable (i.e. the log-odds)
C. Sine of the dependent variable
D. None of the above

**Answer: B**

$\ln\!\big(\tfrac{p}{1-p}\big)=\beta_0+\beta_1x_1+\dots+\beta_nx_n$ — the log-odds (logit) of the outcome is linear in the features; it's the sigmoid that's applied to recover $p$ from that linear score, not the other way round.

---

**P37.** The sigmoid function $e^x/(1+e^x)$, $x\in\mathbb{R}$, is

A. a Probability Density Function (PDF)
B. a Cumulative Distribution Function (CDF)
C. strictly monotonically increasing for any finite value of $x$
D. None of the above

**Answer: B, C**

This function is exactly the CDF of the standard logistic distribution (B) — it rises from $0$ to $1$. Its derivative $\sigma(x)(1-\sigma(x))>0$ everywhere, so it's strictly increasing (C). It is not a PDF (A false) since it doesn't describe a density itself.

---

**P38.** Optimal model parameters in logistic regression can be obtained by

A. Maximizing the likelihood function
B. Maximizing the logarithm of the likelihood function
C. Minimizing the likelihood function
D. Minimizing the negative of the logarithm of the likelihood function

**Answer: A, B, D**

Maximizing $L$, maximizing $\log L$ (monotonic transform, same maximizer), and minimizing $-\log L$ are all exactly equivalent objectives (A, B, D true). Minimizing $L$ itself would push probabilities toward the worst possible fit (C false).

---

**P39.** In multiple linear regression $y=X\beta_v+\epsilon_v$ with $n$ data points and $p$ independent variables ($X$ is $n\times(p+1)$), the first column of $X$ is a vector of

A. zeros
B. cannot be ascertained
C. minus ones
D. ones

**Answer: D**

The intercept term $\beta_0$ needs a constant $1$ multiplying it in every row, so the first column of $X$ (paired with $\beta_0$) is a column of ones.

---

**P40.** $n$ data points; $p_i,q_i$ are the probabilities of class 0 / class 1 for point $i$ ($p_i+q_i=1$). The first $k$ points are truly class 0, the rest are truly class 1. Which is the correct likelihood $L$?

A. $L=(1-p_1)\cdots(1-p_k)\,q_{k+1}\cdots q_n$
B. $L=p_1\cdots p_k\,q_{k+1}\cdots q_n$
C. $L=(1-p_1)\cdots(1-p_k)\,(1-q_{k+1})\cdots(1-q_n)$
D. $L=p_1\cdots p_k\,(1-q_{k+1})\cdots(1-q_n)$

**Answer: B**

Each point's likelihood contribution is the model's probability for its *true* class: the first $k$ points are truly class 0, contributing $p_i$ directly (not $1-p_i$); the rest are truly class 1, contributing $q_i$ directly. So $L=p_1\cdots p_k\,q_{k+1}\cdots q_n$.

---

**P41.** Adding one more parameter decreases the training MSE and increases the validation MSE. The model is currently

A. Overfitting
B. Underfitting

**Answer: A**

Training error falling while validation error rises is the textbook signature of overfitting — the extra parameter is chasing training-set noise rather than the true signal.

---

**P42.** With $n$ data points, Leave-One-Out CV (LOOCV) and $k$-fold CV are equivalent when

A. $k<n$
B. $k=n$
C. $k>n$
D. None of the above

**Answer: B**

LOOCV is $k$-fold CV with $k$ set equal to $n$ — one fold per data point.

---

**P43.** A perfect classifier never misclassifies any data point. The confusion matrix must be a diagonal matrix.

A. Statement is False
B. Statement is True

**Answer: B**

Zero misclassification means every off-diagonal cell (true class $\ne$ predicted class) is $0$ — for any number of classes, that's exactly the definition of a diagonal matrix.

---

**P44.** For logistic regression, $\ln[o(x)]$ where $o(x)=p(x)/[1-p(x)]$ — the log-odds is linear in the decision variables.

A. The conclusion is True
B. The conclusion is False

**Answer: A**

By construction, $\ln[o(x)]=\beta_0+\beta_1x_1+\dots+\beta_nx_n$ — exactly linear in $x_1,\dots,x_n$ (and in the $\beta$'s).

---

**P45.** Multi-class classification with $N$ classes: $P(y=k)=e^{x_k}/\sum_{i=1}^N e^{x_i}$.

A. The posited function is a valid probability mass function
B. The posited function is not a valid probability mass function

**Answer: A**

Each $e^{x_k}>0$, and summing over $k=1,\dots,N$ gives $\sum_k P(y=k)=\sum_k e^{x_k}/\sum_i e^{x_i}=1$ by construction — softmax is always a valid PMF.

---

**P46.** For a perfectly balanced binary dataset (equal positive and negative counts), which holds true?

A. $TP+FP=TN+FN$
B. None of the above
C. $TP+FN=TN+FP$
D. $TP+TN=FP+FN$

**Answer: C**

$TP+FN$ is the count of actual positives; $TN+FP$ is the count of actual negatives. A perfectly balanced dataset means these two are equal — that's the only identity guaranteed just from balance (the others depend on the classifier's specific error pattern).

---

**P47.** A classifier always predicts the positive class, regardless of input. Then,

A. Sensitivity = 0, Specificity = 1
B. Sensitivity = 1, Specificity = 0

**Answer: B**

Nothing is ever predicted negative, so $FN=0\Rightarrow$ Sensitivity $=TP/(TP+0)=1$; and $TN=0$ (no actual negative is ever correctly called negative) $\Rightarrow$ Specificity $=0/(0+FP)=0$.

---

**P48.** The most commonly used distance metric between centroids and data points in the $k$-means algorithm is

A. Chebyshev
B. None of the above
C. Manhattan
D. Euclidean

**Answer: D**

Standard $k$-means minimizes within-cluster sum of squared **Euclidean** distances, and the centroid update (the mean) is the exact minimizer only under squared Euclidean distance.

---

**P49.** (1) A very large $k$ may include points from other classes in the neighborhood. (2) A too-small $k$ makes the algorithm very sensitive to noise. Which is/are true?

A. Both are False
B. 1 is False and 2 is True
C. Both are True
D. 1 is True and 2 is False

**Answer: C**

Large $k$ over-smooths the boundary, pulling in far-away points from other classes (true, underfitting risk). Small $k$ (e.g. $k=1$) reacts to every single noisy neighbour (true, overfitting risk). Both statements are true.

---

**P50.** Logistic regression tends to overfit when we have a large number of independent variables present.

A. Statement is True
B. Statement is False

**Answer: A**

With many features relative to the number of samples (and no regularization), logistic regression can fit noise in the training data — the standard fix is L1/L2 regularization.

---

**P51.** In an ROC curve, Sensitivity is plotted vs. (1 − Specificity); AUC is the area under it. Which AUC value is most desirable?

A. $0.8$
B. $0.5$
C. $0.75$
D. $0.9$

**Answer: D**

Higher AUC (closer to $1$) means better ranking quality; $0.5$ is no better than random. Among the choices, $0.9$ is the largest and therefore most desirable.

---

**P52.** A $k$-means clustering model becomes better as (SS = sum of squares)

A. we decrease the within-cluster SS and increase the between-cluster SS
B. we increase the within-cluster SS and increase the between-cluster SS
C. we increase the within-cluster SS and decrease the between-cluster SS
D. None of the above

**Answer: A**

Good clusters are tight internally (low within-cluster SS / inertia) and well-separated from each other (high between-cluster SS).

---

**P53.** Binary classification, $k$-NN with $k=1$, and a very large amount of labelled data. Will the algorithm always classify a new point correctly?

A. Statement is False
B. Statement is True

**Answer: A**

Even with unlimited training data, 1-NN's asymptotic error rate is bounded above by (at most) twice the Bayes error rate — it does not vanish unless the classes are perfectly separable, so "always correct" is false.

---

**P54.** Binary classification, $k$-NN with $k=1$, Euclidean distance rounded to 2 decimal places. Can the algorithm give an ambiguous result (a tie between classes)?

A. No
B. Yes

**Answer: B**

Rounding to 2 decimal places can easily make two training points from different classes land at the exact same rounded distance from the query — tying for "nearest" and making the single-vote outcome ambiguous.
