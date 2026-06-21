# Gate TikTok Beginner Learning and Concept Graph Design

**Date:** 2026-06-21  
**Status:** Approved

## Goal

Turn every Linear Algebra basic-definition card into a beginner-friendly learning entry point and replace the current flat “Connect the dots” chip list with an explorable concept graph.

A student who does not understand a term such as vector, matrix, identity matrix, determinant, eigenvalue, or orthogonal matrix must be able to:

1. understand the term in plain language;
2. see its mathematical form;
3. inspect a concrete example and counterexample;
4. understand its important properties and consequences;
5. follow explained connections into other Linear Algebra topics;
6. discover why the concept matters for GATE; and
7. open relevant GATE questions and their reasoning chains.

## Learning model

### Definition card

Each basic-definition card presents five concise elements within the swipe feed:

- **Meaning:** one beginner-friendly explanation without assuming prior knowledge.
- **Mathematical form:** a formula, matrix, vector, or symbolic representation.
- **Example:** one concrete valid example.
- **Immediate consequence:** one useful statement that follows from the definition.
- **GATE signal:** a short indication of how the concept is commonly tested.

The feed card remains concise enough to scan. It does not attempt to contain the full lesson.

### Detailed concept sheet

Tapping a definition card or a linked concept opens a detailed learning sheet containing:

- what the concept means;
- how to recognize it mathematically;
- a valid example;
- a counterexample or non-example;
- important properties;
- direct consequences;
- conditional implications such as “if this is true, then…”;
- common misconceptions and GATE traps;
- explained connections to other concepts;
- relevant formulas;
- linked source lesson sections;
- relevant GATE questions and their explanations.

The content should explain reasoning, not merely list facts.

## Canonical concept data

Each concept record will support:

```js
{
  id,
  label,
  aliases,
  beginnerMeaning,
  definition,
  formula,
  example,
  exampleExplanation,
  counterexample,
  counterexampleExplanation,
  properties,
  consequences,
  gateSignals,
  gateTraps,
  edges,
  questionIds,
  lessonUrl,
  lessonAnchor
}
```

Properties, consequences, signals, and traps are structured records rather than unlabelled prose:

```js
{
  statement,
  explanation,
  formula,
  conceptIds
}
```

This lets the UI show the statement concisely and reveal the reasoning when requested.

## Typed concept graph

The graph is directional and explanation-first. Every edge provides:

```js
{
  targetId,
  type,
  label,
  explanation,
  formula,
  importance
}
```

Supported edge types:

- `prerequisite`: concept needed first;
- `implies`: a consequence follows;
- `equivalent`: two conditions are equivalent under stated assumptions;
- `contrasts`: helps distinguish commonly confused concepts;
- `used-by`: the concept is used by another method;
- `decomposes-into`: a factorization or structural relationship;
- `geometric`: geometric interpretation;
- `gate-pattern`: frequently combined in GATE reasoning.

Edges must state assumptions. For example, “determinant zero implies no inverse” applies to square matrices and must say so.

### Required reasoning chains

The graph must encode important multi-topic chains, including:

```text
det(A) = 0
→ A is singular
→ A inverse does not exist
→ rank(A) < n
→ 0 is an eigenvalue
→ Ax = 0 has a nonzero solution
```

```text
QᵀQ = I
→ columns of Q are orthonormal
→ Q⁻¹ = Qᵀ
→ lengths and angles are preserved
→ rank(Q) is full
→ det(Q) = ±1
→ every singular value is 1
```

```text
A is real symmetric
→ all eigenvalues are real
→ eigenvectors for distinct eigenvalues are orthogonal
→ A has an orthonormal eigenbasis
→ A = QΛQᵀ
→ covariance matrices support PCA
```

```text
nonzero singular values
→ rank
→ effective dimensions
→ low-rank approximation
→ compression
→ PCA variance retention
```

## Graph interaction

### Compact default experience

The concept sheet does not open the graph automatically. Its default layout remains a focused, vertically readable explanation.

After the relevant GATE-question section, the sheet shows one compact **Connect the dots** card containing at most five ranked connections:

1. direct consequences and equivalences;
2. required prerequisite concepts;
3. closely related concepts inside the current topic;
4. useful cross-topic GATE patterns;
5. advanced or application-level connections.

