/* gate-quiz.js — answer handling for the GATE Questions pages.
   Each .gate-q card has data-type (MCQ | MSQ | NAT) and data-key.
   Uses event delegation on document, so it is immune to the chrome rebuild that
   app.js performs (no reliance on attaching listeners to specific elements). */
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
        var val = o.getAttribute("data-val");
        if (corr.indexOf(val) !== -1) o.classList.add("correct");
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
  // ---- delegated handlers (work no matter when/if the DOM is rebuilt) ----
  document.addEventListener("click", function (e) {
    var opt = e.target.closest && e.target.closest(".gate-opt");
    if (opt) {
      var card = opt.closest(".gate-q");
      if (card && !card.getAttribute("data-done")) {
        if (card.getAttribute("data-type") === "MSQ") opt.classList.toggle("sel");
        else { [].forEach.call(card.querySelectorAll(".gate-opt"), function (x) { x.classList.remove("sel"); }); opt.classList.add("sel"); }
      }
      return;
    }
    var check = e.target.closest && e.target.closest(".gate-check");
    if (check) { var c = check.closest(".gate-q"); if (c) grade(c); }
  });
  document.addEventListener("keydown", function (e) {
    if (e.key !== "Enter") return;
    var nat = e.target.closest && e.target.closest(".gate-nat");
    if (nat) { var c = nat.closest(".gate-q"); if (c) grade(c); }
  });
})();
