# Cavallo Ranch — Site Rebuild

Static multi-page site. No build step, no dependencies.

## URL structure

Directory-based so live URLs are preserved exactly — **no redirects needed**:

| File | Serves at |
|---|---|
| `index.html` | `/` |
| `experience/index.html` | `/experience` |
| `stay/index.html` | `/stay` |
| `events/index.html` | `/events` |
| `local-attractions/index.html` | `/local-attractions` |
| `contact/index.html` | `/contact` |

Every host (Netlify, Vercel, Cloudflare Pages, S3+CloudFront, Apache, nginx) serves
`index.html` for a directory request by default. Nothing to configure.

The in-page anchors from the old site's dropdown menu are preserved with readable IDs:
`/experience#equestrian-activities`, `/stay#virtual-tour`, etc. The old UUID-style anchors
(`#section-f4d1306b-...`) will not resolve — if any external links or ads point at those,
add a small JS redirect or accept that they land at the top of the correct page.

## Before launch

1. Export assets per `ASSETS.md` into `assets/logo/`, `assets/video/`, `assets/images/`.
2. Fill in real room names on `/stay` and verify drive times on `/local-attractions`.
3. Wire the contact form to a real handler (see below).
4. Create `/terms-and-conditions/` or repoint the Privacy Policy link.
5. Add `robots.txt` and `sitemap.xml`.
6. Re-add analytics — the live site runs two Google Tag Manager containers
   (`GTM-W2ZGBNG2`, `GTM-T9SFQGHZ`). Paste those snippets into each page's `<head>`
   and `<body>` if you want that tracking to continue.

## Contact form

Currently client-side only — it validates and shows a success message but sends nothing.
Wire it to whatever you use (Formspree, Netlify Forms, your CRM endpoint) by replacing
the TODO in the inline script at the bottom of `contact/index.html`.

For Netlify Forms, the simplest change: add `netlify` and `name="contact"` to the
`<form>` tag and delete the inline script.

## Brand

Colors come from `CavalloRanch_Colors_Final.pdf` and are defined once as CSS variables
at the top of `assets/style.css`:

| Variable | Hex | PMS |
|---|---|---|
| `--charcoal` | `#454142` | 4287 C |
| `--taupe` | `#696158` | 405 C |
| `--orange` | `#B33D26` | 7599 C |
| `--sand` | `#F8CFA9` | 2015 C |

Change them in one place and the whole site follows.

Typefaces are Cormorant Garamond (display) and Jost (body), loaded from Google Fonts.
Swap the `<link>` in each page's `<head>` and the `--f-display` / `--f-body` variables
if you'd rather self-host or use different faces.

## Local preview

Because pages use root-relative paths (`/assets/...`), open with a local server rather
than double-clicking the files:

```
cd site
python3 -m http.server 8000
```

Then visit `http://localhost:8000`.
