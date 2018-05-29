'use strict';

const host = process.env.HOST,
    port = process.env.PORT,
    bot_id = process.env.BOT_ID;

module.exports = {

  root: '/Users/user/itunes',
  app_secret: process.env.FRAMBUESA_SECRET,

  host: host,
  port: port,

  bot_token: process.env.GROUPME_TOKEN,
  bot_id: bot_id,

  vlc_socket: 'tmp/vlc.sock',

  bot_queue_url: `http://${host}:${port}/bot/queue`,
  bot_process_url: `http://${host}:${port}/bot/process`,
  bot_post_url: `https://api.groupme.com/v3/bots/post?bot_id=${bot_id}&text=`

};
