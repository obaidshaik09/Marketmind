using MarketMind.Rag.Data;
using MarketMind.Rag.Models;
using Microsoft.EntityFrameworkCore;
using Pgvector;

namespace MarketMind.Rag.Services;

public class DocumentIngestService(
    RagDbContext db,
    TextExtractionService textExtraction,
    ChunkingService chunking,
    EmbeddingService embedding)
{
    public async Task<(Document document, int chunkCount)> IngestAsync(
        Stream stream, string fileName, string contentType, string? title)
    {
        if (!textExtraction.IsSupported(fileName, contentType))
            throw new InvalidOperationException("Unsupported file type. Use .txt, .md, .pdf, or .docx.");

        var text = await textExtraction.ExtractAsync(stream, fileName, contentType);
        if (string.IsNullOrWhiteSpace(text))
            throw new InvalidOperationException("Could not extract text from this file.");

        var chunks = chunking.ChunkText(text);
        if (chunks.Count == 0)
            throw new InvalidOperationException("No text chunks were produced from this file.");

        var document = new Document
        {
            Title = string.IsNullOrWhiteSpace(title) ? Path.GetFileNameWithoutExtension(fileName) : title.Trim(),
            FileName = fileName,
            ContentType = contentType,
            UploadedAt = DateTime.UtcNow,
        };
        db.Documents.Add(document);
        await db.SaveChangesAsync();

        // Embed in batches of 20 to avoid API limits
        const int batchSize = 20;
        for (var i = 0; i < chunks.Count; i += batchSize)
        {
            var batch = chunks.Skip(i).Take(batchSize).ToList();
            var embeddings = await embedding.EmbedBatchAsync(batch);
            for (var j = 0; j < batch.Count; j++)
            {
                db.DocumentChunks.Add(new DocumentChunk
                {
                    DocumentId = document.Id,
                    Content = batch[j],
                    ChunkIndex = i + j,
                    Embedding = new Vector(embeddings[j]),
                });
            }
        }
        await db.SaveChangesAsync();
        return (document, chunks.Count);
    }

    public async Task<List<DocumentDto>> ListDocumentsAsync()
    {
        return await db.Documents
            .OrderByDescending(d => d.UploadedAt)
            .Select(d => new DocumentDto
            {
                Id = d.Id,
                Title = d.Title,
                FileName = d.FileName,
                ContentType = d.ContentType,
                UploadedAt = d.UploadedAt,
                ChunkCount = d.Chunks.Count,
            })
            .ToListAsync();
    }

    public async Task<bool> DeleteDocumentAsync(int id)
    {
        var doc = await db.Documents.FindAsync(id);
        if (doc == null) return false;
        db.Documents.Remove(doc);
        await db.SaveChangesAsync();
        return true;
    }
}
