// Page descriptor for the "list" documentation page [AR19]; the shape is pinned in ./types.mjs.

/**
 * One row of the cabinet example: a medicine, its badges, its stock and whether it is active.
 * @param {string} name @param {string} meta @param {string} badges @param {string} unit @param {string} unitOne @param {number} stock @param {boolean} active
 */
const row = (name, meta, badges, unit, unitOne, stock, active) => `<li class="kp-listrow${active ? '' : ' kp-listrow--muted'}">
<div class="kp-listrow__identity"><strong class="kp-listrow__name">${name}</strong><span class="kp-listrow__meta">${meta}</span></div>
<div class="kp-listrow__status">${badges ? `<div class="kp-badges">${badges}</div>` : ''}</div>
<div class="kp-listrow__stepper"><div class="kp-quantity" data-kp-quantity data-kp-quantity-fill data-kp-quantity-min="0" data-kp-quantity-max="200" data-kp-quantity-unit="${unit}" data-kp-quantity-unit-one="${unitOne}" data-kp-quantity-label="Stock of ${name}"><input class="kp-quantity__input" value="${stock}" /></div></div>
<div class="kp-listrow__switch"><label class="kp-switch" data-kp-switch-state="none"><input class="kp-switch__input" type="checkbox" role="switch"${active ? ' checked' : ''} aria-label="Active: ${name}" /><span>Active</span></label></div>
</li>`;

