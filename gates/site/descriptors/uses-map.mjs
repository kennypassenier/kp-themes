// Page descriptor for the "uses-map" documentation page [AR19]; the shape is pinned in ./types.mjs.

/** @type {import('./types.mjs').Descriptor} */
export const usesMapDescriptor = {
        id: 'uses-map',
        title: 'Uses map',
        group: 'Data',
        classes: ['kp-uses'],
        aliases: ['lines', 'collapsed', 'dashed', 'density', 'unavailable'],
        exports: [],
        intro: 'The second view of the matrix: sources in one column, the things that use them in the other, a line for each use. A card lights its lines and dims the rest on hover or focus and pins on a press. Under 640 px the lines give way to a list of cards with their users as chips.',
        whenToUse: 'One glance at what depends on what: which CV an application uses, which secret feeds which stack. For a full cross-check of every pair, keep the grid view.',
        examples: [
            {
                title: 'Which CV each application uses',
                why: 'The same box as the matrix with `data-kp-view="lines"`; the matrix’s data gives the map: `rows` are the sources, `columns` the things that use them, and `cell(row, column)` returning something is a line. A node may carry `sub`, a document `glyph` (`pdf`, `doc`, `sheet`, `image`, `text`, `unknown`), an `href`, a `ghost` (a faint group) and `dashed` lines. Hover or focus a card and its lines light while the rest dims; a press pins it (`kp-uses-pin` reports `{ key, side, pinned, related }`); Escape lets go. Every card says the relation in words, so the phone list and the map hold the same text. Under 640 px the lines give way to a list of cards with their users as chips.',
                markup: `
<div class="kp-matrix" id="doc-uses" data-kp-matrix data-kp-view="lines" aria-label="Which CV each application uses"></div>
<p class="kp-text-muted" id="doc-uses-said" role="status">Nothing pinned.</p>
`,
                script: `
import { attachMatrices, setMatrix } from '@kp-soft/themes/js/heat';

const map = document.getElementById('doc-uses');
attachMatrices(map.parentElement);
const used = { 'cv-nl': ['deloitte', 'takto', 'acme'], 'cv-en': ['globex'], none: ['initech'] };
setMatrix(map, {
    view: 'lines',
    label: 'Which CV each application uses',
    rows: [
        { key: 'cv-nl', label: 'CV Developer NL', sub: 'generic master, made 06/2026', glyph: 'pdf', href: '#cv-nl' },
        { key: 'cv-en', label: 'CV Developer EN', sub: 'tailored, made 09/2026', glyph: 'pdf' },
        { key: 'cv-old', label: 'CV 2024', sub: 'replaced', glyph: 'doc' },
        { key: 'none', label: 'No CV', ghost: true, dashed: true },
    ],
    columns: [
        { key: 'deloitte', label: 'Deloitte', href: '#deloitte' },
        { key: 'takto', label: 'Takto' },
        { key: 'acme', label: 'Acme' },
        { key: 'globex', label: 'Globex' },
        { key: 'initech', label: 'Initech' },
    ],
    cell: (row, column) => ((used[row] ?? []).includes(column) ? { tone: 'ok' } : null),
});
map.addEventListener('kp-uses-pin', (event) => {
    document.getElementById('doc-uses-said').textContent = event.detail.pinned ? event.detail.key + ' pinned, used with ' + event.detail.related.join(', ') + '.' : 'Nothing pinned.';
});
`,
            },
            {
                title: 'Sources on the right, elbow lines, and the states',
                why: '`data-kp-lines-side="sources-right"` swaps the columns, `data-kp-lines-shape` is `curve`, `elbow` or `straight`, `data-kp-lines-light` is `both`, `hover`, `pick` or `off`, `data-kp-lines-count="off"` leaves the exact count on each source out, `data-kp-lines-empty-sources="hide"` hides a source nothing uses (else it says “Not used”) and `data-kp-lines-collapse-below` is the width under which the lines give way to the list. A node nobody can open carries a `disabledReason`. Loading lays the theme’s busy card over the whole map; empty and failed fill its footprint with the package’s plates.',
                markup: `
<div class="kp-matrix" id="doc-uses-right" data-kp-matrix data-kp-view="lines" data-kp-lines-side="sources-right" data-kp-lines-shape="elbow" data-kp-lines-count="off" data-kp-lines-empty-sources="hide" aria-label="Which secret feeds which stack"></div>
<div class="kp-matrix" id="doc-uses-loading" data-kp-matrix data-kp-view="lines" aria-label="Loading"></div>
<div class="kp-matrix" id="doc-uses-failed" data-kp-matrix data-kp-view="lines" aria-label="Failed"></div>
`,
                script: `
import { attachMatrices, setMatrix } from '@kp-soft/themes/js/heat';

const right = document.getElementById('doc-uses-right');
attachMatrices(right.parentElement);
const feeds = { 'db-password': ['media', 'cloud'], 'api-key': ['media'] };
setMatrix(right, {
    view: 'lines',
    label: 'Which secret feeds which stack',
    rows: [
        { key: 'db-password', label: 'db-password' },
        { key: 'api-key', label: 'api-key' },
        { key: 'old-token', label: 'old-token', disabledReason: 'Nothing uses it any more.' },
    ],
    columns: [{ key: 'media', label: 'media' }, { key: 'cloud', label: 'cloud' }],
    cell: (row, column) => ((feeds[row] ?? []).includes(column) ? { tone: 'ok' } : null),
});
setMatrix(document.getElementById('doc-uses-loading'), { view: 'lines', state: 'loading', label: 'Uses, loading' });
setMatrix(document.getElementById('doc-uses-failed'), { view: 'lines', state: 'error', message: 'The uses could not be read.', label: 'Uses, failed' });
`,
            },
        ],
        variants: [
            { name: 'usesRelation / usesPath / setUsesPin', what: '`usesRelation(spec)` gives which nodes each node is joined to, `usesPath(shape, x1, y1, x2, y2)` the line between two points and `setUsesPin(el, key)` pins a node from the page. `rememberedView` reads the view kept by `data-kp-remember`.' },
            { name: 'kp-uses-pin / kp-uses-retry', what: '`kp-uses-pin` carries `{ key, side, pinned, related }` (`USES_PIN_EVENT`); Try again on a failed map fires `kp-uses-retry` (`USES_RETRY_EVENT`).' },
            { name: 'data-kp-view', what: '`grid` (default, unchanged) or `lines`.' },
            { name: 'data-kp-lines-side', what: '`sources-left` (default) or `sources-right`.' },
            { name: 'data-kp-lines-shape', what: '`curve` (default), `elbow` or `straight`.' },
            { name: 'data-kp-lines-light', what: '`both` (default: hover or focus lights, a press pins), `hover`, `pick` or `off`.' },
            { name: 'data-kp-lines-count', what: '`on` (default) shows the exact number of uses on each source, `off`.' },
            { name: 'data-kp-lines-empty-sources', what: '`show` (default: "Not used") or `hide`.' },
            { name: 'data-kp-lines-collapse-below', what: 'The width in px under which the lines give way to the list (640).' },
            { name: 'line tones and plates', what: '`cell()` returns `{ tone, label }`: `ok`, `warn`, `bad` or `muted`, each drawn as colour, pattern and a mark. The label’s plate sits in the gap; a plate with no free place shows while its line is lit. `usesRelation(...).lines` lists the lines, and the phone list marks each with `.kp-uses__chip-tag`. The twelve registers draw the plate in the base look (a theme pass has not been asked for).' },
        ],
        accessibility: [
            'Built in — the lines are hidden from assistive technology; every card says the relation in words ("CV Developer NL, used by 3: Deloitte, Takto"); one tab stop with arrow keys, Home and End, Space pins, Enter opens the link, Escape lets go.',
            'Yours — give every node a label; give a node nobody can open a `disabledReason`.',
        ],
    };
