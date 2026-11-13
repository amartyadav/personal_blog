// Site-wide footer: contact email + "last updated" date.
//
// Each page carries a static <footer class="site-footer"> with the email (so it
// works without JS); this script adds the last-updated date and shared styling.
//
// SITE_LAST_UPDATED is rewritten automatically on every commit by
// .githooks/pre-commit → util/stamp-last-updated.js. Don't edit it by hand.
const SITE_LAST_UPDATED = '2026-11-13';

(function () {
    const style = document.createElement('style');
    style.textContent = `
        .site-footer {
            margin-top: 40px;
            padding-top: 12px;
            border-top: 1px solid #ccc;
            font-size: 0.85em;
            color: #666;
        }
        .site-footer p { margin: 4px 0; font-size: inherit; }
    `;
    document.head.appendChild(style);

    const [y, m, d] = SITE_LAST_UPDATED.split('-').map(Number);
    const pretty = new Date(Date.UTC(y, m - 1, d)).toLocaleDateString('en-GB', {
        day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC',
    });

    document.querySelectorAll('.site-footer').forEach(footer => {
        const p = document.createElement('p');
        p.innerHTML = `Last updated: <time datetime="${SITE_LAST_UPDATED}">${pretty}</time>`;
        footer.appendChild(p);
    });
})();
