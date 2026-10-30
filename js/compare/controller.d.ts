import { CompareLoad } from './load.js';
export declare class Compare extends CompareLoad {
    /** Whether a drag is under way. */
    dragging: boolean;
    /**
     * @param {HTMLElement} host
     * @param {Record<string, unknown>} [options]
     */
    constructor(host: HTMLElement, options?: Record<string, unknown>);
    connect(): void;
    /** @param {PointerEvent} event */
    onDown(event: PointerEvent): void;
    /** @param {PointerEvent} event */
    onUp(event: PointerEvent): void;
    /** @param {KeyboardEvent} event */
    onKey(event: KeyboardEvent): void;
}
