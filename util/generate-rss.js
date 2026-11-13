const fs = require('fs');
const path = require('path');
const glob = require('glob');
const { JSDOM } = require('jsdom');
const { extractPost } = require('./generate-blog-index');

// Generates one feed for the whole blog plus one per section:
//   rss.xml          everything
//   rss-tech.xml     Tech
//   rss-life.xml     Life & Literature
//   rss-general.xml  Society & General
//
// Sources:
//   posts/*.html      hand-written posts; need <meta name="date"> and
//                     <meta name="blog-section" content="tech|life|general">
//   posts/tech/*.md   markdown tech posts   (rendered by tech-post.html)
//   posts/life/*.md   markdown life posts   (rendered by life-post.html)
//
// Output is deterministic (dates come from the posts, not file mtimes), so
// regenerating doesn't produce a diff unless a post actually changed.

const websiteUrl = 'https://amartyadav.com';
const author = 'Amartya Yadav';

const FEEDS = [
  { file: 'rss.xml', section: null, title: `${author}'s Blog`,
    description: 'Thoughts on technology, society, literature, and high-performance computing.' },
  { file: 'rss-tech.xml', section: 'tech', title: `${author} — Tech`,
    description: 'HPC, parallel computing, numerical methods, and the projects I work on.' },
  { file: 'rss-life.xml', section: 'life', title: `${author} — Life & Literature`,
    description: 'Literature and personal writing: travel, places, books, and reflections.' },
  { file: 'rss-general.xml', section: 'general', title: `${author} — Society & General`,
    description: 'Essays on society, privacy, the internet, and other issues.' },
];

const escapeXml = s => String(s)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;').replace(/'/g, '&apos;');

const squash = s => s.replace(/\s+/g, ' ').trim();

function fromHtml(filePath) {
  const doc = new JSDOM(fs.readFileSync(filePath, 'utf8')).window.document;
  const meta = name => doc.querySelector(`meta[name="${name}"]`)?.getAttribute('content');

  const title = squash((doc.querySelector('h1') || doc.querySelector('h2'))?.textContent || 'Untitled');
  const firstPara = [...doc.querySelectorAll('.container p, article p, p')]
    .map(p => squash(p.textContent)).find(t => t.length > 40) || '';
  const description = firstPara.length > 280 ? firstPara.slice(0, 280).trim() + '…' : firstPara;

  const date = meta('date');
  const section = meta('blog-section');
  if (!date || !section) {
    console.warn(`generate-rss: ${filePath} is missing <meta name="date"> or <meta name="blog-section">; skipped`);
    return null;
  }

  const link = `${websiteUrl}/posts/${path.basename(filePath)}`;
  return { title, description, date: new Date(date), section, link };
}

function fromMarkdown(filePath, section, viewer) {
  const p = extractPost(filePath);
  return {
    title: p.title,
    description: p.excerpt,
    date: new Date(p.date),
    section,
    link: `${websiteUrl}/${viewer}?post=${encodeURIComponent(p.slug)}`,
  };
}

function collectItems() {
  return [
    ...glob.sync('posts/*.html').map(fromHtml),
    ...glob.sync('posts/tech/*.md').map(f => fromMarkdown(f, 'tech', 'tech-post.html')),
    ...glob.sync('posts/life/*.md').map(f => fromMarkdown(f, 'life', 'life-post.html')),
  ].filter(Boolean).sort((a, b) => b.date - a.date);
}

function renderFeed(feed, items) {
  const self = `${websiteUrl}/${feed.file}`;
  const lastBuild = items.length ? items[0].date : new Date(0);
  const page = feed.section ? `${websiteUrl}/blogs.html#${feed.section}` : `${websiteUrl}/blogs.html`;

  return `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
<channel>
  <title>${escapeXml(feed.title)}</title>
  <link>${escapeXml(page)}</link>
  <description>${escapeXml(feed.description)}</description>
  <language>en</language>
  <lastBuildDate>${lastBuild.toUTCString()}</lastBuildDate>
  <atom:link href="${escapeXml(self)}" rel="self" type="application/rss+xml" />
${items.map(item => `
  <item>
    <title>${escapeXml(item.title)}</title>
    <link>${escapeXml(item.link)}</link>
    <guid>${escapeXml(item.link)}</guid>
    <pubDate>${item.date.toUTCString()}</pubDate>
    <category>${item.section}</category>
    <description><![CDATA[${item.description}]]></description>
  </item>`).join('')}
</channel>
</rss>
`;
}

function generateRSS() {
  const items = collectItems();
  for (const feed of FEEDS) {
    const subset = feed.section ? items.filter(i => i.section === feed.section) : items;
    fs.writeFileSync(feed.file, renderFeed(feed, subset));
  }
  console.log(`RSS feeds generated (${items.length} items across ${FEEDS.length} feeds)`);
}

if (require.main === module) {
  generateRSS();
} else {
  module.exports = { generateRSS };
}
