// Page descriptor for the "range" documentation page [AR19]; the shape is pinned in ./types.mjs.

/** @type {import('./types.mjs').Descriptor} */
export const rangeDescriptor = {
        id: 'range',
        title: 'Range picker',
        group: 'Forms',
        classes: ['kp-range'],
        exports: [],
        intro: 'The time window of a metrics page: the presets as the package’s segmented control and a Custom… button that opens a panel with two of the package’s date pickers (dd/mm/yyyy) and two times (HH:MM), checked before Apply. Under the control one line says exactly which window is chosen, “Last 24 hours · 15/10/2026 14:05 – 16/10/2026 14:05”, in Europe/Brussels unless `data-kp-time-zone` says otherwise. Choosing fires `kp-range-change` with the preset’s key (or null), ISO start and end, and the line. The panel says what is wrong (a date or time that is not whole, the end before the start, an end in the future, a window longer than `data-kp-range-max-days`) under the fields and marks them; Cancel, Escape or a press outside keeps the window as it was.',
        whenToUse:
            'Above a chart, a log or a table that shows a stretch of time. For one date use the date picker; for a range inside a table’s filter use the table’s own date filter.',
        examples: [
            {
                title: 'Metrics, the last 24 hours',
                why: 'The markup is the empty box with its presets; the script builds the control, the line and the panel.',
                markup: `
<div class="kp-range" data-kp-range="24h" data-kp-range-presets="1h 6h 24h 7d 30d" aria-label="Metrics range"></div>
`,
            },
            {
                title: 'Own presets, a custom window and its limits',
                why: '`data-kp-range-presets` is any number with m, h, d or w. `data-kp-range-start` and `-end` open the picker on a custom window (ISO moments); `data-kp-range-max-days` refuses a longer custom window and `data-kp-range-future` lets one end in the future, the panel saying under the fields what is wrong and holding Apply’s result until it is right. `data-kp-time-zone` changes the zone the line and the times are read in. `data-kp-range-disabled` turns the presets and Custom… off while the line still names the window.',
                markup: `
<div class="kp-stack">
<div class="kp-range" data-kp-range="" data-kp-range-presets="15m 2h 3d 2w" data-kp-range-start="2026-10-10T08:00:00Z" data-kp-range-end="2026-10-12T20:30:00Z" data-kp-range-max-days="14" data-kp-time-zone="Europe/London" aria-label="Report window"></div>
<div class="kp-range" data-kp-range="7d" data-kp-range-presets="1d 7d 30d" data-kp-range-future aria-label="Forecast window"></div>
<div class="kp-range" data-kp-range="24h" data-kp-range-disabled aria-label="Fixed window"></div>
</div>
`,
            },
            {
                title: 'Redrawing from the event',
                why: '`kp-range-change` carries `{ preset, start, end, label }` when a person chooses a preset or applies a custom window: the preset’s key (or null), the two moments as ISO strings in UTC, and the line. `setRange(el, { preset })` or `setRange(el, { start, end })` sets the window from a script without the event, `rangeOf(el)` reads it and `rangeFaults(start, end, rules)` is the check the panel uses.',
                markup: `
<div class="kp-stack">
<div class="kp-range" id="doc-range-live" data-kp-range="24h" aria-label="Metrics range"></div>
<p id="doc-range-log" aria-live="polite">Window: not chosen yet.</p>
<button class="kp-button" type="button" id="doc-range-week">Show the last 7 days</button>
</div>
`,
                script: `
import { rangeOf, setRange } from '@kp-soft/themes/js/range';

const picker = document.getElementById('doc-range-live');
const log = document.getElementById('doc-range-log');
picker.addEventListener('kp-range-change', (event) => {
    const { preset, start, end, label } = event.detail;
    log.textContent = 'Redraw ' + (preset ?? 'custom') + ': ' + start + ' to ' + end + ' (' + label + ')';
});
document.getElementById('doc-range-week').addEventListener('click', () => {
    setRange(picker, { preset: '7d' });
    log.textContent = 'Set from the page: ' + rangeOf(picker).preset;
});
`,
            },
            {
                title: 'Presets only',
                why: '`data-kp-range-custom="off"` leaves out the Custom… button and its panel.',
                markup: `
<div class="kp-range" data-kp-range="24h" data-kp-range-custom="off" data-kp-range-presets="1h 6h 24h 7d 30d" aria-label="Metrics range"></div>
`,
            },
        ],
        variants: [
            { name: 'data-kp-range', what: 'The preset chosen at first (a key of the presets); empty for the third preset.' },
            { name: 'data-kp-range-presets', what: 'The presets, space separated: a number and m, h, d or w (`1h 6h 24h 7d 30d`).' },
            { name: 'data-kp-range-start', what: 'With `data-kp-range-end`: a custom window to start with, as ISO moments.' },
            { name: 'data-kp-range-end', what: 'The end of that custom window.' },
            { name: 'data-kp-range-max-days', what: 'The longest custom window, in days; none by default.' },
            { name: 'data-kp-range-future', what: 'A custom window may end in the future.' },
            { name: 'data-kp-range-disabled', what: 'The presets and Custom… are off; the line still names the window.' },
            { name: 'data-kp-range-value', what: 'Set by the script: the preset in force, or `custom`.' },
            { name: 'data-kp-time-zone', what: 'The zone the line and the custom times are read in; Europe/Brussels by default.' },
            { name: 'data-kp-range-custom="off"', what: 'Presets only: no Custom… button, no panel in the page or the tab order, and the window’s name across the line.' },
        ],
        accessibility: [
            'Built in — the presets are a radio group with one tab stop and arrow keys; Custom… says it opens a dialog and is pressed while a custom window is in force; the line is the picker’s description and is read when it changes.',
            'Built in — the panel takes the focus and gives it back; Escape closes a calendar first, then the panel; a wrong field is marked invalid and points at the sentence that says why.',
            'Yours — name the picker (`aria-label`) after what it narrows, and redraw the chart from the event’s ISO moments.',
        ],
    };
