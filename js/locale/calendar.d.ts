export type NameSet = {
    months: string[];
    weekdays: string[];
    monthsShort?: string[];
};
/**
 * The month and weekday names a calendar shows, in the locale it is drawn
 * for [gap-11].
 *
 * The date picker wrote a Dutch date under an English month, because its
 * names came from the string dictionary and the dictionary is English.
 * Intl knows the names in every language the browser does, so a locale
 * that is not English reads them from Intl. The dictionary still decides
 * in two cases: when a consumer has set names of their own (their words
 * win, which is the way out [KT6]), and when the locale is English, where
 * the dictionary already is the answer — and where Intl's "Mon" would
 * quietly change the two-letter "Mo" every English page shows.
 *
 * The short month names fill the month grid [scope-89], where twelve full
 * names in three columns ran out of their cells in eleven themes
 * ("September", 83px of text in a 75px cell). They follow the same rule, and
 * a consumer who set full names of their own but no short ones sees their
 * full names there rather than the package's English abbreviations.
 *
 * @param {NameSet} dictionary the strings in force; weekdays Monday first
 * @param {NameSet} defaults the package's own dictionary, to tell a consumer's names from it
 * @param {string | undefined} [locale]
 * @returns {{ months: string[], monthsShort: string[], weekdays: string[] }} weekdays Sunday first, the way Date#getDay counts
 */
export declare function calendarNames(dictionary: NameSet, defaults: NameSet, locale?: string | undefined): {
    months: string[];
    monthsShort: string[];
    weekdays: string[];
};
