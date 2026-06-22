// server/tools.js
//
// Defines the tools available to the MarketMind agent and the functions
// that actually execute them. Each tool has:
//   - a `definition` in the shape Claude's API expects (name, description,
//     input_schema) so the model knows the tool exists and how to call it
//   - an `execute(input)` function that runs server-side and returns a
//     plain string result that gets fed back to the model
//
// IMPORTANT: tool *execution* always happens on the server, never in the
// browser. The model only ever sees tool descriptions and results — never
// raw API keys.

const SERPAPI_KEY = process.env.SERPAPI_API_KEY;

// ── 1. WEB SEARCH (via SerpAPI) ──────────────────────────────────────────
const webSearchDefinition = {
  name: 'web_search',
  description:
    'Search the web for current information, such as recent marketing trends, statistics, news, or facts that may have changed since the assistant was trained. Use this when the user asks about something current or time-sensitive, or when you are not confident in your own knowledge.',
  input_schema: {
    type: 'object',
    properties: {
      query: {
        type: 'string',
        description: 'The search query. Keep it short and specific (a few words).',
      },
    },
    required: ['query'],
  },
};

async function executeWebSearch({ query }) {
  if (!SERPAPI_KEY) {
    return 'Web search is not available right now: SERPAPI_API_KEY is not configured on the server. (Get a free key at serpapi.com and add it to server/.env.)';
  }

  const url = `https://serpapi.com/search.json?q=${encodeURIComponent(query)}&api_key=${SERPAPI_KEY}&num=5`;
  const response = await fetch(url);

  if (!response.ok) {
    return `Web search failed with status ${response.status}. Please try again or rephrase the query.`;
  }

  const data = await response.json();
  const results = (data.organic_results || []).slice(0, 5);

  if (results.length === 0) {
    return `No web results found for "${query}".`;
  }

  return results
    .map((r, i) => `${i + 1}. ${r.title}\n${r.snippet || ''}\nSource: ${r.link}`)
    .join('\n\n');
}

// ── 2. CALCULATOR ─────────────────────────────────────────────────────────
const calculatorDefinition = {
  name: 'calculator',
  description:
    'Evaluate a mathematical expression. Use this for any arithmetic the user needs — e.g. computing ROAS, CAC, conversion rates, percentages, or budget splits — instead of doing math in your head, to guarantee accuracy.',
  input_schema: {
    type: 'object',
    properties: {
      expression: {
        type: 'string',
        description:
          'A mathematical expression using only numbers and the operators + - * / ( ) and %. Example: "(4500 - 1200) / 1200 * 100".',
      },
    },
    required: ['expression'],
  },
};

function executeCalculator({ expression }) {
  // Only allow digits, whitespace, and the operators + - * / ( ) . %
  // This is a strict allowlist — no letters, no function calls, nothing
  // that could be used to execute arbitrary code.
  const safePattern = /^[0-9\s+\-*/().%]+$/;

  if (!safePattern.test(expression)) {
    return 'Error: expression contains characters that are not allowed. Only numbers and + - * / ( ) % are permitted.';
  }

  try {
    // Percent sign is not valid JS — convert "X%" to "(X/100)" first.
    const jsExpression = expression.replace(/(\d+(?:\.\d+)?)%/g, '($1/100)');
    // eslint-disable-next-line no-new-func
    const result = Function(`"use strict"; return (${jsExpression});`)();

    if (typeof result !== 'number' || !Number.isFinite(result)) {
      return 'Error: the expression did not evaluate to a valid number.';
    }
    return String(result);
  } catch (err) {
    return `Error evaluating expression: ${err.message}`;
  }
}

// ── 3. FETCH URL CONTENT ──────────────────────────────────────────────────
const fetchUrlDefinition = {
  name: 'fetch_url',
  description:
    'Fetch the visible text content of a public web page given its URL. Use this when the user shares a link and asks you to summarize, analyze, or answer questions about its content.',
  input_schema: {
    type: 'object',
    properties: {
      url: {
        type: 'string',
        description: 'A full URL starting with http:// or https://',
      },
    },
    required: ['url'],
  },
};

function stripHtml(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/\s+/g, ' ')
    .trim();
}

async function executeFetchUrl({ url }) {
  let parsed;
  try {
    parsed = new URL(url);
  } catch {
    return `Error: "${url}" is not a valid URL.`;
  }

  if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
    return 'Error: only http:// and https:// URLs are supported.';
  }

  try {
    const response = await fetch(parsed.toString(), {
      headers: { 'User-Agent': 'Mozilla/5.0 (MarketMind Agent)' },
    });

    if (!response.ok) {
      return `Could not fetch the page (status ${response.status}).`;
    }

    const contentType = response.headers.get('content-type') || '';
    if (!contentType.includes('text/html') && !contentType.includes('text/plain')) {
      return `The URL did not return readable text content (content-type: ${contentType}).`;
    }

    const html = await response.text();
    const text = stripHtml(html);

    // Keep the payload reasonable so it doesn't blow up the context window.
    const MAX_CHARS = 6000;
    return text.length > MAX_CHARS
      ? `${text.slice(0, MAX_CHARS)}\n\n[Content truncated — page was longer than ${MAX_CHARS} characters.]`
      : text;
  } catch (err) {
    return `Error fetching the URL: ${err.message}`;
  }
}

// ── Registry ───────────────────────────────────────────────────────────────
const TOOLS = [
  { definition: webSearchDefinition, execute: executeWebSearch },
  { definition: calculatorDefinition, execute: executeCalculator },
  { definition: fetchUrlDefinition, execute: executeFetchUrl },
];

function getToolDefinitions() {
  return TOOLS.map((t) => t.definition);
}

async function runTool(name, input) {
  const tool = TOOLS.find((t) => t.definition.name === name);
  if (!tool) {
    return `Error: unknown tool "${name}".`;
  }
  try {
    return await tool.execute(input);
  } catch (err) {
    return `Error running tool "${name}": ${err.message}`;
  }
}

module.exports = { getToolDefinitions, runTool, SERPAPI_KEY };
