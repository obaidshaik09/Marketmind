# MarketMind — React Agent

An AI marketing strategy **agent** with tool-calling, built as a React
application. Includes a **Chatbot** page and a **How It Works** page (which
explains what tool calling is, and how it differs from a plain chatbot),
with navigation between them.

## Project structure

```
marketmind-react/
├── public/
│   ├── index.html
│   └── manifest.json
├── src/
│   ├── components/        # Sidebar, ChatInput, MessageBubble, ToolCallBadge, SetupBanner, NavBar, ...
│   ├── pages/              # ChatbotPage.jsx, HowItWorksPage.jsx
│   ├── data/                # Topic list, suggested-question chips, labels
│   ├── services/            # chatApi.js — calls our own backend, never Anthropic/SerpAPI directly
│   ├── utils/                # Message formatting/escaping helpers
│   ├── styles/                # Plain CSS, organized per area (global, navbar, chatbot, how-it-works)
│   ├── App.jsx
│   └── index.js
├── server/                  # Express backend that holds the real API keys and runs the agent loop
│   ├── index.js              # Express app + the agent loop (calls Claude, executes tools, repeats)
│   ├── tools.js               # Tool definitions + executors: web_search, calculator, fetch_url
│   ├── package.json
│   └── .env.example
├── package.json             # Frontend (Create React App)
├── .env.example              # Frontend env example (no secrets)
└── .gitignore
```

## What's an "agent" vs. a "chatbot"?

A plain chatbot sends your message to an LLM and prints whatever text comes
back. An **agent** can also decide, mid-conversation, that it needs to *do*
something — search the web, run a calculation, fetch a page — before it can
answer well. The full explanation (with a request/response diagram and a
Messages API vs. Tools comparison table) is built into the app itself: open
the **How It Works** page after you start the app.

### Tools available to the agent

| Tool | What it does |
|---|---|
| `web_search` | Searches the web via SerpAPI for current marketing stats, trends, or news |
| `calculator` | Evaluates math expressions precisely (ROAS, CAC, conversion rates, budgets) |
| `fetch_url` | Reads the text content of a web page you share, for summarizing/analysis |

`calculator` and `fetch_url` work out of the box. `web_search` requires a
free SerpAPI key (see setup below) — until you add one, the agent will
still run fine, but `web_search` will report that it isn't configured
instead of returning results, and the in-app setup banner will remind you.

## Why is there a `server/` folder?

A React app is a static bundle that ships to every visitor's browser. Any
`REACT_APP_*` variable gets baked directly into that bundle — so real API
keys must never live in the React app itself. This also matters more with
an agent: tools like `fetch_url` make outbound network requests, which
should only ever happen on a server you control, never directly from a
stranger's browser.

Both real keys live in `server/.env`, read only by the Express server in
`server/index.js`. That server also runs the full **agent loop**: it sends
your conversation + the tool definitions to Claude, and if Claude asks to
use a tool, the server executes it and sends the result back — repeating
until Claude has a final answer. The browser only ever sees the final
answer and a short summary of which tools were used; it never sees a key
and never executes a tool itself.

## Setup

### 1. Install dependencies

```bash
npm install
cd server && npm install && cd ..
```

### 2. Add your API keys (backend only)

```bash
cp server/.env.example server/.env
```

Open `server/.env` and set:

```
ANTHROPIC_API_KEY=sk-ant-your-real-key-here
SERPAPI_API_KEY=your-serpapi-key-here
PORT=5000
```

- Get an Anthropic key at https://console.anthropic.com
- Get a free-tier SerpAPI key at https://serpapi.com (optional — needed
  only for the `web_search` tool)

`server/.env` is listed in `.gitignore` and will never be committed.

### 3. (Optional) Frontend env file

Only needed if you deploy the frontend and backend separately:

```bash
cp .env.example .env
```

For local development you can leave `.env` unset — the `"proxy"` field in
`package.json` already forwards `/api/*` requests from the React dev server
to `http://localhost:5000`.

## Running the app

Run frontend and backend together:

```bash
npm run dev
```

This starts the Express server on `http://localhost:5000` and the React app
on `http://localhost:3000`. Open `http://localhost:3000` in your browser.

Or run them separately, in two terminals:

```bash
npm run server   # backend on :5000
npm start         # frontend on :3000
```

If you add or change anything in `server/.env`, restart the server
(`npm run server` or `npm run dev`) for the change to take effect.

## Building for production

```bash
npm run build
```

This outputs a static bundle in `/build`. Serve it with any static host, and
deploy `server/` separately (e.g. on a small Node host) with
`ANTHROPIC_API_KEY` and `SERPAPI_API_KEY` set as real environment variables
(not a committed `.env` file) on that host.

## Security notes

- `server/.env` and any `.env*` file are git-ignored — never commit them.
- Both API keys are only ever read server-side; neither is present anywhere
  in the React bundle or browser network requests.
- The `calculator` tool only evaluates a strict allowlist of numeric/math
  characters (no arbitrary code execution). The `fetch_url` tool only
  follows `http(s)://` URLs and caps how much page text it returns.
- If you fork or share this project, double check `server/.env` is not
  included before pushing to a public repository.
