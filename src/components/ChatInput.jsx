import { useRef } from 'react';
import { TOPIC_LABELS } from '../data/topics';

const MAX_TEXTAREA_HEIGHT = 110;

function ChatInput({ value, onChange, onSend, busy, currentTopic }) {
  const textareaRef = useRef(null);

  function handleInput(e) {
    onChange(e.target.value);
    const el = textareaRef.current;
    if (el) {
      el.style.height = 'auto';
      el.style.height = `${Math.min(el.scrollHeight, MAX_TEXTAREA_HEIGHT)}px`;
    }
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSend();
      if (textareaRef.current) textareaRef.current.style.height = 'auto';
    }
  }

  return (
    <div id="input-wrap">
      <div className="input-row">
        <textarea
          id="user-input"
          ref={textareaRef}
          placeholder="Ask about resumes, interviews, LinkedIn, job search…"
          rows={1}
          value={value}
          onChange={handleInput}
          onKeyDown={handleKeyDown}
        />
        <button
          id="send-btn"
          type="button"
          title="Send message"
          disabled={busy}
          onClick={() => {
            onSend();
            if (textareaRef.current) textareaRef.current.style.height = 'auto';
          }}
        >
          ➤
        </button>
      </div>
      <div className="input-footer">
        <span>Enter to send · Shift+Enter for new line</span>
        <span id="topic-indicator">{TOPIC_LABELS[currentTopic] || '📌 All Topics'}</span>
      </div>
    </div>
  );
}

export default ChatInput;
