/* Probability simulator: flip coins / roll a die many times and watch the
   empirical probabilities converge to the theoretical (Law of Large Numbers). */
(function () {
  "use strict";
  function init() {
    var canvas = document.getElementById("prob-sim");
    if (!canvas || !window.VizChart) return;
    var readout = document.getElementById("prob-sim-readout");

    var mode = "die"; // "coin" | "die"
    var counts, trials;
    function reset() {
      var k = mode === "coin" ? 2 : 6;
      counts = new Array(k).fill(0);
      trials = 0;
      draw();
    }
    function roll(times) {
      var k = counts.length;
      for (var i = 0; i < times; i++) { counts[Math.floor(Math.random() * k)]++; trials++; }
      draw();
    }
    function draw() {
      var k = counts.length;
      var labels = mode === "coin" ? ["Heads", "Tails"] : ["1", "2", "3", "4", "5", "6"];
      var emp = counts.map(function (c) { return trials ? c / trials : 0; });
      var theo = 1 / k;
      VizChart.barChart(canvas, {
        groups: [{ values: emp, color: VizChart.css("--primary", "#cc785c") }],
        labels: labels,
        yMax: Math.max(0.4, theo * 2),
        curve: [{ x: 0, y: theo }, { x: 1, y: theo }],
        curveColor: VizChart.css("--teal", "#5db8a6"),
      });
      if (readout) {
        readout.innerHTML =
          "<strong>" + trials + "</strong> trials &nbsp;·&nbsp; theoretical p = " +
          (Math.round((1 / k) * 1000) / 1000) +
          " (teal line) &nbsp;·&nbsp; empirical: " +
          emp.map(function (e) { return (Math.round(e * 100) / 100).toFixed(2); }).join(", ");
      }
    }

    document.getElementById("ps-coin").addEventListener("click", function () { mode = "coin"; setActive(this); reset(); });
    document.getElementById("ps-die").addEventListener("click", function () { mode = "die"; setActive(this); reset(); });
    document.getElementById("ps-roll1").addEventListener("click", function () { roll(1); });
    document.getElementById("ps-roll100").addEventListener("click", function () { roll(100); });
    document.getElementById("ps-roll1000").addEventListener("click", function () { roll(1000); });
    document.getElementById("ps-reset").addEventListener("click", reset);
    function setActive(btn) {
      var sib = btn.parentElement.querySelectorAll(".preset-btn");
      for (var i = 0; i < sib.length; i++) sib[i].classList.remove("active");
      btn.classList.add("active");
    }

    reset();
    window.__onThemeChange = draw;
    window.addEventListener("resize", function () { clearTimeout(window.__psT); window.__psT = setTimeout(draw, 150); });
  }
  window.GATE_VIZ_INIT = init;
})();
