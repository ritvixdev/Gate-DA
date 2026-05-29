/* ============================================================
   GATE DA — Canvas grid helper for interactive visualizations.
   Provides a 2D Cartesian plane with data<->pixel mapping,
   axes, gridlines, vectors, polygons, and pointer interaction.
   Theme-aware (reads CSS custom properties each draw).
   ============================================================ */
(function () {
  "use strict";

  // ---- Viz registry: init + redraw on theme change ----------
  window.__vizInit = window.__vizInit || [];
  window.__vizRedraw = window.__vizRedraw || [];
  window.GATE_VIZ_INIT = function () {
    window.__vizInit.forEach(function (fn) { try { fn(); } catch (e) { console.error(e); } });
  };
  window.__onThemeChange = function () {
    window.__vizRedraw.forEach(function (fn) { try { fn(); } catch (e) {} });
  };

  function cssVar(name, fallback) {
    var v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
    return v || fallback;
  }

  function Grid(canvas, opts) {
    opts = opts || {};
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.range = opts.range || 5;     // axis spans -range .. +range
    this.dpr = Math.max(1, window.devicePixelRatio || 1);
    this.resize();
    var self = this;
    if (window.ResizeObserver) {
      this._ro = new ResizeObserver(function () { self.resize(); if (self.onResize) self.onResize(); });
      this._ro.observe(canvas);
    }
  }

  Grid.prototype.resize = function () {
    var rect = this.canvas.getBoundingClientRect();
    var size = Math.max(120, Math.round(rect.width));
    this.cssSize = size;
    this.canvas.width = size * this.dpr;
    this.canvas.height = size * this.dpr;
    this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    this.scale = size / (this.range * 2);   // pixels per unit
    this.cx = size / 2;
    this.cy = size / 2;
  };

  Grid.prototype.colors = function () {
    return {
      grid: cssVar("--viz-grid", "#e0d8cb"),
      axis: cssVar("--viz-axis", "#b6ada0"),
      fg: cssVar("--viz-fg", "#141413"),
      primary: cssVar("--primary", "#cc785c"),
      teal: cssVar("--teal", "#5db8a6"),
      amber: cssVar("--amber", "#e8a55a"),
      muted: cssVar("--muted", "#6c6a64"),
      canvas: cssVar("--surface-card", "#efe9de"),
    };
  };

  // data -> pixel
  Grid.prototype.px = function (x, y) {
    return { x: this.cx + x * this.scale, y: this.cy - y * this.scale };
  };
  // pixel -> data
  Grid.prototype.data = function (px, py) {
    return { x: (px - this.cx) / this.scale, y: (this.cy - py) / this.scale };
  };
  // pointer event -> data coords
  Grid.prototype.eventData = function (evt) {
    var rect = this.canvas.getBoundingClientRect();
    var t = evt.touches && evt.touches[0] ? evt.touches[0] : evt;
    return this.data(t.clientX - rect.left, t.clientY - rect.top);
  };

  Grid.prototype.clear = function () {
    this.ctx.clearRect(0, 0, this.cssSize, this.cssSize);
  };

  Grid.prototype.drawGrid = function () {
    var c = this.colors(), ctx = this.ctx;
    ctx.lineWidth = 1;
    ctx.strokeStyle = c.grid;
    for (var i = -this.range; i <= this.range; i++) {
      if (i === 0) continue;
      var v = this.px(i, 0), h = this.px(0, i);
      ctx.beginPath(); ctx.moveTo(v.x, 0); ctx.lineTo(v.x, this.cssSize); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(0, h.y); ctx.lineTo(this.cssSize, h.y); ctx.stroke();
    }
    // Axes
    ctx.strokeStyle = c.axis; ctx.lineWidth = 1.5;
    var o = this.px(0, 0);
    ctx.beginPath(); ctx.moveTo(0, o.y); ctx.lineTo(this.cssSize, o.y); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(o.x, 0); ctx.lineTo(o.x, this.cssSize); ctx.stroke();
  };

  Grid.prototype.drawArrow = function (from, to, color, width) {
    var ctx = this.ctx;
    var a = this.px(from.x, from.y), b = this.px(to.x, to.y);
    var dx = b.x - a.x, dy = b.y - a.y, len = Math.hypot(dx, dy);
    ctx.strokeStyle = color; ctx.fillStyle = color; ctx.lineWidth = width || 2.5;
    ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
    if (len < 4) return;
    var ang = Math.atan2(dy, dx), head = 10;
    ctx.beginPath();
    ctx.moveTo(b.x, b.y);
    ctx.lineTo(b.x - head * Math.cos(ang - 0.4), b.y - head * Math.sin(ang - 0.4));
    ctx.lineTo(b.x - head * Math.cos(ang + 0.4), b.y - head * Math.sin(ang + 0.4));
    ctx.closePath(); ctx.fill();
  };

  // Vector from origin (default 0,0)
  Grid.prototype.drawVector = function (vec, o) {
    o = o || {};
    var origin = o.origin || { x: 0, y: 0 };
    this.drawArrow(origin, { x: origin.x + vec.x, y: origin.y + vec.y }, o.color || this.colors().fg, o.width);
    if (o.label) this.label(origin.x + vec.x, origin.y + vec.y, o.label, o.color);
    if (o.handle) this.dot(origin.x + vec.x, origin.y + vec.y, o.color);
  };

  Grid.prototype.dot = function (x, y, color) {
    var p = this.px(x, y), ctx = this.ctx;
    ctx.fillStyle = color; ctx.strokeStyle = this.colors().canvas; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.arc(p.x, p.y, 6, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
  };

  Grid.prototype.label = function (x, y, text, color) {
    var p = this.px(x, y), ctx = this.ctx;
    ctx.fillStyle = color || this.colors().fg;
    ctx.font = "600 13px 'JetBrains Mono', monospace";
    ctx.fillText(text, p.x + 8, p.y - 8);
  };

  Grid.prototype.polygon = function (pts, fill, stroke) {
    var ctx = this.ctx;
    ctx.beginPath();
    for (var i = 0; i < pts.length; i++) {
      var p = this.px(pts[i].x, pts[i].y);
      if (i === 0) ctx.moveTo(p.x, p.y); else ctx.lineTo(p.x, p.y);
    }
    ctx.closePath();
    if (fill) { ctx.fillStyle = fill; ctx.fill(); }
    if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = 1.5; ctx.stroke(); }
  };

  // Draggable points: returns index of nearest point within tol px, else -1
  Grid.prototype.hit = function (evt, points, tol) {
    var rect = this.canvas.getBoundingClientRect();
    var t = evt.touches && evt.touches[0] ? evt.touches[0] : evt;
    var mx = t.clientX - rect.left, my = t.clientY - rect.top;
    var best = -1, bd = (tol || 18);
    for (var i = 0; i < points.length; i++) {
      var p = this.px(points[i].x, points[i].y);
      var d = Math.hypot(p.x - mx, p.y - my);
      if (d < bd) { bd = d; best = i; }
    }
    return best;
  };

  // Convenience: wire dragging of an array of data points.
  Grid.prototype.makeDraggable = function (getPoints, onMove) {
    var self = this, active = -1;
    function down(e) {
      active = self.hit(e, getPoints());
      if (active !== -1) e.preventDefault();
    }
    function move(e) {
      if (active === -1) return;
      e.preventDefault();
      onMove(active, self.eventData(e));
    }
    function up() { active = -1; }
    this.canvas.addEventListener("mousedown", down);
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseup", up);
    this.canvas.addEventListener("touchstart", down, { passive: false });
    this.canvas.addEventListener("touchmove", move, { passive: false });
    window.addEventListener("touchend", up);
  };

  window.Grid = Grid;
})();
