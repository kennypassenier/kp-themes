// research/kpadopt2-tiles: what this page does that the package does not.
//   1. the theme buttons (register loaded first, then the theme set) and the lineup's registers;
//   2. the stand-ins for hover, focus and press: the package's own rules, copied with the pseudo-class turned into a class;
//   3. the live grids: a press makes a tile busy for 2.5 s and says so in a readout;
//   4. the scripted reads under the status lists, and the Retry that answers a failed row;
//   5. the mock host log under the facet groups: it reads the facets and writes the counts back.
// The package's own attach functions (js/auto.js) run the components themselves.
import { THEMES } from '../../js/theme-registry.js';
import { applyTheme, currentTheme } from '../../js/theme-core.js';
import { setActionBusy } from '../../js/action-tiles.js';
import { attachStatusLists, buildStatusList, setStatus } from '../../js/statusrow.js';
import { attachFacets, getFacetValues, setFacetCounts, setFacetItems, setFacetValues } from '../../js/facets.js';

const note = document.querySelector('[data-ta-motion]');
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
    for (const button of document.querySelectorAll('[data-ta-theme]')) {
        button.setAttribute('aria-pressed', String(button.getAttribute('data-ta-theme') === currentTheme()));
    }
}

document.addEventListener('click', async (event) => {
    const button = event.target instanceof Element ? event.target.closest('[data-ta-theme]') : null;
    if (!button) return;
    await loadRegister(button.getAttribute('data-ta-theme') ?? '');
    applyTheme(button.getAttribute('data-ta-theme') ?? '');
    markTheme();
});
markTheme();

if (document.querySelector('[data-ta-lineup]')) for (const { name } of THEMES) loadRegister(name);

// ---- 2 · the stand-ins for states a page cannot hold still ------------------
const RELEVANT = /\.kp-(action|statusrow|statuslist|facet)/;
const STATE = /:(hover|active|focus-visible|focus-within)/;
const SWAPS = /** @type {const} */ ([
    [/:hover/g, '.ta-is-hover'],
    [/:active/g, '.ta-is-active'],
    [/:focus-visible/g, '.ta-is-focus'],
    [/:focus-within/g, '.ta-is-within'],
]);

/** @param {string} selector */
const swap = (selector) => SWAPS.reduce((text, [from, to]) => text.replace(from, to), selector);

/** @param {CSSRuleList} rules @returns {string} */
function mirrorRules(rules) {
    let out = '';
    for (const rule of rules) {
        if (rule instanceof CSSStyleRule) {
            if (RELEVANT.test(rule.selectorText) && STATE.test(rule.selectorText)) out += `${swap(rule.selectorText)} { ${rule.style.cssText} }\n`;
        } else if ('cssRules' in rule) {
            const inner = mirrorRules(/** @type {CSSGroupingRule} */ (rule).cssRules);
            if (inner) out += `${rule.cssText.slice(0, rule.cssText.indexOf('{'))}{\n${inner}}\n`;
        }
    }
    return out;
}

const mirrorSheet = document.createElement('style');
mirrorSheet.setAttribute('data-ta-mirror', '');
let blocked = false;

function mirror() {
    let css = '';
    for (const sheet of document.styleSheets) {
        if (sheet.ownerNode === mirrorSheet) continue;
        try {
            css += mirrorRules(sheet.cssRules);
        } catch {
            blocked = true;
        }
    }
    mirrorSheet.textContent = css;
    // Last in the head, so a copied rule wins a tie with the rule it copies.
    document.head.append(mirrorSheet);
    const noteEl = document.querySelector('[data-ta-mirror-note]');
    if (noteEl instanceof HTMLElement) noteEl.hidden = !blocked;
}

let mirrorTimer = 0;
const remirror = () => {
    clearTimeout(mirrorTimer);
    mirrorTimer = window.setTimeout(mirror, 30);
};
new MutationObserver((records) => {
    for (const record of records) {
        for (const node of record.addedNodes) {
            if (node instanceof HTMLLinkElement && node.rel === 'stylesheet') node.addEventListener('load', remirror, { once: true });
        }
    }
}).observe(document.head, { childList: true });
window.addEventListener('load', remirror);
document.addEventListener('kp-theme-change', remirror);
remirror();

