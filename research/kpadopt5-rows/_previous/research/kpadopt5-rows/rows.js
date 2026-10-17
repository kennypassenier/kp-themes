// research/kpadopt5-rows: the sample data of the page and the buttons of its controls. Everything that is shown is the package's own
// module; this file only fills the lists, answers the demo's buttons and plays the parts a server would play.
import { undoToast } from '../../js/undo-toast.js';
import { setSelectionBusy, setSelectionResult, setSelectionRules } from '../../js/selection-bar.js';
import { setRequests, setRequestsState } from '../../js/request-inspector.js';
import { attachCodes } from '../../js/code.js';
import { rowSelect } from '../../js/row-select.js';
import { getStrings } from '../../js/strings.js';

/** @param {string} sel @param {ParentNode} [root] @returns {HTMLElement | null} */
const $ = (sel, root = document) => /** @type {HTMLElement | null} */ (root.querySelector(sel));
/** @param {string} sel @param {ParentNode} [root] @returns {HTMLElement[]} */
const $$ = (sel, root = document) => /** @type {HTMLElement[]} */ ([...root.querySelectorAll(sel)]);

/** Press one button of a group: it is on, its siblings are off. @param {HTMLElement} button */
function pick(button) {
    const group = button.closest('[role="group"]');
    if (!group) return;
    for (const b of group.querySelectorAll('button[aria-pressed]')) b.setAttribute('aria-pressed', String(b === button));
}

/** @param {string} tag @param {string} className @param {string} [text] */
function make(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
}

/** Run once the package's own boot (js/auto.js) has attached everything the page carries. @param {() => void} run */
function onReady(run) {
    const root = document.documentElement;
    if (root.hasAttribute('data-kp-auto-ready')) return run();
    new MutationObserver((_, obs) => {
        if (!root.hasAttribute('data-kp-auto-ready')) return;
        obs.disconnect();
        run();
    }).observe(root, { attributes: true });
}

