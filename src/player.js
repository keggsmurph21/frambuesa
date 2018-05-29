'use strict';

const exec = require('child_process').exec;
const path = require('path');
const fs = require('fs');

const cfg = require('./config');
const emit = require('./emit');

const socket = cfg.vlc_socket;

function send(message, callback) {
  while (!fs.existsSync(socket)) { }

  console.log(`SOCKET> echo ${message} | nc -U ${socket}`);
  exec(`echo ${message} | nc -U ${socket}`, (err, stdout, stderr) => {
    if (err)
      setTimeout(() => { send(message, callback); }, 1000);

    if (callback) {
      callback(stdout, stderr);
    } else {
      console.log(`VLC> ${stdout}`);
    }

  });
}

let logs = [];

module.exports = {

  init: () => {
    if (fs.existsSync(socket))
      fs.unlinkSync(socket);

    const vlc = exec(`vlc -I oldrc --rc-unix ${socket} --rc-fake-tty --no-playlist-autostart`, (err) => {
      if (err) {
        console.error(`VLC> ERR: ${err}`);
        emit('ERROR', `VLC error: ${err}`)
      }
      vlc();
    });
    vlc.on('exit', (code) => {
      console.warn(`VLC> exited with code: ${code}`);
    });
    vlc.stdout.on('data', (data) => {
      data = `VLC> ${data}`;
      console.log(data);
      logs.push(data);
    });
    vlc.stderr.on('data', (data) => {
      data = `VLC> ERR: ${data}`;
      console.log(data);
      logs.push(data);
    });
  },

  play: () => {
    send('play');
  },

  pause: () => {
    send('pause');
  },

  stop: () => {
    send('stop');
  },

  next: () => {
    send('next');
  },

  prev: () => {
    send('prev');
  },

  queue: (objs) => {
    if (!objs) {
      send('playlist', emit.queue);
      return;
    }
    objs.forEach((obj, i) => {
      setTimeout(() => {
        send(`enqueue "${path.join(cfg.root, obj.artist, obj.album, obj.song.title)}"`);
      }, 100 * i);
    });
  },

  volume: (keyword) => {
    if (keyword === 'up') {
      send('volup 3');
    } else if (keyword === 'down') {
      send('voldown 3');
    } else {
      send(`volume ${keyword}`);
    }
  },

  nowPlaying: () => {
    send('get_title', (title) => {
      title.split('\n').forEach(line => {
        if (!line.startsWith('status change:') && line.trim().length)
          emit('NOW PLAYING', line);
      });
    });
  },

  logs: () => {
    emit('LOGS', logs.slice(-25));
  }

}
