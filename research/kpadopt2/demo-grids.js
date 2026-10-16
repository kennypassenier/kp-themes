// Page-only script for the grids demo. The grids, the matrix and the bar
// cells are the package's own (js/heat.js, js/barcell.js, datatable). This file
// only makes up data (the "mock" parts), rebuilds the grids from it and wires
// the state buttons and the detail lines under the grids.
import {
    setHeat,
    setHeatPick,
    setMatrix,
    HEAT_PICK_EVENT,
    HEAT_ROW_EVENT,
    HEAT_PAGE_EVENT,
    MATRIX_PICK_EVENT,
    MATRIX_LIGHT_EVENT,
} from '../../js/heat.js';
import { setBarCell } from '../../js/barcell.js';
import { setKeys } from '../../js/keys.js';

const $ = (/** @type {string} */ sel, /** @type {ParentNode} */ root = document) => /** @type {HTMLElement} */ (root.querySelector(sel));
const $$ = (/** @type {string} */ sel, /** @type {ParentNode} */ root = document) => /** @type {HTMLElement[]} */ ([...root.querySelectorAll(sel)]);

/* ----------------------------------------------------------- the data (mock) */

const STACKS = [
    { key: 'media', hue: '#7c5cff', born: -99 },
    { key: 'home', hue: '#2bb673', born: -99 },
    { key: 'platform', hue: '#e0902b', born: -99 },
    { key: 'backups', hue: '#d9486b', born: -99 },
    { key: 'network', hue: '#2a9bd6', born: -99 },
    { key: 'docs', hue: '#8a8f98', born: 12 },
    { key: 'lab-scratch-volume-with-a-long-name', hue: '#b0b44a', born: -99, keeps: false },
];
const TODAY = new Date(Date.UTC(2026, 9, 16));
const NIGHTS = 30;

/** A repeatable pseudo-random number from two integers. @param {number} a @param {number} b */
const rnd = (a, b) => {
    let x = (a * 374761393 + b * 668265263) >>> 0;
    x = ((x ^ (x >>> 13)) * 1274126177) >>> 0;
    return ((x ^ (x >>> 16)) >>> 0) / 4294967296;
};
const iso = (/** @type {Date} */ d) => d.toISOString().slice(0, 10);
const shortDate = (/** @type {string} */ s) =>
    new Date(`${s}T00:00:00Z`).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', timeZone: 'UTC' });

let offset = 0;
/** The nights on show, oldest first; index 0 is NIGHTS - 1 + offset nights back. */
function nights() {
    return Array.from({ length: NIGHTS }, (_, i) => {
        const d = new Date(TODAY);
        d.setUTCDate(d.getUTCDate() - (NIGHTS - 1 - i) - offset);
        return iso(d);
    });
}
/** @param {typeof STACKS[number]} s @param {string} night @param {number} back nights back from today */
function cellFor(s, night, back) {
    if (s.keeps === false) return { tone: 'none', label: 'keeps no data by design', tip: 'This volume is scratch space and is never backed up.' };
    if (back === 0) return { tone: 'future', label: 'tonight has not run yet', tip: 'Tonight’s round has not run yet.' };
    if (s.born > 0 && back > s.born)
        return { tone: 'before', label: 'before this stack had any history', tip: 'Before this stack had any backup history.' };
    const miss =
        rnd(s.key.length * 31 + back, 7) < 0.06 || (s.key === 'backups' && back === 2) || (s.key === 'network' && (back === 5 || back === 6));
    if (miss) return { tone: 'bad', label: 'missed', tip: `${s.key} · ${shortDate(night)}: no snapshot this night.` };
    const hh = 2 + Math.floor(rnd(back, s.key.length) * 2);
    const mm = String(Math.floor(rnd(s.key.length, back) * 59)).padStart(2, '0');
    return { tone: 'ok', label: 'backed up', tip: `${s.key} · ${shortDate(night)}: snapshot at 0${hh}:${mm}.` };
}

