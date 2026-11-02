export type WheelItem = import('../wheel.js').WheelItem;
export type WheelState = import('./state.js').WheelState;
/**
 * Let the drawn weights glide to the items' weights in the theme's size time.
 * @param {HTMLElement} root
 */
export declare function glideTo(root: HTMLElement): Promise<void>;
/**
 * Give the wheel its choices. A new set clears the outcome (a filter is a new
 * question); one choice is the outcome at once.
 * @param {Element} root @param {WheelItem[]} items
 */
export declare function setWheelItems(root: Element, items: WheelItem[]): void;
/**
 * The wheel's state: `loading` lays the busy card over it, `error` says the
 * message where the outcome goes, `ready` is neither.
 * @param {Element} root @param {'loading' | 'error' | 'ready'} kind @param {string} [message]
 */
export declare function setWheelState(root: Element, kind: 'loading' | 'error' | 'ready', message?: string): void;
/** The outcome the wheel stands on, or null. @param {Element} root @returns {WheelItem | null} */
export declare function getWheelResult(root: Element): WheelItem | null;
/**
 * Spin: draw the outcome by the weights, turn the wheel to it, say it.
 * Resolves with the outcome (null when it could not spin). `duration` (ms) fixes how long it turns, instead of the time its
 * travel takes: a wheel that follows another settles with it (`data-kp-wheel-follows`, js/wheel/follow.js).
 * @param {Element} root
 * @param {{ random?: () => number, duration?: number }} [options]
 * @returns {Promise<WheelItem | null>}
 */
export declare function spinWheel(root: Element, { random, duration }?: {
    random?: () => number;
    duration?: number;
}): Promise<WheelItem | null>;
