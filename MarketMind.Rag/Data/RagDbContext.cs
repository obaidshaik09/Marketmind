using MarketMind.Rag.Models;
using Microsoft.EntityFrameworkCore;
using Pgvector.EntityFrameworkCore;

namespace MarketMind.Rag.Data;

public class RagDbContext(DbContextOptions<RagDbContext> options) : DbContext(options)
{
    public DbSet<Document> Documents => Set<Document>();
    public DbSet<DocumentChunk> DocumentChunks => Set<DocumentChunk>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.HasPostgresExtension("vector");
        modelBuilder.Entity<Document>(e =>
        {
            e.HasKey(d => d.Id);
            e.Property(d => d.Title).HasMaxLength(500);
            e.Property(d => d.FileName).HasMaxLength(500);
            e.HasMany(d => d.Chunks).WithOne(c => c.Document).HasForeignKey(c => c.DocumentId).OnDelete(DeleteBehavior.Cascade);
        });
        modelBuilder.Entity<DocumentChunk>(e =>
        {
            e.HasKey(c => c.Id);
            e.Property(c => c.Content).IsRequired();
            e.Property(c => c.Embedding).HasColumnType("vector(1536)");
        });
    }
}