// ---- 3 · the live action grids ---------------------------------------------
/** @param {string} name @param {string} text */
const readout = (name, text) => {
    for (const el of document.querySelectorAll(`[data-ta-readout="${name}"]`)) el.textContent = text;
};

document.addEventListener('click', (event) => {
    const tile = event.target instanceof Element ? event.target.closest('.kp-action') : null;
    if (!tile) return;
    const title = tile.querySelector('.kp-action__title')?.textContent ?? 'the tile';
    if (tile instanceof HTMLAnchorElement) {
        event.preventDefault();
        readout('actions', `Followed “${title}” (the link stays on this page in the demo).`);
        return;
    }
    if (!tile.hasAttribute('data-ta-live')) return;
    setActionBusy(tile, true);
    readout('actions', `“${title}” is busy; pressing it again does nothing until it is done.`);
    window.setTimeout(() => {
        setActionBusy(tile, false);
        readout('actions', `“${title}” is done.`);
    }, 2500);
});

// ---- 4 · the status lists ---------------------------------------------------
const STACKS = [
    'jellyfin',
    'vaultwarden',
    'traefik',
    'grafana',
    'kyu-hub',
    'almanac',
    'newsflash',
    'jobtracker',
    'loki',
    'prometheus',
    'uptime-kuma',
    'homepage',
];
/** What each stack answers: [milliseconds to answer, state, detail]. */
const ANSWERS = /** @type {Record<string, [number, 'ok' | 'failed' | 'empty', string]>} */ ({
    jellyfin: [900, 'ok', 'read'],
    vaultwarden: [1500, 'ok', 'read'],
    traefik: [3200, 'failed', 'timed out after 20 s'],
    grafana: [1100, 'ok', 'read'],
    'kyu-hub': [2100, 'ok', 'read'],
    almanac: [1700, 'ok', 'read'],
    newsflash: [2600, 'ok', 'read'],
    jobtracker: [1300, 'ok', 'read'],
    loki: [3800, 'failed', 'the host did not answer'],
    prometheus: [2300, 'ok', 'read'],
    'uptime-kuma': [1900, 'ok', 'read'],
    homepage: [1000, 'empty', 'no backups by design'],
});

/** @param {Element} host @param {string} heightReadout */
function statusDemo(host, heightReadout) {
    const list = buildStatusList(
        STACKS.map((id) => ({ id, label: id, state: 'empty', detail: 'not read yet' })),
        { label: 'Backups per stack' },
    );
    host.replaceChildren(list);
    attachStatusLists(host);
    /** @type {number[]} */
    let timers = [];
    /** @type {Record<string, number>} */
    const tries = {};
    let low = Infinity;
    let high = 0;
    const watch = new ResizeObserver(() => {
        const h = Math.round(list.getBoundingClientRect().height);
        low = Math.min(low, h);
        high = Math.max(high, h);
        readout(heightReadout, `Height of the list: ${h} px now; lowest ${low} px, highest ${high} px since this read began.`);
    });
    watch.observe(list);

    /** Count the seconds on a loading row and settle it. @param {string} id @param {number} wait @param {() => void} settle */
    const read = (id, wait, settle) => {
        setStatus(list, id, { state: 'loading', detail: 'reading (0 s)' });
        let seconds = 0;
        const tick = window.setInterval(() => {
            seconds += 1;
            setStatus(list, id, { detail: `reading (${seconds} s)` });
        }, 1000);
        timers.push(
            window.setTimeout(() => {
                clearInterval(tick);
                settle();
            }, wait),
        );
        timers.push(tick);
    };
    const readAll = () => {
        low = Infinity;
        high = 0;
        watch.disconnect();
        watch.observe(list);
        timers.forEach((t) => (clearTimeout(t), clearInterval(t)));
        timers = [];
        for (const id of STACKS) {
            const [wait, state, detail] = ANSWERS[id];
            tries[id] = 0;
            read(id, wait, () => setStatus(list, id, { state, detail }));
        }
    };
    list.addEventListener('kp-status-retry', (event) => {
        const id = /** @type {CustomEvent} */ (event).detail.id;
        tries[id] = (tries[id] ?? 0) + 1;
        // traefik fails its first retry too, to show a retry that fails.
        const again = id === 'traefik' && tries[id] < 2;
        read(id, 1500, () =>
            setStatus(list, id, again ? { state: 'failed', detail: 'timed out again after 20 s' } : { state: 'ok', detail: 'read' }),
        );
    });
    const reset = () => {
        timers.forEach((t) => (clearTimeout(t), clearInterval(t)));
        timers = [];
        for (const id of STACKS) setStatus(list, id, { state: 'empty', detail: 'not read yet' });
    };
    return { readAll, reset };
}

