/* Hypothesis-test lab: standard normal with shaded rejection region(s).
   Pick tail type, move the test statistic; the curve shades the rejection area and reports the decision. */
(function () {
  "use strict";
  function init() {
    var canvas = document.getElementById("ztest-lab");
    if (!canvas || !window.VizChart) return;
    var readout = document.getElementById("ztest-lab-readout");
    var zI = document.getElementById("zt-z"), zV = document.getElementById("zt-z-val");
    var tail = "two"; // two | right | left
    var lo = -4, hi = 4;
    var CRIT = { two: 1.96, right: 1.645, left: -1.645 };
    function pdf(x) { return Math.exp(-x * x / 2) / Math.sqrt(2 * Math.PI); }
    function draw() {
      var s = VizChart.setup(canvas), ctx = s.ctx, W = s.w, H = s.h, pad = 30;
      var z = parseFloat(zI.value);
      var grid = VizChart.css("--viz-grid", "#e6dfd8"), axis = VizChart.css("--viz-axis", "#9b948a");
      var accent = VizChart.css("--accent3", "#a78bfa"), primary = VizChart.css("--primary", "#cc785c"), muted = VizChart.css("--muted", "#6c6a64");
      var ymax = pdf(0) * 1.12;
      function PX(x) { return pad + (x - lo) / (hi - lo) * (W - 2 * pad); }
      function PY(y) { return (H - pad) - y / ymax * (H - 2 * pad); }
      ctx.clearRect(0, 0, W, H);
      // shaded rejection region(s)
      function shade(a, b) {
        ctx.fillStyle = primary; ctx.globalAlpha = 0.25; ctx.beginPath(); ctx.moveTo(PX(a), PY(0));
        for (var t = 0; t <= 60; t++) { var x = a + (b - a) * t / 60; ctx.lineTo(PX(x), PY(pdf(x))); }
        ctx.lineTo(PX(b), PY(0)); ctx.closePath(); ctx.fill(); ctx.globalAlpha = 1;
      }
      if (tail === "two") { shade(lo, -1.96); shade(1.96, hi); }
      else if (tail === "right") { shade(1.645, hi); }
      else { shade(lo, -1.645); }
      // axis
      ctx.strokeStyle = axis; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(pad, PY(0)); ctx.lineTo(W - pad, PY(0)); ctx.stroke();
      // bell curve
      ctx.strokeStyle = accent; ctx.lineWidth = 2.5; ctx.beginPath();
      for (var k = 0; k <= 160; k++) { var x = lo + (hi - lo) * k / 160, px = PX(x), py = PY(pdf(x)); if (k === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py); }
      ctx.stroke();
      // critical lines + labels
      ctx.fillStyle = muted; ctx.font = "11px ui-monospace, monospace"; ctx.textBaseline = "top"; ctx.textAlign = "center";
      var crits = tail === "two" ? [-1.96, 1.96] : (tail === "right" ? [1.645] : [-1.645]);
      ctx.strokeStyle = muted; ctx.setLineDash([4, 4]);
      crits.forEach(function (c) { ctx.beginPath(); ctx.moveTo(PX(c), pad); ctx.lineTo(PX(c), PY(0)); ctx.stroke(); ctx.fillText(c.toFixed(3), PX(c), pad - 2 + 2); });
      ctx.setLineDash([]);
      // test statistic
      ctx.strokeStyle = primary; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(PX(z), pad); ctx.lineTo(PX(z), PY(0)); ctx.stroke();
      ctx.fillStyle = primary; ctx.beginPath(); ctx.arc(PX(z), PY(pdf(z)), 5, 0, 7); ctx.fill();
      // decision
      var reject = tail === "two" ? Math.abs(z) > 1.96 : (tail === "right" ? z > 1.645 : z < -1.645);
      if (readout) readout.innerHTML = (tail === "two" ? "two-tailed (±1.96)" : tail === "right" ? "right-tailed (1.645)" : "left-tailed (&minus;1.645)") +
        " &nbsp;·&nbsp; test statistic z = " + z.toFixed(2) +
        " &nbsp;·&nbsp; <strong>" + (reject ? "REJECT H₀" : "fail to reject H₀") + "</strong> at α = 0.05";
    }
    function setTail(t, btn) { tail = t; var b = btn.parentElement.querySelectorAll(".preset-btn"); for (var i = 0; i < b.length; i++) b[i].classList.remove("active"); btn.classList.add("active"); draw(); }
    zI.addEventListener("input", function () { zV.textContent = (+zI.value).toFixed(2); draw(); });
    document.getElementById("zt-two").addEventListener("click", function () { setTail("two", this); });
    document.getElementById("zt-right").addEventListener("click", function () { setTail("right", this); });
    document.getElementById("zt-left").addEventListener("click", function () { setTail("left", this); });
    zV.textContent = (+zI.value).toFixed(2);
    draw();
    window.__onThemeChange = draw;
    window.addEventListener("resize", function () { clearTimeout(window.__ztT); window.__ztT = setTimeout(draw, 150); });
  }
  window.GATE_VIZ_INIT = init;
})();
