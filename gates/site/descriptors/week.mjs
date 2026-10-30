// Page descriptor for the "week" documentation page [AR19]; the shape is pinned in ./types.mjs.

/** @type {import('./types.mjs').Descriptor} */
export const weekDescriptor = {
        id: 'week',
        title: 'Week agenda',
        group: 'Data',
        classes: ['kp-week'],
        aliases: ['past', 'overflow', 'today'],
        exports: [],
        intro: 'Seven day columns with the items of the week placed at their time of day: a nightly backup at 02:00, a host round at 03:30. `attachWeeks(root)` in js/week.js fills `section.kp-week[data-kp-week]` with the head of each day, an hour axis and one pill per item; the page gives the items (`setWeekEvents`) and the state of the whole (`setWeekState`). `data-kp-week-start` is the first day (`YYYY-MM-DD`, else today), `data-kp-week-days` how many columns, `data-kp-week-nav` adds the week buttons. A pill has a series colour (1 to 5) and a state: `next` is ringed, `off` and `skipped` muted and struck through, `reference` dashed and not a button. A column holds as many pills as fit; the rest fold into a `+N` menu button (`data-kp-overflow` marks the folded ones). Below 40rem the columns become rows and every item is shown. A line across today’s column is now; items already past carry `data-kp-past`.',
        whenToUse:
            'When a reader asks what runs when over the next days: schedules, rounds, bookings. Not for a month (use the calendar), not for what already ran (use the run timeline) and not for one list in time order (use the timeline).',
        examples: [
            {
                title: 'An agenda for the next seven days',
                why: 'The markup is the empty frame; the script builds the days and the pills from the items the page hands over. Two series, a ringed next run, a muted one that is off, a dashed reference and a legend: the page’s part is printed below.',
                markup: `
<section class="kp-week" data-kp-week data-kp-week-nav aria-label="Runs in the next 7 days"></section>
`,
                script: `
import { attachWeeks, setWeekEvents, setWeekLegend } from '@kp-soft/themes/js/week';

const agenda = document.querySelector('[data-kp-week]');
attachWeeks(agenda.parentElement);
const at = (days, hours, minutes) => {
    const moment = new Date();
    moment.setDate(moment.getDate() + days);
    moment.setHours(hours, minutes, 0, 0);
    return moment.getTime();
};
const events = [];
for (let day = 0; day < 7; day += 1) {
    events.push({ id: 'backup-' + day, start: at(day, 2, 0), label: 'Backup photos', series: 1, detail: 'Nightly, keeps 14 copies' });
    events.push({ id: 'host-' + day, start: at(day, 3, 30), label: 'Host round', series: 3, state: 'reference' });
    if (day % 3 === 0) events.push({ id: 'update-' + day, start: at(day, 4, 30), label: 'Update images', series: 2 });
}
events.push({ id: 'report', start: at(1, 7, 30), label: 'Mail the report', series: 2, state: 'next' });
events.push({ id: 'scrub', start: at(2, 13, 0), label: 'Scrub the pool', series: 4, state: 'off' });
setWeekEvents(agenda, events);
setWeekLegend(agenda, [
    { series: 1, label: 'Nightly round' },
    { series: 2, label: 'Updates' },
    { series: 4, label: 'Housekeeping' },
]);
`,
            },
            {
                title: 'On a phone: the next eight items',
                why: '`data-kp-week-upcoming="8"` makes the agenda, once it is narrower than 40rem, a list of the next eight items instead of seven day rows: one row per item, its day on the left (named once for a run of the same day, Today for today) and its own pill on the right. An item that is off, skipped or only a reference is not one, and a passed item leaves the list on the next tick. `data-kp-week-upcoming-label` names the list and `data-kp-week-upcoming-empty` is what it says when nothing is left. The box here is 26rem wide, so it shows what a phone shows.',
                markup: `
<div style="max-inline-size: 26rem">
<section class="kp-week" data-kp-week data-kp-week-upcoming="8" data-kp-week-upcoming-label="The next runs" data-kp-week-upcoming-empty="Nothing is scheduled." aria-label="Runs in the next 7 days"></section>
</div>
`,
                script: `
import { attachWeeks, setWeekEvents } from '@kp-soft/themes/js/week';

const agenda = document.querySelector('[data-kp-week-upcoming]');
attachWeeks(agenda.parentElement);
const at = (days, hours, minutes) => {
    const moment = new Date();
    moment.setDate(moment.getDate() + days);
    moment.setHours(hours, minutes, 0, 0);
    return moment.getTime();
};
const events = [];
for (let day = 0; day < 7; day += 1) {
    events.push({ id: 'backup-' + day, start: at(day, 2, 0), label: 'Backup photos', series: 1 });
    if (day % 2 === 0) events.push({ id: 'report-' + day, start: at(day, 18, 30), label: 'Mail the report', series: 2 });
}
events.push({ id: 'off', start: at(1, 12, 0), label: 'Scrub the pool', series: 4, state: 'off' });
setWeekEvents(agenda, events);
`,
            },
        ],
        variants: [
            { name: 'data-kp-week', what: 'Marks the agenda; `attachWeeks` fills it.' },
            { name: 'data-kp-week-start', what: 'The first day, `YYYY-MM-DD`; without it, today in the time zone.' },
            { name: 'data-kp-week-days', what: 'How many day columns the range has (7).' },
            { name: 'data-kp-week-nav', what: 'Adds the row of week buttons: previous, today and next (`data-kp-week-prev`, `data-kp-week-today`, `data-kp-week-next` mark them); a press sends the new range to the page.' },
            { name: 'data-kp-week-mode', what: 'The layout in force: `grid` (columns) or `list` (rows below 40rem); read from the stylesheet, not written by the page.' },
            { name: 'data-kp-state', what: 'On a pill: `next`, `off`, `skipped` or `reference`. On the agenda: `loading`, `empty` or `error`.' },
            { name: 'data-kp-series', what: 'On a pill: 1 to 5, the colour from `--chart-1` to `--chart-5`; the label carries the meaning.' },
            { name: 'data-kp-past', what: 'On a pill whose time has passed; it is muted.' },
            { name: 'data-kp-overflow', what: 'On a pill folded into the `+N` menu of a full column.' },
            { name: 'setWeekEvents / setWeekState / setWeekStart / setWeekLegend', what: 'The page’s four calls: the items (repainted in place by id, so a pill keeps its focus), the state of the whole (`loading` draws the data table’s busy card over the empty days; `empty`, `error` with its words), a new first day, and the legend under the agenda.' },
            { name: 'data-kp-week-upcoming', what: 'Opt-in: below 40rem the agenda lists the next items (the number given) instead of its day rows, one row per item.' },
            { name: 'data-kp-week-upcoming-label / -empty', what: 'The list’s name for a screen reader, and its sentence when nothing is still to come (else the dictionary’s `weekEmpty`).' },
            { name: '.kp-week__upcoming / __next', what: 'The list and one row of it. A row carries `data-kp-day-start` when it opens its day and `data-kp-today` for today; `.kp-week__next--empty` and `.kp-week__none` are the sentence of an empty list.' },
        ],
        accessibility: [
            'Built in — one tab stop: arrow up and down move within a day, left and right to the neighbouring day (the item nearest in time), Home and End to the day’s first and last, Enter and Space open the item.',
            'Built in — every pill is a button named by its time and label; the now-line has an accessible name with the time; the `+N` button opens a menu of the folded items.',
            'Yours — give the agenda a name (`aria-label`), keep the label of every item short and meaningful without its colour, and give the new items when the range changes.',
        ],
    };