const compact = document.querySelector('[data-ta-status-live]');
const reserved = document.querySelector('[data-ta-status-reserved]');
const compactDemo = compact ? statusDemo(compact, 'status-height') : null;
const reservedDemo = reserved ? statusDemo(reserved, 'status-height-reserved') : null;
document.querySelector('[data-ta-read]')?.addEventListener('click', () => compactDemo?.readAll());
document.querySelector('[data-ta-read-reset]')?.addEventListener('click', () => compactDemo?.reset());
document.querySelector('[data-ta-read-reserved]')?.addEventListener('click', () => reservedDemo?.readAll());

// ---- 5 · the host log -------------------------------------------------------
const LEVELS = [
    { value: 'error', label: 'Errors', swatch: 'var(--destructive)' },
    { value: 'warn', label: 'Warnings', swatch: 'var(--warning)' },
    { value: 'info', label: 'Info', swatch: 'var(--primary)' },
    { value: 'debug', label: 'Debug', swatch: 'var(--muted-foreground)' },
];
/** @type {Record<string, string[]>} */
const WORDS = {
    HOST: ['Kernel: oom-killer spared pid 4812', 'Disk /mnt/media at 81 %', 'NTP step of 0.12 s', 'Thermal throttle released'],
    jellyfin: ['Library scan finished in 42 s', 'Transcode started for Dune (2021)', 'Plugin update available', 'Playback stopped by kenny'],
    vaultwarden: ['Login from 10.10.5.20', 'Admin token rotated', 'Database vacuum finished'],
    traefik: ['Router media@docker updated', 'Certificate renewed for *.kp-soft.dev', 'Upstream 10.10.5.106 slow (2.4 s)', '503 from grafana'],
};
const EXTRA_SOURCES = ['grafana', 'kyu-hub', 'almanac', 'newsflash'];
let tick = 0;
/** @type {{ at: string, source: string, level: string, text: string }[]} */
const lines = [];
/** @param {string} source @param {number} n */
function addLines(source, n) {
    const words = WORDS[source] ?? [`${source} started`, `${source} reloaded its configuration`, `${source} answered a health check`];
    for (let i = 0; i < n; i += 1) {
        tick += 1;
        const level = ['info', 'info', 'debug', 'warn', 'info', 'error', 'debug'][(tick * 7 + i) % 7];
        const minutes = String(Math.floor(tick / 2) % 60).padStart(2, '0');
        lines.push({ at: `10:${minutes}:${String((tick * 17) % 60).padStart(2, '0')}`, source, level, text: words[(tick + i) % words.length] });
    }
}
for (const source of ['HOST', 'jellyfin', 'vaultwarden', 'traefik']) addLines(source, source === 'traefik' ? 18 : 10);
lines.sort((a, b) => (a.at < b.at ? -1 : 1));

const sourceGroup = document.querySelector('[data-ta-facets="source"]');
const levelGroup = document.querySelector('[data-ta-facets="level"]');
const linesEl = document.querySelector('[data-ta-lines]');

