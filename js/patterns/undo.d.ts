import { Controller } from '../controller.js';
export type ActionDetail = import('./types.js').ActionDetail;
/** @typedef {import('./types.js').ActionDetail} ActionDetail */
/** One undo button: how long its window is, and every action still inside its window, so detach can settle it. */
export declare class UndoControl extends Controller {
    ms: number;
    undoClassName: string;
    /** The cancels of the actions still inside their window. @type {Set<() => void>} */
    inFlight: Set<() => void>;
    /** @param {HTMLElement} host @param {{ undoMs?: number, undoClassName?: string }} [options] */
    constructor(host: HTMLElement, options?: {
        undoMs?: number;
        undoClassName?: string;
    });
    connect(): void;
    /** What goes: the element the consumer named by selector, the nearest marked ancestor, the row, or the parent. */
    targetOf(): Element | null;
    /**
     * Optimistic: the row goes now. Waiting for the server first is what makes an interface feel slow, and the undo is what makes
     * going first safe.
     */
    act(): void;
    /** The toast with the Undo action, its buttons in the page's look. @param {() => void} undo */
    offer(undo: () => void): HTMLElement & {
        dismiss: () => void;
    };
}
