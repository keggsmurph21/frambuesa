'use strict';

const request = require('request');

const ssh = require('./ssh');
const parse = require('./parse');

const HOST = process.env.HOST;
const PORT = process.env.PORT;
const URL = `http://${HOST}:${PORT}/bot/queue`;

function poll() {
  console.log(`polling ${URL} ${(new Date()).getTime()}`);
  request.get(URL, (err, res, body) => {

    if (err) {
      console.error(err);
    } else {
      parse(body);
    }

    setTimeout(poll, 1000);
  });
}

poll();
