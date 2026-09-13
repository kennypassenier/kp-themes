// The catalogue shell: the theme switcher in the bar, and the page's
// memory of which theme the reviewer last chose. Everything a component
// needs is attached by js/auto.js; this file only drives the chrome.
import { THEMES } from '../js/theme-registry.js';
import { applyTheme } from '../js/theme-core.js';

const STORAGE_KEY = 'kp-catalogue-theme';

function fill(select) {
    for (const theme of THEMES) {
        const option = document.createElement('option');
        option.value = theme.name;
        option.textContent = `${theme.label}${theme.dark ? ' (dark)' : ''}`;
        select.append(option);
    }
}

function stored() {
    try {
        return localStorage.getItem(STORAGE_KEY);
    } catch {
        // A private window refuses the read; the page still has to work.
        return null;
    }
}

function remember(name) {
    try {
        localStorage.setItem(STORAGE_KEY, name);
    } catch {
        /* nothing to do: the choice simply does not survive the next page */
    }
}

const select = document.querySelector('[data-cat-theme]');
if (select) {
    fill(select);
    const start = stored() || document.documentElement.dataset.theme || 'formal';
    select.value = start;
    applyTheme(start);
    select.addEventListener('change', () => {
        applyTheme(select.value);
        remember(select.value);
    });
}

// Every page links the same devtools overlay, but a reviewer who never
// opens it should not pay for it: it loads on the first press of its key.
const toggle = document.querySelector('[data-cat-devtools]');
let loaded = null;
function loadDevtools() {
    loaded ??= import('./devtools.js').then((m) => m.openDevtools());
    return loaded;
}
toggle?.addEventListener('click', loadDevtools);
window.addEventListener('keydown', (event) => {
    if (event.altKey && !event.ctrlKey && !event.metaKey && event.key.toLowerCase() === 'd') {
        event.preventDefault();
        loadDevtools();
    }
});
