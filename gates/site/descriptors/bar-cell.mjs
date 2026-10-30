// Page descriptor for the "bar-cell" documentation page [AR19]; the shape is pinned in ./types.mjs.

/** @type {import('./types.mjs').Descriptor} */
export const barCellDescriptor = {
        id: 'bar-cell',
        title: 'Bar in a table cell',
        group: 'Data',
        classes: ['kp-bar-cell'],
        aliases: ['bar'],
        exports: [],
        intro: 'A value with a proportional bar inside a table cell: the meter and its figure, the figure in a column of its own on the end edge, so a column of them lines up its bars and its numbers. `data-kp-bar="0.62"` on the span is enough (`data-kp-bar-text`, `-tone`, `-mark`, `-label`, `-loading`, `-warn` and `-bad` refine it); `setBarCell(span, { value, text })` in js/barcell.js does the same from script. From 0.75 the fill is the warning colour, from 0.9 the destructive one. A data table sorts a cell by its `data-kp-sort-value` when it has one, and `setBarCell` writes it.',
        whenToUse:
            'In a table where the share of something is the point of a column: capacity per stack, how full a disk is. Not alone on a page (use the meter).',
        examples: [
            {
                title: 'A bar column that sorts by its share',
                why: 'The cell shows "62%" and sorts by 62; `data-kp-sort-value` on the `td` is what the data table reads.',
                markup: `
<table class="kp-table"><thead><tr><th scope="col">Stack</th><th scope="col">Disk</th></tr></thead>
<tbody><tr><td>media</td><td data-kp-sort-value="62"><span class="kp-bar-cell" data-kp-bar="0.62"></span></td></tr></tbody></table>
`,
            },
        ],
        variants: [
            { name: '.kp-bar-cell--start', what: 'The figure before the bar.' },
            { name: 'data-kp-bar', what: 'The share, 0 up (1 is full; above 1 the bar is full and says so); empty is not measured.' },
            { name: 'data-kp-bar-text', what: 'The words beside the bar; without them, the rounded percentage.' },
            { name: 'data-kp-bar-tone', what: '`warning`, `destructive` or `none`; without it the share decides.' },
            { name: 'data-kp-bar-warn', what: 'The share from which the fill is the warning colour (0.75).' },
            { name: 'data-kp-bar-bad', what: 'The share from which the fill is the destructive colour (0.9).' },
            { name: 'data-kp-bar-mark', what: 'A tick on the bar: a limit, a target.' },
            { name: 'data-kp-bar-label', what: 'What the share is, for a screen reader.' },
            { name: 'data-kp-bar-loading', what: 'The bar is the busy track at its own size and the figure is empty.' },
        ],
        accessibility: [
            'Built in — the bar is the package’s meter: `role="meter"` with a value text that names the real share, past 100 % too.',
            'Yours — keep the figure beside the bar: colour and length are not the only carrier.',
        ],
    };
