function ServerErrorOverlay({ message, onRetry }) {
  return (
    <div id="setup-overlay">
      <div className="setup-card">
        <div className="setup-logo">
          <div className="icon">🌉</div>
          <div className="name">MarketMind</div>
        </div>
        <h2>Can&rsquo;t reach the assistant</h2>
        <p>
          MarketMind talks to Claude through a small backend server that
          keeps your API key safe. That server doesn&rsquo;t seem to be
          reachable right now.
        </p>
        <div id="err-msg">{message}</div>
        <button id="retry-btn" type="button" onClick={onRetry}>
          Try Again →
        </button>
        <p className="setup-disclaimer">
          Make sure <code>server/.env</code> has a valid{' '}
          <code>ANTHROPIC_API_KEY</code> and that the server is running
          (<code>npm run server</code> or <code>npm run dev</code>).
        </p>
      </div>
    </div>
  );
}

export default ServerErrorOverlay;
