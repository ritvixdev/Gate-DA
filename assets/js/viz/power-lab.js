/* power-lab.js — Type I / Type II error and power.
   H0 ~ N(0,1) vs H1 ~ N(d,1); a critical line from alpha. Shades alpha (false alarm),
   beta (miss) and power = 1 - beta. Sliders: effect size d; presets: alpha. Mounts on #power-lab. */
(function () {
  "use strict";
  function init() {
    var canvas = document.getElementById("power-lab");
    if (!canvas || !window.VizChart) return;
    var readout = document.getElementById("power-lab-readout");
    var ZCRIT = { "0.10": 1.2816, "0.05": 1.6449, "0.01": 2.3263 };
    var alpha = 0.05, d = 2.5;
    function erf(x) { var s = x < 0 ? -1 : 1; x = Math.abs(x); var t = 1 / (1 + 0.3275911 * x); var y = 1 - (((((1.061405429 * t - 1.453152027) * t) + 1.421413741) * t - 0.284496736) * t + 0.254829592) * t * Math.exp(-x * x); return s * y; }
    function Phi(z) { return 0.5 * (1 + erf(z / Math.SQRT2)); }
    function pdf(x, mu) { return Math.exp(-0.5 * (x - mu) * (x - mu)) / Math.sqrt(2 * Math.PI); }

    function draw() {
      var s = VizChart.setup(canvas), ctx = s.ctx, W = s.w, H = s.h, pad = 34;
      var zc = ZCRIT["" + alpha.toFixed(2)], beta = Phi(zc - d), power = 1 - beta;
      var muted = VizChart.css("--muted", "#6c6a64"), ink = VizChart.css("--ink", "#141413"),
          primary = VizChart.css("--primary", "#cc785c"), grid = VizChart.css("--viz-grid", "#e6dfd8");
      var xlo = -4, xhi = d + 4, ymax = 0.43;
      function PX(x) { return pad + (x - xlo) / (xhi - xlo) * (W - 2 * pad); }
      function PY(y) { return (H - pad) - y / ymax * (H - 2 * pad); }
      ctx.clearRect(0, 0, W, H);
      ctx.strokeStyle = grid; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(pad, H - pad); ctx.lineTo(W - pad, H - pad); ctx.stroke();
      function region(mu, a, b, fill) {
        ctx.beginPath(); ctx.moveTo(PX(a), PY(0));
        for (var x = a; x <= b; x += (b - a) / 60) ctx.lineTo(PX(x), PY(pdf(x, mu)));
        ctx.lineTo(PX(b), PY(0)); ctx.closePath(); ctx.fillStyle = fill; ctx.fill();
      }
      region(0, zc, xhi, "rgba(199,84,70,0.45)");          // alpha (Type I)
      region(d, xlo, zc, "rgba(110,130,200,0.40)");        // beta (Type II)
      region(d, zc, xhi, "rgba(93,184,166,0.45)");         // power
      function curve(mu, color) { ctx.strokeStyle = color; ctx.lineWidth = 2.5; ctx.beginPath(); for (var x = xlo; x <= xhi; x += (xhi - xlo) / 240) { var px = PX(x), py = PY(pdf(x, mu)); if (x === xlo) ctx.moveTo(px, py); else ctx.lineTo(px, py); } ctx.stroke(); }
      curve(0, muted); curve(d, primary);
      ctx.strokeStyle = ink; ctx.lineWidth = 1.5; ctx.setLineDash([5, 4]); ctx.beginPath(); ctx.moveTo(PX(zc), pad); ctx.lineTo(PX(zc), H - pad); ctx.stroke(); ctx.setLineDash([]);
      ctx.fillStyle = muted; ctx.font = "11px ui-monospace, monospace"; ctx.textAlign = "center";
      ctx.fillText("H₀", PX(0), PY(pdf(0, 0)) - 6); ctx.fillStyle = primary; ctx.fillText("H₁", PX(d), PY(pdf(d, d)) - 6);
      ctx.fillStyle = ink; ctx.fillText("critical", PX(zc), pad - 2);
      if (readout) readout.innerHTML = "<span style='color:rgb(199,84,70)'><strong>α (Type I)</strong> = " + alpha.toFixed(2) + "</span> &nbsp;·&nbsp; " +
        "<span style='color:rgb(110,130,200)'><strong>β (Type II)</strong> = " + beta.toFixed(2) + "</span> &nbsp;·&nbsp; " +
        "<span style='color:rgb(70,160,140)'><strong>power = 1 − β = " + power.toFixed(2) + "</strong></span> &nbsp;·&nbsp; bigger effect or higher α ⇒ more power";
    }

    var pa = document.getElementById("pw-d"), pav = document.getElementById("pw-d-val");
    if (pa) { pa.addEventListener("input", function () { d = parseFloat(pa.value); if (pav) pav.textContent = d.toFixed(1); draw(); }); if (pav) pav.textContent = d.toFixed(1); }
    [["pw-10", 0.10], ["pw-05", 0.05], ["pw-01", 0.01]].forEach(function (p) {
      var b = document.getElementById(p[0]); if (b) b.addEventListener("click", function () { alpha = p[1]; ["pw-10", "pw-05", "pw-01"].forEach(function (id) { var e = document.getElementById(id); if (e) e.classList.toggle("active", id === p[0]); }); draw(); });
    });
    window.__onThemeChange = (function (prev) { return function (t) { if (typeof prev === "function") prev(t); draw(); }; })(window.__onThemeChange);
    window.addEventListener("resize", function () { clearTimeout(window.__pwT); window.__pwT = setTimeout(draw, 150); });
    draw();
  }
  var prev = window.GATE_VIZ_INIT;
  window.GATE_VIZ_INIT = function () { if (typeof prev === "function") prev(); init(); };
})();
