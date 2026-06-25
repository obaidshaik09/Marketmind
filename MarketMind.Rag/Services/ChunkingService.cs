namespace MarketMind.Rag.Services;

public class ChunkingService(IConfiguration config)
{
    private int ChunkSize => config.GetValue("Rag:ChunkSize", 600);
    private int ChunkOverlap => config.GetValue("Rag:ChunkOverlap", 100);

    public IReadOnlyList<string> ChunkText(string text)
    {
        var normalized = text.Replace("\r\n", "\n").Trim();
        if (string.IsNullOrWhiteSpace(normalized)) return [];

        var chunks = new List<string>();
        var start = 0;
        while (start < normalized.Length)
        {
            var length = Math.Min(ChunkSize, normalized.Length - start);
            var chunk = normalized.Substring(start, length).Trim();
            if (chunk.Length > 0) chunks.Add(chunk);
            if (start + length >= normalized.Length) break;
            start += Math.Max(1, ChunkSize - ChunkOverlap);
        }
        return chunks;
    }
}
