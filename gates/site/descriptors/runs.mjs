// Page descriptor for the "runs" documentation page [AR19]; the shape is pinned in ./types.mjs.

/** @type {import('./types.mjs').Descriptor} */
export const runsDescriptor = {
        id: 'runs',
        title: 'Next times',
        group: 'Data',
        classes: ['kp-runs'],
        exports: [],
        aliases: ['now'],
        intro: 'The next times a schedule will run, one to a row: the time with its weekday (dd/mm/yyyy HH:MM, Europe/Brussels), how far away it is, and a mark where the clock is turned before a run or the page names a conflict. The page computes the times; the package draws them, in the same height in every state.',
        whenToUse: 'Under a schedule or repeat, so the person sees what the setting really does. For a run history use the run timeline.',
        examples: [
            {
                title: 'Three nights, with the clock turned back',
                why: 'The app owns the rule and computes the times; the package draws them: the time with its weekday (dd/mm/yyyy HH:MM, Europe/Brussels), how far away it is, and a mark where the clock is turned before a run (“Clock goes back 1 h”: the wall time is the schedule’s, the moment is not the same distance from the run before) or the page names a conflict (`{ at, conflict }`). `data-kp-now` fixes the clock here so the words stay the same; the real page leaves it out and the relative words refresh every minute. A time is a number (ms), an ISO string or a Date.',
                markup: `
<div class="kp-runs" id="doc-runs" data-kp-runs data-kp-runs-count="3" data-kp-now="2026-10-23T12:00:00+02:00" data-kp-runs-more="2"></div>
`,
                script: `
import { attachRuns, setRuns } from '@kp-soft/themes/js/runs';

const list = document.getElementById('doc-runs');
attachRuns(list.parentElement);
setRuns(list, [
    '2026-10-24T02:30:00+02:00',
    { at: '2026-10-25T02:30:00+02:00', conflict: 'Overlaps the backup of vault' },
    '2026-10-26T02:30:00+01:00',
    '2026-10-27T02:30:00+01:00',
    '2026-10-28T02:30:00+01:00',
]);
`,
            },
            {
                title: 'Empty, loading and failed, in the same height',
                why: 'All four states keep the footprint of `count` rows, so nothing under the list moves. `setRuns(el, [], { reason })` is the empty state: the app’s reason, centred at heading size in the package’s empty plate. `setRunsState(el, "loading")` lays the theme’s busy card over placeholder rows. `error` says “Could not work out the next times” with Try again, which fires `kp-runs-retry`. `data-kp-runs-title` renames the heading, `data-kp-runs-relative="false"` leaves “in 2 days” out, `data-kp-runs-warn="false"` the marks, and `data-kp-time-zone` names another zone.',
                markup: `
<div class="kp-runs" id="doc-runs-empty" data-kp-runs data-kp-runs-count="3" data-kp-runs-title="Next backups"></div>
<div class="kp-runs" id="doc-runs-loading" data-kp-runs data-kp-runs-count="3" data-kp-runs-relative="false"></div>
<div class="kp-runs" id="doc-runs-failed" data-kp-runs data-kp-runs-count="3" data-kp-time-zone="America/New_York" data-kp-runs-warn="false"></div>
`,
                script: `
import { attachRuns, setRuns, setRunsState } from '@kp-soft/themes/js/runs';

const empty = document.getElementById('doc-runs-empty');
const loading = document.getElementById('doc-runs-loading');
const failed = document.getElementById('doc-runs-failed');
attachRuns(empty.parentElement);
setRuns(empty, [], { reason: 'Pick at least one weekday.' });
setRunsState(loading, 'loading');
setRunsState(failed, 'error');
failed.addEventListener('kp-runs-retry', () => {
    setRunsState(failed, 'loading');
    setTimeout(() => setRuns(failed, [Date.now() + 86400000, Date.now() + 2 * 86400000]), 1200);
});
`,
            },
        ],
        variants: [
            { name: 'data-kp-runs-title', what: 'The heading over the list (“Next times”).' },
            { name: 'setRuns / setRunsState', what: '`setRuns(el, times, { reason })` draws the rows, or the empty state with the reason when there are none; `setRunsState(el, "loading" | "error" | ...)` the other states. `runs(el)` gives the rows drawn.' },
            { name: 'runsRelative / runMoment / clockShift / zoneOffset', what: 'The pieces the list is made of: how far away a time is in words, a time as the list writes it, whether the clock turned between two runs and a zone’s offset at a moment.' },
            { name: 'kp-runs-retry', what: 'Try again on a failed list was pressed (`RUNS_RETRY_EVENT`).' },
            { name: 'data-kp-runs-count', what: 'How many rows; 3 by default.' },
            { name: 'data-kp-runs-relative', what: '`false` leaves the “in 2 days” out.' },
            { name: 'data-kp-runs-warn', what: '`false` leaves the clock-change and conflict marks out.' },
            { name: 'data-kp-runs-more', what: 'N: a “Show N more” for times past the count.' },
            { name: 'data-kp-time-zone', what: 'The zone the times are written in; Europe/Brussels by default.' },
            { name: 'data-kp-now', what: 'A fixed clock (ISO) for a demo or a test.' },
            { name: 'data-kp-state', what: '`loading` at first; the script writes `ready`, `empty`, `loading` and `error`.' },
        ],
        accessibility: [
            'Built in — each time is a `<time>` with its datetime; a status region says the first run when it changes; the failed state is an alert.',
            'Yours — word the reason of an empty list (“Pick at least one weekday”) and the conflicts, and name the list after the schedule.',
        ],
    };
