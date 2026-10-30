// Page descriptor for the "undo" documentation page [AR19]; the shape is pinned in ./types.mjs.

/** @type {import('./types.mjs').Descriptor} */
export const undoDescriptor = {
        id: 'undo',
        title: 'Undo toast',
        group: 'Feedback',
        classes: ['kp-undo'],
        exports: [],
        aliases: ['undo'],
        intro: 'A toast with Undo and a visible clock. After an action it says what happened and offers Undo for a few seconds, instead of asking “are you sure?” before. In the default mode nothing reaches the server until the window closes, so Undo only has to put the rows back.',
        whenToUse: 'An action that is easy to take back: deleting rows, discarding a draft. For an action that cannot be undone, ask first with the confirm button.',
        examples: [
            {
                title: 'Three schedules deleted',
                why: 'The `commit` runs when the window closes; `undo` runs on Undo.',
                markup: `
<button class="kp-button" type="button" id="undo-demo">Delete 3 schedules</button>
`,
                script: `
import { undoToast } from '@kp-soft/themes/js/undo-toast';

document.getElementById('undo-demo').addEventListener('click', () => {
    undoToast('3 schedules deleted', { commit: () => {}, undo: () => {} });
});
`,
            },
            {
                title: 'The three clocks, a reverse and a failure',
                why: 'The ring is the default; `clock: \'bar\'` drains a rule under the words; `clock: \'text\'` says the seconds. `mode: \'revert\'` is for an action already done: nothing is deferred and Undo calls the page’s reverse. When a commit rejects, the toast turns into “Not done: why” and the row comes back (`restore`, which is `undo` by default).',
                markup: `
<div class="kp-row kp-gap-sm">
<button type="button" class="kp-button" data-doc-undo="ring">Ring</button>
<button type="button" class="kp-button" data-doc-undo="bar">Bar, ten seconds</button>
<button type="button" class="kp-button" data-doc-undo="revert">Text, already done</button>
<button type="button" class="kp-button" data-doc-undo="failed">A commit that fails</button>
</div>
`,
                script: `
import { undoToast } from '@kp-soft/themes/js/undo-toast';

const shows = {
    ring: () => undoToast('Schedule deleted', { commit: () => {}, undo: () => {} }),
    bar: () => undoToast('2 backups removed', { clock: 'bar', ms: 10000, commit: () => {}, undo: () => {} }),
    revert: () => undoToast('Snapshot restored', { mode: 'revert', clock: 'text', undo: () => {} }),
    failed: () => undoToast('Volume removed', { ms: 1500, commit: () => Promise.reject(new Error('The volume is in use')), undo: () => {} }),
};
for (const button of document.querySelectorAll('[data-doc-undo]')) {
    button.addEventListener('click', () => shows[button.dataset.docUndo]());
}
`,
            },
        ],
        variants: [
            { name: '.kp-toast--undo', what: 'The toast’s own class (`UNDO_TOAST`), on the ordinary toast of js/overlays.js. It carries `data-kp-undo-state` (counting, committing, failed, undone, done) and `data-kp-paused` while the pointer or the focus holds it.' },
            { name: '.kp-undo / __text / __ringbox / __ring / __secs / __clock', what: 'The parts inside it: the words, the box of the ring (a track and a fill that drains over the window), the seconds left in words and the plain clock of `text`.' },
            { name: 'UNDO_RESTORED_MS / UNDO_MAX', what: 'How long “Restored” stays after Undo (1500 ms) and how many toasts stand at once (3), the defaults behind `max`.' },
            { name: 'ms', what: 'How long Undo is offered; 6000, 0 commits at once.' },
            { name: 'mode', what: '`defer` (default: the action waits) or `revert` (the action is done; Undo calls the page’s reverse).' },
            { name: 'clock', what: '`ring` (default), `bar`, `text` or `none`; also `data-kp-undo-clock`.' },
            { name: 'key', what: 'The key that undoes the newest toast; Mod+Z, `false` for none; never while typing in a field.' },
            { name: 'leave', what: 'What a pending action does when the page is left: `carry` (default), `commit` or `cancel`.' },
            { name: 'max', what: 'How many toasts stand at once; 3. The oldest is committed when a newer one pushes it out.' },
            { name: 'states', what: 'Counting, committing, failed (“Not done: why”, the row comes back), undone, done.' },
        ],
        accessibility: [
            'Built in — the clock stops while the pointer or the focus is on the toast; the seconds left are said in words once, not on every tick; Esc or the close accepts the action now; the clock steps once a second under reduced motion.',
            'Yours — make `undo` really restore, and make `commit` return a rejection with a reason when it fails.',
        ],
    };
