# Gate TikTok Graph Scrolling and Coverage Design

## Goal

Make every selected graph concept immediately readable without visible scrollbars or competing scroll areas, while proving that the Linear Algebra feed includes every approved lesson point and that the concept graph remains navigable across the subject.

## Approved Layout

Use a responsive split layout:

- On laptop and wide tablet screens, the graph canvas occupies the main column and the selected-concept panel occupies a persistent side column.
- On phones and narrow tablets, the selected-concept panel appears directly below the graph inside one vertically scrollable graph surface.
- The graph surface owns vertical scrolling. The selected-concept panel must not create a second vertical scrollbar.
- All scrollbars remain visually hidden while touch, wheel, trackpad, and keyboard scrolling continue to work.
- Selecting a graph node updates the dialog title and panel content. On mobile, the view smoothly brings the selected-concept panel into view.
- Returning from the graph restores the exact concept and prior concept-sheet scroll position.

## Selected Concept Content

The graph panel continues to show:

- relationship label;
- concept name;
- beginner meaning;
- formula;
- explanation of the connection from the previously selected node;
- `Read this concept`;
- exact `Open full lesson section` link.

The panel must remain readable for long concept names, formulas, and explanations. It must never cover graph nodes.

## Scroll Ownership

- The outer dialog remains fixed to the viewport.
- The graph view has exactly one vertical scrolling owner.
- The graph canvas itself may pan or zoom through its existing controls but must not create a visible browser scrollbar.
- Mobile selected-node content participates in the graph view's normal document flow.
- Desktop selected-node content uses a fixed grid column rather than absolute positioning.
- Scrollbars are hidden with both Firefox and WebKit-compatible rules.
- Overscroll containment prevents graph scrolling from moving the feed behind the dialog.

## Source Coverage

The generated feed remains exhaustive for the nine Linear Algebra topics and excludes Study in Depth entries marked `GATE extra`.

The current required source inventory is:

- 66 basic definitions;
- 287 Study in Depth points;
- 54 GATE cheat-sheet points;
- 31 common traps;
- 37 practice problems;
- 9 inline quizzes;
- 21 GATE questions;
- 505 total cards.

Every source point must have a unique card, topic, guided order, complete detail content, exact lesson file, exact source anchor, source label, and explicitly authored concept links.

## Graph Coverage

- Every canonical concept must have at least one valid typed relationship.
- Every relationship target must resolve to another canonical concept.
- The full concept graph must form one connected component when relationship direction is ignored.
- Required reasoning paths such as determinant to kernel, rank to linear equations, eigenvalue to diagonalization, symmetric matrix to spectral theorem, and SVD to PCA must remain traversable.
- Selecting and repeatedly expanding nodes must not create duplicate nodes or edges.
- Every selected node must link to an exact lesson section.

## Validation

Automated tests will verify:

- responsive graph layout markers and single-scroll ownership;
- hidden scrollbar rules;
- selected-node panel content and lesson actions;
- mobile reveal behavior after node selection;
- exact source counts and total card count;
- one-to-one source-point coverage;
- topic order and source-anchor validity;
- canonical relationship validity;
- full graph connectedness and required paths.

Browser QA will cover phone, tablet, and laptop sizes, including long labels such as Gram-Schmidt and long connected explanations.
