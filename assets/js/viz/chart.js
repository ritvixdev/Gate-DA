/* Tiny theme-aware canvas chart helper for the Probability labs.
   Draws bar charts (with optional grouped bars) and an optional overlaid curve. */
(function () {
  "use strict";
  function css(name, fallback) {
    var v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
    return v || fallback;
  }
  function setup(canvas) {
    var dpr = window.devicePixelRatio || 1;
    var rect = canvas.getBoundingClientRect();
    var w = Math.max(240, Math.round(rect.width || canvas.clientWidth || 480));
    var h = Math.max(180, Math.round(rect.height || canvas.clientHeight || 300));
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    var ctx = canvas.getContext("2d");
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    return { ctx: ctx, w: w, h: h };
  }

  /* opts: { groups:[{values:[...], color}], labels:[...], yMax, curve:[{x,y}], curveColor, yLabel } */
  function barChart(canvas, opts) {
    var s = setup(canvas), ctx = s.ctx, W = s.w, H = s.h;
    var padL = 40, padR = 14, padT = 14, padB = 30;
    var plotW = W - padL - padR, plotH = H - padT - padB;
    var grid = css("--viz-grid", "#e6dfd8");
    var axis = css("--viz-axis", "#9b948a");
    var fg = css("--viz-fg", "#141413");
    var muted = css("--muted", "#6c6a64");
    ctx.clearRect(0, 0, W, H);

    var groups = opts.groups || [];
    var labels = opts.labels || [];
    var n = labels.length || (groups[0] ? groups[0].values.length : 0);
    var yMax = opts.yMax;
    if (yMax == null) {
      yMax = 0;
      groups.forEach(function (g) { g.values.forEach(function (v) { if (v > yMax) yMax = v; }); });
      if (opts.curve) opts.curve.forEach(function (p) { if (p.y > yMax) yMax = p.y; });
      yMax = yMax || 1;
      yMax *= 1.12;
    }
    function X(i) { return padL + (i + 0.5) * (plotW / n); }
    function Y(v) { return padT + plotH - (v / yMax) * plotH; }

    // gridlines + y labels
    ctx.strokeStyle = grid; ctx.fillStyle = muted; ctx.font = "11px ui-monospace, monospace"; ctx.lineWidth = 1;
    for (var g = 0; g <= 4; g++) {
      var yv = (yMax / 4) * g, py = Y(yv);
      ctx.beginPath(); ctx.moveTo(padL, py); ctx.lineTo(W - padR, py); ctx.stroke();
      ctx.textAlign = "right"; ctx.textBaseline = "middle";
      ctx.fillText((Math.round(yv * 1000) / 1000).toString(), padL - 6, py);
    }
    // baseline
    ctx.strokeStyle = axis; ctx.beginPath(); ctx.moveTo(padL, Y(0)); ctx.lineTo(W - padR, Y(0)); ctx.stroke();

    // bars (grouped)
    var slot = plotW / n;
    var ng = groups.length || 1;
    var bw = Math.min(slot * 0.8 / ng, 46);
    groups.forEach(function (grp, gi) {
      ctx.fillStyle = grp.color || css("--primary", "#cc785c");
      grp.values.forEach(function (v, i) {
        var cx = X(i) - (ng * bw) / 2 + gi * bw + bw / 2;
        var top = Y(v), bot = Y(0);
        ctx.fillRect(cx - bw / 2, top, bw, Math.max(0, bot - top));
      });
    });

    // x labels
    ctx.fillStyle = muted; ctx.textAlign = "center"; ctx.textBaseline = "top";
    var step = n > 14 ? Math.ceil(n / 14) : 1;
    for (var i = 0; i < n; i++) {
      if (i % step !== 0 && i !== n - 1) continue;
      ctx.fillText(String(labels[i] != null ? labels[i] : i), X(i), Y(0) + 6);
    }

    // curve overlay
    if (opts.curve && opts.curve.length) {
      ctx.strokeStyle = opts.curveColor || css("--accent3", "#a78bfa");
      ctx.lineWidth = 2; ctx.beginPath();
      opts.curve.forEach(function (p, k) {
        var px = padL + (p.x) * plotW, py = Y(p.y);
        if (k === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
      });
      ctx.stroke();
    }
  }

  window.VizChart = { barChart: barChart, css: css, setup: setup };
})();
