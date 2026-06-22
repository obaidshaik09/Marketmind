import { useEffect, useRef, useState } from 'react';
import Sidebar from '../components/Sidebar';
import ChatHeader from '../components/ChatHeader';
import MessageBubble from '../components/MessageBubble';
import TypingIndicator from '../components/TypingIndicator';
import ChipsRow from '../components/ChipsRow';
import ChatInput from '../components/ChatInput';
import ServerErrorOverlay from '../components/ServerErrorOverlay';
import SetupBanner from '../components/SetupBanner';
import { TOPIC_CHIPS, WELCOME_MESSAGE } from '../data/topics';
import { sendChatMessage, checkHealth } from '../services/chatApi';

function ChatbotPage() {
  const [currentTopic, setCurrentTopic] = useState('general');
  const [messages, setMessages] = useState([
    { role: 'assistant', content: WELCOME_MESSAGE, steps: [] },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [busy, setBusy] = useState(false);
  const [connectionError, setConnectionError] = useState(null);
  const [webSearchConfigured, setWebSearchConfigured] = useState(true);
  const [bannerDismissed, setBannerDismissed] = useState(false);

  const scrollRef = useRef(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, busy]);

  useEffect(() => {
    checkHealth().then((health) => {
      setWebSearchConfigured(Boolean(health.webSearchConfigured));
    });
  }, []);

  async function handleSend(overrideText) {
    if (busy) return;
    const text = (overrideText ?? inputValue).trim();
    if (!text) return;

    setInputValue('');

    const updatedHistory = [...messages, { role: 'user', content: text }];
    setMessages(updatedHistory);
    setBusy(true);

    try {
      const { text: reply, steps } = await sendChatMessage(updatedHistory);
      setMessages((prev) => [...prev, { role: 'assistant', content: reply, steps }]);
    } catch (err) {
      setConnectionError(err.message);
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: `⚠️ Sorry, I ran into an issue: ${err.message}`,
          steps: [],
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

        {!bannerDismissed && (
          <SetupBanner
            webSearchConfigured={webSearchConfigured}
            onDismiss={() => setBannerDismissed(true)}
          />
        )}

        <div id="chat-scroll" ref={scrollRef}>
          {messages.map((msg, idx) => (
            <MessageBubble key={idx} role={msg.role} text={msg.content} steps={msg.steps} />
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
