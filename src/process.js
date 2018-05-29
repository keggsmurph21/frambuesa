'use strict';

const request = require('request');
const cfg = require('./config');

module.exports = (id, response) => {

  const payload = {
    url: cfg.bot_process_url,
    json: {
      secret: cfg.app_secret,
      id: id,
      text: response
    }
  };

  request.post(payload, (err, res, body) => {

    if (err)
      console.error(`F> processing ERR: ${err}`);

  });

}
