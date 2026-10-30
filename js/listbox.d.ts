export { scrollWithin } from './listbox/scroll.js';
export { OPTION_SELECTOR, HIGHLIGHT_EVENT, CHOOSE_EVENT } from './listbox/values.js';
export { subsequence } from './listbox/match.js';
export type ListboxOptions = import('./listbox/values.js').ListboxOptions;
/** @typedef {import('./listbox/values.js').ListboxOptions} ListboxOptions */
/**
 * Wire virtual focus between an input and a list of options.
 *
 * @param {ListboxOptions} options
 */
export declare function createListbox(options: ListboxOptions): {
    /** Re-read the options and put the highlight back at the top. */
    refresh(): void;
    /** @param {number} at */
    highlight(at: number): void;
    clear: () => void;
    /** Choose the highlighted option, as Enter would. */
    choose: () => boolean;
    /** @returns {number} the highlighted index, or -1 */
    readonly index: number;
    /** @returns {HTMLElement[]} */
    readonly options: HTMLElement[];
    destroy(): void;
};
