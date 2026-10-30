export type SequencerEdit = import('./units.js').SequencerEdit;
export type SequencerItem = import('./units.js').SequencerItem;
export type SequencerModel = import('./instance.js').SequencerModel;
/** One step of a pointer drag. @param {SequencerModel} c @param {PointerEvent} e */
export declare function dragTo(c: SequencerModel, e: PointerEvent): void;
/** Put an edit in progress back. @param {SequencerModel} c @param {string} why */
export declare function cancelEdit(c: SequencerModel, why: string): void;
/** Start choosing a partner for `id`. @param {SequencerModel} c @param {string} id */
export declare function startLink(c: SequencerModel, id: string): void;
/** @param {SequencerModel} c */
export declare function stopLink(c: SequencerModel): void;
/** Make the linking item run alongside `partner`. @param {SequencerModel} c @param {string} partner */
export declare function finishLink(c: SequencerModel, partner: string): void;
/** @param {SequencerModel} c @param {string} id */
export declare function unlink(c: SequencerModel, id: string): void;
/** Move the focus between items with the arrows. @param {SequencerModel} c @param {string} id @param {KeyboardEvent} e @returns {boolean} */
export declare function navigate(c: SequencerModel, id: string, e: KeyboardEvent): boolean;
