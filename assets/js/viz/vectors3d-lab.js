/* vectors3d-lab.js — two vectors in ℝ³ and the plane they span.
   Slide v₂'s components; when v₂ becomes a multiple of v₁ the span collapses from a
   plane to a line (dependent). Drag to rotate. Mounts on #vectors3d-lab. */
(function () {
  "use strict";
  window.__vizInit = window.__vizInit || [];
  window.__vizRedraw = window.__vizRedraw || [];
  window.__vizInit.push(function () {
    var canvas = document.getElementById("vectors3d-lab");
    if (!canvas || !window.Scene3D) return;
    var readout = document.getElementById("vectors3d-lab-readout");
    var v1 = [1.6, 0, 1.2];
    var ctrl = { x: 0, y: 1.6, z: 1.0 };
    function v2() { return [ctrl.x, ctrl.y, ctrl.z]; }
    function cross(a, b) { return [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]; }
    function norm(a) { return Math.hypot(a[0], a[1], a[2]); }

    function arrow(api, vec, color, label) {
      var ctx = api.ctx, o = api.to2d([0, 0, 0]), t = api.to2d(vec);
      ctx.strokeStyle = color; ctx.fillStyle = color; ctx.lineWidth = 3;
      ctx.beginPath(); ctx.moveTo(o.x, o.y); ctx.lineTo(t.x, t.y); ctx.stroke();
      ctx.beginPath(); ctx.arc(t.x, t.y, 4, 0, 7); ctx.fill();
      ctx.font = "12px ui-monospace, monospace"; ctx.fillText(label, t.x + 6, t.y - 4);
    }

    function draw(api) {
      var ctx = api.ctx;
      api.drawAxes(2.0);
      var w = v2(), c = cross(v1, w), dependent = norm(c) < 0.18 * norm(v1) * (norm(w) || 1);
      var teal = api.css("--teal", "#5db8a6"), grid = api.css("--viz-grid", "#e6dfd8"),
          primary = api.css("--primary", "#cc785c"), amber = api.css("--amber", "#e8a55a");
      if (!dependent) {                                  // span = plane: tile a parallelogram
        var quads = [], R = 1.3, M = 7, step = (2 * R) / M;
        for (var i = 0; i < M; i++) for (var j = 0; j < M; j++) {
          var a0 = -R + i * step, a1 = a0 + step, b0 = -R + j * step, b1 = b0 + step;
          function P(a, b) { return [a * v1[0] + b * w[0], a * v1[1] + b * w[1], a * v1[2] + b * w[2]]; }
          var pts = [P(a0, b0), P(a1, b0), P(a1, b1), P(a0, b1)].map(api.to2d);
          quads.push({ pts: pts, depth: (pts[0].depth + pts[2].depth) / 2 });
        }
        quads.sort(function (p, q) { return p.depth - q.depth; });
        quads.forEach(function (q) {
          ctx.beginPath(); ctx.moveTo(q.pts[0].x, q.pts[0].y);
          for (var k = 1; k < 4; k++) ctx.lineTo(q.pts[k].x, q.pts[k].y);
          ctx.closePath();
          ctx.globalAlpha = 0.18; ctx.fillStyle = teal; ctx.fill();
          ctx.globalAlpha = 0.4; ctx.strokeStyle = grid; ctx.lineWidth = 1; ctx.stroke();
          ctx.globalAlpha = 1;
        });
      } else {                                           // span = line through v1
        var s1 = api.to2d([-2 * v1[0], -2 * v1[1], -2 * v1[2]]), s2 = api.to2d([2 * v1[0], 2 * v1[1], 2 * v1[2]]);
        ctx.strokeStyle = teal; ctx.lineWidth = 2; ctx.setLineDash([5, 4]);
        ctx.beginPath(); ctx.moveTo(s1.x, s1.y); ctx.lineTo(s2.x, s2.y); ctx.stroke(); ctx.setLineDash([]);
      }
      arrow(api, v1, primary, "v₁");
      arrow(api, w, amber, "v₂");
      if (readout) readout.innerHTML = dependent
        ? "v₂ is (nearly) a multiple of v₁ &rArr; <strong>linearly dependent</strong> — the span collapses to a <strong>line</strong>."
        : "v₁ and v₂ point in different directions &rArr; <strong>independent</strong> — their span is a <strong>plane</strong> through the origin.";
    }

    var sc = window.Scene3D.attach(canvas, draw, { range: 2.2, yaw: 0.7, pitch: 0.4 });
    ["x", "y", "z"].forEach(function (k) {
      var el = document.getElementById("v3-" + k), out = document.getElementById("v3-" + k + "-val");
      if (!el) return;
      if (out) out.textContent = parseFloat(el.value).toFixed(1);
      el.addEventListener("input", function () { ctrl[k] = parseFloat(el.value); if (out) out.textContent = ctrl[k].toFixed(1); sc.render(); });
      ctrl[k] = parseFloat(el.value);
    });
    window.__vizRedraw.push(function () { sc.render(); });
    sc.render();
  });
})();
