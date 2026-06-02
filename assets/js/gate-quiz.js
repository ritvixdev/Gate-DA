/* gate-quiz.js — answer handling for the GATE Questions pages.
   Each .gate-q card has data-type (MCQ | MSQ | NAT) and data-key.
   MCQ: single-select buttons; MSQ: multi-select; NAT: numeric input vs a range. */
(function () {
  "use strict";
  function parseRange(key) {                      // "0.062 to 0.063" | "42 to 42" | "55"
    var p = key.split(/\s+to\s+/);
    var lo = parseFloat(p[0]), hi = parseFloat(p.length > 1 ? p[1] : p[0]);
    return [Math.min(lo, hi), Math.max(lo, hi)];
  }
  function fmtKey(key) {
    var p = key.split(/\s+to\s+/);
    if (p.length === 1 || p[0].trim() === p[1].trim()) return p[0].trim();
    return p[0].trim() + " – " + p[1].trim();
  }
  function grade(card) {
    if (card.getAttribute("data-done")) return;
    var type = card.getAttribute("data-type"), key = card.getAttribute("data-key");
    var res = card.querySelector(".gate-result"), ok;
    if (type === "NAT") {
      var raw = card.querySelector(".gate-nat").value.replace(/[^0-9.\-]/g, "");
      var v = parseFloat(raw), r = parseRange(key);
      ok = !isNaN(v) && v >= r[0] - 1e-9 && v <= r[1] + 1e-9;
      res.innerHTML = (ok ? "✓ Correct. " : "✗ Not quite. ") + "Official answer: <strong>" + fmtKey(key) + "</strong>";
    } else {
      var corr = key.split(";").map(function (s) { return s.trim(); }).sort();
      var sel = [].map.call(card.querySelectorAll(".gate-opt.sel"), function (o) { return o.getAttribute("data-val"); }).sort();
      ok = sel.length === corr.length && sel.join(",") === corr.join(",");
      [].forEach.call(card.querySelectorAll(".gate-opt"), function (o) {
        var v = o.getAttribute("data-val");
        if (corr.indexOf(v) !== -1) o.classList.add("correct");
        else if (o.classList.contains("sel")) o.classList.add("wrong");
      });
      res.innerHTML = (ok ? "✓ Correct. " : "✗ Not quite. ") + "Answer: <strong>" + corr.join(", ") + "</strong>";
    }
    res.className = "gate-result " + (ok ? "ok" : "bad");
    res.hidden = false;
    var ex = card.querySelector(".gate-expl");
    if (ex) ex.hidden = false;
    card.setAttribute("data-done", "1");
  }
  function init() {
    var cards = document.querySelectorAll(".gate-q");
    [].forEach.call(cards, function (card) {
      var type = card.getAttribute("data-type");
      var opts = card.querySelectorAll(".gate-opt");
      [].forEach.call(opts, function (o) {
        o.addEventListener("click", function () {
          if (card.getAttribute("data-done")) return;
          if (type === "MSQ") o.classList.toggle("sel");
          else { [].forEach.call(opts, function (x) { x.classList.remove("sel"); }); o.classList.add("sel"); }
        });
      });
      var check = card.querySelector(".gate-check");
      if (check) check.addEventListener("click", function () { grade(card); });
      var nat = card.querySelector(".gate-nat");
      if (nat) nat.addEventListener("keydown", function (e) { if (e.key === "Enter") grade(card); });
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
