/* Least-squares regression lab: scatter points, an adjustable line (slope/intercept),
   residual segments, and live SSE. "Best fit" snaps to the least-squares solution. */
(function () {
  "use strict";
  function init() {
    var canvas = document.getElementById("regression-lab");
    if (!canvas || !window.VizChart) return;
    var readout = document.getElementById("regression-lab-readout");
    var sl = document.getElementById("reg-slope"), slv = document.getElementById("reg-slope-val");
    var it = document.getElementById("reg-int"), itv = document.getElementById("reg-int-val");
    var pts = [];
    function gen() {
      pts = []; var a = 1 + Math.random() * 2, b = 1 + Math.random() * 4;
      for (var i = 0; i < 12; i++) { var x = 0.5 + i * 0.8; pts.push({ x: x, y: a * x + b + (Math.random() - 0.5) * 5 }); }
      draw();
    }
    function fit() {
      var n = pts.length, sx = 0, sy = 0; pts.forEach(function (p) { sx += p.x; sy += p.y; });
      var mx = sx / n, my = sy / n, num = 0, den = 0;
      pts.forEach(function (p) { num += (p.x - mx) * (p.y - my); den += (p.x - mx) * (p.x - mx); });
      var b1 = num / den, b0 = my - b1 * mx;
      return { b0: b0, b1: b1 };
    }
    function sse(b0, b1) { var s = 0; pts.forEach(function (p) { var e = p.y - (b0 + b1 * p.x); s += e * e; }); return s; }
    function draw() {
      var s = VizChart.setup(canvas), ctx = s.ctx, W = s.w, H = s.h, pad = 34;
      var b1 = parseFloat(sl.value), b0 = parseFloat(it.value);
      slv.textContent = b1.toFixed(1); itv.textContent = b0.toFixed(1);
      var xmax = 10, ys = pts.map(function (p) { return p.y; }), ymin = Math.min.apply(null, ys.concat([0])), ymax = Math.max.apply(null, ys.concat([b0 + b1 * xmax]));
      ymin -= 2; ymax += 2;
      function PX(x) { return pad + x / xmax * (W - 2 * pad); }
      function PY(y) { return (H - pad) - (y - ymin) / (ymax - ymin) * (H - 2 * pad); }
      var grid = VizChart.css("--viz-grid", "#e6dfd8"), primary = VizChart.css("--primary", "#cc785c"), teal = VizChart.css("--teal", "#5db8a6"), muted = VizChart.css("--muted", "#6c6a64");
      ctx.clearRect(0, 0, W, H);
      ctx.strokeStyle = grid; ctx.beginPath(); ctx.moveTo(pad, H - pad); ctx.lineTo(W - pad, H - pad); ctx.moveTo(pad, pad); ctx.lineTo(pad, H - pad); ctx.stroke();
      // residuals
      ctx.strokeStyle = muted; ctx.globalAlpha = 0.5;
      pts.forEach(function (p) { ctx.beginPath(); ctx.moveTo(PX(p.x), PY(p.y)); ctx.lineTo(PX(p.x), PY(b0 + b1 * p.x)); ctx.stroke(); });
      ctx.globalAlpha = 1;
      // line
      ctx.strokeStyle = teal; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(PX(0), PY(b0)); ctx.lineTo(PX(xmax), PY(b0 + b1 * xmax)); ctx.stroke();
      // points
      ctx.fillStyle = primary; pts.forEach(function (p) { ctx.beginPath(); ctx.arc(PX(p.x), PY(p.y), 5, 0, 7); ctx.fill(); });
      if (readout) {
        var best = fit(), bestSSE = sse(best.b0, best.b1), yourSSE = sse(b0, b1);
        readout.innerHTML = "your line: y = " + b1.toFixed(2) + "x + " + b0.toFixed(2) +
          " &nbsp;·&nbsp; SSE = " + yourSSE.toFixed(1) +
          " &nbsp;·&nbsp; <strong>best (least-squares) SSE = " + bestSSE.toFixed(1) + "</strong>";
      }
    }
    sl.addEventListener("input", draw); it.addEventListener("input", draw);
    document.getElementById("reg-best").addEventListener("click", function () { var f = fit(); sl.value = f.b1.toFixed(1); it.value = f.b0.toFixed(1); draw(); });
    document.getElementById("reg-new").addEventListener("click", gen);
    gen();
    window.__onThemeChange = draw;
    window.addEventListener("resize", function () { clearTimeout(window.__rgT); window.__rgT = setTimeout(draw, 150); });
  }
  window.GATE_VIZ_INIT = init;
})();
