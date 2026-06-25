using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace MarketMind.Rag.Services;

public class EmbeddingService(IConfiguration config, IHttpClientFactory httpClientFactory)
{
    private readonly string _apiKey = config["OpenRouter:ApiKey"] ?? "";
    private readonly string _model = config["OpenRouter:EmbeddingModel"] ?? "openai/text-embedding-3-small";

    public bool IsConfigured => !string.IsNullOrWhiteSpace(_apiKey);

    public async Task<float[]> EmbedAsync(string text)
    {
        var vectors = await EmbedBatchAsync([text]);
        return vectors[0];
    }

    public async Task<List<float[]>> EmbedBatchAsync(IReadOnlyList<string> texts)
    {
        if (!IsConfigured)
            throw new InvalidOperationException("OpenRouter API key is not configured.");

        if (texts.Count == 0) return [];

        var client = httpClientFactory.CreateClient("OpenRouter");
        var payload = new { model = _model, input = texts };
        var json = JsonSerializer.Serialize(payload);
        using var request = new HttpRequestMessage(HttpMethod.Post, "https://openrouter.ai/api/v1/embeddings");
        request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", _apiKey);
        request.Content = new StringContent(json, Encoding.UTF8, "application/json");

        var response = await client.SendAsync(request);
        var body = await response.Content.ReadAsStringAsync();
        if (!response.IsSuccessStatusCode)
            throw new InvalidOperationException($"OpenRouter embedding failed ({response.StatusCode}): {body}");

        var parsed = JsonSerializer.Deserialize<EmbeddingResponse>(body);
        if (parsed?.Data == null || parsed.Data.Count == 0)
            throw new InvalidOperationException("OpenRouter returned no embeddings.");

        return parsed.Data.OrderBy(d => d.Index).Select(d => d.Embedding).ToList();
    }

    private sealed class EmbeddingResponse
    {
        [JsonPropertyName("data")]
        public List<EmbeddingItem> Data { get; set; } = [];
    }

    private sealed class EmbeddingItem
    {
        [JsonPropertyName("index")]
        public int Index { get; set; }

        [JsonPropertyName("embedding")]
        public float[] Embedding { get; set; } = [];
    }
}
