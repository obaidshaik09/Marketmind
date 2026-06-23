const TOOL_LABELS = {
  web_search: { icon: '🔍', verb: 'Searched the web for' },
  calculator: { icon: '🧮', verb: 'Calculated' },
  fetch_url: { icon: '🌐', verb: 'Fetched' },
  build_resume: { icon: '📄', verb: 'Built resume for' },
  analyze_resume: { icon: '📋', verb: 'Analyzed resume for' },
  skill_quiz: { icon: '📝', verb: 'Quiz on' },
  skill_up: { icon: '⚡', verb: 'Skill-up plan for' },
};

function describeStep(step) {
  const meta = TOOL_LABELS[step.tool] || { icon: '🛠️', verb: 'Used tool' };
  const detail =
    step.input?.query || step.input?.expression || step.input?.url ||
    step.input?.topic || step.input?.skill || step.input?.target_role ||
    step.input?.full_name || '';
  return `${meta.icon} ${meta.verb}${detail ? ` "${detail}"` : ''}`;
}

function ToolCallBadge({ steps }) {
  if (!steps || steps.length === 0) return null;
  return (
    <div className="tool-call-badges">
      {steps.map((step, idx) => (
        <div className="tool-call-badge" key={idx}>{describeStep(step)}</div>
      ))}
    </div>
  );
}

export default ToolCallBadge;
