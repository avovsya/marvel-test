var request = require('request');
var async = require('async');
var crypto = require('crypto');
var fs = require('fs');

var keys = require('./keys.json');

function getKeyHash(ts, apiKey, privateKey) {
  return crypto.createHash('md5').update(`${ts}${privateKey}${apiKey}`).digest("hex");
}

function requestPage(page, apiKey, privateKey, callback) {
  console.log(`Requesting page ${page}`);
  var limit = 100;
  var ts = new Date().toString();
  var hash = getKeyHash(ts, apiKey, privateKey);
  request({
    url: `http://gateway.marvel.com/v1/public/characters`,
    qs: {
      ts, hash, limit,
      apikey: apiKey,
      offset: (page - 1) * limit
    }
  }, (err, response, body) => {
    // TODO: not the best way to catch wrong status code
    if (err || response.statusCode >= 400) {
      return callback({
        err: err || response.statusCode,
        body: body
      });
    }

    // TODO get rid of parsing. Write straight to disk
    body = JSON.parse(body);

    var lastPage = body.data.count < limit;

    return callback(null, {
      characters: body.data.results,
      lastPage
    });
  });
}

function getAllCharacters(apiKey, privateKey, callback) {
  var results = [];
  var lastPage = false;
  var page = 0;
  async.whilst(
    () => !lastPage,
    (whilstCb) => {
      page += 1;
      requestPage(page, apiKey, privateKey, (err, data) => {
        if (err) {
          console.log(`Error while downloading characters. Page ${page}. Error: ${err.err}. Body: ${err.body}`);
          return whilstCb(err);
        }
        lastPage = data.lastPage;
        results = results.concat(data.characters);
        return whilstCb();
      });
    },
    (err) => callback(err, results)
  );
}

getAllCharacters(keys.apiKey,
                 keys.privateKey,
                 (err, characters) => {
                   console.log(`Download finished. Heroes found: ${characters.length}`);
                   fs.writeFileSync('./cache.json', JSON.stringify(characters));
                   console.log(`Results cached to ./cache.json`);
                 });
