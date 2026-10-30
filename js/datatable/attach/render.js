// Renders the rows, the pager and the filter pills area.
import { getStrings } from '../../strings.js';
import { VIEW_EVENT } from '../events.js';
/** @typedef {import('./context.js').TableContext} TableContext */

/**
 * What the renders the rows, the pager and the filter pills area part adds to the table's context.
 *
 * @typedef {{
 *     clearButton: HTMLButtonElement;
 *     pillsList: HTMLElement;
 *     render: () => void;
 * }} RenderFields
 */

/**
 * Renders the rows, the pager and the filter pills area.
 *
 * @param {TableContext} c
 */
export function installRender(c) {
    const {
        add,
        addMode,
        body,
        busySeconds,
        decoratePart,
        departing,
        detailFor,
        details,
        drawOverlay,
        expanded,
        filters,
        groups,
        isFolded,
        keyOf,
        labelCells,
        labelRow,
        make,
        pageLabel,
        pager,
        pagerClassName,
        placeGroups,
        serverMode,
        showEmpty,
        status,
        stopBusyClock,
        syncActions,
        syncCardSort,
        syncFixed,
        syncGroups,
        syncSelectAll,
        syncSortMarks,
        syncStateParts,
        view,
        wrap,
    } = c;

    const render = () => {
        labelCells();
        const count = serverMode ? c.total || 0 : c.shownRows.length;
        const pages = Math.max(1, Math.ceil(count / c.size));
        c.page = Math.min(c.page, pages - 1);
        const from = c.page * c.size;
        c.pageRows = serverMode || pager === null ? c.shownRows : c.shownRows.slice(from, from + c.size);
        for (const row of c.all) row.hidden = true;
        // A row of a folded group stays on its page, hidden [J2].
        for (const row of c.pageRows) row.hidden = groups.size > 0 && isFolded(row) && !departing.has(row);
        // Reordering by appending: the rows are the same elements, so
        // anything a consumer attached to them survives a sort. A row's
        // detail travels directly under it.
        if (c.blockOrder.length > 0) placeGroups();
        else
            for (const row of c.shownRows) {
                // A row the page replaced is no longer in the body: it is not re-placed beside its replacement [states-check-1019].
                if (row.parentElement !== body) continue;
                body.append(row);
                const detail = details.get(row);
                if (detail !== undefined) body.append(detail);
            }
        for (const [row, detail] of details) {
            const open = expanded.has(keyOf(row)) && !row.hidden && c.all.includes(row);
            if (open) detailFor(row);
            detail.hidden = !open;
        }
        for (const row of c.all) labelRow(row);

        const s = getStrings();
        syncGroups(s);
        if (status !== null) {
            status.textContent = '';
            if (c.state === 'loading') {
                // Loading, first or again: a spinner says it is working
                // [#states]. It used to come only on a refresh, so a first
                // load that took minutes showed no sign of life [fix-80].
                const spinner = make('span', 'kp-spinner');
                spinner.setAttribute('aria-hidden', 'true');
                status.append(spinner, ' ');
            }
            status.append(
                c.state === 'loading'
                    ? (c.busyText ?? s.busy)
                    : s.tableShowing(c.pageRows.length === 0 ? 0 : from + 1, from + c.pageRows.length, count, serverMode ? count : c.all.length),
            );
            // A count the table keeps itself, in a part the live region
            // does not announce: a screen reader hears the words when they
            // change, not a number every second, and the tick rewrites
            // this one element rather than rendering the table [fix-84].
            stopBusyClock();
            if (c.state === 'loading' && c.busySince !== null) {
                c.busyClock = make('span', 'kp-datatable__busy-clock');
                c.busyClock.dataset.kpBusyClock = '';
                c.busyClock.setAttribute('aria-hidden', 'true');
                c.busyClock.textContent = s.tableBusyElapsed(busySeconds());
                status.append(' ', c.busyClock);
                c.busyTimer = setInterval(() => {
                    const words = getStrings().tableBusyElapsed(busySeconds());
                    if (c.busyClock !== null) c.busyClock.textContent = words;
                    if (c.overlayClock !== null) c.overlayClock.textContent = words;
                }, 1000);
            }
        }
        drawOverlay(s);
        if (pager !== null) {
            pager.textContent = '';
            if (c.sizeLabel !== null) pager.append(c.sizeLabel);
            pager.append(pagerButton(s.previous, c.page > 0, () => (c.page -= 1), 'back'));
            const label = document.createElement('span');
            label.className = 'kp-datatable__page';
            label.textContent = (pageLabel ?? s.tablePage)(c.page + 1, pages);
            pager.append(label);
            pager.append(pagerButton(s.next, c.page < pages - 1, () => (c.page += 1)));
        }
        if (c.empty !== null) {
            showEmpty(count > 0 || c.state !== 'ready');
            // Nothing yet, or nothing matching: each of the slot's two
            // optional parts says its own thing and offers its own way
            // out [fix-85].
            const narrowing = c.query.trim() !== '' || filters.size > 0;
            for (const part of c.empty.querySelectorAll('[data-kp-datatable-empty-none]')) /** @type {HTMLElement} */ (part).hidden = narrowing;
            for (const part of c.empty.querySelectorAll('[data-kp-datatable-empty-nomatch]')) /** @type {HTMLElement} */ (part).hidden = !narrowing;
        }
        if (c.failedSlot !== null) {
            const reason = c.failedSlot.querySelector('[data-kp-datatable-failed-reason]');
            if (reason !== null) reason.textContent = c.failReason ?? s.tableFailed;
        }
        // After a search or a filter the ticked row may be gone from the
        // page, and the header box must say so [gap-13].
        syncSelectAll();
        syncActions();
        syncStateParts();
        syncCardSort();
        syncSortMarks();
        syncFixed();
        c.grid?.sync();
        wrap.dispatchEvent(new CustomEvent(VIEW_EVENT, { bubbles: true, detail: { ...view(), rows: [...c.shownRows], pageRows: [...c.pageRows] } }));
    };
    c.render = render;
    /** @param {string} text @param {boolean} enabled @param {() => void} go @param {'back'} [direction] */
    const pagerButton = (text, enabled, go, direction) => {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = pagerClassName;
        // Meaning in the markup, the look in the theme: cyberpunk turns a
        // back button's notch to the side it points to; the other themes
        // draw it as the button beside it [Kenny's note of 2026-09-13].
        if (direction !== undefined) button.dataset.kpDirection = direction;
        button.textContent = text;
        button.disabled = !enabled;
        button.addEventListener('click', () => {
            go();
            if (serverMode) c.request();
            else render();
        });
        return button;
    };
    // The list is rebuilt, the clear button is not: a click on it blurs a
    // range field, whose change event re-renders the pills, and a button
    // rebuilt between the press and the release never gets its click.
    const pillsList = add(make('ul', 'kp-tag-list'));
    c.pillsList = pillsList;
    const clearButton = /** @type {HTMLButtonElement} */ (
        add(make('button', `kp-button kp-button--ghost kp-datatable__clear-filters${addMode ? ' kp-button--sm' : ''}`))
    );
    c.clearButton = clearButton;
    clearButton.type = 'button';
    decoratePart(clearButton, { kind: 'clear-filters' });
    clearButton.addEventListener('click', () => {
        c.clearFilters();
        (c.toggle ?? c.addButton)?.focus();
    });
    if (c.pills !== null) {
        c.pills.textContent = '';
        c.pills.append(pillsList, clearButton);
    }
}
