// Page descriptor for the "heat" documentation page [AR19]; the shape is pinned in ./types.mjs.

/** @type {import('./types.mjs').Descriptor} */
export const heatDescriptor = {
        id: 'heat',
        title: 'Heat grid',
        group: 'Data',
        classes: ['kp-heat'],
        aliases: ['picked', 'share', 'minor', 'inert'],
        exports: [],
        intro: 'Rows by many columns of small cells, each toned by a state or a value: a stack per night, a service per hour. A label column on the start side (a press on a name toggles it, `data-kp-heat-toggle`), the column axis, an optional summary row whose cells fill from the bottom (`data-kp-share`), a legend (`.kp-heat__legend` with `.kp-heat__swatch` and `.kp-heat__ramp`), a picked column (`data-kp-picked`, `data-kp-heat-picked`) and hover detail through the hover card. A state is told by a pattern as well as a colour: a bad cell is striped, a warn cell ruled, a future cell dashed, a cell before the record hatched. `setHeat(el, spec)` in js/heat.js writes it and keeps its footprint in every state; `data-kp-heat-owned` leaves the picked column and the pressed names to the page. A cell on the axis that is not named is `data-kp-minor`; a cell that cannot be pressed is `data-kp-inert`.',
        whenToUse:
            'When a reader looks for the odd one out in a dense grid of states or values and then asks about one cell: coverage per night, uptime per hour, a count per day. Not for a few categories (use a table or a chart) and not for a month calendar (use the calendar, which has the weekdays).',
        examples: [
            {
                title: 'Two rows of states, with a legend',
                why: 'The markup is complete without the script apart from the roving tab stop: every cell is a named button. Tones are the month heatmap’s words.',
                markup: `
<div class="kp-heat" data-kp-heat role="grid" aria-label="Snapshots per stack per night" style="--kp-heat-cols: 4">
<div class="kp-heat__row" role="row"><span class="kp-heat__label" role="rowheader"><span class="kp-heat__label-text">media</span></span>
<div class="kp-heat__cells" role="none">
<button type="button" class="kp-heat__cell" role="gridcell" data-kp-tone="ok" data-r="0" data-c="0" data-row-key="media" data-col-key="14" aria-label="media, 14: backed up"></button>
<button type="button" class="kp-heat__cell" role="gridcell" data-kp-tone="bad" data-r="0" data-c="1" data-row-key="media" data-col-key="15" aria-label="media, 15: missed"></button>
<button type="button" class="kp-heat__cell" role="gridcell" data-kp-tone="before" data-r="0" data-c="2" data-row-key="media" data-col-key="16" aria-label="media, 16: before any history"></button>
<button type="button" class="kp-heat__cell" role="gridcell" data-kp-tone="future" data-r="0" data-c="3" data-row-key="media" data-col-key="17" aria-label="media, 17: not run yet"></button>
</div></div>
</div>
<ul class="kp-heat__legend"><li><span class="kp-heat__swatch" data-kp-tone="ok"></span> backed up</li><li><span class="kp-heat__swatch" data-kp-tone="bad"></span> missed</li></ul>
`,
            },
            {
                title: 'A backups grid with a summary row, a picked night and the newest column on the end',
                why: '`setHeat(el, spec)` writes the axis, the summary row (each cell filled from the bottom by its `share`) and the rows. Press a name to toggle it (`data-kp-heat-toggle`), press a cell to pin its night, and use the arrows, Page Up and Page Down. `data-kp-heat-latest="end"` says the newest column stands on the end edge: End also sends `kp-heat-page` with `direction: "latest"`, so a grid paged back to older nights comes back in the same press.',
                markup: `
<div class="kp-heat" id="doc-heat-backups" data-kp-heat data-kp-heat-toggle data-kp-heat-latest="end"></div>
<ul class="kp-heat__legend"><li><span class="kp-heat__swatch" data-kp-tone="ok"></span> backed up</li><li><span class="kp-heat__swatch" data-kp-tone="warn"></span> some missed</li><li><span class="kp-heat__swatch" data-kp-tone="bad"></span> missed</li><li><span class="kp-heat__swatch" data-kp-tone="future"></span> not run yet</li></ul>
`,
                script: `
import { attachHeats, setHeat } from '@kp-soft/themes/js/heat';

const grid = document.getElementById('doc-heat-backups');
attachHeats(grid.parentElement);
const NIGHTS = 14;
const STACKS = ['media', 'home', 'platform', 'backups'];
const missed = (stack, night) => (stack === 'backups' && night === 5) || (stack === 'platform' && night === 9);
const columns = Array.from({ length: NIGHTS }, (_, night) => ({ key: String(night), label: String(night + 1) }));
const cellOf = (stack, night) =>
    night === NIGHTS - 1
        ? { tone: 'future', label: 'not run yet' }
        : missed(stack, night)
          ? { tone: 'bad', label: 'missed', tip: stack + ', night ' + (night + 1) + ': no snapshot.' }
          : { tone: 'ok', label: 'backed up' };
const rows = STACKS.map((stack) => ({ key: stack, label: stack, cells: columns.map((_, night) => cellOf(stack, night)) }));
const summary = {
    key: 'fleet',
    label: 'Whole fleet',
    cells: columns.map((_, night) => {
        if (night === NIGHTS - 1) return { tone: 'future', label: 'not run yet' };
        const ok = STACKS.filter((stack) => !missed(stack, night)).length;
        return { tone: ok === STACKS.length ? 'ok' : 'warn', share: ok / STACKS.length, label: ok + ' of ' + STACKS.length + ' backed up' };
    }),
};
setHeat(grid, { columns, summary, rows, label: 'Snapshots per stack per night', picked: String(NIGHTS - 2) });
`,
            },
            {
                title: 'Calm tones: three habits over a week',
                why: '`data-kp-tones="calm"` gives the cells `logged`, `quiet` and `paused` instead of ok, warn and bad, and a legend that says Logged, Nothing logged and Paused (`data-kp-legend="hide"` leaves it out). A quiet cell has no border, glyph or count, and its name still says “nothing logged”. A page that hands over `bad` by habit gets `quiet` and one console warning, so no red reaches a tracker by mistake (`data-kp-calm-map="none"` passes tones through).',
                markup: `
<div class="kp-heat" id="doc-heat-calm" data-kp-heat data-kp-tones="calm" aria-label="Habits"></div>
`,
                script: `
import { attachHeats, setHeat } from '@kp-soft/themes/js/heat';

const grid = document.getElementById('doc-heat-calm');
attachHeats(grid.parentElement);
const days = Array.from({ length: 7 }, (_, i) => ({ key: String(i + 10), label: String(i + 10) }));
const cells = (pattern) =>
    [...pattern].map((c) =>
        c === 'x' ? { tone: 'logged', label: 'logged' } : c === 'p' ? { tone: 'paused', label: 'paused' } : { tone: 'quiet', label: 'nothing logged' },
    );
setHeat(grid, {
    columns: days,
    rows: [
        { key: 'walk', label: 'Walk', cells: cells('xx.x..x') },
        { key: 'stretch', label: 'Stretch', cells: cells('x.x.x.p') },
        { key: 'journal', label: 'Journal', cells: cells('xx.xxx.') },
    ],
    label: 'Habits, one week',
    every: 1,
});
`,
            },
            {
                title: 'Tone by value, and the three states',
                why: 'The tone `level` darkens with a cell’s `level` (0 to 1): a count per day, a load per hour. The three states keep the grid’s footprint: `loading` shows skeleton cells in place (and the data table’s loading card over them), `empty` and `error` give one sentence of the grid’s minimum height (`message`). `skeleton` is the shape of a loading grid that has no data yet.',
                markup: `
<div class="kp-heat" id="doc-heat-level" data-kp-heat></div>
<div class="kp-heat" id="doc-heat-loading" data-kp-heat></div>
<div class="kp-heat" id="doc-heat-empty" data-kp-heat></div>
<div class="kp-heat" id="doc-heat-error" data-kp-heat></div>
`,
                script: `
import { attachHeats, setHeat } from '@kp-soft/themes/js/heat';

attachHeats(document.getElementById('doc-heat-level').parentElement);
const columns = Array.from({ length: 12 }, (_, hour) => ({ key: String(hour), label: String(hour * 2) }));
const row = (key, seed) => ({
    key,
    label: key,
    cells: columns.map((_, hour) => {
        const level = Math.abs(Math.sin(hour * seed));
        return { tone: 'level', level, label: Math.round(level * 100) + ' requests' };
    }),
});
setHeat(document.getElementById('doc-heat-level'), { columns, rows: [row('web', 0.7), row('api', 1.3), row('mail', 2.1)], label: 'Requests per two hours' });
const skeleton = { rows: 3, columns: 12 };
setHeat(document.getElementById('doc-heat-loading'), { state: 'loading', skeleton, label: 'Requests, loading' });
setHeat(document.getElementById('doc-heat-empty'), { state: 'empty', skeleton, message: 'No stack is shown: every stack is filtered out.', label: 'Requests, empty' });
setHeat(document.getElementById('doc-heat-error'), { state: 'error', skeleton, message: 'The repositories could not be read. Try again in a minute.', label: 'Requests, failed' });
`,
            },
        ],
        variants: [
            { name: 'data-kp-tone', what: '`ok`, `warn`, `bad`, `muted`, `future`, `before`, `none`, `level` (the darker, the more) and `loading` (the theme’s own skeleton block).' },
            { name: '.kp-heat__row--summary', what: 'A track per cell, filled from the bottom by its share; the whole-fleet row of a coverage grid.' },
            { name: 'data-kp-picked', what: 'On every cell and the axis name of the picked column; written by `setHeatPick` and by a press on a cell.' },
            { name: 'data-kp-share', what: 'On a summary row’s cell: the tone fills it from the bottom by its share.' },
            { name: 'data-kp-minor', what: 'On an axis name that is not drawn (every third is); it stays in the tree for a screen reader.' },
            { name: 'data-kp-inert', what: 'A cell that cannot be pressed; `aria-disabled` goes with it.' },
            { name: 'data-kp-state', what: '`loading`, `empty` and `error` on the grid: loading keeps the cells in place, the others show one sentence of the grid’s minimum height.' },
            { name: 'data-kp-heat-latest', what: 'Opt-in: `end` (or `start`, for a grid whose newest column comes first) says which edge the newest column stands on. The key that goes to that edge (End, or Home) still moves to the end of the row, and also sends `kp-heat-page` with `direction: "latest"`; with Ctrl it goes to that corner and sends it too.' },
            { name: 'the busy card', what: 'While `loading`, the data table’s loading card (`js/busy-card.js`: the theme’s spinner and “Reading…”) stands centred over the cells (`.kp-heat__busy`), arriving and leaving as the table’s does; the cells are drawn once it has left.' },
            { name: 'setHeat / setHeatPick / setHeatRows', what: 'Write the grid (keeping its columns, row heights, picked column and a focused cell’s place), pick a column by its key, and set which row names are pressed. A grid marked `data-kp-heat-owned` leaves the picked column and the pressed names to the page. `heatLoading`, `heatEmpty` and `heatFailed` are the default words.' },
            { name: 'the label column', what: 'The label column is as wide as its longest name, between a floor and a share of the grid (a name never breaks inside a word), and a long row name wraps: the row grows, the name is never cut.' },
            { name: 'the axis rule', what: '`every` counts the columns without `minor`; `minor: true` is never named and not counted, `minor: false` is always named, and the last named column wins over the one before it when adjacent. A minor header carries its name in `aria-label` and no text.' },
            { name: 'setHeatLegend and the calm legend', what: '`setHeatLegend(el, { entries, ramp, keys })` draws the legend (`legend` and `legendKeys` of `setHeat` do the same); the calm grid has its own legend, left out with `data-kp-legend="hide"`.' },
            { name: 'failed and empty', what: '`setHeat` takes `message`, `text` and `art` for the state plate, and `.kp-heat` holds its loaded height while a state shows; Retry fires `kp-heat-retry`.' },
        ],
        accessibility: [
            'Built in — a `grid` with row and column headers, one tab stop, arrow keys, Home and End, Ctrl with them for the corners; Page Up and Page Down send `kp-heat-page`, Enter and Space press a cell (`kp-heat-pick`), a pressed name sends `kp-heat-row`.',
            'Built in — a state is a pattern as well as a colour; a column name that is not drawn stays in the tree.',
            'Yours — give every cell words (`label`) that say what its colour says, and put the detail of a picked column in a polite live region.',
        ],
    };
