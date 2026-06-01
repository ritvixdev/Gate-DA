/* surface3d-lab.js — 3D surface f(x,y) for Multivariate Optimization.
   Rotatable bowl (min) / dome (max) / saddle. The critical point at the origin is
   marked; the readout names the Hessian sign pattern. Mounts on #surface3d-lab. */
(function () {
  "use strict";
  var F = {
    bowl:   function (x, y) { return 0.45 * (x * x + y * y); },
    dome:   function (x, y) { return -0.45 * (x * x + y * y); },
    saddle: function (x, y) { return 0.45 * (x * x - y * y); }
  };
  var META = {
    bowl:   ["Bowl (convex)", "Hessian H ≻ 0 (positive-definite) → <strong>local minimum</strong>"],
    dome:   ["Dome (concave)", "Hessian H ≺ 0 (negative-definite) → <strong>local maximum</strong>"],
    saddle: ["Saddle", "Hessian H is <strong>indefinite</strong> → <strong>saddle point</strong> (min one way, max the other)"]
  };
  window.__vizInit = window.__vizInit || [];
  window.__vizRedraw = window.__vizRedraw || [];
  window.__vizInit.push(function () {
    var canvas = document.getElementById("surface3d-lab");
    if (!canvas || !window.Scene3D) return;
    var readout = document.getElementById("surface3d-lab-readout");
    var preset = "bowl";

    function draw(api) {
      var ctx = api.ctx;
      api.drawAxes(2.2);
      var f = F[preset], N = 13, lo = -2, hi = 2, step = (hi - lo) / N;
      var primary = api.css("--primary", "#cc785c"), teal = api.css("--teal", "#5db8a6"), grid = api.css("--viz-grid", "#e6dfd8");
      var quads = [];
      for (var i = 0; i < N; i++) for (var j = 0; j < N; j++) {
        var x0 = lo + i * step, x1 = x0 + step, y0 = lo + j * step, y1 = y0 + step;
        var corners = [[x0, f(x0, y0), y0], [x1, f(x1, y0), y0], [x1, f(x1, y1), y1], [x0, f(x0, y1), y1]];
        var pts = corners.map(api.to2d);
        var depth = (pts[0].depth + pts[1].depth + pts[2].depth + pts[3].depth) / 4;
        var h = (corners[0][1] + corners[1][1] + corners[2][1] + corners[3][1]) / 4;
        quads.push({ pts: pts, depth: depth, h: h });
      }
      quads.sort(function (a, b) { return a.depth - b.depth; });   // far first
      quads.forEach(function (q) {
        var t = Math.max(0, Math.min(1, (q.h + 2) / 4));
        ctx.beginPath(); ctx.moveTo(q.pts[0].x, q.pts[0].y);
        for (var k = 1; k < 4; k++) ctx.lineTo(q.pts[k].x, q.pts[k].y);
        ctx.closePath();
        ctx.globalAlpha = 0.32 + 0.5 * t; ctx.fillStyle = primary; ctx.fill();
        ctx.globalAlpha = 0.5; ctx.strokeStyle = grid; ctx.lineWidth = 1; ctx.stroke();
        ctx.globalAlpha = 1;
      });
      // critical point at the origin
      var o = api.to2d([0, F[preset](0, 0), 0]);
      ctx.fillStyle = teal; ctx.beginPath(); ctx.arc(o.x, o.y, 5, 0, 7); ctx.fill();
      if (readout) readout.innerHTML = "<strong>" + META[preset][0] + "</strong> &nbsp;·&nbsp; " + META[preset][1] +
        " &nbsp;·&nbsp; teal dot = critical point &nbsp;·&nbsp; drag to rotate";
    }

    var sc = window.Scene3D.attach(canvas, draw, { range: 2.4, yaw: 0.7, pitch: 0.5 });
    function setPreset(p) {
      preset = p;
      ["bowl", "dome", "saddle"].forEach(function (k) {
        var b = document.getElementById("s3-" + k); if (b) b.classList.toggle("active", k === p);
      });
      sc.render();
    }
    ["bowl", "dome", "saddle"].forEach(function (k) {
      var b = document.getElementById("s3-" + k); if (b) b.addEventListener("click", function () { setPreset(k); });
    });
    window.__vizRedraw.push(function () { sc.render(); });
    setPreset("bowl");
  });
})();
