import { useCallback, useEffect, useState, useSyncExternalStore } from 'react';

// ONE source of truth for the theme list on the client. Adding a theme
// here (plus its CSS block in css/themes.css) is the whole client-side
// job: the switcher, previews and showcases all derive from this record.
// The swatch colours mirror the theme's own --background / --foreground
// / --primary so pickers can preview a theme without activating it.
export const THEME_META = Object.freeze({
    formal: { label: 'Formeel', dark: false, bg: 'hsl(40,25%,97%)', fg: 'hsl(220,30%,13%)', primary: 'hsl(218,45%,24%)' },
    light: { label: 'Licht', dark: false, bg: 'hsl(0,0%,100%)', fg: 'hsl(224,25%,12%)', primary: 'hsl(243,60%,45%)' },
    dark: { label: 'Donker', dark: true, bg: 'hsl(226,22%,8%)', fg: 'hsl(220,20%,93%)', primary: 'hsl(255,85%,74%)' },
    cyberpunk: { label: 'Cyberpunk', dark: true, bg: 'hsl(258,40%,6%)', fg: 'hsl(190,60%,92%)', primary: 'hsl(315,95%,64%)' },
    pastel: { label: 'Pastel', dark: false, bg: 'hsl(285,45%,97%)', fg: 'hsl(285,25%,20%)', primary: 'hsl(330,55%,42%)' },
    terminal: { label: 'Terminal', dark: true, bg: 'hsl(120,10%,5%)', fg: 'hsl(120,85%,68%)', primary: 'hsl(120,90%,50%)' },
    topo: { label: 'Topografisch', dark: false, bg: 'hsl(42,32%,95%)', fg: 'hsl(160,28%,14%)', primary: 'hsl(158,42%,24%)' },
});

/** @typedef {keyof typeof THEME_META} Theme */

/** @type {Theme[]} */
export const THEMES = /** @type {Theme[]} */ (Object.keys(THEME_META));

/** @type {Theme} */
export const DEFAULT_THEME = 'formal';

/** localStorage key holding the visitor's last choice. */
export const STORAGE_KEY = 'theme';

/** @type {Record<Theme, string>} */
export const THEME_LABELS = /** @type {Record<Theme, string>} */ (Object.fromEntries(THEMES.map((t) => [t, THEME_META[t].label])));

/** @type {Theme[]} */
const DARK_THEMES = THEMES.filter((t) => THEME_META[t].dark);

/**
 * @param {unknown} value
 * @returns {value is Theme}
 */
export const isTheme = (value) => THEMES.includes(/** @type {Theme} */ (value));

/**
 * @param {string | null | undefined} value
 * @returns {Theme | null}
 */
const asTheme = (value) => (isTheme(value) ? value : null);

/** @returns {string | null} */
function readStored() {
    try {
        return localStorage.getItem(STORAGE_KEY);
    } catch {
        return null;
    }
}

/** @param {Theme} theme */
function writeStored(theme) {
    try {
        localStorage.setItem(STORAGE_KEY, theme);
    } catch {
        // Private mode / blocked storage: the DOM still carries the theme.
    }
}

// Tiny external store so every useTheme() instance (switcher, fx
// components, previews) sees the same current theme without a provider.
/** @type {Set<() => void>} */
const listeners = new Set();
/** @type {Theme | null} */
let current = null;

/** @param {() => void} listener */
function subscribe(listener) {
    listeners.add(listener);
    return () => {
        listeners.delete(listener);
    };
}

/** @returns {Theme} */
function getSnapshot() {
    if (current) return current;
    if (typeof document !== 'undefined') {
        const fromDom = asTheme(document.documentElement.dataset.theme);
        if (fromDom) return fromDom;
    }
    return DEFAULT_THEME;
}

/** @returns {Theme} */
const getServerSnapshot = () => DEFAULT_THEME;

/**
 * Put a theme on <html>: data-theme carries the token block, the .dark
 * class keeps existing `dark:` variants working for the dark-ish themes.
 * @param {Theme} theme
 */
export function applyTheme(theme) {
    const root = document.documentElement;
    root.dataset.theme = theme;
    root.classList.toggle('dark', DARK_THEMES.includes(theme));
    if (current !== theme) {
        current = theme;
        for (const listener of listeners) listener();
    }
}

/**
 * Before React mounts: last known choice, so there is no theme flash.
 * @param {Theme} [fallback]
 */
export function initializeTheme(fallback = DEFAULT_THEME) {
    applyTheme(asTheme(readStored()) ?? fallback);
}

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
        () => asTheme(preferred) ?? asTheme(readStored()) ?? asTheme(fallback) ?? DEFAULT_THEME,
        [preferred, fallback],
    );

    const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

    useEffect(() => {
        applyTheme(resolve());
    }, [resolve]);

    const [saveFailed, setSaveFailed] = useState(false);

    /** @param {Theme} next */
    const updateTheme = (next) => {
        const previous = theme;
        applyTheme(next);
        writeStored(next);
        setSaveFailed(false);

        if (!onChange) return;

        // If the consumer's persistence is refused the preview must not
        // stand: showing the new theme while the server kept the old one
        // is the "endpoint that lies" pattern.
        const revert = () => {
            applyTheme(previous);
            writeStored(previous);
            setSaveFailed(true);
        };
        try {
            const result = onChange(next, previous);
            if (result && typeof (/** @type {Promise<unknown>} */ (result).then) === 'function') {
                /** @type {Promise<unknown>} */ (result).then(undefined, revert);
            }
        } catch {
            revert();
        }
    };

    return { theme, updateTheme, saveFailed };
}

// Compatibility shim for components still importing useAppearance.
/** @param {UseThemeOptions} [options] */
export function useAppearance(options) {
    const { theme, updateTheme } = useTheme(options);
    return { appearance: theme, updateAppearance: updateTheme };
}
