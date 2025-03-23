const express = require('express');
const path = require('path');
const { generateRSS } = require('../util/generate-rss'); // Adjust path as needed
const app = express();

// Generate RSS once on startup
generateRSS();

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