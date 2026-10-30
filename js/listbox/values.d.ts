/** The attribute an option carries. A contract value: consumers write it [TH26]. */
export declare const OPTION_SELECTOR = "[data-kp-option]";
/** Dispatched on the list, bubbling, when the highlight moves: `{ index, option }`. */
export declare const HIGHLIGHT_EVENT = "kp-listbox-highlight";
/** Dispatched on the list, bubbling, when an option is chosen: `{ index, option }`. */
export declare const CHOOSE_EVENT = "kp-listbox-choose";
/** The id prefix when the list has no id of its own. */
export declare const FALLBACK_PREFIX = "kp-listbox";
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
    onHighlight?: (index: number, option: HTMLElement | null) => void;
    /**
     * whether Down on the last option returns to the first. Default true.
     */
    loop?: boolean;
    /**
     * Default OPTION_SELECTOR.
     */
    optionSelector?: string;
    /**
     * Default `[data-kp-disabled], [aria-disabled="true"]`.
     */
    disabledSelector?: string;
    /**
     * the mouse moves the highlight. Default true.
     */
    hoverHighlights?: boolean;
    /**
     * Default `{ block: 'nearest' }`; false for none.
     */
    scrollIntoView?: boolean | ScrollIntoViewOptions;
    /**
     * Default `is-active`.
     */
    activeClass?: string;
    /**
     * For generated option ids. Default: the list's id, else `kp-listbox`.
     */
    idPrefix?: string;
    /**
     * letters jump to the next option starting with them. Default false.
     */
    typeahead?: boolean;
    /**
     * Default 500.
     */
    typeaheadMs?: number;
    /**
     * Default true.
     */
    dismissOnEscape?: boolean;
    /**
     * dispatch HIGHLIGHT_EVENT and CHOOSE_EVENT on the list. Default true.
     */
    events?: boolean;
};
/**
 * @typedef {object} ListboxOptions
 * @property {HTMLElement} input the text input keeping DOM focus
 * @property {HTMLElement} list the element with role="listbox"
 * @property {(index: number, option: HTMLElement) => void} [onChoose] Enter or click on an option
 * @property {() => void} [onDismiss] Escape, or focus leaving
 * @property {(index: number, option: HTMLElement | null) => void} [onHighlight]
 * @property {boolean} [loop] whether Down on the last option returns to the first. Default true.
 * @property {string} [optionSelector] Default OPTION_SELECTOR.
 * @property {string} [disabledSelector] Default `[data-kp-disabled], [aria-disabled="true"]`.
 * @property {boolean} [hoverHighlights] the mouse moves the highlight. Default true.
 * @property {boolean | ScrollIntoViewOptions} [scrollIntoView] Default `{ block: 'nearest' }`; false for none.
 * @property {string} [activeClass] Default `is-active`.
 * @property {string} [idPrefix] For generated option ids. Default: the list's id, else `kp-listbox`.
 * @property {boolean} [typeahead] letters jump to the next option starting with them. Default false.
 * @property {number} [typeaheadMs] Default 500.
 * @property {boolean} [dismissOnEscape] Default true.
 * @property {boolean} [events] dispatch HIGHLIGHT_EVENT and CHOOSE_EVENT on the list. Default true.
 */
/**
 * The options with every default filled in.
 * @param {ListboxOptions} given
 */
export declare function resolveListbox(given: ListboxOptions): {
    input: HTMLElement;
    list: HTMLElement;
    onChoose?: (index: number, option: HTMLElement) => void;
    onDismiss?: () => void;
    onHighlight?: (index: number, option: HTMLElement | null) => void;
    idPrefix?: string;
    loop: boolean;
    optionSelector: string;
    disabledSelector: string;
    hoverHighlights: boolean;
    scrollIntoView: boolean | ScrollIntoViewOptions;
    activeClass: string;
    typeahead: boolean;
    typeaheadMs: number;
    dismissOnEscape: boolean;
    events: boolean;
};
