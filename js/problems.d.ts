export { PROBLEMS, PROBLEM_SEVERITIES, PROBLEM_MODES, PROBLEM_DISMISS_EVENT } from './problems/values.js';
export type Problem = {
    /**
     * its stable id: the same key is the same element on every refresh
     */
    key: string;
    /**
     * what is wrong, in one line
     */
    what: string;
    /**
     * why it is
     */
    why?: string;
    /**
     * what to do now
     */
    remedy?: string;
    /**
     * a command that fixes it, set in code with a Copy button
     */
    command?: string;
    /**
     * default `warning`: most problems are "could not use this", not outages
     */
    severity?: 'critical' | 'warning' | 'info';
    /**
     * the fix (a button or a link); a node equal in markup to the one shown keeps the one shown
     */
    action?: Node | null;
    /**
     * a close button on this problem (default off)
     */
    dismissible?: boolean;
};
export type ProblemsOptions = {
    /**
     * default: the container's `data-kp-problems-mode`, else `each`
     */
    mode?: 'each' | 'list' | 'fold';
    /**
     * with `fold`: the count from which the problems fold (default 5)
     */
    foldFrom?: number;
    /**
     * the word before the remedy (default the dictionary's "What now")
     */
    remedyLabel?: string;
};
/**
 * One problem.
 * @typedef {object} Problem
 * @property {string} key its stable id: the same key is the same element on every refresh
 * @property {string} what what is wrong, in one line
 * @property {string} [why] why it is
 * @property {string} [remedy] what to do now
 * @property {string} [command] a command that fixes it, set in code with a Copy button
 * @property {'critical' | 'warning' | 'info'} [severity] default `warning`: most problems are "could not use this", not outages
 * @property {Node | null} [action] the fix (a button or a link); a node equal in markup to the one shown keeps the one shown
 * @property {boolean} [dismissible] a close button on this problem (default off)
 */
/**
 * @typedef {object} ProblemsOptions
 * @property {'each' | 'list' | 'fold'} [mode] default: the container's `data-kp-problems-mode`, else `each`
 * @property {number} [foldFrom] with `fold`: the count from which the problems fold (default 5)
 * @property {string} [remedyLabel] the word before the remedy (default the dictionary's "What now")
 */
/**
 * Set a container's problems, by key. Worst first, in the given order within a severity.
 *
 * @param {Element} container a `[data-kp-problems]`
 * @param {Problem[]} items
 * @param {ProblemsOptions} [options]
 */
export declare function setProblems(container: Element, items: Problem[], options?: ProblemsOptions): void;
/**
 * Attach every container of problems under `root`: it stamps the layout and the count, so the markup is complete.
 *
 * @param {ParentNode} [root]
 * @returns {() => void} detach
 */
export declare function attachProblems(root?: ParentNode): () => void;
