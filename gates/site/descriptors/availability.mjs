// Page descriptor for the "availability" documentation page [AR19]; the shape is pinned in ./types.mjs.

/** @type {import('./types.mjs').Descriptor} */
export const availabilityDescriptor = {
        id: 'availability',
        title: 'Who can come',
        group: 'Data',
        classes: ['kp-availability'],
        exports: [],
        intro: 'People in the rows, days or proposed periods in the columns: each person answers can, maybe or cannot for their own row, the summary row counts who can, and the best column is ringed. The package’s heat grid, made editable.',
        whenToUse: 'Finding a date that suits a group: a trip, a meeting, a shared dinner. For a read-only grid of states use the heat grid.',
        examples: [
            {
                title: 'Who can come to a trip',
                why: 'The page gives the people, the columns and the answers; the module draws the grid, answers presses and says what changed.',
                markup: `
<div class="kp-availability" data-kp-availability data-kp-availability-choose aria-label="Who can come"></div>
`,
            },
            {
                title: 'Periods, answered by four people',
                why: '`setAvailability(el, spec)` hands the grid its columns, people and answers; the person marked `mine: true` is the only row that can be changed (`data-kp-heat-edit="own"`). A press opens the answers, a drag across the row paints one, and `y`, `m`, `n` or Backspace on a focused cell of your own row sets it. `kp-availability-change` is cancelable and carries `settle(promise)`: the pressed cells wait on a spinner until the promise resolves, and a rejection puts them back and marks them refused. The best column is outlined, and `data-kp-availability-choose` offers Choose these dates under it.',
                markup: `
<div class="kp-availability" id="doc-av-periods" data-kp-availability data-kp-availability-choose aria-label="Who can come to the trip"></div>
<p class="kp-text-muted" id="doc-av-log" aria-live="polite">Press a cell on the Kenny row.</p>
`,
                script: `
import { setAvailability, availabilityRange } from '@kp-soft/themes/js/availability';

const grid = document.getElementById('doc-av-periods');
const log = document.getElementById('doc-av-log');
setAvailability(grid, {
    unit: 'range',
    columns: [
        availabilityRange('2026-06-19', '2026-06-21'),
        availabilityRange('2026-06-26', '2026-06-28'),
        availabilityRange('2026-07-03', '2026-07-05'),
    ],
    people: [
        { id: 'kenny', name: 'Kenny', mine: true },
        { id: 'tom', name: 'Tom' },
        { id: 'lies', name: 'Lies' },
        { id: 'jan', name: 'Jan' },
    ],
    answers: {
        kenny: { '2026-06-19/2026-06-21': 'yes', '2026-06-26/2026-06-28': 'maybe' },
        tom: { '2026-06-19/2026-06-21': 'yes', '2026-06-26/2026-06-28': 'no', '2026-07-03/2026-07-05': 'yes' },
        lies: { '2026-06-19/2026-06-21': 'yes', '2026-06-26/2026-06-28': 'yes', '2026-07-03/2026-07-05': 'maybe' },
        jan: { '2026-06-19/2026-06-21': 'maybe' },
    },
});
grid.addEventListener('kp-availability-change', (event) => {
    const { person, keys, answer } = event.detail;
    // The page decides what saving is: here it takes a moment and never fails.
    event.detail.settle(new Promise((done) => setTimeout(done, 700)));
    log.textContent = person + ': ' + (answer ?? 'cleared') + ' for ' + keys.length + ' column(s).';
});
grid.addEventListener('kp-availability-choose', (event) => {
    log.textContent = 'Chosen: ' + event.detail.keys.join(', ');
});
`,
            },
            {
                title: 'Days or periods, one set each',
                why: 'A spec may carry both kinds of column as `sets: { range, day }` with `canSwitchUnit: true` (or `data-kp-availability-unit-switch="on"`): a segmented switch above the grid fires `kp-availability-unit` and the grid shows the chosen set. `availabilityDays(start, count)` writes the day labels in dd/mm. In day mode `data-kp-availability-window` marks the best stretch of that many days, `data-kp-availability-quorum` says how many must answer before a column can be best, and `data-kp-availability-summary="count"` keeps only the number in the summary row.',
                markup: `
<div class="kp-availability" id="doc-av-days" data-kp-availability data-kp-availability-window="3" data-kp-availability-quorum="2" data-kp-availability-summary="count" data-kp-availability-sort="given" aria-label="Which days suit"></div>
`,
                script: `
import { setAvailability, availabilityDays, availabilityRange } from '@kp-soft/themes/js/availability';

const grid = document.getElementById('doc-av-days');
const days = availabilityDays('2026-06-19', 6);
const answer = (...list) => Object.fromEntries(list.map((value, i) => [days[i].key, value]).filter(([, value]) => value));
setAvailability(grid, {
    unit: 'day',
    canSwitchUnit: true,
    people: [
        { id: 'kenny', name: 'Kenny', mine: true },
        { id: 'tom', name: 'Tom' },
        { id: 'lies', name: 'Lies' },
    ],
    sets: {
        day: {
            columns: days,
            answers: {
                kenny: answer('yes', 'yes', 'yes', 'maybe', 'no', 'no'),
                tom: answer('no', 'yes', 'yes', 'yes', 'yes', null),
                lies: answer('yes', 'yes', 'maybe', 'yes', null, 'no'),
            },
        },
        range: {
            columns: [availabilityRange('2026-06-19', '2026-06-21'), availabilityRange('2026-06-24', '2026-06-26')],
            answers: { kenny: {}, tom: {}, lies: {} },
        },
    },
});
`,
            },
            {
                title: 'Loading, empty and failed',
                why: '`state` in the spec is `ready`, `loading`, `empty` or `error`. Loading draws the heat grid’s busy card at the grid’s final size; empty and error are plates in the same place, with `message`, an `emptyAction` and a Retry that fires `kp-availability-retry`. `data-kp-disabled-reason` with `disabled` makes every cell inert and says why.',
                markup: `
<div class="kp-stack">
<div class="kp-availability" id="doc-av-loading" data-kp-availability aria-label="Loading answers"></div>
<div class="kp-availability" id="doc-av-failed" data-kp-availability aria-label="Answers that could not be read"></div>
<div class="kp-availability" id="doc-av-locked" data-kp-availability disabled data-kp-disabled-reason="The trip is booked, so the answers are closed." aria-label="Answers of a booked trip"></div>
</div>
`,
                script: `
import { setAvailability, availabilityRange } from '@kp-soft/themes/js/availability';

const people = [{ id: 'kenny', name: 'Kenny', mine: true }, { id: 'tom', name: 'Tom' }];
const columns = [availabilityRange('2026-06-19', '2026-06-21'), availabilityRange('2026-06-26', '2026-06-28')];
setAvailability(document.getElementById('doc-av-loading'), { state: 'loading', columns, people });
setAvailability(document.getElementById('doc-av-failed'), { state: 'error', columns: [], people });
setAvailability(document.getElementById('doc-av-locked'), {
    columns,
    people,
    answers: { kenny: { [columns[0].key]: 'yes' }, tom: { [columns[0].key]: 'yes', [columns[1].key]: 'no' } },
});
`,
            },
            {
                title: 'Holding its height in a state',
                why: 'Loaded, the component is as high as its rows. Loading, empty or failed it keeps that height as a minimum, so the page under it does not jump twice; the first load has nothing remembered and is left alone. A very tall list holds a screen, not its full length (the cap is set on the host or any ancestor; it is 12 rem here to show it). Press the states.',
                markup: `
<div class="kp-stack kp-gap-md" id="doc-fp-availability">
<div class="kp-row kp-gap-sm" role="group" aria-label="State">
<button type="button" class="kp-button kp-button--sm" data-doc-state="ready">Ready</button>
<button type="button" class="kp-button kp-button--sm" data-doc-state="loading">Loading</button>
<button type="button" class="kp-button kp-button--sm" data-doc-state="empty">Empty</button>
<button type="button" class="kp-button kp-button--sm" data-doc-state="error">Failed</button>
</div>
<div class="kp-availability" data-kp-availability id="doc-fp-availability-host" aria-label="Who can come" style="--kp-footprint-max: 14rem"></div>
</div>
`,
                script: `
import { attachAvailability, setAvailability } from '@kp-soft/themes/js/availability';
const root = document.getElementById('doc-fp-availability');
const host = document.getElementById('doc-fp-availability-host');
attachAvailability(root);
const spec = {
    columns: [{ key: 'a', label: '1 to 3 May' }, { key: 'b', label: '8 to 10 May' }, { key: 'c', label: '15 to 17 May' }],
    people: [{ id: 'me', name: 'Anna', mine: true }, { id: 'bo', name: 'Bo' }, { id: 'cy', name: 'Cy' }, { id: 'di', name: 'Di' }],
    answers: { me: { a: 'yes', b: 'maybe', c: 'no' }, bo: { a: 'yes', b: 'yes', c: 'no' }, cy: { a: 'maybe', b: 'yes', c: 'yes' }, di: { a: 'yes', b: 'no', c: 'yes' } },
};
const draw = (state) => setAvailability(host, state === 'ready' ? spec : { columns: spec.columns, people: [], answers: {}, state, message: state === 'empty' ? 'Nobody is invited yet.' : 'The answers could not be read.' });
for (const button of root.querySelectorAll('[data-doc-state]')) {
    button.addEventListener('click', () => draw(button.dataset.docState));
}
draw('ready');
`,
            },
        ],
        variants: [
            { name: 'a row with answers', what: 'A person’s row with answers (the menu of can, maybe and cannot, the saved and the refused marks) stays inside the grid: the row never grows past the component’s width, and the answers wrap under their names on a narrow grid. Loading, empty and failed hold the height the grid had.' },
            { name: 'data-kp-heat-edit', what: '`own` (default), `all` or `off`: whose cells a press changes.' },
            { name: 'data-kp-availability-answers', what: '`3` (can, maybe, cannot; default) or `2`.' },
            { name: 'data-kp-availability-press', what: '`menu` (default: a press opens the answers) or `cycle`.' },
            { name: 'data-kp-availability-paint', what: 'Drag across your row to give the same answer; `false` turns it off.' },
            { name: 'data-kp-availability-best', what: '`most` (default: most who can, once everybody answered), `everyone` (only where everybody can) or `none`.' },
            { name: 'data-kp-availability-best-rule', what: '`yes-count` (default: most who can first) or `no-nobody` (fewest who cannot first).' },
            { name: 'data-kp-availability-unit-switch', what: '`on` or `off`: the organiser\u2019s switch between periods and days, overriding `canSwitchUnit` of the spec; absent, the spec decides.' },
            { name: 'data-kp-availability-quorum', what: 'How many must answer a column before it can be best (default everybody).' },
            { name: 'data-kp-availability-window', what: 'In day mode, the best stretch of this many days is marked.' },
            { name: 'data-kp-availability-sort', what: '`mine-first` (default), `given` or `answered-first`.' },
            { name: 'data-kp-availability-summary', what: '`both` (default), `count` or `bar`.' },
            { name: 'data-kp-availability-choose', what: 'Present: the best column offers Choose these dates (off by default).' },
            { name: 'data-kp-availability-locked', what: 'Column keys nobody can change any more.' },
            { name: 'data-kp-availability-narrow', what: '`scroll` (default) or `by-column`, a list per column on a phone.' },
            { name: 'data-kp-availability-undo-ms', what: 'Undo after a stroke (6000).' },
            { name: 'data-kp-availability-density', what: '`comfortable` (default) or `compact` cells.' },
        ],
        accessibility: [
            'Built in — every answer is a glyph and a word as well as a tone; each cell is named by person, column and answer; changes and a refusal are announced politely; y, m, n and Backspace set an answer on your own row.',
            'Yours — answer `kp-availability-change` with `detail.settle(promise)` and say which person is yours (`mine: true`).',
        ],
    };
