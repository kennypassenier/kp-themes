/** The handle of an attached box. @param {Element} element @returns {import('./constants.js').AutosizeHandle | null} */
export declare function autosize(element: Element): import('./constants.js').AutosizeHandle | null;
/**
 * Measure a box again.
 * @param {Element} element
 */
export declare function refreshAutosize(element: Element): void;
/**
 * Put a box in a state: `loading` lays the busy card over it, `error` writes the sentence in its error line.
 * @param {Element} element @param {'ready' | 'loading' | 'error'} state @param {string} [message]
 */
export declare function setAutosizeState(element: Element, state: 'ready' | 'loading' | 'error', message?: string): void;
/**
 * Wire every growing box under `root`; a box with `data-kp-autosize="off"` stays as it is.
 * @param {ParentNode} [root]
 * @param {import('./constants.js').AutosizeOptions} [options] overrides the markup
 * @returns {() => void} detach
 */
export declare function attachAutosize(root?: ParentNode, options?: import('./constants.js').AutosizeOptions): () => void;