const pad = (/** @type {number} */ n) => String(n).padStart(2, '0');
const clock = (/** @type {Date} */ d) => `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;

// ---------------------------------------------------------------- orders (ticking rows)

const ORDERS = [
    ['1001', 'Janssens Bakery', 'Ghent', 'Paid', 412.5],
    ['1002', 'De Smet & Zonen', 'Antwerp', 'Open', 1288],
    ['1003', 'Peeters Garden Centre', 'Leuven', 'Paid', 96.2],
    ['1004', 'Maes Plumbing', 'Ghent', 'Open', 740],
    ['1005', 'Willems Optics', 'Bruges', 'Paid', 215.9],
    ['1006', 'Claes Tools', 'Antwerp', 'Overdue', 3310.4],
    ['1007', 'Jacobs Cycling', 'Ghent', 'Open', 58],
    ['1008', 'Mertens Dairy', 'Leuven', 'Locked', 9120],
    ['1009', 'Goossens Print', 'Bruges', 'Paid', 640.75],
    ['1010', 'Wouters Timber', 'Ghent', 'Open', 2075],
    ['1011', 'Hermans Books', 'Antwerp', 'Paid', 129.99],
    ['1012', 'Dubois Wine', 'Leuven', 'Overdue', 1830],
];
const money = (/** @type {number} */ n) => new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'EUR' }).format(n);

function renderOrders() {
    const body = $('[data-k5-orders]');
    if (body) {
        for (const [id, customer, city, status, total] of ORDERS) {
            const row = make('tr', '');
            row.dataset.kpRowKey = id;
            const locked = status === 'Locked';
            row.innerHTML = `
                <td data-label=""><input class="kp-field__check" type="checkbox" data-kp-select-row aria-label="Select order ${id}"${locked ? ' disabled' : ''} /></td>
                <td data-label="Order"><code class="kp-mono">${id}</code></td>
                <td data-label="Customer">${customer}</td>
                <td data-label="City">${city}</td>
                <td data-label="Status"><span class="kp-badge${status === 'Overdue' ? ' kp-badge--destructive' : status === 'Paid' ? ' kp-badge--success' : ''}">${locked ? 'Locked by finance' : status}</span></td>
                <td data-label="Total" class="kp-text-end kp-numeric" data-kp-sort-value="${total}">${money(total)}</td>`;
            body.append(row);
        }
    }
    const list = $('[data-k5-orders-phone]');
    if (list) {
        for (const [id, customer, city, status, total] of ORDERS.slice(0, 6)) {
            const li = make('li', '');
            li.dataset.kpRowKey = id;
            const locked = status === 'Locked';
            li.innerHTML = `
                <input class="kp-field__check" type="checkbox" data-kp-select-row aria-label="Select order ${id}"${locked ? ' disabled' : ''} />
                <span><span class="k5-cards__title">${customer}</span><span class="k5-cards__meta">${id} · ${city} · ${money(total)}</span></span>
                <span class="kp-badge${status === 'Overdue' ? ' kp-badge--destructive' : status === 'Paid' ? ' kp-badge--success' : ''}">${locked ? 'Locked' : status}</span>`;
            list.append(li);
        }
    }
}

function wireOrders() {
    const table = $('#k5-orders');
    const phone = $('#k5-orders-phone');
    const readout = $('[data-k5-rows-readout]');
    if (!table || !readout) return;
    const strings = getStrings();
    let last = '';
    const show = () => {
        const keys = rowSelect(table)?.keys() ?? [];
        const cursor = rowSelect(table)?.cursor();
        readout.textContent = [
            keys.length ? `${strings.rowSelectCount(keys.length)}: ${keys.join(', ')}.` : 'Nothing ticked.',
            cursor ? `Cursor on order ${cursor}.` : '',
            last,
        ]
            .filter(Boolean)
            .join(' ');
    };
    for (const el of [table, phone]) {
        el?.addEventListener('kp-rows-select', (event) => {
            const detail = /** @type {CustomEvent<{ skipped: number, source: string }>} */ (event).detail;
            last =
                detail.skipped > 0 ? strings.rowSelectSkipped(detail.skipped) + '.' : detail.source === 'clear' ? strings.selectionCleared + '.' : '';
            show();
        });
        el?.addEventListener('change', () => queueMicrotask(show));
        el?.addEventListener('kp-row-open', (event) => {
            const row = /** @type {CustomEvent<{ row: HTMLElement }>} */ (event).detail.row;
            last = `Opened: order ${row.dataset.kpRowKey}.`;
            show();
        });
    }
    table.addEventListener('keyup', show);
    table.addEventListener('focusin', () => queueMicrotask(show));
    document.addEventListener('click', (event) => {
        const target = event.target instanceof Element ? event.target : null;
        const search = target?.closest('[data-k5-search]');
        if (search) {
            pick(/** @type {HTMLElement} */ (search));
            const input = /** @type {HTMLInputElement | null} */ ($('[data-kp-datatable-search]', table));
            if (input) {
                input.value = search.getAttribute('data-k5-search') ?? '';
                input.dispatchEvent(new Event('input', { bubbles: true }));
            }
        }
        const arrows = target?.closest('[data-k5-arrows]');
        if (arrows) {
            pick(/** @type {HTMLElement} */ (arrows));
            if (arrows.getAttribute('data-k5-arrows') === 'on') table.setAttribute('data-kp-select-arrows', '');
            else table.removeAttribute('data-kp-select-arrows');
            if (phone)
                arrows.getAttribute('data-k5-arrows') === 'on'
                    ? phone.setAttribute('data-kp-select-arrows', '')
                    : phone.removeAttribute('data-kp-select-arrows');
        }
        const allkey = target?.closest('[data-k5-allkey]');
        if (allkey) {
            pick(/** @type {HTMLElement} */ (allkey));
            if (allkey.getAttribute('data-k5-allkey') === 'on') table.setAttribute('data-kp-select-all-key', '');
            else table.removeAttribute('data-kp-select-all-key');
        }
    });
}

// ---------------------------------------------------------------- stacks (the selection bar)

const STACKS = [
    ['media', 'ct-106', 'Running', false],
    ['vault', 'ct-110', 'Running', true],
    ['backup', 'ct-104', 'Running', false],
    ['monitoring', 'ct-107', 'Updating', false],
    ['dns', 'ct-102', 'Running', true],
    ['mail', 'ct-111', 'Stopped', true],
    ['wiki', 'ct-108', 'Running', false],
    ['ci', 'ct-109', 'Running', false],
    ['photos', 'ct-112', 'Running', false],
    ['notes', 'ct-113', 'Stopped', false],
    ['feeds', 'ct-114', 'Running', false],
    ['music', 'ct-115', 'Running', false],
];
const PINNED = new Set(STACKS.filter((s) => s[3]).map((s) => String(s[0])));

function renderStacks() {
    const body = $('[data-k5-stacks]');
    if (body)
        for (const [name, host, status, pinned] of STACKS) {
            const row = make('tr', '');
            row.dataset.kpRowKey = String(name);
            row.innerHTML = `
                <td data-label=""><input class="kp-field__check" type="checkbox" data-kp-select-row aria-label="Select ${name}" /></td>
                <td data-label="Stack"><b>${name}</b>${pinned ? ' <span class="kp-badge">pinned</span>' : ''}</td>
                <td data-label="Host"><code class="kp-mono">${host}</code></td>
                <td data-label="Status">${status}</td>`;
            body.append(row);
        }
    const cards = $('[data-k5-stacks-cards]');
    if (cards)
        for (const [name, host, status, pinned] of STACKS.slice(0, 6)) {
            const li = make('li', '');
            li.dataset.kpRowKey = String(name);
            li.innerHTML = `
                <input class="kp-field__check" type="checkbox" data-kp-select-row aria-label="Select ${name}" />
                <span><span class="k5-cards__title">${name}</span><span class="k5-cards__meta">${host} · ${status}</span></span>
                ${pinned ? '<span class="kp-badge">pinned</span>' : '<span></span>'}`;
            cards.append(li);
        }
}

function wireStacks() {
    const bar = $('#k5-bar');
    const phoneBar = $('#k5-bar-phone');
    if (!bar) return;
    const state = { outcome: 'ok' };
    const bed = () => $('[data-k5-bed="selection"]');
    onReady(() => {
        for (const b of [bar, phoneBar]) {
            if (!b) continue;
            setSelectionRules(b, {
                update: (items) => {
                    const pinned = items.filter((i) => PINNED.has(i.key)).length;
                    return pinned > 0 ? `${getStrings().selectionCan(items.length - pinned, items.length)} can be updated (pinned stacks stay)` : '';
                },
            });
        }
    });
    document.addEventListener('kp-selection-action', (event) => {
        const e = /** @type {CustomEvent<{ action: string, keys: string[], undoMs: number }>} */ (event);
        const target = /** @type {HTMLElement} */ (e.target);
        const { action, keys, undoMs } = e.detail;
        if (action === 'delete') {
            const rows = keys.flatMap((k) => $$(`[data-kp-row-key="${k}"]`));
            for (const row of rows) {
                const box = /** @type {HTMLInputElement | null} */ ($('[data-kp-select-row]', row));
                if (box?.checked) {
                    box.checked = false;
                    box.dispatchEvent(new Event('change', { bubbles: true }));
                }
                row.hidden = true;
            }
            undoToast(`${keys.length} ${keys.length === 1 ? 'stack' : 'stacks'} deleted`, {
                region: bed(),
                ms: undoMs,
                max: 3,
                commit: () => Promise.resolve(),
                undo: () => {
                    for (const row of rows) row.hidden = false;
                },
            });
            return;
        }
        const verb = action === 'backup' ? 'Backing up' : 'Updating';
        setSelectionBusy(target, `${verb} ${keys.length}…`);
        setTimeout(() => {
            const refused = state.outcome === 'refuse' ? [{ key: keys[0], reason: action === 'backup' ? 'disk full' : 'version pinned' }] : [];
            setSelectionResult(target, { done: keys.length - refused.length, refused });
        }, 1600);
    });
    document.addEventListener('click', (event) => {
        const target = event.target instanceof Element ? event.target : null;
        const placement = target?.closest('[data-k5-placement]');
        if (placement) {
            pick(/** @type {HTMLElement} */ (placement));
            bar.setAttribute('data-kp-placement', placement.getAttribute('data-k5-placement') ?? 'sticky-top');
        }
        const names = target?.closest('[data-k5-names]');
        if (names) {
            pick(/** @type {HTMLElement} */ (names));
            bar.setAttribute('data-kp-selection-names', names.getAttribute('data-k5-names') ?? 'names');
        }
        const matching = target?.closest('[data-k5-matching]');
        if (matching) {
            pick(/** @type {HTMLElement} */ (matching));
            bar.setAttribute('data-kp-select-matching', matching.getAttribute('data-k5-matching') ?? '0');
        }
        const outcome = target?.closest('[data-k5-outcome]');
        if (outcome) {
            pick(/** @type {HTMLElement} */ (outcome));
            state.outcome = outcome.getAttribute('data-k5-outcome') ?? 'ok';
        }
        if (target?.closest('[data-k5-stacks-reset]'))
            for (const row of $$('[data-kp-row-key]', document)) if (row.closest('#k5-stacks, #k5-stacks-cards')) row.hidden = false;
    });
}

// ---------------------------------------------------------------- schedules (the undo toast)

const SCHEDULES = [
    ['Nightly backup', 'every day at 02:00'],
    ['Weekly update', 'Sundays at 04:30'],
    ['Disk report', 'the first of the month, 08:00'],
    ['Certificate check', 'every Monday at 07:15'],
    ['Cache cleanup', 'every 6 hours'],
];

function wireSchedules() {
    const list = $('[data-k5-schedules]');
    if (!list) return;
    const state = { clock: 'ring', ms: 6000, mode: 'defer', server: 'ok' };
    const log = $('[data-k5-server-log]');
    const say = (/** @type {string} */ text) => log && (log.textContent = `${clock(new Date())} ${text}`);
    const bed = () => $('[data-k5-bed="undo"]');
    for (const [name, when] of SCHEDULES) {
        const li = make('li', '');
        li.innerHTML = `<span></span><span><span class="k5-cards__title"></span><span class="k5-cards__meta"></span></span><button type="button" class="kp-button kp-button--sm kp-button--destructive">Delete</button>`;
        /** @type {HTMLElement} */ (li.querySelector('.k5-cards__title')).textContent = name;
        /** @type {HTMLElement} */ (li.querySelector('.k5-cards__meta')).textContent = when;
        li.dataset.name = name;
        list.append(li);
    }
    /** @param {string} name @param {() => void} show @param {() => void} hide */
    const remove = (name, show, hide) => {
        hide();
        const reverting = state.mode === 'revert';
        if (reverting) say(`Server: deleted ${name}.`);
        undoToast(`${name} deleted`, {
            region: bed(),
            clock: /** @type {any} */ (state.clock),
            ms: state.ms,
            mode: /** @type {any} */ (state.mode),
            commit: async () => {
                if (state.server === 'refuse') throw new Error('the server refused: the schedule is locked');
                say(`Server: deleted ${name}.`);
            },
            undo: () => {
                if (reverting) say(`Server: restored ${name}.`);
                show();
            },
        });
    };
    list.addEventListener('click', (event) => {
        const button = event.target instanceof Element ? event.target.closest('button') : null;
        const li = button?.closest('li');
        if (!button || !li) return;
        remove(
            li.dataset.name ?? '',
            () => (li.hidden = false),
            () => (li.hidden = true),
        );
    });
    document.addEventListener('click', (event) => {
        const target = event.target instanceof Element ? event.target : null;
        for (const [attr, key] of /** @type {const} */ ([
            ['data-k5-clock', 'clock'],
            ['data-k5-ms', 'ms'],
            ['data-k5-mode', 'mode'],
            ['data-k5-server', 'server'],
        ])) {
            const b = target?.closest(`[${attr}]`);
            if (!b) continue;
            pick(/** @type {HTMLElement} */ (b));
            const v = b.getAttribute(attr) ?? '';
            /** @type {any} */ (state)[key] = key === 'ms' ? Number(v) : v;
        }
        if (target?.closest('[data-k5-schedules-reset]')) for (const li of $$('li', list)) li.hidden = false;
        if (target?.closest('[data-k5-compare]')) {
            for (const kind of /** @type {const} */ (['ring', 'bar', 'text', 'none'])) {
                undoToast(`Compare: the ${kind === 'bar' ? 'rule' : kind} clock`, { region: bed(), clock: kind, ms: state.ms, max: 4 });
            }
            undoToast('Nightly backup deleted', { region: $('[data-k5-bed="undo-phone"]'), clock: 'ring', ms: state.ms, max: 2 });
        }
    });
}

// ---------------------------------------------------------------- the log (the pill)

const MESSAGES = [
    'backup finished',
    'health check passed',
    'container restarted',
    'certificate renewed',
    'disk 71 percent full',
    'upstream timeout',
    'queue drained',
    'job scheduled',
];

function wireLogs() {
    const log = $('#k5-log');
    const phone = $('#k5-log-phone');
    const list = $('#k5-messages');
    if (!log) return;
    let level = 'all';
    let n = 0;
    const empty = make('li', 'k5-log__empty', 'Nothing logged yet.');
    empty.setAttribute('data-kp-newpill-skip', '');
    empty.hidden = true;
    log.append(empty);
    /** @param {HTMLElement} target @param {number} count @param {boolean} [filtered] */
    const add = (target, count, filtered = true) => {
        const frag = document.createDocumentFragment();
        for (let i = 0; i < count; i += 1) {
            n += 1;
            const li = make('li', '');
            const err = n % 7 === 0;
            const when = new Date(Date.now() - (count - i) * 1000);
            li.dataset.level = err ? 'error' : 'info';
            li.innerHTML = `<span>${clock(when).slice(0, 8)}</span><span class="k5-log__level" data-level="${err ? 'error' : 'info'}">${err ? 'ERROR' : 'INFO'}</span><span></span>`;
            /** @type {HTMLElement} */ (li.lastElementChild).textContent = err
                ? `${MESSAGES[n % MESSAGES.length]} (line ${n})`
                : `${MESSAGES[n % MESSAGES.length]} (line ${n})`;
            if (filtered && level === 'error' && !err) li.hidden = true;
            frag.append(li);
        }
        empty.hidden = true;
        target.insertBefore(frag, empty);
    };
    add(log, 40);
    if (phone) {
        const empty2 = make('li', 'k5-log__empty', 'Nothing logged yet.');
        empty2.hidden = true;
        phone.append(empty2);
        for (let i = 0; i < 14; i += 1) {
            n += 1;
            const li = make('li', '');
            li.innerHTML = `<span>${clock(new Date()).slice(0, 8)}</span><span class="k5-log__level" data-level="info">INFO</span><span>${MESSAGES[n % MESSAGES.length]}</span>`;
            phone.insertBefore(li, empty2);
        }
    }
    if (list) {
        for (const [who, what] of [
            ['Anna', 'The backup is done.'],
            ['Bram', 'Disk 71 percent full on ct-106.'],
            ['Carla', 'Certificate renewed.'],
            ['Dirk', 'Queue drained.'],
            ['Eva', 'Health check passed.'],
            ['Floor', 'Upstream timeout on the mirror.'],
        ]) {
            const li = make('li', '');
            li.innerHTML = `<b></b><span></span>`;
            /** @type {HTMLElement} */ (li.firstElementChild).textContent = who;
            /** @type {HTMLElement} */ (li.lastElementChild).textContent = what;
            list.append(li);
        }
    }
    const readout = $('[data-k5-follow-readout]');
    log.addEventListener('kp-follow-change', (event) => {
        const d = /** @type {CustomEvent<{ following: boolean, paused: boolean, unseen: number }>} */ (event).detail;
        if (readout)
            readout.textContent = d.following
                ? 'Following the latest line.'
                : d.paused
                  ? `Paused. ${d.unseen} new lines out of sight.`
                  : `Not following: ${d.unseen} new lines out of sight.`;
    });
    let timer = 0;
    document.addEventListener('click', (event) => {
        const target = event.target instanceof Element ? event.target : null;
        const addBtn = target?.closest('[data-k5-add]');
        if (addBtn) add(log, Number(addBtn.getAttribute('data-k5-add')));
        if (target?.closest('[data-k5-add-phone]') && phone) {
            for (let i = 0; i < 5; i += 1) {
                n += 1;
                const li = make('li', '');
                li.innerHTML = `<span>${clock(new Date()).slice(0, 8)}</span><span class="k5-log__level" data-level="info">INFO</span><span>${MESSAGES[n % MESSAGES.length]}</span>`;
                phone.insertBefore(li, phone.lastElementChild);
            }
        }
        if (target?.closest('[data-k5-message]') && list) {
            const li = make('li', '');
            li.innerHTML = `<b></b><span></span>`;
            /** @type {HTMLElement} */ (li.firstElementChild).textContent = ['Anna', 'Bram', 'Carla'][list.children.length % 3];
            /** @type {HTMLElement} */ (li.lastElementChild).textContent = `A new message at ${clock(new Date())}.`;
            list.prepend(li);
        }
        if (target?.closest('[data-k5-clear]')) {
            for (const li of $$('li:not(.k5-log__empty)', log)) li.remove();
            empty.hidden = false;
        }
        const lv = target?.closest('[data-k5-level]');
        if (lv) {
            pick(/** @type {HTMLElement} */ (lv));
            level = lv.getAttribute('data-k5-level') ?? 'all';
            for (const li of $$('li[data-level]', log)) li.hidden = level === 'error' && li.dataset.level !== 'error';
        }
        const since = target?.closest('[data-k5-since]');
        if (since) {
            pick(/** @type {HTMLElement} */ (since));
            if (since.getAttribute('data-k5-since') === 'on') log.setAttribute('data-kp-since-left', '');
            else log.removeAttribute('data-kp-since-left');
        }
        const run = target?.closest('[data-k5-run]');
        if (run) {
            const on = run.getAttribute('aria-pressed') !== 'true';
            run.setAttribute('aria-pressed', String(on));
            clearInterval(timer);
            if (on) {
                const stop = Date.now() + 10000;
                timer = window.setInterval(() => {
                    add(log, 1);
                    if (Date.now() > stop) {
                        clearInterval(timer);
                        run.setAttribute('aria-pressed', 'false');
                    }
                }, 700);
            }
        }
    });
}

// ---------------------------------------------------------------- payloads

const BIG = JSON.stringify(
    Array.from({ length: 6 }, (_, i) => ({
        id: 2001 + i,
        customer: ['Janssens', 'De Smet', 'Peeters', 'Maes', 'Willems', 'Claes'][i],
        total: 100 + i * 37.5,
        paid: i % 2 === 0,
    })),
);
const TAIL = Array.from({ length: 24 }, (_, i) => `10:${pad(i)}:07 INFO worker ${i % 4} handled job ${4000 + i}`)
    .join('\n')
    .slice(0, 1000);

/** @param {string} text @param {Record<string, string>} attrs */
function figure(text, attrs = {}) {
    const fig = make('figure', 'kp-code kp-code--cell');
    fig.setAttribute('data-kp-code', '');
    fig.setAttribute('data-kp-code-language', 'auto');
    for (const [k, v] of Object.entries(attrs)) fig.setAttribute(k, v);
    const pre = make('pre', '');
    const code = make('code', '');
    code.textContent = text;
    pre.append(code);
    fig.append(pre);
    return fig;
}

const PAYLOADS = [
    ['17/10/2026 20:14', 'backup.done', () => figure('Nightly backup finished: 12 stacks, 3.2 GB, no errors. Next run at 02:00.')],
    ['17/10/2026 20:12', 'sensor.reading', () => figure('{"sensor":"boiler","value":71.4,"unit":"C","ok":true}')],
    ['17/10/2026 20:09', 'orders.export', () => figure(BIG)],
    [
        '17/10/2026 20:03',
        'camera.snapshot',
        () => figure('', { 'data-kp-binary-size': '2100', 'data-kp-download': 'data:application/octet-stream;base64,AAAA' }),
    ],
    ['17/10/2026 19:58', 'log.tail', () => figure(TAIL, { 'data-kp-truncated': '1000/4000' })],
    ['17/10/2026 19:50', 'heartbeat', () => figure('')],
    ['17/10/2026 19:44', 'sensor.reading', () => figure('{"sensor":"cellar","value":12.1,"unit":"C","ok":true}')],
];

function renderPayloads() {
    for (const selector of ['[data-k5-payloads]', '[data-k5-payloads-phone]']) {
        const body = $(selector);
        if (!body) continue;
        for (const [when, topic, make_] of PAYLOADS) {
            const row = make('tr', '');
            row.innerHTML = `<td data-label="Received"></td><td data-label="Topic"><code class="kp-mono"></code></td><td data-label="Payload"></td>`;
            /** @type {HTMLElement} */ (row.children[0]).textContent = when;
            /** @type {HTMLElement} */ (row.querySelector('code')).textContent = topic;
            /** @type {HTMLElement} */ (row.children[2]).append(make_());
            body.append(row);
        }
    }
}

function wirePayloads() {
    const state = { open: 'inline', last: 'ready' };
    /** Put the last row of each table in its state, and every long cell in its way of opening. */
    const apply = () => {
        for (const selector of ['[data-k5-payloads]', '[data-k5-payloads-phone]']) {
            const body = $(selector);
            if (!body) continue;
            const rows = $$('tr', body);
            const last = rows[rows.length - 1];
            const cell = last?.children[2];
            if (cell) {
                const attrs = /** @type {Record<string, Record<string, string>>} */ ({
                    ready: {},
                    loading: { 'data-kp-code-state': 'loading' },
                    binary: { 'data-kp-binary-size': '482100' },
                    empty: {},
                    error: { 'data-kp-code-state': 'error' },
                })[state.last];
                cell.replaceChildren(figure(state.last === 'ready' ? '{"sensor":"cellar","value":12.1,"ok":true}' : '', attrs));
                attachCodes(cell);
            }
            for (const fig of $$('.kp-code--cell', body)) {
                if (!fig.hasAttribute('data-kp-truncated') && !fig.textContent?.includes('"customer"')) continue;
                const td = fig.parentElement;
                if (!td || (fig.getAttribute('data-kp-code-open') ?? 'inline') === state.open) continue;
                const text = fig.querySelector('code')?.textContent ?? '';
                const attrs = fig.hasAttribute('data-kp-truncated') ? { 'data-kp-truncated': fig.getAttribute('data-kp-truncated') ?? '' } : {};
                const next = figure(text, { ...attrs, 'data-kp-code-open': state.open });
                td.replaceChildren(next);
                attachCodes(td);
            }
        }
    };
    document.addEventListener('click', (event) => {
        const target = event.target instanceof Element ? event.target : null;
        const open = target?.closest('[data-k5-open]');
        if (open) {
            pick(/** @type {HTMLElement} */ (open));
            state.open = open.getAttribute('data-k5-open') ?? 'inline';
            apply();
        }
        const last = target?.closest('[data-k5-last]');
        if (last) {
            pick(/** @type {HTMLElement} */ (last));
            state.last = last.getAttribute('data-k5-last') ?? 'ready';
            apply();
        }
    });
}

// ---------------------------------------------------------------- the JSON box

const SAMPLES = {
    valid: '{\n  "topic": "backup.done",\n  "ok": true,\n  "stacks": 12\n}',
    broken: '{\n  "topic": "backup.done"\n  "ok": true,\n  "stacks": 12\n}',
    long: JSON.stringify(
        Array.from({ length: 8 }, (_, i) => ({
            id: 3001 + i,
            name: ['media', 'vault', 'backup', 'monitoring', 'dns', 'mail', 'wiki', 'ci'][i],
            running: i % 3 !== 0,
        })),
        null,
        2,
    ),
    empty: '',
    text: 'hello, this is plain text',
};

function wireJson() {
    const area = /** @type {HTMLTextAreaElement | null} */ ($('#k5-json-a'));
    const free = /** @type {HTMLTextAreaElement | null} */ ($('#k5-json-b'));
    const form = $('[data-k5-json-form]');
    const sent = $('[data-k5-sent]');
    if (!area || !free || !form || !sent) return;
    const send = /** @type {HTMLButtonElement} */ ($('[data-k5-send]'));
    const set = (/** @type {HTMLTextAreaElement} */ el, /** @type {string} */ text) => {
        el.value = text;
        el.dispatchEvent(new Event('input', { bubbles: true }));
        el.dispatchEvent(new Event('blur'));
    };
    form.addEventListener('submit', (event) => {
        event.preventDefault();
        const bad = [...form.querySelectorAll('textarea')].find((t) => !t.checkValidity());
        sent.hidden = false;
        if (bad) {
            bad.focus();
            sent.textContent = 'Not sent: fix the JSON first.';
            return;
        }
        const bytes = new TextEncoder().encode(area.value + free.value).length;
        sent.textContent = `Sent ${bytes} bytes.`;
    });
    document.addEventListener('click', (event) => {
        const target = event.target instanceof Element ? event.target : null;
        const sample = target?.closest('[data-k5-sample]');
        if (sample) {
            pick(/** @type {HTMLElement} */ (sample));
            set(area, SAMPLES[/** @type {keyof typeof SAMPLES} */ (sample.getAttribute('data-k5-sample') ?? 'empty')]);
            set(free, sample.getAttribute('data-k5-sample') === 'text' ? 'plain text is fine here' : SAMPLES.valid);
        }
        const check = target?.closest('[data-k5-check]');
        if (check) {
            pick(/** @type {HTMLElement} */ (check));
            for (const t of [area, free]) t.setAttribute('data-kp-json-check', check.getAttribute('data-k5-check') ?? 'input');
        }
        const format = target?.closest('[data-k5-format]');
        if (format) {
            pick(/** @type {HTMLElement} */ (format));
            for (const t of [area, free]) t.setAttribute('data-kp-json-format', format.getAttribute('data-k5-format') ?? 'button');
        }
        const field = target?.closest('[data-k5-field]');
        if (field) {
            pick(/** @type {HTMLElement} */ (field));
            const kind = field.getAttribute('data-k5-field');
            for (const t of [area, free]) {
                t.readOnly = kind === 'sending';
                t.disabled = kind === 'disabled';
            }
            send.disabled = kind !== 'normal';
            send.textContent = kind === 'sending' ? 'Sending…' : 'Send';
        }
    });
}

// ---------------------------------------------------------------- the requests

const AT = (/** @type {number} */ minutes) => new Date(Date.UTC(2026, 9, 17, 18, 20) - minutes * 60000).toISOString();
const COMMON = { 'content-type': 'application/json', 'user-agent': 'homelab-hooks/3.75', 'x-request-id': '' };
/** @param {Record<string, string>} extra @param {string} id */
const headers = (extra, id) => ({ ...COMMON, 'x-request-id': id, ...extra });

/** @type {import('../../js/request-inspector.js').CapturedRequest[]} */
const SEVEN = [
    {
        at: AT(1),
        method: 'POST',
        path: '/hooks/backup/done?stack=media&attempt=1',
        status: 202,
        headers: headers({ authorization: 'Bearer sk_live_9f2c41d8e07a' }, 'r-7f31'),
        body: '{"stack":"media","ok":true,"bytes":3200000000}',
        bodyBytes: 46,
        source: 'test',
    },
    { at: AT(4), method: 'GET', path: '/health', status: 200, headers: headers({}, 'r-7f2a') },
    {
        at: AT(9),
        method: 'POST',
        path: '/hooks/deploy/ghent/production-cluster/rollout',
        status: 502,
        headers: headers({ authorization: 'Bearer sk_live_9f2c41d8e07a', cookie: 'session=ab12cd34' }, 'r-7f21'),
        body: '{"error":"upstream did not answer","after_ms":5000}',
        bodyBytes: 51,
    },
    {
        at: AT(15),
        method: 'PUT',
        path: '/api/v1/schedules/nightly-backup',
        status: 204,
        headers: headers({ authorization: 'Bearer sk_live_9f2c41d8e07a' }, 'r-7f10'),
        body: '{"cron":"0 2 * * *"}',
        bodyBytes: 20,
    },
    {
        at: AT(22),
        method: 'POST',
        path: '/api/v1/events',
        status: 404,
        headers: headers({ 'x-api-key': 'k_83hd72ks' }, 'r-7ef4'),
        body: '{"error":"unknown topic","topic":"backup.dnoe"}',
        bodyBytes: 47,
    },
    {
        at: AT(31),
        method: 'POST',
        path: '/upload/snapshot',
        status: 201,
        headers: headers({ 'content-type': 'image/jpeg' }, 'r-7ee0'),
        body: '\u0000binary',
        binary: true,
        bodyBytes: 2150,
    },
    { at: AT(40), method: 'POST', path: '/hooks/logs', status: 200, headers: headers({}, 'r-7ec2'), body: TAIL, truncated: true, bodyBytes: 4000 },
];
const MANY = Array.from({ length: 31 }, (_, i) => {
    const status = [200, 200, 201, 204, 301, 404, 200, 502, 200, 429][i % 10];
    return {
        at: AT(i * 3 + 1),
        method: ['GET', 'POST', 'PUT'][i % 3],
        path: `/api/v1/items/${1000 + i}`,
        status,
        headers: headers({}, `r-${6000 + i}`),
        body: i % 2 ? `{"item":${1000 + i}}` : '',
        bodyBytes: i % 2 ? 14 : 0,
    };
});

function wireRequests() {
    const els = $$('[data-kp-requests]');
    if (!els.length) return;
    const readout = $('[data-k5-req-readout]');
    /** @param {string} kind */
    const show = (kind) => {
        for (const el of els) {
            if (kind === 'seven') setRequests(el, SEVEN);
            else if (kind === 'many') setRequests(el, MANY);
            else if (kind === 'empty') setRequests(el, []);
            else if (kind === 'error') setRequestsState(el, 'error', { message: 'The service did not answer in 5 s.' });
            else setRequestsState(el, 'loading');
        }
    };
    let kind = 'seven';
    onReady(() => show(kind));
    document.addEventListener('click', (event) => {
        const target = event.target instanceof Element ? event.target : null;
        const req = target?.closest('[data-k5-req]');
        if (req) {
            pick(/** @type {HTMLElement} */ (req));
            kind = req.getAttribute('data-k5-req') ?? 'seven';
            show(kind);
        }
        const open = target?.closest('[data-k5-reqopen]');
        if (open) {
            pick(/** @type {HTMLElement} */ (open));
            for (const el of els) el.setAttribute('data-kp-requests-open', open.getAttribute('data-k5-reqopen') ?? 'failed');
        }
        const secrets = target?.closest('[data-k5-secrets]');
        if (secrets) {
            pick(/** @type {HTMLElement} */ (secrets));
            for (const el of els) el.setAttribute('data-kp-secrets-in-copy', secrets.getAttribute('data-k5-secrets') ?? 'masked');
        }
    });
    for (const el of els) {
        el.addEventListener('kp-requests-copy', (event) => {
            const d = /** @type {CustomEvent<{ what: string, masked: boolean, text: string }>} */ (event).detail;
            if (readout)
                readout.textContent = `Copied ${d.what}${d.masked ? ' with the secrets masked' : ''}: ${d.text.slice(0, 90)}${d.text.length > 90 ? ' …' : ''}`;
        });
        el.addEventListener('kp-requests-test', () => {
            const test = {
                at: new Date(Date.UTC(2026, 9, 17, 18, 21)).toISOString(),
                method: 'POST',
                path: '/hooks/test',
                status: 200,
                headers: headers({}, 'r-test'),
                body: '{"test":true}',
                bodyBytes: 13,
                source: 'test',
            };
            for (const target of els) setRequests(target, [test]);
        });
        el.addEventListener('kp-requests-retry', () => {
            for (const target of els) setRequestsState(target, 'loading');
            setTimeout(() => show('seven'), 1200);
        });
    }
}

renderOrders();
renderStacks();
renderPayloads();
wireOrders();
wireStacks();
wireSchedules();
wireLogs();
wirePayloads();
wireJson();
wireRequests();
