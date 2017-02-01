var _ = require('lodash');
var Graph = require('ngraph.graph');
var pagerank = require('ngraph.pagerank');
var fs = require('fs');

var cache, mostPopularCharacters, mostInfluentialCharacters, graph, rank;

try {
  cache = require('./cache.json'); // TODO exception if cache doesn't exist
} catch(err) {
  console.log('Run "node cache.js" first to generate cache with characters');
  process.exit(1);
}

// Get k most popular characters
// This implementation sorts characters and takes top k, so complexity is O(N log N) where N is the size of characters array
// Other options include:
//  - Use priority queue. Complexity O(N log k). Memory complexity O(k)
//  - Use bucket sort. Compelexity O(N). Memory complexity O(k)
//  - Use heap. Complexity O(N). Memory complexity O(N)
function getMostPopularCharacters(characters, k) {
  var mostPopularCount = 0;
  var mostPopularName;

  var topCharacters = _(characters)
      .orderBy((c) => c.comics.available, 'desc')
      .take(k)
      .value();
  return topCharacters;
}

function buildComicsHashmap(characters) {
  var comics = {};

  _.each(characters, (character) => {
    _.each(character.comics.items, (c) => {
      if(!comics[c.name]) { comics[c.name] = []; }
      comics[c.name].push(character.name);
    });
  });

  return comics;
}

function buildGraph(comicsHash) {
  var i;
  var graph = Graph();

  _.each(comicsHash, (comics) => {
    for (i = 0; i < comics.length - 1; i += 1) {
      graph.addLink(comics[i], comics[i+1]);
      graph.addLink(comics[i+1], comics[i]);
    }
  });

  return graph;
}

function print10MostPopularCharactersFromCache() {
  mostPopularCharacters = getMostPopularCharacters(cache, 10);

  console.log('Most popular characters:');
  _.each(mostPopularCharacters, (c) => console.log(`${c.name}: ${c.comics.available}`));
  console.log('===');
  console.log('');
}

// For each comics gather bucket of characters from that comics
// Connect characters from the same comics with the vertex
function print10MostInfluentialCharactersFromCache() {
  var comicsHash = buildComicsHashmap(cache);
  graph = buildGraph(comicsHash);

  rank = pagerank(graph);

  mostInfluentialCharacters = _(rank)
    .map((rank, name) => ({ name, rank }))
    .orderBy((c) => c.rank, 'desc')
    .take(10)
    .value();

  console.log('Most influential characters:');
  _.each(mostInfluentialCharacters, (c) => console.log(`${c.name}: ${c.rank}`));
  console.log('===');
  console.log('');
}

print10MostPopularCharactersFromCache();
print10MostInfluentialCharactersFromCache();
require('./visualizer.js').renderGraphToFile(graph, rank, mostInfluentialCharacters, mostPopularCharacters);
