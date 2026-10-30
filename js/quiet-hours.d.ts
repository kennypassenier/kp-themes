export { QUIET, QUIET_EVENT, QUIET_SEVERITIES } from './quiet-hours/values.js';
export { readQuiet, quietSummary } from './quiet-hours/value.js';
export type QuietValue = {
    /**
     * quiet hours are on
     */
    on: boolean;
    /**
     * `HH:MM`
     */
    from: string;
    /**
     * `HH:MM`
     */
    to: string;
    /**
     * 0 (Sunday) to 6
     */
    days: number[];
    /**
     * the severities that still come through
     */
    through: string[];
};
/**
 * @typedef {object} QuietValue
 * @property {boolean} on quiet hours are on
 * @property {string} from `HH:MM`
 * @property {string} to `HH:MM`
 * @property {number[]} days 0 (Sunday) to 6
 * @property {string[]} through the severities that still come through
 */
/**
 * The value a control holds.
 * @param {Element} el
 * @returns {QuietValue | null}
 */
export declare function quietValue(el: Element): QuietValue | null;
/**
 * Set the control from the page's stored value (no event).
 * @param {Element} el an attached `[data-kp-quiet]`
 * @param {Partial<QuietValue>} value
 */
export declare function setQuiet(el: Element, value: Partial<QuietValue>): void;
/**
 * Build every quiet-hours control under `root`.
 * @param {ParentNode} [root]
 * @returns {() => void} detach
 */
export declare function attachQuietHours(root?: ParentNode): () => void;
