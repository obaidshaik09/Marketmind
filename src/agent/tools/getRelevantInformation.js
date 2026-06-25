const RAG_API = process.env.REACT_APP_RAG_API_URL || 'http://localhost:5001';

export const definition = {
  name: 'get_relevant_information',
  description:
    'Search the internal IT/career knowledge base for relevant private documentation. ALWAYS use first when the user asks about platform-specific IT materials, guides, or topics that may be in uploaded docs. If no results, fall back to web_search.',
  input_schema: {
    type: 'object',
    properties: {
      query: {
        type: 'string',
        description: 'Short search query describing what internal information is needed.',
      },
    },
    required: ['query'],
  },
};

function formatResults(data) {
  if (!data.found || !data.results?.length) {
    return data.message || 'No relevant internal documentation found (below 50% similarity threshold).';
  }
  return data.results
    .map((r, i) => (
      `${i + 1}. [${r.documentTitle}] (similarity: ${(r.similarity * 100).toFixed(0)}%)\n${r.content}`
    ))
    .join('\n\n');
}

export async function execute({ query }) {
  try {
    const response = await fetch(`${RAG_API}/api/rag/search`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query }),
    });
    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      return `Knowledge base search failed (${response.status}): ${err.error || 'Check that the RAG API is running on port 5001.'}`;
    }
    const data = await response.json();
    return formatResults(data);
  } catch (err) {
    return `Knowledge base search failed: ${err.message}. Is the RAG API running? Start it with: cd MarketMind.Rag && dotnet run`;
  }
}

export function isRagConfigured() {
  return Boolean(RAG_API);
}
