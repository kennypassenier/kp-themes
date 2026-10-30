// The chrome around the table: the scroll box, the top and bottom bars.
import { CHECK_CLASS } from '../selectors.js';
import { watchScrolled } from '../grid.js';
/** @typedef {import('./context.js').TableContext} TableContext */

/**
 * What the the chrome around the table: the scroll box, the top and bottom bars part adds to the table's context.
 *
 * @typedef {{
 *     ensureTopBar: () => HTMLElement;
 *     putUnder: (line: HTMLElement) => void;
 *     scrollBox: HTMLElement | null;
 *     tableBlock: Element;
 *     themeBox: (box: Element | null) => void;
 *     topBar: HTMLElement | null;
 * }} ChromeFields
 */

/**
 * The chrome around the table: the scroll box, the top and bottom bars.
 *
 * @param {TableContext} c
 */
export function installChrome(c) {
    const { add, controlColumn, densitySelect, headers, labelOf, make, s0, scopeSelect, selectAll, status, table, undo, wrap } = c;

    // The package's own checkbox, whatever the markup wrote [gap-13,
    // Kenny's note]: a data table's boxes were the browser's, next to
    // themed boxes everywhere else on the page.
    /** @param {Element | null} box */
    const themeBox = (box) => {
        if (box === null || box.classList.contains(CHECK_CLASS)) return;
        box.classList.add(CHECK_CLASS);
        undo.push(() => box.classList.remove(CHECK_CLASS));
    };
    c.themeBox = themeBox;
    themeBox(selectAll);
    if (selectAll !== null && !selectAll.hasAttribute('aria-label') && selectAll.labels?.length === 0) {
        selectAll.setAttribute('aria-label', s0.tableSelectAll);
        undo.push(() => selectAll.removeAttribute('aria-label'));
    }
    // A max height makes the header stick [Kenny, 2026-09-13]: the
    // stylesheet does the sticking, this only carries the value.
    const maxHeight = wrap.dataset.kpMaxHeight;
    if (maxHeight !== undefined && maxHeight !== '') {
        wrap.style.setProperty('--kp-datatable-max-height', maxHeight);
        undo.push(() => wrap.style.removeProperty('--kp-datatable-max-height'));
    }
    // The header's reach shows only while the box is scrolled [scope-90].
    const scrollBox = /** @type {HTMLElement | null} */ (wrap.querySelector(':scope > .kp-table-wrap'));
    c.scrollBox = scrollBox;
    if (scrollBox !== null) undo.push(watchScrolled(wrap, scrollBox));
    /** The direct child of the wrapper that holds the table: generated parts go before it. */
    c.tableBlock = /** @type {Element} */ (table);
    while (c.tableBlock.parentElement !== null && c.tableBlock.parentElement !== wrap) c.tableBlock = c.tableBlock.parentElement;
    /** @type {HTMLElement | null} */
    c.topBar = /** @type {HTMLElement | null} */ (
        [...wrap.children].find(
            (child) =>
                child.classList.contains('kp-datatable__bar') && child.compareDocumentPosition(c.tableBlock) & Node.DOCUMENT_POSITION_FOLLOWING,
        ) ?? null
    );
    /** The bar a generated control goes in: the top bar, made when the markup has none. */
    const ensureTopBar = () => {
        if (c.topBar !== null) return c.topBar;
        c.topBar = add(make('div', 'kp-datatable__bar'));
        wrap.insertBefore(c.topBar, wrap.firstElementChild);
        return c.topBar;
    };
    c.ensureTopBar = ensureTopBar;
    /** The bar under the table, where the status is, for the lines a feature adds. */
    const bottomBar = /** @type {HTMLElement | null} */ (status?.closest('.kp-datatable__bar') ?? null);
    /** @param {HTMLElement} line */
    const putUnder = (line) => {
        if (bottomBar !== null) bottomBar.append(line);
        else wrap.insertBefore(line, c.tableBlock.nextSibling);
    };
    c.putUnder = putUnder;
    // ── The "In" choice ────────────────────────────────────────────
    if (scopeSelect !== null) {
        if (scopeSelect.options.length === 0) {
            const every = make('option');
            every.setAttribute('value', '');
            every.textContent = s0.tableSearchAllColumns;
            scopeSelect.append(add(every));
            headers.forEach((header, at) => {
                if (header.dataset.kpSearch === 'false' || controlColumn(at) || labelOf(at) === '') return;
                const option = /** @type {HTMLOptionElement} */ (make('option'));
                option.value = String(at);
                option.textContent = labelOf(at);
                scopeSelect.append(add(option));
            });
        }
        if (!scopeSelect.hasAttribute('aria-label') && scopeSelect.labels?.length === 0) {
            scopeSelect.setAttribute('aria-label', s0.tableSearchScope);
            undo.push(() => scopeSelect.removeAttribute('aria-label'));
        }
        c.scope = scopeSelect.value === '' ? null : Number(scopeSelect.value);
    }
    // ── The density choice ─────────────────────────────────────────
    if (densitySelect !== null) {
        if (densitySelect.options.length === 0) {
            for (const [value, text] of [
                ['comfortable', s0.tableDensityComfortable],
                ['compact', s0.tableDensityCompact],
            ]) {
                const option = /** @type {HTMLOptionElement} */ (make('option'));
                option.value = value ?? '';
                option.textContent = text ?? '';
                densitySelect.append(add(option));
            }
        }
        if (!densitySelect.hasAttribute('aria-label') && densitySelect.labels?.length === 0) {
            densitySelect.setAttribute('aria-label', s0.tableDensity);
            undo.push(() => densitySelect.removeAttribute('aria-label'));
        }
        densitySelect.value = wrap.getAttribute('data-density') === 'compact' ? 'compact' : 'comfortable';
    }
}
