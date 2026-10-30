import { measureDateView } from './place.js';
/** The shown grid of one picker and the way back out of it [scope-89]. */
export declare class DateViews {
    ctl: import("./controller.js").DatePickerController;
    /** Which grid the panel shows. @type {import('./constants.js').DateView} */
    view: import('./constants.js').DateView;
    /** Where Escape steps back to: the cursor as it was when each view opened. @type {Date[]} */
    back: Date[];
    /** The day view's size, held while the month or year grid shows. @type {ReturnType<typeof measureDateView> | null} */
    pin: ReturnType<typeof measureDateView> | null;
    /** The month the day grid last drew, so the month event fires on a change only. */
    shown: string;
    /** @param {import('./controller.js').DatePickerController} ctl */
    constructor(ctl: import('./controller.js').DatePickerController);
    /** Every opening starts on the days. */
    reset(): void;
    /** Draw, and say so when the day grid now shows another month. */
    redraw(): void;
    focusCurrent(): void;
    /** Redraw after the view changed, say which grid shows, and put the focus in it. */
    settle(): void;
    /** Open the month or year grid over the current one. @param {import('./constants.js').DateView} next */
    go(next: import('./constants.js').DateView): void;
    /** Escape in the month or year grid: the grid below, where it was. */
    stepBack(): void;
    /** A month or year cell chosen: the grid below, on that month or year. @param {HTMLElement} cell */
    pick(cell: HTMLElement): void;
}
