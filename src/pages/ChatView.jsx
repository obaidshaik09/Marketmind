import { useEffect, useRef, useState } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import MessageBubble from '../components/MessageBubble';
import TypingIndicator from '../components/TypingIndicator';
import ChatInput from '../components/ChatInput';
import KeyGate from '../components/KeyGate';
import WelcomePanel from '../components/WelcomePanel';
import { sendChatMessage } from '../agent/runAgent';
import { readAttachment } from '../utils/readAttachment';

function ChatView() {
  const [apiKey, setApiKey] = useState(null);
  const [currentTopic, setCurrentTopic] = useState('general');
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [busy, setBusy] = useState(false);
  const [pendingAttachment, setPendingAttachment] = useState(null);
  const [attachError, setAttachError] = useState('');
  const scrollRef = useRef(null);

  const showWelcome = messages.length === 0;

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, busy]);

  async function handleAttach(file) {
    setAttachError('');
    try {
      const data = await readAttachment(file);
      setPendingAttachment(data);
    } catch (err) {
      setAttachError(err.message);
      setPendingAttachment(null);
    }
  }

  async function handleSend(overrideText) {
    if (busy) return;
    const text = (overrideText ?? inputValue).trim();
    if (!text && !pendingAttachment) return;

    setInputValue('');
    setAttachError('');

    let content = text;
    if (pendingAttachment) {
      const prefix = text ? `${text}\n\n` : '';
      content = `${prefix}[Attached: ${pendingAttachment.fileName}]\n${pendingAttachment.text}`;
    }

    const userMsg = {
      role: 'user',
      content,
      attachment: pendingAttachment
        ? { fileName: pendingAttachment.fileName, fileType: pendingAttachment.fileType }
        : null,
    };

    const updatedHistory = [...messages, userMsg];
    setMessages(updatedHistory);
    setPendingAttachment(null);
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
    return <KeyGate onKeySubmit={setApiKey} />;
  }

  return (
    <div id="chatbot-page">
      <Sidebar activeTopic={currentTopic} onTopicSelect={setCurrentTopic} />

      <div id="main">
        <Header />

        <div id="chat-scroll" ref={scrollRef}>
          {showWelcome && (
            <WelcomePanel topicId={currentTopic} onPromptSelect={handleSend} />
          )}
          {messages.map((msg, idx) => (
            <MessageBubble
              key={idx}
              role={msg.role}
              text={msg.content}
              steps={msg.steps}
              attachment={msg.attachment}
            />
          ))}
          {busy && <TypingIndicator />}
        </div>

        <ChatInput
          value={inputValue}
          onChange={setInputValue}
          onSend={handleSend}
          busy={busy}
          currentTopic={currentTopic}
          attachment={pendingAttachment}
          onAttach={handleAttach}
          onRemoveAttachment={() => { setPendingAttachment(null); setAttachError(''); }}
          attachError={attachError}
        />
      </div>
    </div>
  );
}

export default ChatView;
