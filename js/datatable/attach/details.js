// The detail rows, the expand cell and the reorder cell.
import { DETAIL, EXPAND_COLUMN, GROUP_ROW, HELD_ROW, REORDER_COLUMN, SKELETON_ROW } from '../selectors.js';
/** @typedef {import('../attach.js').DataTableDecorateInfo} DataTableDecorateInfo */
/** @typedef {import('./context.js').TableContext} TableContext */

/**
 * What the the detail rows, the expand cell and the reorder cell part adds to the table's context.
 *
 * @typedef {{
 *     builtDetails: Set<HTMLTableRowElement>;
 *     collectDetails: () => void;
 *     decoratePart: (part: HTMLElement, info: Omit<DataTableDecorateInfo, 'host' | 'key'>) => void;
 *     details: Map<HTMLTableRowElement, HTMLTableRowElement>;
 *     detailsWereHidden: Map<HTMLTableRowElement, boolean>;
 *     expandable: boolean;
 *     expanded: Set<string>;
 *     headRow: HTMLTableRowElement | undefined;
 *     insertExpandCell: (row: HTMLTableRowElement) => void;
 *     insertReorderCell: (row: HTMLTableRowElement) => void;
 *     reorderable: boolean;
 *     single: boolean;
 * }} DetailsFields
 */

/**
 * The detail rows, the expand cell and the reorder cell.
 *
 * @param {TableContext} c
 */
