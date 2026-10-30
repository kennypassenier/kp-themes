import { QuietCore } from './core.js';
export declare class QuietHours extends QuietCore {
    /** What the page gets back, the same object every time. */
    handle: {
        value: () => {
            days: number[];
            through: string[];
            on: boolean;
            from: string;
            to: string;
        };
        set: (/** @type {unknown} */ next: unknown) => void;
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
