# GitHub Repo Insights (starter)

Getting started

1. Copy `.env.example` to `.env` and (optionally) set `GITHUB_TOKEN`.
2. Install dependencies and run:

```powershell
npm install
npm test
npm start
```

API
- GET /api/health — simple health check
- GET /api/repos/:owner — fetches up to 100 public repos for `:owner` and caches for 5 minutes
