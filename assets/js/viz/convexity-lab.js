/* Convex vs non-convex lab: a convex bowl has one global minimum; a non-convex curve
   has several valleys, so a local minimum need not be the global one. */
(function () {
  "use strict";
  var FUNCS = {
    convex: { f: function (x) { return 0.4 * x * x + 1; }, lo: -4, hi: 4, mins: [{ x: 0, global: true }], name: "Convex (one bowl)" },
    nonconvex: { f: function (x) { return 0.12 * x * x * x * x - 0.8 * x * x - 0.3 * x + 3; }, lo: -3.2, hi: 3.2, mins: [{ x: -1.9, global: true }, { x: 2.0, global: false }], name: "Non-convex (many valleys)" },
  };
  function init() {
    var canvas = document.getElementById("convexity-lab");
    if (!canvas || !window.VizChart) return;
    var readout = document.getElementById("convexity-lab-readout");
    var key = "convex";
    function draw() {
      var s = VizChart.setup(canvas), ctx = s.ctx, W = s.w, H = s.h, pad = 34, F = FUNCS[key];
      var lo = F.lo, hi = F.hi, ymin = Infinity, ymax = -Infinity;
      for (var t = 0; t <= 100; t++) { var yy = F.f(lo + (hi - lo) * t / 100); if (yy < ymin) ymin = yy; if (yy > ymax) ymax = yy; }
      var py = (ymax - ymin) * 0.12 + 0.3; ymin -= py; ymax += py;
      function PX(x) { return pad + (x - lo) / (hi - lo) * (W - 2 * pad); }
      function PY(y) { return (H - pad) - (y - ymin) / (ymax - ymin) * (H - 2 * pad); }
      var grid = VizChart.css("--viz-grid", "#e6dfd8"), accent = VizChart.css("--accent3", "#a78bfa"),
          primary = VizChart.css("--primary", "#cc785c"), ok = VizChart.css("--teal", "#5db8a6"), muted = VizChart.css("--muted", "#6c6a64");
      ctx.clearRect(0, 0, W, H);
      ctx.strokeStyle = grid; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(pad, H - pad); ctx.lineTo(W - pad, H - pad); ctx.moveTo(pad, pad); ctx.lineTo(pad, H - pad); ctx.stroke();
      ctx.strokeStyle = accent; ctx.lineWidth = 2.5; ctx.beginPath();
      for (var k = 0; k <= 140; k++) { var cx = lo + (hi - lo) * k / 140, X = PX(cx), Y = PY(F.f(cx)); if (k === 0) ctx.moveTo(X, Y); else ctx.lineTo(X, Y); }
      ctx.stroke();
      ctx.font = "11px ui-monospace, monospace"; ctx.textAlign = "center";
      F.mins.forEach(function (m) {
        var col = m.global ? primary : muted;
        ctx.fillStyle = col; ctx.beginPath(); ctx.arc(PX(m.x), PY(F.f(m.x)), 6, 0, 7); ctx.fill();
        ctx.fillText(m.global ? "global min" : "local min", PX(m.x), PY(F.f(m.x)) + 18);
      });
      if (readout) readout.innerHTML = "<strong>" + F.name + "</strong> &nbsp;·&nbsp; " +
        (key === "convex" ? "f″ ≥ 0 everywhere → the single stationary point is the global minimum (gradient descent can't get stuck)."
                          : "multiple valleys → a local minimum may not be global; the start point decides where you land.");
    }
    function set(k, btn) { key = k; var b = btn.parentElement.querySelectorAll(".preset-btn"); for (var i = 0; i < b.length; i++) b[i].classList.remove("active"); btn.classList.add("active"); draw(); }
    document.getElementById("cx-convex").addEventListener("click", function () { set("convex", this); });
    document.getElementById("cx-nonconvex").addEventListener("click", function () { set("nonconvex", this); });
    draw(); window.__onThemeChange = draw;
    window.addEventListener("resize", function () { clearTimeout(window.__cxT); window.__cxT = setTimeout(draw, 150); });
  }
  window.GATE_VIZ_INIT = init;
})();
