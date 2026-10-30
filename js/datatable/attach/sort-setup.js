// The sort and column controls and the remembered columns.
import { CARD_SORT, SORT_RESET, SORT_SUMMARY } from '../selectors.js';
import { getStrings } from '../../strings.js';
/** @typedef {import('./context.js').TableContext} TableContext */

/**
 * What the the sort and column controls and the remembered columns part adds to the table's context.
 *
 * @typedef {{
 *     choosable: number[];
 *     columnCount: HTMLElement | null;
 *     columnList: HTMLElement | null;
 *     editLog: HTMLElement | null;
 *     hiddenColumns: Set<number>;
 *     locked: boolean[];
 *     openingSort: string | null;
 *     sortBy: HTMLSelectElement | null;
 *     sortDirection: HTMLButtonElement | null;
 *     sortSummary: HTMLElement | null;
 * }} SortSetupFields
 */

/**
 * The sort and column controls and the remembered columns.
 *
 * @param {TableContext} c
 */
export function installSortSetup(c) {
    const { add, controlColumn, editKinds, ensureTopBar, headers, id, keyColumn, labelOf, make, multi, putUnder, s0, wrap } = c;

    // ── The card layout's sort control ─────────────────────────────
    const sortable = headers.flatMap((header, at) => (header.dataset.kpSort === undefined ? [] : [at]));
    /** @type {HTMLSelectElement | null} */
    c.sortBy = null;
    /** @type {HTMLButtonElement | null} */
    c.sortDirection = null;
    if (wrap.dataset.kpCards !== undefined && sortable.length > 0 && wrap.querySelector(CARD_SORT) === null) {
        const control = add(make('div', 'kp-datatable__card-sort'));
        control.dataset.kpDatatableCardSort = '';
        const label = make('label', 'kp-datatable__label');
        label.append(s0.tableSortBy, ' ');
        c.sortBy = /** @type {HTMLSelectElement} */ (make('select', 'kp-field__input kp-datatable__select'));
        c.sortBy.dataset.kpDatatableSortBy = '';
        c.sortBy.setAttribute('aria-label', s0.tableSortBy);
        const none = /** @type {HTMLOptionElement} */ (make('option'));
        none.value = '';
        none.textContent = s0.tableSortNone;
        c.sortBy.append(none);
        for (const at of sortable) {
            const option = /** @type {HTMLOptionElement} */ (make('option'));
            option.value = String(at);
            option.textContent = labelOf(at);
            c.sortBy.append(option);
        }
        label.append(c.sortBy);
        c.sortDirection = /** @type {HTMLButtonElement} */ (make('button', 'kp-button kp-button--ghost'));
        c.sortDirection.type = 'button';
        c.sortDirection.dataset.kpDatatableSortDirection = '';
        control.append(label, c.sortDirection);
        wrap.insertBefore(control, c.tableBlock);
    }
    // ── The multi-sort summary (#multi-sort) ───────────────────────
    /** @type {HTMLElement | null} */
    c.sortSummary = null;
    /** The opening sort, as a key, once it is known; the way back to it is shown only when the sort differs [fix-83]. @type {string | null} */
    c.openingSort = null;
    if (multi) {
        c.sortSummary = /** @type {HTMLElement | null} */ (wrap.querySelector(SORT_SUMMARY));
        if (c.sortSummary === null) {
            // A line of its own under the toolbar, one line high whatever it
            // says. It used to be prepended to the toolbar and grew with its
            // words, so the search shrank and moved with every key added
            // [fix-83].
            const line = add(make('div', 'kp-datatable__bar kp-datatable__sort-line'));
            c.sortSummary = make('p', 'kp-datatable__status kp-datatable__sort-summary');
            c.sortSummary.dataset.kpDatatableSortSummary = '';
            c.sortSummary.setAttribute('aria-live', 'polite');
            line.append(c.sortSummary);
            if (wrap.querySelector(SORT_RESET) === null) {
                const back = /** @type {HTMLButtonElement} */ (make('button', 'kp-button kp-button--ghost kp-button--sm'));
                back.type = 'button';
                back.dataset.kpDatatableSortReset = '';
                back.textContent = getStrings().tableSortReset;
                line.append(back);
            }
            wrap.insertBefore(line, c.tableBlock);
        }
    }
    // ── The column menu (#columns) ─────────────────────────────────
    const locked = headers.map(
        (header, at) =>
            !controlColumn(at) && (header.dataset.kpColumnLocked === undefined ? at === keyColumn : header.dataset.kpColumnLocked !== 'false'),
    );
    c.locked = locked;
    /** @type {Set<number>} */
    c.hiddenColumns = new Set(headers.flatMap((header, at) => (header.dataset.kpColumnHidden !== undefined && !locked[at] ? [at] : [])));
    const choosable = headers.flatMap((_, at) => (controlColumn(at) ? [] : [at]));
    c.choosable = choosable;
    /** @type {HTMLElement | null} */
    c.columnList = null;
    /** @type {HTMLElement | null} */
    c.columnCount = null;
    if (wrap.dataset.kpColumnMenu !== undefined && choosable.length > 0) {
        const bar = ensureTopBar();
        const popId = `${id}-columns`;
        const button = /** @type {HTMLButtonElement} */ (add(make('button', 'kp-button kp-button--ghost kp-datatable__columns-toggle')));
        button.type = 'button';
        button.dataset.kpDatatableColumnsToggle = '';
        button.textContent = s0.tableColumns;
        button.setAttribute('aria-haspopup', 'true');
        button.setAttribute('aria-expanded', 'false');
        button.setAttribute('aria-controls', popId);
        button.setAttribute('popovertarget', popId);
        // Anchor positioning puts the menu under its button, as the theme
        // picker's menu is placed [css/components.css, .kp-popover].
        button.style.setProperty('anchor-name', `--${popId}`);
        const pop = add(make('div', 'kp-popover kp-datatable__columns'));
        pop.id = popId;
        pop.setAttribute('popover', 'auto');
        pop.dataset.kpDatatableColumns = '';
        pop.style.setProperty('position-anchor', `--${popId}`);
        pop.addEventListener('toggle', (event) => {
            button.setAttribute('aria-expanded', String(/** @type {ToggleEvent} */ (event).newState === 'open'));
        });
        c.columnList = make('ul', 'kp-menu');
        c.columnList.setAttribute('aria-label', s0.tableColumnsLabel);
        pop.append(c.columnList);
        c.columnCount = add(make('span', 'kp-datatable__status kp-datatable__columns-count'));
        c.columnCount.dataset.kpDatatableColumnsCount = '';
        bar.append(button, pop, c.columnCount);
    }
    // ── The edit log (#inline-edit) ────────────────────────────────
    const editable = editKinds.some((kind) => kind !== null);
    /** @type {HTMLElement | null} */
    c.editLog = null;
    if (editable) {
        c.editLog = add(make('p', 'kp-datatable__status kp-datatable__edit-log'));
        c.editLog.dataset.kpDatatableEditLog = '';
        c.editLog.setAttribute('role', 'status');
        c.editLog.setAttribute('aria-live', 'polite');
        putUnder(c.editLog);
    }
}
