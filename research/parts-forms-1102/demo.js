// research/parts-forms-1102: the page's own wiring. Every component is the package's; this file fills the tables, the next times and the
// timeline from data.js and wires each section's controls by that section's own elements, so a section works on any page that shows it.

import { dataTable } from '../../js/datatable.js';
import { setRuns } from '../../js/runs.js';
import { setGanttRuns } from '../../js/gantt.js';
import { openMenu } from '../../js/menu-button.js';
import { $, on, pressed, say, settle } from './controls.js';
import { DELIVERIES, LANES, MEALS, MORE_FAILURES, RUNS, TRIES } from './data.js';

/** One table row from its cells. @param {string} key @param {string[]} cells @param {string[]} labels */
function row(key, cells, labels) {
    const tr = document.createElement('tr');
    tr.dataset.kpRowKey = key;
    cells.forEach((text, i) => {
        const td = document.createElement('td');
        td.dataset.label = labels[i];
        td.textContent = text;
        tr.append(td);
    });
    return tr;
}

// ---------------------------------------------------------------- 1 · the chip filter
const DELIVERY_LABELS = ['Event', 'Status', 'Calendar', 'Sent'];
/** The deliveries as the Rows control asks. @param {string} which */
function fillDeliveries(which) {
    const body = document.querySelector('#pg-deliveries tbody');
    if (!body) return;
    const rows = which === 'more' ? [...DELIVERIES, ...MORE_FAILURES] : DELIVERIES.map((r) => [...r]);
    if (which === 'delivered') rows[2][1] = 'Delivered';
    body.replaceChildren(...rows.map((cells, i) => row(`d${i}`, cells, DELIVERY_LABELS)));
    dataTable(/** @type {HTMLElement} */ ($('pg-deliveries')))?.refresh({ keepPage: true });
}
fillDeliveries('base');
on('delivery-rows', (value) => fillDeliveries(value));
on('delivery-mode', (value) => $('pg-delivery-chips')?.setAttribute('data-kp-segmented', value));

// ---------------------------------------------------------------- 2 · the add row
const MEAL_LABELS = ['Dish', 'Meal', 'Portions', 'Actions'];
/** One meal row: keyed by its id, named by its dish (data-kp-row-label), the portions editable. @param {(string | number)[]} meal */
function mealRow([key, dish, meal, portions]) {
    const tr = row(String(key), [String(dish), String(meal), String(portions), ''], MEAL_LABELS);
    tr.dataset.kpRowLabel = String(dish);
    tr.cells[3].innerHTML = '<span class="kp-text-muted">Today</span>';
    return tr;
}
const mealBody = document.querySelector('#pg-meals tbody');
mealBody?.replaceChildren(...MEALS.map(mealRow));
document.getElementById('pg-meals')?.addEventListener('kp-datatable-edit', (event) => {
    const d = /** @type {CustomEvent} */ (event).detail;
    say('pg-meal-log', `kp-datatable-edit: row ${d.key.slice(0, 8)}…, “${d.previous}” → “${d.value}”. The line under the table names the dish.`);
});
/** The page's answer after a short wait, as a server would. @param {unknown} answer */
const later = (answer) => new Promise((done) => setTimeout(() => done(answer), 700));
document.getElementById('pg-meal-add')?.addEventListener('kp-addrow-add', (event) => {
    const d = /** @type {CustomEvent} */ (event).detail;
    const refuses = pressed('meal-answer', 'add-row-component', 'adds') === 'refuses';
    d.waitUntil(later(refuses ? `You already logged ${d.values.dish} for ${String(d.values.meal).toLowerCase()}.` : null));
});
document.getElementById('pg-meal-add')?.addEventListener('kp-addrow-added', (event) => {
    const v = /** @type {CustomEvent} */ (event).detail.values;
    mealBody?.prepend(mealRow([crypto.randomUUID(), v.dish, v.meal, v.portions]));
    say('pg-meal-log', `kp-addrow-added: ${v.dish}, ${v.meal}, ${v.portions}.`);
});
on('meal-answer', (value) => say('pg-meal-log', value === 'refuses' ? 'The page refuses the next line you add.' : 'The page takes the next line you add.'));
document.getElementById('pg-form-add')?.addEventListener('kp-addrow-add', (event) => {
    const d = /** @type {CustomEvent} */ (event).detail;
    const refuses = pressed('meal-answer', 'add-row-component', 'adds') === 'refuses';
    d.waitUntil(later(refuses ? `A form called ${d.values.name} already exists.` : null));
});
document.getElementById('pg-form-add')?.addEventListener('kp-addrow-added', (event) => {
    const v = /** @type {CustomEvent} */ (event).detail.values;
    const tag = document.createElement('li');
    tag.className = 'kp-tag';
    tag.textContent = `${v.name} · ${v.unit}`;
    $('pg-forms-list')?.append(tag);
});

