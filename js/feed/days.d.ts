/**
 * The rows in runs of one day (or one run, ungrouped), newest first as given.
 * @param {import('./constants.js').FeedRow[]} rows @param {boolean} grouped @param {string} zone
 */
export declare function groupByDay(rows: import('./constants.js').FeedRow[], grouped: boolean, zone: string): {
    key: string;
    at: number;
    rows: import('./constants.js').FeedRow[];
}[];
/**
 * The day groups of the list, one `li` per day.
 * @param {import('./controller.js').FeedController} c
 * @param {import('./constants.js').FeedRow[]} rows
 * @param {boolean} grouped
 */
export declare function dayGroups(c: import('./controller.js').FeedController, rows: import('./constants.js').FeedRow[], grouped: boolean): HTMLElement[];
