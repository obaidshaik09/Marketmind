import { STARTER_PROMPTS } from '../data/topics';

function StarterPrompts({ topicId, onSelect }) {
  const prompts = STARTER_PROMPTS[topicId] || STARTER_PROMPTS.general;

  return (
    <div className="starter-prompts">
      <div className="starter-prompts-label">Try asking</div>
      <div className="starter-prompts-grid">
        {prompts.map((item) => (
          <button
            key={item.title}
            type="button"
            className="starter-card"
            onClick={() => onSelect(item.prompt)}
          >
            <div className="starter-card-title">{item.title}</div>
            <div className="starter-card-sub">{item.subtitle}</div>
          </button>
        ))}
      </div>
    </div>
  );
}

export default StarterPrompts;
