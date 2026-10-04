// Behaviour a catalogue block needs that the package does not attach by
// itself. Delegated from the document, so it works on the component page, on
// the review page that gathers the block, and in a compare column alike —
// an inline script in the page would run in the first place only.
import { toast } from '../js/overlays.js';
import { attachEffects, MEMO_PREFIX, REVEALS } from '../js/effects.js';
import { THEME_EVENT } from '../js/theme-core.js';
import { attachAttention, setAttention } from '../js/attention.js';
import { setAgo } from '../js/freshness.js';
import { forgetRememberedExcept } from '../js/remember.js';
import { attachCalendars, CALENDAR_PICK_EVENT, dayKey, formatDayKey, setCalendarDays, setCalendarLegend, setCalendarState } from '../js/calendar.js';
import { numericTime } from '../js/chart.js';

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

/* --------------------------------------------- what the blocks announce */

// catalogue/button.html#undo, data.html#count and alarm.html: the events a page
// listens to, written into the block's own log line so a reviewer sees them
// fire. The line sits outside the stage; it is not part of the component.
/** @param {Event} event @param {string} selector @param {string} text */
const logIn = (event, selector, text) => {
    const target = event.target instanceof Element ? event.target : null;
    const line = target?.closest('.cat-block')?.querySelector(selector);
    if (line) line.textContent = text;
};
document.addEventListener('kp-action-commit', (event) => {
    const { key } = /** @type {CustomEvent} */ (event).detail;
    logIn(event, '[data-cat-undo-log]', `kp-action-commit: "${key}" — the undo window closed; an app deletes it on its server now.`);
});
document.addEventListener('kp-action-undo', (event) => {
    const { key } = /** @type {CustomEvent} */ (event).detail;
    logIn(event, '[data-cat-undo-log]', `kp-action-undo: "${key}" is back; nothing reached the server.`);
});
// catalogue/data.html#count: the value each counting number landed on.
document.addEventListener('kp-count', (event) => {
    const { value } = /** @type {CustomEvent} */ (event).detail;
    logIn(event, '[data-cat-count-log]', `kp-count: landed on ${value}.`);
});
// catalogue/page-effects.html#reveal-every: every reveal that reached rest,
// newest first, and whether it played or was skipped.
document.addEventListener('kp-reveal', (event) => {
    const target = event.target instanceof Element ? event.target : null;
    const log = target?.closest('.cat-block')?.querySelector('[data-cat-reveal-log]');
    if (!target || !log || !target.closest('.cat-live')) return;
    const { reveal, routine, skipped } = /** @type {CustomEvent} */ (event).detail;
    const item = document.createElement('li');
    const words = (target.getAttribute('data-kp-text') ?? target.textContent ?? '').trim();
    item.textContent = `kp-reveal: ${reveal} "${words}" — ${skipped ? 'skipped to rest' : 'played'}${routine ? ` (${routine})` : ''}`;
    log.prepend(item);
    while (log.children.length > 6) log.lastElementChild?.remove();
});
document.addEventListener('kp-alarm-close', (event) => {
    const { reason } = /** @type {CustomEvent} */ (event).detail;
    logIn(event, '[data-cat-alarm-log]', `kp-alarm-close: closed with reason "${reason}".`);
});
// catalogue/table.html#datatable-expand-groups: one event per opening in the
// single-open table, with the row it closed; and each fold of a stack.
let expandEvents = 0;
document.addEventListener('kp-datatable-expand', (event) => {
    const { key, open, closed } = /** @type {CustomEvent} */ (event).detail;
    expandEvents += 1;
    const shut = Array.isArray(closed) && closed.length > 0 ? `, closing ${closed.join(', ')}` : '';
    logIn(event, '[data-cat-expand-log]', `kp-datatable-expand #${expandEvents}: "${key}" ${open ? 'opened' : 'closed'}${shut}.`);
});
document.addEventListener('kp-datatable-group', (event) => {
    const { key, open, members } = /** @type {CustomEvent} */ (event).detail;
    logIn(event, '[data-cat-group-log]', `kp-datatable-group: "${key}" ${open ? 'unfolded' : 'folded'}, ${members.length} rows.`);
});

/* ------------------------------------------------ what a page remembers */

