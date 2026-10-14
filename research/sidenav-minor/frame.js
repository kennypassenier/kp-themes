// The app pages of research/sidenav-edge wear the theme of the page around
// them: the review dialog switches the demo's theme, and every frame follows,
// its register loaded first so it never wears a theme without it. Opened on
// their own, `?theme=<name>` (which wins) or the stored theme js/auto.js put
// on the root, with its register.
import { applyTheme } from '../../js/theme-core.js';
import { ensureRegister } from '../../js/lazy-register.js';

const PATTERN = '../../css/{theme}-register.css';

/** @param {string | null} theme */
function follow(theme) {
    if (!theme) return;
    void ensureRegister(theme, { pattern: PATTERN }).then(() => applyTheme(theme, { announce: false }));
}

const asked = new URLSearchParams(location.search).get('theme');
/** @type {HTMLElement | null} */
let outer = null;
try {
    outer = window.parent !== window ? window.parent.document.documentElement : null;
} catch {
    outer = null;
}
if (asked) follow(asked);
else if (!outer) follow(document.documentElement.getAttribute('data-theme'));
else {
    follow(outer.getAttribute('data-theme'));
    new MutationObserver(() => follow(outer?.getAttribute('data-theme') ?? null)).observe(outer, { attributes: true, attributeFilter: ['data-theme'] });
}
