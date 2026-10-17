// research/kpadopt6-social: the sample data of the page and the buttons of its controls. Everything that is shown is the package's own
// module; this file only fills the components, answers the demo's buttons and plays the parts a server would play.
import { getChecklistItems, setChecklistItems, setChecklistState } from '../../js/checklist.js';
import { setClaim, setClaimPeople, setClaimViewer } from '../../js/claim.js';

/** @param {string} sel @param {ParentNode} [root] @returns {HTMLElement | null} */
const $ = (sel, root = document) => /** @type {HTMLElement | null} */ (root.querySelector(sel));
/** @param {string} sel @param {ParentNode} [root] @returns {HTMLElement[]} */
const $$ = (sel, root = document) => /** @type {HTMLElement[]} */ ([...root.querySelectorAll(sel)]);

/** Press one button of a group: it is on, its siblings are off. @param {HTMLElement} button */
function pick(button) {
    const group = button.closest('[role="group"]');
    if (!group) return;
    for (const b of group.querySelectorAll('button[aria-pressed]')) b.setAttribute('aria-pressed', String(b === button));
}

/** Run once the package's own boot (js/auto.js) has attached everything the page carries. @param {() => void} run */
function onReady(run) {
    const root = document.documentElement;
    if (root.hasAttribute('data-kp-auto-ready')) return run();
    new MutationObserver((_, obs) => {
        if (!root.hasAttribute('data-kp-auto-ready')) return;
        obs.disconnect();
        run();
    }).observe(root, { attributes: true });
}

/** @param {number} ms */
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// ---------------------------------------------------------------- claim-row (a packing list)

const KENNY = { id: 'kenny', name: 'Kenny' };
const TOM = { id: 'tom', name: 'Tom' };
const ANNA = { id: 'anna', name: 'Anna' };
const BO = { id: 'bo', name: 'Bo Vandenbroucke-Lemmens' };
const PEOPLE = [KENNY, TOM, ANNA, BO];

/** @returns {import('../../js/checklist.js').ChecklistItem[]} */
const packing = () => [
    { id: 'stove', label: 'Gas stove', detail: '1', group: 'Kitchen', claim: { by: [] } },
    { id: 'pots', label: 'Two pots and a frying pan', detail: '3', group: 'Kitchen', claim: { by: [ANNA, TOM] } },
    { id: 'coffee', label: 'Coffee, filters and the little dripper for the mornings in the tent', detail: '1 kg', group: 'Kitchen', claim: { by: [BO] } },
    { id: 'water', label: 'Water cans', detail: '2 x 10 l', group: 'Kitchen', claim: { by: [] } },
    { id: 'tent', label: 'Tent', detail: '1', group: 'Sleeping', claim: { by: [] } },
    { id: 'mats', label: 'Sleeping mats', detail: '4', group: 'Sleeping', claim: { by: [KENNY] } },
    { id: 'lamp', label: 'Lantern', detail: '1', group: 'Sleeping', claim: { by: [TOM] } },
    { id: 'van', label: 'Roof box on the van', detail: '1', group: 'Sleeping', claim: { by: [TOM], locked: 'Already on the van' } },
    { id: 'aid', label: 'First-aid kit', detail: '1', group: 'Safety', claim: { by: [] } },
    { id: 'map', label: 'Paper maps of the Ardennes', detail: '2', group: 'Safety', claim: { by: [ANNA] } },
    { id: 'fire', label: 'Fire extinguisher', detail: '1', group: 'Safety', claim: { by: [] } },
];

const chores = () => [
    { id: 'cook', label: 'Cook on Friday', group: 'Chores', claim: { by: [ANNA] } },
    { id: 'dishes', label: 'Do the dishes', group: 'Chores', claim: { by: [] } },
    { id: 'fire', label: 'Keep the fire going', group: 'Chores', claim: { by: [TOM, BO] } },
    { id: 'drive', label: 'Drive home on Sunday', group: 'Chores', claim: { by: [] } },
];

