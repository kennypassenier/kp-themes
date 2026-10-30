import { Controller } from '../controller.js';
export type Memory = import('./format.js').Memory;
export type InspectorOptions = import('./format.js').InspectorOptions;
export declare class RequestInspector extends Controller {
    /** @type {Memory} */
    memory: Memory;
    /** @param {HTMLElement} el @param {InspectorOptions} [given] */
    constructor(el: HTMLElement, given?: InspectorOptions);
    connect(): void;
    /** @param {Event} event */
    onClick(event: Event): void;
    /** Show a secret header's value, or mask it again. @param {HTMLButtonElement} secret */
    flipSecret(secret: HTMLButtonElement): void;
    /** The code blocks inside have a segmented control of their own: only the status filter counts. @param {Event} event */
    onFilter(event: Event): void;
}
