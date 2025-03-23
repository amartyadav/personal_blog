const fs = require('fs');
const path = require('path');
const glob = require('glob');
const { JSDOM } = require('jsdom');

// Configuration
const blogDir = './posts';
const websiteUrl = 'https://amartyadav.com';
const blogTitle = "Amartya Yadav's Blog";
const blogDescription = "Thoughts on technology, society, politics, and high-performance computing.";

// Function to extract metadata from HTML files
function extractMetadata(filePath) {
  const html = fs.readFileSync(filePath, 'utf8');
  const dom = new JSDOM(html);
  const document = dom.window.document;
  
  // Extract title and description using DOM methods
  const titleElement = document.querySelector('h1') || document.querySelector('h2');
  const title = titleElement ? titleElement.textContent.trim() : 'Untitled';
  
  const paragraphs = document.querySelectorAll('p');
  let description = '';
  if (paragraphs.length > 0) {
    description = paragraphs[0].textContent.trim();
    if (description.length > 250) description = description.substring(0, 250) + '...';
  }
  
  // Get last modified date from file stats
  const stats = fs.statSync(filePath);
  const pubDate = stats.mtime;
  
  return {
    title,
    description,
    pubDate,
    link: `${websiteUrl}/posts/${path.basename(filePath)}`,
    guid: `${websiteUrl}/posts/${path.basename(filePath)}`
  };
}

// Generate RSS XML
function generateRSS() {
  // Get all HTML files in the blog directory
  const files = glob.sync(`${blogDir}/*.html`);
  
  // Extract metadata from each file
  const items = files.map(file => extractMetadata(file))
    .sort((a, b) => b.pubDate - a.pubDate); // Sort by date, newest first
  
  // Generate RSS XML
  const rss = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
<channel>
  <title>${blogTitle}</title>
  <link>${websiteUrl}</link>
  <description>${blogDescription}</description>
  <language>en-us</language>
  <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
  <atom:link href="${websiteUrl}/rss.xml" rel="self" type="application/rss+xml" />
  
  ${items.map(item => `
  <item>
    <title>${item.title}</title>
    <link>${item.link}</link>
    <description><![CDATA[${item.description}]]></description>
    <pubDate>${item.pubDate.toUTCString()}</pubDate>
    <guid>${item.guid}</guid>
  </item>
  `).join('')}
</channel>
</rss>`;
  
  // Write the RSS file
  fs.writeFileSync('rss.xml', rss);
  console.log('RSS feed generated successfully!');
}

// If running this script directly
if (require.main === module) {
  generateRSS();
} else {
  // Export for use in other files
  module.exports = { generateRSS };
}