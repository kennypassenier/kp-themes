export type Timer = import('./types.js').Timer;
export type TimerState = import('./types.js').TimerState;
/** @typedef {import('./types.js').Timer} Timer */
/** @typedef {import('./types.js').TimerState} TimerState */
/**
 * Ask the browser for permission to show a system notification when a timer
 * ends. Call it from a press. Resolves with the answer.
 * @returns {Promise<NotificationPermission | 'unsupported'>}
 */
export declare function askTimerNotifications(): Promise<NotificationPermission | 'unsupported'>;
/** @param {Element} list @param {string} id */
export declare const find: (list: Element, id: string) => import("./types.js").Timer | null;
/**
 * Start a timer. With an `id` that already runs, nothing new starts and that
 * id is returned.
 * @param {Element} list
 * @param {{ name: string, seconds: number, id?: string, say?: string }} options  `say`: what is spoken when it ends
 * @returns {string | null} the timer's id
 */
export declare function startTimer(list: Element, { name, seconds, id, say: message }: {
    name: string;
    seconds: number;
    id?: string;
    say?: string;
}): string | null;
/** @param {Element} list @param {string} id */
export declare function pauseTimer(list: Element, id: string): void;
/** @param {Element} list @param {string} id */
export declare function resumeTimer(list: Element, id: string): void;
/**
 * Add time to a timer; a done one starts again for that long.
 * @param {Element} list @param {string} id @param {number} [seconds]
 */
export declare function addTimerTime(list: Element, id: string, seconds?: number): void;
/** Stop a done timer's chime and let it rest on its done plate. @param {Element} list @param {string} id */
export declare function stopTimerRing(list: Element, id: string): void;
/**
 * Remove a timer (Stop): its card leaves the theme's way.
 * @param {Element} list @param {string} id
 */
export declare function stopTimer(list: Element, id: string): void;
/**
 * Put saved timers back (after a reload): a running one counts on from its
 * end time, one whose end has passed is shown done (and rings only when it
 * ended within the last minute).
 * @param {Element} list @param {TimerState[]} saved
 */
export declare function restoreTimers(list: Element, saved: TimerState[]): void;
/** The list a starter speaks to. @param {Element} starter */
export declare const targetOf: (starter: Element) => HTMLElement | null;
