// The detach that undoes everything the table added.
import { DATE_EVENT } from '../../datepicker.js';
import { GROUP_TOGGLE, SKELETON_ROW } from '../selectors.js';
import { syncFixedColumns } from '../grid.js';
import { handles } from '../instance.js';
/** @typedef {import('./context.js').TableContext} TableContext */

/**
 * The detach that undoes everything the table added.
 *
 * @param {TableContext} c
 */
export function installUnwire(c) {
    const {
        actions,
        added,
        again,
        body,
        builtDetails,
        busyWas,
        cleanups,
        closeEditor,
        closeFilterEditor,
        densitySelect,
        densityWas,
        details,
        detailsWereHidden,
        emptyWasHidden,
        givenIds,
        headerSort,
        headerTab,
        headers,
        headersWereHidden,
        layoutAtAttach,
        loadingSlot,
        onAddMenuClick,
        onAddMenuKey,
        onAddToggle,
        onBodyChange,
        onBodyFocusIn,
        onBodyFocusOut,
        onColumnChange,
        onColumnClick,
        onDensity,
        onEditorClick,
        onEditorFocusOut,
        onEditorKey,
        onEditorKeyCapture,
        onEditorKeydown,
        onEditorSubmit,
        onHeadClick,
        onHeadKey,
        onPageSize,
        onPanel,
        onPillsClick,
        onRowKey,
        onScope,
        onSearch,
        onSelectAll,
        onSortBy,
        onSortDirection,
        onToggle,
        onWrapClick,
        pager,
        pillsList,
        prepared,
        preparedGroups,
        rendered,
        resize,
        scopeSelect,
        search,
        selectAll,
        stopBusyClock,
        table,
        undo,
        unprepareRow,
        unwires,
        wrap,
    } = c;

    const unwire = () => {
        unwires.delete(wrap);
        stopBusyClock();
        clearTimeout(c.pending);
        c.controller?.abort();
        resize?.disconnect();
        cancelAnimationFrame(c.resizeFrame);
        closeEditor();
        c.grid?.detach();
        search?.removeEventListener('input', onSearch);
        scopeSelect?.removeEventListener('change', onScope);
        densitySelect?.removeEventListener('change', onDensity);
        c.panel?.removeEventListener('input', onPanel);
        c.panel?.removeEventListener('change', onPanel);
        c.panel?.removeEventListener(DATE_EVENT, onPanel);
        c.toggle?.removeEventListener('click', onToggle);
        closeFilterEditor(false);
        if (c.addPop?.matches(':popover-open')) c.addPop.hidePopover();
        c.addPop?.removeEventListener('toggle', onAddToggle);
        c.addMenu?.removeEventListener('click', onAddMenuClick);
        c.addMenu?.removeEventListener('keydown', onAddMenuKey);
        c.filterEditor?.removeEventListener('submit', onEditorSubmit);
        c.filterEditor?.removeEventListener('click', onEditorClick);
        c.filterEditor?.removeEventListener('keydown', onEditorKeydown);
        pillsList.removeEventListener('click', onPillsClick);
        c.sortBy?.removeEventListener('change', onSortBy);
        c.sortDirection?.removeEventListener('click', onSortDirection);
        c.sizeSelect?.removeEventListener('change', onPageSize);
        c.columnList?.removeEventListener('change', onColumnChange);
        c.columnList?.removeEventListener('click', onColumnClick);
        wrap.removeEventListener('click', onWrapClick);
        wrap.removeEventListener('keydown', onEditorKeyCapture, { capture: true });
        wrap.removeEventListener('keydown', onEditorKey);
        wrap.removeEventListener('focusout', onEditorFocusOut);
        table.tHead?.removeEventListener('click', onHeadClick);
        table.tHead?.removeEventListener('keydown', onHeadKey);
        body.removeEventListener('change', onBodyChange);
        body.removeEventListener('keydown', onRowKey);
        body.removeEventListener('focusin', onBodyFocusIn);
        body.removeEventListener('focusout', onBodyFocusOut);
        selectAll?.removeEventListener('change', onSelectAll);
        // Put back what the server rendered: order, visibility, the
        // sort marks, the pager, the empty state, the focusability, and
        // every part this attach added.
        for (const row of body.querySelectorAll(`:scope > ${SKELETON_ROW}`)) row.remove();
        for (const detail of builtDetails) detail.remove();
        for (const row of prepared) unprepareRow(row);
        for (const row of rendered) row.hidden = false;
        for (const row of rendered) {
            const detail = details.get(row);
            if (detail !== undefined && !builtDetails.has(detail)) detail.hidden = detailsWereHidden.get(detail) ?? detail.hidden;
        }
        // Group rows [J2]: their toggles out, their span and visibility
        // back, the ids taken back, and the body in the order it came in.
        for (const [heading, was] of preparedGroups) {
            heading.querySelector(GROUP_TOGGLE)?.remove();
            const cell = heading.cells[0];
            if (was.span !== null && cell !== undefined) cell.setAttribute('colspan', was.span);
            else if (heading.cells.length === 1) cell?.removeAttribute('colspan');
            heading.hidden = was.hidden;
        }
        for (const row of givenIds) row.removeAttribute('id');
        // The body goes back to the order it came in with one write [perf-1026]: the order is worked out on a list, as the
        // appends would have left it, and the rows go in together. A table the page took out of the document gets the same
        // order: its markup after detach is what it was before attach.
        {
            /** Where each node would stand after the appends, in the order they would have been made. @type {Map<Node, number>} */
            const stand = new Map();
            let next = 0;
            for (const child of body.children) stand.set(child, next++);
            /** @param {Node} node */
            const append = (node) => void stand.set(node, next++);
            for (const row of rendered) {
                append(row);
                const detail = details.get(row);
                if (detail !== undefined && !builtDetails.has(detail)) append(detail);
            }
            if (layoutAtAttach !== null) {
                const placed = new Set(layoutAtAttach);
                for (const row of layoutAtAttach) if (stand.has(row)) append(row);
                for (const row of rendered) {
                    if (placed.has(row) || !stand.has(row)) continue;
                    append(row);
                    const detail = details.get(row);
                    if (detail !== undefined && stand.has(detail)) append(detail);
                }
            }
            const order = [...stand.keys()].sort((a, b) => /** @type {number} */ (stand.get(a)) - /** @type {number} */ (stand.get(b)));
            body.replaceChildren(...order);
        }
        syncFixedColumns(table, 0);
        headers.forEach((header, i) => {
            header.querySelector(':scope .kp-datatable__sort-order')?.remove();
            header.hidden = headersWereHidden[i] ?? false;
            const was = headerSort[i];
            if (was === null || was === undefined) header.removeAttribute('aria-sort');
            else header.setAttribute('aria-sort', was);
            const tab = headerTab[i];
            if (tab === null || tab === undefined) header.removeAttribute('tabindex');
            else header.setAttribute('tabindex', tab);
        });
        if (pager !== null) pager.textContent = '';
        if (c.empty !== null) c.empty.hidden = emptyWasHidden;
        if (loadingSlot !== null) loadingSlot.hidden = true;
        if (c.failedSlot !== null) c.failedSlot.hidden = true;
        if (actions !== null) actions.hidden = true;
        stopBusyClock();
        c.overlayUnwatch?.();
        c.overlayLayer?.remove();
        for (const node of added) node.remove();
        for (const step of undo) step();
        if (densityWas === null) wrap.removeAttribute('data-density');
        else wrap.setAttribute('data-density', densityWas);
        if (busyWas === null) wrap.removeAttribute('aria-busy');
        else wrap.setAttribute('aria-busy', busyWas);
        delete wrap.dataset.kpState;
        handles.delete(wrap);
        delete wrap.dataset.kpDatatableAttached;
    };
    unwires.set(wrap, unwire);
    if (!again) cleanups.push(() => unwires.get(wrap)?.());
}
