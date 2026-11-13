const express = require('express');
const path = require('path');
const { generateRSS } = require('../util/generate-rss'); // Adjust path as needed
const { generateBlogIndex } = require('../util/generate-blog-index');
const app = express();

// Generate RSS + markdown blog manifests once on startup
generateRSS();
generateBlogIndex();

const ROOT = path.join(__dirname, '..');
// Build commit for the site footer. Vercel exposes the deployed commit as
// VERCEL_GIT_COMMIT_SHA; locally, fall back to asking git.
app.get('/api/version', (req, res) => {
  let sha = process.env.VERCEL_GIT_COMMIT_SHA || null;
  if (!sha) {
    try {
      sha = require('child_process').execSync('git rev-parse HEAD', { cwd: ROOT, stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim();
    } catch (_) { /* no git available */ }
  }
  res.set('Cache-Control', 'public, max-age=300');
  res.json({ sha });
});

// Old per-section blog pages were merged into blogs.html
app.get(['/tech-blog.html', '/tech-blog'], (req, res) => res.redirect(301, '/blogs.html#tech'));
app.get(['/life-blog.html', '/life-blog'], (req, res) => res.redirect(301, '/blogs.html#life'));

// Serve static files from the root directory
app.use(express.static(path.join(__dirname, '..')));

// Handle RSS feed specifically
app.get('/rss.xml', (req, res) => {
  res.sendFile(path.join(__dirname, '../rss.xml'));
});

// Fallback to index.html for any unmatched routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../index.html'));
});

// For local development
if (process.env.NODE_ENV !== 'production') {
  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });
}

// Export for serverless use
module.exports = app;