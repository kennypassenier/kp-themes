export { NAV_FOLD, NAV_FOLD_EVENT, NAV_MORE, NAV_SEP, NAV_FOLD_OWNED } from './nav-fold/read.js';
export { planFold, planSeparators } from './nav-fold/plan.js';
export type NavFoldOptions = {
    /**
     * any of the dictionary's `navMore…` words, for this bar only
     */
    strings?: Partial<import('./strings.js').Strings>;
};
/**
 * @typedef {object} NavFoldOptions
 * @property {Partial<import('./strings.js').Strings>} [strings] any of the dictionary's `navMore…` words, for this bar only
 */
/**
 * Fold one bar.
 *
 * @param {HTMLElement} nav the `.kp-nav` carrying `data-kp-nav-fold`
 * @param {NavFoldOptions} [options]
 * @returns {() => void} detach
 */
export declare function foldNav(nav: HTMLElement, { strings }?: NavFoldOptions): () => void;
/**
 * Fold every bar under `root` that carries `data-kp-nav-fold`. A bar the React
 * NavBar renders folds itself; pass `ownedBy: ''` to fold it here instead.
 *
 * @param {ParentNode} [root]
 * @param {NavFoldOptions & { ownedBy?: string }} [options]
 * @returns {() => void} detach
 */
export declare function attachNavFolds(root?: ParentNode, { ownedBy, ...options }?: NavFoldOptions & {
    ownedBy?: string;
}): () => void;
