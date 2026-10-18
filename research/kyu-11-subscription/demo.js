// research/kyu-11-subscription: the sample data of the page and the buttons of its controls. Everything that is shown is the
// package's own module; this file fills the lists, answers the demo's buttons and plays the parts a kyu server would play.
// All of it is mock data in kyu's real shape.
import { setIdmark, idmarkColours } from '../../js/idmark.js';
import { setAgo, agoMoment } from '../../js/freshness.js';
import { setBullets } from '../../js/bullets.js';
import { setProgress, setIndeterminate } from '../../js/progressbar.js';
import { setCardState } from '../../js/card-state.js';
import { dataTable } from '../../js/datatable.js';
import { attachCodes } from '../../js/code.js';
import { undoToast } from '../../js/undo-toast.js';
import {
    setGanttRuns,
    setGanttState,
    setGanttPoints,
    setGanttKinds,
    setGanttZones,
    setGanttWindow,
} from '../../js/gantt.js';
import { setRequests, setRequestsState } from '../../js/request-inspector.js';
import { setUptime } from '../../js/uptime.js';
import { setStrings } from '../../js/strings.js';

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

/** @param {string} tag @param {string} [className] @param {string} [text] */
function make(tag, className = '', text) {
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

/** A button of a control group: the attribute, its value, what to do. @param {string} attr @param {(value: string, button: HTMLElement) => void} run */
function onPress(attr, run) {
    document.addEventListener('click', (event) => {
        const button = event.target instanceof Element ? /** @type {HTMLElement | null} */ (event.target.closest(`[${attr}]`)) : null;
        if (!button) return;
        pick(button);
        run(button.getAttribute(attr) ?? '', button);
    });
}

/** The page's choice sets: the review dialog fires `review:choice` when a default is changed; each is applied live. @type {Record<string, (value: string) => void>} */
const CHOICES = {};
document.addEventListener('review:choice', (event) => {
    const { id, value } = /** @type {CustomEvent<{ id: string, value: string }>} */ (event).detail;
    CHOICES[id]?.(value);
});

const NOW = Date.now();
const MIN = 60_000;
const SEC = 1000;
/** dd/mm/yyyy HH:mm:ss in Europe/Brussels, for the lane names. @param {number} ms */
const withSeconds = (ms) => `${agoMoment(ms)}:${String(Math.floor(ms / 1000) % 60).padStart(2, '0')}`;

// kyu's own words on the uptime strip: a day is judged by what was delivered, not by what was up.
setStrings({
    uptimeIncidents: (n) => `${n} dead`,
    uptimeSummary: (percent, n) => `${percent}% delivered, ${n} dead`,
    uptimeStateWord: (state) => ({ up: 'all delivered', degraded: 'some dead', down: 'mostly dead' })[state] ?? 'no messages',
    uptimeCell: (label, state, percent, n) =>
        [label, ({ up: 'all delivered', degraded: 'some dead', down: 'mostly dead' })[state] ?? 'no messages', percent === null ? null : `${percent} delivered`, n === null ? null : `${n} dead`]
            .filter(Boolean)
            .join(' · '),
    uptimeInfoFigures: (percent, n) =>
        [percent === null ? null : `${percent}% delivered`, n === null ? null : `${n} dead`].filter(Boolean).join(' · '),
});

// ---------------------------------------------------------------- the ids of the mock messages
const ALPHABET = '0123456789ABCDEFGHJKMNPQRSTVWXYZ';
/** A ULID-shaped id, 26 characters, deterministic. @param {number} n */
const ulid = (n) => {
    let x = 0x9e3779b9 ^ (n * 2654435761);
    let tail = '';
    for (let i = 0; i < 16; i += 1) {
        x = Math.imul(x ^ (x >>> 15), 2246822519) >>> 0;
        tail += ALPHABET[x % 32];
    }
    return `01K8Q${ALPHABET[(n * 7) % 32]}${tail.slice(0, 5)}${tail.slice(5)}`.slice(0, 26);
};

// ---------------------------------------------------------------- 1. the header
function initHeader() {
    const header = $('#ky-header');
    if (!header) return;
    const names = ['notify.kenny', 'desktop'];
    const slots = idmarkColours(names);
    setIdmark(/** @type {HTMLElement} */ ($('[data-ky-mark-topic]', header)), names[0], { slot: slots[0] });
    setIdmark(/** @type {HTMLElement} */ ($('[data-ky-mark]', header)), names[1], { slot: slots[1] });
    const badge = /** @type {HTMLElement} */ ($('[data-ky-badge]', header));
    const ago = /** @type {HTMLElement} */ ($('[data-ky-ago]', header));
    const counts = /** @type {HTMLElement} */ ($('[data-ky-counts]', header));
    let dead = 1;
    const drawCounts = () => {
        counts.replaceChildren();
        const part = (/** @type {string} */ label, /** @type {string} */ value) => {
            const span = make('span', 'kp-text-muted');
            span.append(`${label} `);
            span.append(make('b', 'kp-numeric', value));
            return span;
        };
        counts.append(part('backlog', '312'), part('in flight', '3'));
        if (dead > 0) counts.append(make('span', 'kp-badge kp-badge--destructive', `${dead} dead`));
    };
    drawCounts();
    setAgo(ago, NOW - 2 * MIN);
    const TONES = /** @type {Record<string, string>} */ ({ active: 'kp-badge kp-badge--success', flagged: 'kp-badge kp-badge--warning', archived: 'kp-badge' });
    onPress('data-ky-state', (value) => {
        badge.className = TONES[value] ?? 'kp-badge';
        badge.textContent = value;
    });
    onPress('data-ky-read', (value) => setAgo(ago, value === 'fresh' ? NOW - 2 * MIN : value === 'stale' ? NOW - 3 * 86_400_000 : null));
    onPress('data-ky-dead', (value) => {
        dead = Number(value);
        drawCounts();
    });
    CHOICES['mark-style'] = (value) => {
        const mark = /** @type {HTMLElement} */ ($('[data-ky-mark]', header));
        mark.classList.toggle('kp-idmark--glyph', value === 'glyph');
        mark.classList.toggle('kp-idmark--pattern', value === 'pattern');
    };
}

// ---------------------------------------------------------------- 2. the policy
function initPolicy() {
    const card = $('#ky-policy');
    const kv = $('[data-ky-kv]');
    if (!card || !kv) return;
    let custom = false;
    const draw = () => {
        const rows = [
            ['Lease', custom ? '60 s' : '30 s', !custom],
            ['Attempts before a message is dead', '5', true],
            ['Wait between attempts', '1 s, times the attempt number', true],
            ['Time to live', custom ? '7 days' : 'No limit', !custom],
            ['Created', agoMoment(NOW - 19 * 86_400_000), false],
        ];
        kv.replaceChildren();
        for (const [label, value, isDefault] of rows) {
            const row = make('div', 'kp-kv__row');
            row.append(make('dt', '', String(label)));
            const dd = make('dd');
            dd.append(make('span', 'kp-numeric', String(value)));
            if (isDefault) dd.append(make('span', 'kp-text-muted', '(default)'));
            row.append(dd);
            kv.append(row);
        }
    };
    draw();
    onPress('data-ky-policy', (value) => {
        custom = value === 'custom';
        draw();
    });
    const retry = () => {
        setCardState(card, 'ready');
        const ready = $('[data-ky-policy-state="ready"]');
        if (ready) pick(ready);
    };
    card.addEventListener('kp-card-retry', retry);
    onPress('data-ky-policy-state', (value) => {
        if (value === 'loading') setCardState(card, 'loading', { words: 'Reading the policy' });
        else if (value === 'error') setCardState(card, 'error', { title: 'The policy could not be read', text: 'kyu did not answer. What is shown is from earlier.' });
        else setCardState(card, 'ready');
    });
    CHOICES['kv-layout'] = (value) => {
        kv.classList.toggle('kp-kv--lines', value === 'lines');
        kv.classList.toggle('kp-kv--stack', value === 'stack');
        kv.classList.toggle('kp-kv--columns', value === 'columns');
    };
}

// ---------------------------------------------------------------- 3. the gauges
function initGauges() {
    const age = $('#ky-bullets-age');
    const attempts = $('#ky-bullets-attempts');
    const bar = $('#ky-drain');
    if (!age || !attempts || !bar) return;
    const readout = /** @type {HTMLElement} */ ($('#ky-drain-readout'));
    let situation = 'healthy';
    let state = 'ready';
    let order = 'worst';
    const AGES = /** @type {Record<string, number>} */ ({ healthy: 6, over: 41, stuck: 95 });
    const secs = (/** @type {number} */ s) => `${s} s`;
    const draw = () => {
        const common = { state: /** @type {any} */ (state), sort: /** @type {any} */ (order), emptyTitle: 'Nothing is held', emptyText: 'desktop has acknowledged everything it was handed.', message: 'kyu could not read what desktop is holding.' };
        setBullets(age, {
            ...common,
            threshold: 30,
            bad: 60,
            max: 60,
            format: secs,
            loadingRows: 1,
            rows: [
                { key: 'oldest', lead: 'desktop', label: 'Oldest unacked message', detail: `claimed ${agoMoment(NOW - AGES[situation] * SEC)} · ${ulid(1)}`, value: AGES[situation] },
            ],
        });
        setBullets(attempts, {
            ...common,
            threshold: 5,
            bad: 5,
            max: 6,
            format: (n) => `${n} of 5`,
            loadingRows: 4,
            rows: [
                { key: 'a', label: 'eerste echte bericht', detail: `${ulid(2)} · dead after the 5th attempt`, value: 5 },
                { key: 'b', label: 'Backup finished', detail: `${ulid(3)} · claimed`, value: 4 },
                { key: 'c', label: 'Disk 71 percent full', detail: `${ulid(4)} · pending`, value: 3 },
                { key: 'd', label: 'Certificate renewed', detail: `${ulid(5)} · pending`, value: 1 },
            ],
        });
    };
    draw();
    onPress('data-ky-age', (value) => {
        situation = value;
        draw();
    });
    onPress('data-ky-bullets', (value) => {
        state = value;
        draw();
    });
    CHOICES['bullet-order'] = (value) => {
        order = value;
        draw();
    };
    CHOICES['bar-size'] = (value) => {
        bar.classList.toggle('kp-progressbar--md', value === 'md');
        bar.classList.toggle('kp-progressbar--lg', value === 'lg');
    };
    // The backlog draining: 312 messages, one count-down per press.
    let timer = 0;
    const show = (/** @type {number} */ done) => {
        setProgress(bar, done);
        readout.textContent = `${done} of 312 delivered (${Math.floor((done / 312) * 100)}%)`;
    };
    const run = (/** @type {string} */ mode) => {
        clearInterval(timer);
        setIndeterminate(bar, false);
        if (mode === 'count') {
            setIndeterminate(bar, true);
            readout.textContent = 'Counting what desktop still holds';
        } else if (mode === 'done') {
            show(312);
            readout.textContent = '312 of 312 delivered (100%), nothing left';
        } else {
            let done = 0;
            show(0);
            timer = window.setInterval(() => {
                done = Math.min(312, done + 26);
                show(done);
                if (done >= 312) clearInterval(timer);
            }, 450);
        }
    };
    show(125);
    onPress('data-ky-drain', run);
}

// ---------------------------------------------------------------- 4. the backlog
const PAYLOADS = [
    ['{"title":"Backup finished","body":"nas-01: 12 stacks, 3.2 GB, no errors"}', {}],
    ['{"title":"Disk 71 percent full","body":"ct-106 /appdata","level":"warning"}', {}],
    ['Certificate renewed for kyu.kp-soft.dev, valid until 17/01/2027.', {}],
    [
        JSON.stringify(
            Array.from({ length: 6 }, (_, i) => ({ id: 2001 + i, customer: ['Janssens', 'De Smet', 'Peeters', 'Maes', 'Willems', 'Claes'][i], total: 100 + i * 37.5, paid: i % 2 === 0 })),
        ),
        {},
    ],
    ['', { 'data-kp-binary-size': '2100', 'data-kp-download': 'data:application/octet-stream;base64,AAAA' }],
    [Array.from({ length: 24 }, (_, i) => `10:${String(i).padStart(2, '0')}:07 INFO worker ${i % 4} handled job ${4000 + i}`).join('\n').slice(0, 1000), { 'data-kp-truncated': '1000/4096' }],
    ['{"sensor":"cellar","value":12.1,"unit":"C","ok":true}', {}],
    ['{"title":"Plant needs water","body":"Monstera, living room"}', {}],
    ['', {}],
    ['{"event":"state_changed","entity":"binary_sensor.front_door","to":"on"}', {}],
    ['{"title":"Update available","body":"Jellyfin 10.11.12"}', {}],
    ['{"title":"Mail sorted","body":"3 new in JobTracker"}', {}],
];
/** @param {string} text @param {Record<string, string>} attrs */
function payloadFigure(text, attrs) {
    const fig = make('figure', 'kp-code kp-code--cell');
    fig.setAttribute('data-kp-code', '');
    fig.setAttribute('data-kp-code-language', 'auto');
    for (const [k, v] of Object.entries(attrs)) fig.setAttribute(k, v);
    const pre = make('pre');
    const code = make('code');
    code.textContent = text;
    pre.append(code);
    fig.append(pre);
    return fig;
}
/** @typedef {{ id: string, state: string, at: number, attempts: number, payload: [string, Record<string, string>] }} Row */
const ROWS = /** @type {Row[]} */ (
    PAYLOADS.map((payload, i) => ({
        id: ulid(10 + i),
        state: i % 4 === 1 ? 'claimed' : 'pending',
        at: NOW - (7 + i * 13) * MIN,
        attempts: i % 4 === 1 ? 2 + (i % 3) : i === 3 ? 3 : 0,
        payload: /** @type {[string, Record<string, string>]} */ (payload),
    }))
);

function renderRows(/** @type {Row[]} */ rows) {
    const body = $('[data-ky-backlog-rows]');
    if (!body) return;
    body.replaceChildren();
    for (const row of rows) {
        const tr = make('tr');
        tr.dataset.kpRowKey = row.id;
        tr.innerHTML = `
            <td data-label=""><input class="kp-field__check" type="checkbox" data-kp-select-row aria-label="Select ${row.id}" /></td>
            <td data-label="Id"><code class="kp-id"></code></td>
            <td data-label="State"><span class="kp-badge"></span></td>
            <td data-label="Published" data-kp-sort-value="${row.at}"><div class="ky-cell-when"><time class="kp-ago" data-kp-ago data-kp-ago-verb="published" datetime="${new Date(row.at).toISOString()}"></time><span class="kp-numeric"></span></div></td>
            <td data-label="Attempts" class="kp-text-end kp-numeric" data-kp-sort-value="${row.attempts}"></td>
            <td data-label="Payload" class="ky-col-payload"></td>
            <td data-label="Actions" class="ky-col-actions"><button type="button" class="kp-button kp-button--sm kp-button--destructive" data-ky-delete-one>Delete</button></td>`;
        /** @type {HTMLElement} */ (tr.querySelector('.kp-id')).textContent = row.id;
        const badge = /** @type {HTMLElement} */ (tr.querySelector('.kp-badge'));
        badge.textContent = row.state;
        badge.className = row.state === 'claimed' ? 'kp-badge kp-badge--warning' : 'kp-badge';
        /** @type {HTMLElement} */ (tr.querySelector('.ky-cell-when > span')).textContent = agoMoment(row.at);
        /** @type {HTMLElement} */ (tr.children[4]).textContent = `${row.attempts} of 5`;
        /** @type {HTMLElement} */ (tr.children[5]).append(payloadFigure(row.payload[0], row.payload[1]));
        tr.querySelector('[data-ky-delete-one]')?.setAttribute('aria-label', `Delete ${row.id}`);
        body.append(tr);
    }
}
renderRows(ROWS);

function initBacklog() {
    const wrap = $('#ky-backlog-table');
    const bar = $('#ky-bar');
    const root = $('#ky-backlog');
    if (!wrap || !bar || !root) return;
    const bed = /** @type {HTMLElement} */ ($('[data-ky-bed]', root));
    const handle = () => dataTable(wrap);
    const state = { server: 'ok', clock: 'ring' };
    /** @type {Row[]} */
    let shown = ROWS;
    const rowsOf = (/** @type {string[]} */ keys) => keys.flatMap((k) => $$(`[data-kp-row-key="${k}"]`, wrap));
    /** Delete rows the way a bulk endpoint would: gone at once, Undo for a few seconds, the commit when the window closes. */
    const remove = (/** @type {string[]} */ keys, /** @type {number} */ ms, /** @type {number} */ count) => {
        const rows = rowsOf(keys);
        for (const row of rows) {
            const box = /** @type {HTMLInputElement | null} */ ($('[data-kp-select-row]', row));
            if (box?.checked) {
                box.checked = false;
                box.dispatchEvent(new Event('change', { bubbles: true }));
            }
            row.hidden = true;
        }
        handle()?.refresh();
        undoToast(`${count} ${count === 1 ? 'message' : 'messages'} deleted from desktop`, {
            region: bed,
            ms,
            max: 3,
            clock: /** @type {any} */ (state.clock),
            commit: async () => {
                if (state.server === 'refuse') throw new Error('kyu refused: desktop holds a claim on one of them');
            },
            undo: () => {
                for (const row of rows) row.hidden = false;
                handle()?.refresh();
            },
        });
    };
    document.addEventListener('kp-selection-action', (event) => {
        const e = /** @type {CustomEvent<{ action: string, keys: string[], matching?: boolean, undoMs: number }>} */ (event);
        if (e.target !== bar || e.detail.action !== 'delete') return;
        remove(e.detail.keys, e.detail.undoMs, e.detail.matching ? 312 : e.detail.keys.length);
    });
    wrap.addEventListener('click', (event) => {
        const button = event.target instanceof Element ? event.target.closest('[data-ky-delete-one]') : null;
        const tr = /** @type {HTMLElement | null} */ (button?.closest('[data-kp-row-key]') ?? null);
        if (tr) remove([tr.dataset.kpRowKey ?? ''], 6000, 1);
    });
    const setTable = (/** @type {string} */ value) => {
        const h = handle();
        if (!h) return;
        if (value === 'empty') {
            renderRows([]);
            attachCodes(wrap);
            h.refresh();
            h.state('ready');
        } else {
            if (shown.length === 0 || value === 'ready') {
                renderRows(ROWS);
                shown = ROWS;
                attachCodes(wrap);
                h.refresh();
            }
            if (value === 'failed') h.fail('kyu could not read the backlog of desktop.');
            else h.state(value === 'loading' ? 'loading' : 'ready');
        }
    };
    wrap.addEventListener('kp-datatable-retry', () => {
        handle()?.state('ready');
        const ready = $('[data-ky-table="ready"]');
        if (ready) pick(ready);
    });
    onPress('data-ky-table', setTable);
    onPress('data-ky-server', (value) => (state.server = value));
    document.addEventListener('click', (event) => {
        if (!(event.target instanceof Element) || !event.target.closest('[data-ky-rows-reset]')) return;
        for (const row of $$('[data-kp-row-key]', wrap)) row.hidden = false;
        handle()?.refresh();
    });
    CHOICES['bar-place'] = (value) => bar.setAttribute('data-kp-placement', value);
    CHOICES['bar-names'] = (value) => bar.setAttribute('data-kp-selection-names', value);
    CHOICES['undo-clock'] = (value) => (state.clock = value);
}

// ---------------------------------------------------------------- 5 and 6. the attempts of one message
/**
 * The mock messages. Each attempt: when it was claimed, when it ended (seconds after the message was published), and how.
 * `how`: expired (the lease ran out), nack (the app refused it), dead (refused for the last time), ack, running.
 * @type {Record<string, { id: string, payload: string, ago: number, attempts: { claim: number, end: number | null, how: string, reason?: string }[] }>}
 */
const MESSAGES = {
    dead: {
        id: ulid(900),
        payload: '{"title":"eerste echte bericht","body":"hello from HA"}',
        ago: 95,
        attempts: [
            { claim: 1, end: 31, how: 'expired', reason: 'no ack within the 30 s lease' },
            { claim: 32, end: 34, how: 'nack', reason: 'payload rejected: unknown field "body"' },
            { claim: 36, end: 37, how: 'nack', reason: 'payload rejected: unknown field "body"' },
            { claim: 40, end: 70, how: 'expired', reason: 'no ack within the 30 s lease' },
            { claim: 74, end: 75, how: 'dead', reason: 'payload rejected: unknown field "body"; 5 of 5 attempts used' },
        ],
    },
    recovered: {
        id: ulid(901),
        payload: '{"title":"Backup finished","body":"nas-01: 12 stacks"}',
        ago: 50,
        attempts: [
            { claim: 1, end: 31, how: 'expired', reason: 'no ack within the 30 s lease' },
            { claim: 32, end: 33, how: 'ack' },
        ],
    },
    flight: {
        id: ulid(902),
        payload: '{"title":"Disk 71 percent full"}',
        ago: 25,
        attempts: [
            { claim: 1, end: 2, how: 'nack', reason: 'desktop app was locked' },
            { claim: 4, end: 6, how: 'nack', reason: 'desktop app was locked' },
            { claim: 9, end: null, how: 'running' },
        ],
    },
    new: { id: ulid(903), payload: '{"title":"Plant needs water"}', ago: 4, attempts: [] },
};
const WORDS = /** @type {Record<string, string>} */ ({ expired: 'Expired', nack: 'Nack', dead: 'Dead', ack: 'Acked', running: 'Claimed, still held' });
const STATUS = /** @type {Record<string, number>} */ ({ expired: 409, nack: 422, dead: 410, ack: 200 });

/** The moment a mock message was published, put 10 s past a minute so no axis rule falls on a bar's label. @param {{ ago: number }} m */
const baseOf = (m) => Math.floor((Date.now() - m.ago * SEC) / MIN) * MIN + 10 * SEC;

function initGantt() {
    const el = $('#ky-gantt');
    if (!el) return;
    const title = /** @type {HTMLElement} */ ($('#ky-attempts-title'));
    let key = 'dead';
    let leaseBand = true;
    setGanttKinds(el, [
        { kind: 'expired', label: 'Lease expired', shape: 'ring', tone: 'warning' },
        { kind: 'nack', label: 'Nack', shape: 'triangle', tone: 'destructive' },
        { kind: 'dead', label: 'Dead', shape: 'square', tone: 'destructive' },
        { kind: 'ack', label: 'Acked', shape: 'diamond', tone: 'success' },
    ]);
    const draw = () => {
        const m = MESSAGES[key];
        const base = baseOf(m);
        title.textContent = `Message ${m.id} on notify.kenny, published ${agoMoment(base)}: ${m.attempts.length} ${m.attempts.length === 1 ? 'attempt' : 'attempts'}`;
        const lanes = m.attempts.map((a, i) => ({ id: `a${i + 1}`, label: `Attempt ${i + 1}`, sub: withSeconds(base + a.claim * SEC) }));
        const runs = m.attempts.map((a, i) => ({
            id: `r${i + 1}`,
            lane: `a${i + 1}`,
            label: WORDS[a.how],
            start: base + a.claim * SEC,
            end: a.end === null ? null : base + a.end * SEC,
            state: /** @type {any} */ (a.how === 'ack' ? 'ok' : a.how === 'running' ? 'running' : 'failed'),
            detail: a.reason ?? 'acknowledged',
        }));
        const points = m.attempts
            .filter((a) => a.end !== null)
            .map((a, i) => ({ id: `p${i + 1}`, lane: `a${i + 1}`, at: base + (/** @type {number} */ (a.end)) * SEC, kind: a.how, label: WORDS[a.how], detail: a.reason ?? 'acknowledged' }));
        const zones = leaseBand ? m.attempts.map((a, i) => ({ id: `z${i + 1}`, lane: `a${i + 1}`, from: base + a.claim * SEC, to: base + (a.claim + 30) * SEC, label: 'Lease (30 s)', tone: /** @type {any} */ ('info') })) : [];
        setGanttRuns(el, runs, lanes);
        setGanttPoints(el, points, lanes);
        setGanttZones(el, zones);
        if (m.attempts.length === 0) setGanttState(el, 'empty', 'Not claimed yet: nothing to show until desktop reads it.');
        else setGanttState(el, 'ready');
        setGanttWindow(el, { span: 300, live: true });
    };
    draw();
    onPress('data-ky-msg', (value) => {
        key = value;
        draw();
    });
    onPress('data-ky-gantt', (value) => {
        if (value === 'ready') draw();
        else setGanttState(el, /** @type {any} */ (value), value === 'error' ? 'kyu could not read the attempts of this message.' : 'Reading the attempts');
    });
    CHOICES['lease-band'] = (value) => {
        leaseBand = value === 'shown';
        draw();
    };
}

function initInspector() {
    const el = $('#ky-requests');
    if (!el) return;
    let key = 'dead';
    const draw = () => {
        const m = MESSAGES[key];
        const base = baseOf(m);
        const list = m.attempts
            .map((a, i) => ({
                at: base + (a.end ?? a.claim) * SEC,
                method: 'ATTEMPT',
                path: `/t/notify.kenny/messages/${m.id}/attempts/${i + 1}`,
                status: STATUS[a.how] ?? 200,
                headers: {
                    'content-type': 'application/json',
                    'x-kyu-subscription': 'desktop',
                    'x-kyu-app': 'desktop-notifier',
                    authorization: 'Bearer ky_app_2f9c61d0b7a14e53',
                },
                body: JSON.stringify({ attempt: i + 1, of: 5, claimed_at: new Date(base + a.claim * SEC).toISOString(), outcome: a.how, reason: a.reason ?? null, payload: JSON.parse(m.payload) }, null, 2),
                bodyBytes: 260,
            }))
            .reverse();
        setRequests(el, list);
    };
    draw();
    onPress('data-ky-imsg', (value) => {
        key = value;
        draw();
    });
    onPress('data-ky-inspector', (value) => {
        if (value === 'ready') draw();
        else setRequestsState(el, /** @type {any} */ (value), { message: 'kyu could not read the attempts of this message.' });
    });
    el.addEventListener('kp-requests-retry', () => {
        draw();
        const ready = $('[data-ky-inspector="ready"]');
        if (ready) pick(ready);
    });
    CHOICES['inspector-open'] = (value) => el.setAttribute('data-kp-requests-open', value);
    CHOICES['inspector-secrets'] = (value) => el.setAttribute('data-kp-secrets-in-copy', value);
}

// ---------------------------------------------------------------- 7. the 90 days
function initUptime() {
    const el = $('#ky-uptime-strip');
    if (!el) return;
    /** @param {number} count */
    const periods = (count) =>
        Array.from({ length: 90 }, (_, i) => {
            const day = new Date(NOW - (89 - i) * 86_400_000);
            const key = day.toISOString().slice(0, 10);
            const label = agoMoment(day.getTime()).slice(0, 10);
            if (i < 90 - count) return { key, label, state: /** @type {any} */ ('none'), tip: `${label} · no messages` };
            const delivered = 30 + ((i * 37) % 61);
            const dead = [12, 13, 40, 41, 66, 80].includes(i) ? (i === 41 ? 24 : 1 + (i % 3)) : 0;
            const share = delivered / (delivered + dead);
            const state = dead === 0 ? 'up' : share < 0.5 ? 'down' : 'degraded';
            return {
                key,
                label,
                state: /** @type {any} */ (state),
                uptime: share,
                incidents: dead,
                href: `#day-${key}`,
                details: [`${delivered} delivered`, dead === 0 ? 'nothing dead' : `${dead} dead-lettered`],
            };
        });
    let history = 'full';
    let open = 'info';
    let state = 'ready';
    const draw = () => {
        el.setAttribute('data-kp-uptime-open', open);
        const data = history === 'full' ? periods(90) : periods(40);
        setUptime(el, {
            label: 'desktop',
            from: '90 days ago',
            to: 'Today',
            state: /** @type {any} */ (state === 'empty' ? 'empty' : state),
            open: open === 'info' ? 'info' : undefined,
            periods: state === 'ready' ? data : state === 'empty' ? [] : data.map((p) => ({ ...p, state: /** @type {any} */ ('none') })),
            error: 'kyu could not read the daily statistics.',
            count: 90,
        });
    };
    draw();
    onPress('data-ky-uptime', (value) => {
        state = value;
        draw();
    });
    onPress('data-ky-history', (value) => {
        history = value;
        state = 'ready';
        const ready = $('[data-ky-uptime="ready"]');
        if (ready) pick(ready);
        draw();
    });
    CHOICES['uptime-open'] = (value) => {
        open = value;
        draw();
    };
    CHOICES['uptime-fit'] = (value) => {
        el.setAttribute('data-kp-uptime-fit', value === 'scroll' ? 'scroll' : 'fit');
        draw();
    };
}

onReady(() => {
    initHeader();
    initPolicy();
    initGauges();
    initBacklog();
    initGantt();
    initInspector();
    initUptime();
});
