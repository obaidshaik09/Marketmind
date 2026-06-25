using MarketMind.Rag.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace MarketMind.Rag.Controllers;

[ApiController]
[Route("api")]
public class HealthController(RagDbContext db) : ControllerBase
{
    [HttpGet("health")]
    public async Task<IActionResult> Health()
    {
        try
        {
            var canConnect = await db.Database.CanConnectAsync();
            var docCount = canConnect ? await db.Documents.CountAsync() : 0;
            return Ok(new { status = canConnect ? "ok" : "degraded", database = canConnect, documentCount = docCount });
        }
        catch (Exception ex)
        {
            return StatusCode(503, new { status = "error", message = ex.Message });
        }
    }
}
