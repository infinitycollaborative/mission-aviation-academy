/**
 * Relays website form submissions into GoHighLevel.
 *
 * The browser never sees the GHL token — it posts here, and this function
 * calls GHL server-side. Everything after the contact lands (confirmation
 * email, the guide link, pre-order notifications, nurture sequences) is a
 * GHL workflow triggered by the tags below. No email is sent from here.
 *
 * CommonJS on purpose: the repo has no package.json, so Vercel's Node
 * runtime treats api/*.js as CommonJS. Node 18+ provides global fetch.
 *
 * Required environment variables (Vercel → Settings → Environment Variables):
 *   GHL_API_TOKEN   Private Integration Token, scoped to contacts.write
 *   GHL_LOCATION_ID The sub-account ID this site feeds
 */

const GHL_ENDPOINT = "https://services.leadconnectorhq.com/contacts/upsert";
const GHL_API_VERSION = "2021-07-28";

// Each form maps to the tags that fire its GHL workflow, and where the
// visitor lands afterwards. Adding a form = adding an entry here.
const FORMS = {
  "yab-guide": {
    tags: ["yab-guide-fall2026", "website-signup"],
    source: "Website — Career Pathway Guide",
    redirect: "/thanks-guide",
  },
  "rte-preorder": {
    tags: ["rte-preorder-waitlist", "website-signup"],
    source: "Website — Ricky the Explorer pre-order",
    redirect: "/thanks-preorder",
  },
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed." });
  }

  const body = parseBody(req.body);
  const form = FORMS[body.form];
  if (!form) return res.status(400).json({ error: "Unknown form." });

  // Honeypot. It is hidden from people and irresistible to bots; when it is
  // filled we answer exactly as we would on success so the bot learns nothing.
  if (body.company) return succeed(req, res, form.redirect);

  const email = String(body.email || "").trim().toLowerCase();
  if (!EMAIL_RE.test(email)) {
    return res.status(400).json({ error: "Please enter a valid email address." });
  }

  // COPPA: never store a child's own contact details. Enforced here rather
  // than in the browser so it holds even if the page script never runs.
  if (slug(body.ageBand) === "under-13") {
    return res.status(400).json({
      error: "Because you're under 13, we need a parent or guardian to sign up for you. Please ask them to fill this in with their own email.",
    });
  }

  const token = process.env.GHL_API_TOKEN;
  const locationId = process.env.GHL_LOCATION_ID;
  if (!token || !locationId) {
    // Never fail silently — a dropped lead is worse than a visible error.
    console.error("GHL not configured; lead not delivered", { form: body.form });
    return res.status(503).json({ error: "Signup is temporarily unavailable." });
  }

  const { firstName, lastName } = splitName(body.name);

  // Role and age arrive as tags rather than custom fields so this works
  // against a fresh GHL sub-account with no field IDs to look up first.
  const tags = [...form.tags];
  if (body.role) tags.push(`role-${slug(body.role)}`);
  if (body.ageBand) tags.push(`age-${slug(body.ageBand)}`);

  try {
    const ghl = await fetch(GHL_ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        Version: GHL_API_VERSION,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        locationId,
        email,
        firstName,
        lastName,
        name: [firstName, lastName].filter(Boolean).join(" ") || undefined,
        tags,
        source: form.source,
      }),
    });

    if (!ghl.ok) {
      const detail = await ghl.text();
      console.error("GHL rejected the contact", { status: ghl.status, detail });
      return res.status(502).json({ error: "We could not complete your signup." });
    }

    return succeed(req, res, form.redirect);
  } catch (err) {
    console.error("GHL request failed", err);
    return res.status(502).json({ error: "We could not complete your signup." });
  }
};

// The form works with or without JavaScript. Scripted submits want JSON so
// they can show an inline error; a plain HTML form submit needs a redirect.
function succeed(req, res, redirect) {
  if (String(req.headers["content-type"] || "").includes("application/json")) {
    return res.status(200).json({ ok: true, redirect });
  }
  res.setHeader("Location", redirect);
  return res.status(303).end();
}

function parseBody(raw) {
  if (!raw) return {};
  if (typeof raw !== "string") return raw;
  try { return JSON.parse(raw); } catch { return {}; }
}

// "Ricardo Foster" -> first "Ricardo", last "Foster". A single word is a
// first name; anything past the second word stays with the surname.
function splitName(value) {
  const parts = String(value || "").trim().split(/\s+/).filter(Boolean);
  return { firstName: parts[0] || "", lastName: parts.slice(1).join(" ") };
}

function slug(value) {
  return String(value).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}
