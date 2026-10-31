// Page descriptor for the "datatable" documentation page [AR19]; the shape is pinned in ./types.mjs.

import { actionsColumnExample } from './datatable-actions.mjs';

/** @type {import('./types.mjs').Descriptor} */
export const datatableDescriptor = {
        id: 'datatable',
        title: 'Data table',
        group: 'Data',
        classes: ['kp-datatable'],
        exports: ['DataTable'],
        aliases: [
            'footprint',
            'sort',
            'select',
            'page',
            'row',
            'debounce',
            'locale',
            'cards',
            'filter',
            'filters',
            'search',
            'state',
            'max',
            'direction',
            // The seven of Kenny's form of 2026-09-13.
            'column',
            'expand',
            'expandable',
            'expanded',
            'fixed',
            'edit',
            'cell-class',
            'server',
            'total',
            // scope-90: the state that draws the sticky header's reach.
            'scrolled',
            'folded',
            // mc-1030: the actions column (`data-kp-col="actions"`); and row reorder's own name, longer than the row editor's `rows`.
            'col',
            'rows-reorder'],
        intro: 'Sorting, searching, paging and row selection over a table the server already rendered. It works on the rows that are in the document and owns no data; a table marked `data-kp-server` asks your `load` for each page instead.',
        whenToUse:
            'For a table a reader will interrogate — hundreds of rows, a search box, a sort on one column or several, a choice of columns, rows that open, values edited in place, arrow keys between cells. Not for thousands without a server behind it: there is no virtualisation, and export is the app’s, from the rows the table hands over. Not for a handful of rows either, where a search box over six lines is furniture.',
        examples: [
            {
                title: 'Search, sort, page and select',
                why: 'Everything is markup the server wrote, so the table is readable before any script runs. The status paragraph says which rows are showing after each change, which is what makes the filtering audible. A filter is declared on its header (`data-kp-filter="choice"`, `range` or `date`) and leaves a removable pill; `data-kp-sort-order` sorts a column by meaning; the "In" choice limits the search to one column; `data-kp-max-height` keeps the header in view; `data-kp-state="loading"` or `"failed"` shows those states, and `data-kp-cards` turns rows into cards with a sort control of their own.',
                markup: `
<div class="kp-datatable" data-kp-datatable data-kp-page-size="3" data-kp-cards>
<div class="kp-datatable__bar">
<input class="kp-datatable__search" type="search" data-kp-datatable-search aria-label="Search the table" placeholder="Search…" />
<select class="kp-field__input kp-datatable__select" data-kp-datatable-scope></select>
<select class="kp-field__input kp-datatable__select" data-kp-datatable-density></select>
</div>
<div class="kp-datatable__actions" data-kp-datatable-actions hidden>
<span data-kp-datatable-selected-count></span>
<button type="button" class="kp-button kp-button--ghost" data-kp-datatable-clear-selection>Clear selection</button>
</div>
<div class="kp-table-wrap">
<table class="kp-table">
<caption>Orders</caption>
<thead><tr>
<th scope="col"><input class="kp-field__check" type="checkbox" data-kp-select-all aria-label="Select every row on this page" /></th>
<th scope="col" data-kp-sort="text" data-kp-filter="choice">Customer</th>
<th scope="col" data-kp-sort="number" data-kp-filter="range">Amount</th>
<th scope="col" data-kp-sort="date" data-kp-filter="date">Date</th>
</tr></thead>
<tbody>
<tr data-kp-row-key="r0"><td><input type="checkbox" data-kp-select-row aria-label="Select Acme" /></td><td>Acme</td><td class="kp-numeric">100.00</td><td class="kp-timestamp">2026-03-01</td></tr>
<tr data-kp-row-key="r1"><td><input type="checkbox" data-kp-select-row aria-label="Select Bakker" /></td><td>Bakker</td><td class="kp-numeric">20.00</td><td class="kp-timestamp">2026-01-12</td></tr>
<tr data-kp-row-key="r2"><td><input type="checkbox" data-kp-select-row aria-label="Select Cerise" /></td><td>Cerise</td><td class="kp-numeric">1,284.50</td><td class="kp-timestamp">2026-09-04</td></tr>
<tr data-kp-row-key="r3"><td><input type="checkbox" data-kp-select-row aria-label="Select Delta" /></td><td>Delta</td><td class="kp-numeric">7.00</td><td class="kp-timestamp">2025-11-30</td></tr>
</tbody>
</table>
</div>
<div class="kp-empty" data-kp-datatable-empty hidden>Nothing found.</div>
<div class="kp-datatable__bar">
<p class="kp-datatable__status" data-kp-datatable-status role="status" aria-live="polite"></p>
<div class="kp-datatable__pager" data-kp-datatable-pager></div>
</div>
</div>
`,
            },
            {
                title: 'Loading, with a layer over the rows',
                why: 'A table that is still asking: `data-kp-state="loading"` and `data-kp-busy-overlay` on the wrapper put a panel with the theme’s large spinner over the rows; the status line under the table says the same, and it is the one a screen reader hears. In pastel the panel is a plate with its own pass, stuck on as everything is, and it becomes caterpillar: a head on its top-end corner and legs along its foot, with the round-trip spinner on it.',
                markup: `
<div class="kp-datatable" data-kp-datatable data-kp-state="loading" data-kp-busy-overlay>
<div class="kp-table-wrap">
<table class="kp-table">
<caption class="kp-sr-only">Containers, loading again</caption>
<thead><tr><th scope="col">Stack</th><th scope="col">Container</th><th scope="col">State</th></tr></thead>
<tbody>
<tr><td>media</td><td>jellyfin</td><td>running</td></tr>
<tr><td>platform</td><td>traefik</td><td>running</td></tr>
<tr><td>platform</td><td>crowdsec</td><td>restarting</td></tr>
<tr><td>monitoring</td><td>grafana</td><td>running</td></tr>
</tbody>
</table>
</div>
<div class="kp-datatable__bar">
<p class="kp-datatable__status" data-kp-datatable-status role="status" aria-live="polite"></p>
</div>
</div>
`,
            },
            {
                title: 'Several sort keys by plain click, sorted by a value, filtered by a word',
                why: '`data-kp-sort-multi="click"` makes a plain press on a header (Enter, Space) add a sort key and Shift + click sort on that column alone; the reset button and the sort summary are the ordinary ones. A cell’s `data-kp-sort-value` is what it sorts and range-filters by in place of its text: the size says “1.2 GB” and sorts by its bytes. A cell’s `data-kp-filter-value` is the word a choice filter lists and matches it by: the status cell shows a dot and a time, the filter offers “running” and “stopped”.',
                markup: `
<div class="kp-datatable" data-kp-datatable data-kp-sort-multi="click" data-kp-page-sizes="none">
<div class="kp-table-wrap">
<table class="kp-table">
<caption class="kp-sr-only">Backups</caption>
<thead><tr>
<th scope="col" data-kp-sort="text">Stack</th>
<th scope="col" data-kp-sort="text" data-kp-filter="choice">Status</th>
<th scope="col" data-kp-sort="number" class="kp-text-end">Size</th>
</tr></thead>
<tbody>
<tr data-kp-row-key="s0"><td>media</td><td data-kp-filter-value="running"><span class="kp-badge kp-badge--success">● 02:14</span></td><td class="kp-text-end kp-numeric" data-kp-sort-value="1200000000">1.2 GB</td></tr>
<tr data-kp-row-key="s1"><td>home</td><td data-kp-filter-value="stopped"><span class="kp-badge">○ 3 days ago</span></td><td class="kp-text-end kp-numeric" data-kp-sort-value="950000">950 KB</td></tr>
<tr data-kp-row-key="s2"><td>network</td><td data-kp-filter-value="running"><span class="kp-badge kp-badge--success">● 03:30</span></td><td class="kp-text-end kp-numeric" data-kp-sort-value="48000000">48 MB</td></tr>
<tr data-kp-row-key="s3"><td>docs</td><td data-kp-filter-value="running"><span class="kp-badge kp-badge--success">● 04:02</span></td><td class="kp-text-end kp-numeric" data-kp-sort-value="48000000">48 MB</td></tr>
</tbody>
</table>
</div>
<div class="kp-datatable__bar">
<p class="kp-datatable__status" data-kp-datatable-status role="status" aria-live="polite"></p>
</div>
</div>
`,
            },
            {
                title: 'A group heading that stays with no row under it',
                why: '`data-kp-group-always` on a `tr[data-kp-row-group]` heading keeps it visible when no data row stands under it: here the second group is still loading (skeleton rows), the third failed (with a Retry in the heading) and the fourth is empty, with its reason. Without the attribute a heading with no row is hidden, as the rows are.',
                markup: `
<div class="kp-datatable" data-kp-datatable data-kp-page-sizes="none">
<div class="kp-table-wrap">
<table class="kp-table">
<caption class="kp-sr-only">Backup repositories by stack. Stacks with nothing to list still show their heading and say why.</caption>
<thead><tr><th scope="col" data-kp-sort="text">Repository</th><th scope="col" data-kp-sort="number" class="kp-text-end">Snapshots</th></tr></thead>
<tbody>
<tr data-kp-row-group="media"><th scope="rowgroup" colspan="2">Stack media <span class="kp-badge" data-kp-group-count></span></th></tr>
<tr data-kp-row-key="media-jellyfin" data-kp-group-of="media"><td>media-jellyfin</td><td class="kp-text-end kp-numeric">42</td></tr>
<tr data-kp-row-group="home" data-kp-group-always><th scope="rowgroup" colspan="2">Stack home (still loading) <span class="kp-badge" data-kp-group-count></span></th></tr>
<tr data-kp-skeleton-row aria-hidden="true"><td colspan="2"><span class="kp-skeleton" style="display: block; block-size: 1em"></span></td></tr>
<tr data-kp-row-group="platform" data-kp-group-always><th scope="rowgroup" colspan="2">Stack platform (failed) <span class="kp-badge" data-kp-group-count></span> <span class="kp-text-muted">Could not reach the repository.</span> <button type="button" class="kp-button kp-button--sm">Retry</button></th></tr>
<tr data-kp-row-group="lab" data-kp-group-always><th scope="rowgroup" colspan="2">Stack lab (no repositories) <span class="kp-badge" data-kp-group-count></span> <span class="kp-text-muted">No repository is configured for this stack.</span></th></tr>
</tbody>
</table>
</div>
</div>
`,
            },
            {
                title: 'A table the page sorts itself, and a column that cannot be sorted now',
                why: '`data-kp-sort-external` makes the page the one that sorts: a header press draws the arrow, `aria-sort`, the key numbers, the sort summary and Reset, remembers the sort and fires `kp-datatable-sort`, but the rows keep the order the page renders. The page reorders its rows (here in the browser, in a real page from the server) and calls `refresh()`. A header with `aria-disabled="true"` is a column that cannot be sorted now: pressing it does nothing and the sort stays as it is. Sort the table by Snapshots; Notes cannot be sorted. A table the page reads from a server holds its frame plus `data-kp-footprint-rows` rows (default: the page size) when its very first read fails or is empty, so the plate is as high as the rows would be.',
                markup: `
<div class="kp-datatable" data-kp-datatable data-kp-sort-external data-kp-page-sizes="none" data-kp-footprint-rows="4" data-doc-external>
<div class="kp-table-wrap">
<table class="kp-table">
<caption class="kp-sr-only">Backup repositories, sorted by the page</caption>
<thead><tr>
<th scope="col" data-kp-sort="text">Stack</th>
<th scope="col" data-kp-sort="number" class="kp-text-end">Snapshots</th>
<th scope="col" data-kp-sort="text" aria-disabled="true">Notes</th>
</tr></thead>
<tbody>
<tr data-kp-row-key="media"><td>media</td><td class="kp-text-end kp-numeric">42</td><td>Nightly</td></tr>
<tr data-kp-row-key="home"><td>home</td><td class="kp-text-end kp-numeric">7</td><td>Weekly</td></tr>
<tr data-kp-row-key="network"><td>network</td><td class="kp-text-end kp-numeric">120</td><td>Hourly</td></tr>
<tr data-kp-row-key="docs"><td>docs</td><td class="kp-text-end kp-numeric">19</td><td>Nightly</td></tr>
</tbody>
</table>
</div>
<div class="kp-datatable__bar">
<p class="kp-datatable__status" data-kp-datatable-status role="status" aria-live="polite"></p>
</div>
</div>
`,
                script: `
import { dataTable } from '@kp-soft/themes/js/datatable';

const wrap = document.querySelector('[data-doc-external]');
const body = wrap.querySelector('tbody');
const given = [...body.rows];

wrap.addEventListener('kp-datatable-sort', (event) => {
    const sort = event.detail;
    const rows = [...given];
    if (sort) {
        const sign = sort.direction === 'ascending' ? 1 : -1;
        const value = (row) => row.cells[sort.column].textContent.trim();
        rows.sort((a, b) => sign * value(a).localeCompare(value(b), undefined, { numeric: true }));
    }
    body.replaceChildren(...rows);
    dataTable(wrap).refresh();
});
`,
            },
            actionsColumnExample,
        ],
        variants: [
            { name: 'data-kp-sort-multi="click"', what: 'A plain press on a header (Enter, Space) adds a sort key and Shift + click sorts on that column alone; without a value, Shift + click adds the key as it always did. `multiSort: \'click\'` is the same in script.' },
            { name: 'td data-kp-sort-value', what: 'The value a cell sorts and range- or date-filters by in place of its text: a bar cell’s share, a size’s bytes.' },
            { name: 'td data-kp-filter-value', what: 'The word a choice filter lists and matches a cell by in place of its text: a status cell with a dot and a time is filtered as “running”.' },
            { name: 'data-kp-group-always', what: 'On a `tr[data-kp-row-group]` heading: it stays visible with no data row under it (loading, failed with a Retry in the heading, empty with the reason). Without it the heading is hidden with its rows.' },
            { name: 'the busy card', what: 'The loading card of a busy table (`.kp-datatable__busy-overlay.kp-datatable__busy-card` over a `.kp-datatable__busy-panel`: the theme’s spinner and words) is `openBusyCard(host, { words, area, className, arrive })` in `js/busy-card.js` (`BUSY_CARD` selects it), and the heat grid, matrix and run timeline lay the same one over their cells and lanes. A container named `kp-busy-card` lays the panel flat over a short area.' },
            { name: 'data-kp-folded', what: 'Written on a group row (`tr[data-kp-row-group]`) while its members are folded away; `fold()` and `view().folded` read and set it.' },
            {
                name: 'loading, on a phone',
                what: 'In a table under 30rem the busy layer lies flat over the skeleton rows: the spinner beside the words, the words kept to three lines (the status line says all of it), the layer clipped to the table [scope-143].',
            },
            { name: '.kp-datatable__bar', what: 'A row of controls above or below the table: the search box, the status line, the pager.' },
            { name: '.kp-datatable__sort', what: 'The sort control inside a header cell. It wears the header’s own case and spacing, and a click anywhere in the header sorts.' },
            { name: '.kp-datatable__filters / __pills', what: 'The filter panel the headers declare, and the removable pills of the filters that are set.' },
            { name: '.kp-datatable__actions', what: 'The action bar a selection shows, with the count; the buttons in it are the app’s.' },
            { name: '.kp-datatable__card-sort', what: 'The sort control of the card layout, where the headers that sort are hidden.' },
            { name: '.kp-datatable__select / __label', what: 'A choice in a bar: the "In" choice, the density, the rows per page.' },
            { name: 'sorted ascending / descending', what: 'An arrow after the header text and the sort state on the header itself; the arrow is the second carrier, the state is what is announced.' },
            { name: '.kp-datatable__pager / __page', what: 'The page controls and the “page m of n” label, in same-width digits.' },
            { name: '.kp-datatable__page-size', what: 'The rows-per-page control, before the pager.' },
            { name: '.kp-datatable__sort-order / __sort-summary', what: 'With `data-kp-sort-multi`: each sorted header’s place in the sort, and the sort said in words above the table.' },
            {
                name: 'data-kp-sort-external',
                what: 'The page sorts: a header press draws the arrow, `aria-sort`, the key numbers, the summary and Reset, remembers the sort and fires `kp-datatable-sort`; the rows keep the order the page renders, which it changes and then calls `refresh()` (`view().sorts` has every key). A sortable header with `aria-disabled="true"` cannot be pressed now and keeps an arrow it already has. Also the `sortExternal` option.',
            },
            { name: '.kp-datatable__columns / __column-option', what: 'With `data-kp-column-menu`: the menu of columns, on the popover layer, and one checkbox per column; the key column is locked.' },
            { name: '.kp-datatable__expand / __detail', what: 'With `data-kp-expandable`: the button that opens a row, and the detail row under it that spans every column.' },
            { name: 'fixed columns', what: 'With `data-kp-fixed-columns`: the key column stays at the left edge on an opaque ground, with a hairline, while the box scrolls sideways.' },
            { name: '.kp-datatable__edit / __editor / __edit-log', what: 'With `data-kp-edit` on a header: a value as a button with a dashed underline, the package’s control that edits it in the cell, and the line that says what changed, with Undo.' },
            { name: '.kp-datatable__grid-readout', what: 'With `data-kp-grid`: the table is an ARIA grid, and this line says which cell has the focus.' },
            { name: '.kp-datatable__status', what: 'The live region that says how many rows are showing after a search, a sort or a page.' },
            { name: '.kp-datatable__search', what: 'The search box. Typing is debounced so a long list is not re-sorted on every keystroke.' },
            { name: 'empty', what: 'When a filter matches nothing the empty state takes the table’s place rather than leaving a header over nothing.' },
            { name: 'clickable rows', what: 'A row can be marked as a control, which gives it the pointer cursor and an activation of its own.' },
            { name: 'pastel: the busy panel', what: 'In pastel the busy panel draws its own plate and pass and lands on it as every part does, leaves as that backwards, and while it waits it becomes caterpillar (a head on its corner, stepping legs) with the round-trip spinner on it.' },
            { name: 'filter, scope, editFilter by column id', what: '`filter(column, value)`, `scope(column)` and `editFilter(column)` take the column’s id (the header’s `data-kp-field`, else its text) as well as its number; `columnIndex(id)` gives the number (-1 when none), and `view().filtersByField` reads the filters back by id. A server request carries the same `filtersByField`.' },
            { name: 'data-kp-row-hidden', what: 'On a `tr`: held out of the table for an Undo window. It is not counted, paged, searched or shown, and every redraw keeps it hidden.' },
            { name: 'rows the page adds or removes', what: 'A client-side table re-reads rows the page adds or removes by itself (no `refresh()` needed) and keeps the page; `refresh({ keepPage })` keeps it when you call it yourself. `view().pageNumber` is the page the reader sees, while `page()` counts from 0.' },
            { name: 'column numbers', what: 'The toggle column of an expandable table is column 0 in every column number. `data-kp-expand-single` is read again when it changes, and date pills and refusals write dates in the table’s locale.' },
            { name: 'failed and empty', what: 'A failed table and a table with nothing to show cover their rows with the state plate and hold the height the table had (the rows stay in the document); the page’s own `data-kp-datatable-empty` and `data-kp-datatable-failed` slots become the same plate.' },
            { name: 'live options', what: 'The row for `data-kp-sort-multi`, `data-kp-filter-mode` and the other attributes above is switchable at runtime: changing the attribute redraws the table, and the table keeps its view (sort, filters, page) while it switches.' },
            { name: 'data-kp-cards="spread"', what: 'Cards derive `data-label` from the header; card lines sit on two tracks (label, value), and `spread` puts the label and the value at the opposite edges of the line.' },
            { name: 'data-kp-filter-ui="none"', what: 'Leaves out the filter controls while the filters still apply (a page that sets them itself).' },
            { name: 'data-kp-cards-at', what: 'On the table: the width of its own under which it becomes cards, `30rem` or `480px` (a bare number is rem). It can lower the 40rem the cards answer to, never raise it. While wider, the script writes `data-kp-cards-idle` and the card rules do not apply.' },
            { name: 'data-kp-col="actions"', what: 'On a header: its column is a fixed track as wide as its buttons and never wraps; the script marks the cells under it alike. In a card that cell has no label and its buttons fill a row across the card.' },
            { name: '.kp-table__actions', what: 'The buttons of one row, in equal columns, so every row’s Edit and Delete have one width (a knob sets the least).' },
            { name: 'attachCardsAt / attachTableActionColumns', what: 'The two hooks behind those attributes (js/datatable.js); js/auto.js calls them for a table that asks, so a page calls them only for a table it builds later. Each returns a detach.' },
            { name: 'data-kp-fixed-end', what: 'Pins the last column (the actions) at the end edge while the rest scrolls, on an opaque ground.' },
        ],
        accessibility: [
            'Built in — every sortable header is a real button inside the cell, so sorting is reachable without a pointer.',
            'Built in — the sort state, the row count and the current page are announced in words, not only drawn.',
            'Built in — numbers and dates are read in the page’s locale, so a sort agrees with what the reader sees.',
            'Yours — give every row a stable key if you care which rows are selected after a sort.',
            'Yours — name the search box and every row checkbox; “select row” is not a name when there are forty of them.',
            'Yours — render the rows on the server. This works on what is there; a table that appears only after a script has run is an empty box on first paint.',
        ],
    };
