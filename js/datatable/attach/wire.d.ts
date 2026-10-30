export type TableContext = import('./context.js').TableContext;
export type WireFields = {
    initialSorts: {
        column: number;
        direction: 'ascending' | 'descending';
    }[];
    resize: ResizeObserver | null;
    resizeFrame: number;
};
/** @typedef {import('./context.js').TableContext} TableContext */
/**
 * What the registers the table's listeners and applies its initial state part adds to the table's context.
 *
 * @typedef {{
 *     initialSorts: { column: number; direction: 'ascending' | 'descending'; }[];
 *     resize: ResizeObserver | null;
 *     resizeFrame: number;
 * }} WireFields
 */
/**
 * Registers the table's listeners and applies its initial state.
 *
 * @param {TableContext} c
 */
export declare function installWire(c: TableContext): void;
