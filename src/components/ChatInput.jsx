import { useRef, useState } from 'react';
import { TOPIC_LABELS, getQuickPrompts } from '../data/topics';

const MAX_TEXTAREA_HEIGHT = 110;

function ChatInput({
  value,
  onChange,
  onSend,
  busy,
  currentTopic,
  attachment,
  onAttach,
  onRemoveAttachment,
  attachError,
}) {
  const textareaRef = useRef(null);
  const fileRef = useRef(null);
  const [showSuggestions, setShowSuggestions] = useState(false);

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

  async function handleFileChange(e) {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (file && onAttach) await onAttach(file);
  }

  const quickPrompts = getQuickPrompts(currentTopic);

  return (
    <div id="input-wrap">
      {showSuggestions && (
        <div className="suggestions-popover">
          <div className="suggestions-popover-title">Quick prompts</div>
          {quickPrompts.map((item) => (
            <button
              key={item.title}
              type="button"
              className="suggestions-popover-item"
              onClick={() => {
                onSend(item.prompt);
                setShowSuggestions(false);
              }}
            >
              <strong>{item.title}</strong>
              <span>{item.subtitle}</span>
            </button>
          ))}
        </div>
      )}

      {attachment && (
        <div className="attachment-chip">
          <span className="attachment-chip-icon">📎</span>
          <span className="attachment-chip-name">{attachment.fileName}</span>
          <button type="button" className="attachment-chip-remove" onClick={onRemoveAttachment} aria-label="Remove file">
            ×
          </button>
        </div>
      )}

      {attachError && <div className="attach-error">{attachError}</div>}

      <div className="input-row">
        <button
          type="button"
          className="attach-btn"
          title="Attach resume (.txt, .pdf, .docx)"
          disabled={busy}
          onClick={() => fileRef.current?.click()}
        >
          📎
        </button>
        <input
          ref={fileRef}
          type="file"
          accept=".txt,.pdf,.docx,text/plain,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          hidden
          onChange={handleFileChange}
        />
        <textarea
          id="user-input"
          ref={textareaRef}
          placeholder="Ask anything, or attach your resume…"
          rows={1}
          value={value}
          onChange={handleInput}
          onKeyDown={handleKeyDown}
        />
        <button
          type="button"
          className="ideas-btn"
          title="Quick prompts"
          disabled={busy}
          onClick={() => setShowSuggestions((v) => !v)}
        >
          💡
        </button>
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
        <span>Enter to send · Shift+Enter for new line · Attach resume files</span>
        <span id="topic-indicator">{TOPIC_LABELS[currentTopic] || '🚀 Getting Started'}</span>
      </div>
    </div>
  );
}

export default ChatInput;
