/**
 * The locale to use: the explicit one; else the nearest `lang` attribute
 * above the element, because a document that declares its language has
 * already answered; else the browser's.
 *
 * @param {string | undefined} [explicit]
 * @param {Element | null} [element] where to look for `lang`
 * @returns {string}
 */
export declare function resolveLocale(explicit?: string | undefined, element?: Element | null): string;
/**
 * The day the week starts on, 0 = Sunday … 6 = Saturday.
 *
 * Intl.Locale's week info where the browser has it (Chrome and Safari
 * do, Firefox is arriving); Monday where it does not, because most of
 * the world's calendars agree and the ones that do not are the ones
 * whose browsers ship the API.
 *
 * @param {string | undefined} [locale]
 * @param {number | undefined} [explicit] a consumer's own answer wins
 * @returns {number}
 */
export declare function weekStartsOn(locale?: string | undefined, explicit?: number | undefined): number;
/**
 * The order and separator a locale writes a numeric date in, read from
 * Intl once rather than assumed. `parts` is e.g. ['day','month','year'].
 *
 * @param {string | undefined} [locale]
 * @returns {{ parts: ('day' | 'month' | 'year')[], separator: string, hint: string }}
 */
export declare function datePattern(locale?: string | undefined): {
    parts: ('day' | 'month' | 'year')[];
    separator: string;
    hint: string;
};
/**
 * A date as the locale writes it: numeric, two-digit day and month.
 *
 * @param {Date} date
 * @param {string | undefined} [locale]
 * @returns {string}
 */
export declare function formatDate(date: Date, locale?: string | undefined): string;
/**
 * Read what a person typed, in their locale's order — plus ISO, which
 * everyone accepts. Returns null for anything that is not a real date:
 * "31-02-2026" is refused rather than rounded to 3 March.
 *
 * @param {string} text
 * @param {string | undefined} [locale]
 * @returns {Date | null}
 */
export declare function parseDate(text: string, locale?: string | undefined): Date | null;
/**
 * A byte count as the locale writes numbers: "1,5 MB" in Dutch, "1.5 MB"
 * in English. Base 1000 with SI units, because a person reading a file
 * size is not counting sectors.
 *
 * @param {number} bytes
 * @param {string | undefined} [locale]
 * @param {{ base?: 1000 | 1024, units?: string[] }} [options]
 * @returns {string}
 */
export declare function formatBytes(bytes: number, locale?: string | undefined, { base, units }?: {
    base?: 1000 | 1024;
    units?: string[];
}): string;
/**
 * Read a number the way the locale writes it: "1.284,50" in Dutch,
 * "1,284.50" in English. Intl tells us which glyph is the decimal.
 *
 * @param {string} text
 * @param {string | undefined} [locale]
 * @returns {number}
 */
export declare function parseNumber(text: string, locale?: string | undefined): number;
/**
 * A collator for sorting text as the locale sorts it.
 *
 * @param {string | undefined} [locale]
 * @returns {Intl.Collator}
 */
export declare function collator(locale?: string | undefined): Intl.Collator;
