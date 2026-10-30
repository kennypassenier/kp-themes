export type StatusState = import('./state.js').StatusState;
export type StatusRow = import('./state.js').StatusRow;
/** @typedef {import('./state.js').StatusState} StatusState */
/** @typedef {import('./state.js').StatusRow} StatusRow */
/**
 * Resume or pause a calm row as a person pressed it: the event (cancelable), the new state, a sentence and a toast with Undo
 * that puts the row back as it was, its date included.
 * @param {Element} list @param {Element} item @param {'resume' | 'pause'} action
 */
export declare function turn(list: Element, item: Element, action: 'resume' | 'pause'): void;
/**
 * Order and fold a calm list once, at the page's word: `data-kp-today-order="open-first"` puts the open rows first (nothing
 * moves afterwards, so a row that becomes done stays under the thumb), and `data-kp-today-paused="fold"` gathers the rows
 * paused for more than `data-kp-today-fold-after` days (30) into one line that opens them.
 * @param {Element} list
 */
export declare function settleToday(list: Element): void;
/**
 * Change one row. `key` is the row's `data-kp-status-id` or its index.
 *
 * @param {Element} list
 * @param {string | number} key
 * @param {{ state?: StatusState, label?: string, detail?: string, fix?: string, since?: string }} change
 * @returns {Element | null} the row, or null when there is no such row
 */
export declare function setStatus(list: Element, key: string | number, change: {
    state?: StatusState;
    label?: string;
    detail?: string;
    fix?: string;
    since?: string;
}): Element | null;
/**
 * How many rows of a list are in each state, for a summary line such as
 * "3 of 4 checks pass" [kpadopt4-rows]. Counts the rows as they are now.
 * @param {Element} list
 * @returns {Record<StatusState, number> & { total: number }}
 */
export declare function countStatus(list: Element): Record<StatusState, number> & {
    total: number;
};
/**
 * The state of a today card (a `.kp-card` around a calm list): `loading` lays the busy card over the rows, `empty` says
 * "Nothing planned today" over "That is fine, nothing is waiting", `error` is blame-free with a normal-size Retry (the card's
 * `kp-card-retry`). The words are the dictionary's `statusToday…`, or the page's own.
 * @param {HTMLElement} card
 * @param {'ready' | 'loading' | 'empty' | 'error'} state
 * @param {{ title?: string, text?: string, words?: string }} [words]
 */
export declare function setTodayState(card: HTMLElement, state: 'ready' | 'loading' | 'empty' | 'error', words?: {
    title?: string;
    text?: string;
    words?: string;
}): void;
/**
 * Build a status list from rows. The result still needs attachStatusLists()
 * (on the element or its container) for the spoken parts and the Retry.
 *
 * @param {StatusRow[]} rows
 * @param {{ label?: string, retry?: boolean, single?: boolean, vocab?: 'standard' | 'calm' }} [options] `label`: the list's accessible name;
 *   `retry: false` leaves out the Retry button; `single`: one column; `vocab: 'calm'` the open, done, paused and unknown rows [kpadopt6]
 * @returns {HTMLUListElement}
 */
export declare function buildStatusList(rows: StatusRow[], { label, retry, single, vocab }?: {
    label?: string;
    retry?: boolean;
    single?: boolean;
    vocab?: 'standard' | 'calm';
}): HTMLUListElement;
