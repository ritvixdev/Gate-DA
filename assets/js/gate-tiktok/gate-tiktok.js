(function () {
  "use strict";

  var data = window.GateTikTokData;
  var concepts = window.GateTikTokConcepts;
  var core = window.GateTikTokCore;
  var graphCore = window.GateConceptGraphCore;
  if (!data || !concepts || !core || !graphCore) return;
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
  var graphState = null;
  var graphPathIds = [];
  var graphZoom = 1;
  var graphMode = false;
  var currentConceptId = null;
  var conceptSheetScroll = 0;
  var graphEntryConceptId = null;
  var graphEntryScroll = 0;
  var graphSelectedConceptId = null;
  var graphPreviousConceptId = null;
  var lastFocus = null;
  var completed = new Set();
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var typeLabels = {
    "basic-definition": "Basic definition", "deep-dive": "Study in depth", "cheat-sheet": "GATE cheat sheet", trap: "Common GATE trap",
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

  function escapeRegExp(value) {
    return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }

  function decorateConceptLinks(scope, conceptIds) {
    var used = new Set();
    var terms = [];
    (conceptIds || []).forEach(function (id) {
      var concept = concepts[id];
      if (!concept) return;
      [concept.label].concat(concept.aliases || []).forEach(function (term) {
        if (term && term.length > 2) terms.push({ id: id, term: term });
      });
    });
    terms.sort(function (a, b) { return b.term.length - a.term.length; });
    if (!terms.length) return;
    var pattern = new RegExp("\\b(" + terms.map(function (item) {
      return escapeRegExp(item.term);
    }).join("|") + ")\\b", "i");
    var walker = document.createTreeWalker(scope, NodeFilter.SHOW_TEXT);
    var nodes = [];
    while (walker.nextNode()) {
      var parent = walker.currentNode.parentElement;
      if (!parent || parent.closest("button,a,input,textarea,code,pre,script,style,.katex,.gt-formula")) continue;
      if (pattern.test(walker.currentNode.nodeValue)) nodes.push(walker.currentNode);
    }
    nodes.forEach(function (node) {
      var text = node.nodeValue;
      var match = pattern.exec(text);
      if (!match) return;
      var matched = terms.find(function (item) {
        return item.term.toLowerCase() === match[1].toLowerCase() && !used.has(item.id);
      });
      if (!matched) return;
      used.add(matched.id);
      var fragment = document.createDocumentFragment();
      fragment.appendChild(document.createTextNode(text.slice(0, match.index)));
      var button = document.createElement("button");
      button.className = "gt-concept-link";
      button.dataset.concept = matched.id;
      button.textContent = match[1];
      fragment.appendChild(button);
      fragment.appendChild(document.createTextNode(text.slice(match.index + match[1].length)));
      node.replaceWith(fragment);
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
    if (question.type === "REVEAL") {
      controls = '<button class="gt-check">Reveal answer</button>';
    } else if (question.type === "NAT") {
      controls = '<div class="gt-nat"><input class="gt-nat-input" inputmode="decimal" aria-label="Numerical answer" placeholder="Type your answer"><button class="gt-check">Check</button></div>';
    } else {
      controls = '<div class="gt-options">' + question.options.map(function (option, i) {
        return '<button class="gt-option" data-value="' + optionValue(option, i) + '">' + linkedText(option) + "</button>";
      }).join("") + '</div><button class="gt-check">Check answer</button>';
    }
    var prompt = card.type === "practice" ? "" :
      '<div class="gt-question-prompt">' + linkedText(question.prompt) + "</div>";
    return '<div class="gt-question" data-question-type="' + question.type + '">' + prompt +
      controls + '<div class="gt-feedback" hidden aria-live="polite"></div></div>';
  }

  function cardMarkup(card, index) {
    var topic = data.topics.find(function (item) { return item.id === card.topicId; });
    var definitionLearning = card.type === "basic-definition" ?
      '<div class="gt-definition-learning">' +
      '<div class="gt-learning-row"><small>Meaning</small><p>' + linkedText(card.beginnerMeaning) + "</p></div>" +
      '<div class="gt-learning-row"><small>Example</small><p>' + linkedText(card.example) + "</p></div>" +
      '<div class="gt-learning-row gt-learning-consequence"><small>Therefore</small><p>' + linkedText(card.consequence) + "</p></div>" +
      '<div class="gt-learning-row gt-learning-gate"><small>GATE connection</small><p>' + linkedText(card.gateSignal) + "</p></div>" +
      "</div>" : "";
    return '<article class="gt-card" id="card-' + card.id + '" data-index="' + index + '" data-card="' + card.id +
      '" data-topic="' + card.topicId + '" tabindex="-1"><div class="gt-card-inner">' +
      '<div class="gt-type">' + typeLabels[card.type] + "</div>" +
      '<h1 class="gt-hook">' + linkedText(card.hook) + "</h1>" +
      definitionLearning +
      (card.question || card.type === "basic-definition" ? "" : '<div class="gt-body">' + linkedText(card.body) + "</div>") +
      (card.formula ? '<div class="gt-formula">' + math(card.formula, true) + "</div>" : "") +
      questionMarkup(card) +
      '<div class="gt-meta"><span class="gt-chip">' + topic.icon + " " + topic.name + '</span><span class="gt-chip">' +
      card.difficulty + "</span></div>" +
      '<div class="gt-open-cue"><span>＋</span> Tap the card to understand fully</div>' +
      "</div></article>";
  }

  function renderFeed() {
    feed.innerHTML = data.cards.map(cardMarkup).join("");
    feed.querySelectorAll(".gt-card").forEach(function (cardEl) {
      var card = data.cards[Number(cardEl.dataset.index)];
      decorateConceptLinks(cardEl, card.concepts);
    });
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
    var topic = data.topics.find(function (item) { return item.id === card.topicId; });
    document.getElementById("detailEyebrow").textContent = typeLabels[card.type] + " · " + topic.name;
    document.getElementById("detailTitle").textContent = card.hook;
    document.getElementById("detailContent").innerHTML =
      '<div class="gt-rich-detail">' + (card.detailHtml || '<p class="gt-detail-lede">' + linkedText(card.detail) + "</p>") + "</div>" +
      (card.formula ? '<div class="gt-detail-block"><h3>Core formula</h3><div class="gt-concept-formula">' + math(card.formula, true) + "</div></div>" : "") +
      '<div class="gt-detail-block"><h3>Connect the dots</h3><div class="gt-related">' +
      card.concepts.map(function (id) { return '<button data-concept="' + id + '">' + concepts[id].label + "</button>"; }).join("") +
      '</div></div><a class="gt-detail-link" href="' + card.source + "#" + card.sourceAnchor +
      '">Open ' + card.sourceLabel + " in the lesson →</a>";
    var detailContent = document.getElementById("detailContent");
    decorateConceptLinks(detailContent, card.concepts);
    renderMathInElement(detailContent);
    openDialog(detailDialog, trigger);
  }

  function learningItems(items) {
    return (items || []).map(function (item) {
      return '<li><b>' + linkedText(item.statement) + "</b><span>" + linkedText(item.explanation) + "</span>" +
        (item.formula ? '<div class="gt-mini-formula">' + math(item.formula, false) + "</div>" : "") + "</li>";
    }).join("");
  }

  function gateQuestionLinks(concept) {
    var cards = (concept.questionIds || []).map(function (id) {
      return data.cards.find(function (card) { return card.id === id; });
    }).filter(Boolean).slice(0, 6);
    if (!cards.length) return "";
    return '<div class="gt-detail-block gt-question-links"><h3>Relevant GATE questions</h3>' +
      cards.map(function (card) {
        return '<button data-gate-card="' + card.id + '"><b>' + escapeHtml(card.hook) +
          "</b><span>" + escapeHtml(card.question.type) + " · " +
          escapeHtml(card.gateAnalysis.reasoningSteps.length + " reasoning steps") + "</span></button>";
      }).join("") + "</div>";
  }

  function compactConnections(concept) {
    var ranked = graphCore.rankedConnections(concepts, concept.id, 5);
    if (!ranked.length) return "";
    return '<div class="gt-detail-block gt-connect-card"><h3>Connect the dots</h3>' +
      '<p class="gt-connect-intro">The five strongest links from this concept, ranked by usefulness.</p>' +
      ranked.map(function (edge, index) {
        return '<button data-concept="' + edge.targetId + '"><em>' + (index + 1) + '</em><span><small>' +
          escapeHtml(edge.label) + '</small><b>' + escapeHtml(concepts[edge.targetId].label) +
          '</b><i>' + escapeHtml(edge.explanation) + "</i></span><strong>→</strong></button>";
      }).join("") + "</div>";
  }

  function gateAnalysisMarkup(analysis) {
    if (!analysis) return "";
    return '<div class="gt-gate-analysis"><h4>Recognition clues</h4><ul>' +
      analysis.recognitionClues.map(function (clue) { return "<li>" + linkedText(clue) + "</li>"; }).join("") +
      '</ul><h4>Reasoning chain</h4><ol>' +
      analysis.reasoningSteps.map(function (step) { return "<li>" + linkedText(step) + "</li>"; }).join("") +
      '</ol><h4>Formulas used</h4><div class="gt-formula-chips">' +
      analysis.formulasUsed.map(function (formula) { return "<span>" + math(formula, false) + "</span>"; }).join("") +
      '</div><h4>Common trap</h4><p>' + linkedText(analysis.trap) + "</p></div>";
  }

  function conceptMarkup(concept) {
    return '<div class="gt-concept-section"><h3>What it means</h3><p class="gt-concept-definition">' +
      linkedText(concept.beginnerMeaning) + '</p></div>' +
      '<div class="gt-concept-formula">' + math(concept.formula, true) + '</div>' +
      '<div class="gt-example-grid"><div class="gt-detail-block"><h3>Example</h3><p>' + linkedText(concept.example) +
      "</p><small>" + linkedText(concept.exampleExplanation) + '</small></div>' +
      '<div class="gt-detail-block gt-counterexample"><h3>Not an example</h3><p>' + linkedText(concept.counterexample) +
      "</p><small>" + linkedText(concept.counterexampleExplanation) + "</small></div></div>" +
      '<div class="gt-detail-block"><h3>What follows from this?</h3><ul class="gt-reason-list">' +
      learningItems(concept.consequences) + "</ul></div>" +
      '<div class="gt-detail-block"><h3>Important properties</h3><ul class="gt-reason-list">' +
      learningItems(concept.properties) + "</ul></div>" +
      '<div class="gt-detail-block gt-gate-focus"><h3>Why it matters for GATE</h3><p>' +
      linkedText(concept.gateFocus) + '</p><ul class="gt-reason-list">' + learningItems(concept.gateSignals) + "</ul></div>" +
      '<div class="gt-detail-block gt-trap-block"><h3>Common trap</h3><ul class="gt-reason-list">' +
      learningItems(concept.gateTraps) + "</ul></div>" +
      gateQuestionLinks(concept) +
      compactConnections(concept) +
      '<div class="gt-concept-actions"><a class="gt-concept-source" href="' + concept.lessonUrl + "#" + concept.lessonAnchor +
      '">Open ' + concept.lessonSection + '</a><button id="exploreGraph" type="button">Explore graph →</button></div>';
  }

  function allGraphEdges() {
    var byId = {};
    Object.keys(concepts).forEach(function (id) {
      graphCore.edgesFor(concepts, id).forEach(function (edge) { byId[edge.id] = edge; });
    });
    return byId;
  }

  function graphNodeLabel(label, x, y) {
    var words = label.split(/\s+/);
    if (label.length <= 12 || words.length === 1) {
      return '<tspan x="' + x + '" y="' + y + '">' + escapeHtml(label) + "</tspan>";
    }
    var splitAt = Math.ceil(words.length / 2);
    var first = words.slice(0, splitAt).join(" ");
    var second = words.slice(splitAt).join(" ");
    return '<tspan x="' + x + '" y="' + (y - 7) + '">' + escapeHtml(first) +
      '</tspan><tspan x="' + x + '" y="' + (y + 8) + '">' + escapeHtml(second) + "</tspan>";
  }

  function renderConceptGraph() {
    if (!graphState) return;
    var svg = document.getElementById("conceptGraph");
    var viewWidth = 720 / graphZoom, viewHeight = 480 / graphZoom;
    svg.setAttribute("viewBox", ((720 - viewWidth) / 2) + " " + ((480 - viewHeight) / 2) + " " + viewWidth + " " + viewHeight);
    var nodes = graphState.nodeIds;
    var positions = {};
    positions[graphState.rootId] = { x: 360, y: 240 };
    nodes.filter(function (id) { return id !== graphState.rootId; }).forEach(function (id, index, list) {
      var angle = (-Math.PI / 2) + (Math.PI * 2 * index / Math.max(1, list.length));
      var radius = list.length > 10 ? 190 : 160;
      positions[id] = { x: 360 + Math.cos(angle) * radius, y: 240 + Math.sin(angle) * radius };
    });
    var edgeLookup = allGraphEdges();
    var edges = graphState.edgeIds.map(function (id) { return edgeLookup[id]; }).filter(Boolean);
    var pathPairs = new Set();
    for (var i = 0; i < graphPathIds.length - 1; i += 1) {
      pathPairs.add(graphPathIds[i] + "|" + graphPathIds[i + 1]);
      pathPairs.add(graphPathIds[i + 1] + "|" + graphPathIds[i]);
    }
    var edgeMarkup = edges.map(function (edge) {
      var from = positions[edge.sourceId], to = positions[edge.targetId];
      if (!from || !to) return "";
      var active = pathPairs.has(edge.sourceId + "|" + edge.targetId);
      return '<g class="gt-graph-edge' + (active ? " path-active" : "") + '" data-edge="' + edge.id +
        '" tabindex="0" role="button" aria-label="' + escapeHtml(edge.label + ": " + edge.explanation) + '">' +
        '<line x1="' + from.x + '" y1="' + from.y + '" x2="' + to.x + '" y2="' + to.y + '"></line>' +
        '<text x="' + ((from.x + to.x) / 2) + '" y="' + ((from.y + to.y) / 2) + '">' +
        escapeHtml(edge.label) + "</text></g>";
    }).join("");
    var nodeMarkup = nodes.map(function (id) {
      var point = positions[id], concept = concepts[id];
      return '<g class="gt-graph-node' + (id === graphState.rootId ? " root" : "") +
        (id === graphState.focusedId ? " focused" : "") +
        (graphState.expandedIds.indexOf(id) !== -1 ? " expanded" : "") +
        '" data-graph-concept="' + id + '" tabindex="0" role="button" aria-label="Explore ' +
        escapeHtml(concept.label) + '"><circle cx="' + point.x + '" cy="' + point.y +
        '" r="42"></circle><text>' + graphNodeLabel(concept.label, point.x, point.y) + "</text></g>";
    }).join("");
    svg.innerHTML = '<title id="conceptGraphTitle">Linear Algebra concept connections</title>' +
      '<desc id="conceptGraphDesc">Select a concept node to explain it and expand more connections.</desc>' +
      '<g class="gt-graph-edges">' + edgeMarkup + '</g><g class="gt-graph-nodes">' + nodeMarkup + "</g>";
    document.getElementById("conceptGraphStatus").textContent =
      nodes.length + " concepts visible. Select any node to explain and expand it.";
    document.getElementById("conceptRelationshipList").innerHTML = edges.map(function (edge) {
      return '<li><button data-edge="' + edge.id + '"><b>' + escapeHtml(concepts[edge.sourceId].label) +
        " → " + escapeHtml(concepts[edge.targetId].label) + "</b>: " + escapeHtml(edge.explanation) + "</button></li>";
    }).join("");
  }

  function renderConceptDetails(id) {
    var concept = concepts[id];
    currentConceptId = id;
    document.getElementById("conceptTitle").textContent = concept.label;
    document.getElementById("conceptContent").innerHTML = conceptMarkup(concept);
    document.getElementById("conceptBack").hidden = conceptHistory.length < 2;
    renderMathInElement(document.getElementById("conceptContent"));
  }

  function showConcept(id, trigger, pushHistory) {
    if (!concepts[id]) return;
    if (!conceptDialog.open) {
      graphMode = false;
      document.getElementById("conceptGraphView").hidden = true;
      document.getElementById("conceptSheetView").hidden = false;
    }
    if (pushHistory !== false && conceptHistory[conceptHistory.length - 1] !== id) conceptHistory.push(id);
    if (graphMode && graphState) {
      graphState = graphCore.expandGraph(concepts, graphState, id);
      graphState.focusedId = id;
    }
    renderConceptDetails(id);
    if (graphMode) renderConceptGraph();
    if (!conceptDialog.open) openDialog(conceptDialog, trigger);
    else if (!reduceMotion && window.gsap) window.gsap.fromTo("#conceptContent", { x: 16, opacity: 0 }, { x: 0, opacity: 1, duration: .22 });
  }

  function revealSelectedGraphNode() {
    if (!window.matchMedia("(max-width: 849px)").matches) return;
    var panel = document.getElementById("graphNodePanel");
    requestAnimationFrame(function () {
      panel.scrollIntoView({
        block: "nearest",
        behavior: reduceMotion ? "auto" : "smooth"
      });
    });
  }

  function showGraphNode(id, edge) {
    var concept = concepts[id];
    if (!concept || !graphState) return;
    graphPreviousConceptId = graphSelectedConceptId;
    graphSelectedConceptId = id;
    var connection = edge || (graphPreviousConceptId ?
      graphCore.edgeBetween(concepts, graphPreviousConceptId, id) : null);
    graphState = graphCore.expandGraph(concepts, graphState, id);
    graphState.focusedId = id;
    document.getElementById("conceptTitle").textContent = concept.label;
    document.getElementById("graphNodeRelation").textContent =
      connection ? connection.label : (id === graphEntryConceptId ? "Graph starting concept" : "Selected concept");
    document.getElementById("graphNodeTitle").textContent = concept.label;
    document.getElementById("graphNodeMeaning").textContent = concept.beginnerMeaning;
    document.getElementById("graphNodeFormula").innerHTML = math(concept.formula, true);
    document.getElementById("graphNodeConnection").textContent = connection ? connection.explanation :
      (graphPreviousConceptId && graphPreviousConceptId !== id ?
        "Explore how this concept connects to " + concepts[graphPreviousConceptId].label + "." :
        "This is the concept from which you opened the graph.");
    document.getElementById("openGraphLesson").href = concept.lessonUrl + "#" + concept.lessonAnchor;
    document.getElementById("graphNodePanel").hidden = false;
    renderMathInElement(document.getElementById("graphNodePanel"));
    renderConceptGraph();
    revealSelectedGraphNode();
  }

  function showEdgeDetails(edgeId) {
    var edge = allGraphEdges()[edgeId];
    if (!edge) return;
    showGraphNode(edge.targetId, edge);
  }

  function openGraphView() {
    if (!currentConceptId) return;
    conceptSheetScroll = document.getElementById("conceptContent").scrollTop;
    graphEntryConceptId = currentConceptId;
    graphEntryScroll = conceptSheetScroll;
    graphSelectedConceptId = currentConceptId;
    graphPreviousConceptId = null;
    document.getElementById("conceptSheetView").dataset.savedScroll = String(conceptSheetScroll);
    graphMode = true;
    graphState = graphCore.directGraph(concepts, currentConceptId);
    graphPathIds = [];
    graphZoom = 1;
    document.getElementById("conceptSheetView").hidden = true;
    document.getElementById("conceptGraphView").hidden = false;
    document.getElementById("conceptBack").hidden = true;
    document.getElementById("graphNodePanel").hidden = true;
    renderConceptGraph();
    document.getElementById("backToConcept").focus();
  }

  function restoreGraphEntry() {
    graphMode = false;
    document.getElementById("conceptGraphView").hidden = true;
    document.getElementById("conceptSheetView").hidden = false;
    renderConceptDetails(graphEntryConceptId);
    document.getElementById("conceptContent").scrollTop = graphEntryScroll;
    document.getElementById("conceptBack").hidden = conceptHistory.length < 2;
    requestAnimationFrame(function () {
      document.getElementById("conceptContent").scrollTop = graphEntryScroll;
      var button = document.getElementById("exploreGraph");
      if (button) button.focus({ preventScroll: true });
    });
  }

  function readSelectedGraphConcept() {
    if (!graphSelectedConceptId) return;
    var selectedId = graphSelectedConceptId;
    graphMode = false;
    document.getElementById("conceptGraphView").hidden = true;
    document.getElementById("conceptSheetView").hidden = false;
    if (conceptHistory[conceptHistory.length - 1] !== selectedId) conceptHistory.push(selectedId);
    renderConceptDetails(selectedId);
    document.getElementById("conceptContent").scrollTop = 0;
    requestAnimationFrame(function () { document.getElementById("conceptContent").scrollTop = 0; });
  }

  function selectedAnswers(questionEl) {
    if (questionEl.dataset.questionType === "NAT") return questionEl.querySelector(".gt-nat-input").value;
    return Array.from(questionEl.querySelectorAll(".gt-option.selected")).map(function (option) { return option.dataset.value; });
  }

  function gradeCard(cardEl, button) {
    var card = data.cards[Number(cardEl.dataset.index)];
    var questionEl = button.closest(".gt-question");
    var response = card.question.type === "REVEAL" ? null : selectedAnswers(questionEl);
    var ok = core.gradeQuestion(card.question, response);
    var feedback = questionEl.querySelector(".gt-feedback");
    feedback.hidden = false;
    feedback.className = "gt-feedback " + (ok ? "ok" : "bad");
    var lead = card.question.type === "REVEAL" ? "Answer." : (ok ? "Correct." : "Not quite.");
    feedback.innerHTML = "<b>" + lead + "</b> " +
      (card.question.explanationHtml || linkedText(card.question.explanation)) +
      gateAnalysisMarkup(card.gateAnalysis);
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
    if (close) {
      var closingDialog = document.getElementById(close.dataset.close);
      if (closingDialog === conceptDialog && graphMode) restoreGraphEntry();
      else closeDialog(closingDialog);
      return;
    }
    var exploreGraph = event.target.closest("#exploreGraph");
    if (exploreGraph) {
      event.preventDefault(); event.stopPropagation();
      openGraphView(); return;
    }
    var gateCardLink = event.target.closest("[data-gate-card]");
    if (gateCardLink) {
      event.preventDefault(); event.stopPropagation();
      var gateIndex = data.cards.findIndex(function (card) { return card.id === gateCardLink.dataset.gateCard; });
      if (gateIndex >= 0) {
        closeDialog(conceptDialog);
        requestAnimationFrame(function () { scrollToIndex(gateIndex); });
      }
      return;
    }
    var graphNode = event.target.closest("[data-graph-concept]");
    if (graphNode) {
      event.preventDefault(); event.stopPropagation();
      showGraphNode(graphNode.dataset.graphConcept, null); return;
    }
    var graphEdge = event.target.closest("[data-edge]");
    if (graphEdge) {
      event.preventDefault(); event.stopPropagation();
      showEdgeDetails(graphEdge.dataset.edge); return;
    }
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

  document.getElementById("backToConcept").addEventListener("click", restoreGraphEntry);
  document.getElementById("readGraphConcept").addEventListener("click", readSelectedGraphConcept);

  document.getElementById("graphReset").addEventListener("click", function () {
    if (!graphState) return;
    graphState = graphCore.directGraph(concepts, graphState.rootId);
    graphPathIds = [];
    graphZoom = 1;
    graphSelectedConceptId = graphState.rootId;
    graphPreviousConceptId = null;
    document.getElementById("graphNodePanel").hidden = true;
    renderConceptGraph();
  });

  document.getElementById("graphPath").addEventListener("click", function () {
    if (!graphState) return;
    graphPathIds = graphCore.shortestPath(concepts, graphState.rootId, graphState.focusedId);
    renderConceptGraph();
    document.getElementById("conceptGraphStatus").textContent = graphPathIds.length > 1 ?
      "Highlighted path: " + graphPathIds.map(function (id) { return concepts[id].label; }).join(" → ") :
      "Select another concept, then show the path from the starting concept.";
  });

  document.getElementById("graphZoomIn").addEventListener("click", function () {
    graphZoom = Math.min(1.8, graphZoom + .2);
    renderConceptGraph();
  });

  document.getElementById("graphZoomOut").addEventListener("click", function () {
    graphZoom = Math.max(.75, graphZoom - .2);
    renderConceptGraph();
  });

  [topicMenu, detailDialog, conceptDialog, helpDialog].forEach(function (dialog) {
    dialog.addEventListener("cancel", function (event) {
      event.preventDefault();
      if (dialog === conceptDialog && graphMode) restoreGraphEntry();
      else closeDialog(dialog);
    });
    dialog.addEventListener("keydown", function (event) {
      trapFocus(event, dialog);
      if ((event.key === "Enter" || event.key === " ") &&
          event.target.matches("[data-graph-concept],[data-edge]")) {
        event.preventDefault();
        event.target.dispatchEvent(new MouseEvent("click", { bubbles: true }));
      }
      if (event.key === "Escape") {
        event.preventDefault();
        if (dialog === conceptDialog && graphMode) restoreGraphEntry();
        else closeDialog(dialog);
      }
    });
    dialog.addEventListener("click", function (event) {
      if (event.target === dialog) {
        if (dialog === conceptDialog && graphMode) restoreGraphEntry();
        else closeDialog(dialog);
      }
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
