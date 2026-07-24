# Deploying to Vercel

## 1. Push to GitHub

Repo: `cavalloranch/website` (private, created empty).

Easiest route without a terminal — go to the repo, click **uploading an existing file**,
and drag in the *contents* of this folder (not the folder itself, or everything nests
one level too deep). Note the web uploader skips dotfiles, so `.gitignore` won't upload;
add it after with **Add file → Create new file**, or skip it.

With git:

```
cd cavallo-ranch
git init
git add .
git commit -m "Rebuild cavalloranch.com"
git remote add origin https://github.com/cavalloranch/website.git
git branch -M main
git push -u origin main
```

## 2. Import into Vercel

1. [vercel.com/new](https://vercel.com/new) → **Import Git Repository**
2. Authorize Vercel for the `cavalloranch` account (grant access to the `website` repo)
3. On the configure screen, **change nothing**:
   - Framework Preset: **Other**
   - Build Command: *empty*
   - Output Directory: *empty*
   - Install Command: *empty*
4. **Deploy**

It's a static site — there is no build step. If Vercel auto-detects a framework and
fills in a build command, clear it.

You'll get a URL like `website-abc123.vercel.app` in under a minute.

## 3. Viewing in Safari

The URL works in Safari on Mac and iPhone with nothing extra. On iPhone, tap
**Share → Add to Home Screen** for a quick full-screen check of the mobile layout.

**The hero video may not autoplay in Safari** — that's expected, not a bug. iOS blocks
autoplay in Low Power Mode and under Low Data Mode. The site handles this: the poster
image stays visible instead of a black rectangle. To verify the video itself works,
test with Low Power Mode off.

## About "private"

**A private GitHub repo does not make the deployed site private.** The Vercel URL is
publicly reachable by anyone who has it. It's unlisted, not protected.

What's in place:
- `robots.txt` disallows all crawlers
- `X-Robots-Tag: noindex, nofollow` header on every response (in `vercel.json`)

So it won't appear in Google. But anyone with the link can open it.

For real protection, Vercel's **Deployment Protection** (Settings → Deployment Protection)
adds password or SSO gating — a **Pro plan** feature, currently $20/month. If the
photography is sensitive, that's the only way to lock it down on Vercel.

Free alternative: Netlify's password protection is also paid, but Cloudflare Access
offers a free tier that gates a site behind email verification.

## Going live on cavalloranch.com

When you're ready to replace the Luxury Presence site:

1. Replace `robots.txt` with the production version (it's commented at the bottom of
   the file) — this is the step people forget, and it keeps you out of Google entirely
   if you miss it.
2. Remove the `X-Robots-Tag` header block from `vercel.json`.
3. Vercel → Settings → Domains → add `cavalloranch.com` and `www.cavalloranch.com`.
4. Lower your DNS TTL ~24h beforehand so the cutover propagates fast.
5. Update the nameservers or A/CNAME records at your registrar per Vercel's instructions.
6. After DNS resolves, submit `sitemap.xml` in Google Search Console.

Because URLs are preserved exactly (`/experience`, `/stay`, `/events`,
`/local-attractions`, `/contact`), no redirects are needed and existing rankings
carry over.

## Automatic redeploys

Once connected, every push to `main` redeploys automatically. Pull requests get their
own preview URLs. So swapping in the real photos later is: replace files in
`assets/images/`, commit, push — live in about a minute.

## Files Vercel uses

| File | Purpose |
|---|---|
| `vercel.json` | Clean URLs, caching, security headers, noindex |
| `404.html` | Styled not-found page |
| `robots.txt` | Crawler blocking (swap at launch) |
| `sitemap.xml` | For Search Console at launch |
