// Behaviour a catalogue block needs that the package does not attach by
// itself. Delegated from the document, so it works on the component page, on
// the review page that gathers the block, and in a compare column alike —
// an inline script in the page would run in the first place only.
import { toast } from '../js/overlays.js';
import { attachEffects, MEMO_PREFIX, REVEALS } from '../js/effects.js';
import { THEME_EVENT } from '../js/theme-core.js';

const WORDS = {
    '': 'Saved. The handover note is visible to the day shift.',
    success: 'Success: incident INC-4471 closed.',
    error: 'Error: the note was not saved; you are offline.',
};

document.addEventListener('click', (event) => {
    const target = event.target instanceof Element ? event.target : null;
    const button = target?.closest('[data-cat-toast]');
    if (button) {
        // The toast lands in the region of its own block, whatever id the region
        // was given when the block was gathered.
        const region =
            button.closest('.cat-block, .cat-frame__main')?.querySelector('.kp-toasts') ?? document.getElementById('cat-live-toasts') ?? undefined;
        const variant = button.getAttribute('data-cat-toast') ?? '';
        toast(WORDS[variant] ?? WORDS[''], { region, className: variant ? `kp-toast kp-toast--${variant}` : 'kp-toast' });
    }
});

/* ------------------------------------------- the data table's server rows */

// The pretend server of catalogue/table.html#datatable-server: it searches,
// sorts and pages sixty incidents and answers after 400 ms, or 2 s when the
// block's "Slow network" is ticked, and writes every request into the block's
// log. The table asks through `kp-datatable-request` and throws away an
// answer that arrives after a newer request; the log says which ones.
const SITES = ['Pump house 4', 'Cold store', 'Weighbridge', 'Boiler room', 'Loading bay', 'Main gate', 'Server room', 'Canteen'];
const STATUSES = ['Open', 'Watching', 'Closed'];
const SEVERITIES = ['High', 'Low', 'Critical', 'Medium'];
const OWNERS = ['Anouk Peeters', 'Bram De Smet', 'Chloé Martens', 'Dries Wouters', 'Elif Yilmaz'];
const INCIDENTS = Array.from({ length: 60 }, (_, i) => ({
    ref: `INC-${4471 - i * 3}`,
    site: SITES[i % SITES.length],
    status: STATUSES[i % 3],
    severity: SEVERITIES[(i * 3) % 4],
    hours: ((i * 7) % 41) + 2,
    owner: OWNERS[(i * 2) % OWNERS.length],
}));
const SEVERITY_RANK = { Low: 0, Medium: 1, High: 2, Critical: 3 };
const FIELDS = ['ref', 'site', 'status', 'severity', 'hours', 'owner'];
/** Tables whose requests this page has heard. */
const heard = new WeakSet();

document.addEventListener('kp-datatable-request', (event) => {
    const table = event.target instanceof Element ? event.target.closest('[data-cat-server]') : null;
    if (table === null) return;
    heard.add(table);
    const { id, query, sorts, page, pageSize, signal, respond, fail } = event.detail;
    const needle = query.trim().toLowerCase();
    const found = INCIDENTS.filter((row) => needle === '' || Object.values(row).join(' ').toLowerCase().includes(needle));
    found.sort((a, b) => {
        for (const key of sorts) {
            const field = FIELDS[key.column];
            const c =
                field === 'hours'
                    ? a.hours - b.hours
                    : field === 'severity'
                      ? SEVERITY_RANK[a.severity] - SEVERITY_RANK[b.severity]
                      : String(a[field]).localeCompare(String(b[field]));
            if (c !== 0) return key.direction === 'ascending' ? c : -c;
        }
        return 0;
    });
    const slow = table.querySelector('[data-cat-slow]')?.checked ?? false;
    const failBox = table.querySelector('[data-cat-fail]');
    const failing = failBox?.checked ?? false;
    if (failBox) failBox.checked = false;
    const ms = slow ? 2000 : 400;
    const params = new URLSearchParams({
        ...(needle && { q: needle }),
        sort: sorts.map((key) => `${key.direction === 'descending' ? '-' : ''}${FIELDS[key.column]}`).join(',') || 'none',
        page: String(page + 1),
        size: String(pageSize),
    });
    const log = table.querySelector('[data-cat-server-log]');
    const line = (text) => {
        if (!log) return;
        const item = document.createElement('li');
        item.textContent = text;
        log.prepend(item);
        while (log.children.length > 8) log.lastElementChild?.remove();
    };
    setTimeout(() => {
        const request = `#${id} GET /api/incidents?${params}`;
        if (signal.aborted) line(`${request} → answered in ${ms} ms, discarded: a newer request was sent after it`);
        else if (failing) line(`${request} → 503 in ${ms} ms`);
        else line(`${request} → 200 in ${ms} ms, ${Math.min(pageSize, Math.max(0, found.length - page * pageSize))} rows of ${found.length}`);
        if (failing) fail(new Error('503'));
        else respond({ rows: found.slice(page * pageSize, (page + 1) * pageSize), total: found.length });
    }, ms);
});

// A table attached before this module listened asked into the void; ask again.
import('../js/datatable.js').then(({ dataTable }) => {
    for (const table of document.querySelectorAll('[data-cat-server]')) {
        if (!heard.has(table)) dataTable(table)?.reload();
    }
});

