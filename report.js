var _ = require('lodash');
var Graph = require('ngraph.graph');
var pagerank = require('ngraph.pagerank');
var fs = require('fs');

var cache;

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

function print10MostPopularCharactersFromCache() {
  console.log('Most popular characters:');
  var characters = getMostPopularCharacters(cache, 10);
  _.each(characters, (c) => console.log(`${c.name}: ${c.comics.available}`));
  console.log('===');
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

// For each comics gather bucket of characters from that comics
// Connect characters from the same comics with the vertex
function print10MostInfluentialCharactersFromCache() {
  var comicsHash = buildComicsHashmap(cache);
  var graph = buildGraph(comicsHash);

  fs.writeFileSync('./visualizer/hash.json', JSON.stringify(comicsHash)); // Save graph to JSON format for visualisation in the browser

  var rank = pagerank(graph);

  var top10 = _(rank)
      .map((rank, name) => ({ name, rank }))
      .orderBy((c) => c.rank, 'desc')
      .take(10)
      .value();

  console.log('');
  console.log('Most influential characters:');
  console.log(top10);
  console.log('===');
}

print10MostPopularCharactersFromCache();
print10MostInfluentialCharactersFromCache();
