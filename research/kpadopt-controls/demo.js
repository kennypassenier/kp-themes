// research/kpadopt-controls: what this page does that the package does not.
//   1. the theme buttons (register loaded first, then the theme set) and the lineup's registers;
//   2. the mock list under the live toolbar: it reads the toolbar's controls (never keeps a state of its own),
//      filters its rows, writes the counts back with setSegmentedCounts and the tags with setToolbarActive;
//   3. the loading rows' two buttons, the readout of the multi group, and a key line written with setKeys.
// The package's own attach functions (js/auto.js) run the controls themselves.
import { THEMES } from '../../js/theme-registry.js';
import { applyTheme, currentTheme } from '../../js/theme-core.js';
import { getSegmentedValues, setSegmentedCounts, setSegmentedValues } from '../../js/segmented.js';
import { setToolbarActive, toolbarSearch } from '../../js/toolbar.js';
import { setKeys } from '../../js/keys.js';

const note = document.querySelector('[data-cd-motion]');
if (note instanceof HTMLElement && matchMedia('(prefers-reduced-motion: reduce)').matches) note.hidden = false;

// ---- 1 · themes -----------------------------------------------------------
const registerUrl = (/** @type {string} */ theme) => new URL(`../../css/${theme}-register.css`, import.meta.url).href;

/** Load a theme's register once. @param {string} theme @returns {Promise<void>} */
function loadRegister(theme) {
    const present = [...document.querySelectorAll('link[rel="stylesheet"]')].some(
        (l) => /** @type {HTMLLinkElement} */ (l).href === registerUrl(theme),
    );
    if (present) return Promise.resolve();
    return new Promise((resolve) => {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = registerUrl(theme);
        link.setAttribute('data-kp-register', theme);
        link.addEventListener('load', () => resolve(), { once: true });
        link.addEventListener('error', () => resolve(), { once: true });
        document.head.append(link);
    });
}

function markTheme() {
    for (const button of document.querySelectorAll('[data-cd-theme]')) {
        button.setAttribute('aria-pressed', String(button.getAttribute('data-cd-theme') === currentTheme()));
    }
}

document.addEventListener('click', async (event) => {
    const button = event.target instanceof Element ? event.target.closest('[data-cd-theme]') : null;
    if (!button) return;
    const theme = button.getAttribute('data-cd-theme') ?? '';
    await loadRegister(theme);
    applyTheme(theme);
    markTheme();
});
markTheme();

// The lineup shows every theme at once, so every register is wanted.
if (document.querySelector('[data-cd-lineup]')) for (const { name } of THEMES) loadRegister(name);

// ---- 2 · the live list ----------------------------------------------------
const STATUS_WORD = { running: 'Running', stopped: 'Stopped', restarting: 'Restarting' };
const KIND_WORD = { web: 'Web', db: 'Database', job: 'Job' };
/** @param {Element} el @returns {Element | null} */
const groupOf = (el, name) => el.querySelector(`[data-cd-group="${name}"]`);

/** Draw the list under one live toolbar from the toolbar's own controls. @param {Element} toolbar */
function render(toolbar) {
    const root = toolbar.closest('[data-cd-live-root]') ?? document;
    const list = root.querySelector('[data-cd-list]');
    if (!list) return;
    const input = toolbarSearch(toolbar);
    const query = (input?.value ?? '').trim().toLowerCase();
    const status = groupOf(toolbar, 'status');
    const kind = groupOf(toolbar, 'kind');
    const view = groupOf(toolbar, 'view');
    const statusOn = status ? getSegmentedValues(status) : [];
    const kindOn = kind ? getSegmentedValues(kind) : [];
    const rows = [...list.querySelectorAll('.cd-list__row')];
    const matches = (/** @type {HTMLElement} */ row, /** @type {{status?: boolean, kind?: boolean}} */ skip = {}) =>
        (!query || (row.dataset.name ?? '').includes(query)) &&
        (skip.status || statusOn.length === 0 || statusOn.includes(row.dataset.status ?? '')) &&
        (skip.kind || kindOn.length === 0 || kindOn.includes(row.dataset.kind ?? ''));
    let shown = 0;
    for (const row of rows) {
        const on = matches(/** @type {HTMLElement} */ (row));
        row.toggleAttribute('hidden', !on);
        if (on) shown += 1;
    }
    list.querySelector('.cd-list__none')?.toggleAttribute('hidden', shown > 0);
    // Counts are exact for the rest of the filters: each group counts what turning its value on would show.
    /** @param {Element | null} group @param {'status'|'kind'} key */
    const counts = (group, key) => {
        if (!group) return;
        /** @type {Record<string, number>} */
        const n = {};
        for (const row of rows) {
            const el = /** @type {HTMLElement} */ (row);
            if (matches(el, { [key]: true })) n[el.dataset[key] ?? ''] = (n[el.dataset[key] ?? ''] ?? 0) + 1;
        }
        const values = key === 'status' ? Object.keys(STATUS_WORD) : Object.keys(KIND_WORD);
        setSegmentedCounts(group, Object.fromEntries(values.map((v) => [v, n[v] ?? 0])));
    };
    counts(status, 'status');
    counts(kind, 'kind');
    const count = toolbar.querySelector('[data-cd-count]');
    if (count) count.textContent = `${shown} of ${rows.length}`;
    if (view) list.setAttribute('data-view', getSegmentedValues(view)[0] ?? 'table');
    const filters = [
        ...(query ? [{ id: 'q', label: `Search: “${input?.value.trim()}”` }] : []),
        ...statusOn.map((v) => ({ id: `status:${v}`, label: `Status: ${STATUS_WORD[/** @type {'running'} */ (v)] ?? v}` })),
        ...kindOn.map((v) => ({ id: `kind:${v}`, label: `Kind: ${KIND_WORD[/** @type {'web'} */ (v)] ?? v}` })),
    ];
    setToolbarActive(toolbar, filters);
}

