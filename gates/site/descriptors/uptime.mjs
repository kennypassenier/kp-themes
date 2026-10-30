// Page descriptor for the "uptime" documentation page [AR19]; the shape is pinned in ./types.mjs.

/** @type {import('./types.mjs').Descriptor} */
export const uptimeDescriptor = {
        id: 'uptime',
        title: 'Uptime strip',
        group: 'Data',
        classes: ['kp-uptime'],
        exports: [],
        intro: 'One thin strip of cells, one per period (90 days, 48 hours), each toned up, degraded (ruled), down (striped) or no data (an empty frame), with the window’s summary over it in exact figures and the first and the latest period’s names under it. `setUptime(el, { label, periods, from, to, state })` in js/uptime.js draws it; until then the strip waits as skeleton cells under the data table’s busy card. The share is cut to one decimal and never rounded up; the incident count is the number. On a narrow page the strip shows the latest periods that fit and says how many; `data-kp-uptime-fit="scroll"` keeps every period and scrolls.',
        whenToUse:
            'When a reader asks how a service or a queue did over the last days or hours, at a glance, with the detail of any period on hover. Not for a series of values (use the chart) and not for many services by many days at once (use the heat grid).',
        examples: [
            {
                title: 'A service over 90 days',
                why: 'The markup is the empty strip with its name and its number of periods; before the script draws it, the strip waits as the theme’s skeleton under the data table’s loading card. `setUptime(el, { label, periods })` draws one cell per period, oldest first, toned up, degraded (ruled), down (striped) or none (an empty frame). The summary above is exact: the share is cut, never rounded up, and the incident count is the number. A period’s share is its `uptime` (0 to 1) when measured, else 1 for up and degraded and 0 for down; its incidents are `incidents`, else 1 for a degraded or down period. Hover or focus a cell for its card; a press fires `kp-uptime-pick`.',
                markup: `
<div class="kp-uptime" id="doc-uptime" data-kp-uptime data-kp-uptime-label="jellyfin" data-kp-uptime-count="90"></div>
<p class="kp-text-muted" id="doc-uptime-said" role="status">No period picked.</p>
`,
                script: `
import { attachUptimes, setUptime } from '@kp-soft/themes/js/uptime';

const strip = document.getElementById('doc-uptime');
attachUptimes(strip.parentElement);
const day = (back) => {
    const date = new Date(Date.UTC(2026, 9, 17) - back * 86400000);
    return { key: date.toISOString().slice(0, 10), label: String(date.getUTCDate()).padStart(2, '0') + '/' + String(date.getUTCMonth() + 1).padStart(2, '0') + '/' + date.getUTCFullYear() };
};
const periods = [];
for (let back = 89; back >= 0; back--) {
    const state = back === 12 ? 'down' : back === 40 || back === 41 || back === 63 ? 'degraded' : back > 84 ? 'none' : 'up';
    periods.push({ ...day(back), state, uptime: state === 'down' ? 0.82 : state === 'degraded' ? 0.97 : undefined });
}
setUptime(strip, { label: 'jellyfin', periods });
strip.addEventListener('kp-uptime-pick', (event) => {
    document.getElementById('doc-uptime-said').textContent = 'Picked ' + event.detail.period.label + ' (' + event.detail.period.state + ').';
});
`,
            },
            {
                title: 'The four states, and a strip that scrolls',
                why: 'Each state keeps the strip’s footprint, so nothing moves between them: `loading` (skeleton cells under the data table’s loading card), `empty` (every cell without data, the summary says so), `error` (the summary carries the page’s sentence on the destructive plate) and `ready`. `data-kp-uptime-fit="scroll"` keeps every period on a narrow page and scrolls sideways from the latest, with a fading edge on the side that has more; without it the strip shows the latest periods that fit and says how many (“55 of 90 shown”). `data-kp-uptime-state` in the markup is the state the strip starts in.',
                markup: `
<div class="kp-uptime" id="doc-uptime-loading" data-kp-uptime data-kp-uptime-label="jellyfin, loading" data-kp-uptime-count="48"></div>
<div class="kp-uptime" id="doc-uptime-empty" data-kp-uptime data-kp-uptime-label="jellyfin, empty" data-kp-uptime-count="48"></div>
<div class="kp-uptime" id="doc-uptime-failed" data-kp-uptime data-kp-uptime-label="jellyfin, failed" data-kp-uptime-count="48"></div>
<div class="kp-uptime" id="doc-uptime-scroll" data-kp-uptime data-kp-uptime-fit="scroll" data-kp-uptime-label="queue, 48 hours" data-kp-uptime-count="48"></div>
`,
                script: `
import { attachUptimes, setUptime } from '@kp-soft/themes/js/uptime';

attachUptimes(document.getElementById('doc-uptime-loading').parentElement);
const hours = [];
for (let back = 47; back >= 0; back--) {
    const hour = (((14 - back) % 24) + 24) % 24;
    hours.push({ key: 'h' + back, label: String(hour).padStart(2, '0') + ':00', state: back === 20 ? 'degraded' : back === 7 ? 'down' : 'up' });
}
setUptime(document.getElementById('doc-uptime-loading'), { state: 'loading' });
setUptime(document.getElementById('doc-uptime-empty'), { state: 'empty', periods: [] });
setUptime(document.getElementById('doc-uptime-failed'), { state: 'error', message: 'The checks could not be read.' });
setUptime(document.getElementById('doc-uptime-scroll'), { periods: hours });
`,
            },
            {
                title: 'A cell that opens its period: a link, or quick info',
                why: 'A cell can open something. A period with `href` is a link to that period’s own page: a press, Enter or Space follows it (the hover card stays). `open: "info"` (or `data-kp-uptime-open="info"`) makes a press open the period’s quick info under its cell: the theme’s popover plate with the period, its state as a swatch and a word, its exact figures, the period’s `details` lines and, when it has an `href`, a link to its page. One at a time; the arrows carry it along the strip, a second press, Escape or a press outside closes it. `kp-uptime-open` fires first and is cancelable, so the page may show its own.',
                markup: `
<div class="kp-uptime" id="doc-uptime-info" data-kp-uptime data-kp-uptime-label="vault" data-kp-uptime-count="14"></div>
`,
                script: `
import { attachUptimes, setUptime } from '@kp-soft/themes/js/uptime';

const strip = document.getElementById('doc-uptime-info');
attachUptimes(strip.parentElement);
const periods = [];
for (let day = 4; day <= 17; day++) {
    const down = day === 11;
    periods.push({
        key: '2026-10-' + String(day).padStart(2, '0'),
        label: String(day).padStart(2, '0') + '/10/2026',
        state: down ? 'down' : day === 14 ? 'degraded' : 'up',
        uptime: down ? 0.9 : undefined,
        href: '#day-' + day,
        details: down ? ['The database restarted at 03:10.', 'Back after 2 h 24 min.'] : day === 14 ? ['Slow answers between 14:00 and 14:40.'] : [],
    });
}
setUptime(strip, { label: 'vault', periods, open: 'info' });
`,
            },
            {
                title: 'Calm tones: thirty days of watering',
                why: 'With `data-kp-tones="calm"` the strip follows the same attribute as the calendar: `up` and `degraded` are logged, `down` is quiet and its word is “nothing logged”, never an outage. The page still hands over the periods it has, with `down` for a day nothing was logged.',
                markup: `
<div class="kp-uptime" id="doc-uptime-calm" data-kp-uptime data-kp-tones="calm" data-kp-uptime-label="Watering"></div>
`,
                script: `
import { attachUptimes, setUptime } from '@kp-soft/themes/js/uptime';

const strip = document.getElementById('doc-uptime-calm');
attachUptimes(strip.parentElement);
const periods = Array.from({ length: 30 }, (_, i) => {
    const day = new Date(Date.UTC(2026, 8, 18 + i));
    const label = String(day.getUTCDate()).padStart(2, '0') + '/' + String(day.getUTCMonth() + 1).padStart(2, '0') + '/2026';
    const state = i % 7 === 3 || i % 11 === 5 ? 'down' : i > 27 ? 'none' : 'up';
    return { key: day.toISOString().slice(0, 10), label, state };
});
setUptime(strip, { label: 'Watering', periods, from: '30 days ago', to: 'Today' });
`,
            },
        ],
        variants: [
            { name: 'data-kp-uptime-open', what: '`info`: a press opens the period’s quick info under its cell (the same as `open: "info"`); without it a period with `href` is a link.' },
            { name: 'uptimeFigures / uptimePercent / uptimeFit', what: 'The window’s figures from its periods, a share written as the strip writes it (cut to one decimal, never rounded up) and how many periods fit a width.' },
            { name: 'data-kp-uptime', what: 'Marks the strip; `attachUptimes` wires it and draws its loading state until `setUptime` is called.' },
            { name: 'data-kp-uptime-label', what: 'The strip’s title (the service) when `setUptime` is given none.' },
            { name: 'data-kp-uptime-count', what: 'How many cells a loading or empty strip waits with; 90 by default.' },
            { name: 'data-kp-uptime-state', what: 'Set by the script: `ready`, `loading`, `empty` or `error`. Given in the markup, the state the strip starts in.' },
            { name: 'data-kp-uptime-fit', what: '`scroll`: every period is kept and the strip scrolls sideways, starting at the latest; without it the latest periods that fit are shown.' },
            { name: 'data-kp-uptime-before', what: 'Set by the script on a scrolling strip with periods before the view: the start edge fades.' },
            { name: 'data-kp-uptime-after', what: 'Set by the script on a scrolling strip with periods after the view: the end edge fades.' },
            { name: 'data-kp-uptime-attached', what: 'Set by the script once the strip is wired.' },
            { name: 'groups', what: 'Strips that load together are a group with one busy card over the group: `data-kp-uptime-group` on the box that holds them (`off` opts out), or two or more strips that are direct children of one parent (marked `data-kp-uptime-group="auto"`).' },
            { name: 'empty and failed', what: 'The state plate over the strip’s footprint. A failure has a Retry (`kp-uptime-retry`); `error` or `message` is the heading, `text` and `art` are optional.' },
        ],
        accessibility: [
            'Built in — one tab stop: the arrow keys move through the cells that are shown, Home and End jump to the first and the latest, Enter and Space pick (`kp-uptime-pick`); the hover card opens at once on focus.',
            'Built in — every cell is a button named by its period, state and figures; the strip is a group named by its title and its summary; a state is a pattern as well as a colour.',
            'Yours — name each period the way a person reads it (dd/mm/yyyy, HH:MM), keep an error sentence short, and give `tip` a sentence when a period has more to say.',
        ],
    };
