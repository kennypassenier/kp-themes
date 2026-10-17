// research/kpadopt4 (recipes sections) · 5, the checklist (mock data; the list is js/checklist.js).
import { byId, say } from './recipes-kit.js';
import {
    CHECKLIST_CLEAR_EVENT,
    CHECKLIST_EVENT,
    CHECKLIST_UNDO_EVENT,
    attachChecklists,
    setChecklistItems,
    setChecklistState,
} from '../../js/checklist.js';

const SAMPLE = [
    { id: 'chicken', label: 'Chicken thighs', detail: '600 g', group: 'Colruyt' },
    { id: 'rice', label: 'Basmati rice', detail: '1 kg', group: 'Colruyt' },
    { id: 'milk', label: 'Milk', detail: '2 l', group: 'Colruyt' },
    { id: 'butter', label: 'Butter', detail: '250 g', group: 'Colruyt', checked: true },
    { id: 'paprika', label: 'Red paprika', detail: '3 pieces', group: 'Colruyt' },
    { id: 'stock', label: 'Vegetable stock cubes, the low-salt ones in the green box', detail: '1 box', group: 'Colruyt' },
    { id: 'bread', label: 'Spelt bread, sliced', detail: '1', group: 'Bakery', checked: true },
    { id: 'croissant', label: 'Croissants', detail: '4', group: 'Bakery' },
    { id: 'coriander', label: 'Coriander', detail: '1 bunch', group: 'Market' },
    { id: 'lime', label: 'Limes', detail: '2', group: 'Market' },
];
const PACKING = [
    { id: 'knife', label: 'Sharp knife', group: 'Kitchen bag', checked: true },
    { id: 'board', label: 'Cutting board', group: 'Kitchen bag' },
    { id: 'spices', label: 'The small spice tin with cumin, paprika and chilli flakes', detail: '1', group: 'Kitchen bag' },
    { id: 'apron', label: 'Apron', group: 'Kitchen bag' },
];

const list = byId('kc-list');
const stay = byId('kc-list-stay');
attachChecklists(byId('checklist'));
setChecklistItems(stay, PACKING);

// deco's loading of this list is a choice in the review dialog (css/deco-register.css reads
// `data-kp-checklist-loading` on the list; no pick is the curtains over the whole list).
document.addEventListener('review:choice', (event) => {
    const { id, value } = /** @type {CustomEvent<{ id: string, value: string }>} */ (event).detail;
    if (id === 'deco-checklist-loading') for (const host of [list, stay]) host.setAttribute('data-kp-checklist-loading', value);
});

const load = () => {
    setChecklistState(list, 'loading');
    setChecklistItems(list, []);
    setTimeout(() => {
        setChecklistItems(list, SAMPLE);
        setChecklistState(list, 'ready');
    }, 2500);
};
load();
byId('kc-list-load').addEventListener('click', load);
byId('kc-list-fail').addEventListener('click', () => {
    setChecklistItems(list, []);
    setChecklistState(list, 'error', 'The list could not be read. Check the connection and press Load again.');
});
byId('kc-list-empty').addEventListener('click', () => {
    setChecklistState(list, 'ready');
    setChecklistItems(list, []);
});
byId('kc-list-reset').addEventListener('click', () => {
    setChecklistState(list, 'ready');
    setChecklistItems(list, SAMPLE);
});

const log = byId('kc-list-log');
const section = byId('checklist');
section.addEventListener(CHECKLIST_EVENT, (event) => {
    const { id, checked, items } = /** @type {CustomEvent} */ (event).detail;
    say(
        log,
        `kp-checklist-change · ${id ?? (checked ? 'Check all' : 'Uncheck all')} → ${checked ? 'ticked' : 'open'} · ${items.filter((/** @type {any} */ i) => i.checked).length} of ${items.length} ticked`,
    );
});
section.addEventListener(CHECKLIST_CLEAR_EVENT, (event) => {
    say(log, `kp-checklist-clear · removed ${/** @type {CustomEvent} */ (event).detail.removed.map((/** @type {any} */ i) => i.id).join(', ')}`);
});
section.addEventListener(CHECKLIST_UNDO_EVENT, (event) => {
    say(log, `kp-checklist-undo · restored ${/** @type {CustomEvent} */ (event).detail.restored.length}`);
});
