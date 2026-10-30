/** The bars this module looks after. */
export declare const SELECTION = "[data-kp-selection]";
/** The boxes it reads. */
export declare const BOX = "[data-kp-select-row]";
/** Fired on the bar when what is selected changed: `{ keys, items, count, matching }`. */
export declare const SELECTION_EVENT = "kp-selection-change";
/** Fired on the bar when the reader unticked all with its button or Esc: `{ keys }` (the ones that were selected). */
export declare const SELECTION_CLEAR_EVENT = "kp-selection-clear";
/** Fired on the bar when the offer for all matching rows is taken or given back: `{ matching, total }`. */
export declare const SELECTION_MATCHING_EVENT = "kp-selection-matching";
/** Fired on the bar, cancelable, when a button marked `data-kp-selection-action` is pressed: `{ action, button, keys, items, matching, undoMs }`. */
export declare const SELECTION_ACTION_EVENT = "kp-selection-action";
/** The names shown before "+N more". */
export declare const SELECTION_NAMES = 6;
/** How long the bar waits for a burst of ticks before it says the count [ms]. */
export declare const SELECTION_SAY_MS = 350;
export type SelectionItem = import('../selection-bar.js').SelectionItem;
export type Memory = {
    sources: HTMLElement[];
    items: SelectionItem[];
    /**
     * every key the sources had at the last read
     */
    known: Set<string>;
    /**
     * fed by setSelection()
     */
    manual: boolean;
    matchingTotal: number;
    matching: boolean;
    namesOpen: boolean;
    busy: string;
    /**
     * how far a running action is, "3 of 7 done" [wish-1120]
     */
    progress: {
        done: number;
        total: number;
    } | null;
    rules: Record<string, (items: SelectionItem[]) => string | null>;
    sayTimer: number;
    refresh: () => void;
};
/** @typedef {import('../selection-bar.js').SelectionItem} SelectionItem */
/**
 * @typedef {object} Memory
 * @property {HTMLElement[]} sources
 * @property {SelectionItem[]} items
 * @property {Set<string>} known every key the sources had at the last read
 * @property {boolean} manual fed by setSelection()
 * @property {number} matchingTotal
 * @property {boolean} matching
 * @property {boolean} namesOpen
 * @property {string} busy
 * @property {{ done: number, total: number } | null} progress how far a running action is, "3 of 7 done" [wish-1120]
 * @property {Record<string, (items: SelectionItem[]) => string | null>} rules
 * @property {number} sayTimer
 * @property {() => void} refresh
 */
/** @param {Document} doc @param {string} className @param {string} [tag] */
export declare const make: (doc: Document, className: string, tag?: string) => HTMLElement;
/** @param {HTMLElement} row */
export declare const labelOf: (row: HTMLElement) => string;
/** @param {Element} box @returns {HTMLElement | null} */
export declare const rowOf: (box: Element) => HTMLElement | null;
/** @param {HTMLElement} row @param {number} index */
export declare const keyOf: (row: HTMLElement, index: number) => string;
/**
 * The elements a bar serves.
 * @param {HTMLElement} bar
 * @returns {HTMLElement[]}
 */
export declare function sourcesOf(bar: HTMLElement): HTMLElement[];
/** Whether `row` is on the page and not folded away by a filter. @param {HTMLElement} row */
export declare const shownRow: (row: HTMLElement) => boolean;
/**
 * Read what is ticked in the sources.
 * @param {Memory} memory
 */
export declare function readSources(memory: Memory): {
    items: import("../selection-bar.js").SelectionItem[];
    known: Set<any>;
    shown: number;
    shownTicked: number;
};
