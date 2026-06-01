/* Elbow-method lab (second lab on k-Means): WCSS vs K. WCSS always drops as K rises,
   but the drop flattens at the "elbow" — the good K. Slider highlights a K. */
(function () {
  "use strict";
  function init() {
    var canvas = document.getElementById("elbow-lab");
    if (!canvas || !window.VizChart) return;
    var readout = document.getElementById("elbow-lab-readout");
    var kI = document.getElementById("eb-k"), kV = document.getElementById("eb-k-val");
    // 3 natural blobs (fixed seed)
    var P = []; (function () { var seed = 11; function rnd() { seed = (seed * 9301 + 49297) % 233280; return seed / 233280; } var cen = [[2, 2], [8, 3], [5, 8]]; cen.forEach(function (c) { for (var i = 0; i < 18; i++) P.push({ x: c[0] + (rnd() * 2 - 1) * 1.2, y: c[1] + (rnd() * 2 - 1) * 1.2 }); }); })();
    function kmeansWCSS(K) {
      var cents = []; for (var i = 0; i < K; i++) cents.push({ x: P[Math.floor(i * P.length / K)].x, y: P[Math.floor(i * P.length / K)].y });
      for (var it = 0; it < 12; it++) {
        var sums = []; for (var c = 0; c < K; c++) sums.push({ x: 0, y: 0, n: 0 });
        P.forEach(function (p) { var bi = 0, bd = Infinity; for (var c = 0; c < K; c++) { var d = (p.x - cents[c].x) * (p.x - cents[c].x) + (p.y - cents[c].y) * (p.y - cents[c].y); if (d < bd) { bd = d; bi = c; } } sums[bi].x += p.x; sums[bi].y += p.y; sums[bi].n++; });
        for (var c2 = 0; c2 < K; c2++) if (sums[c2].n) { cents[c2].x = sums[c2].x / sums[c2].n; cents[c2].y = sums[c2].y / sums[c2].n; }
      }
      var w = 0; P.forEach(function (p) { var bd = Infinity; for (var c = 0; c < K; c++) { var d = (p.x - cents[c].x) * (p.x - cents[c].x) + (p.y - cents[c].y) * (p.y - cents[c].y); if (d < bd) bd = d; } w += bd; });
      return w;
    }
    var WCSS = []; for (var K = 1; K <= 8; K++) WCSS.push(kmeansWCSS(K));
    function draw() {
      var s = VizChart.setup(canvas), ctx = s.ctx, W = s.w, H = s.h, pad = 40;
      var kSel = parseInt(kI.value, 10), wmax = WCSS[0] * 1.05;
      var grid = VizChart.css("--viz-grid", "#e6dfd8"), axis = VizChart.css("--viz-axis", "#9b948a"),
          accent = VizChart.css("--accent3", "#a78bfa"), primary = VizChart.css("--primary", "#cc785c"), muted = VizChart.css("--muted", "#6c6a64");
      function PX(k) { return pad + (k - 1) / 7 * (W - 2 * pad); }
      function PY(w) { return (H - pad) - w / wmax * (H - 2 * pad); }
      ctx.clearRect(0, 0, W, H);
      ctx.strokeStyle = grid; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(pad, H - pad); ctx.lineTo(W - pad, H - pad); ctx.moveTo(pad, pad); ctx.lineTo(pad, H - pad); ctx.stroke();
      ctx.fillStyle = muted; ctx.font = "11px ui-monospace, monospace"; ctx.textAlign = "center";
      // curve
      ctx.strokeStyle = accent; ctx.lineWidth = 2.5; ctx.beginPath();
      WCSS.forEach(function (w, i) { var px = PX(i + 1), py = PY(w); if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py); });
      ctx.stroke();
      WCSS.forEach(function (w, i) { ctx.fillStyle = (i + 1) === kSel ? primary : accent; ctx.beginPath(); ctx.arc(PX(i + 1), PY(w), (i + 1) === kSel ? 6 : 4, 0, 7); ctx.fill(); ctx.fillStyle = muted; ctx.fillText("K=" + (i + 1), PX(i + 1), H - pad + 6); });
      // elbow ≈ largest drop ratio
      var elbow = 2; for (var i = 1; i < 7; i++) { if (WCSS[i - 1] - WCSS[i] > 1.6 * (WCSS[i] - WCSS[i + 1])) { elbow = i + 1; break; } }
      ctx.strokeStyle = muted; ctx.setLineDash([4, 4]); ctx.beginPath(); ctx.moveTo(PX(elbow), pad); ctx.lineTo(PX(elbow), H - pad); ctx.stroke(); ctx.setLineDash([]);
      if (readout) readout.innerHTML = "WCSS (inertia) at K=" + kSel + " is " + WCSS[kSel - 1].toFixed(1) +
        " &nbsp;·&nbsp; WCSS always falls as K rises, but the bend (<strong>elbow ≈ K=" + elbow + "</strong>) marks the good trade-off &nbsp;·&nbsp; here the data has 3 natural clusters";
    }
    kI.addEventListener("input", function () { kV.textContent = kI.value; draw(); });
    kV.textContent = kI.value;
    var prevT = window.__onThemeChange; window.__onThemeChange = function (t) { if (typeof prevT === "function") prevT(t); draw(); };
    window.addEventListener("resize", function () { clearTimeout(window.__ebT); window.__ebT = setTimeout(draw, 150); });
    draw();
  }
  var prev = window.GATE_VIZ_INIT;
  window.GATE_VIZ_INIT = function () { if (typeof prev === "function") prev(); init(); };
})();
