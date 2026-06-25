function Header() {
  return (
    <div id="chat-header">
      <div className="header-left">
        <div className="agent-avatar">MM</div>
        <div>
          <div className="agent-name">MarketMind Agent</div>
          <div className="agent-status">
            <span className="status-dot" />
            AI Agent · Tools enabled
          </div>
        </div>
      </div>
      <div className="header-tools">
        <span className="tool-pill">get_relevant_information</span>
        <span className="tool-pill">web_search</span>
      </div>
    </div>
  );
}

export default Header;
