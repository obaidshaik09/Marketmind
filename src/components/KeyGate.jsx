import { useState } from 'react';
import { Link } from 'react-router-dom';
import { validateApiKey } from '../agent/validateKey';
import { FEATURES, AUDIENCES } from '../data/topics';

function KeyGate({ onKeySubmit }) {
  const [keyInput, setKeyInput] = useState('');
  const [checking, setChecking] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    const trimmed = keyInput.trim();
    if (!trimmed) { setError('Please paste your Anthropic API key.'); return; }
    if (!trimmed.startsWith('sk-ant-')) {
      setError('Key should start with "sk-ant-".');
      return;
    }
    setChecking(true);
    setError('');
    const result = await validateApiKey(trimmed);
    setChecking(false);
    if (!result.valid) {
      setError(result.message || 'Invalid API key.');
      return;
    }
    onKeySubmit(trimmed);
  }

  return (
    <div className="landing-page">
      <div className="landing-grid-bg" aria-hidden="true" />
      <div className="landing-glow landing-glow-1" aria-hidden="true" />
      <div className="landing-glow landing-glow-2" aria-hidden="true" />

      <div className="landing-inner">
        <div className="landing-left">
          <div className="landing-brand">
            <div className="landing-logo">
              <span className="landing-logo-icon">MM</span>
            </div>
            <div>
              <div className="landing-brand-name">MarketMind</div>
              <div className="landing-brand-tag">US Career Coaching · AI Agent</div>
            </div>
          </div>

          <h1 className="landing-headline">
            Find your US job.<br />
            <span className="landing-gradient-text">Build. Practice. Land.</span>
          </h1>

          <p className="landing-desc">
            Resume builder, file uploads, interview prep, skill quizzes, and live
            web research — all in your browser with tool calling.
          </p>

          <div className="landing-audiences">
            {AUDIENCES.map((a) => (
              <span className="landing-audience" key={a}>{a}</span>
            ))}
          </div>

          <div className="landing-feature-grid">
            {FEATURES.map((f) => (
              <div className="landing-feature" key={f.title}>
                <span>{f.icon}</span>
                <div>
                  <strong>{f.title}</strong>
                  <span>{f.desc}</span>
                </div>
              </div>
            ))}
          </div>

          <Link to="/how-it-works" className="landing-learn-more">
            How it works →
          </Link>
        </div>

        <div className="landing-right">
          <div className="landing-card">
            <div className="landing-card-header">
              <span className="landing-status-dot" />
              <span>Connect to Claude</span>
            </div>
            <h2>Launch MarketMind</h2>
            <p>Paste your Anthropic API key. Stored in memory only for this session.</p>

            <form onSubmit={handleSubmit}>
              <label className="landing-label" htmlFor="api-key">Anthropic API Key</label>
              <input
                id="api-key"
                type="password"
                value={keyInput}
                onChange={(e) => setKeyInput(e.target.value)}
                placeholder="sk-ant-api03-..."
                className="landing-input"
                autoComplete="off"
                spellCheck="false"
              />
              {error && <div className="landing-error">{error}</div>}
              <button className="landing-submit" type="submit" disabled={checking}>
                {checking ? 'Validating…' : 'Enter Career Coach →'}
              </button>
            </form>

            <p className="landing-footnote">
              Get a key at <code>console.anthropic.com</code>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default KeyGate;
