const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Blog sections: each markdown directory maps to a JSON manifest the
// corresponding *-blog.html listing page fetches at runtime.
const sections = [
  { dir: 'posts/tech', out: 'tech-posts.json' },
  { dir: 'posts/life', out: 'life-posts.json' },
];

// Parse a very small subset of YAML front-matter delimited by leading `---`.
// Supported: `key: value` lines, plus list values as `[a, b]` or `a, b`.
function parseFrontMatter(raw) {
  const match = raw.match(/^﻿?---\s*\r?\n([\s\S]*?)\r?\n---\s*\r?\n?/);
  if (!match) return { data: {}, body: raw };

  const data = {};
  for (const line of match[1].split(/\r?\n/)) {
    const kv = line.match(/^([A-Za-z0-9_]+)\s*:\s*(.*)$/);
    if (!kv) continue;
    const key = kv[1].trim();
    let value = kv[2].trim();
    // Strip surrounding quotes
    value = value.replace(/^["']|["']$/g, '');
    if (key === 'tags') {
      value = value.replace(/^\[|\]$/g, '');
      data.tags = value
        ? value.split(',').map(t => t.replace(/^["']|["']$/g, '').trim()).filter(Boolean)
        : [];
    } else {
      data[key] = value;
    }
  }
  return { data, body: raw.slice(match[0].length) };
}

function estimateReadTime(text) {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.round(words / 200));
  return `${minutes} min read`;
}

function toDateString(d) {
  return new Date(d).toISOString().slice(0, 10); // YYYY-MM-DD
}

function extractPost(filePath) {
  const raw = fs.readFileSync(filePath, 'utf8');
  const { data, body } = parseFrontMatter(raw);
  const slug = path.basename(filePath, '.md');
  const stats = fs.statSync(filePath);

  // Title: front-matter → first markdown H1 → filename
  const h1 = body.match(/^#\s+(.+)$/m);
  const title = data.title || (h1 ? h1[1].trim() : slug);

  // Excerpt: front-matter → first non-heading, non-empty paragraph
  let excerpt = data.excerpt || '';
  if (!excerpt) {
    for (const block of body.split(/\r?\n\s*\r?\n/)) {
      const t = block.trim();
      if (!t || t.startsWith('#') || t.startsWith('---') || t.startsWith('```')) continue;
      excerpt = t.replace(/[*_`>#]/g, '').replace(/\s+/g, ' ').trim();
      if (excerpt.length > 220) excerpt = excerpt.slice(0, 220).trim() + '…';
      break;
    }
  }

  return {
    slug,
    title,
    date: data.date || toDateString(stats.mtime),
    readTime: data.readTime || estimateReadTime(body),
    excerpt,
    tags: data.tags || [],
    _sort: data.date ? new Date(data.date).getTime() : stats.mtime.getTime(),
  };
}

function generateBlogIndex() {
  for (const { dir, out } of sections) {
    const files = glob.sync(`${dir}/*.md`);
    const posts = files
      .map(extractPost)
      .sort((a, b) => b._sort - a._sort)
      .map(({ _sort, ...post }) => post); // drop internal sort key

    fs.writeFileSync(out, JSON.stringify(posts, null, 2) + '\n');
    console.log(`Generated ${out} (${posts.length} post${posts.length === 1 ? '' : 's'})`);
  }
}

if (require.main === module) {
  generateBlogIndex();
} else {
  module.exports = { generateBlogIndex };
}
