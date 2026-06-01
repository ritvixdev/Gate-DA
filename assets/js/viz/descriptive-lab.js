/* Descriptive-stats lab: histogram + box plot of a dataset, with mean & median markers.
   Switch shape to see how skew pulls the mean away from the median. */
(function () {
  "use strict";
  var DATA = {
    symmetric: [4, 5, 5, 6, 6, 6, 7, 7, 8, 5, 6, 7, 6, 6, 5, 7, 6, 8, 4, 6],
    right: [2, 2, 3, 3, 3, 4, 4, 5, 6, 8, 10, 12, 3, 4, 3, 5, 4, 2, 3, 14],
    outlier: [5, 6, 5, 6, 7, 6, 5, 6, 7, 6, 5, 6, 7, 6, 5, 6, 7, 6, 5, 30],
  };
  function init() {
    var canvas = document.getElementById("descriptive-lab");
    if (!canvas || !window.VizChart) return;
    var readout = document.getElementById("descriptive-lab-readout");
    var key = "symmetric";
    function stats(d) {
      var s = d.slice().sort(function (a, b) { return a - b; }), n = s.length;
      var mean = d.reduce(function (a, b) { return a + b; }, 0) / n;
      function q(p) { var idx = p * (n - 1), lo = Math.floor(idx), hi = Math.ceil(idx); return s[lo] + (s[hi] - s[lo]) * (idx - lo); }
      return { s: s, n: n, mean: mean, med: q(0.5), q1: q(0.25), q3: q(0.75), min: s[0], max: s[n - 1] };
    }
    function draw() {
      var ss = VizChart.setup(canvas), ctx = ss.ctx, W = ss.w, H = ss.h, pad = 36;
      var d = DATA[key], st = stats(d), lo = st.min, hi = st.max;
      var axis = VizChart.css("--viz-axis", "#9b948a"), accent = VizChart.css("--accent3", "#a78bfa"),
          primary = VizChart.css("--primary", "#cc785c"), teal = VizChart.css("--teal", "#5db8a6"), muted = VizChart.css("--muted", "#6c6a64");
      var histH = H * 0.58, boxY = H * 0.78;
      function PX(x) { return pad + (x - lo) / ((hi - lo) || 1) * (W - 2 * pad); }
      ctx.clearRect(0, 0, W, H);
      var bins = Math.min(12, Math.max(5, Math.round(hi - lo + 1))), counts = [];
      for (var z = 0; z < bins; z++) counts[z] = 0;
      d.forEach(function (v) { var bi = Math.min(bins - 1, Math.floor((v - lo) / ((hi - lo) || 1) * bins)); counts[bi]++; });
      var cmax = Math.max.apply(null, counts), bw = (W - 2 * pad) / bins;
      ctx.fillStyle = accent; ctx.globalAlpha = 0.8;
      counts.forEach(function (cn, i) { var h = cn / cmax * (histH - pad); ctx.fillRect(pad + i * bw + 1, histH - h, bw - 2, h); });
      ctx.globalAlpha = 1;
      ctx.font = "11px ui-monospace, monospace"; ctx.textAlign = "center";
      ctx.strokeStyle = primary; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(PX(st.mean), 14); ctx.lineTo(PX(st.mean), histH); ctx.stroke();
      ctx.fillStyle = primary; ctx.fillText("mean", PX(st.mean), 11);
      ctx.strokeStyle = teal; ctx.beginPath(); ctx.moveTo(PX(st.med), 24); ctx.lineTo(PX(st.med), histH); ctx.stroke();
      ctx.fillStyle = teal; ctx.fillText("median", PX(st.med), 34);
      // box plot
      var bh = 16;
      ctx.strokeStyle = axis; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.moveTo(PX(st.min), boxY); ctx.lineTo(PX(st.q1), boxY); ctx.moveTo(PX(st.q3), boxY); ctx.lineTo(PX(st.max), boxY); ctx.stroke();
      ctx.fillStyle = primary; ctx.globalAlpha = 0.18; ctx.fillRect(PX(st.q1), boxY - bh, PX(st.q3) - PX(st.q1), 2 * bh); ctx.globalAlpha = 1;
      ctx.strokeStyle = primary; ctx.strokeRect(PX(st.q1), boxY - bh, PX(st.q3) - PX(st.q1), 2 * bh);
      ctx.strokeStyle = teal; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(PX(st.med), boxY - bh); ctx.lineTo(PX(st.med), boxY + bh); ctx.stroke();
      ctx.strokeStyle = axis; [st.min, st.max].forEach(function (v) { ctx.beginPath(); ctx.moveTo(PX(v), boxY - 8); ctx.lineTo(PX(v), boxY + 8); ctx.stroke(); });
      if (readout) readout.innerHTML = "mean = " + st.mean.toFixed(2) + " &nbsp; median = " + st.med.toFixed(2) +
        " &nbsp; Q1 = " + st.q1.toFixed(1) + " &nbsp; Q3 = " + st.q3.toFixed(1) + " &nbsp; IQR = " + (st.q3 - st.q1).toFixed(1) +
        " &nbsp;·&nbsp; " + (st.mean > st.med + 0.3 ? "<strong>right-skewed</strong> (mean > median)" : st.mean < st.med - 0.3 ? "<strong>left-skewed</strong> (mean < median)" : "<strong>≈ symmetric</strong>");
    }
    function set(k, btn) { key = k; var b = btn.parentElement.querySelectorAll(".preset-btn"); for (var i = 0; i < b.length; i++) b[i].classList.remove("active"); btn.classList.add("active"); draw(); }
    document.getElementById("ds-sym").addEventListener("click", function () { set("symmetric", this); });
    document.getElementById("ds-right").addEventListener("click", function () { set("right", this); });
    document.getElementById("ds-out").addEventListener("click", function () { set("outlier", this); });
    draw(); window.__onThemeChange = draw;
    window.addEventListener("resize", function () { clearTimeout(window.__dsT); window.__dsT = setTimeout(draw, 150); });
  }
  window.GATE_VIZ_INIT = init;
})();
