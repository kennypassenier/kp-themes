// research/kpadopt4-recipes · 5, the checklist (mock data; the list is js/checklist.js).
import { byId, say } from './kit.js';
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

const list = byId('k4-list');
const stay = byId('k4-list-stay');
attachChecklists(byId('checklist'));
setChecklistItems(stay, PACKING);

const load = () => {
    setChecklistState(list, 'loading');
    setChecklistItems(list, []);
    setTimeout(() => {
        setChecklistItems(list, SAMPLE);
        setChecklistState(list, 'ready');
    }, 2500);
};
load();
byId('k4-list-load').addEventListener('click', load);
byId('k4-list-fail').addEventListener('click', () => {
    setChecklistItems(list, []);
    setChecklistState(list, 'error', 'The list could not be read. Check the connection and press Load again.');
});
byId('k4-list-empty').addEventListener('click', () => {
    setChecklistState(list, 'ready');
    setChecklistItems(list, []);
});
byId('k4-list-reset').addEventListener('click', () => {
    setChecklistState(list, 'ready');
    setChecklistItems(list, SAMPLE);
});

const log = byId('k4-list-log');
const section = byId('checklist');
section.addEventListener(CHECKLIST_EVENT, (event) => {
    const { id, checked, items } = /** @type {CustomEvent} */ (event).detail;
    say(
        log,
        `kp-checklist-change · ${id ?? 'Check all'} → ${checked ? 'ticked' : 'open'} · ${items.filter((/** @type {any} */ i) => i.checked).length} of ${items.length} ticked`,
    );
});
section.addEventListener(CHECKLIST_CLEAR_EVENT, (event) => {
    say(log, `kp-checklist-clear · removed ${/** @type {CustomEvent} */ (event).detail.removed.map((/** @type {any} */ i) => i.id).join(', ')}`);
});
section.addEventListener(CHECKLIST_UNDO_EVENT, (event) => {
    say(log, `kp-checklist-undo · restored ${/** @type {CustomEvent} */ (event).detail.restored.length}`);
});
