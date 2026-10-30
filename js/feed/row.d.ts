/**
 * One row of the feed.
 * @param {import('./controller.js').FeedController} c
 * @param {import('./constants.js').FeedRow} row @param {Map<string, number>} slots the colour slot of each actor @param {boolean} grouped
 */
export declare function rowItem(c: import('./controller.js').FeedController, row: import('./constants.js').FeedRow, slots: Map<string, number>, grouped: boolean): HTMLElement;
