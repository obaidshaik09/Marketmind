function SetupBanner({ webSearchConfigured, onDismiss }) {
  if (webSearchConfigured) return null;

  return (
    <div id="setup-banner">
      <button type="button" className="setup-banner-close" onClick={onDismiss} aria-label="Dismiss">
        ×
      </button>
      <div className="setup-banner-title">Optional setup for web search:</div>
      <ul className="setup-banner-list">
        <li>
          Add <code>REACT_APP_SERPAPI_API_KEY</code> to <code>.env</code> to enable
          live salary and job market searches (free tier at serpapi.com).
        </li>
      </ul>
      <div className="setup-banner-footer">
        Copy <code>.env.example</code> to <code>.env</code>, add your key, then restart with{' '}
        <code>npm start</code>.
      </div>
    </div>
  );
}

export default SetupBanner;
