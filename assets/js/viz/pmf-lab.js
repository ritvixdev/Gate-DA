/* Random-variable lab: a PMF as bars, with the mean E[X] drawn as the balance point
   and ±SD shown. Switch the distribution to see how E[X] and spread change. */
(function () {
  "use strict";
  var DIST = {
    die: { xs: [1, 2, 3, 4, 5, 6], ps: [1 / 6, 1 / 6, 1 / 6, 1 / 6, 1 / 6, 1 / 6], name: "Fair die" },
    skew: { xs: [0, 1, 2, 3, 4], ps: [0.40, 0.30, 0.15, 0.10, 0.05], name: "Right-skewed" },
    two: { xs: [0, 2], ps: [0.5, 0.5], name: "Two-point (0/2)" },
  };
  function init() {
    var canvas = document.getElementById("pmf-lab");
    if (!canvas || !window.VizChart) return;
    var readout = document.getElementById("pmf-lab-readout");
    var key = "die";
    function draw() {
      var s = VizChart.setup(canvas), ctx = s.ctx, W = s.w, H = s.h, pad = 34;
      var D = DIST[key], xs = D.xs, ps = D.ps;
      var lo = Math.min.apply(null, xs) - 0.7, hi = Math.max.apply(null, xs) + 0.7;
      var pmax = Math.max.apply(null, ps) * 1.2;
      var EX = 0; xs.forEach(function (x, i) { EX += x * ps[i]; });
      var EX2 = 0; xs.forEach(function (x, i) { EX2 += x * x * ps[i]; });
      var sd = Math.sqrt(Math.max(0, EX2 - EX * EX));
      var grid = VizChart.css("--viz-grid", "#e6dfd8"), axis = VizChart.css("--viz-axis", "#9b948a"),
          accent = VizChart.css("--accent3", "#a78bfa"), primary = VizChart.css("--primary", "#cc785c"), muted = VizChart.css("--muted", "#6c6a64");
      var base = H - pad - 16;
      function PX(x) { return pad + (x - lo) / (hi - lo) * (W - 2 * pad); }
      function PY(p) { return base - p / pmax * (base - pad); }
      ctx.clearRect(0, 0, W, H);
      // baseline (the "beam")
      ctx.strokeStyle = axis; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(pad, base); ctx.lineTo(W - pad, base); ctx.stroke();
      // bars
      var bw = Math.min(46, (W - 2 * pad) / xs.length * 0.5);
      ctx.font = "11px ui-monospace, monospace"; ctx.textAlign = "center";
      xs.forEach(function (x, i) {
        ctx.fillStyle = accent; ctx.fillRect(PX(x) - bw / 2, PY(ps[i]), bw, base - PY(ps[i]));
        ctx.fillStyle = muted; ctx.fillText(String(x), PX(x), base + 6);
        ctx.fillText(ps[i].toFixed(2), PX(x), PY(ps[i]) - 12);
      });
      // ±SD bracket
      ctx.strokeStyle = muted; ctx.setLineDash([4, 4]); ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.moveTo(PX(EX - sd), base + 14); ctx.lineTo(PX(EX + sd), base + 14); ctx.stroke(); ctx.setLineDash([]);
      // balance-point triangle at E[X]
      ctx.fillStyle = primary; ctx.beginPath(); ctx.moveTo(PX(EX), base); ctx.lineTo(PX(EX) - 9, base + 14); ctx.lineTo(PX(EX) + 9, base + 14); ctx.closePath(); ctx.fill();
      ctx.fillStyle = primary; ctx.fillText("E[X]=" + EX.toFixed(2), PX(EX), base + 18);
      if (readout) readout.innerHTML = "<strong>" + D.name + "</strong> &nbsp;·&nbsp; E[X] = " + EX.toFixed(2) +
        " &nbsp;·&nbsp; Var = E[X²]−(E[X])² = " + (EX2 - EX * EX).toFixed(2) + " &nbsp;·&nbsp; SD = " + sd.toFixed(2) +
        " &nbsp;·&nbsp; the mean is the balance point of the bars";
    }
    function set(k, btn) { key = k; var b = btn.parentElement.querySelectorAll(".preset-btn"); for (var i = 0; i < b.length; i++) b[i].classList.remove("active"); btn.classList.add("active"); draw(); }
    document.getElementById("pmf-die").addEventListener("click", function () { set("die", this); });
    document.getElementById("pmf-skew").addEventListener("click", function () { set("skew", this); });
    document.getElementById("pmf-two").addEventListener("click", function () { set("two", this); });
    draw(); window.__onThemeChange = draw;
    window.addEventListener("resize", function () { clearTimeout(window.__pmfT); window.__pmfT = setTimeout(draw, 150); });
  }
  window.GATE_VIZ_INIT = init;
})();
