/* Eigen Lab — for a fixed (editable) 2x2 matrix A, drag a test
   vector x and watch its image Ax. When x and Ax are colinear, x is
   an eigenvector and λ = (Ax)·x / (x·x). True eigen-directions are
   drawn faintly. Mounts on #eigen-lab. */
(function () {
  "use strict";
  window.__vizInit.push(function () {
    var canvas = document.getElementById("eigen-lab");
    if (!canvas) return;
    var g = new window.Grid(canvas, { range: 5 });

    var m = { a: 2, b: 1, c: 1, d: 2 };
    var ids = { a: "el-a", b: "el-b", c: "el-c", d: "el-d" };
    var x = { x: 2, y: 0.5 };
    var readout = document.getElementById("eigen-lab-readout");

    function apply(p) { return { x: m.a * p.x + m.b * p.y, y: m.c * p.x + m.d * p.y }; }
    function round(n) { return Math.round(n * 100) / 100; }
    function snap(p) { return { x: Math.max(-4, Math.min(4, Math.round(p.x * 10) / 10)), y: Math.max(-4, Math.min(4, Math.round(p.y * 10) / 10)) }; }
    function cross(a, b) { return a.x * b.y - a.y * b.x; }

    // Real eigenvalues of A (if any)
    function eigenvalues() {
      var tr = m.a + m.d, de = m.a * m.d - m.b * m.c;
      var disc = tr * tr - 4 * de;
      if (disc < -1e-9) return [];
      var s = Math.sqrt(Math.max(0, disc));
      return [(tr + s) / 2, (tr - s) / 2];
    }
    // An eigenvector direction for eigenvalue lam
    function eigvec(lam) {
      // (A - lam I) v = 0  ->  (a-lam) vx + b vy = 0
      var a1 = m.a - lam, b1 = m.b, c1 = m.c, d1 = m.d - lam;
      if (Math.abs(b1) > 1e-6) return norm({ x: -b1, y: a1 });
      if (Math.abs(a1) > 1e-6) return norm({ x: -b1, y: a1 });
      if (Math.abs(d1) > 1e-6) return norm({ x: d1, y: -c1 });
      return norm({ x: 1, y: 0 });
    }
    function norm(v) { var L = Math.hypot(v.x, v.y) || 1; return { x: v.x / L, y: v.y / L }; }

    function draw() {
      var c = g.colors();
      g.clear();
      g.drawGrid();

      // Eigen-direction lines
      var evs = eigenvalues();
      g.ctx.setLineDash([5, 5]); g.ctx.lineWidth = 1.5;
      evs.forEach(function (lam) {
        var v = eigvec(lam), k = 6;
        g.ctx.strokeStyle = withAlpha(c.muted, 0.6);
        var p = g.px(-v.x * k, -v.y * k), q = g.px(v.x * k, v.y * k);
        g.ctx.beginPath(); g.ctx.moveTo(p.x, p.y); g.ctx.lineTo(q.x, q.y); g.ctx.stroke();
      });
      g.ctx.setLineDash([]);

      var ax = apply(x);
      g.drawVector(ax, { color: c.amber, label: "Ax", width: 3 });
      g.drawVector(x, { color: c.teal, label: "x", handle: true, width: 2.5 });

      // Colinear? -> eigenvector
      var colinear = Math.hypot(x.x, x.y) > 0.05 && Math.abs(cross(x, ax)) < 0.06 * Math.hypot(x.x, x.y);
      var lam = (ax.x * x.x + ax.y * x.y) / (x.x * x.x + x.y * x.y || 1);

      if (readout) {
        var evtxt = evs.length ? evs.map(function (e) { return round(e); }).join(", ") : "complex (rotation)";
        readout.innerHTML =
          "A = [[<b>" + round(m.a) + "</b>,<b>" + round(m.b) + "</b>],[<b>" + round(m.c) + "</b>,<b>" + round(m.d) + "</b>]] &nbsp; " +
          "eigenvalues: <b>" + evtxt + "</b><br>" +
          (colinear
            ? "✅ x is an <b>eigenvector</b> — Ax = <b>" + round(lam) + "</b> · x"
            : "Drag x onto a dashed line to align Ax with x");
      }
    }

    function withAlpha(hex, a) {
      hex = (hex || "#888").replace("#", "");
      if (hex.length === 3) hex = hex.split("").map(function (z) { return z + z; }).join("");
      var n = parseInt(hex, 16); if (isNaN(n)) return "rgba(120,120,120," + a + ")";
      return "rgba(" + ((n >> 16) & 255) + "," + ((n >> 8) & 255) + "," + (n & 255) + "," + a + ")";
    }

    g.makeDraggable(function () { return [x]; }, function (i, p) { x = snap(p); draw(); });

    Object.keys(ids).forEach(function (k) {
      var el = document.getElementById(ids[k]);
      if (!el) return;
      el.addEventListener("input", function () { m[k] = parseFloat(el.value) || 0; draw(); });
    });

    g.onResize = draw;
    window.__vizRedraw.push(draw);
    draw();
  });
})();
