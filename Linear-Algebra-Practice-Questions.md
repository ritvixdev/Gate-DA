# Linear Algebra — Practice Questions (P1–P22)

**P1.** Consider the system: $x+y+z=3$, $2x+2y+2z=6$, $x-y+z=1$. What is the nature of the solution?

A. Unique solution
B. Infinite solutions
C. Inconsistent system
D. No solution

**Answer: B — Infinite solutions**

Equation 2 is just Equation 1 doubled, so it adds no new information — only 2 independent equations remain for 3 unknowns. Solving Eq. 1 and Eq. 3 gives $y=1$ and $x+z=2$, leaving $x$ free, so there are infinitely many solutions.

---

**P2.** A $2\times2$ rotation matrix $A$ rotates every real vector by $45^\circ$ (all entries of $A$ are real). Select the correct option.

A. $A$ can have real eigenvectors, since the characteristic polynomial has real coefficients.
B. $A$ cannot have any real eigenvectors.
C. It is not possible to ascertain whether $A$ can have real eigenvectors.
D. None of the above.

**Answer: B — $A$ cannot have any real eigenvectors.**

For a rotation by $\theta$, the eigenvalues solve $\lambda^2-2\cos\theta\,\lambda+1=0$, giving $\lambda=\cos\theta\pm i\sin\theta$. Since $\theta=45^\circ$ has $\sin\theta\ne0$, the eigenvalues are complex, so no real eigenvectors exist. Real coefficients in the characteristic polynomial do not guarantee real roots.

---

**P3.** Suppose $\lambda$ is an eigenvalue of a square matrix $A$ for some eigenvector $x$. Then, for the matrix $A-\lambda I$,

A. an inverse cannot be defined.
B. an inverse may or may not exist.
C. an inverse certainly exists.
D. an inverse certainly does not exist.

**Answer: D — an inverse certainly does not exist.**

By definition $(A-\lambda I)x=0$ for a non-zero $x$. If $A-\lambda I$ were invertible, multiplying both sides by its inverse would force $x=0$, a contradiction. So $A-\lambda I$ is always singular.

---

**P4.** Select the correct option(s). For an $n\times n$ square matrix $A$,

A. the product of the eigenvalues equals the determinant of $A$.
B. the sum of the eigenvalues equals the trace of $A$.
C. the eigenvalues are the diagonal entries when $A$ is a diagonal matrix.
D. the characteristic polynomial is of degree $n$.

**Answer: A, B, C, D — all correct**

All four are standard identities: $\det(A)=\prod\lambda_i$, $\operatorname{trace}(A)=\sum\lambda_i$, a diagonal matrix's eigenvalues are its diagonal entries, and $\det(A-\lambda I)$ always expands to a degree-$n$ polynomial in $\lambda$.

---

**P5.** Consider the matrix $A=\begin{bmatrix}2&1\\1&2\end{bmatrix}$. Select the correct option(s).

A. The eigenvalues of $A$ are $1$ and $3$.
B. The matrix $A$ is symmetric.
C. $[1,1]$ is an eigenvector of $A$.
D. $[1,-1]$ is an eigenvector of $A$.

**Answer: A, B, C, D — all correct**

$A=A^{\mathsf T}$, so it's symmetric. $\operatorname{trace}(A)=4$, $\det(A)=3\Rightarrow\lambda^2-4\lambda+3=0\Rightarrow\lambda=1,3$. Solving $(A-3I)v=0$ gives $v=[1,1]$; solving $(A-I)v=0$ gives $v=[1,-1]$ — both check out, and being eigenvectors of a symmetric matrix for distinct eigenvalues, they are orthogonal.

---

**P6.** Given non-zero vectors $u,v$, let $w=u+\tfrac13(v-u)$. Let $O$ be the origin, $A,B$ the tips of $u,v$, and $X$ the tip of $w$. Which is True of $\triangle OAB$?

A. $X$ lies inside the triangle.
B. $X$ lies on one of the sides of the triangle.
C. $X$ lies outside the triangle.
D. None of the above.

**Answer: B — $X$ lies on one of the sides of the triangle.**

$w=\tfrac23u+\tfrac13v$, a convex combination ($\alpha+\beta=1$, both $\ge0$) of $u$ and $v$, so $X$ lies exactly on segment $AB$ — one side of the triangle, $1/3$ of the way from $A$ to $B$.

---

**P7.** A vector of ones in $n$ dimensions is $[1,1,\dots,1]$. The length of such a vector is:

