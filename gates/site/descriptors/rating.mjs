// Page descriptor for the "rating" documentation page [AR19]; the shape is pinned in ./types.mjs.

/** @type {import('./types.mjs').Descriptor} */
export const ratingDescriptor = {
        id: 'rating',
        title: 'Star rating',
        group: 'Forms',
        classes: ['kp-rating'],
        exports: [],
        aliases: ['star', 'whole', 'popped', 'previewing', 'readonly'],
        intro: 'A row of stars to give something a score, and the same row read only to show one. The input is a radio group (one tab stop, the arrows move and choose, Home and End, Backspace clears); the display is one image with a full text name (“Rated 4 of 5”). Whole stars, five of them, by default; the lit stars are the theme’s accent, never red or green. js/rating.js (`attachRatings`, `rating`, `setRating`, `setRatingState`, `ratingCell`, `snapRating`) draws the stars and fires `kp-rating-change`, which the page can refuse or answer with a save.',
        whenToUse: 'For a score a person gives (a recipe after cooking) or one that is shown (a list sorted by it). For a yes or no use a switch; for a choice between words use the segmented control.',
        examples: [
            {
                title: 'Give a rating, and show one',
                why: 'The module draws the stars from the attributes. `data-kp-rating-for` names the item in the sentences; the words per level are optional.',
                markup: `
<div class="kp-rating" data-kp-rating data-kp-rating-for="Lasagne" data-kp-rating-value="4" data-kp-rating-labels="Not for me|Okay|Good|Great|Make again"></div>
<div class="kp-rating" data-kp-rating data-kp-rating-mode="display" data-kp-rating-for="Lasagne" data-kp-rating-value="4.5" data-kp-rating-count="12"></div>
`,
            },
            {
                title: 'Half stars, sizes, Save rating, locked and read only',
                why: 'Every option is an attribute and can be changed while the page runs; the row draws itself again. `data-kp-rating-step="0.5"` makes the row one slider (a press on the left half of a star is the half); `data-kp-rating-commit="confirm"` holds the pick until Save rating or Cancel; `data-kp-disabled-reason` is written under the stars, not in a tooltip; `data-kp-readonly` is drawn as an input that does nothing.',
                markup: `
<div class="kp-stack">
<div class="kp-rating" data-kp-rating data-kp-rating-step="0.5" data-kp-rating-for="Tiramisu" data-kp-rating-value="3.5"></div>
<div class="kp-rating" data-kp-rating data-kp-rating-size="lg" data-kp-rating-for="Carbonnade" data-kp-rating-value="5" data-kp-rating-preview="off"></div>
<div class="kp-rating" data-kp-rating data-kp-rating-commit="confirm" data-kp-rating-for="Risotto" data-kp-rating-value="2"></div>
<div class="kp-rating" data-kp-rating data-kp-rating-for="Moussaka" data-kp-rating-value="3" data-kp-disabled data-kp-disabled-reason="Locked while the recipe is being edited"></div>
<div class="kp-rating" data-kp-rating data-kp-rating-for="Ratatouille" data-kp-rating-value="5" data-kp-readonly></div>
</div>
`,
            },
            {
                title: 'A save that waits, a refused save, and a rating that cannot be read',
                why: '`kp-rating-change` carries `{ value, previous, source, wait }`: hand `wait` the page’s save and the row is busy until it settles; a rejection puts the previous stars back and says so under the row for a few seconds. `setRatingState(el, \'error\')` replaces the stars with one plate over the whole box (the stars, the words and the buttons) and a normal-size Retry, which fires `kp-rating-retry`; `\'loading\'` keeps the size as dashed, breathing stars. The page decides what a retry is.',
                markup: `
<div class="kp-stack">
<div class="kp-rating" id="doc-rating-save" data-kp-rating data-kp-rating-for="Lasagne" data-kp-rating-value="4" data-kp-rating-labels="Not for me|Okay|Good|Great|Make again"></div>
<div class="kp-row kp-flex-wrap kp-gap-sm" role="group" aria-label="States">
<button type="button" class="kp-button" id="doc-rating-refuse" aria-pressed="false">The next save is refused</button>
<button type="button" class="kp-button" id="doc-rating-fail">Could not read it</button>
</div>
</div>
`,
                script: `
import { RATING_EVENT, RATING_RETRY_EVENT, setRatingState } from '@kp-soft/themes/js/rating';

const row = document.getElementById('doc-rating-save');
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
let refuse = false;
row.addEventListener(RATING_EVENT, (event) => {
    event.detail.wait(sleep(700).then(() => (refuse ? Promise.reject(new Error('refused')) : undefined)));
});
row.addEventListener(RATING_RETRY_EVENT, () => {
    setRatingState(row, 'loading');
    setTimeout(() => setRatingState(row, 'ready'), 900);
});
document.getElementById('doc-rating-refuse').addEventListener('click', (event) => {
    refuse = !refuse;
    event.currentTarget.setAttribute('aria-pressed', String(refuse));
});
document.getElementById('doc-rating-fail').addEventListener('click', () => setRatingState(row, 'error'));
`,
            },
            {
                title: 'In a table cell',
                why: '`ratingCell(cell, value, { max, count, for })` puts a read-only row in a table cell and writes the number on the cell as its sort value, so the data table sorts by stars and a recipe with no rating sorts last.',
                markup: `
<div class="kp-datatable" data-kp-datatable data-kp-page-sizes="none">
<div class="kp-table-wrap"><table class="kp-table" id="doc-rating-table">
<caption class="kp-sr-only">Recipes with their rating. Press Rating to sort by the number of stars.</caption>
<thead><tr><th scope="col" data-kp-sort="text">Recipe</th><th scope="col" data-kp-sort="number">Rating</th></tr></thead>
<tbody>
<tr><td>Lasagne</td><td data-doc-rating="4.5|12"></td></tr>
<tr><td>Stoofvlees</td><td data-doc-rating="3|4"></td></tr>
<tr><td>Waterzooi</td><td data-doc-rating=""></td></tr>
<tr><td>Carbonnade</td><td data-doc-rating="5|9"></td></tr>
</tbody></table></div>
</div>
`,
                script: `
import { ratingCell } from '@kp-soft/themes/js/rating';

for (const cell of document.querySelectorAll('#doc-rating-table [data-doc-rating]')) {
    const [value, count] = cell.getAttribute('data-doc-rating').split('|');
    const name = cell.previousElementSibling.textContent;
    if (value) ratingCell(cell, Number(value), { count: Number(count), for: name });
    else ratingCell(cell, 0, { for: name });
}
`,
            },
        ],
        variants: [
            { name: 'data-kp-rating-max', what: 'The scale, 3 to 10 (5).' },
            { name: 'data-kp-rating-step', what: '`1` (whole stars, the default) or `0.5` (the row becomes one slider).' },
            { name: 'data-kp-rating-mode', what: '`input` (the default) or `display`.' },
            { name: 'data-kp-rating-value', what: 'The value, 0 to the scale; 0 is not rated.' },
            { name: 'data-kp-rating-clear', what: '`off` stops the chosen star, Backspace and Delete from removing the rating (the default removes).' },
            { name: 'data-kp-rating-labels', what: 'One word per level, `Not for me|Okay|Good` or a JSON list; the caption shows the word.' },
            { name: 'data-kp-rating-size', what: '`sm`, `md` or `lg` (input `md`, display `sm`).' },
            { name: 'data-kp-rating-commit', what: '`immediate` (the default) or `confirm`, which holds the pick until Save rating.' },
            { name: 'data-kp-rating-preview', what: '`off` turns off the star shown under the pointer.' },
            { name: 'data-kp-rating-unrated-text', what: 'The words of an empty row (“Not rated yet”).' },
            { name: 'data-kp-rating-count', what: 'Display only: how many ratings the number averages, “4.5 (12)”.' },
            { name: 'data-kp-rating-name', what: 'A hidden input of this name, so the value posts in a plain form.' },
            { name: 'data-kp-rating-for', what: 'The item’s name in “Rating for Lasagne”.' },
            { name: 'data-kp-readonly', what: 'Drawn as an input, not changeable, no reason needed.' },
            { name: 'data-kp-disabled and data-kp-disabled-reason', what: 'A temporary lock, and the sentence under the row.' },
            { name: 'data-kp-undo-ms and data-kp-flash-error-ms', what: 'The Undo window after a change (6000, 0 for none) and how long a refused save is told (3000).' },
            { name: 'data-kp-state', what: '`loading` (dashed stars that breathe) or `error` (“Could not read the rating” and Retry, `kp-rating-retry`).' },
            { name: 'data-kp-state="error"', what: 'The failed state covers the rating’s whole box with its plate, the stars and the words and the buttons together, at the same height; it is not a small line under the stars [t56-statefix-1018]. No option; Retry fires the retry event.' },
            { name: 'ratingCell(cell, value)', what: 'A display row in a data table cell, and the number the table sorts by on the cell.' },
            { name: '.kp-rating--sm / --md / --lg / --display / --input', what: 'Written by the module on the host: the size (`data-kp-rating-size`) and the mode (`data-kp-rating-mode`). Style by them, do not set them by hand.' },
            { name: '.kp-rating__body / __row / __star / __glyph', what: 'The module’s parts: the box that holds everything, the row of stars, one star (a radio in the input, an image part in the display) and the star’s drawing, which has an `__empty` and a `__full` layer so a half star is a clip of the full one.' },
            { name: '.kp-rating__foot / __caption / __actions', what: 'The line under the row: the caption (the word of the chosen level, or “Not rated yet”, or “4.5 (12)”), and the buttons `__clear` (Clear, hidden on a phone), `__save` (Save rating) and `__drop` (Cancel) of a rating that holds its pick.' },
            { name: '.kp-rating__reason / __flash', what: 'The sentence of a lock, under the row; and the line that tells a refused save for a few seconds (`role="alert"`).' },
            { name: '.kp-rating__failure / __failure-text / __retry', what: 'The plate of the error state, its sentence and its Retry.' },
            { name: 'marks the module writes', what: '`data-kp-star` (a star’s number), `data-kp-lit` (a star with any fill), `data-kp-whole`, `data-kp-popped` and `data-kp-previewing` (the star just chosen and the one under the pointer), `data-kp-rating-busy` (a save is on its way).' },
        ],
        accessibility: [
            'Built in — the input is a radio group named “Rating for Lasagne”; each star is “4 of 5” (with a word, “4 of 5, Good”); the display is one image, “Rated 4 of 5”, or “Not rated yet”.',
            'Built in — a change is said politely (“Lasagne: 4 of 5”) and offers Undo; a refused save puts the previous value back and says so under the row.',
            'Yours — name the item with `data-kp-rating-for`, and answer `kp-rating-change` (call `event.detail.wait(promise)` for a save).',
        ],
    };
