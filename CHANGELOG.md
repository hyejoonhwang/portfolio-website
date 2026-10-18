# Changelog

## 2026-10-17 to 10-18

Everything below is live on hyejoonsummerhwang.com (deployed from `main` by Vercel).
Commit hashes are in brackets.

### Site structure
- **Work / Play split.** Home is now Work (five case studies); `work.html` became `play.html`. Nav reads work / play / about / resume. `/work` and `/work.html` redirect home. [383ff04]
- **Blog hidden.** Removed from the nav; `/blog` and `/blog.html` redirect home. `blog.html` is still in the repo. [446a45f]
- **Resume** link added to the nav on every page. [72f53fe]
- **Footer** on Work, Play and About: logo, "Summer Hwang · based in Brooklyn", and email, LinkedIn, X and book-a-call icons in theme orange. Sits at the bottom of the window on short pages. [3ef8447, 6adb782]
- **Scrollbars hidden** site-wide (scrolling still works). [0354f1e]
- **Text selection** is white on #FF3C00 on every page. [3ef8447]

### Brand
- **New logo**: Summer's own drawing, traced, perspective-corrected, turned to face right, smoothed and filled, as a 2 KB SVG in #EE3A06 (`images/summer-logo.svg`). [0354f1e]
- **Favicon** from the same logo: `favicon.svg`, `favicon-32.png`, `apple-touch-icon.png`. [3523c8b]
- **Type**: LT Cushion (About text, labels, project titles, home bio, footer) and Neulis (About left column). [5243bcc]

### Work page (home)
- Sticker and "based in Brooklyn" sit above the bio, centered on the page. [5243bcc]
- Thumbnails: tag pills in the top-left corner; numbers and arrows removed; titles appear on hover (always on touch screens). [5243bcc]
- Talkspace tags: internship, design system, shipped. [0354f1e]
- Gutsy thumbnail: the live-view phone on black with real app components floating around it. [e9f6309]

### Play page
- Three interlocking columns; Touch of Moss added (loop made from the blog's GIF, 10 MB → 0.8 MB); ShyFaceTime and Music Chat swapped. [446a45f]
- Title and archive list removed; numbers and arrows removed; titles on hover. [72f53fe, 5243bcc]

### Gutsy case study
- Rebuilt against the case-study review guide on the shared template: summary, meta row, problem/solution, four decision chapters, learnings, next project. Role taken from the deck. [e9f6309]
- Videos re-encoded from 49 MB to 2 MB; below-the-fold loops load when scrolled into view. [e9f6309]
- Title in Geist Mono Bold. [e9f6309]

### About page
- Polaroid stack of five photos; a click swings the top one to the back in one continuous arc. Captions blank. [72f53fe, 0354f1e]
- Copy: intro ends at "real life."; Reading is *The Design of Everyday Things* by Don Norman; Exploring is "Design systems for AI workflows"; "currently" in lowercase; all paragraphs near-black. [72f53fe, 5243bcc, 3ef8447]
- Hover cards: hip hop, cycling and sunbathing clips and a ballet photo; the book's cover on Reading; the song's album art on Listening. Hover-only words get a marker highlight; real links keep their underline. [72f53fe, 5243bcc, 20a47ec]
- VFX paragraph: clicking anywhere opens the Vimeo reel; a 4-second reel loop follows the cursor; "VFX compositor" and "Company3" show "check" tags with the IMDb and Company3 logos. [72f53fe, 5243bcc]
- Contact icons moved from the left column into the footer. [3ef8447]

### Listening (live music)
- Shows phone plays: `api/recently-played.py` reads YouTube Music history (ytmusicapi) with the `YTMUSIC_HEADERS` secret in Vercel. Live laptop plays from Last.fm come first; Last.fm's last scrobble is the fallback. [5243bcc]
- `vercel.json` keeps site media out of the Python function bundle (it hit the 225 MB limit). [761e1a6]
- The secret can be a raw "Copy as cURL"; error logs never print it. [f358a71]

### Housekeeping
- Original fonts, raw videos, photos and the logo drawing are in `_source/` (not in git; see `_source/README.md`).

## How to refresh the Listening cookies

When the Listening line stops showing phone plays:
1. Open a Chrome **Incognito** window and sign in at music.youtube.com.
2. DevTools (⌥⌘I) → Network → filter `browse` → click Library → right-click the `browse` request → **Copy → Copy as cURL**.
3. Vercel → portfolio-website → Settings → Environments → Production → Environment Variables → edit `YTMUSIC_HEADERS`, paste, save.
4. Close the Incognito window **without signing out**.
5. Redeploy (the new value only applies after a deploy).
