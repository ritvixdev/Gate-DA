/* Distribution Explorer: Binomial PMF (n, p) as bars, or Normal PDF (mu, sigma) as a curve. */
(function () {
  "use strict";
  function comb(n, k) {
    if (k < 0 || k > n) return 0;
    k = Math.min(k, n - k);
    var c = 1;
    for (var i = 0; i < k; i++) c = c * (n - i) / (i + 1);
    return c;
  }
  function init() {
    var canvas = document.getElementById("dist-explorer");
    if (!canvas || !window.VizChart) return;
    var readout = document.getElementById("dist-explorer-readout");
    var mode = "binomial";
    var a = document.getElementById("de-a"), b = document.getElementById("de-b");
    var aVal = document.getElementById("de-a-val"), bVal = document.getElementById("de-b-val"), aLab = document.getElementById("de-a-lab"), bLab = document.getElementById("de-b-lab");

    function setMode(m) {
      mode = m;
      if (m === "binomial") {
        aLab.textContent = "n"; a.min = 1; a.max = 20; a.step = 1; a.value = 10;
        bLab.textContent = "p"; b.min = 0; b.max = 1; b.step = 0.05; b.value = 0.5;
      } else {
        aLab.textContent = "μ"; a.min = -5; a.max = 5; a.step = 0.5; a.value = 0;
        bLab.textContent = "σ"; b.min = 0.5; b.max = 4; b.step = 0.1; b.value = 1;
      }
      draw();
    }
    function draw() {
      var av = parseFloat(a.value), bv = parseFloat(b.value);
      aVal.textContent = av; bVal.textContent = bv;
      if (mode === "binomial") {
        var n = Math.round(av), p = bv, labels = [], vals = [];
        for (var k = 0; k <= n; k++) { labels.push(k); vals.push(comb(n, k) * Math.pow(p, k) * Math.pow(1 - p, n - k)); }
        VizChart.barChart(canvas, { groups: [{ values: vals, color: VizChart.css("--primary", "#cc785c") }], labels: labels });
        if (readout) readout.innerHTML = "Binomial(n=" + n + ", p=" + p + ") &nbsp;·&nbsp; mean = np = " + (n * p).toFixed(2) + " &nbsp;·&nbsp; var = np(1−p) = " + (n * p * (1 - p)).toFixed(2);
      } else {
        var mu = av, sd = bv, lo = mu - 4 * sd, hi = mu + 4 * sd, pts = [];
        for (var i = 0; i <= 80; i++) {
          var x = lo + (hi - lo) * i / 80;
          var y = Math.exp(-((x - mu) * (x - mu)) / (2 * sd * sd)) / (sd * Math.sqrt(2 * Math.PI));
          pts.push({ x: i / 80, y: y });
        }
        VizChart.barChart(canvas, { groups: [], labels: [lo.toFixed(1), ((lo + hi) / 2).toFixed(1), hi.toFixed(1)], curve: pts, curveColor: VizChart.css("--primary", "#cc785c") });
        if (readout) readout.innerHTML = "Normal(μ=" + mu + ", σ=" + sd + ") &nbsp;·&nbsp; ~68% within μ±σ, ~95% within μ±2σ";
      }
    }
    a.addEventListener("input", draw); b.addEventListener("input", draw);
    document.getElementById("de-binom").addEventListener("click", function () { active(this); setMode("binomial"); });
    document.getElementById("de-normal").addEventListener("click", function () { active(this); setMode("normal"); });
    function active(btn) { var s = btn.parentElement.querySelectorAll(".preset-btn"); for (var i = 0; i < s.length; i++) s[i].classList.remove("active"); btn.classList.add("active"); }
    setMode("binomial");
    window.__onThemeChange = draw;
    window.addEventListener("resize", function () { clearTimeout(window.__deT); window.__deT = setTimeout(draw, 150); });
  }
  window.GATE_VIZ_INIT = init;
})();
