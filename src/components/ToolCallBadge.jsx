const TOOL_LABELS = {
  web_search: { icon: '🔍', verb: 'Searched the web for' },
  calculator: { icon: '🧮', verb: 'Calculated' },
  fetch_url: { icon: '🌐', verb: 'Read the page at' },
};

function describeStep(step) {
  const meta = TOOL_LABELS[step.tool] || { icon: '🛠️', verb: 'Used tool' };
  const detail = step.input?.query || step.input?.expression || step.input?.url || '';
  return `${meta.icon} ${meta.verb}${detail ? ` "${detail}"` : ''}`;
}

function ToolCallBadge({ steps }) {
  if (!steps || steps.length === 0) return null;

  return (
    <div className="tool-call-badges">
      {steps.map((step, idx) => (
        <div className="tool-call-badge" key={idx}>
          {describeStep(step)}
        </div>
      ))}
    </div>
  );
}

export default ToolCallBadge;