/* ------------------------------------------ the data table's edit refusal */

// catalogue/table.html#datatable-inline-edit: the page refuses more than 100
// hours open with its own message, the way an app refuses a value its server
// would not take.
document.addEventListener('kp-datatable-edit', (event) => {
    const table = event.target instanceof Element ? event.target.closest('[data-cat-edit]') : null;
    if (table === null) return;
    const { label, value, reject } = event.detail;
    if (label === 'Hours open' && Number(value) > 100) reject('An incident cannot have been open for more than 100 hours here.');
});

/* ------------------------------------------- page effects: at rest, and live */

// catalogue/page-effects.html shows the reveals of js/effects.js. Written on
// the page as they are, js/auto.js would start them at load, and a block read
// mid-reveal (a headline half deciphered, a rule its heading has not yet
// scrolled into view, a mark on its timer) hashes differently on every load.
// So each copy is written once inside a <template>, exactly as a consumer
// writes the markup, where auto.js cannot reach it, and stamped here with its
// own attach:
//
//   data-cat-effect="rest"   attached as for someone who asked for less motion:
//                            every reveal at its rest state at once
//   data-cat-effect="armed"  attached as usual and made inert: a dossier waiting
//                            for a trigger nothing will press
//   data-cat-effect="open"   the same, with its trigger pressed once
//   data-cat-effect="live"   attached as usual, outside the stage the hash reads;
//                            its [data-cat-replay] button stamps it again
//
// Every copy is stamped again when the theme changes, because the module reads
// a theme's routine when it attaches: the live copy then plays the new theme's
// routine, and the copies at rest are the ones a load in that theme gives.

/** The attach of each stamped host, so a new stamp can stop the old one. */
const effectHandles = new WeakMap();

/**
 * The page's own arrival (synthwave's boot, phantom's card) is part of every
 * attach, whatever element it is given. It runs once per session per page, and
 * the global attach at load has usually spent that already — but a page loaded
 * in formal and switched to synthwave has not, and its first stamp here would
 * put the boot overlay over the review page. The module's memo is marked first,
 * under the key it reads (memoKey in js/effects.js: the root has no id, so its
 * text, and nothing else on the page carries the arrival hook).
 */
function holdArrival() {
    try {
        const own = (document.documentElement.textContent ?? '').trim().slice(0, 64);
        sessionStorage.setItem(`${MEMO_PREFIX}${location.pathname}:arrival:${own}`, '1');
    } catch {
        /* no storage: the arrival may run once, which is what the theme asks for */
    }
}

/** A live copy plays every time it is stamped, not once per session. */
function forgetReveals() {
    try {
        const reveal = new RegExp(`^${MEMO_PREFIX}.*?:(${REVEALS.join('|')}):`);
        for (const key of Object.keys(sessionStorage)) if (reveal.test(key)) sessionStorage.removeItem(key);
    } catch {
        /* no storage: nothing is remembered, so everything plays */
    }
}

/** @param {Element} host */
function stampEffect(host) {
    const template = host.querySelector(':scope > template');
    if (!(template instanceof HTMLTemplateElement)) return;
    host.setAttribute('data-cat-effect-ready', '');
    effectHandles.get(host)?.detach();
    host.querySelector(':scope > [data-cat-copy]')?.remove();
    const mode = host.getAttribute('data-cat-effect');
    const copy = document.createElement('div');
    copy.setAttribute('data-cat-copy', '');
    copy.append(template.content.cloneNode(true));
    template.after(copy);
    if (mode === 'rest') {
        effectHandles.set(host, attachEffects(copy, { reduceMotion: true, manageRoot: false }));
        return;
    }
    holdArrival();
    if (mode === 'live') forgetReveals();
    const handle = attachEffects(copy, { manageRoot: false });
    effectHandles.set(host, handle);
    if (mode === 'armed') copy.inert = true;
    // The emphasis hook arrives after attach returns [scope-117]; a trigger
    // pressed before it is in opens nothing.
    if (mode === 'open')
        Promise.resolve(handle.ready).then(() => {
            for (const trigger of copy.querySelectorAll('[data-kp-reveal-trigger]')) /** @type {HTMLElement} */ (trigger).click();
            copy.inert = true;
        });
}

/** A frame whose page is addressed from this folder, wherever the block is shown. */
function loadViewport(frame) {
    frame.setAttribute('data-cat-viewport-ready', '');
    frame.src = new URL(frame.getAttribute('data-cat-viewport') ?? '', import.meta.url).href;
}

function settleEffects() {
    for (const host of document.querySelectorAll('[data-cat-effect]:not([data-cat-effect-ready])')) stampEffect(host);
    for (const frame of document.querySelectorAll('iframe[data-cat-viewport]:not([data-cat-viewport-ready])')) loadViewport(frame);
}

// The review page and a compare column put the blocks in after this module
// ran; a mutation observer's callback runs before either reads them.
settleEffects();
new MutationObserver(() => settleEffects()).observe(document.documentElement, { childList: true, subtree: true });
document.addEventListener(THEME_EVENT, () => {
    for (const host of document.querySelectorAll('[data-cat-effect]')) stampEffect(host);
});
document.addEventListener('click', (event) => {
    const button = event.target instanceof Element ? event.target.closest('[data-cat-replay]') : null;
    const host = button?.closest('[data-cat-effect]');
    if (host) stampEffect(host);
});
