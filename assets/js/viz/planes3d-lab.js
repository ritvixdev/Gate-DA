/* planes3d-lab.js — each equation of a 3-unknown system is a plane in 3D.
   Presets show the three solution types: a unique point, a shared line (infinite),
   or no common point (inconsistent). Drag to rotate. Mounts on #planes3d-lab. */
(function () {
  "use strict";
  // system presets: rows = [nx, ny, nz, d]  (plane n·x = d)
  var SETS = {
    unique:   [[1, 0.25, 0.15, 0.3], [0.2, 1, 0.1, -0.2], [0.15, 0.2, 1, 0.4]],
    infinite: [[1, 0.25, 0.15, 0.3], [0.2, 1, 0.1, -0.2], [1.2, 1.25, 0.25, 0.1]],   // row3 = row1+row2 (d too)
    none:     [[1, 0.25, 0.15, 0.3], [0.2, 1, 0.1, -0.2], [1.2, 1.25, 0.25, 0.9]]    // row3 normal dependent, d inconsistent
  };
  function dot(a, b) { return a[0] * b[0] + a[1] * b[1] + a[2] * b[2]; }
  function cross(a, b) { return [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]; }
  function nrm(a) { var L = Math.hypot(a[0], a[1], a[2]) || 1; return [a[0] / L, a[1] / L, a[2] / L]; }
  function add(a, b, s) { return [a[0] + b[0] * s, a[1] + b[1] * s, a[2] + b[2] * s]; }
  function rankRows(rows, cols, tol) {
    tol = tol || 1e-6; var m = rows.map(function (r) { return r.slice(); }), R = 0;
    for (var col = 0; col < cols && R < m.length; col++) {
      var piv = -1, best = tol;
      for (var i = R; i < m.length; i++) if (Math.abs(m[i][col]) > best) { best = Math.abs(m[i][col]); piv = i; }
      if (piv < 0) continue;
      var t = m[R]; m[R] = m[piv]; m[piv] = t;
      for (var i2 = 0; i2 < m.length; i2++) if (i2 !== R) { var f = m[i2][col] / m[R][col]; for (var c = 0; c < cols; c++) m[i2][c] -= f * m[r2c(R)][c]; }
      R++;
    }
    return R;
    function r2c(x) { return x; }
  }
  function solve3(A, d) {                                   // Gaussian elimination, A rows
    var m = [A[0].concat(d[0]), A[1].concat(d[1]), A[2].concat(d[2])];
    for (var col = 0; col < 3; col++) {
      var piv = col; for (var i = col + 1; i < 3; i++) if (Math.abs(m[i][col]) > Math.abs(m[piv][col])) piv = i;
      if (Math.abs(m[piv][col]) < 1e-9) return null;
      var t = m[col]; m[col] = m[piv]; m[piv] = t;
      for (var i2 = 0; i2 < 3; i2++) if (i2 !== col) { var f = m[i2][col] / m[col][col]; for (var c = 0; c < 4; c++) m[i2][c] -= f * m[col][c]; }
    }
    return [m[0][3] / m[0][0], m[1][3] / m[1][1], m[2][3] / m[2][2]];
  }
  window.__vizInit = window.__vizInit || [];
  window.__vizRedraw = window.__vizRedraw || [];
  window.__vizInit.push(function () {
    var canvas = document.getElementById("planes3d-lab");
    if (!canvas || !window.Scene3D) return;
    var readout = document.getElementById("planes3d-lab-readout");
    var preset = "unique";

    function draw(api) {
      var ctx = api.ctx; api.drawAxes(2.0);
      var sys = SETS[preset], R = 1.7;
      var cols3 = [api.css("--primary", "#cc785c"), api.css("--teal", "#5db8a6"), api.css("--amber", "#e8a55a")];
      var quads = [];
      sys.forEach(function (row, idx) {
        var n = [row[0], row[1], row[2]], d = row[3], nn = dot(n, n);
        var p0 = [n[0] * d / nn, n[1] * d / nn, n[2] * d / nn];
        var seed = Math.abs(n[0]) < 0.9 ? [1, 0, 0] : [0, 1, 0];
        var u = nrm(cross(n, seed)), v = nrm(cross(n, u));
        var c1 = add(add(p0, u, R), v, R), c2 = add(add(p0, u, R), v, -R), c3 = add(add(p0, u, -R), v, -R), c4 = add(add(p0, u, -R), v, R);
        var q = [c1, c2, c3, c4].map(api.to2d);
        quads.push({ q: q, depth: (q[0].depth + q[2].depth) / 2, col: cols3[idx] });
      });
      quads.sort(function (m, n) { return m.depth - n.depth; }).forEach(function (o) {
        ctx.beginPath(); ctx.moveTo(o.q[0].x, o.q[0].y); for (var k = 1; k < 4; k++) ctx.lineTo(o.q[k].x, o.q[k].y); ctx.closePath();
        ctx.globalAlpha = 0.2; ctx.fillStyle = o.col; ctx.fill(); ctx.globalAlpha = 0.55; ctx.strokeStyle = o.col; ctx.lineWidth = 1.5; ctx.stroke(); ctx.globalAlpha = 1;
      });
      var A = sys.map(function (r) { return [r[0], r[1], r[2]]; }), dd = sys.map(function (r) { return [r[3]]; });
      var aug = sys.map(function (r) { return r.slice(); });
      var rA = rankRows(A.map(function (r) { return r.slice(); }), 3), rAug = rankRows(aug, 4);
      var msg, kind;
      if (rA < rAug) { kind = "No solution"; msg = "the planes have <strong>no common point</strong> (inconsistent)"; }
      else if (rA === 3) {
        kind = "Unique"; var x = solve3(A, [dd[0][0], dd[1][0], dd[2][0]].map(function (v) { return [v]; }).map(function (v) { return v[0]; }));
        if (x) { var pt = api.to2d(x); ctx.fillStyle = api.css("--ink", "#141413"); ctx.beginPath(); ctx.arc(pt.x, pt.y, 5, 0, 7); ctx.fill(); ctx.strokeStyle = "#fff"; ctx.lineWidth = 1.5; ctx.stroke(); }
        msg = "the planes meet at a <strong>single point</strong> (one solution)";
      } else {
        kind = "Infinite"; // common line of planes 1 & 2
        var n1 = A[0], n2 = A[1], dir = nrm(cross(n1, n2));
        var p = solve3([n1, n2, dir], [sys[0][3], sys[1][3], 0]);
        if (p) { var s1 = api.to2d(add(p, dir, -2.2)), s2 = api.to2d(add(p, dir, 2.2)); ctx.strokeStyle = api.css("--ink", "#141413"); ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(s1.x, s1.y); ctx.lineTo(s2.x, s2.y); ctx.stroke(); }
        msg = "the planes share a whole <strong>line</strong> (infinitely many solutions)";
      }
      if (readout) readout.innerHTML = "<strong>" + kind + "</strong> &nbsp;·&nbsp; rank(A) = " + rA + ", rank([A|b]) = " + rAug + " &nbsp;·&nbsp; " + msg + " &nbsp;·&nbsp; drag to rotate";
    }

    var sc = window.Scene3D.attach(canvas, draw, { range: 2.2, yaw: 0.7, pitch: 0.4 });
    function setPreset(p) { preset = p; ["unique", "infinite", "none"].forEach(function (k) { var b = document.getElementById("p3-" + k); if (b) b.classList.toggle("active", k === p); }); sc.render(); }
    ["unique", "infinite", "none"].forEach(function (k) { var b = document.getElementById("p3-" + k); if (b) b.addEventListener("click", function () { setPreset(k); }); });
    window.__vizRedraw.push(function () { sc.render(); });
    setPreset("unique");
  });
})();
