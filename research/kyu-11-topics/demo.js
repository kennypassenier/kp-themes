// research/kyu-11-topics: the Topics page of kyu on kp-themes 11.0.0.
//   1. the mock hub (five topics, five subscriptions) and the stand-in for kyu that answers the region refresh;
//   2. the drawing of the page from that model with the package's own functions (setIdmark, setBarCell, setStackbar, setAgo,
//      setAttention, setHeat, setTrendData); nothing here draws a component itself;
//   3. the state, width and option controls of the review dialog.
// All data is mock. The components attach through js/auto.js; this file only fills them and listens.
import { setIdmark, idmarkColours } from '../../js/idmark.js';
import { setStackbar } from '../../js/stackbar.js';
import { setBarCell } from '../../js/barcell.js';
import { setAgo } from '../../js/freshness.js';
import { setAttention } from '../../js/attention.js';
import { dataTable, VIEW_EVENT, RETRY_EVENT } from '../../js/datatable.js';
import { refreshOf } from '../../js/auto-refresh.js';
import { tickTo } from '../../js/tick.js';
import { update } from '../../js/update.js';
import { setHeat, HEAT_PICK_EVENT } from '../../js/heat.js';
import { setTrendData, CHART_RETRY_EVENT } from '../../js/chart.js';
import { toast } from '../../js/overlays.js';
import { attachAll } from '../../js/auto.js';

/** @param {string} selector @param {ParentNode} [root] */
const $ = (selector, root = document) => /** @type {HTMLElement | null} */ (root.querySelector(selector));
/** @param {string} selector @param {ParentNode} [root] */
const $$ = (selector, root = document) => /** @type {HTMLElement[]} */ ([...root.querySelectorAll(selector)]);

/**
 * @param {string} tag @param {Record<string, string | boolean | undefined>} [attrs] @param {(Node | string)[]} [kids]
 * @returns {HTMLElement}
 */
function h(tag, attrs = {}, ...kids) {
    const el = document.createElement(tag);
    for (const [name, value] of Object.entries(attrs)) {
        if (value === undefined || value === false) continue;
        el.setAttribute(name, value === true ? '' : value);
    }
    el.append(...kids);
    return el;
}

const number = (/** @type {number} */ n) => n.toLocaleString('en');
const MIN = 60_000;
const HOUR = 3_600_000;

