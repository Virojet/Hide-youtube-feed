# Hide YouTube Home Feed

A Tampermonkey userscript that keeps the YouTube home page (`youtube.com`) empty. Everything else on YouTube keeps working as usual.

## What it does

| Page | Result |
| --- | --- |
| Home (`youtube.com`): recommended videos, Shorts shelf, topic chips, promos | Hidden. The page stays empty. |
| Masthead: logo, search box, notifications, account menu | Unchanged |
| Left guide: Home, Shorts, Subscriptions, You | Unchanged |
| Search results, Subscriptions, channels, playlists, history, Shorts, video pages | Unchanged |

## Installation

1. Install the [Tampermonkey](https://www.tampermonkey.net/) extension for your desktop browser.
2. **Chrome, Edge, Brave and other Chromium browsers only:** allow userscripts, or Tampermonkey cannot run any script.
   - Open the extensions page (`chrome://extensions`, `edge://extensions` or `brave://extensions`), click **Details** on Tampermonkey, and turn on **Allow User Scripts**.
   - If there is no such switch (older browser versions), turn on **Developer mode** on the extensions page instead.
3. Install the script, using either option:
   - **One click:** open [hide-youtube-feed.user.js (raw)](https://raw.githubusercontent.com/Virojet/Hide-youtube-feed/HEAD/hide-youtube-feed.user.js) and press **Install** on the Tampermonkey page that appears.
   - **Manual:** open the Tampermonkey dashboard, click the **+** tab, replace the template with the contents of [`hide-youtube-feed.user.js`](hide-youtube-feed.user.js), and save with `Ctrl+S` (`Cmd+S` on macOS).
4. Reload any open YouTube tabs.

## Verifying it works

1. Open `https://www.youtube.com/`. The page should be empty apart from the top bar and the left-hand menu.
2. Search for anything. Results should appear normally.
3. Click the YouTube logo. The home page should be empty again.

On a YouTube tab, the Tampermonkey menu lists **Hide YouTube Home Feed** with its switch turned on.

## How it works

YouTube is a single-page app: every page is rendered inside one container, and the home page is the element `<ytd-browse page-subtype="home">`. The script injects a single CSS rule that hides that element:

```css
ytd-browse[page-subtype="home"] { display: none !important; }
```

Design choices:

- **CSS only.** The rule follows YouTube's in-app navigation automatically. It applies whenever the home page is displayed and stops applying as soon as you navigate anywhere else. No timers, no page-change listeners, and nothing to fall out of sync.
- **Injected at `document-start`.** The rule is in place before YouTube renders anything, so the feed never flashes on screen.
- **Runs on every `www.youtube.com` page.** You can land on a video first and click the logo later, so the rule must already be loaded.
- **Fails safe.** If YouTube renames this element, the feed simply reappears. Search and every other page keep working.

## Limitations

- **Desktop website only.** The script targets `www.youtube.com` and does not cover the mobile website (`m.youtube.com`). The YouTube apps for phones, tablets and TVs cannot run userscripts at all.
- **Hidden, not blocked.** YouTube still sends the first batch of recommendations with the page. The script prevents them from being displayed.
- **Depends on YouTube's markup.** YouTube changes its front end regularly. The `page-subtype="home"` hook has been stable for years, but no userscript can guarantee it will stay that way.

## Troubleshooting

**The feed is still visible.**

1. On Chromium browsers, confirm that **Allow User Scripts** (or **Developer mode**) is enabled (see Installation, step 2). This is the most common cause.
2. In the Tampermonkey dashboard, confirm that the script is enabled.
3. Reload the YouTube tab.
4. On the home page, open the developer console (`F12`) and run:

   ```js
   document.querySelector('ytd-browse[page-subtype="home"]')
   ```

   If this returns `null`, YouTube has changed its markup and the selector needs to be updated. Please [open an issue](https://github.com/Virojet/Hide-youtube-feed/issues).

**Temporarily showing the feed.** Click the Tampermonkey icon, switch the script off, and reload the page.

## Updates

Tampermonkey checks the `@updateURL` in the script header and installs newer versions automatically. When you change the script, increase `@version` so that installed copies pick up the change.
