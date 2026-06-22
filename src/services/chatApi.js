// src/services/chatApi.js
//
// The frontend never talks to Anthropic (or SerpAPI) directly and never
// holds an API key. It calls our own backend (server/index.js), which
// attaches the real keys (read from server/.env) and runs the agent loop —
// including any tool calls — before returning a final text answer plus a
// list of which tools were used along the way.
//
// REACT_APP_API_BASE_URL lets you point the frontend at a different backend
// host (e.g. when deploying frontend and backend separately). It defaults to
// a relative path, which works automatically with the CRA "proxy" setting
// during local development.

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || '';

export async function sendChatMessage(messages) {
  const response = await fetch(`${API_BASE_URL}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages }),
  });

  const data = await response.json();

  if (!response.ok || data.error) {
    const message =
      (data.error && data.error.message) || 'Unknown error. Please check the server configuration.';
    throw new Error(message);
  }

  const text = data.content.map((block) => block.text || '').join('');
  const steps = data.steps || [];
  return { text, steps };
}

// Used by the setup banner to check whether the server has the API keys
// it needs. webSearchConfigured tells us whether the web_search tool will
// actually work, or just return a "not configured" message.
export async function checkHealth() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/health`);
    if (!response.ok) return { ok: false };
    return await response.json();
  } catch {
    return { ok: false };
  }
}
