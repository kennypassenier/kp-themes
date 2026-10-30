export type WeekItem = import('./types.js').WeekItem;
export type WeekModel = import('./types.js').WeekModel;
/** @typedef {import('./types.js').WeekItem} WeekItem */
/** @typedef {import('./types.js').WeekModel} WeekModel */
/** Grid or list, as the container query has it now. @param {WeekModel} c @returns {'grid' | 'list'} */
export declare const modeOf: (c: WeekModel) => 'grid' | 'list';
/** Whether the agenda shows its upcoming list now: asked for, and in rows. @param {WeekModel} c */
export declare const upcomingOn: (c: WeekModel) => boolean;
/**
 * The next `n` items from now, in time order, of every day of the range.
 * @param {WeekModel} c @param {number} now
 * @returns {WeekItem[]}
 */
export declare function upcomingItems(c: WeekModel, now: number): WeekItem[];
/**
 * Fill the upcoming list: a row per item, the day named on the first row of each day, the item's own pill. Rows are kept
 * by id and moved only when the order changed, so a focused pill keeps its focus.
 * @param {WeekModel} c @param {WeekItem[]} items
 */
export declare function paintUpcoming(c: WeekModel, items: WeekItem[]): void;