function heatSpec() {
    const list = nights();
    const columns = list.map((n) => ({ key: n, label: String(Number(n.slice(8))) }));
    const rows = STACKS.map((s) => ({
        key: s.key,
        label: s.key,
        mark: s.hue,
        muted: s.keeps === false,
        cells: list.map((n, i) => cellFor(s, n, NIGHTS - 1 - i + offset)),
    }));
    const summary = {
        key: 'fleet',
        label: 'Whole fleet',
        cells: list.map((n, i) => {
            const back = NIGHTS - 1 - i + offset;
            const live = rows.map((r) => r.cells[i]).filter((c) => c.tone === 'ok' || c.tone === 'bad');
            if (back === 0) return { tone: 'future', label: 'tonight has not run yet' };
            if (live.length === 0) return { tone: 'before', label: 'before any backup history' };
            const ok = live.filter((c) => c.tone === 'ok').length;
            const tone = ok === live.length ? 'ok' : ok === 0 ? 'bad' : 'warn';
            return {
                tone,
                share: ok / live.length,
                label: `${ok} of ${live.length} stacks backed up`,
                tip: `${shortDate(n)}: ${ok} of ${live.length} stacks backed up. Click to pin this night.`,
            };
        }),
    };
    return { columns, summary, rows, label: 'Snapshots per stack per night', toggle: true };
}

/* ------------------------------------------------------------------ heat grid */

const main = $('[data-gd-heat="main"]');
let heatState = 'ready';
function paintMain() {
    setHeat(main, {
        ...heatSpec(),
        state: /** @type {any} */ (heatState),
        skeleton: { rows: STACKS.length, columns: NIGHTS },
        message:
            heatState === 'error'
                ? 'The backup repositories could not be read. Try again in a minute.'
                : 'No stack is shown: every stack is filtered out.',
    });
    $('[data-gd-range]').textContent = `${shortDate(nights()[0])} – ${shortDate(nights()[NIGHTS - 1])}`;
    $('[data-gd-later]').toggleAttribute('disabled', offset === 0);
}
paintMain();
setKeys($('[data-gd-keys="heat"]'), [
    [['←', '→', '↑', '↓'], 'move'],
    ['Enter', 'pin the night'],
    [['Page Up', 'Page Down'], 'earlier or later'],
    ['Esc', 'unpin'],
]);

const detail = $('[data-gd-heat-detail]');
main.addEventListener(HEAT_PICK_EVENT, (e) => {
    const d = /** @type {CustomEvent} */ (e).detail;
    if (!d.picked) {
        detail.textContent = 'No night pinned. Press a cell to pin its night.';
        return;
    }
    const col = nights().indexOf(d.colKey);
    const missed = heatSpec()
        .rows.filter((r) => r.cells[col]?.tone === 'bad')
        .map((r) => r.key);
    detail.textContent = `${shortDate(d.colKey)} pinned: ${missed.length ? `missed by ${missed.join(', ')}.` : 'every stack that keeps data was backed up.'}`;
});
const filtered = $('[data-gd-heat-filter]');
main.addEventListener(HEAT_ROW_EVENT, (e) => {
    const d = /** @type {CustomEvent} */ (e).detail;
    filtered.textContent = d.keys.length
        ? `Showing only: ${d.keys.join(', ')} (the page filters; the grid only reports).`
        : 'All stacks shown. Press stack names to show only them.';
});
main.addEventListener(HEAT_PAGE_EVENT, (e) => {
    const d = /** @type {CustomEvent} */ (e).detail;
    offset = Math.max(0, offset + (d.direction === 'earlier' ? NIGHTS : -NIGHTS));
    paintMain();
});
$('[data-gd-earlier]').addEventListener('click', () => {
    offset += NIGHTS;
    paintMain();
});
$('[data-gd-later]').addEventListener('click', () => {
    offset = Math.max(0, offset - NIGHTS);
    paintMain();
});
$('[data-gd-today]').addEventListener('click', () => {
    offset = 0;
    setHeatPick(main, null);
    paintMain();
});
for (const b of $$('[data-gd-state]')) {
    b.addEventListener('click', () => {
        heatState = /** @type {string} */ (b.dataset.gdState);
        for (const o of $$('[data-gd-state]')) o.setAttribute('aria-pressed', String(o === b));
        paintMain();
    });
}
let matrixState = 'ready';
for (const b of $$('[data-gd-mstate]')) {
    b.addEventListener('click', () => {
        matrixState = /** @type {string} */ (b.dataset.gdMstate);
        for (const o of $$('[data-gd-mstate]')) o.setAttribute('aria-pressed', String(o === b));
        paintMatrix();
    });
}

