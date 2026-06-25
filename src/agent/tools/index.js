import * as webSearch from './webSearch';
import * as webFetch from './webFetch';
import * as getRelevantInformation from './getRelevantInformation';
import * as calculator from './calculator';
import * as buildResume from './buildResume';
import * as analyzeResume from './analyzeResume';
import * as skillQuiz from './skillQuiz';
import * as skillUp from './skillUp';

const TOOLS = [
  getRelevantInformation,
  webSearch,
  webFetch,
  calculator,
  buildResume,
  analyzeResume,
  skillQuiz,
  skillUp,
];

export function getToolDefinitions() {
  return TOOLS.map((t) => t.definition);
}

export async function runTool(name, input) {
  const tool = TOOLS.find((t) => t.definition.name === name);
  if (!tool) return `Error: unknown tool "${name}".`;
  try {
    return await tool.execute(input);
  } catch (err) {
    return `Error running tool "${name}": ${err.message}`;
  }
}

export function isWebSearchConfigured() {
  return webSearch.isConfigured();
}

export function isRagConfigured() {
  return getRelevantInformation.isRagConfigured();
}
