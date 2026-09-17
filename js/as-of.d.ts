/**
 * The elements under `root` now, to attach against later.
 * @param {ParentNode} root
 * @returns {WeakSet<Element>}
 */
export declare const presentUnder: (root: ParentNode) => WeakSet<Element>;
/**
 * Run `attach` against `root` as it stood when `present` was taken.
 *
 * @template T
 * @param {ParentNode} root
 * @param {WeakSet<Element>} present
 * @param {() => T} attach
 * @returns {T}
 */
export declare function asOf<T>(root: ParentNode, present: WeakSet<Element>, attach: () => T): T;
