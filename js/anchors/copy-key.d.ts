export type Strings = ReturnType<typeof import('../strings.js').getStrings>;
/** @typedef {ReturnType<typeof import('../strings.js').getStrings>} Strings */
/** Per document: when a container last changed, for the quiet a missing hash waits for. @type {WeakMap<Document, number>} */
export declare const LAST_CHANGE: WeakMap<Document, number>;
/**
 * @param {Document} doc
 * @param {Strings} strings
 * @param {string | null} keys the engine's keys (the first container of the page names them); null when off
 * @param {() => (() => void) | null} provider the container's way to copy its focused row, or null when none is focused
 * @returns {() => void} release
 */
export declare function serveCopyKey(doc: Document, strings: Strings, keys: string | null, provider: () => (() => void) | null): () => void;
