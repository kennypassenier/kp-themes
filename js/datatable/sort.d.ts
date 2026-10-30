export type Compare = (a: string, b: string, kind: string, locale: string) => number;
export type Filter = (row: HTMLTableRowElement, query: string) => boolean;
/** @typedef {(a: string, b: string, kind: string, locale: string) => number} Compare */
/** @typedef {(row: HTMLTableRowElement, query: string) => boolean} Filter */
/**
 * Compare two cells the way their column asks to be compared.
 *
 * A number column sorted as text puts 100 before 20, which is the single
 * most common data-table bug and the reason the column declares its type
 * rather than the code guessing from the first row. Numbers and text are
 * read in the locale: "1.284,50" is a number in Dutch and "1,284.50" in
 * English, and both sort correctly on their own page.
 *
 * @type {Compare}
 */
export declare function compare(a: string, b: string, kind: string, locale: string): number;
/**
 * Compare two cells by a declared order, "Low,Medium,High,Critical" [gap-13].
 *
 * Severity sorted as text reads Critical, High, Low, Medium: alphabetical
 * and meaningless. A value the order does not name sorts after every value
 * it does, by the column's own comparison, so a stray "Unknown" neither
 * disappears nor jumps to the top.
 *
 * @param {readonly string[]} order
 * @param {string} a
 * @param {string} b
 * @param {(a: string, b: string) => number} fallback
 */
export declare function compareByOrder(order: readonly string[], a: string, b: string, fallback: (a: string, b: string) => number): number;
/**
 * The next sort keys after a header press [Kenny, 2026-09-13, #multi-sort].
 *
 * A plain press sorts on that column alone, ascending, then descending, then (cycle
 * 'three', the default since wish-1120 / homelab 93) off again: the rows go back to their own
 * order and the header says aria-sort none. Cycle 'two' keeps turning between the two
 * directions and never leaves the sort. With `add` (Shift) the column joins the keys as the
 * last one, turns round when it is a key already, and leaves the keys on
 * its third press. Both channels call this, so they cannot disagree on
 * what a press does.
 *
 * @template K
 * @param {{ column: K, direction: 'ascending' | 'descending' }[]} keys
 * @param {K} column
 * @param {{ add?: boolean, cycle?: 'two' | 'three' }} [options]
 * @returns {{ column: K, direction: 'ascending' | 'descending' }[]}
 */
export declare function nextSorts<K>(keys: {
    column: K;
    direction: 'ascending' | 'descending';
}[], column: K, { add, cycle }?: {
    add?: boolean;
    cycle?: 'two' | 'three';
}): {
    column: K;
    direction: 'ascending' | 'descending';
}[];
