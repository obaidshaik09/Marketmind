using MarketMind.Rag.Data;
using MarketMind.Rag.Services;
using Microsoft.EntityFrameworkCore;
using Npgsql;

namespace MarketMind.Rag;

public static class DatabaseInitializer
{
    public static async Task InitializeAsync(WebApplication app)
    {
        var config = app.Configuration;
        var dbName = config.GetValue("Database:Name", "marketmind_rag");
        var masterConn = config.GetConnectionString("PostgresMaster")
            ?? config.GetConnectionString("Postgres")?.Replace($"Database={dbName}", "Database=postgres")
            ?? throw new InvalidOperationException("Postgres connection string not configured.");

        await EnsureDatabaseExistsAsync(masterConn, dbName);

        using var scope = app.Services.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<RagDbContext>();
        await db.Database.OpenConnectionAsync();
        await db.Database.ExecuteSqlRawAsync("CREATE EXTENSION IF NOT EXISTS vector;");
        await db.Database.CloseConnectionAsync();
        await db.Database.EnsureCreatedAsync();
    }

    private static async Task EnsureDatabaseExistsAsync(string masterConnectionString, string databaseName)
    {
        await using var conn = new NpgsqlConnection(masterConnectionString);
        await conn.OpenAsync();
        await using var check = new NpgsqlCommand(
            "SELECT 1 FROM pg_database WHERE datname = @name", conn);
        check.Parameters.AddWithValue("name", databaseName);
        var exists = await check.ExecuteScalarAsync() != null;
        if (!exists)
        {
            await using var create = new NpgsqlCommand(
                $"CREATE DATABASE \"{databaseName.Replace("\"", "\"\"")}\"", conn);
            await create.ExecuteNonQueryAsync();
        }
    }
}
