import { useEffect, useState } from 'react';
import { isServerAvailable } from '../services/tools';

function ChatHeader() {
  const [serverOn, setServerOn] = useState(false);

  useEffect(() => {
    isServerAvailable().then(setServerOn);
  }, []);

  return (
    <div id="chat-header">
      <div className="header-left">
        <div className="agent-avatar">MM</div>
        <div>
          <div className="agent-name">MarketMind Agent</div>
          <div className="agent-status">
            <span className="status-dot" />
            {serverOn ? 'Server on · Web Search & Fetch ready' : 'Start server for web search & fetch'}
          </div>
        </div>
      </div>
      <div className="header-tools">
        <span className="tool-pill">build_resume</span>
        <span className="tool-pill">skill_up</span>
        <span className="tool-pill">web_search</span>
      </div>
    </div>
  );
}

export default ChatHeader;
