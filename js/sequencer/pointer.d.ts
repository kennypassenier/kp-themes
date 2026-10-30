export type SequencerItem = import('./units.js').SequencerItem;
export type SequencerModel = import('./instance.js').SequencerModel;
/** @typedef {import('./units.js').SequencerItem} SequencerItem */
/** @typedef {import('./instance.js').SequencerModel} SequencerModel */
/** @param {SequencerModel} c @param {PointerEvent} e */
export declare function onDown(c: SequencerModel, e: PointerEvent): void;
/** @param {SequencerModel} c @param {PointerEvent} e */
export declare function onMove(c: SequencerModel, e: PointerEvent): void;
/** @param {SequencerModel} c @param {PointerEvent} e */
export declare function onUp(c: SequencerModel, e: PointerEvent): void;
/** @param {SequencerModel} c @param {PointerEvent} e */
export declare function onCancel(c: SequencerModel, e: PointerEvent): void;
