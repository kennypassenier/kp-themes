export type Memory = import('./model.js').Memory;
export type SelectionItem = import('./model.js').SelectionItem;
/** @typedef {import('./model.js').Memory} Memory */
/** @typedef {import('./model.js').SelectionItem} SelectionItem */
/** @param {HTMLElement} bar @param {Memory} memory */
export declare function parts(bar: HTMLElement, memory: Memory): {
    panel: HTMLElement;
    count: HTMLElement;
    names: HTMLElement;
    offer: HTMLElement;
    result: HTMLElement;
    actions: HTMLElement;
    toggle: HTMLButtonElement;
    clear: HTMLButtonElement;
    live: HTMLElement;
};
/** @param {HTMLElement} bar @param {Memory} memory */
export declare function draw(bar: HTMLElement, memory: Memory): void;
/** @param {HTMLElement} bar @param {Memory} memory @param {string} text */
export declare function say(bar: HTMLElement, memory: Memory, text: string): void;
/**
 * Unticks every box of the sources, the way a click would.
 * @param {Memory} memory
 */
export declare function untick(memory: Memory): void;
/**
 * Draw the bar from what is selected now.
 * @param {HTMLElement} bar
 * @param {Memory} memory
 */
export declare function sync(bar: HTMLElement, memory: Memory): void;
