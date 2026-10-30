// Writes the controls from the state, reads them back, and applies sorts and filters.
import { datePicker } from '../../datepicker.js';
import { filterActive, matchesFilter } from '../filter.js';
import { compareByOrder } from '../sort.js';
/** @typedef {import('../events.js').FilterValue} FilterValue */
/** @typedef {import('./context.js').TableContext} TableContext */

/**
 * What the writes the controls from the state, reads them back, and applies sorts and filters part adds to the table's context.
 *
 * @typedef {{
 *     applyFilter: (arg0?: { keepPage?: boolean | undefined; }) => void;
 *     applySorts: () => void;
 *     readControls: () => void;
 *     refreshChoices: () => void;
 *     writeControls: () => void;
 *     writing: boolean;
 * }} ApplyFields
 */

/**
 * Writes the controls from the state, reads them back, and applies sorts and filters.
 *
 * @param {TableContext} c
 */
export function installApply(c) {
    const {
        arrange,
        cellText,
        cellValue,
        choiceText,
        compareFn,
        externalSort,
        fillChoices,
        filterFn,
        filterKinds,
        filters,
        headers,
        locale,
        orders,
        render,
        rendered,
        serverMode,
    } = c;

    /** True while writeControls sets a date picker, whose change event must not be read back. */
    c.writing = false;
    /** Write the filter state into the panel's controls, so a pill or the handle and the panel agree. */
    const writeControls = () => {
        if (c.panel === null) return;
        for (const set of c.panel.querySelectorAll('[data-kp-filter-column]')) {
            const at = Number(/** @type {HTMLElement} */ (set).dataset.kpFilterColumn);
            const value = filters.get(at);
            for (const box of set.querySelectorAll('input[type="checkbox"]')) {
                const input = /** @type {HTMLInputElement} */ (box);
                input.checked = Array.isArray(value) && value.includes(input.value);
            }
            for (const bound of set.querySelectorAll('[data-kp-filter-bound]')) {
                const input = /** @type {HTMLInputElement} */ (bound);
                const range = /** @type {{ from?: string, to?: string } | undefined} */ (Array.isArray(value) ? undefined : value);
                const wanted = (input.dataset.kpFilterBound === 'from' ? range?.from : range?.to) ?? '';
                const picker = input.closest('[data-kp-datepicker]');
                const handle = picker === null ? null : datePicker(picker);
                if (handle === null) {
                    input.value = wanted;
                    continue;
                }
                // A date bound is set through its picker, which formats it for
                // the locale; what the person is typing is left alone while it
                // already means the same date.
                if ((input.dataset.kpDateValue ?? '') === wanted) continue;
                c.writing = true;
                try {
                    handle.set(wanted === '' ? null : wanted);
                } finally {
                    c.writing = false;
                }
            }
        }
    };
    c.writeControls = writeControls;
    /**
     * The panel's choice lists, read again from the rows. At attach they
     * hold the rows the markup had; a page that writes its rows afterwards
     * (and calls refresh) would otherwise keep an empty list for good.
     */
    const refreshChoices = () => {
        if (c.panel === null) return;
        for (const set of c.panel.querySelectorAll('[data-kp-filter-column]')) {
            const at = Number(/** @type {HTMLElement} */ (set).dataset.kpFilterColumn);
            if (filterKinds[at] !== 'choice') continue;
            const value = filters.get(at);
            fillChoices(set, at, Array.isArray(value) ? value : []);
        }
    };
    c.refreshChoices = refreshChoices;
    /** Read the panel's controls into the filter state. */
    const readControls = () => {
        if (c.panel === null) return;
        filters.clear();
        for (const set of c.panel.querySelectorAll('[data-kp-filter-column]')) {
            const at = Number(/** @type {HTMLElement} */ (set).dataset.kpFilterColumn);
            const kind = filterKinds[at];
            /** @type {FilterValue} */
            let value;
            if (kind === 'choice')
                value = [...set.querySelectorAll('input[type="checkbox"]:checked')].map((b) => /** @type {HTMLInputElement} */ (b).value);
            else {
                // A date bound reads the ISO its picker holds, never the text on screen.
                const read = (/** @type {string} */ bound) => {
                    const input = /** @type {HTMLInputElement | null} */ (set.querySelector(`[data-kp-filter-bound="${bound}"]`));
                    if (input === null) return '';
                    return input.dataset.kpDateInput === undefined ? input.value : (input.dataset.kpDateValue ?? '');
                };
                value = { from: read('from'), to: read('to') };
            }
            if (kind !== null && kind !== undefined && filterActive(kind, value)) filters.set(at, value);
        }
    };
    c.readControls = readControls;
    /** @param {HTMLTableRowElement} a @param {HTMLTableRowElement} b */
    const compareRows = (a, b) => {
        for (const key of c.sorts) {
            const kind = headers[key.column]?.dataset.kpSort ?? 'text';
            const order = orders[key.column];
            /** @param {string} x @param {string} y */
            const by = (x, y) => compareFn(x, y, kind, locale);
            const left = cellValue(a, key.column);
            const right = cellValue(b, key.column);
            const c = order ? compareByOrder(order, left, right, by) : by(left, right);
            if (c !== 0) return key.direction === 'ascending' ? c : -c;
        }
        return 0;
    };
    const applySorts = () => {
        if (externalSort) {
            // The order the page rendered, which it changes itself on kp-datatable-sort and then refresh().
            const keep = new Set(c.shownRows);
            c.shownRows = arrange(c.all.filter((row) => keep.has(row)));
            return;
        }
        if (c.sorts.length === 0) {
            // Back to the rendered order, filtered.
            const keep = new Set(c.shownRows);
            c.shownRows = rendered.filter((row) => keep.has(row));
        } else c.shownRows = [...c.shownRows].sort(compareRows);
        // Group rows keep their rows together [J2]: the sort above is
        // stable, so this orders the rows within each group.
        c.shownRows = arrange(c.shownRows);
    };
    c.applySorts = applySorts;
    /** @param {{ keepPage?: boolean }} [options] */
    const applyFilter = ({ keepPage = false } = {}) => {
        if (serverMode) {
            if (!keepPage) c.page = 0;
            c.request();
            return;
        }
        const needle = c.query.trim().toLowerCase();
        c.shownRows = c.all.filter((row) => {
            if (needle !== '') {
                const hit = c.scope === null ? filterFn(row, needle) : cellText(row, c.scope).toLowerCase().includes(needle);
                if (!hit) return false;
            }
            for (const [at, value] of filters) {
                const kind = filterKinds[at];
                if (kind && !matchesFilter(kind, value, kind === 'choice' ? choiceText(row, at) : cellValue(row, at), locale)) return false;
            }
            return true;
        });
        applySorts();
        if (!keepPage) c.page = 0;
        render();
    };
    c.applyFilter = applyFilter;
}