/** A repeatable pseudo-random number generator. @param {number} seed */
function random(seed) {
    let a = seed >>> 0;
    return () => {
        a = (a + 0x6d2b79f5) >>> 0;
        let t = a;
        t = Math.imul(t ^ (t >>> 15), t | 1);
        t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
}

/* ------------------------------------------------------------------------------------------ the mock hub */

const NOW = Date.now();

/**
 * @typedef {object} Topic
 * @property {string} name
 * @property {number} messages
 * @property {string[]} subs
 * @property {number} backlog
 * @property {number} inflight
 * @property {number} dead
 * @property {number} lapsed
 * @property {number} lastAt  when it last published, ms
 * @property {string} [deadNote]
 */

/** @param {'busy' | 'quiet'} mode @returns {Topic[]} */
function makeTopics(mode) {
    const busy = mode === 'busy';
    return [
        {
            name: 'notify.kenny',
            messages: 412,
            subs: ['desktop', 'phone', 'archive'],
            backlog: busy ? 14 : 0,
            inflight: busy ? 2 : 0,
            dead: busy ? 1 : 0,
            lapsed: busy ? 3 : 0,
            lastAt: NOW - 4 * MIN,
            deadNote: 'desktop: {"title":"eerste echte bericht","body":"hello from HA"}',
        },
        {
            name: 'ha.events',
            messages: 1842,
            subs: ['kyu-runner', 'archive'],
            backlog: busy ? 106 : 0,
            inflight: busy ? 6 : 0,
            dead: 0,
            lapsed: busy ? 9 : 0,
            lastAt: NOW - 12_000,
        },
        {
            name: 'almanac.sync',
            messages: 267,
            subs: ['almanac'],
            backlog: busy ? 82 : 0,
            inflight: busy ? 1 : 0,
            dead: busy ? 4 : 0,
            lapsed: busy ? 2 : 0,
            lastAt: NOW - 38 * MIN,
            deadNote: 'almanac: {"calendar":"kenny","op":"upsert"} (the calendar refused it four times)',
        },
        {
            name: 'jobtracker.mail',
            messages: 96,
            subs: ['phone', 'archive'],
            backlog: busy ? 5 : 0,
            inflight: 0,
            dead: 0,
            lapsed: 0,
            lastAt: NOW - (3 * HOUR + 15 * MIN),
        },
        {
            name: 'newsflash.items',
            messages: 1203,
            subs: ['desktop'],
            backlog: 0,
            inflight: 0,
            dead: 0,
            lapsed: 0,
            lastAt: busy ? NOW - 40 * HOUR : NOW - 5 * HOUR,
        },
    ];
}

const model = {
    mode: /** @type {'busy' | 'quiet'} */ ('busy'),
    topics: makeTopics('busy'),
    /** The number of refreshes the stand-in has answered; seeds its changes. */
    answers: 0,
    quietAfter: 86_400,
};

/** @param {Topic} t */
function statusOf(t) {
    if (t.dead > 0) return 'Dead letters';
    if (t.backlog >= 50) return 'Backlog';
    if (Date.now() - t.lastAt > model.quietAfter * 1000) return 'Quiet';
    return 'Healthy';
}
const STATUS_BADGE = { 'Dead letters': 'kp-badge--destructive', Backlog: 'kp-badge--warning', Quiet: 'kp-badge--info', Healthy: 'kp-badge--success' };

function totals() {
    const t = ui.state === 'empty' ? [] : model.topics;
    return {
        topics: t.length,
        subscriptions: t.reduce((n, x) => n + x.subs.length, 0),
        messages: t.reduce((n, x) => n + x.messages, 0),
        backlog: t.reduce((n, x) => n + x.backlog, 0),
        inflight: t.reduce((n, x) => n + x.inflight, 0),
        dead: t.reduce((n, x) => n + x.dead, 0),
        lapsed: t.reduce((n, x) => n + x.lapsed, 0),
    };
}

/** The stand-in for kyu: every refresh moves a few numbers, the same way for everyone who judges. */
function advance() {
    model.answers += 1;
    if (model.mode === 'quiet') {
        const rand = random(900 + model.answers);
        const ha = model.topics.find((t) => t.name === 'ha.events');
        if (ha) {
            ha.messages += 1 + Math.floor(rand() * 3);
            ha.lastAt = Date.now();
        }
        return;
    }
    const rand = random(40 + model.answers);
    const by = (/** @type {string} */ name) => /** @type {Topic} */ (model.topics.find((t) => t.name === name));
    const ha = by('ha.events');
    ha.messages += 3 + Math.floor(rand() * 7);
    ha.backlog = Math.max(0, ha.backlog + Math.floor(rand() * 16) - 6);
    ha.lastAt = Date.now();
    const notify = by('notify.kenny');
    if (rand() < 0.6) {
        notify.messages += 1;
        notify.lastAt = Date.now();
        notify.backlog = Math.max(0, notify.backlog + Math.floor(rand() * 5) - 2);
    }
    if (model.answers % 3 === 0) notify.dead += 1;
    const almanac = by('almanac.sync');
    almanac.backlog = Math.max(0, almanac.backlog - Math.floor(rand() * 10));
    by('jobtracker.mail').backlog = Math.max(0, by('jobtracker.mail').backlog + Math.floor(rand() * 3) - 1);
}

/* ------------------------------------------------------------------------------------------ the drawing */

const names = () => makeTopics('busy').map((t) => t.name);
const slots = idmarkColours(names());

/** @param {HTMLElement} el @param {string} name */
function mark(el, name) {
    setIdmark(el, name, { slot: slots.get(name) });
}

const plural = (/** @type {number} */ n, /** @type {string} */ one, /** @type {string} */ many) => `${number(n)} ${n === 1 ? one : many}`;

/** The key-figure tiles as markup, for the page and for the stand-in's answer. @param {{ pressed: { backlog: boolean, dead: boolean }, state: string }} view */
function kpiTiles(view) {
    const t = totals();
    const loading = view.state === 'loading';
    const failed = view.state === 'error';
    /** @param {string} key @param {number} n */
    const value = (key, n) => {
        const span = h('span', { 'data-kp-tick': true, 'data-kt-key': key });
        if (loading) return h('span', { class: 'kp-kpi__value' }, Object.assign(h('span', { class: 'kp-skeleton' }), { style: 'inline-size: 4ch' }));
        span.textContent = failed ? '—' : number(n);
        return h('span', { class: 'kp-kpi__value' }, span);
    };
    /** @param {string} key @param {string} text */
    const trend = (key, text) => {
        if (loading) return h('span', { class: 'kp-kpi__trend' }, Object.assign(h('span', { class: 'kp-skeleton' }), { style: 'inline-size: 70%' }));
        return h('span', { class: 'kp-kpi__trend', 'data-kt-key': `${key}-words` }, failed ? 'could not be read' : text);
    };
    const quiet = model.mode === 'quiet';
    const hint = h(
        'span',
        { class: 'kp-kpi__hint', 'aria-hidden': 'true' },
        h('span', { 'data-kp-when': 'off' }, 'Filter'),
        h('span', { 'data-kp-when': 'on' }, 'Filtering ×'),
    );
    /** @param {string} key @param {string} label @param {string} tone @param {boolean} pressed */
    const toggle = (key, label, tone, pressed) =>
        h(
            'button',
            { type: 'button', class: 'kp-kpi kp-kpi--toggle', 'aria-pressed': String(pressed), 'data-kp-tone': tone, 'data-kt-filter': key },
            h('span', { class: 'kp-kpi__label' }, label),
            hint.cloneNode(true),
            value(key, key === 'backlog' ? t.backlog : t.dead),
            trend(
                key,
                key === 'backlog'
                    ? quiet
                        ? 'nothing is waiting'
                        : `${number(t.inflight)} more in flight`
                    : quiet
                      ? 'nothing needs a decision'
                      : `${number(t.lapsed)} lapsed, not dead yet`,
            ),
        );
    return [
        h(
            'div',
            { class: 'kp-kpi', 'data-kt-tile': 'topics' },
            h('span', { class: 'kp-kpi__label' }, 'Topics'),
            value('topics', t.topics),
            trend('topics', `${plural(t.subscriptions, 'subscription', 'subscriptions')} in all`),
        ),
        h(
            'div',
            { class: 'kp-kpi', 'data-kt-tile': 'messages' },
            h('span', { class: 'kp-kpi__label' }, 'Messages'),
            value('messages', t.messages),
            trend('messages', 'kept across all topics'),
        ),
        toggle('backlog', 'Backlog', quiet ? '' : 'warning', view.pressed.backlog),
        toggle('dead', 'Dead', quiet ? '' : 'destructive', view.pressed.dead),
    ].map((tile) => {
        if (!tile.getAttribute('data-kp-tone')) tile.removeAttribute('data-kp-tone');
        return tile;
    });
}

/** @returns {import('../../js/attention.js').AttentionItem[]} */
function attentionItems() {
    if (model.mode === 'quiet') return [];
    const by = (/** @type {string} */ name) => /** @type {Topic} */ (model.topics.find((t) => t.name === name));
    /** @param {string} name @param {string} label */
    const show = (name, label) =>
        h('a', { class: 'kp-button kp-button--sm', href: `#topic-${name}`, 'data-kt-show': name }, label);
    /** @type {import('../../js/attention.js').AttentionItem[]} */
    const items = [];
    for (const name of ['notify.kenny', 'almanac.sync']) {
        const t = by(name);
        if (t.dead > 0) {
            items.push({
                key: `dead-${name}`,
                severity: 'critical',
                title: `${name}: ${plural(t.dead, 'dead letter', 'dead letters')}`,
                text: `A subscription gave up on ${t.dead === 1 ? 'a message' : 'these messages'} after its last attempt. Open the topic to requeue or delete.`,
                action: show(name, 'Show the topic'),
            });
        }
    }
    const ha = by('ha.events');
    if (ha.backlog >= 50) {
        items.push({
            key: 'backlog-ha',
            severity: 'warning',
            title: `ha.events: ${number(ha.backlog)} messages waiting`,
            text: 'kyu-runner has not taken them yet; they are safe and will be delivered in order.',
            action: show('ha.events', 'Show the topic'),
        });
    }
    if (by('notify.kenny').dead > 0) {
        items.push({
            key: 'flagged-desktop',
            severity: 'warning',
            title: 'The subscription desktop is flagged',
            text: 'It failed on notify.kenny and has been retrying; a flagged subscription is worth a look before it kills more messages.',
            action: show('notify.kenny', 'Show notify.kenny'),
        });
    }
    const quiet = by('newsflash.items');
    if (Date.now() - quiet.lastAt > model.quietAfter * 1000) {
        const hours = Math.round((Date.now() - quiet.lastAt) / HOUR);
        items.push({
            key: 'quiet-newsflash',
            severity: 'info',
            title: `newsflash.items has been quiet for ${number(hours)} h`,
            text: 'Nothing is wrong with it; the publisher may simply have nothing to say.',
            action: show('newsflash.items', 'Show the topic'),
        });
    }
    return items;
}

/* ------- the table */

const MAX = () => ({
    backlog: Math.max(0, ...model.topics.map((t) => t.backlog)),
    dead: Math.max(0, ...model.topics.map((t) => t.dead)),
});

/** @param {Topic} t */
function flowSpec(t) {
    const parts = [
        { key: 'backlog', label: 'Waiting', value: t.backlog },
        { key: 'inflight', label: 'In flight', value: t.inflight },
        { key: 'dead', label: 'Dead', value: t.dead, tone: /** @type {const} */ ('destructive') },
        { key: 'lapsed', label: 'Lapsed', value: t.lapsed, tone: /** @type {const} */ ('warning') },
    ].filter((p) => p.value > 0);
    const sum = parts.reduce((n, p) => n + p.value, 0);
    return {
        parts,
        total: Math.max(sum, 1),
        legend: false,
        format: number,
        restLabel: sum === 0 ? 'Nothing waiting' : 'Rest',
        label: `${t.name}: ${sum === 0 ? 'nothing waiting' : parts.map((p) => `${number(p.value)} ${p.label.toLowerCase()}`).join(', ')}`,
    };
}

/** @param {Topic} t @returns {HTMLTableRowElement} */
function buildRow(t) {
    const cell = (/** @type {string} */ label, /** @type {string} */ cls, /** @type {Node[]} */ kids) =>
        h('td', { 'data-label': label, class: cls || undefined }, ...kids);
    const markEl = h('span', { class: 'kp-idmark kp-idmark--sm', 'data-kp-idmark': t.name, 'aria-hidden': 'true' });
    mark(markEl, t.name);
    const row = /** @type {HTMLTableRowElement} */ (
        h(
            'tr',
            { 'data-kp-row-key': t.name, 'data-kp-anchor': `topic-${t.name}`, 'data-kt-topic': t.name },
            cell('Topic', 'kt-name', [
                h(
                    'span',
                    { class: 'kt-topic' },
                    markEl,
                    h('a', { class: 'kt-topic__link', href: `/t/${t.name}/dashboard`, 'data-kt-open': t.name }, t.name),
                ),
            ]),
            cell('Status', '', [h('span', { class: 'kp-badge', 'data-kt-cell': 'status' })]),
            cell('Messages', 'kp-text-end kp-numeric', [h('span', { 'data-kp-tick': true, 'data-kt-cell': 'messages' })]),
            cell('Backlog', '', [h('span', { class: 'kp-bar-cell', 'data-kt-cell': 'backlog' })]),
            cell('Dead', '', [h('span', { class: 'kp-bar-cell kt-hover', tabindex: '0', 'data-kt-cell': 'dead' })]),
            cell('Flow', 'kt-flow', [h('figure', { class: 'kp-stackbar', 'data-kp-stackbar': true, 'data-kt-cell': 'flow' })]),
            cell('Last published', '', [
                h('time', { class: 'kp-ago kt-hover', 'data-kp-ago': true, 'data-kp-ago-verb': 'published', tabindex: '0', 'data-kt-cell': 'last' }),
            ]),
            cell('Actions', 'kt-actions', [
                h(
                    'div',
                    { class: 'kp-row-actions' },
                    h('button', { type: 'button', class: 'kp-button kp-button--sm', 'data-kp-action': 'test', 'data-kt-test': t.name }, 'Send test'),
                    h('button', { type: 'button', class: 'kp-button kp-button--sm kp-button--primary', 'data-kp-action': 'open', 'data-kt-open': t.name }, 'Open'),
                ),
            ]),
        )
    );
    paintRow(row, t);
    return row;
}

/** Write one topic into its row. The cells that carry a number tick when they are changed, the words change the theme's way. @param {HTMLElement} row @param {Topic} t */
function paintRow(row, t, animate = false) {
    const max = MAX();
    const cells = (/** @type {string} */ key) => /** @type {HTMLElement} */ (row.querySelector(`[data-kt-cell="${key}"]`));
    const td = (/** @type {string} */ key) => /** @type {HTMLElement} */ (cells(key).closest('td'));
    const status = statusOf(t);
    const badge = cells('status');
    if (badge.textContent !== status) {
        badge.className = `kp-badge ${STATUS_BADGE[/** @type {keyof typeof STATUS_BADGE} */ (status)]}`;
        if (animate && badge.textContent) update(badge, status);
        else badge.textContent = status;
    }
    td('status').setAttribute('data-kp-filter-value', status);
    td('status').setAttribute('data-kp-sort-value', status);

    const messages = cells('messages');
    if (messages.textContent !== number(t.messages)) {
        if (animate && messages.textContent) tickTo(messages, number(t.messages));
        else messages.textContent = number(t.messages);
    }
    td('messages').setAttribute('data-kp-sort-value', String(t.messages));

    const link = /** @type {HTMLElement} */ (row.querySelector('.kt-topic__link'));
    link.setAttribute('data-kp-hovercard', `${t.name} is read by ${plural(t.subs.length, 'subscription', 'subscriptions')}: ${t.subs.join(', ')}`);

    setBarCell(cells('backlog'), {
        value: max.backlog ? t.backlog / max.backlog : 0,
        text: number(t.backlog),
        sortValue: t.backlog,
        label: 'of the largest backlog',
    });
    setBarCell(cells('dead'), {
        value: max.dead ? t.dead / max.dead : 0,
        text: number(t.dead),
        sortValue: t.dead,
        label: 'of the most dead letters',
    });
    cells('dead').setAttribute(
        'data-kp-hovercard',
        t.dead > 0 ? `Latest dead letter on ${t.name}, ${t.deadNote ?? 'no detail kept'}` : `No dead letters on ${t.name}`,
    );

    const flow = flowSpec(t);
    setStackbar(cells('flow'), flow);
    td('flow').setAttribute('data-kp-sort-value', String(flow.parts.reduce((n, p) => n + p.value, 0)));

    const last = cells('last');
    last.setAttribute('data-kp-stale-after', String(model.quietAfter));
    setAgo(last, t.lastAt);
    last.setAttribute('data-kp-hovercard', `Last message on ${t.name}. Hover or focus shows the exact time; quiet after ${quietWords()}.`);
    td('last').setAttribute('data-kp-sort-value', String(t.lastAt));
}

const quietWords = () => (model.quietAfter >= 3600 ? `${model.quietAfter / 3600} h` : `${model.quietAfter / 60} min`);

/* ------------------------------------------------------------------------------------------ the page */

const ui = {
    state: /** @type {'ready' | 'loading' | 'empty' | 'error'} */ ('ready'),
    pressed: { backlog: false, dead: false },
    ready: false,
};

const stage = $('[data-kt-stage]');
const host = $('[data-kt-table-host]');
const kpis = $('[data-kt-kpis]');
const band = $('[data-kt-attention]');
const noneEl = $('[data-kt-none]');
const choices = /** @type {Record<string, string>} */ ({});

/** The datatable shell as authored, before anything fills it: a new table is mounted from it (an option is read when a table attaches). */
const shell = $('[data-kt-datatable]')?.outerHTML ?? '';
/** The refresh control as authored, for the same reason. */
const refreshShell = $('[data-kt-refresh]')?.outerHTML ?? '';

/** @returns {HTMLElement | null} */
const tableEl = () => $('[data-kt-datatable]');
const rowsOf = () => $$('[data-kt-topic]');

function fillRows() {
    const body = $('[data-kt-rows]');
    if (!body) return;
    body.replaceChildren(...(ui.state === 'empty' ? [] : model.topics.map(buildRow)));
}

function drawKpis() {
    if (!kpis) return;
    kpis.replaceChildren(...kpiTiles({ pressed: ui.pressed, state: ui.state }));
    remember();
}

/** The text each counting element shows, by key, so a swapped-in tile can count from what was shown. */
const shown = new Map();
function remember() {
    shown.clear();
    for (const el of $$('[data-kt-key][data-kp-tick]', kpis ?? document)) shown.set(el.getAttribute('data-kt-key'), el.textContent ?? '');
    for (const el of $$('.kp-kpi__trend[data-kt-key]', kpis ?? document)) shown.set(el.getAttribute('data-kt-key'), el.textContent ?? '');
}

function drawBand() {
    if (!band) return;
    setAttention(band, ui.state === 'ready' ? attentionItems() : []);
}

function drawHubBar() {
    const bar = $('[data-kt-hubbar]');
    if (!bar) return;
    const t = totals();
    const nothing = t.backlog + t.inflight + t.dead + t.lapsed === 0;
    const state = ui.state === 'ready' && nothing ? 'empty' : ui.state;
    setStackbar(bar, {
        title: 'Where the undelivered messages are, across the hub',
        parts: [
            { key: 'backlog', label: 'Waiting', value: t.backlog },
            { key: 'inflight', label: 'In flight', value: t.inflight },
            { key: 'dead', label: 'Dead', value: t.dead, tone: 'destructive' },
            { key: 'lapsed', label: 'Lapsed', value: t.lapsed, tone: 'warning' },
        ].filter((p) => p.value > 0),
        total: Math.max(t.backlog + t.inflight + t.dead + t.lapsed, 1),
        restLabel: 'Nothing waiting',
        format: number,
        state: /** @type {any} */ (state),
        message:
            state === 'error' ? 'The hub did not answer, so this bar cannot be drawn.' : ui.state === 'empty' ? 'No topics yet.' : 'Nothing is waiting anywhere on the hub.',
        retry: false,
    });
}

/** Everything the model changes: the figures, the band, the bar and the rows. @param {boolean} [animate] */
function paintAll(animate = false) {
    drawKpis();
    drawBand();
    drawHubBar();
    for (const row of rowsOf()) {
        const t = model.topics.find((x) => x.name === row.getAttribute('data-kt-topic'));
        if (t) paintRow(row, t, animate);
    }
    const dt = tableEl() && dataTable(tableEl());
    dt?.refresh();
}

/** The datatable for this page, once auto.js has attached it. */
const table = () => {
    const el = tableEl();
    return el ? dataTable(el) : null;
};

/* ---- the key figures filter the table (Backlog and Dead are range filters on their columns) */

const COLUMN = { backlog: 3, dead: 4 };
function applyFilters() {
    const dt = table();
    if (!dt) return;
    const want = { ...ui.pressed };
    applying = true;
    for (const key of /** @type {const} */ (['backlog', 'dead'])) dt.filter(COLUMN[key], want[key] ? { from: '1' } : null);
    applying = false;
    Object.assign(ui.pressed, want);
    syncTiles(dt.view());
}
let applying = false;

document.addEventListener('kp-kpi-toggle', (event) => {
    const tile = /** @type {HTMLElement} */ (event.target).closest('[data-kt-filter]');
    if (!tile) return;
    ui.pressed[/** @type {'backlog' | 'dead'} */ (tile.getAttribute('data-kt-filter'))] = /** @type {CustomEvent} */ (event).detail.pressed;
    applyFilters();
});

/** The tiles follow the table's filters. @param {import('../../js/datatable.js').View} view */
function syncTiles(view) {
    const asks = (/** @type {number} */ column) => {
        const f = view.filters?.[column];
        return Boolean(f && !Array.isArray(f) && f.from === '1' && !f.to);
    };
    for (const key of /** @type {const} */ (['backlog', 'dead'])) {
        ui.pressed[key] = asks(COLUMN[key]);
        $(`[data-kt-filter="${key}"]`)?.setAttribute('aria-pressed', String(ui.pressed[key]));
    }
}

// A filter removed from its pill lets go of its tile, and a filter set in the panel lights it.
document.addEventListener(VIEW_EVENT, (event) => {
    if (!(event.target instanceof Element) || !event.target.matches('[data-kt-datatable]')) return;
    const view = /** @type {CustomEvent} */ (event).detail;
    if (!applying) syncTiles(view);
    const empty = $('[data-kp-datatable-empty]');
    if (empty && view.total > 0 && view.shown === 0) {
        const deadOnly = ui.pressed.dead && !ui.pressed.backlog && Object.keys(view.filters ?? {}).length === 1 && !view.query;
        empty.setAttribute('data-kp-art', deadOnly && totals().dead === 0 ? 'done' : 'nomatch');
        const title = $('[data-kt-empty-title]');
        const body = $('[data-kt-empty-body]');
        if (title) title.textContent = deadOnly && totals().dead === 0 ? 'Nothing is dead' : 'No topic matches';
        if (body)
            body.textContent =
                deadOnly && totals().dead === 0
                    ? 'No message has run out of attempts on any topic. Nothing needs a decision.'
                    : 'Loosen the search or remove a filter.';
    }
});

/* ---- fix links land on the row; the row must be on the table first */

document.addEventListener('click', (event) => {
    const target = event.target instanceof Element ? event.target : null;
    const show = target?.closest('[data-kt-show]');
    if (show) {
        const dt = table();
        dt?.clearFilters();
        dt?.query('');
        for (const key of /** @type {const} */ (['backlog', 'dead'])) ui.pressed[key] = false;
    }
    const open = target?.closest('[data-kt-open]');
    if (open) {
        event.preventDefault();
        const name = open.getAttribute('data-kt-open');
        toast(`Would open /t/${name}/dashboard (the Topic page is a separate review).`);
    }
    const test = target?.closest('[data-kt-test]');
    if (test) {
        const t = model.topics.find((x) => x.name === test.getAttribute('data-kt-test'));
        if (t) {
            t.messages += 1;
            t.lastAt = Date.now();
            toast(`Test message published to ${t.name}. The figures pick it up at the next refresh.`);
        }
    }
});

/* ---- the stand-in for kyu: answers the region refresh with the same markup, moved on */

const realFetch = window.fetch.bind(window);
window.fetch = (input, init) => {
    const headers = new Headers(init?.headers ?? (input instanceof Request ? input.headers : undefined));
    if (headers.get('X-Requested-With') !== 'kp-refresh') return realFetch(input, init);
    advance();
    const strip = h('div', { id: 'kt-kpis' }, ...kpiTiles({ pressed: ui.pressed, state: 'ready' }));
    return new Promise((resolve) =>
        setTimeout(() => resolve(new Response(`<!doctype html><body>${strip.outerHTML}</body>`, { status: 200, headers: { 'content-type': 'text/html' } })), 420),
    );
};

// The swap replaces the tiles' children. The new tiles start on what the old ones showed and count to the new numbers; the words
// change the theme's way; the table and the band are brought up to date with the same model.
if (kpis) {
    new MutationObserver(() => {
        if (!ui.ready) return;
        const before = new Map(shown);
        const fresh = $$('[data-kt-key][data-kp-tick]', kpis).map((el) => [el, el.textContent ?? ''])
        for (const [el, text] of fresh) {
            const old = before.get(/** @type {HTMLElement} */ (el).getAttribute('data-kt-key'));
            if (old !== undefined && old !== text) {
                /** @type {HTMLElement} */ (el).textContent = old;
                tickTo(/** @type {HTMLElement} */ (el), text);
            }
        }
        for (const words of $$('.kp-kpi__trend[data-kt-key]', kpis)) {
            const old = before.get(words.getAttribute('data-kt-key'));
            const next = words.textContent ?? '';
            if (old !== undefined && old !== next) {
                words.textContent = old;
                update(words, next);
            }
        }
        for (const key of /** @type {const} */ (['backlog', 'dead']))
            $(`[data-kt-filter="${key}"]`)?.setAttribute('aria-pressed', String(ui.pressed[key]));
        remember();
        drawBand();
        drawHubBar();
        for (const row of rowsOf()) {
            const t = model.topics.find((x) => x.name === row.getAttribute('data-kt-topic'));
            if (t) paintRow(row, t, true);
        }
        table()?.refresh();
    }).observe(kpis, { childList: true });
}

/* ---- mounting the table and the refresh control again when an option that is read at attach changes */

/** @returns {Promise<void>} */
async function mountTable() {
    if (!host || !shell) return;
    const old = table();
    const view = old?.view();
    host.querySelector('[data-kt-datatable]')?.remove();
    const wrapper = h('div');
    wrapper.innerHTML = shell;
    const next = /** @type {HTMLElement} */ (wrapper.firstElementChild);
    next.setAttribute('data-kp-sort-multi', choices['multi-sort'] === 'click' ? 'click' : '');
    next.setAttribute('data-kp-filter-mode', choices['filter-mode'] === 'add' ? 'add' : 'panel');
    host.prepend(next);
    fillRows();
    paintAll();
    const attached = attachAll(host);
    await attached.ready;
    const dt = dataTable(next);
    if (dt && view) {
        if (view.sorts?.length) dt.sortBy(view.sorts);
        for (const [column, value] of Object.entries(view.filters ?? {})) dt.filter(Number(column), /** @type {any} */ (value));
        if (view.query) dt.query(view.query);
    }
    applyState();
}

async function mountRefresh() {
    const bar = $('.kt-live-bar');
    if (!bar || !refreshShell) return;
    const before = $('[data-kt-refresh]');
    const seconds = before ? (refreshOf(before)?.interval() ?? 0) : 0;
    before?.remove();
    const wrapper = h('div');
    wrapper.innerHTML = refreshShell;
    const next = /** @type {HTMLElement} */ (wrapper.firstElementChild);
    next.setAttribute('data-kp-look', choices['refresh-look'] === 'menu' ? 'menu' : 'segmented');
    next.setAttribute('data-kp-refresh-hover', choices['refresh-hover'] === 'keep' ? 'keep' : 'pause');
    next.setAttribute('data-kp-refresh', String(seconds));
    bar.prepend(next);
    await attachAll(bar).ready;
}

/* ---- state, hub and width controls */

const press = (/** @type {string} */ attr, /** @type {string} */ value, /** @type {ParentNode} */ root = document) => {
    for (const b of $$(`[${attr}]`, root)) b.setAttribute('aria-pressed', String(b.getAttribute(attr) === value));
};

let tableHeight = 0;
function applyState() {
    const dt = table();
    const tbl = tableEl();
    if (tbl && !tbl.hidden && ui.state !== 'loading' && tbl.offsetHeight > 120) tableHeight = tbl.offsetHeight;
    // An empty hub and a failed read are each one plate as tall as the loaded table (the table's own failed strip sits above rows
    // that stay on screen, so the plate stands in for the whole table instead).
    const plate = ui.state === 'empty' || ui.state === 'error';
    if (tbl) tbl.hidden = plate;
    if (noneEl) {
        const failed = ui.state === 'error';
        noneEl.hidden = !plate;
        noneEl.setAttribute('data-kp-art', failed ? 'error' : 'none');
        $('[data-kt-none-title]')?.replaceChildren(failed ? 'Could not read the topics' : 'No topics yet');
        $('[data-kt-none-body]')?.replaceChildren(
            failed
                ? 'The hub did not answer, so the topics could not be read. Nothing was changed.'
                : 'A topic exists as soon as something publishes to it. Run the command under \u201cStart a topic\u201d and it appears here.',
        );
        const retry = $('[data-kt-none-retry]');
        if (retry) retry.hidden = !failed;
        noneEl.style.minBlockSize = plate && tableHeight ? `${tableHeight}px` : '';
    }
    if (!dt) return;
    if (ui.state === 'loading') {
        dt.busy({ text: 'Reading the topics', overlay: true });
        dt.state('loading');
    } else {
        dt.busy(null);
        dt.state('ready');
    }
}

/** @param {'ready' | 'loading' | 'empty' | 'error'} state */
async function setState(state) {
    const wasEmpty = ui.state === 'empty';
    ui.state = state;
    press('data-kt-state', state);
    if (wasEmpty !== (state === 'empty')) {
        // Rows are taken out for the empty hub and put back, then the table reads them again.
        fillRows();
        table()?.refresh();
    }
    paintAll();
    applyState();
}

for (const b of $$('[data-kt-state]')) b.addEventListener('click', () => void setState(/** @type {any} */ (b.getAttribute('data-kt-state'))));
for (const b of $$('[data-kt-hub]')) {
    b.addEventListener('click', () => {
        const mode = /** @type {'busy' | 'quiet'} */ (b.getAttribute('data-kt-hub'));
        press('data-kt-hub', mode);
        model.mode = mode;
        model.topics = makeTopics(mode);
        paintAll(true);
    });
}
for (const b of $$('[data-kt-width]')) {
    b.addEventListener('click', () => {
        press('data-kt-width', b.getAttribute('data-kt-width') ?? 'full');
        stage?.setAttribute('data-kt-width', b.getAttribute('data-kt-width') ?? 'full');
    });
}
$('[data-kt-refresh-now]')?.addEventListener('click', () => {
    const control = $('[data-kt-refresh]');
    const handle = control ? refreshOf(control) : null;
    if (!control || !handle) return;
    // The package's "Refresh now" and the R key do nothing while the control is paused (package gap): a paused control is
    // lent one interval for this one refresh and put back to paused when the answer has landed.
    if (handle.interval() > 0) return handle.now();
    handle.setInterval(60, 'script');
    handle.now();
    const back = () => {
        if (control.getAttribute('aria-busy') === 'true') return setTimeout(back, 120);
        handle.setInterval(0, 'script');
    };
    setTimeout(back, 120);
});
$('[data-kt-none-retry]')?.addEventListener('click', () => {
    void setState('loading');
    setTimeout(() => void setState('ready'), 1700);
});
void RETRY_EVENT;

/* ---- the choices the review dialog sets (each is a real option of a component) */

/** @type {Record<string, (value: string) => void>} */
const apply = {
    'lede-fold': (value) => {
        const lede = $('[data-kt-lede]');
        if (!lede) return;
        if (value === 'fold') lede.setAttribute('data-kp-lede-collapsible', '90');
        else lede.removeAttribute('data-kp-lede-collapsible');
        void relede();
    },
    'reveal-every': (value) => {
        const title = $('[data-kt-title]');
        if (!title) return;
        if (value === 'off') title.removeAttribute('data-kp-reveal');
        else title.setAttribute('data-kp-reveal', 'headline');
        if (value === 'load') title.setAttribute('data-kp-reveal-every', 'load');
        else title.removeAttribute('data-kp-reveal-every');
    },
    'multi-sort': () => void mountTable(),
    'filter-mode': () => void mountTable(),
    'quiet-after': (value) => {
        model.quietAfter = Number(value);
        paintAll();
    },
    'refresh-look': () => void mountRefresh(),
    'refresh-hover': (value) => $('[data-kt-refresh]')?.setAttribute('data-kp-refresh-hover', value),
    'command-wrap': (value) => $('[data-kt-command]')?.setAttribute('data-kp-command-wrap', value),
};

document.addEventListener('review:choice', (event) => {
    const { id, value } = /** @type {CustomEvent<{ id: string, value: string }>} */ (event).detail;
    if (choices[id] === value) return;
    choices[id] = value;
    if (ui.ready) apply[id]?.(value);
    else pendingChoices.push(id);
});
/** @type {string[]} */
const pendingChoices = [];

/* ---- section 1: the header */

const ageMeta = () => {
    const meta = $('[data-kt-meta]');
    if (!meta) return;
    meta.replaceChildren(
        `${plural(model.topics.length, 'topic', 'topics')} · `,
        h('time', { class: 'kp-ago', 'data-kp-ago': true, 'data-kp-ago-verb': 'updated', 'data-kp-stale-after': '180' }),
    );
    const time = $('time', meta);
    if (time) setAgo(time, NOW - 4000);
};

/** @type {'ready' | 'loading' | 'error'} */
let headState = 'ready';
function drawHead() {
    const meta = $('[data-kt-meta]');
    if (!meta) return;
    meta.removeAttribute('data-kt-failed');
    if (headState === 'ready') return ageMeta();
    if (headState === 'loading') {
        meta.replaceChildren(Object.assign(h('span', { class: 'kp-skeleton' }), { style: 'inline-size: 16ch' }));
        return;
    }
    meta.setAttribute('data-kt-failed', '');
    meta.replaceChildren(
        h('span', { class: 'kt-meta__failed' }, 'The topics could not be read. '),
        h('button', { type: 'button', class: 'kp-button kp-button--sm', 'data-kt-head-retry': true }, 'Retry'),
    );
}
for (const b of $$('[data-kt-head-state]')) {
    b.addEventListener('click', () => {
        headState = /** @type {any} */ (b.getAttribute('data-kt-head-state'));
        press('data-kt-head-state', headState);
        drawHead();
    });
}
$('[data-kt-header]')?.addEventListener('click', (event) => {
    if (!(event.target instanceof Element) || !event.target.closest('[data-kt-head-retry]')) return;
    headState = 'loading';
    press('data-kt-head-state', 'loading');
    drawHead();
    setTimeout(() => {
        headState = 'ready';
        press('data-kt-head-state', 'ready');
        drawHead();
    }, 1500);
});
drawHead();

async function relede() {
    const lede = $('[data-kt-lede]');
    if (!lede) return;
    // The lede reads its folding when it attaches: a fresh paragraph with the same words attaches again.
    const fresh = /** @type {HTMLElement} */ (lede.cloneNode(false));
    fresh.textContent = lede.getAttribute('data-kt-words') ?? lede.textContent ?? '';
    lede.replaceWith(fresh);
    await attachAll(fresh.parentElement ?? document).ready;
}
{
    const lede = $('[data-kt-lede]');
    lede?.setAttribute('data-kt-words', (lede.textContent ?? '').replace(/\s+/g, ' ').trim());
    if (lede) lede.textContent = lede.getAttribute('data-kt-words');
}

$('[data-kt-replay]')?.addEventListener('click', () => {
    const title = $('[data-kt-title]');
    if (!title) return;
    // A new heading arrives again: the reveal runs for an element it has not revealed yet.
    const fresh = /** @type {HTMLElement} */ (title.cloneNode(true));
    for (const name of ['data-kp-reveal-state']) fresh.removeAttribute(name);
    fresh.setAttribute('data-kp-reveal-every', 'load');
    title.replaceWith(fresh);
    void attachAll(fresh.parentElement ?? document).ready;
});

/* ---- section 3: the command */

{
    const log = $('[data-kt-copy-log]');
    let refuse = false;
    const real = navigator.clipboard?.writeText?.bind(navigator.clipboard);
    if (navigator.clipboard) {
        navigator.clipboard.writeText = (text) => {
            if (refuse) return Promise.reject(new DOMException('Refused for the review', 'NotAllowedError'));
            if (log) log.textContent = `Copied ${text.split('\n').length} lines, ${text.length} characters.`;
            return real ? real(text).catch(() => undefined) : Promise.resolve();
        };
    }
    for (const b of $$('[data-kt-clipboard]')) {
        b.addEventListener('click', () => {
            refuse = b.getAttribute('data-kt-clipboard') === 'refused';
            press('data-kt-clipboard', refuse ? 'refused' : 'allowed');
            if (log) log.textContent = refuse ? 'The next Copy is refused by the browser.' : '';
        });
    }
    for (const b of $$('[data-kt-cmd-width]')) {
        b.addEventListener('click', () => {
            press('data-kt-cmd-width', b.getAttribute('data-kt-cmd-width') ?? 'full');
            $('[data-kt-cmd-stage]')?.setAttribute('data-kt-width', b.getAttribute('data-kt-cmd-width') ?? 'full');
        });
    }
}

/* ---- section 4: the heat map */

const heat = { state: 'ready', metric: 'published', picked: /** @type {string | null} */ (null) };
const hours = Array.from({ length: 24 }, (_, i) => {
    const at = new Date(Math.floor(NOW / HOUR) * HOUR - (23 - i) * HOUR);
    return { key: at.toISOString(), label: String(at.getHours()).padStart(2, '0'), at };
});
const PROFILE = {
    'notify.kenny': { base: 6, peak: [7, 8, 18, 19, 20], scale: 2.2, dead: [[19, 1]] },
    'ha.events': { base: 52, peak: [6, 7, 17, 18], scale: 1.5, dead: [] },
    'almanac.sync': { base: 3, peak: [3, 4], scale: 4, dead: [[3, 2], [4, 1], [11, 1]] },
    'jobtracker.mail': { base: 1, peak: [9, 10, 14], scale: 5, dead: [] },
    'newsflash.items': { base: 4, peak: [6, 12, 18], scale: 3, dead: [] },
};
/** @type {Record<string, { published: number[], dead: number[] }>} */
const history = {};
for (const [name, p] of Object.entries(PROFILE)) {
    const rand = random(name.length * 977);
    const published = hours.map((hour) => {
        const clock = hour.at.getHours();
        const quietHours = clock < 5 || clock > 22;
        const bump = p.peak.includes(clock) ? p.scale : 1;
        return Math.round(p.base * bump * (quietHours ? 0.2 : 0.8 + rand() * 0.5));
    });
    const dead = hours.map((hour) => p.dead.reduce((n, [clock, count]) => (hour.at.getHours() === clock ? n + count : n), 0));
    history[name] = { published, dead };
}

function heatSpec() {
    const metric = /** @type {'published' | 'dead'} */ (heat.metric);
    const names = Object.keys(PROFILE);
    const peak = Math.max(...names.flatMap((n) => history[n].published));
    const rows = names.map((name) => ({
        key: name,
        label: name,
        mark: `var(--chart-${(slots.get(name) ?? 0) + 1})`,
        cells: hours.map((hour, i) => {
            const n = history[name][metric][i];
            const when = `${hour.label}:00`;
            if (metric === 'dead')
                return {
                    tone: /** @type {const} */ (n === 0 ? 'ok' : n === 1 ? 'warn' : 'bad'),
                    label: n === 0 ? 'no dead letters' : `${n} ${n === 1 ? 'dead letter' : 'dead letters'}`,
                    aria: `${name} at ${when}: ${n === 0 ? 'no dead letters' : `${n} dead`}`,
                    tip: `${name} at ${when}: ${n === 0 ? 'nothing died' : `${n} ${n === 1 ? 'message' : 'messages'} died`}`,
                };
            return {
                tone: /** @type {const} */ (n === 0 ? 'none' : 'level'),
                level: Math.sqrt(n / peak),
                label: `${number(n)} published`,
                aria: `${name} at ${when}: ${number(n)} published`,
                tip: `${name} at ${when}: ${number(n)} ${n === 1 ? 'message' : 'messages'} published`,
            };
        }),
    }));
    const summary = {
        key: 'hub',
        label: 'Whole hub',
        cells: hours.map((hour, i) => {
            const total = names.reduce((n, name) => n + history[name][metric][i], 0);
            if (metric === 'dead')
                return {
                    tone: /** @type {const} */ (total === 0 ? 'ok' : total === 1 ? 'warn' : 'bad'),
                    share: total === 0 ? 1 : Math.min(1, total / 3),
                    label: total === 0 ? 'no dead letters' : `${total} dead`,
                    tip: `Whole hub at ${hour.label}:00: ${total === 0 ? 'nothing died' : `${total} died`}`,
                };
            const all = names.reduce((n, name) => n + history[name].published.slice().sort((a, b) => b - a)[0], 0);
            return {
                tone: /** @type {const} */ ('level'),
                level: Math.sqrt(total / all),
                share: total / all,
                label: `${number(total)} published`,
                tip: `Whole hub at ${hour.label}:00: ${number(total)} published`,
            };
        }),
    };
    return {
        // Only the named columns carry their hour in the axis; the others stay empty there and every cell says its own hour in its name.
        columns: hours.map((hour, i) => ({ key: hour.key, label: i % 3 === 0 || i === hours.length - 1 ? hour.label : '' })),
        rows,
        summary,
        every: 3,
        label: `Messages ${metric === 'dead' ? 'that died' : 'published'} per topic per hour, last 24 hours`,
        toggle: true,
        picked: heat.picked,
    };
}

function syncHeatRetry() {
    const retry = $('[data-kt-heat-retry]');
    if (retry) retry.hidden = heat.state !== 'error';
}
$('[data-kt-heat-retry]')?.addEventListener('click', () => {
    heat.state = 'loading';
    press('data-kt-heat-state', 'loading');
    drawHeat();
    syncHeatRetry();
    setTimeout(() => {
        heat.state = 'ready';
        press('data-kt-heat-state', 'ready');
        drawHeat();
        syncHeatRetry();
    }, 1500);
});

function drawHeat() {
    const grid = $('[data-kt-heat]');
    if (!grid) return;
    setHeat(grid, {
        ...heatSpec(),
        state: /** @type {any} */ (heat.state),
        skeleton: { rows: 5, columns: 24 },
        message: heat.state === 'empty' ? 'No history yet. kyu has not counted a full hour.' : 'The hourly counts could not be read.',
    });
    const legend = $('[data-kt-heat-legend]');
    if (legend) {
        const item = (/** @type {string} */ tone, /** @type {string} */ text, /** @type {string} */ level = '') =>
            h(
                'li',
                {},
                h('span', { class: 'kp-heat__swatch', 'data-kp-tone': tone, style: level ? `--kp-heat-level: ${level}` : undefined }),
                ` ${text}`,
            );
        legend.replaceChildren(
            ...(heat.metric === 'dead'
                ? [item('ok', 'nothing died'), item('warn', 'one died'), item('bad', 'two or more died')]
                : [item('none', 'nothing published'), item('level', 'a few', '0.2'), item('level', 'some', '0.55'), item('level', 'the most', '1')]),
        );
    }
}
document.addEventListener(HEAT_PICK_EVENT, (event) => {
    const detail = /** @type {CustomEvent} */ (event).detail;
    const readout = $('[data-kt-heat-readout]');
    if (!readout || !(event.target instanceof Element) || !event.target.matches('[data-kt-heat]')) return;
    heat.picked = detail.picked ? detail.colKey : null;
    if (!detail.picked) {
        readout.textContent = 'No hour pinned. Press a cell to pin its hour.';
        return;
    }
    const i = hours.findIndex((hour) => hour.key === detail.colKey);
    const names = Object.keys(PROFILE);
    const published = names.reduce((n, name) => n + history[name].published[i], 0);
    const dead = names.reduce((n, name) => n + history[name].dead[i], 0);
    readout.textContent = `${hours[i].label}:00 pinned: ${number(published)} published across the hub, ${dead === 0 ? 'none died' : `${dead} died`}.`;
});
for (const b of $$('[data-kt-heat-state]')) {
    b.addEventListener('click', () => {
        heat.state = b.getAttribute('data-kt-heat-state') ?? 'ready';
        press('data-kt-heat-state', heat.state);
        drawHeat();
        syncHeatRetry();
    });
}
for (const b of $$('[data-kt-heat-metric]')) {
    b.addEventListener('click', () => {
        heat.metric = b.getAttribute('data-kt-heat-metric') ?? 'published';
        press('data-kt-heat-metric', heat.metric);
        drawHeat();
    });
}
for (const b of $$('[data-kt-heat-width]')) {
    b.addEventListener('click', () => {
        press('data-kt-heat-width', b.getAttribute('data-kt-heat-width') ?? 'full');
        $('[data-kt-heat-stage]')?.setAttribute('data-kt-width', b.getAttribute('data-kt-heat-width') ?? 'full');
    });
}

/* ---- section 5: the key figures with their last 24 hours */

const STEP = HOUR;
const trendSeries = (/** @type {number} */ seed, /** @type {number} */ from, /** @type {number} */ to, /** @type {number} */ noise) => {
    const rand = random(seed);
    return Array.from({ length: 24 }, (_, i) => /** @type {[number, number]} */ ([
        Math.floor(NOW / STEP) * STEP - (23 - i) * STEP,
        Math.max(0, Math.round(from + ((to - from) * i) / 23 + (rand() - 0.5) * noise)),
    ]));
};
const TRENDS = [
    { key: 'topics', label: 'Topics', note: 'now', value: '5', points: Array.from({ length: 24 }, (_, i) => /** @type {[number, number]} */ ([Math.floor(NOW / STEP) * STEP - (23 - i) * STEP, i < 15 ? 4 : 5])), delta: { dir: 'up', tone: '', text: '1' }, words: ' since yesterday · peak 5', tone: '' },
    { key: 'messages', label: 'Messages', note: 'per hour', value: '3,820', points: trendSeries(11, 60, 118, 70), delta: { dir: 'up', tone: 'good', text: '212' }, words: ' since yesterday · peak 157 an hour', tone: '' },
    { key: 'backlog', label: 'Backlog', note: 'waiting', value: '207', points: trendSeries(12, 40, 207, 40), delta: { dir: 'up', tone: 'bad', text: '131' }, words: ' since yesterday · peak 207', tone: 'warning' },
    { key: 'dead', label: 'Dead', note: 'dead letters', value: '5', points: trendSeries(13, 0, 5, 1), delta: { dir: 'up', tone: 'bad', text: '4' }, words: ' since yesterday · peak 5', tone: 'destructive' },
];
let trendState = 'ready';
function drawTrends() {
    const strip = $('[data-kt-trends]');
    const plate = $('[data-kt-trend-plate]');
    if (!strip || !plate) return;
    const failed = trendState === 'error';
    strip.hidden = failed;
    plate.hidden = !failed;
    if (failed) return;
    const rebuild = strip.children.length === 0;
    if (rebuild) {
        strip.replaceChildren(
            ...TRENDS.map((tr) =>
                h(
                    'div',
                    { class: 'kp-kpi kp-kpi--trend', 'data-kt-trend': tr.key, 'data-kp-tone': tr.tone || undefined },
                    h('span', { class: 'kp-kpi__label' }, tr.label, ' ', h('span', { class: 'kp-kpi__label-note' }, tr.note)),
                    h('span', { class: 'kp-kpi__value' }),
                    h('span', { class: 'kp-kpi__trend' }),
                    h('figure', {
                        class: 'kp-kpi__chart',
                        'data-kp-chart': 'spark',
                        'data-kp-spark-head': 'none',
                        'data-kp-spark-axis': 'relative',
                        'aria-label': `${tr.label}, last 24 hours`,
                        style: `--kp-chart-series: var(--chart-${(TRENDS.indexOf(tr) % 5) + 1})`,
                    }),
                ),
            ),
        );
        void attachAll(strip);
    }
    for (const tr of TRENDS) {
        const tile = /** @type {HTMLElement} */ ($(`[data-kt-trend="${tr.key}"]`, strip));
        const value = /** @type {HTMLElement} */ ($('.kp-kpi__value', tile));
        const words = /** @type {HTMLElement} */ ($('.kp-kpi__trend', tile));
        const figure = /** @type {HTMLElement} */ ($('.kp-kpi__chart', tile));
        const skeleton = (/** @type {HTMLElement} */ el, /** @type {string} */ width) =>
            el.replaceChildren(Object.assign(h('span', { class: 'kp-skeleton' }), { style: `inline-size: ${width}` }));
        if (trendState === 'loading') {
            skeleton(value, '4ch');
            skeleton(words, '80%');
            setTrendData(figure, null);
            continue;
        }
        if (trendState === 'empty') {
            value.textContent = tr.value;
            words.textContent = 'collecting the first 24 hours';
            setTrendData(figure, { points: [], step: STEP, unit: '', digits: 0 });
            continue;
        }
        value.textContent = tr.value;
        words.replaceChildren(
            h('span', { class: 'kp-kpi__delta', 'data-kp-direction': tr.delta.dir, 'data-kp-tone': tr.delta.tone || undefined }, tr.delta.text),
            tr.words,
        );
        setTrendData(figure, { points: tr.points, step: STEP, unit: '', digits: 0 });
    }
}
for (const b of $$('[data-kt-trend-state]')) {
    b.addEventListener('click', () => {
        trendState = b.getAttribute('data-kt-trend-state') ?? 'ready';
        press('data-kt-trend-state', trendState);
        drawTrends();
    });
}
for (const b of $$('[data-kt-trend-width]')) {
    b.addEventListener('click', () => {
        press('data-kt-trend-width', b.getAttribute('data-kt-trend-width') ?? 'full');
        $('[data-kt-trend-stage]')?.setAttribute('data-kt-width', b.getAttribute('data-kt-trend-width') ?? 'full');
    });
}
$('[data-kt-trend-retry]')?.addEventListener(CHART_RETRY_EVENT, () => undefined);
$('[data-kt-trend-retry]')?.addEventListener('click', () => {
    trendState = 'loading';
    press('data-kt-trend-state', 'loading');
    drawTrends();
    setTimeout(() => {
        trendState = 'ready';
        press('data-kt-trend-state', 'ready');
        drawTrends();
    }, 1500);
});

/* ---- first render: all of it is in the markup before auto.js attaches ---- */

if (stage) {
    fillRows();
    paintAll();
}
drawHeat();
drawTrends();

const ready = new Promise((resolve) => {
    const done = () => document.documentElement.hasAttribute('data-kp-auto-ready');
    if (done()) return resolve(undefined);
    new MutationObserver((_, watch) => {
        if (done()) {
            watch.disconnect();
            resolve(undefined);
        }
    }).observe(document.documentElement, { attributes: true, attributeFilter: ['data-kp-auto-ready'] });
});
void ready.then(() => {
    ui.ready = true;
    for (const id of pendingChoices.splice(0)) apply[id]?.(choices[id]);
    applyState();
});
