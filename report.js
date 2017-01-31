var _ = require('lodash');

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
}

print10MostPopularCharactersFromCache();
