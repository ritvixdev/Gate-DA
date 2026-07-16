# Probability & Statistics — Practice Questions (P1–P31)

**P1.** Consider three events $A,B,C$ such that $A\cap B\cap C=A$. Which conclusion follows necessarily (no extra assumptions)?

A. $A\subset B\subset C$
B. $A\subseteq B\subseteq C$
C. $A\subset B$ and $A\subset C$
D. $A\subseteq B$ and $A\subseteq C$

**Answer: D**

$A\cap B\cap C\subseteq A$ always; equality forces every element of $A$ to be in both $B$ and $C$, i.e. $A\subseteq B$ and $A\subseteq C$. Strict subset isn't guaranteed since $A$ could equal $B$ or $C$.

---

**P2.** A random variable $X$ has CDF $P[X\le x]=0$ for $x<0$; $=x$ for $0\le x\le1$; $=1$ for $x>1$. Select the correct option.

A. This is the CDF of a uniform random variable.
B. The function is not a valid CDF.
C. More information is required to determine validity.
D. It is a valid CDF, but not of a uniform random variable.

**Answer: A**

$F$ is non-decreasing, goes from $0$ to $1$, and is continuous — a valid CDF. $F(x)=x$ on $[0,1]$ is exactly the CDF of Uniform$(0,1)$.

---

**P3.** A continuous random variable $X$ has pdf $f(x)=\tfrac12x$. A valid support for $X$ is:

A. $0\le x\le3$
B. $0\le x\le1$
C. $0\le x\le2$
D. $0\le x\le4$

**Answer: C**

Need $\int_0^a \tfrac{x}{2}\,dx=1\Rightarrow \tfrac{a^2}{4}=1\Rightarrow a=2$.

---

**P4.** A person buys one ticket in each of 10 independent lotteries, each with win probability $0.001$. Let $X$ = number of wins, $Y$ = number of non-wins. Select the correct option(s).

A. $Y\sim\text{Binomial}(10,0.001)$
B. $Y\sim\text{Binomial}(10,0.999)$
C. $X\sim\text{Binomial}(10,0.999)$
D. $X\sim\text{Binomial}(10,0.001)$

**Answer: B, D**

$X$ (wins) $\sim$ Binomial$(10,0.001)$ directly. $Y=10-X$ (non-wins) counts the "non-win" event with probability $0.999$, so $Y\sim$ Binomial$(10,0.999)$.

---

**P5.** A two-sided t-test at $\alpha=0.05$ for $H_0:\mu=50$ vs $H_1:\mu\ne50$ gives a p-value of $0.03$. Which statement(s) are correct?

A. The test should be converted to a one-sided test.
B. The null hypothesis is rejected at the 5% significance level.
C. The null hypothesis is accepted because $0.03<0.05$.
D. A Type II error has definitely occurred.

**Answer: B**

Reject $H_0$ if p-value $<\alpha$; here $0.03<0.05$, so $H_0$ is rejected. Converting to one-sided after seeing results is invalid, "accepted" is backwards logic, and Type II errors only apply when $H_0$ is *not* rejected.

---

**P6.** In a city, 40% are male, 60% female. 50% of males smoke; 40% of the whole population smokes. Given a person is a smoker, what is the probability they are male?

**Answer: 0.50**

Total probability: $0.4=(0.5)(0.4)+P(\text{Smoke}|F)(0.6)\Rightarrow P(\text{Smoke}|F)=1/3$. Bayes: $P(M|\text{Smoke})=\dfrac{0.5\times0.4}{0.4}=0.5$.

---

**P7.** Events $A,B,C$ with $C\subset B$: $P(A)=0.6$, $P(B)=0.3$, $P(C)=0.05$, $P(A\cap B)=0.2$, $P(A\cap C)=0$, $P(B\cap C)=0.05$. Find $P(A\cup B\cup C)$.

**Answer: 0.70**

Since $C\subset B$, $P(A\cap B\cap C)=P(A\cap C)=0$. Inclusion-exclusion: $0.6+0.3+0.05-0.2-0-0.05+0=0.70$.

---

**P8.** Which situation most appropriately requires an F-test?

A. Testing a population mean equals a value, variance known.
B. Testing whether two population variances are equal.
C. Testing independence between categorical variables.
D. Testing the sample mean vs. a hypothesized value, small samples.

**Answer: B**

The F-test compares two variances via the ratio of sample variances (F-distribution). Known-variance mean tests use Z, small-sample mean tests use t, categorical independence uses chi-square.

