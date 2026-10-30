import { Controller } from '../controller.js';
export type ChecklistItem = import('../checklist.js').ChecklistItem;
/** @typedef {import('../checklist.js').ChecklistItem} ChecklistItem */
export declare class Checklist extends Controller {
    /** Whether the last press on a row came from a key: then a ticked row's place goes to the next open one. */
    byKey: boolean;
    /** @param {HTMLElement} list */
    constructor(list: HTMLElement);
    connect(): void;
    items(): import("../checklist.js").ChecklistItem[];
    /** A row ticked or unticked. @param {Event} event */
    onChange(event: Event): void;
    /** The bar's buttons. @param {Event} event */
    onClick(event: Event): void;
    /**
     * Check all, or Uncheck all. The pressed button is dimmed afterwards: the focus goes to its opposite, not to the page's top.
     * @param {Element} target @param {boolean} on
     */
    tickAll(target: Element, on: boolean): void;
    /** Clear checked: the ticked items leave, and Undo is on offer for a while. */
    clearChecked(): void;
    /** Undo: the cleared items come back at the places they had. */
    undo(): void;
}
