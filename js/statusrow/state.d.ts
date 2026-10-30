/** The lists this module looks after. */
export declare const STATUS_LIST = ".kp-statuslist";
/** The attribute that names a row, for setStatus(). */
export declare const STATUS_ID_ATTRIBUTE = "data-kp-status-id";
/** Fired on the list, bubbling, when a row changed state after attach: `{ item, id, state, previous }`. */
export declare const STATUS_EVENT = "kp-status-change";
/** Fired on the list, bubbling, when a Retry is pressed: `{ item, id }`. */
export declare const STATUS_RETRY_EVENT = "kp-status-retry";
/** Fired on the list, bubbling, when Resume is pressed on a paused calm row (cancelable): `{ item, id }`. */
export declare const STATUS_RESUME_EVENT = "kp-status-resume";
/** Fired on the list, bubbling, when Pause is pressed on an open calm row (cancelable): `{ item, id }`. */
export declare const STATUS_PAUSE_EVENT = "kp-status-pause";
/** Fired on the list, bubbling, when Undo takes a resume or a pause back: `{ item, id, action }`. */
export declare const STATUS_UNDO_EVENT = "kp-status-undo";
/** The states a row can be in. */
export declare const STATUS_STATES: readonly ['ok', 'loading', 'failed', 'empty', 'warn'];
/** The states a row of the calm vocabulary can be in. */
export declare const CALM_STATUS_STATES: readonly ['open', 'done', 'paused', 'unknown', 'loading'];
export type StatusState = 'ok' | 'loading' | 'failed' | 'empty' | 'warn' | 'open' | 'done' | 'paused' | 'unknown';
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
    /**
     * what to do about it, written out; shown on a failed or warn row only [kpadopt4-rows]
     */
    fix?: string;
    /**
     * a paused calm row's day, `YYYY-MM-DD` [kpadopt6]
     */
    since?: string;
};
/**
 * @typedef {'ok' | 'loading' | 'failed' | 'empty' | 'warn' | 'open' | 'done' | 'paused' | 'unknown'} StatusState
 * @typedef {object} StatusRow
 * @property {string} [id] names the row for setStatus(); defaults to its label
 * @property {string} label
 * @property {string} [detail] the short line under the label: how long, the reason; give every row one so a reason arriving later moves nothing
 * @property {StatusState} [state] loading when absent
 * @property {string} [fix] what to do about it, written out; shown on a failed or warn row only [kpadopt4-rows]
 * @property {string} [since] a paused calm row's day, `YYYY-MM-DD` [kpadopt6]
 */
/** The state each row was last synced to. @type {WeakMap<Element, string>} */
export declare const synced: WeakMap<Element, string>;
/** The messages waiting to be announced, per region. @type {WeakMap<Element, { label: string, state: StatusState, detail: string }[]>} */
export declare const pending: WeakMap<Element, {
    label: string;
    state: StatusState;
    detail: string;
}[]>;
/** @param {Element | null} list */
export declare const isCalm: (list: Element | null) => boolean;
/** The tones a calm list has been warned about, so each is said once. */
export declare const warned: Set<any>;
/**
 * A row's state in the list's vocabulary. A calm list keeps its four, maps the standard `ok` to done and `empty` to open, and
 * draws anything else (a red `failed`, a `warn`) as unknown, so a red cannot slip into a calm list by accident.
 * @param {unknown} state @param {boolean} [calm] @returns {StatusState}
 */
export declare function known(state: unknown, calm?: boolean): StatusState;
/** @param {StatusState} state */
export declare const stateWord: (state: StatusState) => string;
/** @param {string} className @param {string} [tag] */
export declare const el: (className: string, tag?: string) => HTMLElement;
