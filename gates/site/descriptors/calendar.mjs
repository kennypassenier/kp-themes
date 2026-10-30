// Page descriptor for the "calendar" documentation page [AR19]; the shape is pinned in ./types.mjs.

/** @type {import('./types.mjs').Descriptor} */
export const calendarDescriptor = {
        id: 'calendar',
        title: 'Month heatmap',
        group: 'Data',
        classes: ['kp-calendar', 'kp-calendar-layout'],
        exports: [],
        // The calendar's own hooks follow from its class (`data-kp-calendar-…`);
        // these are the generic ones it reads or writes on its parts.
        aliases: ['time-zone', 'locale', 'week-starts-on', 'heading-level', 'key', 'date', 'tone', 'today', 'pad', 'state', 'tones', 'quiet', 'logged', 'calm-map', 'paused', 'legend', 'dim', 'plate'],
        intro: 'A month as a grid of days, each a plate in the colour of its state, with a short count under the number: a month of nightly backups, of shifts covered, of readings received. js/calendar.js builds it into a `section.kp-calendar[data-kp-calendar]`: the month’s title between ‹ Prev and Next ›, Today, a line for the state, a six-week `table[role=grid]` with one tab stop and the keys of a date grid, and a legend. The page hands it every day’s state by date; today is the day in Europe/Brussels, whatever the reader’s zone.',
        whenToUse:
            'Where a reader looks for the bad days in a month of one daily outcome and picks one to see why. Not for picking a date in a form, which is the date picker, and not for a value over time, which is a time chart.',
        examples: [
            {
                title: 'A month of nightly backups, with the page’s detail beside it',
                why: 'The markup is the empty section; the script builds the rest and the page gives the days with `setCalendarDays(el, { "2026-10-04": { tone: "warn", count: "7/9", label: "7 of 9 services backed up" } })`. A picked day fires `kp-calendar-pick`; the page fills the aside. Under 45rem the aside goes under the grid.',
                markup: `
<div class="kp-calendar-layout">
<section class="kp-calendar" data-kp-calendar data-kp-calendar-month="2026-10" lang="en-GB" aria-label="Nightly backups"></section>
<aside aria-live="polite"><p>Pick a day to see every service’s own state that night.</p></aside>
</div>
`,
            },
            {
                title: 'A month that loads',
                why: 'The page says the month is loading with `setCalendarState(el, "loading", words)` and done with `setCalendarState(el, "ready")`; `.kp-calendar--busy-whole` puts one card over the grid while it loads, `.kp-calendar--busy-days` makes every day wait on its own. In pastel everything becomes caterpillar: the card over the month gets a head and stepping legs and is stuck on and taken off as the theme’s landing; in the second month every loading day gets a pom-pom rim and two legs, rises in turn, and the last of its week has a head beside it. Press Load and Loaded.',
                markup: `
<div class="kp-row kp-gap-sm kp-mb-md" role="group" aria-label="The months’ state">
<button type="button" class="kp-button kp-button--sm" data-doc-calendar="loading">Load</button>
<button type="button" class="kp-button kp-button--sm" data-doc-calendar="ready">Loaded</button>
</div>
<div class="kp-stack">
<section class="kp-calendar kp-calendar--busy-whole" data-kp-calendar data-kp-calendar-month="2026-10" lang="en-GB" aria-label="Nightly backups, one card while loading" data-doc-calendar-month></section>
<section class="kp-calendar kp-calendar--busy-days" data-kp-calendar data-kp-calendar-month="2026-10" lang="en-GB" aria-label="Nightly backups, each day waiting" data-doc-calendar-month></section>
</div>
<script type="module">
import { setCalendarState } from '../../js/calendar.js';
document.addEventListener('click', (event) => {
const button = event.target instanceof Element ? event.target.closest('[data-doc-calendar]') : null;
if (!button) return;
const state = button.getAttribute('data-doc-calendar') === 'loading' ? 'loading' : 'ready';
for (const month of document.querySelectorAll('[data-doc-calendar-month]')) setCalendarState(month, state, state === 'loading' ? 'Reading the backups: 4 of 9 services read.' : '');
});
</script>
`,
            },
            {
                title: 'Calm tones: a quiet day is not a failed day',
                why: '`data-kp-tones="calm"` swaps ok, warn and bad for logged (the theme’s accent), quiet (nothing logged: no border, no count, never “missed”) and paused (hatched, from `data-kp-paused-range`). The heat grid and the uptime strip take the same attribute (js/calm-tones.js).',
                markup: `
<section class="kp-calendar" data-kp-calendar data-kp-tones="calm" data-kp-calendar-month="2026-10" data-kp-paused-range="2026-10-03/2026-10-06" aria-label="Movement"></section>
`,
            },
            {
                title: 'Calm days with their minutes, a caption, and the states',
                why: 'The page hands over the logged days only; every other day is quiet, and the days inside `data-kp-paused-range` are paused. A calm month with nothing logged keeps its six rows under one centred plate, and a month that could not be read is dimmed under a plate with Retry, which fires `kp-calendar-retry` for the page to answer. `setCalendarCaption` writes the page’s own sentence under the grid, and `data-kp-logged-fill="success"` asks for the success plate instead of the accent.',
                markup: `
<div class="kp-stack">
<section class="kp-calendar kp-calendar--busy-days" id="doc-calm-calendar" data-kp-calendar data-kp-tones="calm" data-kp-calendar-month="2026-10" data-kp-paused-range="2026-10-03/2026-10-06" aria-label="Movement"></section>
<div class="kp-row kp-flex-wrap kp-gap-sm" role="group" aria-label="States">
<button type="button" class="kp-button" data-doc-calm-state="ready">Ready</button>
<button type="button" class="kp-button" data-doc-calm-state="loading">Loading</button>
<button type="button" class="kp-button" data-doc-calm-state="empty">Nothing logged</button>
<button type="button" class="kp-button" data-doc-calm-state="error">Could not read</button>
<button type="button" class="kp-button" data-doc-calm-fill="success" aria-pressed="false">Success plate</button>
</div>
</div>
`,
                script: `
import { CALENDAR_RETRY_EVENT, attachCalendars, setCalendarCaption, setCalendarDays, setCalendarState } from '@kp-soft/themes/js/calendar';

const calendar = document.getElementById('doc-calm-calendar');
attachCalendars(calendar.parentElement);
const minutes = { 1: 20, 2: 35, 7: 15, 8: 40, 9: 25, 12: 30, 13: 45, 14: 20, 15: 10 };
const logged = {};
for (const [day, count] of Object.entries(minutes)) {
    logged['2026-10-' + day.padStart(2, '0')] = { tone: 'logged', count: String(count), label: count + ' minutes' };
}
setCalendarDays(calendar, logged);
setCalendarCaption(calendar, 'Trends count the days that were logged');
for (const button of document.querySelectorAll('[data-doc-calm-state]')) {
    button.addEventListener('click', () => {
        const state = button.getAttribute('data-doc-calm-state');
        if (state === 'empty') setCalendarDays(calendar, {});
        else if (state === 'ready') setCalendarDays(calendar, logged);
        setCalendarState(calendar, state === 'empty' ? 'empty' : state);
    });
}
calendar.addEventListener(CALENDAR_RETRY_EVENT, () => {
    setCalendarState(calendar, 'loading');
    setTimeout(() => {
        setCalendarDays(calendar, logged);
        setCalendarState(calendar, 'ready');
    }, 1000);
});
document.querySelector('[data-doc-calm-fill]').addEventListener('click', (event) => {
    const on = calendar.getAttribute('data-kp-logged-fill') !== 'success';
    if (on) calendar.setAttribute('data-kp-logged-fill', 'success');
    else calendar.removeAttribute('data-kp-logged-fill');
    event.currentTarget.setAttribute('aria-pressed', String(on));
});
`,
            },
        ],
        variants: [
            { name: '[data-kp-calendar]', what: 'The calendar; `data-kp-calendar-month="YYYY-MM"` is the month it shows first (today’s by default) and `data-kp-calendar-selected="YYYY-MM-DD"` the day picked at first.' },
            { name: '.kp-calendar-layout', what: 'The calendar beside the page’s own detail of the picked day; one column under 45rem of its own width.' },
            { name: 'data-kp-tone="ok|warn|bad"', what: 'A day on its status plate, the text in the plate’s own ink: all done, partly done, nothing done.' },
            { name: 'data-kp-tone="muted|none"', what: 'Nothing to do that day (a muted plate), or nothing known about it (an outline).' },
            { name: 'data-kp-tone="future|before"', what: 'A day still to come, or from before anything was kept: a dashed outline, no count.' },
            { name: 'data-kp-tone="loading"', what: 'Every day while `setCalendarState(el, "loading", words)`: a muted plate that pulses, at rest under reduced motion.' },
            { name: 'data-kp-today', what: 'Written on today’s day: an inner ring in the text colour.' },
            { name: 'td[aria-selected="true"]', what: 'The picked day: an outer ring in the primary colour; the focus ring sits further out.' },
            { name: '.kp-calendar__pad', what: 'The neighbouring months’ days in the first and last weeks: their numbers, quiet and inert, so every week reads full.' },
            { name: '.kp-calendar__state', what: 'The line under the month: the words of `setCalendarState()`; an error’s after a dot in the destructive colour.' },
            { name: '.kp-calendar__legend', what: 'A swatch and its words per tone, from `setCalendarLegend(el, [{ tone, label }])`; hidden until given.' },
            { name: '.kp-calendar--busy-whole / --busy-days', what: 'How a loading month shows: one card with the theme’s spinner and the state’s words over the whole grid, or the theme’s spinner in every loading day. Without either, the loading days pulse.' },
            { name: 'pastel: the caterpillar', what: 'In pastel a loading day gets a pom-pom rim and two legs and rises in turn, with a head beside the last loading day of its week; the card over the whole month is a plate with its own pass, a head on its corner and stepping legs, stuck on as the landing and taken off as that backwards.' },
            { name: '--kp-calendar-busy-words', what: 'In a register: `hold` keeps the card’s words on the card while it leaves, so the card that goes is the one that came (pastel); js/calendar.js writes `data-kp-busy-words-held` on the card until it has gone. Unset, the words clear at once.' },
            { name: 'data-kp-tones', what: '`calm` on a calendar, heat grid or uptime strip (`standard` is the default): `logged`, `quiet` and `paused` instead of ok, warn and bad.' },
            { name: 'data-kp-quiet-words', what: '`none` leaves the words of a quiet day out of its name (`label`, “nothing logged”, is the default); a quiet cell never prints a count.' },
            { name: 'data-kp-logged-fill', what: '`success` asks for the success plate instead of the theme’s accent.' },
            { name: 'data-kp-calm-map', what: '`none` passes ok, warn and bad through; by default ok is logged and the rest quiet, with one console warning per foreign tone.' },
            { name: 'data-kp-paused-range', what: '`2026-10-03/2026-10-14` (an end is optional): quiet days inside it are drawn as paused.' },
            { name: 'data-kp-legend', what: '`hide` leaves out the calm legend (Logged, Nothing logged, Paused).' },
            { name: 'kp-calendar-retry and setCalendarCaption', what: 'A calm month with nothing logged keeps its six quiet rows under a centred plate; a month that could not be read is dimmed under one with Retry, which fires `kp-calendar-retry`. `setCalendarCaption(el, text)` writes the page’s own sentence under the grid.' },
            { name: '.kp-calendar__plate and .kp-calendar__caption', what: 'The plate that stands over a calm month with nothing logged or one that could not be read (its sentence and, when failed, a normal-size Retry), and the page’s own sentence under the grid. Both are made by the module.' },
            { name: 'calmTone, calmWord, inPausedRange and CALM_TONES', what: 'js/calm-tones.js on its own, for a page that draws its own cells: `calmTone(tone, el)` maps a tone to the calm vocabulary (ok to logged, the rest to quiet, one console warning per foreign tone), `calmWord(tone)` is “logged”, “nothing logged” or “paused” and never “missed”, `inPausedRange(range, iso)` says whether a `YYYY-MM-DD` lies in a `from/to` pause, and `CALM_TONES` lists the six tones: logged, quiet, paused, future, before, loading.' },
            { name: 'marks the module writes', what: '`data-kp-plate` (which plate stands over the grid) and `data-kp-dim` (a failed month’s grid).' },
            { name: 'empty and failed, every tone', what: 'Every tone gets the state plate for `empty` and `error`: the heading is the words given to `setCalendarState`, Retry fires `kp-calendar-retry`, and the grid is dimmed and inert under it.' },
        ],
        accessibility: [
            'Built in — one `table[role=grid]` named by the month’s title, seven column heads with the full weekday as their `abbr`, and one tab stop: arrows, Home/End, Page Up/Down (Shift: a year), Enter or Space to pick.',
            'Built in — every day is named by its date as dd/mm/yyyy and the page’s words for it, so the colour is never the only carrier.',
            'Built in — a live update repaints in place: the focus and the pick stay on the same element.',
            'Yours — give each day words that say what its colour says (`label`), and name the calendar (`aria-label`) when the month’s title alone does not say what it counts.',
            'Yours — put the detail of a picked day in a polite live region, or move the focus there, so a screen reader hears it.',
        ],
    };
