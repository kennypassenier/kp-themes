// A consumer, as small as it can be and still prove something [KT4].
//
// This file is never run. It is type-checked with a consumer's settings —
// NodeNext, checkJs, strict, noUncheckedIndexedAccess — which is the one
// thing the package's own type gate cannot do, because that gate checks
// our sources with our resolution.
//
// It uses exactly what JobTracker and kp-soft use, plus the two the
// framework-free consumers use. Adding more here is cheap; the point is
// that every import below resolved to a declaration rather than to `any`.

import { applyTheme, initializeTheme, isTheme, useTheme, THEME_LABELS } from '@kp-soft/themes';
import { THEMES, DEFAULT_THEME, STORAGE_KEY } from '@kp-soft/themes/js/registry';
import { currentTheme, onThemeChange, storeTheme, THEME_EVENT } from '@kp-soft/themes/js/core';
import { attachThemePickers, themeMenuMarkup } from '@kp-soft/themes/js/picker';

/** @typedef {import('@kp-soft/themes').Theme} Theme */

/**
 * The narrowing a consumer actually does: a string out of config or a
 * database, checked before it is used. Both JobTracker and kp-soft do
 * exactly this, which is why `isTheme` has to keep narrowing.
 *
 * @param {string} fromConfig
 * @returns {Theme}
 */
export function chosen(fromConfig) {
    return isTheme(fromConfig) ? fromConfig : DEFAULT_THEME;
}

/** A theme name that does not exist must not type-check. @returns {Theme} */
export function fixed() {
    // If this line ever compiles as `'formeel'`, the union has gone back
    // to `string` and the type promises nothing again.
    return 'formal';
}

/** The label map is complete: every theme name indexes it. @returns {string} */
export function labelOf(/** @type {Theme} */ theme) {
    return THEME_LABELS[theme];
}

/** Indexing an array under noUncheckedIndexedAccess needs the guard. @returns {string} */
export function firstLabel() {
    const first = THEMES[0];
    return first === undefined ? DEFAULT_THEME : first.label;
}

/** The document-owned state, the way the framework-free channel uses it. */
export function wire() {
    const now = currentTheme();
    const applied = applyTheme(now);
    const started = initializeTheme();
    const saved = storeTheme(applied);
    const stop = onThemeChange((theme) => {
        // `theme` must arrive typed, not as `any`: that was the symptom
        // JobTracker reported as TS7006 on every callback parameter.
        document.documentElement.dataset.was = theme;
    });
    document.addEventListener(THEME_EVENT, () => {});
    attachThemePickers();
    const markup = themeMenuMarkup({ id: 'menu', label: 'Thema' });
    return { now, applied, started, saved, stop, markup, key: STORAGE_KEY };
}

/** The React surface JobTracker uses. */
export function reactSurface() {
    const { theme, updateTheme, saveFailed, storageFailed } = useTheme();
    return { theme, updateTheme, saveFailed, storageFailed };
}
