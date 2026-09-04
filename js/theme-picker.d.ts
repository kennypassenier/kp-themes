import { THEMES } from './theme-core.js';
/**
 * Attach the behaviour to every picker under `root`, and keep them all in
 * step with each other and with any React picker on the same page — they
 * share one bus, so neither channel needs to know the other exists [AR5].
 *
 * Safe to call twice: a picker already attached is skipped.
 *
 * @param {ParentNode} [root]
 * @returns {() => void} detach
 */
export declare function attachThemePickers(root?: ParentNode): () => void;
/**
 * The list a consumer's template needs to render the options. Exported so
 * a page built without a server-side theme list can still write the
 * markup, and so the showcase does not hand-type seven names.
 */
export { THEMES };
/**
 * The icon button with a dropdown, as markup [S2].
 *
 * Returned as a string rather than rendered, so a server can print it
 * into a template and a page can insert it — the same choice T1 makes
 * everywhere else in this channel. The id must be unique on the page;
 * pass one when there are two menus.
 *
 * @param {{ id?: string, label?: string }} [options]
 * @returns {string}
 */
export declare function themeMenuMarkup({ id, label }?: {
    id?: string;
    label?: string;
}): string;
