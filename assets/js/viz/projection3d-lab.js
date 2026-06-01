/* projection3d-lab.js — projecting a vector b onto a plane (2D subspace) in 3D.
   p = b − (b·n̂)n̂ lies in the plane; the dashed segment b−p is the perpendicular
   "shadow drop". Slide b's components; drag to rotate. Mounts on #projection3d-lab. */
(function () {
  "use strict";
  function dot(a, b) { return a[0] * b[0] + a[1] * b[1] + a[2] * b[2]; }
  function cross(a, b) { return [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]; }
  function nrm(a) { var L = Math.hypot(a[0], a[1], a[2]) || 1; return [a[0] / L, a[1] / L, a[2] / L]; }
  function add(a, b, s) { return [a[0] + b[0] * s, a[1] + b[1] * s, a[2] + b[2] * s]; }
  window.__vizInit = window.__vizInit || [];
  window.__vizRedraw = window.__vizRedraw || [];
  window.__vizInit.push(function () {
    var canvas = document.getElementById("projection3d-lab");
    if (!canvas || !window.Scene3D) return;
    var readout = document.getElementById("projection3d-lab-readout");
    var n = nrm([0.35, 0.5, 1]);                       // plane normal (plane through origin)
    var ctrl = { x: 1.3, y: -0.4, z: 1.4 };
    function b() { return [ctrl.x, ctrl.y, ctrl.z]; }

    function draw(api) {
      var ctx = api.ctx; api.drawAxes(2.0);
      var primary = api.css("--primary", "#cc785c"), teal = api.css("--teal", "#5db8a6"),
          muted = api.css("--muted", "#6c6a64"), grid = api.css("--viz-grid", "#e6dfd8");
      // plane (tile)
      var seed = Math.abs(n[0]) < 0.9 ? [1, 0, 0] : [0, 1, 0];
      var u = nrm(cross(n, seed)), v = nrm(cross(n, u));
      var quads = [], R = 1.7, M = 7, step = (2 * R) / M;
      for (var i = 0; i < M; i++) for (var j = 0; j < M; j++) {
        function P(s, t) { return add(add([0, 0, 0], u, s), v, t); }
        var s0 = -R + i * step, s1 = s0 + step, t0 = -R + j * step, t1 = t0 + step;
        var q = [P(s0, t0), P(s1, t0), P(s1, t1), P(s0, t1)].map(api.to2d);
        quads.push({ q: q, d: (q[0].depth + q[2].depth) / 2 });
      }
      quads.sort(function (m, n2) { return m.d - n2.d; }).forEach(function (o) {
        ctx.beginPath(); ctx.moveTo(o.q[0].x, o.q[0].y); for (var k = 1; k < 4; k++) ctx.lineTo(o.q[k].x, o.q[k].y); ctx.closePath();
        ctx.globalAlpha = 0.13; ctx.fillStyle = teal; ctx.fill(); ctx.globalAlpha = 0.35; ctx.strokeStyle = grid; ctx.lineWidth = 1; ctx.stroke(); ctx.globalAlpha = 1;
      });
      var bb = b(), comp = dot(bb, n), p = add(bb, n, -comp);   // projection onto plane
      var O = api.to2d([0, 0, 0]), B = api.to2d(bb), Pp = api.to2d(p);
      // perpendicular drop (b - p)
      ctx.strokeStyle = muted; ctx.lineWidth = 1.5; ctx.setLineDash([5, 4]);
      ctx.beginPath(); ctx.moveTo(B.x, B.y); ctx.lineTo(Pp.x, Pp.y); ctx.stroke(); ctx.setLineDash([]);
      // p (in plane)
      ctx.strokeStyle = teal; ctx.fillStyle = teal; ctx.lineWidth = 3;
      ctx.beginPath(); ctx.moveTo(O.x, O.y); ctx.lineTo(Pp.x, Pp.y); ctx.stroke();
      ctx.beginPath(); ctx.arc(Pp.x, Pp.y, 4, 0, 7); ctx.fill();
      ctx.font = "12px ui-monospace, monospace"; ctx.fillText("p", Pp.x + 5, Pp.y - 3);
      // b
      ctx.strokeStyle = primary; ctx.fillStyle = primary; ctx.lineWidth = 3;
      ctx.beginPath(); ctx.moveTo(O.x, O.y); ctx.lineTo(B.x, B.y); ctx.stroke();
      ctx.beginPath(); ctx.arc(B.x, B.y, 4, 0, 7); ctx.fill();
      ctx.fillText("b", B.x + 5, B.y - 3);
      if (readout) readout.innerHTML = "p = projection of b onto the plane = (" + p[0].toFixed(2) + ", " + p[1].toFixed(2) + ", " + p[2].toFixed(2) + ")" +
        " &nbsp;·&nbsp; perpendicular |b − p| = <strong>" + Math.abs(comp).toFixed(2) + "</strong> &nbsp;·&nbsp; the dashed drop is orthogonal to the plane &nbsp;·&nbsp; drag to rotate";
    }

    var sc = window.Scene3D.attach(canvas, draw, { range: 2.2, yaw: 0.7, pitch: 0.4 });
    ["x", "y", "z"].forEach(function (k) {
      var el = document.getElementById("pj-" + k), out = document.getElementById("pj-" + k + "-val");
      if (!el) return;
      if (out) out.textContent = parseFloat(el.value).toFixed(1);
      el.addEventListener("input", function () { ctrl[k] = parseFloat(el.value); if (out) out.textContent = ctrl[k].toFixed(1); sc.render(); });
      ctrl[k] = parseFloat(el.value);
    });
    window.__vizRedraw.push(function () { sc.render(); });
    sc.render();
  });
})();