---

**P9.** Two urns $U_1,U_2$ each contain red (R) and blue (B) balls. You pick one urn at random, then one ball. Which is/are always True?

A. $P(U_1|R)+P(U_2|R)=1$
B. $P(R|U_1)+P(R|U_2)=1$
C. $P(U_1|B)+P(U_2|B)=1$
D. $P(B|U_1)+P(B|U_2)=1$

**Answer: A, C**

$U_1,U_2$ are mutually exclusive and exhaustive, so for any event $E$, $P(U_1|E)+P(U_2|E)=1$ — true for $E=R$ and $E=B$. The reversed-conditioning sums (B, D) are proportions of two unrelated urns and need not add to 1.

---

**P10.** Select the correct option(s). Usually, which of the following hold?

A. For left-skewed distributions, Mean > Median > Mode.
B. For right-skewed distributions, Mean < Median < Mode.
C. For left-skewed distributions, Mean < Median < Mode.
D. For right-skewed distributions, Mean > Median > Mode.

**Answer: C, D**

Right-skew (long right tail) pulls the mean rightmost: Mean > Median > Mode. Left-skew pulls the mean leftmost: Mean < Median < Mode. Options A and B state the reversed (wrong) pattern.

---

**P11.** $A,B$ are mutually exclusive with $P(A)>0$, $P(B)>0$. Then,

A. It is possible, in some cases, that $A$ and $B$ are also independent.
B. It is never possible for $A$ and $B$ to be independent.

**Answer: B**

Mutually exclusive means $P(A\cap B)=0$. Independence requires $P(A\cap B)=P(A)P(B)>0$ (since both probabilities are positive). $0$ can never equal a positive number, so independence is impossible.

---

**P12.** Let $r_{xy}$ be Pearson's correlation and $r_S$ Spearman's rank correlation. Select the correct option(s).

A. If $|r_{xy}|$ is close to 1, then $x,y$ have a linear relationship.
B. If $x,y$ have a linear relationship, then $|r_{xy}|$ is close to 1.
C. $|r_S|$ close to 1 implies a monotonic relationship between $x,y$.
D. $|r_S|$ close to 0 implies no monotonic association between $x,y$.

**Answer: A, C**

A high $|r_{xy}|$ does indicate linearity (A), and a high $|r_S|$ does indicate monotonicity (C). But the converses are false: a true linear relationship can still show low $r_{xy}$ under noise (B false), and low $r_S$ doesn't rule out a weak/noisy monotonic trend (D false).

---

**P13.** True or False: If a dataset has $n$ features, the variance-covariance matrix is $n\times n$.

A. The statement is False.
B. The statement is True.

**Answer: B**

A covariance matrix $\Sigma$ has one row/column per feature: diagonal entries are variances, off-diagonal entries are covariances. With $n$ features, $\Sigma$ is necessarily $n\times n$.

---

**P14.** A fair coin is tossed $2n$ times independently. The probability of an equal number of heads and tails is:

A. $\binom{2n}{n}\big/2^{2n}$
B. $1/(2n)!$
C. $1\big/\binom{2n}{n}$
D. $\binom{2n}{n}\big/2^{n}$

**Answer: A**

Heads count $\sim$ Binomial$(2n,\tfrac12)$. "Equal heads & tails" means exactly $n$ heads: $P(X=n)=\binom{2n}{n}(\tfrac12)^n(\tfrac12)^n=\binom{2n}{n}/2^{2n}$.

---

**P15.** In a containment zone, a standard test gives a positive result with probability 50% given the individual is infected. The probability of being infected is 50%. The probability of testing positive (overall) is 80%. What is the probability that an individual is infected, given they tested positive?

A. $100\%$
B. $\sim50\%$
C. $\sim80\%$
D. $\sim31\%$

**Answer: D**

Bayes' theorem: $P(\text{infected}\mid+)=\dfrac{P(+\mid\text{infected})P(\text{infected})}{P(+)}=\dfrac{0.5\times0.5}{0.8}=\dfrac{0.25}{0.8}=0.3125\approx31\%$.

---

**P16.** Two dice are rolled simultaneously. What is the probability of getting a sum which is a prime number?

A. $17/36$
B. $1/24$
C. $5/12$
D. $1/6$

**Answer: C**

Prime sums possible with two dice: $2,3,5,7,11$, with outcome counts (out of 36) $1,2,4,6,2$ respectively — total $15$. $P=15/36=5/12$.

---

