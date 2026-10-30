/** A container of problems. */
export declare const PROBLEMS = "[data-kp-problems]";
/** The severities, worst first. */
export declare const PROBLEM_SEVERITIES: readonly ['critical', 'warning', 'info'];
/** The layouts of several problems. */
export declare const PROBLEM_MODES: readonly ['each', 'list', 'fold'];
/** Fired on the container, bubbling and cancelable, when a dismissible problem is dismissed: `{ key }`. */
export declare const PROBLEM_DISMISS_EVENT = "kp-problem-dismiss";
/** The alert flavour each severity wears. */
export declare const FLAVOUR: {
    critical: string;
    warning: string;
    info: string;
};
/** The glyph in each severity's icon. */
export declare const GLYPH: {
    critical: string;
    warning: string;
    info: string;
};
/** The count from which `fold` folds the problems unless the page says, and the least it may be. */
export declare const DEFAULT_FOLD_FROM = 5;
export declare const LEAST_FOLD_FROM = 2;
/** The rows `fold` keeps open when its attribute is unreadable. */
export declare const DEFAULT_OPEN_ROWS = 4;
export type Problem = import('../problems.js').Problem;
/** @typedef {import('../problems.js').Problem} Problem */
/** @param {Problem} p */
export declare const severityOf: (p: Problem) => "critical" | "info" | "warning";
/** The problems without a repeated key, worst first, in the given order within a severity. @param {Problem[]} items */
export declare function ranked(items: Problem[]): import("../problems.js").Problem[];
/** The child of `parent` that matches, or a new one that does not yet sit in it. @param {Element} parent @param {string} selector @param {string} tag @param {string} className */
export declare function part(parent: Element, selector: string, tag: string, className: string): HTMLElement;
/** Set text only when it changed. @param {Node} el @param {string} text */
export declare const setText: (el: Node, text: string) => void;
/**
 * The alert's severity icon, made when missing and drawn with the severity's glyph.
 * @param {HTMLElement} alert @param {'critical' | 'warning' | 'info'} severity
 * @returns {Element} the icon
 */
export declare function alertIcon(alert: HTMLElement, severity: 'critical' | 'warning' | 'info'): Element;
/** The alert's body, made after the icon when missing. @param {Element} alert @param {Element} icon @returns {HTMLElement} */
export declare function alertBody(alert: Element, icon: Element): HTMLElement;
