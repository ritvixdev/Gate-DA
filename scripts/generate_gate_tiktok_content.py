"""Generate exhaustive Linear Algebra Gate TikTok cards from the lesson HTML.

Uses only Python's standard library. Run from the repository root:
    python scripts/generate_gate_tiktok_content.py
"""

from __future__ import annotations

from dataclasses import dataclass, field
from html import escape
from html.parser import HTMLParser
import json
from pathlib import Path
import re


import sys

ROOT = Path(__file__).resolve().parents[1]
VOID_TAGS = {"br", "hr", "img", "input", "meta", "link", "source", "area", "base", "embed", "param", "track", "wbr"}

SUBJECT_CONFIGS = {
    "linear-algebra": {
        "prefix": "la",
        "output_var": "GateTikTokSourceData",
        "output_file": "gate-tiktok-source-data.js",
        "topics": [
            ("vectors", "01-vectors"),
            ("matrices", "02-matrices"),
            ("determinants", "03-determinants"),
            ("rank-nullity", "04-rank-nullity"),
            ("linear-equations", "05-linear-equations"),
            ("eigenvalues", "06-eigenvalues"),
            ("diagonalization", "07-diagonalization"),
            ("orthogonality", "08-orthogonality"),
            ("svd-pca", "09-svd-pca"),
        ],
        "topic_concepts": {
            "vectors": ["vector", "span", "linear-independence", "basis", "dimension", "coordinates"],
            "matrices": ["matrix", "linear-transformation", "identity-matrix", "matrix-multiplication", "inverse"],
            "determinants": ["determinant", "singular-matrix", "inverse", "rank"],
            "rank-nullity": ["rank", "nullity", "kernel", "column-space", "pivot"],
            "linear-equations": ["linear-equations", "row-reduction", "rank", "nullity", "column-space"],
            "eigenvalues": ["eigenvalue", "eigenvector", "eigenspace", "trace", "determinant"],
            "diagonalization": ["diagonalization", "matrix-power", "eigenvalue", "eigenvector", "basis"],
            "orthogonality": ["orthogonality", "orthonormal-basis", "projection", "orthogonal-matrix", "least-squares"],
            "svd-pca": ["svd", "singular-value", "pca", "covariance", "rank"],
        },
        "gate_rules": [
            (("pca", "singular", "covariance"), "svd-pca"),
            (("projection", "orthogonal", "basis"), "orthogonality"),
            (("solution", "equation", "gaussian"), "linear-equations"),
            (("rank",), "rank-nullity"),
            (("determinant",), "determinants"),
            (("matrix power",), "diagonalization"),
            (("eigen",), "eigenvalues"),
            (("subspace",), "vectors"),
        ],
        "default_gate_topic": "matrices",
    },
    "probability-statistics": {
        "prefix": "ps",
        "output_var": "GateTikTokSourceData",
        "output_file": "probability-tiktok-source-data.js",
        "topics": [
            ("intro-probability", "01-intro-probability"),
            ("conditional-bayes", "02-conditional-bayes"),
            ("random-variables", "03-random-variables"),
            ("pmf-pdf", "04-pmf-pdf"),
            ("joint-covariance", "05-joint-covariance"),
            ("descriptive-stats", "06-descriptive-stats"),
            ("clt", "07-clt"),
            ("z-t-tests", "08-z-t-tests"),
            ("chi-f-tests", "09-chi-f-tests"),
        ],
        "topic_concepts": {
            "intro-probability": ["sample-space", "event", "probability", "mutually-exclusive", "independent-events"],
            "conditional-bayes": ["conditional-probability", "multiplication-rule", "law-of-total-probability", "bayes-theorem"],
            "random-variables": ["random-variable", "discrete-rv", "continuous-rv", "cdf", "expectation", "variance"],
            "pmf-pdf": ["pmf", "pdf", "binomial", "poisson", "uniform", "exponential", "normal"],
            "joint-covariance": ["joint-distribution", "marginal-distribution", "conditional-distribution", "covariance", "correlation", "independence"],
            "descriptive-stats": ["mean", "median", "mode", "variance", "standard-deviation", "percentile"],
            "clt": ["sample-mean", "law-of-large-numbers", "central-limit-theorem", "standard-error"],
            "z-t-tests": ["hypothesis-testing", "null-hypothesis", "p-value", "z-test", "t-test", "type-i-error", "type-ii-error"],
            "chi-f-tests": ["chi-square-distribution", "f-distribution", "goodness-of-fit", "test-of-independence", "anova"],
        },
        "gate_rules": [
            (("chi", "f-test", "anova"), "chi-f-tests"),
            (("hypothesis", "p-value", "z-test", "t-test", "type"), "z-t-tests"),
            (("clt", "limit", "sample mean"), "clt"),
            (("median", "mode", "descriptive"), "descriptive-stats"),
            (("covariance", "correlation", "joint", "marginal"), "joint-covariance"),
            (("poisson", "binomial", "exponential", "uniform", "normal", "pmf", "pdf"), "pmf-pdf"),
            (("random variable", "expectation", "variance", "cdf"), "random-variables"),
            (("bayes", "conditional", "total probability"), "conditional-bayes"),
        ],
        "default_gate_topic": "intro-probability",
    },
    "machine-learning": {
        "prefix": "ml",
        "output_var": "GateTikTokSourceData",
        "output_file": "machine-learning-tiktok-source-data.js",
        "topics": [
            ("linear-regression", "01-linear-regression"),
            ("least-squares", "02-least-squares"),
            ("knn", "03-knn"),
            ("logistic-regression", "04-logistic-regression"),
            ("kmeans", "05-kmeans"),
            ("cross-validation", "06-cross-validation"),
        ],
        "topic_concepts": {
            "linear-regression": ["linear-model", "gradient-descent", "learning-rate", "mean-squared-error", "r-squared"],
            "least-squares": ["least-squares", "normal-equation", "residual", "ridge-regression", "lasso"],
            "knn": ["k-nearest-neighbors", "euclidean-distance", "manhattan-distance", "curse-of-dimensionality"],
            "logistic-regression": ["logistic-regression", "sigmoid-function", "cross-entropy-loss", "maximum-likelihood", "linear-separability"],
            "kmeans": ["k-means", "centroid", "inertia", "lloyds-algorithm"],
            "cross-validation": ["cross-validation", "overfitting", "underfitting", "bias-variance-tradeoff", "confusion-matrix", "precision", "recall", "f1-score", "accuracy"],
        },
        "concept_aliases": {
            "linear-model": ["feature", "predictor", "simple vs multiple", "coefficient", "weight", "prediction"],
            "gradient-descent": ["gradient descent"],
            "learning-rate": ["learning rate"],
            "mean-squared-error": ["mean squared error", "mse", "cost function"],
            "r-squared": ["r squared", "goodness of fit"],
            "least-squares": ["least squares", "ordinary least squares", "ols", "sse", "rss"],
            "normal-equation": ["normal equation", "normal equations", "design matrix", "closed form"],
            "residual": ["residual"],
            "ridge-regression": ["ridge", "l2 regularization", "regularization"],
            "lasso": ["lasso", "l1 regularization"],
            "k-nearest-neighbors": ["knn", "nearest neighbor", "lazy learner", "decision boundary", "bias variance with k"],
            "euclidean-distance": ["euclidean", "distance metric", "feature scaling"],
            "manhattan-distance": ["manhattan"],
            "curse-of-dimensionality": ["curse of dimensionality"],
            "logistic-regression": ["logistic regression", "linear score", "logit", "predicted probability", "odds", "threshold", "decision boundary"],
            "sigmoid-function": ["sigmoid"],
            "cross-entropy-loss": ["cross entropy", "log loss"],
            "maximum-likelihood": ["maximum likelihood"],
            "linear-separability": ["linear separability"],
            "k-means": ["k means", "cluster", "assignment step", "update step", "unsupervised", "local minimum"],
            "centroid": ["centroid"],
            "inertia": ["inertia", "wcss", "elbow method"],
            "lloyds-algorithm": ["lloyd"],
            "cross-validation": ["cross validation", "train validation test", "train test split", "k fold", "loocv", "stratified", "hyperparameter"],
            "overfitting": ["overfitting"],
            "underfitting": ["underfitting"],
            "bias-variance-tradeoff": ["bias variance"],
            "confusion-matrix": ["confusion matrix"],
            "precision": ["precision"],
            "recall": ["recall"],
            "f1-score": ["f1"],
            "accuracy": ["accuracy"],
        },
        "gate_rules": [
            (("cross-validation", "loocv", "metrics", "accuracy", "precision", "recall", "f1"), "cross-validation"),
            (("logistic", "sigmoid", "cross-entropy", "separability", "classification"), "logistic-regression"),
            (("k-means", "centroid", "inertia"), "kmeans"),
            (("knn", "k-nearest", "distance-based"), "knn"),
            (("least-squares", "ridge", "lasso", "residual"), "least-squares"),
            (("linear regression", "gradient descent", "mse"), "linear-regression"),
        ],
        "default_gate_topic": "linear-regression",
    }
}


