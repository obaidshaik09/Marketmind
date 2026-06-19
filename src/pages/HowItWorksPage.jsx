import { useNavigate } from 'react-router-dom';
import { TOPICS } from '../data/topics';

const STEPS = [
  {
    title: 'Pick a topic (optional)',
    body:
      'Use the sidebar to focus the conversation on a specific area like audience profiles, campaigns, branding, social media, analytics, content, or SEO. This updates the suggested questions shown above the message box.',
  },
  {
    title: 'Ask a question or tap a suggestion',
    body:
      'Type any marketing question in plain language, or tap one of the suggested-question chips to get started instantly. Press Enter to send, or Shift+Enter for a new line.',
  },
  {
    title: 'Get a structured, practical answer',
    body:
      'MarketMind responds with clear, actionable guidance — using headings, bold text, and bullet lists where helpful — and can ask clarifying questions to tailor its advice to your situation.',
  },
  {
    title: 'Keep the conversation going',
    body:
      'Every message builds on the conversation so far, so you can dig deeper, ask follow-ups, or switch topics at any point without losing context.',
  },
];

function HowItWorksPage() {
  const navigate = useNavigate();

  return (
    <div id="how-it-works-page">
      <div className="hiw-container">
        <div className="hiw-header">
          <div className="hiw-eyebrow">How It Works</div>
          <h1>Your AI marketing strategist, on demand</h1>
          <p>
            MarketMind is an AI assistant focused entirely on marketing —
            audience profiles, campaigns, branding, social media, analytics,
            content, and SEO. Here&rsquo;s how a conversation works, end to
            end.
          </p>
        </div>

        <div className="hiw-steps">
          {STEPS.map((step, idx) => (
            <div className="hiw-step" key={step.title}>
              <div className="hiw-step-num">{idx + 1}</div>
              <div className="hiw-step-body">
                <h3>{step.title}</h3>
                <p>{step.body}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="hiw-section">
          <h2>📚 Topics MarketMind covers</h2>
          <div className="hiw-topic-grid">
            {TOPICS.map((topic) => (
              <div className="hiw-topic-pill" key={topic.id}>
                <span>{topic.icon}</span>
                <span>{topic.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="hiw-section">
          <h2>🔒 How your data is handled</h2>
          <div className="hiw-faq">
            <div className="hiw-faq-item">
              <h4>Where does my message go?</h4>
              <p>
                Your messages are sent to MarketMind&rsquo;s own backend
                server, which forwards them to Claude (Anthropic&rsquo;s AI
                model) to generate a reply. The conversation is kept in your
                browser for the current session only.
              </p>
            </div>
            <div className="hiw-faq-item">
              <h4>Is the API key exposed to my browser?</h4>
              <p>
                No. The API key lives only in the backend server&rsquo;s
                environment variables and is never sent to or stored in the
                browser, so it can&rsquo;t be seen in the page source or
                network responses.
              </p>
            </div>
            <div className="hiw-faq-item">
              <h4>Does MarketMind remember past sessions?</h4>
              <p>
                No. Refreshing the page or closing the tab clears the
                conversation. Each session starts fresh with the welcome
                message.
              </p>
            </div>
          </div>
        </div>

        <div className="hiw-cta">
          <button
            type="button"
            className="hiw-cta-btn"
            onClick={() => navigate('/')}
          >
            Start chatting →
          </button>
        </div>
      </div>
    </div>
  );
}

export default HowItWorksPage;
