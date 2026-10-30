// Page descriptor for the "time" documentation page [AR19]; the shape is pinned in ./types.mjs.

/** @type {import('./types.mjs').Descriptor} */
export const timeDescriptor = {
        id: 'time',
        title: 'Time field',
        group: 'Forms',
        classes: ['kp-time'],
        exports: [],
        intro: 'A field for a time of day in 24 hours: typed (0230, 2:30, 2h30), stepped with the arrow keys or picked from the package’s own list of times, with presets and a mark on times near a busy moment. It posts HH:MM and never shows AM or PM.',
        whenToUse: 'A schedule, a reminder or a log entry that needs a time of day. For a date use the date picker; for a duration use the countdown’s field.',
        examples: [
            {
                title: 'A backup time',
                why: 'The label points at the input the module builds (`data-kp-time-id`); the hidden input posts the value under `data-kp-name`.',
                markup: `
<div class="kp-field">
    <label class="kp-field__label" for="backup-at">Backup time</label>
    <div class="kp-time" data-kp-time data-kp-time-id="backup-at" data-kp-name="at" data-kp-value="03:00"></div>
</div>
`,
            },
            {
                title: 'Steps, a window, presets and a busy moment',
                why: '`data-kp-time-step` is what the arrow keys and the list move by (typing allows any minute); `data-kp-time-min` and `-max` bound the choices, and a minimum later than the maximum wraps midnight (22:00 to 06:00). `data-kp-time-presets` puts the app’s own words as chips above the list, `data-kp-time-now` adds a Now entry, `data-kp-time-clear` an explicit no time, and `data-kp-time-near` marks list entries within `data-kp-time-near-width` minutes of a moment that is already busy. `data-kp-time-zone` adds a quiet line saying whose clock it is.',
                markup: `
<div class="kp-stack">
<div class="kp-field">
    <label class="kp-field__label" for="doc-time-night">Maintenance window start</label>
    <div class="kp-time" data-kp-time data-kp-time-id="doc-time-night" data-kp-name="start" data-kp-value="23:30" data-kp-time-step="15" data-kp-time-min="22:00" data-kp-time-max="06:00" data-kp-time-presets="Late=23:00,Night=02:00,Early=05:00" data-kp-time-near="03:00" data-kp-time-near-width="30" data-kp-time-zone="Europe/Brussels"></div>
</div>
<div class="kp-field">
    <label class="kp-field__label" for="doc-time-log">Log entry at</label>
    <div class="kp-time" data-kp-time data-kp-time-id="doc-time-log" data-kp-name="at" data-kp-value="14:05:30" data-kp-time-seconds data-kp-time-now data-kp-time-clear></div>
</div>
</div>
`,
            },
            {
                title: 'Typed text, an inline field, a required field, off and loading',
                why: 'Typing is forgiving: `0230`, `2:30`, `02.30` and `2h30` all give 02:30, and pasting `2:30 PM` is converted to 14:30 and the field says so. An unreadable text is kept and marked, with the sentence “Use a time like 03:00”. `data-kp-time-look="inline"` is the underline form inside a sentence, `data-kp-time-required` makes empty invalid once the field was left, `data-kp-disabled-reason` with `disabled` says why it cannot be used, `data-kp-time-popup="none"` leaves only typing and keys, and `data-kp-state="loading"` shows the field’s own skeleton at its final width.',
                markup: `
<div class="kp-stack">
<p>Send the report at <span class="kp-time" data-kp-time data-kp-time-look="inline" data-kp-value="07:30" data-kp-label="Report time" data-kp-time-popup="none"></span> every morning.</p>
<div class="kp-field">
    <label class="kp-field__label" for="doc-time-req">Reminder time</label>
    <div class="kp-time" data-kp-time data-kp-time-id="doc-time-req" data-kp-name="reminder" data-kp-time-required></div>
</div>
<div class="kp-field">
    <label class="kp-field__label" for="doc-time-off">Backup time</label>
    <div class="kp-time" data-kp-time data-kp-time-id="doc-time-off" data-kp-name="off" data-kp-value="03:00" disabled data-kp-disabled-reason="The schedule is managed by the host."></div>
</div>
<div class="kp-field">
    <label class="kp-field__label" for="doc-time-load">Wake-up time</label>
    <div class="kp-time" data-kp-time data-kp-time-id="doc-time-load" data-kp-name="load" data-kp-state="loading"></div>
</div>
</div>
`,
            },
            {
                title: 'Presets that arrive later, and a change heard by the page',
                why: '`setTimePresets(el, list | "loading" | "error")` gives the chips their data: while they load the list shows its own skeleton, and an error offers Retry, which fires `kp-time-retry`. `kp-time-change` fires on every change with `{ value, text, converted }`; `timeValue(el)` and `timeValid(el)` read the field.',
                markup: `
<div class="kp-field">
    <label class="kp-field__label" for="doc-time-late">Schedule at</label>
    <div class="kp-time" id="doc-time-late" data-kp-time data-kp-time-id="doc-time-late-input" data-kp-name="at" data-kp-value="03:00" data-kp-time-step="30"></div>
</div>
<p class="kp-text-muted" id="doc-time-log2" aria-live="polite">Open the list: the presets are being fetched.</p>
`,
                script: `
import { setTimePresets } from '@kp-soft/themes/js/timefield';

const field = document.getElementById('doc-time-late');
const log = document.getElementById('doc-time-log2');
let tries = 0;
const fetchPresets = () => {
    setTimePresets(field, 'loading');
    setTimeout(() => {
        tries += 1;
        // The first answer fails, so the Retry can be seen; the second works.
        if (tries === 1) setTimePresets(field, 'error');
        else setTimePresets(field, [{ label: 'Night', value: '03:00' }, { label: 'Morning', value: '08:00' }, { label: 'Evening', value: '20:00' }]);
    }, 900);
};
fetchPresets();
field.addEventListener('kp-time-retry', fetchPresets);
field.addEventListener('kp-time-change', (event) => {
    log.textContent = 'Time is now ' + event.detail.text + (event.detail.converted ? ' (converted from 12 hours)' : '') + '.';
});
`,
            },
        ],
        variants: [
            { name: 'data-kp-time-step', what: 'Minutes for the keys and the list: 1, 5 (default), 10, 15, 30 or 60.' },
            { name: 'data-kp-time-min', what: 'The start of a window; later than the max, it wraps midnight.' },
            { name: 'data-kp-time-max', what: 'The end of the window.' },
            { name: 'data-kp-time-seconds', what: 'HH:MM:SS.' },
            { name: 'data-kp-time-popup', what: '`list` (default) or `none`.' },
            { name: 'data-kp-time-presets', what: '`Night=03:00,Morning=08:00`: chips above the list.' },
            { name: 'data-kp-time-now', what: 'Adds a Now entry.' },
            { name: 'data-kp-time-zone', what: 'An IANA name: a quiet line says whose clock it is.' },
            { name: 'data-kp-time-look', what: '`field` (default) or `inline` (the underline form inside a sentence).' },
            { name: 'data-kp-time-clear', what: 'Adds an explicit no time.' },
            { name: 'data-kp-time-required', what: 'Empty is invalid, with a line.' },
            { name: 'data-kp-time-near', what: 'Busy moments: list entries within `data-kp-time-near-width` minutes (60) are marked.' },
            { name: 'data-kp-time-id', what: 'The id of the input, for a label.' },
            { name: 'data-kp-time-touched', what: 'Set by the module once the field was left (so a required field only complains then).' },
        ],
        accessibility: [
            'Built in — a combobox with a listbox, the active entry named by `aria-activedescendant`; an invalid text is `aria-invalid` with an alert line; every change and a 12 hour conversion are announced politely.',
            'Yours — name the field (`data-kp-label` or a label for its id), and word the near-a-busy-moment sentence with the problem alert.',
        ],
    };