@dataclass
class Node:
    tag: str
    attrs: dict[str, str] = field(default_factory=dict)
    children: list["Node | str"] = field(default_factory=list)
    parent: "Node | None" = None

    @property
    def classes(self) -> set[str]:
        return set(self.attrs.get("class", "").split())

    def descendants(self, tag: str | None = None, class_name: str | None = None) -> list["Node"]:
        result = []
        for child in self.children:
            if not isinstance(child, Node):
                continue
            if (tag is None or child.tag == tag) and (class_name is None or class_name in child.classes):
                result.append(child)
            result.extend(child.descendants(tag, class_name))
        return result

    def first(self, tag: str | None = None, class_name: str | None = None) -> "Node | None":
        matches = self.descendants(tag, class_name)
        return matches[0] if matches else None

    def text(self) -> str:
        value = "".join(child.text() if isinstance(child, Node) else child for child in self.children)
        return re.sub(r"\s+", " ", value).strip()

    def inner_html(self) -> str:
        return "".join(to_html(child) if isinstance(child, Node) else escape(child) for child in self.children)


class TreeParser(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.root = Node("root")
        self.stack = [self.root]

    def handle_starttag(self, tag, attrs):
        node = Node(tag.lower(), {k: (v or "") for k, v in attrs}, parent=self.stack[-1])
        self.stack[-1].children.append(node)
        if tag.lower() not in VOID_TAGS:
            self.stack.append(node)

    def handle_startendtag(self, tag, attrs):
        self.handle_starttag(tag, attrs)
        if tag.lower() not in VOID_TAGS:
            self.stack.pop()

    def handle_endtag(self, tag):
        tag = tag.lower()
        for index in range(len(self.stack) - 1, 0, -1):
            if self.stack[index].tag == tag:
                del self.stack[index:]
                return

    def handle_data(self, data):
        self.stack[-1].children.append(data)


def to_html(node: Node) -> str:
    attrs = "".join(f' {key}="{escape(value, quote=True)}"' for key, value in node.attrs.items())
    if node.tag in VOID_TAGS:
        return f"<{node.tag}{attrs}>"
    return f"<{node.tag}{attrs}>{node.inner_html()}</{node.tag}>"


def parse(path: Path) -> Node:
    parser = TreeParser()
    parser.feed(path.read_text(encoding="utf-8"))
    return parser.root


def direct_child(node: Node, tag: str) -> Node | None:
    return next((child for child in node.children if isinstance(child, Node) and child.tag == tag), None)


def section(root: Node, number: str) -> Node | None:
    for candidate in root.descendants("section", "concept-card"):
        head = candidate.first(class_name="sec-head")
        num = head.first(class_name="sec-num") if head else None
        if num and num.text() == number:
            return candidate
    return None


def clean_title(value: str) -> str:
    value = re.sub(r"\s*GATE extra\s*", "", value, flags=re.I)
    value = re.sub(r"^\d+\.\s*", "", value)
    return value.strip(" —–-")


def preview(value: str, limit: int = 250) -> str:
    value = re.sub(r"\s+", " ", value).strip()
    if len(value) <= limit:
        return value
    cut = value.rfind(" ", 0, limit)
    return value[: cut if cut > 80 else limit].rstrip(" ,;:") + "…"


def hook_and_body(node: Node) -> tuple[str, str]:
    strong = node.first("strong")
    full = node.text()
    if strong and strong.text():
        hook = strong.text().rstrip(":")
        body = full[len(strong.text()):].lstrip(" :—–-")
        return hook, body or full
    parts = re.split(r"(?<=[.!?])\s+|:\s+", full, maxsplit=1)
    return preview(parts[0], 115), preview(parts[1] if len(parts) > 1 else full)


def option_text(option: Node) -> str:
    value = option.text()
    letter = option.first(class_name="opt-letter")
    if letter and value.startswith(letter.text()):
        value = value[len(letter.text()):].strip()
    return value


def normalized_match_text(value: str) -> str:
    value = value.lower()
    value = re.sub(r"\\(?:hat|beta|sigma|text|operatorname)\b", " ", value)
    value = value.replace("^2", " squared ").replace("$", " ")
    value = re.sub(r"[^a-z0-9]+", " ", value)
    return re.sub(r"\s+", " ", value).strip()


def card_concepts(topic_id: str, hook: str, body: str, detail_html: str, config: dict) -> tuple[str | None, list[str]]:
    candidates = config["topic_concepts"].get(topic_id, [])
    aliases_by_id = config.get("concept_aliases", {})
    hook_text = normalized_match_text(hook)
    body_text = normalized_match_text(body)
    detail_text = normalized_match_text(re.sub(r"<[^>]+>", " ", detail_html))
    matches = []
    for position, concept_id in enumerate(candidates):
        aliases = [concept_id.replace("-", " ")] + aliases_by_id.get(concept_id, [])
        best_score = 0
        for alias in aliases:
            term = normalized_match_text(alias)
            if not term:
                continue
            if term in hook_text:
                best_score = max(best_score, 300 + len(term))
            elif term in body_text:
                best_score = max(best_score, 200 + len(term))
            elif term in detail_text:
                best_score = max(best_score, 100 + len(term))
        if best_score:
            matches.append((best_score, -position, concept_id))
    matches.sort(reverse=True)
    concept_ids = [item[2] for item in matches[:4]]
    if not concept_ids and candidates:
        concept_ids = [candidates[0]]
    return (concept_ids[0] if concept_ids else None), concept_ids


def base_card(topic_id: str, order: int, kind: str, hook: str, body: str, detail_html: str,
              source: str, anchor: str, label: str, question, config: dict) -> dict:
    primary_concept_id, concept_ids = card_concepts(topic_id, hook, body, detail_html, config)
    return {
        "id": f"{config['prefix']}-{topic_id}-{order:03d}",
        "topicId": topic_id,
        "order": order,
        "type": kind,
        "hook": clean_title(hook),
        "body": preview(body),
        "bodyHtml": "",
        "formula": "",
        "primaryConceptId": primary_concept_id,
        "concepts": concept_ids,
        "difficulty": "Core",
        "source": source,
        "sourceAnchor": anchor,
        "sourceLabel": label,
        "sourceUrl": f"{source}#{anchor}",
        "sourceRef": {"path": source, "anchor": anchor, "label": label},
        "detail": preview(re.sub(r"<[^>]+>", " ", detail_html), 420),
        "detailHtml": detail_html,
        "question": question,
    }


def extract_topic(topic_id: str, slug: str, lesson_dir: Path) -> tuple[list[dict], dict[str, int]]:
    root = parse(lesson_dir / f"{slug}.html")
    cards = []
    counts = dict(definitions=0, study=0, cheatSheets=0, traps=0, practice=0, inlineQuizzes=0)

    definitions = section(root, "4")
    for index, item in enumerate(definitions.descendants("li") if definitions else [], 1):
        hook, body = hook_and_body(item)
        cards.append(("basic-definition", hook, body, f"<p>{item.inner_html()}</p>", f"definition-{index}", "Basic definitions", None))
        counts["definitions"] += 1

    study_items = root.descendants("details", "study-item")
    study_index = 0
    for item in study_items:
        if item.first(class_name="study-extra"):
            continue
        study_index += 1
        summary = direct_child(item, "summary")
        hook = clean_title(summary.text() if summary else f"Study point {study_index}")
        body_nodes = [child for child in item.children if not (isinstance(child, Node) and child.tag == "summary")]
        detail_html = "".join(to_html(child) if isinstance(child, Node) else escape(child) for child in body_nodes)
        paragraphs = [node.text() for node in item.descendants("p") if node.text()]
        body = paragraphs[0] if paragraphs else item.text().replace(summary.text() if summary else "", "", 1)
        study_type = "worked-example" if re.search(r"\b(example|solve|worked|calculation)\b", hook, re.I) else "deep-dive"
        cards.append((study_type, hook, body, detail_html, f"study-item-{study_index}", "Study in Depth", None))
        counts["study"] += 1

    cheat = section(root, "9")
    for index, item in enumerate(cheat.descendants("li") if cheat else [], 1):
        hook, body = hook_and_body(item)
        cards.append(("cheat-sheet", hook, body, f"<p>{item.inner_html()}</p>", f"cheat-{index}", "GATE cheat sheet", None))
        counts["cheatSheets"] += 1

    traps = section(root, "10")
    trap_nodes = traps.descendants("p") if traps else []
    trap_nodes = [node for node in trap_nodes if node.parent and "trap" in node.parent.classes]
    for index, item in enumerate(trap_nodes, 1):
        hook, body = hook_and_body(item)
        cards.append(("trap", hook, body, f"<p>{item.inner_html()}</p>", f"trap-{index}", "Common traps", None))
        counts["traps"] += 1

    practice = section(root, "12")
    for index, item in enumerate(practice.descendants(class_name="practice") if practice else [], 1):
        prompt = item.first(class_name="pq")
        answer = item.first(class_name="ans")
        prompt_text = prompt.text() if prompt else f"Practice problem {index}"
        answer_html = answer.inner_html() if answer else "Review the complete lesson for the solution."
        question = {
            "type": "REVEAL",
            "prompt": prompt_text,
            "options": [],
            "answer": True,
            "explanation": answer.text() if answer else "",
            "explanationHtml": answer_html,
        }
        cards.append(("practice", clean_title(prompt_text), "Solve it before revealing the explanation.", answer_html,
                      f"practice-{index}", "Practice problems", question))
        counts["practice"] += 1

    for index, quiz in enumerate(practice.descendants(class_name="quiz-card") if practice else [], 1):
        prompt = quiz.first(class_name="quiz-q")
        options = quiz.descendants(class_name="quiz-opt")
        correct = options[0].attrs.get("data-correct", "") if options else ""
        option_values = [f'{option.attrs.get("data-val", chr(65+i))}: {option_text(option)}' for i, option in enumerate(options)]
        feedback = next((node for node in quiz.descendants(class_name="quiz-feedback")
                         if node.attrs.get("data-fb") == correct), None)
        question = {
            "type": "MCQ",
            "prompt": prompt.text() if prompt else "Quick quiz",
            "options": option_values,
            "answer": correct,
            "explanation": feedback.text() if feedback else "",
            "explanationHtml": feedback.inner_html() if feedback else "",
        }
        cards.append(("practice", prompt.text() if prompt else "Quick quiz", "Choose an answer, then check the explanation.",
                      feedback.inner_html() if feedback else "", f"practice-quiz-{index}", "Practice quiz", question))
        counts["inlineQuizzes"] += 1

    output = []
    for order, raw in enumerate(cards, 1):
        kind, hook, body, detail_html, anchor, label, question = raw
        # We temporarily return raw details and apply `base_card` later with `config`
        output.append((topic_id, order, kind, hook, body, detail_html, f"{slug}.html", anchor, label, question))
    return output, counts


def gate_topic(label: str, config: dict) -> str:
    label = label.lower()
    for terms, topic in config["gate_rules"]:
        if any(term in label for term in terms):
            return topic
    return config["default_gate_topic"]


def extract_gate_questions(start_orders: dict[str, int], config: dict, lesson_dir: Path) -> tuple[list[dict], int]:
    root = parse(lesson_dir / "gate-questions.html")
    cards = []
    topic_positions = start_orders.copy()
    for index, item in enumerate(root.descendants(class_name="gate-q"), 1):
        chips = [chip.text() for chip in item.descendants(class_name="chip")]
        topic_id = gate_topic(" ".join(chips[1:]), config)
        prompt = item.first(class_name="gate-qtext")
        explanation = item.first(class_name="gate-expl")
        qtype = item.attrs.get("data-type", "MCQ")
        key = item.attrs.get("data-key", "")
        options = item.descendants(class_name="gate-opt")
        option_values = [f'{option.attrs.get("data-val", chr(65+i))}: {option_text(option)}' for i, option in enumerate(options)]
        if qtype == "NAT":
            parts = [float(value.strip()) for value in re.split(r"\s+to\s+", key)]
            answer = [min(parts), max(parts)]
        elif qtype == "MSQ":
            answer = [value.strip() for value in key.split(";")]
        else:
            answer = key.strip()
        question = {
            "type": qtype,
            "prompt": prompt.text() if prompt else f"GATE question {index}",
            "options": option_values,
            "answer": answer,
            "explanation": explanation.text() if explanation else "",
            "explanationHtml": explanation.inner_html() if explanation else "",
        }
        topic_positions[topic_id] += 1
        hook = " · ".join(chips[:2]) if chips else f"GATE question {index}"
        prompt_text = prompt.text() if prompt else f"GATE question {index}"
        cards.append(base_card(
            topic_id, topic_positions[topic_id], "gate-question",
            hook,
            preview(prompt_text),
            explanation.inner_html() if explanation else "",
            "gate-questions.html", f"gate-question-{index}", "GATE questions", question, config,
        ))
    return cards, len(cards)


def main() -> None:
    subject = sys.argv[1] if len(sys.argv) > 1 else "linear-algebra"
    if subject not in SUBJECT_CONFIGS:
        print(f"Unknown subject: {subject}")
        return

    config = SUBJECT_CONFIGS[subject]
    lesson_dir = ROOT / subject
    output_path = ROOT / "assets/js/gate-tiktok" / config["output_file"]

    cards = []
    totals = dict(definitions=0, study=0, cheatSheets=0, traps=0, practice=0, inlineQuizzes=0)
    for topic_id, slug in config["topics"]:
        raw_topic_cards, counts = extract_topic(topic_id, slug, lesson_dir)
        for raw in raw_topic_cards:
            cards.append(base_card(*raw, config=config))
        for key, value in counts.items():
            totals[key] += value

    start_orders = {}
    for topic_id, _ in config["topics"]:
        start_orders[topic_id] = max((card["order"] for card in cards if card["topicId"] == topic_id), default=0)
    gate_cards, gate_count = extract_gate_questions(start_orders, config, lesson_dir)
    cards.extend(gate_cards)
    totals["gateQuestions"] = gate_count

    payload = {"sourceCounts": totals, "cards": cards}
    json_payload = json.dumps(payload, ensure_ascii=False, separators=(",", ":"))
    output_path.write_text(
        f"(function(root,factory){{var data=factory();"
        f"if(typeof module==='object'&&module.exports)module.exports=data;"
        f"root.{config['output_var']}=data;"
        f"}})(typeof globalThis!=='undefined'?globalThis:this,function(){{return "
        + json_payload + ";});\n",
        encoding="utf-8",
    )
    print(f"Generated {len(cards)} cards in {output_path.relative_to(ROOT)}")
    print(json.dumps(totals, indent=2))


if __name__ == "__main__":
    main()