export function installDetails(c) {
    const { add, body, decorate, detailFn, expandSingle, make, s0, search, table, wrap } = c;

    // ── Rows that open (#expansion) ────────────────────────────────
    // Before anything reads the headers: the toggle column is a column.
    const headRow = table.tHead?.rows[0];
    c.headRow = headRow;
    /** Each row's detail row. @type {Map<HTMLTableRowElement, HTMLTableRowElement>} */
    const details = new Map();
    c.details = details;
    /** Detail rows as the markup had them, for detach. @type {Map<HTMLTableRowElement, boolean>} */
    const detailsWereHidden = new Map();
    c.detailsWereHidden = detailsWereHidden;
    /** @type {Set<HTMLTableRowElement>} */
    const builtDetails = new Set();
    c.builtDetails = builtDetails;
    const collectDetails = () => {
        /** @type {HTMLTableRowElement | null} */
        let owner = null;
        for (const row of body.rows) {
            if (row.matches(DETAIL)) {
                if (owner !== null && !details.has(owner)) {
                    details.set(owner, row);
                    if (!detailsWereHidden.has(row)) detailsWereHidden.set(row, row.hidden === true);
                }
            } else if (row.matches(GROUP_ROW)) owner = null;
            else if (row.matches(HELD_ROW)) owner = null;
            else if (!row.matches(SKELETON_ROW)) owner = row;
        }
    };
    c.collectDetails = collectDetails;
    collectDetails();
    const expandable = wrap.dataset.kpExpandable !== undefined && headRow !== undefined;
    c.expandable = expandable;
    /** One row open at a time [J2]: opening one closes the one that was open. */
    const single = wrap.dataset.kpExpandSingle === undefined ? expandSingle : wrap.dataset.kpExpandSingle !== 'false';
    c.single = single;
    /** The consumer's mark on a control this table built [J2, R-DRIVE]. @param {HTMLElement} part @param {Omit<DataTableDecorateInfo, 'host' | 'key'>} info */
    const decoratePart = (part, info) => {
        if (decorate === undefined) return;
        /** @type {DataTableDecorateInfo} */
        const full = { ...info, host: wrap };
        if (wrap.dataset.kpKey !== undefined) full.key = wrap.dataset.kpKey;
        decorate(part, full);
    };
    c.decoratePart = decoratePart;
    // The search box the page placed is a control the consumer may mark too [wish-1120, homelab 66, 114].
    if (search !== null) decoratePart(search, { kind: 'search' });
    /** Rows open for their details, by key. @type {Set<string>} */
    const expanded = new Set();
    c.expanded = expanded;
    if (expandable && headRow !== undefined && headRow.querySelector(EXPAND_COLUMN) === null) {
        const th = add(make('th'));
        th.setAttribute('scope', 'col');
        th.dataset.kpExpandColumn = '';
        const label = make('span', 'kp-sr-only');
        label.textContent = s0.tableDetailsColumn;
        th.append(label);
        headRow.prepend(th);
    }
    // Row reorder [wish-1120, homelab 93]: `data-kp-rows-reorder` adds a column of drag handles, first in the row.
    const reorderable = wrap.dataset.kpRowsReorder !== undefined && headRow !== undefined;
    c.reorderable = reorderable;
    if (reorderable && headRow !== undefined && headRow.querySelector(REORDER_COLUMN) === null) {
        const th = add(make('th'));
        th.setAttribute('scope', 'col');
        th.dataset.kpReorderColumn = '';
        const label = make('span', 'kp-sr-only');
        label.textContent = s0.tableReorderColumn;
        th.append(label);
        headRow.prepend(th);
    }
    /** The handle's cell, first in the row (before the expand toggle). @param {HTMLTableRowElement} row */
    const insertReorderCell = (row) => {
        if (
            !reorderable ||
            row.matches(DETAIL) ||
            row.matches(SKELETON_ROW) ||
            row.matches(GROUP_ROW) ||
            row.querySelector('[data-kp-reorder-cell]') !== null
        )
            return;
        const cell = /** @type {HTMLTableCellElement} */ (make('td'));
        cell.dataset.kpReorderCell = '';
        cell.dataset.label = '';
        const button = /** @type {HTMLButtonElement} */ (make('button', 'kp-button kp-button--ghost kp-button--sm kp-datatable__handle'));
        button.type = 'button';
        button.dataset.kpReorderHandle = '';
        button.setAttribute('aria-keyshortcuts', 'Alt+ArrowUp Alt+ArrowDown');
        const grip = make('span', 'kp-datatable__grip');
        grip.setAttribute('aria-hidden', 'true');
        button.append(grip);
        cell.append(button);
        row.prepend(cell);
        const rowKey = row.dataset.kpRowKey ?? row.id ?? '';
        decoratePart(button, { kind: 'reorder-handle', value: rowKey, label: rowKey });
    };
    c.insertReorderCell = insertReorderCell;
    /** The toggle's cell, first in the row, so the row's cells line up with the headers. @param {HTMLTableRowElement} row */
    const insertExpandCell = (row) => {
        if (
            !expandable ||
            row.matches(DETAIL) ||
            row.matches(SKELETON_ROW) ||
            row.matches(GROUP_ROW) ||
            row.querySelector('[data-kp-expand-cell]') !== null
        )
            return;
        const cell = /** @type {HTMLTableCellElement} */ (make('td'));
        cell.dataset.kpExpandCell = '';
        cell.dataset.label = '';
        // Where the markup wrote detail rows, only a row that has one gets a
        // button; with a `detail` option or no detail rows at all, every row
        // does, and the app fills the detail when the row first opens.
        /** @type {HTMLButtonElement | null} */
        let button = null;
        if (details.has(row) || detailFn !== undefined || details.size === 0) {
            button = /** @type {HTMLButtonElement} */ (make('button', 'kp-button kp-button--ghost kp-button--sm kp-datatable__expand'));
            button.type = 'button';
            button.dataset.kpRowToggle = '';
            cell.append(button);
        }
        row.prepend(cell);
        if (button !== null) {
            const rowKey = row.dataset.kpRowKey ?? row.id ?? '';
            decoratePart(button, { kind: 'row-toggle', value: rowKey, label: s0.tableRowDetails(rowKey) });
        }
    };
    c.insertExpandCell = insertExpandCell;
    for (const row of body.rows) {
        insertExpandCell(row);
        insertReorderCell(row);
    }
}
