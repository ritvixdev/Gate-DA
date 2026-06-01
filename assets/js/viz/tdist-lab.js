/* t vs Normal lab (second lab on z/t-tests): overlay the standard normal and Student's t.
   Lower df → heavier tails; as df grows, t → normal. Both normalized numerically (no Γ needed). */
(function () {
  "use strict";
  function init() {
    var canvas = document.getElementById("tdist-lab");
    if (!canvas || !window.VizChart) return;
    var readout = document.getElementById("tdist-lab-readout");
    var dfI = document.getElementById("td-df"), dfV = document.getElementById("td-df-val");
    var lo = -5, hi = 5;
    function normShape(x) { return Math.exp(-x * x / 2); }
    function tShape(x, df) { return Math.pow(1 + x * x / df, -(df + 1) / 2); }
    function normalize(fn) { var area = 0, vals = [], M = 400; for (var i = 0; i <= M; i++) { var x = lo + (hi - lo) * i / M, v = fn(x); vals.push(v); area += v * (hi - lo) / M; } return vals.map(function (v) { return v / area; }); }
    function draw() {
      var s = VizChart.setup(canvas), ctx = s.ctx, W = s.w, H = s.h, pad = 30, M = 400;
      var df = parseInt(dfI.value, 10);
      var nv = normalize(normShape), tv = normalize(function (x) { return tShape(x, df); });
      var ymax = Math.max.apply(null, nv) * 1.12;
      function PX(x) { return pad + (x - lo) / (hi - lo) * (W - 2 * pad); }
      function PY(y) { return (H - pad) - y / ymax * (H - 2 * pad); }
      var axis = VizChart.css("--viz-axis", "#9b948a"), accent = VizChart.css("--accent3", "#a78bfa"), primary = VizChart.css("--primary", "#cc785c"), muted = VizChart.css("--muted", "#6c6a64");
      ctx.clearRect(0, 0, W, H);
      ctx.strokeStyle = axis; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(pad, PY(0)); ctx.lineTo(W - pad, PY(0)); ctx.stroke();
      function curve(vals, color, w, dash) { ctx.strokeStyle = color; ctx.lineWidth = w; ctx.setLineDash(dash || []); ctx.beginPath(); for (var i = 0; i <= M; i++) { var x = lo + (hi - lo) * i / M, px = PX(x), py = PY(vals[i]); if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py); } ctx.stroke(); ctx.setLineDash([]); }
      curve(nv, muted, 2, [5, 4]);   // normal (reference)
      curve(tv, primary, 2.5);       // t
      ctx.fillStyle = muted; ctx.font = "11px ui-monospace, monospace"; ctx.textAlign = "left";
      ctx.fillText("dashed = standard normal", pad + 4, 6);
      ctx.fillStyle = primary; ctx.fillText("solid = t (df=" + df + ")", pad + 4, 20);
      if (readout) readout.innerHTML = "Student's t with df = " + df + " &nbsp;·&nbsp; " +
        (df <= 5 ? "<strong>heavier tails</strong> than normal (more probability in the extremes — extra uncertainty from estimating σ with s)"
                 : df >= 30 ? "<strong>almost identical</strong> to the normal — at large df, t → z"
                            : "tails still a bit heavier than normal; converging as df grows");
    }
    dfI.addEventListener("input", function () { dfV.textContent = dfI.value; draw(); });
    dfV.textContent = dfI.value;
    var prevT = window.__onThemeChange; window.__onThemeChange = function (t) { if (typeof prevT === "function") prevT(t); draw(); };
    window.addEventListener("resize", function () { clearTimeout(window.__tdT); window.__tdT = setTimeout(draw, 150); });
    draw();
  }
  var prev = window.GATE_VIZ_INIT;
  window.GATE_VIZ_INIT = function () { if (typeof prev === "function") prev(); init(); };
})();
