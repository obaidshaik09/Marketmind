import { useEffect, useRef, useState } from 'react';
import Sidebar from '../components/Sidebar';
import ChatHeader from '../components/ChatHeader';
import MessageBubble from '../components/MessageBubble';
import TypingIndicator from '../components/TypingIndicator';
import ChipsRow from '../components/ChipsRow';
import ChatInput from '../components/ChatInput';
import ApiKeySetup from '../components/ApiKeySetup';
import WelcomePanel from '../components/WelcomePanel';
import { TOPIC_CHIPS } from '../data/topics';
import { sendChatMessage } from '../services/chatApi';

function ChatbotPage() {
  const [apiKey, setApiKey] = useState(null);
  const [currentTopic, setCurrentTopic] = useState('general');
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [busy, setBusy] = useState(false);
  const scrollRef = useRef(null);

  const showWelcome = messages.length === 0;

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
      const { text: reply, steps } = await sendChatMessage(apiKey, updatedHistory);
      setMessages((prev) => [...prev, { role: 'assistant', content: reply, steps }]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: `Sorry, I ran into an issue: ${err.message}`, steps: [] },
      ]);
    } finally {
      setBusy(false);
    }
  }

  if (!apiKey) {
    return <ApiKeySetup onKeySubmit={setApiKey} />;
  }

  return (
    <div id="chatbot-page">
      <Sidebar activeTopic={currentTopic} onTopicSelect={setCurrentTopic} />

      <div id="main">
        <ChatHeader />

        <div id="chat-scroll" ref={scrollRef}>
          {showWelcome && <WelcomePanel />}
          {messages.map((msg, idx) => (
            <MessageBubble key={idx} role={msg.role} text={msg.content} steps={msg.steps} />
          ))}
          {busy && <TypingIndicator />}
        </div>

        <ChipsRow
          chips={TOPIC_CHIPS[currentTopic] || TOPIC_CHIPS.general}
          onChipClick={handleSend}
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
