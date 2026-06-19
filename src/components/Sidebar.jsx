import { TOPICS } from '../data/topics';

function Sidebar({ activeTopic, onTopicSelect }) {
  return (
    <aside id="sidebar">
      <div>
        <div className="sidebar-section-label">Topics</div>
        <ul className="topic-list">
          {TOPICS.map((topic) => (
            <li
              key={topic.id}
              className={activeTopic === topic.id ? 'active' : ''}
              onClick={() => onTopicSelect(topic.id)}
            >
              <span className="topic-icon">{topic.icon}</span>
              <span>{topic.label}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="sidebar-footer">
        <strong>How to use</strong>
        Type any marketing question below. Select a topic on the left to get
        focused suggestions, or ask freely about anything in marketing.
      </div>
    </aside>
  );
}

export default Sidebar;
