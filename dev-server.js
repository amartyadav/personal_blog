// dev-server.js
const express = require('express');
const path = require('path');
const { generateRSS } = require('./util/generate-rss');
const app = express();
const port = process.env.PORT || 3000;

// Generate RSS feed on server start
generateRSS();

// Watch for file changes in blogs directory to regenerate RSS
const fs = require('fs');
fs.watch('./posts', (eventType, filename) => {
  if (filename && filename.endsWith('.html')) {
    console.log(`File ${filename} changed, regenerating RSS feed...`);
    generateRSS();
  }
});

// Serve static files
app.use(express.static(path.join(__dirname)));

// Fallback route
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(port, () => {
  console.log(`Development server running at http://localhost:${port}`);
});