**P17.** State whether True or False: (I) A deterministic phenomenon is one whose outcome can be predicted with a high degree of confidence. (II) A stochastic phenomenon is one whose outcome can be predicted with limited confidence.

A. I - True, II - False
B. I - True, II - True
C. I - False, II - True
D. I - False, II - False

**Answer: B**

Deterministic processes are (near-)certain and predictable (I true); stochastic (random) processes carry inherent uncertainty, so predictions about them are only ever made with limited confidence (II true).

---

**P18.** A bowl has three coins: two normal (fair) coins and one double-headed biased coin. A coin is picked at random and tossed. What is the probability of getting heads?

A. $1/2$
B. $1$
C. $3/4$
D. $2/3$

**Answer: D**

Law of total probability: $P(H)=\tfrac13(\tfrac12)+\tfrac13(\tfrac12)+\tfrac13(1)=\tfrac16+\tfrac16+\tfrac13=\tfrac46=\tfrac23$.

---

**P19.** Which statement(s) are NOT TRUE? (I) Spearman rank correlation can be used for ordinal variables. (II) Pearson's correlation takes a value between 0 and $+1$. (III) A pair of observations $(x_1,y_1),(x_2,y_2)$ with $x_1>x_2,y_1<y_2$ or $x_1<x_2,y_1>y_2$ are called concordant pairs.

A. II and III
B. I and III
C. I and II
D. III

**Answer: A — II and III**

(I) is true — Spearman works on ranks/ordinal data. (II) is false — Pearson's $r$ ranges over $[-1,1]$, not just $[0,1]$. (III) is false — pairs that move in *opposite* directions ($x$ up, $y$ down or vice versa) are **discordant**, not concordant (concordant pairs move in the *same* direction). So II and III are the not-true statements.

---

**P20.** Which $R^2$ value indicates a strong linear relationship?

A. $0.90$
B. $0.00$
C. $0.30$
D. $-0.86$

**Answer: A**

$R^2$ close to $1$ (here, $0.90$) means the model explains most of the variance — a strong linear fit. $0$ means no explanatory power; $0.30$ is weak; $R^2$ can never be negative under standard OLS with an intercept.

---

**P21.** Statement A: $X$ and $Y$ have a linear relationship. Statement B: Pearson's $r$ is close to $+1$ or $-1$ for $X,Y$. Select the correct option(s).

A. B implies A
B. A implies B
C. B does not necessarily imply A
D. A does not necessarily imply B

**Answer: B, C**

A true (exact) linear relationship always forces $|r|=1$, so A implies B. But observing $|r|$ merely *close to* 1 doesn't guarantee the underlying relationship is truly linear (outliers, restricted range, or near-linear-but-not-exact patterns can also produce a high $|r|$) — so B does not necessarily imply A.

---

**P22.** Consider $y_i=\beta_0+\beta_1x_i+\epsilon_i$. Which statements are True?

A. The regression analysis is MISO (multi-input single-output).
B. The regression analysis is SISO (single-input single-output).
C. It is assumed that the independent variable is completely error free.
D. $\partial SSE/\partial\beta_0=0$ gives $\sum_{i=1}^n\epsilon_i=0$, where $SSE=\sum_{i=1}^n\epsilon_i^2$.

**Answer: B, C, D**

With one predictor $x_i$ this is SISO, not MISO (B true, A false). Classical OLS assumes $x$ is measured without error (C true). Differentiating $SSE=\sum(y_i-\beta_0-\beta_1x_i)^2$ w.r.t. $\beta_0$ gives $-2\sum\epsilon_i=0\Rightarrow\sum\epsilon_i=0$ (D true).

---

**P23.** The higher the value of $R^2$ for a model, the observations are more closely grouped around:

A. Average values of the predicted variable
B. The intercept
C. The origin
D. The best fit line

**Answer: D**

$R^2$ measures how much of the variance is explained by the regression line — the higher it is, the more tightly the actual points cluster around the fitted (best-fit) line.

---

**P24.** In $(x,y)\in\mathbb{R}^2$, class 0 is the disk $x^2+y^2\le c^2$ and class 1 is outside it. Transform $z=x^2+y^2$. In the transformed 1-D feature space $z$, can the data be separated by a linear decision boundary?

A. Statement is True.
B. Statement is False.

**Answer: A**

In $z$-space, class 0 is $z\le c^2$ and class 1 is $z>c^2$ — a single threshold at $z=c^2$, which is exactly a linear (affine) boundary in 1-D. This is the core idea behind the kernel trick: a non-linear boundary in the original space becomes linear after the right feature transform.

