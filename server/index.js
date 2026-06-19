// server/index.js
//
// Minimal Express proxy for the MarketMind chatbot.
//
// WHY THIS EXISTS:
// React apps are static front-end bundles — anything placed in a
// REACT_APP_* environment variable gets baked directly into the JS
// bundle that ships to every visitor's browser. That means it is NOT
// safe to put a real Anthropic API key in the React app itself.
//
// This tiny server keeps your ANTHROPIC_API_KEY in server/.env,
// reads it only on the server, and forwards chat requests to the
// Anthropic API on the frontend's behalf. The browser never sees the key.

require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;
const API_KEY = process.env.ANTHROPIC_API_KEY;

app.use(cors());
app.use(express.json({ limit: '1mb' }));

const SYSTEM_PROMPT = `You are MarketMind, a knowledgeable and friendly AI marketing assistant specializing in marketing profiles and strategy. You help businesses, entrepreneurs, marketers, and students with all aspects of marketing.

Your expertise covers:
- **Audience Profiles & Buyer Personas**: Creating detailed ICP (Ideal Customer Profiles), demographic and psychographic profiling, segmentation strategies
- **Campaign Strategy**: Planning, execution, budgeting, multi-channel campaigns, A/B testing
- **Branding**: Brand positioning, voice & tone, visual identity guidance, brand storytelling
- **Social Media Marketing**: Platform strategies (Instagram, LinkedIn, TikTok, Facebook, X/Twitter), content calendars, engagement tactics
- **Analytics & Metrics**: KPIs, conversion rates, ROAS, CAC, LTV, interpreting marketing data
- **Content & Copywriting**: Headlines, ad copy, email campaigns, landing page copy, value propositions
- **SEO & Growth**: Keyword strategy, organic growth, funnel optimization, lead generation
- **Email Marketing**: Drip campaigns, segmentation, open rate optimization

Your communication style:
- Warm, professional, and practical — give actionable advice, not just theory
- Use simple language; avoid unnecessary jargon
- Structure complex answers with clear sections, bullet points when helpful
- Ask clarifying questions when needed to give better answers
- Offer concrete examples and frameworks (like AIDA, Jobs-to-be-Done, etc.)
- Be encouraging — marketing can feel overwhelming, make it feel accessible

Always be helpful, accurate, and focused on delivering real marketing value.`;

// Health check
app.get('/api/health', (req, res) => {
  res.json({ ok: true, keyConfigured: Boolean(API_KEY) });
});

// Chat endpoint — receives conversation history from the frontend,
// attaches the system prompt, and forwards to Anthropic using the
// server-side key.
app.post('/api/chat', async (req, res) => {
  if (!API_KEY) {
    return res.status(500).json({
      error: {
        message:
          'Server is missing ANTHROPIC_API_KEY. Add it to server/.env and restart the server.',
      },
    });
  }

  const { messages } = req.body;
  if (!Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: { message: 'Request must include a non-empty "messages" array.' } });
  }

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 1000,
        system: SYSTEM_PROMPT,
        messages,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json(data);
    }

    res.json(data);
  } catch (err) {
    console.error('Error calling Anthropic API:', err);
    res.status(502).json({ error: { message: 'Could not reach the Anthropic API. Please try again.' } });
  }
});

app.listen(PORT, () => {
  console.log(`MarketMind proxy server running on http://localhost:${PORT}`);
  if (!API_KEY) {
    console.warn('⚠️  ANTHROPIC_API_KEY is not set. Copy server/.env.example to server/.env and add your key.');
  }
});
