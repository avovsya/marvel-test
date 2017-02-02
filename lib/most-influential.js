var _ = require('lodash');
var pagerank = require('ngraph.pagerank');
var buildNGraph = require('./build-graph').buildNGraph;

// Count pagerank for each characters
// Return top k
module.exports = function(characters, k) {
  var characterGraph = buildNGraph(characters);

  var rank = pagerank(characterGraph);

  return _(rank)
    .map((rank, name) => ({ name, rank }))
    .orderBy((c) => c.rank, 'desc')
    .take(k)
    .value();
};


