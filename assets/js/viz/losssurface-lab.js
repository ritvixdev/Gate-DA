/* Loss-surface lab (second lab on Least-Squares): the SSE over (slope β₁, intercept β₀)
   as a heat-map. Press Run to watch gradient descent roll downhill to the least-squares minimum. */
(function () {
  "use strict";
  function init() {
    var canvas = document.getElementById("losssurface-lab");
    if (!canvas || !window.VizChart) return;
    var readout = document.getElementById("losssurface-lab-readout");
    var data = [{ x: 1, y: 2 }, { x: 2, y: 2.6 }, { x: 3, y: 4 }, { x: 4, y: 4.4 }, { x: 5, y: 5.6 }, { x: 6, y: 6.4 }];
    var b1lo = -1, b1hi = 3, b0lo = -2, b0hi = 5;          // parameter ranges (β₁ x, β₀ y)
    var b0 = 4.5, b1 = -0.8, timer = null, steps = 0;       // GD state (start in a corner)
    function sse(B0, B1) { var s = 0; data.forEach(function (p) { var e = p.y - (B0 + B1 * p.x); s += e * e; }); return s; }
    function grad(B0, B1) { var g0 = 0, g1 = 0, n = data.length; data.forEach(function (p) { var e = p.y - (B0 + B1 * p.x); g0 += -2 * e; g1 += -2 * p.x * e; }); return { g0: g0 / n, g1: g1 / n }; }
    // analytic min
    var n = data.length, mx = 0, my = 0; data.forEach(function (p) { mx += p.x; my += p.y; }); mx /= n; my /= n;
    var sxy = 0, sxx = 0; data.forEach(function (p) { sxy += (p.x - mx) * (p.y - my); sxx += (p.x - mx) * (p.x - mx); });
    var b1star = sxy / sxx, b0star = my - b1star * mx;
    function draw() {
      var s = VizChart.setup(canvas), ctx = s.ctx, W = s.w, H = s.h, pad = 34;
      var primary = VizChart.css("--primary", "#cc785c"), muted = VizChart.css("--muted", "#6c6a64"), teal = VizChart.css("--teal", "#5db8a6"), grid = VizChart.css("--viz-grid", "#e6dfd8");
      function PX(B1) { return pad + (B1 - b1lo) / (b1hi - b1lo) * (W - 2 * pad); }
      function PY(B0) { return (H - pad) - (B0 - b0lo) / (b0hi - b0lo) * (H - 2 * pad); }
      // normalize SSE for heat-map
      var smin = Infinity, smax = -Infinity, a, b; for (a = b1lo; a <= b1hi; a += 0.2) for (b = b0lo; b <= b0hi; b += 0.2) { var v = sse(b, a); if (v < smin) smin = v; if (v > smax) smax = v; }
      ctx.clearRect(0, 0, W, H);
      var cx = 42, cyN = 42, cwx = (W - 2 * pad) / cx, cwy = (H - 2 * pad) / cyN;
      for (var i = 0; i < cx; i++) for (var j = 0; j < cyN; j++) {
        var B1 = b1lo + (i + 0.5) / cx * (b1hi - b1lo), B0 = b0lo + (j + 0.5) / cyN * (b0hi - b0lo);
        var nv = (sse(B0, B1) - smin) / ((smax - smin) || 1);
        ctx.fillStyle = primary; ctx.globalAlpha = 0.05 + 0.55 * nv;
        ctx.fillRect(pad + i * cwx, PY(b0lo) - (j + 1) * cwy, cwx + 0.6, cwy + 0.6);
      }
      ctx.globalAlpha = 1;
      ctx.fillStyle = muted; ctx.font = "11px ui-monospace, monospace"; ctx.textAlign = "center";
      ctx.fillText("slope β₁ →", W / 2, H - pad + 6); ctx.save(); ctx.translate(10, H / 2); ctx.rotate(-Math.PI / 2); ctx.fillText("intercept β₀ →", 0, 0); ctx.restore();
      // minimum
      ctx.fillStyle = teal; ctx.beginPath(); ctx.arc(PX(b1star), PY(b0star), 6, 0, 7); ctx.fill();
      // current GD point
      ctx.fillStyle = primary; ctx.beginPath(); ctx.arc(PX(b1), PY(b0), 6, 0, 7); ctx.fill();
      if (readout) readout.innerHTML = "β₀ = " + b0.toFixed(2) + ", β₁ = " + b1.toFixed(2) + " &nbsp;·&nbsp; SSE = " + sse(b0, b1).toFixed(2) +
        " &nbsp;·&nbsp; step " + steps + " &nbsp;·&nbsp; teal dot = least-squares min (β₀*=" + b0star.toFixed(2) + ", β₁*=" + b1star.toFixed(2) + ") &nbsp;·&nbsp; SSE is a convex bowl";
    }
    function step() { var g = grad(b0, b1), eta = 0.03; b0 -= eta * g.g0; b1 -= eta * g.g1; steps++; draw(); }
    function run() { stop(); var i = 0; timer = setInterval(function () { step(); if (++i > 60 || sse(b0, b1) < sse(b0star, b1star) + 0.001) stop(); }, 70); }
    function stop() { if (timer) { clearInterval(timer); timer = null; } }
    document.getElementById("ls-step").addEventListener("click", step);
    document.getElementById("ls-run").addEventListener("click", run);
    document.getElementById("ls-reset").addEventListener("click", function () { stop(); b0 = 4.5; b1 = -0.8; steps = 0; draw(); });
    var prevT = window.__onThemeChange; window.__onThemeChange = function (t) { if (typeof prevT === "function") prevT(t); draw(); };
    window.addEventListener("resize", function () { clearTimeout(window.__lsT); window.__lsT = setTimeout(draw, 150); });
    draw();
  }
  var prev = window.GATE_VIZ_INIT;
  window.GATE_VIZ_INIT = function () { if (typeof prev === "function") prev(); init(); };
})();
