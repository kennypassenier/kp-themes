// Page descriptor for the "checklist" documentation page [AR19]; the shape is pinned in ./types.mjs.

/** @type {import('./types.mjs').Descriptor} */
export const checklistDescriptor = {
        id: 'checklist',
        title: 'Checklist',
        group: 'Data',
        classes: ['kp-checklist'],
        exports: [],
        intro: 'A list a person works down, such as a shopping list by shop: every row is a checkbox’s label, a ticked row is struck through and sinks to the end of its group, gliding in the theme’s own time. `data-kp-checklist` on the root; js/checklist.js (`setChecklistItems`, `getChecklistItems`, `setChecklistChecked`, `setChecklistState`, `attachChecklists`) draws the groups, the counts and the bar with Check all, Clear checked and its Undo, and fires `kp-checklist-change`, `kp-checklist-clear` and `kp-checklist-undo` with the whole list, so the page stores it.',
        whenToUse: 'For items a person ticks off and no longer needs to see on top. For a filter use the facet list; for the steps of a running process use the step list.',
        examples: [
            {
                title: 'A shopping list by shop',
                why: 'The module draws the groups, the counts and the bar from the items it is given; the markup is only the root. A ticked row is struck through and glides to the end of its group; ticked with the keyboard, the focus goes to the open item that took its place. Check all, Clear checked and its Undo fire `kp-checklist-change` (`{ id, checked, items }`, id null for all), `kp-checklist-clear` and `kp-checklist-undo` with the whole list, so the page stores it; nothing is stored here. The line under the list prints what the page heard.',
                markup: `
<div class="kp-checklist" id="doc-checklist" data-kp-checklist aria-label="Shopping list"></div>
<p class="kp-text-muted" id="doc-checklist-said" role="status">Nothing ticked yet.</p>
`,
                script: `
import { attachChecklists, setChecklistItems } from '@kp-soft/themes/js/checklist';

const list = document.getElementById('doc-checklist');
attachChecklists(list.parentElement);
setChecklistItems(list, [
    { id: 'chicken', label: 'Chicken thighs', detail: '600 g', group: 'Colruyt' },
    { id: 'rice', label: 'Basmati rice', detail: '1 kg', group: 'Colruyt' },
    { id: 'milk', label: 'Milk', detail: '2 l', group: 'Colruyt' },
    { id: 'butter', label: 'Butter', detail: '250 g', group: 'Colruyt', checked: true },
    { id: 'stock', label: 'Vegetable stock cubes, the low-salt ones in the green box', detail: '1 box', group: 'Colruyt' },
    { id: 'bread', label: 'Spelt bread, sliced', detail: '1', group: 'Bakery', checked: true },
    { id: 'croissant', label: 'Croissants', detail: '4', group: 'Bakery' },
    { id: 'coriander', label: 'Coriander', detail: '1 bunch', group: 'Market' },
]);
const said = document.getElementById('doc-checklist-said');
const open = (items) => items.filter((item) => !item.checked).length + ' still to get.';
list.addEventListener('kp-checklist-change', (event) => {
    said.textContent = (event.detail.id ?? 'Everything') + (event.detail.checked ? ' ticked. ' : ' unticked. ') + open(event.detail.items);
});
list.addEventListener('kp-checklist-clear', (event) => {
    said.textContent = event.detail.removed.length + ' ticked items cleared. ' + open(event.detail.items);
});
list.addEventListener('kp-checklist-undo', (event) => {
    said.textContent = event.detail.restored.length + ' items back. ' + open(event.detail.items);
});
`,
            },
            {
                title: 'A ticked row that stays, an empty list, loading and a failed list',
                why: '`data-kp-checklist-sink="false"` keeps a ticked row where it stands, struck through. `setChecklistState(list, "loading" | "error" | "ready", message)`: loading lays the data table’s busy card over the body, error says the message in the empty line’s place, centred in the box. An empty list says `data-kp-checklist-empty`, else the dictionary’s sentence. `data-kp-checklist-undo-ms` is how long Undo is offered and `data-kp-checklist-heading` the level of the group headings.',
                markup: `
<div class="kp-checklist" id="doc-checklist-stay" data-kp-checklist data-kp-checklist-sink="false" aria-label="Packing list, ticked rows stay"></div>
<div class="kp-checklist" id="doc-checklist-empty" data-kp-checklist data-kp-checklist-empty="Nothing to buy. Add the first item above." aria-label="Empty list"></div>
<div class="kp-checklist" id="doc-checklist-loading" data-kp-checklist aria-label="Loading list"></div>
<div class="kp-checklist" id="doc-checklist-failed" data-kp-checklist aria-label="Failed list"></div>
`,
                script: `
import { attachChecklists, setChecklistItems, setChecklistState } from '@kp-soft/themes/js/checklist';

attachChecklists(document.getElementById('doc-checklist-stay').parentElement);
setChecklistItems(document.getElementById('doc-checklist-stay'), [
    { id: 'knife', label: 'Sharp knife', group: 'Kitchen bag', checked: true },
    { id: 'board', label: 'Cutting board', group: 'Kitchen bag' },
    { id: 'apron', label: 'Apron', group: 'Kitchen bag' },
]);
setChecklistItems(document.getElementById('doc-checklist-empty'), []);
setChecklistItems(document.getElementById('doc-checklist-loading'), []);
setChecklistState(document.getElementById('doc-checklist-loading'), 'loading');
setChecklistItems(document.getElementById('doc-checklist-failed'), []);
setChecklistState(document.getElementById('doc-checklist-failed'), 'error', 'The list could not be read. Check the connection and try again.');
`,
            },
            {
                title: 'Holding its height in a state',
                why: 'Loaded, the component is as high as its rows. Loading, empty or failed it keeps that height as a minimum, so the page under it does not jump twice; the first load has nothing remembered and is left alone. A very tall list holds a screen, not its full length (the cap is set on the host or any ancestor; it is 12 rem here to show it). Press the states.',
                markup: `
<div class="kp-stack kp-gap-md" id="doc-fp-checklist">
<div class="kp-row kp-gap-sm" role="group" aria-label="State">
<button type="button" class="kp-button kp-button--sm" data-doc-state="ready">Ready</button>
<button type="button" class="kp-button kp-button--sm" data-doc-state="loading">Loading</button>
<button type="button" class="kp-button kp-button--sm" data-doc-state="empty">Empty</button>
<button type="button" class="kp-button kp-button--sm" data-doc-state="error">Failed</button>
</div>
<div class="kp-checklist" data-kp-checklist id="doc-fp-checklist-host" aria-label="Shopping list" style="--kp-footprint-max: 12rem"></div>
</div>
`,
                script: `
import { attachChecklists, setChecklistItems, setChecklistState } from '@kp-soft/themes/js/checklist';
const root = document.getElementById('doc-fp-checklist');
const host = document.getElementById('doc-fp-checklist-host');
attachChecklists(root);
const items = ['Milk', 'Bread', 'Eggs', 'Butter', 'Coffee', 'Rice'].map((label, i) => ({ id: 'i' + i, label, group: i < 3 ? 'Colruyt' : 'Bakery' }));
const draw = (state) => {
    if (state === 'ready') { setChecklistItems(host, items); setChecklistState(host, 'ready'); }
    else if (state === 'empty') { setChecklistItems(host, []); setChecklistState(host, 'ready'); }
    else setChecklistState(host, state, 'The list could not be read.');
};
for (const button of root.querySelectorAll('[data-doc-state]')) {
    button.addEventListener('click', () => draw(button.dataset.docState));
}
draw('ready');
`,
            },
        ],
        variants: [
            { name: 'kp-checklist-render', what: 'Fired on the list after every draw (not bubbling), so a part that adds a cell to the rows can draw it; the claim part does.' },
            { name: 'a detail', what: 'A row’s detail (“3 pieces”) wraps inside its row and never widens the list. A checklist with no items writes `data-kp-state="empty"` and shows the empty plate; a failed one shows the failed plate alone; both, like a loading one, hold the height the list had.' },
            { name: 'data-kp-checklist-sink="false"', what: 'A ticked row stays where it is, struck through.' },
            { name: 'data-kp-checklist-undo-ms', what: 'How long Undo is offered after Clear checked (6000).' },
            { name: 'data-kp-checklist-empty', what: 'The sentence of an empty list.' },
            { name: 'data-kp-checklist-heading', what: 'The level of the group headings (3).' },
            { name: 'empty and failed', what: 'The empty line is the state plate (a `div`, no longer a `p`); a failed list has a Retry that fires `kp-checklist-retry` (also `kp-claim-retry` on a claim list).' },
        ],
        accessibility: [
            'Built in — real checkboxes in labels, named by the item and described by its amount; group headings with their counts.',
            'Built in — ticked with the keyboard, the focus goes to the item that took its place; a status region says what moved.',
            'Yours — give the list a name and store what the events say.',
        ],
    };
