// More examples of the data table page (gates/site/descriptors/datatable.mjs joins them).

/** @type {import('./types.mjs').Example[]} */
export const DATATABLE_EXAMPLES_2 = [
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
];
