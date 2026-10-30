/**
 * A period's tone in the strip's vocabulary: with `data-kp-tones="calm"` (js/calm-tones.js) `up` and `degraded` are logged,
 * `down` is quiet (the tooltip says "nothing logged", never "down") and `none` stays none [kpadopt6]. Pure.
 * @param {Element} el @param {string} state
 */
export declare const toneFor: (el: Element, state: string) => string;
/** The words of a tone. @param {Element} el @param {string} tone */
export declare const wordFor: (el: Element, tone: string) => string;
/** @param {HTMLElement} el @returns {number} */
export declare const countOf: (el: HTMLElement) => number;
/** @param {HTMLElement} el @param {string} tag @param {string} [className] */
export declare const make: (el: HTMLElement, tag: string, className?: string) => HTMLElement;
