// Page descriptor for the "datepicker" documentation page [AR19]; the shape is pinned in ./types.mjs.

/** @type {import('./types.mjs').Descriptor} */
export const datepickerDescriptor = {
        id: 'datepicker',
        title: 'Date picker',
        group: 'Forms',
        classes: ['kp-datepicker'],
        exports: ['DatePicker'],
        aliases: ['date', 'day', 'month', 'year', 'view', 'min', 'max', 'week-starts-on', 'close-on-select', 'next-glyph', 'previous-glyph', 'disabled', 'disabled-days', 'locale', 'align', 'overlay-side'],
        intro: 'A text input that takes a typed date, with a calendar beside it for the reader who would rather look. The value is kept as an ISO date whatever the page’s locale prints, so a consumer never parses a localised string.',
        whenToUse:
            'For a date a person knows or can find in a month — a start date, a deadline. Not for a birth date far in the past, where three selects or a typed field beat paging a calendar back forty years; and not for a date the browser can own entirely, where the native date input is smaller and already localised.',
        examples: [
            {
                title: 'Typed, with the calendar as an aid',
                why: 'Typing always works and the grid never has to open, which is what keeps the control usable for someone who would otherwise be walked through thirty-one buttons. The panel is built when it is opened rather than written by the server.',
                markup: `
<div class="kp-datepicker" data-kp-datepicker>
<div class="kp-field">
<label class="kp-field__label" for="doc-date-from">From</label>
<input class="kp-field__input" id="doc-date-from" type="text" inputmode="numeric" placeholder="dd/mm/yyyy" data-kp-date-input />
</div>
<button type="button" class="kp-button kp-button--ghost" data-kp-date-open aria-label="Open the calendar">Calendar</button>
<div class="kp-datepicker__panel" data-kp-date-panel hidden></div>
</div>
`,
            },
            {
                title: 'The locale\u2019s own order, by attribute',
                why: 'Added 2026-10-15 (`datetime-M1`). A date is written dd/mm/yyyy for every reader (rule 52), whatever the page\u2019s language, so `04/09/2026` is the fourth of September in New York as in Brussels. `data-kp-date-format="locale"` on the picker brings back the order and separator the locale writes: this picker is `en-US`, so the field is written, hinted and read month first (`09/04/2026`, `mm/dd/yyyy`); in script it is `attachDatePickers(root, { dateFormat: \'locale\' })`. The value the module keeps is the ISO date either way, and the month and weekday names always follow the locale.',
                markup: `
<div class="kp-datepicker" data-kp-datepicker data-kp-locale="en-US" data-kp-date-format="locale">
<div class="kp-field">
<label class="kp-field__label" for="doc-date-us">Delivery (month first)</label>
<input class="kp-field__input" id="doc-date-us" type="text" inputmode="numeric" data-kp-date-input value="09/04/2026" />
</div>
<button type="button" class="kp-button kp-button--ghost" data-kp-date-open aria-label="Open the calendar">Calendar</button>
<div class="kp-datepicker__panel" data-kp-date-panel hidden></div>
</div>
`,
            },
            {
                title: 'A range with a floor and weekends closed',
                why: 'The bounds and the closed days are declared on the markup, so a server that already knows them does not have to repeat them in script.',
                markup: `
<div class="kp-datepicker" data-kp-datepicker data-kp-min="2026-01-01" data-kp-max="2026-12-31" data-kp-disabled-days="0,6">
<div class="kp-field">
<label class="kp-field__label" for="doc-date-visit">Visit</label>
<input class="kp-field__input" id="doc-date-visit" type="text" inputmode="numeric" data-kp-date-input />
</div>
<button type="button" class="kp-button kp-button--ghost" data-kp-date-open aria-label="Open the calendar">Calendar</button>
<div class="kp-datepicker__panel" data-kp-date-panel hidden></div>
</div>
`,
            },
        ],
        variants: [
            { name: '.kp-datepicker__panel', what: 'The calendar, floating under the input on its own surface. It is rendered when it opens because a month grid is derived from a date.' },
            { name: '.kp-datepicker__head / __title', what: 'The month, its name, and the two controls that page it. The title is a button that opens the twelve months of the year, and there the year opens twelve years.' },
            { name: 'month and year grids', what: 'Twelve cells, three a row, drawn with the day’s class so every theme paints them; the panel keeps the size the days had. Choosing a year shows its months, a month its days.' },
            { name: 'data-kp-date-format', what: '`rule52` (the default): the field is written, hinted and read dd/mm/yyyy whatever the locale; `locale`: the order and separator the locale writes (09/04/2026 under en-US, 04.09.2026 under de-DE). Script: `dateFormat: \'locale\'` in the options of attachDatePickers; React: the `dateFormat="locale"` prop of DatePicker (default `"rule52"`). The ISO value does not change.' },
            { name: '.kp-datepicker__grid / __weekday', what: 'Seven columns with the week starting where the locale says, unless the markup overrules it.' },
            { name: '.kp-datepicker__day', what: 'One day. Exactly one of them is in the tab order at a time; the arrows move between the rest.' },
            { name: 'selected day', what: 'Carries a boundary as well as a fill, so it is still the chosen day when the fill matches the hover.' },
            { name: 'disabled day', what: 'Outside the bounds or on a closed weekday: present, marked, and refusing the click.' },
            { name: 'pastel', what: 'In pastel the date picker’s panel has its pass on its ::backdrop and lands on it; it closes as that backwards, and the focus returns to the input when it has closed.' },
        ],
        accessibility: [
            'Built in — the focus returns to the input when the picker has closed, not at the start of the close.',
            'Built in — the grid is a real grid: arrows by day, Page keys by month, Home and End to the ends of the week, and one tab stop for the whole month.',
            'Built in — the month and year grids take the same keys a size up, Escape steps back one grid, and the grid that opens is named and announced.',
            'Built in — typing is a complete route to a date, so nobody is forced through the calendar at all.',
            'Built in — the month and the chosen date are announced when they change, in the page’s own locale.',
            'Yours — label the input and name the button that opens the calendar.',
            'Yours — read the ISO value the module keeps rather than the text on screen, which is localised.',
            'Yours — say what format you expect near the field; a placeholder disappears the moment someone types.',
        ],
    };