Each row contains the connected concept, its relationship type, and one sentence explaining why the connection matters. Selecting a row opens that concept in the same sheet without displaying the graph.

The source-action area contains two adjacent actions:

- **Open Study in Depth:** opens the authoritative lesson section;
- **Explore graph:** opens the dedicated graph experience.

### Dedicated graph experience

The graph is opt-in and opens only after the student selects **Explore graph**.

The dedicated graph view:

- uses the full available dialog area instead of sharing vertical space with the concept explanation;
- preserves the concept sheet's concept history and scroll position;
- initially shows the selected concept and its highest-ranked direct connections;
- orders and prioritizes visible neighbours from strongest relevance to weakest relevance;
- allows repeated expansion to explore the complete Linear Algebra graph;
- provides a clear control to return to the unchanged concept sheet.

The initial graph view is intentionally limited to prevent overwhelming beginners.

### Recursive exploration

Students can expand any visible node repeatedly until they have explored the complete Linear Algebra graph.

- Expanding a node adds its direct neighbours without removing existing nodes.
- Already visible nodes are reused instead of duplicated.
- The graph records expansion state.
- A breadcrumb/history control restores previous focus states.
- “Reset to concept” returns to the original direct-neighbour view.
- “Show path” highlights the reasoning route between the starting concept and the selected concept.
- Edge selection displays the reason, formula, assumptions, and GATE relevance of that connection.

### Responsive behavior

- **Laptop and tablet landscape:** the dedicated graph uses the complete dialog workspace. Selecting a node or edge opens a side explanation panel.
- **Mobile:** the dedicated graph uses the complete dialog workspace. Selecting a node or edge opens a bottom explanation sheet without destroying graph state.
- The graph supports touch pan, drag, keyboard focus, and zoom controls.
- The user can explore the graph without triggering feed-card swipes.

The first implementation will use a lightweight SVG-based graph renderer with deterministic positioning. It will not add a large graph library or backend.

## GATE-question indexing

Each GATE question receives stable metadata:

```js
{
  conceptIds,
  edgeIds,
  recognitionClues,
  reasoningSteps,
  formulasUsed,
  trap,
  relatedQuestionIds
}
```

Concept sheets show relevant questions grouped by purpose:

- checks the definition;
- tests a direct consequence;
- combines multiple concepts;
- exposes a common trap.

Selecting a question opens its existing interactive question card or explanation while preserving graph state. The explanation highlights the graph reasoning chain used to solve it.

## Definition enrichment strategy

The 66 generated basic-definition cards remain source-backed, but the generator will enrich recognized definitions from canonical concept records.

- Canonical concepts provide the beginner meaning, mathematical example, consequence, and GATE signal.
- Source lesson text remains visible in the detailed sheet and remains the authority.
- Definitions without a dedicated canonical concept receive authored enrichment records rather than generic generated claims.
- No mathematical consequence is inferred automatically from keyword matching.

This avoids inaccurate relationships while making every beginner card useful.

## Accessibility and motion

- Nodes and edges are keyboard reachable and expose meaningful accessible labels.
- The graph has a non-visual relationship list containing the same information.
- Focus remains in the selected graph/dialog context and returns correctly when closed.
- Reduced-motion mode disables animated node movement and sheet transitions.
- Graph colors are supplemented with edge labels and icons; meaning never depends on color alone.

## Validation and testing

Automated validation will verify:

- all 66 definition cards contain meaning, mathematical form, example, consequence, and GATE signal;
- every concept edge has a valid target, supported type, explanation, and importance;
- no duplicate edge IDs or invalid graph references exist;
- required reasoning chains are traversable in the correct direction;
- square-matrix assumptions are present on determinant/invertibility equivalences;
- every linked GATE question exists;
- every GATE question has concepts, reasoning steps, and an explanation;
- recursive expansion does not duplicate nodes;
- path finding returns valid concept routes;
- graph state survives concept-sheet navigation;
- mobile and desktop graph layouts remain usable;
- keyboard operation and reduced-motion behavior remain functional.

## Scope

This phase covers the complete Linear Algebra concept graph and the 66 Linear Algebra basic definitions.

The schema and renderer remain subject-neutral so Probability and Statistics, Optimization, and Machine Learning can reuse them later. Content for those subjects is not part of this implementation.
