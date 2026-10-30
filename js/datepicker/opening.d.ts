/** The panel's open state for one picker. */
export declare class PanelOpening {
    ctl: import("./controller.js").DatePickerController;
    /** Takes the open panel out of the top layer again. */
    lower: () => void;
    /** Whether the picker is meant to be open: the panel may still be closing on screen. */
    wanted: boolean;
    /** The close that is playing, so the focus can wait for it. @type {Promise<unknown>} */
    closing: Promise<unknown>;
    /** @param {import('./controller.js').DatePickerController} ctl */
    constructor(ctl: import('./controller.js').DatePickerController);
    /**
     * The focus goes back to `el` when the panel is gone, the way it left when the panel came: a ring
     * that comes back at once at the start of the close is not the opening played backwards
     * (docs/THEME_LESSONS.md 11; the tour does the same).
     * @param {HTMLElement} el
     */
    refocusAfterClose(el: HTMLElement): void;
    /** @param {boolean} next */
    setOpen(next: boolean): void;
    /** Draw the days and bring the panel up, unless it is still closing, when it turns round where it stands. */
    show(): void;
    /**
     * It closes as it opened, backwards, before it is hidden; meanwhile it takes no pointer or focus. The close reads the opening on the
     * panel as it stands (`[data-kp-date-open]` still on it), so it plays that backwards instead of taking the opening's name as a close of
     * its own and playing it forwards; the mark goes straight after.
     */
    hidePanel(): void;
}
