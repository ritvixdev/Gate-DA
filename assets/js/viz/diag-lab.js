/* Diagonalization lab: A = [[2,1],[1,2]] has eigenvectors (1,1) λ=3 and (1,−1) λ=1.
   Drag a start vector and press "Apply A" — power iteration aligns it with the dominant
   eigenvector. In the eigenbasis, A is just scaling by λ along each axis (A = P D P⁻¹). */
(function () {
  "use strict";
  window.__vizInit.push(function () {
    var canvas = document.getElementById("diag-lab");
    if (!canvas || !window.Grid) return;
    var g = new window.Grid(canvas, { range: 5 });
    var readout = document.getElementById("diag-lab-readout");
    var A = [[2, 1], [1, 2]];                 // eigenvalues 3 (v=(1,1)) and 1 (v=(1,-1))
    var v = { x: 3, y: -2.4 }, trail = [];
    function Av(p) { return { x: A[0][0] * p.x + A[0][1] * p.y, y: A[1][0] * p.x + A[1][1] * p.y }; }
    function norm(p, L) { var n = Math.hypot(p.x, p.y) || 1; return { x: p.x / n * L, y: p.y / n * L }; }
    function snap(p) { return { x: Math.max(-4.5, Math.min(4.5, Math.round(p.x * 10) / 10)), y: Math.max(-4.5, Math.min(4.5, Math.round(p.y * 10) / 10)) }; }
    function eigLine(dir, color) {
      var k = 20 / Math.hypot(dir.x, dir.y);
      var a = g.px(-dir.x * k, -dir.y * k), b = g.px(dir.x * k, dir.y * k);
      g.ctx.strokeStyle = color; g.ctx.setLineDash([6, 5]); g.ctx.lineWidth = 1.5; g.ctx.beginPath(); g.ctx.moveTo(a.x, a.y); g.ctx.lineTo(b.x, b.y); g.ctx.stroke(); g.ctx.setLineDash([]);
    }
    function draw() {
      var c = g.colors(); g.clear(); g.drawGrid();
      eigLine({ x: 1, y: 1 }, c.primary);   // dominant eigenaxis (λ=3)
      eigLine({ x: 1, y: -1 }, c.teal);     // λ=1 eigenaxis
      g.label(3.4, 3.4, "λ=3", c.primary); g.label(3.4, -3.4, "λ=1", c.teal);
      // trail of normalized directions
      g.ctx.fillStyle = c.muted;
      for (var i = 0; i < trail.length; i++) { var q = g.px(trail[i].x, trail[i].y); g.ctx.globalAlpha = 0.3; g.ctx.beginPath(); g.ctx.arc(q.x, q.y, 3, 0, 7); g.ctx.fill(); }
      g.ctx.globalAlpha = 1;
      g.drawVector(v, { color: c.amber, label: "v", handle: true, width: 2.5 });
      if (readout) {
        var ang = Math.atan2(v.y, v.x), domAng = Math.PI / 4;
        var aligned = Math.abs(Math.abs(ang) - domAng) < 0.08 || Math.abs(Math.abs(ang) - (domAng + Math.PI)) < 0.08;
        readout.innerHTML = "A = [[2,1],[1,2]] &nbsp;·&nbsp; eigenpairs: λ=3 along (1,1), λ=1 along (1,−1) &nbsp;·&nbsp; " +
          "press <em>Apply A</em>: power iteration → v aligns with the <strong>dominant eigenvector (1,1)</strong>" + (aligned ? " <strong>✓ aligned</strong>" : "");
      }
    }
    document.getElementById("dg-apply").addEventListener("click", function () { trail.push({ x: v.x, y: v.y }); if (trail.length > 12) trail.shift(); v = norm(Av(v), Math.hypot(v.x, v.y) || 3); v = norm(v, 3.2); draw(); });
    document.getElementById("dg-reset").addEventListener("click", function () { v = { x: 3, y: -2.4 }; trail = []; draw(); });
    g.makeDraggable(function () { return [v]; }, function (i, p) { v = snap(p); trail = []; draw(); });
    g.onResize = draw; window.__vizRedraw.push(draw); draw();
  });
})();
