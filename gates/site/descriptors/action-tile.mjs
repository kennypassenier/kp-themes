// Page descriptor for the "action-tile" documentation page [AR19]; the shape is pinned in ./types.mjs.

/** @type {import('./types.mjs').Descriptor} */
export const actionTileDescriptor = {
        id: 'action-tile',
        title: 'Action tile',
        group: 'Forms',
        classes: ['kp-actions', 'kp-action'],
        exports: [],
        intro: 'A button or a link drawn as a tile: a title and the one sentence that says what it does, in a grid whose tiles on one row are all as tall as the tallest. A button tile does something, a link tile goes somewhere (its mark is a chevron). The tile has a mark column that is always there, so a spinner arriving moves nothing. js/action-tiles.js (`attachActionTiles`, `setActionBusy`) stops a press on a busy or disabled tile and puts the theme’s own spinner in the mark while `aria-busy="true"`.',
        whenToUse: 'For a short list of things to do or places to go that each need a sentence: a landing page, a drawer, a settings overview. For one action use a button; for a list of records use a table.',
        examples: [
            {
                title: 'A grid of tiles',
                why: 'Buttons and links mix in one grid. Mark a destructive tile with `kp-action--destructive`; its words must say what it does, the bar and the red title only help.',
                markup: `
<div class="kp-actions" role="group" aria-label="System actions">
<button type="button" class="kp-action"><strong class="kp-action__title">Back up now</strong><span class="kp-action__mark" aria-hidden="true"></span><span class="kp-action__text">Copies every volume to the backup disk and checks the copy.</span></button>
<a class="kp-action" href="#host"><strong class="kp-action__title">Host</strong><span class="kp-action__mark" aria-hidden="true"></span><span class="kp-action__text">CPU, memory and disks of the machine underneath.</span></a>
<button type="button" class="kp-action kp-action--destructive"><strong class="kp-action__title">Delete all snapshots</strong><span class="kp-action__mark" aria-hidden="true"></span><span class="kp-action__text">Frees 48 GB. This cannot be undone.</span></button>
<button type="button" class="kp-action" disabled><strong class="kp-action__title">Check for updates</strong><span class="kp-action__mark" aria-hidden="true"></span><span class="kp-action__text">Not while a backup is running.</span></button>
</div>
`,
            },
            {
                title: 'A tile that works for a while',
                why: '`setActionBusy(tile, true)` puts `aria-busy="true"` on the tile, the theme’s spinner in its mark and a hidden “Working…” after its title, and fires `kp-action-busy` with `{ tile, busy }`. While it is busy a press does nothing, not even the page’s own handler. The mark column is always there, so the spinner arriving moves nothing.',
                markup: `
<div class="kp-actions" id="doc-tiles-busy" role="group" aria-label="System actions">
<button type="button" class="kp-action" id="doc-tile-backup"><strong class="kp-action__title">Back up now</strong><span class="kp-action__mark" aria-hidden="true"></span><span class="kp-action__text">Copies every volume to the backup disk. Press it and it is busy for three seconds.</span></button>
<button type="button" class="kp-action kp-action--destructive" aria-busy="true"><strong class="kp-action__title">Delete all snapshots</strong><span class="kp-action__mark" aria-hidden="true"></span><span class="kp-action__text">Always busy here, to show a busy tile of the destructive kind.</span></button>
</div>
`,
                script: `
import { attachActionTiles, setActionBusy } from '@kp-soft/themes/js/action-tiles';

const tiles = document.getElementById('doc-tiles-busy');
attachActionTiles(tiles.parentElement);
document.getElementById('doc-tile-backup').addEventListener('click', (event) => {
    const tile = event.currentTarget;
    setActionBusy(tile, true);
    setTimeout(() => setActionBusy(tile, false), 3000);
});
`,
            },
            {
                title: 'Large tiles',
                why: '`data-kp-action-size="large"` on the board makes every tile large; `compact` makes them small.',
                markup: `
<div class="kp-actions" data-kp-action-size="large" role="group" aria-label="System actions">
<button type="button" class="kp-action"><strong class="kp-action__title">Back up now</strong><span class="kp-action__mark" aria-hidden="true"></span><span class="kp-action__text">Copies every volume to the backup disk and checks the copy.</span></button>
<a class="kp-action" href="#host"><strong class="kp-action__title">Host</strong><span class="kp-action__mark" aria-hidden="true"></span><span class="kp-action__text">CPU, memory and disks of the machine underneath.</span></a>
<button type="button" class="kp-action kp-action--destructive"><strong class="kp-action__title">Delete all snapshots</strong><span class="kp-action__mark" aria-hidden="true"></span><span class="kp-action__text">Frees 48 GB. This cannot be undone.</span></button>
<button type="button" class="kp-action" disabled><strong class="kp-action__title">Check for updates</strong><span class="kp-action__mark" aria-hidden="true"></span><span class="kp-action__text">Not while a backup is running.</span></button>
</div>
`,
            },
        ],
        variants: [
            { name: '.kp-action--destructive', what: 'A start bar, a red-tinted edge and title. The edge goes fully red when pointed at.' },
            { name: 'disabled / aria-disabled="true"', what: 'A quieter plate, no hover, no press; `aria-disabled` also stops a link or a button that must keep its focus.' },
            { name: 'aria-busy="true"', what: 'The spinner appears in the mark, a hidden “Working…” follows the title, and a press does nothing until it is cleared. `setActionBusy(tile, true)` sets it and fires `kp-action-busy`.' },
            { name: '.kp-action__meta', what: 'An optional small line under the sentence, for a live figure.' },
            { name: '--kp-actions-min', what: 'The least width of a column (15rem); the grid fills the width with as many as fit.' },
            { name: 'data-kp-action-size', what: '`compact` or `large`, on the board, on a tile or on an element above; absent leaves the theme’s own size. `setActionSize(el, size)` writes it for a script.' },
        ],
        accessibility: [
            'Built in — a tile is a real button or link: Tab reaches it, Enter or Space presses a button, Enter follows a link, and the focus ring is whole in every theme.',
            'Built in — the chevron and the spinner are pictures (`aria-hidden`); the busy word is read after the title.',
            'Yours — give every tile a sentence, and name the group.',
        ],
    };
