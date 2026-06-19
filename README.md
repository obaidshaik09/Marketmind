# MarketMind — React App

An AI marketing profile and strategy assistant, rebuilt as a React application
from the original single-file HTML chatbot. Includes a **Chatbot** page and a
**How It Works** page, with navigation between them.

## Project structure

```
marketmind-react/
├── public/
│   ├── index.html
│   └── manifest.json
├── src/
│   ├── components/        # Reusable UI pieces (Sidebar, ChatInput, MessageBubble, NavBar, ...)
│   ├── pages/              # ChatbotPage.jsx, HowItWorksPage.jsx
│   ├── data/                # Topic list, suggested-question chips, labels
│   ├── services/            # chatApi.js — calls our own backend, never Anthropic directly
│   ├── utils/                # Message formatting/escaping helpers
│   ├── styles/                # Plain CSS, organized per area (global, navbar, chatbot, how-it-works)
│   ├── App.jsx
│   └── index.js
├── server/                  # Small Express backend that holds the real API key
│   ├── index.js
│   ├── package.json
│   └── .env.example
├── package.json             # Frontend (Create React App)
├── .env.example              # Frontend env example (no secrets)
└── .gitignore
```

## Why is there a `server/` folder?

A React app is a static bundle that ships to every visitor's browser. Any
`REACT_APP_*` variable gets baked directly into that bundle — so a real
Anthropic API key must never live in the React app itself.

Instead, the real key lives in `server/.env`, read only by the small Express
server in `server/index.js`. The React app calls that server's `/api/chat`
endpoint, and the server attaches the key when it talks to Anthropic. The
browser never sees the key, so it can't end up in dev tools, browser
history, or a public GitHub repo.

## Setup

### 1. Install dependencies

```bash
npm install
cd server && npm install && cd ..
```

### 2. Add your API key (backend only)

```bash
cp server/.env.example server/.env
```

Open `server/.env` and set:

```
ANTHROPIC_API_KEY=sk-ant-your-real-key-here
PORT=5000
```

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

## Building for production

```bash
npm run build
```

This outputs a static bundle in `/build`. Serve it with any static host, and
deploy `server/` separately (e.g. on a small Node host) with
`ANTHROPIC_API_KEY` set as a real environment variable (not a committed
`.env` file) on that host.

## Security notes

- `server/.env` and any `.env*` file are git-ignored — never commit them.
- The API key is only ever read server-side; it is not present anywhere in
  the React bundle or browser network requests.
- If you fork or share this project, double check `server/.env` is not
  included before pushing to a public repository.
