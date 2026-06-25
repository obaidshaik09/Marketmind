using MarketMind.Rag.Data;
using MarketMind.Rag.Models;
using Microsoft.EntityFrameworkCore;
using Npgsql;
using Pgvector;

namespace MarketMind.Rag.Services;

public class RagSearchService(
    RagDbContext db,
    EmbeddingService embeddingService,
    IConfiguration config)
{
    private double Threshold => config.GetValue("Rag:SimilarityThreshold", 0.5);
    private int MaxResults => config.GetValue("Rag:MaxResults", 5);

    public async Task<IReadOnlyList<RagSearchResult>> SearchAsync(string query)
    {
        if (string.IsNullOrWhiteSpace(query)) return [];

        var queryVector = await embeddingService.EmbedAsync(query.Trim());
        var vector = new Vector(queryVector);

        // Cosine similarity = 1 - cosine_distance (<=> operator)
        const string sql = """
            SELECT c."Content", d."Title", d."FileName",
                   1 - (c."Embedding" <=> @query) AS "Similarity"
            FROM "DocumentChunks" c
            INNER JOIN "Documents" d ON d."Id" = c."DocumentId"
            WHERE c."Embedding" IS NOT NULL
              AND 1 - (c."Embedding" <=> @query) >= @threshold
            ORDER BY c."Embedding" <=> @query
            LIMIT @limit
            """;

        var results = new List<RagSearchResult>();
        await using var conn = (NpgsqlConnection)db.Database.GetDbConnection();
        if (conn.State != System.Data.ConnectionState.Open)
            await conn.OpenAsync();

        await using var cmd = new NpgsqlCommand(sql, conn);
        cmd.Parameters.AddWithValue("query", vector);
        cmd.Parameters.AddWithValue("threshold", Threshold);
        cmd.Parameters.AddWithValue("limit", MaxResults);

        await using var reader = await cmd.ExecuteReaderAsync();
        while (await reader.ReadAsync())
        {
            results.Add(new RagSearchResult
            {
                Content = reader.GetString(0),
                DocumentTitle = reader.GetString(1),
                FileName = reader.GetString(2),
                Similarity = reader.GetDouble(3),
            });
        }
        return results;
    }
}
