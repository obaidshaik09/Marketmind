const MODEL = 'claude-sonnet-4-6';

export async function validateApiKey(apiKey) {
  try {
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
        max_tokens: 1,
        messages: [{ role: 'user', content: 'hi' }],
      }),
    });

    if (response.ok) return { valid: true };

    const data = await response.json();
    return { valid: false, message: (data.error && data.error.message) || 'Invalid API key.' };
  } catch (err) {
    return { valid: false, message: err.message };
  }
}
