import { THEMES } from './theme-core.js';
export { PICK_EVENT, PREVIEW_EVENT, PREVIEW_LEAVE_MS } from './theme-picker/values.js';
export { THEME_MENU_ICON, themeMenuMarkup, themeOptionsMarkup } from './theme-picker/markup.js';
/**
 * Attach the behaviour to every picker under `root`, and keep them all in
 * step with each other and with any React picker on the same page — they
 * share one bus, so neither channel needs to know the other exists [AR5].
 *
 * Safe to call twice: a picker already attached is skipped. The returned
 * detach restores the marks it made; `refresh()` re-marks options added
 * after attach, which the idempotency guard would otherwise skip.
 *
 * @param {ParentNode} [root]
 * @param {{ persist?: boolean, closePopover?: boolean, status?: ParentNode | null, preview?: boolean }} [options]
 *   persist: store the choice (default true); closePopover: close an
 *   enclosing popover after a choice (default true); status: where the
 *   save-failed message lives (default: the picker's parent); preview:
 *   show a theme on hover and keyboard focus (default: the picker's
 *   `data-kp-theme-preview="hover"`, else off).
 * @returns {(() => void) & { refresh: () => void }} detach
 */
export declare function attachThemePickers(root?: ParentNode, { persist, closePopover, status, preview }?: {
    persist?: boolean;
    closePopover?: boolean;
    status?: ParentNode | null;
    preview?: boolean;
}): (() => void) & {
    refresh: () => void;
};
/**
 * The list a consumer's template needs to render the options. Exported so
 * a page built without a server-side theme list can still write the
 * markup, and so the showcase does not hand-type seven names.
 */
export { THEMES };
