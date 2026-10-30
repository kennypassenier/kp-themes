export type ThemeName = import('./values.js').ThemeName;
/** @typedef {import('./values.js').ThemeName} ThemeName */
/**
 * @param {{ root?: Element }} [options]
 * @returns {ThemeName} the theme the root is currently wearing
 */
export declare function currentTheme({ root }?: {
    root?: Element;
}): ThemeName;
/**
 * The theme a change is being held for, or null when none is [scope-50].
 * While it is set, `currentTheme()` is still the theme the root wears.
 *
 * @param {{ root?: Element }} [options]
 * @returns {ThemeName | null}
 */
export declare function pendingTheme({ root }?: {
    root?: Element;
}): ThemeName | null;
