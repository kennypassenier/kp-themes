export { ROW_SELECT, ROW_SELECT_AUTO, SELECT_BOX, ROW_SELECT_EVENT, ROW_OPEN_EVENT, CURSOR_CLASS, LONG_PRESS_MS, } from './row-select/rows.js';
export type RowSelectOptions = {
    range?: 'shift' | 'off';
    arrows?: boolean;
    allKey?: boolean;
    scroll?: 'nearest' | 'center';
};
export type RowSelectHandle = {
    /**
     * the keys of every ticked row
     */
    keys: () => string[];
    /**
     * the key of the cursor row
     */
    cursor: () => string | null;
    /**
     * put the cursor on a row, or take it away
     */
    moveTo: (key: string | null) => void;
    /**
     * untick everything
     */
    clear: () => void;
};
/**
 * @typedef {object} RowSelectOptions
 * @property {'shift' | 'off'} [range]
 * @property {boolean} [arrows]
 * @property {boolean} [allKey]
 * @property {'nearest' | 'center'} [scroll]
 */
/**
 * @typedef {object} RowSelectHandle
 * @property {() => string[]} keys the keys of every ticked row
 * @property {() => string | null} cursor the key of the cursor row
 * @property {(key: string | null) => void} moveTo put the cursor on a row, or take it away
 * @property {() => void} clear untick everything
 */
/**
 * The keys of every ticked row under `el`.
 * @param {Element} el
 * @returns {string[]}
 */
export declare function rowSelectKeys(el: Element): string[];
/**
 * The handle of an element that has the keys.
 * @param {Element} el
 * @returns {RowSelectHandle | null}
 */
export declare function rowSelect(el: Element): RowSelectHandle | null;
/**
 * Give every table and list under `root` that has select boxes the keys.
 * @param {ParentNode} [root]
 * @param {RowSelectOptions} [options]
 * @returns {() => void} detach
 */
export declare function attachRowSelect(root?: ParentNode, options?: RowSelectOptions): () => void;
