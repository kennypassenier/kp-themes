export type MenuState = import('../menu-button/types.js').MenuState;
/**
 * Whether a press on `row` opens its days, by the grid's option and the pointer that pressed.
 * @param {HTMLElement} el @param {HTMLElement} row @param {string} pointer `touch`, `mouse`, `pen`, or '' for the keys
 */
export declare function opensDays(el: HTMLElement, row: HTMLElement, pointer: string): boolean;
/** One grid's list of a row's days: at most one open at a time. */
export declare class HeatDays {
    el: HTMLElement;
    /** @type {{ panel: HTMLElement, row: HTMLElement, cell: HTMLElement, place: MenuState, off: (() => void)[] } | null} */
    now: {
        panel: HTMLElement;
        row: HTMLElement;
        cell: HTMLElement;
        place: MenuState;
        off: (() => void)[];
    } | null;
    /** @param {HTMLElement} el the grid */
    constructor(el: HTMLElement);
    /**
     * Open the days of `row` under it, the day of `cell` focused (else the picked one, else the newest).
     * @param {HTMLElement} row @param {HTMLElement | null} cell
     */
    open(row: HTMLElement, cell: HTMLElement | null): void;
    /** Hang the panel under its row: its laid-out top moved to the row's bottom plus the gap, then placed whole on the screen. @param {Window} view */
    hang(view: Window): void;
    /** Escape, the keys along the days, a press outside, the focus leaving, a resize and a redraw. @param {Window} view */
    listen(view: Window): void;
    /** Arrows, Home and End move along the days; Escape closes with the focus back on the cell. @param {KeyboardEvent} event */
    onKey(event: KeyboardEvent): void;
    /** A day chosen: its cell pressed, the list closed, the focus on that cell. @param {MouseEvent} event */
    onChoose(event: MouseEvent): void;
    /** Close it, backwards; with `focus` the focus goes back to its cell. @param {boolean} focus */
    close(focus: boolean): void;
}
