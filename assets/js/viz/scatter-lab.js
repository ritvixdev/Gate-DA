/* Covariance/correlation lab: drag the correlation slider and watch the (X,Y) cloud
   tilt. Shows the sign of covariance and the best-fit line. */
(function () {
  "use strict";
  function init() {
    var canvas = document.getElementById("scatter-lab");
    if (!canvas || !window.VizChart) return;
    var readout = document.getElementById("scatter-lab-readout");
    var rI = document.getElementById("sc-r"), rV = document.getElementById("sc-r-val");
    var N = 70, z1 = [], z2 = [];
    (function () { var seed = 7; function rnd() { seed = (seed * 9301 + 49297) % 233280; return seed / 233280; } function gauss() { return (rnd() + rnd() + rnd() + rnd() - 2) * 1.6; } for (var i = 0; i < N; i++) { z1.push(gauss()); z2.push(gauss()); } })();
    function draw() {
      var s = VizChart.setup(canvas), ctx = s.ctx, W = s.w, H = s.h, pad = 30;
      var r = parseFloat(rI.value);
      // X = z1 ; Y = r*z1 + sqrt(1-r^2)*z2  -> target correlation r
      var pts = [], k = Math.sqrt(Math.max(0, 1 - r * r));
      for (var i = 0; i < N; i++) pts.push({ x: z1[i], y: r * z1[i] + k * z2[i] });
      var lim = 4;
      function PX(x) { return pad + (x + lim) / (2 * lim) * (W - 2 * pad); }
      function PY(y) { return (H - pad) - (y + lim) / (2 * lim) * (H - 2 * pad); }
      var grid = VizChart.css("--viz-grid", "#e6dfd8"), axis = VizChart.css("--viz-axis", "#9b948a"),
          primary = VizChart.css("--primary", "#cc785c"), muted = VizChart.css("--muted", "#6c6a64");
      ctx.clearRect(0, 0, W, H);
      ctx.strokeStyle = axis; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(PX(0), pad); ctx.lineTo(PX(0), H - pad); ctx.moveTo(pad, PY(0)); ctx.lineTo(W - pad, PY(0)); ctx.stroke();
      // best-fit line y = r x (standardized)
      ctx.strokeStyle = primary; ctx.lineWidth = 2; ctx.setLineDash([6, 5]); ctx.beginPath(); ctx.moveTo(PX(-lim), PY(-lim * r)); ctx.lineTo(PX(lim), PY(lim * r)); ctx.stroke(); ctx.setLineDash([]);
      // points
      ctx.fillStyle = muted; ctx.globalAlpha = 0.75;
      pts.forEach(function (p) { ctx.beginPath(); ctx.arc(PX(p.x), PY(p.y), 3, 0, 7); ctx.fill(); });
      ctx.globalAlpha = 1;
      if (readout) readout.innerHTML = "correlation ρ = " + r.toFixed(2) + " &nbsp;·&nbsp; covariance is " +
        (r > 0.05 ? "<strong>positive</strong> (cloud tilts up-right)" : r < -0.05 ? "<strong>negative</strong> (tilts down-right)" : "<strong>≈ 0</strong> (round blob, no linear link)") +
        " &nbsp;·&nbsp; ρ = Cov(X,Y) / (σ_X σ_Y) ∈ [−1, 1]";
    }
    rI.addEventListener("input", function () { rV.textContent = (+rI.value).toFixed(2); draw(); });
    rV.textContent = (+rI.value).toFixed(2); draw();
    window.__onThemeChange = draw;
    window.addEventListener("resize", function () { clearTimeout(window.__scT); window.__scT = setTimeout(draw, 150); });
  }
  window.GATE_VIZ_INIT = init;
})();
