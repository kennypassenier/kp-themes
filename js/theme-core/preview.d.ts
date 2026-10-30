export type ThemeName = import('./values.js').ThemeName;
/** @typedef {import('./values.js').ThemeName} ThemeName */
/**
 * Show a theme on the root for a look, without choosing it [anchors-picker-1019].
 *
 * Nothing is announced (no `kp-theme-before-change`, no `kp-theme-change`), nothing is stored, and `currentTheme()` goes on
 * answering the theme the root really wears; only `data-theme` and the dark class change, so the page, its charts that read the
 * theme from the root and the tokens all show the previewed theme. A theme that does not exist is ignored (no fallback to the
 * default: a preview of nothing is no preview). Previewing the theme already worn ends a preview. `endPreview()` goes back;
 * `applyTheme()` makes a choice and ends it. A theme whose register is loaded on demand needs it loaded first:
 * js/theme-picker.js does that before it calls this.
 *
 * @param {unknown} theme
 * @param {{ root?: Element, darkClass?: string | null }} [options]
 * @returns {ThemeName | null} the theme now shown, or null when the name is not a theme
 */
export declare function previewTheme(theme: unknown, { root, darkClass }?: {
    root?: Element;
    darkClass?: string | null;
}): ThemeName | null;
/**
 * Go back from a preview to the theme the root really wears.
 *
 * @param {{ root?: Element, darkClass?: string | null }} [options]
 * @returns {boolean} whether there was a preview to end
 */
export declare function endPreview({ root, darkClass }?: {
    root?: Element;
    darkClass?: string | null;
}): boolean;
/**
 * The theme being previewed on the root, or null when none is.
 *
 * @param {{ root?: Element }} [options]
 * @returns {ThemeName | null}
 */
export declare function previewedTheme({ root }?: {
    root?: Element;
}): ThemeName | null;
