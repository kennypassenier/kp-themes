// research/live-options-1019: the page's own wiring. Every component is the package's (js/auto.js attaches them); this file does
// three things: the buttons above a component set the attribute they name on it (the same thing a page or the console does), the
// app side of the refresh controls and the code's Retry answers, and the readouts under the components.
import { dataTable } from '../../js/datatable.js';
import { getSegmentedValues, itemsOf, valueOf } from '../../js/segmented.js';
import { setQr } from '../../js/qr.js';

/** Resolves once js/auto.js has attached everything the page carries. */
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
await ready;

const sleep = (/** @type {number} */ ms) => new Promise((resolve) => setTimeout(resolve, ms));
const $ = (/** @type {string} */ id) => document.getElementById(id);

// ---- the palette: type a query as a person would (the input event does the filtering) -----------------------------------
/** @param {string} text */
const typeIntoPalette = (text) => {
    const input = $('lo-palette')?.querySelector('input');
    if (!(input instanceof HTMLInputElement)) return;
    input.value = text;
    input.dispatchEvent(new Event('input', { bubbles: true }));
};

// ---- the buttons above a component ---------------------------------------------------------------------------------------
for (const button of /** @type {HTMLElement[]} */ ([...document.querySelectorAll('[data-lo-target]')])) {
    button.addEventListener('click', () => {
        const target = $(button.dataset.loTarget ?? '');
        const attr = button.dataset.loAttr ?? '';
        if (!target || !attr) return;
        if (button.hasAttribute('data-lo-remove')) target.removeAttribute(attr);
        else target.setAttribute(attr, button.dataset.loValue ?? '');
        for (const other of button.parentElement?.querySelectorAll('[data-lo-target]') ?? []) other.setAttribute('aria-pressed', String(other === button));
        if (attr === 'data-lo-query') typeIntoPalette(button.dataset.loValue ?? '');
        if (target.id === 'lo-seg') setTimeout(showSegmented, 0);
    });
}

// ---- 1 and 2 · the refresh controls: the app reads its data and answers -------------------------------------------------
const reads = new Map();
document.addEventListener('kp-refresh', (event) => {
    const detail = /** @type {CustomEvent} */ (event).detail;
    const el = event.target instanceof Element ? event.target.closest('[data-lo-answers]') : null;
    if (!el) return;
    const key = el.getAttribute('data-lo-answers') ?? '';
    reads.set(key, (reads.get(key) ?? 0) + 1);
    const count = document.querySelector(`[data-lo-reads="${key}"]`);
    if (count) count.textContent = String(reads.get(key));
    const why = document.querySelector(`[data-lo-why="${key}"]`);
    if (why) why.textContent = { timer: 'the timer', now: 'Refresh now or R', retry: 'Retry now', return: 'coming back to the tab' }[/** @type {'timer'} */ (detail.reason)] ?? detail.reason;
    const fails = el.getAttribute('data-lo-app') === 'fail';
    setTimeout(() => detail.done(!fails), 450);
});

// ---- 3 · the log with the pill: lines have arrived while the reader is at the oldest ------------------------------------
const log = $('lo-log');
let lines = 0;
/** @param {number} n */
const addLines = (n) => {
    if (!log) return;
    for (let i = 0; i < n; i++) {
        lines += 1;
        const row = document.createElement('li');
        const minute = String(Math.floor(lines / 6)).padStart(2, '0');
        row.textContent = `12:${minute}:${String((lines % 6) * 10).padStart(2, '0')}  gateway  health check ${lines} passed`;
        log.append(row);
    }
};
if (log) {
    addLines(40);
    await sleep(500);
    log.scrollTop = 0;
    await sleep(300);
    addLines(3);
    document.querySelector('[data-lo-add-lines]')?.addEventListener('click', () => addLines(3));
}

// ---- 4 · the table opens sorted by two columns (the table writes its own summary line and the numbers) ------------------
const sortTable = $('lo-sort');
if (sortTable) {
    dataTable(sortTable)?.sortBy([
        { column: 1, direction: 'ascending' },
        { column: 2, direction: 'descending' },
    ]);
}

// ---- 8 · the palette opens with a query already typed -------------------------------------------------------------------
typeIntoPalette('gate rest');

// ---- 9 · the code: Retry asks the app for a shorter link ----------------------------------------------------------------
const qr = $('lo-qr');
if (qr) {
    const longValue = qr.getAttribute('data-kp-qr-value') ?? '';
    let retries = 0;
    qr.addEventListener('kp-qr-retry', () => {
        retries += 1;
        const count = document.querySelector('[data-lo-retries]');
        if (count) count.textContent = String(retries);
        setQr(qr, { value: 'https://kp-soft.dev/invite/7Hq2' });
    });
    document.querySelector('[data-lo-qr-reset]')?.addEventListener('click', () => setQr(qr, { value: longValue }));
}

// ---- 10 · the segmented control: what is on ------------------------------------------------------------------------------
const seg = $('lo-seg');
function showSegmented() {
    const out = document.querySelector('[data-lo-values="lo-seg"]');
    if (!seg || !out) return;
    const on = getSegmentedValues(seg);
    const label = (/** @type {string} */ value) => itemsOf(seg).find((item) => valueOf(item) === value)?.textContent?.trim() ?? value;
    out.textContent = on.length === 0 ? 'All (nothing narrowed)' : on.map(label).join(', ');
}
seg?.addEventListener('kp-segmented-change', showSegmented);
showSegmented();
