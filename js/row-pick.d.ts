export { ROW_PICK, PICK_ROW, PICKED_ATTRIBUTE } from './row-pick/rows.js';
export type RowPickHandle = {
    /**
     * the keys of every picked row, in the order picked
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
     * pick exactly these keys
     */
    set: (keys: readonly string[]) => void;
    /**
     * cursor one row down
     */
    next: () => void;
    /**
     * cursor one row up
     */
    prev: () => void;
    /**
     * pick or unpick the cursor row
     */
    toggle: () => void;
    /**
     * move the cursor by 1 or -1 and pick the range from the anchor
     */
    extend: (direction: number) => void;
    /**
     * unpick everything
     */
    clear: () => void;
};
/**
 * @typedef {object} RowPickHandle
 * @property {() => string[]} keys the keys of every picked row, in the order picked
 * @property {() => string | null} cursor the key of the cursor row
 * @property {(key: string | null) => void} moveTo put the cursor on a row, or take it away
 * @property {(keys: readonly string[]) => void} set pick exactly these keys
 * @property {() => void} next cursor one row down
 * @property {() => void} prev cursor one row up
 * @property {() => void} toggle pick or unpick the cursor row
 * @property {(direction: number) => void} extend move the cursor by 1 or -1 and pick the range from the anchor
 * @property {() => void} clear unpick everything
 */
/**
 * The handle of an element whose rows are picked.
 * @param {Element} el
 * @returns {RowPickHandle | null}
 */
export declare function rowPick(el: Element): RowPickHandle | null;
/**
 * The picked keys of an element.
 * @param {Element} el
 * @returns {string[]}
 */
export declare const rowPickKeys: (el: Element) => string[];
/** Move the cursor one row down. @param {Element} el */
export declare const rowPickNext: (el: Element) => void | undefined;
/** Move the cursor one row up. @param {Element} el */
export declare const rowPickPrev: (el: Element) => void | undefined;
/** Pick or unpick the cursor row. @param {Element} el */
export declare const rowPickToggle: (el: Element) => void | undefined;
/** Move the cursor and pick the range from the anchor to it. @param {Element} el @param {number} [direction] 1 (default) or -1 */
export declare const rowPickExtend: (el: Element, direction?: number) => void | undefined;
/** Unpick everything. @param {Element} el */
export declare const rowPickClear: (el: Element) => void | undefined;
/**
 * Let the rows of every element marked `data-kp-row-pick` under `root` (or `root` itself) be picked.
 * @param {ParentNode} [root]
 * @returns {() => void} detach
 */
export declare function attachRowPick(root?: ParentNode): () => void;
