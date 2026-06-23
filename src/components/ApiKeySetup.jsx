import { useState } from 'react';
import { validateApiKey } from '../services/chatApi';

function ApiKeySetup({ onKeySubmit }) {
  const [keyInput, setKeyInput] = useState('');
  const [checking, setChecking] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    const trimmed = keyInput.trim();

    if (!trimmed) {
      setError('Please paste your Anthropic API key to continue.');
      return;
    }
    if (!trimmed.startsWith('sk-ant-')) {
      setError('That doesn\u2019t look like an Anthropic key — it should start with "sk-ant-".');
      return;
    }

    setChecking(true);
    setError('');

    const result = await validateApiKey(trimmed);
    setChecking(false);

    if (!result.valid) {
      setError(result.message || 'Could not validate this key. Please check it and try again.');
      return;
    }

    onKeySubmit(trimmed);
  }

  return (
    <div id="setup-overlay">
      <div className="setup-card">
        <div className="setup-logo">
          <div className="icon">📊</div>
          <div className="name">MarketMind</div>
        </div>
        <h2>Enter your API key to start</h2>
        <p>
          MarketMind talks to Claude directly from your browser for this
          session — there&rsquo;s no backend server involved. Your key is
          kept only in memory and is never saved to disk or sent anywhere
          except Anthropic&rsquo;s API.
        </p>

        <div className="caps">
          <span className="cap">Audience profiles</span>
          <span className="cap">Campaigns</span>
          <span className="cap">Branding</span>
          <span className="cap">Analytics</span>
          <span className="cap">Tool calling</span>
        </div>

        <form onSubmit={handleSubmit}>
          <input
            type="password"
            value={keyInput}
            onChange={(e) => setKeyInput(e.target.value)}
            placeholder="sk-ant-..."
            className="setup-key-input"
            autoComplete="off"
            spellCheck="false"
          />
          <div id="err-msg">{error}</div>
          <button id="retry-btn" type="submit" disabled={checking}>
            {checking ? 'Checking…' : 'Start Chatting →'}
          </button>
        </form>

        <p className="setup-disclaimer">
          Don&rsquo;t have a key? Get one at{' '}
          <code>console.anthropic.com</code>. Your key disappears when you
          close or refresh this tab — you&rsquo;ll need to re-enter it next
          time.
        </p>
      </div>
    </div>
  );
}

export default ApiKeySetup;
