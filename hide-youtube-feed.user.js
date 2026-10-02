// ==UserScript==
// @name         Hide YouTube Home Feed
// @namespace    https://github.com/Virojet/Hide-youtube-feed
// @version      1.0.0
// @description  Keeps the YouTube home page empty. Search, subscriptions, channels, playlists and video pages work as usual.
// @homepageURL  https://github.com/Virojet/Hide-youtube-feed
// @downloadURL  https://raw.githubusercontent.com/Virojet/Hide-youtube-feed/HEAD/hide-youtube-feed.user.js
// @updateURL    https://raw.githubusercontent.com/Virojet/Hide-youtube-feed/HEAD/hide-youtube-feed.user.js
// @icon         https://www.youtube.com/favicon.ico
// @match        https://www.youtube.com/*
// @run-at       document-start
// @grant        GM_addStyle
// @noframes
// ==/UserScript==

/*
 * How it works
 * ------------
 * YouTube is a single-page app. Every page is rendered inside
 * <ytd-page-manager>, and the home page is the <ytd-browse page-subtype="home">
 * element. One CSS rule hides that element, which leaves the masthead (logo,
 * search box, notifications, account menu) and the left guide untouched.
 *
 * Because it is plain CSS, the rule follows YouTube's in-app navigation on its
 * own: it applies whenever the home page is shown and stops applying as soon as
 * you search, open a video or visit any other page. This is also why the script
 * matches every youtube.com URL instead of only the home page: you can land on
 * a video first and click the YouTube logo later.
 *
 * If YouTube ever renames this element, the feed simply becomes visible again;
 * nothing else on the site is affected.
 */

(function () {
  'use strict';

  const css = `
    ytd-browse[page-subtype="home"] {
      display: none !important;
    }
  `;

  if (typeof GM_addStyle === 'function') {
    GM_addStyle(css);
    return;
  }

  // Fallback for userscript managers that do not provide GM_addStyle.
  const style = document.createElement('style');
  style.textContent = css;
  const attach = () => (document.head || document.documentElement).appendChild(style);

  if (document.documentElement) {
    attach();
  } else {
    // At document-start the <html> element may not exist yet.
    new MutationObserver((_, observer) => {
      if (document.documentElement) {
        observer.disconnect();
        attach();
      }
    }).observe(document, { childList: true });
  }
})();
