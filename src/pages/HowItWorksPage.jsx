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
    title: 'The agent decides whether it needs a tool',
    body:
      'Behind the scenes, Claude reads your question and decides whether it can answer directly, or whether it needs to search the web, do a calculation, or read a web page first. You\u2019ll see a small badge above the reply whenever a tool was used.',
  },
  {
    title: 'Get a structured, practical answer',
    body:
      'MarketMind responds with clear, actionable guidance — using headings, bold text, and bullet lists where helpful — grounded in any tool results it gathered along the way.',
  },
];

const AGENT_TOOLS = [
  {
    icon: '🔍',
    name: 'web_search',
    body: 'Searches the live web (via SerpAPI) for current marketing stats, trends, or news the model wasn\u2019t trained on.',
  },
  {
    icon: '🧮',
    name: 'calculator',
    body: 'Evaluates math expressions precisely — handy for ROAS, CAC, conversion rates, or budget splits.',
  },
  {
    icon: '🌐',
    name: 'fetch_url',
    body: 'Reads the text content of a web page you link, so the agent can summarize or analyze it.',
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
            MarketMind is an AI <strong>agent</strong> focused entirely on
            marketing — audience profiles, campaigns, branding, social
            media, analytics, content, and SEO — with the ability to use
            tools like web search to back up its answers with current
            information. Here&rsquo;s how it all works, end to end.
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

        {/* ── WHAT IS TOOL CALLING ── */}
        <div className="hiw-section">
          <h2>🛠️ What is tool calling?</h2>
          <p className="hiw-section-intro">
            On its own, a language model like Claude can only generate
            text. It can&rsquo;t look anything up, run code, or check
            today&rsquo;s news — it just predicts the next words based on
            what it learned during training. <strong>Tool calling</strong>{' '}
            (also called <strong>function calling</strong>) is what lets it
            go further: the model can ask the application it&rsquo;s
            running in to perform an action on its behalf, then use the
            result to write a better answer.
          </p>

          <div className="hiw-flow">
            <div className="hiw-flow-step">
              <span className="hiw-flow-num">1</span>
              <span>
                The app tells Claude which tools exist, with a name,
                description, and the inputs each one expects.
              </span>
            </div>
            <div className="hiw-flow-step">
              <span className="hiw-flow-num">2</span>
              <span>
                Claude decides, based on your question, whether it needs a
                tool — and if so, which one and with what input.
              </span>
            </div>
            <div className="hiw-flow-step">
              <span className="hiw-flow-num">3</span>
              <span>
                Claude doesn&rsquo;t run the tool itself — it sends back a
                structured request. The server (never the browser, and
                never Claude directly) actually executes it.
              </span>
            </div>
            <div className="hiw-flow-step">
              <span className="hiw-flow-num">4</span>
              <span>
                The tool&rsquo;s result is sent back to Claude as part of
                the conversation, and Claude uses it to write a normal text
                reply — or to decide it needs to call another tool first.
              </span>
            </div>
          </div>

          <p className="hiw-section-intro">
            This request-execute-respond cycle can repeat several times in
            a single turn. An AI that can do this — decide when to use
            tools, call them, and weave the results into its reasoning —
            is usually what people mean by an <strong>AI agent</strong>,
            as opposed to a plain chatbot that only ever produces text.
          </p>
        </div>

        {/* ── TOOLS AVAILABLE ── */}
        <div className="hiw-section">
          <h2>🧰 Tools MarketMind can use</h2>
          <div className="hiw-tools-grid">
            {AGENT_TOOLS.map((tool) => (
              <div className="hiw-tool-card" key={tool.name}>
                <div className="hiw-tool-icon">{tool.icon}</div>
                <div>
                  <code className="hiw-tool-name">{tool.name}</code>
                  <p>{tool.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── MESSAGES API VS TOOLS API ── */}
        <div className="hiw-section">
          <h2>📨 Messages API vs. tool calling</h2>
          <p className="hiw-section-intro">
            Both go through the same Anthropic <strong>Messages API</strong>{' '}
            endpoint — tool calling isn&rsquo;t a separate API, it&rsquo;s an
            optional capability you add to a normal request. Here&rsquo;s
            the difference in what happens with and without it:
          </p>

          <div className="hiw-table-wrap">
            <table className="hiw-table">
              <thead>
                <tr>
                  <th></th>
                  <th>Plain messages (no tools)</th>
                  <th>Messages + tools</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>What you send</td>
                  <td>Conversation history only</td>
                  <td>Conversation history + a list of available tools</td>
                </tr>
                <tr>
                  <td>What Claude can return</td>
                  <td>Text only</td>
                  <td>
                    Text, <em>or</em> a request to call a tool with specific
                    inputs
                  </td>
                </tr>
                <tr>
                  <td>Who executes anything</td>
                  <td>Nobody — there&rsquo;s nothing to execute</td>
                  <td>
                    Your server runs the requested tool and sends the
                    result back
                  </td>
                </tr>
                <tr>
                  <td>Number of round trips</td>
                  <td>Always exactly one</td>
                  <td>
                    One or more — the loop repeats until Claude has enough
                    information to answer
                  </td>
                </tr>
                <tr>
                  <td>Good for</td>
                  <td>
                    Questions Claude can already answer from what it knows
                  </td>
                  <td>
                    Questions needing live data, precise calculation, or
                    outside content
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
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
                server, which forwards them to Claude and, when needed,
                executes tool calls like web search on its behalf. The
                conversation is kept in your browser for the current
                session only.
              </p>
            </div>
            <div className="hiw-faq-item">
              <h4>Are the API keys exposed to my browser?</h4>
              <p>
                No. Both the Anthropic API key and the SerpAPI key used for
                web search live only in the backend server&rsquo;s
                environment variables. They&rsquo;re never sent to or
                stored in the browser, so they can&rsquo;t be seen in the
                page source or network responses.
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
