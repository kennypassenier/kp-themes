/**
 * "Mon and Thu", "Mon, Wed and Fri": a list in words.
 * @param {readonly string[]} items
 * @param {string} [and]
 */
export declare function joinWords(items: readonly string[], and?: string): string;
/**
 * The picked days in words, in the order a week reads from `firstDay`. Pure.
 * @param {readonly number[]} days 0 to 6
 * @param {{ firstDay?: number, names?: readonly string[] }} [options] `names` are Sunday first
 * @returns {string}
 */
export declare function weekdaySummary(days: readonly number[], { firstDay, names }?: {
    firstDay?: number;
    names?: readonly string[];
}): string;
/**
 * The picked days of a month in words: "On the 1st and 15th", "On the last day".
 * @param {readonly (number | 'last')[]} days
 * @returns {string}
 */
export declare function monthSummary(days: readonly (number | 'last')[]): string;
