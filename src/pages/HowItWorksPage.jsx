import { useNavigate } from 'react-router-dom';
import { TOPICS } from '../data/topics';

const STEPS = [
  { title: 'Paste your Anthropic key', body: 'Launch MarketMind and paste your API key once per session. It stays in memory only — never saved to disk.' },
  { title: 'Pick a career module', body: 'Use the sidebar to focus on resume, job portals, LinkedIn, interviews, vendor calls, visa basics, or skill building.' },
  { title: 'Ask or tap a starter card', body: 'Type your question, attach a resume file, or click a starter prompt on the welcome screen.' },
  { title: 'Tools run in your browser', body: 'Web search, URL fetch, resume analysis, quizzes, and calculations run client-side. You see tool badges above replies.' },
];

const AGENT_TOOLS = [
  { icon: '🔍', name: 'web_search', body: 'Live salary data and job trends via SerpAPI (key in root .env).' },
  { icon: '🌐', name: 'fetch_url', body: 'Fetch public URLs in the browser. Some job sites block this (CORS).' },
  { icon: '📎', name: 'attachments', body: 'Upload .txt, .pdf, or .docx resumes for tailored feedback.' },
  { icon: '📄', name: 'analyze_resume', body: 'ATS feedback on pasted or attached resume text.' },
  { icon: '📝', name: 'build_resume', body: 'Build a US resume from scratch with guided questions.' },
  { icon: '⚡', name: 'skill_up / skill_quiz', body: 'Learning plans, practice tasks, and graded quizzes.' },
  { icon: '🧮', name: 'calculator', body: 'Salary comparisons and offer math.' },
];

const DEMO_PROMPTS = [
  { title: 'Attach resume', prompt: 'Review this resume and suggest improvements (attach .docx/.pdf/.txt)' },
  { title: 'Web search', prompt: 'What are entry-level data analyst salaries in Texas?' },
  { title: 'Build resume', prompt: "Help me build a resume from scratch — I'm a CS new grad" },
  { title: 'Skill quiz', prompt: 'Quiz me on 5 SQL basics' },
];

function HowItWorksPage() {
  const navigate = useNavigate();

  return (
    <div id="how-it-works-page">
      <div className="hiw-container">
        <div className="hiw-header">
          <div className="hiw-eyebrow">How It Works</div>
          <h1>Browser-only AI career coach</h1>
          <p>
            MarketMind runs entirely in your browser — one command (<code>npm start</code>),
            paste your Anthropic key, and optional SerpAPI key in <code>.env</code> for web search.
            No backend server required for the demo.
          </p>
        </div>

        <div className="hiw-section">
          <h2>Setup</h2>
          <ol className="hiw-setup-list">
            <li><code>npm install</code></li>
            <li>Copy <code>.env.example</code> to <code>.env</code> and add <code>REACT_APP_SERPAPI_API_KEY</code> (free at serpapi.com)</li>
            <li><code>npm start</code> → paste Anthropic key at launch</li>
          </ol>
          <p className="hiw-note">
            Web fetch may fail on some job posting URLs because browsers block cross-origin requests (CORS).
            Web search works when SerpAPI is configured. The <code>server/</code> folder is kept for a future class topic but is not needed to run the app.
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
