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
    /** The swap key (S by default; an option) asks for a swap, for a form that swaps source and target. */
    registerSwapKey(): () => void;
}
