/* rank3d-lab.js — three 3D column vectors and the dimension of their span.
   Rank 3 fills a volume, rank 2 collapses to a plane, rank 1 to a line.
   Preset buttons switch the case. Drag to rotate. Mounts on #rank3d-lab. */
(function () {
  "use strict";
  var SETS = {
    "3": [[1.5, 0.2, 0.3], [0.2, 1.5, 0.2], [0.3, 0.2, 1.4]],
    "2": [[1.5, 0.2, 0.3], [0.2, 1.5, 0.2], [1.7, 1.7, 0.5]],   // c = a + b
    "1": [[1.3, 0.6, 0.4], [1.95, 0.9, 0.6], [-0.78, -0.36, -0.24]] // multiples of one direction
  };
  function rank3(cols, tol) {
    tol = tol || 1e-6;
    var m = [cols[0].slice(), cols[1].slice(), cols[2].slice()];   // rows = the 3 vectors
    var r = 0;
    for (var col = 0; col < 3 && r < 3; col++) {
      var piv = -1, best = tol;
      for (var i = r; i < 3; i++) if (Math.abs(m[i][col]) > best) { best = Math.abs(m[i][col]); piv = i; }
      if (piv < 0) continue;
      var tmp = m[r]; m[r] = m[piv]; m[piv] = tmp;
      for (var i2 = 0; i2 < 3; i2++) if (i2 !== r) { var f = m[i2][col] / m[r][col]; for (var c = 0; c < 3; c++) m[i2][c] -= f * m[r][c]; }
      r++;
    }
    return r;
  }
  window.__vizInit = window.__vizInit || [];
  window.__vizRedraw = window.__vizRedraw || [];
  window.__vizInit.push(function () {
    var canvas = document.getElementById("rank3d-lab");
    if (!canvas || !window.Scene3D) return;
    var readout = document.getElementById("rank3d-lab-readout");
    var preset = "3";

    function draw(api) {
      var ctx = api.ctx; api.drawAxes(2.0);
      var cols = SETS[preset], a = cols[0], b = cols[1], c = cols[2];
      var primary = api.css("--primary", "#cc785c"), teal = api.css("--teal", "#5db8a6"),
          amber = api.css("--amber", "#e8a55a"), grid = api.css("--viz-grid", "#e6dfd8");
      var rank = rank3(cols);
      // span visualization
      if (rank === 3) {
        function corner(i, j, k) { return api.to2d([i * a[0] + j * b[0] + k * c[0], i * a[1] + j * b[1] + k * c[1], i * a[2] + j * b[2] + k * c[2]]); }
        var P = []; for (var v = 0; v < 8; v++) P.push(corner(v & 1, (v >> 1) & 1, (v >> 2) & 1));
        [[0, 1, 3, 2], [4, 5, 7, 6], [0, 1, 5, 4], [2, 3, 7, 6], [0, 2, 6, 4], [1, 3, 7, 5]]
          .map(function (f) { return { f: f, d: (P[f[0]].depth + P[f[2]].depth) / 2 }; }).sort(function (m, n) { return m.d - n.d; })
          .forEach(function (o) { var f = o.f; ctx.beginPath(); ctx.moveTo(P[f[0]].x, P[f[0]].y); for (var k = 1; k < 4; k++) ctx.lineTo(P[f[k]].x, P[f[k]].y); ctx.closePath(); ctx.globalAlpha = 0.12; ctx.fillStyle = teal; ctx.fill(); ctx.globalAlpha = 1; });
      } else if (rank === 2) {
        var quads = [], R = 1.4, M = 7, step = (2 * R) / M;
        for (var i = 0; i < M; i++) for (var j = 0; j < M; j++) {
          function Pp(s, t) { return [s * a[0] + t * b[0], s * a[1] + t * b[1], s * a[2] + t * b[2]]; }
          var s0 = -R + i * step, s1 = s0 + step, t0 = -R + j * step, t1 = t0 + step;
          var q = [Pp(s0, t0), Pp(s1, t0), Pp(s1, t1), Pp(s0, t1)].map(api.to2d);
          quads.push({ q: q, d: (q[0].depth + q[2].depth) / 2 });
        }
        quads.sort(function (m, n) { return m.d - n.d; }).forEach(function (o) { ctx.beginPath(); ctx.moveTo(o.q[0].x, o.q[0].y); for (var k = 1; k < 4; k++) ctx.lineTo(o.q[k].x, o.q[k].y); ctx.closePath(); ctx.globalAlpha = 0.16; ctx.fillStyle = teal; ctx.fill(); ctx.globalAlpha = 0.4; ctx.strokeStyle = grid; ctx.lineWidth = 1; ctx.stroke(); ctx.globalAlpha = 1; });
      } else {
        var s1 = api.to2d([-2.2 * a[0], -2.2 * a[1], -2.2 * a[2]]), s2 = api.to2d([2.2 * a[0], 2.2 * a[1], 2.2 * a[2]]);
        ctx.strokeStyle = teal; ctx.lineWidth = 2.5; ctx.setLineDash([5, 4]); ctx.beginPath(); ctx.moveTo(s1.x, s1.y); ctx.lineTo(s2.x, s2.y); ctx.stroke(); ctx.setLineDash([]);
      }
      // vectors
      var o0 = api.to2d([0, 0, 0]), cl = [primary, amber, "#9b7fd4"], nm = ["a", "b", "c"];
      cols.forEach(function (vec, idx) { var t = api.to2d(vec); ctx.strokeStyle = cl[idx]; ctx.fillStyle = cl[idx]; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(o0.x, o0.y); ctx.lineTo(t.x, t.y); ctx.stroke(); ctx.beginPath(); ctx.arc(t.x, t.y, 3.5, 0, 7); ctx.fill(); ctx.font = "12px ui-monospace, monospace"; ctx.fillText(nm[idx], t.x + 5, t.y - 3); });
      var span = rank === 3 ? "a volume (all of ℝ³)" : rank === 2 ? "a plane" : "a line";
      if (readout) readout.innerHTML = "rank = <strong>" + rank + "</strong> &nbsp;·&nbsp; the columns span <strong>" + span + "</strong> &nbsp;·&nbsp; nullity = <strong>" + (3 - rank) + "</strong> (= 3 − rank) &nbsp;·&nbsp; drag to rotate";
    }

    var sc = window.Scene3D.attach(canvas, draw, { range: 2.2, yaw: 0.7, pitch: 0.4 });
    function setPreset(p) { preset = p; ["3", "2", "1"].forEach(function (k) { var b = document.getElementById("r3-" + k); if (b) b.classList.toggle("active", k === p); }); sc.render(); }
    ["3", "2", "1"].forEach(function (k) { var b = document.getElementById("r3-" + k); if (b) b.addEventListener("click", function () { setPreset(k); }); });
    window.__vizRedraw.push(function () { sc.render(); });
    setPreset("3");
  });
})();
