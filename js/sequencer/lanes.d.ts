export type SequencerItem = import('./units.js').SequencerItem;
export type SequencerLane = import('./units.js').SequencerLane;
export type SequencerModel = import('./instance.js').SequencerModel;
/** @typedef {import('./units.js').SequencerItem} SequencerItem */
/** @typedef {import('./units.js').SequencerLane} SequencerLane */
/** @typedef {import('./instance.js').SequencerModel} SequencerModel */
/** @param {SequencerModel} c @param {SequencerItem} item */
export declare function seriesOf(c: SequencerModel, item: SequencerItem): 1 | 2 | 3 | 4 | 5;
/** The lanes the page gave, plus a lane for every item's lane that none names. @param {SequencerModel} c @param {SequencerLane[]} given */
export declare function lanesFor(c: SequencerModel, given: SequencerLane[]): import("./units.js").SequencerLane[];
/** Draw the lanes (names and tracks) when they changed. @param {SequencerModel} c */
export declare function paintLanes(c: SequencerModel): void;
/** Where each lane starts, in px from the top of the bars' layer. @param {SequencerModel} c */
export declare function measureLanes(c: SequencerModel): void;
/** @param {HTMLElement} el @param {string} name @param {string} value */
export declare function setProp(el: HTMLElement, name: string, value: string): void;
/** The place of one bar: custom properties only. @param {SequencerModel} c @param {HTMLElement} el @param {SequencerItem} item @param {number} row */
export declare function place(c: SequencerModel, el: HTMLElement, item: SequencerItem, row: number): void;
