// Server mode: sending a request and applying the answer.
import { CHECK_CLASS, EXPAND_COLUMN, REORDER_COLUMN, SELECT_ALL, SELECT_ROW } from '../selectors.js';
import { getStrings } from '../../strings.js';
import { REQUEST_EVENT } from '../events.js';
/** @typedef {import('../events.js').DataAnswer} DataAnswer */
/** @typedef {import('../events.js').DataRequest} DataRequest */
/** @typedef {import('./context.js').TableContext} TableContext */

/**
 * What the server mode: sending a request and applying the answer part adds to the table's context.
 *
 * @typedef {{
 *     controller: AbortController | null;
 *     pending: number;
 *     request: () => void;
 * }} ServerFields
 */

/**
 * Server mode: sending a request and applying the answer.
 *
 * @param {TableContext} c
 */
export function installServer(c) {
    const {
        body,
        byField,
        details,
        filters,
        headers,
        keyColumn,
        keyOf,
        labelOf,
        loadFn,
        make,
        prepareRow,
        render,
        rowKeyFn,
        serverMode,
        serverSelection,
        syncColumns,
        wrap,
    } = c;

    // ── Rows from a server (#async) ────────────────────────────────
    let sent = 0;
    let latest = 0;
    /** @type {AbortController | null} */
    c.controller = null;
    /** @param {HTMLTableRowElement | Record<string, unknown>} item */
    const rowFrom = (item) => {
        if (item instanceof HTMLTableRowElement) return item;
        const row = /** @type {HTMLTableRowElement} */ (make('tr'));
        // The key: the consumer's function, else the field the table names, else
        // the key column's field, else `key` or `id`.
        const field = wrap.dataset.kpRowKeyField ?? headers[keyColumn]?.dataset.kpField;
        row.dataset.kpRowKey = rowKeyFn ? rowKeyFn(item) : String((field === undefined ? undefined : item[field]) ?? item.key ?? item.id ?? '');
        headers.forEach((header, at) => {
            if (header.matches(EXPAND_COLUMN) || header.matches(REORDER_COLUMN)) return;
            const cell = make('td');
            if (header.querySelector(SELECT_ALL) !== null) {
                const box = /** @type {HTMLInputElement} */ (make('input', CHECK_CLASS));
                box.type = 'checkbox';
                box.dataset.kpSelectRow = '';
                box.setAttribute('aria-label', getStrings().tableSelectRow(row.dataset.kpRowKey ?? ''));
                cell.dataset.label = '';
                cell.append(box);
            } else {
                cell.dataset.label = labelOf(at);
                // A number column's alignment, a code column's face: the classes
                // the header asks its cells to wear, since an object has none.
                if (header.dataset.kpCellClass) cell.className = header.dataset.kpCellClass;
                const value = item[header.dataset.kpField ?? labelOf(at)];
                cell.textContent = value === undefined || value === null ? '' : String(value);
            }
            row.append(cell);
        });
        return row;
    };
    /** @param {DataAnswer} answer */
    const applyAnswer = (answer) => {
        for (const row of c.all) {
            const box = /** @type {HTMLInputElement | null} */ (row.querySelector(SELECT_ROW));
            if (box !== null) {
                if (box.checked) serverSelection.add(keyOf(row));
                else serverSelection.delete(keyOf(row));
            }
        }
        if (c.editing !== null) c.closeEditor();
        const next = answer.rows.map(rowFrom);
        for (const row of [...body.rows]) if (!next.includes(row)) row.remove();
        details.clear();
        for (const row of next) {
            row.hidden = false;
            body.append(row);
            prepareRow(row);
            const box = /** @type {HTMLInputElement | null} */ (row.querySelector(SELECT_ROW));
            if (box !== null) box.checked = serverSelection.has(keyOf(row));
        }
        c.all = next;
        c.shownRows = [...next];
        c.total = Number(answer.total) || 0;
        c.state = 'ready';
        syncColumns();
        render();
    };
    const request = () => {
        if (!serverMode) return;
        sent += 1;
        const requestId = sent;
        latest = requestId;
        c.controller?.abort();
        c.controller = new AbortController();
        /** @type {DataRequest} */
        const params = {
            id: requestId,
            query: c.query,
            scope: c.scope,
            sort: c.sorts[0] ? { ...c.sorts[0] } : null,
            sorts: c.sorts.map((key) => ({ ...key })),
            filters: Object.fromEntries(filters),
            filtersByField: byField(),
            page: c.page,
            pageSize: c.size,
            signal: c.controller.signal,
        };
        c.state = 'loading';
        render();
        let settled = false;
        /** @param {DataAnswer} answer */
        const respond = (answer) => {
            if (settled) return;
            settled = true;
            // An answer to a request that is no longer the newest is thrown away.
            if (requestId !== latest) return;
            applyAnswer(answer);
        };
        /** @param {unknown} error */
        const fail = (error) => {
            if (settled) return;
            settled = true;
            if (requestId !== latest) return;
            void error;
            c.state = 'failed';
            render();
        };
        wrap.dispatchEvent(new CustomEvent(REQUEST_EVENT, { bubbles: true, detail: { ...params, respond, fail } }));
        if (loadFn !== undefined) {
            Promise.resolve()
                .then(() => loadFn(params))
                .then(respond, fail);
        }
    };
    c.request = request;
    c.pending = 0;
}
