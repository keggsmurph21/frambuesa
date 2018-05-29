'use strict';

const cfg = require('./config');
const process = require('./process');
const player = require('./player');
const search = require('./search');
const emit = require('./emit');

player.init();

module.exports = (json) => {
  let messages;
  try {
    messages = JSON.parse(json);
  } catch (e) {
    if (messages.startsWith('<')) // ignore it b/c it's HTML
      return;
    console.error(`F> parsing ERROR: unable to parse "${json}" (${e})`);
    return;
  }

  messages.forEach((message, i) => {
    console.info(`F> parsing: ${message.text}`);
    const tokens = message.text.split(/[ \t]+/);

    if (tokens[0].startsWith('/')) {
      let response = null;

      switch (tokens[0].slice(1)) {

        case ('play'):
        case ('p'):

          if (tokens[1]) {
            const results = search(tokens.slice(1));
            emit.searchResults(results);

            if (!results.length || results.length > 250)
              break;

            player.queue(results);
          }
          setTimeout(player.play, 1000);

          break;

        case ('pause'):
          player.pause();
          break;

        case ('stop'):
          player.stop();
          break;

        case ('list'):
        case ('up-next'):
        case ('queue'):
          player.queue();
          break;

        case ('now-playing'):
        case ('playing'):
        case ('current'):
          player.nowPlaying();
          break;

        case ('search'):
        case ('query'):
        case ('q'):
          const results = search(tokens.slice(1));
          emit.searchResults(results);
          break;

        case ('mute'):
        case ('silent'):
        case ('m'):
          player.volume('0');
          break;

        case ('unmute'):
          player.volume('150');
          break;

        case ('volume'):
        case ('vol'):
        case ('v'):
          player.volume(tokens[1]);
          break;

        case ('volup'):
        case ('louder'):
        case ('+'):
          player.volume('up');
          break;

        case ('voldown'):
        case ('softer'):
        case ('quieter'):
        case ('-'):
          player.volume('down');
          break;

        case ('on'):
          emit('ERR', `keyword not implemented: ${on}`);
          break;

        case ('off'):
          emit('ERROR', `keyword not implemented: ${off}`);
          break;

        case ('next'):
        case ('skip'):
        case ('n'):
          player.next();
          break;

        case ('previous'):
        case ('back'):
        case ('p'):
          player.prev();
          break;

        case ('echo'):
          emit('ECHO', tokens.slice(1).join(' '));
          break;

        case ('logs'):
        case ('log'):
          player.logs();
          break;
      }

      //player.pause();
      process(message.id, response);

    }

  });
}
