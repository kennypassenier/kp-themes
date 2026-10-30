/**
 * A day as a number 0 to 6 (0 is Sunday): a number, a digit string, or a name ("mon", "Tuesday").
 * @param {unknown} value
 * @returns {number | null}
 */
export declare function dayNumber(value: unknown): number | null;
/**
 * The weekday names of a style, Sunday first (the way `Date#getDay` counts). English reads the dictionary,
 * which a consumer may replace; another language reads Intl, unless the consumer replaced the dictionary.
 * @param {'short' | 'narrow' | 'long'} style
 * @param {string} [locale]
 * @returns {string[]}
 */
export declare function dayNames(style: 'short' | 'narrow' | 'long', locale?: string): string[];
