function SecurityBanner({ onDismiss }) {
  return (
    <div id="security-banner">
      <button type="button" className="security-banner-close" onClick={onDismiss} aria-label="Dismiss">
        ×
      </button>
      <div className="security-banner-title">Heads up — browser-only mode:</div>
      <ul className="security-banner-list">
        <li>
          Your API key is being used directly from this browser tab for the
          session — there&rsquo;s no backend hiding it. Anyone with access
          to this browser&rsquo;s dev tools while it&rsquo;s open could see
          it in network requests.
        </li>
      </ul>
      <div className="security-banner-footer">
        Don&rsquo;t use a key you wouldn&rsquo;t want exposed on a shared or
        public computer. See the <code>How It Works</code> page for details.
      </div>
    </div>
  );
}

export default SecurityBanner;
