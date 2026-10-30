/**
 * The list's status region, made on first need (right after the list).
 * @param {Element} list
 * @returns {HTMLElement}
 */
export declare function regionOf(list: Element): HTMLElement;
/**
 * Say something through the list's region; a burst in one tick is one message.
 * @param {Element} list
 * @param {string} message
 */
export declare function say(list: Element, message: string): void;
