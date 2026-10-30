export type Memory = import('./format.js').Memory;
/** @typedef {import('./format.js').Memory} Memory */
/** @param {HTMLElement} el */
export declare function partsOf(el: HTMLElement): {
    bar: HTMLElement;
    count: HTMLElement;
    filter: HTMLElement;
    stage: HTMLElement;
    list: HTMLElement;
};
/** @param {HTMLElement} el @param {Memory} memory */
export declare function draw(el: HTMLElement, memory: Memory): void;
