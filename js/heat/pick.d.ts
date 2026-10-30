/**
 * Pick a column (or none, with `null`) without an event: the cells and the
 * axis name of that column are marked `data-kp-picked`.
 * @param {HTMLElement} el
 * @param {string | null} key
 */
export declare function setHeatPick(el: HTMLElement, key: string | null): void;
/**
 * Press the labels of these rows (and unpress the rest) without an event.
 * @param {HTMLElement} el
 * @param {readonly string[]} keys
 */
export declare function setHeatRows(el: HTMLElement, keys: readonly string[]): void;
