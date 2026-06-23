import { FEATURES, AUDIENCES } from '../data/topics';

function WelcomePanel() {
  return (
    <div className="welcome-panel">
      <div className="welcome-hero">
        <div className="welcome-badge">MARKETMIND · AI AGENT · TOOL CALLING</div>
        <h2 className="welcome-title">Your US Career Command Center</h2>
        <p className="welcome-subtitle">
          Build a resume from scratch, set up job profiles, prep for interviews,
          skill-up with quizzes and tasks, and search live job market data —
          for citizens, students, visa holders, and career changers.
        </p>
        <div className="welcome-audiences">
          {AUDIENCES.map((a) => (
            <span className="welcome-audience-pill" key={a}>{a}</span>
          ))}
        </div>
      </div>

      <div className="welcome-features">
        {FEATURES.map((f) => (
          <div className="welcome-feature-card" key={f.title}>
            <span className="welcome-feature-icon">{f.icon}</span>
            <div>
              <div className="welcome-feature-title">{f.title}</div>
              <div className="welcome-feature-desc">{f.desc}</div>
            </div>
          </div>
        ))}
      </div>

      <p className="welcome-hint">
        Pick a module from the sidebar or tap a suggestion below. For web search &amp; job URL fetch, run <code>npm run server</code> in a second terminal.
      </p>
    </div>
  );
}

export default WelcomePanel;
