/** @param {string} className @param {string} [tag] */
export declare const el: (className: string, tag?: string) => HTMLElement;
/**
 * Build the parts into the root: nothing is wired here.
 * @param {HTMLElement} root
 */
export declare function buildParts(root: HTMLElement): {
    input: HTMLInputElement;
    hidden: HTMLInputElement;
    popup: HTMLElement;
    presets: import("./constants.js").TimePreset[];
};
