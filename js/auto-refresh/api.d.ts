/** The handle of an attached control. @param {Element} element @returns {import('./constants.js').RefreshHandle | null} */
export declare const refreshOf: (element: Element) => import('./constants.js').RefreshHandle | null;
/**
 * Tell a control the app has finished the refresh it asked for.
 * @param {Element} element @param {boolean} ok
 */
export declare function refreshDone(element: Element, ok: boolean): void;
/**
 * Set the interval from the consumer (any whole number of seconds; 0 pauses).
 * @param {Element} element @param {number} seconds
 */
export declare function setRefreshInterval(element: Element, seconds: number): void;
/**
 * Set (or take away, with an empty string) the title in a control's bar [wish-1028].
 * @param {Element} element @param {string} words
 */
export declare function setRefreshTitle(element: Element, words: string): void;
/**
 * Wire every refresh control under `root`.
 * @param {ParentNode} [root]
 * @param {{ now?: () => number }} [options]
 * @returns {() => void} detach
 */
export declare function attachRefresh(root?: ParentNode, { now }?: {
    now?: () => number;
}): () => void;
