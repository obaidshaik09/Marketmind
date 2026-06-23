# MarketMind — React Agent (browser-only)

An AI marketing strategy **agent** with tool-calling, built as a React
application that talks to Claude **directly from the browser** — no
backend server required. Includes a **Chatbot** page and a **How It
Works** page (which explains what tool calling is, how it differs from a
plain chatbot, and the security tradeoffs of this browser-only design),
with navigation between them.

## Project structure

```
marketmind-react/
├── public/
│   ├── index.html
│   └── manifest.json
├── src/
│   ├── components/        # Sidebar, ChatInput, MessageBubble, ToolCallBadge,
│   │                       # ApiKeySetup, SecurityBanner, NavBar, ...
│   ├── pages/              # ChatbotPage.jsx, HowItWorksPage.jsx
│   ├── data/                # Topic list, suggested-question chips, labels
│   ├── services/            # chatApi.js (agent loop) + tools.js (tool definitions/executors)
│   ├── utils/                # Message formatting/escaping helpers
│   ├── styles/                # Plain CSS, organized per area (global, navbar, chatbot, how-it-works)
│   ├── App.jsx
│   └── index.js
├── package.json
├── .env.example              # Optional SerpAPI key for web_search (no secret committed)
└── .gitignore
```

## How the API key works in this version

There is **no backend** and **no `.env` file for your Anthropic key**.
Instead, the app shows a setup screen the first time you open it — you
paste your Anthropic API key in, and it's kept only in React state (in
memory) for that browser tab. It is:

- ✅ Never written to disk
- ✅ Never sent anywhere except Anthropic's own API
- ✅ Cleared automatically when you refresh or close the tab
- ⚠️ **Visible to anyone who opens this browser tab's dev tools** during
  your session (e.g. the Network tab), since the request is made directly
  from client-side JavaScript

This is a deliberate simplicity tradeoff for a learning project: no
server to run, just `npm install` and `npm start`. It is **not** the
pattern to use for a real public deployment other people will use with
their own keys, or with a key you wouldn't want exposed. The **How It
Works** page in the app explains this in full, including how it differs
from a backend-proxy architecture.

## What's an "agent" vs. a "chatbot"?

A plain chatbot sends your message to an LLM and prints whatever text
comes back. An **agent** can also decide, mid-conversation, that it needs
to *do* something — search the web, run a calculation, fetch a page —
before it can answer well. In this version, the agent loop and every tool
call run entirely in the browser (see `src/services/chatApi.js` and
`src/services/tools.js`).

### Tools available to the agent

| Tool | What it does | Needs a key? |
|---|---|---|
| `calculator` | Evaluates math expressions precisely (ROAS, CAC, conversion rates, budgets) | No — runs locally |
| `web_search` | Searches the web via SerpAPI for current marketing stats, trends, or news | Optional `REACT_APP_SERPAPI_API_KEY` |
| `fetch_url` | Reads the text content of a web page you share, for summarizing/analysis | No, but many sites block direct browser requests (CORS) |

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. (Optional) Enable web search

```bash
cp .env.example .env
```

Add a free SerpAPI key from https://serpapi.com to `.env`:

```
REACT_APP_SERPAPI_API_KEY=your-serpapi-key-here
```

Skip this if you don't need `web_search` — the agent still works fine
without it; that one tool will just report it isn't configured.

**Note:** since this is a `REACT_APP_*` variable, it gets baked into the
built JS bundle just like any frontend env var — see the warning in
`.env.example`.

### 3. Run the app

```bash
npm start
```

Open `http://localhost:3000`. On first load, paste your Anthropic API key
into the setup screen to start chatting. Get a key at
https://console.anthropic.com if you don't have one.

## Building for production

```bash
npm run build
```

This outputs a static bundle in `/build` that can be served from any
static host — there's no backend to deploy alongside it.

## Security notes

- No real Anthropic key is ever stored in this repo — it's typed in by
  whoever uses the app, each session.
- `.env` (if you create one for the optional SerpAPI key) is git-ignored
  and never committed.
- The `calculator` tool only evaluates a strict allowlist of numeric/math
  characters (no arbitrary code execution).
- Because there's no backend, the Anthropic key is visible in this
  browser tab's network requests during the session — see the in-app How
  It Works page for the full explanation of this tradeoff.
