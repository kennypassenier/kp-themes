export type UnsavedChange = import('./config.js').UnsavedChange;
/** @typedef {import('./config.js').UnsavedChange} UnsavedChange */
/** Follows the controls of one bar's scope against the values they had when the bar looked. */
export declare class ChangeTracker {
    el: HTMLElement;
    scope: HTMLElement;
    s: import("../strings/types.js").Strings;
    /** What each tracked control held when the bar looked (the markup's value). @type {Map<HTMLElement, string>} */
    baseline: Map<HTMLElement, string>;
    /**
     * @param {HTMLElement} el the bar
     * @param {HTMLElement} scope the form or area to watch
     * @param {import('../strings.js').Strings} s
     */
    constructor(el: HTMLElement, scope: HTMLElement, s: import('../strings.js').Strings);
    /** The controls in the scope that count, the bar's own and the `data-kp-untracked` ones left out. */
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
