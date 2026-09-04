import { THEMES, DEFAULT_THEME, STORAGE_KEY } from './theme-registry.js';
export type ThemeName = import('./theme-registry.js').ThemeName;
/**
 * A theme name, as a union of the eleven that exist [KT4].
 *
 * Only the OUTPUTS of this module narrowed to it. What a function accepts
 * stays lenient — `storeTheme` and `initializeTheme` still take a plain
 * string — because narrowing an input breaks a consumer that reads a theme
 * out of config or a database, which is exactly what JobTracker and
 * kp-soft do. Narrowing a return value cannot break anyone.
 * The type below is the type itself:
 *
 * Re-exported from the generated registry so a consumer can name the type
 * without importing from two places. It was `string` until 1.1.0, which
 * meant `applyTheme('formeel')` type-checked and then silently fell back
 * to `formal` at runtime.
 *
 * @typedef {import('./theme-registry.js').ThemeName} ThemeName
 */
/**
 * The event both channels listen to. A contract value: a consumer may
 * listen for it too, so it does not get renamed casually [TH26].
 */
export declare const THEME_EVENT = "kp-theme-change";
/** @param {unknown} value @returns {value is ThemeName} */
export declare const isTheme: (value: unknown) => value is ThemeName;
/** @returns {ThemeName} the theme the document is currently wearing */
export declare function currentTheme(): ThemeName;
/**
 * Put a theme on <html> and tell everyone.
 *
 * Validation lives here rather than in each caller: this is the exported
 * entry point and was the only one that did not validate, which is how an
 * unknown value used to reach the DOM through `applyTheme` while the same
 * value was rejected by the hook (AR6, adopted from the critic).
 *
 * @param {unknown} theme
 * @returns {ThemeName} the theme actually applied — DEFAULT_THEME for anything unknown
 */
export declare function applyTheme(theme: unknown): ThemeName;
/**
 * Remember the choice. Returns false when storage refused — private mode,
 * blocked storage, a full quota. The caller shows that; it is not swallowed
 * [AR6], because in a server-rendered dashboard a preference that silently
 * fails to save is indistinguishable from a broken picker.
 *
 * @param {string} theme
 * @returns {boolean} whether the choice will survive a reload
 */
export declare function storeTheme(theme: string): boolean;
/** @returns {ThemeName | null} the stored choice, or null if there is none or storage is unreadable */
export declare function storedTheme(): ThemeName | null;
/**
 * Before anything renders: wear the last known choice. Six lines in a
 * consumer's <head>, deliberately ignorant of which themes are dark —
 * that knowledge lives in the generated registry [TH23].
 *
 * @param {string} [fallback]
 * @returns {ThemeName}
 */
export declare function initializeTheme(fallback?: string): ThemeName;
/**
 * Listen for theme changes, whoever made them: this tab's React picker,
 * this tab's framework-free picker, or another tab.
 *
 * @param {(theme: ThemeName) => void} listener
 * @returns {() => void} unsubscribe
 */
export declare function onThemeChange(listener: (theme: ThemeName) => void): () => void;
export { THEMES, DEFAULT_THEME, STORAGE_KEY };
