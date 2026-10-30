export type DateFormat = import('../locale.js').DateFormat;
/**
 * The order and separator a locale writes a numeric date in, read from
 * Intl once rather than assumed. `parts` is e.g. ['day','month','year'].
 * `format` is `'locale'` (what Intl says; the default of this function) or
 * `'rule52'` (dd/mm/yyyy whatever the locale, Kenny's rule 52).
 *
 * @param {string | undefined} [locale]
 * @param {DateFormat} [format]
 * @returns {{ parts: ('day' | 'month' | 'year')[], separator: string, hint: string }}
 */
export declare function datePattern(locale?: string | undefined, format?: DateFormat): {
    parts: ('day' | 'month' | 'year')[];
    separator: string;
    hint: string;
};
/**
 * A date as the locale writes it: numeric, two-digit day and month; with
 * `format` `'rule52'`, dd/mm/yyyy in Latin digits whatever the locale.
 *
 * @param {Date} date
 * @param {string | undefined} [locale]
 * @param {DateFormat} [format]
 * @returns {string}
 */
export declare function formatDate(date: Date, locale?: string | undefined, format?: DateFormat): string;
/**
 * Read what a person typed, in their locale's order — plus ISO, which
 * everyone accepts. Returns null for anything that is not a real date:
 * "31-02-2026" is refused rather than rounded to 3 March.
 *
 * @param {string} text
 * @param {string | undefined} [locale]
 * @param {DateFormat} [format]
 * @returns {Date | null}
 */
export declare function parseDate(text: string, locale?: string | undefined, format?: DateFormat): Date | null;
