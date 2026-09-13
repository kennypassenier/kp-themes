// Behaviour a catalogue block needs that the package does not attach by
// itself. Delegated from the document, so it works on the component page, on
// the review page that gathers the block, and in a compare column alike —
// an inline script in the page would run in the first place only.
import { toast } from '../js/overlays.js';

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
