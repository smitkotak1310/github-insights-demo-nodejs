const express = require('express');
const router = express.Router();
const githubService = require('../githubService');

router.get('/:owner', async (req, res) => {
  const owner = req.params.owner;
  if (!owner) return res.status(400).json({ error: 'owner is required' });
  try {
    const data = await githubService.getRepos(owner);
    res.json(data);
  } catch (err) {
    console.error('Error fetching repos:', err.message || err);
    res.status(500).json({ error: 'Failed to fetch repos', details: err.message });
  }
});

module.exports = router;
