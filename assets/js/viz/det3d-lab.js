/* det3d-lab.js — determinant as the volume of the parallelepiped spanned by the 3
   columns of a 3x3 matrix. The flatten slider pushes the 3rd vector into the plane of
   the other two; volume → 0 (det = 0, singular). Drag to rotate. Mounts on #det3d-lab. */
(function () {
  "use strict";
  window.__vizInit = window.__vizInit || [];
  window.__vizRedraw = window.__vizRedraw || [];
  window.__vizInit.push(function () {
    var canvas = document.getElementById("det3d-lab");
    if (!canvas || !window.Scene3D) return;
    var readout = document.getElementById("det3d-lab-readout");
    var a = [1.5, 0.2, 0.2], b = [0.2, 1.4, 0.3], c0 = [0.45, 0.35, 1.5];
    function dot3(p, q) { return p[0] * q[0] + p[1] * q[1] + p[2] * q[2]; }
    function cross3(p, q) { return [p[1] * q[2] - p[2] * q[1], p[2] * q[0] - p[0] * q[2], p[0] * q[1] - p[1] * q[0]]; }
    var nhat = (function () { var x = cross3(a, b), L = Math.hypot(x[0], x[1], x[2]) || 1; return [x[0] / L, x[1] / L, x[2] / L]; })();
    function cvec(t) {                                          // pull c toward the a,b plane; t=1 → in span(a,b) → det=0
      var k = dot3(c0, nhat) * t;
      return [c0[0] - k * nhat[0], c0[1] - k * nhat[1], c0[2] - k * nhat[2]];
    }
    var flat = 0;

    function det3(m) {                                          // columns m[0],m[1],m[2]
      return m[0][0] * (m[1][1] * m[2][2] - m[1][2] * m[2][1])
           - m[1][0] * (m[0][1] * m[2][2] - m[0][2] * m[2][1])
           + m[2][0] * (m[0][1] * m[1][2] - m[0][2] * m[1][1]);
    }

    function draw(api) {
      var ctx = api.ctx; api.drawAxes(2.0);
      var c = cvec(flat), cols = [a, b, c];
      function corner(idx) {
        var i = idx & 1, j = (idx >> 1) & 1, k = (idx >> 2) & 1;
        return [i * a[0] + j * b[0] + k * c[0], i * a[1] + j * b[1] + k * c[1], i * a[2] + j * b[2] + k * c[2]];
      }
      var P = []; for (var v = 0; v < 8; v++) P.push(api.to2d(corner(v)));
      var faces = [[0, 1, 3, 2], [4, 5, 7, 6], [0, 1, 5, 4], [2, 3, 7, 6], [0, 2, 6, 4], [1, 3, 7, 5]];
      var primary = api.css("--primary", "#cc785c"), grid = api.css("--viz-grid", "#e6dfd8"),
          teal = api.css("--teal", "#5db8a6"), amber = api.css("--amber", "#e8a55a");
      faces.map(function (f) { return { f: f, depth: (P[f[0]].depth + P[f[1]].depth + P[f[2]].depth + P[f[3]].depth) / 4 }; })
        .sort(function (m, n) { return m.depth - n.depth; })
        .forEach(function (o) {
          var f = o.f; ctx.beginPath(); ctx.moveTo(P[f[0]].x, P[f[0]].y);
          for (var k = 1; k < 4; k++) ctx.lineTo(P[f[k]].x, P[f[k]].y);
          ctx.closePath();
          ctx.globalAlpha = 0.16; ctx.fillStyle = primary; ctx.fill();
          ctx.globalAlpha = 0.8; ctx.strokeStyle = grid; ctx.lineWidth = 1; ctx.stroke(); ctx.globalAlpha = 1;
        });
      // the three column vectors
      var o0 = api.to2d([0, 0, 0]), cl = [primary, teal, amber], nm = ["a", "b", "c"];
      cols.forEach(function (vec, idx) {
        var t = api.to2d(vec);
        ctx.strokeStyle = cl[idx]; ctx.fillStyle = cl[idx]; ctx.lineWidth = 3;
        ctx.beginPath(); ctx.moveTo(o0.x, o0.y); ctx.lineTo(t.x, t.y); ctx.stroke();
        ctx.beginPath(); ctx.arc(t.x, t.y, 3.5, 0, 7); ctx.fill();
        ctx.font = "12px ui-monospace, monospace"; ctx.fillText(nm[idx], t.x + 5, t.y - 3);
      });
      var d = det3(cols), vol = Math.abs(d);
      if (readout) readout.innerHTML = "Volume = |det| = <strong>" + vol.toFixed(2) + "</strong> &nbsp;·&nbsp; det = <strong>" + d.toFixed(2) + "</strong>" +
        (vol < 0.04 ? " &nbsp;·&nbsp; <strong>det ≈ 0 → singular</strong> (box is flat — columns are dependent)" :
         (d < 0 ? " &nbsp;·&nbsp; negative → orientation flipped" : " &nbsp;·&nbsp; positive orientation")) +
        " &nbsp;·&nbsp; drag to rotate";
    }

    var sc = window.Scene3D.attach(canvas, draw, { range: 2.2, yaw: 0.7, pitch: 0.4 });
    var el = document.getElementById("d3-flat"), out = document.getElementById("d3-flat-val");
    if (el) {
      el.addEventListener("input", function () { flat = parseFloat(el.value) / 100; if (out) out.textContent = Math.round(flat * 100) + "%"; sc.render(); });
      if (out) out.textContent = "0%";
    }
    window.__vizRedraw.push(function () { sc.render(); });
    sc.render();
  });
})();
