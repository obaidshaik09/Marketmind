using MarketMind.Rag;
using MarketMind.Rag.Data;
using MarketMind.Rag.Services;
using Microsoft.EntityFrameworkCore;
using Pgvector.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddHttpClient("OpenRouter");

builder.Services.AddCors(options =>
{
    options.AddPolicy("ReactApp", policy =>
        policy.WithOrigins("http://localhost:3000", "http://127.0.0.1:3000")
            .AllowAnyHeader()
            .AllowAnyMethod());
});

var connectionString = builder.Configuration.GetConnectionString("Postgres")
    ?? throw new InvalidOperationException("Connection string 'Postgres' not found.");

builder.Services.AddDbContext<RagDbContext>(options =>
    options.UseNpgsql(connectionString, o => o.UseVector()));

builder.Services.AddSingleton<ChunkingService>();
builder.Services.AddSingleton<TextExtractionService>();
builder.Services.AddSingleton<EmbeddingService>();
builder.Services.AddScoped<RagSearchService>();
builder.Services.AddScoped<DocumentIngestService>();

var app = builder.Build();

await DatabaseInitializer.InitializeAsync(app);

app.UseCors("ReactApp");
app.MapControllers();

app.Run();
