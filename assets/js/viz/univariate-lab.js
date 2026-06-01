/* Single-variable optimization lab: plot f(x), mark stationary points (f'=0),
   and move a point to see the tangent slope f'(x) and the curvature f''(x). */
(function () {
  "use strict";
  var FUNCS = {
    parab: { f: function (x) { return x * x - 4 * x + 5; }, df: function (x) { return 2 * x - 4; }, d2: function () { return 2; }, lo: -1, hi: 5, crit: [2], name: "x² − 4x + 5" },
    cubic: { f: function (x) { return x * x * x - 3 * x; }, df: function (x) { return 3 * x * x - 3; }, d2: function (x) { return 6 * x; }, lo: -2.4, hi: 2.4, crit: [-1, 1], name: "x³ − 3x" },
  };
  function init() {
    var canvas = document.getElementById("univariate-lab");
    if (!canvas || !window.VizChart) return;
    var readout = document.getElementById("univariate-lab-readout");
    var xI = document.getElementById("uni-x"), xV = document.getElementById("uni-x-val");
    var key = "parab";
    function F() { return FUNCS[key]; }
    function syncRange() { var f = F(); xI.min = f.lo; xI.max = f.hi; xI.step = 0.05; if (+xI.value < f.lo || +xI.value > f.hi) xI.value = (f.lo + f.hi) / 2; }
    function draw() {
      var s = VizChart.setup(canvas), ctx = s.ctx, W = s.w, H = s.h, pad = 34, f = F();
      var lo = f.lo, hi = f.hi, ymin = Infinity, ymax = -Infinity;
      for (var t = 0; t <= 100; t++) { var yy = f.f(lo + (hi - lo) * t / 100); if (yy < ymin) ymin = yy; if (yy > ymax) ymax = yy; }
      var padY = (ymax - ymin) * 0.12 + 0.3; ymin -= padY; ymax += padY;
      function PX(x) { return pad + (x - lo) / (hi - lo) * (W - 2 * pad); }
      function PY(y) { return (H - pad) - (y - ymin) / (ymax - ymin) * (H - 2 * pad); }
      var grid = VizChart.css("--viz-grid", "#e6dfd8"), axis = VizChart.css("--viz-axis", "#9b948a");
      var accent = VizChart.css("--accent3", "#a78bfa"), primary = VizChart.css("--primary", "#cc785c"), muted = VizChart.css("--muted", "#6c6a64"), ok = VizChart.css("--accent2", "#3a9");
      ctx.clearRect(0, 0, W, H);
      ctx.strokeStyle = grid; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(pad, H - pad); ctx.lineTo(W - pad, H - pad); ctx.moveTo(pad, pad); ctx.lineTo(pad, H - pad); ctx.stroke();
      // curve
      ctx.strokeStyle = accent; ctx.lineWidth = 2.5; ctx.beginPath();
      for (var k = 0; k <= 140; k++) { var cx = lo + (hi - lo) * k / 140, px = PX(cx), py = PY(f.f(cx)); if (k === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py); }
      ctx.stroke();
      // stationary points
      f.crit.forEach(function (c) { ctx.fillStyle = ok; ctx.beginPath(); ctx.arc(PX(c), PY(f.f(c)), 5, 0, 7); ctx.fill(); });
      // current point + tangent
      var x = parseFloat(xI.value), y = f.f(x), m = f.df(x), dx = (hi - lo) * 0.18;
      ctx.strokeStyle = primary; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(PX(x - dx), PY(y - m * dx)); ctx.lineTo(PX(x + dx), PY(y + m * dx)); ctx.stroke();
      ctx.fillStyle = primary; ctx.beginPath(); ctx.arc(PX(x), PY(y), 6, 0, 7); ctx.fill();
      if (readout) {
        var d2 = f.d2(x), kind = Math.abs(m) < 0.05 ? (d2 > 0 ? " (local min, f″>0)" : d2 < 0 ? " (local max, f″<0)" : " (f″=0)") : "";
        readout.innerHTML = "f(x) = " + f.name + " &nbsp;·&nbsp; x = " + x.toFixed(2) + " &nbsp;·&nbsp; f(x) = " + y.toFixed(2) +
          " &nbsp;·&nbsp; slope f′(x) = " + m.toFixed(2) + " &nbsp;·&nbsp; f″(x) = " + d2.toFixed(2) + "<strong>" + kind + "</strong>";
      }
    }
    function setF(k, btn) { key = k; syncRange(); var b = btn.parentElement.querySelectorAll(".preset-btn"); for (var i = 0; i < b.length; i++) b[i].classList.remove("active"); btn.classList.add("active"); xV.textContent = (+xI.value).toFixed(2); draw(); }
    xI.addEventListener("input", function () { xV.textContent = (+xI.value).toFixed(2); draw(); });
    document.getElementById("uni-parab").addEventListener("click", function () { setF("parab", this); });
    document.getElementById("uni-cubic").addEventListener("click", function () { setF("cubic", this); });
    syncRange(); xV.textContent = (+xI.value).toFixed(2); draw();
    window.__onThemeChange = draw;
    window.addEventListener("resize", function () { clearTimeout(window.__uniT); window.__uniT = setTimeout(draw, 150); });
  }
  window.GATE_VIZ_INIT = init;
})();
