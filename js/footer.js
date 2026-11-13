// Site-wide footer: contact email, last-updated date, build commit, source
// link, and the weight of the page you're reading.
//
// Each page carries a static <footer class="site-footer"> with the email (so it
// works without JS); this script appends the rest. Styles live in /css/site.css.
//
// SITE_LAST_UPDATED is rewritten automatically on every commit by
// .githooks/pre-commit → util/stamp-last-updated.js. Don't edit it by hand.
const SITE_LAST_UPDATED = '2026-11-13';

(function () {
    const REPO = 'https://github.com/amartyadav/personal_blog';

    const footers = document.querySelectorAll('.site-footer');
    if (!footers.length) return;

    const [y, m, d] = SITE_LAST_UPDATED.split('-').map(Number);
    const pretty = new Date(Date.UTC(y, m - 1, d)).toLocaleDateString('en-GB', {
        day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC',
    });

    // Line 1: last updated · build <sha> · source
    const buildLine = document.createElement('p');
    buildLine.innerHTML =
        `Last updated: <time datetime="${SITE_LAST_UPDATED}">${pretty}</time>` +
        `<span class="build-sha"></span>` +
        ` · <a href="${REPO}">source</a>`;

    // Line 2: page weight · no trackers
    const weightLine = document.createElement('p');
    weightLine.innerHTML = `<span class="page-weight">This page: … KB</span> · no trackers`;

    footers.forEach(f => {
        f.appendChild(buildLine.cloneNode(true));
        f.appendChild(weightLine.cloneNode(true));
    });

    // Build commit, from the first-party /api/version endpoint (server/server.js).
    fetch('/api/version')
        .then(r => (r.ok ? r.json() : null))
        .then(v => {
            if (!v || !v.sha) return;
            const short = v.sha.slice(0, 7);
            document.querySelectorAll('.build-sha').forEach(el => {
                el.innerHTML = ` · build <a href="${REPO}/commit/${v.sha}"><code>${short}</code></a>`;
            });
        })
        .catch(() => {});

    // Page weight: bytes over the wire for this document and everything it loaded,
    // measured with the browser's Resource Timing API once the page has settled.
    function measure() {
        const entries = [
            ...performance.getEntriesByType('navigation'),
            ...performance.getEntriesByType('resource'),
        ];
        const bytes = entries.reduce((sum, e) => sum + (e.encodedBodySize || e.transferSize || 0), 0);
        if (!bytes) return;
        const kb = (bytes / 1024).toFixed(1);
        document.querySelectorAll('.page-weight').forEach(el => {
            el.textContent = `This page: ${kb} KB`;
            el.title = `${entries.length} requests, ${bytes.toLocaleString()} bytes (compressed)`;
        });
    }

    if (document.readyState === 'complete') setTimeout(measure, 1500);
    else window.addEventListener('load', () => setTimeout(measure, 1500));
})();
