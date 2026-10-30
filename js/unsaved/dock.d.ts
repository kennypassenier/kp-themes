/** Docks one bar and folds Discard behind More when there is little room. */
export declare class BarDock {
    ctl: import("./controller.js").UnsavedController;
    /** Whether the bar's place in the header has scrolled out of view. */
    headerOut: boolean;
    /** @param {import('./controller.js').UnsavedController} ctl */
    constructor(ctl: import('./controller.js').UnsavedController);
    /** Watch the header's visibility and the room the bar has; the observers go with the controller. */
    connect(): void;
    /** The box whose width is the room the bar has when it is not docked. */
    roomBox(): Element;
    /** Dock the bar when it has changes and should be on screen; undock it otherwise. */
    dock(): void;
    /** Where there is less than 30rem for it (the header's width, or the docked bar's), Discard goes behind More. */
    compact(): void;
}
