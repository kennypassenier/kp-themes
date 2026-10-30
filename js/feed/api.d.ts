/** The handle of an attached feed. @param {Element} element @returns {import('./constants.js').FeedHandle | null} */
export declare const feedOf: (element: Element) => import('./constants.js').FeedHandle | null;
/**
 * Give a feed its rows, or its state.
 * @param {Element} element @param {import('./constants.js').FeedModel} model
 */
export declare function setFeed(element: Element, model: import('./constants.js').FeedModel): void;
/**
 * Wire every feed under `root`.
 * @param {ParentNode} [root]
 * @param {{ now?: () => number, timeZone?: string }} [options] `now` so a test never reads the real clock
 * @returns {() => void} detach
 */
export declare function attachFeeds(root?: ParentNode, { now, timeZone }?: {
    now?: () => number;
    timeZone?: string;
}): () => void;
