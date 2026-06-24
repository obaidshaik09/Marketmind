# MarketMind — US Career Coaching Platform

AI career coach with **tool calling**, **web search**, **file attachments**, **resume builder**, and **skill-up tools** — runs entirely in the browser.

## Quick start

```bash
cd marketmind-react
npm install
cp .env.example .env
# Add REACT_APP_SERPAPI_API_KEY (free at serpapi.com) for web search
npm start
```

Paste your **Anthropic API key** when the app opens. The key stays in memory for your session only.

## Browser-only architecture

| What | How |
|------|-----|
| Anthropic API | Paste key in app each session |
| Web search | `REACT_APP_SERPAPI_API_KEY` in root `.env` |
| Web fetch | Direct browser fetch (some job URLs blocked by CORS) |
| Resume files | Attach `.txt`, `.pdf`, or `.docx` in chat |
| Tools | `src/agent/` runs client-side |

No backend server is required for the professor demo. The `server/` folder is kept for a future class topic.

## Tools

| Tool | What it does |
|------|-------------|
| `web_search` | Live salaries, job trends (needs SerpAPI key in `.env`) |
| `fetch_url` | Read public URLs (CORS may block some sites) |
| `build_resume` | Build US resume from scratch |
| `analyze_resume` | ATS review of pasted or attached resume |
| `skill_quiz` | Practice quizzes with grading |
| `skill_up` | Learning plans + hands-on tasks |
| `calculator` | Salary math |

## Demo prompts

1. Attach a `.docx` resume → *"Review this and suggest improvements"*
2. *"What are entry-level data analyst salaries in Texas?"* (web search)
3. *"Help me build a resume from scratch — CS new grad"* (build_resume)
4. *"Quiz me on 5 SQL basics"* (skill_quiz)

## Notes

- Restart `npm start` after changing `.env`
- `REACT_APP_*` keys are visible in the built JS bundle — use a free-tier SerpAPI key for class demos