/** The distinct sources, HOST first and the rest alphabetically. */
const sources = () => [...new Set(lines.map((l) => l.source))].sort((a, b) => (a === 'HOST' ? -1 : b === 'HOST' ? 1 : a.localeCompare(b)));
/** @type {Record<string, string>} */
const swatchOf = {};
const palette = ['var(--chart-1)', 'var(--chart-2)', 'var(--chart-3)', 'var(--chart-4)', 'var(--chart-5)', 'var(--primary)'];
const countsOf = (/** @type {'source' | 'level'} */ key) => {
    /** @type {Record<string, number>} */
    const out = {};
    for (const l of lines) out[l[key]] = (out[l[key]] ?? 0) + 1;
    return out;
};

function sourceItems() {
    const counts = countsOf('source');
    return sources().map((value) => {
        swatchOf[value] ??= palette[Object.keys(swatchOf).length % palette.length];
        return { value, label: value === 'HOST' ? 'Host' : value, count: counts[value] ?? 0, swatch: swatchOf[value] };
    });
}

function render() {
    if (!(linesEl && sourceGroup && levelGroup)) return;
    const onSource = new Set(getFacetValues(sourceGroup));
    const onLevel = new Set(getFacetValues(levelGroup));
    const shown = lines.filter((l) => onSource.has(l.source) && onLevel.has(l.level));
    linesEl.replaceChildren(
        ...(shown.length
            ? shown.map((l) => {
                  const li = document.createElement('li');
                  li.dataset.level = l.level;
                  for (const [cls, text] of /** @type {const} */ ([
                      ['ta-log__time', l.at],
                      ['ta-log__source', l.source],
                      ['ta-log__level', l.level],
                      ['ta-log__text', l.text],
                  ])) {
                      const span = document.createElement('span');
                      span.className = cls;
                      span.textContent = text;
                      li.append(span);
                  }
                  return li;
              })
            : [
                  Object.assign(document.createElement('li'), {
                      className: 'ta-log__empty',
                      textContent: 'No line matches. Turn a source or a level on.',
                  }),
              ]),
    );
    const all = sources();
    const only = onSource.size === 1 && all.length > 1 ? [...onSource][0] : null;
    readout(
        'log',
        `${only ? `Showing only ${only}. ` : ''}Showing ${shown.length} of ${lines.length} lines (${onSource.size} of ${all.length} sources, ${onLevel.size} of ${LEVELS.length} levels).`,
    );
}

if (sourceGroup && levelGroup) {
    setFacetItems(sourceGroup, sourceItems());
    setFacetItems(
        levelGroup,
        LEVELS.map((lv) => ({ ...lv, count: countsOf('level')[lv.value] ?? 0, checked: lv.value !== 'debug' })),
    );
    attachFacets(document);
    render();
    document.addEventListener('kp-facet-change', render);
    document.querySelector('[data-ta-add-source]')?.addEventListener('click', () => {
        const next = EXTRA_SOURCES.find((s) => !lines.some((l) => l.source === s));
        if (!next) return;
        addLines(next, 7);
        lines.sort((a, b) => (a.at < b.at ? -1 : 1));
        setFacetItems(sourceGroup, sourceItems());
        setFacetCounts(sourceGroup, countsOf('source'), { all: lines.length });
        setFacetCounts(levelGroup, countsOf('level'));
        render();
    });
    document.querySelector('[data-ta-counts-wait]')?.addEventListener('click', () => {
        sourceGroup.setAttribute('aria-busy', 'true');
        levelGroup.setAttribute('aria-busy', 'true');
    });
    document.querySelector('[data-ta-counts-arrive]')?.addEventListener('click', () => {
        setFacetCounts(sourceGroup, countsOf('source'), { all: lines.length });
        setFacetCounts(levelGroup, countsOf('level'));
    });
    document.querySelector('[data-ta-facet-reset]')?.addEventListener('click', () => {
        setFacetValues(sourceGroup, null);
        setFacetValues(levelGroup, null);
        render();
    });
    setFacetCounts(sourceGroup, countsOf('source'), { all: lines.length });
}

for (const box of document.querySelectorAll('[data-ta-mixed]')) {
    if (box instanceof HTMLInputElement) box.indeterminate = true;
}
