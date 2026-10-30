export type FilterKind = import('./events.js').FilterKind;
export type FilterValue = import('./events.js').FilterValue;
/** @typedef {import('./events.js').FilterKind} FilterKind */
/** @typedef {import('./events.js').FilterValue} FilterValue */
/** @param {string | undefined | null} attribute */
export declare const splitList: (attribute: string | undefined | null) => string[];
/**
 * Whether a filter holds anything; an empty one filters nothing.
 * @param {FilterKind} kind
 * @param {FilterValue | undefined} value
 */
export declare function filterActive(kind: FilterKind, value: FilterValue | undefined): boolean;
/**
 * A filter bound as the reader writes it [b3b4-1019; homelab gap 33]. A date bound is held as ISO (`2026-10-03`) so the
 * filter compares it exactly, but a pill, an error and a screen reader say it the way the two date pickers beside it write
 * it (their `data-kp-date-format`, `rule52` by default: dd/mm/yyyy whatever the locale; Kenny, 2026-10-19, "Zelfde notatie"). A number bound, or text that is not an ISO day, is returned as it is.
 *
 * @param {FilterKind} kind
 * @param {string} bound
 * @param {string | undefined} [locale]  none: the page's own
 */
export declare function boundText(kind: FilterKind, bound: string, locale?: string | undefined): string;
/**
 * The one pill a filter shows in the add-filter mode [Kenny, 2026-09-14]:
 * the column and every value the filter holds, or null when it holds
 * nothing. Both channels call this, so their pills read the same.
 *
 * @param {FilterKind} kind
 * @param {string} column the column's name
 * @param {FilterValue | undefined} value
 * @param {import('../strings.js').Strings} s
 * @param {string} [locale]  how a date bound is written; the page's own when absent
 * @returns {string | null}
 */
export declare function filterPillLabel(kind: FilterKind, column: string, value: FilterValue | undefined, s: import('../strings.js').Strings, locale?: string): string | null;
/**
 * Read the two bounds of an add-filter editor into a filter value, or say
 * what is wrong with them [Kenny, 2026-09-14, #filter-add]: a number bound
 * that is not a number, a date the picker cannot read, a range that runs
 * backwards. A value of null with no error means both bounds are empty, and
 * applying that removes the filter. Both channels call this.
 *
 * @param {'range' | 'date'} kind
 * @param {Record<'from' | 'to', { text: string, iso?: string, label: string }>} bounds  `text` as the field shows it; `iso` a date picker's value
 * @param {import('../strings.js').Strings} s
 * @param {string} [locale]  how a date bound is written in the refusal; the page's own when absent
 * @returns {{ value: { from: string, to: string } | null, error?: string, bound?: 'from' | 'to' }}
 */
export declare function readFilterBounds(kind: 'range' | 'date', bounds: Record<'from' | 'to', {
    text: string;
    iso?: string;
    label: string;
}>, s: import('../strings.js').Strings, locale?: string): {
    value: {
        from: string;
        to: string;
    } | null;
    error?: string;
    bound?: 'from' | 'to';
};
/**
 * Whether a cell's text passes a column's filter [gap-13].
 *
 * A range reads the cell in the page's locale, the way the sort does; a
 * date reads it as the date the cell writes, and the upper bound takes
 * the whole of its day, so "to 12 August" includes 12 August.
 *
 * @param {FilterKind} kind
 * @param {FilterValue | undefined} value
 * @param {string} text the cell's text
 * @param {string} locale
 */
export declare function matchesFilter(kind: FilterKind, value: FilterValue | undefined, text: string, locale: string): boolean;
/**
 * The pills an active filter shows, each with the value that removes it.
 *
 * @param {FilterKind} kind
 * @param {string} column the column's name
 * @param {FilterValue | undefined} value
 * @param {import('../strings.js').Strings} s
 * @param {string} [locale]  how a date bound is written; the page's own when absent
 * @returns {{ label: string, without: FilterValue | undefined }[]}
 */
export declare function filterPills(kind: FilterKind, column: string, value: FilterValue | undefined, s: import('../strings.js').Strings, locale?: string): {
    label: string;
    without: FilterValue | undefined;
}[];
/**
 * Whether an element takes part in layout: not hidden by the attribute and
 * not by a stylesheet (the card layout hides the header row, a narrow
 * table hides `.kp-col-low`).
 *
 * @param {Element} element
 */
export declare const shown: (element: Element) => boolean;