const lists = {
    main: $('#k6-claim'),
    phone: $('#k6-claim-phone'),
    quiet: $('#k6-claim-quiet'),
    top: $('#k6-claim-top'),
    assign: $('#k6-claim-assign'),
};
/** What every list holds, so a push and a state button reach them all. */
const everyList = () => Object.values(lists).filter(Boolean);
const readout = $('[data-k6-claim-readout]');
let closed = false;

/** The pretend server: answers after a short wait; the Tent was taken first by Tom; the closed trip refuses everything. */
function server(/** @type {CustomEvent} */ event) {
    const d = event.detail;
    if (typeof d.settle !== 'function') return;
    if (readout) readout.textContent = `${d.action} ${d.id || 'all open items'}: ${d.by.map((/** @type {{name: string}} */ p) => p.name).join(', ') || 'nobody'}`;
    d.settle(
        (async () => {
            await wait(700);
            if (closed) return { refused: true, error: 'The trip is closed; nothing can change.' };
            if (d.action === 'join' && d.id === 'tent') return { refused: true, by: [TOM] };
            return true;
        })(),
    );
}
for (const list of everyList()) list.addEventListener('kp-claim-change', /** @type {EventListener} */ (server));
$('#k6-claim')?.addEventListener('kp-claim-retry', () => {
    const list = $('#k6-claim');
    if (!list) return;
    setChecklistState(list, 'loading');
    setTimeout(() => {
        setChecklistItems(list, packing());
        setChecklistState(list, 'ready');
        pickState('ready');
    }, 1200);
});

/** @param {string} value */
function pickState(value) {
    const b = $(`[data-k6-claim-state="${value}"]`);
    if (b) pick(b);
}

onReady(() => {
    for (const list of everyList()) {
        setClaimPeople(list, PEOPLE);
        setChecklistItems(list, list === lists.assign ? chores() : packing());
    }
    if (lists.quiet) setChecklistItems(lists.quiet, packing().filter((i) => i.group === 'Kitchen'));
    if (lists.top) setChecklistItems(lists.top, packing().filter((i) => i.group === 'Sleeping'));
    // The phone list shows the whole packing list; the three small ones show a group each.
    for (const button of $$('[data-k6-claim-state]')) {
        button.addEventListener('click', () => {
            pick(button);
            const state = button.getAttribute('data-k6-claim-state') ?? 'ready';
            for (const list of [lists.main, lists.phone]) {
                if (!list) continue;
                if (state === 'empty') {
                    setChecklistItems(list, []);
                    setChecklistState(list, 'ready');
                } else if (state === 'ready') {
                    setChecklistItems(list, packing());
                    setChecklistState(list, 'ready');
                } else if (state === 'error') setChecklistState(list, 'error', 'The packing list could not be read.');
                else setChecklistState(list, 'loading');
            }
        });
    }
    for (const button of $$('[data-k6-claim-viewer]')) {
        button.addEventListener('click', () => {
            pick(button);
            const who = button.getAttribute('data-k6-claim-viewer');
            closed = who === 'locked';
            for (const list of everyList()) {
                setClaimViewer(list, who === 'kenny' || who === 'locked' ? KENNY : null);
                if (who === 'locked') {
                    list.setAttribute('data-kp-claim-disabled', '');
                    list.setAttribute('data-kp-claim-disabled-reason', 'The trip is closed; nothing can change.');
                } else list.removeAttribute('data-kp-claim-disabled');
            }
        });
    }
    $('[data-k6-claim-push]')?.addEventListener('click', () => {
        for (const list of everyList()) {
            const first = getChecklistItems(list).find((i) => !i.claim?.by?.length && !i.claim?.locked);
            if (first) setClaim(list, first.id, { by: [ANNA] });
        }
        if (readout) readout.textContent = 'Anna took the first free item (a push update, no event).';
    });
});
