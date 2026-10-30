export { DEPLIST, DEPLIST_RETRY_EVENT, DEPLIST_COLLAPSE } from './deplist/values.js';
export { orderDependencies, depText } from './deplist/order.js';
export type DepItem = {
    /**
     * the thing that needs
     */
    from: string;
    /**
     * the thing needed
     */
    to: string;
    /**
     * a word for the link between them
     */
    label?: string;
    /**
     * the state of the needed thing
     */
    state?: 'running' | 'stopped' | 'unknown';
};
export type DepRow = {
    item: DepItem;
    /**
     * its place in the order things must go (null when unnumbered)
     */
    number: number | null;
};
export type DeplistHandle = {
    element: HTMLElement;
    /**
     * draw the rows (clears any state)
     */
    set: (items: readonly DepItem[]) => void;
    setState: (state: 'ready' | 'loading' | 'empty' | 'error', options?: {
        message?: string;
    }) => void;
    /**
     * the rows as drawn
     */
    rows: () => DepRow[];
};
/**
 * @typedef {object} DepItem
 * @property {string} from the thing that needs
 * @property {string} to the thing needed
 * @property {string} [label] a word for the link between them
 * @property {'running' | 'stopped' | 'unknown'} [state] the state of the needed thing
 */
/**
 * @typedef {object} DepRow
 * @property {DepItem} item
 * @property {number | null} number its place in the order things must go (null when unnumbered)
 */
/**
 * @typedef {object} DeplistHandle
 * @property {HTMLElement} element
 * @property {(items: readonly DepItem[]) => void} set draw the rows (clears any state)
 * @property {(state: 'ready' | 'loading' | 'empty' | 'error', options?: { message?: string }) => void} setState
 * @property {() => DepRow[]} rows the rows as drawn
 */
/**
 * The handle of a list.
 * @param {Element} el
 * @returns {DeplistHandle | null}
 */
export declare function deplist(el: Element): DeplistHandle | null;
/**
 * Give every dependency list under `root` its rows and its states; fill one with `setDeplist` or the handle.
 * @param {ParentNode} [root]
 * @returns {() => void} detach
 */
export declare function attachDeplists(root?: ParentNode): () => void;
/**
 * Draw the rows of a list (attaching it first when it was not yet).
 * @param {HTMLElement} el
 * @param {readonly DepItem[]} items
 */
export declare function setDeplist(el: HTMLElement, items: readonly DepItem[]): void;
