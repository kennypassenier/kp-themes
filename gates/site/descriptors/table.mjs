// Page descriptor for the "table" documentation page [AR19]; the shape is pinned in ./types.mjs.

/** @type {import('./types.mjs').Descriptor} */
export const tableDescriptor = {
        id: 'table',
        title: 'Table',
        group: 'Data',
        classes: ['kp-table', 'kp-table-wrap', 'kp-cell-break', 'kp-cell-truncate', 'kp-col-low'],
        exports: ['Table'],
        aliases: ['region'],
        intro: 'The plain table: header, rows, tabular numerals, and a wrapper that scrolls a wide table inside its own box instead of pushing the page sideways. That box is a named region a keyboard can reach.',
        whenToUse:
            'For data the server already knows and the reader only reads. Reach for the data table instead as soon as sorting, filtering or paging is wanted. Do not use a table for layout — the row and grid classes of the layout layer are for that, and a layout table is announced to a screen reader as data with rows and columns.',
        examples: [
            {
                title: 'A table in its scroll region',
                why: 'The wrapper is upgraded on attach: it becomes focusable, takes the region role, and is named after the caption — so someone who cannot use a mouse can reach the scrollbar and is told which table they landed in.',
                markup: `
<div class="kp-table-wrap">
<table class="kp-table">
<caption>Applications</caption>
<thead><tr><th scope="col">Company</th><th scope="col">Status</th><th scope="col">Amount</th></tr></thead>
<tbody>
<tr><td>Example Inc</td><td>Interview</td><td class="kp-numeric">1,284.50</td></tr>
<tr><td>Second Ltd</td><td>Offer</td><td class="kp-numeric">998.00</td></tr>
</tbody>
</table>
</div>
`,
            },
            {
                title: 'Cells that do not fit, and a column that may go',
                why: 'Two different problems: an identifier is one unbreakable word that widens the whole table, and a sentence is prose that should be cut with the full value still in the cell. The low-priority column is dropped at the same width the rows become cards.',
                markup: `
<div class="kp-table-wrap">
<table class="kp-table">
<caption>Deliveries</caption>
<thead><tr><th scope="col">Key</th><th scope="col">Note</th><th scope="col" class="kp-col-low">Updated</th></tr></thead>
<tbody>
<tr>
<td class="kp-cell-break">7f3a9c21-4e18-4b7d-9f02-6d5e8a1c0b44</td>
<td class="kp-cell-truncate" title="Left with a neighbour who was not in when the courier came back">Left with a neighbour who was not in when the courier came back</td>
<td class="kp-col-low kp-timestamp">2026-09-06 14:07</td>
</tr>
</tbody>
</table>
</div>
`,
            },
            {
                title: 'Rows as cards in a narrow container',
                why: 'Opt-in, because every table that already ships would otherwise change shape in a minor release. The width that decides is the width of the table’s own container, not the window’s, so a table in a narrow column falls into cards on a wide page.',
                markup: `
<div class="kp-table-wrap">
<table class="kp-table" data-kp-cards>
<caption>Orders</caption>
<thead><tr><th scope="col">Customer</th><th scope="col">Amount</th></tr></thead>
<tbody>
<tr><td data-label="Customer">Acme</td><td data-label="Amount" class="kp-numeric">100.00</td></tr>
<tr><td data-label="Customer">Bakker</td><td data-label="Amount" class="kp-numeric">20.00</td></tr>
</tbody>
</table>
</div>
`,
            },
        ],
        variants: [
            { name: '.kp-table', what: 'The table itself: collapsed borders, quiet header ink, and same-width digits so a column of numbers does not shimmer.' },
            { name: '.kp-table-wrap', what: 'The scroll box. It is also the element the card layout measures, so the query asks about the space the table actually has.' },
            { name: '.kp-cell-break', what: 'For identifiers: a long unbroken key wraps anywhere instead of widening every row.' },
            { name: '.kp-cell-truncate', what: 'For prose: one line with an ellipsis, the whole value still in the cell for a reader, a search and a copy.' },
            { name: '.kp-col-low', what: 'A column that disappears when the rows become cards. Header and cells together, because values with no column name are worse than no column.' },
            { name: 'cards', what: 'Opt-in on the table: below the threshold each row becomes a card and each cell carries its column name.' },
            { name: 'row hover', what: 'A quiet wash on the hovered row; it is not a selection, and nothing depends on it.' },
            { name: 'failed and empty', what: 'A failed table and a table with nothing to show cover their rows and the plate fills the height the table had (`[data-kp-state-covered]`); the rows stay in the document.' },
        ],
        accessibility: [
            'Built in — the scroll region gets a tab stop, a role and a name from the caption, which is the repair for a wide table nobody without a mouse could scroll.',
            'Built in — the card layout carries each column name into its cell, so a value never appears without its question.',
            'Built in — the wrapper keeps the page from scrolling sideways, which is what SC 1.4.10 asks for.',
            'Yours — write a caption. It is the table’s name, for the region as well as for a reader.',
            'Yours — mark header cells with their scope, and use a header cell for a row’s own label.',
            'Yours — put the column name on each cell if you turn the card layout on; nothing else can know it.',
        ],
    };
