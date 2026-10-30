/** The handle of an attached picker. @param {Element} element @returns {import('./constants.js').DatedHandle | null} */
export declare function datedOptions(element: Element): import('./constants.js').DatedHandle | null;
/**
 * Give a picker its options (none: the empty state), and optionally the value to choose (the newest by default).
 * @param {Element} element @param {readonly import('./constants.js').DatedOption[]} options @param {string | null} [value]
 */
export declare function setDatedOptions(element: Element, options: readonly import('./constants.js').DatedOption[], value?: string | null): void;
/**
 * Put a picker in a state: ready, empty, loading or error.
 * @param {Element} element @param {import('./constants.js').DatedState} state @param {import('./constants.js').DatedStateOptions} [options]
 */
export declare function setDatedState(element: Element, state: import('./constants.js').DatedState, options?: import('./constants.js').DatedStateOptions): void;
/**
 * The value a picker holds.
 * @param {Element} element
 */
export declare function datedValue(element: Element): string | null;
/**
 * Wire every dated option picker under `root`.
 * @param {ParentNode} [root]
 * @param {{ now?: () => number }} [options]
 * @returns {() => void} detach
 */
export declare function attachDatedOptions(root?: ParentNode, { now }?: {
    now?: () => number;
}): () => void;
