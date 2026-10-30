/** Guards one bar's page against being left by accident. */
export declare class LeaveGuard {
    ctl: import("./controller.js").UnsavedController;
    /** Whether the visitor confirmed leaving; the browser's prompt then stays quiet. */
    leaving: boolean;
    /** @param {import('./controller.js').UnsavedController} ctl */
    constructor(ctl: import('./controller.js').UnsavedController);
    connect(): void;
    /** @param {BeforeUnloadEvent} event */
    onBeforeUnload(event: BeforeUnloadEvent): void;
    /** Whether a click is a plain primary click that may follow a link. @param {MouseEvent} event */
    static isPlainClick(event: MouseEvent): boolean;
    /** @param {MouseEvent} event */
    onLink(event: MouseEvent): void;
}
