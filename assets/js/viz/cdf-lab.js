/* CDF Builder (second lab on PMF/PDF): top = PMF/PDF, bottom = CDF F(x)=P(X≤x).
   Move x to shade the ≤x region and read the cumulative probability — staircase (discrete)
   vs smooth S-curve (continuous). Chains onto the existing Distribution Explorer. */
(function () {
  "use strict";
  function init() {
    var canvas = document.getElementById("cdf-lab");
    if (!canvas || !window.VizChart) return;
    var readout = document.getElementById("cdf-lab-readout");
    var xI = document.getElementById("cdf-x"), xV = document.getElementById("cdf-x-val");
    var mode = "discrete";
    var die = { xs: [1, 2, 3, 4, 5, 6], p: 1 / 6 };
    function npdf(x) { return Math.exp(-x * x / 2) / Math.sqrt(2 * Math.PI); }
    function draw() {
      var s = VizChart.setup(canvas), ctx = s.ctx, W = s.w, H = s.h, pad = 30;
      var midGap = 24, topH = (H - midGap) * 0.5, botY0 = topH + midGap;
      var grid = VizChart.css("--viz-grid", "#e6dfd8"), axis = VizChart.css("--viz-axis", "#9b948a"),
          accent = VizChart.css("--accent3", "#a78bfa"), primary = VizChart.css("--primary", "#cc785c"), muted = VizChart.css("--muted", "#6c6a64");
      var lo = mode === "discrete" ? 0.3 : -4, hi = mode === "discrete" ? 6.7 : 4;
      var x = parseFloat(xI.value);
      function PX(v) { return pad + (v - lo) / (hi - lo) * (W - 2 * pad); }
      ctx.clearRect(0, 0, W, H);
      // ---- TOP: PMF / PDF ----
      ctx.fillStyle = muted; ctx.font = "11px ui-monospace, monospace"; ctx.textAlign = "left"; ctx.fillText(mode === "discrete" ? "PMF p(x)" : "PDF f(x)", pad, 4);
      if (mode === "discrete") {
        var pmax = die.p * 1.6, baseT = topH - 8;
        function PYt(p) { return baseT - p / pmax * (baseT - 16); }
        ctx.strokeStyle = axis; ctx.beginPath(); ctx.moveTo(pad, baseT); ctx.lineTo(W - pad, baseT); ctx.stroke();
        die.xs.forEach(function (xx) {
          ctx.fillStyle = xx <= x ? primary : accent; ctx.globalAlpha = xx <= x ? 0.85 : 0.55;
          ctx.fillRect(PX(xx) - 12, PYt(die.p), 24, baseT - PYt(die.p));
        });
        ctx.globalAlpha = 1;
      } else {
        var pmaxc = npdf(0) * 1.15, baseTc = topH - 8;
        function PYc(p) { return baseTc - p / pmaxc * (baseTc - 16); }
        // shaded area ≤ x
        ctx.fillStyle = primary; ctx.globalAlpha = 0.25; ctx.beginPath(); ctx.moveTo(PX(lo), baseTc);
        for (var t = 0; t <= 120; t++) { var xx = lo + (x - lo) * t / 120; ctx.lineTo(PX(xx), PYc(npdf(xx))); }
        ctx.lineTo(PX(x), baseTc); ctx.closePath(); ctx.fill(); ctx.globalAlpha = 1;
        ctx.strokeStyle = accent; ctx.lineWidth = 2; ctx.beginPath();
        for (var k = 0; k <= 160; k++) { var v = lo + (hi - lo) * k / 160, px = PX(v), py = PYc(npdf(v)); if (k === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py); }
        ctx.stroke();
      }
      // ---- BOTTOM: CDF ----
      ctx.fillStyle = muted; ctx.fillText("CDF F(x)=P(X≤x)", pad, botY0 - 14);
      var baseB = H - pad; function PYb(F) { return baseB - F * (H - botY0 - pad); }
      ctx.strokeStyle = grid; ctx.lineWidth = 1; [0, 0.5, 1].forEach(function (f) { ctx.beginPath(); ctx.moveTo(pad, PYb(f)); ctx.lineTo(W - pad, PYb(f)); ctx.stroke(); });
      var Fx;
      if (mode === "discrete") {
        ctx.strokeStyle = accent; ctx.lineWidth = 2.5;
        var cum = 0, prevX = lo;
        die.xs.forEach(function (xx) {
          ctx.beginPath(); ctx.moveTo(PX(prevX), PYb(cum)); ctx.lineTo(PX(xx), PYb(cum)); ctx.stroke(); // flat
          cum += die.p; ctx.beginPath(); ctx.moveTo(PX(xx), PYb(cum - die.p)); ctx.lineTo(PX(xx), PYb(cum)); ctx.stroke(); // jump
          prevX = xx;
        });
        ctx.beginPath(); ctx.moveTo(PX(prevX), PYb(1)); ctx.lineTo(PX(hi), PYb(1)); ctx.stroke();
        Fx = die.xs.filter(function (xx) { return xx <= x; }).length * die.p;
      } else {
        var area = 0, parts = []; for (var q = 0; q <= 200; q++) { var v2 = lo + (hi - lo) * q / 200; area += npdf(v2); parts.push(area); }
        ctx.strokeStyle = accent; ctx.lineWidth = 2.5; ctx.beginPath();
        for (var r = 0; r <= 200; r++) { var v3 = lo + (hi - lo) * r / 200, px2 = PX(v3), py2 = PYb(parts[r] / area); if (r === 0) ctx.moveTo(px2, py2); else ctx.lineTo(px2, py2); }
        ctx.stroke();
        var idx = Math.round((x - lo) / (hi - lo) * 200); Fx = parts[Math.max(0, Math.min(200, idx))] / area;
      }
      // x marker (both panels)
      ctx.strokeStyle = primary; ctx.lineWidth = 1.5; ctx.setLineDash([4, 4]); ctx.beginPath(); ctx.moveTo(PX(x), 8); ctx.lineTo(PX(x), H - pad); ctx.stroke(); ctx.setLineDash([]);
      ctx.fillStyle = primary; ctx.beginPath(); ctx.arc(PX(x), PYb(Fx), 5, 0, 7); ctx.fill();
      if (readout) readout.innerHTML = (mode === "discrete" ? "Fair die (discrete)" : "Standard normal (continuous)") +
        " &nbsp;·&nbsp; x = " + x.toFixed(mode === "discrete" ? 0 : 1) + " &nbsp;·&nbsp; <strong>F(x) = P(X ≤ x) = " + Fx.toFixed(3) + "</strong>" +
        " &nbsp;·&nbsp; CDF is " + (mode === "discrete" ? "a staircase (jumps = PMF)" : "a smooth S-curve (area under the PDF)");
    }
    function setMode(m, btn) { mode = m; xI.min = m === "discrete" ? 1 : -4; xI.max = m === "discrete" ? 6 : 4; xI.step = m === "discrete" ? 1 : 0.1; xI.value = m === "discrete" ? 3 : 0; xV.textContent = xI.value; var b = btn.parentElement.querySelectorAll(".preset-btn"); for (var i = 0; i < b.length; i++) b[i].classList.remove("active"); btn.classList.add("active"); draw(); }
    xI.addEventListener("input", function () { xV.textContent = mode === "discrete" ? xI.value : (+xI.value).toFixed(1); draw(); });
    document.getElementById("cdf-disc").addEventListener("click", function () { setMode("discrete", this); });
    document.getElementById("cdf-cont").addEventListener("click", function () { setMode("continuous", this); });
    var prevT = window.__onThemeChange; window.__onThemeChange = function (t) { if (typeof prevT === "function") prevT(t); draw(); };
    window.addEventListener("resize", function () { clearTimeout(window.__cdfT); window.__cdfT = setTimeout(draw, 150); });
    xV.textContent = xI.value; draw();
  }
  var prev = window.GATE_VIZ_INIT;
  window.GATE_VIZ_INIT = function () { if (typeof prev === "function") prev(); init(); };
})();
