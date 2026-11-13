// dev-server.js
const express = require('express');
const path = require('path');
const { generateRSS } = require('./util/generate-rss');
const { generateBlogIndex } = require('./util/generate-blog-index');
const app = express();
const port = process.env.PORT || 3000;

// Generate RSS feed + markdown blog manifests on server start
generateRSS();
generateBlogIndex();

// Watch for file changes in posts directory to regenerate feeds/manifests.
// { recursive: true } so changes in posts/tech and posts/life are caught too.
const fs = require('fs');
fs.watch('./posts', { recursive: true }, (eventType, filename) => {
  if (!filename) return;
  const name = filename.toString();
  if (name.endsWith('.html')) {
    console.log(`File ${name} changed, regenerating RSS feed...`);
    generateRSS();
  }
  if (name.endsWith('.md')) {
    console.log(`File ${name} changed, regenerating blog manifests and RSS feeds...`);
    generateBlogIndex();
    generateRSS();
  }
});

const ROOT = __dirname;
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

// Serve static files
app.use(express.static(path.join(__dirname)));

// Fallback route
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(port, () => {
  console.log(`Development server running at http://localhost:${port}`);
});