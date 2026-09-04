export type ListboxOptions = {
    /**
     * the text input keeping DOM focus
     */
    input: HTMLElement;
    /**
     * the element with role="listbox"
     */
    list: HTMLElement;
    /**
     * Enter or click on an option
     */
    onChoose?: (index: number, option: HTMLElement) => void;
    /**
     * Escape, or focus leaving
     */
    onDismiss?: () => void;
    /**
     * whether Down on the last option returns to the first
     */
    loop?: boolean;
};
/** Options a caller may pass to `createListbox`. */
/**
 * @typedef {object} ListboxOptions
 * @property {HTMLElement} input the text input keeping DOM focus
 * @property {HTMLElement} list the element with role="listbox"
 * @property {(index: number, option: HTMLElement) => void} [onChoose] Enter or click on an option
 * @property {() => void} [onDismiss] Escape, or focus leaving
 * @property {boolean} [loop] whether Down on the last option returns to the first
 */
/** The attribute an option carries. A contract value: consumers write it [TH26]. */
export declare const OPTION_SELECTOR = "[data-kp-option]";
/**
 * Wire virtual focus between an input and a list of options.
 *
 * @param {ListboxOptions} options
 */
export declare function createListbox({ input, list, onChoose, onDismiss, loop }: ListboxOptions): {
    /** Re-read the options and put the highlight back at the top. */
    refresh(): void;
    /** @param {number} at */
    highlight(at: number): void;
    clear: () => void;
    /** @returns {number} the highlighted index, or -1 */
    readonly index: number;
    /** @returns {HTMLElement[]} */
    readonly options: HTMLElement[];
    destroy(): void;
};
/**
 * Does `text` match `query` as a subsequence, the way a command palette
 * matches? "thm" finds "Theme wisselen".
 *
 * Deliberately not a fuzzy-score library: this returns whether it matches
 * and the caller keeps its own order. A ranking function that nobody can
 * explain is how a palette starts putting the wrong thing first.
 *
 * @param {string} text
 * @param {string} query
 * @returns {boolean}
 */
export declare function subsequence(text: string, query: string): boolean;
