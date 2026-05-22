# FisherSafe AI 🐟

Modern maritime safety dashboard for Karnataka fishermen with AI briefings, weather, zones, and SOS.

## Setup

```bash
npm install   # or: bun install
cp .env.example .env
# Edit .env and add your GROQ_API_KEY (free at https://console.groq.com)
npm run dev   # or: bun run dev
```

Open http://localhost:5173

## Tech Stack
- TanStack Start v1 (React 19 + Vite 7)
- Tailwind CSS v4
- Groq AI (Llama 3.3 70B)
- Open-Meteo weather API
