/* Central Limit Theorem sampler: repeatedly take the mean of n die rolls and
   histogram those sample means — they pile into a bell curve as samples grow. */
(function () {
  "use strict";
  var BINS = 24, LO = 1, HI = 6;
  function init() {
    var canvas = document.getElementById("clt-lab");
    if (!canvas || !window.VizChart) return;
    var readout = document.getElementById("clt-lab-readout");
    var nInput = document.getElementById("clt-n"), nVal = document.getElementById("clt-n-val");
    var counts, total;
    var popSd = Math.sqrt(35 / 12); // sd of a fair die ≈ 1.7078
    function reset() { counts = new Array(BINS).fill(0); total = 0; draw(); }
    function sampleMeanOnce(n) {
      var s = 0; for (var i = 0; i < n; i++) s += 1 + Math.floor(Math.random() * 6);
      return s / n;
    }
    function add(times) {
      var n = parseInt(nInput.value, 10);
      for (var t = 0; t < times; t++) {
        var m = sampleMeanOnce(n);
        var bi = Math.min(BINS - 1, Math.max(0, Math.floor((m - LO) / (HI - LO) * BINS)));
        counts[bi]++; total++;
      }
      draw();
    }
    function draw() {
      var n = parseInt(nInput.value, 10);
      nVal.textContent = n;
      var binW = (HI - LO) / BINS;
      var freq = counts.map(function (c) { return total ? c / total : 0; });
      var sd = popSd / Math.sqrt(n), mu = 3.5;
      var curve = [];
      for (var i = 0; i <= 80; i++) {
        var x = LO + (HI - LO) * i / 80;
        var pdf = Math.exp(-((x - mu) * (x - mu)) / (2 * sd * sd)) / (sd * Math.sqrt(2 * Math.PI));
        curve.push({ x: i / 80, y: pdf * binW }); // probability per bin, comparable to freq
      }
      var labels = []; for (var k = 0; k < BINS; k++) labels.push((LO + (k + 0.5) * binW).toFixed(1));
      VizChart.barChart(canvas, {
        groups: [{ values: freq, color: VizChart.css("--teal", "#5db8a6") }],
        labels: labels, curve: curve, curveColor: VizChart.css("--primary", "#cc785c"),
      });
      if (readout) readout.innerHTML = "n = " + n + " per sample &nbsp;·&nbsp; " + total + " sample-means &nbsp;·&nbsp; predicted spread σ/√n = " + sd.toFixed(3) + " (coral bell)";
    }
    nInput.addEventListener("input", reset);
    document.getElementById("clt-1").addEventListener("click", function () { add(1); });
    document.getElementById("clt-1000").addEventListener("click", function () { add(1000); });
    document.getElementById("clt-reset").addEventListener("click", reset);
    reset();
    window.__onThemeChange = draw;
    window.addEventListener("resize", function () { clearTimeout(window.__cltT); window.__cltT = setTimeout(draw, 150); });
  }
  window.GATE_VIZ_INIT = init;
})();
