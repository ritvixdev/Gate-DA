(function (root, factory) {
  var api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  root.GateConceptGraphCore = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  function edgesFor(concepts, sourceId) {
    var concept = concepts[sourceId];
    if (!concept) return [];
    if (Array.isArray(concept.edges)) return concept.edges.map(function (edge) {
      return Object.assign({ id: sourceId + "--" + edge.targetId, sourceId: sourceId }, edge);
    });
    return (concept.relatedConcepts || []).map(function (targetId) {
      return {
        id: sourceId + "--" + targetId,
        sourceId: sourceId,
        targetId: targetId,
        type: "used-by",
        label: "Connects to",
        explanation: concept.label + " connects to " + (concepts[targetId] ? concepts[targetId].label : targetId) + ".",
        importance: "useful"
      };
    });
  }

  function connectedEdges(concepts, conceptId) {
    var outgoing = edgesFor(concepts, conceptId);
    var incoming = [];
    Object.keys(concepts).forEach(function (sourceId) {
      edgesFor(concepts, sourceId).forEach(function (edge) {
        if (edge.targetId === conceptId) incoming.push(edge);
      });
    });
    return outgoing.concat(incoming);
  }

  function rankedConnections(concepts, conceptId, limit) {
    var concept = concepts[conceptId];
    if (!concept) return [];
    var typePriority = {
      equivalent: 0, implies: 1, prerequisite: 2, "gate-pattern": 3,
      "used-by": 4, "decomposes-into": 5, geometric: 6, contrasts: 7
    };
    var importancePriority = { core: 0, useful: 1, advanced: 2 };
    var seen = new Set();
    return connectedEdges(concepts, conceptId).map(function (edge) {
      var outgoing = edge.sourceId === conceptId;
      var targetId = outgoing ? edge.targetId : edge.sourceId;
      var reverseLabels = {
        prerequisite: "Used by",
        implies: "Can lead to this",
        "used-by": "Uses this",
        "decomposes-into": "Part of",
        geometric: "Geometric source",
        "gate-pattern": "GATE partner"
      };
      return Object.assign({}, edge, {
        targetId: targetId,
        label: outgoing ? edge.label : (reverseLabels[edge.type] || edge.label),
        sameLesson: Boolean(concepts[targetId] && concepts[targetId].lessonUrl === concept.lessonUrl)
      });
    }).filter(function (edge) {
      if (!concepts[edge.targetId] || seen.has(edge.targetId)) return false;
      seen.add(edge.targetId);
      return true;
    }).sort(function (a, b) {
      var importance = (importancePriority[a.importance] || 1) - (importancePriority[b.importance] || 1);
      if (importance) return importance;
      var type = (typePriority[a.type] || 9) - (typePriority[b.type] || 9);
      if (type) return type;
      if (a.sameLesson !== b.sameLesson) return a.sameLesson ? -1 : 1;
      return concepts[a.targetId].label.localeCompare(concepts[b.targetId].label);
    }).slice(0, limit || 5);
  }

  function unique(values) {
    return Array.from(new Set(values));
  }

  function directGraph(concepts, rootId) {
    var edges = connectedEdges(concepts, rootId).sort(function (a, b) {
      var priority = { core: 0, useful: 1, advanced: 2 };
      return (priority[a.importance] || 1) - (priority[b.importance] || 1);
    }).slice(0, 8);
    return {
      rootId: rootId,
      focusedId: rootId,
      expandedIds: [rootId],
      nodeIds: unique([rootId].concat(edges.map(function (edge) {
        return edge.sourceId === rootId ? edge.targetId : edge.sourceId;
      }))).filter(function (id) { return Boolean(concepts[id]); }),
      edgeIds: unique(edges.map(function (edge) { return edge.id; }))
    };
  }

  function expandGraph(concepts, state, conceptId) {
    var edges = connectedEdges(concepts, conceptId).sort(function (a, b) {
      return (a.importance === "core" ? 0 : 1) - (b.importance === "core" ? 0 : 1);
    }).slice(0, 10);
    return {
      rootId: state.rootId,
      focusedId: conceptId,
      expandedIds: unique(state.expandedIds.concat(conceptId)),
      nodeIds: unique(state.nodeIds.concat(edges.flatMap(function (edge) {
        return [edge.sourceId, edge.targetId];
      }))).filter(function (id) { return Boolean(concepts[id]); }),
      edgeIds: unique(state.edgeIds.concat(edges.map(function (edge) { return edge.id; })))
    };
  }

  function neighbourIds(concepts, id) {
    return unique(connectedEdges(concepts, id).flatMap(function (edge) {
      return [edge.sourceId, edge.targetId];
    }).filter(function (candidate) { return candidate !== id && concepts[candidate]; }));
  }

  function shortestPath(concepts, startId, targetId) {
    if (!concepts[startId] || !concepts[targetId]) return [];
    if (startId === targetId) return [startId];
    var queue = [[startId]];
    var visited = new Set([startId]);
    while (queue.length) {
      var path = queue.shift();
      var current = path[path.length - 1];
      var neighbours = neighbourIds(concepts, current);
      for (var i = 0; i < neighbours.length; i += 1) {
        var next = neighbours[i];
        if (visited.has(next)) continue;
        var candidate = path.concat(next);
        if (next === targetId) return candidate;
        visited.add(next);
        queue.push(candidate);
      }
    }
    return [];
  }

  function edgeBetween(concepts, sourceId, targetId) {
    return connectedEdges(concepts, sourceId).find(function (edge) {
      return (edge.sourceId === sourceId && edge.targetId === targetId) ||
        (edge.sourceId === targetId && edge.targetId === sourceId);
    }) || null;
  }

  return {
    edgesFor: edgesFor,
    directGraph: directGraph,
    expandGraph: expandGraph,
    neighbourIds: neighbourIds,
    shortestPath: shortestPath,
    edgeBetween: edgeBetween,
    rankedConnections: rankedConnections
  };
});
