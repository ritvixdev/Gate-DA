/* Chi-square distribution lab: adjustable degrees of freedom; move a test statistic
   and the right tail (the p-value area) is shaded. Shows the right-skewed shape & right-tailed test. */
(function () {
  "use strict";
  function init() {
    var canvas = document.getElementById("chidist-lab");
    if (!canvas || !window.VizChart) return;
    var readout = document.getElementById("chidist-lab-readout");
    var kI = document.getElementById("chi-k"), kV = document.getElementById("chi-k-val");
    var xI = document.getElementById("chi-x"), xV = document.getElementById("chi-x-val");
    var hi = 24;
    function dens(x, k) { if (x <= 0) return 0; return Math.pow(x, k / 2 - 1) * Math.exp(-x / 2); } // unnormalized
    function draw() {
      var s = VizChart.setup(canvas), ctx = s.ctx, W = s.w, H = s.h, pad = 32;
      var k = parseInt(kI.value, 10), stat = parseFloat(xI.value);
      var ymax = 0, area = 0, tail = 0;
      for (var t = 0; t <= 400; t++) { var x = hi * t / 400, d = dens(x, k); if (d > ymax) ymax = d; area += d; if (x >= stat) tail += d; }
      ymax *= 1.1;
      var grid = VizChart.css("--viz-grid", "#e6dfd8"), axis = VizChart.css("--viz-axis", "#9b948a"),
          accent = VizChart.css("--accent3", "#a78bfa"), primary = VizChart.css("--primary", "#cc785c"), muted = VizChart.css("--muted", "#6c6a64");
      function PX(x) { return pad + x / hi * (W - 2 * pad); }
      function PY(y) { return (H - pad) - y / ymax * (H - 2 * pad); }
      ctx.clearRect(0, 0, W, H);
      // shaded right tail (p-value)
      ctx.fillStyle = primary; ctx.globalAlpha = 0.25; ctx.beginPath(); ctx.moveTo(PX(stat), PY(0));
      for (var u = 0; u <= 120; u++) { var x2 = stat + (hi - stat) * u / 120; ctx.lineTo(PX(x2), PY(dens(x2, k))); }
      ctx.lineTo(PX(hi), PY(0)); ctx.closePath(); ctx.fill(); ctx.globalAlpha = 1;
      // axis + curve
      ctx.strokeStyle = axis; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(pad, PY(0)); ctx.lineTo(W - pad, PY(0)); ctx.stroke();
      ctx.strokeStyle = accent; ctx.lineWidth = 2.5; ctx.beginPath();
      for (var q = 0; q <= 200; q++) { var x3 = hi * q / 200, px = PX(x3), py = PY(dens(x3, k)); if (q === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py); }
      ctx.stroke();
      // statistic line
      ctx.strokeStyle = primary; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(PX(stat), pad); ctx.lineTo(PX(stat), PY(0)); ctx.stroke();
      if (readout) readout.innerHTML = "χ² with df = " + k + " &nbsp;·&nbsp; mean = k = " + k + ", variance = 2k = " + (2 * k) +
        " &nbsp;·&nbsp; statistic = " + stat.toFixed(1) + " &nbsp;·&nbsp; right-tail p ≈ " + (tail / area).toFixed(3) +
        " &nbsp;·&nbsp; <strong>" + (tail / area < 0.05 ? "reject H₀" : "fail to reject") + "</strong> (α=0.05, right-tailed)";
    }
    kI.addEventListener("input", function () { kV.textContent = kI.value; draw(); });
    xI.addEventListener("input", function () { xV.textContent = (+xI.value).toFixed(1); draw(); });
    kV.textContent = kI.value; xV.textContent = (+xI.value).toFixed(1); draw();
    window.__onThemeChange = draw;
    window.addEventListener("resize", function () { clearTimeout(window.__chiT); window.__chiT = setTimeout(draw, 150); });
  }
  window.GATE_VIZ_INIT = init;
})();
