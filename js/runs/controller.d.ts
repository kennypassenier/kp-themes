import { RunsNote } from './note.js';
export declare class RunsList extends RunsNote {
    /** What the page gets back, the same object every time. @type {import('../runs.js').RunsHandle} */
    handle: import('../runs.js').RunsHandle;
    /**
     * @param {HTMLElement} host
     * @param {{ now?: () => number }} [options]
     */
    constructor(host: HTMLElement, options?: {
        now?: () => number;
    });
    connect(): void;
    /** The relative words are refreshed every minute unless the clock is fixed. */
    listenForRefresh(): void;
    /** The first state: a page that writes `data-kp-state` and `data-kp-runs-values` (ISO, comma separated) gets it at once. */
    start(): void;
    sync(): void;
    /** @param {MouseEvent} event */
    onClick(event: MouseEvent): void;
    onMore(): void;
}
