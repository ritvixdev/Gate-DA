/* Matrix Transformer — a 2x2 matrix [[a,b],[c,d]] deforms the unit
   grid + basis vectors. The shaded unit square's signed area is the
   determinant. Mounts on #matrix-transform. */
(function () {
  "use strict";
  window.__vizInit.push(function () {
    var canvas = document.getElementById("matrix-transform");
    if (!canvas) return;
    var g = new window.Grid(canvas, { range: 5 });

    var m = { a: 1, b: 0, c: 0, d: 1 };
    var ids = { a: "mt-a", b: "mt-b", c: "mt-c", d: "mt-d" };
    var readout = document.getElementById("matrix-transform-readout");

    function apply(p) { return { x: m.a * p.x + m.b * p.y, y: m.c * p.x + m.d * p.y }; }
    function det() { return m.a * m.d - m.b * m.c; }
    function round(n) { return Math.round(n * 100) / 100; }

    function draw() {
      var c = g.colors();
      g.clear();
      g.drawGrid();

      // Transformed gridlines (image of integer lines)
      g.ctx.lineWidth = 1; g.ctx.strokeStyle = c.primary; g.ctx.globalAlpha = 0.35;
      for (var i = -5; i <= 5; i++) {
        var p1 = apply({ x: i, y: -5 }), p2 = apply({ x: i, y: 5 });
        var q1 = apply({ x: -5, y: i }), q2 = apply({ x: 5, y: i });
        line(p1, p2); line(q1, q2);
      }
      g.ctx.globalAlpha = 1;

      // Unit square image (det as area)
      var sq = [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 1, y: 1 }, { x: 0, y: 1 }].map(apply);
      var d = det();
      var fill = d < 0 ? withAlpha(c.primary, 0.22) : withAlpha(c.teal, 0.22);
      g.polygon(sq, fill, d < 0 ? c.primary : c.teal);

      // Transformed basis vectors
      g.drawVector(apply({ x: 1, y: 0 }), { color: c.primary, label: "î", width: 3 });
      g.drawVector(apply({ x: 0, y: 1 }), { color: c.teal, label: "ĵ", width: 3 });

      if (readout) {
        readout.innerHTML =
          "[[<b>" + round(m.a) + "</b>, <b>" + round(m.b) + "</b>], [<b>" + round(m.c) + "</b>, <b>" + round(m.d) + "</b>]] &nbsp;·&nbsp; " +
          "det = <b>" + round(d) + "</b> " +
          (Math.abs(d) < 0.001 ? "→ <b>singular</b> (collapses to a line)" : d < 0 ? "→ orientation <b>flipped</b>" : "→ area ×" + round(Math.abs(d)));
      }
    }

    function line(p1, p2) { var a = g.px(p1.x, p1.y), b = g.px(p2.x, p2.y); g.ctx.beginPath(); g.ctx.moveTo(a.x, a.y); g.ctx.lineTo(b.x, b.y); g.ctx.stroke(); }
    function withAlpha(hex, a) {
      hex = hex.replace("#", "");
      if (hex.length === 3) hex = hex.split("").map(function (x) { return x + x; }).join("");
      var n = parseInt(hex, 16);
      return "rgba(" + ((n >> 16) & 255) + "," + ((n >> 8) & 255) + "," + (n & 255) + "," + a + ")";
    }

    Object.keys(ids).forEach(function (k) {
      var el = document.getElementById(ids[k]);
      if (!el) return;
      el.setAttribute("aria-label", "Matrix entry " + k);
      var out = document.getElementById(ids[k] + "-val");
      function sync() { m[k] = parseFloat(el.value); if (out) out.textContent = parseFloat(el.value).toFixed(1); draw(); }
      el.addEventListener("input", sync);
      sync();
    });

    var presets = {
      "Identity": { a: 1, b: 0, c: 0, d: 1 },
      "Rotate 45°": { a: 0.71, b: -0.71, c: 0.71, d: 0.71 },
      "Shear": { a: 1, b: 1, c: 0, d: 1 },
      "Scale 2×": { a: 2, b: 0, c: 0, d: 2 },
      "Reflect": { a: 1, b: 0, c: 0, d: -1 },
      "Singular": { a: 1, b: 2, c: 2, d: 4 },
    };
    var pwrap = document.getElementById("matrix-transform-presets");
    if (pwrap) {
      Object.keys(presets).forEach(function (name) {
        var b = document.createElement("button");
        b.className = "preset-btn"; b.textContent = name;
        b.addEventListener("click", function () {
          m = Object.assign({}, presets[name]);
          Object.keys(ids).forEach(function (k) {
            var el = document.getElementById(ids[k]); var out = document.getElementById(ids[k] + "-val");
            if (el) el.value = m[k]; if (out) out.textContent = m[k].toFixed(1);
          });
          draw();
        });
        pwrap.appendChild(b);
      });
    }

    g.onResize = draw;
    window.__vizRedraw.push(draw);
    draw();
  });
})();
