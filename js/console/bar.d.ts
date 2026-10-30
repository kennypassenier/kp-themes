export type ConsoleBlock = import('./types.js').ConsoleBlock;
/** @typedef {import('./types.js').ConsoleBlock} ConsoleBlock */
/** @param {HTMLElement} root */
export declare function ensureParts(root: HTMLElement): void;
/** Write the words and the state of the bar. @param {HTMLElement} root */
export declare function drawBar(root: HTMLElement): void;
/** The status words of a block. @param {HTMLElement} root @param {ConsoleBlock} b */
export declare function statusOf(root: HTMLElement, b: ConsoleBlock): {
    glyph: string;
    text: string;
    extra?: undefined;
} | {
    glyph: string;
    text: string;
    extra: string;
};
