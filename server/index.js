// server/index.js
//
// Express backend for the MarketMind AGENT.
//
// WHY THIS EXISTS:
// React apps are static front-end bundles — anything placed in a
// REACT_APP_* environment variable gets baked directly into the JS
// bundle that ships to every visitor's browser. That means it is NOT
// safe to put a real Anthropic API key (or SerpAPI key) in the React
// app itself.
//
// This server keeps ANTHROPIC_API_KEY and SERPAPI_API_KEY in server/.env,
// reads them only on the server, and runs the full "agent loop": it sends
// the conversation + tool definitions to Claude, and if Claude asks to use
// a tool, the server executes that tool itself and sends the result back
// to Claude — repeating until Claude has a final answer for the user.
// The browser never sees any API key and never executes a tool directly.

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { getToolDefinitions, runTool, SERPAPI_KEY } = require('./tools');

const app = express();
const PORT = process.env.PORT || 5000;
const API_KEY = process.env.ANTHROPIC_API_KEY;
const MODEL = 'claude-sonnet-4-6';
const MAX_AGENT_STEPS = 6; // safety cap so a tool-call loop can't run forever

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

You have access to tools: web_search, calculator, and fetch_url. Use them whenever they would make your answer more accurate or current — for example, search the web for recent statistics or trends, use the calculator for any arithmetic (ROAS, CAC, percentages, budget splits), and fetch_url when the user shares a link to analyze.

Your communication style:
- Warm, professional, and practical — give actionable advice, not just theory
- Use simple language; avoid unnecessary jargon
- Structure complex answers with clear sections, bullet points when helpful
- Ask clarifying questions when needed to give better answers
- Be encouraging — marketing can feel overwhelming, make it feel accessible

Always be helpful, accurate, and focused on delivering real marketing value.`;

// Health check — also reports which optional tools are configured.
app.get('/api/health', (req, res) => {
  res.json({
    ok: true,
    keyConfigured: Boolean(API_KEY),
    webSearchConfigured: Boolean(SERPAPI_KEY),
  });
});

async function callClaude(messages) {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': API_KEY,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 1500,
      system: SYSTEM_PROMPT,
      messages,
      tools: getToolDefinitions(),
    }),
  });

  const data = await response.json();
  if (!response.ok) {
    const message = (data.error && data.error.message) || 'Anthropic API request failed.';
    const err = new Error(message);
    err.status = response.status;
    err.data = data;
    throw err;
  }
  return data;
}

// Chat endpoint — runs the full agent loop:
// 1. Send conversation + tool definitions to Claude.
// 2. If Claude's reply contains tool_use blocks, execute each tool here
//    on the server and append the results as a "tool_result" message.
// 3. Send the updated conversation back to Claude.
// 4. Repeat until Claude responds with no further tool calls (stop_reason
//    !== "tool_use"), or until MAX_AGENT_STEPS is reached.
//
// The response sent to the frontend includes a `steps` array describing
// each tool call made along the way, so the UI can show "🔍 Searching the
// web for…" style status updates.
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

  // Work on a local copy so we can append assistant/tool turns as the
  // agent loop progresses, without mutating the caller's array.
  const conversation = messages.map((m) => ({ role: m.role, content: m.content }));
  const steps = [];

  try {
    for (let i = 0; i < MAX_AGENT_STEPS; i += 1) {
      const data = await callClaude(conversation);

      if (data.stop_reason !== 'tool_use') {
        // Final answer — no more tools requested.
        return res.json({ content: data.content, steps });
      }

      // Claude wants to use one or more tools. Record the assistant turn
      // (which includes the tool_use blocks) and execute each tool call.
      conversation.push({ role: 'assistant', content: data.content });

      const toolUseBlocks = data.content.filter((block) => block.type === 'tool_use');
      const toolResultBlocks = [];

      for (const block of toolUseBlocks) {
        steps.push({ tool: block.name, input: block.input });
        const result = await runTool(block.name, block.input);
        toolResultBlocks.push({
          type: 'tool_result',
          tool_use_id: block.id,
          content: result,
        });
      }

      conversation.push({ role: 'user', content: toolResultBlocks });
    }

    // Hit the safety cap — return whatever the last step said, with a note.
    return res.json({
      content: [
        {
          type: 'text',
          text: "I used several tools but couldn't reach a final answer in time. Could you rephrase or simplify your question?",
        },
      ],
      steps,
    });
  } catch (err) {
    console.error('Error in agent loop:', err);
    const status = err.status || 502;
    res.status(status).json({ error: { message: err.message || 'Could not reach the Anthropic API. Please try again.' } });
  }
});

// Proxy endpoints — browser calls these for web_search & fetch_url (avoids CORS)
app.post('/api/tools/web-search', async (req, res) => {
  const { query } = req.body;
  if (!query) return res.status(400).json({ error: 'query required' });
  const result = await runTool('web_search', { query });
  res.json({ result });
});

app.post('/api/tools/fetch-url', async (req, res) => {
  const { url } = req.body;
  if (!url) return res.status(400).json({ error: 'url required' });
  const result = await runTool('fetch_url', { url });
  res.json({ result });
});

app.listen(PORT, () => {
  console.log(`MarketMind agent server running on http://localhost:${PORT}`);
  if (!API_KEY) {
    console.warn('⚠️  ANTHROPIC_API_KEY is not set. Copy server/.env.example to server/.env and add your key.');
  }
  if (!SERPAPI_KEY) {
    console.warn('⚠️  SERPAPI_API_KEY is not set — web_search tool will be disabled until you add it.');
  }
});
