// research/medgaps-1102: the page's own wiring. Every component is the package's; this file fills the medicines table, plays the
// page's refresh and wires each section's controls by that section's own elements, so a section works on any page that shows it.
// The data is mock, in Medicine Cabinet's shapes.

import { dataTable } from '../../js/datatable.js';
import { $, on, say } from './controls.js';

// ---------------------------------------------------------------- 1 · popover-panel (Medicine Cabinet's stock)
const pops = () => /** @type {HTMLElement[]} */ ([...document.querySelectorAll('#pg-stock [data-pg-stock-pop]')]);
/** Reopen the popover that was open, so a changed look shows at once. @param {() => void} change */
function restyle(change) {
    const open = pops().find((pop) => pop.matches(':popover-open'));
    change();
    if (open && !open.matches(':popover-open')) open.showPopover();
}
on('stock-look', (value) => restyle(() => pops().forEach((pop) => pop.classList.toggle('kp-popover--panel', value === 'panel'))));
on('stock-edge', (value) => restyle(() => pops().forEach((pop) => pop.classList.toggle('kp-popover--end', value === 'end'))));
on('stock-open', (value) => {
    const pop = $(`pg-stock-pop-${value}`);
    // After the press: a press outside an open auto popover closes it, so it opens on the next frame.
    if (pop) requestAnimationFrame(() => (pop.matches(':popover-open') ? undefined : pop.showPopover()));
});
for (const pop of pops()) {
    pop.addEventListener('toggle', (event) => {
        if (/** @type {ToggleEvent} */ (event).newState === 'open') pop.querySelector('input')?.select();
    });
}
document.addEventListener('submit', (event) => {
    const form = event.target instanceof HTMLFormElement && event.target.matches('[data-pg-stock-form]') ? event.target : null;
    if (!form) return;
    event.preventDefault();
    const packs = Number(new FormData(form).get('packs'));
    const name = form.querySelector('.pg-stock__title')?.textContent?.replace('Add stock to ', '') ?? '';
    say('pg-stock-log', `${packs} ${packs === 1 ? 'pack' : 'packs'} added to ${name}`);
    form.closest('[popover]')?.hidePopover();
});

// ---------------------------------------------------------------- 2 · keep-focused-row (Medicine Cabinet's medicines)
/** The page's data: what the server would answer. Stock is saved when a field is left (change). */
const MEDS = [
    { key: 'ibuprofen', name: 'Ibuprofen 400 mg', taken: 1, stock: 12 },
    { key: 'paracetamol', name: 'Paracetamol 500 mg', taken: 2, stock: 30 },
    { key: 'vitamin-d', name: 'Vitamin D 25 µg', taken: 1, stock: 5 },
    { key: 'cetirizine', name: 'Cetirizine 10 mg', taken: 0, stock: 14 },
    { key: 'omeprazole', name: 'Omeprazole 20 mg', taken: 1, stock: 28 },
];
const LABELS = ['Medicine', 'Taken today', 'Stock, tablets'];
let refreshes = 0;

/** One fresh row, as the page draws it from the data. @param {typeof MEDS[number]} med */
function medRow(med) {
    const tr = document.createElement('tr');
    tr.dataset.kpRowKey = med.key;
    const cells = [document.createTextNode(med.name), document.createTextNode(String(med.taken)), stockField(med)];
    cells.forEach((content, i) => {
        const td = document.createElement('td');
        td.dataset.label = LABELS[i];
        if (i > 0) td.className = 'kp-numeric';
        if (i === 2) td.dataset.kpSortValue = String(med.stock);
        td.append(content);
        tr.append(td);
    });
    return tr;
}

/** @param {typeof MEDS[number]} med */
function stockField(med) {
    const input = document.createElement('input');
    Object.assign(input, { className: 'kp-field__input pg-meds__stock', type: 'number', min: '0', step: '1', value: String(med.stock) });
    input.setAttribute('aria-label', `Stock of ${med.name}`);
    input.addEventListener('change', () => {
        med.stock = Math.max(0, Number(input.value) || 0);
        say('pg-meds-log', `Saved: ${med.name}, ${med.stock} tablets`);
    });
    return input;
}

/** The page's refresh: fresh data (one more taken somewhere), fresh rows in the body; the table follows the body by itself. */
function refresh() {
    refreshes += 1;
    MEDS[refreshes % MEDS.length].taken += 1;
    $('pg-meds')?.querySelector('tbody')?.replaceChildren(...MEDS.map(medRow));
}

const table = $('pg-meds');
table?.querySelector('tbody')?.replaceChildren(...MEDS.map(medRow));
table?.addEventListener('kp-datatable-row-kept', (event) => {
    const { key } = /** @type {CustomEvent<{ key: string }>} */ (event).detail;
    say('pg-meds-log', `Refresh ${refreshes}: ${MEDS.find((m) => m.key === key)?.name ?? key} kept while you type; the other rows are fresh`);
});
/** @type {ReturnType<typeof setInterval> | undefined} */
let timer;
on('meds-refresh', (value) => {
    clearInterval(timer);
    timer = undefined;
    if (value !== 'live') return say('pg-meds-log', `Refresh paused after ${refreshes} ${refreshes === 1 ? 'refresh' : 'refreshes'}`);
    timer = setInterval(() => {
        refresh();
        const kept = document.activeElement?.closest?.('#pg-meds tbody tr');
        if (!kept) say('pg-meds-log', `Refresh ${refreshes}: every row is fresh`);
    }, 3000);
    say('pg-meds-log', 'Refresh runs every 3 s');
});
on('meds-keep', (value) => table?.toggleAttribute('data-kp-keep-focused-row', value === 'on'));
// The table sorts by medicine first, as Medicine Cabinet's does.
requestAnimationFrame(() => (table ? dataTable(table)?.sortBy([{ column: 0, direction: 'ascending' }]) : undefined));
