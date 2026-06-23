import { useNavigate } from 'react-router-dom';
import { TOPICS } from '../data/topics';

const STEPS = [
  { title: 'Pick a career module', body: 'Use the sidebar to focus on resume, job portals, LinkedIn, interviews, vendor calls, visa basics, or skill building.' },
  { title: 'Ask or tap a suggestion', body: 'Type your question or tap a chip. The AI agent decides if it needs tools before answering.' },
  { title: 'Tools run automatically', body: 'Web search, URL fetch, resume analysis, quizzes, and calculations happen behind the scenes — you see badges above replies.' },
  { title: 'Get actionable guidance', body: 'Structured advice for your US job search, grounded in live data and tool results.' },
];

const AGENT_TOOLS = [
  { icon: '🔍', name: 'web_search', body: 'Live salary data, job trends, visa news via SerpAPI.' },
  { icon: '🌐', name: 'fetch_url', body: 'Analyze job posting URLs you share.' },
  { icon: '🧮', name: 'calculator', body: 'Salary comparisons and offer math.' },
  { icon: '📄', name: 'analyze_resume', body: 'ATS feedback on pasted resume text.' },
  { icon: '📝', name: 'skill_quiz', body: 'Practice quizzes with grading and tasks.' },
];

const DEMO_PROMPTS = [
  { title: 'Web search', prompt: 'What are entry-level data analyst salaries in Texas?' },
  { title: 'Web fetch', prompt: 'Analyze this job posting URL and tell me how to tailor my resume.' },
  { title: 'Multi-tool', prompt: "I'm on OPT targeting Java roles — search market advice and quiz me on 5 Java basics." },
  { title: 'Resume + interview', prompt: 'Review my resume for ATS issues, then do a mock vendor screening call.' },
];

function HowItWorksPage() {
  const navigate = useNavigate();

  return (
    <div id="how-it-works-page">
      <div className="hiw-container">
        <div className="hiw-header">
          <div className="hiw-eyebrow">How It Works</div>
          <h1>AI career coach with tool calling</h1>
          <p>
            MarketMind helps US citizens, students, visa holders, and career changers
            find jobs across IT and non-IT fields — using web search, URL fetch, and
            an agent loop that runs tools before answering.
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
          <h2>Tools</h2>
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

        <div className="hiw-section">
          <h2>Career modules</h2>
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
          <h2>Demo script for presentation</h2>
          <div className="hiw-tools-grid">
            {DEMO_PROMPTS.map((demo) => (
              <div className="hiw-tool-card" key={demo.title}>
                <div>
                  <strong>{demo.title}</strong>
                  <p>&ldquo;{demo.prompt}&rdquo;</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="hiw-cta">
          <button type="button" className="hiw-cta-btn" onClick={() => navigate('/')}>
            Start coaching →
          </button>
        </div>
      </div>
    </div>
  );
}

export default HowItWorksPage;
