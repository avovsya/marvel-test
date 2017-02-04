var _ = require('lodash');
var fs = require('fs');

var getMostPopular = require('./lib/most-popular');
var getMostInfluential = require('./lib/most-influential');
var getVirusTargets = require('./lib/virus-targets');

var cache;

try {
  cache = require('./cache.json');
} catch(err) {
  console.log('Run "node cache.js" first to generate cache with characters');
  process.exit(1);
}

function printSortedCharacters() {
  console.log('\n1.1 Sorted characters: ');
  _(cache)
  .sortBy('name')
  .each((c) => console.log(`${c.name}: ${c.comics.available}`));
  console.log('===');
}

function print10MostPopularCharactersFromCache() {
  var mostPopularCharacters = getMostPopular(cache, 10);

  console.log('\n1.2 Most popular characters:');
  _.each(mostPopularCharacters, (c) => console.log(`${c.name}: ${c.comics.available}`));
  console.log('===');
}

// For each comics gather bucket of characters from that comics
// Connect characters from the same comics with the vertex
function print10MostInfluentialCharactersFromCache() {
  var mostInfluentialCharacters = getMostInfluential(cache, 10);

  console.log('\n2 Most influential characters:');
  _.each(mostInfluentialCharacters, (c) => console.log(`${c.name}: ${c.rank}`));
  console.log('===');
}

function print10CharactersToInfect() {
  var virusTargets = getVirusTargets(cache, 10);

  console.log('\n3 Virus targets:');
  _.each(virusTargets, (c) => console.log(`${c}`));
  console.log('===');
}

printSortedCharacters();
print10MostPopularCharactersFromCache();
print10MostInfluentialCharactersFromCache();
print10CharactersToInfect();

var pagerank = require('ngraph.pagerank');
var graph = require('./lib/build-graph').buildNGraph(cache);
var rank = pagerank(graph);
