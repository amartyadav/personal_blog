// Rewrites SITE_LAST_UPDATED in js/footer.js to today's date (YYYY-MM-DD).
// Run by .githooks/pre-commit on every commit (once enabled), or by hand:
//   npm run stamp
const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, '..', 'js', 'footer.js');
const now = new Date();
const today = [
  now.getFullYear(),
  String(now.getMonth() + 1).padStart(2, '0'),
  String(now.getDate()).padStart(2, '0'),
].join('-');

const src = fs.readFileSync(file, 'utf8');
if (!/const SITE_LAST_UPDATED = '[^']*';/.test(src)) {
  console.error('stamp-last-updated: SITE_LAST_UPDATED not found in js/footer.js');
  process.exit(1);
}
fs.writeFileSync(file, src.replace(/const SITE_LAST_UPDATED = '[^']*';/, `const SITE_LAST_UPDATED = '${today}';`));
console.log(`Last updated -> ${today}`);