// A value-toned grid: requests per hour.
const SERVICES = ['proxy', 'web', 'api', 'media', 'backup'];
const levelGrid = $('[data-gd-heat="level"]');
setHeat(levelGrid, {
    label: 'Requests per service per hour',
    every: 3,
    columns: Array.from({ length: 24 }, (_, h) => ({ key: String(h), label: String(h).padStart(2, '0') })),
    rows: SERVICES.map((s, r) => ({
        key: s,
        label: s,
        cells: Array.from({ length: 24 }, (_, h) => {
            const peak = Math.max(0, Math.sin(((h - 6 - r) / 24) * Math.PI * 2) * 0.5 + 0.5);
            const level = Math.min(1, peak * (0.55 + rnd(r, h) * 0.45));
            return {
                tone: 'level',
                level,
                label: `${Math.round(level * 1200)} requests`,
                tip: `${s} at ${String(h).padStart(2, '0')}:00: ${Math.round(level * 1200)} requests.`,
            };
        }),
    })),
});

for (const swatch of $$('[data-gd-level]')) swatch.style.setProperty('--kp-heat-level', swatch.dataset.gdLevel ?? '0');

// The small states, side by side.
setHeat($('[data-gd-heat="loading"]'), { state: 'loading', label: 'Loading', skeleton: { rows: 3, columns: 24 } });
setHeat($('[data-gd-heat="empty"]'), { state: 'empty', label: 'Empty', message: 'No stack is shown: every stack is filtered out.' });
setHeat($('[data-gd-heat="error"]'), { state: 'error', label: 'Failed', message: 'The backup repositories could not be read.' });

/* --------------------------------------------------------------------- matrix */

const NAMES = [
    { key: 'proxy', label: 'proxy', mark: '#7c5cff' },
    { key: 'web', label: 'web', mark: '#2bb673' },
    { key: 'api', label: 'api-gateway', mark: '#e0902b' },
    { key: 'db', label: 'database', mark: '#d9486b' },
    { key: 'cache', label: 'cache', mark: '#2a9bd6' },
    { key: 'backup', label: 'backup', mark: '#8a8f98' },
];
/** @type {Record<string, any>} */
const PAIRS = {
    'proxy>web': { tone: 'ok', text: '2', label: '2 ports open, as declared' },
    'proxy>api': { tone: 'ok', text: '1', label: '1 port open, as declared' },
    'web>api': { tone: 'ok', text: '1', label: '1 port open, as declared' },
    'web>db': { tone: 'bad', label: 'blocked: web may not reach the database', ringed: true },
    'api>db': { tone: 'ok', text: '1', label: '1 port open, as declared' },
    'api>cache': { tone: 'ok', text: '1', label: '1 port open, as declared' },
    'web>cache': { tone: 'warn', text: 'open', label: 'mismatch: open to every port, declared for one' },
    'backup>db': { tone: 'warn', text: 'open', label: 'mismatch: open to every port, declared for one', mark: true },
    'db>backup': { tone: 'muted', text: '0', label: 'nothing declared, nothing open' },
    'cache>db': { tone: 'bad', label: 'blocked: dropped on the way out of cache', ringed: true },
};
const pairCell = (/** @type {string} */ row, /** @type {string} */ col) => {
    const pair = PAIRS[`${row}>${col}`];
    if (pair) return { ...pair, tip: `${row} → ${col}: ${pair.label}.` };
    if (row === 'backup' || col === 'backup') return null;
    return { tone: 'muted', text: '0', label: 'nothing declared, nothing open' };
};
const matrixMain = $('[data-gd-matrix="main"]');
// (matrixState is declared with the buttons above, before the first paint)
const matrixNarrow = $('[data-gd-matrix="narrow"]');
const paintMatrix = () => {
    const state = /** @type {any} */ (matrixState);
    for (const el of [matrixMain, matrixNarrow]) {
        setMatrix(el, {
            corner: 'from ↓ to →',
            rows: NAMES,
            columns: NAMES,
            cell: pairCell,
            state,
            skeleton: NAMES.length,
            label: 'Which stack can reach which',
            message:
                state === 'error'
                    ? 'The host did not answer with a reachability matrix.'
                    : 'No matrix yet: it needs at least one stack with an address.',
        });
    }
};
paintMatrix();
const mxDetail = $('[data-gd-matrix-detail]');
matrixMain.addEventListener(MATRIX_PICK_EVENT, (e) => {
    const d = /** @type {CustomEvent} */ (e).detail;
    const pair = PAIRS[`${d.rowKey}>${d.colKey}`];
    mxDetail.textContent = `${d.rowKey} → ${d.colKey}: ${pair?.label ?? 'nothing declared, nothing open'}.`;
});
const mxLight = $('[data-gd-matrix-light]');
matrixMain.addEventListener(MATRIX_LIGHT_EVENT, (e) => {
    const d = /** @type {CustomEvent} */ (e).detail;
    mxLight.textContent = d.keys.length
        ? `Lit: ${d.keys.join(', ')}. Press Esc or a lit name to turn it off.`
        : 'Nothing lit. Press a name to light its row and column.';
});
setKeys($('[data-gd-keys="matrix"]'), [
    [['←', '→', '↑', '↓'], 'move between cells'],
    [['Home', 'End'], 'row ends'],
    ['Esc', 'turn the lit names off'],
]);

