'use strict';

const path = require('path');
const fs = require('fs');

const _root = '/Users/user/itunes';

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
find(_root).map(artist => {
  find(path.join(_root, artist)).map(album => {
    find(path.join(_root, artist, album), false).map((song, i) => {

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

module.exports = (params) => {

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

      return true;
    });

    return filtered.map(result => {
      return path.join(_root, result.artist, result.album, result.song.title);
    });

  }
};

module.exports.media = media;
module.exports.buildQuery = (words) => {

  let parsing = null;
  let query = { 'artist':[], 'album':[], 'song':[], 'playlist':[] };

  for (let i=0, len=words.length; i<len; i++) {
    const word = words[i];

    if (word.startsWith('--')) {
      parsing = word.split('').slice(2).join('');
      continue;
    }

    //console.log(query,'|', parsing,'|', word);
    if (query[parsing])
      query[parsing].push(word);

/*

              const nextToken = tokens[j+1];
              if (nextToken.startsWith('--')) {
                switch (nextToken) {
                  case ('--song'):
                    console.log('PLAY SONG', tokens.slice(j+2).join(' '));
                    break;
                  case ('--artist'):
                    console.log('PLAY ARTIST', tokens.slice(j+2).join(' '));
                    break;
                  case ('--album'):
                    console.log('PLAY ALBUM', tokens.slice(j+2).join(' '));
                    break;
                  case ('--playlist'):
                    break;
                  case ('--url'):
                    break;
                  default:
                }
              } else {
                console.log('PLAY', tokens.slice(j+1).join(' '));
              }*/
  }

  query.artist = query.artist.join(' ');
  query.album = query.album.join(' ');
  query.song = query.song.join(' ');
  query.playlist = query.playlist.join(' ');

  return parsing ? query : null;
}
