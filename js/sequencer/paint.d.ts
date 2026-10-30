export type SequencerItem = import('./units.js').SequencerItem;
export type SequencerModel = import('./instance.js').SequencerModel;
/** @typedef {import('./units.js').SequencerItem} SequencerItem */
/** @typedef {import('./instance.js').SequencerModel} SequencerModel */
/** The window, the zoom, the total, the line for now. @param {SequencerModel} c @param {SequencerItem[]} list @param {boolean} fit refit the window to the plan */
export declare function paintWindow(c: SequencerModel, list: SequencerItem[], fit: boolean): void;
/** The selection line and its buttons. @param {SequencerModel} c */
export declare function paintSelection(c: SequencerModel): void;
/** Draw everything from the committed items. @param {SequencerModel} c @param {{ fit?: boolean }} [how] */
export declare function paint(c: SequencerModel, { fit }?: {
    fit?: boolean;
}): void;