/* ------------------------------------------------------------------- bar cells */

const CAP = [
    ['media', 0.38, 0.91, 0.62, '3.4 GB'],
    ['home', 0.12, 0.44, 0.31, '0.8 GB'],
    ['platform', 0.77, 0.58, 0.94, '12.1 GB'],
    ['backups', 0.05, 0.2, 0.87, '210 GB'],
    ['network', null, null, null, '—'],
    ['docs', 0.21, 1.12, 0.18, '440 MB'],
];
const capBody = $('[data-gd-cap]');
const SORT_BYTES = { '3.4 GB': 3.4e9, '0.8 GB': 0.8e9, '12.1 GB': 12.1e9, '210 GB': 210e9, '—': '', '440 MB': 440e6 };
for (const [stack, cpu, mem, disk, size] of CAP) {
    const tr = document.createElement('tr');
    tr.dataset.kpRowKey = String(stack);
    const name = document.createElement('td');
    name.dataset.label = 'Stack';
    name.textContent = String(stack);
    tr.append(name);
    for (const [label, v] of [
        ['CPU', cpu],
        ['Memory', mem],
        ['Disk', disk],
    ]) {
        const td = document.createElement('td');
        td.dataset.label = String(label);
        const span = document.createElement('span');
        td.append(span);
        setBarCell(span, { value: /** @type {number | null} */ (v), text: v == null ? 'not read' : undefined, label: `${label} in use` });
        tr.append(td);
    }
    const sz = document.createElement('td');
    sz.dataset.label = 'On disk';
    sz.className = 'kp-text-end kp-numeric';
    sz.textContent = String(size);
    sz.setAttribute('data-kp-sort-value', String(/** @type {any} */ (SORT_BYTES)[String(size)]));
    tr.append(sz);
    capBody.append(tr);
}
for (const b of $$('[data-gd-bar-load]')) {
    b.addEventListener('click', () => {
        const on = b.getAttribute('aria-pressed') !== 'true';
        b.setAttribute('aria-pressed', String(on));
        for (const span of $$('.kp-bar-cell', capBody)) {
            const td = /** @type {HTMLElement} */ (span.closest('td'));
            const was = span.querySelector('.kp-meter');
            const row = /** @type {HTMLElement} */ (td.closest('tr'));
            const entry = CAP.find((c) => c[0] === row.dataset.kpRowKey);
            const idx = ['CPU', 'Memory', 'Disk'].indexOf(td.dataset.label ?? '');
            const v = /** @type {number | null} */ (entry?.[idx + 1] ?? null);
            if (was)
                setBarCell(span, { value: v, text: on ? '' : v == null ? 'not read' : undefined, loading: on, label: `${td.dataset.label} in use` });
        }
    });
}
