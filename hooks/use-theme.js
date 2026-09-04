import { useCallback, useEffect, useState, useSyncExternalStore } from 'react';
import {
    applyTheme,
    currentTheme,
    initializeTheme,
    isTheme,
    onThemeChange,
    storedTheme,
    storeTheme,
    DEFAULT_THEME,
    STORAGE_KEY,
    THEMES as THEME_RECORDS,
} from '../js/theme-core.js';

// The React channel, sitting on the shared core rather than beside it.
//
// This file used to own the theme: its own subscriber list in module
// state, and each theme's background, foreground and primary colour as
// text — 21 values duplicating css/themes.css. Both are gone. The state
// lives in the document so a plain <script> can see it too [AR5], and the
// swatch reads the live custom properties instead of a copy [AR11].
//
// What is left here is React's half: a store subscription, the precedence
// rules, and the revert-on-failed-save behaviour.

export { applyTheme, initializeTheme, isTheme, DEFAULT_THEME, STORAGE_KEY };

/** The generated theme record: name, label, dark. Source: themes/*\/tokens.json. */
export { THEME_RECORDS };

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
export const THEMES = THEME_RECORDS.map((t) => t.name);

/**
 * Complete by construction — it is built from the same generated records
 * the union comes from — but `Object.fromEntries` cannot say so, so the
 * assertion is written down here rather than by weakening the type a
 * consumer reads.
 *
 * @type {Record<Theme, string>}
 */
export const THEME_LABELS = /** @type {Record<Theme, string>} */ (Object.fromEntries(THEME_RECORDS.map((t) => [t.name, t.label])));

/** @param {string|null|undefined} value */
const asTheme = (value) => (isTheme(value) ? value : null);

/** @returns {Theme} */
const getServerSnapshot = () => DEFAULT_THEME;

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
export function useTheme(options = {}) {
    const { preferred = null, fallback = null, onChange } = options;

    const resolve = useCallback(
        /** @returns {Theme} */
        () => asTheme(preferred) ?? storedTheme() ?? asTheme(fallback) ?? DEFAULT_THEME,
        [preferred, fallback],
    );

    const theme = useSyncExternalStore(onThemeChange, currentTheme, getServerSnapshot);

    useEffect(() => {
        applyTheme(resolve());
    }, [resolve]);

    const [saveFailed, setSaveFailed] = useState(false);
    // Two different failures, told apart because their remedies differ:
    // the browser refusing storage is the visitor's own setting, a
    // rejected onChange is the consumer's server [AR6].
    const [storageFailed, setStorageFailed] = useState(false);

    /** @param {Theme} next */
    const updateTheme = (next) => {
        const previous = theme;
        const applied = applyTheme(next);
        setStorageFailed(!storeTheme(applied));
        setSaveFailed(false);

        if (!onChange) return;

        // If the consumer's persistence is refused the preview must not
        // stand: showing the new theme while the server kept the old one
        // is the "endpoint that lies" pattern.
        const revert = () => {
            applyTheme(previous);
            storeTheme(previous);
            setSaveFailed(true);
        };
        try {
            const result = onChange(applied, previous);
            if (result && typeof (/** @type {Promise<unknown>} */ (result).then) === 'function') {
                /** @type {Promise<unknown>} */ (result).then(undefined, revert);
            }
        } catch {
            revert();
        }
    };

    return { theme, updateTheme, saveFailed, storageFailed };
}

// Compatibility shim for components still importing useAppearance.
/** @param {UseThemeOptions} [options] */
export function useAppearance(options) {
    const { theme, updateTheme } = useTheme(options);
    return { appearance: theme, updateAppearance: updateTheme };
}
