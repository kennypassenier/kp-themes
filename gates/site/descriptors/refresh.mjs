// Page descriptor for the "refresh" documentation page [AR19]; the shape is pinned in ./types.mjs.

/** @type {import('./types.mjs').Descriptor} */
export const refreshDescriptor = {
        id: 'refresh',
        title: 'Automatic refresh',
        group: 'Feedback',
        classes: ['kp-refresh'],
        exports: [],
        aliases: ['look', 'run'],
        intro: 'The small control that refreshes a page by itself: “Every 30 s” or “Paused”, with “updated 12 s ago” beside it and a thin rule that runs down to the next refresh. The app does the fetching; the control fires an event on each tick and waits to be told whether it worked.',
        whenToUse: 'A dashboard or a list that should stay current without a reload. For a single “updated” line alone use the freshness line; for a manual reload only, a plain button.',
        examples: [
            {
                title: 'Every 30 seconds, remembered',
                why: 'The markup is the empty box. The value is the number of seconds; the app answers `kp-refresh` with `detail.done(true)` or `done(false)`.',
                markup: `
<div class="kp-refresh" data-kp-refresh="30" data-kp-remember="dashboard"></div>
`,
                script: `
import { attachRefresh } from '@kp-soft/themes/js/auto-refresh';

const control = document.querySelector('[data-kp-refresh]');
attachRefresh(control.parentElement);
control.addEventListener('kp-refresh', (event) => {
    fetch('/api/overview').then(() => event.detail.done(true), () => event.detail.done(false));
});
`,
            },
            {
                title: 'The menu look, and a refresh that fails',
                why: '`data-kp-look="menu"` swaps the segments for the package’s menu button; “Other…” in it takes any whole number of seconds. Here every tick fails: the data stays, the control says when it retries (backing off: the interval, twice, four times, then that) and offers Retry now. The refresh waits while a dialog is open, a field has the focus or the tab is hidden, and R refreshes at once.',
                markup: `
<div class="kp-refresh" id="doc-refresh-menu" data-kp-refresh="15" data-kp-look="menu" data-kp-refresh-choices="0,15,60" data-kp-refresh-hover="pause"></div>
`,
                script: `
import { attachRefresh, setRefreshInterval } from '@kp-soft/themes/js/auto-refresh';

const control = document.getElementById('doc-refresh-menu');
attachRefresh(control.parentElement);
control.addEventListener('kp-refresh', (event) => event.detail.done(false));
control.addEventListener('kp-refresh-interval', (event) => console.info('interval', event.detail.seconds, event.detail.by));
setRefreshInterval(control, 15);
`,
            },
            {
                title: 'A labelled refresh in a form grid',
                why: '`data-kp-refresh-label` puts the words in the label track of the row, the bar in the control track; outside a form grid the label is a line above the bar.',
                markup: `
<div class="kp-formgrid">
<div class="kp-formgrid__row">
<div class="kp-refresh" data-kp-refresh="60" data-kp-refresh-label="Refresh this page" data-kp-refresh-choices="0,30,60,300"></div>
</div>
</div>
`,
                script: `
import { attachRefresh } from '@kp-soft/themes/js/auto-refresh';

const control = document.querySelector('[data-kp-refresh-label]');
attachRefresh(control.parentElement);
control.addEventListener('kp-refresh', (event) => event.detail.done(true));
`,
            },
        ],
        variants: [
            { name: 'the script', what: '`attachRefresh(root, { now })` wires every `[data-kp-refresh]` and returns a detach; `refreshOf(el)` answers the handle; `refreshDone(el, ok)` is `detail.done(ok)` by element; `setRefreshInterval(el, seconds)` changes the interval from the page (`by: \'script\'` on the event). `REFRESH` is the selector, `REFRESH_DEFAULT` (30) and `REFRESH_CHOICES` the defaults behind the attributes; the events are `REFRESH_EVENT` and `REFRESH_INTERVAL_EVENT`.' },
            { name: 'kp-refresh detail', what: '`{ reason, interval, done(ok) }` with `reason` one of `timer`, `now` (the button or R), `retry` and `return` (the tab came back with a refresh due).' },
            { name: '.kp-refresh__bar / __chooser / __menu / __segments', what: 'The first row: the chooser (the menu button of the `menu` look or the segmented control of the `segmented` look, which scrolls inside the card when it is wider than it) and, after it, the freshness line and Refresh now.' },
            { name: '.kp-refresh__line / __ago / __busy / __now / __count', what: 'The freshness line “updated 12 s ago”, which gives way to “updating…” in the same width, the button that refreshes at once and the thin rule that runs down to the next refresh.' },
            { name: '.kp-refresh__custom / __input / __apply / __problem', what: 'The “Other…” form: a number of seconds, Apply and the line that refuses what is not a whole number.' },
            { name: '.kp-refresh__failure / __note / __retry', what: 'The warning after a failed refresh: “Last refresh failed, retrying in 30 s” and Retry now.' },
            { name: 'data-kp-refresh', what: 'The seconds the page opens with; 30 by default, 0 opens paused.' },
            { name: 'data-kp-refresh-choices', what: 'The seconds offered, `0,15,30,60,300` by default (0 is paused). “Other…” takes any whole number of seconds.' },
            { name: 'data-kp-refresh-mode', what: '`event` (default: the app fetches), `page` (reload the page) or `region` (fetch the same URL and swap only the region).' },
            { name: 'data-kp-refresh-region', what: 'The selector of the element swapped in `region` mode; focus and scroll stay.' },
            { name: 'data-kp-look', what: '`segmented` (default) or `menu`.' },
            { name: 'data-kp-remember', what: 'A name: the choice is kept per page and device.' },
            { name: 'data-kp-stale-after', what: 'Seconds after which the freshness line turns stale; three times the interval by default.' },
            { name: 'data-kp-refresh-hover', what: '`pause`: no refresh while the pointer is over a table being read.' },
            { name: 'data-kp-refresh-title / data-kp-refresh-slot="title" / setRefreshTitle', what: 'A title for the bar: the first cell of the bar’s grid, a label track in a form grid, and a heading line above the bar when a label is set. `setRefreshTitle(control, text)` changes it; `data-kp-refresh-slot="title"` marks an element of your own to use instead.' },
            { name: 'data-kp-refresh-label', what: 'The words of a label cell (`.kp-refresh__label`): the label track in a form grid, a line above the bar elsewhere. Switchable at run time. Inside a form grid the bar also inherits the grid’s column gap.' },
            { name: 'live options', what: '`data-kp-look`, `data-kp-refresh-choices`, `data-kp-stale-after`, `data-kp-announce`, `data-kp-refresh` and `data-kp-refresh-key` are read again when the attribute changes; changing the look redraws the chooser.' },
            { name: 'always refreshes', what: 'Refresh now, the R key and Retry now always refresh, paused or not. After a failure the line reads “Last refresh failed.” while the refresh is paused, and “Last refresh failed, retrying in 30 s” while it is not.' },
            { name: 'the bar’s fold', what: 'Outside a form grid the bar is one column under 40rem of viewport (a form grid folds on its own width at 36rem), and its words always start at the start, whatever text-align the parent has. The bar is a grid of three tracks and stands on a form grid’s columns.' },
        ],
        accessibility: [
            'Built in — it never eats typing: a refresh waits while a dialog is open, a form field has the focus or the tab is hidden, and runs once on return. A failed refresh keeps the data and says when it retries, with Retry now; R refreshes at once outside a field.',
            'Yours — fetch on `kp-refresh` and always answer with `done`, or the control waits for ever.',
        ],
    };
