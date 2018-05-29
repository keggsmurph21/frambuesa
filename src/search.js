'use strict';

const path = require('path');
const fs = require('fs');

const cfg = require('./config');

function buildQuery(words) {
  let parsing = null;
  let query = { 'artist':[], 'album':[], 'song':[], 'playlist':[] };

  for (let i=0, len=words.length; i<len; i++) {
    const word = words[i];

    if (word.startsWith('--')) {
      parsing = word.split('').slice(2).join('');
      continue;
    }

    if (query[parsing])
      query[parsing].push(word);
  }

  query.artist = query.artist.join(' ');
  query.album = query.album.join(' ');
  query.song = query.song.join(' ');
  query.playlist = query.playlist.join(' ');

  console.log(`F> query:`, query)
  return parsing ? query : null;
}

function find(root, dirs=true) {
  return fs.readdirSync(root).filter((file) => {
    const stat = fs.statSync(path.join(root, file));
    if (dirs)
      return stat.isDirectory();
    return stat.isFile();
  });
}

function escape(string) {
  string = string
    .replace(/(\/|:|\\|\'|\?|\,|\.|\;)/g, '_')
    .replace(/\W+/, ' ')
    .replace('á', 'a')
    .replace('é', 'e')
    .replace('í', 'i')
    .replace('ó', 'o')
    .replace('ō', 'o')
    .replace('ú', 'u');

  return string;
}

function regex(string) {
  return new RegExp(`.*${escape(string)}.*`, 'i');
}

let files = [];
find(cfg.root).map(artist => {
  find(path.join(cfg.root, artist)).map(album => {
    find(path.join(cfg.root, artist, album), false).map((song, i) => {

      files.push({
        artist: artist,
        album: album,
        song: {
          track: i + 1,
          title: song
        }
      });

    });
  });
});

module.exports = (words) => {

  const query = buildQuery(words);

  if (!query)
    return [];

  if (!query.artist && !query.album && !query.song && !query.playlist) {
    console.error(`F> search results ERR: insufficient search query`);
    return [];
  }

  if (query.playlist) {

  } else {

    const filtered = files.filter(file => {

      if (query.artist && !escape(file.artist).match(regex(query.artist)))
        return false;

      if (query.album && !escape(file.album).match(regex(query.album)))
        return false;

      if (query.song && !escape(file.song.title).match(regex(query.song)))
        return false;

      if (!file.song.title.match(/(mp3|m4p|ogg|wav|flac|aiff)$/i))
        return false;

      return true;
    });

    console.log(`F> search results:`, filtered);
    return filtered;
  }
};

module.exports.files = files;
