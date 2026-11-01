// The first examples of the data table page (gates/site/descriptors/datatable.mjs adds the rest and the actions column).

/** @type {import('./types.mjs').Example[]} */
export const DATATABLE_EXAMPLES = [
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
];
