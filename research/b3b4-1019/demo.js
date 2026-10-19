// research/b3b4-1019: the page's own wiring. The components are the package's (js/auto.js attaches the data tables, the action columns and
// the disabled reasons); this file is what a consuming page does with them: take a row out, hold a row for an Undo, ask for a page,
// flip an attribute.
import { dataTable } from '../../js/datatable.js';

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

// ---- 1 · rows the page takes out: no call to refresh() ---------------------------------------------------
document.querySelector('#bb-removed')?.addEventListener('click', (event) => {
    const button = event.target instanceof Element ? event.target.closest('[data-bb-remove]') : null;
    button?.closest('tr')?.remove();
});

// ---- 2 · a row held for an Undo ------------------------------------------------------------------------------
const heldLine = document.querySelector('#bb-held-line');
/** @type {Map<string, number>} */
const waiting = new Map();
const say = (/** @type {Node | string} */ ...parts) => heldLine?.replaceChildren(...parts);
document.querySelector('#bb-held')?.addEventListener('click', (event) => {
    const button = event.target instanceof Element ? event.target.closest('[data-bb-hold]') : null;
    if (!(button instanceof HTMLElement)) return;
    const name = button.dataset.bbHold ?? '';
    const row = button.closest('tr');
    if (!row) return;
    row.setAttribute('data-kp-row-hidden', '');
    const undo = document.createElement('button');
    undo.type = 'button';
    undo.className = 'kp-button kp-button--sm';
    undo.textContent = 'Undo';
    undo.addEventListener('click', () => {
        clearTimeout(waiting.get(name));
        waiting.delete(name);
        row.removeAttribute('data-kp-row-hidden');
        say(`${name} is back.`);
    });
    say(`${name} deleted. `, undo);
    waiting.set(
        name,
        window.setTimeout(() => {
            row.remove();
            waiting.delete(name);
            say(`${name} is gone for good.`);
        }, 8000),
    );
});

// ---- 3 · a date filter and the page by number --------------------------------------------------------------
const dates = document.querySelector('#bb-dates');
const pageLine = document.querySelector('#bb-page-line');
if (dates instanceof HTMLElement) {
    const handle = dataTable(dates);
    handle?.filter(2, { from: '2026-10-05', to: '2026-10-12' });
    const report = () => {
        const view = handle?.view();
        if (view && pageLine) pageLine.textContent = `page() ${view.page}, the pager says page ${view.pageNumber} of ${view.pages}.`;
    };
    dates.addEventListener('kp-datatable-view', report);
    report();
    for (const button of document.querySelectorAll('[data-bb-page]')) {
        button.addEventListener('click', () => handle?.page(Number(/** @type {HTMLElement} */ (button).dataset.bbPage)));
    }
}

// ---- 4 · the one-row-open rule, switched while on screen ------------------------------------------------------
document.querySelector('[data-bb-single]')?.addEventListener('change', (event) => {
    const table = document.querySelector('#bb-expand');
    if (event.target instanceof HTMLInputElement) table?.toggleAttribute('data-kp-expand-single', event.target.checked);
});

// ---- 5 · the Delete of the first row, turned off and on ----------------------------------------------------
const flip = document.querySelector('[data-bb-flip]');
flip?.addEventListener('click', () => {
    const off = flip.getAttribute('aria-pressed') !== 'true';
    flip.setAttribute('aria-pressed', String(off));
    flip.textContent = off ? 'Turn on Family\u2019s Delete' : 'Turn off Family\u2019s Delete';
    for (const button of document.querySelectorAll(
        '#bb-reason-table tbody tr:first-child [data-kp-action="delete"], #bb-reason-list li:first-child [data-kp-action="delete"]',
    )) {
        button.toggleAttribute('disabled', off);
    }
});
