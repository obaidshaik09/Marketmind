namespace MarketMind.Rag.Models;

public class RagSearchResult
{
    public string Content { get; set; } = string.Empty;
    public string DocumentTitle { get; set; } = string.Empty;
    public string FileName { get; set; } = string.Empty;
    public double Similarity { get; set; }
}
