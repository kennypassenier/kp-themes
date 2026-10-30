export type WeekDay = import('./types.js').WeekDay;
export type WeekItem = import('./types.js').WeekItem;
export type WeekModel = import('./types.js').WeekModel;
/** The `+N` of one column: a menu button listing what did not fit. @param {WeekModel} c @param {WeekDay} col @param {number} [top] */
export declare function foldMenu(c: WeekModel, col: WeekDay, top?: number): void;
/** The pills a person can reach, per column, in time order. @param {WeekModel} c @param {WeekDay} col */
export declare function reachable(c: WeekModel, col: WeekDay): HTMLElement[];
/** One tab stop: the active pill. @param {WeekModel} c */
export declare function syncTabStops(c: WeekModel): void;
/** @param {WeekModel} c @param {WeekItem} item @param {'pointer' | 'keyboard'} source */
export declare function open(c: WeekModel, item: WeekItem, source: 'pointer' | 'keyboard'): void;
/** Move the roving focus. @param {WeekModel} c @param {HTMLElement} to */
export declare function focusPill(c: WeekModel, to: HTMLElement): void;
