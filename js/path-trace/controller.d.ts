import { TraceDraw } from './draw.js';
export declare class Trace extends TraceDraw {
    /** What the page gets back, the same object every time. @type {import('../path-trace.js').TraceHandle} */
    handle: import('../path-trace.js').TraceHandle;
    /**
     * @param {HTMLElement} host
     * @param {Record<string, unknown>} [options]
     */
    constructor(host: HTMLElement, options?: Record<string, unknown>);
    connect(): void;
    /** The S key asks for a swap, for a form that swaps source and target. */
    registerSwapKey(): () => void;
}
