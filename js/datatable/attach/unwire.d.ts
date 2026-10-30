export type TableContext = import('./context.js').TableContext;
/** @typedef {import('./context.js').TableContext} TableContext */
/**
 * The detach that undoes everything the table added.
 *
 * @param {TableContext} c
 */
export declare function installUnwire(c: TableContext): void;
