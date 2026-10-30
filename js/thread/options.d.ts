export type ThreadMessage = import('../thread.js').ThreadMessage;
export type ThreadSpec = import('../thread.js').ThreadSpec;
/** @typedef {import('../thread.js').ThreadMessage} ThreadMessage */
/** @typedef {import('../thread.js').ThreadSpec} ThreadSpec */
/** A thread the page fills with setThread(). */
export declare const THREAD = "[data-kp-thread]";
/** Fired on the root when Retry (a failed list, or a message that was not sent) is pressed: `{ key? }`. */
export declare const THREAD_RETRY_EVENT = "kp-thread-retry";
/** Fired on the root when the Add button of an empty thread is pressed. */
export declare const THREAD_ADD_EVENT = "kp-thread-add";
/** Fired on the root when a message's own action is pressed: `{ key, id }`. */
export declare const THREAD_ACTION_EVENT = "kp-thread-action";
/** Fired on the root when a message is folded or shown whole: `{ key, expanded }`. */
export declare const THREAD_FOLD_EVENT = "kp-thread-fold";
/** The zone every time is written in. */
export declare const THREAD_TIME_ZONE = "Europe/Brussels";
/** @param {Document} doc @param {string} className @param {string} [tag] */
export declare const make: (doc: Document, className: string, tag?: string) => HTMLElement;
/**
 * The options as the page wrote them: the spec first, then the attribute, then the default.
 * @param {HTMLElement} el @param {ThreadSpec} spec
 */
export declare function threadOptions(el: HTMLElement, spec: ThreadSpec): {
    bubble: 'tinted' | 'plain' | 'filled';
    order: 'oldest' | 'newest';
    fold: number | "full" | "newest";
    foldLines: number;
    group: number;
    days: boolean;
    avatar: 'in' | 'both' | 'none';
};
/** The Brussels calendar day of a moment, as a sortable key. @param {number} ms */
export declare const dayKey: (ms: number) => string;
/**
 * "Monday 13/10/2026".
 * @param {number} ms @param {string} locale
 */
export declare function dayLabel(ms: number, locale: string): string;
/**
 * Split messages (oldest first) into runs that share one header: the same
 * side and sender, the same day, each within `minutes` of the one before.
 * System lines stand alone.
 * @param {readonly ThreadMessage[]} messages @param {number} minutes
 * @returns {ThreadMessage[][]}
 */
export declare function groupMessages(messages: readonly ThreadMessage[], minutes: number): ThreadMessage[][];
/** The options an attribute of the root changes at runtime, with the spec key each one stands for. */
export declare const OPTION_ATTRIBUTES: {
    readonly 'data-kp-thread-order': 'order';
    readonly 'data-kp-thread-fold': 'fold';
    readonly 'data-kp-thread-fold-lines': 'foldLines';
    readonly 'data-kp-thread-group': 'group';
    readonly 'data-kp-thread-days': 'days';
    readonly 'data-kp-thread-avatar': 'avatar';
    readonly 'data-kp-thread-bubble': 'bubble';
};
/** Whether the scroll box is at the newest end. @param {HTMLElement} box @param {'oldest' | 'newest'} order */
export declare const atNewest: (box: HTMLElement, order: 'oldest' | 'newest') => boolean;
