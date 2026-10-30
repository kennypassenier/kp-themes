// The handle a page gets back from the table.
import { handles } from '../instance.js';
import { watchOptions } from '../../live-options.js';
/** @typedef {import('../instance.js').DataTableHandle} DataTableHandle */
/** @typedef {import('../events.js').FilterValue} FilterValue */
/** @typedef {import('./context.js').TableContext} TableContext */

/**
 * The handle a page gets back from the table.
 *
 * @param {TableContext} c
 */
export function installHandle(c) {
    const {
        addMode,
        applyFilter,
        body,
        builtDetails,
        clearFilters,
        closeFilterEditor,
        collectDetails,
        collectGroups,
        columnAt,
        commitEdit,
        commitSorts,
        created,
        details,
        expandKeys,
        filters,
        foldKeys,
        groups,
        holdRows,
        isRow,
        keyOf,
        openEditor,
        openFilterEditor,
        prepareRow,
        refreshChoices,
        render,
        rendered,
        request,
        scopeSelect,
        search,
        select,
        selectedRows,
        serverMode,
        serverSelection,
        setDensity,
        setFilter,
        setHidden,
        setPageSize,
        setSort,
        sortsSeveral,
        syncColumns,
        toggleMemo,
        undo,
        unwires,
        view,
        wireTable,
        wrap,
    } = c;

    /** @type {DataTableHandle} */
    const handle = {
        element: wrap,
        view,
        sort: setSort,
        sortBy: (keys) => commitSorts(keys.map((key) => ({ column: key.column, direction: key.direction }))),
        page: (next) => {
            c.page = Math.max(0, next);
            if (serverMode) request();
            else render();
        },
        pageSize: setPageSize,
        query: (next) => {
            c.query = next;
            if (search !== null) search.value = next;
            applyFilter();
        },
        scope: (given) => {
            const column = given === null ? null : columnAt(given);
            c.scope = column === null || column < 0 ? null : column;
            if (scopeSelect !== null) scopeSelect.value = c.scope === null ? '' : String(c.scope);
            applyFilter();
        },
        columnIndex: (id) => columnAt(id),
        filter: setFilter,
        clearFilters,
        editFilter: (given) => {
            const column = given === null ? null : columnAt(given);
            if (column !== null && column < 0) return;
            if (addMode) {
                if (column === null) closeFilterEditor(false);
                else openFilterEditor(column, filters.has(column) ? column : null);
            } else if (c.panel !== null && c.toggle !== null) {
                c.panel.hidden = column === null;
                c.toggle.setAttribute('aria-expanded', String(!c.panel.hidden));
            }
        },
        hideColumns: (columns) => setHidden(columns),
        expand: expandKeys,
        fold: (keys) => {
            foldKeys(keys);
            render();
        },
        density: setDensity,
        state: (next) => {
            c.state = next;
            if (next !== 'failed') c.failReason = null;
            render();
        },
        fail: (reason) => {
            c.failReason = reason ?? null;
            c.state = 'failed';
            render();
        },
        busy: (words) => {
            const given = typeof words === 'object' && words !== null ? words : { text: words };
            c.busyText = given.text ?? null;
            c.busySince = given.since === undefined || given.since === null ? null : Number(given.since);
            c.busyOverlay = 'overlay' in given && given.overlay !== undefined ? Boolean(given.overlay) : wrap.hasAttribute('data-kp-busy-overlay');
            render();
        },
        reload: () => (serverMode ? request() : applyFilter({ keepPage: true })),
        edit: (key, column) => {
            const row = c.all.find((r) => keyOf(r) === key);
            if (row !== undefined) void openEditor(row, column);
        },
        cancelEdit: () => void commitEdit(false),
        rows: (which = 'view') => (which === 'page' ? [...c.pageRows] : [...c.shownRows]),
        selected: () => (serverMode ? [...serverSelection] : selectedRows().map(keyOf)),
        select,
        refresh: (options) => {
            // The control that held the focus keeps it [R-LIVE, J2]: the
            // same element when it stayed, else the same toggle of the row
            // (or group) with the same key, when the consumer replaced it,
            // even before this call, as long as nothing else took the focus.
            const active = document.activeElement;
            const inBody = active instanceof HTMLElement && body.contains(active) ? active : null;
            const lost = inBody === null && c.focusMemo !== null && !c.focusMemo.element.isConnected && (active === null || active === document.body);
            const memo = inBody !== null ? toggleMemo(inBody) : lost ? c.focusMemo : null;
            const held = inBody ?? (lost && c.focusMemo !== null ? c.focusMemo.element : null);
            const heldKey = memo?.key ?? null;
            const heldGroup = memo?.group ?? null;
            const heldToggle = memo?.selector ?? null;
            collectDetails();
            holdRows();
            c.all = [...body.rows].filter(isRow);
            // A row the page took out is no longer one of the table's: detach must not put it back.
            for (let at = rendered.length - 1; at >= 0; at -= 1)
                if (!c.all.includes(rendered[at]) && !rendered[at].isConnected) rendered.splice(at, 1);
            for (const row of c.all) {
                if (!rendered.includes(row)) rendered.push(row);
                prepareRow(row);
            }
            // A detail this table built for a row that is gone goes with it.
            for (const [row, detail] of details) {
                if (row.isConnected || !builtDetails.has(detail)) continue;
                detail.remove();
                builtDetails.delete(detail);
                details.delete(row);
            }
            collectGroups();
            syncColumns();
            refreshChoices();
            applyFilter({ keepPage: options?.keepPage === true });
            if (held !== null && document.activeElement !== held) {
                /** @type {HTMLElement | null} */
                let back = held.isConnected ? held : null;
                if (back === null && heldToggle !== null) {
                    const row =
                        heldGroup !== null
                            ? (groups.get(heldGroup) ?? null)
                            : (c.all.find((r) => heldKey !== null && heldKey !== '' && keyOf(r) === heldKey) ?? null);
                    back = /** @type {HTMLElement | null} */ (row?.querySelector(heldToggle) ?? null);
                }
                if (back !== null && !back.hidden && back.closest('tr')?.hidden !== true) back.focus({ preventScroll: true });
            }
        },
    };
    handles.set(wrap, handle);
    created.push(handle);
    // Rows the page added, removed or held are the table's rows at once, without a call to refresh(): the count, the pager
    // and the pages follow the body [b3b4-1019; homelab gap 34, kyu gap 28]. The table's own sort and page moves put the
    // same rows back in another order, which changes nothing here.
    if (!serverMode) {
        let queued = false;
        const resync = () => {
            queued = false;
            holdRows();
            const now = [...body.rows].filter(isRow);
            if (now.length === c.all.length && now.every((row, at) => c.all.includes(row))) return;
            handles.get(wrap)?.refresh({ keepPage: true });
        };
        const onBody = () => {
            if (queued) return;
            queued = true;
            queueMicrotask(resync);
        };
        const rowsWatch = new MutationObserver(onBody);
        rowsWatch.observe(body, { childList: true });
        const holdWatch = new MutationObserver(onBody);
        holdWatch.observe(body, { attributes: true, attributeFilter: ['data-kp-row-hidden'], subtree: true });
        undo.push(() => {
            rowsWatch.disconnect();
            holdWatch.disconnect();
        });
    }
    // The options that shape the chrome are read again when their attribute changes: the filter bar and the sort
    // summary are built from them, and the one-row-open rule is read when the table is wired. The table is wired
    // again with the view it had [live-options-1019].
    undo.push(
        watchOptions(wrap, ['data-kp-sort-multi', 'data-kp-filter-mode', 'data-kp-filter-ui', 'data-kp-expand-single', 'data-kp-fixed-end'], () => {
            const old = handles.get(wrap);
            if (old === undefined) return;
            const was = old.view();
            const selected = old.selected();
            unwires.get(wrap)?.();
            created.splice(created.indexOf(old), 1);
            wireTable(wrap, true);
            const fresh = handles.get(wrap);
            if (fresh === undefined) return;
            // The page keeps the handle it has: the new table's methods move onto it.
            Object.assign(old, fresh);
            handles.set(wrap, old);
            created.splice(created.indexOf(fresh), 1, old);
            if (was.query !== '') old.query(was.query);
            if (was.scope !== null) old.scope(was.scope);
            for (const [column, value] of Object.entries(was.filters)) old.filter(Number(column), /** @type {FilterValue} */ (value));
            // Going to one sort key keeps the first.
            if (was.sorts.length > 0) old.sortBy(sortsSeveral(wrap) ? was.sorts : was.sorts.slice(0, 1));
            if (was.pageSize !== old.view().pageSize) old.pageSize(was.pageSize);
            if (was.hidden.length > 0) old.hideColumns(was.hidden);
            if (was.density !== old.view().density) old.density(was.density);
            if (was.folded.length > 0) old.fold(was.folded);
            if (was.expanded.length > 0) old.expand(was.expanded);
            if (selected.length > 0) old.select(selected);
            if (was.page > 0) old.page(was.page);
            if (was.state !== 'ready') old.state(was.state);
        }),
    );
}
