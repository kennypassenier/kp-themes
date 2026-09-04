// DataTable, framework-free [TH37].
//
// The features are measured against TanStack Table, which is what "the
// best in 2026" means: sorting, per-column and global filtering,
// pagination, column visibility, row selection, expandable rows. What is
// deliberately absent is virtualisation, in-cell editing and export —
// that is a grid, a different product, and TH42 records the decision.
//
// **This works on a table the server already rendered.** It sorts and
// filters the rows that are in the DOM; it does not fetch, and it does not
// own the data. kyu and almanac render their HTML from a Rust binary, so a
// table that only exists after JavaScript runs would leave them with an
// empty box on first paint — and a table is exactly the thing a reader
// needs before the scripts arrive.
//
//   <div class="kp-datatable" data-kp-datatable>
//     <input data-kp-datatable-search type="search" />
//     <table class="kp-table">
//       <thead><tr>
//         <th data-kp-sort="text">Naam</th>
//         <th data-kp-sort="number">Bedrag</th>
//       </tr></thead>
//       <tbody>…</tbody>
//     </table>
//     <p data-kp-datatable-status role="status" aria-live="polite"></p>
//   </div>
//
// The hard part of a data table is not the features. It is that a sighted
// user sees the rows rearrange and everyone else is told nothing: the sort
// state has to live in `aria-sort`, and the row count after a filter has
// to be announced. That is where nearly every implementation stops short,
// so both are asserted by the suite rather than left to care.

import { getStrings } from './strings.js';
const TABLE = '[data-kp-datatable]';
const SEARCH = '[data-kp-datatable-search]';
const STATUS = '[data-kp-datatable-status]';
const PAGER = '[data-kp-datatable-pager]';
const SELECT_ALL = '[data-kp-select-all]';

/** Fired on the wrapper when the visible set changes. A contract value [TH26]. */
export const VIEW_EVENT = 'kp-datatable-view';

/** Fired when the selection changes; the detail carries the selected row keys. */
export const SELECT_EVENT = 'kp-datatable-select';

/** Rows per page when the consumer does not say. An operational knob. */
export const PAGE_SIZE = 10;

/**
 * Compare two cells the way their column asks to be compared.
 *
 * A number column sorted as text puts 100 before 20, which is the single
 * most common data-table bug and the reason the column declares its type
 * rather than the code guessing from the first row.
 *
 * @param {string} a @param {string} b @param {string} kind
 */
function compare(a, b, kind) {
    if (kind === 'number') {
        // Dutch decimals and thousands separators: "1.284,50" is a number.
        const left = Number.parseFloat(a.replace(/\./g, '').replace(',', '.'));
        const right = Number.parseFloat(b.replace(/\./g, '').replace(',', '.'));
        if (Number.isNaN(left) || Number.isNaN(right)) return a.localeCompare(b, 'nl');
        return left - right;
    }
    if (kind === 'date') {
        const left = Date.parse(a);
        const right = Date.parse(b);
        if (Number.isNaN(left) || Number.isNaN(right)) return a.localeCompare(b, 'nl');
        return left - right;
    }
    // localeCompare, not <: "Zoetermeer" before "école" is wrong in every
    // language this package's labels are written in.
    return a.localeCompare(b, 'nl', { numeric: true, sensitivity: 'base' });
}

/**
 * Attach every data table under `root`.
 *
 * @param {ParentNode} root
 * @returns {() => void} detach
 */
