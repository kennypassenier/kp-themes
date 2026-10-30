export { ATTENTION, SEVERITIES } from './attention/values.js';
export { sortAttention, setAttention } from './attention/set.js';
export type AttentionItem = {
    /**
     * its stable id (`data-kp-key`): the same key is the same element on every refresh
     */
    key: string;
    severity: 'critical' | 'warning' | 'info';
    /**
     * the problem, in one line
     */
    title: string;
    /**
     * one sentence more
     */
    text?: string;
    /**
     * the fix (a button or a link). Left out, a kept item keeps the action it has; `null` removes it. A new node equal in markup to the one shown (`isEqualNode`) keeps the one shown, so its focus and listeners survive a refresh.
     */
    action?: Node | null;
    /**
     * the word a screen reader hears before the title, in place of the dictionary's
     */
    srSeverity?: string;
};
/**
 * One problem on the band.
 * @typedef {object} AttentionItem
 * @property {string} key its stable id (`data-kp-key`): the same key is the same element on every refresh
 * @property {'critical' | 'warning' | 'info'} severity
 * @property {string} title the problem, in one line
 * @property {string} [text] one sentence more
 * @property {Node | null} [action] the fix (a button or a link). Left out, a kept item keeps the action it has; `null` removes it. A new node equal in markup to the one shown (`isEqualNode`) keeps the one shown, so its focus and listeners survive a refresh.
 * @property {string} [srSeverity] the word a screen reader hears before the title, in place of the dictionary's
 */
/**
 * Keep every attention band under `root` worst first, now and whenever an
 * item arrives or changes severity. A band added under `root` later is
 * sorted as it arrives and watched from then on; a band that leaves the
 * page is let go (its watcher disconnected). The band hides itself in CSS
 * when it holds nothing.
 * @param {ParentNode} [root]
 * @returns {() => void} detach
 */
export declare function attachAttention(root?: ParentNode): () => void;
