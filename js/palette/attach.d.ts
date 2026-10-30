import { MATCHERS } from './keys.js';
export type Matcher = import('./types.js').Matcher;
export type PaletteHandle = import('./types.js').PaletteHandle;
/** @typedef {import('./types.js').Matcher} Matcher */
/** @typedef {import('./types.js').PaletteHandle} PaletteHandle */
/**
 * Attach every palette and shortcut sheet under `root`.
 *
 * @param {ParentNode} root
 * @param {{ hotkey?: string | null, sheetKey?: string | null, match?: keyof typeof MATCHERS | Matcher, clearOnClose?: boolean, closeOnRun?: boolean, typingSelector?: string }} [options]
 *   Defaults; per element: `data-kp-hotkey` (a letter, or "none"), `data-kp-primary` (this one answers the key when there are several), `data-kp-match` (`intent` by default: words in any order, js/intent.js; or `substring`, `subsequence`, `prefix`), `data-kp-clear-on-close="false"`, `data-kp-close-on-run="false"`.
 * @returns {(() => void) & { handles: PaletteHandle[] }} detach
 */
export declare function attachPalettes(root?: ParentNode, { hotkey, sheetKey, match, clearOnClose, closeOnRun, typingSelector, }?: {
    hotkey?: string | null;
    sheetKey?: string | null;
    match?: keyof typeof MATCHERS | Matcher;
    clearOnClose?: boolean;
    closeOnRun?: boolean;
    typingSelector?: string;
}): (() => void) & {
    handles: PaletteHandle[];
};
