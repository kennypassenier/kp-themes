export type ThemeName = import('./values.js').ThemeName;
/** @typedef {import('./values.js').ThemeName} ThemeName */
/**
 * Put a theme on the root and tell everyone.
 *
 * Validation lives here rather than in each caller: this is the exported
 * entry point and was the only one that did not validate, which is how an
 * unknown value used to reach the DOM through `applyTheme` while the same
 * value was rejected by the hook (AR6, adopted from the critic).
 *
 * @param {unknown} theme
 * @param {{ root?: Element, darkClass?: string | null, strict?: boolean, announce?: boolean }} [options]
 *   strict: throw on an unknown name instead of substituting the default; announce: dispatch the events (default true)
 * @returns {ThemeName} the theme actually applied — DEFAULT_THEME for anything unknown.
 *   When a listener refused or HELD the change, the theme the root still wears: with
 *   js/lazy-register.js attached that is the previous theme until the new register has
 *   loaded, and `pendingTheme()` names the one on its way [scope-50].
 */
export declare function applyTheme(theme: unknown, { root, darkClass, strict, announce }?: {
    root?: Element;
    darkClass?: string | null;
    strict?: boolean;
    announce?: boolean;
}): ThemeName;
/**
 * Before anything renders: wear the last known choice. Six lines in a
 * consumer's <head>, deliberately ignorant of which themes are dark —
 * that knowledge lives in the generated registry [TH23].
 *
 * @param {string} [fallback]
 * @param {{ root?: Element, key?: string }} [options]
 * @returns {ThemeName}
 */
export declare function initializeTheme(fallback?: string, { root, key }?: {
    root?: Element;
    key?: string;
}): ThemeName;
