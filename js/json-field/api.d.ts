/**
 * The handle of a field that has been attached.
 * @param {Element} area
 * @returns {import('./constants.js').JsonFieldHandle | null}
 */
export declare function jsonField(area: Element): import('./constants.js').JsonFieldHandle | null;
/**
 * Give every `textarea[data-kp-json]` under `root` its checking, gutter and tools.
 * @param {ParentNode} [root]
 * @param {import('./constants.js').JsonFieldOptions} [options]
 * @returns {() => void} detach
 */
export declare function attachJsonFields(root?: ParentNode, options?: import('./constants.js').JsonFieldOptions): () => void;
