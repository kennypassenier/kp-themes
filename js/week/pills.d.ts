export type WeekEvent = import('./types.js').WeekEvent;
export type WeekModel = import('./types.js').WeekModel;
/** @typedef {import('./types.js').WeekEvent} WeekEvent */
/** @typedef {import('./types.js').WeekModel} WeekModel */
/**
 * Where the pills of one column stand: each at its time of day, pushed down
 * until it clears the one above, and pulled back up where the stack would run
 * out of the bottom. Pure; every number is px of the column's height.
 *
 * @param {number[]} wants each pill's wanted top, as a share of the column (0 to 1), in time order
 * @param {number} height the column's height
 * @param {number} pill one pill's height
 * @param {number} [gap] the space kept between two pills
 * @returns {number[]} each pill's top
 */
export declare function stackPills(wants: number[], height: number, pill: number, gap?: number): number[];
/**
 * How many pills a column of `height` holds at one pill's height.
 * @param {number} height
 * @param {number} pill
 * @param {number} [gap]
 * @returns {number}
 */
export declare function pillCapacity(height: number, pill: number, gap?: number): number;
/** A pill for an item, kept by id. @param {WeekModel} c @param {WeekEvent} e */
export declare function pillFor(c: WeekModel, e: WeekEvent): HTMLButtonElement;
