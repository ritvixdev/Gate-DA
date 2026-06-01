/* logitboundary-lab.js — logistic regression in a 2D feature space.
   The plane is tinted by predicted probability σ(w·x+b); the decision boundary is the line
   σ = threshold. The threshold slider shifts it (precision/recall trade-off). Mounts on #logitboundary-lab. */
(function () {
  "use strict";
  var DATA = [
    { x: 2, y: 7, c: 0 }, { x: 1.5, y: 8.5, c: 0 }, { x: 3, y: 8, c: 0 }, { x: 2.5, y: 6, c: 0 }, { x: 1, y: 6.5, c: 0 }, { x: 3.5, y: 7.5, c: 0 }, { x: 4, y: 8.5, c: 0 }, { x: 2, y: 5, c: 0 },
    { x: 7.5, y: 3, c: 1 }, { x: 8, y: 4.5, c: 1 }, { x: 6.5, y: 2.5, c: 1 }, { x: 8.5, y: 3.5, c: 1 }, { x: 7, y: 4, c: 1 }, { x: 9, y: 2.8, c: 1 }, { x: 6, y: 1.8, c: 1 }, { x: 5.5, y: 4, c: 1 }
  ];
  var w1 = 0.95, w2 = -0.95, b = 0.2;                       // fixed trained-ish weights
  function init() {
    var canvas = document.getElementById("logitboundary-lab");
    if (!canvas || !window.VizChart) return;
    var readout = document.getElementById("logitboundary-lab-readout");
    var tI = document.getElementById("lb-t"), tV = document.getElementById("lb-t-val");
    var lo = 0, hi = 10, pad = 24;
    function sig(z) { return 1 / (1 + Math.exp(-z)); }
    function draw() {
      var s = VizChart.setup(canvas), ctx = s.ctx, W = s.w, H = s.h;
      var t = tI ? parseFloat(tI.value) : 0.5, L = Math.log(t / (1 - t));
      var c0 = VizChart.css("--teal", "#5db8a6"), c1 = VizChart.css("--primary", "#cc785c"), muted = VizChart.css("--muted", "#6c6a64");
      function PX(x) { return pad + x / hi * (W - 2 * pad); }
      function PY(y) { return (H - pad) - y / hi * (H - 2 * pad); }
      ctx.clearRect(0, 0, W, H);
      var cells = 44, cw = (W - 2 * pad) / cells, ch = (H - 2 * pad) / cells;
      for (var i = 0; i < cells; i++) for (var j = 0; j < cells; j++) {
        var dx = lo + (i + 0.5) / cells * (hi - lo), dy = lo + (j + 0.5) / cells * (hi - lo);
        var p = sig(w1 * dx + w2 * dy + b);
        ctx.fillStyle = p >= t ? c1 : c0; ctx.globalAlpha = 0.10 + 0.32 * Math.abs(p - 0.5) * 2;
        ctx.fillRect(pad + i * cw, PY(0) - (j + 1) * ch, cw + 0.6, ch + 0.6);
      }
      ctx.globalAlpha = 1;
      // decision boundary: w1 x + w2 y + b = L
      var xa = lo, ya = (L - b - w1 * xa) / w2, xb = hi, yb = (L - b - w1 * xb) / w2;
      ctx.strokeStyle = muted; ctx.lineWidth = 2.5; ctx.setLineDash([6, 4]);
      ctx.beginPath(); ctx.moveTo(PX(xa), PY(ya)); ctx.lineTo(PX(xb), PY(yb)); ctx.stroke(); ctx.setLineDash([]);
      // points + accuracy
      var correct = 0;
      DATA.forEach(function (pt) {
        var pred = sig(w1 * pt.x + w2 * pt.y + b) >= t ? 1 : 0; if (pred === pt.c) correct++;
        ctx.fillStyle = pt.c ? c1 : c0; ctx.strokeStyle = VizChart.css("--surface-card", "#efe9de"); ctx.lineWidth = 2;
        ctx.beginPath(); ctx.arc(PX(pt.x), PY(pt.y), 5, 0, 7); ctx.fill(); ctx.stroke();
      });
      var acc = Math.round(100 * correct / DATA.length);
      if (readout) readout.innerHTML = "threshold = <strong>" + t.toFixed(2) + "</strong> &nbsp;·&nbsp; predict class 1 when p ≥ threshold &nbsp;·&nbsp; accuracy = <strong>" + acc + "%</strong>" +
        " &nbsp;·&nbsp; the dashed line is where σ(w·x+b) = threshold; raising it shrinks the orange region";
    }
    if (tI) { tI.addEventListener("input", function () { if (tV) tV.textContent = parseFloat(tI.value).toFixed(2); draw(); }); if (tV) tV.textContent = parseFloat(tI.value).toFixed(2); }
    window.__onThemeChange = (function (prev) { return function (t) { if (typeof prev === "function") prev(t); draw(); }; })(window.__onThemeChange);
    window.addEventListener("resize", function () { clearTimeout(window.__lbT); window.__lbT = setTimeout(draw, 150); });
    draw();
  }
  var prev = window.GATE_VIZ_INIT;
  window.GATE_VIZ_INIT = function () { if (typeof prev === "function") prev(); init(); };
})();
