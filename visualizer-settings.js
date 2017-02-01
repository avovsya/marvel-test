var _ = require('lodash');

var colors = {
  lightGrey: '#CDC9C9',
  grey: '#8B8989',
  orange: '#FF8C00',
  green: '#EE3B3B',
  red: '#436EEE'
};

module.exports = function (rank, top10, mostPopular, fabricGraphics, fabric) {
  fabricGraphics.createNodeUI(createNode)
    .renderNode(renderNode)
    .createLinkUI(createLink)
    .renderLink(renderLink);

  return;

  function createNode(node) {
    var circle;
    var inTop10 = _.find(top10, (c) => c.name === node.id);
    var inTop10Index = _.findIndex(top10, (c) => c.name === node.id);

    var mp = _.find(mostPopular, (c) => c.name === node.id);
    var mpIndex = _.findIndex(mostPopular, (c) => c.name === node.id);

    var fillColor = colors.grey;
    var radius = 3;

    if (inTop10) {
      // radius = 15;
      radius = ((1 / (inTop10Index + 1)) * 10) + 10;
      fillColor = colors.red ;
    }

    if (mp) {
      // radius = 15;
      radius = ((1 / (mpIndex + 1)) * 10) + 10;
      fillColor = colors.green;
    }

    circle = new fabric.Circle({ radius: radius, fill: fillColor });

    circle.name = node.id;
    circle.inTop10 = inTop10;

    circle.mp = mp;
    circle.availableComics = mp && mp.comics.available;
    circle.rank = (rank[node.id] * 100).toFixed(2) + '%';
    circle.linksCount = node.links.length;
    return circle;
  }

  function renderNode(circle) {
    circle.left = circle.pos.x - circle.radius;
    circle.top = circle.pos.y - circle.radius;
    var caption;

    if (circle.inTop10 || circle.mp) {
      caption = new fabric.Text(circle.name + ' \nConnections: ' + circle.linksCount + ' \nRank' + circle.rank, {
        fontSize: 9,
        fill: '#000',
        left: circle.left,
        top: circle.top
      });
    } else  {
      caption = new fabric.Text(circle.rank, {
        fontSize: 6,
        fill: '#999',
        left: circle.left,
        top: circle.top
      });

    }
    fabricGraphics.canvas.add(caption);
  }

  function createLink(link) {
    var betweenMostInfluential =
        _.find(top10, (c) => c.name === link.fromId) ||
        _.find(top10, (c) => c.name === link.toId);

    var betweenMostPopular = _.find(mostPopular, (c) => c.name === link.fromId) ||
        _.find(mostPopular, (c) => c.name === link.toId);

    var color = colors.lightGrey;

    if (betweenMostInfluential) {
      color = colors.red;
    }

    if (betweenMostPopular) {
      color = colors.green;
    }

    if (betweenMostInfluential && betweenMostPopular) {
      color = colors.orange;
    }

    // Drawing "regular" links not useful and very slow
    if (betweenMostPopular || betweenMostInfluential) {
      return new fabric.Line([0, 0, 0, 0], {
        stroke: color,
        originX: 'center',
        originY: 'center'
      });
    }
  }

  function renderLink(line) {
    line.set({
      x1: line.from.x,
      y1: line.from.y,
      x2: line.to.x,
      y2: line.to.y
    });
  }
};
