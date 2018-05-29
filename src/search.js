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

let media = [];
find(cfg.root).map(artist => {
  find(path.join(cfg.root, artist)).map(album => {
    find(path.join(cfg.root, artist, album), false).map((song, i) => {

      media.push({
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

  const params = buildQuery(words);

  if (!params)
    return [];

  if (params.playlist) {

  } else {

    const filtered = media.filter(medium => {

      if (params.artist && !escape(medium.artist).match(regex(params.artist)))
        return false;

      if (params.album && !escape(medium.album).match(regex(params.album)))
        return false;

      if (params.song && !escape(medium.song.title).match(regex(params.song)))
        return false;

      if (!medium.song.title.match(/(mp3|m4p|ogg|wav|flac|aiff)$/i))
        return false;

      return true;
    });

    console.log(`F> search results:`, filtered);
    return filtered;
  }
};

module.exports.media = media;
