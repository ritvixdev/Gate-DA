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


ROOT = Path(__file__).resolve().parents[1]
LESSON_DIR = ROOT / "linear-algebra"
OUTPUT = ROOT / "assets/js/gate-tiktok/gate-tiktok-source-data.js"
VOID_TAGS = {"br", "hr", "img", "input", "meta", "link", "source", "area", "base", "embed", "param", "track", "wbr"}

TOPICS = [
    ("vectors", "01-vectors"),
    ("matrices", "02-matrices"),
    ("determinants", "03-determinants"),
    ("rank-nullity", "04-rank-nullity"),
    ("linear-equations", "05-linear-equations"),
    ("eigenvalues", "06-eigenvalues"),
    ("diagonalization", "07-diagonalization"),
    ("orthogonality", "08-orthogonality"),
    ("svd-pca", "09-svd-pca"),
]

TOPIC_CONCEPTS = {
    "vectors": ["vector", "span", "linear-independence", "basis", "dimension", "coordinates"],
    "matrices": ["matrix", "linear-transformation", "identity-matrix", "matrix-multiplication", "inverse"],
    "determinants": ["determinant", "singular-matrix", "inverse", "rank"],
    "rank-nullity": ["rank", "nullity", "kernel", "column-space", "pivot"],
    "linear-equations": ["linear-equations", "row-reduction", "rank", "nullity", "column-space"],
    "eigenvalues": ["eigenvalue", "eigenvector", "eigenspace", "trace", "determinant"],
    "diagonalization": ["diagonalization", "matrix-power", "eigenvalue", "eigenvector", "basis"],
    "orthogonality": ["orthogonality", "orthonormal-basis", "projection", "orthogonal-matrix", "least-squares"],
    "svd-pca": ["svd", "singular-value", "pca", "covariance", "rank"],
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


def base_card(topic_id: str, order: int, kind: str, hook: str, body: str, detail_html: str,
              source: str, anchor: str, label: str, question=None) -> dict:
    return {
        "id": f"la-{topic_id}-{order:03d}",
        "topicId": topic_id,
        "order": order,
        "type": kind,
        "hook": clean_title(hook),
        "body": preview(body),
        "bodyHtml": "",
        "formula": "",
        "concepts": TOPIC_CONCEPTS[topic_id],
        "difficulty": "Core",
        "source": source,
        "sourceAnchor": anchor,
        "sourceLabel": label,
        "detail": preview(re.sub(r"<[^>]+>", " ", detail_html), 420),
        "detailHtml": detail_html,
        "question": question,
    }


def extract_topic(topic_id: str, slug: str) -> tuple[list[dict], dict[str, int]]:
    root = parse(LESSON_DIR / f"{slug}.html")
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
        output.append(base_card(
            topic_id, order, kind, hook, body, detail_html,
            f"{slug}.html", anchor, label, question,
        ))
    return output, counts


def gate_topic(label: str) -> str:
    label = label.lower()
    rules = [
        (("pca", "singular", "covariance"), "svd-pca"),
        (("projection", "orthogonal", "basis"), "orthogonality"),
        (("solution", "equation", "gaussian"), "linear-equations"),
        (("rank",), "rank-nullity"),
        (("determinant",), "determinants"),
        (("matrix power",), "diagonalization"),
        (("eigen",), "eigenvalues"),
        (("subspace",), "vectors"),
    ]
    for terms, topic in rules:
        if any(term in label for term in terms):
            return topic
    return "matrices"


def extract_gate_questions(start_orders: dict[str, int]) -> tuple[list[dict], int]:
    root = parse(LESSON_DIR / "gate-questions.html")
    cards = []
    topic_positions = start_orders.copy()
    for index, item in enumerate(root.descendants(class_name="gate-q"), 1):
        chips = [chip.text() for chip in item.descendants(class_name="chip")]
        topic_id = gate_topic(" ".join(chips[1:]))
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
            "gate-questions.html", f"gate-question-{index}", "GATE questions", question,
        ))
    return cards, len(cards)


def main() -> None:
    cards = []
    totals = dict(definitions=0, study=0, cheatSheets=0, traps=0, practice=0, inlineQuizzes=0)
    for topic_id, slug in TOPICS:
        topic_cards, counts = extract_topic(topic_id, slug)
        cards.extend(topic_cards)
        for key, value in counts.items():
            totals[key] += value

    start_orders = {}
    for topic_id, _ in TOPICS:
        start_orders[topic_id] = max((card["order"] for card in cards if card["topicId"] == topic_id), default=0)
    gate_cards, gate_count = extract_gate_questions(start_orders)
    cards.extend(gate_cards)
    totals["gateQuestions"] = gate_count

    payload = {"sourceCounts": totals, "cards": cards}
    json_payload = json.dumps(payload, ensure_ascii=False, separators=(",", ":"))
    OUTPUT.write_text(
        "(function(root,factory){var data=factory();"
        "if(typeof module==='object'&&module.exports)module.exports=data;"
        "root.GateTikTokSourceData=data;"
        "})(typeof globalThis!=='undefined'?globalThis:this,function(){return "
        + json_payload + ";});\n",
        encoding="utf-8",
    )
    print(f"Generated {len(cards)} cards in {OUTPUT.relative_to(ROOT)}")
    print(json.dumps(totals, indent=2))


if __name__ == "__main__":
    main()
