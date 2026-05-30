/* k-Means lab: 2-D points in loose blobs. Step assigns points to the nearest centroid
   then moves each centroid to its cluster mean; Run animates to convergence. */
(function () {
  "use strict";
  var PALETTE = ["--primary", "--teal", "--amber", "--accent3"];
  function blob(cx, cy, n, out) { for (var i = 0; i < n; i++) out.push({ x: cx + (Math.random() - 0.5) * 2.4, y: cy + (Math.random() - 0.5) * 2.4, c: -1 }); }
  function init() {
    var canvas = document.getElementById("kmeans-lab");
    if (!canvas || !window.VizChart) return;
    var readout = document.getElementById("kmeans-lab-readout");
    var kIn = document.getElementById("km-k"), kv = document.getElementById("km-k-val");
    var pts = [], cents = [], iter = 0, timer = null, lo = 0, hi = 10, pad = 26;
    blob(2.5, 7.5, 9, pts); blob(7.5, 7, 9, pts); blob(5, 2.5, 9, pts);

    function reset() {
      stop(); iter = 0;
      var k = parseInt(kIn.value, 10); cents = [];
      var idx = pts.map(function (_, i) { return i; }).sort(function () { return Math.random() - 0.5; }).slice(0, k);
      cents = idx.map(function (i) { return { x: pts[i].x, y: pts[i].y }; });
      pts.forEach(function (p) { p.c = -1; });
      draw();
    }
    function assign() { var moved = false; pts.forEach(function (p) { var bi = 0, bd = Infinity; cents.forEach(function (c, j) { var d = (p.x - c.x) * (p.x - c.x) + (p.y - c.y) * (p.y - c.y); if (d < bd) { bd = d; bi = j; } }); if (p.c !== bi) moved = true; p.c = bi; }); return moved; }
    function update() { cents.forEach(function (c, j) { var sx = 0, sy = 0, n = 0; pts.forEach(function (p) { if (p.c === j) { sx += p.x; sy += p.y; n++; } }); if (n) { c.x = sx / n; c.y = sy / n; } }); }
    function step() { var moved = assign(); update(); iter++; draw(moved); return moved; }
    function run() { stop(); timer = setInterval(function () { var m = step(); if (!m) stop(); }, 600); }
    function stop() { if (timer) { clearInterval(timer); timer = null; } }

    function draw(moved) {
      var s = VizChart.setup(canvas), ctx = s.ctx, W = s.w, H = s.h;
      function PX(x) { return pad + x / hi * (W - 2 * pad); }
      function PY(y) { return (H - pad) - y / hi * (H - 2 * pad); }
      var grid = VizChart.css("--viz-grid", "#e6dfd8"), ink = VizChart.css("--ink", "#141413");
      ctx.clearRect(0, 0, W, H);
      ctx.strokeStyle = grid; ctx.beginPath(); ctx.moveTo(pad, H - pad); ctx.lineTo(W - pad, H - pad); ctx.moveTo(pad, pad); ctx.lineTo(pad, H - pad); ctx.stroke();
      pts.forEach(function (p) {
        ctx.fillStyle = p.c < 0 ? VizChart.css("--muted", "#888") : VizChart.css(PALETTE[p.c % PALETTE.length], "#cc785c");
        ctx.beginPath(); ctx.arc(PX(p.x), PY(p.y), 5, 0, 7); ctx.fill();
      });
      cents.forEach(function (c, j) {
        ctx.strokeStyle = ink; ctx.fillStyle = VizChart.css(PALETTE[j % PALETTE.length], "#cc785c");
        ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(PX(c.x), PY(c.y), 9, 0, 7); ctx.fill(); ctx.stroke();
        ctx.strokeStyle = VizChart.css("--canvas", "#fff"); ctx.beginPath(); ctx.moveTo(PX(c.x) - 4, PY(c.y)); ctx.lineTo(PX(c.x) + 4, PY(c.y)); ctx.moveTo(PX(c.x), PY(c.y) - 4); ctx.lineTo(PX(c.x), PY(c.y) + 4); ctx.stroke();
      });
      if (readout) readout.innerHTML = "k = " + kIn.value + " &nbsp;·&nbsp; iteration " + iter + (iter > 0 && moved === false ? " &nbsp;<strong>(converged)</strong>" : "") + " &nbsp;·&nbsp; Step / Run to iterate";
      kv.textContent = kIn.value;
    }
    document.getElementById("km-step").addEventListener("click", step);
    document.getElementById("km-run").addEventListener("click", run);
    document.getElementById("km-reset").addEventListener("click", reset);
    kIn.addEventListener("input", reset);
    reset();
    window.__onThemeChange = function () { draw(); };
    window.addEventListener("resize", function () { clearTimeout(window.__kmT); window.__kmT = setTimeout(function () { draw(); }, 150); });
  }
  window.GATE_VIZ_INIT = init;
})();
