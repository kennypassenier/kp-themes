import { Controller } from '../controller.js';
export declare class ActionColumns extends Controller {
    /** The root as the parent node it is. */
    root: ParentNode;
    doc: Document;
    view: (Window & typeof globalThis) | null;
    /** The animation frame a fit waits for, or 0. */
    queued: number;
    /**
     * @param {HTMLElement} host the root: an element, or the document
     * @param {Record<string, unknown>} [options]
     */
    constructor(host: HTMLElement, options?: Record<string, unknown>);
    connect(): void;
    fitAll(): void;
    /** Fit once on the next frame, however many changes come before it. */
    queue(): void;
    /** @param {MutationRecord[]} records */
    onRows(records: MutationRecord[]): void;
}
