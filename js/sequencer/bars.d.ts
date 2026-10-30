export type SequencerItem = import('./units.js').SequencerItem;
export type SequencerModel = import('./instance.js').SequencerModel;
/** @typedef {import('./units.js').SequencerItem} SequencerItem */
/** @typedef {import('./instance.js').SequencerModel} SequencerModel */
/** Bars by id: made when new, removed when gone, never rebuilt. @param {SequencerModel} c @param {SequencerItem[]} list */
export declare function syncBars(c: SequencerModel, list: SequencerItem[]): void;
/** The joins: a line from every item down or up to the partner it starts with. @param {SequencerModel} c @param {SequencerItem[]} list */
export declare function syncJoins(c: SequencerModel, list: SequencerItem[]): void;
/** Axis ticks and the rules under them. @param {SequencerModel} c */
export declare function syncTicks(c: SequencerModel): void;
/**
 * A name that does not fit its bar (wrapped on at most the lines the bar is tall for) stands outside it: after it when the row has
 * room, else before it, else it is left to the bar's name (its label). Never cut with an ellipsis. @param {SequencerModel} c
 */
export declare function placeLabels(c: SequencerModel): void;
