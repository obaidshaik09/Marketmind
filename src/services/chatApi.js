// src/services/chatApi.js
//
// The frontend never talks to Anthropic directly and never holds an API key.
// It calls our own backend (server/index.js), which attaches the real
// ANTHROPIC_API_KEY (read from server/.env) and forwards the request.
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

  return data.content.map((block) => block.text || '').join('');
}
