/* Gradient Descent lab: a point steps downhill on a 1-D curve via x <- x - eta*f'(x).
   Presets: convex Bowl (one min) and Double-well (two minima -> local-min trap). */
(function () {
  "use strict";
  var FUNCS = {
    bowl: { f: function (x) { return 0.5 * (x - 1) * (x - 1) + 1; }, df: function (x) { return (x - 1); }, lo: -4, hi: 6, name: "Bowl (convex)" },
    well: { f: function (x) { return 0.1 * x * x * x * x - 0.8 * x * x + 2; }, df: function (x) { return 0.4 * x * x * x - 1.6 * x; }, lo: -4, hi: 4, name: "Double-well" },
  };
  function init() {
    var canvas = document.getElementById("gd-lab");
    if (!canvas || !window.VizChart) return;
    var readout = document.getElementById("gd-lab-readout");
    var etaInput = document.getElementById("gd-eta"), etaVal = document.getElementById("gd-eta-val");
    var key = "bowl", x = 4, steps = 0, path = [], timer = null;

    function fn() { return FUNCS[key]; }
    function reset(startAtRight) {
      var F = fn();
      x = startAtRight === false ? F.lo + 0.6 : (key === "well" ? -3.6 : F.hi - 0.4);
      steps = 0; path = [x]; stopRun(); draw();
    }
    function step() {
      var F = fn(), eta = parseFloat(etaInput.value);
      var g = F.df(x);
      x = x - eta * g;
      // clamp to avoid runaway off-canvas (still shows divergence visually near edges)
      x = Math.max(F.lo - 1, Math.min(F.hi + 1, x));
      steps++; path.push(x); draw();
    }
    function run() { stopRun(); var i = 0; timer = setInterval(function () { step(); if (++i > 40) stopRun(); }, 90); }
    function stopRun() { if (timer) { clearInterval(timer); timer = null; } }

    function draw() {
      var s = VizChart.setup(canvas), ctx = s.ctx, W = s.w, H = s.h;
      var F = fn(), pad = 34;
      var lo = F.lo, hi = F.hi, ymin = Infinity, ymax = -Infinity;
      for (var t = 0; t <= 100; t++) { var xx = lo + (hi - lo) * t / 100, yy = F.f(xx); if (yy < ymin) ymin = yy; if (yy > ymax) ymax = yy; }
      ymax += (ymax - ymin) * 0.1 + 0.2;
      function PX(xv) { return pad + (xv - lo) / (hi - lo) * (W - 2 * pad); }
      function PY(yv) { return (H - pad) - (yv - ymin) / (ymax - ymin) * (H - 2 * pad); }
      var grid = VizChart.css("--viz-grid", "#e6dfd8"), axis = VizChart.css("--viz-axis", "#9b948a");
      var fg = VizChart.css("--ink", "#141413"), accent = VizChart.css("--accent3", "#a78bfa"), primary = VizChart.css("--primary", "#cc785c");
      ctx.clearRect(0, 0, W, H);
      // axes
      ctx.strokeStyle = grid; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(pad, H - pad); ctx.lineTo(W - pad, H - pad); ctx.moveTo(pad, pad); ctx.lineTo(pad, H - pad); ctx.stroke();
      // curve
      ctx.strokeStyle = accent; ctx.lineWidth = 2; ctx.beginPath();
      for (var k = 0; k <= 120; k++) { var cx = lo + (hi - lo) * k / 120, px = PX(cx), py = PY(F.f(cx)); if (k === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py); }
      ctx.stroke();
      // path trail
      ctx.fillStyle = VizChart.css("--muted", "#6c6a64");
      for (var p = 0; p < path.length; p++) { ctx.globalAlpha = 0.35; ctx.beginPath(); ctx.arc(PX(path[p]), PY(F.f(path[p])), 3, 0, 7); ctx.fill(); }
      ctx.globalAlpha = 1;
      // current point
      ctx.fillStyle = primary; ctx.beginPath(); ctx.arc(PX(x), PY(F.f(x)), 6, 0, 7); ctx.fill();
      if (readout) {
        var g = F.df(x);
        readout.innerHTML = F.name + " &nbsp;·&nbsp; step " + steps + " &nbsp;·&nbsp; x = " + x.toFixed(3) +
          " &nbsp;·&nbsp; f(x) = " + F.f(x).toFixed(3) + " &nbsp;·&nbsp; slope f'(x) = " + g.toFixed(3) +
          (Math.abs(g) < 0.01 ? " &nbsp;<strong>(at a minimum)</strong>" : "");
      }
    }
    etaInput.addEventListener("input", function () { etaVal.textContent = etaInput.value; });
    document.getElementById("gd-step").addEventListener("click", step);
    document.getElementById("gd-run").addEventListener("click", run);
    document.getElementById("gd-reset").addEventListener("click", function () { reset(true); });
    document.getElementById("gd-bowl").addEventListener("click", function () { active(this); key = "bowl"; reset(true); });
    document.getElementById("gd-well").addEventListener("click", function () { active(this); key = "well"; reset(true); });
    function active(btn) { var b = btn.parentElement.querySelectorAll(".preset-btn"); for (var i = 0; i < b.length; i++) b[i].classList.remove("active"); btn.classList.add("active"); }
    etaVal.textContent = etaInput.value;
    reset(true);
    window.__onThemeChange = draw;
    window.addEventListener("resize", function () { clearTimeout(window.__gdT); window.__gdT = setTimeout(draw, 150); });
  }
  window.GATE_VIZ_INIT = init;
})();
