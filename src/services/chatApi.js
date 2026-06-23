// src/services/chatApi.js
//
// Calls the Anthropic Messages API directly from the browser — no backend.
//
// HOW THE API KEY IS HANDLED:
// The key is typed into the in-app setup screen and kept only in React
// state (in memory) for the current browser tab. It is never written to
// disk, never sent to any server other than Anthropic's own API, and
// disappears the moment the tab is closed or refreshed.
//
// SECURITY NOTE: calling a provider's API directly from client-side code
// necessarily exposes the key to anyone who opens browser dev tools during
// the session (e.g. via the Network tab). This is a deliberate simplicity
// tradeoff for this version of the app — see the "How It Works" page for
// the full explanation and how it differs from a backend-proxy approach.
//
// Anthropic requires an explicit opt-in header to allow direct
// browser-to-API calls at all (CORS is blocked by default), which is why
// you'll see "anthropic-dangerous-direct-browser-access" below — the name
// is intentionally alarming so this pattern is never used by accident.

import { getToolDefinitions, runTool } from './tools';

const MODEL = 'claude-sonnet-4-6';
const MAX_AGENT_STEPS = 6;

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

You have access to tools: web_search, calculator, and fetch_url. Use them whenever they would make your answer more accurate or current.

Your communication style:
- Warm, professional, and practical — give actionable advice, not just theory
- Use simple language; avoid unnecessary jargon
- Structure complex answers with clear sections, bullet points when helpful
- Be encouraging — marketing can feel overwhelming, make it feel accessible

Always be helpful, accurate, and focused on delivering real marketing value.`;

async function callClaude(apiKey, messages) {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
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
    throw err;
  }
  return data;
}

// Runs the full client-side agent loop:
// 1. Send conversation + tool definitions to Claude.
// 2. If Claude asks to use a tool, run it right here in the browser and
//    feed the result back.
// 3. Repeat until Claude gives a final text answer or the step cap is hit.
export async function sendChatMessage(apiKey, messages) {
  if (!apiKey) {
    throw new Error('No API key provided. Enter your Anthropic API key to start chatting.');
  }

  const conversation = messages.map((m) => ({ role: m.role, content: m.content }));
  const steps = [];

  for (let i = 0; i < MAX_AGENT_STEPS; i += 1) {
    const data = await callClaude(apiKey, conversation);

    if (data.stop_reason !== 'tool_use') {
      const text = data.content.map((block) => block.text || '').join('');
      return { text, steps };
    }

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

  return {
    text: "I used several tools but couldn't reach a final answer in time. Could you rephrase or simplify your question?",
    steps,
  };
}

// Quick validation call used by the setup screen to confirm a key works
// before starting the chat session.
export async function validateApiKey(apiKey) {
  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true',
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 1,
        messages: [{ role: 'user', content: 'hi' }],
      }),
    });

    if (response.ok) return { valid: true };

    const data = await response.json();
    return { valid: false, message: (data.error && data.error.message) || 'Invalid API key.' };
  } catch (err) {
    return { valid: false, message: err.message };
  }
}
