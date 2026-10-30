// Page descriptor for the "card" documentation page [AR19]; the shape is pinned in ./types.mjs.

/** @type {import('./types.mjs').Descriptor} */
export const cardDescriptor = {
        id: 'card',
        title: 'Card',
        group: 'Structure',
        classes: ['kp-card'],
        exports: ['Card'],
        intro: 'A raised surface with its own ground and ink: a title, a body, and optional slots for a header row, its actions and a footer. A raised surface is never darker than the one below it.',
        whenToUse:
            'To group what belongs together and to separate one record from the next in a grid or a list. Not as a box around everything — a page of cards inside cards has no hierarchy left — and not as a button: a card that is entirely clickable hides where the target is.',
        examples: [
            {
                title: 'Title and body',
                why: 'The smallest useful card. The body takes the quiet ink, which is what makes the title the title without a size change.',
                markup: `
<div class="kp-card">
<h3 class="kp-card__title">Example Inc</h3>
<p class="kp-card__body">Applied on 4 September; interview on the eleventh.</p>
</div>
`,
            },
            {
                title: 'With a header row, actions and a footer',
                why: 'The header lays the title and its controls on one baseline; the footer is separated by a rule rather than by distance alone, so it still reads as a footer in a dense list.',
                markup: `
<div class="kp-card">
<div class="kp-card__header">
<h3 class="kp-card__title">Example Inc</h3>
<div class="kp-card__actions">
<button type="button" class="kp-button kp-button--ghost">Edit</button>
<button type="button" class="kp-button">Open</button>
</div>
</div>
<p class="kp-card__body">Applied on 4 September; interview on the eleventh.</p>
<div class="kp-card__footer"><span class="kp-timestamp">Updated 2026-09-06 14:07</span></div>
</div>
`,
            },
            {
                title: 'A card that waits',
                why: 'A card whose body is still on its way carries `aria-busy="true"` until it has arrived. Every card in pastel has a thumbtack at its top centre; a waiting one also becomes caterpillar, a head on its top-end corner and legs along its foot.',
                markup: `
<article class="kp-card" aria-busy="true">
<h3 class="kp-card__title">Pump house 3</h3>
<p class="kp-card__body">Reading the pressure from the field unit…</p>
</article>
`,
            },
            {
                title: 'One card in four data states',
                why: 'A card that shows data read from somewhere has a `data-kp-state` of `loading`, `empty`, `error` or `ready`, and keeps its place and size in all of them: `.kp-card__stage` holds `.kp-card__data` and, over it in the same cell, the state’s note `.kp-card__state`. Loading lays the data table’s own loading card over the stage (the words come from `data-kp-loading-words` or `words`) and dims the data, which stays readable and inert. Empty is the package’s empty state with a title, a sentence and an optional action; error is the destructive alert with Try again, which fires `kp-card-retry` and which the page answers. `setCardState(card, state, { words, title, text, action, retry })` is the way in, and `attachCardStates` wires the retry button and follows `data-kp-state` for a framework that writes it. Try the four buttons.',
                markup: `
<div class="kp-stack">
<div class="kp-row kp-gap-sm" role="group" aria-label="State of the card">
<button type="button" class="kp-button kp-button--sm" data-doc-card-state="loading">Loading</button>
<button type="button" class="kp-button kp-button--sm" data-doc-card-state="empty">Empty</button>
<button type="button" class="kp-button kp-button--sm" data-doc-card-state="error">Failed</button>
<button type="button" class="kp-button kp-button--sm" data-doc-card-state="ready">Filled</button>
</div>
<section class="kp-card" data-kp-state="ready" data-kp-loading-words="Reading the appointments" aria-labelledby="doc-card-title" data-doc-card>
<div class="kp-card__header">
<h3 class="kp-card__title" id="doc-card-title">Appointments</h3>
</div>
<p class="kp-card__body">Everything planned for this application.</p>
<div class="kp-card__stage">
<div class="kp-card__data">
<ul class="kp-stack">
<li>21/10/2026 14:00 · Second interview</li>
<li>28/10/2026 09:30 · Technical assessment</li>
<li>04/11/2026 11:00 · Meet the team</li>
</ul>
</div>
</div>
</section>
</div>
`,
                script: `
import { attachCardStates, setCardState } from '@kp-soft/themes/js/card-state';

const card = document.querySelector('[data-doc-card]');
attachCardStates(card.parentElement);

const add = document.createElement('button');
add.type = 'button';
add.className = 'kp-button kp-button--sm kp-button--primary';
add.textContent = 'Add an appointment';

const show = {
    loading: () => setCardState(card, 'loading'),
    empty: () => setCardState(card, 'empty', { title: 'No appointments yet', text: 'Plan the first one and it shows here.', action: add }),
    error: () => setCardState(card, 'error', { title: 'Could not list the appointments', text: 'The calendar did not answer.' }),
    ready: () => setCardState(card, 'ready'),
};
for (const button of document.querySelectorAll('[data-doc-card-state]')) {
    button.addEventListener('click', () => show[button.dataset.docCardState]());
}
card.addEventListener('kp-card-retry', () => {
    setCardState(card, 'loading');
    setTimeout(() => setCardState(card, 'ready'), 1500);
});
`,
            },
            {
                title: 'A card in each data state',
                why: 'A card that shows data read from somewhere has `data-kp-state`: `loading` (the theme’s busy card over the stage), `empty` (the empty plate), `error` or `ready`. A failed card shows a state plate: centred, at the heading size, filling the stage and growing the card while it is failed, with a Try again at the control size that fires `kp-card-retry`. `setCardState(card, state, { title, text, action, words, retry })` is the way in for a page that draws with the script; a framework that writes the attribute follows with `attachCardStates`.',
                markup: `
<div class="kp-stack kp-gap-md" id="doc-card-states">
<section class="kp-card" data-kp-state="loading" aria-labelledby="doc-card-l"><div class="kp-card__header"><h3 class="kp-card__title" id="doc-card-l">Files</h3></div><p class="kp-card__body">Everything in this application’s folder.</p><div class="kp-card__stage"><div class="kp-card__data"><p>12 files</p></div></div></section>
<section class="kp-card" data-kp-state="empty" aria-labelledby="doc-card-e"><div class="kp-card__header"><h3 class="kp-card__title" id="doc-card-e">Appointments</h3></div><p class="kp-card__body">Interviews and calls.</p><div class="kp-card__stage"><div class="kp-card__data"></div></div></section>
<section class="kp-card" data-kp-state="error" aria-labelledby="doc-card-f"><div class="kp-card__header"><h3 class="kp-card__title" id="doc-card-f">Backups</h3></div><p class="kp-card__body">The last run of every volume.</p><div class="kp-card__stage"><div class="kp-card__data"><p>31 volumes</p></div></div></section>
</div>
`,
                script: `
import { attachCardStates, setCardState } from '@kp-soft/themes/js/card-state';

const grid = document.getElementById('doc-card-states');
attachCardStates(grid);
const [loading, empty, failed] = grid.querySelectorAll('.kp-card');
setCardState(loading, 'loading', { words: 'Reading the folder…' });
setCardState(empty, 'empty', { title: 'No appointments yet', text: 'Add the first one.' });
setCardState(failed, 'error', { title: 'Could not read the backups', text: 'The host did not answer.' });
failed.addEventListener('kp-card-retry', () => setCardState(failed, 'ready'));
`,
            },
        ],
        variants: [
            { name: 'data-kp-state', what: '`loading`, `empty`, `error` or `ready` on a `.kp-card`, over a `.kp-card__stage` that holds the data (`.kp-card__data`) and, in the same cell, the state’s note (`.kp-card__state`), so a state never moves the header, the footer or the card beside it. Empty and failed keep the data’s room.' },
            { name: '.kp-card__failure', what: 'A failed card’s note is a state plate: centred, at the heading size (`.kp-card__failure` holds the destructive alert, `.kp-card__retry` its Try again at the control size), filling the stage; the card grows while it is failed. The note’s other parts are `.kp-card__state-title`, `.kp-card__state-text` and `.kp-card__state-actions`.' },
            { name: 'setCardState / attachCardStates', what: '`setCardState(card, state, options)` (js/card-state.js) writes the attribute and draws the note, keeping the options for later changes written by a framework; `attachCardStates(root)` syncs every card with a `data-kp-state` and turns a press on Try again into `kp-card-retry`. `CARD_STATES` lists the four states; `kp-card-state` fires on every change.' },
            { name: '.kp-card', what: 'The surface: the card ground, a boundary, a rounded corner, and in one theme a hard shadow the knob paints and every other theme leaves at nothing.' },
            { name: '.kp-card__title', what: 'The heading, at body size — a card is not a page and its title is not a display line.' },
            { name: '.kp-card__body', what: 'The text, in quiet ink.' },
            { name: '.kp-card__header', what: 'A row that lays the title and its actions on one baseline and pushes them apart.' },
            { name: '.kp-card__actions', what: 'The controls in that row, spaced by the scale.' },
            { name: '.kp-card__footer', what: 'A closing row, separated by a rule and the scale’s own distance.' },
            { name: 'pastel: the thumbtack', what: 'In pastel every card is fixed to the page with a thumbtack at its top centre. A card that leaves loses its tack first, then lifts off as its landing backwards, and its space folds after the tack is out; one put back arrives as that backwards, the tack pushed in last.' },
            { name: 'data-kp-state', what: '`loading`, `empty`, `error` or `ready` on a card with a stage: the card keeps its header, footer and size, and only the stage changes. In `empty` and `error` the data keeps its room, hidden rather than removed, so a failed refresh of a full card does not collapse it.' },
            { name: '.kp-card__stage, __data, __state', what: 'The stage holds the data and, in the same grid cell over it, the note of the state; `.kp-card__state` is made by the module (`data-kp-card-built`) unless the page draws its own inside it.' },
            { name: '.kp-card__empty, __failure, __state-title, __state-text, __state-actions', what: 'The empty state, the destructive alert, and the note’s first line, sentence and action.' },
            { name: '.kp-card__retry', what: 'Try again, in an error note; a press fires `kp-card-retry` on the card. `retry: false` leaves it out of a read the page cannot repeat.' },
            { name: '.kp-card__busy', what: 'The data table’s loading card laid over the stage while loading; the first loading card is there from the first frame and does not arrive.' },
            { name: '[aria-busy="true"]', what: 'A card waiting for its content. In pastel it becomes caterpillar: a head on its top-end corner and legs along its foot that step in turn (js/loading-pieces.js). Other themes draw nothing extra.' },
            { name: 'setCardState(card, "empty" | "error", { title, text, art })', what: '`art` is a node (an inline SVG) or a glyph. The empty note is the state plate with its title at the heading size and Try again is a normal-size button.' },
        ],
        accessibility: [
            'Built in — the card ground and its ink are a measured pair, so text on a card clears the contrast floor in every theme.',
            'Yours — use a real heading for the title if the card is a section of the page rather than one of many equal records.',
            'Yours — put the link or the button inside the card rather than making the whole card clickable.',
            'Yours — keep the reading order the source order; a card that reads bottom to top on a screen reader is a card laid out with the visual only in mind.',
        ],
    };
