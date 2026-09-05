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
 *
 * @typedef {import('./theme-registry.js').ThemeName} ThemeName
 */
/**
 * The event both channels listen to. A contract value: a consumer may
 * listen for it too, so it does not get renamed casually [TH26]. It
 * bubbles from the root, so `document.addEventListener` sees it as it
 * always did, and so does a listener on the root itself.
 */
export declare const THEME_EVENT = "kp-theme-change";
/** Fired before a change, cancelable: `{ theme, previous }`. preventDefault() keeps the current theme. */
export declare const BEFORE_THEME_EVENT = "kp-theme-before-change";
export type ThemeConfig = {
    root?: Element;
    darkClass?: string | null;
    storageKey?: string;
};
/**
 * Set the defaults once: which element wears the theme (default: the
 * document element), which class marks a dark theme (default `dark`; null
 * for none), and the storage key.
 *
 * @param {ThemeConfig} next
 */
export declare function configureTheme(next: ThemeConfig): void;
/** @param {unknown} value @returns {value is ThemeName} */
export declare const isTheme: (value: unknown) => value is ThemeName;
/**
 * @param {{ root?: Element }} [options]
 * @returns {ThemeName} the theme the root is currently wearing
 */
export declare function currentTheme({ root }?: {
    root?: Element;
}): ThemeName;
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
 * @returns {ThemeName} the theme actually applied — DEFAULT_THEME for anything unknown
 */
export declare function applyTheme(theme: unknown, { root, darkClass, strict, announce }?: {
    root?: Element;
    darkClass?: string | null;
    strict?: boolean;
    announce?: boolean;
}): ThemeName;
/**
 * Remember the choice. Returns false when storage refused — private mode,
 * blocked storage, a full quota. The caller shows that; it is not swallowed
 * [AR6], because in a server-rendered dashboard a preference that silently
 * fails to save is indistinguishable from a broken picker.
 *
 * @param {string} theme
 * @param {{ key?: string, storage?: Storage }} [options]
 * @returns {boolean} whether the choice will survive a reload
 */
export declare function storeTheme(theme: string, { key, storage }?: {
    key?: string;
    storage?: Storage;
}): boolean;
/**
 * @param {{ key?: string, storage?: Storage }} [options]
 * @returns {ThemeName | null} the stored choice, or null if there is none or storage is unreadable
 */
export declare function storedTheme({ key, storage }?: {
    key?: string;
    storage?: Storage;
}): ThemeName | null;
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
/**
 * Listen for theme changes, whoever made them: this tab's React picker,
 * this tab's framework-free picker, or — unless declined — another tab.
 *
 * @param {(theme: ThemeName, detail: { previous: ThemeName | null, root: Element }) => void} listener
 * @param {{ crossTab?: boolean, root?: Element, key?: string }} [options]
 * @returns {() => void} unsubscribe
 */
export declare function onThemeChange(listener: (theme: ThemeName, detail: {
    previous: ThemeName | null;
    root: Element;
}) => void, { crossTab, root, key }?: {
    crossTab?: boolean;
    root?: Element;
    key?: string;
}): () => void;
export { THEMES, DEFAULT_THEME, STORAGE_KEY };
