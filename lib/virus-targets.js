var _ = require('lodash');
var buildGraph = require('./build-graph').buildGraph;
var utils = require('./utils');

module.exports = function (characters, k) {
  var graph = buildGraph(characters);

  var disconnectedSubgraphs = getDisconnectedSubgraphs(graph);

  return getKCharactersFromSubgraphs(disconnectedSubgraphs, k);
};

function getDisconnectedSubgraphs(graph) {
  var vertex;
  var subgraphs = [];
  while((vertex = getRandomVertex(graph))) {
    subgraphs.push(getSubgraphAndRemoveVertex(graph, vertex, new Set()));
  }

  return subgraphs;
}

function getSubgraphAndRemoveVertex(graph, vertex, subgraph) {
  if (subgraph.has(vertex)) return subgraph;
  subgraph.add(vertex);
  graph[vertex].links.forEach((link) => {
    getSubgraphAndRemoveVertex(graph, link, subgraph);
  });
  delete graph[vertex];
  return subgraph;
}

function getKCharactersFromSubgraphs(subgraphs, k) {
  var largestSubgraphs = _.orderBy(subgraphs, (g) => g.size, 'desc');

  // There can be a situation when we have less subgraphs than K
  // So we'll get less than K characters as a result.
  // Should I do something with it? It won't affect how widespread the infection will get
  return _(largestSubgraphs).take(k).map((sg) => sg.entries().next().value[0]).value();
}

function getRandomVertex(graph) {
  for(var v in graph) {
    return v;
  }
  return false;
}
