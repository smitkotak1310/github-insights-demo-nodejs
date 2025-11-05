const axios = require('axios');
const NodeCache = require('node-cache');

const cache = new NodeCache({ stdTTL: 300 }); // 5 minutes
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

const axiosInstance = axios.create({
  baseURL: 'https://api.github.com',
  headers: GITHUB_TOKEN ? { Authorization: `token ${GITHUB_TOKEN}` } : undefined,
  timeout: 10000,
});

async function getRepos(owner) {
  const key = `repos:${owner}`;
  const cached = cache.get(key);
  if (cached) return { cached: true, data: cached };

  // fetch first page (up to 100) of user repos
  const res = await axiosInstance.get(`/users/${owner}/repos`, {
    params: { per_page: 100, sort: 'updated' },
  });

  const repos = (res.data || []).map((r) => ({
    name: r.name,
    full_name: r.full_name,
    html_url: r.html_url,
    stargazers_count: r.stargazers_count,
    forks_count: r.forks_count,
    language: r.language,
    updated_at: r.updated_at,
  }));

  cache.set(key, repos);
  return { cached: false, data: repos };
}

module.exports = { getRepos };
