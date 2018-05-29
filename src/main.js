'use strict';

const request = require('request');
const fs = require('fs');

const ssh = require('./ssh');
const parse = require('./parse');

const cfg = require('./config');

if (!fs.existsSync('./tmp'))
  fs.mkdirSync('./tmp', (err) => {
    if (err) throw err;
  });

if (!fs.existsSync('./logs'))
  fs.mkdirSync('./logs', (err) => {
    if (err) throw err;
  });

function poll() {
  console.log(`F> polling ${cfg.bot_queue_url} ${(new Date()).getTime()}`);
  request.get(cfg.bot_queue_url, (err, res, body) => {

    if (err) {
      console.error(`F> polling ERR: ${err}`);
    } else {
      parse(body);
    }

    setTimeout(poll, 1000);
  });
}

poll();
