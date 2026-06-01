/* scene3d.js — tiny vanilla-canvas 3D helper for the GATE DA labs.
   No dependencies. Orthographic projection with yaw/pitch rotation,
   drag-to-rotate (mouse + touch), theme-aware colors, painter's-order helpers.
   Usage:
     var sc = Scene3D.attach(canvas, function (api) { api.drawAxes(2.2); ... }, { range: 2.2 });
     sc.render();                       // initial draw (and on every rotate/resize)
   api inside the draw callback: { ctx, w, h, cx, cy, unit, to2d(p)->{x,y,depth}, drawAxes(R), css } */
(function () {
  "use strict";
  function css(name, fb) {
    var v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
    return v || fb;
  }
  function setup(canvas) {
    var dpr = window.devicePixelRatio || 1;
    var rect = canvas.getBoundingClientRect();
    var w = Math.max(240, Math.round(rect.width || canvas.clientWidth || 480));
    var h = Math.max(220, Math.round(rect.height || canvas.clientHeight || 320));
    canvas.width = w * dpr; canvas.height = h * dpr;
    var ctx = canvas.getContext("2d"); ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    return { ctx: ctx, w: w, h: h };
  }
  function attach(canvas, draw, opts) {
    opts = opts || {};
    var state = { yaw: opts.yaw != null ? opts.yaw : 0.62, pitch: opts.pitch != null ? opts.pitch : 0.42, scale: opts.scale || 1 };
    var range = opts.range || 2.2;

    function project(p) {                       // rotate around Y (yaw) then X (pitch)
      var cy = Math.cos(state.yaw), sy = Math.sin(state.yaw);
      var x1 = p[0] * cy + p[2] * sy, z1 = -p[0] * sy + p[2] * cy, y1 = p[1];
      var cp = Math.cos(state.pitch), sp = Math.sin(state.pitch);
      var y2 = y1 * cp - z1 * sp, z2 = y1 * sp + z1 * cp;
      return { x: x1, y: y2, z: z2 };           // z2 = depth (bigger = nearer the viewer)
    }
    var api = { css: css, state: state, range: range };

    function render() {
      var s = setup(canvas);
      api.ctx = s.ctx; api.w = s.w; api.h = s.h; api.cx = s.w / 2; api.cy = s.h / 2;
      api.unit = Math.min(s.w, s.h) / (2.6 * range) * state.scale;
      api.to2d = function (p) { var q = project(p); return { x: api.cx + q.x * api.unit, y: api.cy - q.y * api.unit, depth: q.z }; };
      api.drawAxes = function (R) {
        R = R || range; var ctx = api.ctx;
        var ax = css("--viz-axis", "#9b948a"), muted = css("--muted", "#6c6a64");
        var axes = [[[-R, 0, 0], [R, 0, 0], "x"], [[0, -R, 0], [0, R, 0], "y"], [[0, 0, -R], [0, 0, R], "z"]];
        ctx.lineWidth = 1; ctx.strokeStyle = ax; ctx.fillStyle = muted; ctx.font = "11px ui-monospace, monospace";
        axes.forEach(function (a) {
          var p = api.to2d(a[0]), q = api.to2d(a[1]);
          ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); ctx.stroke();
          ctx.fillText(a[2], q.x + 4, q.y - 2);
        });
      };
      s.ctx.clearRect(0, 0, s.w, s.h);
      draw(api);
    }

    // drag-to-rotate (mouse + touch)
    var dragging = false, lx = 0, ly = 0;
    function pt(e) { var r = canvas.getBoundingClientRect(); var t = e.touches ? e.touches[0] : e; return { x: t.clientX - r.left, y: t.clientY - r.top }; }
    function down(e) { dragging = true; var p = pt(e); lx = p.x; ly = p.y; if (e.cancelable) e.preventDefault(); }
    function move(e) {
      if (!dragging) return; var p = pt(e);
      state.yaw += (p.x - lx) * 0.01; state.pitch += (p.y - ly) * 0.01;
      state.pitch = Math.max(-1.45, Math.min(1.45, state.pitch));
      lx = p.x; ly = p.y; render(); if (e.cancelable) e.preventDefault();
    }
    function up() { dragging = false; }
    canvas.addEventListener("mousedown", down);
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseup", up);
    canvas.addEventListener("touchstart", down, { passive: false });
    canvas.addEventListener("touchmove", move, { passive: false });
    canvas.addEventListener("touchend", up);
    canvas.style.cursor = "grab";

    api.render = render;
    return api;
  }
  window.Scene3D = { css: css, attach: attach };
})();
