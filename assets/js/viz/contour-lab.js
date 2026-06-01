/* Multivariate lab: a heat-map of f(x,y) (darker = higher). Drag the point to see the
   gradient ∇f (uphill) and −∇f (downhill). Toggle a bowl (minimum) vs a saddle. */
(function () {
  "use strict";
  var F = {
    bowl: { f: function (x, y) { return x * x + y * y; }, gx: function (x) { return 2 * x; }, gy: function (y) { return 2 * y; }, name: "f = x² + y²  (minimum at origin)" },
    saddle: { f: function (x, y) { return x * x - y * y; }, gx: function (x) { return 2 * x; }, gy: function (y) { return -2 * y; }, name: "f = x² − y²  (saddle at origin)" },
  };
  window.__vizInit.push(function () {
    var canvas = document.getElementById("contour-lab");
    if (!canvas || !window.Grid) return;
    var g = new window.Grid(canvas, { range: 3 });
    var readout = document.getElementById("contour-lab-readout");
    var key = "bowl", p = { x: 1.6, y: 1.0 };
    function draw() {
      var c = g.colors(), R = g.range, F0 = F[key];
      g.clear();
      var fmin = Infinity, fmax = -Infinity, a, b;
      for (a = -R; a <= R; a += 0.5) for (b = -R; b <= R; b += 0.5) { var v = F0.f(a, b); if (v < fmin) fmin = v; if (v > fmax) fmax = v; }
      var step = 0.2;
      for (a = -R; a < R; a += step) for (b = -R; b < R; b += step) {
        var nv = (F0.f(a + step / 2, b + step / 2) - fmin) / ((fmax - fmin) || 1);
        var q0 = g.px(a, b + step), q1 = g.px(a + step, b);
        g.ctx.fillStyle = c.primary; g.ctx.globalAlpha = 0.06 + 0.5 * nv;
        g.ctx.fillRect(q0.x, q0.y, q1.x - q0.x + 0.6, q1.y - q0.y + 0.6);
      }
      g.ctx.globalAlpha = 1;
      g.drawGrid();
      var gx = F0.gx(p.x), gy = F0.gy(p.y), n = Math.hypot(gx, gy) || 1, sc = 1.4 / Math.max(1, n);
      g.drawArrow(p, { x: p.x + gx * sc, y: p.y + gy * sc }, c.amber, 2.5);  // ∇f uphill
      g.drawArrow(p, { x: p.x - gx * sc, y: p.y - gy * sc }, c.teal, 2.5);   // −∇f downhill
      g.dot(p.x, p.y, c.primary);
      if (readout) readout.innerHTML = "<strong>" + F0.name + "</strong> &nbsp;·&nbsp; ∇f = (" + gx.toFixed(1) + ", " + gy.toFixed(1) + ") amber = uphill, teal = −∇f downhill &nbsp;·&nbsp; darker = higher f";
    }
    function set(k, btn) { key = k; var bb = btn.parentElement.querySelectorAll(".preset-btn"); for (var i = 0; i < bb.length; i++) bb[i].classList.remove("active"); btn.classList.add("active"); draw(); }
    document.getElementById("ct-bowl").addEventListener("click", function () { set("bowl", this); });
    document.getElementById("ct-saddle").addEventListener("click", function () { set("saddle", this); });
    g.makeDraggable(function () { return [p]; }, function (i, pt) { p = { x: Math.max(-3, Math.min(3, Math.round(pt.x * 10) / 10)), y: Math.max(-3, Math.min(3, Math.round(pt.y * 10) / 10)) }; draw(); });
    g.onResize = draw; window.__vizRedraw.push(draw); draw();
  });
})();
