// Finds the controls around the table and reads its options.
import { ACTIONS, DENSITY, EMPTY, FAILED, LOADING, PAGER, SCOPE, SEARCH, SELECT_ALL, STATUS } from '../selectors.js';
import { PAGE_SIZE, SERVER_DEBOUNCE_MS } from '../events.js';
import { resolveLocale } from '../../locale.js';
import { splitList } from '../filter.js';
/** @typedef {import('./context.js').TableContext} TableContext */

/**
 * What the finds the controls around the table and reads its options part adds to the table's context.
 *
 * @typedef {{
 *     actions: HTMLElement | null;
 *     addOnClick: boolean;
 *     cycleName: 'two' | 'three';
 *     debounce: number;
 *     densitySelect: HTMLSelectElement | null;
 *     empty: HTMLElement | null;
 *     externalSort: boolean;
 *     failedSlot: HTMLElement | null;
 *     glyphs: { expand: string; collapse: string; };
 *     loadingSlot: HTMLElement | null;
 *     locale: string;
 *     multi: boolean;
 *     pager: HTMLElement | null;
 *     scopeSelect: HTMLSelectElement | null;
 *     search: HTMLInputElement | null;
 *     selectAll: HTMLInputElement | null;
 *     serverMode: boolean;
 *     size: number;
 *     sizes: number[];
 *     status: HTMLElement | null;
 * }} ControlsFields
 */

/**
 * Finds the controls around the table and reads its options.
 *
 * @param {TableContext} c
 */
export function installControls(c) {
    const { collapseGlyph, debounceMs, expandGlyph, localeOption, multiSort, pageSizesOption, sortCycle, sortExternal, sortsSeveral, wrap } = c;

    const search = /** @type {HTMLInputElement | null} */ (wrap.querySelector(SEARCH));
    c.search = search;
    const scopeSelect = /** @type {HTMLSelectElement | null} */ (wrap.querySelector(SCOPE));
    c.scopeSelect = scopeSelect;
    const densitySelect = /** @type {HTMLSelectElement | null} */ (wrap.querySelector(DENSITY));
    c.densitySelect = densitySelect;
    const status = /** @type {HTMLElement | null} */ (wrap.querySelector(STATUS));
    c.status = status;
    const pager = /** @type {HTMLElement | null} */ (wrap.querySelector(PAGER));
    c.pager = pager;
    c.empty = /** @type {HTMLElement | null} */ (wrap.querySelector(EMPTY));
    const loadingSlot = /** @type {HTMLElement | null} */ (wrap.querySelector(LOADING));
    c.loadingSlot = loadingSlot;
    c.failedSlot = /** @type {HTMLElement | null} */ (wrap.querySelector(FAILED));
    const actions = /** @type {HTMLElement | null} */ (wrap.querySelector(ACTIONS));
    c.actions = actions;
    const selectAll = /** @type {HTMLInputElement | null} */ (wrap.querySelector(SELECT_ALL));
    c.selectAll = selectAll;
    c.size = Number.parseInt(wrap.dataset.kpPageSize ?? '', 10) || PAGE_SIZE;
    const locale = resolveLocale(wrap.dataset.kpLocale ?? localeOption, wrap);
    c.locale = locale;
    const serverMode = wrap.dataset.kpServer !== undefined;
    c.serverMode = serverMode;
    // The page owns the order [kpadopt4]: everything about the sort but the moving of rows.
    const externalSort = wrap.dataset.kpSortExternal === undefined ? sortExternal : wrap.dataset.kpSortExternal !== 'false';
    c.externalSort = externalSort;
    const debounce = Number.parseInt(wrap.dataset.kpDebounce ?? '', 10) || debounceMs || (serverMode ? SERVER_DEBOUNCE_MS : 0);
    c.debounce = debounce;
    const cycle = wrap.dataset.kpSortCycle ?? sortCycle;
    const cycleName = cycle === 'two' ? 'two' : 'three';
    c.cycleName = cycleName;
    const multi = sortsSeveral(wrap);
    c.multi = multi;
    // `data-kp-sort-multi="click"` [kpadopt]: every plain press adds the
    // column as a key (ascending, descending, out); Shift flips to the
    // old plain press, "this column alone", the quick way back to one key.
    const addOnClick = multi && (wrap.dataset.kpSortMulti === 'click' || (wrap.dataset.kpSortMulti === undefined && multiSort === 'click'));
    c.addOnClick = addOnClick;
    const glyphs = {
        expand: wrap.dataset.kpExpandGlyph ?? expandGlyph,
        collapse: wrap.dataset.kpCollapseGlyph ?? collapseGlyph,
    };
    c.glyphs = glyphs;
    const sizesAttribute = wrap.dataset.kpPageSizes;
    const sizes =
        sizesAttribute === 'none'
            ? []
            : [
                  ...new Set([
                      ...(sizesAttribute
                          ? splitList(sizesAttribute)
                                .map(Number)
                                .filter((n) => n > 0)
                          : pageSizesOption),
                      c.size,
                  ]),
              ].sort((a, b) => a - b);
    c.sizes = sizes;
}
