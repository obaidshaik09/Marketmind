import { escapeForUserBubble, formatBotMessage } from '../utils/formatMessage';
import ToolCallBadge from './ToolCallBadge';

function MessageBubble({ role, text, steps }) {
  const isUser = role === 'user';
  const html = isUser ? escapeForUserBubble(text) : formatBotMessage(text);

  return (
    <div className={`msg ${isUser ? 'user' : 'bot'}`}>
      <div className="msg-avatar">{isUser ? '🙂' : '🤖'}</div>
      <div>
        {!isUser && <ToolCallBadge steps={steps} />}
        {/* eslint-disable-next-line react/no-danger */}
        <div className="bubble" dangerouslySetInnerHTML={{ __html: html }} />
      </div>
    </div>
  );
}

export default MessageBubble;
