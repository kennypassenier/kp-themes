export type Memory = import('./format.js').Memory;
/** @typedef {import('./format.js').Memory} Memory */
/** @param {HTMLElement} el @param {Memory} memory @param {HTMLButtonElement} button */
export declare function copy(el: HTMLElement, memory: Memory, button: HTMLButtonElement): Promise<void>;
