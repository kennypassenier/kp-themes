// Page descriptor for the "matrix" documentation page [AR19]; the shape is pinned in ./types.mjs.

/** @type {import('./types.mjs').Descriptor} */
export const matrixDescriptor = {
        id: 'matrix',
        title: 'Matrix',
        group: 'Data',
        classes: ['kp-matrix'],
        aliases: ['glyph', 'ringed', 'mark', 'lit', 'hot', 'inert'],
        exports: [],
        intro: 'Source by destination: a cell per pair that says its state in a plate, a word or a glyph (`data-kp-glyph`), with the pair with itself dashed and inert (`self`, `data-kp-inert`). A red ring (`data-kp-ringed`) means the traffic stopped on the way out of the source; a dashed outline (`data-kp-mark`) marks the cells a rule being read touches. The headers are buttons that light their row and their column (`data-kp-lit` on the matrix, `data-kp-hot` on the cells they touch) and stay in place while the grid scrolls inside its own box. One cell can be pinned (`aria-pressed`); `data-kp-matrix-select="follow"` pins the one the arrow keys land on, and `data-kp-matrix-owned` leaves the state to the page. `setMatrix(el, spec)` in js/heat.js writes it.',
        whenToUse:
            'For a table of pairs where the state of each pair matters more than a number: which service may reach which, who shares with whom, which version fits which platform.',
        examples: [
            {
                title: 'Two names, one allowed pair',
                why: 'Headers are sticky; the cell reads as a plate, a number and its words.',
                markup: `
<div class="kp-matrix" data-kp-matrix>
<div class="kp-matrix__grid" role="grid" aria-label="Which stack can reach which" style="--kp-matrix-cols: 2">
<div class="kp-matrix__line" role="row"><span class="kp-matrix__corner" role="columnheader">from ↓ to →</span><button type="button" class="kp-matrix__col" role="columnheader" aria-pressed="false" data-key="web"><span class="kp-matrix__name">web</span></button><button type="button" class="kp-matrix__col" role="columnheader" aria-pressed="false" data-key="db"><span class="kp-matrix__name">db</span></button></div>
<div class="kp-matrix__line" role="row"><button type="button" class="kp-matrix__row" role="rowheader" aria-pressed="false" data-key="web"><span class="kp-matrix__name">web</span></button><span class="kp-matrix__cell" role="gridcell" data-kp-tone="self" data-kp-inert aria-label="web to web: itself"></span><button type="button" class="kp-matrix__cell" role="gridcell" data-kp-tone="ok" data-r="0" data-c="1" data-row-key="web" data-col-key="db" aria-pressed="false" aria-label="web to db: 1 port open">1</button></div>
</div>
</div>
`,
            },
            {
                title: 'Who can reach whom, pinned by the arrow keys, and the three states',
                why: '`setMatrix(el, spec)` takes the names and a `cell(row, column)` function: a tone, the words, a `ringed` red ring for traffic stopped on the way out, a `mark` outline for the cells a rule touches. Press a header to light its row or column; `data-kp-matrix-select="follow"` pins the cell the arrow keys land on and `kp-matrix-pick` reports it. `matrixSelf` and `matrixUnknown` are the words for a pair with itself and an unknown pair. Below, the loading, empty and failed matrix.',
                markup: `
<div class="kp-matrix" id="doc-matrix-live" data-kp-matrix data-kp-matrix-select="follow"></div>
<div class="kp-matrix" id="doc-matrix-loading" data-kp-matrix></div>
<div class="kp-matrix" id="doc-matrix-empty" data-kp-matrix></div>
<div class="kp-matrix" id="doc-matrix-error" data-kp-matrix></div>
`,
                script: `
import { attachMatrices, setMatrix } from '@kp-soft/themes/js/heat';

attachMatrices(document.getElementById('doc-matrix-live').parentElement);
const names = ['web', 'api', 'db', 'cache'].map((key) => ({ key, label: key }));
const open = { 'web>api': 'HTTP', 'api>db': 'SQL', 'api>cache': 'cache' };
setMatrix(document.getElementById('doc-matrix-live'), {
    corner: 'from ↓ to →',
    rows: names,
    columns: names,
    label: 'Which stack can reach which',
    cell: (row, column) => {
        if (row === column) return undefined;
        const words = open[row + '>' + column];
        if (words) return { tone: 'ok', text: words, label: words + ' is open', mark: row === 'api' };
        return row === 'web' && column === 'db'
            ? { tone: 'bad', label: 'blocked on the way out of web', ringed: true }
            : { tone: 'muted', label: 'nothing open' };
    },
});
setMatrix(document.getElementById('doc-matrix-loading'), { state: 'loading', skeleton: 3, label: 'Reachability, loading' });
setMatrix(document.getElementById('doc-matrix-empty'), { state: 'empty', message: 'No stack is shown: every stack is filtered out.', label: 'Reachability, empty' });
setMatrix(document.getElementById('doc-matrix-error'), { state: 'error', message: 'The firewall rules could not be read.', label: 'Reachability, failed' });
`,
            },
            {
                title: 'Holding its height in a state',
                why: 'Loaded, the component is as high as its rows. Loading, empty or failed it keeps that height as a minimum, so the page under it does not jump twice; the first load has nothing remembered and is left alone. A very tall list holds a screen, not its full length (the cap is set on the host or any ancestor; it is 12 rem here to show it). Press the states.',
                markup: `
<div class="kp-stack kp-gap-md" id="doc-fp-matrix">
<div class="kp-row kp-gap-sm" role="group" aria-label="State">
<button type="button" class="kp-button kp-button--sm" data-doc-state="ready">Ready</button>
<button type="button" class="kp-button kp-button--sm" data-doc-state="loading">Loading</button>
<button type="button" class="kp-button kp-button--sm" data-doc-state="empty">Empty</button>
<button type="button" class="kp-button kp-button--sm" data-doc-state="error">Failed</button>
</div>
<div class="kp-matrix" data-kp-matrix id="doc-fp-matrix-host" style="--kp-footprint-max: 12rem"></div>
</div>
`,
                script: `
import { attachMatrices, setMatrix } from '@kp-soft/themes/js/heat';
const root = document.getElementById('doc-fp-matrix');
const host = document.getElementById('doc-fp-matrix-host');
attachMatrices(root);
const names = ['web', 'api', 'db', 'cache', 'queue'].map((key) => ({ key, label: key }));
const draw = (state) => setMatrix(host, state === 'ready'
    ? { corner: 'from ↓ to →', rows: names, columns: names, label: 'Reachability', cell: (row, column) => (row === column ? undefined : { tone: 'muted', label: 'nothing open' }) }
    : { state, skeleton: 3, message: state === 'empty' ? 'No stack is shown.' : 'The rules could not be read.', label: 'Reachability' });
for (const button of root.querySelectorAll('[data-doc-state]')) {
    button.addEventListener('click', () => draw(button.dataset.docState));
}
draw('ready');
`,
            },
        ],
        variants: [
            { name: 'data-kp-tone', what: '`ok` (allowed), `warn` (mismatch), `bad` (blocked), `muted` (nothing open), `none` (unknown, inert), `self` (itself, inert) and `loading`.' },
            { name: 'data-kp-glyph', what: 'The glyph a cell shows when the page gave it no text: a tick, an exclamation mark, a cross or a dash by its tone.' },
            { name: 'data-kp-ringed', what: 'A red ring inside the plate: the traffic was stopped on the way out of the source.' },
            { name: 'data-kp-mark', what: 'A dashed outline on the cells a rule being read touches.' },
            { name: 'data-kp-lit', what: 'On the matrix while a header is lit: the cells it does not touch recede; the ones it touches carry `data-kp-hot`.' },
            { name: 'data-kp-hot', what: 'A cell in a lit row or column.' },
            { name: 'data-kp-inert', what: 'A cell that cannot be pressed (itself, unknown).' },
            { name: 'data-kp-ringed', what: 'See above: the ring on a cell.' },
            { name: 'data-kp-state', what: '`loading` keeps the shape with skeleton names and cells; `empty` and `error` show one sentence.' },
            { name: 'the busy card', what: 'While `loading`, the data table’s loading card (`js/busy-card.js`) stands centred over the cells (`.kp-matrix__busy`), over the skeleton names and plates, and the matrix is drawn once it has left.' },
            { name: 'setMatrix / setMatrixLit / setMatrixPick', what: 'Write the matrix, light some headers (`kp-matrix-light` reports the change a person made) and pin a cell. `data-kp-matrix-owned` leaves the lit and pinned state to the page.' },
            { name: '.kp-heat__swatch--plate', what: 'A legend swatch drawn as a matrix plate, for a legend under a matrix.' },
            { name: 'row labels', what: 'The row-label column is as wide as its longest name between a least and a most width (8rem under 36rem), names wrap, and a column is never narrower than its header’s longest word.' },
            { name: 'the lines view', what: 'The busy card of the lines view is centred over the whole map (its least height), not over the waiting rows. `cell()` of the lines view returns `{ tone, label }`; the tones are `ok`, `warn`, `bad` and `muted`.' },
        ],
        accessibility: [
            'Built in — a `grid` with row and column headers and one tab stop; arrows move between the cells that can be pressed and wrap round; Escape turns the lit names off (`kp-matrix-light`); a pinned cell sends `kp-matrix-pick`.',
            'Built in — a state is a plate, a word or a glyph, and the cell’s name says the pair and its state.',
            'Yours — give every cell a `label` that says its state in words, and say what is pinned in a live region.',
        ],
    };
