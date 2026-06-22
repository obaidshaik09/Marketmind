function SetupBanner({ webSearchConfigured, onDismiss }) {
  if (webSearchConfigured) return null;

  return (
    <div id="setup-banner">
      <button type="button" className="setup-banner-close" onClick={onDismiss} aria-label="Dismiss">
        ×
      </button>
      <div className="setup-banner-title">Setup needed:</div>
      <ul className="setup-banner-list">
        <li>
          Add <code>SERPAPI_API_KEY</code> to <code>server/.env</code> for web search (free
          tier at serpapi.com).
        </li>
      </ul>
      <div className="setup-banner-footer">
        Edit <code>server/.env</code>, then restart with <code>npm run dev</code>.
      </div>
    </div>
  );
}

export default SetupBanner;
