'use strict';

var request = require('request').defaults({
  timeout: 10000
});

var config = JSON.parse(process.env.CONFIG);

var actions = {
  GET: function get(options) {
    var url = options.url;
    request.get(url, function (error, response, body) {
      if (error) {
        console.log('Received an error for GET ' + url);
        console.log(error);
        return;
      }
      console.log('Got status code ' + response.statusCode + ' for GET ' + url);
    });
  }
};

console.log('Pinging services');

config.items.forEach(function (item) {
  var f = actions[item.action];
  if (f) {
    f(item.data);
  }
});
