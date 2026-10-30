export type NewPillOptions = import('../newpill.js').NewPillOptions;
/** @typedef {import('../newpill.js').NewPillOptions} NewPillOptions */
/**
 * The options read once when the pill attaches.
 * @param {HTMLElement} el
 * @param {NewPillOptions} options
 */
export declare function readNewPillOptions(el: HTMLElement, options: NewPillOptions): {
    strings: import("../strings/types.js").Strings;
    head: boolean;
    threshold: number;
    unitOne: string;
    unitMany: string;
    keyName: string;
    space: boolean;
    inTbody: boolean;
};
/**
 * Which end the pill sits at; read again when `data-kp-pill-placement` changes [live-options-1019].
 * @param {HTMLElement} el @param {NewPillOptions} options @param {boolean} head
 */
export declare function placementOf(el: HTMLElement, options: NewPillOptions, head: boolean): "bottom" | "top";
/** Whether the "New since" divider is on; read each time, so it can be switched at runtime. @param {HTMLElement} el @param {NewPillOptions} options */
export declare function sinceLeftOf(el: HTMLElement, options: NewPillOptions): boolean;
