'use strict';

const request = require('request');

const SECRET = process.env.FRAMBUESA_SECRET;
const HOST = process.env.HOST;
const PORT = process.env.PORT;
const URL = `http://${HOST}:${PORT}/bot/process`;



module.exports = (id, response) => {

  const payload = {
    url: URL,
    json: {
      secret: SECRET,
      id: id,
      text: response
    }
  };
  request.post(payload, (err, res, body) => {

    if (err)
      console.error(err);

  });

  //console.log('processing');
}
