import { escapeForUserBubble, formatBotMessage } from '../utils/formatMessage';

function MessageBubble({ role, text }) {
  const isUser = role === 'user';
  const html = isUser ? escapeForUserBubble(text) : formatBotMessage(text);

  return (
    <div className={`msg ${isUser ? 'user' : 'bot'}`}>
      <div className="msg-avatar">{isUser ? '🙂' : '🤖'}</div>
      {/* eslint-disable-next-line react/no-danger */}
      <div className="bubble" dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  );
}

export default MessageBubble;
