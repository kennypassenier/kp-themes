export type SequencerModel = import('./instance.js').SequencerModel;
/** @typedef {import('./instance.js').SequencerModel} SequencerModel */
/** @param {SequencerModel} c @param {string} id */
export declare function focusItem(c: SequencerModel, id: string): void;
/** @param {SequencerModel} c @param {KeyboardEvent} e */
export declare function onKey(c: SequencerModel, e: KeyboardEvent): void;
