/* pca3d-lab.js — a 3D point cloud with its principal axes drawn through it.
   Axis length ∝ √eigenvalue of the 3×3 covariance (found by a small Jacobi solver);
   the readout shows variance explained per component. Drag to rotate. Mounts on #pca3d-lab. */
(function () {
  "use strict";
  // 3x3 symmetric eigen-decomposition (Jacobi rotations)
  function jacobi(A) {
    var a = A.map(function (r) { return r.slice(); });
    var V = [[1, 0, 0], [0, 1, 0], [0, 0, 1]];
    var pairs = [[0, 1], [0, 2], [1, 2]];
    for (var sweep = 0; sweep < 24; sweep++) {
      var p = 0, q = 1, mx = 0;
      pairs.forEach(function (pr) { if (Math.abs(a[pr[0]][pr[1]]) > mx) { mx = Math.abs(a[pr[0]][pr[1]]); p = pr[0]; q = pr[1]; } });
      if (mx < 1e-10) break;
      var phi = 0.5 * Math.atan2(2 * a[p][q], a[p][p] - a[q][q]);
      var c = Math.cos(phi), s = Math.sin(phi), i;
      for (i = 0; i < 3; i++) { var aip = a[i][p], aiq = a[i][q]; a[i][p] = c * aip - s * aiq; a[i][q] = s * aip + c * aiq; }
      for (i = 0; i < 3; i++) { var api = a[p][i], aqi = a[q][i]; a[p][i] = c * api - s * aqi; a[q][i] = s * api + c * aqi; }
      for (i = 0; i < 3; i++) { var vip = V[i][p], viq = V[i][q]; V[i][p] = c * vip - s * viq; V[i][q] = s * vip + c * viq; }
    }
    var out = [0, 1, 2].map(function (k) { return { val: a[k][k], vec: [V[0][k], V[1][k], V[2][k]] }; });
    out.sort(function (m, n) { return n.val - m.val; });
    return out;
  }
  window.__vizInit = window.__vizInit || [];
  window.__vizRedraw = window.__vizRedraw || [];
  window.__vizInit.push(function () {
    var canvas = document.getElementById("pca3d-lab");
    if (!canvas || !window.Scene3D) return;
    var readout = document.getElementById("pca3d-lab-readout");

    // fixed seeded correlated cloud
    var seed = 7; function rnd() { seed = (seed * 9301 + 49297) % 233280; return seed / 233280; }
    function gn() { return (rnd() + rnd() + rnd() - 1.5) * 1.4; }      // ~N(0,·)
    function nrm(u) { var L = Math.hypot(u[0], u[1], u[2]); return [u[0] / L, u[1] / L, u[2] / L]; }
    var u1 = nrm([1, 0.8, 0.4]), u2 = nrm([-0.7, 1, 0.1]), u3 = nrm([0.2, -0.3, 1]);
    var pts = [];
    for (var i = 0; i < 70; i++) {
      var t1 = gn() * 1.7, t2 = gn() * 0.85, t3 = gn() * 0.3;
      pts.push([t1 * u1[0] + t2 * u2[0] + t3 * u3[0], t1 * u1[1] + t2 * u2[1] + t3 * u3[1], t1 * u1[2] + t2 * u2[2] + t3 * u3[2]]);
    }
    // center + covariance
    var m = [0, 0, 0]; pts.forEach(function (p) { m[0] += p[0]; m[1] += p[1]; m[2] += p[2]; }); m = m.map(function (v) { return v / pts.length; });
    pts = pts.map(function (p) { return [p[0] - m[0], p[1] - m[1], p[2] - m[2]]; });
    var C = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
    pts.forEach(function (p) { for (var r = 0; r < 3; r++) for (var c = 0; c < 3; c++) C[r][c] += p[r] * p[c]; });
    for (var r = 0; r < 3; r++) for (var c = 0; c < 3; c++) C[r][c] /= (pts.length - 1);
    var eig = jacobi(C), total = eig[0].val + eig[1].val + eig[2].val;

    function draw(api) {
      var ctx = api.ctx;
      api.drawAxes(2.4);
      var muted = api.css("--muted", "#6c6a64"), cols = [api.css("--primary", "#cc785c"), api.css("--amber", "#e8a55a"), api.css("--teal", "#5db8a6")];
      // points sorted back-to-front
      var proj = pts.map(api.to2d);
      proj.map(function (p, idx) { return { p: p, idx: idx }; })
        .sort(function (a, b) { return a.p.depth - b.p.depth; })
        .forEach(function (o) { ctx.fillStyle = muted; ctx.globalAlpha = 0.7; ctx.beginPath(); ctx.arc(o.p.x, o.p.y, 2.6, 0, 7); ctx.fill(); });
      ctx.globalAlpha = 1;
      // principal axes
      eig.forEach(function (e, k) {
        var L = 2.1 * Math.sqrt(Math.max(e.val, 0.001));
        var a = api.to2d([-L * e.vec[0], -L * e.vec[1], -L * e.vec[2]]), b = api.to2d([L * e.vec[0], L * e.vec[1], L * e.vec[2]]);
        ctx.strokeStyle = cols[k]; ctx.lineWidth = k === 0 ? 3.5 : 2.5;
        ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
        ctx.fillStyle = cols[k]; ctx.beginPath(); ctx.arc(b.x, b.y, 4, 0, 7); ctx.fill();
        ctx.font = "11px ui-monospace, monospace"; ctx.fillText("PC" + (k + 1), b.x + 5, b.y - 3);
      });
      if (readout) {
        var pct = eig.map(function (e) { return Math.round(100 * e.val / total); });
        readout.innerHTML = "Variance explained &nbsp;·&nbsp; <strong style='color:" + cols[0] + "'>PC1 " + pct[0] + "%</strong>, " +
          "<strong style='color:" + cols[1] + "'>PC2 " + pct[1] + "%</strong>, " +
          "<strong style='color:" + cols[2] + "'>PC3 " + pct[2] + "%</strong> &nbsp;·&nbsp; the longest axis (PC1) is the direction of greatest spread &nbsp;·&nbsp; drag to rotate";
      }
    }

    var sc = window.Scene3D.attach(canvas, draw, { range: 2.6, yaw: 0.8, pitch: 0.4 });
    window.__vizRedraw.push(function () { sc.render(); });
    sc.render();
  });
})();
