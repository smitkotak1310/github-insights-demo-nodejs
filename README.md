# GitHub Repo Insights (starter)

Small starter project to fetch and cache basic repository metrics from the GitHub API.

Getting started

1. Copy `.env.example` to `.env` and (optionally) set `GITHUB_TOKEN`.
2. Install dependencies and run:

```powershell
cd github-insights
npm install
npm test
npm start
```

API
- GET /api/health — simple health check
- GET /api/repos/:owner — fetches up to 100 public repos for `:owner` and caches for 5 minutes

Notes
- This is a small, interview-friendly starter. Add OAuth, Redis caching, pagination, charts and tests to expand.
