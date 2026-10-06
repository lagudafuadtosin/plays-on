'use strict';

const IS_YOUTUBE = window.location.hostname.search(/(?:^|.+\.)youtube\.com/) > -1 ||
                   window.location.hostname.search(/(?:^|.+\.)youtube-nocookie\.com/) > -1;
const IS_MOBILE_YOUTUBE = window.location.hostname == 'm.youtube.com';
const IS_DESKTOP_YOUTUBE = IS_YOUTUBE && !IS_MOBILE_YOUTUBE;

const IS_ANDROID = window.navigator.userAgent.indexOf('Android') > -1;

// Page Visibility API
if (IS_ANDROID || !IS_DESKTOP_YOUTUBE) {
  Object.defineProperties(document.wrappedJSObject,
    { 'hidden': {value: false}, 'visibilityState': {value: 'visible'} });
}

window.addEventListener(
  'visibilitychange', evt => evt.stopImmediatePropagation(), true);

// User activity tracking
if (IS_YOUTUBE) {
  loop(pressKey, 60 * 1000, 10 * 1000); // every minute +/- 5 seconds
}

// Playlists in the background
if (IS_MOBILE_YOUTUBE && IS_ANDROID) {
  watchPlaylist();
}

function pressKey() {
  const keyCodes = [18];
  let key = keyCodes[getRandomInt(0, keyCodes.length)];
  sendKeyEvent("keydown", key);
  sendKeyEvent("keyup", key);
}

function sendKeyEvent (aEvent, aKey) {
  document.dispatchEvent(new KeyboardEvent(aEvent, {
    bubbles: true,
    cancelable: true,
    keyCode: aKey,
    which: aKey,
  }));
}

function loop(aCallback, aDelay, aJitter) {
  let jitter = getRandomInt(-aJitter/2, aJitter/2);
  let delay = Math.max(aDelay + jitter, 0);

  window.setTimeout(() => {
                      aCallback();
                      loop(aCallback, aDelay, aJitter);
                    }, delay);
}

function getRandomInt(aMin, aMax) {
  let min = Math.ceil(aMin);
  let max = Math.floor(aMax);
  return Math.floor(Math.random() * (max - min)) + min;
}

// With Firefox in the background, YouTube moves a playlist on to the next video but never starts
function watchPlaylist() {
  const PLAYING = 1;
  const BUFFERING = 3;
  const WAIT_MS = 2000;
  const MAX_NUDGES = 3;

  let lastPlaying = Date.now();
  let lastChange = 0;
  let lastHref = location.href;
  let nudges = 0;

  document.addEventListener('playing', evt => {
    if (evt.target instanceof HTMLVideoElement) lastPlaying = Date.now();
  }, true);
  document.addEventListener('ended', evt => {
    if (evt.target instanceof HTMLVideoElement) {
      lastChange = Date.now();
      nudges = 0;
    }
  }, true);

  window.setInterval(() => {
    if (location.href !== lastHref) {
      lastHref = location.href;
      lastChange = Date.now();
      nudges = 0;
    }
    if (!document.hidden || !lastChange || lastPlaying > lastChange) return;
    if (Date.now() - lastChange < WAIT_MS || nudges >= MAX_NUDGES) return;

    const player = document.getElementById('movie_player');
    const api = player && player.wrappedJSObject;
    if (!api || typeof api.getPlayerState !== 'function' || typeof api.playVideo !== 'function') return;
    const state = api.getPlayerState();
    if (state === PLAYING || state === BUFFERING) return;

    nudges++;
    api.playVideo();
  }, 1000);
}
