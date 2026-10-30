// Page descriptor for the "gantt" documentation page [AR19]; the shape is pinned in ./types.mjs.

/** @type {import('./types.mjs').Descriptor} */
export const ganttDescriptor = {
        id: 'gantt',
        title: 'Run timeline',
        group: 'Data',
        classes: ['kp-gantt'],
        aliases: ['active', 'out', 'cluster', 'clustered', 'lane-key', 'lane-zone', 'name', 'planned', 'shape', 'zone'],
        exports: [],
        intro: 'One bar per run on a time axis, a lane per job, stack or host, and a line for now. `attachGantts(root)` in js/gantt.js fills `section.kp-gantt[data-kp-gantt]` with range buttons (`data-kp-gantt-ranges`, the one in force in `data-kp-gantt-range`), a Live button and the selected range; the page gives the lanes and the runs (`setGanttRuns`) and the state of the whole (`setGanttState`). A run is `queued` (dashed and hollow, from queueing to now), `running` (striped and growing to now), `ok` (solid) or `failed` (solid, taller, with a cap and a cross): the tone is never the only carrier. A running bar is placed by one custom property that moves every second, so the page repaints nothing. While the window is Live its right edge follows now (`data-kp-gantt-live`); dragging across the plot selects a range, shown in a chip with Zoom and Clear (`data-kp-gantt-zoom`, `data-kp-gantt-clear`). `data-kp-gantt-ghosts="2 3 2 1"` sets the rows of the loading lanes so loading and loaded are as tall.',
        whenToUse:
            'When a reader asks what ran when, how long it took and what failed: operations of the last hours or days, per job. Not for what will run (use the week agenda) and not for a series of values (use the chart).',
        examples: [
            {
                title: 'Operations of the last six hours',
                why: 'The markup is the empty frame with its ranges; the script builds the axis, the lanes and the bars from the runs the page hands over: a finished run, a failed one, one still running and one queued. Drag across the plot to select a range.',
                markup: `
<section class="kp-gantt" data-kp-gantt data-kp-gantt-ranges="1h 6h 24h 7d" data-kp-gantt-range="6h" data-kp-gantt-ghosts="2 1" aria-label="Operations of the last 6 hours"></section>
`,
                script: `
import { attachGantts, setGanttRuns } from '@kp-soft/themes/js/gantt';

const MIN = 60_000;
const now = Date.now();
const ago = (minutes) => now - minutes * MIN;
const timeline = document.querySelector('[data-kp-gantt]');
attachGantts(timeline.parentElement);
setGanttRuns(
    timeline,
    [
        { id: 'backup', lane: 'nightly', label: 'Backup photos', start: ago(300), end: ago(240), state: 'ok' },
        { id: 'prune', lane: 'nightly', label: 'Prune snapshots', start: ago(220), end: ago(190), state: 'failed', detail: 'The target disk was full.' },
        { id: 'update', lane: 'updates', label: 'Update images', start: ago(150), end: ago(95), state: 'ok' },
        { id: 'verify', lane: 'updates', label: 'Verify backups', start: ago(40), state: 'running' },
        { id: 'next', lane: 'nightly', label: 'Backup photos', start: ago(8), state: 'queued' },
    ],
    [
        { id: 'nightly', label: 'Nightly round' },
        { id: 'updates', label: 'Updates' },
    ],
);
`,
            },
            {
                title: 'A week of runs, by series, with the days on the axis',
                why: '`data-kp-gantt-days` turns every day named on the axis into a button that selects that whole day, with the chip, Zoom and Clear; `kp-gantt-select` then carries `source: "day"` and the `day`. A finished run’s `series` (1 to 5) inks it in the chart colours instead of the success colour, and `setGanttLegend` names the series after the states; a failed run keeps its own look, so the state still reads first.',
                markup: `
<section class="kp-gantt" data-kp-gantt data-kp-gantt-days data-kp-gantt-ranges="24h 7d" data-kp-gantt-range="7d" data-kp-gantt-ghosts="2 1" aria-label="Operations of the last 7 days"></section>
`,
                script: `
import { attachGantts, setGanttLegend, setGanttRuns } from '@kp-soft/themes/js/gantt';

const HOUR = 3_600_000;
const midnight = new Date();
midnight.setHours(0, 0, 0, 0);
const runs = [];
for (let day = 6; day >= 0; day -= 1) {
    const start = midnight.getTime() - day * 24 * HOUR;
    runs.push({ id: 'backup-' + day, lane: 'nightly', label: 'Backup photos', start: start + 2 * HOUR, end: start + 3 * HOUR, state: day === 3 ? 'failed' : 'ok', series: 1 });
    if (day % 3 === 0) runs.push({ id: 'update-' + day, lane: 'updates', label: 'Update images', start: start + 4.5 * HOUR, end: start + 6 * HOUR, state: 'ok', series: 2 });
}
const el = document.querySelector('[data-kp-gantt-days]');
attachGantts(el.parentElement);
setGanttRuns(el, runs, [
    { id: 'nightly', label: 'Nightly round' },
    { id: 'updates', label: 'Updates' },
]);
setGanttLegend(el, [
    { series: 1, label: 'Nightly round' },
    { series: 2, label: 'Updates' },
]);
`,
            },
            {
                title: 'While it loads',
                why: '`setGanttState(el, "loading")` draws the lanes’ ghosts at their final height and stands the data table’s own loading card (the theme’s spinner and “Reading the history”) over them, the toolbar, axis and lane names beside it; the runs are drawn once the card has left. `error` and `empty` put their words over the plot.',
                markup: `
<section class="kp-gantt" data-kp-gantt data-kp-gantt-ranges="1h 6h 24h 7d" data-kp-gantt-ghosts="2 1" data-kp-doc-loading aria-label="Operations, loading"></section>
`,
                script: `
import { attachGantts, setGanttState } from '@kp-soft/themes/js/gantt';

const timeline = document.querySelector('[data-kp-doc-loading]');
attachGantts(timeline.parentElement);
setGanttState(timeline, 'loading');
`,
            },
            {
                title: 'Moments instead of runs: points, kinds and zones',
                why: 'A point is a moment, not a stretch: `setGanttPoints(el, points, lanes)` puts a mark in its lane, and `setGanttKinds(el, kinds)` names each kind in the legend with a shape (`dot`, `diamond`, `square`, `triangle`, `ring`) and a colour (`series` 1 to 5, or a `tone`). A point that is `planned` is hollow. `setGanttZones(el, zones)` lays a thin band in one lane (waiting since the last contact) or, without a `lane`, a band behind every lane (the holiday), named in the legend. A lane with `href` is a link and `sub` is a second line under its name. The range word `all` fits everything on the timeline and now and stays fitted when the data changes; the timeline has no runs, so the run states leave the legend. Marks closer than the eye can tell apart become one mark with a count (“+2”) whose card names them all; opening it fires `kp-gantt-open` with every point in `points`.',
                markup: `
<div class="kp-stack">
<section class="kp-gantt" data-kp-gantt data-kp-gantt-points data-kp-gantt-ranges="all 24h 7d" data-kp-gantt-range="all" aria-label="Contacts per application" data-doc-points></section>
<p class="kp-text-muted" data-doc-points-said role="status">Open a mark to see what it stands for.</p>
</div>
`,
                script: `
import { attachGantts, setGanttKinds, setGanttPoints, setGanttZones } from '@kp-soft/themes/js/gantt';

const DAY = 86_400_000;
const today = new Date();
today.setHours(10, 0, 0, 0);
const at = (days) => today.getTime() + days * DAY;

const timeline = document.querySelector('[data-doc-points]');
attachGantts(timeline.parentElement);

setGanttKinds(timeline, [
    { kind: 'applied', label: 'applied', shape: 'dot', series: 2 },
    { kind: 'mail', label: 'mail', shape: 'square', series: 1 },
    { kind: 'contact', label: 'contact', shape: 'diamond', series: 3 },
    { kind: 'interview', label: 'interview', shape: 'triangle', series: 4 },
    { kind: 'follow', label: 'follow-up', shape: 'ring', tone: 'info' },
]);
setGanttZones(timeline, [
    { lane: 'acme', from: at(-7), to: today.getTime(), label: 'waiting for an answer' },
    { from: at(3), to: at(10), label: 'recruiters away (autumn holiday)', tone: 'muted' },
]);
setGanttPoints(
    timeline,
    [
        { id: 'a1', lane: 'acme', at: at(-13), kind: 'applied', label: 'Acme Analytics: applied' },
        { id: 'a2', lane: 'acme', at: at(-7), kind: 'mail', label: 'Acme Analytics: received, in review' },
        { id: 'a3', lane: 'acme', at: at(-7), kind: 'contact', label: 'Acme Analytics: short call with the hiring manager' },
        { id: 'c1', lane: 'corvid', at: at(-20), kind: 'applied', label: 'Corvid Systems: applied' },
        { id: 'c2', lane: 'corvid', at: at(-12), kind: 'contact', label: 'Corvid Systems: call with the team lead' },
        { id: 'c3', lane: 'corvid', at: at(4), kind: 'interview', label: 'Corvid Systems: interview, second round', planned: true },
        { id: 'c4', lane: 'corvid', at: at(11), kind: 'follow', label: 'Corvid Systems: follow-up', planned: true },
    ],
    [
        { id: 'acme', label: 'Senior UI engineer', sub: 'Acme Analytics', href: '#acme' },
        { id: 'corvid', label: 'Senior frontend engineer', sub: 'Corvid Systems', href: '#corvid' },
    ],
);
timeline.addEventListener('kp-gantt-open', (event) => {
    document.querySelector('[data-doc-points-said]').textContent =
        'Opened: ' + event.detail.points.map((point) => point.label).join(' · ');
});
`,
            },
            {
                title: 'One lane as a dated line',
                why: '`kp-gantt--line` is one lane with no toolbar, no lane names, no hint and no brush, the axis under the line, fitted to its data: the dated line under a journey stepper (see the step list). Add `data-kp-gantt-points` and give it points and kinds as above.',
                markup: `
<div class="kp-gantt kp-gantt--line" data-kp-gantt data-kp-gantt-points aria-label="What happened when, Northwind Logistics" data-doc-line></div>
`,
                script: `
import { attachGantts, setGanttKinds, setGanttPoints } from '@kp-soft/themes/js/gantt';

const DAY = 86_400_000;
const today = new Date();
today.setHours(10, 0, 0, 0);
const at = (days) => today.getTime() + days * DAY;

const line = document.querySelector('[data-doc-line]');
attachGantts(line.parentElement);
setGanttKinds(line, [
    { kind: 'applied', label: 'applied', shape: 'dot', series: 2 },
    { kind: 'contact', label: 'contact', shape: 'diamond', series: 3 },
    { kind: 'interview', label: 'interview', shape: 'triangle', series: 4 },
]);
setGanttPoints(
    line,
    [
        { id: 'n1', lane: 'northwind', at: at(-21), kind: 'applied', label: 'Applied' },
        { id: 'n2', lane: 'northwind', at: at(-9), kind: 'contact', label: 'Call with the recruiter' },
        { id: 'n3', lane: 'northwind', at: at(-2), kind: 'interview', label: 'Interview at the office' },
    ],
    [{ id: 'northwind', label: 'Northwind Logistics' }],
);
`,
            },
        ],
        variants: [
            { name: 'data-kp-gantt', what: 'Marks the timeline; `attachGantts` fills it.' },
            { name: 'data-kp-gantt-ranges', what: 'The range buttons, space separated: `1h 6h 24h 7d`.' },
            { name: 'data-kp-gantt-range', what: 'The range in force; it decides how much time the window shows.' },
            { name: 'data-kp-gantt-live', what: 'On the Live button, pressed while the window follows now.' },
            { name: 'data-kp-gantt-zoom', what: 'On the Zoom button of the selection chip: the window becomes the selected range and stops following now.' },
            { name: 'data-kp-gantt-clear', what: 'On the Clear button of the selection chip: the selection is lifted.' },
            { name: 'data-kp-gantt-ghosts', what: 'The rows of each loading lane, space separated, so loading and loaded are as tall.' },
            { name: 'data-kp-gantt-id', what: 'On a bar: the id the page gave the run; reported when it is opened.' },
            { name: 'data-kp-state', what: 'On a bar: `queued`, `running`, `ok` or `failed`. On the timeline: `loading`, `empty` or `error`.' },
            { name: 'data-kp-active', what: 'On the selection chip while a range is selected.' },
            { name: 'data-kp-out', what: 'On the now-line when now lies outside the window; it is hidden.' },
            { name: 'data-kp-gantt-edge', what: 'On an axis label too close to the end edge for its name: an hour label stands before its rule and ends at it in a register that flips it; a day button stands against the end, whole.' },
            { name: 'data-kp-gantt-days', what: 'Opt-in: each day named on the axis is a button (one tab stop, arrows, Home and End between them) that selects that whole day, 00:00 to 00:00 in the zone, as a brush would. It is `aria-pressed` while it is the selection and lifts it when pressed again; a window too short to hold a midnight names no day. `data-kp-gantt-crowded` marks an axis whose day names would touch, so they thin out.' },
            { name: 'series', what: 'On a run (`GanttRun.series`, 1 to 5): a finished run is inked in `--chart-1` to `--chart-5` instead of the success colour. Failed, running and queued keep their own look. `setGanttLegend(el, [{ series, label }])` names the series after the states; none takes them away.' },
            { name: 'setGanttRuns / setGanttState / setGanttWindow / setGanttSelection', what: 'The page’s calls: the lanes and runs (repainted in place by id), the state of the whole, the window (`{ span, live, to }`, no event) and a selected range (`{ from, to }` or null).' },
            { name: 'the busy card', what: 'While loading, the data table’s loading card (`js/busy-card.js`) stands centred over the lanes, flat over a short area, and the runs are drawn once it has left.' },
            { name: 'a register’s repairs', what: 'A register may hang the end-edge axis label inside the plot (the flip knob) and give an empty or failed timeline’s sentence a plate of its own (the state-ground knob); both are in the knobs below, and formal leaves them as they were approved.' },
            { name: 'setGanttPoints / setGanttKinds / setGanttZones', what: 'Moments instead of runs [kpadopt4]: a point (`id`, `lane`, `at`, `kind`, `label`, `detail`, `planned`) is a `.kp-gantt__point` mark in its lane, in the colour and shape of its kind (`data-kp-shape` dot, diamond, square, triangle or ring; `data-kp-series` or `data-kp-tone`), hollow when `data-kp-planned`. A kind is named in the legend (`.kp-gantt__mark`); the run states leave the legend when there are no runs. A zone is a thin band in its lane (`data-kp-lane-zone`) or a band behind every lane, named in the legend (`.kp-gantt__band`); `data-kp-zone` carries its id.' },
            { name: 'data-kp-cluster / data-kp-clustered', what: 'Marks closer than the eye can tell apart: the first carries the number it stands for and a count plate (`.kp-gantt__count`, “+2”), its name and card name them all; the others are `data-kp-clustered` and step aside. Opening it reports every point in `points`.' },
            { name: 'data-kp-name / data-kp-card', what: 'Written on a mark: its own accessible name and card words, which a mark with a count joins.' },
            { name: 'data-kp-gantt-points', what: 'On the timeline: its hint speaks of marks, not bars.' },
            { name: 'all', what: 'A range word: the window fits everything on the timeline and now, and stays fitted while the data changes.' },
            { name: 'href / sub', what: 'A lane with `href` is a link (`.kp-gantt__lane-link`); `sub` is a second line under its name (`.kp-gantt__sub`), and the lanes grow to hold it. `data-kp-lane-key` on the name is what it was drawn from.' },
            { name: '.kp-gantt--line', what: 'One lane, no toolbar, no lane names, no hint and no brush, the axis under the line, fitted to its data: the dated line under a journey stepper.' },
            { name: 'data-kp-gantt-legend', what: '`auto` (the states the runs use) or a list of states: a legend under the plot, one chip per state with its mark.' },
            { name: 'plannedEnd and data-kp-gantt-rest="off"', what: 'A run may carry `plannedEnd`: the bar’s rest stretches from where it is to where it was expected to end. `data-kp-gantt-rest="off"` leaves the stretch out. The registers draw the stretch in the base planned look only; a theme pass has not been asked for.' },
            { name: 'data-kp-gantt-scroll', what: '`off` or `always`: with the least plot width (a knob) the frame scrolls sideways instead of squeezing the bars.' },
            { name: 'lane names and the frame', what: 'The name column is as wide as its longest name up to 40% of the box or 14rem and the least width is a knob; a lane name wraps and is never cut, and its first line stands level with the lane’s first row. A lane’s own stretch stands on the foot of the first row. The frame shows whole lanes under its height knob and a scroll rests on a lane; a queued bar is hollow on the card’s ground.' },
        ],
        accessibility: [
            'Built in — one tab stop: left and right move along a lane, up and down to the nearest bar of the neighbouring lane, Home and End to the lane’s first and last, Enter and Space open the run; range, Live, Zoom and Clear are buttons.',
            'Built in — every bar has an accessible name with its label, state and times; a run that changes state is announced in a polite status region.',
            'Yours — give the timeline a name (`aria-label`), name every run so it reads without its colour, and give the new runs when the window moves.',
            'Built in — a lane name wraps and is never cut, so it can be read at any width and at any zoom.',
        ],
    };
