import { Controller } from '../controller.js';
export type PaletteHandle = import('./types.js').PaletteHandle;
/** @typedef {import('./types.js').PaletteHandle} PaletteHandle */
/** One sheet: its key and the handle a page gets for it. */
export declare class SheetControl extends Controller {
    sheet: HTMLDialogElement;
    key: string | null;
    typingSelector: string;
    /** @type {PaletteHandle} */
    handle: PaletteHandle;
    /** @param {HTMLElement} host @param {{ sheetKey?: string | null, typingSelector?: string }} [options] */
    constructor(host: HTMLElement, options?: {
        sheetKey?: string | null;
        typingSelector?: string;
    });
    connect(): void;
    open(): void;
    /** `?` only when nobody is typing one into a field, and never with a modifier — Ctrl+? belongs to the browser. @param {KeyboardEvent} event */
    onKey(event: KeyboardEvent): void;
}
