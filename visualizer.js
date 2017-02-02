function layoutGraph(graph, iterationsCount) {
  var layout = require('ngraph.forcelayout')(graph);
  console.log('Running graph layout...');
  for (var i = 0; i < iterationsCount; ++i) {
    layout.step();
  }
  console.log('Done. Rendering graph...');
  return layout;
}

function renderToCanvas(graph, rank, top10, mostPopular, layout) {
  var graphRect = layout.getGraphRect();
  // var size = Math.max(graphRect.x2 - graphRect.x1, graphRect.y2 - graphRect.y1) * 1.8;

  var createFabricGraphics = require('ngraph.fabric');
  var fabricGraphics = createFabricGraphics(graph, { width: graphRect.x2 - graphRect.x1, height: graphRect.y2 - graphRect.y1, layout: layout });
  var fabric = require('fabric').fabric;

  require('./visualizer-settings')(rank, top10, mostPopular, fabricGraphics, fabric);

  // var scale = 4;
  // fabricGraphics.setTransform(size/2, size/2, scale);
  fabricGraphics.renderOneFrame(); 

  return fabricGraphics.canvas;
}

function saveCanvasToFile(canvas, fileName) {
  var fs = require('fs');
  var path = require('path');
  var fullName = path.join(__dirname, fileName);
  var outFile = fs.createWriteStream(fullName);

  canvas.createPNGStream().on('data', function(chunk) {
    outFile.write(chunk);
  }).on('end', function () {
    console.log('Graph saved to: ' + fullName);
  });
}

module.exports = {
  renderGraphToFile: function(graph, rank, top10, mostPopular) {
    var layout = layoutGraph(graph, 10000);

    var canvas = renderToCanvas(graph, rank, top10, mostPopular, layout);

    saveCanvasToFile(canvas, 'heroes-graph.png');
  }
};
