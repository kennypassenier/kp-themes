export type SequencerItem = import('./units.js').SequencerItem;
export type SequencerLane = import('./units.js').SequencerLane;
export type SequencerModel = import('./instance.js').SequencerModel;
export type SequencerPlan = import('./units.js').SequencerPlan;
/** @typedef {import('./units.js').SequencerItem} SequencerItem */
/** @typedef {import('./units.js').SequencerLane} SequencerLane */
/** @typedef {import('./instance.js').SequencerModel} SequencerModel */
/** @typedef {import('./units.js').SequencerPlan} SequencerPlan */
/**
 * Draw a draft while an edit is in progress: the moved bars by custom properties, nothing rebuilt, the window as it is.
 * @param {SequencerModel} c @param {SequencerItem[]} list @param {string[]} ids the bars that may have moved
 * @param {boolean} [refit]
 */
export declare function drawDraft(c: SequencerModel, list: SequencerItem[], ids: string[], refit?: boolean): void;
/** Put the committed items back on screen after an edit ended. @param {SequencerModel} c */
export declare function settleDraw(c: SequencerModel): void;
/** Drop an edit: commit `list` when it differs. @param {SequencerModel} c @param {SequencerItem[]} list @param {'pointer' | 'keyboard' | 'link'} source @returns {boolean} */
export declare function commit(c: SequencerModel, list: SequencerItem[], source: 'pointer' | 'keyboard' | 'link'): boolean;
/** A page's set that came during an edit is applied once the edit ended. @param {SequencerModel} c */
export declare function flushPending(c: SequencerModel): void;
/** @param {SequencerModel} c @param {Partial<SequencerItem>[]} raw @param {SequencerLane[] | undefined} lanes */
export declare function apply(c: SequencerModel, raw: Partial<SequencerItem>[], lanes: SequencerLane[] | undefined): void;
/** @param {SequencerModel} c @param {string | null} id */
export declare function select(c: SequencerModel, id: string | null): void;
/** Say why an edit did not happen. @param {SequencerModel} c @param {string} id @param {SequencerPlan} plan */
export declare function refuse(c: SequencerModel, id: string, plan: SequencerPlan): void;
/** The zoom, around the point of the plot under `anchorX` (client px), or the middle of what is seen. @param {SequencerModel} c @param {number} zoom @param {number} [anchorX] */
export declare function setZoom(c: SequencerModel, zoom: number, anchorX?: number): boolean;
/** What depends on the width: ticks, lane tops, outside labels, the zoom words. @param {SequencerModel} c */
export declare function afterLayout(c: SequencerModel): void;
/** The time under a client x. @param {SequencerModel} c @param {number} x */
export declare function unitAt(c: SequencerModel, x: number): number;