A. $\sqrt{n}$
B. $n$
C. $1-1/\sqrt{n}$
D. $1$

**Answer: A — $\sqrt{n}$**

$\lVert\mathbf{1}\rVert=\sqrt{1^2+1^2+\dots+1^2}$ ($n$ terms) $=\sqrt{n}$.

---

**P8.** Three vectors $a,b,c$ have magnitudes $\lVert a\rVert=3$, $\lVert b\rVert=4$, $\lVert c\rVert=5$. Select the correct option.

A. They always form a right-angled triangle, from the lengths alone.
B. They form the sides of a right-angled triangle when $a+b+c=0$.
C. They may or may not form a right-angled triangle when $a+b+c=0$.
D. None of the above.

**Answer: B — They form the sides of a right-angled triangle when $a+b+c=0$.**

If $a+b+c=0$ then $c=-(a+b)$, so $\lVert c\rVert^2=\lVert a\rVert^2+\lVert b\rVert^2+2(a\cdot b)$. Plugging in $25=9+16+2(a\cdot b)$ gives $a\cdot b=0$ — a forced right angle between $a$ and $b$. Without the constraint, the magnitudes alone say nothing about angles.

---

**P9.** Given $A=\begin{bmatrix}1&3\\2&4\end{bmatrix}$. Which statement is correct?

A. $\det(A)=0$, so inverse exists.
B. Matrix is not full rank.
C. $\det(A)\ne0$, so inverse exists.
D. Columns are linearly dependent.

**Answer: C — $\det(A)\ne0$, so inverse exists.**

$\det(A)=(1)(4)-(3)(2)=-2\ne0$, so $A$ is invertible, full rank, and its columns are linearly independent.

---

**P10.** For an underdetermined system ($m<n$), which method is commonly used to obtain the minimum-norm solution?

A. Gaussian elimination only
B. Moore-Penrose pseudo inverse
C. Cramer's rule
D. Gauss-Jordan elimination

**Answer: B — Moore-Penrose pseudo inverse**

When $m<n$, $Ax=b$ typically has infinitely many solutions. The minimum-norm one is $x=A^{+}b=A^{\mathsf T}(AA^{\mathsf T})^{-1}b$, computed via the Moore-Penrose pseudoinverse.

---

**P11.** True or False: If $[a,b]$ is a multiple of $[c,d]$ with $abcd\ne0$, then $[a,c]$ is a multiple of $[b,d]$.

A. Statement is True.
B. Statement is False.

**Answer: A — Statement is True.**

$[a,b]=k[c,d]$ means $a=kc,\,b=kd$, so $ad=bc$. Dividing both sides by $bd$ (all non-zero) gives $a/b=c/d$, exactly the condition for $[a,c]$ to be a multiple of $[b,d]$.

---

**P12.** Select the correct option(s).

A. Zero is not a permitted eigenvalue.
B. The null vector is not a permitted eigenvector.
C. Zero is a permitted eigenvalue.
D. The null vector is a permitted eigenvector.

**Answer: B, C**

Zero is a perfectly valid eigenvalue (it just means the matrix is singular) — C true, A false. But by definition an eigenvector must be non-zero (otherwise $Av=\lambda v$ is trivially true for any $\lambda$ and carries no information) — so the null vector is never a permitted eigenvector: B true, D false.

---

**P13.** $x_0$ is an eigenvector of square matrix $A$ with eigenvalue $\lambda$. Additionally $x_k=\lambda^kx_0,\ k\in\{1,2,3,\dots\}$. Which is true?

A. $x_{k+1}=A^{k-1}x_k,\ k\in\{0,1,2,\dots\}$
B. $x_{k+1}=A^{k+1}x_k,\ k\in\{0,1,2,\dots\}$
C. $x_{k+1}=A^{k}x_k,\ k\in\{0,1,2,\dots\}$
D. $x_{k+1}=Ax_k,\ k\in\{0,1,2,\dots\}$

**Answer: D — $x_{k+1}=Ax_k$**

$Ax_k=A(\lambda^kx_0)=\lambda^k(Ax_0)=\lambda^k(\lambda x_0)=\lambda^{k+1}x_0=x_{k+1}$. So $x_{k+1}=Ax_k$ — each step is just one more multiplication by $A$.

---

**P14.** How many corners does a cube have in $n$ dimensions?

A. $n^n$
B. $n^2$
C. $2^n$
D. $n!$

**Answer: C — $2^n$**

Each of the $n$ coordinates independently takes one of 2 values (e.g. 0 or 1), so the corner count is $2\times2\times\cdots\times2=2^n$.

