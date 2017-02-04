var _ = require('lodash');
var NGraph = require('ngraph.graph');
var utils = require('./utils');

var graphCache = new WeakMap();

const NO_LINKS = -1;

module.exports = {
  buildNGraph, buildGraph
}

// Build graph for ngraph.pagerank library
function buildNGraph(characters) {
  var graph = buildGraph(characters);
  var ngraph = NGraph();

  _.each(graph, (vertex, character) => {
    ngraph.addNode(character);
    vertex.links.forEach((link) => {
      ngraph.addLink(character, link);
    })
  });

  return ngraph;
}

// Build characters graph represented as a hash table
// Keys are vertices, values are the sets of connected vertices
// Result looks like this:
// {
//   "Spider Man": { links: Set["Spider Man", "X-Men", "Hulk", ...] }
//   "Hulk": { links: Set["Hulk", "Spider Man", ...] }
// }
function buildGraph(characters) {
  if (graphCache.has(characters)) return graphCache.get(characters);
  var graph = {};
  var charactersByComics = groupCharactersByComics(characters);

  _.each(charactersByComics, (comicsCharacters, comics) => {
    comicsCharacters.forEach((ch) => {
      graph[ch] = graph[ch] || { links: new Set() };

      if (comics === NO_LINKS) return; // Do not link "lone" characters

      graph[ch].links.union(comicsCharacters);
    });
  });

  graphCache.set(characters, graph);
  return graph;
}

// Group characters into a hash table where the key is comics and the value is an array
// with all characters in that comics
// Each comics essentially is an edge in a graph of Marvel Universe and characters are the vertices
function groupCharactersByComics(characters) {
  var comics = {};

  _.each(characters, (character) => {
    character.name = `${character.name} (#${character.id})`
    // Special case for characters without any comics
    if (character.comics.available === 0) {
      character.comics.items = [NO_LINKS];
    }

    _.each(character.comics.items, (c) => {
      comics[c.name] = comics[c.name] || new Set();
      comics[c.name].add(character.name);
    });
  });

  return comics;
}
