export type ConsoleBlock = import('./types.js').ConsoleBlock;
/** @typedef {import('./types.js').ConsoleBlock} ConsoleBlock */
/** Build or update one block. @param {HTMLElement} root @param {ConsoleBlock} b @param {HTMLElement | null} node */
export declare function blockNode(root: HTMLElement, b: ConsoleBlock, node: HTMLElement | null): HTMLElement;
/** Draw the body: the blocks, or the plate that stands in their place. @param {HTMLElement} root */
export declare function drawBody(root: HTMLElement): void;
/** @param {HTMLElement} root */
export declare function drawAll(root: HTMLElement): void;
