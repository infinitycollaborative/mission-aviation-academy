# Connecting the website forms to GoHighLevel

The website collects the lead. GoHighLevel does everything after that —
confirmation email, the guide link, pre-order notifications, nurture
sequences, unsubscribe handling. No email is ever sent from this codebase.

```
/yab or /ricky  →  POST /api/lead  →  GHL contact created + tagged
   (your form)      (this repo)         (GHL workflow does the rest)
                          ↓
                 /thanks-guide or /thanks-preorder
```

`api/lead.js` is the only code involved. It exists so the GHL token stays on
the server instead of sitting in page source where anyone can scrape it and
spam your CRM.

> GoHighLevel renames menus fairly often. The steps below are described by
> what you are looking for, not by exact menu labels. If a name does not
> match, search their settings for the capability.

---

## Part 1 — GoHighLevel

### 1.1 Create a Private Integration Token

1. Open the **sub-account** for Mission Aviation Academy (not the agency view).
2. Settings → **Private Integrations** → create a new integration.
3. Name it `Website forms`.
4. Grant the scope **`contacts.write`** (add `contacts.readonly` if you want
   to read contacts back later).
5. Copy the token immediately — GHL shows it once.

Use a Private Integration Token, not a legacy API key. Legacy keys are being
retired and carry far broader access than this needs.

### 1.2 Find your Location ID

Settings → Business Profile. The **Location ID** is on that screen. It
identifies which sub-account the contacts land in.

### 1.3 Create the two workflows

The function does not send email. It creates a contact and applies tags; the
tags are what start your automation.

**Workflow A — Career guide delivery**

- Trigger: **Contact Tag Added**, tag `yab-guide-fall2026`
- Action: **Send Email**
  - Include a link to `https://missionaviationacademy.org/guide/maa-aviation-aerospace-career-guide-fall-2026.pdf`
  - Link to the file. Do not attach it — attachments hurt deliverability and
    you lose the ability to update the file without re-sending.
- Optional follow-ups: wait 3 days → send a program or scholarship email.

**Workflow B — Ricky the Explorer pre-order waitlist**

- Trigger: **Contact Tag Added**, tag `rte-preorder-waitlist`
- Action 1: **Send Email** — confirm they are on the list, and say plainly
  that they will hear nothing until October 26.
- Action 2: **Wait until** October 26, 2026 → **Send Email** with the
  pre-order link.

That second step is the reason this is worth wiring up: the waitlist notifies
itself on launch day without anyone remembering to do it.

### 1.4 Tags the site sends

| Tag | Meaning |
| --- | --- |
| `website-signup` | Came from this website (on every contact) |
| `yab-guide-fall2026` | Requested the career guide |
| `rte-preorder-waitlist` | Wants pre-order notification |
| `role-student`, `role-parent-or-guardian`, `role-veteran-or-transitioning-service-member`, `role-educator-or-counselor`, `role-other` | Selected role |
| `age-13-17`, `age-18-or-older` | Selected age range |

Role and age are sent as tags rather than custom fields so this works against
a fresh sub-account with no field IDs to look up. If you would rather have
them as custom fields later, that is a change to `api/lead.js` only.

There is no `age-under-13` tag by design — see Part 5.

---

## Part 2 — Vercel

Settings → **Environment Variables**. Add both, for all environments
(Production, Preview, Development):

| Name | Value |
| --- | --- |
| `GHL_API_TOKEN` | The Private Integration Token from 1.1 |
| `GHL_LOCATION_ID` | The Location ID from 1.2 |

Then **redeploy** — environment variables are read at build time, so an
existing deployment will not pick them up on its own.

Nothing else in Vercel needs to change. `api/lead.js` is detected
automatically as a serverless function; there is no build step to configure.

**Never put these values in the repo.** `.env.example` is the template and is
the only version of this that belongs in git.

---

## Part 3 — The PDF

The download button on `/thanks-guide` points at:

```
/guide/maa-aviation-aerospace-career-guide-fall-2026.pdf
```

That file is **not in the repo yet**. Export the current guide from Drive
(`MAA_Aviation_Aerospace_Career_Guide_Fall2026_rev2.docx` is the newest
content) to PDF, and commit it at exactly that path.

Host it here rather than linking to Google Drive. Drive shows an interstitial
instead of downloading, throttles with "too many users have viewed this file"
precisely when a post does well, breaks whenever folder permissions change,
and gives you no download numbers.

---

## Part 4 — Deploy and test

1. Set the two environment variables (Part 2) **before** merging, so the form
   works the moment it goes live.
2. Commit the PDF (Part 3).
3. Open a pull request. Vercel builds a preview automatically.
4. On the preview URL, submit both forms with a real address you control.
5. Check, in order:
   - the contact appears in GHL with the right tags
   - the workflow email arrives
   - the download link in the email works
   - `/thanks-guide` downloads the PDF
6. Merge. Production deploys automatically.

To test a failure, submit with the environment variables unset — you should
get a clear on-page error, never a silent drop.

---

## Part 5 — Things worth knowing

**Under-13 signups are refused on the server.** `api/lead.js` rejects them
with a message asking a parent or guardian to sign up instead. This is COPPA,
and it is enforced server-side on purpose — a browser-side check can be
bypassed by anyone who opens devtools. Nothing about a child ever reaches GHL.

**Spam protection is a honeypot field.** It stops ordinary bots. If you start
seeing junk contacts, add Cloudflare Turnstile — a real rate limit needs
shared storage (Vercel KV or Upstash) because serverless functions keep no
memory between requests.

**The forms work without JavaScript.** `signup.js` intercepts the submit for a
smoother experience, but if it fails to load the form posts normally and the
function replies with a redirect.

**Adding a third form** is one entry in the `FORMS` object in `api/lead.js`
(tags, source, redirect), plus a form on the page with a matching hidden
`form` field. Nothing else.

**Unsubscribe and CAN-SPAM** are handled by GHL's email builder, which is a
good reason to send from GHL rather than from code. Make sure your physical
address is set in the GHL email footer settings.
