# MarketMind — US Career Coaching Platform

AI career coach with **tool calling**, **RAG knowledge base**, **web search**, **file attachments**, and **skill-up tools**.

## Quick start (Phase 2 — with RAG)

### Terminal 1 — RAG API (.NET 10)
```bash
cd MarketMind.Rag
cp appsettings.Development.example.json appsettings.Development.json
# Edit appsettings.Development.json — Postgres password + OpenRouter key
dotnet run
```
Runs on **http://localhost:5001** and auto-creates `marketmind_rag` database.

### Terminal 2 — React app
```bash
cd marketmind-react
npm install
cp .env.example .env
npm start
```

Paste your **Anthropic API key** when the app opens.

## Architecture

| Component | Purpose |
|-----------|---------|
| React app (`:3000`) | Chat agent + Knowledge Base upload UI |
| MarketMind.Rag (`:5001`) | Ingest docs, embed via OpenRouter, search PostgreSQL |
| PostgreSQL + pgvector | Stores document chunks and embeddings |
| Anthropic API | Chat LLM (pasted each session) |
| OpenRouter | Embeddings (`text-embedding-3-small`) |
| SerpAPI | Live web search (optional, in React `.env`) |

## Knowledge Base (RAG)

1. Open **Knowledge Base** in the nav bar
2. Upload `.txt`, `.md`, `.pdf`, or `.docx` IT/career docs
3. API chunks text, embeds via OpenRouter, stores in PostgreSQL
4. Agent tool `get_relevant_information` searches with **≥50% similarity**
5. If no match → agent falls back to `web_search`

Sample file: `MarketMind.Rag/sample-data/sql-interview-guide.md`

## Tools

| Tool | What it does |
|------|-------------|
| `get_relevant_information` | Search internal knowledge base (RAG API) |
| `web_search` | Live salaries, job trends (SerpAPI) |
| `fetch_url` | Read public URLs (CORS may block some sites) |
| `build_resume` | Build US resume from scratch |
| `analyze_resume` | ATS review of pasted or attached resume |
| `skill_quiz` | Practice quizzes with grading |
| `skill_up` | Learning plans + hands-on tasks |
| `calculator` | Salary math |

## Demo script

1. Upload SQL guide on Knowledge Base page
2. Chat: *"What are SQL JOIN types for interviews?"* → RAG tool
3. Chat: *"What are data analyst salaries in Texas?"* → web_search
4. Attach resume → *"Review this resume"*

## Notes

- RAG secrets go in `MarketMind.Rag/appsettings.Development.json` (gitignored)
- Restart `npm start` after changing React `.env`
- Old Node `server/` folder is unused; RAG uses .NET 10 API
