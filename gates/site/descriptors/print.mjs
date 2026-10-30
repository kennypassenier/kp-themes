// Page descriptor for the "print" documentation page [AR19]; the shape is pinned in ./types.mjs.

/** @type {import('./types.mjs').Descriptor} */
export const printDescriptor = {
        id: 'print',
        title: 'Printing a list',
        group: 'Content',
        classes: [],
        aliases: ['print'],
        exports: [],
        intro: 'Ctrl+P on a page with a checklist gives a clean black-and-white sheet: drawn square boxes a pen can tick, no buttons, menus, colour or decoration, groups that stay with their first items, and the date of printing at the foot. Every theme prints the same: paper has no theme.',
        whenToUse: 'A packing list, a shopping list, a checklist that someone will carry about on paper.',
        examples: [
            {
                title: 'A list and a Print button',
                why: 'The rules are only for paper; a button is optional because Ctrl+P already works.',
                markup: `
<div class="kp-checklist" data-kp-checklist data-kp-print-title="Packing list" aria-label="Packing list"></div>
<button class="kp-button" data-kp-print-action>Print this list</button>
`,
            },
            {
                title: 'A packing list with groups, ticks and handwriting room',
                why: 'The page shows the list as usual; Ctrl+P (or the button) gives the sheet. `data-kp-print-done` says what a ticked item becomes on paper (`show` a filled box with a tick, `hide`, or `strike`), `data-kp-print-box="round"` draws round boxes, `data-kp-print-groups="columns"` sets a long list in two columns while group headings stay with their first items, `data-kp-print-notes-lines` adds a dotted line under each item for notes, `data-kp-print-notes="hide"` drops the detail line, and `data-kp-print-links="url"` prints the address after a link. `data-kp-print="exclude"` drops a part of the page from the sheet, `include` keeps one that would be dropped.',
                markup: `
<div class="kp-stack">
<div class="kp-checklist" id="doc-print-list" data-kp-checklist data-kp-print-title="Packing list, Rome" data-kp-print-done="strike" data-kp-print-box="round" data-kp-print-groups="columns" data-kp-print-notes-lines data-kp-print-links="url" aria-label="Packing list"></div>
<div class="kp-row"><button class="kp-button kp-button--primary" type="button" data-kp-print-action>Print this list</button><span class="kp-text-muted" data-kp-print="exclude">This line is left off the sheet.</span></div>
</div>
`,
                script: `
import { setChecklistItems } from '@kp-soft/themes/js/checklist';

setChecklistItems(document.getElementById('doc-print-list'), [
    { id: 'passport', label: 'Passport', detail: 'valid until 2029', group: 'Papers', checked: true },
    { id: 'tickets', label: 'Train tickets', detail: 'print them', group: 'Papers' },
    { id: 'hotel', label: 'Hotel booking', group: 'Papers' },
    { id: 'charger', label: 'Phone charger', group: 'Bag', checked: true },
    { id: 'adapter', label: 'Plug adapter', detail: 'type L', group: 'Bag' },
    { id: 'umbrella', label: 'Umbrella', group: 'Bag' },
]);
`,
            },
            {
                title: 'A list that is not a checklist, and a word before the sheet',
                why: '`data-kp-print-sheet` marks a list that is not a checklist but should get the sheet’s title, its state sentence (a list that is still loading or failed prints its sentence, never a blank sheet) and the date of printing. `kp-print-prepare` fires on the document just before the sheet is built, with `{ sheets }`, so the page can last-minute change what goes on paper; `preparePrint(document)` does the same work by hand and returns what undoes it.',
                markup: `
<section id="doc-print-sheet" data-kp-print-sheet data-kp-print-title="Opening hours" data-kp-print-date="off" aria-label="Opening hours">
<h3 class="kp-fw-semibold">Opening hours</h3>
<ul>
<li>Monday to Friday, 09:00 to 17:30</li>
<li>Saturday, 10:00 to 14:00</li>
<li>Sunday, closed</li>
</ul>
</section>
<p class="kp-text-muted" id="doc-print-log" aria-live="polite">Press Ctrl+P: the sheet is built, and this line is told.</p>
`,
                script: `
document.addEventListener('kp-print-prepare', (event) => {
    document.getElementById('doc-print-log').textContent = 'Preparing ' + event.detail.sheets.length + ' sheet(s) for the printer.';
});
`,
            },
        ],
        variants: [
            { name: 'data-kp-print', what: '`include` or `exclude`: a part the sheet keeps or drops. Navigation, menus, buttons and toasts are dropped by default.' },
            { name: 'data-kp-print-done', what: '`show` (default: a filled box with a tick, the text kept), `hide` or `strike`.' },
            { name: 'data-kp-print-box', what: '`square` (default) or `round`.' },
            { name: 'data-kp-print-groups', what: '`keep` (default) or `columns`: two columns for a long list.' },
            { name: 'data-kp-print-title', what: 'A title, or `auto`: the page\'s first heading.' },
            { name: 'data-kp-print-date', what: '`on` (default) or `off`: "Printed dd/mm/yyyy HH:MM" at the foot.' },
            { name: 'data-kp-print-notes', what: '`show` (default) or `hide`: the detail line of an item.' },
            { name: 'data-kp-print-notes-lines', what: 'Present: a dotted line under each item for handwritten notes.' },
            { name: 'data-kp-print-links', what: '`none` (default inside a checklist) or `url`: the address after a link.' },
            { name: 'data-kp-print-action', what: 'On a button: pressing it prints the page.' },
            { name: 'data-kp-print-sheet', what: 'Marks a list that is not a checklist but should get the sheet\'s title, state sentence and date.' },
            { name: 'kp-print-prepare', what: 'Fired on the document just before the sheet is built: `{ sheets }`.' },
            { name: '--kp-print-box', what: 'The size of the drawn box on paper: 1.1em, never under 4 mm, so a pen can tick it.' },
        ],
        accessibility: [
            'Built in — a list that is still loading or failed prints its sentence, never a blank sheet; folded groups open for the paper and close again afterwards.',
            'Yours — give the list a name and, where the page has no heading, a title.',
        ],
    };
