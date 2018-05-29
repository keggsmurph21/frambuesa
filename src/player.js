'use strict';

const child = require('child_process');

let playing = false;
let current = 0;
let queue = [];

module.exports = {

  play: () => {
    if (playing) {
      console.log('already playing');
      return;
    }

    playing = true;
    const queued = queue.length;
    const vlcProcess = child.exec(`vlc "${queue.slice(current).join('", "')}" --play-and-exit`, (err, stdout, stderr) => {
      if (err) {
        console.log(err);
        playing = false;
        return;
      }

      current += queued;
      //console.log('stdout:', stdout);
      //console.log('stderr:', stderr);
    });

    vlcProcess.on('exit', (code, signal) => {
      console.log(`code: ${code}, signal: ${signal}`);
      playing = false;
      module.exports.play();
    });
  },

  pause: () => {

  },

  next: () => {

  },

  queue: (urls) => {

    queue = queue.concat(urls);
    console.log(queue);
  }

}
