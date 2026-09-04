import { applyTheme, initializeTheme, isTheme, DEFAULT_THEME, STORAGE_KEY, THEMES as THEME_RECORDS } from '../js/theme-core.js';
export { applyTheme, initializeTheme, isTheme, DEFAULT_THEME, STORAGE_KEY };
/** The generated theme record: name, label, dark. Source: themes/*\/tokens.json. */
export { THEME_RECORDS };
export type Theme = import('../js/theme-registry.js').ThemeName;
/**
 * A theme name [KT4].
 *
 * `string` until 1.1.0, which meant this type promised something it did
 * not deliver: `applyTheme('formeel')` type-checked and fell back to
 * `formal` at runtime. It is the generated union of the eleven names now,
 * and it is generated because two consumers were found on 2026-09-04
 * carrying a hand-kept copy of which themes exist, both wrong.
 *
 * @typedef {import('../js/theme-registry.js').ThemeName} Theme
 */
/** @type {Theme[]} */
export declare const THEMES: Theme[];
/**
 * Complete by construction — it is built from the same generated records
 * the union comes from — but `Object.fromEntries` cannot say so, so the
 * assertion is written down here rather than by weakening the type a
 * consumer reads.
 *
 * @type {Record<Theme, string>}
 */
export declare const THEME_LABELS: Record<Theme, string>;
export type UseThemeOptions = {
    /**
     * A theme that always wins - e.g. a signed-in member's server-saved choice.
     */
    preferred?: string | null;
    /**
     * Used when neither `preferred` nor localStorage holds a valid theme - e.g. a section default. Defaults to 'formal'.
     */
    fallback?: string | null;
    /**
     * Called after a change is applied locally. Persist server-side here. A thrown error or a rejected
     * promise reverts the change (the "endpoint that lies" guard) and sets `saveFailed`.
     */
    onChange?: (next: Theme, previous: Theme) => void | Promise<unknown>;
};
/**
 * @typedef {object} UseThemeOptions
 * @property {string | null} [preferred]  A theme that always wins - e.g. a signed-in member's server-saved choice.
 * @property {string | null} [fallback]   Used when neither `preferred` nor localStorage holds a valid theme - e.g. a section default. Defaults to 'formal'.
 * @property {(next: Theme, previous: Theme) => void | Promise<unknown>} [onChange]
 *   Called after a change is applied locally. Persist server-side here. A thrown error or a rejected
 *   promise reverts the change (the "endpoint that lies" guard) and sets `saveFailed`.
 */
/**
 * Precedence: `preferred` (server-saved) > localStorage (guest's choice) > `fallback` > 'formal'.
 * @param {UseThemeOptions} [options]
 */
export declare function useTheme(options?: UseThemeOptions): {
    theme: import("../js/theme-registry.js").ThemeName;
    updateTheme: (next: Theme) => void;
    saveFailed: boolean;
    storageFailed: boolean;
};
/** @param {UseThemeOptions} [options] */
export declare function useAppearance(options?: UseThemeOptions): {
    appearance: import("../js/theme-registry.js").ThemeName;
    updateAppearance: (next: Theme) => void;
};
