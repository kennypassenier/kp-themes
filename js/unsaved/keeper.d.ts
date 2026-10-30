/** Keeps and restores one bar's changes. */
export declare class ChangeKeeper {
    ctl: import("./controller.js").UnsavedController;
    /** Whether this bar keeps anything at all (`data-kp-keep="off"` or no Storage turns it off). */
    keepOn: boolean;
    /** @param {import('./controller.js').UnsavedController} ctl */
    constructor(ctl: import('./controller.js').UnsavedController);
    /** Decide whether the bar keeps its changes; the Storage can be asked only once the bar exists. */
    connect(): void;
    /** The Storage the changes are kept in, or null: the call's option, else the page's, else session (or local) storage [wish-1028]. */
    store(): Storage | null;
    /** The key a control is kept under, or '' when it has none. @param {HTMLElement} c */
    keyOf(c: HTMLElement): string;
    /** Write the changed values (all of them, or none when nothing is changed). */
    keep(): void;
    /** Put the kept values back and say so. */
    restore(): void;
}
