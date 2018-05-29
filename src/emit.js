'use strict';

const request = require('request');
const cfg = require('./config');

function encodeUrl(title, body) {
  return `${title}
------------------
${body}`;
}

function emit(title, body) {

  const payload = {
    url: `${cfg.bot_post_url}${encodeUrl(title, body)}`,
  };

  console.info(`EMIT> POST: ${payload.url}`);
  request.post(payload, (err, res, body) => {

    if (err) {
      console.error(`EMIT> ERR: ${err}`);
    } else {
      console.info(`EMIT> POST: RESPONSE: ${res.statusCode}`);
      if (res.statusCode === '400')
        emit('ERROR', 'Unable emit full response');
    }

  });

};

module.exports = emit;
module.exports.queue = (lines) => {

  const queue = lines.split('\n').filter(line => {
    return line.startsWith('|  - ');
  }).map(line => {
    return `|> ${line.slice(5).trim()}`;
  }).join('\n');

  emit('QUEUE', queue);
}
module.exports.searchResults = (results) => {

  if (!results.length) {
    emit('SEARCH', 'no results');
    return;
  }

  if (results.length > 250) {
    emit('SEARCH', `too many results (${results.length}) ... try narrowing down your search`);
    return;
  }

  const chunks = results.map(result => {
    return `|> "${result.song.title}" by "${result.artist}" on "${result.album}"`;
  }).join('\n').match(/(.|[\r\n]){1,900}/g);

  chunks.forEach((chunk, i) => {
    if (i > 10)
      return;
    setTimeout(() => { emit(`SEARCH (p. ${i+1}/${chunks.length}${chunks.length > 10 ? '+' : ''})`, chunk); }, 1000);
  });

}
