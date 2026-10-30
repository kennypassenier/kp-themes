// Page descriptor for the "quiet-hours" documentation page [AR19]; the shape is pinned in ./types.mjs.

/** @type {import('./types.mjs').Descriptor} */
export const quietHoursDescriptor = {
        id: 'quiet-hours',
        title: 'Quiet hours',
        group: 'Forms',
        classes: ['kp-quiet'],
        exports: [],
        aliases: ['quiet', 'quiet-severities', 'quiet-step', 'quiet-label', 'quiet-on'],
        intro: 'One control for “do not push me between 22:00 and 07:00 on these days, except a critical notice”: a switch, a from and an until time, the weekday picker and one tick per severity that may break the quiet, with a sentence in words under them. It is built from the package’s own time field and weekday picker.',
        whenToUse: 'A notification rule with a window of time. For a single moment to put something off use the snooze picker; for one time of day use the time field.',
        examples: [
            {
                title: 'Weeknights, critical still comes through',
                why: 'The value is `{ on, from, to, days, through }`: `days` as `Date#getDay` counts them (0 is Sunday), `through` the severities that still come through. A window across midnight belongs to the day it starts on. Off, the fields keep their place, dimmed and out of the tab order; a window that starts and ends at the same time is refused with a line under the times. The page stores the value from `kp-quiet-change` and tells the control back with `setQuiet`.',
                markup: `
<div class="kp-quiet" id="doc-quiet" data-kp-quiet data-kp-value='{"on":true,"from":"22:00","to":"07:00","days":[0,1,2,3,4],"through":["critical"]}'></div>
`,
                script: `
import { attachQuietHours } from '@kp-soft/themes/js/quiet-hours';

const quiet = document.getElementById('doc-quiet');
attachQuietHours(quiet.parentElement);
quiet.addEventListener('kp-quiet-change', (event) => console.log(event.detail.value, event.detail.summary));
`,
            },
        ],
        variants: [
            { name: 'the script', what: '`attachQuietHours(root)` builds every `[data-kp-quiet]` and returns a detach; `setQuiet(el, value)` and `quietValue(el)` set and read it; `quietSummary(value)` is the sentence on its own; `readQuiet(raw)` reads the page’s stored text with the defaults for what is missing. `QUIET` is the selector.' },
            { name: 'kp-quiet-change', what: 'Fired on the control, bubbling, when a person changes it: `{ value, summary, valid }` (`QUIET_EVENT`).' },
            { name: 'data-kp-quiet-severities', what: '`critical,warning,info,ok` (default), each also `key=Words` for the page’s own words.' },
            { name: 'data-kp-quiet-step', what: 'Minutes for the time fields (15).' },
            { name: 'data-kp-quiet-label', what: 'The control’s accessible name and the switch’s words.' },
            { name: 'data-kp-disabled', what: 'The sentence that says why it cannot be changed now; the control is out of the tab order and the sentence stands under it.' },
            { name: 'states', what: 'On, off (dimmed, same size), refused (same start and end), disabled with its reason, and loading (the control’s own bars in its place).' },
        ],
        accessibility: [
            'Built in — a group with a name; the switch is a real `role="switch"`; the times and days are the package’s own fields with their own keys; the sentence is a polite status; off, the fields are `inert` and leave the tab order.',
            'Yours — store the value as the page decides, and apply a window across midnight to the day it starts on.',
        ],
    };
