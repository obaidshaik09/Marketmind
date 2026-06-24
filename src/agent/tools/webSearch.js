const SERPAPI_KEY = process.env.REACT_APP_SERPAPI_API_KEY || '';

export const definition = {
  name: 'web_search',
  description:
    'Search the web for current salary data, job market trends, visa updates, or hiring news. ALWAYS use when user asks about current salaries, trends, or recent information.',
  input_schema: {
    type: 'object',
    properties: { query: { type: 'string', description: 'Short specific search query.' } },
    required: ['query'],
  },
};

export async function execute({ query }) {
  if (!SERPAPI_KEY) {
    return 'Web search is not configured. Add REACT_APP_SERPAPI_API_KEY to your .env file (free key at serpapi.com) and restart npm start.';
  }
  try {
    const url = `https://serpapi.com/search.json?q=${encodeURIComponent(query)}&api_key=${SERPAPI_KEY}&num=5`;
    const response = await fetch(url);
    if (!response.ok) return `Web search failed (status ${response.status}). Check your SerpAPI key.`;
    const data = await response.json();
    const results = (data.organic_results || []).slice(0, 5);
    if (!results.length) return `No results for "${query}".`;
    return results.map((r, i) => `${i + 1}. ${r.title}\n${r.snippet || ''}\nSource: ${r.link}`).join('\n\n');
  } catch (err) {
    return `Web search failed: ${err.message}`;
  }
}

export function isConfigured() {
  return Boolean(SERPAPI_KEY);
}
