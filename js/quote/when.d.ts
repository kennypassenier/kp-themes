/**
 * The date line: "Tuesday 14/10/2026", "3 days ago" or both (rule 52). Pure.
 * @param {number} ms the moment
 * @param {'date' | 'relative' | 'both'} style
 * @param {number} [now]
 * @param {string} [locale]
 */
export declare function quoteWhen(ms: number, style?: 'date' | 'relative' | 'both', now?: number, locale?: string): string;
