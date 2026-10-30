import { Controller } from '../controller.js';
export declare class CompareCore extends Controller {
    s: import("../strings/types.js").Strings;
    doc: Document;
    view: Window & typeof globalThis;
    before: HTMLElement;
    after: HTMLElement;
    wordBefore: string;
    wordAfter: string;
    parts: {
        divider: HTMLDivElement;
        handle: HTMLSpanElement;
        labelBefore: HTMLSpanElement;
        labelAfter: HTMLSpanElement;
        wait: HTMLSpanElement;
    };
    /** Where the divider stands: 0 (all after) to 100 (all before). */
    position: number;
    /**
     * @param {HTMLElement} host the slider
     * @param {Record<string, unknown>} [options]
     */
    constructor(host: HTMLElement, options?: Record<string, unknown>);
    rtl(): boolean;
    /** The divider's position under a pointer. @param {PointerEvent} event */
    at(event: PointerEvent): number;
    /** @param {number} next @param {boolean} fire @param {boolean} glide */
    move(next: number, fire: boolean, glide: boolean): void;
}
