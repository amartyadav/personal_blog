// Maths + code rendering for hand-written HTML posts in /posts.
//
// Loads KaTeX only if the page contains TeX delimiters, and highlight.js only
// if it contains <pre><code> blocks, so plain essays stay lightweight.
// Supported maths delimiters: $...$, \(...\), $$...$$, \[...\]
// Code: <pre><code class="language-c">...</code></pre>
(function () {
    const KATEX = 'https://cdn.jsdelivr.net/npm/katex@0.16.11/dist';
    const HLJS = 'https://cdn.jsdelivr.net/npm/@highlightjs/cdn-assets@11.10.0';

    // themeCss: 'light' | 'dark' marks a stylesheet that /js/theme.js toggles.
    function css(href, themeCss) {
        const l = document.createElement('link');
        l.rel = 'stylesheet';
        l.href = href;
        document.head.appendChild(l);
        if (themeCss) {
            l.dataset.themeCss = themeCss;
            const current = window.siteTheme ? window.siteTheme() : 'light';
            l.disabled = themeCss !== current;
        }
    }

    function js(src) {
        return new Promise((resolve, reject) => {
            const s = document.createElement('script');
            s.src = src;
            s.onload = resolve;
            s.onerror = reject;
            document.head.appendChild(s);
        });
    }

    function run() {
        const root = document.querySelector('.container') || document.body;
        const text = root.textContent;

        if (/\$[^$\s][^$]*\$|\\\(|\\\[/.test(text)) {
            css(`${KATEX}/katex.min.css`);
            js(`${KATEX}/katex.min.js`)
                .then(() => js(`${KATEX}/contrib/auto-render.min.js`))
                .then(() => window.renderMathInElement(root, {
                    delimiters: [
                        { left: '$$', right: '$$', display: true },
                        { left: '\\[', right: '\\]', display: true },
                        { left: '$', right: '$', display: false },
                        { left: '\\(', right: '\\)', display: false },
                    ],
                    throwOnError: false,
                }))
                .catch(() => {});
        }

        if (root.querySelector('pre code')) {
            css(`${HLJS}/styles/github.min.css`, 'light');
            css(`${HLJS}/styles/github-dark.min.css`, 'dark');
            js(`${HLJS}/highlight.min.js`)
                .then(() => window.hljs.highlightAll())
                .catch(() => {});
        }
    }

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run);
    else run();
})();
