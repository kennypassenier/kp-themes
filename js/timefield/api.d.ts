/**
 * Set the value (no event unless `fire`), or clear it with an empty text.
 * @param {HTMLElement} root @param {string} value `HH:MM`, or '' @param {{ fire?: boolean }} [options]
 */
export declare function setTime(root: HTMLElement, value: string, { fire }?: {
    fire?: boolean;
}): void;
/** The value as it stands (`HH:MM`, or '' while empty or invalid). @param {HTMLElement} root */
export declare function timeValue(root: HTMLElement): string;
/** Whether the field is fine: valid, and not empty when required. @param {HTMLElement} root */
export declare function timeValid(root: HTMLElement): boolean;
/**
 * Give the list its presets, or say they are loading or could not be loaded.
 * @param {HTMLElement} root @param {import('./constants.js').TimePresets} presets
 */
export declare function setTimePresets(root: HTMLElement, presets: import('./constants.js').TimePresets): void;
/**
 * Wire every time field under `root`.
 * @param {ParentNode} [root]
 * @returns {() => void} detach
 */
export declare const attachTimes: (root?: ParentNode) => () => void;
