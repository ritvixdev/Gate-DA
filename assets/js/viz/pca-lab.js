/* PCA lab: a 2-D point cloud you can rotate. Computes the covariance matrix,
   then draws its eigenvectors (PC1 = max-variance direction, PC2 ⟂ to it). */
(function () {
  "use strict";
  window.__vizInit.push(function () {
    var canvas = document.getElementById("pca-lab");
    if (!canvas || !window.Grid) return;
    var g = new window.Grid(canvas, { range: 5 });
    var readout = document.getElementById("pca-lab-readout");
    var angI = document.getElementById("pca-ang"), angV = document.getElementById("pca-ang-val");
    var N = 60, base = [];
    (function () { var seed = 42; function rnd() { seed = (seed * 9301 + 49297) % 233280; return seed / 233280; } for (var i = 0; i < N; i++) base.push({ x: (rnd() * 2 - 1) * 3.3, y: (rnd() * 2 - 1) * 0.9 }); })();
    function rot(ang) { var ca = Math.cos(ang), sa = Math.sin(ang); return base.map(function (p) { return { x: p.x * ca - p.y * sa, y: p.x * sa + p.y * ca }; }); }
    function draw() {
      var c = g.colors(); g.clear(); g.drawGrid();
      var ang = parseFloat(angI.value) * Math.PI / 180, P = rot(ang);
      var mx = 0, my = 0; P.forEach(function (p) { mx += p.x; my += p.y; }); mx /= P.length; my /= P.length;
      var sxx = 0, syy = 0, sxy = 0; P.forEach(function (p) { var dx = p.x - mx, dy = p.y - my; sxx += dx * dx; syy += dy * dy; sxy += dx * dy; }); sxx /= P.length; syy /= P.length; sxy /= P.length;
      var tr = sxx + syy, det = sxx * syy - sxy * sxy, disc = Math.sqrt(Math.max(0, tr * tr / 4 - det));
      var l1 = tr / 2 + disc, l2 = tr / 2 - disc;
      function evec(l) { var ex = sxy, ey = l - sxx; if (Math.abs(ex) < 1e-9 && Math.abs(ey) < 1e-9) { ex = 1; ey = 0; } var n = Math.hypot(ex, ey); return { x: ex / n, y: ey / n }; }
      var v1 = evec(l1), v2 = evec(l2);
      P.forEach(function (p) { var q = g.px(p.x, p.y); g.ctx.fillStyle = c.muted; g.ctx.globalAlpha = 0.7; g.ctx.beginPath(); g.ctx.arc(q.x, q.y, 3, 0, 7); g.ctx.fill(); });
      g.ctx.globalAlpha = 1;
      var s1 = Math.sqrt(Math.max(0.04, l1)) * 2.2, s2 = Math.sqrt(Math.max(0.04, l2)) * 2.2;
      g.drawArrow({ x: mx, y: my }, { x: mx + v1.x * s1, y: my + v1.y * s1 }, c.primary, 3);
      g.drawArrow({ x: mx, y: my }, { x: mx + v2.x * s2, y: my + v2.y * s2 }, c.teal, 2.5);
      g.label(mx + v1.x * s1, my + v1.y * s1, "PC1", c.primary);
      g.label(mx + v2.x * s2, my + v2.y * s2, "PC2", c.teal);
      if (readout) readout.innerHTML = "λ₁ = " + l1.toFixed(2) + " (PC1) &nbsp;·&nbsp; λ₂ = " + l2.toFixed(2) + " (PC2)" +
        " &nbsp;·&nbsp; PC1 explains " + (100 * l1 / (l1 + l2 || 1)).toFixed(0) + "% of variance &nbsp;·&nbsp; PC1 ⟂ PC2 (eigenvectors of the covariance matrix)";
    }
    angI.addEventListener("input", function () { angV.textContent = angI.value + "°"; draw(); });
    angV.textContent = angI.value + "°";
    g.onResize = draw; window.__vizRedraw.push(draw); draw();
  });
})();
