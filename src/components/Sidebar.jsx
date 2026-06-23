import { TOPICS } from '../data/topics';

function Sidebar({ activeTopic, onTopicSelect }) {
  return (
    <aside id="sidebar">
      <div>
        <div className="sidebar-section-label">Career Modules</div>
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
    </aside>
  );
}

export default Sidebar;
