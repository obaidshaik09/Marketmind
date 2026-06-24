import { SYSTEM_PROMPT } from './agentPrompt';
import { getToolDefinitions, runTool } from './tools';

const MODEL = 'claude-sonnet-4-6';
const MAX_AGENT_STEPS = 6;

async function callClaude(apiKey, messages) {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 1500,
      system: SYSTEM_PROMPT,
      messages,
      tools: getToolDefinitions(),
    }),
  });

  const data = await response.json();
  if (!response.ok) {
    const message = (data.error && data.error.message) || 'Anthropic API request failed.';
    const err = new Error(message);
    err.status = response.status;
    throw err;
  }
  return data;
}

export async function sendChatMessage(apiKey, messages) {
  if (!apiKey) {
    throw new Error('No API key provided. Enter your Anthropic API key to start chatting.');
  }

  const conversation = messages.map((m) => ({ role: m.role, content: m.content }));
  const steps = [];

  for (let i = 0; i < MAX_AGENT_STEPS; i += 1) {
    const data = await callClaude(apiKey, conversation);

    if (data.stop_reason !== 'tool_use') {
      const text = data.content.map((block) => block.text || '').join('');
      return { text, steps };
    }

    conversation.push({ role: 'assistant', content: data.content });

    const toolUseBlocks = data.content.filter((block) => block.type === 'tool_use');
    const toolResultBlocks = [];

    for (const block of toolUseBlocks) {
      steps.push({ tool: block.name, input: block.input });
      const result = await runTool(block.name, block.input);
      toolResultBlocks.push({
        type: 'tool_result',
        tool_use_id: block.id,
        content: result,
      });
    }

    conversation.push({ role: 'user', content: toolResultBlocks });
  }

  return {
    text: "I used several tools but couldn't reach a final answer in time. Could you rephrase or simplify your question?",
    steps,
  };
}
