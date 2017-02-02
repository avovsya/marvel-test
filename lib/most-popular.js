var _ = require('lodash');

// Get k most popular characters
// This implementation sorts characters and takes top k, so complexity is O(N log N) where N is the size of characters array
// Other options include:
//  - Use priority queue. Complexity O(N log k). Memory complexity O(k)
//  - Use bucket sort. Compelexity O(N). Memory complexity O(k)
//  - Use heap. Complexity O(N). Memory complexity O(N)
module.exports = function (characters, k) {
  var mostPopularCount = 0;
  var mostPopularName;

  var topCharacters = _(characters)
      .orderBy((c) => c.comics.available, 'desc')
      .take(k)
      .value();
  return topCharacters;
};
