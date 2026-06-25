using MarketMind.Rag.Models;
using MarketMind.Rag.Services;
using Microsoft.AspNetCore.Mvc;

namespace MarketMind.Rag.Controllers;

[ApiController]
[Route("api/rag")]
public class RagController(
    DocumentIngestService ingest,
    RagSearchService search) : ControllerBase
{
    [HttpPost("ingest")]
    [RequestSizeLimit(10 * 1024 * 1024)]
    public async Task<IActionResult> Ingest(IFormFile file, [FromForm] string? title)
    {
        if (file == null || file.Length == 0)
            return BadRequest(new { error = "No file uploaded." });

        try
        {
            await using var stream = file.OpenReadStream();
            var (document, chunkCount) = await ingest.IngestAsync(
                stream, file.FileName, file.ContentType, title);
            return Ok(new
            {
                documentId = document.Id,
                title = document.Title,
                fileName = document.FileName,
                chunkCount,
                status = "success",
            });
        }
        catch (Exception ex)
        {
            return BadRequest(new { error = ex.Message });
        }
    }

    [HttpGet("documents")]
    public async Task<IActionResult> ListDocuments()
    {
        var docs = await ingest.ListDocumentsAsync();
        return Ok(docs);
    }

    [HttpDelete("documents/{id:int}")]
    public async Task<IActionResult> DeleteDocument(int id)
    {
        var deleted = await ingest.DeleteDocumentAsync(id);
        if (!deleted) return NotFound(new { error = "Document not found." });
        return Ok(new { status = "deleted", id });
    }

    [HttpPost("search")]
    public async Task<IActionResult> Search([FromBody] RagSearchRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Query))
            return BadRequest(new { error = "Query is required." });

        try
        {
            var results = await search.SearchAsync(request.Query);
            if (results.Count == 0)
            {
                return Ok(new
                {
                    query = request.Query,
                    found = false,
                    message = "No relevant internal documentation found (below 50% similarity threshold).",
                    results = Array.Empty<RagSearchResult>(),
                });
            }

            return Ok(new
            {
                query = request.Query,
                found = true,
                results,
            });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { error = ex.Message });
        }
    }
}
