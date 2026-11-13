// Light/dark theme.
//
// Load this synchronously in <head> (no defer/async) so the theme is set before
// the page paints, with no flash of the wrong theme.
//
// - Sets <html data-theme="light|dark"> from the visitor's saved choice, or
//   their system preference if they haven't chosen.
// - Adds a toggle button to the end of the page's .nav-links.
// - Keeps theme-specific stylesheets in sync: <link data-theme-css="dark"> is
//   enabled only in dark mode, <link data-theme-css="light"> only in light.
// - Tells the Cusdis comments widget about changes.
(function () {
    const KEY = 'theme';
    const root = document.documentElement;
    const systemDark = window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : null;

    function saved() {
        try { return localStorage.getItem(KEY); } catch (_) { return null; }
    }

    function save(value) {
        try { localStorage.setItem(KEY, value); } catch (_) { /* private mode etc. */ }
    }

    function preferred() {
        const s = saved();
        if (s === 'light' || s === 'dark') return s;
        return systemDark && systemDark.matches ? 'dark' : 'light';
    }

    function syncStylesheets(theme) {
        document.querySelectorAll('link[data-theme-css]').forEach(link => {
            link.disabled = link.dataset.themeCss !== theme;
        });
    }

    function syncButton(theme) {
        document.querySelectorAll('.theme-toggle').forEach(btn => {
            const next = theme === 'dark' ? 'light' : 'dark';
            btn.textContent = theme === 'dark' ? '☀' : '☾';
            btn.setAttribute('aria-label', `Switch to ${next} mode`);
            btn.title = `Switch to ${next} mode`;
        });
    }

    function apply(theme) {
        root.dataset.theme = theme;
        syncStylesheets(theme);
        syncButton(theme);
        if (window.CUSDIS && typeof window.CUSDIS.setTheme === 'function') {
            window.CUSDIS.setTheme(theme);
        }
    }

    // Set immediately, before first paint.
    root.dataset.theme = preferred();

    // Follow the system setting live, unless the visitor picked a theme.
    if (systemDark && systemDark.addEventListener) {
        systemDark.addEventListener('change', () => {
            if (!saved()) apply(preferred());
        });
    }

    document.addEventListener('DOMContentLoaded', () => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'theme-toggle';
        btn.addEventListener('click', () => {
            const next = root.dataset.theme === 'dark' ? 'light' : 'dark';
            save(next);
            apply(next);
        });

        const nav = document.querySelector('.nav-links');
        if (nav) nav.appendChild(btn);
        else {
            btn.classList.add('floating');
            document.body.appendChild(btn);
        }

        apply(root.dataset.theme);
    });

    // Expose for other scripts (comments, post-enhance).
    window.siteTheme = () => root.dataset.theme;
})();