---

**P15.** $x,y$ are vectors with $x+y=[6,4,6]$ and $x-y=[4,4,10]$. Then,

A. $x=[4,5,8],\ y=[-1,0,2]$
B. $x=[5,4,6],\ y=[2,0,-2]$
C. $x=[5,4,8],\ y=[1,0,-2]$
D. $x=[4,6,8],\ y=[1,1,-2]$

**Answer: C — $x=[5,4,8],\ y=[1,0,-2]$**

$x=\big[(x+y)+(x-y)\big]/2=\big([6,4,6]+[4,4,10]\big)/2=[5,4,8]$. $y=\big[(x+y)-(x-y)\big]/2=\big([6,4,6]-[4,4,10]\big)/2=[1,0,-2]$.

---

**P16.** Select the correct option(s).

A. Any vector in the null space of $A$ is orthogonal to any vector in the column space of $A$.
B. Any vector in the null space of $A$ is orthogonal to any vector in the row space of $A$.
C. Any vector in the null space of $A$ is not orthogonal to any vector in the row space of $A$.
D. Any vector in the null space of $A$ may or may not be orthogonal to any vector in the row space of $A$.

**Answer: B**

$Ax=0$ means $x$ is orthogonal to every row of $A$ (each row dotted with $x$ gives $0$) — hence orthogonal to the entire row space, not the column space (those live in a different space when $A$ is non-square).

---

**P17.** Consider the homogeneous system $Ax=0$. Select the correct option(s).

A. Infinite solutions exist when $A$ is full column rank.
B. When $A$ is square, if a non-zero $x$ exists with $Ax=0$, then $A^{-1}$ also exists.
C. When $A$ is square, if a non-zero $x$ exists with $Ax=0$, then $A^{-1}$ does not exist.
D. Only the trivial solution exists when $A$ is full column rank.

**Answer: C, D**

Full column rank means the columns are independent, so $Ax=0$ forces $x=0$ — only the trivial solution (D true, A false). A non-zero solution to $Ax=0$ means the columns of (square) $A$ are dependent, i.e. $A$ is singular, so $A^{-1}$ cannot exist (C true, B false).

---

**P18.** The eigenvalues of $A=\begin{bmatrix}0&1\\2&1\end{bmatrix}$ are $2$ and $-1$. The eigenvalues of $A^{-1}$ are:

A. $0.5,\ -1$
B. $-0.5,\ 1$
C. $0.25,\ 1$
D. $4,\ 1$

**Answer: A — $0.5,\ -1$**

Eigenvalues of $A^{-1}$ are reciprocals of $A$'s eigenvalues: $1/2=0.5$ and $1/(-1)=-1$.

---

**P19.** Does the system $u+v+w=2,\ u+2v+3w=1,\ v+2w=0$ have a solution?

A. No solutions exist to the system of equations.
B. There exists at least one solution to the system of equations.

**Answer: A — No solutions exist.**

From the 3rd equation $v=-2w$; substituting into the 1st gives $u=2+w$. Substituting both into the 2nd: $(2+w)+2(-2w)+3w=2+0w=2$, but the equation requires this to equal $1$ — a contradiction ($2\ne1$). The system is inconsistent — no solution exists.

---

**P20.** The point $(x_1,x_2,x_3,x_4)=(1,4,6,3)$ is in which half-space of the hyperplane $x_1-9x_2+3x_3+2x_4=8$?

A. On the hyperplane
B. Cannot be determined
C. Negative
D. Positive

**Answer: C — Negative**

Plug into $w^{\mathsf T}x-b$: $1-9(4)+3(6)+2(3)-8=1-36+18+6-8=-19<0$ — the negative half-space.

---

**P21.** The trace of a matrix $A$ can be found by which of the following?

A. None of the above
B. Sum of its eigenvalues
C. Sum of its diagonals
D. Determinant of the matrix

**Answer: B, C**

The trace is, by definition, the sum of the diagonal entries (C) — and it also always equals the sum of the eigenvalues (B), since $\operatorname{trace}(A)=\sum\lambda_i$. It is unrelated to the determinant, which is the *product* of the eigenvalues (D false).

---

**P22.** The product of the roots of the characteristic equation of a square matrix $A$ is equal to:

A. None of the above
B. Rank of $A$
C. $A^{-1}$
D. $|A|$

**Answer: D — $|A|$**

The roots of $\det(A-\lambda I)=0$ are the eigenvalues, and their product always equals $\det(A)=|A|$.
