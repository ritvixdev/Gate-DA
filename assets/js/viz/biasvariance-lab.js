/* Bias–variance lab: as model complexity rises, bias² falls and variance rises;
   total error = bias² + variance + noise is U-shaped. Slider picks complexity; marker shows the sweet spot. */
(function () {
  "use strict";
  function init() {
    var canvas = document.getElementById("biasvariance-lab");
    if (!canvas || !window.VizChart) return;
    var readout = document.getElementById("biasvariance-lab-readout");
    var cI = document.getElementById("bv-c"), cV = document.getElementById("bv-c-val");
    var lo = 0, hi = 10, noise = 0.6;
    function bias2(c) { return 4 * Math.exp(-0.45 * c); }       // high when simple
    function varc(c) { return 0.12 * Math.exp(0.32 * c) - 0.12; } // high when complex
    function total(c) { return bias2(c) + varc(c) + noise; }
    function draw() {
      var s = VizChart.setup(canvas), ctx = s.ctx, W = s.w, H = s.h, pad = 36;
      var ymax = 0; for (var t = lo; t <= hi; t += 0.2) { var v = total(t); if (v > ymax) ymax = v; } ymax *= 1.05;
      function PX(c) { return pad + (c - lo) / (hi - lo) * (W - 2 * pad); }
      function PY(y) { return (H - pad) - y / ymax * (H - 2 * pad); }
      var grid = VizChart.css("--viz-grid", "#e6dfd8"), axis = VizChart.css("--viz-axis", "#9b948a");
      var muted = VizChart.css("--muted", "#6c6a64"), primary = VizChart.css("--primary", "#cc785c"),
          accent = VizChart.css("--accent3", "#a78bfa"), ok = VizChart.css("--accent2", "#3a9");
      ctx.clearRect(0, 0, W, H);
      ctx.strokeStyle = grid; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(pad, H - pad); ctx.lineTo(W - pad, H - pad); ctx.moveTo(pad, pad); ctx.lineTo(pad, H - pad); ctx.stroke();
      function curve(fn, color, dash) {
        ctx.strokeStyle = color; ctx.lineWidth = 2; ctx.setLineDash(dash || []); ctx.beginPath();
        for (var k = 0; k <= 120; k++) { var c = lo + (hi - lo) * k / 120, px = PX(c), py = PY(fn(c)); if (k === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py); }
        ctx.stroke(); ctx.setLineDash([]);
      }
      curve(bias2, accent, [5, 4]);   // bias²
      curve(varc, ok, [5, 4]);        // variance
      curve(total, primary);          // total
      // optimum (min total) — golden search-ish scan
      var best = lo, bv = Infinity; for (var c = lo; c <= hi; c += 0.02) { var v = total(c); if (v < bv) { bv = v; best = c; } }
      ctx.strokeStyle = muted; ctx.setLineDash([3, 3]); ctx.beginPath(); ctx.moveTo(PX(best), pad); ctx.lineTo(PX(best), H - pad); ctx.stroke(); ctx.setLineDash([]);
      // chosen complexity marker
      var cc = parseFloat(cI.value);
      ctx.fillStyle = primary; ctx.beginPath(); ctx.arc(PX(cc), PY(total(cc)), 6, 0, 7); ctx.fill();
      // labels
      ctx.fillStyle = muted; ctx.font = "11px ui-monospace, monospace"; ctx.textAlign = "center"; ctx.textBaseline = "top";
      ctx.fillText("← simple (underfit)        complexity        (overfit) complex →", W / 2, H - pad + 6);
      if (readout) {
        var region = cc < best - 1.2 ? "underfitting (high bias)" : cc > best + 1.2 ? "overfitting (high variance)" : "good fit (balanced)";
        readout.innerHTML = "complexity = " + cc.toFixed(1) + " &nbsp;·&nbsp; bias² = " + bias2(cc).toFixed(2) +
          " &nbsp;·&nbsp; variance = " + varc(cc).toFixed(2) + " &nbsp;·&nbsp; total ≈ " + total(cc).toFixed(2) +
          " &nbsp;·&nbsp; <strong>" + region + "</strong> &nbsp;(sweet spot ≈ " + best.toFixed(1) + ")";
      }
    }
    cI.addEventListener("input", function () { cV.textContent = (+cI.value).toFixed(1); draw(); });
    cV.textContent = (+cI.value).toFixed(1); draw();
    window.__onThemeChange = draw;
    window.addEventListener("resize", function () { clearTimeout(window.__bvT); window.__bvT = setTimeout(draw, 150); });
  }
  window.GATE_VIZ_INIT = init;
})();