/** @type {import('./types.mjs').Descriptor} */
export const listDescriptor = {
    id: 'list',
    title: 'List rows',
    group: 'Data',
    classes: ['kp-list', 'kp-listrow'],
    exports: [],
    intro: 'A list of things that each carry a few controls: a name with a line under it, a status that can hold several badges, a stepper and a switch. It is not a table: `.kp-list` is one grid of four named columns (identity, status, stepper, switch) and every `.kp-listrow` is a subgrid of it, so the four parts of every row stand on the same four edges whatever each holds. A row without a status leaves its column empty. Under 40rem of the list’s own width each row is a card: the identity and the status on full lines, the stepper filling the line beside the switch. It is pure CSS; the controls inside are the package’s own.',
    whenToUse:
        'For a short list of things a person manages in place: the medicines in a cabinet with their stock, the rooms of a house with a switch each. When the rows are data to sort, filter or compare, use the data table; when a row only opens a page, a plain link list is enough.',
    examples: [
        {
            title: 'The cabinet: badges, a stock stepper and an active switch per row',
            why: 'Every stepper fills its column (`data-kp-quantity-fill`), so the minus and plus of all rows stand on one edge; the badges of a status wrap as a `.kp-badges` run; the switch carries no state word (`data-kp-switch-state="none"`), the row says it. Turning a medicine off adds `.kp-listrow--muted`, which quiets the name and the status and leaves the controls as they are. Narrow the window under 40rem and each row becomes a card.',
            markup: `
<section class="kp-card" aria-labelledby="doc-cabinet-title">
<div class="kp-card__header"><h3 class="kp-card__title" id="doc-cabinet-title">Cabinet</h3></div>
<p class="kp-card__body">Everything in the cabinet, with what is left of it.</p>
<ul class="kp-list" id="doc-cabinet" role="list" aria-label="Medicines">
${row('Ibuprofen 400 mg', 'Film-coated tablet · pain and fever', '<span class="kp-badge kp-badge--warning">Low stock</span><span class="kp-badge">Expires 03/2027</span>', 'tablets', 'tablet', 14, true)}
${row('Paracetamol 500 mg', 'Tablet · pain and fever', '<span class="kp-badge kp-badge--success">In stock</span>', 'tablets', 'tablet', 32, true)}
${row('Vitamin D3 25 µg', 'Capsule · supplement', '<span class="kp-badge">On schedule</span><span class="kp-badge kp-badge--warning">Expires 11/2026</span><span class="kp-badge">Refill on 12/11</span>', 'capsules', 'capsule', 60, true)}
${row('Saline nasal spray', 'Spray · congestion', '', 'bottles', 'bottle', 1, true)}
${row('Amoxicillin 500 mg', 'Capsule · course finished', '<span class="kp-badge">Inactive</span>', 'capsules', 'capsule', 0, false)}
</ul>
<p class="kp-text-muted" id="doc-cabinet-said" role="status">Nothing changed yet.</p>
</section>
`,
            script: `
const list = document.getElementById('doc-cabinet');
const said = document.getElementById('doc-cabinet-said');
const nameOf = (el) => el.closest('.kp-listrow').querySelector('.kp-listrow__name').textContent;

list.addEventListener('kp-quantity-change', (event) => {
    said.textContent = nameOf(event.target) + ': ' + event.detail.value + ' left.';
});
list.addEventListener('change', (event) => {
    if (!event.target.matches('.kp-switch__input')) return;
    const row = event.target.closest('.kp-listrow');
    row.classList.toggle('kp-listrow--muted', !event.target.checked);
    said.textContent = nameOf(row) + (event.target.checked ? ' is active again.' : ' is off: it leaves Today and the refill list.');
});
`,
        },
        {
            title: 'In a card that loads, is empty or fails',
            why: 'Loading, empty and failed belong to the card: put the list in the card’s data (`.kp-card__stage` › `.kp-card__data`) and `setCardState` lays the state over the footprint the rows had, so nothing on the page jumps when they arrive.',
            markup: `
<div class="kp-row kp-gap-sm" role="group" aria-label="State of the list">
<button type="button" class="kp-button kp-button--sm" data-doc-list-state="loading">Loading</button>
<button type="button" class="kp-button kp-button--sm" data-doc-list-state="empty">Empty</button>
<button type="button" class="kp-button kp-button--sm" data-doc-list-state="error">Failed</button>
<button type="button" class="kp-button kp-button--sm" data-doc-list-state="ready">Ready</button>
</div>
<section class="kp-card" id="doc-list-card" data-kp-state="ready" aria-labelledby="doc-list-card-title">
<div class="kp-card__header"><h3 class="kp-card__title" id="doc-list-card-title">Running low</h3></div>
<div class="kp-card__stage">
<div class="kp-card__data">
<ul class="kp-list" role="list" aria-label="Running low">
${row('Cetirizine 10 mg', 'Tablet · hay fever', '<span class="kp-badge kp-badge--warning">Low stock</span><span class="kp-badge">Take as needed</span>', 'tablets', 'tablet', 8, true)}
${row('Omeprazole 20 mg', 'Capsule · stomach', '<span class="kp-badge kp-badge--warning">Low stock</span>', 'capsules', 'capsule', 4, true)}
</ul>
</div>
</div>
</section>
`,
            script: `
import { setCardState } from '@kp-soft/themes/js/card-state';

const card = document.getElementById('doc-list-card');
const STATES = {
    loading: () => setCardState(card, 'loading'),
    empty: () => setCardState(card, 'empty', { title: 'Nothing is running low', text: 'A medicine shows here when its stock covers less than a week.' }),
    error: () => setCardState(card, 'error', { title: 'Could not read the cabinet', text: 'The server did not answer.' }),
    ready: () => setCardState(card, 'ready'),
};
for (const button of document.querySelectorAll('[data-doc-list-state]')) {
    button.addEventListener('click', () => STATES[button.dataset.docListState]());
}
`,
        },
    ],
    variants: [
        { name: '.kp-list', what: 'The list: a `ul` of four named column tracks on the card ground, with a boundary and the theme’s corner. It measures its own width, so a list in a side panel is cards while one beside it is rows.' },
        { name: '.kp-listrow', what: 'One row, a subgrid of the list; rows are divided by a hairline.' },
        { name: '.kp-listrow__identity, __name, __meta', what: 'The identity column: the name in a strong line and the quiet line under it (form, what it is for). Long words wrap rather than push the columns.' },
        { name: '.kp-listrow__status', what: 'The status column; it holds a badge or a `.kp-badges` run. Left empty, the column stays and the card leaves out its line.' },
        { name: '.kp-listrow__stepper', what: 'The stepper column, for a `.kp-quantity` with `data-kp-quantity-fill`, which then fills it so every row’s minus and plus line up.' },
        { name: '.kp-listrow__switch', what: 'The switch at the end edge; in a card it shares the stepper’s line and wraps under it when the line is too short for both.' },
        { name: '.kp-listrow--muted', what: 'A row that is off (an inactive medicine): the name and the status are quieted, the controls keep their look so they still read as usable.' },
        { name: 'as cards', what: 'Under 40rem of the list’s own width: the identity and the status each on a full line, the stepper and the switch on the line under them.' },
        { name: 'loading, empty, failed', what: 'The card’s own states (`.kp-card[data-kp-state]`, js/card-state.js) over the list in its data, holding the list’s footprint.' },
    ],
    accessibility: [
        'Built in — the reading order is the row order: name, status, stepper, switch, in the markup as on the screen, in rows and in cards.',
        'Built in — the muted look dims only the words; the switch, not the opacity, says that the row is off.',
        'Yours — `role="list"` on the `ul` (a styled list loses its list role in some browsers) and an `aria-label` that names it.',
        'Yours — name every control after its row: “Stock of Ibuprofen 400 mg”, “Active: Ibuprofen 400 mg”, so a screen reader that jumps between controls knows which row it is in.',
    ],
};
