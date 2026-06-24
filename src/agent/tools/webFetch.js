export const definition = {
  name: 'fetch_url',
  description:
    'Fetch and read a job posting or web page URL. Use when user shares a link. Note: some sites (Indeed, LinkedIn) may block browser requests.',
  input_schema: {
    type: 'object',
    properties: { url: { type: 'string', description: 'Full http:// or https:// URL.' } },
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

export async function execute({ url }) {
  let parsed;
  try {
    parsed = new URL(url);
  } catch {
    return `Error: "${url}" is not a valid URL.`;
  }
  if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
    return 'Error: only http/https URLs are supported.';
  }
  try {
    const response = await fetch(parsed.toString());
    if (!response.ok) return `Could not fetch page (status ${response.status}).`;
    const text = stripHtml(await response.text());
    return text.length > 6000 ? `${text.slice(0, 6000)}\n\n[Content truncated.]` : text;
  } catch (err) {
    return `Fetch failed: ${err.message}. Many job sites block browser requests — try pasting the job description text instead.`;
  }
}
