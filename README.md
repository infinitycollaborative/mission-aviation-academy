# Mission Aviation Academy — missionaviationacademy.org

The public marketing site for Mission Aviation Academy, a 501(c)(3) nonprofit DBA of
Infinity Aero Club Tampa Bay, Inc.

A plain static site: hand-written HTML with inline CSS, no build step, no dependencies.

## Structure

| File           | Live URL  | Purpose                                            |
| -------------- | --------- | -------------------------------------------------- |
| `index.html`   | `/`       | Home — mission, book cards, contact                 |
| `yab.html`     | `/yab`    | Aviation & Aerospace Career Pathway Guide           |
| `ricky.html`   | `/ricky`  | Ricky the Explorer: Takes a Magic Flight            |
| `remember.html`| `/remember` | Founder's September 11 remembrance message       |
| `privacy.html` | `/privacy` | Privacy policy (required — the forms collect email) |
| `thanks-guide.html` | `/thanks-guide` | Post-signup download page |
| `thanks-preorder.html` | `/thanks-preorder` | Post-signup pre-order confirmation |
| `api/lead.js`  | `/api/lead` | Serverless relay: website forms → GoHighLevel |
| `signup.js`    | —         | Progressive enhancement for the forms |
| `404.html`     | —         | Served automatically for unmatched URLs             |
| `favicon.svg`  | —         | Site icon                                           |
| `robots.txt`   | —         | Crawler policy + sitemap pointer                    |
| `sitemap.xml`  | —         | Search engine index of the three public pages       |
| `vercel.json`  | —         | Routing and response headers                        |

## Forms and CRM

The two signup forms (`/yab` career guide, `/ricky` pre-order waitlist) post to
`/api/lead`, which creates a tagged contact in GoHighLevel. GHL workflows send
every email — this codebase sends none.

Setup, tags, workflows and testing: **[GHL-SETUP.md](GHL-SETUP.md)**.

Requires two environment variables in Vercel (`GHL_API_TOKEN`,
`GHL_LOCATION_ID`); see `.env.example`. The forms return a visible error
rather than dropping a lead if they are missing.

## Deployment

Production deploys from **git**, not from drag-and-drop uploads. Every push to `main`
publishes to the production domain; every pull request gets its own preview URL.

Vercel project settings this repo expects:

- **Framework Preset:** Other
- **Root Directory:** `./` (repo root — *not* a subfolder)
- **Build Command:** none / empty
- **Output Directory:** none / empty
- **Environment Variables:** `GHL_API_TOKEN`, `GHL_LOCATION_ID`
- **Production Branch:** `main`

To ship a change: commit to a branch, open a PR, check the preview URL, merge to `main`.

## Why `vercel.json` matters

Internal links point at extensionless paths (`/yab`, `/ricky`). `"cleanUrls": true` is
what makes Vercel serve `yab.html` at `/yab` and redirect `/yab.html` → `/yab`.
**Without this file every internal link 404s while the homepage still loads.**
`"trailingSlash": false` keeps `/yab/` resolving instead of erroring.

## Changing the domain

The production hostname is written in five places. If the domain ever changes, update:

- `robots.txt` — the `Sitemap:` line
- `sitemap.xml` — all three `<loc>` entries
- `index.html`, `yab.html`, `ricky.html`, `remember.html` — the `canonical` link and the `og:url` meta

Nothing else is hostname-dependent; all in-page links are root-relative.

## Local preview

No build step, but open the files through a server so that root-relative links work:

```sh
python3 -m http.server 8000
# then visit http://localhost:8000
```

Note that `python3 -m http.server` does not emulate `cleanUrls`, so `/yab` will 404
locally while `/yab.html` works. To preview exactly what production will serve:

```sh
npx vercel dev
```

## Contact

admissions@missionaviationacademy.org · (833) FLY-STEM
Tampa North Aero Park (X39), Wesley Chapel, Florida
