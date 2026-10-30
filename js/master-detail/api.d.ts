/** The handle of an attached layout. @param {Element} element @returns {import('./constants.js').MasterDetailHandle | null} */
export declare const masterDetail: (element: Element) => import('./constants.js').MasterDetailHandle | null;
/**
 * Set the detail pane's state. A page that draws with the DOM calls this; the
 * detail pane keeps its place and size in every state.
 * @param {Element} root
 * @param {import('./constants.js').PaneState} state
 * @param {import('./constants.js').PaneStateOptions} [options]
 */
export declare function setPaneState(root: Element, state: import('./constants.js').PaneState, options?: import('./constants.js').PaneStateOptions): void;
/**
 * Select an item by its key (the arrow keys' move), without opening the detail.
 * @param {Element} root @param {string | null} key
 */
export declare function selectPane(root: Element, key: string | null): void;
/**
 * Open the detail of an item (narrow: the detail replaces the list).
 * @param {Element} root @param {string} key
 */
export declare function openPane(root: Element, key: string): void;
/** Show the list again. @param {Element} root */
export declare function closePane(root: Element): void;
/**
 * Wire every master-detail layout under `root`; one without a list pane and a detail pane is left alone.
 * @param {ParentNode} [root]
 * @param {{ history?: boolean }} [options] `history: false` leaves the browser's history alone
 * @returns {() => void} detach
 */
export declare function attachMasterDetails(root?: ParentNode, { history: useHistory }?: {
    history?: boolean;
}): () => void;
