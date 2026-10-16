/** The lists this module looks after. */
export declare const STATUS_LIST = ".kp-statuslist";
/** The attribute that names a row, for setStatus(). */
export declare const STATUS_ID_ATTRIBUTE = "data-kp-status-id";
/** Fired on the list, bubbling, when a row changed state after attach: `{ item, id, state, previous }`. */
export declare const STATUS_EVENT = "kp-status-change";
/** Fired on the list, bubbling, when a Retry is pressed: `{ item, id }`. */
export declare const STATUS_RETRY_EVENT = "kp-status-retry";
/** The states a row can be in. */
export declare const STATUS_STATES: readonly ['ok', 'loading', 'failed', 'empty'];
export type StatusState = 'ok' | 'loading' | 'failed' | 'empty';
export type StatusRow = {
    /**
     * names the row for setStatus(); defaults to its label
     */
    id?: string;
    label: string;
    /**
     * the short line under the label: how long, the reason; give every row one so a reason arriving later moves nothing
     */
    detail?: string;
    /**
     * loading when absent
     */
    state?: StatusState;
};
/**
 * Build a status list from rows. The result still needs attachStatusLists()
 * (on the element or its container) for the spoken parts and the Retry.
 *
 * @param {StatusRow[]} rows
 * @param {{ label?: string, retry?: boolean, single?: boolean }} [options] `label`: the list's accessible name;
 *   `retry: false` leaves out the Retry button; `single`: one column
 * @returns {HTMLUListElement}
 */
export declare function buildStatusList(rows: StatusRow[], { label, retry, single }?: {
    label?: string;
    retry?: boolean;
    single?: boolean;
}): HTMLUListElement;
/**
 * Change one row. `key` is the row's `data-kp-status-id` or its index.
 *
 * @param {Element} list
 * @param {string | number} key
 * @param {{ state?: StatusState, label?: string, detail?: string }} change
 * @returns {Element | null} the row, or null when there is no such row
 */
export declare function setStatus(list: Element, key: string | number, change: {
    state?: StatusState;
    label?: string;
    detail?: string;
}): Element | null;
/**
 * Sync every `.kp-statuslist` under `root`, follow `data-state` changes later
 * and turn a press on a Retry into `kp-status-retry`. A list rendered after
 * this ran is attached by calling it on that subtree.
 *
 * @param {ParentNode} [root]
 * @returns {() => void} detach
 */
export declare function attachStatusLists(root?: ParentNode): () => void;
