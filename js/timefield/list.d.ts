export type TimeField = import('./field.js').TimeField;
export type TimeEntry = import('./constants.js').TimeEntry;
/** @typedef {import('./field.js').TimeField} TimeField */
/** @typedef {import('./constants.js').TimeEntry} TimeEntry */
/** The popover of one field. */
export declare class TimeList {
    field: import("./field.js").TimeField;
    /** The popover element; set when the field is built. @type {HTMLElement} */
    popup: HTMLElement;
    open: boolean;
    /** The index of the active option, -1 for none. */
    active: number;
    /** Puts the list back below the overlays it was raised over. @type {(() => void) | null} */
    lower: (() => void) | null;
    /** @param {TimeField} field */
    constructor(field: TimeField);
    /** The loading bar, the failed plate with its Retry, or the preset chips. @param {import('./constants.js').TimePresets} presets */
    buildPresets(presets: import('./constants.js').TimePresets): HTMLElement;
    /** One option of the list. @param {TimeEntry} item @param {number} index */
    buildOption(item: TimeEntry, index: number): HTMLElement;
    /** The index of the time entry nearest the value, or -1 when the value is no time. @param {TimeEntry[]} items */
    nearestIndex(items: TimeEntry[]): number;
    /** Draw the list for the current value. */
    draw(): void;
    /** Mark the active option and, when asked or on the first time, scroll it to the middle. @param {boolean} [scroll] */
    markActive(scroll?: boolean): void;
    /** Place the list: a sheet at the foot of a narrow screen, else under (or over) the field. @param {HTMLElement} popup */
    place(popup: HTMLElement): void;
    show(): void;
    /** @param {{ focus?: boolean }} [options] */
    close({ focus }?: {
        focus?: boolean;
    }): void;
}
