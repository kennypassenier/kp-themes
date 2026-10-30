export { FOLLOW, FOLLOW_EVENT, NEWPILL_JUMP_EVENT, FOLLOW_THRESHOLD, NEWPILL_SAY_MS } from './newpill/values.js';
export type NewPillOptions = {
    follow?: 'tail' | 'head';
    threshold?: number;
    placement?: 'bottom' | 'top';
    /**
     * "line,lines"
     */
    unit?: string;
    sinceLeft?: boolean;
    key?: string;
    space?: boolean;
    /**
     * where the rows arrive: the scroller's children (default) or the rows of a table body inside it
     */
    rows?: 'children' | 'tbody';
};
export type NewPillHandle = {
    /**
     * stop following; new rows are counted
     */
    pause: () => void;
    /**
     * jump to the end and follow
     */
    resume: () => void;
    /**
     * same as resume
     */
    jump: () => void;
    /**
     * how many shown rows arrived out of sight
     */
    unseen: () => number;
    following: () => boolean;
};
/**
 * @typedef {object} NewPillOptions
 * @property {'tail' | 'head'} [follow]
 * @property {number} [threshold]
 * @property {'bottom' | 'top'} [placement]
 * @property {string} [unit] "line,lines"
 * @property {boolean} [sinceLeft]
 * @property {string} [key]
 * @property {boolean} [space]
 * @property {'children' | 'tbody'} [rows] where the rows arrive: the scroller's children (default) or the rows of a table body inside it
 */
/**
 * @typedef {object} NewPillHandle
 * @property {() => void} pause stop following; new rows are counted
 * @property {() => void} resume jump to the end and follow
 * @property {() => void} jump same as resume
 * @property {() => number} unseen how many shown rows arrived out of sight
 * @property {() => boolean} following
 */
/**
 * The handle of a scroller.
 * @param {Element} el
 * @returns {NewPillHandle | null}
 */
export declare function newPill(el: Element): NewPillHandle | null;
/**
 * Give every live list under `root` its following and its pill.
 * @param {ParentNode} [root]
 * @param {NewPillOptions} [options]
 * @returns {() => void} detach
 */
export declare function attachNewPills(root?: ParentNode, options?: NewPillOptions): () => void;
