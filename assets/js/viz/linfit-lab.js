/* Linear-regression "Fit from Data" lab: click to add a point, click a point to remove it.
   The least-squares line, residual segments, and R² update live. */
(function () {
  "use strict";
  function init() {
    var canvas = document.getElementById("linfit-lab");
    if (!canvas || !window.VizChart) return;
    var readout = document.getElementById("linfit-lab-readout");
    var lo = 0, hi = 10, pad = 30, geom = {};
    var pts = [{ x: 1, y: 2 }, { x: 2, y: 2.6 }, { x: 3, y: 4 }, { x: 5, y: 4.8 }, { x: 6, y: 6.5 }, { x: 8, y: 7.2 }];
    function PX(x) { return pad + x / hi * (geom.W - 2 * pad); }
    function PY(y) { return (geom.H - pad) - y / hi * (geom.H - 2 * pad); }
    function fit() {
      var n = pts.length; if (n < 2) return null;
      var mx = 0, my = 0; pts.forEach(function (p) { mx += p.x; my += p.y; }); mx /= n; my /= n;
      var sxy = 0, sxx = 0, tss = 0; pts.forEach(function (p) { sxy += (p.x - mx) * (p.y - my); sxx += (p.x - mx) * (p.x - mx); tss += (p.y - my) * (p.y - my); });
      if (sxx < 1e-9) return null;
      var b1 = sxy / sxx, b0 = my - b1 * mx, rss = 0; pts.forEach(function (p) { var e = p.y - (b0 + b1 * p.x); rss += e * e; });
      return { b0: b0, b1: b1, r2: tss < 1e-9 ? 1 : 1 - rss / tss, rss: rss };
    }
    function draw() {
      var s = VizChart.setup(canvas), ctx = s.ctx; geom = { W: s.w, H: s.h };
      var grid = VizChart.css("--viz-grid", "#e6dfd8"), axis = VizChart.css("--viz-axis", "#9b948a"),
          primary = VizChart.css("--primary", "#cc785c"), muted = VizChart.css("--muted", "#6c6a64"), accent = VizChart.css("--accent3", "#a78bfa");
      ctx.clearRect(0, 0, geom.W, geom.H);
      ctx.strokeStyle = grid; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(pad, PY(0)); ctx.lineTo(geom.W - pad, PY(0)); ctx.moveTo(PX(0), pad); ctx.lineTo(PX(0), geom.H - pad); ctx.stroke();
      var f = fit();
      if (f) {
        // residuals
        ctx.strokeStyle = muted; ctx.lineWidth = 1;
        pts.forEach(function (p) { var yh = f.b0 + f.b1 * p.x; ctx.beginPath(); ctx.moveTo(PX(p.x), PY(p.y)); ctx.lineTo(PX(p.x), PY(yh)); ctx.stroke(); });
        // line
        ctx.strokeStyle = primary; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.moveTo(PX(0), PY(f.b0)); ctx.lineTo(PX(hi), PY(f.b0 + f.b1 * hi)); ctx.stroke();
      }
      // points
      ctx.fillStyle = accent; pts.forEach(function (p) { ctx.beginPath(); ctx.arc(PX(p.x), PY(p.y), 5, 0, 7); ctx.fill(); });
      if (readout) readout.innerHTML = f
        ? "ŷ = " + f.b0.toFixed(2) + " + " + f.b1.toFixed(2) + "x &nbsp;·&nbsp; R² = " + f.r2.toFixed(3) + " &nbsp;·&nbsp; n = " + pts.length + " points &nbsp;·&nbsp; <em>click to add, click a point to remove</em>"
        : "add at least 2 points (click the canvas) to fit a line";
    }
    canvas.addEventListener("click", function (e) {
      var rect = canvas.getBoundingClientRect();
      var dx = (e.clientX - rect.left - pad) / (geom.W - 2 * pad) * hi;
      var dy = (geom.H - pad - (e.clientY - rect.top)) / (geom.H - 2 * pad) * hi;
      // remove if near an existing point
      for (var i = 0; i < pts.length; i++) { if (Math.hypot(PX(pts[i].x) - (e.clientX - rect.left), PY(pts[i].y) - (e.clientY - rect.top)) < 12) { pts.splice(i, 1); draw(); return; } }
      if (dx >= 0 && dx <= hi && dy >= 0 && dy <= hi) { pts.push({ x: Math.round(dx * 10) / 10, y: Math.round(dy * 10) / 10 }); draw(); }
    });
    var clr = document.getElementById("lf-clear"); if (clr) clr.addEventListener("click", function () { pts = []; draw(); });
    var smp = document.getElementById("lf-sample"); if (smp) smp.addEventListener("click", function () { pts = [{ x: 1, y: 2 }, { x: 2, y: 2.6 }, { x: 3, y: 4 }, { x: 5, y: 4.8 }, { x: 6, y: 6.5 }, { x: 8, y: 7.2 }]; draw(); });
    draw(); window.__onThemeChange = draw;
    window.addEventListener("resize", function () { clearTimeout(window.__lfT); window.__lfT = setTimeout(draw, 150); });
  }
  window.GATE_VIZ_INIT = init;
})();
