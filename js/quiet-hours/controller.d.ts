import { QuietCore } from './core.js';
export declare class QuietHours extends QuietCore {
    /** What the page gets back, the same object every time. @type {{ value: () => import('./values.js').QuietValue, set: (next: unknown) => void }} */
    handle: {
        value: () => import('./values.js').QuietValue;
        set: (next: unknown) => void;
    };
    /**
     * @param {HTMLElement} host
     * @param {Record<string, unknown>} [options]
     */
    constructor(host: HTMLElement, options?: Record<string, unknown>);
    connect(): void;
    /** The switch or a severity tick changed. */
    changed(): void;
    /** @param {Event} event */
    onTime(event: Event): void;
    /** @param {Event} event */
    onDays(event: Event): void;
}
