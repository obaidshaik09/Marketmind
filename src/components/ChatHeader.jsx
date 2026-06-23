function ChatHeader() {
  return (
    <div id="chat-header">
      <div className="header-left">
        <div className="agent-avatar">🤖</div>
        <div>
          <div className="agent-name">MarketMind Agent</div>
          <div className="agent-status">
            <span className="status-dot" />
            AI agent · web-enabled
          </div>
        </div>
      </div>
      <div className="header-right">Marketing Expert</div>
    </div>
  );
}

export default ChatHeader;
