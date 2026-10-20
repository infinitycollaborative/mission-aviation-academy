// api/evaluate.js
// Vercel Serverless Function — Claude API Proxy
// Deployed at: missionaviationacademy.org/api/evaluate
// Environment variable required: ANTHROPIC_API_KEY
// Set in Vercel dashboard → Project Settings → Environment Variables

export default async function handler(req, res) {
  // ── CORS headers ────────────────────────────────────────────────
  res.setHeader('Access-Control-Allow-Origin', 'https://missionaviationacademy.org');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // ── API key check ────────────────────────────────────────────────
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    console.error('ANTHROPIC_API_KEY not set in environment variables');
    return res.status(500).json({ error: 'API configuration error. Contact admissions@missionaviationacademy.org' });
  }

  // ── Forward request to Claude API ───────────────────────────────
  try {
    const body = req.body;

    // Ensure model is pinned to Sonnet 4.6
    const payload = {
      model: 'claude-sonnet-4-6',
      max_tokens: 1800,
      ...body,
      // Override model/tokens if client sent different values
      model: 'claude-sonnet-4-6',
      max_tokens: body.max_tokens || 1800,
    };

    const upstream = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify(payload),
    });

    const data = await upstream.json();

    if (!upstream.ok) {
      console.error('Anthropic API error:', upstream.status, data);
      return res.status(upstream.status).json({
        error: 'Evaluation service temporarily unavailable. Please try again.',
        details: data?.error?.message || 'Unknown error'
      });
    }

    return res.status(200).json(data);

  } catch (err) {
    console.error('Proxy error:', err);
    return res.status(500).json({
      error: 'Evaluation service error. Please try again or contact admissions@missionaviationacademy.org'
    });
  }
}
