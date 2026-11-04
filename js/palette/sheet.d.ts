import { Controller } from '../controller.js';
export type PaletteHandle = import('./types.js').PaletteHandle;
/** @typedef {import('./types.js').PaletteHandle} PaletteHandle */
/** One sheet: its key and the handle a page gets for it. */
export declare class SheetControl extends Controller {
    sheet: HTMLDialogElement;
    /** The key that opens the sheet, as a key spec: the attribute, else the page's `sheetKey`, else the default; empty when it is off. */
    key: import("../key-spec.js").KeySpec;
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
    /** The sheet's key (`?` by default) only when nobody is typing into a field, and never with a modifier the key does not name — Ctrl+? belongs to the browser. @param {KeyboardEvent} event */
    onKey(event: KeyboardEvent): void;
}
