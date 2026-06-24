import { FEATURES, AUDIENCES } from '../data/topics';
import StarterPrompts from './StarterPrompts';

function WelcomePanel({ topicId, onPromptSelect }) {
  return (
    <div className="welcome-panel">
      <div className="welcome-hero">
        <div className="welcome-badge">MARKETMIND · AI AGENT · TOOL CALLING</div>
        <h2 className="welcome-title">Your US Career Command Center</h2>
        <p className="welcome-subtitle">
          Build resumes, attach files, prep for interviews, skill-up with quizzes,
          and search live job market data — for every background and field.
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

      <StarterPrompts topicId={topicId} onSelect={onPromptSelect} />
    </div>
  );
}

export default WelcomePanel;
