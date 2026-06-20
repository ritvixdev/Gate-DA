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

  return C;
});
