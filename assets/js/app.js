/* ============================================================
   GATE DA — shared chrome, theme, progress, quizzes
   Vanilla JS, no dependencies (KaTeX loaded separately via CDN).
   ============================================================ */
(function () {
  "use strict";

  document.documentElement.classList.remove("no-js");

  var THEME_KEY = "gateda:theme";
  var VISITED_KEY = "gateda:la:visited";
  var BRAND_MARK =
    '<svg class="brand-mark" viewBox="0 0 24 24" aria-hidden="true">' +
    '<path fill="currentColor" d="M12 1.5l1.9 6.7 6.6-2-4 5.8 4 5.8-6.6-2L12 22.5l-1.9-6.7-6.6 2 4-5.8-4-5.8 6.6 2z"/>' +
    "</svg>";

  // ---- Theme ------------------------------------------------
  function getInitialTheme() {
    try {
      var saved = localStorage.getItem(THEME_KEY);
      if (saved === "light" || saved === "dark") return saved;
    } catch (e) {}
    if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) return "dark";
    return "light";
  }
  function applyTheme(t) {
    document.documentElement.setAttribute("data-theme", t);
    var btns = document.querySelectorAll("[data-theme-toggle]");
    for (var i = 0; i < btns.length; i++) {
      btns[i].textContent = t === "dark" ? "☀️" : "🌙";
      btns[i].setAttribute("aria-label", t === "dark" ? "Switch to light theme" : "Switch to dark theme");
    }
    if (window.__onThemeChange) window.__onThemeChange(t);
  }
  function toggleTheme() {
    var next = document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
    try { localStorage.setItem(THEME_KEY, next); } catch (e) {}
    applyTheme(next);
  }
  // Apply ASAP to avoid flash.
  applyTheme(getInitialTheme());

  // ---- Progress (localStorage) ------------------------------
  function getVisited() {
    try { return JSON.parse(localStorage.getItem(VISITED_KEY)) || []; } catch (e) { return []; }
  }
  function markVisited(slug) {
    if (!slug) return getVisited();
    var v = getVisited();
    if (v.indexOf(slug) === -1) { v.push(slug); try { localStorage.setItem(VISITED_KEY, JSON.stringify(v)); } catch (e) {} }
    return v;
  }

  // ---- Chrome injection -------------------------------------
  function buildChrome() {
    var body = document.body;
    var slug = body.getAttribute("data-topic");      // e.g. "03-determinants" or null
    var root = body.getAttribute("data-root") || ".";  // path back to site root
    var topics = window.LA_TOPICS || [];
    var laRoot = root + "/linear-algebra";

    var visited = slug ? markVisited(slug) : getVisited();
    var current = topics.filter(function (t) { return t.slug === slug; })[0];

    // Sidebar topic links
    var links = topics.map(function (t, i) {
      var cls = "topic-link";
      if (t.slug === slug) cls += " active";
      else if (visited.indexOf(t.slug) !== -1) cls += " done";
      var n = visited.indexOf(t.slug) !== -1 && t.slug !== slug ? "✓" : (i + 1);
      return (
        '<a class="' + cls + '" href="' + laRoot + "/" + t.slug + '.html">' +
        '<span class="topic-num">' + n + "</span>" +
        '<span class="topic-ico">' + t.icon + "</span>" +
        "<span>" + t.name + "</span></a>"
      );
    }).join("");

    var pct = topics.length ? Math.round((visited.filter(function (s) {
      return topics.some(function (t) { return t.slug === s; });
    }).length / topics.length) * 100) : 0;

    var sidebar =
      '<aside class="sidebar" id="sidebar">' +
        '<div class="sidebar-header">' +
          '<a class="brand" href="' + laRoot + '/index.html">' + BRAND_MARK +
            '<span class="brand-text">Linear<span>Algebra</span></span>' +
          "</a>" +
          '<div class="brand-sub">GATE DA · Complete Guide</div>' +
          '<div class="progress-wrap">' +
            '<div class="progress-label"><span>Progress</span><span>' + visited.filter(function (s) { return topics.some(function (t) { return t.slug === s; }); }).length + " / " + topics.length + "</span></div>" +
            '<div class="progress-track"><div class="progress-fill" style="width:' + pct + '%"></div></div>' +
          "</div>" +
        "</div>" +
        '<div class="nav-section-label">Topics</div>' +
        links +
        '<div class="sidebar-footer">' +
          '<a href="' + root + '/index.html">← All subjects</a>' +
        "</div>" +
      "</aside>";

    var topbar =
      '<header class="topbar">' +
        '<button class="icon-btn menu-btn" id="menuBtn" aria-label="Open menu">☰</button>' +
        '<span class="topbar-title">' + (current ? current.name : "Linear Algebra") + "</span>" +
        '<div class="topbar-actions">' +
          '<button class="icon-btn" data-theme-toggle aria-label="Toggle theme">🌙</button>' +
        "</div>" +
      "</header>";

    // Wrap existing <main data-content> contents into shell
    var main = document.querySelector("[data-content]");
    var inner = main ? main.innerHTML : "";

    var shell =
      '<div class="app">' + sidebar +
        '<div class="main">' + topbar +
          '<main class="content" id="content">' + inner + buildNav(slug, topics, laRoot) + "</main>" +
          '<footer class="site-footer">GATE DA · Linear Algebra · Theme by <a href="https://getdesign.app">getdesign · claude</a></footer>' +
        "</div>" +
      "</div>" +
      '<div class="scrim" id="scrim"></div>';

    body.innerHTML = shell;
    applyTheme(document.documentElement.getAttribute("data-theme"));
  }

  function buildNav(slug, topics, laRoot) {
    if (!slug) return "";
    var idx = topics.map(function (t) { return t.slug; }).indexOf(slug);
    if (idx === -1) return "";
    var prev = idx > 0 ? topics[idx - 1] : null;
    var next = idx < topics.length - 1 ? topics[idx + 1] : null;
    var prevBtn = prev
      ? '<a class="nav-btn" href="' + laRoot + "/" + prev.slug + '.html">← ' + prev.name + "</a>"
      : '<a class="nav-btn" href="' + laRoot + '/index.html">← Overview</a>';
    var nextBtn = next
      ? '<a class="nav-btn primary" href="' + laRoot + "/" + next.slug + '.html">' + next.name + " →</a>"
      : '<span class="nav-btn disabled">Finished 🎉</span>';
    return '<div class="nav-row">' + prevBtn + '<span class="nav-counter">' + (idx + 1) + " / " + topics.length + "</span>" + nextBtn + "</div>";
  }

  // ---- Quiz -------------------------------------------------
  function wireQuizzes(scope) {
    var opts = (scope || document).querySelectorAll(".quiz-opt");
    for (var i = 0; i < opts.length; i++) {
      opts[i].addEventListener("click", function () {
        var card = this.closest(".quiz-card");
        if (!card || card.getAttribute("data-answered")) return;
        card.setAttribute("data-answered", "1");
        var correct = this.getAttribute("data-correct");
        var chosen = this.getAttribute("data-val");
        var all = card.querySelectorAll(".quiz-opt");
        for (var j = 0; j < all.length; j++) {
          all[j].classList.add("locked");
          if (all[j].getAttribute("data-val") === correct) all[j].classList.add("correct");
        }
        if (chosen !== correct) this.classList.add("wrong");
        var fb = card.querySelector('.quiz-feedback[data-fb="' + chosen + '"]');
        if (fb) { fb.classList.add("show", chosen === correct ? "ok" : "bad"); }
      });
    }
  }

  // ---- Scroll reveal ---------------------------------------
  function wireReveal() {
    var cards = document.querySelectorAll(".concept-card");
    if (!("IntersectionObserver" in window)) {
      for (var i = 0; i < cards.length; i++) cards[i].classList.add("revealed");
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("revealed"); io.unobserve(e.target); } });
    }, { threshold: 0.08 });
    for (var k = 0; k < cards.length; k++) io.observe(cards[k]);
  }

  // ---- KaTeX render ----------------------------------------
  function renderMath() {
    if (window.renderMathInElement) {
      window.renderMathInElement(document.body, {
        delimiters: [
          { left: "$$", right: "$$", display: true },
          { left: "$", right: "$", display: false },
          { left: "\\(", right: "\\)", display: false },
          { left: "\\[", right: "\\]", display: true },
        ],
        throwOnError: false,
      });
    }
  }

  // ---- Mobile menu wiring -----------------------------------
  function wireShell() {
    var toggles = document.querySelectorAll("[data-theme-toggle]");
    for (var i = 0; i < toggles.length; i++) toggles[i].addEventListener("click", toggleTheme);

    var menuBtn = document.getElementById("menuBtn");
    var sidebar = document.getElementById("sidebar");
    var scrim = document.getElementById("scrim");
    function close() { if (sidebar) sidebar.classList.remove("open"); if (scrim) scrim.classList.remove("show"); }
    if (menuBtn && sidebar) {
      menuBtn.addEventListener("click", function () {
        sidebar.classList.toggle("open");
        if (scrim) scrim.classList.toggle("show");
      });
    }
    if (scrim) scrim.addEventListener("click", close);

    // Keyboard prev/next
    document.addEventListener("keydown", function (e) {
      if (e.target && /input|textarea|select/i.test(e.target.tagName)) return;
      if (e.key === "ArrowRight") { var n = document.querySelector(".nav-btn.primary[href]"); if (n) n.click(); }
      if (e.key === "ArrowLeft") { var p = document.querySelector(".nav-row .nav-btn:not(.primary)[href]"); if (p) p.click(); }
    });
  }

  // ---- Init -------------------------------------------------
  function init() {
    if (document.querySelector("[data-content]")) buildChrome();
    wireShell();
    wireQuizzes(document);
    wireReveal();
    renderMath();
    if (window.GATE_VIZ_INIT) window.GATE_VIZ_INIT();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
