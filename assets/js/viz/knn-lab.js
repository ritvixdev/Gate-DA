/* kNN lab: two classes of 2-D points + a draggable query point. The k nearest
   neighbors are highlighted and the majority vote becomes the prediction. */
(function () {
  "use strict";
  var DATA = [
    { x: 2, y: 7, c: 0 }, { x: 1.5, y: 8.5, c: 0 }, { x: 3, y: 8, c: 0 }, { x: 2.5, y: 6, c: 0 }, { x: 1, y: 6.5, c: 0 }, { x: 3.5, y: 7.2, c: 0 }, { x: 2, y: 9, c: 0 },
    { x: 7.5, y: 3, c: 1 }, { x: 8, y: 4.5, c: 1 }, { x: 6.5, y: 2.5, c: 1 }, { x: 8.5, y: 3.5, c: 1 }, { x: 7, y: 4, c: 1 }, { x: 9, y: 2.8, c: 1 }, { x: 6.8, y: 5, c: 1 },
  ];
  function init() {
    var canvas = document.getElementById("knn-lab");
    if (!canvas || !window.VizChart) return;
    var readout = document.getElementById("knn-lab-readout");
    var kIn = document.getElementById("knn-k"), kv = document.getElementById("knn-k-val");
    var q = { x: 5, y: 5 }, dragging = false, lo = 0, hi = 10, pad = 30, geom = {};

    function draw() {
      var s = VizChart.setup(canvas), ctx = s.ctx, W = s.w, H = s.h;
      geom = { W: W, H: H };
      function PX(x) { return pad + x / hi * (W - 2 * pad); }
      function PY(y) { return (H - pad) - y / hi * (H - 2 * pad); }
      geom.PX = PX; geom.PY = PY;
      var grid = VizChart.css("--viz-grid", "#e6dfd8"), coral = VizChart.css("--primary", "#cc785c"), teal = VizChart.css("--teal", "#5db8a6"), ink = VizChart.css("--ink", "#141413");
      ctx.clearRect(0, 0, W, H);
      ctx.strokeStyle = grid; ctx.beginPath(); ctx.moveTo(pad, H - pad); ctx.lineTo(W - pad, H - pad); ctx.moveTo(pad, pad); ctx.lineTo(pad, H - pad); ctx.stroke();
      var k = parseInt(kIn.value, 10); kv.textContent = k;
      var ds = DATA.map(function (p, i) { return { i: i, d: Math.hypot(p.x - q.x, p.y - q.y) }; }).sort(function (a, b) { return a.d - b.d; });
      var near = ds.slice(0, k).map(function (o) { return o.i; });
      // highlight rings to neighbors
      ctx.strokeStyle = VizChart.css("--muted", "#6c6a64"); ctx.globalAlpha = 0.5;
      near.forEach(function (i) { ctx.beginPath(); ctx.moveTo(PX(q.x), PY(q.y)); ctx.lineTo(PX(DATA[i].x), PY(DATA[i].y)); ctx.stroke(); });
      ctx.globalAlpha = 1;
      // points
      var c0 = 0, c1 = 0;
      DATA.forEach(function (p, i) {
        ctx.fillStyle = p.c === 0 ? coral : teal;
        ctx.beginPath(); ctx.arc(PX(p.x), PY(p.y), 6, 0, 7); ctx.fill();
        if (near.indexOf(i) > -1) { ctx.strokeStyle = ink; ctx.lineWidth = 2; ctx.stroke(); if (p.c === 0) c0++; else c1++; }
      });
      // query
      ctx.fillStyle = ink; ctx.beginPath(); ctx.arc(PX(q.x), PY(q.y), 7, 0, 7); ctx.fill();
      ctx.fillStyle = VizChart.css("--canvas", "#fff"); ctx.beginPath(); ctx.arc(PX(q.x), PY(q.y), 3, 0, 7); ctx.fill();
      if (readout) {
        var pred = c0 === c1 ? "tie" : (c0 > c1 ? "Class A (coral)" : "Class B (teal)");
        readout.innerHTML = "k = " + k + " &nbsp;·&nbsp; neighbors: A=" + c0 + ", B=" + c1 + " &nbsp;·&nbsp; <strong>prediction: " + pred + "</strong> &nbsp;·&nbsp; drag the black point";
      }
    }
    function toData(ev) {
      var r = canvas.getBoundingClientRect();
      var cx = (ev.touches ? ev.touches[0].clientX : ev.clientX) - r.left;
      var cy = (ev.touches ? ev.touches[0].clientY : ev.clientY) - r.top;
      var x = (cx - pad) / (geom.W - 2 * pad) * hi, y = hi - (cy - pad) / (geom.H - 2 * pad) * hi;
      return { x: Math.max(lo, Math.min(hi, x)), y: Math.max(lo, Math.min(hi, y)) };
    }
    function down(ev) { dragging = true; q = toData(ev); draw(); ev.preventDefault(); }
    function move(ev) { if (dragging) { q = toData(ev); draw(); ev.preventDefault(); } }
    function up() { dragging = false; }
    canvas.addEventListener("mousedown", down); canvas.addEventListener("mousemove", move); window.addEventListener("mouseup", up);
    canvas.addEventListener("touchstart", down); canvas.addEventListener("touchmove", move); window.addEventListener("touchend", up);
    kIn.addEventListener("input", draw);
    draw();
    window.__onThemeChange = draw;
    window.addEventListener("resize", function () { clearTimeout(window.__knT); window.__knT = setTimeout(draw, 150); });
  }
  window.GATE_VIZ_INIT = init;
})();
