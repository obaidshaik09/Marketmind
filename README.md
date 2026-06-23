# MarketMind — US Career Coaching Platform

AI career coach with **tool calling**, **web search**, **URL fetch**, **resume builder**, and **skill-up tools**.

## Fix web search & web fetch

These tools need the **backend server** (browser alone cannot fetch Indeed/LinkedIn or SerpAPI reliably).

### Terminal 1 — Backend
```bash
cd marketmind-react
cd server
cp .env.example .env
# Edit server/.env — add SERPAPI_API_KEY (free at serpapi.com)
cd ..
npm run server
```

### Terminal 2 — Frontend
```bash
cd marketmind-react
npm start
```

The React app proxies `/api/*` to `localhost:5000` automatically.

## Tools

| Tool | What it does |
|------|-------------|
| `web_search` | Live salaries, job trends (needs server + SerpAPI key) |
| `fetch_url` | Read job posting URLs (needs server) |
| `build_resume` | Build US resume from scratch |
| `analyze_resume` | ATS review of pasted resume |
| `skill_quiz` | Practice quizzes with grading |
| `skill_up` | Learning plans + hands-on tasks |
| `calculator` | Salary math |

## Demo prompts

- *"What are entry-level data analyst salaries in Texas?"* (web search)
- Paste job URL → *"Analyze this posting"* (fetch_url)
- *"Help me build a resume from scratch — I'm a CS new grad"* (build_resume)
- *"Give me a 2-week JavaScript skill-up plan with tasks"* (skill_up)