/** @param {Event} event */
const liveOf = (event) => (event.target instanceof Element ? event.target.closest('[data-cd-live]') : null);

document.addEventListener('kp-segmented-change', (event) => {
    const toolbar = liveOf(event);
    if (toolbar) render(toolbar);
});
document.addEventListener('input', (event) => {
    const toolbar = liveOf(event);
    if (toolbar && event.target === toolbarSearch(toolbar)) render(toolbar);
});
document.addEventListener('kp-toolbar-remove', (event) => {
    const toolbar = liveOf(event);
    if (!toolbar) return;
    const { id } = /** @type {CustomEvent<{id: string}>} */ (event).detail;
    const [kind, value] = id.split(':');
    if (id === 'q') {
        const input = toolbarSearch(toolbar);
        if (input) input.value = '';
    } else {
        const group = groupOf(toolbar, kind);
        if (group)
            setSegmentedValues(
                group,
                getSegmentedValues(group).filter((v) => v !== value),
            );
    }
    render(toolbar);
});
document.addEventListener('kp-toolbar-clear', (event) => {
    const toolbar = liveOf(event);
    if (!toolbar) return;
    const input = toolbarSearch(toolbar);
    if (input) input.value = '';
    for (const name of ['status', 'kind']) {
        const group = groupOf(toolbar, name);
        if (group) setSegmentedValues(group, []);
    }
    render(toolbar);
});
for (const toolbar of document.querySelectorAll('[data-cd-live]')) render(toolbar);

// ---- 3 · loading rows, readout, key line -----------------------------------
const NUMBERS = { changed: 12, all: 48, errors: 3, running: 8, stopped: 3, restarting: 1 };

document.addEventListener('click', (event) => {
    const target = event.target instanceof Element ? event.target : null;
    const arrive = target?.closest('[data-cd-arrive]');
    const wait = target?.closest('[data-cd-wait]');
    if (!arrive && !wait) return;
    for (const group of document.querySelectorAll('[data-cd-loading]')) {
        if (arrive) {
            setSegmentedCounts(group, NUMBERS);
            group.removeAttribute('aria-busy');
        } else {
            setSegmentedCounts(group, Object.fromEntries(Object.keys(NUMBERS).map((k) => [k, null])));
            group.setAttribute('aria-busy', 'true');
        }
    }
});

document.addEventListener('kp-segmented-change', (event) => {
    const group = event.target instanceof Element ? event.target.closest('[data-kp-segmented]') : null;
    const readout = group?.closest('.cd-block')?.querySelector('[data-cd-readout]');
    if (!group || !readout) return;
    const values = /** @type {CustomEvent<{values: string[]}>} */ (event).detail.values;
    readout.textContent = values.length ? `Values on: ${values.join(', ')}.` : 'Values on: none (All).';
});

for (const el of document.querySelectorAll('[data-cd-keys]')) {
    setKeys(el, [
        [['Mod', 'K'], 'command palette'],
        ['/', 'search containers'],
        [['↑', '↓'], 'move'],
        [['Shift', 'Enter'], 'open in a new tab'],
        ['?', 'every shortcut'],
    ]);
}
