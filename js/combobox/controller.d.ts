import { ComboboxTags } from './tags.js';
export type ComboboxHandle = import('./types.js').ComboboxHandle;
/** @typedef {import('./types.js').ComboboxHandle} ComboboxHandle */
export declare class ComboboxControl extends ComboboxTags {
    /** The debounce timer of the next filter. */
    pending: number;
    /** What a page gets back for this box. @type {ComboboxHandle} */
    handle: ComboboxHandle;
    /** @param {HTMLElement} host @param {Record<string, unknown>} [options] */
    constructor(host: HTMLElement, options?: Record<string, unknown>);
    connect(): void;
    /** The handle a page gets back: read the values, replace them, open, close, type, refresh and extend. @returns {ComboboxHandle} */
    makeHandle(): ComboboxHandle;
    onInput(): void;
    /** @param {KeyboardEvent} event */
    onKeyDown(event: KeyboardEvent): void;
    /** @param {MouseEvent} event */
    onTagClick(event: MouseEvent): void;
    onFocus(): void;
    onFocusOut(): void;
}
