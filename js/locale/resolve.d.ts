/** The locale of last resort: no explicit one, no `lang` above the element, no browser language. */
export declare const FALLBACK_LOCALE = "en-GB";
/** The first day of the week when nothing says otherwise: Monday, as most of the world's calendars agree. */
export declare const DEFAULT_WEEK_START = 1;
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
 * A collator for sorting text as the locale sorts it.
 *
 * @param {string | undefined} [locale]
 * @returns {Intl.Collator}
 */
export declare function collator(locale?: string | undefined): Intl.Collator;
