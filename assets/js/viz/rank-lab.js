/* Rank-Nullity "Collapse" lab: drag a 2×2 matrix's two columns. Rank 2 → the unit square
   maps to a parallelogram (area = |det|). Rank 1 → the plane collapses onto a LINE (the column
   space), and the null-space line is everything that maps to 0. */
(function () {
  "use strict";
  window.__vizInit.push(function () {
    var canvas = document.getElementById("rank-lab");
    if (!canvas || !window.Grid) return;
    var g = new window.Grid(canvas, { range: 5 });
    var readout = document.getElementById("rank-lab-readout");
    var c1 = { x: 2, y: 1 }, c2 = { x: 1, y: 3 };
    function round(n) { return Math.round(n * 10) / 10; }
    function snap(p) { return { x: Math.max(-5, Math.min(5, round(p.x))), y: Math.max(-5, Math.min(5, round(p.y))) }; }
    function draw() {
      var c = g.colors(); g.clear(); g.drawGrid();
      var det = c1.x * c2.y - c1.y * c2.x;
      var rank, nul;
      var c1z = Math.hypot(c1.x, c1.y) < 0.1, c2z = Math.hypot(c2.x, c2.y) < 0.1;
      if (Math.abs(det) > 0.15) { rank = 2; nul = 0; }
      else if (c1z && c2z) { rank = 0; nul = 2; }
      else { rank = 1; nul = 1; }
      if (rank === 2) {
        // image of unit square = parallelogram 0, c1, c1+c2, c2
        g.polygon([{ x: 0, y: 0 }, c1, { x: c1.x + c2.x, y: c1.y + c2.y }, c2], null, c.primary);
        g.ctx.globalAlpha = 0.12; g.polygon([{ x: 0, y: 0 }, c1, { x: c1.x + c2.x, y: c1.y + c2.y }, c2], c.primary); g.ctx.globalAlpha = 1;
      } else if (rank === 1) {
        var base = c1z ? c2 : c1;
        var k = 20 / Math.max(0.1, Math.hypot(base.x, base.y));
        // column space line
        var a = g.px(-base.x * k, -base.y * k), b = g.px(base.x * k, base.y * k);
        g.ctx.strokeStyle = c.primary; g.ctx.lineWidth = 3; g.ctx.beginPath(); g.ctx.moveTo(a.x, a.y); g.ctx.lineTo(b.x, b.y); g.ctx.stroke();
        // null-space line: direction d with c1*d.x + c2*d.y = 0  ->  d = (c2 , -c1) of the columns' x/y? solve A d = 0
        // For columns c1,c2: d = (-c2 , c1) won't do; pick d perpendicular to row space. Rows: (c1.x,c2.x),(c1.y,c2.y) are dependent; use first nonzero row.
        var nd;
        if (Math.abs(c1.x) + Math.abs(c2.x) > 0.1) nd = { x: -c2.x, y: c1.x };
        else nd = { x: -c2.y, y: c1.y };
        var nk = 20 / Math.max(0.1, Math.hypot(nd.x, nd.y));
        var na = g.px(-nd.x * nk, -nd.y * nk), nb = g.px(nd.x * nk, nd.y * nk);
        g.ctx.strokeStyle = c.amber; g.ctx.setLineDash([6, 5]); g.ctx.lineWidth = 2; g.ctx.beginPath(); g.ctx.moveTo(na.x, na.y); g.ctx.lineTo(nb.x, nb.y); g.ctx.stroke(); g.ctx.setLineDash([]);
      }
      g.drawVector(c1, { color: c.teal, label: "col 1", handle: true, width: 2.5 });
      g.drawVector(c2, { color: c.muted, label: "col 2", handle: true, width: 2.5 });
      if (readout) {
        var msg;
        if (rank === 2) msg = "columns independent → image = all of ℝ² (orange/red area, ×|det|=" + Math.abs(round(det)) + "); only x=0 maps to 0";
        else if (rank === 1) msg = "columns dependent → image collapses to a <strong>line</strong> (column space, red); the dashed line is the <strong>null space</strong> (maps to 0)";
        else msg = "both columns are 0 → image = {0}";
        readout.innerHTML = "rank = <strong>" + rank + "</strong> &nbsp;·&nbsp; nullity = <strong>" + nul + "</strong> &nbsp;·&nbsp; rank + nullity = 2 (columns) &nbsp;·&nbsp; " + msg;
      }
    }
    g.makeDraggable(function () { return [c1, c2]; }, function (i, p) { if (i === 0) c1 = snap(p); else c2 = snap(p); draw(); });
    g.onResize = draw; window.__vizRedraw.push(draw); draw();
  });
})();
