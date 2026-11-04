export type SequencerItem = import('./units.js').SequencerItem;
export type SequencerModel = import('./instance.js').SequencerModel;
/** @typedef {import('./units.js').SequencerItem} SequencerItem */
/** @typedef {import('./instance.js').SequencerModel} SequencerModel */
/** The window, the zoom, the total, the line for now. @param {SequencerModel} c @param {SequencerItem[]} list @param {boolean} fit refit the window to the plan */
export declare function paintWindow(c: SequencerModel, list: SequencerItem[], fit: boolean): void;
/** The selection line and its buttons. @param {SequencerModel} c */
export declare function paintSelection(c: SequencerModel): void;
/**
 * Draw everything from the committed items. While the sequencer is opening with `data-kp-sequencer-paint="once"` the request is
 * only noted: the attach, the page's items and its state then paint once, in the first resize callback, instead of four times.
 * @param {SequencerModel} c @param {{ fit?: boolean }} [how]
 */
export declare function paint(c: SequencerModel, { fit }?: {
    fit?: boolean;
}): void;
/** Start collecting paints until the first layout has happened (see `paint`); a frame pair later is the fallback for a hidden host. @param {SequencerModel} c */
export declare function beginOpening(c: SequencerModel): void;
/** Paint what was collected, now. Safe to call when nothing waits. @param {SequencerModel} c */
export declare function flushOpening(c: SequencerModel): void;
