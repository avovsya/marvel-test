var _ = require('lodash');
var Graph = require('ngraph.graph');

// Build ngraph graph
// Used only for pagerank
module.exports.buildNGraph = function buildNGraph(characters) {
  var i;
  var graph = Graph();

  var charactersByComics = groupCharactersByComics(characters);
  // Add characters without connection to the graph
  _.each(charactersByComics["None"], (character) => {
    graph.addNode(character);
  });
  delete charactersByComics["None"];

  _.each(charactersByComics, (comics) => {
    for (i = 0; i < comics.length - 1; i += 1) {
      graph.addLink(comics[i], comics[i+1]);
      graph.addLink(comics[i+1], comics[i]);
    }
  });

  return graph;
};

function getOrCreateVertexInGraph(graph, name) {
  graph[name] = graph[name] || { name, links: [] };
  return graph[name];
}

function addEdgeToGraph(graph, vertexName1, vertexName2) {

}

// Build plain graph
module.exports.buildGraph = function buildGraph(characters) {
  var graph = {};
  var rootNode;
  var charactersByComics = groupCharactersByComics(characters);

  // // Add characters without connection to the graph
  // _.each(charactersByComics["None"], (character) => {
  //   graph.addNode(character);
  // });
  // delete charactersByComics["None"];

  _.each(charactersByComics, (comicsCharacters) => {
    graphs[comicsCharacters[i]] = graphs[comicsCharacters[i]] || { name: comicsCharacters[i], links: [] };
    var vertex = getOrCreateVertexInGraph(graph, comicsCharacters[i]);
    for (i = 0; i < comicsCharacters.length - 1; i += 1) {
      graph.addLink(comicsCharacters[i], comicsCharacters[i+1]);
      graph.addLink(comicsCharacters[i+1], comicsCharacters[i]);
    }
  });

  return graph;
}

// Groups characters into hash table where the key is comics and the value is an array
// with all charin the comics
// Each comics essentially is an edge in a graph of Marvel Universe and characters are the vertices
function groupCharactersByComics(characters) {
  var comics = {
    "None": []
  };

  _.each(characters, (character) => {
    _.each(character.comics.items, (c) => {
      if(!comics[c.name]) { comics[c.name] = []; }
      comics[c.name].push(character.name);
    });

    if (character.comics.available === 0) {
      comics["None"].push(character.name);
    }
  });

  return comics;
}
