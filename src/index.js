require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const reposRouter = require('./routes/repos');

const path = require('path');
const app = express();
app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// Serve static UI from /public
app.use(express.static(path.join(__dirname, '..', 'public')));

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));
app.use('/api/repos', reposRouter);

// fallback to index.html for SPA-style routing
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

const port = process.env.PORT || 3001;
if (require.main === module) {
  app.listen(port, () => console.log(`GitHub Insights listening on ${port}`));
}

module.exports = app;
