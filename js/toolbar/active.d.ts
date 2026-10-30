export type ToolbarFilter = import('../toolbar.js').ToolbarFilter;
export type ToolbarDecorateInfo = import('../toolbar.js').ToolbarDecorateInfo;
export type Strings = import('../strings.js').Strings;
/** @typedef {import('../toolbar.js').ToolbarFilter} ToolbarFilter */
/** @typedef {import('../toolbar.js').ToolbarDecorateInfo} ToolbarDecorateInfo */
/** @typedef {import('../strings.js').Strings} Strings */
/** @param {Element} toolbar @returns {HTMLInputElement | null} */
export declare function toolbarSearch(toolbar: Element): HTMLInputElement | null;
/**
 * Draw the filters that are on under the toolbar: one removable tag each and
 * Clear all, or nothing (the row is hidden) when there are none. The Clear all
 * button and the word before the tags are made once and kept, so a press that
 * is still in flight never meets a button replaced under it.
 * @param {Element} toolbar
 * @param {readonly ToolbarFilter[]} filters
 * @param {{ clearAll?: boolean, removeGlyph?: string, decorate?: (part: HTMLElement, info: ToolbarDecorateInfo) => void }} [options]
 *   clearAll: show Clear all (default true); decorate: called with every tag's cross (`tag-remove`) and with Clear all (`clear-all`),
 *   each time they are built, the same shape every kp module's `decorate` takes [wish-1120, homelab 66, 114]
 */
export declare function setToolbarActive(toolbar: Element, filters: readonly ToolbarFilter[], { clearAll, removeGlyph, decorate }?: {
    clearAll?: boolean;
    removeGlyph?: string;
    decorate?: (part: HTMLElement, info: ToolbarDecorateInfo) => void;
}): void;
