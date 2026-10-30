export type DepItem = import('../deplist.js').DepItem;
export type DepRow = import('../deplist.js').DepRow;
/** @typedef {import('../deplist.js').DepItem} DepItem */
/** @typedef {import('../deplist.js').DepRow} DepRow */
/**
 * The rows in the order things must go: a row stands after the rows of the things it needs (a thing's depth is one more than the
 * deepest thing it needs that is itself listed as needing something), numbered from 1. Rows in a cycle are not ordered: they
 * come back as `cycles`, each a path of names.
 *
 * @param {readonly DepItem[]} items
 * @param {{ numbers?: boolean }} [options]
 * @returns {{ rows: DepRow[], cycles: string[][] }}
 */
export declare function orderDependencies(items: readonly DepItem[], { numbers }?: {
    numbers?: boolean;
}): {
    rows: DepRow[];
    cycles: string[][];
};
/** The rows as plain text, one per line: "paperless -> postgres". @param {readonly DepItem[]} items */
export declare const depText: (items: readonly DepItem[]) => string;
