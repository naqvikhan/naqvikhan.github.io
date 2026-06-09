# naqvi.xyz — Portfolio

A static, no-build personal portfolio. Plain HTML/CSS/JS, with a small React
(via CDN) tweaks panel. No bundler, no install step.

## Run locally
Just open `index.html` in a browser. (For the résumé link and fonts to load
over `http://` rather than `file://`, serve the folder instead:)

```bash
python3 -m http.server 8080
# then visit http://localhost:8080
```

## Deploy
This is a static site — drop the whole folder on any static host.

- **Netlify / Vercel:** drag-and-drop this folder, or point the project at it.
  No build command; publish directory is the folder root.
- **GitHub Pages:** commit these files to a repo and enable Pages on the branch.
- **Cloudflare Pages / S3 / any web server:** upload the files as-is.

The entry point is `index.html`.

## Editing content
All text, links, jobs, projects, tools and the hero quotes live in
`portfolio-data.js` — edit that one file and refresh; the page rebuilds itself.
Images are in `images/`, the résumé PDF in `files/`.

## Files
- `index.html` — page scaffold
- `portfolio.css` — all styling
- `portfolio-data.js` — **your content** (edit here)
- `portfolio-render.js` — builds the page from the data
- `portfolio.js` — interactions + the hidden pixel-duck easter eggs 🦆
- `tweaks-panel.jsx` / `tweaks-app.jsx` — optional in-page theme tweaks panel
- `images/`, `files/` — assets
