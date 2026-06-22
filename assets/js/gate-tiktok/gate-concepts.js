(function (root, factory) {
  var data = factory();
  if (typeof module === "object" && module.exports) module.exports = data;
  root.GateTikTokConcepts = data;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  var lesson = function (slug) { return slug + ".html"; };
  var gateFocusByLesson = {
    "01-vectors.html": "Use this to reason about span, independence, basis, and dimension before doing calculations.",
    "02-matrices.html": "Use this to predict matrix dimensions, transformation behavior, and invertibility.",
    "03-determinants.html": "Use this as a fast test for singularity, volume scaling, and eigenvalue products.",
    "04-rank-nullity.html": "Use this to count independent directions, pivots, free variables, and invisible inputs.",
    "05-linear-equations.html": "Use this to classify systems as inconsistent, unique, or infinitely solvable.",
    "06-eigenvalues.html": "Use this to identify invariant directions and simplify traces, determinants, and matrix powers.",
    "07-diagonalization.html": "Use this to replace repeated matrix operations with independent scalar operations.",
    "08-orthogonality.html": "Use this for projections, least squares, symmetric matrices, and geometry-preserving maps.",
    "09-svd-pca.html": "Use this to reason about rank, compression, maximum variance, and principal directions."
  };
  var C = {};
  function add(id, label, definition, formula, example, lessonUrl, prerequisites, related) {
    C[id] = {
      id: id, label: label, aliases: [label.toLowerCase()], definition: definition,
      formula: formula, example: example, prerequisites: prerequisites || [],
      relatedConcepts: related || [], lessonUrl: lessonUrl,
      lessonAnchor: "study-in-depth",
      lessonSection: "Study in Depth",
      gateFocus: gateFocusByLesson[lessonUrl]
    };
  }

  add("vector", "vector", "An ordered list of numbers that represents a direction, point, or data item.", "\\mathbf v=(v_1,\\dots,v_n)^T", "(3,4) is a vector in R² with length 5.", lesson("01-vectors"), [], ["span", "basis", "matrix"]);
  add("span", "span", "Every vector reachable by scaling and adding a given set of vectors.", "\\operatorname{span}\\{v_i\\}=\\{\\sum c_i v_i\\}", "The span of (1,0) and (0,1) is all of R².", lesson("01-vectors"), ["vector"], ["linear-independence", "basis", "column-space"]);
  add("linear-independence", "linear independence", "A set has no redundant vector; only the all-zero coefficient combination produces zero.", "\\sum c_i v_i=0\\Rightarrow c_i=0", "Three vectors in R² are always dependent.", lesson("01-vectors"), ["span"], ["basis", "rank"]);
  add("basis", "basis", "A smallest non-redundant set that spans a space.", "\\text{basis}=\\text{independent}+\\text{spanning}", "{(1,0),(0,1)} is the standard basis of R².", lesson("01-vectors"), ["span", "linear-independence"], ["dimension", "coordinates"]);
  add("coordinates", "coordinates", "The coefficients that describe a vector relative to an ordered basis.", "v=\\sum_i [v]_B{}_i b_i", "The same geometric vector can have different coordinates in different bases.", lesson("01-vectors"), ["basis"], ["diagonalization"]);
  add("dimension", "dimension", "The number of vectors in any basis of a space.", "\\dim(\\mathbb R^n)=n", "A plane through the origin has dimension 2.", lesson("01-vectors"), ["basis"], ["rank", "nullity"]);
  add("matrix", "matrix", "A rectangular array that represents a linear transformation or system of equations.", "A\\in\\mathbb R^{m\\times n}", "A 2×3 matrix maps R³ into R².", lesson("02-matrices"), ["vector"], ["identity-matrix", "inverse", "linear-transformation"]);
  add("linear-transformation", "linear transformation", "A map that preserves vector addition and scalar multiplication.", "T(au+bv)=aT(u)+bT(v)", "A rotation about the origin is linear.", lesson("02-matrices"), ["vector", "matrix"], ["matrix-multiplication", "kernel"]);
  add("identity-matrix", "identity matrix", "The matrix that leaves every vector unchanged.", "I_nx=x", "AI=IA=A.", lesson("02-matrices"), ["matrix"], ["inverse", "orthogonal-matrix"]);
  add("matrix-multiplication", "matrix multiplication", "Composition of transformations; inner dimensions must match.", "(AB)_{ij}=\\sum_k a_{ik}b_{kj}", "If A is 2×3 and B is 3×4, AB is 2×4.", lesson("02-matrices"), ["matrix"], ["inverse", "determinant"]);
  add("inverse", "inverse matrix", "A matrix that reverses a square matrix transformation.", "AA^{-1}=A^{-1}A=I", "A 2×2 matrix is invertible exactly when its determinant is nonzero.", lesson("02-matrices"), ["identity-matrix", "determinant"], ["linear-equations", "orthogonal-matrix"]);
  add("determinant", "determinant", "A signed area/volume scaling factor for a square matrix.", "\\det(AB)=\\det(A)\\det(B)", "det(A)=0 means the transformation collapses dimension.", lesson("03-determinants"), ["matrix"], ["inverse", "eigenvalue", "rank"]);
  add("singular-matrix", "singular matrix", "A square matrix with no inverse because it collapses at least one direction.", "\\det(A)=0", "Two proportional rows make a matrix singular.", lesson("03-determinants"), ["determinant"], ["rank", "nullity"]);
  add("rank", "rank", "The number of independent output directions retained by a matrix.", "\\operatorname{rank}(A)=\\dim C(A)", "A nonzero 3×3 matrix with all proportional rows has rank 1.", lesson("04-rank-nullity"), ["linear-independence", "matrix"], ["nullity", "linear-equations", "column-space"]);
  add("nullity", "nullity", "The dimension of the set of inputs sent to zero.", "\\operatorname{nullity}(A)=n-\\operatorname{rank}(A)", "A 3×5 rank-2 matrix has nullity 3.", lesson("04-rank-nullity"), ["rank"], ["kernel", "linear-equations"]);
  add("kernel", "null space", "All vectors mapped to zero by a matrix or linear transformation.", "N(A)=\\{x:Ax=0\\}", "A singular square matrix has a nonzero null-space vector.", lesson("04-rank-nullity"), ["linear-transformation"], ["nullity", "orthogonality"]);
  add("column-space", "column space", "Every output that can be formed from the columns of a matrix.", "C(A)=\\{Ax:x\\in\\mathbb R^n\\}", "Ax=b is solvable exactly when b lies in C(A).", lesson("04-rank-nullity"), ["span", "matrix"], ["rank", "linear-equations"]);
  add("linear-equations", "linear equations", "A system written compactly as Ax=b.", "Ax=b", "Consistency is decided by rank(A)=rank([A|b]).", lesson("05-linear-equations"), ["matrix", "rank"], ["inverse", "column-space", "nullity"]);
  add("row-reduction", "row reduction", "Elementary row operations that expose pivots and solve a system without changing its solution set.", "A\\to RREF(A)", "A row [0 0 | 1] proves inconsistency.", lesson("05-linear-equations"), ["linear-equations"], ["rank", "pivot"]);
  add("pivot", "pivot", "A leading nonzero entry in echelon form that identifies a constrained variable or independent direction.", "\\#\\text{pivots}=\\operatorname{rank}(A)", "A free variable corresponds to a non-pivot column.", lesson("05-linear-equations"), ["row-reduction"], ["rank", "nullity"]);
  add("eigenvalue", "eigenvalue", "The scale factor applied to a special direction by a matrix.", "Av=\\lambda v", "For a triangular matrix, eigenvalues are its diagonal entries.", lesson("06-eigenvalues"), ["matrix", "determinant"], ["eigenvector", "diagonalization", "trace"]);
  add("eigenvector", "eigenvector", "A nonzero direction that does not rotate under a matrix transformation.", "Av=\\lambda v,\\ v\\ne0", "The axis of a reflection is an eigenvector with eigenvalue 1.", lesson("06-eigenvalues"), ["eigenvalue"], ["eigenspace", "diagonalization"]);
  add("eigenspace", "eigenspace", "All eigenvectors for one eigenvalue together with zero.", "E_\\lambda=N(A-\\lambda I)", "Its dimension is the geometric multiplicity.", lesson("06-eigenvalues"), ["eigenvector", "kernel"], ["diagonalization"]);
  add("trace", "trace", "The sum of diagonal entries, equal to the sum of eigenvalues with multiplicity.", "\\operatorname{tr}(A)=\\sum_i a_{ii}=\\sum_i\\lambda_i", "A 3×3 matrix with eigenvalues 1,2,4 has trace 7.", lesson("06-eigenvalues"), ["matrix", "eigenvalue"], ["determinant"]);
  add("diagonalization", "diagonalization", "A change of basis that makes a transformation act as independent scalings.", "A=PDP^{-1}", "A is diagonalizable when it has enough independent eigenvectors.", lesson("07-diagonalization"), ["eigenvector", "basis"], ["spectral-theorem", "matrix-power"]);
  add("matrix-power", "matrix powers", "Repeated matrix multiplication, simplified by diagonalization when available.", "A^k=PD^kP^{-1}", "Raise each diagonal eigenvalue in D to the kth power.", lesson("07-diagonalization"), ["diagonalization"], ["eigenvalue"]);
  add("orthogonality", "orthogonality", "Perpendicularity measured by a zero dot product.", "u^Tv=0", "(1,1) is orthogonal to (1,-1).", lesson("08-orthogonality"), ["vector"], ["projection", "orthonormal-basis", "symmetric-matrix"]);
  add("orthonormal-basis", "orthonormal basis", "A basis whose vectors are mutually perpendicular and each have length one.", "Q^TQ=I", "The columns of an orthogonal matrix form an orthonormal basis.", lesson("08-orthogonality"), ["basis", "orthogonality"], ["orthogonal-matrix", "projection"]);
  add("projection", "projection", "The closest-vector shadow of one vector onto a subspace.", "\\operatorname{proj}_u(v)=\\frac{u^Tv}{u^Tu}u", "Projection residuals are orthogonal to the target subspace.", lesson("08-orthogonality"), ["orthogonality"], ["least-squares", "orthogonal-matrix"]);
  add("orthogonal-matrix", "orthogonal matrix", "A square matrix whose columns form an orthonormal basis and preserve lengths.", "Q^TQ=I,\\ Q^{-1}=Q^T", "Rotations and reflections are orthogonal transformations.", lesson("08-orthogonality"), ["identity-matrix", "orthonormal-basis"], ["determinant", "spectral-theorem"]);
  add("symmetric-matrix", "symmetric matrix", "A real square matrix equal to its transpose.", "A^T=A", "Real symmetric matrices have real eigenvalues and orthogonal eigenvectors.", lesson("08-orthogonality"), ["matrix"], ["orthogonality", "spectral-theorem"]);
  add("spectral-theorem", "spectral theorem", "Every real symmetric matrix has an orthonormal eigenbasis.", "A=Q\\Lambda Q^T", "Covariance matrices can be diagonalized by an orthogonal matrix.", lesson("08-orthogonality"), ["symmetric-matrix", "eigenvector"], ["orthogonality", "diagonalization", "pca"]);
  add("least-squares", "least squares", "The best approximate solution minimizing squared residual length.", "\\hat x=(A^TA)^{-1}A^Tb", "At the optimum, the residual is orthogonal to C(A).", lesson("08-orthogonality"), ["projection", "linear-equations"], ["normal-equations"]);
  add("normal-equations", "normal equations", "The equations obtained by forcing the least-squares residual perpendicular to every column.", "A^TA\\hat x=A^Tb", "They convert a rectangular problem into a square system.", lesson("08-orthogonality"), ["least-squares"], ["projection"]);
  add("svd", "singular value decomposition", "A factorization of any matrix into two orthogonal changes of coordinates and nonnegative scalings.", "A=U\\Sigma V^T", "The number of nonzero singular values equals rank(A).", lesson("09-svd-pca"), ["orthogonal-matrix", "rank"], ["pca", "singular-value"]);
  add("singular-value", "singular value", "A nonnegative stretch amount of a matrix.", "\\sigma_i=\\sqrt{\\lambda_i(A^TA)}", "The largest singular value is the maximum stretch of a unit vector.", lesson("09-svd-pca"), ["eigenvalue"], ["svd", "rank"]);
  add("pca", "principal component analysis", "A method that rotates centered data toward directions of maximum variance.", "\\text{PCs}=\\text{eigenvectors of covariance}", "The first PC captures the largest possible variance.", lesson("09-svd-pca"), ["spectral-theorem", "covariance"], ["svd", "covariance"]);
  add("covariance", "covariance matrix", "A symmetric matrix describing how centered features vary together.", "C=\\frac1nX^TX", "Its eigenvectors are principal directions and eigenvalues are variances.", lesson("09-svd-pca"), ["symmetric-matrix"], ["pca", "eigenvalue"]);

  add("real-coordinate-space", "real coordinate space", "The collection of all vectors with a fixed number of real components.", "\\mathbb R^n=\\{(x_1,\\ldots,x_n):x_i\\in\\mathbb R\\}", "$(2,-1,4)\\in\\mathbb R^3$.", lesson("01-vectors"), ["vector"], ["dimension", "vector-space"]);
  add("zero-vector", "zero vector", "The vector whose every component is zero.", "\\mathbf 0=(0,\\ldots,0)", "$(0,0)$ adds no movement to another vector.", lesson("01-vectors"), ["vector"], ["vector-space", "kernel"]);
  add("vector-space", "vector space", "A collection closed under vector addition and scalar multiplication.", "u,v\\in V\\Rightarrow au+bv\\in V", "$\\mathbb R^2$ is a vector space.", lesson("01-vectors"), ["vector", "zero-vector"], ["subspace", "basis"]);
  add("subspace", "subspace", "A smaller vector space contained inside another vector space.", "W\\le V", "A line through the origin is a subspace of $\\mathbb R^2$.", lesson("01-vectors"), ["vector-space"], ["span", "column-space"]);
  add("linear-combination", "linear combination", "A vector formed by scaling and adding other vectors.", "c_1v_1+\\cdots+c_kv_k", "$2(1,0)-3(0,1)=(2,-3)$.", lesson("01-vectors"), ["vector"], ["span", "linear-independence"]);
  add("square-matrix", "square matrix", "A matrix with the same number of rows and columns.", "A\\in\\mathbb R^{n\\times n}", "$\\begin{bmatrix}1&2\\\\3&4\\end{bmatrix}$ is square.", lesson("02-matrices"), ["matrix"], ["determinant", "inverse", "eigenvalue"]);
  add("diagonal-matrix", "diagonal matrix", "A square matrix whose off-diagonal entries are zero.", "D_{ij}=0\\text{ for }i\\ne j", "$\\operatorname{diag}(2,-1)$ scales coordinate axes independently.", lesson("02-matrices"), ["square-matrix"], ["diagonalization", "matrix-power"]);
  add("transpose", "transpose", "The operation that swaps rows and columns.", "(A^T)_{ij}=A_{ji}", "$[1\\ 2]^T=\\begin{bmatrix}1\\\\2\\end{bmatrix}$.", lesson("02-matrices"), ["matrix"], ["symmetric-matrix", "orthogonal-matrix"]);
  add("minor", "minor", "The determinant left after deleting one row and one column.", "M_{ij}=\\det(A\\text{ without row }i\\text{ and column }j)", "For a $2\\times2$ matrix, $M_{11}=a_{22}$.", lesson("03-determinants"), ["determinant"], ["cofactor"]);
  add("cofactor", "cofactor", "A signed minor used in determinant expansion.", "C_{ij}=(-1)^{i+j}M_{ij}", "$C_{12}=-M_{12}$.", lesson("03-determinants"), ["minor"], ["cofactor-expansion", "adjugate"]);
  add("cofactor-expansion", "cofactor expansion", "A determinant calculation using one row or column of entries and cofactors.", "\\det(A)=\\sum_j a_{ij}C_{ij}", "Expanding along a row with many zeros saves work.", lesson("03-determinants"), ["cofactor"], ["determinant"]);
  add("adjugate", "adjugate", "The transpose of the cofactor matrix.", "\\operatorname{adj}(A)=C^T", "$A^{-1}=\\operatorname{adj}(A)/\\det(A)$ when $\\det(A)\\ne0$.", lesson("03-determinants"), ["cofactor"], ["inverse"]);
  add("row-echelon-form", "row-echelon form", "A staircase form that reveals pivots and free variables.", "\\operatorname{REF}(A)", "$\\begin{bmatrix}1&2\\\\0&1\\end{bmatrix}$ is in echelon form.", lesson("04-rank-nullity"), ["row-reduction"], ["pivot", "rank"]);
  add("full-rank", "full rank", "A matrix whose rank is as large as its dimensions allow.", "\\operatorname{rank}(A)=\\min(m,n)", "A full-rank square matrix is invertible.", lesson("04-rank-nullity"), ["rank"], ["inverse", "linear-equations"]);
  add("free-variable", "free variable", "A variable without a pivot that can be chosen freely.", "\\#\\text{free variables}=n-\\operatorname{rank}(A)", "One free variable produces a one-parameter solution family.", lesson("04-rank-nullity"), ["pivot", "nullity"], ["linear-equations"]);
  add("augmented-matrix", "augmented matrix", "A compact matrix containing both coefficients and the right-hand side.", "[A\\mid b]", "$[1\\ 2\\mid3]$ represents $x+2y=3$.", lesson("05-linear-equations"), ["linear-equations"], ["gaussian-elimination", "consistent-system"]);
  add("gaussian-elimination", "Gaussian elimination", "Row operations used to solve a system and expose its structure.", "[A\\mid b]\\to\\text{echelon form}", "Eliminate entries below each pivot.", lesson("05-linear-equations"), ["augmented-matrix"], ["row-echelon-form", "solution-count"]);
  add("consistent-system", "consistent system", "A system that has at least one solution.", "\\operatorname{rank}(A)=\\operatorname{rank}([A\\mid b])", "$x+y=2$ is consistent.", lesson("05-linear-equations"), ["linear-equations"], ["column-space", "solution-count"]);
  add("solution-count", "unique or infinite solutions", "A consistent system is unique without free variables and infinite with at least one free variable.", "\\text{unique}\\Leftrightarrow\\operatorname{nullity}(A)=0", "A consistent system with one free variable has infinitely many solutions.", lesson("05-linear-equations"), ["consistent-system", "free-variable"], ["rank", "nullity"]);
  add("homogeneous-system", "homogeneous system", "A linear system with zero right-hand side.", "Ax=0", "It always has the trivial solution $x=0$.", lesson("05-linear-equations"), ["linear-equations", "zero-vector"], ["kernel", "singular-matrix"]);
  add("characteristic-equation", "characteristic equation", "The equation used to find matrix eigenvalues.", "\\det(A-\\lambda I)=0", "Solving it for a $2\\times2$ matrix gives two roots counting multiplicity.", lesson("06-eigenvalues"), ["determinant", "identity-matrix"], ["eigenvalue", "characteristic-polynomial"]);
  add("characteristic-polynomial", "characteristic polynomial", "The polynomial whose roots are the eigenvalues.", "p_A(\\lambda)=\\det(A-\\lambda I)", "For a triangular matrix it is the product of diagonal terms minus $\\lambda$.", lesson("06-eigenvalues"), ["characteristic-equation"], ["spectrum", "multiplicity"]);
  add("multiplicity", "algebraic and geometric multiplicity", "Algebraic multiplicity counts a root; geometric multiplicity counts independent eigenvectors for it.", "1\\le GM(\\lambda)\\le AM(\\lambda)", "A repeated eigenvalue can have one or several independent eigenvectors.", lesson("06-eigenvalues"), ["eigenvalue", "eigenspace"], ["diagonalizable", "defective-matrix"]);
  add("spectrum", "spectrum", "The collection of all eigenvalues of a matrix.", "\\sigma(A)=\\{\\lambda:\\det(A-\\lambda I)=0\\}", "A diagonal matrix has its diagonal entries as its spectrum.", lesson("06-eigenvalues"), ["eigenvalue"], ["trace", "determinant"]);
  add("diagonalizable", "diagonalizable matrix", "A matrix with enough independent eigenvectors to form a basis.", "A=PDP^{-1}", "A matrix with $n$ distinct eigenvalues is diagonalizable.", lesson("07-diagonalization"), ["eigenvector", "basis"], ["diagonalization", "eigenbasis"]);
  add("eigenbasis", "eigenbasis", "A basis made entirely of eigenvectors.", "P=[v_1\\ \\cdots\\ v_n]", "Coordinates in an eigenbasis make the matrix diagonal.", lesson("07-diagonalization"), ["basis", "eigenvector"], ["diagonalizable"]);
  add("similar-matrices", "similar matrices", "Matrices representing the same transformation in different bases.", "B=P^{-1}AP", "Similar matrices share eigenvalues, trace, and determinant.", lesson("07-diagonalization"), ["coordinates", "inverse"], ["diagonalization", "spectrum"]);
  add("defective-matrix", "defective matrix", "A matrix lacking enough independent eigenvectors to diagonalize.", "\\sum GM(\\lambda)<n", "A $2\\times2$ Jordan block with one eigenvector is defective.", lesson("07-diagonalization"), ["multiplicity"], ["diagonalizable"]);
  add("orthogonal-diagonalization", "orthogonal diagonalization", "Diagonalization using an orthogonal eigenvector matrix.", "A=Q\\Lambda Q^T", "Every real symmetric matrix can be orthogonally diagonalized.", lesson("07-diagonalization"), ["orthogonal-matrix", "symmetric-matrix"], ["spectral-theorem"]);
  add("dot-product", "dot product", "A number measuring directional alignment between two vectors.", "u^Tv=\\sum_i u_iv_i", "$(1,2)^T(3,4)=11$.", lesson("08-orthogonality"), ["vector"], ["angle", "orthogonality"]);
  add("norm", "norm", "The length of a vector.", "\\lVert v\\rVert_2=\\sqrt{v^Tv}", "$(3,4)$ has norm $5$.", lesson("08-orthogonality"), ["dot-product"], ["angle", "orthogonal-matrix"]);
  add("angle", "angle between vectors", "The amount of directional separation between nonzero vectors.", "\\cos\\theta=\\frac{u^Tv}{\\lVert u\\rVert\\lVert v\\rVert}", "A zero dot product gives a $90^\\circ$ angle.", lesson("08-orthogonality"), ["dot-product", "norm"], ["orthogonality"]);
  add("orthogonal-set", "orthogonal set", "A set whose distinct vectors have zero pairwise dot products.", "v_i^Tv_j=0\\ (i\\ne j)", "$(1,1)$ and $(1,-1)$ form an orthogonal set.", lesson("08-orthogonality"), ["orthogonality"], ["orthonormal-basis", "gram-schmidt"]);
  add("gram-schmidt", "Gram–Schmidt", "A process that converts independent vectors into an orthonormal basis for the same span.", "q_k=\\frac{v_k-\\sum_{j<k}(q_j^Tv_k)q_j}{\\lVert\\cdot\\rVert}", "Subtract projections before normalizing.", lesson("08-orthogonality"), ["projection", "linear-independence"], ["orthonormal-basis"]);
  add("svd-factors", "SVD factors U and V", "Orthogonal matrices whose columns are left and right singular vectors.", "A=U\\Sigma V^T", "$V$ chooses input directions and $U$ chooses output directions.", lesson("09-svd-pca"), ["svd", "orthogonal-matrix"], ["singular-value"]);
  add("rank-k-approximation", "rank-k approximation", "The best rank-k approximation obtained by retaining the largest singular values.", "A_k=U_k\\Sigma_kV_k^T", "Keeping only $\\sigma_1$ gives the best rank-1 approximation.", lesson("09-svd-pca"), ["svd", "singular-value"], ["dimensionality-reduction", "pca"]);
  add("principal-component", "principal component", "A unit direction along which centered data has maximum remaining variance.", "u_1=\\arg\\max_{\\lVert u\\rVert=1}u^TCu", "The first component is the top covariance eigenvector.", lesson("09-svd-pca"), ["pca", "covariance"], ["spectral-theorem"]);
  add("dimensionality-reduction", "dimensionality reduction", "Representing data with fewer coordinates while preserving important structure.", "z=U_k^Tx", "PCA keeps directions with the largest variances.", lesson("09-svd-pca"), ["rank-k-approximation", "pca"], ["principal-component"]);

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
  function defaultCounterexample(concept) {
    return "An object that fails the defining condition is not a " + concept.label + ".";
  }
  Object.keys(C).forEach(function (id) {
    var concept = C[id];
    concept.beginnerMeaning = concept.definition;
    concept.exampleExplanation = "This example satisfies the defining formula, so it is a concrete instance of " + concept.label + ".";
    concept.counterexample = defaultCounterexample(concept);
    concept.counterexampleExplanation = "Check the defining condition directly; one failed condition is enough to reject it.";
    concept.properties = [consequence("Recognition rule", concept.definition, concept.formula, [id])];
    concept.consequences = [consequence("Use the defining equation", "Translate the words into the formula before calculating.", concept.formula, concept.relatedConcepts.slice(0, 2))];
    concept.gateSignals = [consequence("Look for the defining condition", concept.gateFocus, concept.formula, concept.relatedConcepts.slice(0, 2))];
    concept.gateTraps = [consequence("Do not use the name alone", "Verify every assumption and defining condition before applying a shortcut.", "", [])];
    concept.questionIds = [];
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

  var rich = {
    vector: {
      beginnerMeaning: "A vector is an ordered list of numbers. You can read it as a movement, a point, or one data record.",
      exampleExplanation: "$(3,4)$ means move 3 units horizontally and 4 vertically; its arrow has length 5.",
      counterexample: "The unordered set $\\{3,4\\}$ is not the same vector representation because component order matters.",
      counterexampleExplanation: "$(3,4)$ and $(4,3)$ point in different directions.",
      consequences: [consequence("Components determine direction and size", "Changing one component changes the represented movement or data item.", "\\mathbf v=(v_1,\\ldots,v_n)^T", ["coordinates", "norm"])]
    },
    span: {
      beginnerMeaning: "The span is every vector you can reach by scaling and adding the given vectors.",
      exampleExplanation: "Any $(x,y)$ equals $x(1,0)+y(0,1)$, so the two standard vectors reach the whole plane.",
      counterexample: "$(0,1)$ is not in the span of $(1,0)$ alone.",
      counterexampleExplanation: "Scaling $(1,0)$ can change only the first component; it can never create a vertical component.",
      consequences: [consequence("Span decides reachability", "A target belongs to the span exactly when its coefficients can be solved.", "c_1v_1+\\cdots+c_kv_k=b", ["linear-equations", "column-space"])]
    },
    basis: {
      beginnerMeaning: "A basis is a smallest non-redundant set of directions that can build every vector in the space.",
      exampleExplanation: "$(1,0)$ and $(0,1)$ are independent and together reach every point in $\\mathbb R^2$.",
      counterexample: "$\\{(1,0),(2,0)\\}$ is not a basis of $\\mathbb R^2$.",
      counterexampleExplanation: "The vectors are redundant and cannot create any vertical direction.",
      consequences: [consequence("Coordinates become unique", "Every vector has exactly one coefficient list relative to a basis.", "v=\\sum_i c_i b_i", ["coordinates", "dimension"])]
    },
    matrix: {
      beginnerMeaning: "A matrix is a rule that takes an input vector and produces an output vector by combining its components.",
      exampleExplanation: "$\\begin{bmatrix}2&0\\\\0&1\\end{bmatrix}(x,y)^T=(2x,y)^T$, so it stretches only horizontally.",
      counterexample: "A random table of labels is not being used as a matrix transformation until its entries act numerically on vectors.",
      counterexampleExplanation: "In Linear Algebra, the row and column positions determine how inputs are combined.",
      consequences: [consequence("Its shape determines input and output sizes", "An $m\\times n$ matrix accepts n-component inputs and returns m-component outputs.", "A:\\mathbb R^n\\to\\mathbb R^m", ["linear-transformation", "matrix-multiplication"])]
    },
    inverse: {
      beginnerMeaning: "An inverse matrix undoes the effect of a square matrix.",
      exampleExplanation: "If $A$ doubles every vector, $A^{-1}$ halves it and restores the original input.",
      counterexample: "$\\begin{bmatrix}1&1\\\\2&2\\end{bmatrix}$ has no inverse.",
      counterexampleExplanation: "Its rows are dependent and its determinant is zero, so it collapses information.",
      consequences: [consequence("A unique solution follows", "If A is invertible, multiplying $Ax=b$ by $A^{-1}$ gives one solution.", "x=A^{-1}b", ["linear-equations", "full-rank"])]
    },
    "singular-matrix": {
      beginnerMeaning: "A singular square matrix loses at least one direction, so its action cannot be reversed.",
      exampleExplanation: "Two proportional rows make different inputs collapse to the same output.",
      counterexample: "$I_n$ is not singular.",
      counterexampleExplanation: "Identity preserves every direction, has full rank, and determinant one.",
      consequences: [consequence("Several facts become equivalent", "For a square matrix: zero determinant, no inverse, rank below n, zero eigenvalue, and a nontrivial null space describe the same loss of information.", "\\det(A)=0", ["determinant", "inverse", "rank", "eigenvalue", "kernel"])]
    },
    rank: {
      beginnerMeaning: "Rank counts how many independent output directions a matrix keeps.",
      exampleExplanation: "A matrix with all rows proportional can produce only one independent direction, so its rank is one.",
      counterexample: "The number of nonzero entries is not the rank.",
      counterexampleExplanation: "Many nonzero entries can still be combinations of the same direction.",
      consequences: [consequence("Rank controls solution structure", "Comparing rank with the number of variables and the augmented rank tells whether solutions are unique, infinite, or absent.", "\\operatorname{rank}(A)", ["nullity", "linear-equations"])]
    },
    projection: {
      beginnerMeaning: "A projection drops a vector onto the closest point in a chosen line or subspace.",
      exampleExplanation: "Projecting $(3,4)$ onto the x-axis gives $(3,0)$.",
      counterexample: "The vector $(3,1)$ is not the orthogonal projection of $(3,4)$ onto the x-axis.",
      counterexampleExplanation: "A projected vector must lie in the target subspace; the x-axis requires second component zero.",
      consequences: [consequence("The leftover error is perpendicular", "The residual from a vector to its projection is orthogonal to the target subspace.", "v-\\operatorname{proj}_W(v)\\perp W", ["orthogonality", "least-squares"])]
    },
    "identity-matrix": {
      beginnerMeaning: "The identity matrix is the matrix version of multiplying by 1: it leaves every vector unchanged.",
      exampleExplanation: "$I_2(3,-1)^T=(3,-1)^T$, so the input leaves unchanged.",
      counterexample: "$\\begin{bmatrix}1&0\\\\0&2\\end{bmatrix}$ is not identity.",
      counterexampleExplanation: "It doubles the second component instead of preserving it.",
      consequences: [consequence("It is its own inverse", "Applying identity twice still changes nothing.", "I^{-1}=I", ["inverse"]), consequence("It anchors inverse equations", "A matrix inverse must multiply with the matrix to produce identity.", "AA^{-1}=I", ["inverse"])]
    },
    determinant: {
      beginnerMeaning: "The determinant tells how a square matrix scales signed area or volume and whether it collapses a dimension.",
      exampleExplanation: "$\\det\\begin{bmatrix}2&0\\\\0&3\\end{bmatrix}=6$, so areas scale by a factor of 6.",
      counterexample: "A determinant is not defined for a non-square $2\\times3$ matrix.",
      counterexampleExplanation: "The standard determinant requires equal input and output dimensions.",
      consequences: [consequence("Zero means collapse", "At least one direction is lost, so the transformation cannot be reversed.", "\\det(A)=0", ["singular-matrix", "inverse", "rank"]), consequence("Product of eigenvalues", "Counting multiplicity, determinant combines all eigenvalue scaling factors.", "\\det(A)=\\prod_i\\lambda_i", ["eigenvalue"])]
    },
    "orthogonal-matrix": {
      beginnerMeaning: "An orthogonal matrix rotates or reflects space without changing lengths or angles.",
      exampleExplanation: "$Q=\\begin{bmatrix}0&-1\\\\1&0\\end{bmatrix}$ rotates every vector by $90^\\circ$.",
      counterexample: "$\\begin{bmatrix}2&0\\\\0&1\\end{bmatrix}$ is not orthogonal.",
      counterexampleExplanation: "It stretches horizontal lengths by 2, so $Q^TQ\\ne I$.",
      properties: [consequence("Columns are orthonormal", "Each column has length one and distinct columns are perpendicular.", "Q^TQ=I", ["orthonormal-basis"]), consequence("Transpose is inverse", "Undoing a rotation or reflection is obtained by transposing.", "Q^{-1}=Q^T", ["inverse"])],
      consequences: [consequence("Lengths and angles are preserved", "Dot products remain unchanged after applying Q.", "(Qu)^T(Qv)=u^Tv", ["norm", "angle"]), consequence("All singular values equal one", "No direction is stretched or compressed.", "\\sigma_i(Q)=1", ["singular-value", "svd"])]
    },
    "symmetric-matrix": {
      beginnerMeaning: "A symmetric matrix mirrors across its main diagonal.",
      exampleExplanation: "$\\begin{bmatrix}2&1\\\\1&3\\end{bmatrix}$ equals its transpose.",
      counterexample: "$\\begin{bmatrix}0&1\\\\2&0\\end{bmatrix}$ is not symmetric.",
      counterexampleExplanation: "The off-diagonal entries do not match.",
      consequences: [consequence("Eigenvalues are real", "Complex eigenvalues are unnecessary for real symmetric matrices.", "A^T=A\\Rightarrow\\lambda_i\\in\\mathbb R", ["eigenvalue"]), consequence("Orthogonal eigenvectors exist", "An orthonormal eigenbasis diagonalizes the matrix.", "A=Q\\Lambda Q^T", ["spectral-theorem", "pca"])]
    },
    eigenvalue: {
      beginnerMeaning: "An eigenvalue is the stretch factor applied to a special direction that the matrix does not turn away from itself.",
      exampleExplanation: "For $A=\\operatorname{diag}(2,3)$, the x-axis direction has eigenvalue 2.",
      counterexample: "A scale factor computed from an arbitrary vector is not necessarily an eigenvalue.",
      counterexampleExplanation: "The output must remain parallel to the same nonzero input vector.",
      consequences: [consequence("Zero eigenvalue means singular", "A nonzero eigenvector is sent to zero, so information is lost.", "Av=0,\\ v\\ne0", ["singular-matrix", "kernel"]), consequence("Trace and determinant summarize eigenvalues", "Trace adds them and determinant multiplies them.", "\\operatorname{tr}(A)=\\sum\\lambda_i,\\ \\det(A)=\\prod\\lambda_i", ["trace", "determinant"])]
    },
    svd: {
      beginnerMeaning: "SVD describes any matrix as rotate, stretch along perpendicular axes, then rotate again.",
      exampleExplanation: "The diagonal entries of $\\Sigma$ state how strongly each special input direction is stretched.",
      counterexample: "SVD is not restricted to square or diagonalizable matrices.",
      counterexampleExplanation: "Every real rectangular matrix has an SVD.",
      consequences: [consequence("Nonzero singular values count rank", "Each nonzero stretch preserves one independent direction.", "\\operatorname{rank}(A)=\\#\\{\\sigma_i>0\\}", ["rank"]), consequence("Truncation gives best low-rank approximation", "Keeping the largest stretches preserves the most matrix energy.", "A_k=U_k\\Sigma_kV_k^T", ["rank-k-approximation", "pca"])]
    },
    pca: {
      beginnerMeaning: "PCA rotates centered data to directions that capture the most variance first.",
      exampleExplanation: "For points lying near a diagonal line, the first principal component follows that line.",
      counterexample: "Running covariance PCA on uncentered data can make the mean dominate the result.",
      counterexampleExplanation: "PCA variance directions are defined around the data mean.",
      consequences: [consequence("Covariance eigenvectors give directions", "The largest eigenvalue identifies the direction with maximum variance.", "Cu_i=\\lambda_i u_i", ["covariance", "eigenvalue"]), consequence("Top components reduce dimension", "Keeping the largest variances discards lower-variance directions.", "z=U_k^Tx", ["dimensionality-reduction"])]
    }
  };
  Object.keys(rich).forEach(function (id) { Object.assign(C[id], rich[id]); });
  C.covariance.lessonAnchor = "study-item-22";
  C.covariance.lessonSection = "Covariance matrix properties";

  function addExplicitEdge(sourceId, targetId, type, label, explanation, importance, formula, assumptions) {
    C[sourceId].edges = C[sourceId].edges.filter(function (item) { return item.targetId !== targetId; });
    C[sourceId].edges.push(edge(sourceId, targetId, type, label, explanation, importance, formula, assumptions));
    if (C[sourceId].relatedConcepts.indexOf(targetId) === -1) C[sourceId].relatedConcepts.push(targetId);
  }
  addExplicitEdge("determinant", "singular-matrix", "equivalent", "Zero determinant means singular", "For a square matrix, determinant zero means at least one dimension collapses.", "core", "\\det(A)=0\\Leftrightarrow A\\text{ singular}", "A must be square.");
  addExplicitEdge("singular-matrix", "inverse", "contrasts", "Singular means no inverse", "A singular square matrix cannot be undone because different inputs can produce the same output.", "core", "\\det(A)=0\\Rightarrow A^{-1}\\text{ does not exist}", "A must be square.");
  addExplicitEdge("singular-matrix", "rank", "implies", "Rank drops below n", "A singular $n\\times n$ matrix loses at least one independent output direction.", "core", "\\operatorname{rank}(A)<n", "A is n by n.");
  addExplicitEdge("singular-matrix", "eigenvalue", "equivalent", "Zero is an eigenvalue", "Some nonzero direction is mapped to zero.", "core", "Av=0=0v", "A must be square.");
  addExplicitEdge("singular-matrix", "kernel", "implies", "Nontrivial null space", "A lost direction appears as a nonzero solution of Ax=0.", "core", "\\exists x\\ne0:Ax=0", "A must be square.");
  addExplicitEdge("orthogonal-matrix", "singular-value", "implies", "Every singular value is one", "Orthogonal matrices preserve every length, so no direction is stretched or compressed.", "core", "\\sigma_i(Q)=1");
  addExplicitEdge("symmetric-matrix", "spectral-theorem", "implies", "Orthonormal eigenbasis", "Real symmetry guarantees real eigenvalues and enough orthonormal eigenvectors.", "core", "A=Q\\Lambda Q^T");
  addExplicitEdge("symmetric-matrix", "pca", "used-by", "Covariance enables PCA", "Covariance is symmetric, so its orthonormal eigenvectors can be used as principal directions.", "core", "Cu_i=\\lambda_i u_i");
  addExplicitEdge("svd", "rank-k-approximation", "used-by", "Truncate SVD", "Keeping the k largest singular values produces the best rank-k approximation.", "core", "A_k=U_k\\Sigma_kV_k^T");

  Object.keys(C).forEach(function (id) {
    if (rich[id] || !C[id].edges.length) return;
    var connection = C[id].edges.find(function (item) { return item.importance === "core"; }) || C[id].edges[0];
    C[id].consequences = [consequence(
      connection.label,
      connection.explanation,
      connection.formula,
      [connection.targetId]
    )];
  });

  return C;
});
