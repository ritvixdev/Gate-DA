/* Bayes lab: a unit-square "natural frequencies" diagram. Left strip = diseased (width = prevalence),
   right = healthy. Orange = test-positive among diseased (TP), teal = positive among healthy (FP).
   Posterior P(D|+) = TP / (TP + FP) — shows why a rare disease gives a low posterior. */
(function () {
  "use strict";
  function init() {
    var canvas = document.getElementById("bayes-lab");
    if (!canvas || !window.VizChart) return;
    var readout = document.getElementById("bayes-lab-readout");
    var pI = document.getElementById("by-prev"), pV = document.getElementById("by-prev-val");
    var sI = document.getElementById("by-sens"), sV = document.getElementById("by-sens-val");
    var fI = document.getElementById("by-fpr"), fV = document.getElementById("by-fpr-val");
    function draw() {
      var s = VizChart.setup(canvas), ctx = s.ctx, W = s.w, H = s.h, pad = 28;
      var prev = parseFloat(pI.value), sens = parseFloat(sI.value), fpr = parseFloat(fI.value);
      var x0 = pad, y0 = pad, wsq = W - 2 * pad, hsq = H - 2 * pad - 14, wD = wsq * prev;
      var primary = VizChart.css("--primary", "#cc785c"), teal = VizChart.css("--teal", "#5db8a6"), muted = VizChart.css("--muted", "#6c6a64");
      ctx.clearRect(0, 0, W, H);
      // diseased strip: TP (top) + FN
      ctx.fillStyle = primary; ctx.globalAlpha = 0.75; ctx.fillRect(x0, y0, wD, hsq * sens);
      ctx.globalAlpha = 0.16; ctx.fillRect(x0, y0 + hsq * sens, wD, hsq * (1 - sens));
      // healthy strip: FP (top) + TN
      ctx.fillStyle = teal; ctx.globalAlpha = 0.75; ctx.fillRect(x0 + wD, y0, wsq - wD, hsq * fpr);
      ctx.globalAlpha = 0.12; ctx.fillRect(x0 + wD, y0 + hsq * fpr, wsq - wD, hsq * (1 - fpr));
      ctx.globalAlpha = 1;
      ctx.strokeStyle = muted; ctx.lineWidth = 1.5; ctx.strokeRect(x0, y0, wsq, hsq);
      ctx.beginPath(); ctx.moveTo(x0 + wD, y0); ctx.lineTo(x0 + wD, y0 + hsq); ctx.stroke();
      ctx.fillStyle = muted; ctx.font = "11px ui-monospace, monospace"; ctx.textAlign = "center"; ctx.textBaseline = "top";
      ctx.fillText("diseased", x0 + wD / 2, y0 + hsq + 5);
      ctx.fillText("healthy", x0 + wD + (wsq - wD) / 2, y0 + hsq + 5);
      var TP = prev * sens, FP = (1 - prev) * fpr, post = TP / ((TP + FP) || 1);
      if (readout) readout.innerHTML = "P(D) = " + prev.toFixed(2) + " &nbsp; P(+|D) = " + sens.toFixed(2) + " &nbsp; P(+|Dᶜ) = " + fpr.toFixed(2) +
        " &nbsp;·&nbsp; orange = true positives, teal = false positives &nbsp;·&nbsp; <strong>P(D | +) = TP/(TP+FP) = " + post.toFixed(3) + "</strong> (low when the disease is rare — the base-rate effect)";
    }
    [pI, sI, fI].forEach(function (el) { el.addEventListener("input", function () { pV.textContent = (+pI.value).toFixed(2); sV.textContent = (+sI.value).toFixed(2); fV.textContent = (+fI.value).toFixed(2); draw(); }); });
    pV.textContent = (+pI.value).toFixed(2); sV.textContent = (+sI.value).toFixed(2); fV.textContent = (+fI.value).toFixed(2);
    draw(); window.__onThemeChange = draw;
    window.addEventListener("resize", function () { clearTimeout(window.__byT); window.__byT = setTimeout(draw, 150); });
  }
  window.GATE_VIZ_INIT = init;
})();
