'use strict';

const process = require('./process');
const player = require('./player');
const search = require('./search');

module.exports = (json) => {
  let messages;
  try {
    messages = JSON.parse(json);
  } catch (e) {
    console.log('Unable to parse data:', json);
    console.log(e);
    return;
  }

  messages.forEach((message, i) => {
    console.log(message.text);
    const tokens = message.text.split(/[ \t]+/);

    if (tokens[0].startsWith('/')) {
      let response = null;

      switch (tokens[0].slice(1)) {

        case ('play'):
        case ('p'):

          const query = search.buildQuery(tokens.slice(1));
          console.log('QUERY', query);
          const results = search(query);
          console.log("RESULTS", results);
          if (!results.length)
            break;

          player.queue(results);
          player.play();

          break;
        case ('search'):
        case ('query'):
        case ('q'):
          break;
        case ('mute'):
        case ('m'):
          break;
        case ('on'):
          break;
        case ('off'):
          break;
        case ('next'):
        case ('skip'):
        case ('n'):
          break;
        case ('previous'):
        case ('back'):
        case ('p'):
          break;

        if (url)
          player.play();
      }

      process(message.id, response);

    }

  });
}
