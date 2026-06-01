/* Confidence-interval lab (second lab on CLT): repeated samples give x̄ ± z·σ/√n.
   Draws many intervals; those that miss μ turn red. Coverage ≈ the confidence level. */
(function () {
  "use strict";
  function init() {
    var canvas = document.getElementById("ci-lab");
    if (!canvas || !window.VizChart) return;
    var readout = document.getElementById("ci-lab-readout");
    var nI = document.getElementById("ci-n"), nV = document.getElementById("ci-n-val");
    var MU = 50, SIG = 10, ROWS = 22, samples = null, conf = 95;
    var ZT = { 90: 1.645, 95: 1.96, 99: 2.576 };
    function gauss() { return (Math.random() + Math.random() + Math.random() + Math.random() + Math.random() + Math.random() - 3) / Math.sqrt(0.5); }
    function resample() {
      var n = parseInt(nI.value, 10), se = SIG / Math.sqrt(n);
      samples = []; for (var i = 0; i < ROWS; i++) samples.push(MU + gauss() * se);
      draw();
    }
    function draw() {
      if (!samples) return;
      var s = VizChart.setup(canvas), ctx = s.ctx, W = s.w, H = s.h, pad = 30;
      var z = ZT[conf], n = parseInt(nI.value, 10), se = SIG / Math.sqrt(n), me = z * se;
      var lo = MU - 4 * SIG / Math.sqrt(Math.max(4, n)) - me, hi = MU + 4 * SIG / Math.sqrt(Math.max(4, n)) + me;
      lo = Math.min(lo, MU - me - 1); hi = Math.max(hi, MU + me + 1);
      var primary = VizChart.css("--primary", "#cc785c"), teal = VizChart.css("--teal", "#5db8a6"), muted = VizChart.css("--muted", "#6c6a64"), grid = VizChart.css("--viz-grid", "#e6dfd8");
      function PX(v) { return pad + (v - lo) / (hi - lo) * (W - 2 * pad); }
      ctx.clearRect(0, 0, W, H);
      // μ line
      ctx.strokeStyle = muted; ctx.lineWidth = 1.5; ctx.setLineDash([5, 4]); ctx.beginPath(); ctx.moveTo(PX(MU), pad - 6); ctx.lineTo(PX(MU), H - pad + 6); ctx.stroke(); ctx.setLineDash([]);
      ctx.fillStyle = muted; ctx.font = "11px ui-monospace, monospace"; ctx.textAlign = "center"; ctx.fillText("μ = " + MU, PX(MU), pad - 10);
      var rowH = (H - 2 * pad) / ROWS, hit = 0;
      samples.forEach(function (xb, i) {
        var a = xb - me, b = xb + me, contains = (a <= MU && MU <= b); if (contains) hit++;
        var y = pad + (i + 0.5) * rowH;
        ctx.strokeStyle = contains ? teal : primary; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(PX(a), y); ctx.lineTo(PX(b), y); ctx.stroke();
        ctx.fillStyle = contains ? teal : primary; ctx.beginPath(); ctx.arc(PX(xb), y, 2.5, 0, 7); ctx.fill();
      });
      if (readout) readout.innerHTML = conf + "% CI: x̄ ± " + z + "·σ/√n &nbsp; (σ=" + SIG + ", n=" + n + ", SE=" + se.toFixed(2) + ", margin=" + me.toFixed(2) + ")" +
        " &nbsp;·&nbsp; <strong>" + hit + " of " + ROWS + " intervals contain μ</strong> (≈ " + conf + "%) &nbsp;·&nbsp; red ones missed — that's the " + (100 - conf) + "% risk";
    }
    function setConf(v, btn) { conf = v; var b = btn.parentElement.querySelectorAll(".preset-btn"); for (var i = 0; i < b.length; i++) b[i].classList.remove("active"); btn.classList.add("active"); draw(); }
    document.getElementById("ci-90").addEventListener("click", function () { setConf(90, this); });
    document.getElementById("ci-95").addEventListener("click", function () { setConf(95, this); });
    document.getElementById("ci-99").addEventListener("click", function () { setConf(99, this); });
    nI.addEventListener("input", function () { nV.textContent = nI.value; resample(); });
    var rb = document.getElementById("ci-resample"); if (rb) rb.addEventListener("click", resample);
    nV.textContent = nI.value;
    var prevT = window.__onThemeChange; window.__onThemeChange = function (t) { if (typeof prevT === "function") prevT(t); draw(); };
    window.addEventListener("resize", function () { clearTimeout(window.__ciT); window.__ciT = setTimeout(draw, 150); });
    resample();
  }
  var prev = window.GATE_VIZ_INIT;
  window.GATE_VIZ_INIT = function () { if (typeof prev === "function") prev(); init(); };
})();
