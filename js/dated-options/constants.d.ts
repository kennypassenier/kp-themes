/** A dated option picker. */
export declare const DATED = "[data-kp-dated]";
/** Fired on the picker when an option is chosen by a person: `{ value, option }`. */
export declare const DATED_EVENT = "kp-dated-change";
/** Fired on the picker, bubbling, when Try again is pressed: `{ element }`. */
export declare const DATED_RETRY_EVENT = "kp-dated-retry";
/** The states a picker can be in. */
export declare const DATED_STATES: readonly ['ready', 'empty', 'loading', 'error'];
/** Up to this many options the picker draws radio rows; with more, a combobox. */
export declare const DEFAULT_INLINE_MAX = 7;
/** The rows a state keeps the height of: radio rows, and a combobox's. */
export declare const DEFAULT_ROWS = 4;
export declare const COMBOBOX_ROWS = 2;
/** Letters typed on the radio rows join into one prefix when they come within this long of each other [ms]. */
export declare const TYPEAHEAD_MS = 700;
/** Seconds in a minute and in a day, for the age words. */
export declare const MINUTE_S = 60;
export declare const DAY_S = 86400;
/** Milliseconds in a second. */
export declare const SECOND_MS = 1000;
export type DatedOption = {
    /**
     * what the page gets back
     */
    value: string;
    /**
     * the option's name; the date when absent
     */
    label?: string;
    /**
     * the moment it was made
     */
    when?: number | string | Date;
    /**
     * a short text, a size or a kind, in the column at the end; several texts (a size and a count of files) sit side by side in that column [wish-1120]
     */
    meta?: string | readonly string[];
    /**
     * why it cannot be chosen now; the option stays and says so
     */
    disabled?: string;
};
export type DatedState = 'ready' | 'empty' | 'loading' | 'error';
export type DatedStateOptions = {
    /**
     * an empty picker's sentence ("No snapshots yet")
     */
    reason?: string;
    /**
     * a button under an empty picker's sentence ("Take a snapshot")
     */
    action?: Node | null;
    /**
     * an error's first line
     */
    title?: string;
    /**
     * an error's sentence
     */
    text?: string;
};
export type DatedHandle = {
    element: HTMLElement;
    /**
     * the options; none is the empty state
     */
    set: (options: readonly DatedOption[], value?: string | null) => void;
    setState: (state: DatedState, options?: DatedStateOptions) => void;
    /**
     * the chosen value
     */
    value: () => string | null;
    /**
     * choose a value from a script (no event)
     */
    select: (value: string | null) => void;
    /**
     * the options, in the order shown
     */
    options: () => DatedOption[];
    state: () => DatedState;
};
/**
 * @typedef {object} DatedOption
 * @property {string} value what the page gets back
 * @property {string} [label] the option's name; the date when absent
 * @property {number | string | Date} [when] the moment it was made
 * @property {string | readonly string[]} [meta] a short text, a size or a kind, in the column at the end; several texts (a size and a count of files) sit side by side in that column [wish-1120]
 * @property {string} [disabled] why it cannot be chosen now; the option stays and says so
 * @typedef {'ready' | 'empty' | 'loading' | 'error'} DatedState
 * @typedef {object} DatedStateOptions
 * @property {string} [reason] an empty picker's sentence ("No snapshots yet")
 * @property {Node | null} [action] a button under an empty picker's sentence ("Take a snapshot")
 * @property {string} [title] an error's first line
 * @property {string} [text] an error's sentence
 */
/**
 * @typedef {object} DatedHandle
 * @property {HTMLElement} element
 * @property {(options: readonly DatedOption[], value?: string | null) => void} set the options; none is the empty state
 * @property {(state: DatedState, options?: DatedStateOptions) => void} setState
 * @property {() => string | null} value the chosen value
 * @property {(value: string | null) => void} select choose a value from a script (no event)
 * @property {() => DatedOption[]} options the options, in the order shown
 * @property {() => DatedState} state
 */
