/* prob-tree-lab.js — a two-stage probability tree.
   Branch 1: A / Aᶜ (P(A)); branch 2: B / Bᶜ given each (conditionals). Leaves = path products.
   Sliders set the probabilities; readout gives P(B) (total probability) and P(A|B) (Bayes). #prob-tree-lab. */
(function () {
  "use strict";
  function init() {
    var canvas = document.getElementById("prob-tree-lab");
    if (!canvas || !window.VizChart) return;
    var readout = document.getElementById("prob-tree-lab-readout");
    var pA = 0.3, pBA = 0.8, pBAc = 0.1;

    function draw() {
      var s = VizChart.setup(canvas), ctx = s.ctx, W = s.w, H = s.h;
      var ink = VizChart.css("--ink", "#141413"), muted = VizChart.css("--muted", "#6c6a64"),
          primary = VizChart.css("--primary", "#cc785c"), teal = VizChart.css("--teal", "#5db8a6"),
          grid = VizChart.css("--viz-grid", "#e6dfd8");
      ctx.clearRect(0, 0, W, H);
      var x0 = 28, x1 = W * 0.40, x2 = W * 0.74;
      var yMid = H / 2, yA = H * 0.27, yAc = H * 0.73, yB1 = H * 0.13, yBc1 = H * 0.40, yB2 = H * 0.60, yBc2 = H * 0.87;
      ctx.font = "12px ui-monospace, monospace"; ctx.textBaseline = "middle";
      function edge(xa, ya, xb, yb, label, col) {
        ctx.strokeStyle = grid; ctx.lineWidth = 1.8; ctx.beginPath(); ctx.moveTo(xa, ya); ctx.lineTo(xb, yb); ctx.stroke();
        ctx.fillStyle = muted; ctx.textAlign = "center"; ctx.fillText(label, (xa + xb) / 2, (ya + yb) / 2 - 8);
      }
      function node(x, y, text, col) { ctx.fillStyle = col; ctx.beginPath(); ctx.arc(x, y, 5, 0, 7); ctx.fill(); ctx.fillStyle = ink; ctx.textAlign = "left"; ctx.fillText(text, x + 9, y); }
      // stage 1
      edge(x0, yMid, x1, yA, "P(A)=" + pA.toFixed(2), primary);
      edge(x0, yMid, x1, yAc, "P(Aᶜ)=" + (1 - pA).toFixed(2), muted);
      // stage 2
      edge(x1, yA, x2, yB1, pBA.toFixed(2), teal);
      edge(x1, yA, x2, yBc1, (1 - pBA).toFixed(2), muted);
      edge(x1, yAc, x2, yB2, pBAc.toFixed(2), teal);
      edge(x1, yAc, x2, yBc2, (1 - pBAc).toFixed(2), muted);
      node(x0, yMid, "", ink);
      node(x1, yA, "A", primary); node(x1, yAc, "Aᶜ", muted);
      // leaves with path products
      function leaf(x, y, lab, val, hot) { ctx.fillStyle = hot ? teal : muted; ctx.beginPath(); ctx.arc(x, y, 4, 0, 7); ctx.fill(); ctx.fillStyle = ink; ctx.textAlign = "left"; ctx.fillText(lab + " = " + val.toFixed(3), x + 9, y); }
      leaf(x2, yB1, "A∩B", pA * pBA, true);
      leaf(x2, yBc1, "A∩Bᶜ", pA * (1 - pBA), false);
      leaf(x2, yB2, "Aᶜ∩B", (1 - pA) * pBAc, true);
      leaf(x2, yBc2, "Aᶜ∩Bᶜ", (1 - pA) * (1 - pBAc), false);
      var pB = pA * pBA + (1 - pA) * pBAc, post = pB > 0 ? pA * pBA / pB : 0;
      if (readout) readout.innerHTML = "<strong>P(B)</strong> = P(A)P(B|A) + P(Aᶜ)P(B|Aᶜ) = " + (pA * pBA).toFixed(3) + " + " + ((1 - pA) * pBAc).toFixed(3) + " = <strong>" + pB.toFixed(3) + "</strong>" +
        " &nbsp;·&nbsp; <strong>P(A|B)</strong> = P(A∩B) / P(B) = <strong>" + post.toFixed(3) + "</strong> (Bayes) &nbsp;·&nbsp; teal leaves are the paths that reach B";
    }
    [["pt-a", function (v) { pA = v; }], ["pt-ba", function (v) { pBA = v; }], ["pt-bac", function (v) { pBAc = v; }]].forEach(function (p) {
      var el = document.getElementById(p[0]), out = document.getElementById(p[0] + "-val");
      if (!el) return; if (out) out.textContent = parseFloat(el.value).toFixed(2);
      el.addEventListener("input", function () { p[1](parseFloat(el.value)); if (out) out.textContent = parseFloat(el.value).toFixed(2); draw(); });
    });
    window.__onThemeChange = (function (prev) { return function (t) { if (typeof prev === "function") prev(t); draw(); }; })(window.__onThemeChange);
    window.addEventListener("resize", function () { clearTimeout(window.__ptT); window.__ptT = setTimeout(draw, 150); });
    draw();
  }
  var prev = window.GATE_VIZ_INIT;
  window.GATE_VIZ_INIT = function () { if (typeof prev === "function") prev(); init(); };
})();
