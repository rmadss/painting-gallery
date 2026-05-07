# Painting Archive

A personal website to showcase paintings over time — minimal, dark-mode-first, archive-style.

**Live site:** `https://<your-username>.github.io/<repo-name>/`

---

## Project Structure

```
├── index.html              ← Landing page (hero)
├── about.html              ← About / artist statement
├── timeline.html           ← Main archive — all paintings, search & filter
├── painting.html           ← Individual painting detail (loads via ?id=)
│
├── css/
│   └── styles.css          ← All custom styles + design tokens
│
├── js/
│   ├── nav.js              ← Shared navigation (injected into every page)
│   ├── timeline.js         ← Timeline archive logic (search, filter, render)
│   └── painting.js         ← Painting detail page logic
│
├── data/
│   └── paintings.js        ← ⭐ ALL painting data lives here — edit this file
│
├── public/
│   └── images/
│       ├── early-explorations/
│       │   ├── thumbs/     ← Thumbnail images (~700px)
│       │   └── *.jpg       ← Full-size images (~2000px)
│       ├── urban-fragments/
│       │   ├── thumbs/
│       │   └── *.jpg
│       └── quiet-hours/
│           ├── thumbs/
│           └── *.jpg
│
└── .github/
    └── workflows/
        └── deploy.yml      ← Auto-deploys to GitHub Pages on push to main
```

---

## Running Locally

No installation required. Just open `index.html` in your browser.

> **Note:** Some browsers block `fetch()` on `file://` URLs. Since all data is
> loaded from `data/paintings.js` as a plain `<script>` tag, this isn't an issue
> here — everything works by opening the file directly.

If you want a local dev server (optional, for a more accurate preview):

```bash
# Python 3 (if you have it)
python -m http.server 8000
# then open http://localhost:8000
```

---

## Adding a New Painting

1. **Add your images** to `public/images/<era-slug>/`:
   - Full size: `public/images/<era-slug>/<painting-id>.jpg`  (~1800–2400px)
   - Thumbnail: `public/images/<era-slug>/thumbs/<painting-id>.jpg`  (~600–800px)

2. **Open `data/paintings.js`** and add a new object to the correct era's
   `paintings` array:

```js
{
  id:          "your-painting-id",       // URL-safe slug, e.g. "canal-at-noon"
  title:       "Canal at Noon",
  image:       "public/images/quiet-hours/canal-at-noon.jpg",
  thumbnail:   "public/images/quiet-hours/thumbs/canal-at-noon.jpg",
  date:        "2025-06",               // YYYY-MM or YYYY-MM-DD
  medium:      "Oil on linen",
  dimensions:  "40 × 50 cm",
  tags:        ["oil", "landscape", "water", "daylight"],
  description: "A short note about the painting — what you were after, what you noticed.",
}
```

3. **Save and push to GitHub** — the site redeploys automatically.

---

## Adding a New Era

In `data/paintings.js`, add a new object to the `eras` array:

```js
{
  id:          "new-era-slug",
  title:       "Era Title",
  startDate:   "2026-01",
  endDate:     null,           // null = "Present"
  description: "A brief description of this period of work.",
  paintings:   [],             // add paintings here
}
```

Also create the matching image folders:
```
public/images/new-era-slug/
public/images/new-era-slug/thumbs/
```

---

## Deploying to GitHub Pages

### First-time setup

1. Push this project to a GitHub repository
2. Go to **Settings → Pages**
3. Under "Build and deployment", set Source to **GitHub Actions**
4. Push to `main` — the site deploys automatically

### Subdirectory URLs

If your repo is named `painting-website`, your site will be at:
`https://<username>.github.io/painting-website/`

Update `BASE_PATH` in `data/paintings.js`:
```js
const BASE_PATH = "/painting-website";
```

---

## Customising

| What | Where |
|---|---|
| Site name / nav label | `js/nav.js` → `nav-logo` text |
| Color palette | `css/styles.css` → `:root` CSS variables |
| Artist statement | `about.html` |
| Hero featured painting | `index.html` → hero image `src` + `href` |
| Nav links | `js/nav.js` → `NAV_LINKS` array |

---

## Tech Stack

- Pure HTML, CSS, JavaScript — no framework, no build step
- [Tailwind CSS](https://tailwindcss.com) via CDN (Play CDN)
- [Google Fonts](https://fonts.google.com) — Inter + Playfair Display
- Hosted on [GitHub Pages](https://pages.github.com) — free, forever

---

*Built to last. No dependencies to maintain, no servers to pay for.*
