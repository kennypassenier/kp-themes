import { useCallback, useEffect, useState, useSyncExternalStore } from 'react';
import {
    applyTheme,
    currentTheme,
    initializeTheme,
    isTheme,
    onThemeChange,
    storedTheme,
    storeTheme,
    configureTheme,
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
//
// Since 3.0.0 [KT6]: persisting is optional, the apply can wait for the
// consumer's server instead of going first, a failed save reports the
// error rather than only a flag, and the root, the dark class and the
// storage key are options.

export { applyTheme, initializeTheme, isTheme, configureTheme, DEFAULT_THEME, STORAGE_KEY };

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
 *   Called on a change. Persist server-side here. A thrown error or a rejected promise reverts the
 *   change (the "endpoint that lies" guard) and sets `saveFailed`.
 * @property {(error: unknown, attempted: Theme) => void} [onError]  The reason a save failed, when there is one.
 * @property {boolean} [persist]     Write the choice to storage. Default true.
 * @property {boolean} [optimistic]  Apply before `onChange` resolves. Default true; false waits for the server.
 * @property {boolean} [crossTab]    Follow a choice made in another tab. Default true.
 * @property {Element} [root]        The element that wears the theme. Default: the document element.
 * @property {string | null} [darkClass]  Default 'dark'; null for none.
 * @property {string} [storageKey]
 */

/**
 * Precedence: `preferred` (server-saved) > localStorage (guest's choice) > `fallback` > 'formal'.
 * @param {UseThemeOptions} [options]
 */
export function useTheme(options = {}) {
    const {
        preferred = null,
        fallback = null,
        onChange,
        onError,
        persist = true,
        optimistic = true,
        crossTab = true,
        root,
        darkClass,
        storageKey,
    } = options;
    const where = { root, key: storageKey };

    const resolve = useCallback(
        /** @returns {Theme} */
        () => asTheme(preferred) ?? storedTheme({ key: storageKey }) ?? asTheme(fallback) ?? DEFAULT_THEME,
        [preferred, fallback, storageKey],
    );

    const subscribe = useCallback(
        /** @param {() => void} listener */
        (listener) => onThemeChange(listener, { crossTab, root, key: storageKey }),
        [crossTab, root, storageKey],
    );
    const snapshot = useCallback(() => currentTheme({ root }), [root]);
    const theme = useSyncExternalStore(subscribe, snapshot, getServerSnapshot);

    useEffect(() => {
        applyTheme(resolve(), { root, darkClass });
    }, [resolve, root, darkClass]);

    const [saveFailed, setSaveFailed] = useState(false);
    const [pending, setPending] = useState(false);
    // Two different failures, told apart because their remedies differ:
    // the browser refusing storage is the visitor's own setting, a
    // rejected onChange is the consumer's server [AR6].
    const [storageFailed, setStorageFailed] = useState(false);

    /** @param {Theme} next */
    const commit = (next) => {
        const applied = applyTheme(next, { root, darkClass });
        if (persist) setStorageFailed(!storeTheme(applied, { key: storageKey }));
        return applied;
    };

    /** @param {Theme} next */
    const updateTheme = (next) => {
        const previous = theme;
        setSaveFailed(false);

        if (!onChange) {
            commit(next);
            return;
        }

        // Optimistic: the preview stands unless the consumer's persistence
        // is refused — showing the new theme while the server kept the old
        // one is the "endpoint that lies" pattern, so a rejection reverts.
        // Not optimistic: nothing changes until the server agreed.
        const applied = optimistic ? commit(next) : (asTheme(next) ?? DEFAULT_THEME);
        /** @param {unknown} error */
        const failed = (error) => {
            if (optimistic) {
                applyTheme(previous, { root, darkClass });
                if (persist) storeTheme(previous, { key: storageKey });
            }
            setSaveFailed(true);
            setPending(false);
            onError?.(error, applied);
        };
        try {
            const result = onChange(applied, previous);
            if (result && typeof (/** @type {Promise<unknown>} */ (result).then) === 'function') {
                setPending(true);
                /** @type {Promise<unknown>} */ (result).then(() => {
                    if (!optimistic) commit(next);
                    setPending(false);
                }, failed);
            } else if (!optimistic) commit(next);
        } catch (error) {
            failed(error);
        }
    };

    return { theme, updateTheme, saveFailed, storageFailed, pending, where };
}

// Compatibility shim for components still importing useAppearance.
/** @param {UseThemeOptions} [options] */
export function useAppearance(options) {
    const { theme, updateTheme } = useTheme(options);
    return { appearance: theme, updateAppearance: updateTheme };
}
