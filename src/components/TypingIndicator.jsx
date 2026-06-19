function TypingIndicator() {
  return (
    <div className="msg bot">
      <div className="msg-avatar">🤖</div>
      <div className="bubble typing-bubble">
        <div className="dot" />
        <div className="dot" />
        <div className="dot" />
      </div>
    </div>
  );
}

export default TypingIndicator;
