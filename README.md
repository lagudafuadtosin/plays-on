# Plays On ![logo](icon.svg)

Keeps videos and music playing in Firefox for Android when you switch to another app, and keeps YouTube and YouTube Music playlists going to the next video in the background.

Plays On is built on [Video Background Play Fix](https://github.com/mozilla/video-bg-play) by Timothy Guan-tin Chien and Jan Henning, under the MIT licence. It is a separate add-on and is not made or endorsed by them or by Mozilla.

## What it does

- **Keeps playing when you leave the page.** Sites can tell when you switch tabs or apps and pause the video. Plays On hides that from them, so YouTube keeps playing.
- **Keeps YouTube playlists going.** With Firefox in the background, YouTube moves to the next video in a playlist or Mix but never starts it. Plays On notices the player is stuck and starts it. Tested on a Samsung Galaxy A14 with Firefox 157 for Android: 6 of 6 song changes, across playlists and Mixes, including ones with an ad first.
- **Keeps long videos going.** Some sites stop when they see no activity for a while. Plays On keeps the activity time fresh, the same as the original.

## Known limit

On phones that are low on memory, Android can close parts of Firefox when it goes to the background, and the video stops with "An error occurred". No add-on can prevent that. Closing other apps first helps.

## Privacy

Plays On makes no network requests, collects nothing and stores nothing. It only runs on youtube.com and youtube-nocookie.com.

## How it works

The add-on injects a content script on the sites above.

- **Page Visibility API:** it blocks the `visibilitychange` event and makes `document.hidden` always `false` and `document.visibilityState` always `visible`.
- **User activity:** on YouTube, it sends a harmless key event about once a minute.
- **Playlists:** on m.youtube.com on Android, while Firefox is really in the background, if a video has ended and the next has not started after 2 seconds, and the player is not playing or buffering, it calls the player's own `playVideo()`, at most three times per video.

## Credit

Video Background Play Fix was created by Timothy Guan-tin Chien (timdream) and maintained by Jan Henning, with translations and fixes from its contributors. Plays On keeps their code and its history.

## Licence

MIT, the same as the original. See [LICENSE](LICENSE). The icon is new and is part of this project.

## Problems and ideas

[Open an issue](https://github.com/lagudafuadtosin/plays-on/issues).
