# frambuesa

This application is designed to be run on a [Raspberry Pi Zero](https://www.raspberrypi.org/products/raspberry-pi-zero/) connected to external speakers.  It links with commands delivered via [a GroupMe chat bot](https://github.com/keggsmurph21/murpus-web/blob/master/src/groupme-bot.js) to control a background VLC.

Currently supported actions:
 - `play` / `pause` / `stop`
 - `queue`
 - volume manipulation (`mute` / `unmute` / etc)
 - `next` / `prev`
 - `search` (params: `--artist`, `--album`, `--song`, [`--playlist`])
 - debugging: `echo` / `logs`
