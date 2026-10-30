/**
 * @template {keyof HTMLElementTagNameMap} K
 * @param {K} tag @param {string} [className] @param {string} [text]
 * @returns {HTMLElementTagNameMap[K]}
 */
export declare const make: <K extends keyof HTMLElementTagNameMap>(tag: K, className?: string, text?: string) => HTMLElementTagNameMap[K];
/** One `data-kp-quote-<name>` attribute of a card, or undefined. @param {HTMLElement} el @param {string} name @returns {string | undefined} */
export declare const attr: (el: HTMLElement, name: string) => string | undefined;
/**
 * The text of a quote written in markup: its `data-kp-quote-text`, else its blockquote, else its own words.
 * @param {HTMLElement} el
 */
export declare function textOf(el: HTMLElement): string;
