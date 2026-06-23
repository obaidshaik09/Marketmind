// src/services/tools.js
//
// Tool definitions and executors for the MarketMind agent — running
// entirely in the browser, since this version of the app has no backend.
//
// IMPORTANT TRADEOFF: because there's no server, every tool here runs
// with whatever access the browser has. That means:
//   - web_search calls SerpAPI directly from the browser (your SerpAPI
//     key, if you add one, is visible to anyone inspecting network
//     requests in dev tools during your session)
//   - fetch_url can only reach pages that allow cross-origin requests
//     (CORS) from a browser, since there's no server to fetch on your
//     behalf — many sites will block this
//   - calculator runs locally with no external call at all
//
// This is a deliberate simplification for a learning exercise. See the
// "How It Works" page in the app for the full explanation of this
// tradeoff vs. a backend-proxy architecture.

const SERPAPI_KEY = process.env.REACT_APP_SERPAPI_API_KEY || '';

// ── 1. WEB SEARCH (via SerpAPI, called directly from the browser) ───────
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
    return 'Web search is not available right now: no SerpAPI key has been provided for this session. (Get a free key at serpapi.com.)';
  }

  try {
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
  } catch (err) {
    return `Web search failed: ${err.message}. This can happen if SerpAPI blocks direct browser requests (CORS).`;
  }
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
  const safePattern = /^[0-9\s+\-*/().%]+$/;

  if (!safePattern.test(expression)) {
    return 'Error: expression contains characters that are not allowed. Only numbers and + - * / ( ) % are permitted.';
  }

  try {
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
    'Fetch the visible text content of a public web page given its URL. Use this when the user shares a link and asks you to summarize, analyze, or answer questions about its content. Note: this may fail for sites that block cross-origin browser requests.',
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
    const response = await fetch(parsed.toString());

    if (!response.ok) {
      return `Could not fetch the page (status ${response.status}).`;
    }

    const html = await response.text();
    const text = stripHtml(html);

    const MAX_CHARS = 6000;
    return text.length > MAX_CHARS
      ? `${text.slice(0, MAX_CHARS)}\n\n[Content truncated — page was longer than ${MAX_CHARS} characters.]`
      : text;
  } catch (err) {
    return `Error fetching the URL: ${err.message}. Many sites block direct browser requests (CORS) — this tool works best on pages that explicitly allow it.`;
  }
}

// ── Registry ───────────────────────────────────────────────────────────────
const TOOLS = [
  { definition: webSearchDefinition, execute: executeWebSearch },
  { definition: calculatorDefinition, execute: executeCalculator },
  { definition: fetchUrlDefinition, execute: executeFetchUrl },
];

export function getToolDefinitions() {
  return TOOLS.map((t) => t.definition);
}

export async function runTool(name, input) {
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

export function isWebSearchConfigured() {
  return Boolean(SERPAPI_KEY);
}