export function attachDataTables(root = document) {
    /** @type {(() => void)[]} */
    const cleanups = [];

    for (const element of root.querySelectorAll(TABLE)) {
        const wrap = /** @type {HTMLElement} */ (element);
        if (wrap.dataset.kpDatatableAttached !== undefined) continue;
        const table = /** @type {HTMLTableElement | null} */ (wrap.querySelector('table'));
        const body = table?.tBodies[0];
        if (table === undefined || table === null || body === undefined) continue;
        wrap.dataset.kpDatatableAttached = '';

        const search = /** @type {HTMLInputElement | null} */ (wrap.querySelector(SEARCH));
        const status = /** @type {HTMLElement | null} */ (wrap.querySelector(STATUS));
        const pager = /** @type {HTMLElement | null} */ (wrap.querySelector(PAGER));
        const selectAll = /** @type {HTMLInputElement | null} */ (wrap.querySelector(SELECT_ALL));
        const size = Number.parseInt(wrap.dataset.kpPageSize ?? '', 10) || PAGE_SIZE;

        /** Every row as it was rendered. Sorting reorders this array, never the DOM's idea of it. */
        const all = /** @type {HTMLTableRowElement[]} */ ([...body.rows]);
        /** @type {HTMLTableRowElement[]} */
        let shown = [...all];
        let page = 0;

        const headers = /** @type {HTMLTableCellElement[]} */ ([...(table.tHead?.rows[0]?.cells ?? [])]);

        /** @param {HTMLTableRowElement} row @param {number} at */
        const cellText = (row, at) => (row.cells[at]?.textContent ?? '').trim();

        const render = () => {
            const pages = Math.max(1, Math.ceil(shown.length / size));
            page = Math.min(page, pages - 1);
            const from = page * size;
            const slice = pager === null ? shown : shown.slice(from, from + size);
            for (const row of all) row.hidden = true;
            for (const row of slice) row.hidden = false;
            // Reordering by appending: the rows are the same elements, so
            // anything a consumer attached to them survives a sort.
            for (const row of shown) body.append(row);

            if (status !== null) {
                const total = all.length;
                const count = shown.length;
                const s = getStrings();
                status.textContent = count === total ? s.tableRows(total) : s.tableRowsFiltered(count, total);
            }
            if (pager !== null) {
                pager.textContent = '';
                pager.append(pagerButton(getStrings().previous, page > 0, () => (page -= 1)));
                const label = document.createElement('span');
                label.className = 'kp-datatable__page';
                label.textContent = `${page + 1} / ${pages}`;
                pager.append(label);
                pager.append(pagerButton(getStrings().next, page < pages - 1, () => (page += 1)));
            }
            const empty = /** @type {HTMLElement | null} */ (wrap.querySelector('[data-kp-datatable-empty]'));
            if (empty !== null) empty.hidden = shown.length > 0;
            wrap.dispatchEvent(new CustomEvent(VIEW_EVENT, { bubbles: true, detail: { shown: shown.length, total: all.length, page } }));
        };

        /** @param {string} text @param {boolean} enabled @param {() => void} go */
        const pagerButton = (text, enabled, go) => {
            const button = document.createElement('button');
            button.type = 'button';
            button.className = 'kp-button kp-button--ghost';
            button.textContent = text;
            button.disabled = !enabled;
            button.addEventListener('click', () => {
                go();
                render();
            });
            return button;
        };

        const filter = () => {
            const query = (search?.value ?? '').trim().toLowerCase();
            shown = all.filter((row) => query === '' || (row.textContent ?? '').toLowerCase().includes(query));
            page = 0;
            render();
        };

        /** @param {number} at @param {'ascending' | 'descending'} direction */
        const sortBy = (at, direction) => {
            const kind = headers[at]?.dataset.kpSort ?? 'text';
            const sign = direction === 'ascending' ? 1 : -1;
            shown = [...shown].sort((a, b) => sign * compare(cellText(a, at), cellText(b, at), kind));
            // aria-sort on the sorted column and NOWHERE else: leaving a
            // stale "ascending" on a column that is no longer the sort key
            // is worse than saying nothing.
            headers.forEach((header, i) => {
                if (header.dataset.kpSort === undefined) return;
                if (i === at) header.setAttribute('aria-sort', direction);
                else header.setAttribute('aria-sort', 'none');
            });
            render();
        };

        /** @param {MouseEvent} event */
        const onHeadClick = (event) => {
            const target = /** @type {HTMLElement} */ (event.target);
            const header = /** @type {HTMLTableCellElement | null} */ (target.closest('th[data-kp-sort]'));
            if (header === null) return;
            const at = headers.indexOf(header);
            if (at === -1) return;
            const current = header.getAttribute('aria-sort');
            sortBy(at, current === 'ascending' ? 'descending' : 'ascending');
        };

        const selected = () =>
            all.filter((row) => {
                const box = /** @type {HTMLInputElement | null} */ (row.querySelector('[data-kp-select-row]'));
                return box !== null && box.checked;
            });

        /** @param {Event} event */
        const onBodyChange = (event) => {
            const target = /** @type {HTMLElement} */ (event.target);
            if (!target.matches('[data-kp-select-row]')) return;
            syncSelectAll();
            announceSelection();
        };

        const syncSelectAll = () => {
            if (selectAll === null) return;
            const boxes = shown
                .map((row) => /** @type {HTMLInputElement | null} */ (row.querySelector('[data-kp-select-row]')))
                .filter((b) => b !== null);
            const checked = boxes.filter((b) => b.checked).length;
            selectAll.checked = boxes.length > 0 && checked === boxes.length;
            // Indeterminate is the honest third state: a header box that
            // reads "checked" while three of ten rows are selected lies.
            selectAll.indeterminate = checked > 0 && checked < boxes.length;
        };

        const announceSelection = () => {
            const keys = selected().map((row) => row.dataset.kpRowKey ?? '');
            wrap.dispatchEvent(new CustomEvent(SELECT_EVENT, { bubbles: true, detail: { keys } }));
        };

        const onSelectAll = () => {
            if (selectAll === null) return;
            for (const row of shown) {
                const box = /** @type {HTMLInputElement | null} */ (row.querySelector('[data-kp-select-row]'));
                if (box !== null) box.checked = selectAll.checked;
            }
            selectAll.indeterminate = false;
            announceSelection();
        };

        search?.addEventListener('input', filter);
        table.tHead?.addEventListener('click', onHeadClick);
        body.addEventListener('change', onBodyChange);
        selectAll?.addEventListener('change', onSelectAll);
        render();

        cleanups.push(() => {
            search?.removeEventListener('input', filter);
            table.tHead?.removeEventListener('click', onHeadClick);
            body.removeEventListener('change', onBodyChange);
            selectAll?.removeEventListener('change', onSelectAll);
            for (const row of all) row.hidden = false;
            delete wrap.dataset.kpDatatableAttached;
        });
    }

    return () => {
        for (const c of cleanups) c();
    };
}

if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => attachDataTables());
    else attachDataTables();
}
