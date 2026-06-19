import { useEffect, useRef, useState } from 'react';
import Sidebar from '../components/Sidebar';
import ChatHeader from '../components/ChatHeader';
import MessageBubble from '../components/MessageBubble';
import TypingIndicator from '../components/TypingIndicator';
import ChipsRow from '../components/ChipsRow';
import ChatInput from '../components/ChatInput';
import ServerErrorOverlay from '../components/ServerErrorOverlay';
import { TOPIC_CHIPS, WELCOME_MESSAGE } from '../data/topics';
import { sendChatMessage } from '../services/chatApi';

function ChatbotPage() {
  const [currentTopic, setCurrentTopic] = useState('general');
  const [messages, setMessages] = useState([
    { role: 'assistant', content: WELCOME_MESSAGE },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [busy, setBusy] = useState(false);
  const [connectionError, setConnectionError] = useState(null);

  const scrollRef = useRef(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, busy]);

  async function handleSend(overrideText) {
    if (busy) return;
    const text = (overrideText ?? inputValue).trim();
    if (!text) return;

    setInputValue('');

    const updatedHistory = [...messages, { role: 'user', content: text }];
    setMessages(updatedHistory);
    setBusy(true);

    try {
      const reply = await sendChatMessage(updatedHistory);
      setMessages((prev) => [...prev, { role: 'assistant', content: reply }]);
    } catch (err) {
      setConnectionError(err.message);
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: `⚠️ Sorry, I ran into an issue: ${err.message}`,
        },
      ]);
    } finally {
      setBusy(false);
    }
  }

  function handleTopicSelect(topicId) {
    setCurrentTopic(topicId);
  }

  function handleChipClick(chipText) {
    handleSend(chipText);
  }

  function handleRetry() {
    setConnectionError(null);
  }

  return (
    <div id="chatbot-page">
      {connectionError && (
        <ServerErrorOverlay message={connectionError} onRetry={handleRetry} />
      )}

      <Sidebar activeTopic={currentTopic} onTopicSelect={handleTopicSelect} />

      <div id="main">
        <ChatHeader />

        <div id="chat-scroll" ref={scrollRef}>
          {messages.map((msg, idx) => (
            <MessageBubble key={idx} role={msg.role} text={msg.content} />
          ))}
          {busy && <TypingIndicator />}
        </div>

        <ChipsRow
          chips={TOPIC_CHIPS[currentTopic] || TOPIC_CHIPS.general}
          onChipClick={handleChipClick}
        />

        <ChatInput
          value={inputValue}
          onChange={setInputValue}
          onSend={() => handleSend()}
          busy={busy}
          currentTopic={currentTopic}
        />
      </div>
    </div>
  );
}

export default ChatbotPage;