// catalogue/navigation.html#sidenav-remember and structure.html#remember:
// Forget clears every memory whose name starts with the button's prefix and
// reloads, so the block is judged as its markup draws it.
document.addEventListener('click', (event) => {
    const button = event.target instanceof Element ? event.target.closest('[data-cat-forget]') : null;
    if (button === null) return;
    const prefix = button.getAttribute('data-cat-forget') ?? '';
    try {
        for (const key of Object.keys(localStorage)) {
            const name = key.split(':')[2] ?? '';
            if (key.startsWith('kp-remember:') && prefix !== '' && name.startsWith(prefix)) localStorage.removeItem(key);
        }
    } catch {
        /* no storage: nothing was remembered */
    }
    location.reload();
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
// One whose first page came in the markup (data-kp-total) never asked.
import('../js/datatable.js').then(({ dataTable }) => {
    for (const table of document.querySelectorAll('[data-cat-server]:not([data-kp-total])')) {
        if (!heard.has(table)) dataTable(table)?.reload();
    }
    // catalogue/table.html#datatable-states: a loading table that says, in the
    // app's own words, how long it has been asking (the handle's busy(), fix-80).
    // The words are fixed rather than a running clock, so the block reads the
    // same at every look.
    // The same block's fourth table counts by itself (busy({ since }), fix-84),
    // from a start 42 seconds before the page came, and its fifth was failed
    // by the app with its own reason (fail(reason), fix-85).
    let tries = 0;
    const loadedAt = Date.now();
    const busy = () => {
        const waiting = [...document.querySelectorAll('[data-cat-busy], [data-cat-busy-since], [data-cat-fail-reason]')].filter((table) => {
            const handle = dataTable(table);
            if (handle === null) return true;
            if (table.hasAttribute('data-cat-busy')) handle.busy(table.getAttribute('data-cat-busy'));
            if (table.hasAttribute('data-cat-busy-since')) handle.busy({ text: table.getAttribute('data-cat-busy-since'), since: loadedAt - 42_000 });
            if (table.hasAttribute('data-cat-fail-reason')) handle.fail(table.getAttribute('data-cat-fail-reason'));
            return false;
        });
        if (waiting.length > 0 && tries++ < 60) requestAnimationFrame(busy);
    };
    busy();
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
//   data-cat-effect="once"   the same, but what this session has seen stays seen:
//                            a replay is a reload, so only data-kp-reveal-every="load" plays
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

/* ------------------------------------------- the dashboard components [scope-143] */

// catalogue/data.html#kpis: the filter a page would apply, said in the
// block's own line.
document.addEventListener('kp-kpi-toggle', (event) => {
    const block = event.target instanceof Element ? event.target.closest('.cat-block') : null;
    const line = block?.querySelector('[data-cat-kpi-log]');
    if (!block || !line) return;
    const on = [...block.querySelectorAll('.kp-kpi--toggle[aria-pressed="true"]:not([data-kp-kpi-owned]) .kp-kpi__label')].map((label) =>
        (label.textContent ?? '').toLowerCase(),
    );
    const { pressed } = /** @type {CustomEvent} */ (event).detail;
    line.textContent = `kp-kpi-toggle: pressed ${pressed}. ${on.length ? `Filtering the list: ${[...new Set(on)].join(' and ')} only.` : 'No filter on.'}`;
});

// catalogue/data.html#meter: Book more and Loading drive the meters through
// setMeter(); the phone pane is a copy of the tiles. The table's meters are
// written in the markup the way setMeter() writes them, so the page reads
// the same before the script, and after Loading is pressed twice.
if (document.getElementById('meter')) {
    import('../js/kpi.js').then(({ setMeter }) => {
        const block = /** @type {HTMLElement} */ (document.getElementById('meter'));
        const phone = block.querySelector('[data-cat-meter-phone]');
        const tiles = block.querySelector('[data-cat-meter-tiles]');
        if (phone && tiles) {
            const copy = /** @type {HTMLElement} */ (tiles.cloneNode(true));
            copy.removeAttribute('data-cat-meter-tiles');
            copy.setAttribute('aria-label', 'Storage and capacity, phone width');
            phone.append(copy);
        }
        /** The table's rows, in order, as setMeter() takes them. @type {import('../js/kpi.js').Meter[]} */
        const ROWS = [
            { value: 0.62, mark: 0.8, label: 'full', markLabel: 'the target level' },
            { value: 0.58, mark: 1.3, label: 'running now', markLabel: 'booked for tonight' },
            { value: 0, mark: 0.5, label: 'used', markLabel: 'the weekly limit' },
            { value: 1, mark: 0.9, label: 'full', markLabel: 'the target level' },
            { value: 1.12, label: 'of the plan used' },
            { value: 0.3, mark: 0, label: 'used', markLabel: 'the floor' },
            { value: 0.3, mark: 1, label: 'used', markLabel: 'the ceiling' },
            { value: 0.78, mark: 0.8, tone: 'warning', label: 'full', markLabel: 'the overflow alarm' },
            { value: 0.93, mark: 0.8, tone: 'destructive', label: 'full', markLabel: 'the overflow alarm' },
            { value: null },
            { loading: true },
        ];
        let booked = false;
        let loading = false;
        const paint = () => {
            block.querySelectorAll('[data-cat-meter-rows] tr').forEach((row, i) => {
                const meter = /** @type {HTMLElement | null} */ (row.querySelector('.kp-meter'));
                if (!meter || !ROWS[i]) return;
                setMeter(meter, loading ? { loading: true } : ROWS[i]);
                const words = row.lastElementChild;
                if (words) words.textContent = meter.getAttribute('aria-valuetext') ?? '';
            });
            for (const meter of /** @type {NodeListOf<HTMLElement>} */ (block.querySelectorAll('[data-cat-meter-of]'))) {
                const which = meter.getAttribute('data-cat-meter-of');
                if (loading) setMeter(meter, { loading: true });
                else if (which === 'reservoir') setMeter(meter, { value: 0.62, mark: 0.8, label: 'full', markLabel: 'the target level' });
                else if (which === 'booked')
                    setMeter(meter, { value: 0.93, mark: booked ? 1.3 : 0.8, label: 'running', markLabel: 'booked for tonight' });
                else if (which === 'plant') setMeter(meter, { value: 0.41, mark: 0.55, label: "of today's plan", markLabel: 'planned by now' });
            }
            for (const words of block.querySelectorAll('[data-cat-meter-words]'))
                words.textContent = booked ? 'running · 130 % of it booked tonight' : 'running · the mark is what is booked tonight';
        };
        block.addEventListener('click', (event) => {
            const button = event.target instanceof Element ? event.target.closest('button[data-cat-meter]') : null;
            if (!button) return;
            const on = button.getAttribute('aria-pressed') !== 'true';
            button.setAttribute('aria-pressed', String(on));
            if (button.getAttribute('data-cat-meter') === 'book') booked = on;
            else loading = on;
            paint();
        });
    });
}

// catalogue/data.html#kpi-columns: how many tiles and how wide the strip is;
// the line says what attachKpiStrips() chose.
if (document.getElementById('kpi-columns')) {
    const block = /** @type {HTMLElement} */ (document.getElementById('kpi-columns'));
    const strip = /** @type {HTMLElement | null} */ (block.querySelector('[data-cat-kpis-strip]'));
    const stage = /** @type {HTMLElement | null} */ (block.querySelector('[data-cat-kpis-stage]'));
    const more = /** @type {HTMLTemplateElement | null} */ (block.querySelector('template[data-cat-kpis-more]'));
    const log = block.querySelector('[data-cat-kpis-log]');
    const all = strip ? [...strip.children, ...(more ? [...more.content.children] : [])].map((tile) => tile.cloneNode(true)) : [];
    let count = strip?.children.length ?? 0;
    const describe = () =>
        requestAnimationFrame(() => {
            if (!strip || !log) return;
            const columns = Number(strip.style.getPropertyValue('--kp-kpis-columns')) || 1;
            const rows = [];
            for (let left = count; left > 0; left -= columns) rows.push(Math.min(columns, left));
            const width = Math.round(strip.getBoundingClientRect().width);
            log.textContent =
                `${count} ${count === 1 ? 'tile' : 'tiles'} in ${width} px: ${columns} ${columns === 1 ? 'column' : 'columns'}, ` +
                `${rows.length === 1 ? 'one row' : `rows ${rows.join(' + ')}`}` +
                (strip.hasAttribute('data-kp-kpis-span-last')
                    ? '; no allowed count avoids a lone tile, so the last one spans its row.'
                    : ', no tile alone.');
        });
    if (strip) new ResizeObserver(describe).observe(strip);
    block.addEventListener('click', (event) => {
        const button = event.target instanceof Element ? event.target.closest('[data-value]') : null;
        const group = button?.parentElement;
        if (!button || !group) return;
        for (const sibling of group.querySelectorAll('[aria-pressed]')) sibling.setAttribute('aria-pressed', String(sibling === button));
        const value = button.getAttribute('data-value') ?? '';
        if (group.hasAttribute('data-cat-kpis-count')) {
            count = Number(value);
            strip?.replaceChildren(...all.slice(0, count).map((tile) => tile.cloneNode(true)));
        } else stage?.style.setProperty('max-inline-size', value === 'full' ? 'none' : `${value}px`);
        describe();
    });
}

// catalogue/data.html#kpi-trend: 24 hours of readings every ten minutes up
// to the page's now, the same line at every look of the same moment; the
// tiles' numbers and words come from them. Ten minutes later moves now on;
// Loading empties the filled tiles; the links say where they would go.
if (document.getElementById('kpi-trend')) {
    const block = /** @type {HTMLElement} */ (document.getElementById('kpi-trend'));
    const MINUTE = 60_000;
    const STEP = 10 * MINUTE;
    const DAY = 24 * 60 * MINUTE;
    /** Noise from the time alone. @param {number} t @param {number} k */
    const noise = (t, k) => {
        const v = Math.sin((t / MINUTE) * 12.9898 + k * 78.233) * 43758.5453;
        return v - Math.floor(v) - 0.5;
    };
    /** The network's demand at `t` on the Brussels clock (summer time): a morning and an evening peak. @param {number} t */
    const demand = (t) => {
        const h = (((t / 3_600_000 + 2) % 24) + 24) % 24;
        return 0.55 + 0.4 * Math.exp(-((h - 7.5) ** 2) / 3) + 0.3 * Math.exp(-((h - 19) ** 2) / 4) - 0.25 * Math.exp(-((h - 3.5) ** 2) / 5);
    };
    let clock = Math.floor(Date.now() / STEP) * STEP;
    /**
     * @typedef {{ unit?: string, unitKind?: import('../js/chart.js').ChartUnitKind, digits: number, context: string,
     *   at: (t: number) => number, from?: () => number, until?: () => number, state?: 'loading' | 'none' | 'one' }} Figure
     */
    /** @type {Record<string, Figure>} */
    const FIGURES = {
        pressure: { unit: 'bar', digits: 2, context: 'two pumps', at: (t) => 3.6 - 0.6 * demand(t) + 0.04 * noise(t, 1) },
        flow: {
            unit: 'm³/h',
            digits: 0,
            context: 'into the ring main',
            at: (t) => 420 * demand(t) + 12 * noise(t, 2),
            until: () => clock - 40 * MINUTE,
        },
        north: { unitKind: 'percent', digits: 0, context: 'of its height', at: (t) => 72 - 9 * demand(t) + noise(t, 3) },
        temp: { unitKind: 'celsius', digits: 0, context: 'hottest pump', at: (t) => 41 + 9 * demand(t) + noise(t, 4) },
    };
    FIGURES.loading = { ...FIGURES.pressure, state: 'loading' };
    FIGURES.none = { ...FIGURES.pressure, state: 'none' };
    FIGURES.one = { ...FIGURES.north, context: 'measured since ten minutes ago', state: 'one' };
    // Seven hours and forty minutes of readings: from 07:00 when the page's now is 14:40.
    FIGURES.south = { ...FIGURES.north, context: 'measured since this morning', from: () => clock - 460 * MINUTE };
    /** @param {Figure} f @returns {[number, number][]} */
    const pointsOf = (f) => {
        const end = Math.min(clock, f.until?.() ?? Infinity);
        const start = f.from?.() ?? clock - DAY;
        /** @type {[number, number][]} */
        const points = [];
        for (let t = start; t <= end; t += STEP) points.push([t, Number(f.at(t).toFixed(f.digits))]);
        return points;
    };
    /** @param {Figure} f @param {number} v */
    const print = (f, v) =>
        f.unitKind === 'percent'
            ? `${v.toFixed(f.digits)}%`
            : f.unitKind === 'celsius'
              ? `${v.toFixed(f.digits)} °C`
              : `${v.toFixed(f.digits)} ${f.unit}`;
    let loading = false;
    import('../js/chart.js').then(({ setTrendData }) => {
        const paint = () => {
            for (const tile of /** @type {NodeListOf<HTMLElement>} */ (block.querySelectorAll('[data-cat-trend]'))) {
                const f = FIGURES[tile.getAttribute('data-cat-trend') ?? ''];
                const figure = tile.querySelector('.kp-kpi__chart');
                const value = tile.querySelector('.kp-kpi__value');
                const words = tile.querySelector('.kp-kpi__trend');
                if (!f || !figure || !value || !words) continue;
                const points =
                    f.state === 'loading' || (loading && !f.state)
                        ? null
                        : f.state === 'none'
                          ? []
                          : f.state === 'one'
                            ? [[clock - STEP, 71]]
                            : pointsOf(f);
                if (!points) {
                    value.innerHTML = '<span class="kp-skeleton" style="--kp-skeleton-height: 1.75rem; inline-size: 3ch"></span>';
                    words.innerHTML = '<span class="kp-skeleton" style="inline-size: 80%"></span>';
                } else if (!points.length) {
                    value.textContent = '—';
                    words.textContent = 'no trend: the readings store did not answer';
                } else {
                    const recent = points.slice(-2).map((p) => p[1]);
                    const avg = recent.reduce((a, b) => a + b, 0) / recent.length;
                    const peak = Math.max(...points.map((p) => p[1]));
                    value.textContent = avg.toFixed(f.digits);
                    const unit = f.unitKind === 'percent' ? '%' : f.unitKind === 'celsius' ? '°C' : (f.unit ?? '');
                    if (unit) value.append(Object.assign(document.createElement('small'), { textContent: unit }));
                    const now = document.createElement('b');
                    now.textContent = print(f, points[points.length - 1][1]);
                    words.replaceChildren('now ', now, ` · peak ${print(f, peak)} · ${f.context}`);
                }
                setTrendData(
                    figure,
                    points && {
                        points: /** @type {[number, number][]} */ (points),
                        step: STEP,
                        unit: f.unit,
                        unitKind: f.unitKind,
                        digits: f.digits,
                    },
                );
            }
        };
        paint();
        block.addEventListener('click', (event) => {
            const target = event.target instanceof Element ? event.target : null;
            const link = target?.closest('.kp-kpi__link');
            const log = block.querySelector('[data-cat-trend-log]');
            if (link) {
                // The sample's links go nowhere: say where they would go.
                event.preventDefault();
                if (log) log.textContent = `Opened: ${link.getAttribute('title')}.`;
                return;
            }
            if (target?.closest('[data-cat-trend-live]')) {
                clock += STEP;
                paint();
            }
            const button = target?.closest('[data-cat-trend-loading]');
            if (button) {
                loading = button.getAttribute('aria-pressed') !== 'true';
                button.setAttribute('aria-pressed', String(loading));
                paint();
            }
        });
    });
}
// catalogue/data.html#state-word: every state word in the block moves on a
// step every 1.2 s while the button is pressed; the plain words are set as
// text, the .kp-state-word ones through setStateWord().
const STATES = ['Running', 'Stopped', 'Restarting', 'Starting in 3 min'];
/** The block a cycle runs in, and its timer. @type {WeakMap<Element, number>} */
const cycles = new WeakMap();
document.addEventListener('click', (event) => {
    const button = event.target instanceof Element ? event.target.closest('[data-cat-state-cycle]') : null;
    const block = button?.closest('.cat-block');
    if (!button || !block) return;
    const on = button.getAttribute('aria-pressed') !== 'true';
    button.setAttribute('aria-pressed', String(on));
    button.textContent = on ? 'Stop changing' : 'Change the states';
    clearInterval(cycles.get(block));
    if (!on) return;
    import('../js/components.js').then(({ setStateWord }) => {
        let step = 0;
        cycles.set(
            block,
            window.setInterval(() => {
                step += 1;
                for (const list of block.querySelectorAll('[data-cat-state-list]')) {
                    [...list.querySelectorAll('[data-cat-state]')].forEach((word, at) => {
                        const next = STATES[(at + step) % STATES.length];
                        if (word.classList.contains('kp-state-word')) setStateWord(/** @type {HTMLElement} */ (word), next);
                        else word.textContent = next;
                    });
                }
            }, 1200),
        );
    });
});

// catalogue/feedback.html#attention: a warning added, every problem resolved,
// and the problems back, in every band of the block.
document.addEventListener('click', (event) => {
    const button = event.target instanceof Element ? event.target.closest('[data-cat-attention]') : null;
    const block = button?.closest('.cat-block');
    if (!button || !block) return;
    const what = button.getAttribute('data-cat-attention');
    const from = /** @type {HTMLTemplateElement | null} */ (
        block.querySelector(what === 'add' ? 'template[data-cat-attention-extra]' : 'template[data-cat-attention-items]')
    );
    for (const band of block.querySelectorAll('.kp-attention')) {
        if (what === 'clear') band.replaceChildren();
        else if (what === 'reset') band.replaceChildren(from ? from.content.cloneNode(true) : '');
        else if (from) band.append(from.content.cloneNode(true));
    }
});

// catalogue/table.html#action-columns: one label grows, and its whole column
// with it, on every row.
document.addEventListener('click', (event) => {
    const button = event.target instanceof Element ? event.target.closest('[data-cat-longer]') : null;
    const block = button?.closest('.cat-block');
    if (!button || !block) return;
    const longer = button.getAttribute('aria-pressed') !== 'true';
    button.setAttribute('aria-pressed', String(longer));
    for (const assign of block.querySelectorAll('.kp-row-actions > button')) {
        const words = assign.textContent?.trim();
        if (words === 'Assign…' || words === 'Assign to the night shift…') assign.textContent = longer ? 'Assign to the night shift…' : 'Assign…';
    }
});

// catalogue/chart.html: a range button asks for that range's readings, which
// the page hands the group's charts before they redraw (`kp-chart-range`, fired
// before the redraw for exactly this). The two modules are fetched once a page
// carries a sample group, so the answer can be given at once.
/** @type {{ setChartData: (el: Element, data: any) => void, sampleData: (name: string, range?: string) => any } | null} */
let chartSample = null;
let chartSampleAsked = false;
function wantChartSample() {
    if (chartSampleAsked || !document.querySelector('[data-cat-chart-sample]')) return;
    chartSampleAsked = true;
    Promise.all([import('../js/chart.js'), import('./chart-sample.js')]).then(([{ setChartData }, { sampleData }]) => {
        chartSample = { setChartData, sampleData };
    });
}
wantChartSample();
new MutationObserver(wantChartSample).observe(document.documentElement, { childList: true, subtree: true });
document.addEventListener('kp-chart-range', (event) => {
    const group = event.target instanceof Element ? event.target.closest('[data-cat-chart-sample]') : null;
    if (!group || !chartSample) return;
    const { range } = /** @type {CustomEvent} */ (event).detail;
    for (const chart of group.querySelectorAll('[data-cat-chart]'))
        chartSample.setChartData(chart, chartSample.sampleData(chart.getAttribute('data-cat-chart') ?? '', range));
});

/* ------------------------------------------------ attention band, live */

// catalogue/feedback.html#attention-live: a band built after the page
// loaded and refreshed by key with setAttention(), and a count of every
// alert put into the page (it must not grow on a refresh that changes
// nothing).
/** @type {Record<string, { severity: 'critical' | 'warning' | 'info', title: string, text: string, fix: string }>} */
const LIVE_PROBLEMS = {
    'inc-4471': {
        severity: 'critical',
        title: 'Pump house 3 is below 2.1 bar',
        text: 'For forty minutes; the ring main loses pressure first.',
        fix: 'Open the incident',
    },
    'ph-7': {
        severity: 'warning',
        title: 'Pump house 7 has sent no reading since 06:00',
        text: 'The unit answers a ping; its modem may need a restart.',
        fix: 'Restart the modem',
    },
    'fw-4.2': {
        severity: 'info',
        title: 'Firmware 4.2 is out for six field units',
        text: "It fixes the flow meter's drift after a power cut.",
        fix: 'Plan the update',
    },
};
/** @type {WeakMap<Element, { keys: string[], polls: ReturnType<typeof setInterval> | null }>} */
const liveBands = new WeakMap();
/** @param {Element} band */
const paintLive = (band) => {
    const state = liveBands.get(band);
    if (!state) return;
    setAttention(
        band,
        state.keys.map((key) => {
            const p = LIVE_PROBLEMS[key];
            const fix = document.createElement('button');
            fix.type = 'button';
            fix.className = 'kp-button kp-button--sm';
            fix.textContent = p.fix;
            return { key, severity: p.severity, title: p.title, text: p.text, action: fix };
        }),
    );
};
document.addEventListener('click', (event) => {
    const control = event.target instanceof Element ? event.target.closest('[data-cat-attention-live]') : null;
    const block = control?.closest('.cat-block');
    const host = block?.querySelector('[data-cat-attention-live-host]');
    if (!control || !block || !host) return;
    const what = control.getAttribute('data-cat-attention-live');
    let band = host.querySelector('.kp-attention');
    if (!band) {
        if (what !== 'build') return;
        band = document.createElement('div');
        band.className = 'kp-attention';
        band.setAttribute('role', 'region');
        band.setAttribute('aria-label', 'Needs attention, built after load');
        liveBands.set(band, { keys: ['fw-4.2', 'ph-7', 'inc-4471'], polls: null });
        let inserted = 0;
        const count = block.querySelector('[data-cat-attention-live-count]');
        new MutationObserver((records) => {
            for (const record of records)
                for (const node of record.addedNodes) if (node instanceof Element && node.getAttribute('role') === 'alert') inserted += 1;
            if (count) count.textContent = `Alerts put into the page: ${inserted}`;
        }).observe(band, { childList: true });
        // On the component page attachAttention() already watches the
        // document; on a page that gathered this block it may not.
        attachAttention(host);
        host.append(band);
        paintLive(band);
        return;
    }
    const state = liveBands.get(band);
    if (!state) return;
    if (what === 'poll') {
        if (state.polls !== null) clearInterval(state.polls);
        state.polls = /** @type {HTMLInputElement} */ (control).checked ? setInterval(() => paintLive(/** @type {Element} */ (band)), 2000) : null;
        return;
    }
    if (what === 'reword')
        LIVE_PROBLEMS['ph-7'].text = LIVE_PROBLEMS['ph-7'].text.endsWith('restart.')
            ? 'Still no reading; the modem was restarted at 09:10.'
            : 'The unit answers a ping; its modem may need a restart.';
    if (what === 'raise') LIVE_PROBLEMS['ph-7'].severity = LIVE_PROBLEMS['ph-7'].severity === 'warning' ? 'critical' : 'warning';
    if (what === 'resolve') state.keys = state.keys.includes('fw-4.2') ? state.keys.filter((k) => k !== 'fw-4.2') : [...state.keys, 'fw-4.2'];
    paintLive(band);
});

/* ------------------------------------------------- how old the data is */

// catalogue/feedback.html#freshness: each line's moment, set from the
// page's load so the words are worth reading (`data-cat-ago` seconds).
for (const line of document.querySelectorAll('[data-cat-ago]')) {
    setAgo(/** @type {HTMLElement} */ (line), Date.now() + Number(line.getAttribute('data-cat-ago')) * 1000);
}

/* --------------------------------------- tiles of one height, a board */

// catalogue/data.html#tiles-set: a reservoir that grows a line, and the
// height the set shares, read off the grids.
document.addEventListener('click', (event) => {
    const button = event.target instanceof Element ? event.target.closest('[data-cat-tiles-set]') : null;
    const block = button?.closest('.cat-block');
    const body = block?.querySelector('[data-kp-tiles-set] .kp-tiles .kp-card__body');
    if (!button || !body) return;
    const longer = button.getAttribute('aria-pressed') !== 'true';
    button.setAttribute('aria-pressed', String(longer));
    body.textContent = longer
        ? '71 % full. The inlet valve is throttled to 40 % while the south pipe is flushed; the level will hold until the flush ends at noon, then rise again by about 3 % an hour.'
        : '71 % full.';
});
const showTileHeight = () => {
    for (const block of document.querySelectorAll('.cat-block')) {
        const line = block.querySelector('[data-cat-tiles-set-height]');
        const grid = block.querySelector('[data-kp-tiles-set] .kp-tiles');
        if (!line || !(grid instanceof HTMLElement)) continue;
        const value = grid.style.getPropertyValue('--kp-tile-row-min') || 'not set';
        const text = `The set's tile height: ${value}`;
        if (line.textContent !== text) line.textContent = text;
    }
    requestAnimationFrame(showTileHeight);
};
if (document.querySelector('[data-cat-tiles-set-height]')) requestAnimationFrame(showTileHeight);

/* ------------------------------------ remembered groups on a live board */

// catalogue/structure.html#remember-later: the board rebuilt from scratch,
// held open while a search runs, and its memory pruned to its groups.
document.addEventListener('click', (event) => {
    const control = event.target instanceof Element ? event.target.closest('[data-cat-board]') : null;
    const block = control?.closest('.cat-block');
    const board = block?.querySelector('div[data-cat-board]');
    if (!control || !board) return;
    const what = control.getAttribute('data-cat-board');
    if (what === 'rebuild') board.replaceChildren(...[...board.children].map((group) => group.cloneNode(true)));
    if (what === 'hold') {
        const on = /** @type {HTMLInputElement} */ (control).checked;
        board.toggleAttribute('data-kp-remember-hold', on);
        if (on) for (const group of board.querySelectorAll('details')) /** @type {HTMLDetailsElement} */ (group).open = true;
    }
    if (what === 'prune') {
        const names = [...board.querySelectorAll('[data-kp-remember]')].map((group) => group.getAttribute('data-kp-remember') ?? '');
        console.info(`Forgot ${forgetRememberedExcept('disclosure', 'cat-apps-', names)} stored groups that are no longer on the board.`);
    }
});

/* ------------------------------------------------ the network graph [scope-143] */

// catalogue/chart.html#graph: the try buttons hand every graph of the block
// new data (fifteen long names, nodes sized by flow, a live update) or a
// state (loading, nothing to draw, could not read), and the line under the
// stage says what the first graph's `kp-graph-change` reported. The markup's
// JSON child is `catalogueNetwork()` as the page first draws it.

/** @type {import('../js/graph.js').GraphKind[]} */
const GRAPH_KINDS = [
    { kind: 'telemetry', label: 'Telemetry', hint: 'Readings sent to the control centre every minute', style: 'solid', colour: 'var(--chart-1)' },
    { kind: 'control', label: 'Remote control', hint: 'Commands from the control centre to the site', style: 'dash', colour: 'var(--chart-2)' },
    { kind: 'radio', label: 'Radio link', hint: 'A spare path over radio for when the line is down', style: 'dot', colour: 'var(--chart-4)' },
    { kind: 'planned', label: 'Planned', hint: 'A link that is ordered but not live yet', style: 'long-dash', colour: 'var(--muted-foreground)' },
    {
        kind: 'unused',
        label: 'Not used here',
        hint: 'A kind no link on this network has; the list leaves it out',
        style: 'solid',
        colour: 'var(--chart-5)',
    },
];

/**
 * The northern network: a control centre, six pump houses, two reservoirs, a
 * treatment plant and two addresses outside it.
 * @param {{ weights?: boolean, tick?: number }} [options]
 * @returns {import('../js/graph.js').GraphData}
 */
function catalogueNetwork({ weights = false, tick = 0 } = {}) {
    const sites = [
        ['ph1', 'Pump house 1', 'two pumps, ring main west'],
        ['ph2', 'Pump house 2', 'one pump, the old town'],
        ['ph3', 'Pump house 3', 'two pumps, ring main north'],
        ['ph4', 'Pump house 4', 'two pumps, the harbour'],
        ['ph5', 'Pump house 5', 'one pump, the hills'],
        ['ph6', 'Pump house 6', 'being built, live in November'],
        ['north', 'Reservoir North', 'level sensor and an inlet valve'],
        ['south', 'Reservoir South', 'level sensor and an inlet valve'],
        ['plant', 'Treatment plant', 'where the water comes from'],
    ];
    return {
        nodes: [
            { id: 'centre', label: 'Control centre', description: 'where every reading arrives', weight: weights ? 1 : null },
            ...sites.map(([id, label, description], i) => ({
                id,
                label,
                description: id === 'ph5' ? `${description}; its settings on site differ from the plan` : description,
                flag: id === 'ph5' ? /** @type {const} */ ('mismatch') : null,
                weight: weights ? ((i * 37 + tick * 13) % 100) / 100 : null,
            })),
            { id: 'weather', label: 'Weather service', description: 'an address outside the network', external: true },
            { id: 'energy', label: 'Energy supplier', description: 'an address outside the network', external: true },
        ],
        edges: [
            ...sites.filter(([id]) => id !== 'ph6').map(([id]) => ({ from: id, to: 'centre', kind: 'telemetry', detail: 'readings every minute' })),
            { from: 'centre', to: 'ph1', kind: 'control', detail: 'pump start and stop' },
            { from: 'centre', to: 'ph3', kind: 'control', detail: 'pump start and stop, valve' },
            { from: 'centre', to: 'plant', kind: 'control', detail: 'intake rate' },
            { from: 'ph3', to: 'ph4', kind: 'radio', detail: 'spare path' },
            { from: 'ph4', to: 'centre', kind: 'radio', detail: 'spare path' },
            { from: 'centre', to: 'ph6', kind: 'planned', detail: 'fibre ordered' },
            { from: 'centre', to: 'energy', kind: 'planned', detail: 'tariff feed ordered' },
            { from: 'weather', to: 'centre', kind: 'telemetry', detail: tick % 2 ? 'rain radar every 5 min' : 'rain radar every 10 min' },
        ],
        kinds: GRAPH_KINDS,
        hub: 'centre',
    };
}

/**
 * Fifteen nodes, most with fourteen-letter names, some longer: at phone
 * width the side labels are shortened, never overlapping.
 * @param {{ weights?: boolean }} [options]
 * @returns {import('../js/graph.js').GraphData}
 */
function catalogueLongNetwork({ weights = false } = {}) {
    const names = [
        'Booster site A',
        'Booster site B',
        'Booster site C',
        'Reservoir North-East high zone',
        'Booster site E',
        'Booster site F',
        'Treatment plant on the river',
        'Booster site H',
        'Booster site I',
        'Booster site J',
        'Booster site K',
        'Pumping station by the harbour',
        'Booster site M',
        'Booster site N',
    ];
    const edges = names.map((_, i) => ({ from: `n${i}`, to: 'hub', kind: i % 4 === 3 ? 'radio' : 'telemetry' }));
    edges.push({ from: 'hub', to: 'n2', kind: 'control' }, { from: 'hub', to: 'n2', kind: 'planned' });
    return {
        nodes: [
            { id: 'hub', label: 'Control centre', description: 'where every reading arrives' },
            ...names.map((label, i) => ({ id: `n${i}`, label, description: `site ${i + 1}`, weight: weights ? (i % 5) / 4 : null })),
        ],
        edges,
        kinds: GRAPH_KINDS,
        hub: 'hub',
    };
}

/** What each block's try buttons have set. @type {WeakMap<Element, { long: boolean, weights: boolean, tick: number }>} */
const graphTries = new WeakMap();
/** @param {Element} block */
const graphTry = (block) => {
    let state = graphTries.get(block);
    if (!state) {
        state = { long: false, weights: false, tick: 0 };
        graphTries.set(block, state);
    }
    return state;
};
/** @param {{ long: boolean, weights: boolean, tick: number }} state */
const graphData = (state) => (state.long ? catalogueLongNetwork(state) : catalogueNetwork(state));

const GRAPH_WORDS = {
    empty: 'Nothing to draw yet: no site has reported to the control centre.',
    error: 'The network could not be read: the control centre did not answer.',
};

document.addEventListener('click', (event) => {
    const button = event.target instanceof Element ? event.target.closest('[data-cat-graph]') : null;
    const block = button?.closest('.cat-block');
    if (!button || !block) return;
    const what = button.getAttribute('data-cat-graph') ?? '';
    const state = graphTry(block);
    if (what === 'long' || what === 'weights') {
        const on = button.getAttribute('aria-pressed') !== 'true';
        button.setAttribute('aria-pressed', String(on));
        state[what] = on;
    } else if (what === 'live') state.tick += 1;
    import('../js/graph.js').then(({ setGraphData, setGraphState }) => {
        for (const graph of block.querySelectorAll('.kp-graph')) {
            if (what === 'loading') setGraphState(graph, 'loading');
            else if (what === 'empty' || what === 'error') setGraphState(graph, what, GRAPH_WORDS[what]);
            else setGraphData(graph, graphData(state));
        }
    });
});

document.addEventListener('kp-graph-change', (event) => {
    const graph = event.target instanceof Element ? event.target : null;
    const block = graph?.closest('.cat-block');
    const line = block?.querySelector('[data-cat-graph-log]');
    if (!block || !line || block.querySelector('.kp-graph') !== graph) return;
    const { selected, hiddenKinds } = /** @type {CustomEvent<{ selected: string[], hiddenKinds: string[] }>} */ (event).detail;
    const data = graphData(graphTry(block));
    const name = (/** @type {string} */ id) => data.nodes.find((n) => n.id === id)?.label ?? id;
    const kind = (/** @type {string} */ k) => GRAPH_KINDS.find((x) => x.kind === k)?.label ?? k;
    line.textContent =
        (selected.length ? `Picked: ${selected.map(name).join(', ')}.` : 'Nothing picked.') +
        (hiddenKinds.length ? ` Hidden: ${hiddenKinds.map(kind).join(', ')}.` : ' Every kind of link is shown.');
});

/* ----------------------------------------- a month of nightly backups */

// catalogue/data.html#calendar: a month heatmap of nine services' nightly
// backups. "Now" is fixed at 04/10/2026 14:40 in Brussels, so the block reads
// the same on every day it is opened; that is why each copy is written once
// inside a <template> (where js/auto.js, which would attach it on the real
// clock, cannot reach it) and stamped here with its own attach. The data is
// made up, the same on every load; the detail beside the grid is the page's
// own, as it would be in an app.
const CAL_NOW = Date.parse('2026-10-04T12:40:00Z');
const CAL_SERVICES = [
    'Readings database',
    'Field gateway',
    'Reports',
    'Maps',
    'Alarm relay',
    'Work orders',
    'Invoices',
    'Telemetry archive',
    'Mail relay',
];
const CAL_OLDEST = '2026-08-10';
const CAL_TODAY = dayKey(CAL_NOW);
const calTime = numericTime();
/** Has the block's "The late copies arrive" been pressed? @type {WeakSet<Element>} */
const calLate = new WeakSet();
/** The night each calendar has picked. @type {WeakMap<Element, string>} */
const calPicked = new WeakMap();

/** Was `service` backed up the night of `iso`? The same answer on every load. @param {string} iso @param {number} service @param {boolean} late */
const calBackedUp = (iso, service, late) => {
    if (iso === '2026-09-17') return false; // the night of the power cut
    if (iso === CAL_TODAY && !late && service >= 7) return false; // two copies still running
    const h = Math.sin(Number(iso.replaceAll('-', '')) * 0.731 + service * 12.17) * 9999;
    return h - Math.floor(h) > 0.04;
};

/** @param {boolean} late @returns {Record<string, import('../js/calendar.js').CalendarDay>} */
const calHistory = (late) => {
    /** @type {Record<string, import('../js/calendar.js').CalendarDay>} */
    const days = {};
    for (let t = Date.parse('2026-06-01T12:00:00Z'); dayKey(t) <= CAL_TODAY; t += 86_400_000) {
        const iso = dayKey(t);
        if (iso < CAL_OLDEST) {
            days[iso] = { tone: 'before', label: 'before the first backup was kept' };
            continue;
        }
        const missing = CAL_SERVICES.filter((_, i) => !calBackedUp(iso, i, late));
        const done = CAL_SERVICES.length - missing.length;
        days[iso] = {
            tone: done === CAL_SERVICES.length ? 'ok' : done === 0 ? 'bad' : 'warn',
            count: `${done}/${CAL_SERVICES.length}`,
            label: `${done} of ${CAL_SERVICES.length} services backed up${missing.length && done ? `; missing: ${missing.join(', ')}` : ''}`,
        };
    }
    return days;
};

/** @type {{ tone: import('../js/calendar.js').CalendarTone, label: string }[]} */
const CAL_LEGEND = [
    { tone: 'ok', label: 'Every service backed up' },
    { tone: 'warn', label: 'Some missing' },
    { tone: 'bad', label: 'None backed up' },
    { tone: 'muted', label: 'Nothing to back up' },
    { tone: 'future', label: 'Still to come' },
    { tone: 'before', label: 'Before the first backup' },
];

/** The page's own detail of a picked night. @param {Element} aside @param {string | null} iso @param {boolean} late */
const calDetail = (aside, iso, late) => {
    if (!iso) {
        const p = document.createElement('p');
        p.textContent = "Pick a day to see every service's own state that night.";
        aside.replaceChildren(p);
        return;
    }
    const heading = document.createElement('h3');
    heading.textContent = formatDayKey(iso);
    const list = document.createElement('ul');
    /** @param {string} text */
    const line = (text) => {
        const li = document.createElement('li');
        li.textContent = text;
        list.append(li);
    };
    if (iso > CAL_TODAY) line('A night still to come.');
    else if (iso < CAL_OLDEST) line('Before the first backup was kept.');
    else
        CAL_SERVICES.forEach((name, i) => {
            const li = document.createElement('li');
            const b = document.createElement('b');
            b.textContent = name;
            const span = document.createElement('span');
            const ok = calBackedUp(iso, i, late);
            // The night's snapshot: 00:00 UTC and three minutes per service.
            span.textContent = ok ? `backed up ${calTime(Date.parse(`${iso}T00:00:00Z`) + i * 180_000, 'full', {})}` : 'no backup that night';
            if (!ok) li.setAttribute('data-cat-missing', '');
            li.append(b, span);
            list.append(li);
        });
    aside.replaceChildren(heading, list);
};

/** @param {Element} host */
function stampCalendar(host) {
    const template = host.querySelector(':scope > template');
    if (!(template instanceof HTMLTemplateElement)) return;
    host.setAttribute('data-cat-calendar-ready', '');
    const copy = document.createElement('div');
    copy.setAttribute('data-cat-copy', '');
    copy.append(template.content.cloneNode(true));
    template.after(copy);
    attachCalendars(copy, { now: () => CAL_NOW });
    const late = calLate.has(host.closest('.cat-block') ?? host);
    for (const calendar of copy.querySelectorAll('[data-kp-calendar]')) {
        setCalendarLegend(calendar, CAL_LEGEND);
        setCalendarDays(calendar, calHistory(late));
    }
    for (const aside of copy.querySelectorAll('[data-cat-calendar-detail]')) calDetail(aside, null, late);
}

function settleCalendars() {
    for (const host of document.querySelectorAll('[data-cat-calendar]:not([data-cat-calendar-ready])')) stampCalendar(host);
}
settleCalendars();
new MutationObserver(() => settleCalendars()).observe(document.documentElement, { childList: true, subtree: true });

document.addEventListener(CALENDAR_PICK_EVENT, (event) => {
    const calendar = event.target instanceof Element ? event.target : null;
    const block = calendar?.closest('.cat-block');
    if (!calendar || !block?.querySelector('[data-cat-calendar]')) return;
    const { date, source } = /** @type {CustomEvent<{ date: string, source: string }>} */ (event).detail;
    calPicked.set(calendar, date);
    const aside = calendar.closest('.kp-calendar-layout')?.querySelector('[data-cat-calendar-detail]');
    if (aside) calDetail(aside, date, calLate.has(block));
    const log = block.querySelector('[data-cat-calendar-log]');
    if (log) log.textContent = `kp-calendar-pick: ${formatDayKey(date)}, by ${source}.`;
});

document.addEventListener('click', (event) => {
    const button = event.target instanceof Element ? event.target.closest('[data-cat-calendar-state]') : null;
    const block = button?.closest('.cat-block');
    if (!button || !block) return;
    const what = button.getAttribute('data-cat-calendar-state');
    const calendars = block.querySelectorAll('[data-cat-calendar] [data-kp-calendar]');
    const n = CAL_SERVICES.length;
    if (what === 'live') {
        // A live update: today's two late copies arrive; the focus and the pick stay.
        calLate.add(block);
        for (const calendar of calendars) {
            setCalendarDays(calendar, calHistory(true));
            const aside = calendar.closest('.kp-calendar-layout')?.querySelector('[data-cat-calendar-detail]');
            if (aside) calDetail(aside, calPicked.get(calendar) ?? null, true);
        }
        return;
    }
    for (const other of block.querySelectorAll('[data-cat-calendar-state]:not([data-cat-calendar-state="live"])'))
        other.setAttribute('aria-pressed', String(other === button));
    const late = calLate.has(block);
    for (const calendar of calendars) {
        if (what === 'loading') setCalendarState(calendar, 'loading', `Reading the backups of ${n} services: 4 of ${n} read.`);
        else if (what === 'empty') setCalendarState(calendar, 'empty', 'No service keeps data, so there is nothing to check.');
        else if (what === 'error') setCalendarState(calendar, 'error', `None of the ${n} services could be read: the backup store did not answer.`);
        else {
            setCalendarState(calendar, 'ready');
            setCalendarDays(calendar, calHistory(late));
        }
    }
});

/* ------------------------------------- the menu button and the tour [scope-143] */

/** @type {import('../js/menu-button.js').MenuGroup[]} */
const CAT_MENU = [
    {
        group: 'Run',
        items: [
            { label: 'Restart the pumps', hint: 'Stop and start both pumps, one after the other', value: 'restart' },
            { label: 'Switch to the spare pump', hint: 'Run on pump 2 while pump 1 rests', value: 'spare' },
            {
                label: 'Run a pressure test',
                hint: 'Close the ring main valve and measure for ten minutes',
                disabled: 'Not while a field engineer is on site',
                value: 'test',
            },
        ],
    },
    {
        group: 'Readings',
        items: [
            { label: 'Open the readings on Charts', hint: 'Pressure and flow for the last 24 hours', href: './chart.html', value: 'charts' },
            { label: 'Recalibrate the sensors…', hint: 'Set the pressure sensors to the reference gauge', value: 'recalibrate' },
        ],
    },
    {
        group: 'Records',
        items: [
            { label: 'Print the site sheet', hint: 'One page with the pumps, the valves and the contacts', value: 'print' },
            { label: 'Archive this pump house…', hint: 'Take it off the network; its readings are kept', danger: true, value: 'archive' },
        ],
    },
];
/** The refill: the test may run now, and a new action joined. @type {import('../js/menu-button.js').MenuGroup[]} */
const CAT_MENU_REFILLED = [
    {
        group: 'Run',
        items: [
            CAT_MENU[0].items[0],
            CAT_MENU[0].items[1],
            { label: 'Run a pressure test', hint: 'Close the ring main valve and measure for ten minutes', value: 'test' },
            { label: 'Silence the door alarm', hint: 'For one hour; it sounds again if the door stays open', value: 'silence' },
        ],
    },
    CAT_MENU[1],
    CAT_MENU[2],
];
/** Twenty-four actions in four groups: the menu scrolls inside itself. @type {import('../js/menu-button.js').MenuGroup[]} */
const CAT_MENU_MANY = ['Run', 'Readings', 'Records', 'People'].map((group, g) => ({
    group,
    items: Array.from({ length: 6 }, (_, i) => ({
        label: `${group} action ${i + 1}`,
        hint: `What ${group.toLowerCase()} action ${i + 1} does, in one line`,
        value: `${g}-${i}`,
        ...(i === 3 ? { disabled: 'Only for the shift lead' } : {}),
    })),
}));
/** The last fill per block, so a refill swaps between the two. @type {WeakMap<Element, unknown>} */
const menuFills = new WeakMap();
/** A block's pending refill. @type {WeakMap<Element, number>} */
const menuRefills = new WeakMap();
/** How often the page's own Escape listener heard a press. */
let catEscapes = 0;
/** @param {Element} block @param {string} said */
const sayMenu = (block, said) => {
    const line = block.querySelector('[data-cat-menu-log]');
    if (line) line.textContent = `${said} The page's own Escape listener heard ${catEscapes} ${catEscapes === 1 ? 'press' : 'presses'}.`;
};
document.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape') return;
    catEscapes += 1;
    for (const block of document.querySelectorAll('.cat-block:has([data-cat-menu-log])')) sayMenu(block, 'Escape heard.');
});
document.addEventListener('kp-menu-select', (event) => {
    const block = event.target instanceof Element ? event.target.closest('.cat-block') : null;
    if (!block) return;
    const { item, value } = /** @type {CustomEvent<{ item: HTMLElement, value: string }>} */ (event).detail;
    sayMenu(block, `Picked: ${item.querySelector('.kp-menu__label')?.textContent} (${value}).`);
});
document.addEventListener('click', (event) => {
    const button = event.target instanceof Element ? event.target.closest('[data-cat-menu]') : null;
    const block = button?.closest('.cat-block');
    if (!button || !block) return;
    const what = button.getAttribute('data-cat-menu');
    import('../js/menu-button.js').then(({ setMenu }) => {
        /** @param {import('../js/menu-button.js').MenuGroup[] | 'loading'} groups */
        const fill = (groups) => {
            menuFills.set(block, groups);
            for (const wrapper of block.querySelectorAll('[data-cat-menu-target]')) setMenu(wrapper, groups);
        };
        clearTimeout(menuRefills.get(block));
        if (what === 'refill') {
            sayMenu(block, 'A refill comes in 3 s: open a menu and wait; it shows once the menu closes.');
            menuRefills.set(
                block,
                window.setTimeout(() => {
                    fill(menuFills.get(block) === CAT_MENU_REFILLED ? CAT_MENU : CAT_MENU_REFILLED);
                    sayMenu(block, 'Refilled (an open menu keeps its entries until it closes).');
                }, 3000),
            );
            return;
        }
        fill(what === 'loading' ? 'loading' : what === 'many' ? CAT_MENU_MANY : what === 'empty' ? [] : CAT_MENU);
    });
});

const CAT_TOUR = 'catalogue';
/** @param {(name: string) => string} at */
const catTourSteps = (at) => [
    {
        target: at('areas'),
        title: 'The areas',
        text: 'Five areas, always in the same place: the overview, the pump houses, their readings, incidents and backups.',
    },
    { target: at('search'), title: 'Search', text: 'Find a pump house by its name or its number; Ctrl K does the same from anywhere.' },
    { target: at('readings'), title: 'Readings today', text: 'How the network did since midnight; a dip in pressure shows here first.' },
    {
        target: at('map'),
        title: 'The map',
        text: 'Which site talks to which. (This page has no map, so this step is left out and the count says five.)',
    },
    { target: at('incidents'), title: 'Open incidents', text: 'What needs someone, and who is on it.' },
    { target: at('help'), title: 'Help', text: 'Everything here again, with the words this site uses. The tour starts from Help too.' },
];
/** The button that opened the Help drawer last, for the tour Help starts. @type {HTMLElement | null} */
let helpOpener = null;
document.addEventListener('kp-dialog-open', (event) => {
    if (event.target instanceof Element && event.target.id === 'ov-dr-help') helpOpener = /** @type {CustomEvent} */ (event).detail.trigger;
});
/** @param {string} said */
const sayTour = (said) =>
    import('../js/tour.js').then(({ shouldStartTour, tourRemembered }) => {
        const line = document.querySelector('[data-cat-tour-log]');
        if (!line) return;
        const remembered = tourRemembered(CAT_TOUR);
        const automated = navigator.webdriver;
        const auto = shouldStartTour({ search: location.search, remembered, automated });
        line.textContent =
            `${said} Taken before: ${remembered ? 'yes' : 'no'}. On a visit like this one it would start by itself: ` +
            `${auto == null ? (automated ? 'no, this browser is driven by a script' : 'no, it was taken before') : 'yes (this page waits for a button instead)'}.`;
    });
/** @param {'wide' | 'phone'} where @param {HTMLElement | null} returnFocus */
const runCatTour = (where, returnFocus) =>
    import('../js/tour.js').then(({ startTour }) => {
        const tour = startTour(
            catTourSteps((name) => (where === 'phone' ? `[data-cat-tour-phone="${name}"]` : `[data-cat-tour-step="${name}"]`)),
            {
                remember: CAT_TOUR,
                returnFocus,
                onEnd: (finished) => sayTour(finished ? 'The tour ran to the end.' : 'The tour was ended early.'),
            },
        );
        if (!tour) sayTour('No step had its part on the page, so the tour did not start.');
    });
document.addEventListener('click', (event) => {
    const button = event.target instanceof Element ? event.target.closest('[data-cat-tour]') : null;
    if (!button) return;
    const what = button.getAttribute('data-cat-tour');
    if (what === 'forget') {
        import('../js/tour.js').then(({ forgetTour }) => {
            forgetTour(CAT_TOUR);
            sayTour('Forgotten.');
        });
    } else if (what === 'help') {
        /** @type {HTMLDialogElement | null} */ (button.closest('dialog'))?.close();
        runCatTour('wide', helpOpener);
    } else runCatTour(what === 'phone' ? 'phone' : 'wide', /** @type {HTMLElement} */ (button));
});
if (document.querySelector('[data-cat-tour-log]')) {
    sayTour('No tour yet.');
    // `?tour` starts it, as a consumer's first visit would.
    if (new URLSearchParams(location.search).has('tour')) runCatTour('wide', null);
}
