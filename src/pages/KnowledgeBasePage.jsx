import { useCallback, useEffect, useRef, useState } from 'react';

const RAG_API = process.env.REACT_APP_RAG_API_URL || 'http://localhost:5001';

function DocumentUpload({ onUploaded }) {
  const fileRef = useRef(null);
  const [title, setTitle] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  async function handleUpload(file) {
    if (!file) return;
    setBusy(true);
    setError('');
    setSuccess('');
    const form = new FormData();
    form.append('file', file);
    if (title.trim()) form.append('title', title.trim());
    try {
      const res = await fetch(`${RAG_API}/api/rag/ingest`, { method: 'POST', body: form });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Upload failed');
      setSuccess(`Uploaded "${data.title}" — ${data.chunkCount} chunks embedded.`);
      setTitle('');
      if (fileRef.current) fileRef.current.value = '';
      onUploaded?.();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="kb-upload-card">
      <h3>Upload documentation</h3>
      <p className="kb-upload-hint">Supports .txt, .md, .pdf, .docx — text is chunked and embedded via OpenRouter.</p>
      <label className="kb-label" htmlFor="doc-title">Title (optional)</label>
      <input
        id="doc-title"
        className="kb-input"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="e.g. SQL Interview Guide"
      />
      <div className="kb-upload-row">
        <input
          ref={fileRef}
          type="file"
          accept=".txt,.md,.pdf,.docx,text/plain,text/markdown,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          disabled={busy}
          onChange={(e) => handleUpload(e.target.files?.[0])}
        />
      </div>
      {busy && <div className="kb-status">Embedding document… this may take a moment.</div>}
      {error && <div className="kb-error">{error}</div>}
      {success && <div className="kb-success">{success}</div>}
    </div>
  );
}

function KnowledgeBasePage() {
  const [documents, setDocuments] = useState([]);
  const [apiStatus, setApiStatus] = useState('checking');
  const [loadError, setLoadError] = useState('');

  const loadDocuments = useCallback(async () => {
    try {
      const health = await fetch(`${RAG_API}/api/health`);
      setApiStatus(health.ok ? 'online' : 'offline');
      const res = await fetch(`${RAG_API}/api/rag/documents`);
      if (!res.ok) throw new Error('Could not load documents');
      setDocuments(await res.json());
      setLoadError('');
    } catch (err) {
      setApiStatus('offline');
      setLoadError(err.message);
    }
  }, []);

  useEffect(() => { loadDocuments(); }, [loadDocuments]);

  async function handleDelete(id) {
    if (!window.confirm('Delete this document and all its embeddings?')) return;
    await fetch(`${RAG_API}/api/rag/documents/${id}`, { method: 'DELETE' });
    loadDocuments();
  }

  return (
    <div id="knowledge-base-page">
      <div className="kb-container">
        <div className="kb-header">
          <div className="kb-eyebrow">Phase 2 · RAG Pipeline</div>
          <h1>Knowledge Base</h1>
          <p>
            Upload IT and career documentation. The AI agent searches this database
            before falling back to web search (50% similarity threshold).
          </p>
          <div className={`kb-api-status kb-api-${apiStatus}`}>
            RAG API: {apiStatus === 'online' ? 'connected' : apiStatus === 'checking' ? 'checking…' : 'offline — run dotnet run in MarketMind.Rag'}
          </div>
        </div>

        <DocumentUpload onUploaded={loadDocuments} />

        <div className="kb-docs-section">
          <h2>Ingested documents ({documents.length})</h2>
          {loadError && <div className="kb-error">{loadError}</div>}
          {documents.length === 0 && !loadError && (
            <p className="kb-empty">No documents yet. Upload your first IT guide above.</p>
          )}
          {documents.length > 0 && (
            <div className="kb-doc-table-wrap">
              <table className="kb-doc-table">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>File</th>
                    <th>Chunks</th>
                    <th>Uploaded</th>
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {documents.map((doc) => (
                    <tr key={doc.id}>
                      <td>{doc.title}</td>
                      <td>{doc.fileName}</td>
                      <td>{doc.chunkCount}</td>
                      <td>{new Date(doc.uploadedAt).toLocaleString()}</td>
                      <td>
                        <button type="button" className="kb-delete-btn" onClick={() => handleDelete(doc.id)}>
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default KnowledgeBasePage;
