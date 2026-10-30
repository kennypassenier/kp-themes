export type StatusState = import('./state.js').StatusState;
export type StatusRow = import('./state.js').StatusRow;
/** @typedef {import('./state.js').StatusState} StatusState */
/** @typedef {import('./state.js').StatusRow} StatusRow */
/**
 * Set the text parts of a row.
 * @param {Element} item
 * @param {{ label?: string, detail?: string, fix?: string, since?: string }} change
 */
export declare function writeText(item: Element, { label, detail, fix, since }: {
    label?: string;
    detail?: string;
    fix?: string;
    since?: string;
}): void;
/** @param {Element} item */
export declare const labelOf: (item: Element) => string;
/**
 * Bring a row's mark, spoken state, Retry and `aria-busy` in step with its
 * `data-state`, and announce a change.
 *
 * @param {Element} item
 * @param {{ announce?: boolean }} [options]
 * @returns {StatusState}
 */
export declare function syncItem(item: Element, { announce }?: {
    announce?: boolean;
}): StatusState;
/**
 * The Retry button: made once, shown on a failed row only. If it had the
 * focus when it goes, the focus moves to the row's body.
 * @param {Element} item
 * @param {StatusState} state
 * @param {Element | null} list
 */
export declare function syncAction(item: Element, state: StatusState, list: Element | null): void;
/** Today as `YYYY-MM-DD` in Brussels (rule 52), or the day of the list's own clock (`data-kp-today-now`, a page with its own clock). @param {Element | null} list */
export declare function todayKey(list: Element | null): string;
/** The whole days between two `YYYY-MM-DD` days. @param {string} from @param {string} to */
export declare const daysBetween: (from: string, to: string) => number;
/** "Paused since 03/10/2026 (2 weeks)" (both, the default), the date or the length, from the row's `data-kp-since`. @param {Element} item @param {StatusState} state @param {Element | null} list */
export declare function syncSince(item: Element, state: StatusState, list: Element | null): void;
/**
 * Resume on a paused row, Pause on an open one (when the list asks), made once. A Resume that cannot be pressed now says
 * why in the row's `data-kp-resume-reason`.
 * @param {Element} item_ @param {StatusState} state @param {Element | null} list
 */
export declare function syncCalmActions(item_: Element, state: StatusState, list: Element | null): void;
