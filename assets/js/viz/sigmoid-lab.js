/* Logistic-regression sigmoid lab: p = 1/(1+e^-(w x + b)).
   Sliders move the steepness (w) and shift (b); a threshold line shows the decision boundary. */
(function () {
  "use strict";
  function init() {
    var canvas = document.getElementById("sigmoid-lab");
    if (!canvas || !window.VizChart) return;
    var readout = document.getElementById("sigmoid-lab-readout");
    var wI = document.getElementById("sig-w"), wV = document.getElementById("sig-w-val");
    var bI = document.getElementById("sig-b"), bV = document.getElementById("sig-b-val");
    var tI = document.getElementById("sig-t"), tV = document.getElementById("sig-t-val");
    var lo = -8, hi = 8;
    function sig(z) { return 1 / (1 + Math.exp(-z)); }
    function draw() {
      var s = VizChart.setup(canvas), ctx = s.ctx, W = s.w, H = s.h, pad = 36;
      var w = parseFloat(wI.value), b = parseFloat(bI.value), thr = parseFloat(tI.value);
      var grid = VizChart.css("--viz-grid", "#e6dfd8"), axis = VizChart.css("--viz-axis", "#9b948a");
      var accent = VizChart.css("--accent3", "#a78bfa"), primary = VizChart.css("--primary", "#cc785c"), muted = VizChart.css("--muted", "#6c6a64");
      function PX(x) { return pad + (x - lo) / (hi - lo) * (W - 2 * pad); }
      function PY(y) { return (H - pad) - y * (H - 2 * pad); }
      ctx.clearRect(0, 0, W, H);
      // gridlines y=0,0.5,1
      ctx.strokeStyle = grid; ctx.lineWidth = 1; ctx.fillStyle = muted; ctx.font = "11px ui-monospace, monospace";
      [0, 0.5, 1].forEach(function (yv) { var py = PY(yv); ctx.beginPath(); ctx.moveTo(pad, py); ctx.lineTo(W - pad, py); ctx.stroke(); ctx.textAlign = "right"; ctx.textBaseline = "middle"; ctx.fillText(yv.toFixed(1), pad - 5, py); });
      // x axis (z=0 vertical)
      ctx.strokeStyle = axis; ctx.beginPath(); ctx.moveTo(PX(0), pad); ctx.lineTo(PX(0), H - pad); ctx.stroke();
      // threshold line
      ctx.strokeStyle = muted; ctx.setLineDash([5, 4]); ctx.beginPath(); ctx.moveTo(pad, PY(thr)); ctx.lineTo(W - pad, PY(thr)); ctx.stroke(); ctx.setLineDash([]);
      // sigmoid curve
      ctx.strokeStyle = accent; ctx.lineWidth = 2.5; ctx.beginPath();
      for (var k = 0; k <= 160; k++) { var x = lo + (hi - lo) * k / 160, p = sig(w * x + b); var px = PX(x), py = PY(p); if (k === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py); }
      ctx.stroke();
      // decision boundary x* where w x + b = logit(thr)
      var xb = (Math.log(thr / (1 - thr)) - b) / (w || 1e-9);
      if (xb > lo && xb < hi) {
        ctx.strokeStyle = primary; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(PX(xb), pad); ctx.lineTo(PX(xb), H - pad); ctx.stroke();
        ctx.fillStyle = primary; ctx.beginPath(); ctx.arc(PX(xb), PY(thr), 5, 0, 7); ctx.fill();
      }
      if (readout) readout.innerHTML = "p = 1 / (1 + e^&minus;(" + w.toFixed(1) + "x + " + b.toFixed(1) + "))" +
        " &nbsp;·&nbsp; threshold " + thr.toFixed(2) +
        " &nbsp;·&nbsp; decision boundary x* = " + (isFinite(xb) ? xb.toFixed(2) : "–") +
        " &nbsp;·&nbsp; predict 1 when " + (w >= 0 ? "x > x*" : "x < x*");
    }
    [wI, bI, tI].forEach(function (el) { el.addEventListener("input", function () { wV.textContent = (+wI.value).toFixed(1); bV.textContent = (+bI.value).toFixed(1); tV.textContent = (+tI.value).toFixed(2); draw(); }); });
    wV.textContent = (+wI.value).toFixed(1); bV.textContent = (+bI.value).toFixed(1); tV.textContent = (+tI.value).toFixed(2);
    draw();
    window.__onThemeChange = draw;
    window.addEventListener("resize", function () { clearTimeout(window.__sigT); window.__sigT = setTimeout(draw, 150); });
  }
  window.GATE_VIZ_INIT = init;
})();
