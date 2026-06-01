/* Projection lab: drag b and the direction a. Shows proj_a(b) = (a·b / a·a) a
   on the line span{a}, and the perpendicular error e = b − proj (e ⟂ a). */
(function () {
  "use strict";
  window.__vizInit.push(function () {
    var canvas = document.getElementById("projection-lab");
    if (!canvas || !window.Grid) return;
    var g = new window.Grid(canvas, { range: 5 });
    var readout = document.getElementById("projection-lab-readout");
    var a = { x: 4, y: 1 }, b = { x: 1, y: 3 };
    function round(n) { return Math.round(n * 10) / 10; }
    function snap(p) { return { x: Math.max(-5, Math.min(5, round(p.x))), y: Math.max(-5, Math.min(5, round(p.y))) }; }
    function draw() {
      var c = g.colors(); g.clear(); g.drawGrid();
      // line span{a}
      var k = 20 / Math.max(0.1, Math.hypot(a.x, a.y));
      var l0 = g.px(-a.x * k, -a.y * k), l1 = g.px(a.x * k, a.y * k);
      g.ctx.strokeStyle = c.muted; g.ctx.setLineDash([6, 5]); g.ctx.lineWidth = 1.5; g.ctx.beginPath(); g.ctx.moveTo(l0.x, l0.y); g.ctx.lineTo(l1.x, l1.y); g.ctx.stroke(); g.ctx.setLineDash([]);
      var aa = a.x * a.x + a.y * a.y, ab = a.x * b.x + a.y * b.y, t = ab / (aa || 1e-9);
      var p = { x: t * a.x, y: t * a.y };
      g.drawArrow(p, b, c.muted, 1.5);                 // error segment (b − proj)
      g.drawVector(a, { color: c.teal, label: "a", handle: true, width: 2.5 });
      g.drawVector(b, { color: c.amber, label: "b", handle: true, width: 2.5 });
      g.drawVector(p, { color: c.primary, label: "proj", width: 3 });
      g.dot(p.x, p.y, c.primary);
      if (readout) {
        var edota = (b.x - p.x) * a.x + (b.y - p.y) * a.y;
        readout.innerHTML = "proj<sub>a</sub>(b) = (a·b / a·a) a = (" + round(p.x) + ", " + round(p.y) + ")" +
          " &nbsp;·&nbsp; a·b = " + round(ab) +
          " &nbsp;·&nbsp; error e = b − proj is ⟂ a &nbsp;(e·a = " + round(edota) + ")";
      }
    }
    g.makeDraggable(function () { return [a, b]; }, function (i, pt) { if (i === 0) a = snap(pt); else b = snap(pt); draw(); });
    g.onResize = draw; window.__vizRedraw.push(draw); draw();
  });
})();
