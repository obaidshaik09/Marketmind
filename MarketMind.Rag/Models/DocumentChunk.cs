using Pgvector;

namespace MarketMind.Rag.Models;

public class DocumentChunk
{
    public int Id { get; set; }
    public int DocumentId { get; set; }
    public Document Document { get; set; } = null!;
    public string Content { get; set; } = string.Empty;
    public int ChunkIndex { get; set; }
    public Vector? Embedding { get; set; }
}
