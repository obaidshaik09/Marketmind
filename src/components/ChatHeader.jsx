function ChatHeader() {
  return (
    <div id="chat-header">
      <div className="header-left">
        <div className="agent-avatar">🤖</div>
        <div>
          <div className="agent-name">MarketMind AI</div>
          <div className="agent-status">
            <span className="status-dot" />
            Online &amp; ready
          </div>
        </div>
      </div>
      <div className="header-right">Marketing Expert</div>
    </div>
  );
}

export default ChatHeader;
