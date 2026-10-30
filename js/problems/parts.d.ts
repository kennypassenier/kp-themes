export type Problem = import('../problems.js').Problem;
/**
 * Write one problem's three parts into `host`, touching only what changed.
 * @param {HTMLElement} host an alert body or a list item
 * @param {Problem} p
 * @param {string} remedyLabel
 */
export declare function paintParts(host: HTMLElement, p: Problem, remedyLabel: string): void;
/**
 * Put `p.action` into the actions box of `host`.
 * @param {HTMLElement} host @param {Problem} p
 */
export declare function paintAction(host: HTMLElement, p: Problem): void;
