import { UndoCore } from './core.js';
export declare class UndoRun extends UndoCore {
    /** What undoToast() hands back. @type {import('../undo-toast.js').UndoToast} */
    handle: import('../undo-toast.js').UndoToast;
    /**
     * @param {HTMLElement} host the toast
     * @param {import('./core.js').UndoRunOptions} run
     */
    constructor(host: HTMLElement, run: import('./core.js').UndoRunOptions);
    connect(): void;
    /** The Undo button says which key undoes. @param {string | false} key */
    markButton(key: string | false): void;
    /** The clock stops while the pointer or the focus is on the toast. */
    listenAttention(): void;
    /** Esc or a close before the end accepts the action now. */
    takeOverDismiss(): void;
    /** What a pending action does when the page is left, by the `leave` setting. */
    listenLeaving(): void;
    onPageHide(): void;
    onSoftLeave(): void;
    /** Undo now: the toast says "Restored", the page's reverse runs, and the toast goes after a moment. */
    undo(): void;
    /** The action is done for good: the toast says so and goes. @param {import('./core.js').UndoOutcome} how */
    settle(how: import('./core.js').UndoOutcome): void;
    /** The commit failed: the toast turns into the problem and the row comes back. @param {unknown} error @param {HTMLElement} wheel */
    failed(error: unknown, wheel: HTMLElement): void;
    /** A wheel in the clock's place while the commit runs. @returns {HTMLElement} */
    spinner(): HTMLElement;
    /** Commit now. */
    accept(): Promise<void>;
}
