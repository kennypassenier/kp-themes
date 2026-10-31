// Page descriptor for the "row-editor" documentation page [AR19]; the shape is pinned in ./types.mjs.

/**
 * The three cells of one dose slot: a time, the days it runs on and how many to take. `name` keeps the time field's name unique.
 * @param {string} name @param {string} time @param {string} days @param {number} dose
 */
const cells = (name, time, days, dose) => `<div class="kp-rows__cell" data-label="Time"><div class="kp-time" data-kp-time data-kp-name="${name}" data-kp-value="${time}" data-kp-label="Time" data-kp-time-step="5"></div></div>
<div class="kp-rows__cell" data-label="Days"><div class="kp-weekdays" data-kp-weekdays data-kp-value="${days}" data-kp-presets="false" data-kp-summary="false" aria-label="Days"></div></div>
<div class="kp-rows__cell" data-label="Dose"><div class="kp-quantity" data-kp-quantity data-kp-quantity-fill data-kp-quantity-min="1" data-kp-quantity-max="10" data-kp-quantity-unit="tablets" data-kp-quantity-unit-one="tablet" data-kp-quantity-label="Dose"><input class="kp-quantity__input" value="${dose}" /></div></div>`;

/** @type {import('./types.mjs').Descriptor} */
export const rowEditorDescriptor = {
    id: 'row-editor',
    title: 'Row editor',
    group: 'Forms',
    classes: ['kp-rows'],
    exports: [],
    // `data-kp-rows` itself is also the grid layout's row count and the dated options' kept height, so the bare name is shared; the
    // longer names are this page's alone.
    aliases: ['rows', 'rows-min', 'rows-max', 'rows-unit', 'rows-attach', 'rows-list', 'rows-template', 'rows-add', 'rows-remove', 'rows-empty', 'rows-written'],
    intro: 'Rows of controls that a person adds and removes: the times a medicine is taken, each with its days and its dose. `data-kp-rows` on a `.kp-rows`; js/row-editor.js (`attachRowEditors`, and `js/auto.js` attaches it on its own) copies a `<template data-kp-rows-template>` for every new row and attaches the package’s controls inside it. The labels stand once, in a head row over the columns; every row is a subgrid of the same tracks, so the times, the days and the doses of all rows line up, and the remove button is the last cell. Under 40rem of its own width the head goes and each cell carries its own label: every row is a card.',
    whenToUse:
        'For a small, ordered set of similar entries that belong to one thing and are edited together, on its form: dose slots, reminder times, phone numbers. For a list of independent things that are saved one by one, use list rows or a data table.',
    examples: [
        {
            title: 'When to take it: one to six times, each with its days and dose',
            why: 'The markup holds the rows, the template and nothing else: the module writes the head row from the first row’s `data-label`s, a remove button in each row, the add button (“Add a time”, from `data-kp-rows-unit="time,times"`) and the line under the rows. At the fewest rows (`data-kp-rows-min="1"`) removing is off and the line says why; at the most (`data-kp-rows-max="6"`) adding is. `{n}` in the template is a number that is never reused, so the names stay unique. `kp-rows-change` tells the page `{ count, rows }` after every add or remove; the values are read from each row’s own controls. The column tracks are a knob: this page sets the time and dose columns a little narrower than their default, so the editor fits a phone inside the page’s own margins.',
            markup: `
<h3 class="kp-card__title" id="doc-when-title">When to take it</h3>
<p class="kp-text-muted">Ibuprofen 400 mg. Each slot is a time, the days it runs on and how many to take.</p>
<div class="kp-rows" id="doc-rows" data-kp-rows data-kp-rows-min="1" data-kp-rows-max="6" data-kp-rows-unit="time,times" style="--kp-rows-tracks: minmax(7rem, 1fr) minmax(0, 3fr) minmax(9rem, 1.2fr) auto" aria-labelledby="doc-when-title">
<ol class="kp-rows__list" data-kp-rows-list>
<li class="kp-rows__row">
${cells('at-a', '08:00', '1,2,3,4,5', 1)}
</li>
<li class="kp-rows__row">
${cells('at-b', '20:00', '0,1,2,3,4,5,6', 2)}
</li>
</ol>
<template data-kp-rows-template><li class="kp-rows__row">
${cells('at-{n}', '12:00', '0,1,2,3,4,5,6', 1)}
</li></template>
</div>
<p class="kp-text-muted" id="doc-rows-said" role="status">2 times a day.</p>
`,
            script: `
const editor = document.getElementById('doc-rows');
const said = document.getElementById('doc-rows-said');
editor.addEventListener('kp-rows-change', (event) => {
    const { count } = event.detail;
    said.textContent = count + (count === 1 ? ' time' : ' times') + ' a day.';
});
`,
        },
        {
            title: 'Starting empty, and driven from the page',
            why: 'With no row held and `data-kp-rows-min` left at 0, the editor shows the package’s empty plate in the room of three rows, and the head row goes. `addEditorRow(host)` adds a row as the add button does (and returns null at the most), `removeEditorRow(host, row)` removes one (nothing happens at the fewest), and `editorRowsOf(host)` gives the rows in order. A new row takes the focus; a removed row hands it to the row now in its place, else to the add button.',
            markup: `
<section class="kp-card" aria-labelledby="doc-reminder-title">
<div class="kp-card__header"><h3 class="kp-card__title" id="doc-reminder-title">Refill reminders</h3></div>
<div class="kp-rows" id="doc-reminders" data-kp-rows data-kp-rows-max="3" data-kp-rows-unit="reminder,reminders" style="--kp-rows-tracks: minmax(8rem, 1fr) minmax(0, 2fr) auto" aria-label="Refill reminders">
<ol class="kp-rows__list" data-kp-rows-list></ol>
<template data-kp-rows-template><li class="kp-rows__row">
<div class="kp-rows__cell" data-label="Time"><div class="kp-time" data-kp-time data-kp-name="remind-{n}" data-kp-value="18:00" data-kp-label="Time" data-kp-time-step="15"></div></div>
<div class="kp-rows__cell" data-label="Days"><div class="kp-weekdays" data-kp-weekdays data-kp-value="6" data-kp-presets="false" data-kp-summary="false" aria-label="Days"></div></div>
</li></template>
</div>
<div class="kp-row kp-gap-sm">
<button type="button" class="kp-button kp-button--sm" id="doc-reminders-add">Add one from the page</button>
<button type="button" class="kp-button kp-button--sm" id="doc-reminders-drop">Remove the last</button>
</div>
<p class="kp-text-muted" id="doc-reminders-said" role="status">No reminders.</p>
</section>
`,
            script: `
import { addEditorRow, editorRowsOf, removeEditorRow } from '@kp-soft/themes/js/row-editor';

const host = document.getElementById('doc-reminders');
const said = document.getElementById('doc-reminders-said');
const tell = () => {
    const count = editorRowsOf(host).length;
    said.textContent = count === 0 ? 'No reminders.' : count + ' of 3 reminders.';
};
document.getElementById('doc-reminders-add').addEventListener('click', () => {
    if (!addEditorRow(host)) said.textContent = 'Three is the most: remove one first.';
});
document.getElementById('doc-reminders-drop').addEventListener('click', () => {
    const rows = editorRowsOf(host);
    if (rows.length > 0) removeEditorRow(host, rows[rows.length - 1]);
});
host.addEventListener('kp-rows-change', tell);
`,
        },
    ],
    variants: [
        { name: 'data-kp-rows', what: 'On the host: makes it a row editor. Options, each with a default, are switchable at runtime: `data-kp-rows-min` (the fewest rows, 0), `data-kp-rows-max` (the most, none) and `data-kp-rows-unit` (the unit’s two words, “time,times”; the dictionary’s “row,rows” otherwise).' },
        { name: 'data-kp-rows-attach="none"', what: 'The page attaches the controls of a new row itself; by default the module attaches every package control in it, as the page’s boot did for the first rows.' },
        { name: 'data-kp-rows-list / -template', what: 'The `ol.kp-rows__list` that holds the rows (written when left out) and the `template` a new row is copied from; `{n}` in it is replaced by a number that is never reused.' },
        { name: 'data-kp-rows-add / -remove', what: 'The add button and a row’s remove button. Leave them out and the module writes them; a button of your own keeps its words (one left empty gets the dictionary’s, marked `data-kp-rows-written`). At a bound the button is `aria-disabled` and stays in the tab order.' },
        { name: 'data-kp-rows-empty', what: 'Written on the host while it holds no row: the head goes and the empty plate (`.kp-rows__empty`, the package’s state plate) holds the room of three rows.' },
        { name: '.kp-rows__head / __label', what: 'The labels once over the columns, written from the first row’s (or the template’s) `data-label`s; hidden from a screen reader, which hears each control’s own name.' },
        { name: '.kp-rows__row / __cell', what: 'One row, a subgrid of the editor’s tracks, and one cell; `data-label` on a cell is its label in the head and, as a card, above the cell.' },
        { name: '.kp-rows__remove', what: 'The remove button, last in the row: a square “×” named after its unit and place, “Remove time 2”.' },
        { name: '.kp-rows__status', what: 'The line under the rows: why adding or removing is off at a bound, and empty otherwise.' },
        { name: 'kp-rows-add / kp-rows-remove / kp-rows-change', what: 'Events on the host, bubbling: the first two with `{ row, index, count }`, then `kp-rows-change` with `{ count, rows }` after either.' },
        { name: 'addEditorRow / removeEditorRow / editorRowsOf', what: 'The calls behind the buttons: add a row (the new row, or null at the most), remove a row (nothing at the fewest), and the rows in order.' },
        { name: 'as cards', what: 'Under 40rem of the editor’s own width: no head row, each row a bordered card, each cell under its own label, the remove button at the end of the card.' },
    ],
    accessibility: [
        'Built in — every remove button is named after its unit and place (“Remove time 2”), and a hidden status line says “Added time 3. 3 in all.” or “Removed time 2. 1 left.” as it happens.',
        'Built in — a new row takes the focus on its first control; a removed row hands it to the row now in its place, else to the add button, so the focus never falls to the page.',
        'Built in — a button at a bound is `aria-disabled` with the reason in the line under the rows, so it can still be reached and its reason read.',
        'Yours — name the editor (`aria-label` or a heading it is labelled by), and give each control in the template a label of its own: the head row is hidden from screen readers.',
    ],
};
