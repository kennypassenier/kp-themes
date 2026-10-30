// Page descriptor for the "claim" documentation page [AR19]; the shape is pinned in ./types.mjs.

/** @type {import('./types.mjs').Descriptor} */
export const claimDescriptor = {
        id: 'claim',
        title: 'Who brings it',
        group: 'Data',
        classes: ['kp-claim'],
        exports: [],
        intro: 'A claim on every row of a checklist: who brings the item (their mark and name, several people allowed) or, when nobody does, a loud gap, with one button that takes the item or lets go.',
        whenToUse: 'A packing list, a chore list or a potluck where each item needs a person. For a list that is only ticked off use the plain checklist.',
        examples: [
            {
                title: 'A packing list: who brings what',
                why: '`data-kp-checklist-claim` turns a checklist into a claim list. The page says who is looking (`setClaimViewer`; the module reads no session) and gives the items with their `claim`; each row shows the people who bring it, their mark and name, or the loud gap “Nobody yet” (a glyph and words, never colour alone), and one button: “I’ll bring it”, or while you are one of them “I’m bringing it” (pressed; a press lets go, behind Undo). The page answers the cancelable `kp-claim-change` with `detail.settle(promise)`: the button shows the spinner and the row waits. Here the pretend server takes 700 ms, and the Tent was taken by Tom a moment before you: the row goes back to what the server says, its edge flashes and a polite line says so. `setClaim(list, id, claim)` is a push update (try Anna takes the Stove).',
                markup: `
<div class="kp-checklist" id="doc-claim" data-kp-checklist data-kp-checklist-claim data-kp-claim-viewer="kenny" data-kp-claim-viewer-name="Kenny" aria-label="Packing list"></div>
<p class="kp-text-muted" id="doc-claim-said" role="status">Nobody has pressed anything yet.</p>
<button type="button" class="kp-button kp-button--sm" id="doc-claim-push">Anna takes the stove</button>
`,
                script: `
import { attachClaims, setClaim, setClaimViewer } from '@kp-soft/themes/js/claim';
import { attachChecklists, setChecklistItems } from '@kp-soft/themes/js/checklist';

const KENNY = { id: 'kenny', name: 'Kenny' };
const ANNA = { id: 'anna', name: 'Anna' };
const TOM = { id: 'tom', name: 'Tom' };
const list = document.getElementById('doc-claim');
attachChecklists(list.parentElement);
attachClaims(list.parentElement);
setClaimViewer(list, KENNY);
setChecklistItems(list, [
    { id: 'tent', label: 'Four-person tent', detail: '1', group: 'Sleeping', claim: { by: [] } },
    { id: 'mats', label: 'Sleeping mats', detail: '4', group: 'Sleeping', claim: { by: [ANNA] } },
    { id: 'stove', label: 'Gas stove', detail: '1', group: 'Kitchen', claim: { by: [] } },
    { id: 'pans', label: 'Pans and plates', group: 'Kitchen', claim: { by: [TOM, ANNA] } },
    { id: 'aid', label: 'First-aid kit', detail: '1', group: 'Safety', claim: { by: [], locked: 'Already packed in the van' } },
]);
const said = document.getElementById('doc-claim-said');
list.addEventListener('kp-claim-change', (event) => {
    const detail = event.detail;
    said.textContent = detail.action + ' ' + detail.id + ': ' + (detail.by.map((person) => person.name).join(', ') || 'nobody') + '.';
    detail.settle(new Promise((resolve) => {
        setTimeout(() => resolve(detail.action === 'join' && detail.id === 'tent' ? { refused: true, by: [TOM] } : true), 700);
    }));
});
document.getElementById('doc-claim-push').addEventListener('click', () => {
    setClaim(list, 'stove', { by: [ANNA] });
});
`,
            },
            {
                title: 'Choosing who: assign mode, filters and the bar',
                why: '`data-kp-claim-mode="assign"` puts a person menu on each row in place of the button (`setClaimPeople` gives the people); `data-kp-claim-max` caps how many may bring one item, here two. `data-kp-claim-person` is `both`, `name` or `idmark`; `data-kp-claim-count` puts the count in the `bar`, per `group`, `both` or `none`; `data-kp-claim-gap="quiet"` draws a gap without the loud edge and `data-kp-claim-gap-sort="top"` sorts the rows nobody takes first in their group. `data-kp-claim-take-all` adds “Take every open item” behind Undo and `data-kp-claim-copy` “Copy the open list”. The bar’s chips (all, open, mine) are a `.kp-segmented--chips`, and `data-kp-claim-filter="false"` hides them.',
                markup: `
<div class="kp-checklist" id="doc-claim-assign" data-kp-checklist data-kp-checklist-claim data-kp-claim-mode="assign" data-kp-claim-max="2" data-kp-claim-gap="quiet" data-kp-claim-gap-sort="top" data-kp-claim-person="name" data-kp-claim-count="bar" data-kp-claim-take-all data-kp-claim-copy aria-label="Chores for the weekend"></div>
`,
                script: `
import { attachClaims, setClaimPeople, setClaimViewer } from '@kp-soft/themes/js/claim';
import { attachChecklists, setChecklistItems } from '@kp-soft/themes/js/checklist';

const ANNA = { id: 'anna', name: 'Anna' };
const TOM = { id: 'tom', name: 'Tom' };
const BO = { id: 'bo', name: 'Bo' };
const list = document.getElementById('doc-claim-assign');
attachChecklists(list.parentElement);
attachClaims(list.parentElement);
setClaimPeople(list, [ANNA, TOM, BO, { id: 'kenny', name: 'Kenny' }]);
setClaimViewer(list, { id: 'kenny', name: 'Kenny' });
setChecklistItems(list, [
    { id: 'cook', label: 'Cook on Friday', group: 'Chores', claim: { by: [ANNA] } },
    { id: 'dishes', label: 'Do the dishes', group: 'Chores', claim: { by: [] } },
    { id: 'fire', label: 'Keep the fire going', group: 'Chores', claim: { by: [TOM, BO] } },
    { id: 'drive', label: 'Drive home on Sunday', group: 'Chores', claim: { by: [] } },
]);
list.addEventListener('kp-claim-change', (event) => event.detail.settle(Promise.resolve(true)));
`,
            },
            {
                title: 'Loading and failed lists, with a Retry',
                why: 'A failed claim list says why centred in its box with a normal-size Retry (not a strip across the box); Retry fires `kp-claim-retry`, which the page answers by loading again. `data-kp-claim-disabled` with `data-kp-claim-disabled-reason` makes every press say why it does nothing; `data-kp-remember="claim-filter"` keeps the chip across visits.',
                markup: `
<div class="kp-checklist" id="doc-claim-failed" data-kp-checklist data-kp-checklist-claim data-kp-claim-viewer="kenny" data-kp-claim-viewer-name="Kenny" aria-label="Packing list, failed"></div>
`,
                script: `
import { attachClaims } from '@kp-soft/themes/js/claim';
import { attachChecklists, setChecklistItems, setChecklistState } from '@kp-soft/themes/js/checklist';

const list = document.getElementById('doc-claim-failed');
attachChecklists(list.parentElement);
attachClaims(list.parentElement);
const fail = () => {
    setChecklistItems(list, []);
    setChecklistState(list, 'error', 'The packing list could not be read. Check the connection and try again.');
};
fail();
list.addEventListener('kp-claim-retry', () => {
    setChecklistState(list, 'loading');
    setTimeout(() => {
        setChecklistItems(list, [
            { id: 'tent', label: 'Four-person tent', group: 'Sleeping', claim: { by: [] } },
            { id: 'stove', label: 'Gas stove', group: 'Kitchen', claim: { by: [{ id: 'anna', name: 'Anna' }] } },
        ]);
        setChecklistState(list, 'ready');
    }, 1200);
});
`,
            },
        ],
        variants: [
            { name: 'data-kp-claim-filter', what: '`all` (default), `gaps` or `mine`: the chip that is on; `false` hides the chips. `claimFilter` and `setClaimFilter` read and set it; `kp-claim-filter` reports a change.' },
            { name: 'data-kp-claim-undo-ms', what: 'How long Undo is offered after letting go (6000; 0 for none).' },
            { name: 'data-kp-claim-self-label', what: 'The words of the take face of the button, in place of the dictionary’s.' },
            { name: 'data-kp-claim-keys', what: '`false` turns the keys off (`c` on a focused row takes or lets go, Shift C goes to the gaps).' },
            { name: 'data-kp-claim-copy', what: 'Present: “Copy the open list” in the bar.' },
            { name: 'data-kp-claim-disabled', what: 'Present: nobody can press; `data-kp-claim-disabled-reason` says why under the button.' },
            { name: 'data-kp-claim-viewer', what: 'Who is looking, when the page writes it in the markup (`data-kp-claim-viewer-name` is the name); else `setClaimViewer`.' },
            { name: 'setClaim / setClaimPeople', what: '`setClaim(list, id, claim)` is a push update, another person took it while the page was open; `setClaimPeople(list, people)` gives the menu of assign mode its people.' },
            { name: 'data-kp-claim-mode', what: '`claim` (default, a button on each row) or `assign` (a person menu).' },
            { name: 'data-kp-claim-gap', what: '`loud` (default) or `quiet`.' },
            { name: 'data-kp-claim-gap-sort', what: '`keep` (default) or `top`.' },
            { name: 'data-kp-claim-person', what: '`both` (default), `name` or `idmark`.' },
            { name: 'data-kp-claim-max', what: 'How many people may bring one item (0, no cap).' },
            { name: 'data-kp-claim-count', what: '`both` (default), `bar`, `group` or `none`.' },
            { name: 'data-kp-claim-take-all', what: 'Adds Take every open item, behind Undo.' },
            { name: 'data-kp-claim-face', what: 'Which face the button shows: `take`, `held` or `busy` (set by the module).' },
        ],
        accessibility: [
            'Built in — the gap is a glyph and words, never colour alone; the people are a named group; the button is pressed when you bring it; a change and a refusal are announced politely.',
            'Yours — answer `kp-claim-change` with `detail.settle(promise)`, and say who is looking with `setClaimViewer`.',
        ],
    };