// ---------------------------------------------------------------- 3 · the unsaved bar's tracked values
document.getElementById('pg-med-bar')?.addEventListener('kp-unsaved-leave', (event) => {
    /** @type {CustomEvent} */ (event).detail.route((/** @type {string} */ href) => say('pg-med-log', `The app’s router took ${new URL(href).search} (the page did not load); your changes are still here.`));
});
document.getElementById('pg-med-leave')?.addEventListener('click', (event) => {
    // Without changes the link is the page's own: here it only says so.
    if (!event.defaultPrevented) {
        event.preventDefault();
        say('pg-med-log', 'No unsaved changes: the link went its way.');
    }
});

// ---------------------------------------------------------------- 4 · a chip's menu and rename
const cats = /** @type {HTMLElement | null} */ (document.getElementById('pg-cats'));
cats?.addEventListener('kp-segmented-rename', (event) => {
    const d = /** @type {CustomEvent} */ (event).detail;
    const refuses = pressed('cat-answer', 'segmented-menu-component', 'accepts') === 'refuses';
    d.waitUntil(later(refuses ? `A category called ${d.label} already exists.` : null));
});
cats?.addEventListener('kp-segmented-renamed', (event) => say('pg-cats-log', `kp-segmented-renamed: ${/** @type {CustomEvent} */ (event).detail.label}.`));
cats?.addEventListener('kp-menu-select', (event) => {
    const value = String(/** @type {CustomEvent} */ (event).detail?.value ?? '');
    if (value === 'delete') say('pg-cats-log', 'Picked Delete (the app’s own entry; the page would ask and act).');
});
/** Put the chip menu section in a state: the second chip's menu open, it renaming, or its refusal. @param {string} state */
async function catState(state) {
    const item = /** @type {HTMLElement | null} */ (cats?.querySelector('[data-value="pain"]') ?? null);
    const wrapper = /** @type {HTMLElement | null} */ (item?.nextElementSibling ?? null);
    const field = cats?.querySelector('.kp-segmented__rename');
    if (field instanceof HTMLInputElement) field.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    await settle();
    if (!item || !wrapper) return;
    if (state === 'menu') openMenu(wrapper, { focus: 'first' });
    if (state === 'rename' || state === 'refused') {
        item.focus();
        item.dispatchEvent(new KeyboardEvent('keydown', { key: 'F2', bubbles: true }));
    }
    if (state === 'refused') {
        await settle();
        const open = cats?.querySelector('.kp-segmented__rename');
        if (!(open instanceof HTMLInputElement)) return;
        open.value = 'Fever';
        document.querySelector('[data-pg="cat-answer"][data-value="refuses"]')?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
        open.focus();
        open.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    }
}
on('cat-state', (value) => void catState(value));
on('cat-answer', (value) => say('pg-cats-log', value === 'refuses' ? 'The page refuses the next name you save.' : 'The page takes the next name you save.'));

// ---------------------------------------------------------------- 5 · run notes and tries left
/** The next tries and the timeline, with or without notes and marks. @param {boolean} notes */
function fillRetries(notes) {
    const runsEl = document.getElementById('pg-runs');
    if (runsEl) setRuns(runsEl, TRIES.map((t) => (notes ? t : { at: t.at })));
    const gantt = document.getElementById('pg-gantt');
    if (!gantt) return;
    const now = Date.now();
    const runs = RUNS.map(([lane, label, from, to, state], i) => ({ id: `r${i}`, lane: String(lane), label: String(label), start: now - Number(from) * 60e3, end: now - Number(to) * 60e3, state: String(state) }));
    setGanttRuns(gantt, runs, LANES.map((l) => (notes ? l : { id: l.id, label: l.label })));
}
/** Wait until the package has attached the list and the timeline, then fill them. */
async function startRetries() {
    for (let i = 0; i < 60 && !document.querySelector('#pg-gantt .kp-gantt__body'); i += 1) await settle();
    fillRetries(true);
}
void startRetries();
on('run-notes', (value) => fillRetries(value === 'on'));
