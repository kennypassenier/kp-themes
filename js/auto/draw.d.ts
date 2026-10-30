/** @param {ParentNode} root @param {string} selector */
export declare const carries: (root: ParentNode, selector: string) => boolean;
/** @param {ParentNode} root @returns {Element[]} `root` itself when it is an element, and everything under it */
export declare const everyUnder: (root: ParentNode) => Element[];
/**
 * Run `attach`, and add to `drawn` every element it put under `root` while it
 * ran. The records are taken before the observer could deliver them, so what
 * counts is exactly what the attach itself drew, never what a framework
 * rendered while the module was on its way.
 *
 * @template T
 * @param {ParentNode} root
 * @param {WeakSet<Element>} drawn
 * @param {() => T} attach
 * @returns {T}
 */
export declare const drawing: <T>(root: ParentNode, drawn: WeakSet<Element>, attach: () => T) => T;
