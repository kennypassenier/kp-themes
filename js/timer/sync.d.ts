export type Timer = import('./types.js').Timer;
/** Show or hide the state plate (empty or failed), start or stop the ticker. @param {HTMLElement} list */
export declare function sync(list: HTMLElement): void;
/**
 * The list's state: `loading` lays the busy card over the box the timers fill (and keeps it at its height), `error` says
 * `message` on the failed plate with a Retry where the timers were (they keep running underneath), `ready` is neither
 * [r6r8-1019; audhd-recepten gap 30].
 * @param {Element} list @param {'loading' | 'error' | 'ready'} state @param {string} [message]
 */
export declare function setTimersState(list: Element, state: 'loading' | 'error' | 'ready', message?: string): void;
/** @param {HTMLElement} list */
export declare function tick(list: HTMLElement): void;
/**
 * A timer has ended: the done plate, the chime, a buzz, a notification, the
 * alert and the event.
 * @param {HTMLElement} list @param {Timer} timer @param {{ quiet?: boolean }} [options]
 */
export declare function finish(list: HTMLElement, timer: Timer, { quiet }?: {
    quiet?: boolean;
}): void;
