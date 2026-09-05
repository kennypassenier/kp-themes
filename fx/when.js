// Where an effect is allowed to run [KT6].
//
// Every effect used to test `theme === 'cyberpunk'` and nothing else,
// so a consumer who wanted a deciphering heading in their own theme
// could not have one. `when` is the prop: a theme name, a list of them,
// a boolean, or a function of the current theme. The default stays
// cyberpunk, because that is what these were drawn for; the decision is
// the consumer's now.

/** @typedef {boolean | string | string[] | ((theme: string) => boolean)} When */

/**
 * @param {When} when
 * @param {string} theme the current theme name
 * @returns {boolean}
 */
export function effectActive(when, theme) {
    if (typeof when === 'boolean') return when;
    if (typeof when === 'function') return when(theme);
    if (Array.isArray(when)) return when.includes(theme);
    return when === theme;
}
