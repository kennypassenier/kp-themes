import { Controller } from '../controller.js';
export type FlashOptions = import('../flash.js').FlashOptions;
/** @typedef {import('../flash.js').FlashOptions} FlashOptions */
export declare class FlashFaces extends Controller {
    flashOptions: import("../flash.js").FlashOptions;
    rest: HTMLSpanElement;
    busy: HTMLSpanElement;
    result: HTMLSpanElement;
    stack: HTMLSpanElement;
    status: HTMLSpanElement;
    /** Whether the line under the button is one this controller made. */
    ownLine: boolean;
    line: HTMLElement;
    /**
     * @param {HTMLElement} host the button
     * @param {FlashOptions} [options]
     */
    constructor(host: HTMLElement, options?: FlashOptions);
    /** @param {string} className */
    span(className: string): HTMLSpanElement;
    /** Every word the button may say holds its width, unseen. */
    ghostWords(): string[];
    connect(): void;
    /** Give the button its own words back and take the faces, the status and the line away. */
    unwire(): void;
}
