/* Vector Lab — drag two vectors, see addition (tip-to-tail),
   scaling, and the span they generate. Mounts on #vector-lab. */
(function () {
  "use strict";
  window.__vizInit.push(function () {
    var canvas = document.getElementById("vector-lab");
    if (!canvas) return;
    var g = new window.Grid(canvas, { range: 5 });

    var u = { x: 3, y: 1 };
    var v = { x: -1, y: 2 };
    var showSum = true, showSpan = false;

    var readout = document.getElementById("vector-lab-readout");
    var sumChk = document.getElementById("vl-sum");
    var spanChk = document.getElementById("vl-span");

    function round(n) { return Math.round(n * 10) / 10; }
    function snap(p) { return { x: Math.max(-5, Math.min(5, round(p.x))), y: Math.max(-5, Math.min(5, round(p.y))) }; }

    function cross(a, b) { return a.x * b.y - a.y * b.x; }

    function draw() {
      var c = g.colors();
      g.clear();
      g.drawGrid();

      // Span visualization
      if (showSpan) {
        if (Math.abs(cross(u, v)) < 0.05) {
          // Parallel (or zero) -> span is a line
          var base = (Math.hypot(u.x, u.y) >= Math.hypot(v.x, v.y)) ? u : v;
          if (Math.hypot(base.x, base.y) > 0.05) {
            var k = 20 / Math.hypot(base.x, base.y);
            g.ctx.strokeStyle = c.amber; g.ctx.lineWidth = 2; g.ctx.setLineDash([6, 5]);
            var a = g.px(-base.x * k, -base.y * k), b = g.px(base.x * k, base.y * k);
            g.ctx.beginPath(); g.ctx.moveTo(a.x, a.y); g.ctx.lineTo(b.x, b.y); g.ctx.stroke();
            g.ctx.setLineDash([]);
          }
        } else {
          // Independent -> span is the whole plane
          g.ctx.fillStyle = c.amber.replace(")", ", 0.10)").replace("rgb", "rgba");
          // fallback solid translucent fill
          g.ctx.globalAlpha = 0.12; g.ctx.fillStyle = c.amber;
          g.ctx.fillRect(0, 0, g.cssSize, g.cssSize);
          g.ctx.globalAlpha = 1;
        }
      }

      // Sum (tip-to-tail): draw v translated to tip of u
      if (showSum) {
        g.drawArrow(u, { x: u.x + v.x, y: u.y + v.y }, c.muted, 1.5);
        g.drawVector({ x: u.x + v.x, y: u.y + v.y }, { color: c.primary, label: "u+v", width: 3 });
      }

      g.drawVector(u, { color: c.teal, label: "u", handle: true, width: 2.5 });
      g.drawVector(v, { color: c.amber, label: "v", handle: true, width: 2.5 });

      if (readout) {
        var indep = Math.abs(cross(u, v)) > 0.05;
        readout.innerHTML =
          "u = (<b>" + round(u.x) + "</b>, <b>" + round(u.y) + "</b>) &nbsp; " +
          "v = (<b>" + round(v.x) + "</b>, <b>" + round(v.y) + "</b>) &nbsp; " +
          "u+v = (<b>" + round(u.x + v.x) + "</b>, <b>" + round(u.y + v.y) + "</b>)<br>" +
          "span = " + (indep ? "<b>all of ℝ²</b> (independent)" : "<b>a line</b> (dependent)");
      }
    }

    g.makeDraggable(function () { return [u, v]; }, function (i, p) {
      if (i === 0) { u = snap(p); } else { v = snap(p); }
      draw();
    });
    g.onResize = draw;
    if (sumChk) sumChk.addEventListener("change", function () { showSum = sumChk.checked; draw(); });
    if (spanChk) spanChk.addEventListener("change", function () { showSpan = spanChk.checked; draw(); });

    window.__vizRedraw.push(draw);
    draw();
  });
})();
