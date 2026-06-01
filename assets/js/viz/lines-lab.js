/* Linear-equations lab: two equations = two lines. Shows the three cases —
   one intersection (unique), same line (infinite), parallel (no solution). */
(function () {
  "use strict";
  window.__vizInit.push(function () {
    var canvas = document.getElementById("lines-lab");
    if (!canvas || !window.Grid) return;
    var g = new window.Grid(canvas, { range: 6 });
    var readout = document.getElementById("lines-lab-readout");
    var SYS = {
      unique:   { L1: [1, 1, 3], L2: [1, -1, 1], name: "Unique solution" },   // x+y=3, x−y=1 → (2,1)
      infinite: { L1: [1, 1, 2], L2: [2, 2, 4], name: "Infinitely many" },     // same line
      none:     { L1: [1, 1, 2], L2: [1, 1, 4], name: "No solution" },         // parallel
    };
    var key = "unique";
    function drawLine(L, color) {
      var a = L[0], b = L[1], c = L[2], R = g.range, p0, p1;
      if (Math.abs(b) > 1e-9) { p0 = g.px(-R, (c - a * -R) / b); p1 = g.px(R, (c - a * R) / b); }
      else { var xx = c / a; p0 = g.px(xx, -R); p1 = g.px(xx, R); }
      g.ctx.strokeStyle = color; g.ctx.lineWidth = 2.5; g.ctx.beginPath(); g.ctx.moveTo(p0.x, p0.y); g.ctx.lineTo(p1.x, p1.y); g.ctx.stroke();
    }
    function draw() {
      var c = g.colors(); g.clear(); g.drawGrid();
      var S = SYS[key];
      drawLine(S.L1, c.teal); drawLine(S.L2, c.amber);
      var info;
      if (key === "unique") {
        var d = S.L1[0] * S.L2[1] - S.L1[1] * S.L2[0];
        var x = (S.L1[2] * S.L2[1] - S.L1[1] * S.L2[2]) / d, y = (S.L1[0] * S.L2[2] - S.L1[2] * S.L2[0]) / d;
        g.dot(x, y, c.primary); g.label(x, y, "(" + x + ", " + y + ")", c.primary);
        info = "one intersection → rank(A) = rank([A|b]) = 2 = #unknowns";
      } else if (key === "infinite") { info = "same line → rank(A) = rank([A|b]) = 1 < 2 → infinitely many"; }
      else { info = "parallel → rank(A) = 1 ≠ rank([A|b]) = 2 → no solution"; }
      if (readout) readout.innerHTML = "<strong>" + S.name + "</strong> &nbsp;·&nbsp; " + info;
    }
    function set(k, btn) { key = k; var b = btn.parentElement.querySelectorAll(".preset-btn"); for (var i = 0; i < b.length; i++) b[i].classList.remove("active"); btn.classList.add("active"); draw(); }
    document.getElementById("ln-unique").addEventListener("click", function () { set("unique", this); });
    document.getElementById("ln-infinite").addEventListener("click", function () { set("infinite", this); });
    document.getElementById("ln-none").addEventListener("click", function () { set("none", this); });
    g.onResize = draw; window.__vizRedraw.push(draw); draw();
  });
})();
