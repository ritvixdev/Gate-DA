/* kNN decision-boundary lab (second lab on kNN): colour the whole plane by the kNN
   prediction. Small k → jagged boundary (overfit); large k → smooth (underfit). */
(function () {
  "use strict";
  var DATA = [
    { x: 2, y: 7, c: 0 }, { x: 1.5, y: 8.5, c: 0 }, { x: 3, y: 8, c: 0 }, { x: 2.5, y: 6, c: 0 }, { x: 1, y: 6.5, c: 0 }, { x: 3.5, y: 7.2, c: 0 }, { x: 2, y: 9, c: 0 }, { x: 4, y: 5.5, c: 0 }, { x: 5.5, y: 7.5, c: 0 },
    { x: 7.5, y: 3, c: 1 }, { x: 8, y: 4.5, c: 1 }, { x: 6.5, y: 2.5, c: 1 }, { x: 8.5, y: 3.5, c: 1 }, { x: 7, y: 4, c: 1 }, { x: 9, y: 2.8, c: 1 }, { x: 6.8, y: 5, c: 1 }, { x: 5, y: 3, c: 1 }, { x: 3.5, y: 2.5, c: 1 },
  ];
  function init() {
    var canvas = document.getElementById("knnboundary-lab");
    if (!canvas || !window.VizChart) return;
    var readout = document.getElementById("knnboundary-lab-readout");
    var kI = document.getElementById("kb-k"), kV = document.getElementById("kb-k-val");
    var lo = 0, hi = 10, pad = 24;
    function draw() {
      var s = VizChart.setup(canvas), ctx = s.ctx, W = s.w, H = s.h;
      var k = parseInt(kI.value, 10);
      var c0 = VizChart.css("--teal", "#5db8a6"), c1 = VizChart.css("--primary", "#cc785c"), muted = VizChart.css("--muted", "#6c6a64");
      function PX(x) { return pad + x / hi * (W - 2 * pad); }
      function PY(y) { return (H - pad) - y / hi * (H - 2 * pad); }
      ctx.clearRect(0, 0, W, H);
      // colour the plane
      var cells = 46, cw = (W - 2 * pad) / cells, ch = (H - 2 * pad) / cells;
      for (var i = 0; i < cells; i++) for (var j = 0; j < cells; j++) {
        var dx = lo + (i + 0.5) / cells * (hi - lo), dy = lo + (j + 0.5) / cells * (hi - lo);
        var ds = DATA.map(function (p) { return { d: (p.x - dx) * (p.x - dx) + (p.y - dy) * (p.y - dy), c: p.c }; }).sort(function (a, b) { return a.d - b.d; });
        var v = 0; for (var n = 0; n < k; n++) v += ds[n].c; var cls = v > k / 2 ? 1 : 0;
        ctx.fillStyle = cls ? c1 : c0; ctx.globalAlpha = 0.18; ctx.fillRect(pad + i * cw, PY(0) - (j + 1) * ch, cw + 0.6, ch + 0.6);
      }
      ctx.globalAlpha = 1;
      // points
      DATA.forEach(function (p) { ctx.fillStyle = p.c ? c1 : c0; ctx.strokeStyle = VizChart.css("--surface-card", "#efe9de"); ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(PX(p.x), PY(p.y), 5, 0, 7); ctx.fill(); ctx.stroke(); });
      if (readout) readout.innerHTML = "k = " + k + " &nbsp;·&nbsp; the shaded regions are the kNN decision boundary &nbsp;·&nbsp; <strong>" +
        (k <= 3 ? "small k → jagged boundary (low bias, high variance — can overfit)" : k >= 13 ? "large k → very smooth boundary (high bias — can underfit)" : "moderate k → a balanced boundary") + "</strong>";
    }
    kI.addEventListener("input", function () { kV.textContent = kI.value; draw(); });
    kV.textContent = kI.value;
    var prevT = window.__onThemeChange; window.__onThemeChange = function (t) { if (typeof prevT === "function") prevT(t); draw(); };
    window.addEventListener("resize", function () { clearTimeout(window.__kbT); window.__kbT = setTimeout(draw, 150); });
    draw();
  }
  var prev = window.GATE_VIZ_INIT;
  window.GATE_VIZ_INIT = function () { if (typeof prev === "function") prev(); init(); };
})();
