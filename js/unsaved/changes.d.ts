export type UnsavedChange = import('./config.js').UnsavedChange;
/** @typedef {import('./config.js').UnsavedChange} UnsavedChange */
/** Follows the controls of one bar's scope against the values they had when the bar looked. */
export declare class ChangeTracker {
    el: HTMLElement;
    scope: HTMLElement;
    s: import("../strings/types.js").Strings;
    words: import("./config.js").UnsavedShow | undefined;
    /** What each tracked control held when the bar looked (the markup's value). @type {Map<HTMLElement, string>} */
    baseline: Map<HTMLElement, string>;
    /**
     * @param {HTMLElement} el the bar
     * @param {HTMLElement} scope the form or area to watch
     * @param {import('../strings.js').Strings} s
     * @param {import('./config.js').UnsavedShow} [words] the page's own words for a value, if it gave any
     */
    constructor(el: HTMLElement, scope: HTMLElement, s: import('../strings.js').Strings, words?: import('./config.js').UnsavedShow);
    /**
     * Whether a control counts: not the bar's own, not `data-kp-untracked`, and not an input inside a composite field (the
     * field itself counts instead, unless it opted out).
     * @param {Element} c
     */
    counts(c: Element): boolean;
    /**
     * The control an event stands for, if it counts: the composite field it came from, else the control itself, else (a plain
     * combobox's choice, fired on its wrapper) the control inside the element it came from.
     * @param {EventTarget | null} target
     * @returns {HTMLInputElement | null}
     */
    controlFor(target: EventTarget | null): HTMLInputElement | null;
    /** The controls in the scope that count, in document order. */
    tracked(): HTMLInputElement[];
    /** Take the markup's values as the baseline. */
    capture(): void;
    /** Take the values the controls hold now as the baseline (after a save). */
    adoptCurrent(): void;
    /** @param {Element} control @returns {HTMLElement} the row that stands for it */
    rowOf(control: Element): HTMLElement;
    /** The controls of a row. @param {HTMLElement} row */
    controlsOf(row: HTMLElement): HTMLInputElement[];
    /** The name a row goes by in the list: its `data-kp-name`, its label, else what its control is called. @param {HTMLElement} row */
    labelOf(row: HTMLElement): string;
    /** What a value reads as in the list. @param {HTMLElement} control @param {string} value */
    show(control: HTMLElement, value: string): string;
    /** Mark and unmark the row of one control, as it is edited. @param {HTMLInputElement} control */
    track(control: HTMLInputElement): void;
    /** The changes now, one per marked row. @returns {UnsavedChange[]} */
    changes(): UnsavedChange[];
    /** Stop counting a row: its marks go. @param {HTMLElement} row */
    clearRow(row: HTMLElement): void;
}