---

**P25.** Which of the following is a linear decision boundary for binary classification in a 2-D feature space $(x,y)$, with $a_0,a_1$ constants?

A. $y=a_0+a_1x$
B. $y=a_0$
C. $y=x$
D. $y=a_1x$

**Answer: A, B, C, D — all correct**

Every option is a straight line ($y=a_0+a_1x$ with some choice of $a_0,a_1$ — including the special cases $a_1=0$, $a_0=0$, or $a_0=0,a_1=1$) — all are linear (affine) boundaries.

---

**P26.** Which of the following are assumptions in Ordinary Least Squares (OLS)?

A. The measurements of the independent variables are accurate.
B. The errors have an expected value of zero.
C. The relationship between the dependent variable and the independent variables is linear.
D. The errors have a constant variance.

**Answer: A, B, C, D — all correct**

All four are classical OLS assumptions: error-free predictors, zero-mean errors, linearity, and homoscedasticity (constant error variance).

---

**P27.** If OLS assumptions hold, $E(\hat\beta_0)=\beta_0$ and $E(\hat\beta_1)=\beta_1$. Select the correct option.

A. The true parameter values are usually unknown because the distribution of the data that generated the sample is unknown.
B. The true parameter values can be accurately calculated from a finite number of samples irrespective of whether the distribution of data is known or unknown.

**Answer: A**

The entire reason we estimate $\beta_0,\beta_1$ from a sample is that the true parameters and the data-generating distribution are unknown; unbiasedness is a property of the estimator's expectation over repeated sampling, not a claim that any single finite sample recovers the true value exactly.

---

**P28.** Let $A=$ average cigarettes smoked per day, $B=$ whether an individual has lung cancer. A study finds $A$ and $B$ are correlated. Select the correct option.

A. There exists a causal relationship between $A$ and $B$ owing to the detrimental effect of cigarettes on human health, and not merely because $A$ and $B$ are correlated.
B. There exists a causal relationship between $A$ and $B$ since the two variables are correlated.
C. None of the above.
D. There is no causal relationship between $A$ and $B$.

**Answer: A**

Smoking and lung cancer *are* causally linked — but that conclusion comes from decades of separate biological and experimental evidence, not from the correlation alone. Option B commits the correlation-implies-causation fallacy even though its conclusion happens to be true for the wrong reason; option A states the causal link while correctly attributing it to the health mechanism, not to the correlation itself.

---

**P29.** State which of the following statements is/are True.

A. Data analytics is particularly useful for high-dimensional data that cannot be visualized using plots and graphs.
B. In classification, data points have a class label.
C. Data imputation is a function approximation problem.
D. It is possible that the same data is separable using a linear decision boundary and also a non-linear decision boundary.

**Answer: A, B, C, D — all correct**

All four are true: analytics shines exactly where raw visualization fails (high dimensions); labelled points are the definition of classification; imputing a missing value by predicting it from other features is function approximation; and any linearly-separable dataset can trivially also be separated by a (more flexible) non-linear boundary.

---

**P30.** Compute Pearson's correlation coefficient for: $X=\{5.1,4.9,4.7,4.6,5.0\}$, $Y=\{3.5,3.0,3.2,3.1,3.6\}$.

A. $1.00$
B. $0.00$
C. $-0.68$
D. $0.68$

**Answer: D**

$\bar x=4.86,\ \bar y=3.28$. $\sum(x_i-\bar x)(y_i-\bar y)=0.146$, $\sum(x_i-\bar x)^2=0.172$, $\sum(y_i-\bar y)^2=0.268$. $r=0.146/\sqrt{0.172\times0.268}\approx0.68$ — a fairly strong positive correlation.

---

**P31.** An exponential Q-Q plot is generated for a sample that indeed conforms to the exponential distribution. Which inferences are correct?

A. Data points lie only in the first and third quadrants.
B. Points in the Q-Q plot fall along the straight line through the origin with slope 1.
C. Data points lie only in the first quadrant.
D. Points in the Q-Q plot fall along any arbitrary straight line through the origin.

**Answer: B, C**

Both the sample and theoretical exponential quantiles are always $\ge0$, so every point lies in the first quadrant (C true, A false, since there's no negative/third-quadrant region for an exponential support). When the sample genuinely matches the proposed distribution, the plotted points hug the $45°$ reference line through the origin — specifically *slope 1*, not just any line (B true, D false).
