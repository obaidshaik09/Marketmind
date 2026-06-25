using DocumentFormat.OpenXml.Packaging;
using DocumentFormat.OpenXml.Wordprocessing;
using UglyToad.PdfPig;

namespace MarketMind.Rag.Services;

public class TextExtractionService
{
    private static readonly HashSet<string> Allowed = new(StringComparer.OrdinalIgnoreCase)
    {
        ".txt", ".md", ".pdf", ".docx",
        "text/plain", "text/markdown", "application/pdf",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    };

    public bool IsSupported(string fileName, string contentType)
    {
        var ext = Path.GetExtension(fileName);
        return Allowed.Contains(ext) || Allowed.Contains(contentType);
    }

    public async Task<string> ExtractAsync(Stream stream, string fileName, string contentType)
    {
        var ext = Path.GetExtension(fileName).ToLowerInvariant();
        if (ext is ".txt" or ".md" || contentType.StartsWith("text/"))
        {
            using var reader = new StreamReader(stream);
            return await reader.ReadToEndAsync();
        }
        if (ext == ".pdf" || contentType == "application/pdf")
            return ExtractPdf(stream);
        if (ext == ".docx" || contentType.Contains("wordprocessingml"))
            return ExtractDocx(stream);
        throw new InvalidOperationException("Unsupported file type. Use .txt, .md, .pdf, or .docx.");
    }

    private static string ExtractPdf(Stream stream)
    {
        using var pdf = PdfDocument.Open(stream);
        return string.Join("\n", pdf.GetPages().Select(p => p.Text)).Trim();
    }

    private static string ExtractDocx(Stream stream)
    {
        using var doc = WordprocessingDocument.Open(stream, false);
        var body = doc.MainDocumentPart?.Document?.Body;
        if (body == null) return string.Empty;
        return string.Join("\n", body.Descendants<Text>().Select(t => t.Text)).Trim();
    }
}
