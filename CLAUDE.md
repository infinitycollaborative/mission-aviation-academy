# Mission Aviation Academy — Claude Code Rules

## HARD STOPS (never change these)
- `/yab` and `/ricky` routes — PERMANENT, printed in books. Never rename, redirect, or restructure.
- Calendly slug: `admissions-missionaviationacademy/new-meeting` — must never change.
- Facility address: **4639 Birdsong Blvd** — Parking GPS: **4661 Birdsong Blvd** — never 4651.
- Legal org name: **Infinity Aero Club Tampa Bay, Inc.** — never alter.
- API key (ANTHROPIC_API_KEY) lives ONLY in Vercel environment variables — never hardcode in any file.
- All files are static HTML (not JSX/React).

## REQUIRED WORKFLOW — run after EVERY code change
1. **Make the change.**
2. **Run the audit script** immediately after:
   ```bash
   python3 /tmp/claude-0/-home-user-mission-aviation-academy/68c00f99-7554-574e-97fb-756f3bf2bf2d/scratchpad/audit.py
   ```
3. **Fix every CRIT and HIGH** before committing. Review MEDs and LOWs — fix if quick.
4. **Commit + push** only when audit shows 0 CRIT / 0 HIGH.

> This rule applies to every session, every change, no exceptions.

## Site architecture
- Static HTML deployed via Vercel auto-deploy from `main` branch of `infinitycollaborative/mission-aviation-academy`
- Shared nav: `maa-nav.js` — self-injecting (8 KB). Every page loads it in `<head>`. No separate CSS file needed.
- Shared CSS: `maa-shared.css` — base variables and utilities for non-standard pages.
- Serverless: `api/evaluate.js` — Vercel function proxying Claude API for the career evaluator.

## Nav architecture (current — post Oct 2026 deploy)
- **Do NOT** add `<nav class="maa-site-nav">` HTML blocks — old architecture, retired.
- **Do NOT** link `maa-nav.css` — retired.
- **Do** add `<script src="/maa-nav.js"></script>` in `<head>` on every new page.

## Key stats / content (update here when changed)
- FAA credentials issued: **730+** (updated Oct 2026)
- Students flown: **1,380+**
- SUFS cycle value: **$8,000/student/cycle**
- B.O.S.S. Moves — always formatted as "B.O.S.S. Moves" (not "BOSS MOVES")

## Author canonical format
- YAB: `LCDR Ricardo "Tattoo" Foster, USN (Ret.) & MAJ Bruce "BOMBER" Blashka, USMC (Ret.)`
- Ricky the Explorer: `Ricardo Foster`

## Key URLs (never change)
- Calendly: `https://calendly.com/admissions-missionaviationacademy/new-meeting`
- FlightCircle shop: `https://flightcircle.com/shop/f2ef4eacb717/`
- Aircraft N7480X, 1960 Cessna 172B, home base X39

## EIN / Legal footer
Every public-facing page footer must include: **EIN 85-1110607** and 501(c)(3) status.
Disclaimer: `iACT/MAA is not a certificated flight school and does not hold an FAA Part 61 or Part 141 certificate`

## Sitemap
`sitemap.xml` in project root — add every new page at the correct priority.

## PERIODIC COMPREHENSIVE AUDIT — run when asked, or at the start of a new session
Beyond the per-change audit script, run a full gap check covering:

1. **Nav vs. files** — every href in `maa-nav.js` NAV_DATA must have a corresponding `.html` file. Missing = live 404.
2. **Sitemap vs. files** — every public-facing `.html` file should have a `<url>` entry in `sitemap.xml`. Exceptions: 404.html, thanks-*.html, *-intake.html, redirect-only files.
3. **`maa-nav.js` presence** — every `.html` file (except redirect-only pages and 404.html) must load `<script src="/maa-nav.js"></script>` in `<head>`.
4. **EIN in footer** — every public-facing page must include EIN 85-1110607 and the 501(c)(3) / Part 61 disclaimer. Exceptions: redirect-only pages, 404.html, thanks pages.
5. **Dead nav CSS** — no page should have a `nav { }` element-selector CSS rule or old `.site-nav` / `.maa-site-nav` class blocks. These conflict with the maa-nav.js injected nav element.
6. **Meta descriptions** — every public-facing page needs `<meta name="description" content="..."/>`.
7. **Stale/past-event pages** — pages tied to concluded events should redirect or be updated.

Report findings grouped as 🔴 HIGH (live 404, missing nav), 🟡 MEDIUM (EIN, old CSS, meta desc), 🟢 LOW (sitemap gaps for non-public pages). Recommend fixes in priority order.
