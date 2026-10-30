// Page descriptor for the "weekdays" documentation page [AR19]; the shape is pinned in ./types.mjs.

/** @type {import('./types.mjs').Descriptor} */
export const weekdaysDescriptor = {
        id: 'weekdays',
        title: 'Weekday picker',
        group: 'Forms',
        classes: ['kp-weekdays'],
        exports: [],
        aliases: ['days', 'invalid', 'presets', 'summary'],
        intro: 'The days a schedule runs on: seven chips (or the days of a month) with the quick picks Weekdays, Weekend and Every day and a line in words under them, “Mon and Thu”. Built on the chip group in multi mode; all seven days is a real choice.',
        whenToUse: 'A schedule or a repeat that runs on chosen days. For one date use the date picker; for one of a few options use the segmented control.',
        examples: [
            {
                title: 'Mondays and Thursdays',
                why: 'The markup is the empty box; the script builds the chips, the quick picks (Weekdays, Weekend, Every day) and the line in words under them. It is the chip group in multi mode with three differences: all seven days is a real choice and none is a wrong one, the week starts where the reader’s week starts (`data-kp-week-starts-on`, 0 is Sunday) and the line says what is picked. Below `data-kp-min` days (1) the group says so under the chips and still reports the value, so the page decides. `kp-weekdays-change` carries `{ values, summary, valid }`; `weekdays(el)` and `setWeekdays(el, values)` read and write it.',
                markup: `
<div class="kp-weekdays" id="doc-weekdays" data-kp-weekdays data-kp-value="1,4" aria-label="Run on"></div>
<p class="kp-text-muted" id="doc-weekdays-said" role="status">Mon and Thu.</p>
<button type="button" class="kp-button kp-button--sm" id="doc-weekdays-set">Set weekdays from the page</button>
`,
                script: `
import { attachWeekdays, setWeekdays, weekdays } from '@kp-soft/themes/js/weekdays';

const picker = document.getElementById('doc-weekdays');
attachWeekdays(picker.parentElement, { weekStartsOn: 1 });
const said = document.getElementById('doc-weekdays-said');
picker.addEventListener('kp-weekdays-change', (event) => {
    said.textContent = event.detail.summary + (event.detail.valid ? '' : ' (not enough days)') + ' - values ' + event.detail.values.join(',') + '.';
});
document.getElementById('doc-weekdays-set').addEventListener('click', () => {
    setWeekdays(picker, [1, 2, 3, 4, 5]);
    said.textContent = 'Set: ' + weekdays(picker).join(',') + '.';
});
`,
            },
            {
                title: 'Narrow names, a Sunday start, a month, and a picker that is off',
                why: '`data-kp-day-names="narrow"` shows M for Monday and `data-kp-week-starts-on="0"` starts the week on Sunday. `data-kp-days="month"` draws the days 1 to 31 and Last, for a monthly schedule (`.kp-weekdays__chips--month`); a value there is the day numbers and `last`. `data-kp-presets="false"` leaves the quick picks out and `data-kp-summary="false"` the line in words; `data-kp-min="0"` allows none. `data-kp-disabled` turns the whole picker off, and `data-kp-disabled-reason` says why under the chips.',
                markup: `
<div class="kp-weekdays" id="doc-weekdays-narrow" data-kp-weekdays data-kp-day-names="narrow" data-kp-week-starts-on="0" data-kp-presets="weekdays,every" data-kp-value="sat,sun" aria-label="Run on, narrow"></div>
<div class="kp-weekdays" data-kp-weekdays data-kp-days="month" data-kp-value="1,15,last" data-kp-presets="false" aria-label="Run on days of the month"></div>
<div class="kp-weekdays" data-kp-weekdays data-kp-min="0" data-kp-summary="false" aria-label="Run on, optional"></div>
<div class="kp-weekdays" data-kp-weekdays data-kp-value="1,2,3,4,5" data-kp-disabled data-kp-disabled-reason="The backup runs every weekday while the migration is on." aria-label="Run on, fixed"></div>
`,
                script: `
import { attachWeekdays } from '@kp-soft/themes/js/weekdays';

attachWeekdays(document.getElementById('doc-weekdays-narrow').parentElement);
`,
            },
        ],
        variants: [
            { name: 'weekdays / setWeekdays', what: '`weekdays(el)` gives the days that are on (numbers, 0 is Sunday); `setWeekdays(el, values)` sets them without an event; `weekdaysOf(el)` the days with their names.' },
            { name: 'weekdaySummary / monthSummary / dayNames', what: 'The line in words for a set of days (“Mon and Thu”, “Every weekday”), the same for a month, and the names of the week in the reader’s language; `joinWords` joins a list the way the line does and `dayNumber` reads a name or a number.' },
            { name: 'data-kp-days', what: '`week` (default) or `month`: the days 1 to 31 and Last.' },
            { name: 'data-kp-week-starts-on', what: 'The first day, 0 (Sunday) to 6; the locale’s by default.' },
            { name: 'data-kp-day-names', what: '`short` (Mon) or `narrow` (M).' },
            { name: 'data-kp-min', what: 'The fewest days that make a schedule; 1 by default, 0 allows none.' },
            { name: 'data-kp-presets', what: 'The quick picks, `weekdays,weekend,every`, or `false` for none.' },
            { name: 'data-kp-value', what: 'The days at first, `1,4` or `mon,thu`.' },
            { name: 'data-kp-disabled', what: 'The whole picker is off; `data-kp-disabled-reason` says why, under the chips.' },
        ],
        accessibility: [
            'Built in — the chips are one tab stop with arrow keys; each is a toggle button with its full day name; the line in words is read when it changes.',
            'Yours — name the picker (`aria-label`) after what it chooses, and keep your own copy of the days: the picker holds no data of yours.',
        ],
    };
