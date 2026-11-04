export type SequencerItem = import('./units.js').SequencerItem;
export type SequencerModel = import('./instance.js').SequencerModel;
/** @typedef {import('./units.js').SequencerItem} SequencerItem */
/** @typedef {import('./instance.js').SequencerModel} SequencerModel */
/** Bars by id: made when new, removed when gone, never rebuilt. @param {SequencerModel} c @param {SequencerItem[]} list */
export declare function syncBars(c: SequencerModel, list: SequencerItem[]): void;
/** The joins: a line from every item down or up to the partner it starts with. @param {SequencerModel} c @param {SequencerItem[]} list */
export declare function syncJoins(c: SequencerModel, list: SequencerItem[]): void;
/** Axis ticks and the rules under them. @param {SequencerModel} c @param {number} [width] the plot's width when the caller already read it */
export declare function syncTicks(c: SequencerModel, width?: number): void;
export type NameSize = {
    high: number;
    scroll: number;
    client: number;
    need: number;
};
export type NameRead = {
    width: number;
    pad: number;
    barPx: number;
    sizes: Map<string, NameSize>;
};
/** @typedef {{ width: number, pad: number, barPx: number, sizes: Map<string, NameSize> }} NameRead */
/**
 * Everything placeLabels needs from the page, read in one go: the plot's width, the bar's padding and height, and every name's
 * size. Reads only the page (the probes live in a contained box), so a paint can do it before it writes a bar and pay for one
 * layout, not one per step. Null when the plot has no width (hidden). @param {SequencerModel} c @returns {NameRead | null}
 */
export declare function readNames(c: SequencerModel): NameRead | null;
/**
 * A name that does not fit its bar (wrapped on at most the lines the bar is tall for) stands outside it: after it when the row has
 * room, else before it, else it is left to the bar's name (its label). Never cut with an ellipsis. @param {SequencerModel} c
 * @param {NameRead | null} [read] what readNames returned, when the caller read before it wrote
 */
export declare function placeLabels(c: SequencerModel, read?: NameRead | null): void;
