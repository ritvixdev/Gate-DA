(function () {
  "use strict";

  var data = window.GateTikTokData;
  var concepts = window.GateTikTokConcepts;
  var core = window.GateTikTokCore;
  if (!data || !concepts || !core) return;
  if ("scrollRestoration" in history) history.scrollRestoration = "manual";

  var errors = core.validateLearningGraph(data, concepts);
  if (errors.length) console.warn("Gate TikTok data warnings:", errors);

  var STORAGE_KEY = "gateda:linear-algebra:gate-tiktok";
  var feed = document.getElementById("gateFeed");
  var topicButton = document.getElementById("topicButton");
  var topicMenu = document.getElementById("topicMenu");
  var topicList = document.getElementById("topicList");
  var detailDialog = document.getElementById("detailDialog");
  var conceptDialog = document.getElementById("conceptDialog");
  var helpDialog = document.getElementById("helpDialog");
  var currentIndex = 0;
  var currentTopicId = data.topics[0].id;
  var conceptHistory = [];
  var lastFocus = null;
  var completed = new Set();
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var typeLabels = {
    "deep-dive": "Study in depth", "cheat-sheet": "GATE cheat sheet", trap: "Common GATE trap",
    "worked-example": "Worked example", practice: "Practice", "gate-question": "Real GATE pattern"
  };

  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, function (char) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[char];
    });
  }

  function linkedText(text) {
    return escapeHtml(text).replace(/\[\[([^|\]]+)\|([^\]]+)\]\]/g, function (_, id, label) {
      return '<button class="gt-concept-link" data-concept="' + id + '">' + label + "</button>";
    });
  }

  function math(text, display) {
    if (!text) return "";
    if (window.katex) {
      try { return window.katex.renderToString(text, { displayMode: !!display, throwOnError: false }); }
      catch (e) {}
    }
    return escapeHtml(text);
  }

  function renderMathInElement(scope) {
    if (window.renderMathInElement) {
      window.renderMathInElement(scope || document.body, {
        delimiters: [{ left: "$$", right: "$$", display: true }, { left: "$", right: "$", display: false }],
        throwOnError: false
      });
    }
  }

  function optionValue(option, index) {
    var match = /^([A-Z]):/.exec(option);
    return match ? match[1] : String.fromCharCode(65 + index);
  }

  function questionMarkup(card) {
    var question = card.question;
    if (!question) return "";
    var controls = "";
    if (question.type === "NAT") {
      controls = '<div class="gt-nat"><input class="gt-nat-input" inputmode="decimal" aria-label="Numerical answer" placeholder="Type your answer"><button class="gt-check">Check</button></div>';
    } else {
      controls = '<div class="gt-options">' + question.options.map(function (option, i) {
        return '<button class="gt-option" data-value="' + optionValue(option, i) + '">' + linkedText(option) + "</button>";
      }).join("") + '</div><button class="gt-check">Check answer</button>';
    }
    return '<div class="gt-question" data-question-type="' + question.type + '"><div class="gt-question-prompt">' +
      linkedText(question.prompt) + "</div>" + controls + '<div class="gt-feedback" hidden aria-live="polite"></div></div>';
  }

  function cardMarkup(card, index) {
    var topic = data.topics.find(function (item) { return item.id === card.topicId; });
    return '<article class="gt-card" id="card-' + card.id + '" data-index="' + index + '" data-card="' + card.id +
      '" data-topic="' + card.topicId + '" tabindex="-1"><div class="gt-card-inner">' +
      '<div class="gt-type">' + typeLabels[card.type] + "</div>" +
      '<h1 class="gt-hook">' + linkedText(card.hook) + "</h1>" +
      '<div class="gt-body">' + linkedText(card.body) + "</div>" +
      (card.formula ? '<div class="gt-formula">' + math(card.formula, true) + "</div>" : "") +
      questionMarkup(card) +
      '<div class="gt-meta"><span class="gt-chip">' + topic.icon + " " + topic.name + '</span><span class="gt-chip">' +
      card.difficulty + "</span></div>" +
      '<div class="gt-open-cue"><span>＋</span> Tap the card to understand fully</div>' +
      "</div></article>";
  }

  function renderFeed() {
    feed.innerHTML = data.cards.map(cardMarkup).join("");
    renderMathInElement(feed);
  }

  function readState() {
    try {
      var saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
      currentIndex = Math.max(0, Math.min(data.cards.length - 1, saved.index || 0));
      completed = new Set(saved.completed || []);
    } catch (e) {}
  }

  function saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        index: currentIndex, completed: Array.from(completed)
      }));
    } catch (e) {}
  }

  function updateChrome(index) {
    var card = data.cards[index];
    if (!card) return;
    currentIndex = index;
    currentTopicId = card.topicId;
    completed.add(card.id);
    var topic = data.topics.find(function (item) { return item.id === card.topicId; });
    document.getElementById("topicIcon").textContent = topic.icon;
    document.getElementById("topicName").textContent = topic.name;
    document.getElementById("cardCounter").textContent = (index + 1) + " / " + data.cards.length;
    document.getElementById("feedProgress").style.width = ((index + 1) / data.cards.length * 100) + "%";
    topicList.querySelectorAll(".gt-topic-option").forEach(function (button) {
      button.classList.toggle("active", button.dataset.topic === topic.id);
    });
    if (index > 0) document.getElementById("swipeCue").hidden = true;
    saveState();
  }

  function renderTopics() {
    topicList.innerHTML = data.topics.map(function (topic) {
      var cards = core.cardsForTopic(data.cards, topic.id);
      var done = cards.filter(function (card) { return completed.has(card.id); }).length;
      return '<button class="gt-topic-option" data-topic="' + topic.id + '"><span class="gt-topic-icon">' +
        topic.icon + '</span><span><b>' + topic.name + "</b><small>" + done + " of " + cards.length +
        ' viewed</small></span><em>' + topic.order + " / 9</em></button>";
    }).join("");
  }

  function animateCard(cardEl) {
    if (reduceMotion || !window.gsap || !cardEl) return;
    window.gsap.fromTo(cardEl.querySelectorAll(".gt-type,.gt-hook,.gt-body,.gt-formula,.gt-question,.gt-meta,.gt-open-cue"),
      { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: .55, stagger: .055, ease: "power2.out", overwrite: true });
  }

  function observeCards() {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting && entry.intersectionRatio >= .62) {
          var index = Number(entry.target.dataset.index);
          updateChrome(index);
          animateCard(entry.target);
        }
      });
    }, { root: feed, threshold: [.62] });
    feed.querySelectorAll(".gt-card").forEach(function (card) { observer.observe(card); });
  }

  function scrollToIndex(index, behavior) {
    var target = feed.querySelector('[data-index="' + index + '"]');
    if (target) {
      updateChrome(index);
      target.scrollIntoView({ behavior: behavior || (reduceMotion ? "auto" : "smooth"), block: "start" });
    }
  }

  function openDialog(dialog, trigger) {
    lastFocus = trigger || document.activeElement;
    dialog.showModal();
    var focusable = dialog.querySelector("button:not([hidden]):not([disabled]),[href],input:not([hidden]):not([disabled]),[tabindex]:not([tabindex='-1']):not([hidden])");
    if (focusable) {
      focusable.focus({ preventScroll: true });
      requestAnimationFrame(function () {
        if (dialog.open) focusable.focus({ preventScroll: true });
      });
    }
    if (!reduceMotion && window.gsap) {
      var panel = dialog.firstElementChild || dialog;
      window.gsap.fromTo(panel, { y: 36, opacity: 0 }, { y: 0, opacity: 1, duration: .28, ease: "power2.out" });
    }
  }

  function closeDialog(dialog) {
    dialog.close();
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  function trapFocus(event, dialog) {
    if (event.key !== "Tab") return;
    var items = Array.from(dialog.querySelectorAll("button:not([hidden]):not([disabled]),[href],input:not([hidden]):not([disabled]),[tabindex]:not([tabindex='-1']):not([hidden])"));
    if (!items.length) return;
    var first = items[0], last = items[items.length - 1];
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  }

  function openDetail(card, trigger) {
    var detailAnchors = {
      "deep-dive": ["study-in-depth", "Study in Depth"],
      "cheat-sheet": ["section-9", "GATE cheat sheet"],
      trap: ["section-10", "Common traps"],
      "worked-example": ["section-8", "Worked example"],
      practice: ["section-12", "Practice problems"],
      "gate-question": ["section-9", "GATE cheat sheet"]
    };
    var detailTarget = detailAnchors[card.type] || ["study-in-depth", "Study in Depth"];
    var topic = data.topics.find(function (item) { return item.id === card.topicId; });
    document.getElementById("detailEyebrow").textContent = typeLabels[card.type] + " · " + topic.name;
    document.getElementById("detailTitle").textContent = card.hook;
    document.getElementById("detailContent").innerHTML =
      '<p class="gt-detail-lede">' + linkedText(card.detail) + "</p>" +
      (card.formula ? '<div class="gt-detail-block"><h3>Core formula</h3><div class="gt-concept-formula">' + math(card.formula, true) + "</div></div>" : "") +
      '<div class="gt-detail-block"><h3>Connect the dots</h3><div class="gt-related">' +
      card.concepts.map(function (id) { return '<button data-concept="' + id + '">' + concepts[id].label + "</button>"; }).join("") +
      '</div></div><a class="gt-detail-link" href="' + card.source + "#" + detailTarget[0] +
      '">Open ' + detailTarget[1] + " in the lesson →</a>";
    renderMathInElement(document.getElementById("detailContent"));
    openDialog(detailDialog, trigger);
  }

  function conceptMarkup(concept) {
    var related = concept.relatedConcepts.map(function (id) {
      return '<button data-concept="' + id + '">' + concepts[id].label + "</button>";
    }).join("");
    var prerequisites = concept.prerequisites.map(function (id) {
      return '<button data-concept="' + id + '">' + concepts[id].label + "</button>";
    }).join("");
    return '<div class="gt-concept-section"><h3>What it means</h3><p class="gt-concept-definition">' +
      linkedText(concept.definition) + '</p></div>' +
      '<div class="gt-concept-formula">' + math(concept.formula, true) + '</div>' +
      '<div class="gt-detail-block"><h3>Mini example</h3><p>' + linkedText(concept.example) + "</p></div>" +
      '<div class="gt-detail-block gt-gate-focus"><h3>Why it matters for GATE</h3><p>' +
      linkedText(concept.gateFocus) + "</p></div>" +
      (prerequisites ? '<div class="gt-concept-section"><h3>Builds on</h3><div class="gt-related">' + prerequisites + "</div></div>" : "") +
      (related ? '<div class="gt-concept-section"><h3>Connect next</h3><div class="gt-related">' + related + "</div></div>" : "") +
      '<a class="gt-concept-source" href="' + concept.lessonUrl + "#" + concept.lessonAnchor +
      '">Open ' + concept.lessonSection + " in the full lesson →</a>";
  }

  function showConcept(id, trigger, pushHistory) {
    var concept = concepts[id];
    if (!concept) return;
    if (pushHistory !== false && conceptHistory[conceptHistory.length - 1] !== id) conceptHistory.push(id);
    document.getElementById("conceptTitle").textContent = concept.label;
    document.getElementById("conceptContent").innerHTML = conceptMarkup(concept);
    document.getElementById("conceptBack").hidden = conceptHistory.length < 2;
    renderMathInElement(document.getElementById("conceptContent"));
    if (!conceptDialog.open) openDialog(conceptDialog, trigger);
    else if (!reduceMotion && window.gsap) window.gsap.fromTo("#conceptContent", { x: 16, opacity: 0 }, { x: 0, opacity: 1, duration: .22 });
  }

  function selectedAnswers(questionEl) {
    if (questionEl.dataset.questionType === "NAT") return questionEl.querySelector(".gt-nat-input").value;
    return Array.from(questionEl.querySelectorAll(".gt-option.selected")).map(function (option) { return option.dataset.value; });
  }

  function gradeCard(cardEl, button) {
    var card = data.cards[Number(cardEl.dataset.index)];
    var questionEl = button.closest(".gt-question");
    var response = selectedAnswers(questionEl);
    var ok = core.gradeQuestion(card.question, response);
    var feedback = questionEl.querySelector(".gt-feedback");
    feedback.hidden = false;
    feedback.className = "gt-feedback " + (ok ? "ok" : "bad");
    feedback.innerHTML = "<b>" + (ok ? "Correct." : "Not quite.") + "</b> " + linkedText(card.question.explanation);
    if (card.question.type !== "NAT") {
      questionEl.querySelectorAll(".gt-option").forEach(function (option) {
        var answer = Array.isArray(card.question.answer) ? card.question.answer : [card.question.answer];
        if (answer.indexOf(option.dataset.value) !== -1) option.classList.add("correct");
        else if (option.classList.contains("selected")) option.classList.add("wrong");
        option.disabled = true;
      });
    }
    button.disabled = true;
    renderMathInElement(feedback);
    if (!reduceMotion && window.gsap) window.gsap.fromTo(feedback, { scale: .97, opacity: 0 }, { scale: 1, opacity: 1, duration: .25 });
  }

  renderFeed();
  readState();
  renderTopics();
  observeCards();
  requestAnimationFrame(function () { scrollToIndex(currentIndex, "auto"); updateChrome(currentIndex); });

  topicButton.addEventListener("click", function () { renderTopics(); openDialog(topicMenu, topicButton); });
  document.getElementById("helpButton").addEventListener("click", function (event) { openDialog(helpDialog, event.currentTarget); });
  topicList.addEventListener("click", function (event) {
    var button = event.target.closest(".gt-topic-option");
    if (!button) return;
    var index = data.cards.findIndex(function (card) { return card.topicId === button.dataset.topic; });
    closeDialog(topicMenu);
    scrollToIndex(index);
  });

  document.addEventListener("click", function (event) {
    var close = event.target.closest("[data-close]");
    if (close) { closeDialog(document.getElementById(close.dataset.close)); return; }
    var conceptLink = event.target.closest("[data-concept]");
    if (conceptLink) {
      event.preventDefault(); event.stopPropagation();
      showConcept(conceptLink.dataset.concept, conceptLink, true); return;
    }
    var option = event.target.closest(".gt-option");
    if (option && !option.disabled) {
      event.stopPropagation();
      var question = option.closest(".gt-question");
      if (question.dataset.questionType === "MSQ") option.classList.toggle("selected");
      else {
        question.querySelectorAll(".gt-option").forEach(function (item) { item.classList.remove("selected"); });
        option.classList.add("selected");
      }
      return;
    }
    var check = event.target.closest(".gt-check");
    if (check) { event.stopPropagation(); gradeCard(check.closest(".gt-card"), check); return; }
    var inner = event.target.closest(".gt-card-inner");
    if (inner) openDetail(data.cards[Number(inner.closest(".gt-card").dataset.index)], inner);
  });

  document.getElementById("conceptBack").addEventListener("click", function () {
    if (conceptHistory.length > 1) {
      conceptHistory.pop();
      showConcept(conceptHistory[conceptHistory.length - 1], this, false);
    }
  });

  [topicMenu, detailDialog, conceptDialog, helpDialog].forEach(function (dialog) {
    dialog.addEventListener("keydown", function (event) {
      trapFocus(event, dialog);
      if (event.key === "Escape") closeDialog(dialog);
    });
    dialog.addEventListener("click", function (event) {
      if (event.target === dialog) closeDialog(dialog);
    });
  });

  document.addEventListener("keydown", function (event) {
    if ([topicMenu, detailDialog, conceptDialog, helpDialog].some(function (dialog) { return dialog.open; })) return;
    if (/input|textarea|select/i.test(event.target.tagName)) return;
    if (event.key === "ArrowDown" || event.key === "PageDown" || event.key === "ArrowRight") {
      event.preventDefault(); scrollToIndex(core.nextIndex(currentIndex, 1, data.cards.length, false));
    }
    if (event.key === "ArrowUp" || event.key === "PageUp" || event.key === "ArrowLeft") {
      event.preventDefault(); scrollToIndex(core.nextIndex(currentIndex, -1, data.cards.length, false));
    }
    if (event.key === "Home") { event.preventDefault(); scrollToIndex(0); }
    if (event.key === "End") { event.preventDefault(); scrollToIndex(data.cards.length - 1); }
  });
})();
