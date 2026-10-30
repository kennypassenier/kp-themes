/** Opens and closes one bar's list panel. */
export declare class ChangesPanel {
    ctl: import("./controller.js").UnsavedController;
    /** Puts the panel back below the overlays it was raised over; null while the panel is shut. @type {(() => void) | null} */
    lower: (() => void) | null;
    /** @param {import('./controller.js').UnsavedController} ctl */
    constructor(ctl: import('./controller.js').UnsavedController);
    /** Put the panel under the chip, inside the window. @param {HTMLElement} p */
    place(p: HTMLElement): void;
    open(): void;
    /** @param {boolean} [refocus] whether focus goes back to the chip */
    close(refocus?: boolean): Promise<void>;
}
